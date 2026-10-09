import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Brain,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  BookOpen,
  Layers,
  Flame,
  Trophy,
  ArrowRight,
  Check,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  Sliders,
  Info,
  ShieldCheck,
  Bookmark,
  Share2,
  X,
  Target,
  FileText,
  HelpCircle,
  Headphones,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SURAH_LIST, fetchSurahVerses, LOCAL_SURAHS_MAP } from '../data/quranData';
import { QuranAyah, QuranSurah } from '../types';
import { renderTajwidText } from '../utils/tajwidHighlighter';

interface QuranMemorizeSHQViewProps {
  initialSurahNumber?: number;
  onNavigateToQuran?: (surahNumber: number) => void;
  onClose?: () => void;
}

export type SHQStep = 'map' | 'audio' | 'recall' | 'checkin';

export interface RetentionItem {
  id: string; // e.g. "surah-78-ayah-1"
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  stage: number; // 1: H+1, 2: H+3, 3: H+7, 4: H+14, 5: H+30 (Mutqin)
  nextReviewDate: string; // YYYY-MM-DD
  lastReviewedDate: string;
  repetitionCount: number;
  status: 'due' | 'waiting' | 'graduated';
}

export interface SHQPlan {
  targetSurahNumber: number;
  startAyah: number;
  dailyAyahTarget: number; // 1, 2, 3, or 5
  dailyMinutesTarget: number; // 20, 30, or 45
  pace: 'santai' | 'sedang' | 'cepat';
  startDate: string;
}

export const QuranMemorizeSHQView: React.FC<QuranMemorizeSHQViewProps> = ({
  initialSurahNumber = 78, // Default to An-Naba' (Juz 30)
  onNavigateToQuran,
  onClose,
}) => {
  // 1. User Plan State
  const [plan, setPlan] = useState<SHQPlan>(() => {
    try {
      const saved = localStorage.getItem('oase_shq_plan');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      targetSurahNumber: initialSurahNumber || 78,
      startAyah: 1,
      dailyAyahTarget: 3,
      dailyMinutesTarget: 30,
      pace: 'sedang',
      startDate: new Date().toISOString().split('T')[0],
    };
  });

  // Current selected surah for active session
  const [selectedSurah, setSelectedSurah] = useState<QuranSurah>(() => {
    return (
      SURAH_LIST.find((s) => s.number === plan.targetSurahNumber) ||
      SURAH_LIST.find((s) => s.number === 78) ||
      SURAH_LIST[0]
    );
  });

  const [verses, setVerses] = useState<QuranAyah[]>([]);
  const [isLoadingVerses, setIsLoadingVerses] = useState<boolean>(true);

  // Active view tab: 'session' (Sesi Terpandu) | 'retention' (Jam Retensi) | 'grid' (Grid 90 Hari) | 'plan' (Rencana) | 'guide' (Metode)
  const [activeTab, setActiveTab] = useState<'session' | 'retention' | 'grid' | 'plan' | 'guide'>('session');

  // Guided 4-Step Session States
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<SHQStep>('map');
  const [currentAyahIndex, setCurrentAyahIndex] = useState<number>(0);
  const [stepTimerSeconds, setStepTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Audio Repeat State
  const [repeatTarget, setRepeatTarget] = useState<number>(5); // 3x, 5x, 10x loop
  const [currentRepeatCount, setCurrentRepeatCount] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Active Recall States
  const [recallMode, setRecallMode] = useState<'blanking' | 'blind'>('blanking');
  const [revealedWords, setRevealedWords] = useState<Set<number>>(new Set());
  const [isBlindRevealed, setIsBlindRevealed] = useState<boolean>(false);

  // Retention (Spaced Repetition) Database
  const [retentionItems, setRetentionItems] = useState<RetentionItem[]>(() => {
    try {
      const saved = localStorage.getItem('oase_shq_retention');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default initial mock items to show the system immediately
    const today = new Date().toISOString().split('T')[0];
    return [
      {
        id: 'surah-78-ayah-1',
        surahNumber: 78,
        surahName: 'An-Naba',
        ayahNumber: 1,
        stage: 2,
        nextReviewDate: today,
        lastReviewedDate: today,
        repetitionCount: 6,
        status: 'due',
      },
      {
        id: 'surah-78-ayah-2',
        surahNumber: 78,
        surahName: 'An-Naba',
        ayahNumber: 2,
        stage: 1,
        nextReviewDate: today,
        lastReviewedDate: today,
        repetitionCount: 4,
        status: 'due',
      },
    ];
  });

  // History & Habit Tracker (90 Days)
  const [completedDays, setCompletedDays] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('oase_shq_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    const today = new Date().toISOString().split('T')[0];
    return [today];
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('oase_shq_plan', JSON.stringify(plan));
    } catch {
      // ignore
    }
  }, [plan]);

  useEffect(() => {
    try {
      localStorage.setItem('oase_shq_retention', JSON.stringify(retentionItems));
    } catch {
      // ignore
    }
  }, [retentionItems]);

  useEffect(() => {
    try {
      localStorage.setItem('oase_shq_history', JSON.stringify(completedDays));
    } catch {
      // ignore
    }
  }, [completedDays]);

  // Load Verses when selectedSurah changes
  useEffect(() => {
    let isMounted = true;
    setIsLoadingVerses(true);

    fetchSurahVerses(selectedSurah.number)
      .then((data) => {
        if (isMounted) {
          setVerses(data);
          setIsLoadingVerses(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setVerses(LOCAL_SURAHS_MAP[selectedSurah.number] || []);
          setIsLoadingVerses(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedSurah]);

  // Current active verse being memorized
  const activeVerse: QuranAyah | undefined = verses[currentAyahIndex];

  // Retention items due today
  const todayStr = new Date().toISOString().split('T')[0];
  const dueItems = useMemo(() => {
    return retentionItems.filter((item) => item.nextReviewDate <= todayStr && item.stage < 5);
  }, [retentionItems, todayStr]);

  const graduatedItems = useMemo(() => {
    return retentionItems.filter((item) => item.stage >= 5);
  }, [retentionItems]);

  // Step timer runner
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setStepTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Format seconds to mm:ss
  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Start guided session
  const handleStartSession = () => {
    setIsSessionActive(true);
    setCurrentStep('map');
    setCurrentAyahIndex(0);
    setStepTimerSeconds(0);
    setIsTimerRunning(true);
    setCurrentRepeatCount(0);
    setRevealedWords(new Set());
    setIsBlindRevealed(false);
  };

  // Audio Playback Handler with Auto-Repeat Counter
  const handlePlayAudio = () => {
    if (!activeVerse) return;

    if (!audioRef.current) {
      const audioUrl =
        activeVerse.audioUrl ||
        `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${activeVerse.number}.mp3`;
      audioRef.current = new Audio(audioUrl);

      audioRef.current.onended = () => {
        setCurrentRepeatCount((prev) => {
          const next = prev + 1;
          if (next < repeatTarget) {
            // Loop again
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(() => {});
            }
            return next;
          } else {
            setIsPlayingAudio(false);
            return next;
          }
        });
      };
    }

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlayingAudio(true);
    }
  };

  // Stop audio on unmount or ayah change
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentAyahIndex, currentStep]);

  // Step 4 Check-in Rating Handler
  const handleCheckinRating = (rating: 'mutqin' | 'ragu' | 'ulang') => {
    if (!activeVerse) return;

    const itemId = `surah-${selectedSurah.number}-ayah-${activeVerse.numberInSurah}`;
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];

    // Compute next interval date based on rating
    let nextStage = 1;
    let daysToAdd = 1;

    const existingIndex = retentionItems.findIndex((i) => i.id === itemId);
    const currentStage = existingIndex >= 0 ? retentionItems[existingIndex].stage : 0;

    if (rating === 'mutqin') {
      nextStage = Math.min(5, currentStage + 1);
      // Spaced intervals: Stage 1 = +1 day, Stage 2 = +3 days, Stage 3 = +7 days, Stage 4 = +14 days, Stage 5 = +30 days (Mutqin)
      const intervals = [1, 3, 7, 14, 30];
      daysToAdd = intervals[nextStage - 1] || 7;
    } else if (rating === 'ragu') {
      nextStage = Math.max(1, currentStage);
      daysToAdd = 1; // Review again tomorrow
    } else {
      nextStage = 1;
      daysToAdd = 1;
    }

    const nextDate = new Date();
    nextDate.setDate(today.getDate() + daysToAdd);
    const nextDateFormatted = nextDate.toISOString().split('T')[0];

    const updatedItem: RetentionItem = {
      id: itemId,
      surahNumber: selectedSurah.number,
      surahName: selectedSurah.englishName,
      ayahNumber: activeVerse.numberInSurah,
      stage: nextStage,
      nextReviewDate: nextDateFormatted,
      lastReviewedDate: todayFormatted,
      repetitionCount: (existingIndex >= 0 ? retentionItems[existingIndex].repetitionCount : 0) + 1,
      status: nextStage >= 5 ? 'graduated' : 'waiting',
    };

    setRetentionItems((prev) => {
      const filtered = prev.filter((i) => i.id !== itemId);
      return [...filtered, updatedItem];
    });

    // Move to next ayah in daily target or complete session
    if (currentAyahIndex + 1 < plan.dailyAyahTarget && currentAyahIndex + 1 < verses.length) {
      setCurrentAyahIndex((prev) => prev + 1);
      setCurrentStep('map');
      setStepTimerSeconds(0);
      setCurrentRepeatCount(0);
      setRevealedWords(new Set());
      setIsBlindRevealed(false);
    } else {
      // Completed daily session!
      setIsSessionActive(false);
      setIsTimerRunning(false);

      if (!completedDays.includes(todayFormatted)) {
        setCompletedDays((prev) => [...prev, todayFormatted]);
      }

      // Celebratory confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  // Review Due Item Handler in Jam Retensi
  const handleReviewDueItem = (item: RetentionItem) => {
    const surah = SURAH_LIST.find((s) => s.number === item.surahNumber);
    if (surah) {
      setSelectedSurah(surah);
      setCurrentAyahIndex(item.ayahNumber - 1);
      setIsSessionActive(true);
      setCurrentStep('recall'); // Jump straight to active recall
      setActiveTab('session');
    }
  };

  // Estimated Khatam Calculation
  const estimatedKhatamInfo = useMemo(() => {
    const totalAyahsInTarget = selectedSurah.numberOfAyahs;
    const remainingAyahs = Math.max(0, totalAyahsInTarget - graduatedItems.length);
    const daysNeeded = Math.ceil(remainingAyahs / (plan.dailyAyahTarget || 3));

    const estDate = new Date();
    estDate.setDate(estDate.getDate() + daysNeeded);

    return {
      daysNeeded,
      dateFormatted: estDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    };
  }, [selectedSurah, graduatedItems, plan.dailyAyahTarget]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 1. HERO HEADER: METODE SHQ (SISTEM HAFAL QURAN) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 text-white p-5 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Metode SHQ: Spaced Sensory Integration</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold">
                Anti Ember Bocor
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Sistem Hafal Qur'an Terpandu{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-amber-300">
                (20–45 Menit Sehari)
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Didesain khusus untuk cara kerja otak orang dewasa: menghafal bukan dengan pengulangan buta tanpa henti, melainkan melalui <strong>jangkar lokasi mushaf</strong>, <strong>pemahaman makna</strong>, dan <strong>Jam Retensi Spaced Repetition</strong> otomatis.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex md:flex-col items-center justify-between gap-3 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center font-black">
                <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Streak Hafalan
                </span>
                <span className="text-base sm:text-lg font-black font-mono text-white">
                  {completedDays.length} Hari
                </span>
              </div>
            </div>

            <div className="h-8 w-px bg-white/10 md:hidden" />

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-black">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Hafalan Mutqin
                </span>
                <span className="text-base sm:text-lg font-black font-mono text-emerald-300">
                  {graduatedItems.length} Ayat
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TAB NAVIGATION BAR */}
      <div className="bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-wrap gap-1 shadow-xs">
        <button
          onClick={() => setActiveTab('session')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'session'
              ? 'bg-emerald-600 text-white shadow-xs font-bold ring-2 ring-emerald-500/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Brain className="w-4 h-4 text-amber-300" />
          <span>Sesi Hari Ini</span>
        </button>

        <button
          onClick={() => setActiveTab('retention')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'retention'
              ? 'bg-emerald-600 text-white shadow-xs font-bold ring-2 ring-emerald-500/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Jam Retensi</span>
          {dueItems.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
              {dueItems.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('grid')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'grid'
              ? 'bg-emerald-600 text-white shadow-xs font-bold ring-2 ring-emerald-500/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Grid 90 Hari & Peta</span>
        </button>

        <button
          onClick={() => setActiveTab('plan')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'plan'
              ? 'bg-emerald-600 text-white shadow-xs font-bold ring-2 ring-emerald-500/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Rencana</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'guide'
              ? 'bg-emerald-600 text-white shadow-xs font-bold ring-2 ring-emerald-500/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Buku Metode</span>
        </button>
      </div>

      {/* 3. TAB 1: SESI HARI INI (PRACTICE WORKSPACE) */}
      {activeTab === 'session' && (
        <div className="space-y-6">
          {/* Due Today Alert Banner if any */}
          {dueItems.length > 0 && !isSessionActive && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                    Ada {dueItems.length} Ayat Jatuh Tempo Review Hari Ini!
                  </h4>
                  <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                    Muraja'ah sejenak di Jam Retensi agar hafalan lama tidak bocor sebelum menambah ayat baru.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('retention')}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 cursor-pointer transition-all shadow-md"
              >
                Buka Jam Retensi
              </button>
            </div>
          )}

          {/* If Session NOT Active: Start Dashboard Card */}
          {!isSessionActive && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                <BookOpen className="w-10 h-10" />
              </div>

              <div className="space-y-2 max-w-lg">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block">
                  Target Hari Ini: {selectedSurah.englishName} ({selectedSurah.name})
                </span>
                <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                  Hafalkan Ayat 1 s.d. {Math.min(plan.dailyAyahTarget, selectedSurah.numberOfAyahs)}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Porsi harian terstruktur: <strong>{plan.dailyAyahTarget} ayat</strong> (~{plan.dailyMinutesTarget} menit). Menggunakan 4 langkah SSI: Petakan Lokasi, Murottal Berulang, Uji Active Recall, dan Check-in Mutqin.
                </p>
              </div>

              {/* Start Button */}
              <button
                onClick={handleStartSession}
                className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-emerald-900/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Brain className="w-5 h-5 text-amber-300" />
                <span>Mulai Sesi Terpandu Hari Ini</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              {/* Surah Selector Quick Dropdown */}
              <div className="flex items-center gap-2 pt-2 text-xs text-slate-500">
                <span>Ingin surah lain?</span>
                <select
                  value={selectedSurah.number}
                  onChange={(e) => {
                    const found = SURAH_LIST.find((s) => s.number === Number(e.target.value));
                    if (found) {
                      setSelectedSurah(found);
                      setPlan((prev) => ({ ...prev, targetSurahNumber: found.number }));
                    }
                  }}
                  className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-600 cursor-pointer"
                >
                  {SURAH_LIST.map((s) => (
                    <option key={s.number} value={s.number}>
                      {s.number}. {s.englishName} ({s.numberOfAyahs} ayat)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* If Session ACTIVE: The 4-Step Guided Experience */}
          {isSessionActive && activeVerse && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
              {/* Session Top Bar: Step Navigation & Timer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                    {currentAyahIndex + 1}/{plan.dailyAyahTarget}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                      {selectedSurah.englishName} : Ayat {activeVerse.numberInSurah}
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      Surah ke-{selectedSurah.number} • {selectedSurah.revelationType}
                    </span>
                  </div>
                </div>

                {/* 4-Step Breadcrumbs */}
                <div className="flex items-center gap-1.5">
                  {[
                    { id: 'map', label: '1. Petakan' },
                    { id: 'audio', label: '2. Murottal' },
                    { id: 'recall', label: '3. Uji Ingatan' },
                    { id: 'checkin', label: '4. Check-in' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setCurrentStep(st.id as SHQStep)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentStep === st.id
                          ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/20'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

                {/* Live Step Timer */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 font-mono text-xs font-bold text-slate-700 dark:text-slate-200">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{formatTimer(stepTimerSeconds)}</span>
                </div>
              </div>

              {/* STEP 1: PETAKAN LOKASI & MAKNA (VISUAL & TADABBUR) */}
              {currentStep === 'map' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                    <span className="text-[11px] font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-wider">
                      Langkah 1: Jangkar Visual & Makna
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Otak orang dewasa mengingat lewat <strong>arsip lokasi & arti</strong>. Lihat posisi ayat ini di surah, cermati bentuk kaligrafinya, dan resapi artinya sebelum mulai melafalkan.
                    </p>
                  </div>

                  {/* Big Arabic Text Display */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-center space-y-4">
                    <p
                      dir="rtl"
                      className="font-indonesia text-3xl sm:text-4xl text-slate-900 dark:text-white leading-[2.2]"
                    >
                      {renderTajwidText(activeVerse.text)}
                    </p>

                    {activeVerse.transliteration && (
                      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 italic">
                        {activeVerse.transliteration}
                      </p>
                    )}

                    <div className="max-w-xl mx-auto border-t border-slate-200 dark:border-slate-700 pt-3">
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        "{activeVerse.translation}"
                      </p>
                    </div>
                  </div>

                  {/* Memory Hook Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 space-y-1">
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        📍 Posisi Ayat:
                      </span>
                      <p className="text-slate-600 dark:text-slate-300">
                        Ayat ke-{activeVerse.numberInSurah} dari {selectedSurah.numberOfAyahs} ayat di Surah {selectedSurah.englishName}.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 space-y-1">
                      <span className="font-bold text-amber-500 flex items-center gap-1">
                        💡 Intisari Kata Kunci:
                      </span>
                      <p className="text-slate-600 dark:text-slate-300">
                        Fokus pada kata awal dan akhir ayat sebagai penanda sambungan ke ayat berikutnya.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setCurrentStep('audio')}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>Lanjut ke Langkah 2: Murottal</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: MUROTTAL & RESAPI (AUDITORI DENGAN LOOP) */}
              {currentStep === 'audio' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 space-y-1">
                    <span className="text-[11px] font-black uppercase text-sky-700 dark:text-sky-400 tracking-wider">
                      Langkah 2: Input Suara (Murottal Berulang)
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Dengarkan qari melafalkan ayat ini sebanyak 3x, 5x, atau 10x. Ikuti dalam hati pada putaran 1-2, lalu tirukan bersuara pelan pada putaran 3 ke atas.
                    </p>
                  </div>

                  {/* Audio Loop Player Console */}
                  <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-6 text-center shadow-inner">
                    <div className="space-y-2">
                      <span className="text-xs font-mono text-emerald-400">
                        Putaran: {currentRepeatCount} dari {repeatTarget} kali
                      </span>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden max-w-xs mx-auto">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-300"
                          style={{
                            width: `${Math.min(100, (currentRepeatCount / repeatTarget) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <p
                      dir="rtl"
                      className="font-indonesia text-2xl sm:text-3xl text-emerald-300 leading-relaxed"
                    >
                      {activeVerse.text}
                    </p>

                    {/* Audio Controls */}
                    <div className="flex items-center justify-center gap-4">
                      {/* Repeat target pills */}
                      <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl">
                        {[3, 5, 10].map((num) => (
                          <button
                            key={num}
                            onClick={() => {
                              setRepeatTarget(num);
                              setCurrentRepeatCount(0);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                              repeatTarget === num
                                ? 'bg-emerald-600 text-white'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {num}x
                          </button>
                        ))}
                      </div>

                      {/* Play/Pause Button */}
                      <button
                        onClick={handlePlayAudio}
                        className="w-14 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        {isPlayingAudio ? (
                          <Pause className="w-6 h-6 fill-current" />
                        ) : (
                          <Play className="w-6 h-6 fill-current ml-1" />
                        )}
                      </button>

                      {/* Reset Loop */}
                      <button
                        onClick={() => setCurrentRepeatCount(0)}
                        className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                        title="Ulangi dari putaran 0"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      Lantunan Qari: Syaikh Misyari Rasyid Al-Afasy (Tartil Tajwid Standar)
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => setCurrentStep('map')}
                      className="text-xs text-slate-500 hover:text-slate-800 font-bold"
                    >
                      ← Kembali ke Langkah 1
                    </button>
                    <button
                      onClick={() => setCurrentStep('recall')}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>Lanjut ke Langkah 3: Uji Ingatan</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: UJI INGATAN AKTIF & BLANKING (ACTIVE RECALL) */}
              {currentStep === 'recall' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1">
                    <span className="text-[11px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">
                      Langkah 3: Uji Ingatan Aktif (Active Recall)
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Tanpa melihat mushaf lengkap, paksa otak Anda menarik kembali ingatan kata demi kata. Anda bisa memilih <strong>Mode Tutup Kata</strong> atau <strong>Mode Tutup Penuh</strong>.
                    </p>
                  </div>

                  {/* Mode Switcher */}
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setRecallMode('blanking')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        recallMode === 'blanking'
                          ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Tutup Sebagian Kata (Blanking)
                    </button>
                    <button
                      onClick={() => setRecallMode('blind')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        recallMode === 'blind'
                          ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Tutup Seluruh Ayat (Blind Recall)
                    </button>
                  </div>

                  {/* Blanking Practice Area */}
                  {recallMode === 'blanking' && (
                    <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center space-y-4">
                      <p className="text-xs text-slate-400 mb-2">
                        Sentuh kotak abu-abu untuk membuka kata yang disembunyikan:
                      </p>

                      <div
                        dir="rtl"
                        className="font-indonesia text-2xl sm:text-3xl text-slate-900 dark:text-white leading-[2.4] flex flex-wrap justify-center gap-2"
                      >
                        {activeVerse.text.split(' ').map((word, wIdx) => {
                          const isHiddenByDefault = wIdx % 2 === 1; // hide every alternate word
                          const isShown = !isHiddenByDefault || revealedWords.has(wIdx);

                          return (
                            <span
                              key={wIdx}
                              onClick={() => {
                                const nextSet = new Set(revealedWords);
                                if (nextSet.has(wIdx)) nextSet.delete(wIdx);
                                else nextSet.add(wIdx);
                                setRevealedWords(nextSet);
                              }}
                              className={`cursor-pointer px-2 py-0.5 rounded-lg transition-all ${
                                isShown
                                  ? 'bg-transparent text-slate-900 dark:text-white'
                                  : 'bg-slate-300 dark:bg-slate-700 text-transparent select-none hover:bg-amber-400/50'
                              }`}
                            >
                              {word}
                            </span>
                          );
                        })}
                      </div>

                      <div className="pt-4 flex justify-center gap-3">
                        <button
                          onClick={() => {
                            // Reveal all words
                            const allIdx = new Set(activeVerse.text.split(' ').map((_, i) => i));
                            setRevealedWords(allIdx);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold"
                        >
                          Buka Semua Kata
                        </button>
                        <button
                          onClick={() => setRevealedWords(new Set())}
                          className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold"
                        >
                          Tutup Kembali
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Blind Recall Area */}
                  {recallMode === 'blind' && (
                    <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white text-center space-y-5">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
                        Lafalkan ayat {activeVerse.numberInSurah} sepenuhnya dari ingatan Anda:
                      </span>

                      {!isBlindRevealed ? (
                        <div className="py-10 flex flex-col items-center justify-center space-y-3">
                          <EyeOff className="w-12 h-12 text-slate-600" />
                          <p className="text-sm font-semibold text-slate-400">
                            Ayat sedang disembunyikan. Bacalah bersuara sekarang...
                          </p>
                          <button
                            onClick={() => setIsBlindRevealed(true)}
                            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg transition-all"
                          >
                            Buka Teks untuk Cek Hafalan Anda
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4 animate-in zoom-in-95">
                          <p
                            dir="rtl"
                            className="font-indonesia text-3xl sm:text-4xl text-emerald-300 leading-[2.2]"
                          >
                            {activeVerse.text}
                          </p>
                          <p className="text-xs text-slate-300 italic">
                            "{activeVerse.translation}"
                          </p>
                          <button
                            onClick={() => setIsBlindRevealed(false)}
                            className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 font-semibold"
                          >
                            Tutup Kembali
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => setCurrentStep('audio')}
                      className="text-xs text-slate-500 hover:text-slate-800 font-bold"
                    >
                      ← Kembali ke Langkah 2
                    </button>
                    <button
                      onClick={() => setCurrentStep('checkin')}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>Lanjut ke Langkah 4: Check-in</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: CHECK-IN JUJUR & JAM RETENSI */}
              {currentStep === 'checkin' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1 text-center">
                    <span className="text-[11px] font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-wider">
                      Langkah 4: Check-in Kejujuran
                    </span>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                      Bagaimana kelancaran hafalan ayat {activeVerse.numberInSurah} barusan?
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                      Jawablah secara jujur. Algoritma Jam Retensi akan menyusun jadwal pengulangan otomatis sesuai kondisi memori Anda.
                    </p>
                  </div>

                  {/* 3 Rating Choices */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Mutqin */}
                    <button
                      onClick={() => handleCheckinRating('mutqin')}
                      className="p-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-left space-y-2 transition-all cursor-pointer shadow-lg hover:scale-102"
                    >
                      <div className="flex items-center justify-between">
                        <CheckCircle2 className="w-6 h-6 text-slate-950 fill-current" />
                        <span className="text-[10px] uppercase font-black tracking-wider bg-slate-950/20 px-2 py-0.5 rounded-full">
                          Optimal
                        </span>
                      </div>
                      <h4 className="font-black text-base">🟢 Lancar Sekali</h4>
                      <p className="text-xs font-semibold leading-relaxed opacity-90">
                        Hafal tanpa intip teks, makhraj dan tajwid lancar. Lanjut ke interval berikutnya.
                      </p>
                    </button>

                    {/* Ragu */}
                    <button
                      onClick={() => handleCheckinRating('ragu')}
                      className="p-5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-left space-y-2 transition-all cursor-pointer shadow-lg hover:scale-102"
                    >
                      <div className="flex items-center justify-between">
                        <AlertCircle className="w-6 h-6 text-slate-950 fill-current" />
                        <span className="text-[10px] uppercase font-black tracking-wider bg-slate-950/20 px-2 py-0.5 rounded-full">
                          Perlu Review
                        </span>
                      </div>
                      <h4 className="font-black text-base">🟡 Masih Ragu</h4>
                      <p className="text-xs font-semibold leading-relaxed opacity-90">
                        Sempat tersendat atau perlu intip 1 kata. Dijadwalkan review ulang besok pagi.
                      </p>
                    </button>

                    {/* Belum Hafal */}
                    <button
                      onClick={() => handleCheckinRating('ulang')}
                      className="p-5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white text-left space-y-2 transition-all cursor-pointer shadow-lg hover:scale-102"
                    >
                      <div className="flex items-center justify-between">
                        <RotateCcw className="w-6 h-6 text-white" />
                        <span className="text-[10px] uppercase font-black tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                          Perlu Repetisi
                        </span>
                      </div>
                      <h4 className="font-black text-base">🔴 Belum Lancar</h4>
                      <p className="text-xs font-semibold leading-relaxed opacity-90">
                        Masih banyak lupa. Ulangi sesi murottal & blanking beberapa menit lagi.
                      </p>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. TAB 2: JAM RETENSI (SPACED REPETITION REVIEW ENGINE) */}
      {activeTab === 'retention' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span>Jam Retensi (Anti Ember Bocor)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Jadwal muraja'ah otomatis berdasarkan kurva memori Ebbinghaus: H+1, H+3, H+7, H+14, dan H+30.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                {dueItems.length} Jatuh Tempo Hari Ini
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {graduatedItems.length} Mutqin Permanen
              </span>
            </div>
          </div>

          {/* List of Due Items */}
          {dueItems.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>Daftar Ayat yang Harus Diulang Hari Ini:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dueItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-100 block">
                        {item.surahName} : Ayat {item.ayahNumber}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Tahap Retensi {item.stage}/5 • Diulang {item.repetitionCount}x
                      </span>
                    </div>

                    <button
                      onClick={() => handleReviewDueItem(item)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Brain className="w-3.5 h-3.5" />
                      <span>Review Cepat</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-center space-y-2 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                Alhamdulillah! Tidak Ada Ayat Jatuh Tempo Hari Ini
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Seluruh hafalan lama Anda berada dalam status aman. Anda dapat fokus menambah ayat baru pada sesi hari ini.
              </p>
            </div>
          )}

          {/* Retention Stages Explainer */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <h5 className="font-bold text-slate-800 dark:text-slate-200">
              5 Tingkatan Jam Retensi Otomatis:
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-emerald-600 block">Tahap 1</span>
                <span className="text-slate-500">H+1 (Besoknya)</span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-emerald-600 block">Tahap 2</span>
                <span className="text-slate-500">H+3 (3 Hari)</span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-emerald-600 block">Tahap 3</span>
                <span className="text-slate-500">H+7 (1 Pekan)</span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-emerald-600 block">Tahap 4</span>
                <span className="text-slate-500">H+14 (2 Pekan)</span>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200">
                <span className="font-black block">Tahap 5</span>
                <span className="text-emerald-600 dark:text-emerald-300 font-bold">H+30 (Mutqin)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 3: GRID 90 HARI & PETA JUZ */}
      {activeTab === 'grid' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span>Grid Konsistensi 90 Hari</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Setiap kotak melambangkan satu hari. Menjaga kotak tetap menyala hijau adalah kunci hafalan melekat permanen tanpa jeda panjang.
            </p>
          </div>

          {/* 90-Day Habit Grid Display */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold">Hari ke-1 s.d. 90</span>
              <span>{completedDays.length} / 90 Hari Selesai</span>
            </div>

            {/* Grid of 90 boxes (10 columns x 9 rows) */}
            <div className="grid grid-cols-10 sm:grid-cols-15 gap-1.5">
              {[...Array(90)].map((_, idx) => {
                const dayNum = idx + 1;
                const isCompleted = dayNum <= completedDays.length;

                return (
                  <div
                    key={idx}
                    className={`h-7 sm:h-8 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-slate-950 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                    title={`Hari ke-${dayNum}`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : dayNum}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress Surah/Juz Bar */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-200">
                Pencapaian Surah {selectedSurah.englishName}:
              </span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {graduatedItems.length} dari {selectedSurah.numberOfAyahs} Ayat ({Math.round((graduatedItems.length / selectedSurah.numberOfAyahs) * 100)}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{
                  width: `${Math.min(100, (graduatedItems.length / selectedSurah.numberOfAyahs) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB 4: RENCANA HAFALAN & SIMULASI KHATAM */}
      {activeTab === 'plan' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              <span>Rencana & Simulasi Khatam</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Atur target harian Anda sesuai waktu luang. Aplikasi akan menghitung otomatis tanggal perkiraan khatam.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Target Surah */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Surah Target:
              </label>
              <select
                value={selectedSurah.number}
                onChange={(e) => {
                  const s = SURAH_LIST.find((item) => item.number === Number(e.target.value));
                  if (s) {
                    setSelectedSurah(s);
                    setPlan((prev) => ({ ...prev, targetSurahNumber: s.number }));
                  }
                }}
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                {SURAH_LIST.map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {s.englishName} ({s.numberOfAyahs} ayat)
                  </option>
                ))}
              </select>
            </div>

            {/* Daily Pace Target */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Porsi Harian:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { pace: 'santai', ayahs: 1, mins: 20, label: '1 Ayat (20 Mnt)' },
                  { pace: 'sedang', ayahs: 3, mins: 30, label: '3 Ayat (30 Mnt)' },
                  { pace: 'cepat', ayahs: 5, mins: 45, label: '5 Ayat (45 Mnt)' },
                ].map((opt) => (
                  <button
                    key={opt.pace}
                    onClick={() => {
                      setPlan((prev) => ({
                        ...prev,
                        pace: opt.pace as 'santai' | 'sedang' | 'cepat',
                        dailyAyahTarget: opt.ayahs,
                        dailyMinutesTarget: opt.mins,
                      }));
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      plan.dailyAyahTarget === opt.ayahs
                        ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    <span className="text-[11px] font-bold block">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Khatam Projection Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/30 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-wider">
                Perkiraan Khatam Surah {selectedSurah.englishName}:
              </span>
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                {estimatedKhatamInfo.dateFormatted}
              </p>
              <span className="text-xs text-slate-500 block">
                Hanya butuh ~{estimatedKhatamInfo.daysNeeded} hari lagi jika konsisten {plan.dailyAyahTarget} ayat/hari.
              </span>
            </div>
            <Trophy className="w-12 h-12 text-amber-400 shrink-0" />
          </div>
        </div>
      )}

      {/* 7. TAB 5: BUKU METODE (EXPLAINER METODE SHQ) */}
      {activeTab === 'guide' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
            <span className="text-[11px] font-black uppercase text-emerald-600 tracking-wider">
              Landasan Ilmiah & Filosofi
            </span>
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mt-0.5">
              Mengapa Metode SHQ Berhasil pada Otak Orang Dewasa?
            </h3>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>1. Menghilangkan Fenomena "Ember Bocor"</span>
              </h4>
              <p>
                Banyak orang mengulang ayat 20 kali dalam satu hari. Mereka merasa sudah hafal, tetapi esok harinya hilang tanpa bekas. Ini bukan karena kurang niat atau otak tumpul, melainkan karena otak manusia menyimpan informasi sementara di memori jangka pendek (*short-term memory*). Tanpa <strong>Jam Retensi Terjadwal</strong>, 80% hafalan akan lenyap dalam waktu 48 jam.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>2. Tiga Pilar Gudang Arsip Memori Dewasa</span>
              </h4>
              <p>
                Berbeda dari balita yang murni mengandalkan repetisi suara tanpa arti, otak orang dewasa menyerap informasi lewat 3 jangkar:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700 dark:text-slate-300">
                <li><strong>Lokasi Spasial (Visual)</strong>: Mengingat posisi ayat pada lembaran mushaf.</li>
                <li><strong>Makna & Konteks (Kognitif)</strong>: Mengerti jalan cerita atau hukum ayat membuat hafalan masuk akal dan tidak terbalik.</li>
                <li><strong>Active Recall (Pengujian Mandiri)</strong>: Menguji ingatan dengan menutup teks ayat (*blanking*) melatih neuron otak mengunci hafalan lebih cepat hingga 3x lipat dibanding sekadar membaca berulang kali.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
