import React, { useMemo } from 'react';
import { renderTajwidText } from '../utils/tajwidHighlighter';

export interface SynchronizedArabicTextProps {
  text: string;
  isPlaying?: boolean;
  progressPercent?: number; // 0 to 100
  currentTime?: number; // Exact audio playback time in seconds
  duration?: number; // Exact audio duration in seconds
  syncOffsetMs?: number; // User calibration offset in ms (-300 to +300ms)
  enableTajwid?: boolean;
  fontStyle?: 'indonesia' | 'amiri';
  fontSizeClass?: string;
  onWordClick?: (wordIndex: number, targetPercent: number) => void;
  showAyahEndMarker?: number;
  className?: string;
  allowWordSeek?: boolean;
}

interface TextToken {
  raw: string;
  cleanWord: string;
  isWord: boolean;
  wordIndex: number; // Index among spoken words (-1 if non-word like bullet/bracket)
  weight: number;
  startPct: number;
  endPct: number;
}

/**
 * Phonetic length calculator based on Tajwid & Tartil rules:
 * - Mad Thabi'i: 2 beats (dagger alif, waw/ya saghirah, fathah+alif, dhammah+waw, kasrah+ya)
 * - Mad Far'i (Maddah sign ~): 4 to 5 beats
 * - Ghunnah Musyaddadah on Nun (نّ) and Mim (مّ): 2 beats with nasal resonance
 * - Qolqolah sukun: distinct articulation bounce
 * - Short particles (e.g. "وَ", "فَ"): adjusted lighter weight
 * - Final Word Waqaf (Mad 'Aridh Lissukun): reciters hold the stopping word 1.8x longer
 */
function computePhoneticWeight(word: string, isLastWord: boolean): number {
  const clean = word.replace(/[^\u0600-\u06FF]/g, '');
  if (!clean) return 1.5;

  // Basic Arabic letters
  const baseLetters = (clean.match(/[\u0621-\u064A\u0671-\u06D3]/g) || []).length;
  // Harakat (fathah, kasrah, dhammah, sukun)
  const basicHarakat = (clean.match(/[\u064E\u064F\u0650\u0652]/g) || []).length;
  // Tanwin (fathatain, kasratain, dammatain)
  const tanwin = (clean.match(/[\u064B\u064C\u064D]/g) || []).length;

  // Ghunnah Musyaddadah: Shaddah on Nun or Mim (held 2 full beats)
  const ghunnahShaddah = (clean.match(/[نم]\u0651/g) || []).length;
  // Other shaddah doubling
  const regularShaddah = Math.max(0, (clean.match(/\u0651/g) || []).length - ghunnahShaddah);

  // Mad Thabi'i forms:
  // 1. Dagger alif \u0670, waw saghirah \u06E5, ya saghirah \u06E6
  const daggerAlif = (clean.match(/[\u0670\u06E5\u06E6]/g) || []).length;
  // 2. Standard orthographic long vowels (fathah+alif, kasrah+ya, dhammah+waw)
  const regularMadLetters = (clean.match(/\u064E[\u0627\u0649]|\u064F\u0648|\u0650\u064A/g) || []).length;

  // Maddah sign (~ \u0653 - Mad Wajib/Jaiz 4-5 harakat)
  const maddah = (clean.match(/\u0653/g) || []).length;

  // Qolqolah letters with sukun
  const qolqolah = (clean.match(/[قطبجد]\u0652/g) || []).length;

  let weight =
    baseLetters * 1.8 +
    basicHarakat * 0.4 +
    tanwin * 1.5 +
    ghunnahShaddah * 3.5 +
    regularShaddah * 1.8 +
    daggerAlif * 2.2 +
    regularMadLetters * 2.0 +
    maddah * 5.0 +
    qolqolah * 1.1;

  // Adjust short connector words (like "وَ", "فَ", "فِي", "مِنْ")
  if (baseLetters <= 2 && !ghunnahShaddah && !maddah) {
    weight = Math.max(1.8, weight * 0.9);
  } else {
    weight = Math.max(2.6, weight);
  }

  // Last word waqaf / stopping elongation (Mad 'Aridh Lissukun in Tartil recitation)
  if (isLastWord) {
    weight *= 1.85;
  }

  return weight;
}

export const SynchronizedArabicText: React.FC<SynchronizedArabicTextProps> = ({
  text,
  isPlaying = false,
  progressPercent = 0,
  currentTime,
  duration,
  syncOffsetMs,
  enableTajwid = true,
  fontStyle = 'indonesia',
  fontSizeClass = 'text-2xl sm:text-3xl lg:text-4xl',
  onWordClick,
  showAyahEndMarker,
  className = '',
  allowWordSeek = true,
}) => {
  // Retrieve saved sync offset if not explicitly provided
  const activeOffsetMs = useMemo(() => {
    if (syncOffsetMs !== undefined) return syncOffsetMs;
    try {
      const saved = localStorage.getItem('tarjih_audio_sync_offset_ms');
      if (saved !== null) {
        const val = parseInt(saved, 10);
        if (!isNaN(val)) return val;
      }
    } catch {
      // ignore
    }
    return 0;
  }, [syncOffsetMs]);

  // Parse text into tokens, distinguishing words from punctuation/separators (•, *, etc.)
  const { tokens, spokenWordsCount } = useMemo(() => {
    const rawTokens = text.trim().split(/\s+/).filter(Boolean);
    let wordIdxCounter = 0;

    // Temporary list to identify which are spoken words
    const classified = rawTokens.map((raw) => {
      // Check if token contains Arabic letters
      const hasArabicLetters = /[\u0621-\u064A\u0671-\u06D3]/.test(raw);
      // Exclude standalone symbols like "•", "-", "*", or numbers in brackets
      const isWord = hasArabicLetters && !/^[\u2022\u25CF\-\*\d\(\)\[\]]+$/.test(raw);
      const cleanWord = raw.replace(/[^\u0600-\u06FF]/g, '');
      const assignedIndex = isWord ? wordIdxCounter++ : -1;
      return { raw, cleanWord, isWord, wordIndex: assignedIndex };
    });

    const totalSpoken = wordIdxCounter;

    // Calculate phonetic weights for spoken words
    const weights = classified.map((item) => {
      if (!item.isWord) return 0;
      const isLast = item.wordIndex === totalSpoken - 1;
      return computePhoneticWeight(item.cleanWord, isLast);
    });

    const totalWeight = weights.reduce((acc, curr) => acc + curr, 0);

    let accumulatedWeight = 0;
    const finalTokens: TextToken[] = classified.map((item, idx) => {
      if (!item.isWord || totalWeight === 0) {
        return {
          ...item,
          weight: 0,
          startPct: 0,
          endPct: 0,
        };
      }

      const w = weights[idx];
      const startPct = (accumulatedWeight / totalWeight) * 100;
      accumulatedWeight += w;
      const endPct = (accumulatedWeight / totalWeight) * 100;

      return {
        ...item,
        weight: w,
        startPct,
        endPct,
      };
    });

    return { tokens: finalTokens, spokenWordsCount: totalSpoken };
  }, [text]);

  // Audio Speech Window Normalization:
  // Trims leading silence/breath (~150-350ms) and trailing room reverb (~600-1200ms)
  // so the highlight matches active speech precisely without lagging at the end or starting too early.
  const activeWordIndex = useMemo(() => {
    if (!isPlaying || spokenWordsCount === 0) return -1;

    let effectiveProgress: number;

    if (duration !== undefined && duration > 0 && currentTime !== undefined) {
      // Millisecond-accurate timeline calculation
      const leadSilenceSec = Math.min(0.35, Math.max(0.12, duration * 0.04));
      const tailSilenceSec = Math.min(1.4, Math.max(0.55, duration * 0.13));
      const activeSpeechDur = Math.max(0.2, duration - leadSilenceSec - tailSilenceSec);

      // Apply vocal lead anticipation (80ms) + user offset
      const adjustedTime = currentTime + (activeOffsetMs / 1000) + 0.08;

      if (adjustedTime <= leadSilenceSec) {
        effectiveProgress = 0;
      } else if (adjustedTime >= duration - tailSilenceSec) {
        effectiveProgress = 99.9;
      } else {
        effectiveProgress = ((adjustedTime - leadSilenceSec) / activeSpeechDur) * 100;
      }
    } else {
      // Fallback using progressPercent with normalized active speech curve
      const offsetPercent = (activeOffsetMs / 3000) * 100; // proportional offset
      const rawPct = Math.max(0, Math.min(100, (progressPercent || 0) + offsetPercent + 2.5));

      // Standard EveryAyah & Hisnul Muslim clips: speech typically starts at ~3.5% and ends at ~88%
      const startPct = 3.5;
      const endPct = 88.0;

      if (rawPct <= startPct) {
        effectiveProgress = 0;
      } else if (rawPct >= endPct) {
        effectiveProgress = 99.9;
      } else {
        effectiveProgress = ((rawPct - startPct) / (endPct - startPct)) * 100;
      }
    }

    const clampedProgress = Math.max(0, Math.min(99.99, effectiveProgress));

    // Find the spoken word matching the calculated progress
    const matchingToken = tokens.find(
      (tok) => tok.isWord && clampedProgress >= tok.startPct && clampedProgress < tok.endPct
    );

    if (matchingToken) return matchingToken.wordIndex;
    if (clampedProgress >= 95) return spokenWordsCount - 1;
    return 0;
  }, [isPlaying, tokens, spokenWordsCount, currentTime, duration, progressPercent, activeOffsetMs]);

  const fontClass = fontStyle === 'amiri' ? 'font-quran-amiri' : 'font-quran-indonesia';

  return (
    <p
      dir="rtl"
      className={`${fontClass} ${fontSizeClass} text-right leading-loose tracking-wide select-text ${className}`}
    >
      {tokens.map((token, idx) => {
        // If it's a non-word token (e.g. "•" or standalone separator)
        if (!token.isWord) {
          return (
            <span
              key={`sep-${idx}`}
              className="inline-block mx-1.5 text-emerald-600 dark:text-emerald-400 font-sans text-sm select-none opacity-80 align-middle"
            >
              {token.raw}
            </span>
          );
        }

        const isWordActive = isPlaying && token.wordIndex === activeWordIndex;
        const isWordPast = isPlaying && token.wordIndex < activeWordIndex;
        const isWordFuture = isPlaying && token.wordIndex > activeWordIndex;

        // Custom highlight classes
        let wordClasses =
          'inline-block mx-0.5 px-1 py-0.5 rounded-xl transition-all duration-150 ';

        if (isWordActive) {
          // Dynamic karaoke highlight: warm amber/golden glow with soft ring and gentle pulse
          wordClasses +=
            'bg-amber-300 dark:bg-amber-400/35 text-amber-950 dark:text-amber-100 ring-2 ring-amber-400 dark:ring-amber-300 shadow-sm scale-105 font-bold z-10';
        } else if (isWordPast) {
          // Already read word: subtle emerald tint
          wordClasses +=
            'text-emerald-850 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20';
        } else if (isWordFuture) {
          // Upcoming word: slightly dimmed for reading focus
          wordClasses += 'text-slate-800 dark:text-slate-200 opacity-75';
        } else {
          // Normal state (audio paused or not playing)
          wordClasses +=
            'text-slate-900 dark:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-700/50';
        }

        if (allowWordSeek && onWordClick) {
          wordClasses += ' cursor-pointer hover:scale-105 active:scale-95';
        }

        return (
          <span
            key={`word-${token.wordIndex}-${token.cleanWord}-${idx}`}
            onClick={(e) => {
              if (allowWordSeek && onWordClick) {
                e.stopPropagation();
                // Map word timing to seekable percentage
                const targetPercent = Math.max(0, token.startPct);
                onWordClick(token.wordIndex, targetPercent);
              }
            }}
            className={wordClasses}
            title={
              allowWordSeek && onWordClick
                ? `Kata ke-${token.wordIndex + 1}: Ketuk untuk memutar audio dari kata ini`
                : undefined
            }
          >
            {renderTajwidText(token.raw, enableTajwid)}
          </span>
        );
      })}

      {/* End of Ayah marker symbol if specified */}
      {showAyahEndMarker !== undefined && (
        <span className="inline-flex items-center justify-center font-sans text-xs w-7 h-7 rounded-full border border-emerald-400 text-emerald-800 dark:text-emerald-300 mr-2 ml-1 align-middle select-none">
          {showAyahEndMarker}
        </span>
      )}
    </p>
  );
};
