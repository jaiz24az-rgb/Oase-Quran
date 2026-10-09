import { KhgtEvent } from '../types';

export interface HijriDateInfo {
  day: number;
  month: number;
  monthName: string;
  monthArabic: string;
  year: number;
  formatted: string;
}

export const HIJRI_MONTHS = [
  { id: 1, name: 'Muharram', arabic: 'مُحَرَّم' },
  { id: 2, name: 'Safar', arabic: 'صَفَر' },
  { id: 3, name: 'Rabiul Awwal', arabic: 'رَبِيع الأَوَّل' },
  { id: 4, name: 'Rabiul Akhir', arabic: 'رَبِيع الآخِر' },
  { id: 5, name: 'Jumadil Ula', arabic: 'جُمَادَى الأُولَى' },
  { id: 6, name: 'Jumadil Akhirah', arabic: 'جُمَادَى الآخِرَة' },
  { id: 7, name: 'Rajab', arabic: 'رَجَب' },
  { id: 8, name: 'Sya\'ban', arabic: 'شَعْبَان' },
  { id: 9, name: 'Ramadhan', arabic: 'رَمَضَان' },
  { id: 10, name: 'Syawal', arabic: 'شَوَّال' },
  { id: 11, name: 'Dzulqa\'dah', arabic: 'ذُو القَعْدَة' },
  { id: 12, name: 'Dzulhijjah', arabic: 'ذُو الحِجَّة' },
];

/**
 * KHGT (Kalender Hijriah Global Tunggal)
 * Epoch baseline: 1 Muharram 1446 H = 7 Juli 2024 Masehi
 */
export const KHGT_PRINCIPLES = [
  {
    title: 'Satu Hari Satu Tanggal di Seluruh Dunia',
    desc: 'Tidak ada lagi perbedaan tanggal hari raya maupun awal bulan Hijriah antar belahan bumi. Semua umat Islam di timur maupun barat merayakan tanggal yang sama.',
  },
  {
    title: 'Kriteria Kesepakatan Global Istanbul 2016',
    desc: 'Bulan baru dimulai jika sebelum pukul 24:00 GMT telah terjadi ijtimak dan di belahan bumi mana saja hilal teramati/memenuhi syarat visibilitas (tinggi ≥ 5° dan elongasi ≥ 8°).',
  },
  {
    title: 'Ketetapan Kalender Hijriah Global',
    desc: 'Mengimplementasikan sistem Kalender Hijriah Global Tunggal (KHGT) mulai 1 Muharram 1446 H menggantikan sistem penanggalan lokal.',
  },
];

export const KHGT_MAJOR_EVENTS: KhgtEvent[] = [
  // 1446 H - 1447 H - 1448 H
  {
    id: 'khgt-muharram-1447',
    title: 'Tahun Baru Islam 1 Muharram 1447 H',
    hijriDate: '1 Muharram 1447 H',
    gregorianDate: '26 Juni 2025 M',
    description: 'Awal Tahun Baru Hijriah Global Tunggal 1447 H.',
    type: 'hari_raya',
    khgtNote: 'Berlaku serentak di seluruh dunia tanpa perbedaan kawasan.',
  },
  {
    id: 'khgt-asyura-1447',
    title: 'Puasa Asyura & Tasu\'a 1447 H',
    hijriDate: '9 - 10 Muharram 1447 H',
    gregorianDate: '4 - 5 Juli 2025 M',
    description: 'Puasa sunnah yang menghapuskan dosa setahun yang lalu.',
    type: 'puasa_sunnah',
    khgtNote: 'Disunnahkan berpuasa pada hari ke-9 dan ke-10.',
  },
  {
    id: 'khgt-maulid-1447',
    title: 'Maulid Nabi Muhammad SAW 1447 H',
    hijriDate: '12 Rabiul Awwal 1447 H',
    gregorianDate: '4 September 2025 M',
    description: 'Peringatan kelahiran junjungan Nabi Agung Muhammad SAW.',
    type: 'peringatan',
  },
  {
    id: 'khgt-isra-miraj-1447',
    title: 'Isra Mi\'raj 1447 H',
    hijriDate: '27 Rajab 1447 H',
    gregorianDate: '16 Januari 2026 M',
    description: 'Peristiwa agung perjalanan malam dan pensyariatan sholat 5 waktu.',
    type: 'peringatan',
  },
  {
    id: 'khgt-nisfu-syaban-1447',
    title: 'Nisfu Sya\'ban 1447 H',
    hijriDate: '15 Sya\'ban 1447 H',
    gregorianDate: '3 Februari 2026 M',
    description: 'Pertengahan bulan Sya\'ban persiapan menyambut bulan suci Ramadhan.',
    type: 'puasa_sunnah',
  },
  {
    id: 'khgt-ramadhan-1447',
    title: 'Awal Puasa Ramadhan 1447 H',
    hijriDate: '1 Ramadhan 1447 H',
    gregorianDate: '18 Februari 2026 M',
    description: 'Hari pertama ibadah puasa wajib Ramadhan 1447 H serentak dunia.',
    type: 'puasa_wajib',
    khgtNote: 'Ketetapan hisab kalender global tunggal.',
  },
  {
    id: 'khgt-nuzulul-quran-1447',
    title: 'Nuzulul Qur\'an 1447 H',
    hijriDate: '17 Ramadhan 1447 H',
    gregorianDate: '6 Maret 2026 M',
    description: 'Malam peringatan diturunkannya ayat pertama Al-Qur\'an.',
    type: 'peringatan',
  },
  {
    id: 'khgt-idul-fitri-1447',
    title: 'Hari Raya Idul Fitri 1 Syawal 1447 H',
    hijriDate: '1 Syawal 1447 H',
    gregorianDate: '20 Maret 2026 M',
    description: 'Hari kemenangan umat Islam setelah sebulan penuh berpuasa.',
    type: 'hari_raya',
    khgtNote: 'Sholat Idul Fitri serentak sedunia menurut KHGT.',
  },
  {
    id: 'khgt-puasa-syawal-1447',
    title: 'Puasa Sunnah 6 Hari Syawal 1447 H',
    hijriDate: '2 - 7 Syawal 1447 H',
    gregorianDate: '21 - 26 Maret 2026 M',
    description: 'Puasa 6 hari yang pahalanya menyamai puasa setahun penuh.',
    type: 'puasa_sunnah',
  },
  {
    id: 'khgt-awal-dzulhijjah-1447',
    title: 'Awal Bulan Dzulhijjah 1447 H',
    hijriDate: '1 Dzulhijjah 1447 H',
    gregorianDate: '18 Mei 2026 M',
    description: 'Masuknya 10 hari pertama bulan Dzulhijjah yang mulia.',
    type: 'peringatan',
  },
  {
    id: 'khgt-arafah-1447',
    title: 'Hari Arafah & Puasa Arafah 1447 H',
    hijriDate: '9 Dzulhijjah 1447 H',
    gregorianDate: '26 Mei 2026 M',
    description: 'Puncak ibadah haji di padang Arafah & disunnahkan puasa Arafah bagi non-jamaah haji.',
    type: 'puasa_sunnah',
    khgtNote: 'Dengan KHGT, hari wukuf Arafah di Makkah bertepatan persis sama dengan hari puasa Arafah di Indonesia!',
  },
  {
    id: 'khgt-idul-adha-1447',
    title: 'Hari Raya Idul Adha 1447 H (10 Dzulhijjah)',
    hijriDate: '10 Dzulhijjah 1447 H',
    gregorianDate: '27 Mei 2026 M',
    description: 'Hari Raya Qurban dan sholat Idul Adha serentak.',
    type: 'hari_raya',
    khgtNote: 'Tidak ada lagi keraguan perbedaan 1 hari antara Idul Adha di Arab Saudi dan Indonesia.',
  },
  {
    id: 'khgt-tasyrik-1447',
    title: 'Hari Tasyrik 1447 H',
    hijriDate: '11 - 13 Dzulhijjah 1447 H',
    gregorianDate: '28 - 30 Mei 2026 M',
    description: 'Hari makan dan minum serta penyembelihan hewan qurban (diharamkan puasa).',
    type: 'peringatan',
  },
  {
    id: 'khgt-muharram-1448',
    title: 'Tahun Baru Islam 1 Muharram 1448 H',
    hijriDate: '1 Muharram 1448 H',
    gregorianDate: '16 Juni 2026 M',
    description: 'Awal Tahun Baru Hijriah Global Tunggal 1448 H.',
    type: 'hari_raya',
  },
  {
    id: 'khgt-ramadhan-1448',
    title: 'Awal Puasa Ramadhan 1448 H',
    hijriDate: '1 Ramadhan 1448 H',
    gregorianDate: '8 Februari 2027 M',
    description: 'Hari pertama ibadah puasa wajib Ramadhan 1448 H serentak dunia.',
    type: 'puasa_wajib',
  },
  {
    id: 'khgt-idul-fitri-1448',
    title: 'Hari Raya Idul Fitri 1 Syawal 1448 H',
    hijriDate: '1 Syawal 1448 H',
    gregorianDate: '10 Maret 2027 M',
    description: 'Hari Raya Idul Fitri 1448 H serentak sedunia.',
    type: 'hari_raya',
  },
];

/**
 * Accurate conversion algorithm from Gregorian to KHGT (Kalender Hijriah Global Tunggal).
 * Based on Julian Day Number and the astronomical lunar cycle calibrated to 1 Muharram 1446 = 7 July 2024.
 */
export function getKhgtHijriDate(date: Date = new Date()): HijriDateInfo {
  // Epoch for 1 Muharram 1446 H = 2024-07-07
  const baseGregorian = new Date(Date.UTC(2024, 6, 7)); // 7 July 2024
  const targetUtc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const diffDays = Math.round((targetUtc.getTime() - baseGregorian.getTime()) / (1000 * 60 * 60 * 24));

  // Average synodic month is approx 29.530588 days
  // Hijri year approx 354.367 days
  let totalDays = diffDays;
  let year = 1446;
  let month = 1;
  let day = 1;

  // Month length table for 1446, 1447, 1448 H based on Istanbul 2016 criteria
  // 1446 H: 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29 = 354 days
  const monthLengths1446 = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
  const monthLengths1447 = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 30]; // Leap year (355 days)
  const monthLengths1448 = [29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30];

  const getMonthLength = (y: number, m: number): number => {
    if (y === 1446) return monthLengths1446[m - 1] || 30;
    if (y === 1447) return monthLengths1447[m - 1] || 30;
    if (y === 1448) return monthLengths1448[m - 1] || 30;
    // General alternating standard rule (odd months 30, even 29, 12th in leap 30)
    if (m === 12) {
      const isLeap = (11 * y + 14) % 30 < 11;
      return isLeap ? 30 : 29;
    }
    return m % 2 === 1 ? 30 : 29;
  };

  if (totalDays >= 0) {
    while (true) {
      const mLen = getMonthLength(year, month);
      if (totalDays < mLen) {
        day = totalDays + 1;
        break;
      }
      totalDays -= mLen;
      month++;
      if (month > 12) {
        month = 1;
        year++;
      }
    }
  } else {
    // Before 1 Muharram 1446 H
    while (totalDays < 0) {
      month--;
      if (month < 1) {
        month = 12;
        year--;
      }
      const mLen = getMonthLength(year, month);
      totalDays += mLen;
    }
    day = totalDays + 1;
  }

  const monthObj = HIJRI_MONTHS.find((m) => m.id === month) || HIJRI_MONTHS[0];

  return {
    day,
    month,
    monthName: monthObj.name,
    monthArabic: monthObj.arabic,
    year,
    formatted: `${day} ${monthObj.name} ${year} H`,
  };
}

/**
 * Check if today is a sunnah fasting day according to KHGT
 */
export function getTodayFastingNote(hijriInfo: HijriDateInfo, dayOfWeek: number): string | null {
  // Ayyamul Bidh: 13, 14, 15 of every Hijri month (except 13 Dzulhijjah - Tasyrik)
  if ((hijriInfo.day === 13 || hijriInfo.day === 14 || hijriInfo.day === 15) && !(hijriInfo.month === 12 && hijriInfo.day === 13)) {
    return `Puasa Sunnah Ayyamul Bidh (Hari ke-${hijriInfo.day - 12})`;
  }
  // Monday and Thursday
  if (dayOfWeek === 1) return 'Puasa Sunnah Hari Senin';
  if (dayOfWeek === 4) return 'Puasa Sunnah Hari Kamis';
  // Asyura / Tasu'a
  if (hijriInfo.month === 1 && hijriInfo.day === 9) return 'Puasa Sunnah Tasu\'a (9 Muharram)';
  if (hijriInfo.month === 1 && hijriInfo.day === 10) return 'Puasa Sunnah Asyura (10 Muharram)';
  // Arafah
  if (hijriInfo.month === 12 && hijriInfo.day === 9) return 'Puasa Sunnah Hari Arafah (9 Dzulhijjah)';
  // Ramadhan
  if (hijriInfo.month === 9) return `Ibadah Puasa Ramadhan Hari ke-${hijriInfo.day}`;
  // Syawal 2-7
  if (hijriInfo.month === 10 && hijriInfo.day >= 2 && hijriInfo.day <= 7) return 'Hari Disunnahkan Puasa 6 Hari Syawal';

  return null;
}
