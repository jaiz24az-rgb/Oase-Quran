import React, { useState, useMemo } from 'react';
import {
  QURAN_MEDICAL_DATA,
  MEDICAL_CATEGORIES,
  ORGAN_SYSTEMS,
  searchMedicalEntries,
} from '../data/quranMedicalData';
import { QuranMedicalEntry } from '../types';
import { MedicalVisualDiagram } from './MedicalVisualDiagram';
import {
  HeartPulse,
  Search,
  BookOpen,
  Bookmark,
  Share2,
  Check,
  ChevronRight,
  Sparkles,
  ShieldAlert,
  Activity,
  Award,
  ArrowLeft,
  SlidersHorizontal,
  Info,
  HelpCircle,
  Stethoscope,
  ExternalLink,
  Brain,
  Apple,
  Dna,
  ShieldCheck,
} from 'lucide-react';

interface QuranMedisViewProps {
  onNavigateToQuran?: (surahNumber: number) => void;
  onClose?: () => void;
}

export const QuranMedisView: React.FC<QuranMedisViewProps> = ({
  onNavigateToQuran,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedOrgan, setSelectedOrgan] = useState<string>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [selectedEntryId, setSelectedEntryId] = useState<string>(
    QURAN_MEDICAL_DATA[0]?.id || ''
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Bookmarks in localStorage
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tarjih_quran_medis_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);

  // Toggle bookmark
  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('tarjih_quran_medis_bookmarks', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Copy summary to clipboard
  const handleCopySummary = (entry: QuranMedicalEntry) => {
    const text = `🩺 *QURAN MEDIS & HADIST KESEHATAN*
*${entry.title.toUpperCase()}*
${entry.arabicTerm ? `Lafaz: ${entry.arabicTerm}` : ''}
${entry.latinScientificName ? `Nama Ilmiah: _${entry.latinScientificName}_` : ''}

📖 *DALIL AL-QUR'AN:*
QS. ${entry.quranVerse.surahName} (${entry.quranVerse.surahNumber}): Ayat ${entry.quranVerse.ayahNumber}
"${entry.quranVerse.translation}"

📜 *HADIST SHAHIH:*
${entry.hadith.narrator} (${entry.hadith.grade})
"${entry.hadith.translation}"

🔬 *PENJELASAN MEDIS & SAINS MODERN:*
• Senyawa Utama: ${entry.modernScience.keyCompounds.join(', ')}
• Mekanisme: ${entry.modernScience.biochemicalMechanism}
• Manfaat Terbukti:
${entry.modernScience.clinicalBenefits.map((b) => `  - ${b}`).join('\n')}

💊 *PANDUAN KONSUMSI / TERAPI:*
${entry.practicalGuide.recommendedUsage}
Dosis: ${entry.practicalGuide.dosageOrMethod}

⚠️ *PERHATIAN MEDIS:*
${entry.practicalGuide.contraindicationsAndCautions.join('; ')}

_Dibagikan dari Aplikasi Al-Qur'an Indonesia & Tarjih Muhammadiyah_`;

    navigator.clipboard.writeText(text);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Alphabet list from entries
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    QURAN_MEDICAL_DATA.forEach((item) => {
      const firstChar = item.title.charAt(0).toUpperCase();
      if (/[A-Z]/.test(firstChar)) {
        letters.add(firstChar);
      }
    });
    return Array.from(letters).sort();
  }, []);

  // Filter entries
  const filteredEntries = useMemo(() => {
    let list = searchMedicalEntries(searchQuery);

    if (selectedCategory !== 'all') {
      list = list.filter((item) => item.category === selectedCategory);
    }

    if (selectedOrgan !== 'all') {
      list = list.filter((item) => item.organSystems.includes(selectedOrgan as any));
    }

    if (selectedLetter !== 'ALL') {
      list = list.filter((item) => item.title.toUpperCase().startsWith(selectedLetter));
    }

    if (showOnlyBookmarks) {
      list = list.filter((item) => bookmarks.includes(item.id));
    }

    return list;
  }, [searchQuery, selectedCategory, selectedOrgan, selectedLetter, showOnlyBookmarks, bookmarks]);

  // Current active selected entry for reading
  const activeEntry: QuranMedicalEntry = useMemo(() => {
    return (
      filteredEntries.find((item) => item.id === selectedEntryId) ||
      filteredEntries[0] ||
      QURAN_MEDICAL_DATA[0]
    );
  }, [filteredEntries, selectedEntryId]);

  // Quiz state
  const quizQuestions = [
    {
      q: 'Surah manakah dalam Al-Qur\'an yang menyebutkan madu sebagai "Syifa\' Lin-Naas" (obat bagi manusia)?',
      options: ['QS. An-Nahl: 68-69', 'QS. Al-Baqarah: 184', 'QS. At-Tin: 1', 'QS. Maryam: 25'],
      answer: 0,
      explain: 'QS. An-Nahl ayat 68-69 menjelaskan lebah mengeluarkan minuman beraneka warna yang di dalamnya ada obat bagi manusia.',
    },
    {
      q: 'Apa mekanisme seluler puasa yang memenangkan Hadiah Nobel Kedokteran 2016 oleh Yoshinori Ohsumi?',
      options: ['Autofagi (daur ulang seluler & pembersihan organel rusak)', 'Hiperglikemia', 'Lipolisis jenuh', 'Apoptosis abnormal'],
      answer: 0,
      explain: 'Autofagi adalah proses alami saat sel mendaur ulang organel rusak dan membakar protein mutan ketika berpuasa 12-16 jam.',
    },
    {
      q: 'Menurut hadits Miqdam bin Ma\'dikarib, bagaimana anjuran Nabi SAW dalam membagi volume lambung?',
      options: [
        '1/3 makanan, 1/3 minuman, 1/3 udara/napas',
        '1/2 makanan dan 1/2 minuman',
        'Semuanya untuk makanan secukupnya',
        '3/4 makanan dan 1/4 cairan',
      ],
      answer: 0,
      explain: 'Kaidah sepertiga lambung menjaga tekanan intragastrik tetap seimbang dan mencegah naiknya asam lambung (GERD).',
    },
    {
      q: 'Buah apakah yang diwahyukan kepada Maryam saat melahirkan Nabi Isa karena kaya analog hormon oksitosin alami?',
      options: ['Kurma basah (Ruthab)', 'Buah Zaitun', 'Buah Tin', 'Buah Delima'],
      answer: 0,
      explain: 'QS. Maryam: 25 memerintahkan menggoyang pohon kurma untuk menjatuhkan ruthab yang merangsang kontraksi rahim dan mencegah pendarahan.',
    },
    {
      q: 'Posisi apakah dalam sholat yang membalikkan gradien gravitasi dan membanjiri korteks prefrontal otak dengan oksigen?',
      options: ['Sujud', 'Rukuk', 'Takbiratul Ihram', 'I\'tidal'],
      answer: 0,
      explain: 'Saat sujud, kepala di bawah jantung memudahkan aliran darah arteri karotis menuju lobus frontal tanpa hambatan gravitasi.',
    },
  ];

  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswerSubmitted, setQuizAnswerSubmitted] = useState(false);

  const handleSelectQuizOption = (idx: number) => {
    if (quizAnswerSubmitted) return;
    setSelectedQuizOption(idx);
  };

  const handleSubmitQuizAnswer = () => {
    if (selectedQuizOption === null) return;
    setQuizAnswerSubmitted(true);
    if (selectedQuizOption === quizQuestions[currentQuizIdx].answer) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedQuizOption(null);
    setQuizAnswerSubmitted(false);
    if (currentQuizIdx < quizQuestions.length - 1) {
      setCurrentQuizIdx((prev) => prev + 1);
    } else {
      // Completed
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuizIdx(0);
    setSelectedQuizOption(null);
    setQuizScore(0);
    setQuizAnswerSubmitted(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in pb-12">
      {/* 1. Header Banner Quran Medis */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-rose-700 via-rose-800 to-emerald-900 text-white p-5 sm:p-7 shadow-xl">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/30 backdrop-blur-md border border-rose-300/30 text-rose-100 text-xs font-bold">
              <HeartPulse className="w-4 h-4 text-rose-300 animate-pulse" />
              <span>Kesehatan Qur'ani & Kedokteran Nabawi Terpadu</span>
            </div>
            <h2 className="text-xl sm:text-2.5xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Quran Medis & Hadist Kesehatan</span>
            </h2>
            <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
              Khazanah medis Al-Qur'an dan Hadist Shahih yang dilengkapi indeks terpadu (A-Z), sistem organ, panduan aplikasi klinis, dan infografis anatomi interaktif untuk memperkuat pemahaman kesehatan keluarga.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Quick Button: Kuis Medis */}
            <button
              onClick={() => {
                handleResetQuiz();
                setShowQuizModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold shadow-md transition-all cursor-pointer hover:scale-102 active:scale-98"
              title="Uji pemahaman lewat Kuis Medis Nabawi"
            >
              <Award className="w-4 h-4 text-slate-900" />
              <span>Kuis Medis</span>
            </button>

            {/* Quick Button: Kembali ke Mushaf */}
            {onClose && (
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold border border-white/30 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Mushaf</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Category Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 pb-1 scrollbar-none">
          {MEDICAL_CATEGORIES.map((cat) => {
            const isSel = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedLetter('ALL');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSel
                    ? 'bg-white text-rose-900 shadow-md font-bold'
                    : 'bg-white/15 hover:bg-white/25 text-rose-50 border border-white/20'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Search, Filter & Alphabetical Index Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari penyakit, obat, madu, sujud, jantung, otak, lambung, ayat..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Organ Filter Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedOrgan}
              onChange={(e) => setSelectedOrgan(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              {ORGAN_SYSTEMS.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.label}
                </option>
              ))}
            </select>

            {/* Toggle Bookmarks */}
            <button
              onClick={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                showOnlyBookmarks
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
              title="Tampilkan hanya topik yang Anda simpan/favoritkan"
            >
              <Bookmark className={`w-3.5 h-3.5 ${showOnlyBookmarks ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">Tersimpan</span> ({bookmarks.length})
            </button>
          </div>
        </div>

        {/* Alphabetical A-Z Jump Index */}
        <div className="flex items-center gap-1 overflow-x-auto pt-1 pb-1 border-t border-slate-100 dark:border-slate-700/60 scrollbar-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Indeks:
          </span>
          <button
            onClick={() => setSelectedLetter('ALL')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              selectedLetter === 'ALL'
                ? 'bg-rose-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            SEMUA
          </button>
          {availableLetters.map((ltr) => (
            <button
              key={ltr}
              onClick={() => setSelectedLetter(ltr)}
              className={`w-6 h-6 rounded-md text-[11px] font-bold flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                selectedLetter === ltr
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {ltr}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Two-Column Layout (Topic Navigator on Left, Deep Medical Insight on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Topic List Index (4 cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Daftar Topik Medis ({filteredEntries.length})
            </span>
            {(searchQuery || selectedCategory !== 'all' || selectedOrgan !== 'all' || selectedLetter !== 'ALL' || showOnlyBookmarks) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedOrgan('all');
                  setSelectedLetter('ALL');
                  setShowOnlyBookmarks(false);
                }}
                className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
            {filteredEntries.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Tidak ada topik medis yang sesuai
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Coba gunakan kata kunci pencarian lain atau pilih "Semua Kategori".
                </p>
              </div>
            ) : (
              filteredEntries.map((item) => {
                const isSelected = item.id === activeEntry.id;
                const isBookmarked = bookmarks.includes(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedEntryId(item.id);
                      // On mobile screen, scroll smoothly to the detail panel
                      if (window.innerWidth < 1024) {
                        const el = document.getElementById('quran-medis-detail-panel');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left relative ${
                      isSelected
                        ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-400 dark:border-rose-700 shadow-sm ring-1 ring-rose-400/50'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300">
                          {item.categoryLabel}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {item.title}
                        </h4>
                        {item.arabicTerm && (
                          <p className="text-xs font-arabic text-emerald-700 dark:text-emerald-400">
                            {item.arabicTerm}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(item.id);
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isBookmarked
                              ? 'text-rose-600 fill-current bg-rose-100 dark:bg-rose-900/60'
                              : 'text-slate-400 hover:text-rose-600'
                          }`}
                          title={isBookmarked ? 'Hapus dari simpanan' : 'Simpan topik ini'}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                        </button>
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${
                            isSelected ? 'text-rose-600 translate-x-1' : 'text-slate-300'
                          }`}
                        />
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                      {item.summary}
                    </p>

                    <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                        QS. {item.quranVerse.surahName}: {item.quranVerse.ayahNumber}
                      </span>
                      <span>•</span>
                      <span className="truncate">{item.hadith.narrator.split('(')[0]}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Deep Medical Knowledge & Visual Infographic (7 cols) */}
        <div id="quran-medis-detail-panel" className="lg:col-span-7 space-y-4">
          {activeEntry ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md p-4 sm:p-6 space-y-6">
              {/* Detail Header & Action Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300">
                      {activeEntry.categoryLabel}
                    </span>
                    {activeEntry.organSystems.map((org) => {
                      const match = ORGAN_SYSTEMS.find((o) => o.id === org);
                      return (
                        <span
                          key={org}
                          className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                        >
                          {match ? match.label : org}
                        </span>
                      );
                    })}
                  </div>

                  <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                    {activeEntry.title}
                  </h3>

                  {activeEntry.arabicTerm && (
                    <p className="text-base sm:text-lg font-arabic text-emerald-700 dark:text-emerald-400">
                      {activeEntry.arabicTerm}
                    </p>
                  )}

                  {activeEntry.latinScientificName && (
                    <p className="text-xs italic text-slate-500 dark:text-slate-400">
                      Nama Ilmiah: {activeEntry.latinScientificName}
                    </p>
                  )}
                </div>

                {/* Toolbar Buttons */}
                <div className="flex items-center gap-1.5 self-start shrink-0">
                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleBookmark(activeEntry.id)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      bookmarks.includes(activeEntry.id)
                        ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 text-rose-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                    title={bookmarks.includes(activeEntry.id) ? 'Hapus Simpanan' : 'Simpan Topik'}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${bookmarks.includes(activeEntry.id) ? 'fill-current' : ''}`}
                    />
                  </button>

                  {/* Share/Copy Button */}
                  <button
                    onClick={() => handleCopySummary(activeEntry)}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
                    title="Salin ringkasan pengetahuan medis ini untuk dibagikan"
                  >
                    {copiedId === activeEntry.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>

                  {/* Jump to Quran Mushaf */}
                  {onNavigateToQuran && (
                    <button
                      onClick={() => onNavigateToQuran(activeEntry.quranVerse.surahNumber)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                      title={`Buka Surah ${activeEntry.quranVerse.surahName} di Mushaf Al-Qur'an`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Buka di Mushaf</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Visual Infographic Diagram with Interactive Hotspots */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-rose-600" />
                    <span>Infografis Anatomi & Visualisasi Medis</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Ketuk nomor pin untuk penjelasan
                  </span>
                </div>
                <MedicalVisualDiagram entry={activeEntry} />
              </div>

              {/* Al-Qur'an Verse Section */}
              <div className="rounded-2xl p-4 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-extrabold shadow-xs">
                    <BookOpen className="w-3.5 h-3.5" />
                    QS. {activeEntry.quranVerse.surahName} ({activeEntry.quranVerse.surahNumber}): Ayat {activeEntry.quranVerse.ayahNumber}
                  </span>
                  {onNavigateToQuran && (
                    <button
                      onClick={() => onNavigateToQuran(activeEntry.quranVerse.surahNumber)}
                      className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>Baca Surat Penuh</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-right font-arabic text-xl sm:text-2xl leading-loose text-slate-900 dark:text-slate-100 font-medium">
                  {activeEntry.quranVerse.arabicText}
                </p>

                <p className="text-xs text-emerald-900 dark:text-emerald-300 italic font-mono">
                  {activeEntry.quranVerse.transliteration}
                </p>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
                  "{activeEntry.quranVerse.translation}"
                </p>

                <div className="pt-2 border-t border-emerald-200/80 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300">
                  <span className="font-bold">Hikmah Tafsir: </span>
                  {activeEntry.quranVerse.tafsirBrief}
                </div>
              </div>

              {/* Hadith Shahih Section */}
              <div className="rounded-2xl p-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Hadist Shahih Penuntun Kesehatan</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-600 text-white">
                    {activeEntry.hadith.grade}
                  </span>
                </div>

                {activeEntry.hadith.arabicText && (
                  <p className="text-right font-arabic text-lg leading-loose text-slate-900 dark:text-slate-100">
                    {activeEntry.hadith.arabicText}
                  </p>
                )}

                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 italic leading-relaxed">
                  "{activeEntry.hadith.translation}"
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-200/60 dark:border-amber-800/50 text-[11px] text-amber-900 dark:text-amber-300">
                  <span className="font-bold">{activeEntry.hadith.narrator}</span>
                  <span className="italic">{activeEntry.hadith.context}</span>
                </div>
              </div>

              {/* Modern Medical Science & Research */}
              <div className="space-y-3">
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-emerald-600" />
                  <span>Kajian Sains & Bukti Klinis Kedokteran Modern</span>
                </h4>

                {/* Key compounds */}
                <div className="flex flex-wrap gap-1.5">
                  {activeEntry.modernScience.keyCompounds.map((comp) => (
                    <span
                      key={comp}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                    >
                      🧪 {comp}
                    </span>
                  ))}
                </div>

                {/* Biochemical mechanism */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                    Mekanisme Biokimia & Fisiologis:
                  </span>
                  {activeEntry.modernScience.biochemicalMechanism}
                </div>

                {/* Clinical Benefits list */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Manfaat Kesehatan Terbukti Secara Klinis:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeEntry.modernScience.clinicalBenefits.map((benefit, bIdx) => (
                      <div
                        key={bIdx}
                        className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Research Studies */}
                {activeEntry.modernScience.modernResearchStudies.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Rujukan Jurnal Kedokteran Internasional:
                    </span>
                    {activeEntry.modernScience.modernResearchStudies.map((study, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs text-slate-700 dark:text-slate-300 space-y-1"
                      >
                        <span className="font-bold text-indigo-900 dark:text-indigo-300 block">
                          📄 {study.journal}
                        </span>
                        <p className="italic text-slate-600 dark:text-slate-400">
                          "{study.finding}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Practical Guide, Dosage & Medical Safety */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Panduan Konsumsi & Keamanan Medis</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      Cara Aplikasi / Konsumsi:
                    </span>
                    <p className="text-slate-600 dark:text-slate-400">
                      {activeEntry.practicalGuide.recommendedUsage}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      Dosis & Takaran Harian:
                    </span>
                    <p className="text-slate-600 dark:text-slate-400">
                      {activeEntry.practicalGuide.dosageOrMethod}
                    </p>
                  </div>
                </div>

                {/* Contraindications Warning */}
                {activeEntry.practicalGuide.contraindicationsAndCautions.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200 space-y-1.5">
                    <span className="font-bold flex items-center gap-1.5 text-rose-700 dark:text-rose-300">
                      <ShieldAlert className="w-4 h-4" />
                      Perhatian Medis & Kontraindikasi:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-rose-800 dark:text-rose-300/90 leading-relaxed">
                      {activeEntry.practicalGuide.contraindicationsAndCautions.map((caution, cIdx) => (
                        <li key={cIdx}>{caution}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                Pilih topik di sebelah kiri untuk melihat kajian medis lengkap.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Quiz Modal: Kuis Medis Nabawi */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-400 text-slate-950">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                    Kuis Cerdas Medis Qur'ani
                  </h3>
                  <p className="text-xs text-slate-500">
                    Soal {currentQuizIdx + 1} dari {quizQuestions.length} • Skor: {quizScore}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowQuizModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Question */}
            <div className="space-y-3">
              <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 leading-snug">
                {quizQuestions[currentQuizIdx].q}
              </h4>

              {/* Options */}
              <div className="space-y-2">
                {quizQuestions[currentQuizIdx].options.map((opt, oIdx) => {
                  const isSelected = selectedQuizOption === oIdx;
                  const isCorrect = oIdx === quizQuestions[currentQuizIdx].answer;

                  let optClass = 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';
                  if (isSelected && !quizAnswerSubmitted) {
                    optClass = 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-900 dark:text-rose-200 ring-2 ring-rose-400';
                  } else if (quizAnswerSubmitted) {
                    if (isCorrect) {
                      optClass = 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optClass = 'bg-rose-100 dark:bg-rose-950/80 border-rose-500 text-rose-950 dark:text-rose-100';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={quizAnswerSubmitted}
                      onClick={() => handleSelectQuizOption(oIdx)}
                      className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${optClass}`}
                    >
                      <span>{opt}</span>
                      {quizAnswerSubmitted && isCorrect && (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submit */}
              {quizAnswerSubmitted && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1 animate-in fade-in">
                  <span className="font-bold block">💡 Penjelasan Medis:</span>
                  <p>{quizQuestions[currentQuizIdx].explain}</p>
                </div>
              )}
            </div>

            {/* Quiz Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500">
                Skor Anda: {quizScore} / {quizQuestions.length}
              </span>

              {!quizAnswerSubmitted ? (
                <button
                  disabled={selectedQuizOption === null}
                  onClick={handleSubmitQuizAnswer}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedQuizOption !== null
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Periksa Jawaban
                </button>
              ) : currentQuizIdx < quizQuestions.length - 1 ? (
                <button
                  onClick={handleNextQuizQuestion}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Soal Berikutnya →
                </button>
              ) : (
                <button
                  onClick={handleResetQuiz}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold transition-all cursor-pointer"
                >
                  Ulangi Kuis ↺
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
