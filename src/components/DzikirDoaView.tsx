import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sun,
  Moon,
  BookOpen,
  BookmarkCheck,
  Search,
  Volume2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Brain,
  Clock,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Layers,
  X,
  VolumeX,
  Radio,
  Eye,
  List,
} from 'lucide-react';
import {
  DZIKIR_PAGI_DATA,
  DZIKIR_PETANG_DATA,
  DOA_QURAN_DATA,
  DOA_HADIST_DATA,
  DzikirItem,
} from '../data/dzikirDoaData';
import { TarjihPrayerItem } from '../types';
import { recitationPlayer, PlayerState } from '../utils/recitationAudio';
import { UmmiAudioPlayer } from './UmmiAudioPlayer';
import { SynchronizedArabicText } from './SynchronizedArabicText';

interface DzikirDoaViewProps {
  onStartMemorize: (prayer: TarjihPrayerItem) => void;
}

type MainTab = 'pagi' | 'petang' | 'quran' | 'hadist';

export const DzikirDoaView: React.FC<DzikirDoaViewProps> = ({ onStartMemorize }) => {
  // Determine default tab based on current time (Morning: 04:00 - 14:59, Evening: 15:00 - 03:59)
  const currentHour = new Date().getHours();
  const isMorningNow = currentHour >= 4 && currentHour < 15;

  const [activeTab, setActiveTab] = useState<MainTab>(isMorningNow ? 'pagi' : 'petang');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // View mode: 'focus' (single active prayer shown right at top) or 'all' (scrollable list)
  const [viewMode, setViewMode] = useState<'focus' | 'all'>('focus');
  // Selected prayer index in current activeTab data
  const [selectedPrayerIndex, setSelectedPrayerIndex] = useState<number>(0);
  // Modal for quick prayer selection
  const [showPickerModal, setShowPickerModal] = useState<boolean>(false);
  const [modalSearch, setModalSearch] = useState<string>('');

  // Counter storage keyed by date (e.g. tarjih_dzikir_counts_2026-09-22)
  const todayKey = useMemo(() => {
    const d = new Date();
    return `tarjih_dzikir_counts_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }, []);

  const [counters, setCounters] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(todayKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save counters to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(todayKey, JSON.stringify(counters));
    } catch {
      // ignore
    }
  }, [counters, todayKey]);

  // Subscribe to recitation player state
  const [playerState, setPlayerState] = useState<PlayerState>(recitationPlayer.getState());

  useEffect(() => {
    const unsubscribe = recitationPlayer.subscribe((state) => {
      setPlayerState(state);
      setPlayingId(state.isPlaying ? state.currentItemId : null);
    });
    return () => {
      recitationPlayer.stop();
      unsubscribe();
    };
  }, []);

  // Auto-follow: screen automatically follows currently reciting dzikir/doa without manual scrolling
  useEffect(() => {
    if (playingId) {
      const el = document.getElementById(`dzikir-item-${playingId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [playingId]);

  // Handle counter increment
  const handleIncrement = (item: DzikirItem) => {
    setCounters((prev) => {
      const current = prev[item.id] || 0;
      if (current >= item.targetCount) {
        return { ...prev, [item.id]: 0 }; // cycle back to 0 if pressed after done
      }
      return { ...prev, [item.id]: current + 1 };
    });
  };

  const handleResetSection = (data: DzikirItem[]) => {
    setCounters((prev) => {
      const updated = { ...prev };
      data.forEach((item) => {
        delete updated[item.id];
      });
      return updated;
    });
  };

  // Copy handler
  const handleCopy = (item: DzikirItem) => {
    const text = `${item.title}\n\n${item.arabic}\n\n${item.transliteration}\n\nArtinya:\n"${item.translation}"\n\nSumber: ${item.source}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Authentic Tartil & Tajwid Audio recitation player (replaces robotic Google TTS)
  const handlePlayVoice = (item: DzikirItem) => {
    if (playingId === item.id) {
      recitationPlayer.stop();
    } else {
      recitationPlayer.play(item.id, item.surahRef);
    }
  };

  // Convert DzikirItem to TarjihPrayerItem for the memorization module
  const handleMemorizeItem = (item: DzikirItem) => {
    let cat: any = 'doa_harian';
    if (item.type === 'dzikir_pagi' || item.type === 'dzikir_petang') cat = 'dzikir_pagi_petang';
    if (item.type === 'doa_quran') cat = 'doa_alquran';
    if (item.type === 'doa_hadist') cat = 'doa_hadist';

    const tarjihItem: TarjihPrayerItem = {
      id: item.id,
      category: cat,
      title: item.title,
      subtitle: item.subtitle,
      arabic: item.arabic,
      transliteration: item.transliteration,
      translation: item.translation,
      source: item.source,
      notes: item.notes,
    };
    onStartMemorize(tarjihItem);
  };

  // Active items based on current tab
  const currentData = useMemo(() => {
    switch (activeTab) {
      case 'pagi':
        return DZIKIR_PAGI_DATA;
      case 'petang':
        return DZIKIR_PETANG_DATA;
      case 'quran':
        return DOA_QURAN_DATA;
      case 'hadist':
        return DOA_HADIST_DATA;
    }
  }, [activeTab]);

  // Reset selected prayer index when activeTab changes
  useEffect(() => {
    setSelectedPrayerIndex(0);
    recitationPlayer.stop();
  }, [activeTab]);

  // Extract tags for category filter
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    currentData.forEach((item) => {
      if (item.categoryTag) tags.add(item.categoryTag);
    });
    return Array.from(tags);
  }, [currentData]);

  // Filter items for main view
  const filteredData = useMemo(() => {
    return currentData.filter((item) => {
      const matchTag = selectedTag === 'all' || item.categoryTag === selectedTag;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        q === '' ||
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.translation.toLowerCase().includes(q) ||
        item.transliteration.toLowerCase().includes(q) ||
        item.arabic.includes(q) ||
        (item.surahRef && item.surahRef.toLowerCase().includes(q)) ||
        item.source.toLowerCase().includes(q);

      return matchTag && matchSearch;
    });
  }, [currentData, selectedTag, searchQuery]);

  // Modal filtered items
  const modalFilteredData = useMemo(() => {
    const q = modalSearch.toLowerCase().trim();
    if (!q) return currentData;
    return currentData.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.translation.toLowerCase().includes(q) ||
        item.transliteration.toLowerCase().includes(q) ||
        item.arabic.includes(q) ||
        (item.surahRef && item.surahRef.toLowerCase().includes(q)) ||
        item.categoryTag.toLowerCase().includes(q)
    );
  }, [currentData, modalSearch]);

  // Safe selected active item
  const activeFocusItem = currentData[selectedPrayerIndex] || currentData[0];

  const handlePrevPrayer = () => {
    if (selectedPrayerIndex > 0) {
      setSelectedPrayerIndex(selectedPrayerIndex - 1);
      recitationPlayer.stop();
    }
  };

  const handleNextPrayer = () => {
    if (selectedPrayerIndex < currentData.length - 1) {
      setSelectedPrayerIndex(selectedPrayerIndex + 1);
      recitationPlayer.stop();
    }
  };

  const handleSelectPrayerFromModal = (index: number) => {
    setSelectedPrayerIndex(index);
    setShowPickerModal(false);
    recitationPlayer.stop();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper stats for current tab
  const completedCount = useMemo(() => {
    return currentData.filter((item) => (counters[item.id] || 0) >= item.targetCount).length;
  }, [currentData, counters]);

  const progressPercent = Math.round((completedCount / currentData.length) * 100);

  // Render individual item card
  const renderPrayerCard = (item: DzikirItem, index: number, isFocusCard = false) => {
    const currentCount = counters[item.id] || 0;
    const isCompleted = currentCount >= item.targetCount;
    const isPlayingThis = playingId === item.id;
    const audioInfo = recitationPlayer.getAudioInfo(item.id, item.surahRef);

    return (
      <div
        key={item.id}
        id={`dzikir-item-${item.id}`}
        className={`bg-white dark:bg-slate-800 rounded-2xl border transition-all space-y-4 ${
          isFocusCard ? 'p-6 sm:p-7 shadow-md ring-2 ring-emerald-500/20' : 'p-5 sm:p-6 shadow-xs'
        } ${
          isPlayingThis
            ? 'border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-500/30'
            : isCompleted
            ? 'border-emerald-300 dark:border-emerald-900 bg-emerald-50/15 dark:bg-emerald-950/20'
            : 'border-slate-200 dark:border-slate-750 hover:border-slate-300'
        }`}
      >
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-750 pb-3">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                isCompleted
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
              }`}
            >
              {index + 1}
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h4>
                {item.categoryTag && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                    {item.categoryTag}
                  </span>
                )}
                {item.surahRef && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {item.surahRef}
                  </span>
                )}
              </div>
              {item.subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.subtitle}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Target Counter Button */}
            {item.targetCount > 0 && (
              <button
                onClick={() => handleIncrement(item)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isCompleted
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-600'
                }`}
                title="Ketuk untuk menambah hitungan dzikir"
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span>
                      {currentCount}/{item.targetCount} Selesai
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>
                      {currentCount} / {item.targetCount}x
                    </span>
                  </>
                )}
              </button>
            )}

            {/* Pelafalan Tajwid Metode Ummi Audio Button */}
            <UmmiAudioPlayer
              itemId={item.id}
              itemTitle={item.title}
              surahRef={item.surahRef}
              compact={true}
            />

            {/* Copy Button */}
            <button
              onClick={() => handleCopy(item)}
              className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title="Salin teks doa"
            >
              {copiedId === item.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-medium text-[11px]">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">Salin</span>
                </>
              )}
            </button>

            {/* Memorize Button */}
            <button
              onClick={() => handleMemorizeItem(item)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              title="Hafalkan doa ini di modul Flashcard & Kuis"
            >
              <Brain className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Hafalkan</span>
            </button>
          </div>
        </div>

        {/* Full Ummi Audio Player Widget for Focus Card or when Playing */}
        {(isFocusCard || isPlayingThis) && (
          <UmmiAudioPlayer
            itemId={item.id}
            itemTitle={item.title}
            surahRef={item.surahRef}
          />
        )}

        {/* Arabic Script - Standar Mushaf Indonesia Kemenag with Real-Time Audio Highlight */}
        <div className="py-3">
          <SynchronizedArabicText
            text={item.arabic}
            isPlaying={isPlayingThis}
            progressPercent={playerState.progressPercent}
            currentTime={isPlayingThis ? playerState.currentTime : undefined}
            duration={isPlayingThis ? playerState.duration : undefined}
            syncOffsetMs={playerState.syncOffsetMs}
            enableTajwid={true}
            fontSizeClass="text-2xl sm:text-3xl lg:text-4xl"
            onWordClick={isPlayingThis ? (_idx, pct) => recitationPlayer.seek(pct) : undefined}
          />
        </div>

        {/* Transliteration */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-750">
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block uppercase tracking-wider mb-1">
            Transliterasi Latin Sesuai Tajwid:
          </span>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
            {item.transliteration}
          </p>
        </div>

        {/* Indonesian Translation */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Artinya:
          </span>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
            "{item.translation}"
          </p>
        </div>

        {/* Source & Notes */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              Sumber / Hadits:{' '}
              <strong className="text-slate-700 dark:text-slate-300">{item.source}</strong>
            </span>
          </div>
          {item.notes && (
            <span className="text-[11px] bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
              {item.notes}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Main Tab Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => {
            setActiveTab('pagi');
            setSelectedTag('all');
          }}
          className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'pagi'
              ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <Sun className="w-4 h-4" />
          <span>Dzikir Pagi ({DZIKIR_PAGI_DATA.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('petang');
            setSelectedTag('all');
          }}
          className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'petang'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <Moon className="w-4 h-4" />
          <span>Dzikir Petang ({DZIKIR_PETANG_DATA.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('quran');
            setSelectedTag('all');
          }}
          className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'quran'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Doa Al-Qur'an ({DOA_QURAN_DATA.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('hadist');
            setSelectedTag('all');
          }}
          className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'hadist'
              ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          <span>Doa Hadits & Harian ({DOA_HADIST_DATA.length})</span>
        </button>
      </div>

      {/* TOP QUICK NAVIGATOR BAR (Langsung Buka Doa di Bagian Atas Tanpa Perlu Scroll) */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-750 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Quick Navigator Controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrevPrayer}
              disabled={selectedPrayerIndex <= 0}
              className={`p-2.5 rounded-xl border flex items-center gap-1 text-xs font-semibold transition-all cursor-pointer ${
                selectedPrayerIndex <= 0
                  ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                  : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-600'
              }`}
              title="Doa Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            {/* Center Selector Button */}
            <button
              onClick={() => {
                setModalSearch('');
                setShowPickerModal(true);
              }}
              className="flex-1 sm:flex-initial sm:min-w-[280px] p-2.5 px-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 flex items-center justify-between gap-2 text-left cursor-pointer transition-colors shadow-2xs"
              title="Ketuk untuk memilih doa dari daftar lengkap"
            >
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                  Doa Ke-{selectedPrayerIndex + 1} dari {currentData.length} (Ketuk untuk Ganti)
                </span>
                <p className="text-xs sm:text-sm font-bold truncate">
                  {activeFocusItem?.title || 'Pilih Doa'}
                </p>
              </div>
              <span className="px-2 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-lg shrink-0">
                Pilih Doa
              </span>
            </button>

            <button
              onClick={handleNextPrayer}
              disabled={selectedPrayerIndex >= currentData.length - 1}
              className={`p-2.5 rounded-xl border flex items-center gap-1 text-xs font-semibold transition-all cursor-pointer ${
                selectedPrayerIndex >= currentData.length - 1
                  ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                  : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-600'
              }`}
              title="Doa Berikutnya"
            >
              <span className="hidden sm:inline">Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View Mode Toggle: Focus vs Full List */}
          <div className="flex items-center gap-2 justify-end">
            <span className="text-xs text-slate-500 hidden md:inline">Mode Tampilan:</span>
            <div className="flex bg-slate-100 dark:bg-slate-700/80 p-1 rounded-xl border border-slate-200 dark:border-slate-600">
              <button
                onClick={() => setViewMode('focus')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'focus'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                title="Tampilkan doa terpilih langsung di paling atas"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Fokus 1 Doa</span>
              </button>
              <button
                onClick={() => setViewMode('all')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                title="Tampilkan semua doa dalam daftar bergulir"
              >
                <List className="w-3.5 h-3.5" />
                <span>Semua Doa</span>
              </button>
            </div>
          </div>
        </div>

        {/* Progress bar in current category */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-750 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Target Terbaca Hari Ini:
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {completedCount} dari {currentData.length} Doa ({progressPercent}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 sm:w-36 bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <button
              onClick={() => handleResetSection(currentData)}
              className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
              title="Reset hitungan dzikir hari ini"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: FOCUS ONE PRAYER (LANGSUNG DITAMPILKAN DI ATAS TANPA SCROLL) */}
      {viewMode === 'focus' ? (
        <div className="space-y-4">
          {activeFocusItem ? (
            renderPrayerCard(activeFocusItem, selectedPrayerIndex, true)
          ) : (
            <div className="p-8 text-center text-slate-500">Pilih doa untuk ditampilkan.</div>
          )}

          {/* Quick Bottom Navigation for Focus Mode */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <button
              onClick={handlePrevPrayer}
              disabled={selectedPrayerIndex <= 0}
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                selectedPrayerIndex <= 0
                  ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-900 border-slate-200 text-slate-400'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Doa Sebelumnya</span>
            </button>

            <span className="text-xs text-slate-500">
              {selectedPrayerIndex + 1} / {currentData.length}
            </span>

            <button
              onClick={handleNextPrayer}
              disabled={selectedPrayerIndex >= currentData.length - 1}
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                selectedPrayerIndex >= currentData.length - 1
                  ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-900 border-slate-200 text-slate-400'
                  : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-xs'
              }`}
            >
              <span>Doa Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* VIEW MODE 2: ALL PRAYERS LIST WITH SEARCH & TAG FILTERS */
        <div className="space-y-4">
          {/* Search & Tag Filter Box */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari doa, lafal arab, arti, atau transliterasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Tag Filter Chips */}
            {availableTags.length > 0 && (
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                <button
                  onClick={() => setSelectedTag('all')}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedTag === 'all'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  Semua ({currentData.length})
                </button>
                {availableTags.map((tag) => {
                  const tagCount = currentData.filter((i) => i.categoryTag === tag).length;
                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        selectedTag === tag
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {tag} ({tagCount})
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {filteredData.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700">
              <p className="text-slate-500 text-sm">Tidak ditemukan doa yang sesuai kata kunci pencarian.</p>
            </div>
          ) : (
            filteredData.map((item, idx) => renderPrayerCard(item, idx))
          )}
        </div>
      )}

      {/* MODAL DIALOG: PILIH DOA CEPAT (1 - N) */}
      {showPickerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  <BookOpen className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Pilih Doa / Dzikir
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kategori:{' '}
                    {activeTab === 'pagi'
                      ? 'Dzikir Pagi'
                      : activeTab === 'petang'
                      ? 'Dzikir Petang'
                      : activeTab === 'quran'
                      ? "Doa Al-Qur'an (Rabbana)"
                      : 'Doa Hadits & Harian'}{' '}
                    ({currentData.length} doa)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPickerModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Search Bar */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-750 bg-slate-50 dark:bg-slate-900">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ketik nama doa, ayat, latin, atau kata kunci..."
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>
            </div>

            {/* Modal List Items */}
            <div className="p-3 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-750">
              {modalFilteredData.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  Tidak ditemukan doa dengan kata kunci "{modalSearch}".
                </div>
              ) : (
                modalFilteredData.map((item) => {
                  const originalIndex = currentData.findIndex((d) => d.id === item.id);
                  const isSelected = selectedPrayerIndex === originalIndex;
                  const isCompleted = (counters[item.id] || 0) >= item.targetCount;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectPrayerFromModal(originalIndex)}
                      className={`w-full p-3 rounded-xl text-left flex items-start gap-3 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : isCompleted
                            ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {originalIndex + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                            {item.title}
                          </p>
                          {item.categoryTag && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shrink-0">
                              {item.categoryTag}
                            </span>
                          )}
                        </div>
                        {item.subtitle && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        )}
                        <p
                          dir="rtl"
                          className="font-quran text-sm text-slate-800 dark:text-slate-200 text-right truncate mt-1"
                        >
                          {item.arabic}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
