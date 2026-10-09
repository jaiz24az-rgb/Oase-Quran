import React, { useState } from 'react';
import { Settings, X, Volume2, ShieldCheck, Bell, Info, SlidersHorizontal } from 'lucide-react';
import { TarjihSettings } from '../types';
import { audioReminder } from '../utils/audioAlerts';
import { recitationPlayer } from '../utils/recitationAudio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TarjihSettings;
  onUpdateSettings: (newSettings: TarjihSettings) => void;
  onRequestNotification: () => void;
  notificationGranted: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onRequestNotification,
  notificationGranted,
}) => {
  const [localSettings, setLocalSettings] = useState<TarjihSettings>(settings);
  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const [syncOffset, setSyncOffset] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tarjih_audio_sync_offset_ms');
      return saved !== null ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const handleUpdateSyncOffset = (offset: number) => {
    const clamped = Math.max(-1000, Math.min(1000, Math.round(offset)));
    setSyncOffset(clamped);
    recitationPlayer.setSyncOffsetMs(clamped);
  };

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateSettings(localSettings);
    onClose();
  };

  const handleTestAudio = () => {
    if (isPlayingTest) {
      audioReminder.stopAudio();
      setIsPlayingTest(false);
    } else {
      setIsPlayingTest(true);
      if (localSettings.soundType === 'adzan') {
        audioReminder.playFullAdzan();
      } else if (localSettings.soundType === 'takbir') {
        audioReminder.playSynthesizedAdzanTakbir();
      } else if (localSettings.soundType === 'chime') {
        audioReminder.playGentleChime();
      }
      setTimeout(() => setIsPlayingTest(false), 8000);
    }
  };

  const toggleAlarm = (key: keyof TarjihSettings['alarmEnabled']) => {
    setLocalSettings({
      ...localSettings,
      alarmEnabled: {
        ...localSettings.alarmEnabled,
        [key]: !localSettings.alarmEnabled[key],
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Pengaturan Hisab & Notifikasi Sholat
              </h3>
              <p className="text-xs text-slate-500">Kustomisasi parameter hisab waktu sholat & alarm</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subuh Hisab Info Box */}
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Ketetapan Hisab Astronomis Ilmiah</span>
          </div>
          <p className="text-emerald-900/80 dark:text-emerald-300/80 leading-relaxed">
            Parameter awal Subuh terkunci pada sudut matahari <strong>-18.0°</strong> dan Isya pada <strong>-18.0°</strong> sesuai hisab ilmiah astronomis kontemporer.
          </p>
        </div>

        {/* Ihtiyat (Pengaman Waktu) */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Koreksi Ihtiyat (Pengaman Waktu):
            </span>
            <span className="font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
              +{localSettings.ihtiyatMinutes} Menit
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Ihtiyat adalah penambahan waktu 1-3 menit untuk kehati-hatian agar masuknya waktu sholat benar-benar telah sempurna.
          </p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                onClick={() => setLocalSettings({ ...localSettings, ihtiyatMinutes: val })}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  localSettings.ihtiyatMinutes === val
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                +{val} mnt
              </button>
            ))}
          </div>
        </div>

        {/* Notification Sound Picker */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
              Pilihan Suara Pengingat:
            </label>
            <button
              onClick={handleTestAudio}
              className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isPlayingTest ? 'Hentikan Tes' : 'Uji Coba Suara'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'adzan', label: 'Adzan Penuh' },
              { id: 'takbir', label: 'Synthesized Takbir (Offline)' },
              { id: 'chime', label: 'Nada Syahdu (Chime)' },
              { id: 'silent', label: 'Senyap (Hanya Teks)' },
            ].map((snd) => (
              <button
                key={snd.id}
                onClick={() => setLocalSettings({ ...localSettings, soundType: snd.id as TarjihSettings['soundType'] })}
                className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                  localSettings.soundType === snd.id
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 font-bold text-emerald-800 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {snd.label}
              </button>
            ))}
          </div>
        </div>

        {/* Kalibrasi Sinkronisasi Sorotan Teks & Audio */}
        <div className="space-y-2 p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-semibold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
              <span>Kalibrasi Sinkronisasi Highlight & Audio:</span>
            </span>
            <span className="font-mono font-bold text-amber-800 dark:text-amber-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-700 text-xs">
              {syncOffset !== 0 ? `${syncOffset > 0 ? '+' : ''}${syncOffset}ms` : '0ms (Normal)'}
            </span>
          </div>
          <p className="text-[11px] text-amber-900/80 dark:text-amber-300/80 leading-relaxed">
            Menyelaraskan sorotan kata real-time pada Al-Qur'an, Doa Sholat, dan Dzikir dengan jeda latensi perangkat atau earphone Bluetooth.
          </p>
          <div className="flex gap-1.5 flex-wrap pt-1">
            {[-150, -75, 0, 75, 150].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleUpdateSyncOffset(preset)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  syncOffset === preset
                    ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {preset === 0 ? '0ms (Standar)' : preset < 0 ? `${preset}ms (Cepat)` : `+${preset}ms (Lambat)`}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] text-slate-500 font-mono shrink-0">-300ms</span>
            <input
              type="range"
              min="-300"
              max="300"
              step="25"
              value={syncOffset}
              onChange={(e) => handleUpdateSyncOffset(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-amber-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <span className="text-[10px] text-slate-500 font-mono shrink-0">+300ms</span>
          </div>
        </div>

        {/* Browser Notifications Permission */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Izin Notifikasi Layar Browser
              </p>
              <p className="text-[11px] text-slate-500">
                {notificationGranted ? 'Notifikasi telah aktif di browser' : 'Belum diizinkan'}
              </p>
            </div>
          </div>

          {!notificationGranted && (
            <button
              onClick={onRequestNotification}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
            >
              Izinkan
            </button>
          )}
        </div>

        {/* Individual Alarms */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">
            Aktifkan Pengingat Untuk Waktu:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ['subuh', 'Subuh'],
                ['dzuhur', 'Dzuhur'],
                ['ashar', 'Ashar'],
                ['maghrib', 'Maghrib'],
                ['isya', 'Isya'],
                ['imsak', 'Imsak'],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-750 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={localSettings.alarmEnabled[key]}
                  onChange={() => toggleAlarm(key)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span>Sholat {label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
        >
          Simpan Pengaturan
        </button>
      </div>
    </div>
  );
};
