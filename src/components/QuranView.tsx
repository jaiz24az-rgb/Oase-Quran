import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Search, Volume2, Volume1, VolumeX, Pause, Play, Square, Bookmark, BookmarkCheck, Sparkles, SlidersHorizontal, Info, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, X, Eye, EyeOff, Layers, Brain, ArrowRight, Maximize2, Minimize2, HeartPulse } from 'lucide-react';
import { SURAH_LIST, fetchSurahVerses, LOCAL_SURAHS_MAP } from '../data/quranData';
import { QuranAyah, QuranSurah } from '../types';
import { renderTajwidText, TAJWID_RULES } from '../utils/tajwidHighlighter';
import { SynchronizedArabicText } from './SynchronizedArabicText';
import { QuranMappingView } from './QuranMappingView';
import { QuranMemorizeSHQView } from './QuranMemorizeSHQView';
import { QuranMedisView } from './QuranMedisView';
import { getSurahWordTimings, WordTimingSegment } from '../utils/quranTimingService';

interface QuranViewProps {
  initialSurahNumber?: number;
  initialMode?: 'mushaf' | 'shq' | 'mapping' | 'medis';
  onOpenQuranMapping?: (surahNumber: number) => void;
  onOpenQuranMemorize?: (surahNumber: number) => void;
  onOpenQuranMedis?: () => void;
  isLandscapeFullscreen?: boolean;
  isFocusMode?: boolean;
  onToggleFocusMode?: () => void;
}

export const QuranView: React.FC<QuranViewProps> = ({
  initialSurahNumber,
  initialMode = 'mushaf',
  onOpenQuranMapping,
  onOpenQuranMemorize,
  onOpenQuranMedis,
  isLandscapeFullscreen,
  isFocusMode,
  onToggleFocusMode,
}) => {
  // Check if device is in compact landscape mode (phone or small tablet rotated horizontally)
  const [internalCompactLandscape, setInternalCompactLandscape] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(orientation: landscape) and (max-height: 700px)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(orientation: landscape) and (max-height: 700px)');
    const check = () => setInternalCompactLandscape(media.matches);
    check();
    media.addEventListener('change', check);
    window.addEventListener('resize', check);
    return () => {
      media.removeEventListener('change', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  const [internalFocusMode, setInternalFocusMode] = useState<boolean>(false);
  const activeFocusMode = isFocusMode ?? internalFocusMode;
  const toggleFocusMode = onToggleFocusMode ?? (() => setInternalFocusMode((prev) => !prev));
  const isLandscapeCompact = isLandscapeFullscreen || internalCompactLandscape;
  const isLandscapeOrFocus = isLandscapeCompact || activeFocusMode;

  const [viewMode, setViewMode] = useState<'mushaf' | 'shq' | 'mapping' | 'medis'>(initialMode);
  const [selectedSurah, setSelectedSurah] = useState<QuranSurah>(() => {
    if (initialSurahNumber) {
      return SURAH_LIST.find((s) => s.number === initialSurahNumber) || SURAH_LIST[0];
    }
    return SURAH_LIST[0];
  });
  const [verses, setVerses] = useState<QuranAyah[]>(LOCAL_SURAHS_MAP[1] || []);
  const [isLoadingVerses, setIsLoadingVerses] = useState<boolean>(false);
  const [surahWordTimings, setSurahWordTimings] = useState<Record<number, WordTimingSegment[]>>({});
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

  // Sync with initialMode when it changes
  useEffect(() => {
    if (initialMode) {
      setViewMode(initialMode);
    }
  }, [initialMode]);

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
  const [isPlayerMinimized, setIsPlayerMinimized] = useState<boolean>(false);
  const [audioNotice, setAudioNotice] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const candidateIndexRef = useRef<number>(0);
  const currentCandidatesRef = useRef<string[]>([]);
  const retryTimeoutRef = useRef<number | null>(null);
  const wakeLockRef = useRef<any>(null);

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

  // Volume controls & auto-hide popover state
  const [audioVolume, setAudioVolume] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tarjih_quran_audio_volume');
      return saved !== null ? Math.max(0, Math.min(100, parseInt(saved, 10))) : 100;
    } catch {
      return 100;
    }
  });
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);
  const volumeHideTimerRef = useRef<number | null>(null);
  const volumeContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-hide player bar state (automatically collapses into mini pill after 5s of quiet reading)
  const [autoHidePlayer, setAutoHidePlayer] = useState<boolean>(() => {
    try {
      return localStorage.getItem('tarjih_quran_player_autohide') === 'true';
    } catch {
      return false;
    }
  });
  const playerAutoHideTimerRef = useRef<number | null>(null);

  const resetPlayerAutoHideTimer = () => {
    if (playerAutoHideTimerRef.current) {
      clearTimeout(playerAutoHideTimerRef.current);
      playerAutoHideTimerRef.current = null;
    }
    if (autoHidePlayer && isPlayingAudio && !isPlayerMinimized) {
      playerAutoHideTimerRef.current = window.setTimeout(() => {
        setIsPlayerMinimized(true);
      }, 5000);
    }
  };

  const toggleAutoHidePlayer = () => {
    setAutoHidePlayer((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('tarjih_quran_player_autohide', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const resetVolumeHideTimer = () => {
    if (volumeHideTimerRef.current) {
      clearTimeout(volumeHideTimerRef.current);
    }
    // Automatically hide slider after 3 seconds of inactivity
    volumeHideTimerRef.current = window.setTimeout(() => {
      setShowVolumeSlider(false);
    }, 3000);
  };

  const handleToggleVolumeSlider = () => {
    if (!showVolumeSlider) {
      setShowVolumeSlider(true);
      resetVolumeHideTimer();
    } else {
      setShowVolumeSlider(false);
      if (volumeHideTimerRef.current) clearTimeout(volumeHideTimerRef.current);
    }
  };

  const handleVolumeChange = (newVal: number) => {
    const clamped = Math.max(0, Math.min(100, newVal));
    setAudioVolume(clamped);
    if (clamped > 0 && isAudioMuted) {
      setIsAudioMuted(false);
    }
    try {
      localStorage.setItem('tarjih_quran_audio_volume', String(clamped));
    } catch {
      // ignore
    }
    resetVolumeHideTimer();
  };

  // Sync volume with active audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isAudioMuted ? 0 : audioVolume / 100;
    }
  }, [audioVolume, isAudioMuted]);

  // Click outside to automatically hide volume slider
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (volumeContainerRef.current && !volumeContainerRef.current.contains(e.target as Node)) {
        setShowVolumeSlider(false);
      }
    };
    if (showVolumeSlider) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showVolumeSlider]);

  // Screen Wake Lock & Tab Visibility listener: keeps recitation running & re-acquires lock on return
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && isPlayingAudio) {
        acquireWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isPlayingAudio]);

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

  // Load verses and exact word-by-word timestamps when selectedSurah changes
  useEffect(() => {
    let isMounted = true;
    setIsLoadingVerses(true);
    stopAudio();

    // Fetch verses data
    fetchSurahVerses(selectedSurah.number).then((data) => {
      if (isMounted) {
        setVerses(data);
        setIsLoadingVerses(false);
      }
    });

    // Fetch millisecond-exact word segment timestamps for active surah
    getSurahWordTimings(selectedSurah.number).then((timings) => {
      if (isMounted) {
        setSurahWordTimings(timings);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedSurah.number]);

  // Screen Wake Lock helper to keep display on and prevent audio suspension during long recitations
  const acquireWakeLock = async () => {
    try {
      if ('wakeLock' in navigator && !wakeLockRef.current) {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      }
    } catch {
      // Ignored if wake lock is unsupported or restricted
    }
  };

  const releaseWakeLock = () => {
    if (wakeLockRef.current) {
      try {
        wakeLockRef.current.release();
      } catch {
        // ignore
      }
      wakeLockRef.current = null;
    }
  };

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

  // Reference for preloading next ayah audio to eliminate gap during long surahs
  const nextAudioPreloadRef = useRef<HTMLAudioElement | null>(null);

  // Helper to compute global ayah number (1 to 6236) across the entire Qur'an
  const getGlobalAyahNumber = (surahNum: number, ayahNum: number): number => {
    let count = 0;
    for (const s of SURAH_LIST) {
      if (s.number < surahNum) {
        count += s.numberOfAyahs;
      } else {
        break;
      }
    }
    return count + ayahNum;
  };

  // Generate multi-CDN fallback candidates for any ayah
  const getAyahAudioCandidates = (surahNum: number, ayahNum: number, preferredUrl?: string): string[] => {
    const sPad = String(surahNum).padStart(3, '0');
    const aPad = String(ayahNum).padStart(3, '0');
    const globalAyah = getGlobalAyahNumber(surahNum, ayahNum);
    const list: string[] = [];
    if (preferredUrl) list.push(preferredUrl);
    // Source 1: EveryAyah Mishary Rashid Alafasy 128kbps (high reliability standard)
    list.push(`https://everyayah.com/data/Alafasy_128kbps/${sPad}${aPad}.mp3`);
    // Source 2: Quran.com Audio CDN mirror
    list.push(`https://verses.quran.com/Alafasy/mp3/${sPad}${aPad}.mp3`);
    // Source 3: Islamic Network CDN (global ayah index)
    list.push(`https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyah}.mp3`);
    return Array.from(new Set(list));
  };

  // Silently preload next ayah's audio while current verse is reciting to guarantee gapless transition
  const preloadNextAyah = (nextAyahNum: number) => {
    if (nextAyahNum <= verses.length) {
      const nextAyah = verses.find((v) => v.numberInSurah === nextAyahNum);
      const candidates = getAyahAudioCandidates(selectedSurah.number, nextAyahNum, nextAyah?.audioUrl);
      if (candidates.length > 0) {
        if (!nextAudioPreloadRef.current) {
          nextAudioPreloadRef.current = new Audio();
        }
        nextAudioPreloadRef.current.src = candidates[0];
        nextAudioPreloadRef.current.preload = 'auto';
        nextAudioPreloadRef.current.load();
      }
    }
  };

  // Get or initialize persistent audio element (reused across all verses to prevent Autoplay blocks)
  const getOrCreateAudio = (): HTMLAudioElement => {
    if (!audioRef.current) {
      const audio = new Audio();
      audioRef.current = audio;
    }
    return audioRef.current;
  };

  // Resilient Audio Controller: Supports full long surahs (e.g. Al-Baqarah 286 ayahs) without stopping
  const handlePlayAyahAudio = (ayahNumber: number, audioUrl?: string) => {
    if (currentPlayingAyah === ayahNumber && isPlayingAudio) {
      stopAudio();
      return;
    }

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    const candidates = getAyahAudioCandidates(selectedSurah.number, ayahNumber, audioUrl);
    currentCandidatesRef.current = candidates;
    candidateIndexRef.current = 0;

    playCandidateForAyah(ayahNumber, 0);
  };

  const playCandidateForAyah = (ayahNumber: number, candidateIdx: number) => {
    const audio = getOrCreateAudio();
    const candidateUrl = currentCandidatesRef.current[candidateIdx] || currentCandidatesRef.current[0];

    // Detach old listeners before loading new source
    audio.ontimeupdate = null;
    audio.onended = null;
    audio.onerror = null;

    audio.src = candidateUrl;
    audio.preload = 'auto';
    audio.volume = isAudioMuted ? 0 : audioVolume / 100;
    audio.load();

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
      acquireWakeLock();
      resetPlayerAutoHideTimer();

      // Preload next verse so long recitations never pause for buffering
      preloadNextAyah(ayahNumber + 1);

      // Setup MediaSession for background & lockscreen playback (informing OS that playback is continuous)
      if ('mediaSession' in navigator) {
        try {
          navigator.mediaSession.playbackState = 'playing';
          navigator.mediaSession.metadata = new MediaMetadata({
            title: `Ayat ${ayahNumber} • QS. ${selectedSurah.englishName}`,
            artist: 'Syekh Misyari Rasyid Al-Afasy',
            album: "Mushaf Al-Qur'an Indonesia",
          });
          navigator.mediaSession.setActionHandler('play', () => {
            audio.play().catch(console.warn);
          });
          navigator.mediaSession.setActionHandler('pause', () => {
            audio.pause();
            if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
          });
          navigator.mediaSession.setActionHandler('nexttrack', () => {
            if (ayahNumber < verses.length) {
              const nextAyah = verses.find((v) => v.numberInSurah === ayahNumber + 1);
              handlePlayAyahAudio(ayahNumber + 1, nextAyah?.audioUrl);
            }
          });
          navigator.mediaSession.setActionHandler('previoustrack', () => {
            if (ayahNumber > 1) {
              const prevAyah = verses.find((v) => v.numberInSurah === ayahNumber - 1);
              handlePlayAyahAudio(ayahNumber - 1, prevAyah?.audioUrl);
            }
          });
        } catch {
          // ignore
        }
      }
    }).catch((err) => {
      console.warn(`Autoplay or fetch error on candidate ${candidateIdx + 1} (${candidateUrl}) for Ayat ${ayahNumber}:`, err);
      tryNextCandidateOrSkip(ayahNumber, candidateIdx);
    });

    audio.onended = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      // Continuous playback for entire surah regardless of length (e.g. Al-Baqarah 286 ayahs)
      if (ayahNumber < verses.length) {
        const nextAyahNumber = ayahNumber + 1;
        const nextAyah = verses.find((v) => v.numberInSurah === nextAyahNumber);
        handlePlayAyahAudio(nextAyahNumber, nextAyah?.audioUrl);
      } else {
        stopAudio();
      }
    };

    audio.onerror = () => {
      console.warn(`Audio error on candidate ${candidateIdx + 1} for Ayat ${ayahNumber}`);
      tryNextCandidateOrSkip(ayahNumber, candidateIdx);
    };
  };

  const tryNextCandidateOrSkip = (ayahNumber: number, failedIdx: number) => {
    const nextIdx = failedIdx + 1;
    if (nextIdx < currentCandidatesRef.current.length) {
      candidateIndexRef.current = nextIdx;
      console.info(`Switching to backup audio mirror ${nextIdx + 1} for Ayat ${ayahNumber}...`);
      playCandidateForAyah(ayahNumber, nextIdx);
    } else {
      // All candidate mirrors failed for this single verse
      console.warn(`All audio sources unavailable for Surah ${selectedSurah.number} Ayat ${ayahNumber}. Auto-recovering to next verse.`);
      setAudioNotice(`Ayat ${ayahNumber} dialihkan otomatis karena jaringan audio, lanjut ayat ${ayahNumber + 1}...`);
      setTimeout(() => setAudioNotice(null), 3500);

      if (ayahNumber < verses.length) {
        const nextAyahNumber = ayahNumber + 1;
        const nextAyah = verses.find((v) => v.numberInSurah === nextAyahNumber);
        retryTimeoutRef.current = window.setTimeout(() => {
          handlePlayAyahAudio(nextAyahNumber, nextAyah?.audioUrl);
        }, 500);
      } else {
        stopAudio();
      }
    }
  };

  const handleSeekAyah = (targetPercent: number, targetTimeSec?: number) => {
    if (audioRef.current && !isNaN(audioRef.current.duration) && audioRef.current.duration > 0) {
      if (targetTimeSec !== undefined && targetTimeSec >= 0) {
        audioRef.current.currentTime = Math.min(audioRef.current.duration - 0.05, targetTimeSec);
      } else {
        const targetTime = (targetPercent / 100) * audioRef.current.duration;
        audioRef.current.currentTime = targetTime;
      }
    }
  };

  const stopAudio = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (playerAutoHideTimerRef.current) {
      clearTimeout(playerAutoHideTimerRef.current);
      playerAutoHideTimerRef.current = null;
    }
    setShowVolumeSlider(false);
    if (volumeHideTimerRef.current) {
      clearTimeout(volumeHideTimerRef.current);
      volumeHideTimerRef.current = null;
    }
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.playbackState = 'none';
      } catch {
        // ignore
      }
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.ontimeupdate = null;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.currentTime = 0;
    }
    setIsPlayingAudio(false);
    setCurrentPlayingAyah(null);
    setAudioProgress({ currentTime: 0, duration: 0, progressPercent: 0 });
    releaseWakeLock();
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
    if (arabicFontSize === 'normal') {
      return isLandscapeCompact
        ? 'text-lg sm:text-xl leading-normal tracking-normal'
        : 'text-xl sm:text-2xl lg:text-3xl leading-loose';
    }
    if (arabicFontSize === 'xlarge') {
      return isLandscapeCompact
        ? 'text-2xl sm:text-3xl leading-normal tracking-normal'
        : 'text-3xl sm:text-4xl lg:text-5xl leading-loose';
    }
    // large (default)
    return isLandscapeCompact
      ? 'text-xl sm:text-2.5xl leading-normal tracking-normal'
      : 'text-2xl sm:text-3xl lg:text-4xl leading-loose';
  };

  return (
    <div className={`transition-all ${isLandscapeOrFocus ? 'space-y-2' : 'space-y-6'}`}>
      {/* 3-Segment Sub-Nav: Hidden in compact landscape / focus mode to maximize reading viewport */}
      <div className={`bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs items-center justify-between gap-1.5 ${isLandscapeOrFocus ? 'hidden' : 'flex'}`}>
        <button
          id="quran-mode-mushaf"
          onClick={() => {
            setViewMode('mushaf');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            viewMode === 'mushaf'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/70'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Mushaf & Terjemahan</span>
        </button>

        <button
          id="quran-mode-shq"
          onClick={() => {
            setViewMode('shq');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            viewMode === 'shq'
              ? 'bg-amber-400 text-slate-950 shadow-xs ring-1 ring-amber-300 font-extrabold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/70'
          }`}
        >
          <Brain className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Hafal Qur'an (SHQ)</span>
        </button>

        <button
          id="quran-mode-mapping"
          onClick={() => {
            setViewMode('mapping');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            viewMode === 'mapping'
              ? 'bg-teal-600 text-white shadow-xs font-extrabold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/70'
          }`}
        >
          <Layers className="w-4 h-4 text-teal-500 dark:text-teal-400" />
          <span>Quran Mapping</span>
        </button>

        {/* Mode Quran Medis right beside Quran Mapping */}
        <button
          id="quran-mode-medis"
          onClick={() => {
            setViewMode('medis');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            viewMode === 'medis'
              ? 'bg-rose-600 text-white shadow-xs font-extrabold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/70'
          }`}
          title="Buka Pengetahuan Medis Al-Qur'an & Hadist Bergambar"
        >
          <HeartPulse className="w-4 h-4 text-rose-500 dark:text-rose-400" />
          <span>Quran Medis</span>
        </button>
      </div>

      {/* Mode 1: Hafal Qur'an SHQ (Terpadu di Al-Qur'an Indonesia) */}
      {viewMode === 'shq' && (
        <QuranMemorizeSHQView
          initialSurahNumber={selectedSurah.number}
          onNavigateToQuran={(surahNum) => {
            const s = SURAH_LIST.find((item) => item.number === surahNum);
            if (s) setSelectedSurah(s);
            setViewMode('mushaf');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onClose={() => {
            setViewMode('mushaf');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Mode 2: Quran Mapping (Terpadu di Al-Qur'an Indonesia) */}
      {viewMode === 'mapping' && (
        <QuranMappingView
          initialSurahNumber={selectedSurah.number}
          onNavigateToQuran={(surahNum) => {
            const s = SURAH_LIST.find((item) => item.number === surahNum);
            if (s) setSelectedSurah(s);
            setViewMode('mushaf');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Mode 3: Quran Medis (Terpadu di Al-Qur'an Indonesia) */}
      {viewMode === 'medis' && (
        <QuranMedisView
          onNavigateToQuran={(surahNum) => {
            const s = SURAH_LIST.find((item) => item.number === surahNum);
            if (s) setSelectedSurah(s);
            setViewMode('mushaf');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onClose={() => {
            setViewMode('mushaf');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Mode 3: Mushaf & Terjemahan */}
      {viewMode === 'mushaf' && (
        <>
          {/* Quran Header Toolbar (Hidden in compact landscape / focus mode to maximize reading space) */}
          <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex-col md:flex-row items-start md:items-center justify-between gap-4 ${isLandscapeOrFocus ? 'hidden' : 'p-5 flex'}`}>
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
          <button
            onClick={() => setViewMode('mapping')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            title="Buka 5 pilar kandungan & hikmah surah ini di Quran Mapping"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Quran Mapping</span>
          </button>

          {/* Open Quran Medis right beside Quran Mapping */}
          <button
            id="quran-toolbar-btn-medis"
            onClick={() => setViewMode('medis')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            title="Buka Pengetahuan Medis Al-Qur'an & Hadist Bergambar"
          >
            <HeartPulse className="w-3.5 h-3.5 text-rose-200" />
            <span>Quran Medis</span>
          </button>

          {/* Open Quran Memorize SHQ for this Surah */}
          <button
            id="quran-toolbar-btn-shq"
            onClick={() => setViewMode('shq')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-sm ring-1 ring-amber-300 transition-all cursor-pointer hover:scale-102 active:scale-98"
            title="Hafalkan surah ini dengan Metode SHQ (20-45 menit sehari)"
          >
            <Brain className="w-3.5 h-3.5 text-slate-950" />
            <span>Hafal (SHQ)</span>
          </button>

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

      {/* Quick Surah Navigator Bar: Immediately visible at top, compact in landscape */}
      <div className={`bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-wrap items-center justify-between gap-1.5 ${isLandscapeOrFocus ? 'p-1 sm:p-1.5' : 'p-2 sm:p-3'}`}>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handlePrevSurah}
            disabled={selectedSurah.number <= 1}
            className={`rounded-lg sm:rounded-xl text-xs font-semibold flex items-center gap-1 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer shrink-0 ${isLandscapeOrFocus ? 'px-2 py-1' : 'px-2.5 sm:px-3 py-2'}`}
            title="Surah Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden md:inline">Sebelumnya</span>
          </button>
        </div>

        <button
          onClick={() => setShowSurahModal(true)}
          className={`flex-1 min-w-[140px] max-w-md mx-auto flex items-center justify-between gap-1.5 sm:gap-2 px-2.5 rounded-lg sm:rounded-xl bg-emerald-50 hover:bg-emerald-100/90 dark:bg-emerald-950/50 dark:hover:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-100 transition-colors cursor-pointer group ${isLandscapeOrFocus ? 'py-1' : 'py-1.5 sm:py-2'}`}
          title="Klik untuk memilih langsung dari 114 surah tanpa scroll"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <span className={`rounded-md sm:rounded-lg bg-emerald-600 text-white font-extrabold flex items-center justify-center shrink-0 shadow-xs ${isLandscapeOrFocus ? 'w-5 h-5 text-[10px]' : 'w-7 h-7 text-xs'}`}>
              {selectedSurah.number}
            </span>
            <div className="text-left truncate">
              <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                <span>Surah {selectedSurah.englishName}</span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-normal hidden sm:inline">
                  ({selectedSurah.englishNameTranslation})
                </span>
              </div>
              {!isLandscapeOrFocus && (
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {selectedSurah.numberOfAyahs} Ayat • {selectedSurah.revelationType === 'Meccan' ? 'Makkiyyah' : 'Madaniyyah'}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-850 px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg border border-emerald-200 dark:border-emerald-800 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <span>Pilih</span>
            <ChevronDown className="w-3 h-3" />
          </div>
        </button>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleNextSurah}
            disabled={selectedSurah.number >= 114}
            className={`rounded-lg sm:rounded-xl text-xs font-semibold flex items-center gap-1 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer shrink-0 ${isLandscapeOrFocus ? 'px-2 py-1' : 'px-2.5 sm:px-3 py-2'}`}
            title="Surah Berikutnya"
          >
            <span className="hidden md:inline">Berikutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Quick Focus Mode Toggle (Hide menus for full reading space in landscape or portrait) */}
          <button
            onClick={toggleFocusMode}
            className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              activeFocusMode
                ? 'bg-amber-400 text-slate-950 shadow-xs ring-1 ring-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
            }`}
            title={activeFocusMode ? 'Matikan mode fokus (Tampilkan kembali menu)' : 'Aktifkan Mode Menyimak Penuh (Sembunyikan menu navigasi agar layar bersih)'}
          >
            {activeFocusMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden xs:inline">{activeFocusMode ? 'Menu Tersembunyi' : 'Fokus'}</span>
          </button>

          {/* Quick Tajwid Toggle */}
          <button
            onClick={() => setEnableTajwid(!enableTajwid)}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              enableTajwid
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
            }`}
            title="Pewarnaan tajwid"
          >
            <Sparkles className="w-3 h-3 inline mr-0.5" />
            <span className="hidden sm:inline">Tajwid</span>
          </button>

          {/* Quick Auto-Follow Toggle */}
          <button
            onClick={() => setAutoFollowAyah(!autoFollowAyah)}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              autoFollowAyah
                ? 'bg-amber-100 text-amber-950 border border-amber-300 dark:bg-amber-950/70 dark:text-amber-200'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
            }`}
            title="Layar otomatis mengikuti kata yang dibaca"
          >
            <span className={`w-1.5 h-1.5 rounded-full inline-block mr-1 ${autoFollowAyah ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'}`}></span>
            <span className="hidden sm:inline">Auto-Scroll</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Surah Selector List (Left 3 cols) & Verses Reading Area (Right 9 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Desktop Left Column: 114 Surahs Directory */}
        <div className={`${isLandscapeOrFocus ? 'hidden' : 'hidden lg:block lg:col-span-4 sticky top-20 space-y-3'}`}>
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

        {/* Right Column: Verses Reading Area (12 cols in landscape/focus, 8 cols on desktop standard) */}
        <div className={isLandscapeOrFocus ? 'col-span-12 space-y-2' : 'lg:col-span-8 space-y-4'}>
          {/* Bismillah Header (except for Surah At-Taubah #9) */}
          {selectedSurah.number !== 9 && (
            <div className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shadow-xs ${isLandscapeOrFocus ? 'rounded-xl p-2' : 'rounded-2xl p-6'}`}>
              <p
                dir="rtl"
                className={`${
                  quranFontStyle === 'amiri' ? 'font-quran-amiri' : 'font-quran-indonesia'
                } ${isLandscapeOrFocus ? 'text-xl sm:text-2xl leading-normal' : 'text-3xl sm:text-4xl leading-loose'} text-emerald-800 dark:text-emerald-300`}
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              {!isLandscapeOrFocus && (
                <p className="text-xs text-slate-500 italic mt-2">
                  Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang
                </p>
              )}
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
                    style={{
                      scrollMarginTop: isLandscapeOrFocus ? '45px' : '90px',
                      scrollMarginBottom: isLandscapeOrFocus ? '55px' : '110px',
                    }}
                    className={`scroll-margin-ayah bg-white dark:bg-slate-800 border transition-all ${
                      isLandscapeOrFocus ? 'rounded-xl p-2.5 sm:p-3.5 space-y-2' : 'rounded-2xl p-6 space-y-4'
                    } ${
                      isPlayingThis
                        ? 'border-amber-400 dark:border-amber-500 ring-2 ring-amber-400/40 shadow-lg bg-gradient-to-b from-amber-50/25 via-emerald-50/15 to-transparent dark:from-amber-950/20 dark:via-emerald-950/10'
                        : isBookmarked
                        ? 'border-amber-400 dark:border-amber-500/80 bg-amber-50/20'
                        : 'border-slate-200 dark:border-slate-700 shadow-xs hover:border-slate-300'
                    }`}
                  >
                    {/* Top action bar: Ayah number, Audio button, Bookmark button */}
                    <div className={`flex items-center justify-between border-b border-slate-100 dark:border-slate-750 ${isLandscapeOrFocus ? 'pb-1.5' : 'pb-3'}`}>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-lg font-bold flex items-center justify-center ${isLandscapeOrFocus ? 'w-6 h-6 text-[11px]' : 'w-7 h-7 text-xs'} ${
                          isPlayingThis
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {selectedSurah.number}:{ayah.numberInSurah}
                        </span>
                        {isPlayingThis && (
                          <span className="text-[10px] bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-amber-300 dark:border-amber-700">
                            <span className="flex h-1.5 w-1.5 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                            </span>
                            <span>{isLandscapeOrFocus ? 'Highlight' : 'Highlight Audio Real-Time'}</span>
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
                          className={`rounded-lg border text-xs flex items-center gap-1 cursor-pointer transition-colors ${isLandscapeOrFocus ? 'p-1 px-2 text-[10px]' : 'p-1.5'} ${
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
                          className={`rounded-lg border text-xs cursor-pointer transition-colors ${isLandscapeCompact ? 'p-1' : 'p-1.5'} ${
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
                      isLandscapeCompact ? (
                        /* Ultra-compact 1-line progress indicator in landscape mode so Arabic text is 100% visible */
                        <div className="bg-amber-50/90 dark:bg-amber-950/50 px-2 py-1 rounded-lg border border-amber-300 dark:border-amber-800/80 flex items-center justify-between gap-2 text-xs">
                          <span className="text-[10px] text-amber-900 dark:text-amber-200 font-semibold flex items-center gap-1 shrink-0">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <span>Sorotan Kata</span>
                          </span>
                          <div className="flex items-center gap-2 flex-1 max-w-xs justify-end">
                            <span className="font-mono text-[10px] font-bold text-amber-950 dark:text-amber-100 shrink-0">
                              {formatTime(audioProgress.currentTime)} / {formatTime(audioProgress.duration)}
                            </span>
                            <div className="w-20 sm:w-28 bg-amber-200 dark:bg-amber-900 h-1.5 rounded-full overflow-hidden shrink-0">
                              <div
                                className="bg-amber-500 h-full transition-all duration-150 rounded-full"
                                style={{ width: `${audioProgress.progressPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Standard timeline box for portrait & large screens */
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
                            <div className="pt-2 border-t border-amber-200/70 dark:border-amber-800/60 text-xs space-y-2 animate-in fade-in duration-150">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-amber-900 dark:text-amber-200 font-semibold">
                                  Penyetelan Waktu Highlight Teks (Sync Offset):
                                </span>
                                <span className="font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-700">
                                  {syncOffsetMs === 0 ? '0 ms (Standar Presisi)' : syncOffsetMs > 0 ? `+${syncOffsetMs} ms (Lebih Lambat)` : `${syncOffsetMs} ms (Lebih Cepat)`}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Pilihan Cepat:</span>
                                {[-200, -100, 0, 100, 200].map((preset) => (
                                  <button
                                    key={preset}
                                    onClick={() => handleUpdateSyncOffset(preset)}
                                    className={`px-2 py-0.5 rounded text-[10px] font-medium border cursor-pointer transition-colors ${
                                      syncOffsetMs === preset
                                        ? 'bg-amber-600 text-white border-amber-600 shadow-2xs font-bold'
                                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                                    }`}
                                  >
                                    {preset === 0 ? 'Normal (0ms)' : preset < 0 ? `${preset}ms (Maju Cepat)` : `+${preset}ms (Tahan Lambat)`}
                                  </button>
                                ))}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-500 font-mono shrink-0">-500ms</span>
                                <input
                                  type="range"
                                  min="-500"
                                  max="500"
                                  step="25"
                                  value={syncOffsetMs}
                                  onChange={(e) => handleUpdateSyncOffset(parseInt(e.target.value, 10))}
                                  className="w-full h-1.5 bg-amber-200 dark:bg-amber-800 rounded-lg appearance-none cursor-pointer accent-amber-600"
                                />
                                <span className="text-[10px] text-slate-500 font-mono shrink-0">+500ms</span>
                              </div>
                              <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                💡 <strong>Highlight terlalu lambat (tertinggal)?</strong> Geser ke minus (-). <strong>Highlight terlalu cepat (mendahului)?</strong> Geser ke plus (+). Pengaturan tersimpan otomatis.
                              </p>
                            </div>
                          )}
                        </div>
                      )
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
                        wordTimings={surahWordTimings[ayah.numberInSurah] || null}
                        enableTajwid={enableTajwid}
                        fontStyle={quranFontStyle}
                        fontSizeClass={getFontSizeClass()}
                        showAyahEndMarker={ayah.numberInSurah}
                        autoFollowWord={autoFollowAyah}
                        onWordClick={isPlayingThis ? (_idx, pct, sec) => handleSeekAyah(pct, sec) : undefined}
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
        </>
      )}

      {/* Floating Audio Notice Toast (Shows non-blocking status e.g. automatic network recovery) */}
      {audioNotice && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-full shadow-2xl border border-amber-300 animate-in fade-in flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0" />
          <span>{audioNotice}</span>
        </div>
      )}

      {/* Minimized Floating Audio Pill (Compact, neatly screen-bounded, never covers text) */}
      {isPlayingAudio && currentPlayingAyah && isPlayerMinimized && (
        <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 z-40 animate-in fade-in zoom-in-95 max-w-[calc(100vw-1rem)]">
          <div className="bg-slate-900/95 dark:bg-slate-850/95 text-white backdrop-blur-md border border-amber-400/80 rounded-full px-2.5 py-1.5 shadow-2xl flex items-center gap-1.5 text-xs">
            <button
              onClick={() => {
                const el =
                  document.getElementById('active-quran-reading-word') ||
                  document.getElementById(`ayah-${currentPlayingAyah}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="flex items-center gap-1 font-bold cursor-pointer hover:text-amber-300 transition-colors shrink-0"
              title="Arahkan ke ayat yang sedang dibaca"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span className="text-[11px] font-mono font-black">{selectedSurah.number}:{currentPlayingAyah}</span>
            </button>

            <button
              onClick={() => handlePlayAyahAudio(currentPlayingAyah)}
              className="p-1 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer transition-colors shrink-0"
              title={isPlayingAudio ? 'Jeda Audio' : 'Lanjutkan Audio'}
            >
              {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            {/* Quick Volume / Mute button */}
            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="p-1 rounded-full hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer transition-colors shrink-0"
              title={isAudioMuted ? 'Audio bisu (Muted) - Ketuk untuk bunyikan' : `Volume: ${audioVolume}% (Ketuk untuk bisukan)`}
            >
              {isAudioMuted || audioVolume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-amber-300" />
              )}
            </button>

            {/* Expand button to restore full controls */}
            <button
              onClick={() => {
                setIsPlayerMinimized(false);
                resetPlayerAutoHideTimer();
              }}
              className="p-1 rounded-full hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer transition-colors shrink-0"
              title="Buka panel audio lengkap"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Sticky Audio Listening Bar: Perfectly sized, never overflows screen, with responsive layout */}
      {isPlayingAudio && currentPlayingAyah && !isPlayerMinimized && (
        <aside
          aria-label="Panel Audio & Highlight Aktif"
          onMouseEnter={resetPlayerAutoHideTimer}
          onTouchStart={resetPlayerAutoHideTimer}
          className={`fixed left-2 right-2 max-w-lg mx-auto z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-amber-300 dark:border-amber-700/80 rounded-2xl shadow-xl transition-all animate-in slide-in-from-bottom-2 duration-200 box-border ${
            isLandscapeOrFocus
              ? 'bottom-1 py-1.5 px-2.5 flex items-center justify-between gap-1 text-xs'
              : 'bottom-14 sm:bottom-4 px-2.5 py-2 sm:py-2.5 flex items-center justify-between gap-1.5'
          }`}
        >
          {/* Left: Ayah info & direct scroll */}
          <button
            onClick={() => {
              const el =
                document.getElementById('active-quran-reading-word') ||
                document.getElementById(`ayah-${currentPlayingAyah}`);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            className="flex items-center gap-1.5 text-left cursor-pointer group shrink-0"
            title="Klik untuk langsung mengarahkan layar ke ayat yang sedang dilafalkan"
          >
            <div className="px-2 py-1 sm:px-2.5 sm:py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[11px] sm:text-xs flex items-center gap-1 shadow-xs group-hover:scale-105 transition-transform">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>{selectedSurah.number}:{currentPlayingAyah}</span>
            </div>
            <div className="hidden md:block truncate max-w-[120px]">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                QS. {selectedSurah.englishName}
              </p>
              <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                Menyimak
              </p>
            </div>
          </button>

          {/* Center: Recitation Controls (Prev Ayah, Play/Pause, Next Ayah, Stop) */}
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <button
              onClick={() => {
                if (currentPlayingAyah > 1) {
                  const prevAyah = verses.find((v) => v.numberInSurah === currentPlayingAyah - 1);
                  handlePlayAyahAudio(currentPlayingAyah - 1, prevAyah?.audioUrl);
                }
              }}
              disabled={currentPlayingAyah <= 1}
              className="p-1 sm:p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
              title="Ayat Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => handlePlayAyahAudio(currentPlayingAyah)}
              className="p-1.5 sm:p-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-xs cursor-pointer transition-all active:scale-95"
              title={isPlayingAudio ? 'Jeda Audio' : 'Lanjutkan Audio'}
            >
              {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                if (currentPlayingAyah < verses.length) {
                  const nextAyah = verses.find((v) => v.numberInSurah === currentPlayingAyah + 1);
                  handlePlayAyahAudio(currentPlayingAyah + 1, nextAyah?.audioUrl);
                }
              }}
              disabled={currentPlayingAyah >= verses.length}
              className="p-1 sm:p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
              title="Ayat Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={stopAudio}
              className="p-1 sm:p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
              title="Hentikan Audio"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right: Auto-follow, Volume with Auto-Hide popover, and Auto-Hide / Minimize button */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Auto-follow toggle */}
            <button
              onClick={() => setAutoFollowAyah(!autoFollowAyah)}
              className={`p-1.5 sm:px-2 sm:py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 cursor-pointer transition-colors ${
                autoFollowAyah
                  ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
              title={autoFollowAyah ? 'Auto-scroll aktif: Layar otomatis mengikuti ayat yang dilafalkan' : 'Auto-scroll nonaktif'}
            >
              <span className={`w-2 h-2 rounded-full ${autoFollowAyah ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'}`} />
              <span className="hidden sm:inline">Ikuti</span>
            </button>

            {/* Volume Control Button with Auto-Hiding Slider Popover */}
            <div ref={volumeContainerRef} className="relative flex items-center">
              <button
                onClick={handleToggleVolumeSlider}
                className={`p-1.5 sm:p-1.5 rounded-lg border text-xs flex items-center justify-center cursor-pointer transition-colors ${
                  showVolumeSlider
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : isAudioMuted || audioVolume === 0
                    ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                title={isAudioMuted ? 'Audio bisu (Muted) - Ketuk untuk bunyikan' : `Volume: ${audioVolume}% (Ketuk untuk atur / otomatis sembunyi)`}
              >
                {isAudioMuted || audioVolume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : audioVolume < 50 ? (
                  <Volume1 className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              {/* Auto-Hiding Volume Slider Popover (Closes automatically after 3s of inactivity or click outside) */}
              {showVolumeSlider && (
                <div
                  onMouseEnter={() => {
                    if (volumeHideTimerRef.current) clearTimeout(volumeHideTimerRef.current);
                  }}
                  onMouseLeave={() => resetVolumeHideTimer()}
                  className="absolute bottom-full mb-2 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl border border-amber-300 dark:border-amber-700/80 shadow-2xl flex flex-col items-center gap-2.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 w-48 max-w-[calc(100vw-2rem)] box-border"
                >
                  <div className="flex items-center justify-between w-full text-[11px] font-bold text-slate-800 dark:text-slate-200">
                    <span className="flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                      <span>Volume Audio</span>
                    </span>
                    <span className="font-mono text-amber-600 dark:text-amber-400 font-black">
                      {isAudioMuted ? 'MUTE' : `${audioVolume}%`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full">
                    <button
                      onClick={() => {
                        setIsAudioMuted(!isAudioMuted);
                        resetVolumeHideTimer();
                      }}
                      className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer shrink-0"
                      title={isAudioMuted ? 'Bunyikan kembali' : 'Bisukan (Mute)'}
                    >
                      {isAudioMuted || audioVolume === 0 ? (
                        <VolumeX className="w-4 h-4 text-rose-500" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={isAudioMuted ? 0 : audioVolume}
                      onChange={(e) => handleVolumeChange(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  {/* Auto-Hide player toggle option */}
                  <div className="w-full pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 dark:text-slate-400">Auto-hide bar:</span>
                    <button
                      onClick={toggleAutoHidePlayer}
                      className={`px-1.5 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                        autoHidePlayer
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                      title={autoHidePlayer ? 'Player otomatis mengecil saat membaca' : 'Player tetap tampil penuh'}
                    >
                      {autoHidePlayer ? 'AKTIF (5s)' : 'NONAKTIF'}
                    </button>
                  </div>

                  <span className="text-[9px] text-slate-400 dark:text-slate-500 text-center italic">
                    Otomatis hide setelah 3 detik
                  </span>
                </div>
              )}
            </div>

            {/* Sync Offset calibrator button (compact) */}
            <button
              onClick={() => setShowSyncTuner(!showSyncTuner)}
              className="p-1.5 rounded-lg text-[10px] font-semibold border bg-white dark:bg-slate-800 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer flex items-center gap-0.5"
              title="Kalibrasi sinkronisasi audio (- / + ms)"
            >
              <SlidersHorizontal className="w-3 h-3" />
              {syncOffsetMs !== 0 && (
                <span className="font-mono text-[9px]">{syncOffsetMs > 0 ? '+' : ''}{syncOffsetMs}ms</span>
              )}
            </button>

            {/* Auto-Hide / Minimize Player button */}
            <button
              onClick={() => setIsPlayerMinimized(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              title="Ciutkan player (Auto-hide agar layar bersih)"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

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
