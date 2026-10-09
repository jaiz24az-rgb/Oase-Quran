import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Layers,
  Search,
  CheckCircle2,
  FileText,
  Copy,
  Check,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  X,
  Scale,
  Sparkles,
  Clock,
  ExternalLink,
  ShieldCheck,
  Compass,
  Heart,
  Network,
  Share2,
} from 'lucide-react';
import { SURAH_LIST } from '../data/quranData';
import {
  QURAN_GRAND_MAP_OVERVIEW,
  getOrGenerateSurahMapping,
} from '../data/quranMappingData';
import { QuranMappingItem } from '../types';

interface QuranMappingViewProps {
  initialSurahNumber?: number;
  onNavigateToQuran?: (surahNumber: number) => void;
}

type SubTab = 'surah-map' | 'grand-overview';

export const QuranMappingView: React.FC<QuranMappingViewProps> = ({
  initialSurahNumber = 1,
  onNavigateToQuran,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('surah-map');
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(initialSurahNumber);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Meccan' | 'Medinan' | 'juz30'>('all');
  const [activePillar, setActivePillar] = useState<'all' | 1 | 2 | 3 | 4 | 5>('all');
  const [copied, setCopied] = useState(false);
  const [showSurahModal, setShowSurahModal] = useState<boolean>(false);

  const handlePrevSurah = () => {
    if (selectedSurahNumber > 1) {
      setSelectedSurahNumber(selectedSurahNumber - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextSurah = () => {
    if (selectedSurahNumber < 114) {
      setSelectedSurahNumber(selectedSurahNumber + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectSurah = (num: number) => {
    setSelectedSurahNumber(num);
    setShowSurahModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered surah list
  const filteredSurahs = useMemo(() => {
    return SURAH_LIST.filter((s) => {
      const matchType =
        filterType === 'all'
          ? true
          : filterType === 'juz30'
          ? s.number >= 78
          : s.revelationType === filterType;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        q === '' ||
        s.number.toString() === q ||
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        s.name.includes(q);

      return matchType && matchSearch;
    });
  }, [searchQuery, filterType]);

  // Selected surah mapping item
  const selectedSurahMeta = useMemo(() => {
    return SURAH_LIST.find((s) => s.number === selectedSurahNumber) || SURAH_LIST[0];
  }, [selectedSurahNumber]);

  const currentMapping: QuranMappingItem = useMemo(() => {
    return getOrGenerateSurahMapping(selectedSurahMeta);
  }, [selectedSurahMeta]);

  // Copy mapping summary
  const handleCopySummary = () => {
    const text = `📘 QURAN MAPPING: SURAH ${currentMapping.surahNumber}. ${currentMapping.surahName.toUpperCase()} (${currentMapping.arabicName})\nArti: "${currentMapping.meaning}" | ${currentMapping.revelationType} | ${currentMapping.numberOfAyahs} Ayat\n\n1. POKOK KANDUNGAN:\nTema: ${currentMapping.pokokKandungan.temaUtama}\nLatar Belakang: ${currentMapping.pokokKandungan.konteksDanLatarBelakang}\n\n2. PELAJARAN & HIKMAH:\n${currentMapping.pelajaranDanHikmah.map((h, i) => `• ${h}`).join('\n')}\n\n3. HUKUM ISLAM:\nPerintah: ${currentMapping.hukumIslam.perintah.join('; ')}\nLarangan: ${currentMapping.hukumIslam.larangan.join('; ')}\nPrinsip: ${currentMapping.hukumIslam.prinsipSyariah}\n\n4. KETERKAITAN ANTAR SURAH:\nDengan Sebelumnya: ${currentMapping.keterkaitanAntarSurah.denganSebelumnya}\nDengan Sesudahnya: ${currentMapping.keterkaitanAntarSurah.denganSesudahnya}\n\n5. KUNCI PESAN:\n"${currentMapping.gambaranBesar.kunciPesan}"`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header based on user's concept */}
      <div className="bg-linear-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-wide backdrop-blur-xs border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Ini bukan tafsir. Bukan terjemah biasa.</span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Quran Mapping 114 Surah
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              Mengurai 114 surah satu per satu — kandungannya, hikmahnya, pelajaran hidup yang langsung bisa kamu pegang, sampai bagaimana tiap surah tersambung satu sama lain. Buka surah manapun, 5–15 menit, pahami apa yang Allah sampaikan di dalamnya.
            </p>
          </div>

          {/* 5 Hal Utama di Setiap Surah Badges */}
          <div className="pt-2">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">
              Di setiap surah, kamu mendapatkan 5 pilar ini:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 backdrop-blur-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-slate-100">1. Pokok Kandungan</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 backdrop-blur-xs">
                <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
                <span className="font-semibold text-slate-100">2. Pelajaran & Hikmah</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 backdrop-blur-xs">
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="font-semibold text-slate-100">3. Hukum Islam</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 backdrop-blur-xs">
                <CheckCircle2 className="w-4 h-4 text-blue-300 shrink-0" />
                <span className="font-semibold text-slate-100">4. Kaitan Antar Surah</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 backdrop-blur-xs col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-purple-300 shrink-0" />
                <span className="font-semibold text-slate-100">5. Gambaran Besar</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('surah-map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === 'surah-map'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Peta Tiap Surah (114 Surah)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('grand-overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === 'grand-overview'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Gambaran Besar Seluruh Al-Qur'an</span>
          </button>
        </div>

        {activeSubTab === 'surah-map' && onNavigateToQuran && (
          <button
            onClick={() => onNavigateToQuran(selectedSurahNumber)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            title="Buka surah ini di pembaca Al-Qur'an lengkap dengan tajwid"
          >
            <span>Baca Ayat Lengkap</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {activeSubTab === 'grand-overview' ? (
        /* Grand Overview of the Entire Quran */
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-600" />
              <span>Arsitektur & Peta Tematik Al-Qur'an</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Al-Qur'an bukan sekadar kumpulan teks acak, melainkan rajutan wahyu yang memiliki struktur organis maha sempurna. Dari Al-Fatihah (permohonan petunjuk hidup), langsung dijawab di Al-Baqarah, hingga ditutup di An-Naas (perlindungan dari bisikan yang merusak hati).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {QURAN_GRAND_MAP_OVERVIEW.map((part, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 space-y-3 hover:border-emerald-400 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                      {part.surahRange}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">{part.period}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {part.title}
                  </h3>
                  <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                    Tema: {part.coreTheme}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {part.description}
                  </p>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] text-slate-500 font-bold">Surah Kunci:</span>
                    {part.keySurahs.map((ks, kIdx) => (
                      <span
                        key={kIdx}
                        className="text-[11px] bg-white dark:bg-slate-750 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-600 font-medium text-slate-700 dark:text-slate-300"
                      >
                        {ks}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* 114 Surahs Mapping Explorer */
        <div className="space-y-4">
          {/* Quick Surah Navigator Bar: Immediately visible at top, no vertical scrolling needed */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-2.5 sm:p-3.5 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between gap-2">
            <button
              onClick={handlePrevSurah}
              disabled={selectedSurahNumber <= 1}
              className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer shrink-0"
              title="Surah Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            {/* Center Quick Selector: Tapping immediately opens modal to pick any surah directly */}
            <button
              onClick={() => setShowSurahModal(true)}
              className="flex-1 max-w-lg mx-auto flex items-center justify-between gap-2 sm:gap-3 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/90 dark:bg-emerald-950/50 dark:hover:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-100 transition-colors cursor-pointer group"
              title="Klik untuk memilih langsung dari 114 surah tanpa scroll"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {currentMapping.surahNumber}
                </span>
                <div className="text-left truncate">
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                    <span>Surah {currentMapping.surahName}</span>
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-normal hidden xs:inline">
                      ({currentMapping.meaning})
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {currentMapping.numberOfAyahs} Ayat • {currentMapping.revelationType} • {currentMapping.juz}
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
              disabled={selectedSurahNumber >= 114}
              className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer shrink-0"
              title="Surah Berikutnya"
            >
              <span className="hidden sm:inline">Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Desktop-only Left Column: Surah Selector & Filter */}
            <div className="hidden lg:block lg:col-span-4 sticky top-20 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Pilih Surah (1 - 114)</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pilih surah untuk melihat 5 pilar kandungan & hikmahnya.
                </p>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama, nomor, arti..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    filterType === 'all'
                      ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setFilterType('Meccan')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    filterType === 'Meccan'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Makkiyyah
                </button>
                <button
                  onClick={() => setFilterType('Medinan')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    filterType === 'Medinan'
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Madaniyyah
                </button>
                <button
                  onClick={() => setFilterType('juz30')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    filterType === 'juz30'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Juz 30
                </button>
              </div>

              {/* Surah List Scrollable */}
              <div className="space-y-1.5 max-h-[550px] overflow-y-auto pr-1 scrollbar-thin">
                {filteredSurahs.map((s) => {
                  const isSelected = s.number === selectedSurahNumber;
                  return (
                    <button
                      key={s.number}
                      onClick={() => handleSelectSurah(s.number)}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-emerald-700 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {s.number}
                        </span>
                        <div>
                          <div className="font-bold text-xs">{s.englishName}</div>
                          <div
                            className={`text-[10px] ${
                              isSelected ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {s.englishNameTranslation} • {s.numberOfAyahs} ayat
                          </div>
                        </div>
                      </div>
                      <span
                        dir="rtl"
                        className={`font-quran text-sm ${
                          isSelected ? 'text-white' : 'text-emerald-700 dark:text-emerald-400'
                        }`}
                      >
                        {s.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Content: 5 Pillars of the Selected Surah */}
            <div className="lg:col-span-8 space-y-4">
            {/* Surah Header Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-750 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                      {currentMapping.surahNumber}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                      Surah {currentMapping.surahName}
                    </h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {currentMapping.meaning}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                      {currentMapping.revelationType}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span>{currentMapping.numberOfAyahs} Ayat</span>
                    <span>•</span>
                    <span>{currentMapping.juz}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      Estimasi: {currentMapping.estimatedReadingMinutes} menit
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySummary}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Salin ringkasan Quran Mapping surah ini"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>

                  {onNavigateToQuran && (
                    <button
                      onClick={() => onNavigateToQuran(selectedSurahNumber)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Buka Ayat Al-Qur'an</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Filter between the 5 Pillars or Show All */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                <button
                  onClick={() => setActivePillar('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                    activePillar === 'all'
                      ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Semua 5 Hal
                </button>
                <button
                  onClick={() => setActivePillar(1)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                    activePillar === 1
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  1. Pokok Kandungan
                </button>
                <button
                  onClick={() => setActivePillar(2)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                    activePillar === 2
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  2. Pelajaran & Hikmah
                </button>
                <button
                  onClick={() => setActivePillar(3)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                    activePillar === 3
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  3. Hukum Islam
                </button>
                <button
                  onClick={() => setActivePillar(4)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                    activePillar === 4
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  4. Keterkaitan Surah
                </button>
                <button
                  onClick={() => setActivePillar(5)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                    activePillar === 5
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  5. Gambaran Besar
                </button>
              </div>
            </div>

            {/* The 5 Cards */}
            <div className="space-y-4">
              {/* Pillar 1: Pokok Kandungan */}
              {(activePillar === 'all' || activePillar === 1) && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-emerald-200 dark:border-slate-700 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-extrabold text-sm sm:text-base border-b border-slate-100 dark:border-slate-750 pb-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>1. Pokok Kandungan Surah</span>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm">
                    <div>
                      <span className="font-bold text-slate-500 uppercase tracking-wider block text-[11px] mb-1">
                        Tema Utama:
                      </span>
                      <p className="text-slate-900 dark:text-white font-medium leading-relaxed bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                        {currentMapping.pokokKandungan.temaUtama}
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-slate-500 uppercase tracking-wider block text-[11px] mb-1">
                        Konteks & Latar Belakang:
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {currentMapping.pokokKandungan.konteksDanLatarBelakang}
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-slate-500 uppercase tracking-wider block text-[11px] mb-1">
                        Kenapa Penting Dipahami:
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {currentMapping.pokokKandungan.urgensiMemahami}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Pillar 2: Pelajaran & Hikmah */}
              {(activePillar === 'all' || activePillar === 2) && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-teal-200 dark:border-slate-700 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-extrabold text-sm sm:text-base border-b border-slate-100 dark:border-slate-750 pb-2">
                    <Heart className="w-5 h-5 text-teal-600" />
                    <span>2. Pelajaran & Hikmah Kehidupan</span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pelajaran praktis yang bisa langsung kamu terapkan dalam keseharian:
                  </p>

                  <div className="space-y-2.5">
                    {currentMapping.pelajaranDanHikmah.map((hikmah, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-750"
                      >
                        <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                          {hikmah}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pillar 3: Hukum Islam yang Terkandung */}
              {(activePillar === 'all' || activePillar === 3) && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-amber-200 dark:border-slate-700 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-extrabold text-sm sm:text-base border-b border-slate-100 dark:border-slate-750 pb-2">
                    <Scale className="w-5 h-5 text-amber-600" />
                    <span>3. Hukum Islam yang Terkandung</span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Panduan hidup konkret: apa yang diperintahkan, dilarang, dan hikmah syariatnya:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                    {/* Perintah */}
                    <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-2">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Apa yang Diperintahkan:</span>
                      </span>
                      <ul className="space-y-1.5 list-disc list-inside text-slate-700 dark:text-slate-300">
                        {currentMapping.hukumIslam.perintah.map((p, i) => (
                          <li key={i} className="leading-relaxed">
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Larangan */}
                    <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 space-y-2">
                      <span className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-rose-600" />
                        <span>Apa yang Dilarang:</span>
                      </span>
                      <ul className="space-y-1.5 list-disc list-inside text-slate-700 dark:text-slate-300">
                        {currentMapping.hukumIslam.larangan.map((l, i) => (
                          <li key={i} className="leading-relaxed">
                            {l}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-750 text-xs">
                    <span className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Prinsip Maqashid Syariah:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {currentMapping.hukumIslam.prinsipSyariah}
                    </p>
                  </div>
                </div>
              )}

              {/* Pillar 4: Keterkaitan Antar Surah */}
              {(activePillar === 'all' || activePillar === 4) && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-blue-200 dark:border-slate-700 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-extrabold text-sm sm:text-base border-b border-slate-100 dark:border-slate-750 pb-2">
                    <Network className="w-5 h-5 text-blue-600" />
                    <span>4. Keterkaitan Antar Surah (Munasabah)</span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Al-Qur'an bukan kumpulan teks berdiri sendiri; lihat bagaimana surah ini tersambung:
                  </p>

                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-750 space-y-1">
                      <span className="font-bold text-blue-700 dark:text-blue-400 block text-[11px] uppercase tracking-wider">
                        Kaitan dengan Surah Sebelumnya:
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {currentMapping.keterkaitanAntarSurah.denganSebelumnya}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-750 space-y-1">
                      <span className="font-bold text-blue-700 dark:text-blue-400 block text-[11px] uppercase tracking-wider">
                        Kaitan dengan Surah Sesudahnya:
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {currentMapping.keterkaitanAntarSurah.denganSesudahnya}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-1">
                      <span className="font-bold text-blue-800 dark:text-blue-300 block text-[11px] uppercase tracking-wider">
                        Benang Merah Tematik:
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                        {currentMapping.keterkaitanAntarSurah.benangMerah}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Pillar 5: Gambaran Besar Seluruh Quran & Peta Alur Surah */}
              {(activePillar === 'all' || activePillar === 5) && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-purple-200 dark:border-slate-700 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-extrabold text-sm sm:text-base border-b border-slate-100 dark:border-slate-750 pb-2">
                    <Compass className="w-5 h-5 text-purple-600" />
                    <span>5. Gambaran Besar & Peta Alur Tema</span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wider block">
                      Posisi dalam Peta Al-Qur'an:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">
                      {currentMapping.gambaranBesar.posisiDalamQuran}
                    </p>
                  </div>

                  {/* Flow Sections Timeline */}
                  <div className="space-y-2 pt-1">
                    <span className="font-bold text-slate-500 uppercase tracking-wider block text-xs">
                      Peta Alur Alur Pembahasan Surah:
                    </span>

                    <div className="space-y-2">
                      {currentMapping.gambaranBesar.petaAlurTema.map((sec, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                                {sec.ayatRange}
                              </span>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                {sec.title}
                              </h4>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                              {sec.coreMessage}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Kunci Pesan */}
                  <div className="p-4 rounded-xl bg-linear-to-r from-emerald-600 to-teal-700 text-white space-y-1">
                    <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider block">
                      Kunci Pesan Surah:
                    </span>
                    <p className="text-xs sm:text-sm font-semibold italic leading-relaxed">
                      "{currentMapping.gambaranBesar.kunciPesan}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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
                    Klik surah untuk langsung melihat peta 5 pilar kandungan & hikmahnya
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
                  placeholder="Cari nama surat, nomor (1-114), atau arti..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    filterType === 'all'
                      ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                      : 'bg-white dark:bg-slate-750 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Semua ({SURAH_LIST.length})
                </button>
                <button
                  onClick={() => setFilterType('Meccan')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    filterType === 'Meccan'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-slate-750 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Makkiyyah
                </button>
                <button
                  onClick={() => setFilterType('Medinan')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    filterType === 'Medinan'
                      ? 'bg-teal-600 text-white'
                      : 'bg-white dark:bg-slate-750 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Madaniyyah
                </button>
                <button
                  onClick={() => setFilterType('juz30')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    filterType === 'juz30'
                      ? 'bg-amber-600 text-white'
                      : 'bg-white dark:bg-slate-750 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Juz 30
                </button>
              </div>
            </div>

            {/* Surah List in Modal */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 max-h-[50vh] scrollbar-thin">
              {filteredSurahs.map((s) => {
                const isSelected = s.number === selectedSurahNumber;
                return (
                  <button
                    key={s.number}
                    onClick={() => handleSelectSurah(s.number)}
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
                        {s.number}
                      </span>
                      <div>
                        <div className="font-bold text-xs sm:text-sm">{s.englishName}</div>
                        <div
                          className={`text-[10px] ${
                            isSelected ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {s.englishNameTranslation} • {s.numberOfAyahs} ayat • {s.revelationType === 'Meccan' ? 'Makkiyyah' : 'Madaniyyah'}
                        </div>
                      </div>
                    </div>
                    <span
                      dir="rtl"
                      className={`font-quran text-base ${
                        isSelected ? 'text-white' : 'text-emerald-700 dark:text-emerald-400'
                      }`}
                    >
                      {s.name}
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
