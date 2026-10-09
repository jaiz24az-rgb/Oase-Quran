import React, { useState, useMemo } from 'react';
import {
  FileDown,
  Printer,
  X,
  Calendar,
  Settings,
  Sparkles,
  MapPin,
  CheckCircle2,
  FileText,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LocationConfig, TarjihSettings } from '../types';
import {
  generateTarjihSchedulePdf,
  downloadTarjihSchedulePdf,
} from '../utils/pdfScheduleGenerator';
import { calculateTarjihPrayerTimes, calculateQibla } from '../utils/prayerTimesTarjih';
import { getKhgtHijriDate } from '../utils/khgtCalendar';
import { OaseEmblem } from './OaseLogo';

interface ExportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: LocationConfig;
  settings: TarjihSettings;
  onOpenLocationModal?: () => void;
}

const MONTH_NAMES_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export const ExportPdfModal: React.FC<ExportPdfModalProps> = ({
  isOpen,
  onClose,
  location,
  settings,
  onOpenLocationModal,
}) => {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth());
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [includeSunnahTimes, setIncludeSunnahTimes] = useState<boolean>(true);
  const [includeKhgtHijri, setIncludeKhgtHijri] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Compute days for live preview
  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth + 1, 0).getDate();
  }, [selectedYear, selectedMonth]);

  const previewDays = useMemo(() => {
    const list = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const curDate = new Date(selectedYear, selectedMonth, d);
      const times = calculateTarjihPrayerTimes(curDate, location, settings);
      const hijri = getKhgtHijriDate(curDate);
      const dayName = curDate.toLocaleDateString('id-ID', { weekday: 'short' });
      list.push({
        dayNum: d,
        dayName,
        hijriFormatted: `${hijri.day} ${hijri.monthName.substring(0, 7)}`,
        times,
      });
    }
    return list;
  }, [selectedYear, selectedMonth, daysInMonth, location, settings]);

  const qibla = useMemo(() => {
    return calculateQibla(location.latitude, location.longitude);
  }, [location]);

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    setIsGenerating(true);
    setSuccessMessage(null);

    setTimeout(() => {
      try {
        const filename = downloadTarjihSchedulePdf({
          location,
          settings,
          year: selectedYear,
          month: selectedMonth,
          orientation,
          includeSunnahTimes,
          includeKhgtHijri,
        });

        setIsGenerating(false);
        setSuccessMessage(`Berhasil mengunduh: ${filename}`);

        // Celebrate export with confetti!
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#047857', '#10B981', '#F59E0B', '#3B82F6'],
          });
        } catch {
          // ignore
        }

        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      } catch (err) {
        console.error('Failed to generate PDF:', err);
        setIsGenerating(false);
        setSuccessMessage('Gagal membuat PDF. Silakan coba kembali.');
      }
    }, 150);
  };

  const handlePrintDirect = () => {
    setIsGenerating(true);
    setTimeout(() => {
      try {
        const doc = generateTarjihSchedulePdf({
          location,
          settings,
          year: selectedYear,
          month: selectedMonth,
          orientation,
          includeSunnahTimes,
          includeKhgtHijri,
        });

        // Open in blob for native browser print
        const blobUrl = doc.output('bloburl');
        const printWindow = window.open(blobUrl);
        if (printWindow) {
          printWindow.focus();
        }
        setIsGenerating(false);
      } catch (err) {
        console.error('Failed to print PDF:', err);
        setIsGenerating(false);
      }
    }, 150);
  };

  const handleQuickMonth = (monthOffset: number) => {
    const targetDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    setSelectedYear(targetDate.getFullYear());
    setSelectedMonth(targetDate.getMonth());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-600/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <FileDown className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-200 tracking-wide uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Format Resmi Oase-Muslim</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Ekspor PDF Jadwal Sholat & Imsakiyah</span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Controls & Live Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Options & Settings Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Month & Year Selector */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pilih Bulan & Tahun</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {MONTH_NAMES_ID.map((name, idx) => (
                    <option key={idx} value={idx}>
                      {name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min={2020}
                  max={2040}
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 pt-1">
                <button
                  onClick={() => handleQuickMonth(0)}
                  className={`flex-1 py-1 px-2 text-[11px] rounded-md font-medium transition-colors cursor-pointer ${
                    selectedMonth === now.getMonth() && selectedYear === now.getFullYear()
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                  }`}
                >
                  Bulan Ini
                </button>
                <button
                  onClick={() => handleQuickMonth(1)}
                  className="flex-1 py-1 px-2 text-[11px] rounded-md font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition-colors cursor-pointer"
                >
                  Bulan Depan
                </button>
              </div>
            </div>

            {/* 2. Format & Layout Settings */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                <span>Orientasi & Kolom Dokumen</span>
              </label>

              {/* Orientation Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrientation('portrait')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    orientation === 'portrait'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Potret (A4 Tegak)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrientation('landscape')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    orientation === 'landscape'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 rotate-90" />
                  <span>Lanskap (Mendatar)</span>
                </button>
              </div>

              {/* Column toggles */}
              <div className="space-y-1.5 pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={includeSunnahTimes}
                    onChange={(e) => setIncludeSunnahTimes(e.target.checked)}
                    className="rounded-sm text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                  />
                  <span>Sertakan Waktu Terbit & Dhuha</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={includeKhgtHijri}
                    onChange={(e) => setIncludeKhgtHijri(e.target.checked)}
                    className="rounded-sm text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                  />
                  <span>Sertakan Tanggal Hijriah (KHGT)</span>
                </label>
              </div>
            </div>

            {/* 3. Location & Parameter Confirmation */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Lokasi Geografis</span>
                </label>
                {onOpenLocationModal && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenLocationModal();
                    }}
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    Ubah
                  </button>
                )}
              </div>

              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{location.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {Math.abs(location.latitude).toFixed(4)}° {location.latitude >= 0 ? 'LU' : 'LS'},{' '}
                  {Math.abs(location.longitude).toFixed(4)}° {location.longitude >= 0 ? 'BT' : 'BB'}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                  <Compass className="w-3 h-3" />
                  <span>
                    Kiblat: {qibla.bearing}° U-B (~{qibla.distanceKm} km)
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Standar Subuh: <strong>-18° Astronomis Ilmiah</strong> • Ihtiyat:{' '}
                <strong>+{settings.ihtiyatMinutes} mnt</strong>
              </div>
            </div>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Live Document Preview Card */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Pratinjau Lembar Dokumen Jadwal (Total {daysInMonth} Hari)</span>
              </h4>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Format A4 Standar Cetak & Arsip
              </span>
            </div>

            {/* Document Preview Box (A4 styling) */}
            <div className="p-4 sm:p-5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-md space-y-4">
              {/* Document Header with Emblem & Branding */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 pb-3 border-b-2 border-emerald-800">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-white dark:bg-slate-800 p-1 shadow-xs ring-1 ring-emerald-500/20 flex items-center justify-center">
                  <OaseEmblem size={34} />
                </div>

                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                      Oase-Muslim
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      • Aplikasi Muslim Terpadu
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 uppercase">
                    Jadwal Waktu Sholat & Imsakiyah Bulan {MONTH_NAMES_ID[selectedMonth]} {selectedYear}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-400">
                    Berdasarkan Hisab Astronomis Akurat (Subuh -18°) & Kalender Hijriah Global Tunggal (KHGT)
                  </p>
                </div>
              </div>

              {/* Document Meta Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Wilayah:</span>{' '}
                  <strong className="text-slate-800 dark:text-slate-200">{location.name}</strong>
                  <div className="text-slate-500 dark:text-slate-400 text-[10px]">
                    Koordinat: {Math.abs(location.latitude).toFixed(4)}° {location.latitude >= 0 ? 'LU' : 'LS'},{' '}
                    {Math.abs(location.longitude).toFixed(4)}° {location.longitude >= 0 ? 'BT' : 'BB'} (UTC+
                    {location.timezone})
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Arah Kiblat:</span>{' '}
                  <strong className="text-emerald-700 dark:text-emerald-400">
                    {qibla.bearing}° U-B (~{qibla.distanceKm.toLocaleString('id-ID')} km)
                  </strong>
                  <div className="text-slate-500 dark:text-slate-400 text-[10px]">
                    Koreksi Ihtiyat: +{settings.ihtiyatMinutes} menit • Standar Subuh: -18°
                  </div>
                </div>
              </div>

              {/* Mini Preview Table (Scrollable on mobile) */}
              <div className="overflow-x-auto max-h-56 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                <table className="w-full text-center text-[11px] border-collapse">
                  <thead className="sticky top-0 bg-emerald-800 text-white font-bold text-[10px]">
                    <tr>
                      <th className="py-1.5 px-2">Tgl</th>
                      <th className="py-1.5 px-2">Hari</th>
                      {includeKhgtHijri && <th className="py-1.5 px-2">KHGT</th>}
                      <th className="py-1.5 px-2">Imsak</th>
                      <th className="py-1.5 px-2 bg-emerald-900 text-amber-200">Subuh (-18°)</th>
                      {includeSunnahTimes && (
                        <>
                          <th className="py-1.5 px-2">Terbit</th>
                          <th className="py-1.5 px-2">Dhuha</th>
                        </>
                      )}
                      <th className="py-1.5 px-2">Dzuhur</th>
                      <th className="py-1.5 px-2">Ashar</th>
                      <th className="py-1.5 px-2 bg-emerald-900 text-amber-200">Maghrib</th>
                      <th className="py-1.5 px-2">Isya</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {previewDays.map((item) => {
                      const isFriday = item.dayName.toLowerCase().includes('jum');
                      const isSunday = item.dayName.toLowerCase().includes('ahd') || item.dayName.toLowerCase().includes('min');

                      return (
                        <tr
                          key={item.dayNum}
                          className={
                            isFriday
                              ? 'bg-emerald-50/70 dark:bg-emerald-950/30'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                          }
                        >
                          <td className="py-1 px-2 font-bold">{item.dayNum}</td>
                          <td
                            className={`py-1 px-2 font-semibold ${
                              isFriday
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : isSunday
                                ? 'text-rose-600 dark:text-rose-400'
                                : ''
                            }`}
                          >
                            {item.dayName}
                          </td>
                          {includeKhgtHijri && (
                            <td className="py-1 px-2 text-slate-500 dark:text-slate-400 text-[10px]">
                              {item.hijriFormatted}
                            </td>
                          )}
                          <td className="py-1 px-2">{item.times.imsak}</td>
                          <td className="py-1 px-2 font-bold text-emerald-700 dark:text-emerald-400">
                            {item.times.subuh}
                          </td>
                          {includeSunnahTimes && (
                            <>
                              <td className="py-1 px-2 text-slate-500">{item.times.terbit}</td>
                              <td className="py-1 px-2 text-slate-500">{item.times.dhuha}</td>
                            </>
                          )}
                          <td className="py-1 px-2">{item.times.dzuhur}</td>
                          <td className="py-1 px-2">{item.times.ashar}</td>
                          <td className="py-1 px-2 font-bold text-amber-700 dark:text-amber-400">
                            {item.times.maghrib}
                          </td>
                          <td className="py-1 px-2">{item.times.isya}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Fiqih Footnotes */}
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-600 dark:text-slate-400 space-y-1">
                <p className="font-bold text-emerald-800 dark:text-emerald-400">Catatan Fiqih Hisab:</p>
                <p>• Awal Waktu Subuh dihitung pada posisi matahari -18° (Standar hisab fajar shadiq kontemporer).</p>
                <p>• Imsak adalah waktu peringatan (tanbih) 10 menit sebelum Subuh. Waktu Maghrib menandakan terbenamnya piringan matahari.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer: Action Buttons */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-4 px-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            File PDF siap cetak / simpan di HP dan komputer.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrintDirect}
              disabled={isGenerating}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Langsung</span>
            </button>

            <button
              id="btn-download-pdf"
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <FileDown className="w-4 h-4" />
              <span>{isGenerating ? 'Membuat PDF...' : 'Unduh File PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
