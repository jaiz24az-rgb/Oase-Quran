import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  BookMarked,
  BookmarkCheck,
  Volume2,
  Brain,
  Check,
  Copy,
  Sparkles,
  Sun,
  Moon,
  BookOpen,
  HeartHandshake,
  ChevronLeft,
  ChevronRight,
  Eye,
  List,
  X,
  VolumeX,
  Layers,
} from 'lucide-react';
import { TARJIH_PRAYERS_DATA } from '../data/tarjihPrayers';
import { TarjihPrayerItem } from '../types';
import { recitationPlayer, PlayerState } from '../utils/recitationAudio';
import { UmmiAudioPlayer } from './UmmiAudioPlayer';
import { SynchronizedArabicText } from './SynchronizedArabicText';
import { MemorizeView } from './MemorizeView';

interface TarjihPrayersViewProps {
  onStartMemorize?: (prayer: TarjihPrayerItem) => void;
  initialMode?: 'prayers' | 'memorize';
  initialPrayer?: TarjihPrayerItem | null;
}

export const TarjihPrayersView: React.FC<TarjihPrayersViewProps> = ({
  onStartMemorize,
  initialMode = 'prayers',
  initialPrayer = null,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Memorize mode integration
  const [isMemorizeMode, setIsMemorizeMode] = useState<boolean>(initialMode === 'memorize');
  const [memorizeTargetItem, setMemorizeTargetItem] = useState<TarjihPrayerItem | null>(initialPrayer);
  const [autoFollowPrayer, setAutoFollowPrayer] = useState<boolean>(true);

  // Top navigation & focus mode state
  const [viewMode, setViewMode] = useState<'focus' | 'all'>('focus');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showPickerModal, setShowPickerModal] = useState<boolean>(false);
  const [modalSearch, setModalSearch] = useState<string>('');

  const categories = [
    { id: 'all', label: 'Semua Koleksi' },
    { id: 'bacaan_sholat', label: 'Tuntunan Sholat Fardhu' },
    { id: 'sholat_jenazah', label: 'Sholat Jenazah', icon: HeartHandshake },
    { id: 'sholat_gerhana', label: 'Sholat Gerhana', icon: Moon },
    { id: 'sholat_hajat', label: 'Sholat Hajat', icon: Sparkles },
    { id: 'sholat_sunnah', label: 'Sholat Sunnah Lainnya' },
    { id: 'dzikir_sholat', label: "Dzikir Ba'da Sholat" },
    { id: 'dzikir_pagi_petang', label: 'Dzikir Pagi & Sore', icon: Sun },
    { id: 'doa_alquran', label: "Doa Al-Qur'an (Rabbana)", icon: BookOpen },
    { id: 'doa_hadist', label: 'Doa Hadits Shahih', icon: BookmarkCheck },
    { id: 'doa_harian', label: 'Doa Sehari-hari' },
  ];

  // Subscribe to recitation player
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

  // Auto-follow: screen automatically follows currently reciting prayer without manual scrolling
  useEffect(() => {
    if (playingId && autoFollowPrayer) {
      const el = document.getElementById(`prayer-item-${playingId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [playingId, autoFollowPrayer]);

  const handleStartMemorizeLocal = (prayer: TarjihPrayerItem) => {
    setMemorizeTargetItem(prayer);
    setIsMemorizeMode(true);
    if (onStartMemorize) {
      onStartMemorize(prayer);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'dzikir_pagi_petang':
        return { label: 'Dzikir Pagi & Sore', bg: 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
      case 'doa_alquran':
        return { label: "Doa Al-Qur'an", bg: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
      case 'doa_hadist':
        return { label: 'Doa Hadits Shahih', bg: 'bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800' };
      case 'sholat_jenazah':
        return { label: 'Sholat Jenazah', bg: 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800' };
      case 'sholat_gerhana':
        return { label: 'Sholat Gerhana', bg: 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' };
      case 'sholat_hajat':
        return { label: 'Sholat Hajat', bg: 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800' };
      case 'sholat_sunnah':
        return { label: 'Sholat Sunnah', bg: 'bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800' };
      case 'bacaan_sholat':
        return { label: 'Sholat Fardhu', bg: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
      case 'dzikir_sholat':
        return { label: "Dzikir Ba'da Sholat", bg: 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800' };
      case 'doa_harian':
      default:
        return { label: 'Doa Harian', bg: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
    }
  };

  // Base list based on selectedCategory
  const currentCategoryPrayers = useMemo(() => {
    if (selectedCategory === 'all') return TARJIH_PRAYERS_DATA;
    return TARJIH_PRAYERS_DATA.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  // Reset selected index when category changes
  useEffect(() => {
    setSelectedIndex(0);
    recitationPlayer.stop();
  }, [selectedCategory]);

  const filteredPrayers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return currentCategoryPrayers;

    return currentCategoryPrayers.filter((item) => {
      return (
        item.title.toLowerCase().includes(query) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(query)) ||
        item.translation.toLowerCase().includes(query) ||
        item.transliteration.toLowerCase().includes(query) ||
        item.arabic.includes(query) ||
        item.source.toLowerCase().includes(query) ||
        (item.notes && item.notes.toLowerCase().includes(query))
      );
    });
  }, [currentCategoryPrayers, searchQuery]);

  // Modal filtered items
  const modalFilteredPrayers = useMemo(() => {
    const q = modalSearch.toLowerCase().trim();
    if (!q) return currentCategoryPrayers;
    return currentCategoryPrayers.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.translation.toLowerCase().includes(q) ||
        item.transliteration.toLowerCase().includes(q) ||
        item.arabic.includes(q)
    );
  }, [currentCategoryPrayers, modalSearch]);

  const activeFocusPrayer = currentCategoryPrayers[selectedIndex] || currentCategoryPrayers[0];

  const handlePrevPrayer = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      recitationPlayer.stop();
    }
  };

  const handleNextPrayer = () => {
    if (selectedIndex < currentCategoryPrayers.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      recitationPlayer.stop();
    }
  };

  const handleSelectPrayerFromModal = (idx: number) => {
    setSelectedIndex(idx);
    setShowPickerModal(false);
    recitationPlayer.stop();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyText = (item: TarjihPrayerItem) => {
    const textToCopy = `${item.title}\n\n${item.arabic}\n\n${item.transliteration}\n\nArtinya:\n"${item.translation}"\n\nSumber: ${item.source}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Authentic human recitation player with proper Tajwid / metode Ummi
  const handlePlayVoice = (item: TarjihPrayerItem) => {
    if (playingId === item.id) {
      recitationPlayer.stop();
    } else {
      recitationPlayer.play(item.id, item.notes || item.subtitle);
    }
  };

  // Render individual prayer card
  const renderPrayerCard = (prayer: TarjihPrayerItem, idx: number, isFocusCard = false) => {
    const badge = getCategoryBadge(prayer.category);
    const isPlayingThis = playingId === prayer.id;
    const audioInfo = recitationPlayer.getAudioInfo(prayer.id, prayer.notes || prayer.subtitle);

    return (
      <div
        key={prayer.id}
        id={`prayer-item-${prayer.id}`}
        className={`bg-white dark:bg-slate-800 rounded-2xl border transition-all space-y-4 ${
          isFocusCard ? 'p-6 sm:p-7 shadow-md ring-2 ring-emerald-500/20' : 'p-5 sm:p-6 shadow-xs'
        } ${
          isPlayingThis
            ? 'border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-500/30'
            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
        }`}
      >
        {/* Header card with Step or Category */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-750 pb-3">
          <div className="flex items-center gap-2.5">
            {prayer.stepOrder ? (
              <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {prayer.stepOrder}
              </span>
            ) : (
              <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {prayer.title}
                </h3>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                  {badge.label}
                </span>
              </div>
              {prayer.subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{prayer.subtitle}</p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Pelafalan Tajwid Metode Ummi Audio Button */}
            <UmmiAudioPlayer
              itemId={prayer.id}
              itemTitle={prayer.title}
              surahRef={prayer.notes || prayer.subtitle}
              compact={true}
            />

            <button
              onClick={() => handleCopyText(prayer)}
              className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Salin teks doa"
            >
              {copiedId === prayer.id ? (
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

            <button
              onClick={() => handleStartMemorizeLocal(prayer)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              title="Buka doa ini di modul penghafal"
            >
              <Brain className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline text-[11px]">Hafalkan</span>
            </button>
          </div>
        </div>

        {/* Full Ummi Audio Player Widget for Focus Card or when Playing */}
        {(isFocusCard || isPlayingThis) && (
          <UmmiAudioPlayer
            itemId={prayer.id}
            itemTitle={prayer.title}
            surahRef={prayer.notes || prayer.subtitle}
          />
        )}

        {/* Arabic Script - Standar Mushaf Indonesia Kemenag with Real-Time Synchronized Audio Highlight */}
        <div className="py-3">
          <SynchronizedArabicText
            text={prayer.arabic}
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
            {prayer.transliteration}
          </p>
        </div>

        {/* Indonesian Translation */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Artinya:
          </span>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
            "{prayer.translation}"
          </p>
        </div>

        {/* Source & Notes */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              Sumber Dalil / Hadits:{' '}
              <strong className="text-slate-700 dark:text-slate-300">{prayer.source}</strong>
            </span>
          </div>
          {prayer.notes && (
            <span className="text-[11px] bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
              {prayer.notes}
            </span>
          )}
        </div>
      </div>
    );
  };

  if (isMemorizeMode) {
    return (
      <div className="space-y-4">
        {/* Prominent Navigation Header with Clear Close Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Brain className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Sub-Tab: Menghafal Doa & Sholat
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Mode Hafalan Aktif
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Kombinasi audio tartil metode Ummi, kartu hafalan, tes rumpang kata, dan susun lafal.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsMemorizeMode(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-95 shrink-0"
            title="Tutup mode hafalan dan kembali ke koleksi doa utama"
          >
            <X className="w-4 h-4" />
            <span>Tutup Hafalan & Kembali ke Doa</span>
          </button>
        </div>

        <MemorizeView
          initialPrayer={memorizeTargetItem}
          onClose={() => {
            setIsMemorizeMode(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Bottom Prominent Close Bar */}
        <div className="pt-2 pb-6 flex justify-center">
          <button
            onClick={() => {
              setIsMemorizeMode(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
          >
            <X className="w-4 h-4 text-rose-400" />
            <span>Tutup Sub-Tab Hafalan (Kembali ke Koleksi Doa)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-xs sm:text-sm uppercase tracking-wider">
            <BookMarked className="w-4 h-4" />
            <span>Tuntunan Doa & Ibadah Sesuai Sunnah</span>
          </div>

          {/* 1-Tap Hafalan Button in Top Header */}
          <button
            onClick={() => {
              if (activeFocusPrayer) {
                handleStartMemorizeLocal(activeFocusPrayer);
              } else {
                setIsMemorizeMode(true);
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold shadow-xs transition-all cursor-pointer w-fit"
            title="Buka modul hafalan interaktif langsung dengan 1 tap"
          >
            <Brain className="w-4 h-4 text-amber-300" />
            <span>Mode Menghafal Doa (1-Tap)</span>
          </button>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
          Kumpulan Doa, Dzikir & Tuntunan Sholat
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Koleksi lengkap tuntunan ibadah: Sholat Fardhu, Sholat Jenazah, Sholat Gerhana, Sholat Hajat & Sunnah, Dzikir Pagi & Sore (Al-Ma'tsurat Shahih), serta kumpulan doa-doa mustajab dari Al-Qur'an dan Hadits Shahih dengan audio tartil tajwid otentik.
        </p>

        {/* Categories Filter Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin pt-2">
          {categories.map((cat) => {
            const count =
              cat.id === 'all'
                ? TARJIH_PRAYERS_DATA.length
                : TARJIH_PRAYERS_DATA.filter((p) => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                id={`cat-filter-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TOP QUICK NAVIGATOR BAR (Langsung Buka Bacaan Sholat di Bagian Atas Tanpa Perlu Scroll) */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-750 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Quick Navigator Controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrevPrayer}
              disabled={selectedIndex <= 0}
              className={`p-2.5 rounded-xl border flex items-center gap-1 text-xs font-semibold transition-all cursor-pointer ${
                selectedIndex <= 0
                  ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-900 border-slate-200 text-slate-400'
                  : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-600'
              }`}
              title="Bacaan Sebelumnya"
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
              title="Ketuk untuk memilih bacaan sholat dari daftar"
            >
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                  {activeFocusPrayer?.stepOrder ? `Langkah ${activeFocusPrayer.stepOrder}` : `Bacaan ${selectedIndex + 1}`} dari {currentCategoryPrayers.length} (Ketuk untuk Ganti)
                </span>
                <p className="text-xs sm:text-sm font-bold truncate">
                  {activeFocusPrayer?.title || 'Pilih Bacaan'}
                </p>
              </div>
              <span className="px-2 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-lg shrink-0">
                Pilih Bacaan
              </span>
            </button>

            <button
              onClick={handleNextPrayer}
              disabled={selectedIndex >= currentCategoryPrayers.length - 1}
              className={`p-2.5 rounded-xl border flex items-center gap-1 text-xs font-semibold transition-all cursor-pointer ${
                selectedIndex >= currentCategoryPrayers.length - 1
                  ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-900 border-slate-200 text-slate-400'
                  : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-600'
              }`}
              title="Bacaan Berikutnya"
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
                title="Tampilkan bacaan terpilih langsung di paling atas"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Fokus 1 Bacaan</span>
              </button>
              <button
                onClick={() => setViewMode('all')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                title="Tampilkan semua bacaan dalam daftar bergulir"
              >
                <List className="w-3.5 h-3.5" />
                <span>Semua Bacaan</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: FOCUS ONE READING (LANGSUNG DITAMPILKAN DI ATAS TANPA PERLU SCROLL) */}
      {viewMode === 'focus' ? (
        <div className="space-y-4">
          {activeFocusPrayer ? (
            renderPrayerCard(activeFocusPrayer, selectedIndex, true)
          ) : (
            <div className="p-8 text-center text-slate-500">Pilih bacaan sholat untuk ditampilkan.</div>
          )}

          {/* Quick Bottom Navigation */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <button
              onClick={handlePrevPrayer}
              disabled={selectedIndex <= 0}
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                selectedIndex <= 0
                  ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-900 border-slate-200 text-slate-400'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            <span className="text-xs text-slate-500">
              {selectedIndex + 1} / {currentCategoryPrayers.length}
            </span>

            <button
              onClick={handleNextPrayer}
              disabled={selectedIndex >= currentCategoryPrayers.length - 1}
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                selectedIndex >= currentCategoryPrayers.length - 1
                  ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-900 border-slate-200 text-slate-400'
                  : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-xs'
              }`}
            >
              <span>Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* VIEW MODE 2: ALL READINGS LIST WITH SEARCH */
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="tarjih-search-input"
              type="text"
              placeholder="Cari doa, lafal arab, arti, transliterasi, jenazah, gerhana, hajat, atau dzikir..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
          </div>

          {filteredPrayers.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Tidak ditemukan doa dengan kata kunci "{searchQuery}". Silakan coba kata kunci lain.
              </p>
            </div>
          ) : (
            filteredPrayers.map((prayer, idx) => renderPrayerCard(prayer, idx))
          )}
        </div>
      )}

      {/* MODAL DIALOG: PILIH BACAAN SHOLAT / DOA */}
      {showPickerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  <BookMarked className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Pilih Tuntunan & Bacaan Sholat
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kategori: {categories.find((c) => c.id === selectedCategory)?.label || 'Semua'}{' '}
                    ({currentCategoryPrayers.length} bacaan)
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
                  placeholder="Ketik nama bacaan, ruku', sujud, tasyahhud, salam, atau latin..."
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>
            </div>

            {/* Modal List Items */}
            <div className="p-3 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-750">
              {modalFilteredPrayers.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  Tidak ditemukan bacaan dengan kata kunci "{modalSearch}".
                </div>
              ) : (
                modalFilteredPrayers.map((item) => {
                  const originalIndex = currentCategoryPrayers.findIndex((p) => p.id === item.id);
                  const isSelected = selectedIndex === originalIndex;

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
                            : item.stepOrder
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {item.stepOrder || originalIndex + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                            {item.title}
                          </p>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shrink-0">
                            {getCategoryBadge(item.category).label}
                          </span>
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
