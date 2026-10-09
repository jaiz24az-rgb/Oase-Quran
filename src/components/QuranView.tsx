import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Search, Volume2, Pause, Play, Square, Bookmark, BookmarkCheck, Sparkles, SlidersHorizontal, Info, ChevronLeft, ChevronRight, ChevronDown, X, Eye, EyeOff, Layers, Brain, ArrowRight } from 'lucide-react';
import { SURAH_LIST, fetchSurahVerses, LOCAL_SURAHS_MAP } from '../data/quranData';
import { QuranAyah, QuranSurah } from '../types';
import { renderTajwidText, TAJWID_RULES } from '../utils/tajwidHighlighter';
import { SynchronizedArabicText } from './SynchronizedArabicText';

interface QuranViewProps {
  initialSurahNumber?: number;
  onOpenQuranMapping?: (surahNumber: number) => void;
  onOpenQuranMemorize?: (surahNumber: number) => void;
}

export const QuranView: React.FC<QuranViewProps> = ({
  initialSurahNumber,
  onOpenQuranMapping,
  onOpenQuranMemorize,
}) => {
  const [selectedSurah, setSelectedSurah] = useState<QuranSurah>(() => {
    if (initialSurahNumber) {
      return SURAH_LIST.find((s) => s.number === initialSurahNumber) || SURAH_LIST[0];
    }
    return SURAH_LIST[0];
  });
  const [verses, setVerses] = useState<QuranAyah[]>(LOCAL_SURAHS_MAP[1] || []);
  const [isLoadingVerses, setIsLoadingVerses] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterJuz30, setFilterJuz30] = useState<boolean>(false);
  const [showSurahModal, setShowSurahModal] = useState<boolean>(false);

  const handlePrevSurah = () => {
    if (selectedSurah.number > 1) {
      const prev = SURAH_LIST.find((s) => s.number === selectedSurah.number - 1);
      if (prev) {
        setSelectedSurah(prev);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleNextSurah = () => {
    if (selectedSurah.number < 114) {
      const next = SURAH_LIST.find((s) => s.number === selectedSurah.number + 1);
      if (next) {
        setSelectedSurah(next);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleSelectSurah = (surah: QuranSurah) => {
    setSelectedSurah(surah);
    setShowSurahModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync with initialSurahNumber when it changes
  useEffect(() => {
    if (initialSurahNumber) {
      const found = SURAH_LIST.find((s) => s.number === initialSurahNumber);
      if (found) setSelectedSurah(found);
    }
  }, [initialSurahNumber]);

  // Settings
  const [enableTajwid, setEnableTajwid] = useState<boolean>(true);
  const [showLatin, setShowLatin] = useState<boolean>(true);
  const [showTajwidGuide, setShowTajwidGuide] = useState<boolean>(false);
  const [arabicFontSize, setArabicFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [quranFontStyle, setQuranFontStyle] = useState<'indonesia' | 'amiri'>('indonesia');

  // Audio player state
  const [currentPlayingAyah, setCurrentPlayingAyah] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<{
    currentTime: number;
    duration: number;
    progressPercent: number;
  }>({ currentTime: 0, duration: 0, progressPercent: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // Audio & Highlight sync calibration
  const [syncOffsetMs, setSyncOffsetMs] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tarjih_audio_sync_offset_ms');
      return saved !== null ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });
  const [showSyncTuner, setShowSyncTuner] = useState<boolean>(false);
  const [autoFollowAyah, setAutoFollowAyah] = useState<boolean>(true);

  // Auto-follow active ayah: screen automatically follows currently playing verse without manual scrolling
  useEffect(() => {
    if (isPlayingAudio && currentPlayingAyah && autoFollowAyah) {
      const el = document.getElementById(`ayah-${currentPlayingAyah}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentPlayingAyah, isPlayingAudio, autoFollowAyah]);

  const handleUpdateSyncOffset = (offset: number) => {
    const clamped = Math.max(-1000, Math.min(1000, Math.round(offset)));
    setSyncOffsetMs(clamped);
    try {
      localStorage.setItem('tarjih_audio_sync_offset_ms', String(clamped));
    } catch {
      // ignore
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Last read bookmark
  const [lastRead, setLastRead] = useState<{ surahNumber: number; ayahNumber: number; surahName: string } | null>(() => {
    try {
      const saved = localStorage.getItem('tarjih_last_read_quran');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Load verses when selectedSurah changes
  useEffect(() => {
    let isMounted = true;
    setIsLoadingVerses(true);
    stopAudio();

    fetchSurahVerses(selectedSurah.number).then((data) => {
      if (isMounted) {
        setVerses(data);
        setIsLoadingVerses(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedSurah.number]);

  // High-precision ticker for real-time highlighting
  const startRafTicker = (audioInstance: HTMLAudioElement) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    let lastTime = -1;
    const tick = () => {
      if (audioRef.current === audioInstance && !audioInstance.paused && !audioInstance.ended) {
        const cur = audioInstance.currentTime;
        if (Math.abs(cur - lastTime) >= 0.025) {
          lastTime = cur;
          const dur = !isNaN(audioInstance.duration) && audioInstance.duration > 0 ? audioInstance.duration : 0;
          const pct = dur > 0 ? (cur / dur) * 100 : 0;
          setAudioProgress({
            currentTime: cur,
            duration: dur,
            progressPercent: pct,
          });
        }
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  // Audio controller
  const handlePlayAyahAudio = (ayahNumber: number, audioUrl?: string) => {
    if (currentPlayingAyah === ayahNumber && isPlayingAudio) {
      stopAudio();
      return;
    }

    stopAudio();
    // Default reliable everyayah CDN if audioUrl not provided
    const surahPadded = String(selectedSurah.number).padStart(3, '0');
    const ayahPadded = String(ayahNumber).padStart(3, '0');
    const finalAudioUrl =
      audioUrl || `https://everyayah.com/data/Alafasy_128kbps/${surahPadded}${ayahPadded}.mp3`;

    const audio = new Audio(finalAudioUrl);
    audioRef.current = audio;

    audio.ontimeupdate = () => {
      const cur = audio.currentTime;
      const dur = !isNaN(audio.duration) && audio.duration > 0 ? audio.duration : 0;
      const pct = dur > 0 ? (cur / dur) * 100 : 0;
      setAudioProgress({
        currentTime: cur,
        duration: dur,
        progressPercent: pct,
      });
    };

    audio.play().then(() => {
      setIsPlayingAudio(true);
      setCurrentPlayingAyah(ayahNumber);
      startRafTicker(audio);
    }).catch((err) => {
      console.warn('Audio playback error:', err);
      setIsPlayingAudio(false);
      setCurrentPlayingAyah(null);
      setAudioProgress({ currentTime: 0, duration: 0, progressPercent: 0 });
    });

    audio.onended = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      // Auto play next verse
      if (ayahNumber < verses.length) {
        handlePlayAyahAudio(ayahNumber + 1);
      } else {
        setIsPlayingAudio(false);
        setCurrentPlayingAyah(null);
        setAudioProgress({ currentTime: 0, duration: 0, progressPercent: 0 });
      }
    };

    audio.onerror = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setIsPlayingAudio(false);
      setCurrentPlayingAyah(null);
      setAudioProgress({ currentTime: 0, duration: 0, progressPercent: 0 });
    };
  };

  const handleSeekAyah = (targetPercent: number) => {
    if (audioRef.current && !isNaN(audioRef.current.duration) && audioRef.current.duration > 0) {
      const targetTime = (targetPercent / 100) * audioRef.current.duration;
      audioRef.current.currentTime = targetTime;
    }
  };

  const stopAudio = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.ontimeupdate = null;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlayingAudio(false);
    setCurrentPlayingAyah(null);
    setAudioProgress({ currentTime: 0, duration: 0, progressPercent: 0 });
  };

  const saveLastRead = (ayahNumber: number) => {
    const item = {
      surahNumber: selectedSurah.number,
      ayahNumber,
      surahName: selectedSurah.englishName,
    };
    setLastRead(item);
    localStorage.setItem('tarjih_last_read_quran', JSON.stringify(item));
  };

  const jumpToLastRead = () => {
    if (!lastRead) return;
    const targetSurah = SURAH_LIST.find((s) => s.number === lastRead.surahNumber);
    if (targetSurah) {
      setSelectedSurah(targetSurah);
      setTimeout(() => {
        const el = document.getElementById(`ayah-${lastRead.ayahNumber}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 600);
    }
  };

  // Surah filter list
  const filteredSurahs = SURAH_LIST.filter((s) => {
    const matchJuz30 = !filterJuz30 || s.number >= 78;
    const matchSearch =
      searchQuery === '' ||
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.number) === searchQuery.trim();

    return matchJuz30 && matchSearch;
  });

  const getFontSizeClass = () => {
    if (arabicFontSize === 'normal') return 'text-2xl sm:text-3xl leading-loose';
    if (arabicFontSize === 'xlarge') return 'text-4xl sm:text-5xl leading-loose';
    return 'text-3xl sm:text-4xl leading-loose'; // large
  };

  return (
    <div className="space-y-6">
      {/* Quran Header Toolbar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-xs sm:text-sm uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Al-Qur'an Al-Karim • Mushaf Indonesia Digital</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            Surah {selectedSurah.englishName} ({selectedSurah.name})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {selectedSurah.englishNameTranslation} • {selectedSurah.numberOfAyahs} Ayat • {selectedSurah.revelationType === 'Meccan' ? 'Makkiyyah' : 'Madaniyyah'}
          </p>
        </div>

        {/* Action Controls: Tajwid toggle, Latin toggle, Font size, Tajwid guide */}
        <div className="flex flex-wrap items-center gap-2">
          {lastRead && (
            <button
              onClick={jumpToLastRead}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-xs font-semibold text-emerald-800 dark:text-emerald-300 transition-colors cursor-pointer"
              title={`Lanjut baca: Surah ${lastRead.surahName} ayat ${lastRead.ayahNumber}`}
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Lanjut Ayat {lastRead.ayahNumber}</span>
            </button>
          )}

          {/* Open Quran Mapping for this Surah */}
          {onOpenQuranMapping && (
            <button
              onClick={() => onOpenQuranMapping(selectedSurah.number)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              title="Buka 5 pilar kandungan & hikmah surah ini di Quran Mapping"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Quran Mapping</span>
            </button>
          )}

          {/* Open Quran Memorize SHQ for this Surah - Eye-Catching Amber Pill */}
          {onOpenQuranMemorize && (
            <button
              id="quran-toolbar-btn-shq"
              onClick={() => onOpenQuranMemorize(selectedSurah.number)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-sm ring-1 ring-amber-300 transition-all cursor-pointer hover:scale-102 active:scale-98"
              title="Hafalkan surah ini dengan Metode SHQ (20-45 menit sehari)"
            >
              <Brain className="w-3.5 h-3.5 text-slate-950" />
              <span>Hafal (SHQ)</span>
            </button>
          )}

          {/* Tajwid Color Toggle */}
          <button
            onClick={() => setEnableTajwid(!enableTajwid)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              enableTajwid
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
            title="Aktifkan pewarnaan hukum tajwid"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tajwid {enableTajwid ? 'Aktif' : 'Nonaktif'}</span>
          </button>

          {/* Tajwid Guide modal trigger */}
          <button
            onClick={() => setShowTajwidGuide(!showTajwidGuide)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium cursor-pointer"
            title="Buka panduan warna hukum tajwid"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Panduan Tajwid</span>
          </button>

          {/* Latin Transliteration Toggle */}
          <button
            onClick={() => setShowLatin(!showLatin)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
              showLatin
                ? 'bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
            }`}
            title="Tampilkan / Sembunyikan transliterasi Latin"
          >
            {showLatin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Latin</span>
          </button>

          {/* Auto-Follow Screen Scroll Toggle */}
          <button
            onClick={() => setAutoFollowAyah(!autoFollowAyah)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              autoFollowAyah
                ? 'bg-amber-100 text-amber-950 border border-amber-350 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-700 shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
            }`}
            title="Layar otomatis mengikuti ayat yang sedang diputar tanpa perlu scroll manual"
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${autoFollowAyah ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'}`}></span>
            <span className="hidden sm:inline">Ikuti Ayat:</span>
            <span>{autoFollowAyah ? 'Auto-Scroll ON' : 'OFF'}</span>
          </button>

          {/* Font Type Selector (Indonesian Standard vs Usmani) */}
          <button
            onClick={() => setQuranFontStyle(quranFontStyle === 'indonesia' ? 'amiri' : 'indonesia')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
            title="Ganti jenis huruf: Standar Mushaf Kemenag RI vs Usmani Klasik"
          >
            <span className="font-serif font-bold text-emerald-600">Aa</span>
            <span>{quranFontStyle === 'indonesia' ? 'Mushaf RI (Jelas)' : 'Usmani (Amiri)'}</span>
          </button>

          {/* Font Size Selector */}
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-xs">
            <button
              onClick={() => setArabicFontSize('normal')}
              className={`px-2 py-1 ${arabicFontSize === 'normal' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-700 text-slate-600'}`}
              title="Huruf Sedang"
            >
              A
            </button>
            <button
              onClick={() => setArabicFontSize('large')}
              className={`px-2 py-1 ${arabicFontSize === 'large' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-700 text-slate-600'}`}
              title="Huruf Besar"
            >
              A+
            </button>
            <button
              onClick={() => setArabicFontSize('xlarge')}
              className={`px-2 py-1 ${arabicFontSize === 'xlarge' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-700 text-slate-600'}`}
              title="Huruf Sangat Besar"
            >
              A++
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Quick-Start SHQ Memorize Banner */}
      {onOpenQuranMemorize && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 border border-emerald-500/40 text-white p-4 sm:p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md font-black">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Metode Hafal SHQ (20–45 Menit)
                </span>
                <span className="text-[11px] text-emerald-300 font-semibold">
                  Anti Ember Bocor
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white mt-1">
                Ingin Menghafal Surah {selectedSurah.englishName} ({selectedSurah.numberOfAyahs} Ayat)?
              </h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Gunakan 4 langkah terpandu: Petakan lokasi mushaf, murottal berulang, uji ingatan aktif (active recall), dan jam retensi otomatis.
              </p>
            </div>
          </div>

          <button
            id="quran-banner-btn-shq"
            onClick={() => onOpenQuranMemorize(selectedSurah.number)}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer shrink-0"
          >
            <Brain className="w-4 h-4 text-slate-950" />
            <span>Mulai Hafal Surah Ini</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tajwid Guide Panel (Collapsible) */}
      {showTajwidGuide && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-emerald-200 dark:border-emerald-800 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Panduan Kode Warna Tajwid Standar Mushaf Indonesia</span>
            </h4>
            <button
              onClick={() => setShowTajwidGuide(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Tutup ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TAJWID_RULES.map((rule) => (
              <div
                key={rule.id}
                className={`p-3 rounded-xl border ${rule.bgClass} ${rule.borderClass} space-y-1`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${rule.colorClass}`}>{rule.name}</span>
                  <span className="font-quran text-sm font-bold">{rule.letters}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  {rule.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Surah Navigator Bar: Immediately visible at top, no vertical scrolling needed */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-2.5 sm:p-3.5 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between gap-2">
        <button
          onClick={handlePrevSurah}
          disabled={selectedSurah.number <= 1}
          className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer shrink-0"
          title="Surah Sebelumnya"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </button>

        <button
          onClick={() => setShowSurahModal(true)}
          className="flex-1 max-w-lg mx-auto flex items-center justify-between gap-2 sm:gap-3 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/90 dark:bg-emerald-950/50 dark:hover:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-100 transition-colors cursor-pointer group"
          title="Klik untuk memilih langsung dari 114 surah tanpa scroll"
        >
          <div className="flex items-center gap-2 truncate">
            <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
              {selectedSurah.number}
            </span>
            <div className="text-left truncate">
              <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                <span>Surah {selectedSurah.englishName}</span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-normal hidden xs:inline">
                  ({selectedSurah.englishNameTranslation})
                </span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {selectedSurah.numberOfAyahs} Ayat • {selectedSurah.revelationType === 'Meccan' ? 'Makkiyyah' : 'Madaniyyah'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-850 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <span>Ganti Surah</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </button>

        <button
          onClick={handleNextSurah}
          disabled={selectedSurah.number >= 114}
          className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer shrink-0"
          title="Surah Berikutnya"
        >
          <span className="hidden sm:inline">Berikutnya</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Layout: Surah Selector List (Left 3 cols) & Verses Reading Area (Right 9 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Desktop Left Column: 114 Surahs Directory */}
        <div className="hidden lg:block lg:col-span-4 sticky top-20 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Daftar 114 Surat:
            </h3>
            <button
              onClick={() => setFilterJuz30(!filterJuz30)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filterJuz30
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {filterJuz30 ? 'Semua Surah' : 'Juz 30 Saja'}
            </button>
          </div>

          {/* Search Input for Surahs */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="quran-search-surah"
              type="text"
              placeholder="Cari surat (cth: Yasin, Al-Mulk, 18)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Surah List Scrollable */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-2 space-y-1 max-h-[600px] overflow-y-auto scrollbar-thin">
            {filteredSurahs.map((surah) => {
              const isSelected = selectedSurah.number === surah.number;

              return (
                <button
                  key={surah.number}
                  id={`surah-item-${surah.number}`}
                  onClick={() => handleSelectSurah(surah)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {surah.number}
                    </span>
                    <div className="truncate">
                      <p className="text-xs sm:text-sm font-semibold truncate leading-tight">
                        {surah.englishName}
                      </p>
                      <p
                        className={`text-[10px] truncate ${
                          isSelected ? 'text-white/80' : 'text-slate-400'
                        }`}
                      >
                        {surah.englishNameTranslation} • {surah.numberOfAyahs} ayat
                      </p>
                    </div>
                  </div>

                  <span
                    className={`font-quran text-base shrink-0 ml-2 ${
                      isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {surah.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Verses Reading Area (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Bismillah Header (except for Surah At-Taubah #9) */}
          {selectedSurah.number !== 9 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 text-center shadow-xs">
              <p
                dir="rtl"
                className={`${
                  quranFontStyle === 'amiri' ? 'font-quran-amiri' : 'font-quran-indonesia'
                } text-3xl sm:text-4xl text-emerald-800 dark:text-emerald-300 leading-loose`}
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="text-xs text-slate-500 italic mt-2">
                Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang
              </p>
            </div>
          )}

          {/* Ayah List */}
          {isLoadingVerses ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500">Memuat mushaf ayat Al-Qur'an...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {verses.map((ayah) => {
                const isPlayingThis = currentPlayingAyah === ayah.numberInSurah && isPlayingAudio;
                const isBookmarked =
                  lastRead?.surahNumber === selectedSurah.number &&
                  lastRead?.ayahNumber === ayah.numberInSurah;

                return (
                  <div
                    key={ayah.numberInSurah}
                    id={`ayah-${ayah.numberInSurah}`}
                    className={`bg-white dark:bg-slate-800 rounded-2xl p-6 border transition-all space-y-4 ${
                      isPlayingThis
                        ? 'border-amber-400 dark:border-amber-500 ring-2 ring-amber-400/40 shadow-lg bg-gradient-to-b from-amber-50/25 via-emerald-50/15 to-transparent dark:from-amber-950/20 dark:via-emerald-950/10'
                        : isBookmarked
                        ? 'border-amber-400 dark:border-amber-500/80 bg-amber-50/20'
                        : 'border-slate-200 dark:border-slate-700 shadow-xs hover:border-slate-300'
                    }`}
                  >
                    {/* Top action bar: Ayah number, Audio button, Bookmark button */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-750 pb-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center ${
                          isPlayingThis
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {selectedSurah.number}:{ayah.numberInSurah}
                        </span>
                        {isPlayingThis && (
                          <span className="text-[10px] bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 border border-amber-300 dark:border-amber-700">
                            <span className="flex h-1.5 w-1.5 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                            </span>
                            <span>Highlight Audio Real-Time</span>
                          </span>
                        )}
                        {isBookmarked && !isPlayingThis && (
                          <span className="text-[10px] bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 px-2 py-0.5 rounded font-semibold">
                            Terakhir Dibaca
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handlePlayAyahAudio(ayah.numberInSurah, ayah.audioUrl)}
                          className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                            isPlayingThis
                              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                          }`}
                          title="Putar bacaan murottal ayat ini dengan highlight kata sinkron"
                        >
                          {isPlayingThis ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          <span className="text-[11px]">{isPlayingThis ? 'Jeda' : 'Putar'}</span>
                        </button>

                        <button
                          onClick={() => saveLastRead(ayah.numberInSurah)}
                          className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                            isBookmarked
                              ? 'bg-amber-500 text-white border-amber-500'
                              : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                          }`}
                          title="Tandai sebagai terakhir dibaca"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Active Playback Timeline Bar when playing */}
                    {isPlayingThis && (
                      <div className="bg-amber-50/80 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800/80 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-amber-900 dark:text-amber-200 font-medium">
                          <span className="flex items-center gap-1 text-[10px]">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <span>Teks Arab menyorot kata yang sedang dilafalkan. Ketuk kata untuk melompat.</span>
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setShowSyncTuner(!showSyncTuner)}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold border flex items-center gap-1 cursor-pointer transition-colors ${
                                showSyncTuner
                                  ? 'bg-amber-600 text-white border-amber-600'
                                  : 'bg-white/80 dark:bg-slate-900 text-amber-850 dark:text-amber-200 border-amber-300 dark:border-amber-700 hover:bg-amber-100'
                              }`}
                              title="Buka panel kalibrasi sinkronisasi audio dan teks"
                            >
                              <SlidersHorizontal className="w-2.5 h-2.5" />
                              <span>Sync {syncOffsetMs !== 0 ? `${syncOffsetMs > 0 ? '+' : ''}${syncOffsetMs}ms` : '0ms'}</span>
                            </button>
                            <span className="font-mono text-xs font-bold shrink-0">
                              {formatTime(audioProgress.currentTime)} / {formatTime(audioProgress.duration)}
                            </span>
                          </div>
                        </div>

                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="0.5"
                          value={audioProgress.progressPercent}
                          onChange={(e) => handleSeekAyah(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-amber-200 dark:bg-amber-900 rounded-lg appearance-none cursor-pointer accent-amber-600"
                          title="Geser timeline ayat"
                        />

                        {/* Interactive Audio Sync Calibrator */}
                        {showSyncTuner && (
                          <div className="pt-1.5 border-t border-amber-200/70 dark:border-amber-800/60 text-xs space-y-1.5 animate-in fade-in duration-150">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-amber-900 dark:text-amber-200 font-semibold">
                                Penyelarasan Waktu Highlight (Audio Offset):
                              </span>
                              <span className="font-mono font-bold text-amber-800 dark:text-amber-300">
                                {syncOffsetMs > 0 ? `+${syncOffsetMs}` : syncOffsetMs} ms
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] text-slate-500 dark:text-slate-400">Pilihan Cepat:</span>
                              {[-100, -50, 0, 50, 100].map((preset) => (
                                <button
                                  key={preset}
                                  onClick={() => handleUpdateSyncOffset(preset)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-medium border cursor-pointer transition-colors ${
                                    syncOffsetMs === preset
                                      ? 'bg-amber-600 text-white border-amber-600'
                                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                                  }`}
                                >
                                  {preset === 0 ? 'Normal (0ms)' : preset < 0 ? `${preset}ms (Lebih Awal)` : `+${preset}ms (Lebih Lambat)`}
                                </button>
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-500 shrink-0">-300ms</span>
                              <input
                                type="range"
                                min="-300"
                                max="300"
                                step="25"
                                value={syncOffsetMs}
                                onChange={(e) => handleUpdateSyncOffset(parseInt(e.target.value, 10))}
                                className="w-full h-1 bg-amber-200 dark:bg-amber-800 rounded appearance-none cursor-pointer accent-amber-600"
                              />
                              <span className="text-[10px] text-slate-500 shrink-0">+300ms</span>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                              💡 Nilai minus (-) memajukan highlight lebih awal (cocok untuk earphone Bluetooth), nilai plus (+) memperlambat highlight.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Arabic Text with Synchronized Real-Time Word Highlighting & Tajwid */}
                    <div className="py-2">
                      <SynchronizedArabicText
                        text={ayah.text}
                        isPlaying={isPlayingThis}
                        progressPercent={audioProgress.progressPercent}
                        currentTime={audioProgress.currentTime}
                        duration={audioProgress.duration}
                        syncOffsetMs={syncOffsetMs}
                        enableTajwid={enableTajwid}
                        fontStyle={quranFontStyle}
                        fontSizeClass={getFontSizeClass()}
                        showAyahEndMarker={ayah.numberInSurah}
                        onWordClick={isPlayingThis ? (_idx, pct) => handleSeekAyah(pct) : undefined}
                      />
                    </div>

                    {/* Latin Transliteration */}
                    {showLatin && ayah.transliteration && (
                      <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                          {ayah.transliteration}
                        </p>
                      </div>
                    )}

                    {/* Indonesian Translation (Kemenag) */}
                    <div className="space-y-0.5">
                      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                        {ayah.translation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal for selecting Surah directly without having to scroll down */}
      {showSurahModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Pilih Surah (1 - 114)
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Klik surah untuk langsung membuka dan membaca ayatnya
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSurahModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input & Filters */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-700 space-y-2 bg-slate-50/70 dark:bg-slate-850/50">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari surat (cth: Yasin, Al-Mulk, 18)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
                <button
                  onClick={() => setFilterJuz30(false)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    !filterJuz30
                      ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                      : 'bg-white dark:bg-slate-750 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Semua (114 Surah)
                </button>
                <button
                  onClick={() => setFilterJuz30(true)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    filterJuz30
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-slate-750 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Juz 30 Saja (An-Naba s.d An-Naas)
                </button>
              </div>
            </div>

            {/* Surah List in Modal */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 max-h-[50vh] scrollbar-thin">
              {filteredSurahs.map((surah) => {
                const isSelected = selectedSurah.number === surah.number;
                return (
                  <button
                    key={surah.number}
                    onClick={() => handleSelectSurah(surah)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-750 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-emerald-700 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {surah.number}
                      </span>
                      <div>
                        <div className="font-bold text-xs sm:text-sm">{surah.englishName}</div>
                        <div
                          className={`text-[10px] ${
                            isSelected ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {surah.englishNameTranslation} • {surah.numberOfAyahs} ayat • {surah.revelationType === 'Meccan' ? 'Makkiyyah' : 'Madaniyyah'}
                        </div>
                      </div>
                    </div>
                    <span
                      dir="rtl"
                      className={`font-quran text-base ${
                        isSelected ? 'text-white' : 'text-emerald-700 dark:text-emerald-400'
                      }`}
                    >
                      {surah.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
