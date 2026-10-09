import React, { useState } from 'react';
import { MapPin, Search, Navigation, Check, X, Compass } from 'lucide-react';
import { LocationConfig } from '../types';
import { INDONESIAN_CITIES } from '../utils/prayerTimesTarjih';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationConfig;
  onSelectLocation: (loc: LocationConfig) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredCities = INDONESIAN_CITIES.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Browser tidak mendukung pendeteksi lokasi GPS.');
      return;
    }

    setIsDetectingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsDetectingGps(false);
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Approximate Indonesian timezone based on longitude
        let tz = 7; // WIB
        if (lon > 115 && lon <= 125) tz = 8; // WITA
        else if (lon > 125) tz = 9; // WIT

        const newLoc: LocationConfig = {
          name: `Lokasi GPS Anda (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
          latitude: lat,
          longitude: lon,
          timezone: tz,
          isGps: true,
        };

        onSelectLocation(newLoc);
        onClose();
      },
      (error) => {
        setIsDetectingGps(false);
        setGpsError(
          error.code === 1
            ? 'Izin akses lokasi ditolak. Silakan izinkan akses lokasi di browser atau pilih kota secara manual.'
            : 'Gagal mendeteksi lokasi GPS. Silakan pilih kota di bawah.'
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Pilih Lokasi Jadwal & Kiblat
              </h3>
              <p className="text-xs text-slate-500">
                Waktu sholat dan kiblat disesuaikan secara presisi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Auto Button */}
        <div>
          <button
            onClick={handleUseGps}
            disabled={isDetectingGps}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Navigation className={`w-4 h-4 ${isDetectingGps ? 'animate-spin' : ''}`} />
            <span>
              {isDetectingGps ? 'Mendeteksi Koordinat GPS...' : 'Gunakan Lokasi GPS Saat Ini (Presisi)'}
            </span>
          </button>

          {gpsError && (
            <p className="text-xs text-rose-500 mt-2 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900">
              {gpsError}
            </p>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama kota di Indonesia..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* City List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin max-h-[300px]">
          {filteredCities.map((city) => {
            const isSelected = currentLocation.name === city.name;

            return (
              <button
                key={city.name}
                onClick={() => {
                  onSelectLocation(city);
                  onClose();
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 font-bold text-emerald-900 dark:text-emerald-200'
                    : 'border-slate-100 dark:border-slate-700/60 hover:border-emerald-300 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div>
                  <span className="text-xs sm:text-sm block">{city.name}</span>
                  <span className="text-[10px] text-slate-400 block">
                    {city.latitude.toFixed(2)}° LU/LS, {city.longitude.toFixed(2)}° BT (UTC+{city.timezone})
                  </span>
                </div>

                {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
