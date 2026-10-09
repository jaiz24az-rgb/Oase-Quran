import React from 'react';
import {
  Compass,
  BookOpen,
  Clock,
  Calendar,
  BookmarkCheck,
  MapPin,
  Bell,
  Brain,
  Sun,
  Moon,
  Sparkles,
  Layers,
  FileDown,
  Download,
} from 'lucide-react';
import { HijriDateInfo, getKhgtHijriDate } from '../utils/khgtCalendar';
import { LocationConfig, AppTab } from '../types';
import { NextPrayerInfo } from '../utils/prayerTimesTarjih';
import { OaseLogo } from './OaseLogo';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  hijriDate?: HijriDateInfo;
  location: LocationConfig;
  nextPrayer: NextPrayerInfo | null;
  onOpenSettings: () => void;
  onOpenLocationModal: () => void;
  onOpenExportPdf?: () => void;
  onOpenInstallModal?: () => void;
  onOpenQibla?: () => void;
  onOpenMemorize?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  hijriDate,
  location,
  nextPrayer,
  onOpenSettings,
  onOpenLocationModal,
  onOpenExportPdf,
  onOpenInstallModal,
  onOpenQibla,
  onOpenMemorize,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const currentHijri = hijriDate || getKhgtHijriDate(new Date());

  const handleQiblaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenQibla) {
      onOpenQibla();
    } else {
      setActiveTab('qibla');
    }
  };

  const handleMemorizeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenMemorize) {
      onOpenMemorize();
    } else {
      setActiveTab('memorize');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800 shadow-xs">
      {/* Top Banner: Official Logo, Date, Location, and Countdown */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Oase-Muslim Branding & KHGT Badge */}
        <div className="flex items-center gap-3">
          <OaseLogo
            size="sm"
            onClick={() => setActiveTab('prayer-times')}
            variant="badge"
          />

          {/* KHGT Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-medium border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-bold">KHGT:</span>
            <span className="text-emerald-700 dark:text-emerald-300 font-bold text-[11px]">
              {currentHijri.formatted}
            </span>
          </div>
        </div>

        {/* Right side: Location, Next Prayer, Install App, PDF, Settings */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          {/* Location button */}
          <button
            id="header-location-btn"
            onClick={onOpenLocationModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer text-xs"
            title="Ubah lokasi sholat"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium max-w-[110px] sm:max-w-[160px] truncate">{location.name}</span>
          </button>

          {/* Next prayer countdown chip */}
          {nextPrayer && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-medium shadow-xs text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>{nextPrayer.name}</span>
              <span className="opacity-90">{nextPrayer.time}</span>
              <span className="text-[11px] bg-emerald-700 px-1.5 py-0.5 rounded font-mono">
                {nextPrayer.formattedCountdown}
              </span>
            </div>
          )}

          {/* Install PWA Button (Desktop & Mobile) */}
          {onOpenInstallModal && (
            <button
              id="header-install-app-btn"
              onClick={onOpenInstallModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition-all cursor-pointer hover:scale-102 active:scale-98"
              title="Pasang / Install Aplikasi ke Layar Utama Desktop PC atau HP"
            >
              <Download className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">Pasang App</span>
            </button>
          )}

          {/* Export PDF Button */}
          {onOpenExportPdf && (
            <button
              id="header-export-pdf-btn"
              onClick={onOpenExportPdf}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs shadow-xs transition-colors cursor-pointer"
              title="Ekspor Jadwal Sholat Bulanan ke Format PDF"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Cetak PDF</span>
            </button>
          )}

          {/* Dark Mode Toggle */}
          {onToggleDarkMode && (
            <button
              id="header-theme-btn"
              onClick={onToggleDarkMode}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              title={isDarkMode ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {/* Settings & Notifications Button */}
          <button
            id="header-settings-btn"
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            title="Pengaturan Sholat & Notifikasi"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs: Reordered & Integrated as Requested */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex space-x-1.5 sm:space-x-2 overflow-x-auto py-2 scrollbar-none items-center">
          {/* TAB 1: Waktu Sholat + 1-Tap Arah Kiblat */}
          <div
            className={`flex items-center rounded-lg transition-all ${
              activeTab === 'prayer-times' || activeTab === 'qibla'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <button
              id="nav-tab-prayer"
              onClick={() => setActiveTab('prayer-times')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              <span>Waktu Sholat</span>
            </button>

            {/* Small 1-Tap Kiblat Icon Button */}
            <button
              id="nav-subtab-qibla"
              onClick={handleQiblaClick}
              className={`mr-1 px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activeTab === 'qibla'
                  ? 'bg-amber-400 text-slate-900 shadow-xs ring-1 ring-white/50'
                  : activeTab === 'prayer-times'
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-amber-300 hover:text-white'
                  : 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800'
              }`}
              title="Buka Arah Kiblat Presisi (1-Tap)"
            >
              <Compass className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>Kiblat</span>
            </button>
          </div>

          {/* TAB 2: Al-Qur'an Indonesia */}
          <button
            id="nav-tab-quran"
            onClick={() => setActiveTab('quran')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'quran'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Al-Qur'an Indonesia</span>
          </button>

          {/* TAB 3: Hafal Qur'an (SHQ) - Dedicated & Prominent Tab */}
          <button
            id="nav-tab-shq"
            onClick={() => setActiveTab('quran-memorize-shq')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer shadow-xs ${
              activeTab === 'quran-memorize-shq'
                ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300 font-black'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-700/80'
            }`}
            title="Buka Metode Hafal Qur'an SHQ (20-45 Menit Sehari)"
          >
            <Brain className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-amber-400/20" />
            <span>Hafal Qur'an (SHQ)</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-900 dark:text-amber-200 px-1.5 py-0.5 rounded-full font-extrabold uppercase">
              20 Mnt
            </span>
          </button>

          {/* TAB 3: Kalender KHGT (Shifted right after Al-Qur'an) */}
          <button
            id="nav-tab-khgt"
            onClick={() => setActiveTab('khgt')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'khgt'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Kalender KHGT</span>
          </button>

          {/* TAB 4: Doa & Sholat + 1-Tap Hafalan */}
          <div
            className={`flex items-center rounded-lg transition-all ${
              activeTab === 'tarjih-prayers' || activeTab === 'memorize'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <button
              id="nav-tab-tarjih"
              onClick={() => setActiveTab('tarjih-prayers')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap cursor-pointer"
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>Doa & Sholat</span>
            </button>

            {/* Small 1-Tap Hafalan Icon Button */}
            <button
              id="nav-subtab-memorize"
              onClick={handleMemorizeClick}
              className={`mr-1 px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activeTab === 'memorize'
                  ? 'bg-amber-400 text-slate-900 shadow-xs ring-1 ring-white/50'
                  : activeTab === 'tarjih-prayers'
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-emerald-200 hover:text-white'
                  : 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800'
              }`}
              title="Buka Modul Hafalan Doa (1-Tap)"
            >
              <Brain className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>Hafalan</span>
            </button>
          </div>

          {/* TAB 5: Dzikir & Doa */}
          <button
            id="nav-tab-dzikir-doa"
            onClick={() => setActiveTab('dzikir-doa')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'dzikir-doa'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Dzikir & Doa</span>
          </button>

          {/* TAB 6: Quran Mapping */}
          <button
            id="nav-tab-quran-mapping"
            onClick={() => setActiveTab('quran-mapping')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'quran-mapping'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Quran Mapping</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
