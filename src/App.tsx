import React, { useState, useEffect, useRef } from 'react';
import { Clock, Compass, BookOpen, Brain, Calendar } from 'lucide-react';
import { Header } from './components/Header';
import { PrayerTimesView } from './components/PrayerTimesView';
import { QiblaCompassView } from './components/QiblaCompassView';
import { TarjihPrayersView } from './components/TarjihPrayersView';
import { DzikirDoaView } from './components/DzikirDoaView';
import { MemorizeView } from './components/MemorizeView';
import { QuranView } from './components/QuranView';
import { QuranMappingView } from './components/QuranMappingView';
import { QuranMemorizeSHQView } from './components/QuranMemorizeSHQView';
import { KhgtCalendarView } from './components/KhgtCalendarView';
import { LocationModal } from './components/LocationModal';
import { SettingsModal } from './components/SettingsModal';
import { ExportPdfModal } from './components/ExportPdfModal';
import { InstallAppModal, usePWAInstall } from './components/InstallAppModal';

import { AppTab, LocationConfig, PrayerTimeData, TarjihPrayerItem, TarjihSettings } from './types';
import {
  DEFAULT_LOCATION,
  DEFAULT_SETTINGS,
  calculateTarjihPrayerTimes,
  getNextPrayerInfo,
  NextPrayerInfo,
} from './utils/prayerTimesTarjih';
import { audioReminder } from './utils/audioAlerts';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('tarjih_theme');
      return saved === 'dark';
    } catch {
      return false;
    }
  });

  // Current active view tab
  const [activeTab, setActiveTab] = useState<AppTab>('prayer-times');

  // Location configuration
  const [location, setLocation] = useState<LocationConfig>(() => {
    try {
      const saved = localStorage.getItem('tarjih_location');
      return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
    } catch {
      return DEFAULT_LOCATION;
    }
  });

  // Tarjih calculation & notification settings
  const [settings, setSettings] = useState<TarjihSettings>(() => {
    try {
      const saved = localStorage.getItem('tarjih_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Selected prayer for memorize module
  const [memorizeTargetPrayer, setMemorizeTargetPrayer] = useState<TarjihPrayerItem | null>(null);

  // Modals
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isExportPdfModalOpen, setIsExportPdfModalOpen] = useState<boolean>(false);

  // Notification status
  const [notificationGranted, setNotificationGranted] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });

  // Live timer states
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimeData>(() =>
    calculateTarjihPrayerTimes(new Date(), location, settings)
  );
  const [nextPrayer, setNextPrayer] = useState<NextPrayerInfo | null>(() =>
    getNextPrayerInfo(prayerTimes, new Date())
  );

  // Track triggered prayer times today to avoid repeat notifications within the same minute
  const triggeredTimesRef = useRef<Set<string>>(new Set());

  // Apply dark mode class to root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('tarjih_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('tarjih_theme', 'light');
    }
  }, [isDarkMode]);

  // Recalculate prayer times whenever location or settings change
  useEffect(() => {
    const times = calculateTarjihPrayerTimes(currentTime, location, settings);
    setPrayerTimes(times);
    setNextPrayer(getNextPrayerInfo(times, currentTime));
    localStorage.setItem('tarjih_location', JSON.stringify(location));
    localStorage.setItem('tarjih_settings', JSON.stringify(settings));
  }, [location, settings]);

  // 1-second interval clock and notification monitor
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // Re-evaluate next prayer info every second for accurate countdown
      const info = getNextPrayerInfo(prayerTimes, now);
      setNextPrayer(info);

      // Check for prayer reminder triggers
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const timeString = `${currentHours}:${currentMinutes}`;
      const dateString = now.toISOString().split('T')[0];

      // Check each prayer time
      const prayerList: { key: keyof TarjihSettings['alarmEnabled']; time: string; name: string }[] = [
        { key: 'imsak', time: prayerTimes.imsak, name: 'Imsak' },
        { key: 'subuh', time: prayerTimes.subuh, name: 'Subuh' },
        { key: 'dzuhur', time: prayerTimes.dzuhur, name: 'Dzuhur' },
        { key: 'ashar', time: prayerTimes.ashar, name: 'Ashar' },
        { key: 'maghrib', time: prayerTimes.maghrib, name: 'Maghrib' },
        { key: 'isya', time: prayerTimes.isya, name: 'Isya' },
      ];

      prayerList.forEach((p) => {
        if (p.time === timeString && settings.alarmEnabled[p.key]) {
          const triggerKey = `${dateString}_${p.key}_${timeString}`;
          if (!triggeredTimesRef.current.has(triggerKey)) {
            triggeredTimesRef.current.add(triggerKey);

            // Play audio alert
            if (settings.soundType === 'adzan') {
              audioReminder.playFullAdzan();
            } else if (settings.soundType === 'takbir') {
              audioReminder.playSynthesizedAdzanTakbir();
            } else if (settings.soundType === 'chime') {
              audioReminder.playGentleChime();
            }

            // Show visual notification
            audioReminder.showSystemNotification(
              `Waktu Sholat ${p.name} Telah Tiba`,
              `Pukul ${p.time} WIB/WITA/WIT untuk wilayah ${location.name}. Mari tunaikan sholat berjamaah.`
            );
          }
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [prayerTimes, settings, location.name]);

  const requestNotificationPermission = async () => {
    const granted = await audioReminder.requestPermission();
    setNotificationGranted(granted);
  };

  const handleStartMemorize = (prayer: TarjihPrayerItem) => {
    setMemorizeTargetPrayer(prayer);
    setActiveTab('memorize');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cross navigation between Quran reader & Quran mapping
  const [selectedSurahForQuran, setSelectedSurahForQuran] = useState<number>(1);
  const [selectedSurahForMapping, setSelectedSurahForMapping] = useState<number>(1);

  // PWA install state for Desktop PC & HP
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const { deferredPrompt, isInstallable, isInstalled, promptInstall } = usePWAInstall();

  const handleOpenQuranMapping = (surahNumber: number) => {
    setSelectedSurahForMapping(surahNumber);
    setActiveTab('quran-mapping');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToQuran = (surahNumber: number) => {
    setSelectedSurahForQuran(surahNumber);
    setActiveTab('quran');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenQuranMemorize = (surahNumber: number) => {
    setSelectedSurahForQuran(surahNumber);
    setActiveTab('quran-memorize-shq');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col transition-colors selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation & Status Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        location={location}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenExportPdf={() => setIsExportPdfModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onOpenQibla={() => {
          setActiveTab('prayer-times');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenMemorize={() => {
          setActiveTab('tarjih-prayers');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        nextPrayer={nextPrayer}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'prayer-times' && (
          <PrayerTimesView
            prayerTimes={prayerTimes}
            location={location}
            settings={settings}
            nextPrayer={nextPrayer}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            onRequestNotification={requestNotificationPermission}
            notificationGranted={notificationGranted}
            onUpdateLocation={setLocation}
            onOpenSHQ={() => {
              setActiveTab('quran-memorize-shq');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenQuran={() => {
              setActiveTab('quran');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'qibla' && (
          <QiblaCompassView
            location={location}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            onUpdateLocation={setLocation}
          />
        )}

        {activeTab === 'dzikir-doa' && (
          <DzikirDoaView onStartMemorize={handleStartMemorize} />
        )}

        {activeTab === 'tarjih-prayers' && (
          <TarjihPrayersView
            onStartMemorize={handleStartMemorize}
            initialPrayer={memorizeTargetPrayer}
          />
        )}

        {activeTab === 'memorize' && (
          <TarjihPrayersView
            initialMode="memorize"
            initialPrayer={memorizeTargetPrayer}
            onStartMemorize={handleStartMemorize}
          />
        )}

        {activeTab === 'quran' && (
          <QuranView
            initialSurahNumber={selectedSurahForQuran}
            onOpenQuranMapping={handleOpenQuranMapping}
            onOpenQuranMemorize={handleOpenQuranMemorize}
          />
        )}

        {activeTab === 'quran-mapping' && (
          <QuranMappingView
            initialSurahNumber={selectedSurahForMapping}
            onNavigateToQuran={handleNavigateToQuran}
          />
        )}

        {activeTab === 'quran-memorize-shq' && (
          <QuranMemorizeSHQView
            initialSurahNumber={selectedSurahForQuran}
            onNavigateToQuran={handleNavigateToQuran}
            onClose={() => setActiveTab('quran')}
          />
        )}

        {activeTab === 'khgt' && <KhgtCalendarView />}
      </main>

      {/* Floating Quick Shortcut to Hafal SHQ for Desktop */}
      {activeTab !== 'quran-memorize-shq' && (
        <aside aria-label="Akses Cepat Hafal SHQ" className="hidden sm:block fixed bottom-6 right-6 z-30">
          <button
            id="floating-shq-quick-btn"
            onClick={() => {
              setActiveTab('quran-memorize-shq');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:from-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl ring-2 ring-white/60 dark:ring-slate-900/60 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Buka Metode Hafal Qur'an SHQ (20-45 Menit Sehari)"
          >
            <Brain className="w-4 h-4 text-slate-950" />
            <span className="font-extrabold">Hafal Qur'an (SHQ)</span>
          </button>
        </aside>
      )}

      {/* Fixed Bottom Navigation Bar for Mobile Phones (Always in View Under Thumb) */}
      <nav
        aria-label="Navigasi Bawah Layar HP"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-xl px-1.5 py-1.5 flex items-center justify-around"
      >
        {/* Sholat */}
        <button
          onClick={() => {
            setActiveTab('prayer-times');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
            activeTab === 'prayer-times'
              ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Clock className="w-5 h-5 mb-0.5" />
          <span>Sholat</span>
        </button>

        {/* Kiblat */}
        <button
          onClick={() => {
            setActiveTab('qibla');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
            activeTab === 'qibla'
              ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span>Kiblat</span>
        </button>

        {/* Al-Qur'an */}
        <button
          onClick={() => {
            setActiveTab('quran');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
            activeTab === 'quran'
              ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span>Al-Qur'an</span>
        </button>

        {/* Hafal SHQ */}
        <button
          id="mobile-bottom-nav-shq"
          onClick={() => {
            setActiveTab('quran-memorize-shq');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
            activeTab === 'quran-memorize-shq'
              ? 'text-amber-600 dark:text-amber-400 font-extrabold'
              : 'text-slate-500 dark:text-slate-400 hover:text-amber-600'
          }`}
        >
          <Brain className="w-5 h-5 mb-0.5" />
          <span>Hafal SHQ</span>
        </button>

        {/* Kalender */}
        <button
          onClick={() => {
            setActiveTab('khgt');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
            activeTab === 'khgt'
              ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Calendar className="w-5 h-5 mb-0.5" />
          <span>Kalender</span>
        </button>
      </nav>

      {/* Modals */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={location}
        onSelectLocation={(newLoc) => setLocation(newLoc)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) => setSettings(newSettings)}
        onRequestNotification={requestNotificationPermission}
        notificationGranted={notificationGranted}
      />

      <ExportPdfModal
        isOpen={isExportPdfModalOpen}
        onClose={() => setIsExportPdfModalOpen(false)}
        location={location}
        settings={settings}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
      />

      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onPromptInstall={promptInstall}
        isInstalled={isInstalled}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Oase-Muslim: Aplikasi Muslim Terpadu
          </p>
          <p className="max-w-2xl mx-auto leading-relaxed">
            Dilengkapi jadwal waktu sholat hisab astronomis kontemporer (Subuh -18°), penunjuk arah kiblat peta satelit, dzikir & doa harian, Al-Qur'an Mushaf Indonesia dengan Tajwid Berwarna, Modul Tahfizh Doa, serta Kalender Hijriah Global Tunggal (KHGT).
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-2">
            © {new Date().getFullYear()} Oase-Muslim • Aplikasi Muslim Terpadu
          </p>
        </div>
      </footer>
    </div>
  );
}
