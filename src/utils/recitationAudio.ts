// Audio utility for authentic human recitation of Doa, Dzikir, and Sholat prayers
// Sesuai Standar Tajwid & Tartil Metode Ummi (Makhraj Fasih, Mad 2 Harakat Konsisten, Ghunnah Sempurna, Bebas Suara Robotik)

export interface UmmiTajwidDetail {
  makhrajNotes: string;
  madGuide: string;
  ghunnahGuide: string;
  tempoNotes: string;
}

export interface RecitationInfo {
  audioUrl: string;
  reciterName: string;
  type: 'quran_everyayah' | 'hadith_hisnul_muslim';
  ummiDetails: UmmiTajwidDetail;
}

export interface PlayerState {
  isPlaying: boolean;
  currentItemId: string | null;
  playbackRate: number; // 0.75 (Talaqqi Pelan), 0.85 (Standar Tartil Ummi), 1.0 (Normal)
  repeatMode: 1 | 3 | 0; // 1 = 1x, 3 = 3x (Tikrar Ummi), 0 = Loop
  currentRepeatCount: number;
  currentTime: number;
  duration: number;
  progressPercent: number;
  audioInfo: RecitationInfo | null;
  syncOffsetMs: number; // Audio sync offset in milliseconds (for calibrating highlight synchronization)
}

const HISNUL_MUSLIM_BASE = 'https://raw.githubusercontent.com/sheikhhanif/Hisnul_Muslim_Database/master/audio';
const EVERYAYAH_BASE = 'https://everyayah.com/data/Alafasy_128kbps';

// Default Ummi Tajwid specifications
const DEFAULT_UMMI_DETAIL: UmmiTajwidDetail = {
  makhrajNotes: 'Jaga kejelasan makhraj huruf (Hams, Jahr, Isti’la, dan Qolqolah).',
  madGuide: 'Mad Thabi’i tepat 2 ketukan konsisten; Mad Wajib/Jaiz 4-5 ketukan.',
  ghunnahGuide: 'Ghunnah ditahan 2 ketukan sempurna pada Nun/Mim bertasydid dan Ikhfa.',
  tempoNotes: 'Tartil Metode Ummi: Nada datar-naik-turun berirama teratur, tidak tergesa-gesa.',
};

// Map of prayer IDs to authentic audio recordings and Ummi tajwid guides
const AUDIO_ID_MAP: Record<string, RecitationInfo> = {
  // === TUNTUNAN SHOLAT FARDHU & HADITS SHAHIH ===
  'sholat-niat': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/27hm.mp3`,
    reciterName: 'Tartil Tajwid Syaikh Hisnul Muslim (Niat & Masuk Sholat)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: {
      makhrajNotes: 'Niat ikhlas dalam hati berbarengan dengan Takbiratul Ihram.',
      madGuide: 'Mad Thabi’i 2 harakat.',
      ghunnahGuide: 'Sempurnakan dengung pada huruf idgham.',
      tempoNotes: 'Tenang, khusyuk, menghadirkan keagungan Allah Ta’ala.',
    },
  },
  'sholat-takbir': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/27hm.mp3`,
    reciterName: 'Lafal Takbiratul Ihram (Tartil Tajwid Manusia)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: {
      makhrajNotes: 'Huruf Lam pada Lafzhul Jalalah dibaca Tafkhim (tebal) 2 ketukan.',
      madGuide: 'Allahu (2 ketukan) Akbar (jangan memanjangkan bar).',
      ghunnahGuide: 'Tanpa dengung, vokal tegas.',
      tempoNotes: 'Tempo khusyuk menyelaraskan gerakan takbir.',
    },
  },
  'sholat-iftitah': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/27hm.mp3`,
    reciterName: 'Doa Iftitah Sesuai Sunnah (Hadits Abu Hurairah - Muttafaq ‘Alaih)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: {
      makhrajNotes: 'Perhatikan makhraj huruf Kha pada "Khatayaaya" dan Ain pada "Baa’id".',
      madGuide: 'Baa’id (2 harakat), Khatayaaya (2 harakat pada ya dan ya).',
      ghunnahGuide: 'Tasydid pada Mim "Allahumma" ditahan 2 ketukan ghunnah sempurna.',
      tempoNotes: 'Metode Ummi: Irama tartil rendah-sedang yang menyentuh hati saat bermunajat.',
    },
  },
  'sholat-fatihah': {
    audioUrl: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/001.mp3',
    reciterName: 'Syekh Mishary Rashid Alafasy (Surah Al-Fatihah 1-7 Lengkap)',
    type: 'quran_everyayah',
    ummiDetails: {
      makhrajNotes: 'Pembedaan teliti huruf Ha (halus), ‘Ain, Dhad pada "Walaadh-dhaalliin".',
      madGuide: 'Mad Lazim Kilmi Mutsaqqal pada "Dhaalliin" 6 harakat penuh + tasydid Lam.',
      ghunnahGuide: 'Ghunnah pada Nun bertasydid (Inna / Ar-Rahman).',
      tempoNotes: 'Waqaf pada setiap akhir ayat (Sunnah Nabi SAW sesuai standar Ummi).',
    },
  },
  'sholat-ruku': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/32hm.mp3`,
    reciterName: 'Doa Ruku’ (Subhaanakallahumma Rabbanaa - ‘Aisyah RA)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: {
      makhrajNotes: 'Qolqolah Ba pada "Sub-haana", Kha pada "Ighfir lii".',
      madGuide: 'Mad Thabi’i 2 harakat pada "Subhaana" dan "Rabbanaa".',
      ghunnahGuide: 'Tasydid Mim pada "Allahumma" ditahan 2 harakat berirama.',
      tempoNotes: 'Thuma’ninah ruku’, tempo stabil dan jelas.',
    },
  },
  'sholat-itidal': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/34hm.mp3`,
    reciterName: 'Doa I’tidal (Rabbanaa wa Lakal Hamdu)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: {
      makhrajNotes: 'Huruf ‘Ain pada "Sami’allahu liman hamidah", Ha pada "Hamdu".',
      madGuide: 'Mad 2 harakat pada "Rabbanaa".',
      ghunnahGuide: 'Idgham mitslain / mim sukun bertemu wau dibaca idzhar syafawi.',
      tempoNotes: 'Berdiri tegak thuma’ninah dengan pelafalan mantap.',
    },
  },
  'sholat-sujud': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/35hm.mp3`,
    reciterName: 'Doa Sujud (Subhaanakallahumma Rabbanaa - Bukhari & Muslim)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: {
      makhrajNotes: 'Pelafalan Qolqolah sugra pada Ba "Subhaana", Ghain pada "Ighfir".',
      madGuide: 'Panjang 2 ketukan konsisten tanpa dilebihkan.',
      ghunnahGuide: 'Ghunnah tasydid mim 2 harakat sempurna.',
      tempoNotes: 'Suasana tunduk dan khusyuk merendahkan diri kepada Allah.',
    },
  },
  'sholat-duduk': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/40hm.mp3`,
    reciterName: 'Doa Duduk Antara Dua Sujud (Hadits Ibnu Abbas)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: {
      makhrajNotes: 'Huruf Ghain pada "Ighfir", Ra tarqiq pada "Warhamnii".',
      madGuide: 'Mad Thabi’i ya sukun 2 ketukan pada tiap permohonan.',
      ghunnahGuide: 'Nun bertasydid / idzhar dibaca bersih.',
      tempoNotes: 'Irama jeda tertib per kata doa permohonan ampunan dan rahmat.',
    },
  },
  'sholat-duduk-dua-sujud': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/40hm.mp3`,
    reciterName: 'Doa Duduk Antara Dua Sujud (Hadits Ibnu Abbas)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: {
      makhrajNotes: 'Huruf Ghain pada "Ighfir", Ra tarqiq pada "Warhamnii".',
      madGuide: 'Mad Thabi’i ya sukun 2 ketukan pada tiap permohonan.',
      ghunnahGuide: 'Nun bertasydid / idzhar dibaca bersih.',
      tempoNotes: 'Irama jeda tertib per kata doa permohonan ampunan dan rahmat.',
    },
  },
  'sholat-tasyahhud': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/49hm.mp3`,
    reciterName: 'Doa Tasyahhud (Attahiyyatu Lillaahi - Ibnu Mas’ud RA)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: {
      makhrajNotes: 'Hati-hati huruf Ha pada "Attahiyyatu", Sin pada "Assalaamu", Ain pada "Ibaadillah".',
      madGuide: 'Mad Thabi’i 2 ketukan pada "Attahiyyatu", "Assalaamu", "Ash-shaalihiin".',
      ghunnahGuide: 'Nun bertasydid pada "Inna" dan "Ashhadu al-laa" (idgham bilaghunnah).',
      tempoNotes: 'Syahdu dan khidmat dengan isyarat telunjuk.',
    },
  },
  'sholat-tasyahhud-awal': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/49hm.mp3`,
    reciterName: 'Doa Tasyahhud (Attahiyyatu Lillaahi - Ibnu Mas’ud RA)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: {
      makhrajNotes: 'Hati-hati huruf Ha pada "Attahiyyatu", Sin pada "Assalaamu", Ain pada "Ibaadillah".',
      madGuide: 'Mad Thabi’i 2 ketukan pada "Attahiyyatu", "Assalaamu", "Ash-shaalihiin".',
      ghunnahGuide: 'Nun bertasydid pada "Inna" dan "Ashhadu al-laa" (idgham bilaghunnah).',
      tempoNotes: 'Syahdu dan khidmat dengan isyarat telunjuk.',
    },
  },
  'sholat-tasyahhud-akhir': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/49hm.mp3`,
    reciterName: 'Doa Tasyahhud Akhir (Ibnu Mas’ud RA)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: {
      makhrajNotes: 'Kejelasan makhraj huruf tasyahhud dan syahadatain.',
      madGuide: 'Mad 2 ketukan teratur.',
      ghunnahGuide: 'Ghunnah 2 harakat pada tasydid mim & nun.',
      tempoNotes: 'Tartil sempurna sebelum dilanjutkan shalawat.',
    },
  },
  'sholat-shalawat': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/50hm.mp3`,
    reciterName: 'Shalawat Ibrahimiyah (Ka’ab bin ‘Ujrah RA)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: {
      makhrajNotes: 'Huruf Shad pada "Shalli", Ha pada "Muhammad", Ba qolqolah pada "Ibraahiim".',
      madGuide: 'Mad Thabi’i 2 harakat pada "Aala", "Ibraahiim", "Hamiidum Majiid".',
      ghunnahGuide: 'Tasydid Mim pada "Allahumma" dan "Muhammad" ditahan 2 ketukan.',
      tempoNotes: 'Penuh penghormatan dan kecintaan kepada Rasulullah SAW.',
    },
  },
  'sholat-doa-sebelum-salam': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/55hm.mp3`,
    reciterName: 'Doa Perlindungan Sebelum Salam (4 Fitnah Besar - Abu Hurairah RA)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: {
      makhrajNotes: 'Huruf Dzal pada "A’uudzu", Jim pada "Jahannam", Masyihid Dajjal.',
      madGuide: 'Mad Thabi’i 2 ketukan.',
      ghunnahGuide: 'Tasydid Nun pada "Jahannam" 2 harakat dengung kuat.',
      tempoNotes: 'Berlindung dengan penuh kesungguhan dan ketakwaan.',
    },
  },
  'sholat-salam': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/58hm.mp3`,
    reciterName: 'Lafal Salam Sholat (Assalamu ‘Alaikum wa Rahmatullah)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: {
      makhrajNotes: 'Sin pada "Salam", ‘Ain pada "‘Alaikum", Ha pada "Rahmatullah".',
      madGuide: 'Mad Thabi’i 2 harakat pada "Assalaamu".',
      ghunnahGuide: 'Mim sukun bertemu wawu dibaca Idzhar Syafawi (jelas tanpa dengung).',
      tempoNotes: 'Penuh ketenangan menoleh ke kanan dan ke kiri.',
    },
  },

  // === SHOLAT JENAZAH ===
  'jenazah-tata-cara': {
    audioUrl: `${EVERYAYAH_BASE}/001001.mp3`,
    reciterName: 'Panduan Sholat Jenazah (Murottal Fatihah)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'jenazah-takbir-1': {
    audioUrl: `${EVERYAYAH_BASE}/001001.mp3`,
    reciterName: 'Bacaan Takbir 1 Jenazah (Surah Al-Fatihah Murottal Tajwid)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'jenazah-takbir-2': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/50hm.mp3`,
    reciterName: 'Bacaan Takbir 2 Jenazah (Shalawat Ibrahimiyah Tartil)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'jenazah-takbir-3-dewasa': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/156hm.mp3`,
    reciterName: 'Doa Jenazah Dewasa (Allahummaghfir lahu warhamhu - Auf bin Malik RA)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: {
      makhrajNotes: 'Huruf Ghain pada "Ighfir", Ha dhomir pada "lahu", Ain pada "‘Aafihi".',
      madGuide: 'Mad 2 ketukan konsisten.',
      ghunnahGuide: 'Sempurnakan dengung pada tasydid.',
      tempoNotes: 'Irama doa khusyuk memohonkan ampunan bagi jenazah.',
    },
  },
  'jenazah-takbir-3-anak': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/158hm.mp3`,
    reciterName: 'Doa Jenazah Anak-Anak (Allahummaj’alhu lanaa farathan)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'jenazah-takbir-4': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/157hm.mp3`,
    reciterName: 'Doa Takbir 4 Jenazah (Allahumma laa tahrimnaa ajrahu)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'jenazah-salam': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/58hm.mp3`,
    reciterName: 'Salam Sholat Jenazah (Tartil Tajwid Manusia)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },

  // === SHOLAT GERHANA, HAJAT, SUNNAH ===
  'gerhana-panduan': {
    audioUrl: `${EVERYAYAH_BASE}/002255.mp3`,
    reciterName: 'Panduan Sholat Gerhana (Ayat Kursi Murottal)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'gerhana-doa-zikir': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/69hm.mp3`,
    reciterName: 'Dzikir dan Takbir Gerhana (Hadits Shahih Bukhari)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'gerhana-doa-istighfar': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/79hm.mp3`,
    reciterName: 'Istighfar Sholat Gerhana (Sayyidul Istighfar Tartil)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'hajat-tata-cara': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/69hm.mp3`,
    reciterName: 'Panduan Sholat Hajat (Dzikir & Puji)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'hajat-doa-matsur': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/67hm.mp3`,
    reciterName: 'Doa Sholat Hajat Matsur (Hadits Sunan Tirmidzi)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'sunnah-istikharah': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/74hm.mp3`,
    reciterName: 'Doa Sholat Istikharah (Hadits Jabir bin Abdillah RA - Bukhari)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: {
      makhrajNotes: 'Huruf Kha pada "Astakhiiruka", Ain pada "Ilmika", Qaf pada "Qudratika".',
      madGuide: 'Mad Thabi’i 2 harakat teratur.',
      ghunnahGuide: 'Ghunnah 2 harakat pada Nun bertasydid.',
      tempoNotes: 'Metode Ummi: Tempo tenang dan mantap memohon petunjuk pilihan terbaik.',
    },
  },
  'hadist-istikharah': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/74hm.mp3`,
    reciterName: 'Doa Sholat Istikharah (Hadits Jabir bin Abdillah RA)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'sunnah-dhuha': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/69hm.mp3`,
    reciterName: 'Doa Sholat Dhuha & Tasbih',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'sunnah-tahajud-iftitah': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/28hm.mp3`,
    reciterName: 'Doa Iftitah Tahajud (Hadits Ibnu Abbas RA - Bukhari Muslim)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'sunnah-qunut-witir': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/116hm.mp3`,
    reciterName: 'Doa Qunut Witir (Hadits Hasan bin Ali RA - Abu Dawud & Tirmidzi)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'sunnah-taubat': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/79hm.mp3`,
    reciterName: 'Doa Sholat Taubat (Sayyidul Istighfar Tartil)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'sunnah-rawatib': {
    audioUrl: `${EVERYAYAH_BASE}/001001.mp3`,
    reciterName: 'Panduan Sholat Sunnah Rawatib (Murottal Tartil)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'sunnah-tahiyyatul-masjid': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/20hm.mp3`,
    reciterName: 'Sholat Tahiyyatul Masjid & Masuk Masjid',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },

  // === DZIKIR PAGI & PETANG (AL-MA'TSURAT SHAHIH) ===
  'pagi-ayat-kursi': {
    audioUrl: `${EVERYAYAH_BASE}/002255.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (Ayat Kursi QS 2:255)',
    type: 'quran_everyayah',
    ummiDetails: {
      makhrajNotes: 'Huruf Ya pada "Al-Hayyul Qayyum", Sin pada "Sinatun", Dzal pada "Ya’udzuhu".',
      madGuide: 'Mad Jaiz Munfashil 4-5 ketukan, Mad Thabi’i 2 ketukan konsisten.',
      ghunnahGuide: 'Ghunnah Ikhfa Haqiqi dan Idgham Bighunnah 2 ketukan berirama.',
      tempoNotes: 'Metode Ummi: Murottal khusyuk berirama tartil standar pembelajaran.',
    },
  },
  'dzikir-pagi-ayat-kursi': {
    audioUrl: `${EVERYAYAH_BASE}/002255.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (Ayat Kursi QS 2:255)',
    type: 'quran_everyayah',
    ummiDetails: {
      makhrajNotes: 'Huruf Ya pada "Al-Hayyul Qayyum", Sin pada "Sinatun", Dzal pada "Ya’udzuhu".',
      madGuide: 'Mad Jaiz Munfashil 4-5 ketukan, Mad Thabi’i 2 ketukan konsisten.',
      ghunnahGuide: 'Ghunnah Ikhfa Haqiqi dan Idgham Bighunnah 2 ketukan berirama.',
      tempoNotes: 'Metode Ummi: Murottal khusyuk berirama tartil standar pembelajaran.',
    },
  },
  'petang-ayat-kursi': {
    audioUrl: `${EVERYAYAH_BASE}/002255.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (Ayat Kursi QS 2:255)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'bada-ayat-kursi': {
    audioUrl: `${EVERYAYAH_BASE}/002255.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (Ayat Kursi QS 2:255)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'pagi-muawwidzat': {
    audioUrl: `${EVERYAYAH_BASE}/112001.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (Trio Mu’awwidzat - QS Al-Ikhlas)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'petang-muawwidzat': {
    audioUrl: `${EVERYAYAH_BASE}/112001.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (Trio Mu’awwidzat - QS Al-Ikhlas)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'dzikir-pagi-muawwidzatain': {
    audioUrl: `${EVERYAYAH_BASE}/112001.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (Trio Mu’awwidzat - QS Al-Ikhlas)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'bada-muawwidzat': {
    audioUrl: `${EVERYAYAH_BASE}/112001.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (Trio Mu’awwidzat - QS Al-Ikhlas)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'pagi-ashbahna': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/77hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Ashbahna wa Ashbahal Mulk)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'dzikir-pagi-ashbahna': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/77hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Ashbahna wa Ashbahal Mulk)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'petang-amsainaa': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/77hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Amsainaa wa Amsal Mulk)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'dzikir-petang-amsainaa': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/77hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Amsainaa wa Amsal Mulk)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'pagi-bika-ashbahna': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/78hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Allahumma bika ashbahnaa)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'dzikir-pagi-bika-ashbahna': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/78hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Allahumma bika ashbahnaa)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'petang-bika-amsainaa': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/78hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Allahumma bika amsainaa)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'dzikir-petang-bika-amsainaa': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/78hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Allahumma bika amsainaa)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'pagi-sayyidul-istighfar': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/79hm.mp3`,
    reciterName: 'Pelafalan Tartil Tajwid Sayyidul Istighfar (Hadits Syaddad bin Aus)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: {
      makhrajNotes: 'Huruf Dzal pada "Khalaqtanii", ‘Ain pada "‘Ahdika wa Wa’dika".',
      madGuide: 'Mad Thabi’i 2 ketukan, Mad Munfashil 4 ketukan pada "Maa astatha’tu".',
      ghunnahGuide: 'Ghunnah 2 ketukan pada tasydid Mim "Allahumma" dan Idgham Bighunnah.',
      tempoNotes: 'Metode Ummi: Pengulangan syahdu, tempo teratur untuk memudahkan hafalan mutqin.',
    },
  },
  'petang-sayyidul-istighfar': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/79hm.mp3`,
    reciterName: 'Pelafalan Tartil Tajwid Sayyidul Istighfar',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'doa-sayyidul-istighfar': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/79hm.mp3`,
    reciterName: 'Pelafalan Tartil Tajwid Sayyidul Istighfar',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'pagi-syahadat-sakral': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/80hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'petang-syahadat-sakral': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/80hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'pagi-nikmat': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/81hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Doa Syukur Nikmat Pagi)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'petang-nikmat': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/81hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Doa Syukur Nikmat Petang)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'pagi-afiyah': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/82hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Allahumma ‘aafinii fii badanii)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'dzikir-pagi-afiyah': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/82hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Allahumma ‘aafinii fii badanii)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'petang-afiyah': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/82hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Perlindungan Afiyah Petang)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'pagi-hasbiyallah': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/83hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Hasbiyallahu laa ilaha illa huwa - 7x)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'petang-hasbiyallah': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/83hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Hasbiyallahu)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'pagi-afwa-afiyah': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/84hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Allahumma inni as-alukal ‘afwa)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'petang-afwa-afiyah': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/84hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Allahumma inni as-alukal ‘afwa)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'pagi-alimal-ghaib': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/85hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Allahumma ‘aalimal ghaibi wash-syahaadah)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'petang-alimal-ghaib': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/85hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'pagi-bismillah-la-yadhurru': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/86hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Bismillahilladzi laa yadhurru)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'dzikir-pagi-bismillah-la-yadhurru': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/86hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Bismillahilladzi laa yadhurru)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'petang-bismillah-la-yadhurru': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/86hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Bismillahilladzi laa yadhurru)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'pagi-radhitu': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/87hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Radhiitu billahi rabba)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'dzikir-pagi-radhitu': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/87hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Radhiitu billahi rabba)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'petang-radhitu': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/87hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Radhiitu billahi rabba)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'pagi-ya-hayyu': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/88hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Ya Hayyu Ya Qayyum bi rahmatika)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'dzikir-pagi-ya-hayyu': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/88hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Ya Hayyu Ya Qayyum bi rahmatika)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'petang-ya-hayyu': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/88hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Ya Hayyu Ya Qayyum)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'pagi-fithrah': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/89hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Ashbahna ‘ala fithratil Islam)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'petang-fithrah': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/89hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'pagi-subhanallah-bihamdihi': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/90hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Subhanallahi wa bihamdihi 100x)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'dzikir-pagi-subhanallah-adada': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/90hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Subhanallahi wa bihamdihi ‘Adada Khalqihi)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'petang-subhanallah-bihamdihi': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/90hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Subhanallahi wa bihamdihi 100x)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'pagi-tahlil-100x': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/93hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Laa ilaha illallahu wahdahu 100x)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'petang-tahlil-100x': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/93hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Laa ilaha illallahu wahdahu)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'pagi-astaghfirullah': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/94hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Astaghfirullaha wa atubu ilaih 100x)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'petang-astaghfirullah': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/94hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'petang-audzu-bikalimatillah': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/95hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (A’udzu bi kalimatillahit tammati)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'dzikir-petang-kalimatillah': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/95hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (A’udzu bi kalimatillahit tammati)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'pagi-shalawat-nabi': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/96hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Shalawat Nabi 10x)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'petang-shalawat-nabi': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/96hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Shalawat Nabi 10x)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },

  // === DOA AL-QUR'AN (RABBANA) DENGAN MUROTTAL TARTIL ALAFASY ===
  'quran-sapu-jagad': {
    audioUrl: `${EVERYAYAH_BASE}/002201.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (QS. Al-Baqarah: 201)',
    type: 'quran_everyayah',
    ummiDetails: {
      makhrajNotes: 'Huruf Ra pada "Rabbanaa", Ha pada "Hasanah", Ain pada "‘Adzaaban naar".',
      madGuide: 'Mad 2 ketukan pada "Rabbanaa", "Aatinaa", "Fid dunyaa".',
      ghunnahGuide: 'Ghunnah 2 harakat pada Nun tasydid "Innaar".',
      tempoNotes: 'Tartil tenang, doa paling mustajab dan menyeluruh.',
    },
  },
  'doa-kebaikan-dunia-akhirat': {
    audioUrl: `${EVERYAYAH_BASE}/002201.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (QS. Al-Baqarah: 201)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'quran-hidayah': {
    audioUrl: `${EVERYAYAH_BASE}/003008.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (QS. Ali ‘Imran: 8)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'doa-quran-hidayah': {
    audioUrl: `${EVERYAYAH_BASE}/003008.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (QS. Ali ‘Imran: 8)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'quran-keluarga': {
    audioUrl: `${EVERYAYAH_BASE}/025074.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (QS. Al-Furqan: 74)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'doa-quran-keluarga': {
    audioUrl: `${EVERYAYAH_BASE}/025074.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (QS. Al-Furqan: 74)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'quran-orang-tua': {
    audioUrl: `${EVERYAYAH_BASE}/017024.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (QS. Al-Isra’: 24)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'doa-orang-tua': {
    audioUrl: `${EVERYAYAH_BASE}/017024.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (QS. Al-Isra’: 24)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'quran-taubat-adam': {
    audioUrl: `${EVERYAYAH_BASE}/007023.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (QS. Al-A’raf: 23)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'doa-quran-ampunan-adam': {
    audioUrl: `${EVERYAYAH_BASE}/007023.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (QS. Al-A’raf: 23)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'quran-doa-yunus': {
    audioUrl: `${EVERYAYAH_BASE}/021087.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (QS. Al-Anbiya’: 87)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'quran-musa-kelapangan': {
    audioUrl: `${EVERYAYAH_BASE}/020025.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (QS. Thaha: 25-28)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'doa-quran-kelapangan-musa': {
    audioUrl: `${EVERYAYAH_BASE}/020025.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (QS. Thaha: 25-28)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'quran-ilmu': {
    audioUrl: `${EVERYAYAH_BASE}/020114.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (QS. Thaha: 114)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'doa-quran-ilmu': {
    audioUrl: `${EVERYAYAH_BASE}/020114.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (QS. Thaha: 114)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'quran-khusnul-khatimah': {
    audioUrl: `${EVERYAYAH_BASE}/003193.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (QS. Ali ‘Imran: 193)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'doa-quran-husnul-khatimah': {
    audioUrl: `${EVERYAYAH_BASE}/003193.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (QS. Ali ‘Imran: 193)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'quran-syukur-nikmat': {
    audioUrl: `${EVERYAYAH_BASE}/027019.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (QS. An-Naml: 19)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'doa-quran-syukur-ibrahim': {
    audioUrl: `${EVERYAYAH_BASE}/014040.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (QS. Ibrahim: 40-41)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'quran-ashabul-kahfi': {
    audioUrl: `${EVERYAYAH_BASE}/018010.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (QS. Al-Kahfi: 10)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'doa-quran-kemudahan-kahfi': {
    audioUrl: `${EVERYAYAH_BASE}/018010.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (QS. Al-Kahfi: 10)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'doa-quran-kesabaran': {
    audioUrl: `${EVERYAYAH_BASE}/002250.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (QS. Al-Baqarah: 250)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'doa-quran-terhindar-zalim': {
    audioUrl: `${EVERYAYAH_BASE}/023094.mp3`,
    reciterName: 'Syekh Mishary Rashid Alafasy (QS. Al-Mu’minun: 94)',
    type: 'quran_everyayah',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },

  // === DOA HADITS SHAHIH & DOA SEHARI-HARI ===
  'hadist-bangun-tidur': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/1hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Doa Bangun Tidur)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'doa-bangun-tidur': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/1hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Doa Bangun Tidur)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'hadist-sebelum-tidur': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/98hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Doa Mau Tidur)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'doa-mau-tidur': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/98hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Doa Mau Tidur)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'hadist-masuk-masjid': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/20hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Doa Masuk Masjid)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'doa-masuk-masjid': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/20hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Doa Masuk Masjid)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'hadist-keluar-masjid': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/21hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Doa Keluar Masjid)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'doa-keluar-masjid': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/21hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Doa Keluar Masjid)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'hadist-keluar-rumah': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/16hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Bismillahi tawakkaltu ‘alallah)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'doa-keluar-rumah': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/16hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Bismillahi tawakkaltu ‘alallah)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'hadist-masuk-rumah': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/18hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Doa Masuk Rumah)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'doa-masuk-rumah': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/18hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Doa Masuk Rumah)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'hadist-sebelum-makan': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/181hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Doa Sebelum Makan)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'doa-makan': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/181hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Doa Sebelum Makan)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'hadist-safar': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/208hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Doa Safar / Perjalanan)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'doa-safar': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/208hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Doa Safar / Perjalanan)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'doa-hadist-bebas-hutang': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/137hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Doa Terbebas Hutang - Ali RA)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'doa-hadist-huda-tuqa': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/140hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Doa Petunjuk & Ketaqwaan - Muslim)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'doa-hadist-ketetapan-hati': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/141hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Doa Ketetapan Hati - Tirmidzi)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'doa-hadist-kafaratul-majelis': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/196hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Doa Kafaratul Majelis)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'doa-hadist-jenguk-sakit': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/147hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Doa Menjenguk Orang Sakit)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'hadist-menjenguk-orang-sakit': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/147hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Doa Menjenguk Orang Sakit)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'doa-hadist-kebaikan-urusan': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/142hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Doa Kebaikan Seluruh Urusan)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'doa-hadist-kesulitan': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/139hm.mp3`,
    reciterName: 'Tartil Tajwid Hisnul Muslim (Doa Memohon Kemudahan)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },

  // === DZIKIR BA'DA SHOLAT ===
  'bada-istighfar': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/66hm.mp3`,
    reciterName: 'Tartil Istighfar Ba’da Sholat (3x)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'dzikir-istighfar': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/66hm.mp3`,
    reciterName: 'Tartil Istighfar Ba’da Sholat (3x)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'bada-allahumma-antas-salam': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/66hm.mp3`,
    reciterName: 'Tartil Allahumma Antas Salam',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'dzikir-tahlil': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/67hm.mp3`,
    reciterName: 'Tartil Tahlil & Puji Ba’da Sholat',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
  'dzikir-tasbih': {
    audioUrl: `${HISNUL_MUSLIM_BASE}/69hm.mp3`,
    reciterName: 'Tartil Tasbih, Tahmid, Takbir (33x)',
    type: 'hadith_hisnul_muslim',
    ummiDetails: DEFAULT_UMMI_DETAIL,
  },
};

/**
 * Global audio singleton for authentic Ummi-standard Tajwid recitation playback.
 */
class RecitationAudioPlayer {
  private audio: HTMLAudioElement | null = null;
  private currentItemId: string | null = null;
  private playbackRate: number = 0.85; // Default: 0.85x (Tempo Tartil Metode Ummi)
  private repeatMode: 1 | 3 | 0 = 1; // 1x, 3x (Tikrar Ummi), or 0 (Loop)
  private currentRepeatCount: number = 1;
  private currentInfo: RecitationInfo | null = null;
  private stateListeners: Array<(state: PlayerState) => void> = [];
  private tickerId: number | null = null;
  private syncOffsetMs: number = 0; // Calibration offset in ms (-300 to +300ms)

  constructor() {
    // Restore preferred playback rate if saved
    try {
      const savedRate = localStorage.getItem('tarjih_ummi_rate');
      if (savedRate) {
        const rate = parseFloat(savedRate);
        if ([0.75, 0.85, 1.0].includes(rate)) {
          this.playbackRate = rate;
        }
      }
    } catch {
      // Ignore
    }

    // Restore saved audio sync calibration offset if present
    try {
      const savedOffset = localStorage.getItem('tarjih_audio_sync_offset_ms');
      if (savedOffset !== null) {
        const parsed = parseInt(savedOffset, 10);
        if (!isNaN(parsed) && parsed >= -1000 && parsed <= 1000) {
          this.syncOffsetMs = parsed;
        }
      }
    } catch {
      // Ignore
    }
  }

  public getSyncOffsetMs(): number {
    return this.syncOffsetMs;
  }

  public setSyncOffsetMs(offsetMs: number): void {
    const clamped = Math.max(-1000, Math.min(1000, Math.round(offsetMs)));
    this.syncOffsetMs = clamped;
    try {
      localStorage.setItem('tarjih_audio_sync_offset_ms', String(clamped));
    } catch {
      // Ignore
    }
    this.notify();
  }

  public subscribe(listener: (state: PlayerState) => void): () => void {
    this.stateListeners.push(listener);
    // Emit initial state
    listener(this.getState());
    return () => {
      this.stateListeners = this.stateListeners.filter((l) => l !== listener);
    };
  }

  public getState(): PlayerState {
    const isPlaying = !!(this.audio && !this.audio.paused && !this.audio.ended);
    const currentTime = this.audio ? this.audio.currentTime : 0;
    const duration = this.audio && !isNaN(this.audio.duration) ? this.audio.duration : 0;
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return {
      isPlaying,
      currentItemId: this.currentItemId,
      playbackRate: this.playbackRate,
      repeatMode: this.repeatMode,
      currentRepeatCount: this.currentRepeatCount,
      currentTime,
      duration,
      progressPercent,
      audioInfo: this.currentInfo,
      syncOffsetMs: this.syncOffsetMs,
    };
  }

  private notify() {
    const state = this.getState();
    this.stateListeners.forEach((l) => l(state));
  }

  private startTicker() {
    this.stopTicker();
    let lastReportedTime = -1;
    const tick = () => {
      if (this.audio && !this.audio.paused && !this.audio.ended) {
        const cur = this.audio.currentTime;
        // Update whenever audio advances by at least 25ms (approx 40 fps smooth resolution)
        if (Math.abs(cur - lastReportedTime) >= 0.025) {
          lastReportedTime = cur;
          this.notify();
        }
        this.tickerId = requestAnimationFrame(tick);
      } else {
        this.tickerId = null;
      }
    };
    this.tickerId = requestAnimationFrame(tick);
  }

  private stopTicker() {
    if (this.tickerId !== null) {
      cancelAnimationFrame(this.tickerId);
      this.tickerId = null;
    }
  }

  public getAudioInfo(itemId: string, surahRef?: string): RecitationInfo | null {
    const mappedId = itemId.replace(/^hpt-/, 'sholat-').replace(/^sholat-dzikir-/, 'dzikir-');
    if (AUDIO_ID_MAP[mappedId]) {
      return AUDIO_ID_MAP[mappedId];
    }
    if (AUDIO_ID_MAP[itemId]) {
      return AUDIO_ID_MAP[itemId];
    }

    // Try parsing surahRef (e.g. "QS. Al-Baqarah [2]: 201" or "QS. Thaha: 25")
    if (surahRef) {
      const match = surahRef.match(/(\d+)\s*[:\]]\s*(\d+)/);
      if (match) {
        const surah = String(match[1]).padStart(3, '0');
        const ayah = String(match[2]).padStart(3, '0');
        return {
          audioUrl: `${EVERYAYAH_BASE}/${surah}${ayah}.mp3`,
          reciterName: `Syekh Mishary Rashid Alafasy (${surahRef})`,
          type: 'quran_everyayah',
          ummiDetails: {
            makhrajNotes: 'Tartil ayat Al-Qur’an sesuai kaidah tajwid.',
            madGuide: 'Mad Thabi’i 2 harakat konsisten.',
            ghunnahGuide: 'Ghunnah 2 harakat berirama.',
            tempoNotes: 'Metode Ummi: Murottal bersanad tempo teratur.',
          },
        };
      }
    }

    // Fallback: Ayat Kursi or general tartil recitation
    return {
      audioUrl: `${EVERYAYAH_BASE}/002255.mp3`,
      reciterName: 'Syekh Mishary Rashid Alafasy (Tartil Tajwid Murottal)',
      type: 'quran_everyayah',
      ummiDetails: DEFAULT_UMMI_DETAIL,
    };
  }

  public async play(itemId: string, surahRef?: string): Promise<boolean> {
    // If clicking the same item that's already playing, pause it
    if (this.audio && this.currentItemId === itemId && !this.audio.paused) {
      this.pause();
      return false;
    }

    // If it's paused on the same item, resume
    if (this.audio && this.currentItemId === itemId && this.audio.paused) {
      try {
        await this.audio.play();
        this.startTicker();
        this.notify();
        return true;
      } catch (err) {
        console.warn('Resume error:', err);
      }
    }

    // Stop current track cleanly
    this.stopInternal();

    const info = this.getAudioInfo(itemId, surahRef);
    if (!info) {
      return false;
    }

    try {
      const audio = new Audio(info.audioUrl);
      audio.playbackRate = this.playbackRate;
      this.audio = audio;
      this.currentItemId = itemId;
      this.currentInfo = info;
      this.currentRepeatCount = 1;

      // Handle time updates as auxiliary event
      audio.ontimeupdate = () => {
        this.notify();
      };

      // Handle track completion and repetition (Tikrar Metode Ummi)
      audio.onended = () => {
        if (this.repeatMode === 0) {
          // Infinite loop
          this.currentRepeatCount += 1;
          audio.currentTime = 0;
          audio.play().then(() => this.startTicker()).catch(console.warn);
          this.notify();
        } else if (this.repeatMode === 3 && this.currentRepeatCount < 3) {
          // Repeat 3x (Standar Tikrar Ummi)
          this.currentRepeatCount += 1;
          audio.currentTime = 0;
          audio.play().then(() => this.startTicker()).catch(console.warn);
          this.notify();
        } else {
          // Completed all repetitions
          this.stop();
        }
      };

      audio.onerror = () => {
        console.warn('Audio error loading:', itemId, info.audioUrl);
        this.stop();
      };

      await audio.play();
      this.startTicker();
      this.notify();
      return true;
    } catch (err) {
      console.warn('Playback error:', err);
      this.stop();
      return false;
    }
  }

  public pause(): void {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
      this.stopTicker();
      this.notify();
    }
  }

  public resume(): void {
    if (this.audio && this.audio.paused) {
      this.audio.play().then(() => {
        this.startTicker();
        this.notify();
      }).catch(console.warn);
    }
  }

  public setPlaybackRate(rate: number): void {
    this.playbackRate = rate;
    try {
      localStorage.setItem('tarjih_ummi_rate', String(rate));
    } catch {
      // Ignore
    }
    if (this.audio) {
      this.audio.playbackRate = rate;
    }
    this.notify();
  }

  public setRepeatMode(mode: 1 | 3 | 0): void {
    this.repeatMode = mode;
    this.notify();
  }

  public seek(percentage: number): void {
    if (this.audio && !isNaN(this.audio.duration)) {
      const targetTime = (percentage / 100) * this.audio.duration;
      this.audio.currentTime = targetTime;
      this.notify();
    }
  }

  private stopInternal(): void {
    this.stopTicker();
    if (this.audio) {
      this.audio.pause();
      this.audio.ontimeupdate = null;
      this.audio.onended = null;
      this.audio.onerror = null;
      this.audio.currentTime = 0;
      this.audio = null;
    }
  }

  public stop(): void {
    this.stopInternal();
    this.currentItemId = null;
    this.currentInfo = null;
    this.currentRepeatCount = 1;
    this.notify();
  }

  public getCurrentPlayingId(): string | null {
    return this.currentItemId;
  }
}

export const recitationPlayer = new RecitationAudioPlayer();
