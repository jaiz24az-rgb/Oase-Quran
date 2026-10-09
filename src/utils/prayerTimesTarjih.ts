import { LocationConfig, PrayerTimeData, QiblaInfo, TarjihSettings } from '../types';

export const KAABA_COORDINATES = {
  latitude: 21.422487,
  longitude: 39.826206,
};

export const INDONESIAN_CITIES: LocationConfig[] = [
  { name: 'Yogyakarta (DIY)', latitude: -7.7956, longitude: 110.3695, timezone: 7 },
  { name: 'Jakarta (DKI)', latitude: -6.2088, longitude: 106.8456, timezone: 7 },
  { name: 'Surabaya', latitude: -7.2575, longitude: 112.7521, timezone: 7 },
  { name: 'Surakarta (Solo)', latitude: -7.5666, longitude: 110.8242, timezone: 7 },
  { name: 'Bandung', latitude: -6.9175, longitude: 107.6191, timezone: 7 },
  { name: 'Semarang', latitude: -6.9667, longitude: 110.4167, timezone: 7 },
  { name: 'Medan', latitude: 3.5952, longitude: 98.6722, timezone: 7 },
  { name: 'Padang', latitude: -0.9471, longitude: 100.4172, timezone: 7 },
  { name: 'Banda Aceh', latitude: 5.5483, longitude: 95.3238, timezone: 7 },
  { name: 'Palembang', latitude: -2.9761, longitude: 104.7754, timezone: 7 },
  { name: 'Makassar', latitude: -5.1477, longitude: 119.4327, timezone: 8 },
  { name: 'Banjarmasin', latitude: -3.3194, longitude: 114.5908, timezone: 8 },
  { name: 'Balikpapan / IKN', latitude: -1.2379, longitude: 116.8289, timezone: 8 },
  { name: 'Pontianak', latitude: -0.0263, longitude: 109.3425, timezone: 7 },
  { name: 'Denpasar', latitude: -8.6705, longitude: 115.2126, timezone: 8 },
  { name: 'Mataram (Lombok)', latitude: -8.5833, longitude: 116.1167, timezone: 8 },
  { name: 'Kupang', latitude: -10.1772, longitude: 123.607, timezone: 8 },
  { name: 'Manado', latitude: 1.4748, longitude: 124.8421, timezone: 8 },
  { name: 'Ambon', latitude: -3.6547, longitude: 128.1906, timezone: 9 },
  { name: 'Jayapura', latitude: -2.5916, longitude: 140.669, timezone: 9 },
];

export const DEFAULT_TARJIH_SETTINGS: TarjihSettings = {
  subuhAngle: 18.0, // Sudut depresi matahari -18° (Awal Subuh Kontemporer)
  isyaAngle: 18.0,  // Sudut depresi matahari -18°
  asrShadowFactor: 1.0, // Panjang bayangan = tinggi benda + bayangan saat zawal
  ihtiyatMinutes: 2, // Pengaman waktu 2 menit
  alarmEnabled: {
    imsak: true,
    subuh: true,
    terbit: false,
    dhuha: false,
    dzuhur: true,
    ashar: true,
    maghrib: true,
    isya: true,
  },
  soundType: 'adzan',
};

export const DEFAULT_SETTINGS = DEFAULT_TARJIH_SETTINGS;
export const DEFAULT_LOCATION = INDONESIAN_CITIES[0];

// Math helpers for spherical astronomy
const toRad = (deg: number) => (deg * Math.PI) / 180.0;
const toDeg = (rad: number) => (rad * 180.0) / Math.PI;

function fixHour(hour: number): number {
  let h = hour - 24.0 * Math.floor(hour / 24.0);
  return h < 0 ? h + 24.0 : h;
}

// Calculate Sun Position (Declination and Equation of Time)
function getSunPosition(julianDate: number) {
  const D = julianDate - 2451545.0;
  const g = fixHour(357.529 + 0.98560028 * D);
  const q = fixHour(280.459 + 0.98564736 * D);
  const L = fixHour(q + 1.915 * Math.sin(toRad(g)) + 0.02 * Math.sin(toRad(2 * g)));

  const e = 23.439 - 0.00000036 * D;
  const d = toDeg(Math.asin(Math.sin(toRad(e)) * Math.sin(toRad(L)))); // Declination
  let RA = toDeg(Math.atan2(Math.cos(toRad(e)) * Math.sin(toRad(L)), Math.cos(toRad(L)))) / 15.0;
  RA = fixHour(RA);
  const EqT = q / 15.0 - RA; // Equation of time in hours

  return { declination: d, equationOfTime: EqT };
}

function getJulianDate(date: Date): number {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  const day = date.getDate();

  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    B -
    1524.5
  );
}

// Format fractional hours to "HH:mm"
export function formatHourMinute(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  const sH = h.toString().padStart(2, '0');
  const sM = m.toString().padStart(2, '0');
  return `${sH}:${sM}`;
}

export function parseHourMinuteToDate(timeStr: string, baseDate: Date = new Date()): Date {
  const [h, m] = timeStr.split(':').map(Number);
  const d = new Date(baseDate);
  d.setHours(h, m, 0, 0);
  return d;
}

/**
 * Calculates prayer times strictly following astronomical specifications:
 * - Subuh: Sun depression angle = 18.0°
 * - Isya: Sun depression angle = 18.0°
 * - Ashar: Shafi'i shadow factor = 1
 * - Maghrib: Sun center -0.833° below horizon + Ihtiyat
 * - Dzuhur: Solar transit (zawal) + Ihtiyat
 * - Terbit: -0.833°
 * - Dhuha: Sun elevation = 4.5°
 * - Imsak: Subuh - 10 minutes
 */
export function calculateTarjihPrayerTimes(
  date: Date,
  location: LocationConfig,
  settings: TarjihSettings = DEFAULT_TARJIH_SETTINGS
): PrayerTimeData {
  const JD = getJulianDate(date);
  const { declination, equationOfTime } = getSunPosition(JD);

  const lat = location.latitude;
  const lng = location.longitude;
  const tz = location.timezone;

  // Midday / Solar Noon in local standard time
  const noon = fixHour(12 + tz - lng / 15.0 - equationOfTime);

  // Time for specific sun angle
  const timeAngle = (angle: number, isMorning: boolean): number => {
    const cosHA =
      (-Math.sin(toRad(angle)) - Math.sin(toRad(lat)) * Math.sin(toRad(declination))) /
      (Math.cos(toRad(lat)) * Math.cos(toRad(declination)));

    if (cosHA < -1.0 || cosHA > 1.0) {
      return noon; // Extreme latitude fallback
    }

    const hourAngle = toDeg(Math.acos(cosHA)) / 15.0;
    return isMorning ? noon - hourAngle : noon + hourAngle;
  };

  // Ashr calculation with shadow factor = 1
  const asrAngle = (): number => {
    const t = Math.abs(lat - declination);
    const cotAngle = settings.asrShadowFactor + Math.tan(toRad(t));
    const altAngle = toDeg(Math.atan(1 / cotAngle));

    const cosHA =
      (Math.sin(toRad(altAngle)) - Math.sin(toRad(lat)) * Math.sin(toRad(declination))) /
      (Math.cos(toRad(lat)) * Math.cos(toRad(declination)));

    if (cosHA < -1.0 || cosHA > 1.0) return noon + 3;
    const hourAngle = toDeg(Math.acos(cosHA)) / 15.0;
    return noon + hourAngle;
  };

  const ihtiyatHours = (settings.ihtiyatMinutes || 2) / 60.0;

  // Subuh according to Munas Tarjih 31: -18°
  const subuhRaw = timeAngle(settings.subuhAngle, true) + ihtiyatHours;
  // Sunrise (Terbit): -0.833°
  const terbitRaw = timeAngle(0.833, true);
  // Dhuha: sun height 4.5°
  const dhuhaRaw = timeAngle(-4.5, true) + ihtiyatHours;
  // Dzuhur: solar transit + ihtiyat
  const dzuhurRaw = noon + ihtiyatHours;
  // Ashar:
  const asharRaw = asrAngle() + ihtiyatHours;
  // Maghrib: sunset -0.833° + ihtiyat
  const maghribRaw = timeAngle(0.833, false) + ihtiyatHours;
  // Isya: -18° + ihtiyat
  const isyaRaw = timeAngle(settings.isyaAngle, false) + ihtiyatHours;

  // Imsak: 10 minutes before Subuh
  const imsakRaw = subuhRaw - 10 / 60.0;

  return {
    imsak: formatHourMinute(imsakRaw),
    subuh: formatHourMinute(subuhRaw),
    terbit: formatHourMinute(terbitRaw),
    dhuha: formatHourMinute(dhuhaRaw),
    dzuhur: formatHourMinute(dzuhurRaw),
    ashar: formatHourMinute(asharRaw),
    maghrib: formatHourMinute(maghribRaw),
    isya: formatHourMinute(isyaRaw),
  };
}

/**
 * Calculates precision Qibla Azimuth & distance to Ka'bah using Spherical Great-Circle formulas.
 */
export function calculateQibla(latitude: number, longitude: number): QiblaInfo {
  const phi1 = toRad(latitude);
  const lambda1 = toRad(longitude);
  const phi2 = toRad(KAABA_COORDINATES.latitude);
  const lambda2 = toRad(KAABA_COORDINATES.longitude);

  const deltaLambda = lambda2 - lambda1;

  // Azimuth formula
  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);
  let qiblaBearing = toDeg(Math.atan2(y, x));
  qiblaBearing = (qiblaBearing + 360.0) % 360.0;

  // Great-circle distance using Haversine formula
  const R = 6371; // Earth radius in km
  const deltaPhi = phi2 - phi1;
  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.round(R * c);

  // Cardinal direction approximation
  let cardinal = 'Barat Laut';
  if (qiblaBearing >= 337.5 || qiblaBearing < 22.5) cardinal = 'Utara';
  else if (qiblaBearing >= 22.5 && qiblaBearing < 67.5) cardinal = 'Timur Laut';
  else if (qiblaBearing >= 67.5 && qiblaBearing < 112.5) cardinal = 'Timur';
  else if (qiblaBearing >= 112.5 && qiblaBearing < 157.5) cardinal = 'Tenggara';
  else if (qiblaBearing >= 157.5 && qiblaBearing < 202.5) cardinal = 'Selatan';
  else if (qiblaBearing >= 202.5 && qiblaBearing < 247.5) cardinal = 'Barat Daya';
  else if (qiblaBearing >= 247.5 && qiblaBearing < 292.5) cardinal = 'Barat';
  else cardinal = 'Barat Laut';

  return {
    bearing: Number(qiblaBearing.toFixed(1)),
    distanceKm,
    directionCardinal: `${cardinal} (${qiblaBearing.toFixed(1)}°)`,
  };
}

/**
 * Calculates Sun Altitude (Elevation) & Azimuth for physical shadow verification (Rashdul Qiblah)
 */
export function calculateSolarAzimuth(
  date: Date,
  lat: number,
  lng: number,
  tz: number
): { elevation: number; azimuth: number } {
  const JD = getJulianDate(date);
  const { declination, equationOfTime } = getSunPosition(JD);

  const hours = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
  // Solar time
  const solarTime = hours - tz + lng / 15.0 + equationOfTime;
  // Hour angle in degrees (-180 to 180)
  const H = (solarTime - 12.0) * 15.0;

  const latRad = toRad(lat);
  const decRad = toRad(declination);
  const hRad = toRad(H);

  // Elevation (altitude)
  const sinAlt = Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(hRad);
  const elevation = toDeg(Math.asin(Math.max(-1, Math.min(1, sinAlt))));

  // Azimuth from North (0° = North, 90° = East, 180° = South, 270° = West)
  const cosAlt = Math.cos(toRad(elevation));
  let azimuth = 0;
  if (Math.abs(cosAlt) > 0.0001) {
    const cosAz = (Math.sin(decRad) - Math.sin(latRad) * sinAlt) / (Math.cos(latRad) * cosAlt);
    let az = toDeg(Math.acos(Math.max(-1, Math.min(1, cosAz))));
    if (Math.sin(hRad) > 0) {
      azimuth = 360 - az;
    } else {
      azimuth = az;
    }
  }

  return {
    elevation: Number(elevation.toFixed(1)),
    azimuth: Number(azimuth.toFixed(1)),
  };
}

export interface NextPrayerInfo {
  name: string;
  key: keyof PrayerTimeData;
  time: string;
  diffMinutes: number;
  diffSeconds: number;
  formattedCountdown: string;
}

export function getNextPrayer(prayerTimes: PrayerTimeData, now: Date = new Date()): NextPrayerInfo {
  const prayerOrder: { key: keyof PrayerTimeData; label: string }[] = [
    { key: 'imsak', label: 'Imsak' },
    { key: 'subuh', label: 'Subuh' },
    { key: 'terbit', label: 'Terbit' },
    { key: 'dhuha', label: 'Dhuha' },
    { key: 'dzuhur', label: 'Dzuhur' },
    { key: 'ashar', label: 'Ashar' },
    { key: 'maghrib', label: 'Maghrib' },
    { key: 'isya', label: 'Isya' },
  ];

  const nowMs = now.getTime();

  for (const item of prayerOrder) {
    const prayerDate = parseHourMinuteToDate(prayerTimes[item.key], now);
    const diffMs = prayerDate.getTime() - nowMs;
    if (diffMs > 0) {
      const totalSec = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSec / 3600);
      const mins = Math.floor((totalSec % 3600) / 60);
      const secs = totalSec % 60;
      const formatted = `${hours > 0 ? `${hours} jam ` : ''}${mins} mnt ${secs} dtk`;
      return {
        name: item.label,
        key: item.key,
        time: prayerTimes[item.key],
        diffMinutes: Math.floor(totalSec / 60),
        diffSeconds: totalSec,
        formattedCountdown: formatted,
      };
    }
  }

  // If all prayers passed today, next is tomorrow's Imsak/Subuh
  const tomorrowSubuh = parseHourMinuteToDate(prayerTimes.subuh, now);
  tomorrowSubuh.setDate(tomorrowSubuh.getDate() + 1);
  const diffMs = tomorrowSubuh.getTime() - nowMs;
  const totalSec = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  return {
    name: 'Subuh (Besok)',
    key: 'subuh',
    time: prayerTimes.subuh,
    diffMinutes: Math.floor(totalSec / 60),
    diffSeconds: totalSec,
    formattedCountdown: `${hours > 0 ? `${hours} jam ` : ''}${mins} mnt ${secs} dtk`,
  };
}

export const getNextPrayerInfo = getNextPrayer;
