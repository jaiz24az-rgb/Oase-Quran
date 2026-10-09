export interface PrayerTimeData {
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export interface LocationConfig {
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  timezone: number; // e.g. 7 for WIB, 8 for WITA, 9 for WIT
  isGps?: boolean;
}

export interface TarjihSettings {
  subuhAngle: number; // default -18° according to Munas Tarjih 31
  isyaAngle: number;  // default -18°
  asrShadowFactor: number; // 1 for standard / Tarjih
  ihtiyatMinutes: number; // default 2 minutes safety margin
  alarmEnabled: {
    imsak: boolean;
    subuh: boolean;
    terbit: boolean;
    dhuha: boolean;
    dzuhur: boolean;
    ashar: boolean;
    maghrib: boolean;
    isya: boolean;
  };
  soundType: 'adzan' | 'takbir' | 'chime' | 'silent';
}

export interface QiblaInfo {
  bearing: number; // Azimuth in degrees from North (0° - 360°)
  distanceKm: number; // Distance to Ka'bah in kilometers
  directionCardinal: string; // e.g. "Barat Laut (295°)"
}

export type TarjihPrayerCategory =
  | 'bacaan_sholat'
  | 'sholat_fardhu'
  | 'sholat_sunnah'
  | 'sholat_jenazah'
  | 'sholat_gerhana'
  | 'sholat_hajat'
  | 'dzikir_sholat'
  | 'dzikir_pagi_petang'
  | 'doa_alquran'
  | 'doa_hadist'
  | 'doa_harian';

export interface TarjihPrayerItem {
  id: string;
  category: TarjihPrayerCategory;
  title: string;
  subtitle?: string;
  arabic: string;
  transliteration: string;
  translation: string;
  source: string; // Referensi Hadits Shahih / Kitab Fiqih Sunnah / Al-Qur'an
  stepOrder?: number;
  notes?: string;
  audioText?: string;
}

export interface MemorizeProgress {
  itemId: string;
  status: 'not_started' | 'learning' | 'mastered';
  lastPracticed: string;
  masteryLevel: number; // 0 - 100%
  timesPracticed: number;
}

export interface QuranSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string; // e.g. "Pembukaan"
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface QuranAyah {
  number: number;
  numberInSurah: number;
  text: string;
  translation: string;
  transliteration?: string;
  audioUrl?: string;
}

export interface KhgtEvent {
  id: string;
  title: string;
  hijriDate: string; // e.g. "1 Muharram 1447 H"
  gregorianDate: string; // e.g. "26 Juni 2025"
  description: string;
  type: 'hari_raya' | 'puasa_wajib' | 'puasa_sunnah' | 'peringatan';
  khgtNote?: string;
}

export interface SurahFlowSection {
  ayatRange: string;
  title: string;
  coreMessage: string;
}

export interface QuranMappingItem {
  surahNumber: number;
  surahName: string;
  arabicName: string;
  meaning: string;
  revelationType: 'Makkiyyah' | 'Madaniyyah';
  numberOfAyahs: number;
  chronologicalOrder: number;
  juz: string;
  estimatedReadingMinutes: number; // 5-15 menit

  // 1. Pokok Kandungan
  pokokKandungan: {
    temaUtama: string;
    konteksDanLatarBelakang: string;
    urgensiMemahami: string;
  };

  // 2. Pelajaran & Hikmah Hidup
  pelajaranDanHikmah: string[];

  // 3. Hukum Islam yang Terkandung
  hukumIslam: {
    perintah: string[];
    larangan: string[];
    prinsipSyariah: string;
  };

  // 4. Keterkaitan Antar Surah (Munasabah)
  keterkaitanAntarSurah: {
    denganSebelumnya: string;
    denganSesudahnya: string;
    benangMerah: string;
  };

  // 5. Gambaran Besar Seluruh Quran & Peta Alur
  gambaranBesar: {
    posisiDalamQuran: string;
    petaAlurTema: SurahFlowSection[];
    kunciPesan: string;
  };
}

export type AppTab =
  | 'prayer-times'
  | 'qibla'
  | 'dzikir-doa'
  | 'tarjih-prayers'
  | 'memorize'
  | 'quran'
  | 'quran-mapping'
  | 'quran-memorize-shq'
  | 'khgt';
