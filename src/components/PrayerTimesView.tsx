import React, { useState, useMemo } from 'react';
import {
  Clock,
  Volume2,
  Bell,
  MapPin,
  Info,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  FileDown,
  Printer,
  Sparkles,
  Compass,
  ChevronDown,
  ChevronUp,
  X,
  Brain,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { LocationConfig, PrayerTimeData, TarjihSettings } from '../types';
import { NextPrayerInfo, calculateTarjihPrayerTimes, calculateQibla } from '../utils/prayerTimesTarjih';
import { audioReminder } from '../utils/audioAlerts';
import { ExportPdfModal } from './ExportPdfModal';
import { QiblaCompassView } from './QiblaCompassView';
import { OaseEmblem } from './OaseLogo';

interface PrayerTimesViewProps {
  prayerTimes: PrayerTimeData;
  location: LocationConfig;
  settings: TarjihSettings;
  nextPrayer: NextPrayerInfo | null;
  onOpenSettings: () => void;
  onOpenLocationModal: () => void;
  onRequestNotification: () => void;
  notificationGranted: boolean;
  onUpdateLocation?: (loc: LocationConfig) => void;
  initialShowQibla?: boolean;
  onOpenSHQ?: () => void;
  onOpenQuran?: () => void;
}

export const PrayerTimesView: React.FC<PrayerTimesViewProps> = ({
  prayerTimes,
  location,
  settings,
  nextPrayer,
  onOpenSettings,
  onOpenLocationModal,
  onRequestNotification,
  notificationGranted,
  onUpdateLocation,
  initialShowQibla = false,
  onOpenSHQ,
  onOpenQuran,
}) => {
  const [isPlayingAdzan, setIsPlayingAdzan] = useState(false);
  const [isPlayingDzikir, setIsPlayingDzikir] = useState(false);
  const [showMonthlyView, setShowMonthlyView] = useState(false);
  const [selectedMonthOffset, setSelectedMonthOffset] = useState(0);
  const [isExportPdfOpen, setIsExportPdfOpen] = useState(false);
  const [showEmbeddedQibla, setShowEmbeddedQibla] = useState<boolean>(initialShowQibla);

  const qiblaInfo = useMemo(
    () => calculateQibla(location.latitude, location.longitude),
    [location.latitude, location.longitude]
  );

  const handleTestAudio = () => {
    if (isPlayingAdzan) {
      audioReminder.stopAudio();
      setIsPlayingAdzan(false);
    } else {
      audioReminder.stopAudio();
      setIsPlayingDzikir(false);
      setIsPlayingAdzan(true);
      if (settings.soundType === 'adzan') {
        audioReminder.playFullAdzan();
      } else {
        audioReminder.playSynthesizedAdzanTakbir();
      }
      setTimeout(() => {
        setIsPlayingAdzan(false);
      }, 15000);
    }
  };

  const handleTestDzikir = () => {
    if (isPlayingDzikir) {
      audioReminder.stopAudio();
      setIsPlayingDzikir(false);
    } else {
      audioReminder.stopAudio();
      setIsPlayingAdzan(false);
      setIsPlayingDzikir(true);
      audioReminder.playDzikirAudio();
      setTimeout(() => {
        setIsPlayingDzikir(false);
      }, 15000);
    }
  };

  const prayerItems: {
    key: keyof PrayerTimeData;
    label: string;
    arabic: string;
    desc: string;
    isKeyFardhu?: boolean;
    isTarjihSpecial?: boolean;
  }[] = [
    { key: 'imsak', label: 'Imsak', arabic: 'الإمساك', desc: '10 mnt sebelum Subuh (Tanbih)' },
    {
      key: 'subuh',
      label: 'Subuh',
      arabic: 'الفجر',
      desc: 'Standar Fajar Shadiq (-18°)',
      isKeyFardhu: true,
      isTarjihSpecial: true,
    },
    { key: 'terbit', label: 'Terbit (Syuruq)', arabic: 'الشروق', desc: 'Matahari terbit (-0.833°)' },
    { key: 'dhuha', label: 'Dhuha', arabic: 'الضحى', desc: 'Matahari setinggi 4.5°' },
    { key: 'dzuhur', label: 'Dzuhur', arabic: 'الظهر', desc: 'Matahari tergelincir (Zawal)', isKeyFardhu: true },
    { key: 'ashar', label: 'Ashar', arabic: 'العصر', desc: 'Bayangan = panjang benda (1x)', isKeyFardhu: true },
    { key: 'maghrib', label: 'Maghrib', arabic: 'المغرب', desc: 'Matahari terbenam', isKeyFardhu: true },
    { key: 'isya', label: 'Isya', arabic: 'العشاء', desc: 'Matahari -18° di ufuk barat', isKeyFardhu: true },
  ];

  // Generate 30 days monthly table if requested
  const getMonthlyDays = () => {
    const days = [];
    const now = new Date();
    const targetMonth = new Date(now.getFullYear(), now.getMonth() + selectedMonthOffset, 1);
    const totalDays = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0).getDate();

    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), i);
      const times = calculateTarjihPrayerTimes(d, location, settings);
      days.push({
        date: d,
        dayNum: i,
        dayName: d.toLocaleDateString('id-ID', { weekday: 'short' }),
        times,
      });
    }
    return days;
  };

  return (
    <div className="space-y-6">
      {/* HEADER CARD: OASE-MUSLIM */}
      <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5 text-center sm:text-left">
          <div className="shrink-0 w-12 h-12 rounded-2xl bg-white dark:bg-slate-750 p-1.5 shadow-md ring-1 ring-emerald-500/20 flex items-center justify-center">
            <OaseEmblem size={38} />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="text-sm sm:text-base font-black tracking-tight text-emerald-900 dark:text-emerald-300">
                Oase-Muslim
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Aplikasi Muslim Terpadu
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              Jadwal Waktu Sholat & Imsakiyah Hisab Hakiki
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Pedoman hisab astronomis akurat, penetapan awal waktu Subuh -18° & Kalender Hijriah Global Tunggal (KHGT). Wilayah <strong className="text-slate-800 dark:text-slate-200">{location.name}</strong> ({Math.abs(location.latitude).toFixed(4)}° {location.latitude >= 0 ? 'LU' : 'LS'}, {Math.abs(location.longitude).toFixed(4)}° {location.longitude >= 0 ? 'BT' : 'BB'}).
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={() => setIsExportPdfOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            title="Cetak Jadwal Bulanan PDF"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Cetak Jadwal PDF</span>
          </button>
        </div>
      </div>

      {/* Hero Card: Next Prayer & Countdown */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white p-6 sm:p-8 shadow-lg">
        {/* Subtle decorative geometric overlay */}
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute right-4 bottom-2 text-white/5 font-serif text-8xl font-black select-none pointer-events-none">
          {nextPrayer?.name || 'TARJIH'}
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-emerald-100 text-xs sm:text-sm font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Hisab Astronomis Akurat Kontemporer (Subuh -18°)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              {nextPrayer ? `Menjelang Sholat ${nextPrayer.name}` : 'Jadwal Sholat Harian'}
            </h1>
            <p className="text-emerald-100/90 text-sm max-w-lg">
              Perhitungan astronomis akurat dengan parameter resmi awal waktu Subuh -18° di bawah ufuk.
            </p>
          </div>

          {/* Countdown & Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3">
            {nextPrayer && (
              <div className="bg-black/25 backdrop-blur-md px-5 py-3.5 rounded-xl border border-white/10 flex flex-col items-start md:items-end">
                <span className="text-xs text-emerald-200 uppercase tracking-wider font-semibold">Hitung Mundur Waktu</span>
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-wide">
                  {nextPrayer.formattedCountdown}
                </span>
                <span className="text-xs text-emerald-300 mt-0.5">Pukul {nextPrayer.time} WIB/WITA/WIT</span>
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <button
                id="btn-test-adzan"
                onClick={handleTestAudio}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                title="Putar suara adzan penuh otentik"
              >
                <Volume2 className={`w-4 h-4 ${isPlayingAdzan ? 'animate-bounce text-amber-300' : ''}`} />
                <span>{isPlayingAdzan ? 'Hentikan Adzan' : 'Tes Suara Adzan'}</span>
              </button>

              <button
                id="btn-test-dzikir"
                onClick={handleTestDzikir}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-900/80 border border-emerald-400/30 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                title="Putar suara pelafalan dzikir tartil otentik"
              >
                <Volume2 className={`w-4 h-4 ${isPlayingDzikir ? 'animate-bounce text-emerald-300' : ''}`} />
                <span>{isPlayingDzikir ? 'Hentikan Dzikir' : 'Tes Suara Dzikir'}</span>
              </button>

              <button
                id="btn-toggle-notif"
                onClick={onRequestNotification}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  notificationGranted
                    ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40'
                    : 'bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold'
                }`}
                title="Aktifkan notifikasi browser untuk waktu sholat"
              >
                <Bell className="w-4 h-4" />
                <span>{notificationGranted ? 'Notifikasi Aktif' : 'Izinkan Notifikasi'}</span>
              </button>

              <button
                id="btn-hero-export-pdf"
                onClick={() => setIsExportPdfOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                title="Ekspor jadwal sholat sebulan penuh ke format PDF resmi Oase-Muslim"
              >
                <FileDown className="w-4 h-4 text-emerald-950" />
                <span>Ekspor PDF Jadwal</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 1-Tap Arah Kiblat Card & Integrated Compass */}
      <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 shadow-xs p-4 sm:p-5 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Arah Kiblat Ka'bah (Makkah)
                </h3>
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  {qiblaInfo.bearing.toFixed(1)}° {qiblaInfo.directionCardinal.split(' ')[0]}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Dari {location.name} • Jarak ke Ka'bah: ~{qiblaInfo.distanceKm.toLocaleString('id-ID')} km
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowEmbeddedQibla(!showEmbeddedQibla)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-98"
            title="Buka kompas kiblat interaktif dengan sensor giroskop & bayangan matahari"
          >
            <Compass className="w-4 h-4 text-amber-300" />
            <span>{showEmbeddedQibla ? 'Tutup Kompas' : 'Buka Arah Kiblat (1-Tap)'}</span>
            {showEmbeddedQibla ? (
              <ChevronUp className="w-3.5 h-3.5 opacity-80" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            )}
          </button>
        </div>

        {/* Embedded Interactive Compass if opened */}
        {showEmbeddedQibla && (
          <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-750 animate-in fade-in duration-200 space-y-4">
            {/* Top Close Notice Bar */}
            <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/70 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200">
                <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Penunjuk Arah Kiblat Sedang Dibuka</span>
              </div>
              <button
                onClick={() => setShowEmbeddedQibla(false)}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <X className="w-3.5 h-3.5" />
                <span>Tutup Arah Kiblat</span>
              </button>
            </div>

            <QiblaCompassView
              location={location}
              onOpenLocationModal={onOpenLocationModal}
              onUpdateLocation={onUpdateLocation}
              onClose={() => setShowEmbeddedQibla(false)}
            />

            {/* Bottom Close Bar */}
            <div className="pt-2 flex justify-center border-t border-slate-100 dark:border-slate-750">
              <button
                onClick={() => {
                  setShowEmbeddedQibla(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4 text-rose-400" />
                <span>Tutup Penunjuk Arah Kiblat (Kembali ke Waktu Sholat)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tarjih Subuh -18° Special Notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm">
        <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-emerald-800 dark:text-emerald-300">
            Penetapan Awal Waktu Subuh -18 Derajat (Hisab Astronomis Ilmiah)
          </p>
          <p className="text-emerald-700/90 dark:text-emerald-300/80 leading-relaxed">
            Kajian astronomis ilmiah menetapkan bahwa awal waktu Subuh dimulai saat ketinggian matahari berada pada -18° di bawah ufuk. Ketetapan ini mengoreksi parameter lama (-20°), sehingga waktu Subuh mundur sekitar 8 menit lebih lambat agar benar-benar sesuai dengan kemunculan Fajar Shadiq.
          </p>
        </div>
      </div>

      {/* Prayer Schedule Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {prayerItems.map((item) => {
          const isNext = nextPrayer?.key === item.key;
          const timeValue = prayerTimes[item.key];

          return (
            <div
              key={item.key}
              id={`prayer-card-${item.key}`}
              className={`relative flex flex-col justify-between p-4 rounded-xl border transition-all ${
                isNext
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 dark:border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/80 hover:border-emerald-300'
              }`}
            >
              {isNext && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                  Berikutnya
                </span>
              )}

              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-medium">{item.label}</span>
                  <span className="font-arabic text-sm text-slate-400 dark:text-slate-500">{item.arabic}</span>
                </div>

                <div className="my-2">
                  <span
                    className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                      isNext
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    {timeValue}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1" title={item.desc}>
                  {item.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Control Toolbar: View Monthly / Switch Location / Settings */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Lokasi: <strong className="text-slate-900 dark:text-white">{location.name}</strong>
          </span>
          <button
            onClick={onOpenLocationModal}
            className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline ml-1 cursor-pointer"
          >
            Ubah Lokasi
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-toolbar-export-pdf"
            onClick={() => setIsExportPdfOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            title="Buka panel ekspor PDF jadwal sholat"
          >
            <FileDown className="w-4 h-4 text-amber-300" />
            <span>Ekspor PDF</span>
          </button>

          <button
            id="btn-toggle-monthly"
            onClick={() => setShowMonthlyView(!showMonthlyView)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>{showMonthlyView ? 'Sembunyikan Jadwal Bulanan' : 'Jadwal 1 Bulan Penuh'}</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-300 transition-colors cursor-pointer"
          >
            <Clock className="w-4 h-4" />
            <span>Koreksi Ihtiyat ({settings.ihtiyatMinutes} mnt)</span>
          </button>
        </div>
      </div>

      {/* Monthly Prayer Table View */}
      {showMonthlyView && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span>Jadwal Waktu Sholat Bulanan - {location.name}</span>
            </h3>

            <div className="flex items-center gap-2 text-xs flex-wrap justify-end">
              <button
                onClick={() => setSelectedMonthOffset((prev) => prev - 1)}
                className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 cursor-pointer font-medium"
              >
                Bulan Lalu
              </button>
              <button
                onClick={() => setSelectedMonthOffset(0)}
                className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 cursor-pointer font-semibold"
              >
                Bulan Ini
              </button>
              <button
                onClick={() => setSelectedMonthOffset((prev) => prev + 1)}
                className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 cursor-pointer font-medium"
              >
                Bulan Depan
              </button>
              <button
                id="btn-monthly-download-pdf"
                onClick={() => setIsExportPdfOpen(true)}
                className="flex items-center gap-1 px-3 py-1 rounded-md bg-emerald-700 hover:bg-emerald-600 text-white font-semibold cursor-pointer shadow-xs transition-colors ml-1"
                title="Ekspor jadwal sholat format PDF Oase-Muslim"
              >
                <FileDown className="w-3.5 h-3.5 text-amber-300" />
                <span>Unduh PDF</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <th className="py-2.5 px-3">Tgl</th>
                  <th className="py-2.5 px-3">Hari</th>
                  <th className="py-2.5 px-3">Imsak</th>
                  <th className="py-2.5 px-3 text-emerald-700 dark:text-emerald-400 font-bold">Subuh (-18°)</th>
                  <th className="py-2.5 px-3">Terbit</th>
                  <th className="py-2.5 px-3">Dhuha</th>
                  <th className="py-2.5 px-3">Dzuhur</th>
                  <th className="py-2.5 px-3">Ashar</th>
                  <th className="py-2.5 px-3">Maghrib</th>
                  <th className="py-2.5 px-3">Isya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {getMonthlyDays().map((day) => {
                  const isToday =
                    day.date.getDate() === new Date().getDate() &&
                    day.date.getMonth() === new Date().getMonth() &&
                    day.date.getFullYear() === new Date().getFullYear();

                  return (
                    <tr
                      key={day.dayNum}
                      className={
                        isToday
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 font-semibold text-emerald-900 dark:text-emerald-200'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300'
                      }
                    >
                      <td className="py-2 px-3">{day.dayNum}</td>
                      <td className="py-2 px-3">{day.dayName}</td>
                      <td className="py-2 px-3">{day.times.imsak}</td>
                      <td className="py-2 px-3 font-semibold text-emerald-700 dark:text-emerald-400">
                        {day.times.subuh}
                      </td>
                      <td className="py-2 px-3">{day.times.terbit}</td>
                      <td className="py-2 px-3">{day.times.dhuha}</td>
                      <td className="py-2 px-3">{day.times.dzuhur}</td>
                      <td className="py-2 px-3">{day.times.ashar}</td>
                      <td className="py-2 px-3">{day.times.maghrib}</td>
                      <td className="py-2 px-3">{day.times.isya}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Export PDF Modal */}
      <ExportPdfModal
        isOpen={isExportPdfOpen}
        onClose={() => setIsExportPdfOpen(false)}
        location={location}
        settings={settings}
        onOpenLocationModal={onOpenLocationModal}
      />
    </div>
  );
};
