import React, { useMemo, useEffect, useRef } from 'react';
import { renderTajwidText } from '../utils/tajwidHighlighter';
import { WordTimingSegment } from '../utils/quranTimingService';

export interface SynchronizedArabicTextProps {
  text: string;
  isPlaying?: boolean;
  progressPercent?: number; // 0 to 100
  currentTime?: number; // Exact audio playback time in seconds
  duration?: number; // Exact audio duration in seconds
  syncOffsetMs?: number; // User calibration offset in ms (-500 to +500ms)
  wordTimings?: WordTimingSegment[] | null; // Exact millisecond segments from audio recitation
  enableTajwid?: boolean;
  fontStyle?: 'indonesia' | 'amiri';
  fontSizeClass?: string;
  onWordClick?: (wordIndex: number, targetPercent: number, targetTimeSec?: number) => void;
  showAyahEndMarker?: number;
  className?: string;
  allowWordSeek?: boolean;
  autoFollowWord?: boolean; // Ensure active word is always centered and readable on screen
}

interface TextToken {
  raw: string;
  cleanWord: string;
  isWord: boolean;
  wordIndex: number; // Index among spoken words (-1 if non-word like bullet/bracket)
  weight: number;
  startPct: number;
  endPct: number;
  startSec?: number;
  endSec?: number;
}

/**
 * Phonetic length calculator based on Tajwid & Tartil rules:
 * - Natural base duration per word (prevents short connectors from rushing too fast)
 * - Mad Thabi'i: ~2 beats (dagger alif, waw/ya saghirah, fathah+alif, dhammah+waw, kasrah+ya)
 * - Mad Far'i (Maddah sign ~): ~4 beats
 * - Ghunnah Musyaddadah on Nun (نّ) and Mim (مّ): ~2 beats
 * - Qolqolah sukun: distinct articulation bounce
 * - Waqaf on the final word: gentle natural holding (~1.18x instead of excessive 1.85x)
 */
function computePhoneticWeight(word: string, isLastWord: boolean): number {
  const clean = word.replace(/[^\u0600-\u06FF]/g, '');
  if (!clean) return 3.5;

  // Basic Arabic letters (consonants / long vowels)
  const baseLetters = (clean.match(/[\u0621-\u064A\u0671-\u06D3]/g) || []).length;
  // Harakat (fathah, kasrah, dhammah, sukun)
  const basicHarakat = (clean.match(/[\u064E\u064F\u0650\u0652]/g) || []).length;
  // Tanwin (fathatain, kasratain, dammatain)
  const tanwin = (clean.match(/[\u064B\u064C\u064D]/g) || []).length;

  // Ghunnah Musyaddadah: Shaddah on Nun or Mim (held 2 beats)
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

  // Balanced base articulation: ensures even single-letter words have sufficient time
  let weight =
    3.8 +
    baseLetters * 1.2 +
    basicHarakat * 0.3 +
    tanwin * 1.2 +
    ghunnahShaddah * 2.2 +
    regularShaddah * 1.2 +
    daggerAlif * 1.8 +
    regularMadLetters * 1.6 +
    maddah * 2.8 +
    qolqolah * 0.8;

  // Natural waqaf hold on the stopping word
  if (isLastWord) {
    weight *= 1.18;
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
  wordTimings,
  enableTajwid = true,
  fontStyle = 'indonesia',
  fontSizeClass = 'text-2xl sm:text-3xl lg:text-4xl',
  onWordClick,
  showAyahEndMarker,
  className = '',
  allowWordSeek = true,
  autoFollowWord = true,
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

      // Match exact timing segment if available
      const timing = wordTimings?.find((t) => t.wordIndex === item.wordIndex);

      return {
        ...item,
        weight: w,
        startPct,
        endPct,
        startSec: timing?.startSec,
        endSec: timing?.endSec,
      };
    });

    return { tokens: finalTokens, spokenWordsCount: totalSpoken };
  }, [text, wordTimings]);

  // Real-Time Word Highlighting:
  // 1. Ground truth: Exact word-by-word timestamps from Quran recitation segments if available.
  // 2. High-precision fallback: Balanced phonetic articulation weighting with natural speech bounds.
  const activeWordIndex = useMemo(() => {
    if (!isPlaying || spokenWordsCount === 0) return -1;

    // 1. Exact Word Timings from audio segments
    if (wordTimings && wordTimings.length > 0 && currentTime !== undefined) {
      const adjustedTime = Math.max(0, currentTime + (activeOffsetMs / 1000));

      const matchingSegment = wordTimings.find(
        (t) => adjustedTime >= t.startSec && adjustedTime < t.endSec
      );

      if (matchingSegment) {
        return matchingSegment.wordIndex;
      }

      // If playback is before the first word's start, highlight word 0
      if (adjustedTime < wordTimings[0].startSec) {
        return 0;
      }

      // If playback has passed the last word's start, highlight the last word
      const last = wordTimings[wordTimings.length - 1];
      if (adjustedTime >= last.startSec) {
        return last.wordIndex;
      }

      // Interpolate between gap if any
      const nextWord = wordTimings.find((t) => t.startSec > adjustedTime);
      if (nextWord && nextWord.wordIndex > 0) {
        return nextWord.wordIndex - 1;
      }
    }

    // 2. High-precision phonetic timeline calculation
    let effectiveProgress: number;

    if (duration !== undefined && duration > 0 && currentTime !== undefined) {
      // Natural speech envelope for recitation audio:
      // Lead silence is typically 40ms to 150ms
      const leadSilenceSec = Math.min(0.15, Math.max(0.04, duration * 0.02));
      // Tail decay is typically 100ms to 350ms
      const tailSilenceSec = Math.min(0.35, Math.max(0.10, duration * 0.05));
      const activeSpeechDur = Math.max(0.2, duration - leadSilenceSec - tailSilenceSec);

      // Apply user calibration offset (clean time without artificial advance)
      const adjustedTime = currentTime + (activeOffsetMs / 1000);

      if (adjustedTime <= leadSilenceSec) {
        effectiveProgress = 0;
      } else if (adjustedTime >= duration - tailSilenceSec) {
        effectiveProgress = 99.9;
      } else {
        effectiveProgress = ((adjustedTime - leadSilenceSec) / activeSpeechDur) * 100;
      }
    } else {
      // Fallback using progressPercent with normalized active speech curve
      const offsetPercent = (activeOffsetMs / 3000) * 100;
      const rawPct = Math.max(0, Math.min(100, (progressPercent || 0) + offsetPercent));

      const startPct = 1.5;
      const endPct = 96.0;

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
  }, [isPlaying, spokenWordsCount, wordTimings, currentTime, duration, progressPercent, activeOffsetMs, tokens]);

  // Reference to the currently active word element for real-time viewport tracking
  const activeWordElRef = useRef<HTMLSpanElement | null>(null);

  // Automatically keep the active word centered and visible in the viewport
  // Works seamlessly in both portrait and compact landscape modes
  useEffect(() => {
    if (!autoFollowWord || !isPlaying || activeWordIndex < 0 || !activeWordElRef.current) {
      return;
    }

    const el = activeWordElRef.current;
    const rafId = requestAnimationFrame(() => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;

      // In landscape orientation (or small screens), vertical height is typically 320px - 520px.
      // In portrait orientation, height is 600px - 900px.
      // Clearance guarantees text is never occluded by sticky header (top) or bottom bars (bottom).
      const isCompactLandscape = vh <= 540;
      const safeTop = isCompactLandscape ? 55 : 85;
      const safeBottom = isCompactLandscape ? vh - 60 : vh - 110;

      // If active word is nearing edge or off-screen, smoothly scroll it into comfortable reading center
      if (rect.top < safeTop || rect.bottom > safeBottom) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest',
        });
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [activeWordIndex, isPlaying, autoFollowWord]);

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
          'inline-block transition-all duration-150 ';

        if (isWordActive) {
          // Luminous golden-amber karaoke highlight: maximum contrast against both light and dark backgrounds
          // Guaranteed readable in bright light, dark mode, landscape and portrait
          wordClasses +=
            'relative bg-amber-400 text-slate-950 dark:bg-amber-400 dark:text-slate-950 font-extrabold ring-2 ring-amber-500 dark:ring-amber-300 shadow-md shadow-amber-500/35 scale-[1.04] z-20 rounded-xl px-2 py-0.5 mx-0.5 ';
        } else if (isWordPast) {
          // Already recited word: calm emerald tint
          wordClasses +=
            'text-emerald-900 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-lg px-1 py-0.5 mx-0.5 ';
        } else if (isWordFuture) {
          // Upcoming word: crisp and high-contrast for smooth sight-reading ahead
          wordClasses += 'text-slate-800 dark:text-slate-200 opacity-90 px-1 py-0.5 mx-0.5 ';
        } else {
          // Normal state (audio paused or not playing)
          wordClasses +=
            'text-slate-900 dark:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg px-1 py-0.5 mx-0.5 ';
        }

        if (allowWordSeek && onWordClick) {
          wordClasses += ' cursor-pointer hover:scale-105 active:scale-95';
        }

        return (
          <span
            key={`word-${token.wordIndex}-${token.cleanWord}-${idx}`}
            ref={isWordActive ? activeWordElRef : undefined}
            id={isWordActive ? 'active-quran-reading-word' : undefined}
            data-active-word={isWordActive ? 'true' : undefined}
            style={{
              scrollMarginTop: '90px',
              scrollMarginBottom: '110px',
            }}
            onClick={(e) => {
              if (allowWordSeek && onWordClick) {
                e.stopPropagation();
                // Map word timing to seekable percentage and exact seconds
                const targetPercent = Math.max(0, token.startPct);
                onWordClick(token.wordIndex, targetPercent, token.startSec);
              }
            }}
            className={wordClasses}
            title={
              allowWordSeek && onWordClick
                ? `Kata ke-${token.wordIndex + 1}: Ketuk untuk memutar audio dari kata ini`
                : undefined
            }
          >
            {renderTajwidText(token.raw, enableTajwid, isWordActive)}
            {/* Visual reading beacon indicator under active word */}
            {isWordActive && (
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-amber-600 dark:bg-amber-800 rounded-full animate-pulse pointer-events-none"
              />
            )}
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
