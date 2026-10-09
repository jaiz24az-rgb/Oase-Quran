import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Brain,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Eye,
  Sparkles,
  Trophy,
  Volume2,
  ArrowRight,
  Search,
  X,
  Layers,
  List,
  BookmarkCheck,
  Check,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TARJIH_PRAYERS_DATA } from '../data/tarjihPrayers';
import { TarjihPrayerItem } from '../types';
import { UmmiAudioPlayer } from './UmmiAudioPlayer';
import { recitationPlayer, PlayerState } from '../utils/recitationAudio';
import { SynchronizedArabicText } from './SynchronizedArabicText';

interface MemorizeViewProps {
  initialPrayer?: TarjihPrayerItem | null;
  onClose?: () => void;
}

export type MemorizeMode = 'flashcard' | 'blanking' | 'reorder';

export const MemorizeView: React.FC<MemorizeViewProps> = ({ initialPrayer, onClose }) => {
  const [selectedPrayer, setSelectedPrayer] = useState<TarjihPrayerItem>(
    initialPrayer || TARJIH_PRAYERS_DATA[2] // Default to Doa Iftitah
  );
  const [activeMode, setActiveMode] = useState<MemorizeMode>('flashcard');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'focus' | 'split'>('focus');

  // Quick Picker Modal states
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [modalSearch, setModalSearch] = useState('');
  const [modalCategory, setModalCategory] = useState('all');

  const workspaceRef = useRef<HTMLDivElement>(null);

  const memorizeCategories = [
    { id: 'all', label: 'Semua Koleksi' },
    { id: 'bacaan_sholat', label: 'Tuntunan Sholat Fardhu' },
    { id: 'dzikir_pagi_petang', label: 'Dzikir Pagi & Sore' },
    { id: 'doa_alquran', label: "Doa Al-Qur'an (Rabbana)" },
    { id: 'doa_hadist', label: 'Doa Hadits Shahih' },
    { id: 'sholat_jenazah', label: 'Sholat Jenazah' },
    { id: 'sholat_gerhana', label: 'Sholat Gerhana' },
    { id: 'sholat_hajat', label: 'Sholat Hajat' },
    { id: 'sholat_sunnah', label: 'Sholat Sunnah' },
    { id: 'dzikir_sholat', label: "Dzikir Ba'da Sholat" },
    { id: 'doa_harian', label: 'Doa Sehari-hari' },
  ];

  // Current category prayer list for sequential navigation
  const currentCategoryList = useMemo(() => {
    if (categoryFilter === 'all') return TARJIH_PRAYERS_DATA;
    return TARJIH_PRAYERS_DATA.filter((p) => p.category === categoryFilter);
  }, [categoryFilter]);

  const currentIndex = currentCategoryList.findIndex((p) => p.id === selectedPrayer.id);

  // Search filtered prayers for sidebar
  const selectablePrayers = useMemo(() => {
    return TARJIH_PRAYERS_DATA.filter((p) => {
      const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
      const matchQuery =
        searchQuery.trim() === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.arabic.includes(searchQuery);
      return matchCat && matchQuery;
    });
  }, [categoryFilter, searchQuery]);

  // Modal filtered prayers for the quick selector dialog
  const modalFilteredPrayers = useMemo(() => {
    const q = modalSearch.toLowerCase().trim();
    return TARJIH_PRAYERS_DATA.filter((item) => {
      const matchCat = modalCategory === 'all' || item.category === modalCategory;
      const matchQ =
        !q ||
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.translation.toLowerCase().includes(q) ||
        item.transliteration.toLowerCase().includes(q) ||
        item.arabic.includes(q);
      return matchCat && matchQ;
    });
  }, [modalSearch, modalCategory]);

  // Flashcard states
  const [isFlipped, setIsFlipped] = useState(false);

  // Blanking / Cloze states
  const [blankLevel, setBlankLevel] = useState<number>(50); // percentage 0, 25, 50, 75, 100
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());

  // Reorder puzzle states
  const [shuffledWords, setShuffledWords] = useState<{ id: number; word: string }[]>([]);
  const [placedWords, setPlacedWords] = useState<{ id: number; word: string }[]>([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  // Local storage memorization tracker
  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tarjih_mastered_prayers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Whenever initialPrayer prop changes, update selected prayer
  useEffect(() => {
    if (initialPrayer) {
      setSelectedPrayer(initialPrayer);
      if (initialPrayer.category && categoryFilter !== 'all' && categoryFilter !== initialPrayer.category) {
        setCategoryFilter(initialPrayer.category);
      }
    }
  }, [initialPrayer]);

  // Audio player state tracking for word-by-word synchronized highlighting
  const [playerState, setPlayerState] = useState<PlayerState>(recitationPlayer.getState());

  useEffect(() => {
    const unsubscribe = recitationPlayer.subscribe((state) => {
      setPlayerState(state);
    });
    return () => {
      recitationPlayer.stop();
      unsubscribe();
    };
  }, []);

  // Whenever selected prayer changes, reset interactive states & stop audio
  useEffect(() => {
    setIsFlipped(false);
    setRevealedIndices(new Set());
    resetReorderQuiz(selectedPrayer);
    recitationPlayer.stop();
  }, [selectedPrayer]);

  // Handle category/sub-judul selection:
  // Instantly sets active category AND immediately loads the first prayer of that sub judul!
  const handleCategorySelect = (catId: string) => {
    setCategoryFilter(catId);
    const inCategory = catId === 'all' ? TARJIH_PRAYERS_DATA : TARJIH_PRAYERS_DATA.filter((p) => p.category === catId);
    if (inCategory.length > 0) {
      // If current prayer is already in this category, keep it; otherwise switch to the first prayer of the category!
      if (catId !== 'all' && selectedPrayer.category !== catId) {
        setSelectedPrayer(inCategory[0]);
      }
    }
    // Smooth scroll to workspace so the user immediately sees the active prayer at the top
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const handlePrevPrayer = () => {
    const list = currentCategoryList;
    const idx = list.findIndex((p) => p.id === selectedPrayer.id);
    if (idx > 0) {
      setSelectedPrayer(list[idx - 1]);
    }
  };

  const handleNextPrayer = () => {
    const list = currentCategoryList;
    const idx = list.findIndex((p) => p.id === selectedPrayer.id);
    if (idx !== -1 && idx < list.length - 1) {
      setSelectedPrayer(list[idx + 1]);
    }
  };

  const handleSelectPrayerFromModal = (prayer: TarjihPrayerItem) => {
    setSelectedPrayer(prayer);
    setShowPickerModal(false);
    if (categoryFilter !== 'all' && prayer.category !== categoryFilter) {
      setCategoryFilter(prayer.category);
    }
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Handle reorder setup
  const resetReorderQuiz = (prayer: TarjihPrayerItem) => {
    const rawWords = prayer.arabic
      .replace(/[•،]/g, '')
      .split(/\s+/)
      .filter((w) => w.trim().length > 0);

    const indexedWords = rawWords.map((word, idx) => ({ id: idx, word }));
    // Shuffle array
    const shuffled = [...indexedWords].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setPlacedWords([]);
    setIsQuizCompleted(false);
  };

  const handleSelectPrayer = (prayer: TarjihPrayerItem) => {
    setSelectedPrayer(prayer);
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleMastered = (id: string) => {
    let next: string[];
    if (masteredIds.includes(id)) {
      next = masteredIds.filter((item) => item !== id);
    } else {
      next = [...masteredIds, id];
      // Trigger celebrate confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
    setMasteredIds(next);
    localStorage.setItem('tarjih_mastered_prayers', JSON.stringify(next));
  };

  // Reorder click logic
  const handlePickWord = (item: { id: number; word: string }) => {
    const nextPlaced = [...placedWords, item];
    const nextShuffled = shuffledWords.filter((w) => w.id !== item.id);
    setPlacedWords(nextPlaced);
    setShuffledWords(nextShuffled);

    // Check completion
    const rawWords = selectedPrayer.arabic
      .replace(/[•،]/g, '')
      .split(/\s+/)
      .filter((w) => w.trim().length > 0);

    if (nextPlaced.length === rawWords.length) {
      const isCorrect = nextPlaced.every((val, index) => val.word === rawWords[index]);
      if (isCorrect) {
        setIsQuizCompleted(true);
        try {
          confetti({ particleCount: 100, spread: 60, origin: { y: 0.7 } });
        } catch {
          // ignore
        }
      }
    }
  };

  const handleRemovePlacedWord = (item: { id: number; word: string }) => {
    setPlacedWords(placedWords.filter((w) => w.id !== item.id));
    setShuffledWords([...shuffledWords, item]);
    setIsQuizCompleted(false);
  };

  // Split words for blanking test
  const wordsForBlanking = selectedPrayer.arabic.split(/\s+/);

  const shouldHideWord = (index: number): boolean => {
    if (blankLevel === 0) return false;
    if (blankLevel === 100) return true;
    const hash = (index * 7 + 3) % 100;
    return hash < blankLevel;
  };

  const toggleRevealWord = (index: number) => {
    const next = new Set(revealedIndices);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setRevealedIndices(next);
  };

  const isCurrentMastered = masteredIds.includes(selectedPrayer.id);
  const percentMastered = Math.round((masteredIds.length / TARJIH_PRAYERS_DATA.length) * 100);

  const currentCategoryLabel =
    memorizeCategories.find((c) => c.id === categoryFilter)?.label || 'Koleksi';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Banner & Mastery Dashboard */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs uppercase tracking-wider">
            <Brain className="w-4 h-4" />
            <span>Modul Tahfizh Doa & Tuntunan Sholat</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mt-1">
            Hafalkan Doa & Bacaan Sholat
          </h2>
          <p className="text-emerald-100/80 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
            Didukung pelafalan Tartil Tajwid Metode Ummi (Talaqqi & Tikrar 3x), Kartu Hafalan, Uji Tutup Kata, dan Kuis Susun Potongan Lafal.
          </p>
        </div>

        {/* Progress Badge & Close Button */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 sm:px-5 sm:py-3.5 rounded-xl border border-white/15 flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="w-11 h-11 rounded-full border-4 border-emerald-400 flex items-center justify-center font-bold text-xs sm:text-sm">
              {percentMastered}%
            </div>
            <div>
              <span className="text-[11px] text-emerald-200 block font-medium">Progres Hafalan</span>
              <span className="text-xs sm:text-sm font-bold text-white">
                {masteredIds.length} dari {TARJIH_PRAYERS_DATA.length} Doa Tuntas
              </span>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95 shrink-0"
              title="Tutup modul hafalan dan kembali"
            >
              <X className="w-4 h-4" />
              <span>Tutup Hafalan</span>
            </button>
          )}
        </div>
      </div>

      {/* SUB-JUDUL / KATEGORI BAR (Langsung Pindah & Terbuka Tanpa Scroll) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pilih Sub-Judul / Bab (Langsung Tampil di Kartu):</span>
          </span>
          <span className="text-slate-400 text-[11px]">
            {selectablePrayers.length} Doa Terdaftar
          </span>
        </div>

        {/* Horizontal Category Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-emerald-500/20">
          {memorizeCategories.map((cat) => {
            const count =
              cat.id === 'all'
                ? TARJIH_PRAYERS_DATA.length
                : TARJIH_PRAYERS_DATA.filter((p) => p.category === cat.id).length;
            const isSelected = categoryFilter === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/30 font-bold'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                title={`Pilih sub-judul ${cat.label} dan langsung tampilkan doa di atas`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TOP QUICK NAVIGATOR BAR (Langsung Terbuka di Atas Tanpa Perlu Scroll) */}
      <div
        ref={workspaceRef}
        className="bg-white dark:bg-slate-800 p-3.5 sm:p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-sm space-y-3"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Quick Navigator Controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrevPrayer}
              disabled={currentIndex <= 0}
              className={`p-2.5 rounded-xl border flex items-center gap-1 text-xs font-semibold transition-all cursor-pointer ${
                currentIndex <= 0
                  ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-900 border-slate-200 text-slate-400'
                  : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-600'
              }`}
              title="Doa Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            {/* Center Selector Button: Tap to open quick dialog immediately */}
            <button
              onClick={() => {
                setModalCategory(categoryFilter);
                setModalSearch('');
                setShowPickerModal(true);
              }}
              className="flex-1 sm:flex-initial sm:min-w-[300px] p-2.5 px-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100 flex items-center justify-between gap-2 text-left cursor-pointer transition-colors shadow-2xs"
              title="Ketuk untuk langsung membuka dialog pilihan doa dan sholat tanpa scroll"
            >
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block truncate">
                  {currentCategoryLabel} • Doa {currentIndex !== -1 ? currentIndex + 1 : 1} dari{' '}
                  {currentCategoryList.length} (Ketuk untuk Ganti)
                </span>
                <p className="text-xs sm:text-sm font-bold truncate">
                  {selectedPrayer.title}
                </p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-lg shrink-0 flex items-center gap-1">
                <span>Pilih Doa</span>
                <span className="text-xs">▾</span>
              </span>
            </button>

            <button
              onClick={handleNextPrayer}
              disabled={currentIndex === -1 || currentIndex >= currentCategoryList.length - 1}
              className={`p-2.5 rounded-xl border flex items-center gap-1 text-xs font-semibold transition-all cursor-pointer ${
                currentIndex === -1 || currentIndex >= currentCategoryList.length - 1
                  ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-900 border-slate-200 text-slate-400'
                  : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-600'
              }`}
              title="Doa Berikutnya"
            >
              <span className="hidden sm:inline">Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Action: View Mode Toggle & Mastered Button */}
          <div className="flex items-center gap-2 justify-end w-full sm:w-auto">
            {/* Toggle View Mode: Focus (Hafalan Penuh) vs Split (Daftar Samping) */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-700/60 p-0.5 rounded-xl border border-slate-200 dark:border-slate-600 text-xs">
              <button
                onClick={() => setViewMode('focus')}
                className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'focus'
                    ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                title="Mode Fokus: Menampilkan kartu hafalan penuh di bagian atas"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="text-[11px]">Mode Fokus</span>
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                title="Tampilkan daftar doa di bilah samping"
              >
                <List className="w-3.5 h-3.5" />
                <span className="text-[11px]">Daftar Samping</span>
              </button>
            </div>

            {/* Toggle Mastered Button */}
            <button
              onClick={() => toggleMastered(selectedPrayer.id)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isCurrentMastered
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2
                className={`w-3.5 h-3.5 ${isCurrentMastered ? 'text-white' : 'text-emerald-600'}`}
              />
              <span className="text-[11px]">
                {isCurrentMastered ? 'Sudah Dihafal' : 'Tandai Hafal'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN WORKSPACE SECTION (Ditempatkan di Bagian Atas Agar Pengguna Tidak Perlu Scroll) */}
      <div className={`grid gap-6 ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>
        {/* Memorization Stage (Primary Top Card) */}
        <div className={`${viewMode === 'split' ? 'lg:col-span-8' : 'w-full'} space-y-4`}>
          {/* Audio Pelafalan Standar Tajwid Metode Ummi (Talaqqi, Tikrar 3x, & Kaidah Tajwid) */}
          <UmmiAudioPlayer
            itemId={selectedPrayer.id}
            itemTitle={selectedPrayer.title}
            surahRef={selectedPrayer.notes || selectedPrayer.subtitle}
          />

          {/* Mode Switcher Tabs */}
          <div className="bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex gap-1">
            <button
              onClick={() => setActiveMode('flashcard')}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                activeMode === 'flashcard'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              1. Kartu Hafalan (Flashcard)
            </button>
            <button
              onClick={() => setActiveMode('blanking')}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                activeMode === 'blanking'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              2. Tutup Kata Bertahap
            </button>
            <button
              onClick={() => setActiveMode('reorder')}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                activeMode === 'reorder'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              3. Susun Potongan Kata
            </button>
          </div>

          {/* ACTIVE MODE 1: Flashcard */}
          {activeMode === 'flashcard' && (
            <div className="space-y-4">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 p-6 sm:p-8 min-h-[300px] flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all text-center select-none"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    {selectedPrayer.title}
                  </span>
                  <span>Klik untuk membalik kartu ↺</span>
                </div>

                <div className="my-auto py-6">
                  {!isFlipped ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                          Lafal Arab Standar Tajwid:
                        </span>
                        {playerState.isPlaying && playerState.currentItemId === selectedPrayer.id && (
                          <span className="text-[10px] bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-amber-300 dark:border-amber-700">
                            <span className="flex h-1.5 w-1.5 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                            </span>
                            <span>Highlight Audio Real-Time</span>
                          </span>
                        )}
                      </div>
                      <div className="py-2">
                        <SynchronizedArabicText
                          text={selectedPrayer.arabic}
                          isPlaying={playerState.isPlaying && playerState.currentItemId === selectedPrayer.id}
                          progressPercent={playerState.progressPercent}
                          currentTime={playerState.currentItemId === selectedPrayer.id ? playerState.currentTime : undefined}
                          duration={playerState.currentItemId === selectedPrayer.id ? playerState.duration : undefined}
                          syncOffsetMs={playerState.syncOffsetMs}
                          enableTajwid={true}
                          fontSizeClass="text-3xl sm:text-4xl"
                          onWordClick={
                            playerState.isPlaying && playerState.currentItemId === selectedPrayer.id
                              ? (_idx, pct) => recitationPlayer.seek(pct)
                              : undefined
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-emerald-600 font-bold block mb-1">
                          Transliterasi Latin:
                        </span>
                        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 italic leading-relaxed">
                          {selectedPrayer.transliteration}
                        </p>
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-700 pt-3">
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                          Arti / Terjemahan:
                        </span>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                          "{selectedPrayer.translation}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
                  <span>{isFlipped ? 'Menampilkan: Terjemahan' : 'Menampilkan: Lafal Arab'}</span>
                </div>
              </div>

              {/* Tips & Next Prayer Prompt */}
              <div className="flex items-center justify-between gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                <span>
                  Sudah lancar? Lanjutkan ke <strong>Uji Tutup Kata Bertahap</strong> atau doa berikutnya.
                </span>
                <button
                  onClick={handleNextPrayer}
                  disabled={currentIndex === -1 || currentIndex >= currentCategoryList.length - 1}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shrink-0 flex items-center gap-1 cursor-pointer disabled:opacity-40"
                >
                  <span>Doa Selanjutnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ACTIVE MODE 2: Tutup Kata Bertahap (Cloze Deletion) */}
          {activeMode === 'blanking' && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
              {/* Level Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Tingkat Kesulitan Tutup Kata:
                  </h4>
                  <p className="text-xs text-slate-500">
                    Klik kata yang tersembunyi (kotak hijau) untuk mengintip kembali.
                  </p>
                </div>
                <div className="flex gap-1.5">
                  {[
                    { label: '0%', val: 0 },
                    { label: '25%', val: 25 },
                    { label: '50%', val: 50 },
                    { label: '75%', val: 75 },
                    { label: '100%', val: 100 },
                  ].map((lvl) => (
                    <button
                      key={lvl.val}
                      onClick={() => setBlankLevel(lvl.val)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        blankLevel === lvl.val
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Arabic Cloze Area */}
              <div
                dir="rtl"
                className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl leading-loose font-quran text-2xl sm:text-3xl text-right select-none"
              >
                <div className="flex flex-wrap gap-2.5 justify-end">
                  {wordsForBlanking.map((word, idx) => {
                    const isHidden = shouldHideWord(idx);
                    const isRevealed = revealedIndices.has(idx);

                    if (isHidden && !isRevealed) {
                      return (
                        <button
                          key={idx}
                          onClick={() => toggleRevealWord(idx)}
                          className="px-3 py-1 bg-emerald-200 dark:bg-emerald-900/60 hover:bg-emerald-300 border border-emerald-400 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 rounded-lg text-sm font-sans font-bold shadow-2xs transition-all cursor-pointer"
                          title="Ketuk untuk melihat kata ini"
                        >
                          ••••
                        </button>
                      );
                    }

                    return (
                      <span
                        key={idx}
                        onClick={() => isHidden && toggleRevealWord(idx)}
                        className={
                          isRevealed
                            ? 'text-amber-600 dark:text-amber-400 font-bold underline cursor-pointer'
                            : 'text-slate-900 dark:text-slate-100'
                        }
                      >
                        {word}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Translation hint accordion */}
              <div className="space-y-1 text-xs">
                <span className="font-semibold text-slate-400 uppercase tracking-wider">
                  Petunjuk Terjemahan:
                </span>
                <p className="text-slate-700 dark:text-slate-300 italic">
                  "{selectedPrayer.translation}"
                </p>
              </div>
            </div>
          )}

          {/* ACTIVE MODE 3: Reorder Words Game */}
          {activeMode === 'reorder' && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Susun Kembali Urutan Kata Doa
                  </h4>
                  <p className="text-xs text-slate-500">
                    Klik potongan kata di bawah untuk menyusunnya ke dalam kotak urutan yang benar.
                  </p>
                </div>
                <button
                  onClick={() => resetReorderQuiz(selectedPrayer)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Acak Ulang</span>
                </button>
              </div>

              {/* Placed Words Target Area */}
              <div
                dir="rtl"
                className={`min-h-[120px] p-5 rounded-xl border-2 border-dashed flex flex-wrap gap-2 items-center justify-end transition-all ${
                  isQuizCompleted
                    ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'
                }`}
              >
                {placedWords.length === 0 ? (
                  <span
                    dir="ltr"
                    className="text-xs text-slate-400 w-full text-center select-none"
                  >
                    Kotak Jawaban: Klik kata-kata di bawah untuk mulai menyusun
                  </span>
                ) : (
                  placedWords.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleRemovePlacedWord(item)}
                      className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-quran text-xl shadow-xs hover:bg-rose-600 transition-colors cursor-pointer"
                      title="Klik untuk mengembalikan"
                    >
                      {item.word}
                    </button>
                  ))
                )}
              </div>

              {isQuizCompleted && (
                <div className="p-4 rounded-xl bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 flex items-center justify-between text-xs sm:text-sm font-bold">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span>Masya Allah, susunan bacaan doa Anda 100% tepat!</span>
                  </div>
                  <button
                    onClick={() => toggleMastered(selectedPrayer.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    Tandai Dihafal
                  </button>
                </div>
              )}

              {/* Source Shuffled Pool */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Pilihan Kata (Klik untuk memilih):
                </span>
                <div dir="rtl" className="flex flex-wrap gap-2 justify-end">
                  {shuffledWords.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handlePickWord(item)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 hover:border-emerald-400 border border-slate-200 dark:border-slate-600 font-quran text-xl text-slate-900 dark:text-slate-100 shadow-xs transition-all cursor-pointer"
                    >
                      {item.word}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR PRAYER LIST (Hanya Tampil Jika ViewMode === 'split') */}
        {viewMode === 'split' && (
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Daftar Bab & Doa:
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                {selectablePrayers.length} pilihan
              </span>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari doa untuk dihafal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Scrollable list */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-2 space-y-1.5 max-h-[500px] overflow-y-auto scrollbar-thin">
              {selectablePrayers.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  Tidak ada doa yang cocok dengan pencarian.
                </div>
              ) : (
                selectablePrayers.map((prayer) => {
                  const isSelected = selectedPrayer.id === prayer.id;
                  const isDone = masteredIds.includes(prayer.id);

                  return (
                    <button
                      key={prayer.id}
                      id={`sel-prayer-${prayer.id}`}
                      onClick={() => handleSelectPrayer(prayer)}
                      className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {prayer.stepOrder || '•'}
                        </span>
                        <div className="truncate">
                          <span className="text-xs sm:text-sm block truncate">{prayer.title}</span>
                          {prayer.subtitle && (
                            <span
                              className={`text-[10px] truncate block ${
                                isSelected ? 'text-emerald-100' : 'text-slate-400'
                              }`}
                            >
                              {prayer.subtitle}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <UmmiAudioPlayer
                          itemId={prayer.id}
                          itemTitle={prayer.title}
                          surahRef={prayer.notes || prayer.subtitle}
                          compact={true}
                        />
                        {isDone && (
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-emerald-600'}`}
                          />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL DIALOG PEMILIH CEPAT DOA / SHOLAT (Langsung Terbuka Tanpa Scroll) */}
      {showPickerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-750 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Pilih Doa / Bab untuk Dihafal
                  </h3>
                  <p className="text-xs text-slate-500">
                    Langsung tampil di kartu hafalan tanpa perlu scroll
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
            <div className="p-3.5 border-b border-slate-100 dark:border-slate-750 bg-slate-50 dark:bg-slate-900 space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ketik judul doa, bacaan ruku', sujud, tasyahhud, atau latin..."
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>

              {/* Modal Category Filter Chips */}
              <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                {memorizeCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setModalCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      modalCategory === cat.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal List Items */}
            <div className="p-3 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-750">
              {modalFilteredPrayers.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  Tidak ditemukan doa dengan kata kunci "{modalSearch}".
                </div>
              ) : (
                modalFilteredPrayers.map((item, idx) => {
                  const isSelected = selectedPrayer.id === item.id;
                  const isDone = masteredIds.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectPrayerFromModal(item)}
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
                        {item.stepOrder || idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {isDone && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            )}
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              {item.category.replace(/_/g, ' ')}
                            </span>
                          </div>
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
      {/* Bottom Close Sub-Tab Button */}
      {onClose && (
        <div className="pt-2 pb-4 flex justify-center">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
          >
            <X className="w-4 h-4 text-rose-400" />
            <span>Tutup Sub-Tab Hafalan (Kembali ke Koleksi Doa)</span>
          </button>
        </div>
      )}
    </div>
  );
};
