import { QuranAyah, QuranSurah } from '../types';

export const SURAH_LIST: QuranSurah[] = [
  { number: 1, name: 'الفاتحة', englishName: 'Al-Fatihah', englishNameTranslation: 'Pembukaan', numberOfAyahs: 7, revelationType: 'Meccan' },
  { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', englishNameTranslation: 'Sapi Betina', numberOfAyahs: 286, revelationType: 'Medinan' },
  { number: 3, name: 'آل عمران', englishName: 'Ali \'Imran', englishNameTranslation: 'Keluarga Imran', numberOfAyahs: 200, revelationType: 'Medinan' },
  { number: 4, name: 'النساء', englishName: 'An-Nisa\'', englishNameTranslation: 'Wanita', numberOfAyahs: 176, revelationType: 'Medinan' },
  { number: 5, name: 'المائدة', englishName: 'Al-Ma\'idah', englishNameTranslation: 'Hidangan', numberOfAyahs: 120, revelationType: 'Medinan' },
  { number: 6, name: 'الأنعام', englishName: 'Al-An\'am', englishNameTranslation: 'Binatang Ternak', numberOfAyahs: 165, revelationType: 'Meccan' },
  { number: 7, name: 'الأعراف', englishName: 'Al-A\'raf', englishNameTranslation: 'Tempat Tertinggi', numberOfAyahs: 206, revelationType: 'Meccan' },
  { number: 8, name: 'الأنفال', englishName: 'Al-Anfal', englishNameTranslation: 'Rampasan Perang', numberOfAyahs: 75, revelationType: 'Medinan' },
  { number: 9, name: 'التوبة', englishName: 'At-Taubah', englishNameTranslation: 'Pengampunan', numberOfAyahs: 129, revelationType: 'Medinan' },
  { number: 10, name: 'يونس', englishName: 'Yunus', englishNameTranslation: 'Nabi Yunus', numberOfAyahs: 109, revelationType: 'Meccan' },
  { number: 11, name: 'هود', englishName: 'Hud', englishNameTranslation: 'Nabi Hud', numberOfAyahs: 123, revelationType: 'Meccan' },
  { number: 12, name: 'يوسف', englishName: 'Yusuf', englishNameTranslation: 'Nabi Yusuf', numberOfAyahs: 111, revelationType: 'Meccan' },
  { number: 13, name: 'الرعد', englishName: 'Ar-Ra\'d', englishNameTranslation: 'Guruh', numberOfAyahs: 43, revelationType: 'Medinan' },
  { number: 14, name: 'إبراهيم', englishName: 'Ibrahim', englishNameTranslation: 'Nabi Ibrahim', numberOfAyahs: 52, revelationType: 'Meccan' },
  { number: 15, name: 'الحجر', englishName: 'Al-Hijr', englishNameTranslation: 'Gunung Al Hijr', numberOfAyahs: 99, revelationType: 'Meccan' },
  { number: 16, name: 'النحل', englishName: 'An-Nahl', englishNameTranslation: 'Lebah', numberOfAyahs: 128, revelationType: 'Meccan' },
  { number: 17, name: 'الإسراء', englishName: 'Al-Isra\'', englishNameTranslation: 'Memperjalankan Malam Hari', numberOfAyahs: 111, revelationType: 'Meccan' },
  { number: 18, name: 'الكهف', englishName: 'Al-Kahf', englishNameTranslation: 'Gua', numberOfAyahs: 110, revelationType: 'Meccan' },
  { number: 19, name: 'مريم', englishName: 'Maryam', englishNameTranslation: 'Siti Maryam', numberOfAyahs: 98, revelationType: 'Meccan' },
  { number: 20, name: 'طه', englishName: 'Thaha', englishNameTranslation: 'Tha Ha', numberOfAyahs: 135, revelationType: 'Meccan' },
  { number: 21, name: 'الأنبياء', englishName: 'Al-Anbiya\'', englishNameTranslation: 'Para Nabi', numberOfAyahs: 112, revelationType: 'Meccan' },
  { number: 22, name: 'الحج', englishName: 'Al-Hajj', englishNameTranslation: 'Haji', numberOfAyahs: 78, revelationType: 'Medinan' },
  { number: 23, name: 'المؤمنون', englishName: 'Al-Mu\'minun', englishNameTranslation: 'Orang-orang Mukmin', numberOfAyahs: 118, revelationType: 'Meccan' },
  { number: 24, name: 'النور', englishName: 'An-Nur', englishNameTranslation: 'Cahaya', numberOfAyahs: 64, revelationType: 'Medinan' },
  { number: 25, name: 'الفرقان', englishName: 'Al-Furqan', englishNameTranslation: 'Pembeda', numberOfAyahs: 77, revelationType: 'Meccan' },
  { number: 26, name: 'الشعراء', englishName: 'Asy-Syu\'ara\'', englishNameTranslation: 'Para Penyair', numberOfAyahs: 227, revelationType: 'Meccan' },
  { number: 27, name: 'النمل', englishName: 'An-Naml', englishNameTranslation: 'Semut', numberOfAyahs: 93, revelationType: 'Meccan' },
  { number: 28, name: 'القصص', englishName: 'Al-Qashash', englishNameTranslation: 'Kisah-kisah', numberOfAyahs: 88, revelationType: 'Meccan' },
  { number: 29, name: 'العنكبوت', englishName: 'Al-\'Ankabut', englishNameTranslation: 'Laba-laba', numberOfAyahs: 69, revelationType: 'Meccan' },
  { number: 30, name: 'الروم', englishName: 'Ar-Rum', englishNameTranslation: 'Bangsa Romawi', numberOfAyahs: 60, revelationType: 'Meccan' },
  { number: 31, name: 'لقمان', englishName: 'Luqman', englishNameTranslation: 'Keluarga Luqman', numberOfAyahs: 34, revelationType: 'Meccan' },
  { number: 32, name: 'السجدة', englishName: 'As-Sajdah', englishNameTranslation: 'Sujud', numberOfAyahs: 30, revelationType: 'Meccan' },
  { number: 33, name: 'الأحزاب', englishName: 'Al-Ahzab', englishNameTranslation: 'Golongan yang Bersekutu', numberOfAyahs: 73, revelationType: 'Medinan' },
  { number: 34, name: 'سبأ', englishName: 'Saba\'', englishNameTranslation: 'Kaum Saba\'', numberOfAyahs: 54, revelationType: 'Meccan' },
  { number: 35, name: 'فاطر', englishName: 'Fathir', englishNameTranslation: 'Pencipta', numberOfAyahs: 45, revelationType: 'Meccan' },
  { number: 36, name: 'يس', englishName: 'Yasin', englishNameTranslation: 'Ya Sin', numberOfAyahs: 83, revelationType: 'Meccan' },
  { number: 37, name: 'الصافات', englishName: 'Ash-Shaffat', englishNameTranslation: 'Barisan-barisan', numberOfAyahs: 182, revelationType: 'Meccan' },
  { number: 38, name: 'ص', englishName: 'Shad', englishNameTranslation: 'Shad', numberOfAyahs: 88, revelationType: 'Meccan' },
  { number: 39, name: 'الزمر', englishName: 'Az-Zumar', englishNameTranslation: 'Rombongan-rombongan', numberOfAyahs: 75, revelationType: 'Meccan' },
  { number: 40, name: 'غافر', englishName: 'Ghafir', englishNameTranslation: 'Yang Mengampuni', numberOfAyahs: 85, revelationType: 'Meccan' },
  { number: 41, name: 'فصلت', englishName: 'Fushshilat', englishNameTranslation: 'Yang Dijelaskan', numberOfAyahs: 54, revelationType: 'Meccan' },
  { number: 42, name: 'الشورى', englishName: 'Asy-Syura', englishNameTranslation: 'Musyawarah', numberOfAyahs: 53, revelationType: 'Meccan' },
  { number: 43, name: 'الزخرف', englishName: 'Az-Zukhruf', englishNameTranslation: 'Perhiasan', numberOfAyahs: 89, revelationType: 'Meccan' },
  { number: 44, name: 'الدخان', englishName: 'Ad-Dukhan', englishNameTranslation: 'Kabut', numberOfAyahs: 59, revelationType: 'Meccan' },
  { number: 45, name: 'الجاثية', englishName: 'Al-Jatsiyah', englishNameTranslation: 'Yang Berlutut', numberOfAyahs: 37, revelationType: 'Meccan' },
  { number: 46, name: 'الأحقاف', englishName: 'Al-Ahqaf', englishNameTranslation: 'Bukit-bukit Pasir', numberOfAyahs: 35, revelationType: 'Meccan' },
  { number: 47, name: 'محمد', englishName: 'Muhammad', englishNameTranslation: 'Nabi Muhammad', numberOfAyahs: 38, revelationType: 'Medinan' },
  { number: 48, name: 'الفتح', englishName: 'Al-Fath', englishNameTranslation: 'Kemenangan', numberOfAyahs: 29, revelationType: 'Medinan' },
  { number: 49, name: 'الحجرات', englishName: 'Al-Hujurat', englishNameTranslation: 'Kamar-kamar', numberOfAyahs: 18, revelationType: 'Medinan' },
  { number: 50, name: 'ق', englishName: 'Qaf', englishNameTranslation: 'Qaf', numberOfAyahs: 45, revelationType: 'Meccan' },
  { number: 51, name: 'الذاريات', englishName: 'Adz-Dzariyat', englishNameTranslation: 'Angin yang Menerbangkan', numberOfAyahs: 60, revelationType: 'Meccan' },
  { number: 52, name: 'الطور', englishName: 'Ath-Thur', englishNameTranslation: 'Bukit Tursina', numberOfAyahs: 49, revelationType: 'Meccan' },
  { number: 53, name: 'النجم', englishName: 'An-Najm', englishNameTranslation: 'Bintang', numberOfAyahs: 62, revelationType: 'Meccan' },
  { number: 54, name: 'القمر', englishName: 'Al-Qamar', englishNameTranslation: 'Bulan', numberOfAyahs: 55, revelationType: 'Meccan' },
  { number: 55, name: 'الرحمن', englishName: 'Ar-Rahman', englishNameTranslation: 'Yang Maha Pengasih', numberOfAyahs: 78, revelationType: 'Medinan' },
  { number: 56, name: 'الواقعة', englishName: 'Al-Waqi\'ah', englishNameTranslation: 'Hari Kiamat', numberOfAyahs: 96, revelationType: 'Meccan' },
  { number: 57, name: 'الحديد', englishName: 'Al-Hadid', englishNameTranslation: 'Besi', numberOfAyahs: 29, revelationType: 'Medinan' },
  { number: 58, name: 'المجادلة', englishName: 'Al-Mujadilah', englishNameTranslation: 'Gugatan', numberOfAyahs: 22, revelationType: 'Medinan' },
  { number: 59, name: 'الحشر', englishName: 'Al-Hasyr', englishNameTranslation: 'Pengusiran', numberOfAyahs: 24, revelationType: 'Medinan' },
  { number: 60, name: 'الممتحنة', englishName: 'Al-Mumtahanah', englishNameTranslation: 'Wanita yang Diuji', numberOfAyahs: 13, revelationType: 'Medinan' },
  { number: 61, name: 'الصف', englishName: 'Ash-Shaff', englishNameTranslation: 'Barisan', numberOfAyahs: 14, revelationType: 'Medinan' },
  { number: 62, name: 'الجمعة', englishName: 'Al-Jumu\'ah', englishNameTranslation: 'Hari Jum\'at', numberOfAyahs: 11, revelationType: 'Medinan' },
  { number: 63, name: 'المنافقون', englishName: 'Al-Munafiqun', englishNameTranslation: 'Orang-orang Munafik', numberOfAyahs: 11, revelationType: 'Medinan' },
  { number: 64, name: 'التغابن', englishName: 'At-Taghabun', englishNameTranslation: 'Hari Dinampakkan Kesalahan', numberOfAyahs: 18, revelationType: 'Medinan' },
  { number: 65, name: 'الطلاق', englishName: 'Ath-Thalaq', englishNameTranslation: 'Perceraian', numberOfAyahs: 12, revelationType: 'Medinan' },
  { number: 66, name: 'التحريم', englishName: 'At-Tahrim', englishNameTranslation: 'Pengharaman', numberOfAyahs: 12, revelationType: 'Medinan' },
  { number: 67, name: 'الملك', englishName: 'Al-Mulk', englishNameTranslation: 'Kerajaan', numberOfAyahs: 30, revelationType: 'Meccan' },
  { number: 68, name: 'القلم', englishName: 'Al-Qalam', englishNameTranslation: 'Pena', numberOfAyahs: 52, revelationType: 'Meccan' },
  { number: 69, name: 'الحاقة', englishName: 'Al-Haqqah', englishNameTranslation: 'Hari Kiamat yang Pasti', numberOfAyahs: 52, revelationType: 'Meccan' },
  { number: 70, name: 'المعارج', englishName: 'Al-Ma\'arij', englishNameTranslation: 'Tempat Naik', numberOfAyahs: 44, revelationType: 'Meccan' },
  { number: 71, name: 'نوح', englishName: 'Nuh', englishNameTranslation: 'Nabi Nuh', numberOfAyahs: 28, revelationType: 'Meccan' },
  { number: 72, name: 'الجن', englishName: 'Al-Jinn', englishNameTranslation: 'Jin', numberOfAyahs: 28, revelationType: 'Meccan' },
  { number: 73, name: 'المزمل', englishName: 'Al-Muzzammil', englishNameTranslation: 'Orang yang Berselimut', numberOfAyahs: 20, revelationType: 'Meccan' },
  { number: 74, name: 'المدثر', englishName: 'Al-Muddatstsir', englishNameTranslation: 'Orang yang Berkemul', numberOfAyahs: 56, revelationType: 'Meccan' },
  { number: 75, name: 'القيامة', englishName: 'Al-Qiyamah', englishNameTranslation: 'Hari Kiamat', numberOfAyahs: 40, revelationType: 'Meccan' },
  { number: 76, name: 'الإنسان', englishName: 'Al-Insan', englishNameTranslation: 'Manusia', numberOfAyahs: 31, revelationType: 'Medinan' },
  { number: 77, name: 'المرسلات', englishName: 'Al-Mursalat', englishNameTranslation: 'Malaikat yang Diutus', numberOfAyahs: 50, revelationType: 'Meccan' },
  { number: 78, name: 'النبأ', englishName: 'An-Naba\'', englishNameTranslation: 'Berita Besar', numberOfAyahs: 40, revelationType: 'Meccan' },
  { number: 79, name: 'النازعات', englishName: 'An-Nazi\'at', englishNameTranslation: 'Malaikat Pencabut', numberOfAyahs: 46, revelationType: 'Meccan' },
  { number: 80, name: 'عبس', englishName: '\'Abasa', englishNameTranslation: 'Ia Bermuka Masam', numberOfAyahs: 42, revelationType: 'Meccan' },
  { number: 81, name: 'التكوير', englishName: 'At-Takwir', englishNameTranslation: 'Menggulung', numberOfAyahs: 29, revelationType: 'Meccan' },
  { number: 82, name: 'الانفطار', englishName: 'Al-Infithar', englishNameTranslation: 'Terbelah', numberOfAyahs: 19, revelationType: 'Meccan' },
  { number: 83, name: 'المطففين', englishName: 'Al-Muthaffifin', englishNameTranslation: 'Orang-orang Curang', numberOfAyahs: 36, revelationType: 'Meccan' },
  { number: 84, name: 'الانشقاق', englishName: 'Al-Insyiqaq', englishNameTranslation: 'Terbelah', numberOfAyahs: 25, revelationType: 'Meccan' },
  { number: 85, name: 'البروج', englishName: 'Al-Buruj', englishNameTranslation: 'Gugusan Bintang', numberOfAyahs: 22, revelationType: 'Meccan' },
  { number: 86, name: 'الطارق', englishName: 'Ath-Thariq', englishNameTranslation: 'Yang Datang di Malam Hari', numberOfAyahs: 17, revelationType: 'Meccan' },
  { number: 87, name: 'الأعلى', englishName: 'Al-A\'la', englishNameTranslation: 'Yang Maha Tinggi', numberOfAyahs: 19, revelationType: 'Meccan' },
  { number: 88, name: 'الغاشية', englishName: 'Al-Ghasyiyah', englishNameTranslation: 'Hari Pembalasan', numberOfAyahs: 26, revelationType: 'Meccan' },
  { number: 89, name: 'الفجر', englishName: 'Al-Fajr', englishNameTranslation: 'Fajar', numberOfAyahs: 30, revelationType: 'Meccan' },
  { number: 90, name: 'البلد', englishName: 'Al-Balad', englishNameTranslation: 'Negeri', numberOfAyahs: 20, revelationType: 'Meccan' },
  { number: 91, name: 'الشمس', englishName: 'Asy-Syams', englishNameTranslation: 'Matahari', numberOfAyahs: 15, revelationType: 'Meccan' },
  { number: 92, name: 'الليل', englishName: 'Al-Lail', englishNameTranslation: 'Malam', numberOfAyahs: 21, revelationType: 'Meccan' },
  { number: 93, name: 'الضحى', englishName: 'Ad-Dhuha', englishNameTranslation: 'Waktu Dhuha', numberOfAyahs: 11, revelationType: 'Meccan' },
  { number: 94, name: 'الشرح', englishName: 'Al-Insyirah', englishNameTranslation: 'Kelapangan Dada', numberOfAyahs: 8, revelationType: 'Meccan' },
  { number: 95, name: 'التين', englishName: 'At-Tin', englishNameTranslation: 'Buah Tin', numberOfAyahs: 8, revelationType: 'Meccan' },
  { number: 96, name: 'العلق', englishName: 'Al-\'Alaq', englishNameTranslation: 'Segumpal Darah', numberOfAyahs: 19, revelationType: 'Meccan' },
  { number: 97, name: 'القدر', englishName: 'Al-Qadr', englishNameTranslation: 'Kemuliaan', numberOfAyahs: 5, revelationType: 'Meccan' },
  { number: 98, name: 'البينة', englishName: 'Al-Bayyinah', englishNameTranslation: 'Bukti Nyata', numberOfAyahs: 8, revelationType: 'Medinan' },
  { number: 99, name: 'الزلزلة', englishName: 'Az-Zalzalah', englishNameTranslation: 'Kegoncangan', numberOfAyahs: 8, revelationType: 'Medinan' },
  { number: 100, name: 'العاديات', englishName: 'Al-\'Adiyat', englishNameTranslation: 'Kuda Perang', numberOfAyahs: 11, revelationType: 'Meccan' },
  { number: 101, name: 'القارعة', englishName: 'Al-Qari\'ah', englishNameTranslation: 'Hari Kiamat', numberOfAyahs: 11, revelationType: 'Meccan' },
  { number: 102, name: 'التكاثر', englishName: 'At-Takatsur', englishNameTranslation: 'Bermegah-megahan', numberOfAyahs: 8, revelationType: 'Meccan' },
  { number: 103, name: 'العصر', englishName: 'Al-\'Ashr', englishNameTranslation: 'Masa', numberOfAyahs: 3, revelationType: 'Meccan' },
  { number: 104, name: 'الهمزة', englishName: 'Al-Humazah', englishNameTranslation: 'Pengumpat', numberOfAyahs: 9, revelationType: 'Meccan' },
  { number: 105, name: 'الفيل', englishName: 'Al-Fil', englishNameTranslation: 'Gajah', numberOfAyahs: 5, revelationType: 'Meccan' },
  { number: 106, name: 'قريش', englishName: 'Quraisy', englishNameTranslation: 'Suku Quraisy', numberOfAyahs: 4, revelationType: 'Meccan' },
  { number: 107, name: 'الماعون', englishName: 'Al-Ma\'un', englishNameTranslation: 'Barang-barang yang Berguna', numberOfAyahs: 7, revelationType: 'Meccan' },
  { number: 108, name: 'الكوثر', englishName: 'Al-Kautsar', englishNameTranslation: 'Nikmat yang Berlimpah', numberOfAyahs: 3, revelationType: 'Meccan' },
  { number: 109, name: 'الكافرون', englishName: 'Al-Kafirun', englishNameTranslation: 'Orang-orang Kafir', numberOfAyahs: 6, revelationType: 'Meccan' },
  { number: 110, name: 'النصر', englishName: 'An-Nashr', englishNameTranslation: 'Pertolongan', numberOfAyahs: 3, revelationType: 'Medinan' },
  { number: 111, name: 'المسد', englishName: 'Al-Lahab', englishNameTranslation: 'Gejolak Api', numberOfAyahs: 5, revelationType: 'Meccan' },
  { number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas', englishNameTranslation: 'Memurnikan Keesaan Allah', numberOfAyahs: 4, revelationType: 'Meccan' },
  { number: 113, name: 'الفلق', englishName: 'Al-Falaq', englishNameTranslation: 'Waktu Subuh', numberOfAyahs: 5, revelationType: 'Meccan' },
  { number: 114, name: 'الناس', englishName: 'An-Nas', englishNameTranslation: 'Umat Manusia', numberOfAyahs: 6, revelationType: 'Meccan' },
];

// Curated built-in offline bundle for standard Indonesia mushaf reading
export const LOCAL_SURAHS_MAP: Record<number, QuranAyah[]> = {
  // Surah Al-Fatihah
  1: [
    { number: 1, numberInSurah: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', translation: 'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.', transliteration: 'Bismillaahir-rahmaanir-rahiim' },
    { number: 2, numberInSurah: 2, text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', translation: 'Segala puji bagi Allah, Tuhan semesta alam,', transliteration: 'Al-hamdu lillaahi rabbil-\'aalamiin' },
    { number: 3, numberInSurah: 3, text: 'الرَّحْمَٰنِ الرَّحِيمِ', translation: 'Maha Pengasih lagi Maha Penyayang,', transliteration: 'Ar-rahmaanir-rahiim' },
    { number: 4, numberInSurah: 4, text: 'مَالِكِ يَوْمِ الدِّينِ', translation: 'Pemilik hari pembalasan.', transliteration: 'Maaliki yaumid-diin' },
    { number: 5, numberInSurah: 5, text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', translation: 'Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan.', transliteration: 'Iyyaaka na\'budu wa iyyaaka nasta\'iin' },
    { number: 6, numberInSurah: 6, text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', translation: 'Tunjukilah kami jalan yang lurus,', transliteration: 'Ihdinash-shiraathal-mustaqiim' },
    { number: 7, numberInSurah: 7, text: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', translation: '(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.', transliteration: 'Shiraathalladziina an\'amta \'alaihim ghairil-maghdhuubi \'alaihim waladh-dhaalliin' },
  ],

  // Surah Al-Ikhlas
  112: [
    { number: 1, numberInSurah: 1, text: 'قُلْ هُوَ اللَّهُ أَحَدٌ', translation: 'Katakanlah (Muhammad), "Dialah Allah, Yang Maha Esa."', transliteration: 'Qul huwallaahu ahad' },
    { number: 2, numberInSurah: 2, text: 'اللَّهُ الصَّمَدُ', translation: 'Allah tempat meminta segala sesuatu.', transliteration: 'Allaahush-shamad' },
    { number: 3, numberInSurah: 3, text: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', translation: '(Allah) tidak beranak dan tidak pula diperanakkan,', transliteration: 'Lam yalid wa lam yuulad' },
    { number: 4, numberInSurah: 4, text: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', translation: 'dan tidak ada sesuatu yang setara dengan Dia.', transliteration: 'Wa lam yakul lahuu kufuwan ahad' },
  ],

  // Surah Al-Falaq
  113: [
    { number: 1, numberInSurah: 1, text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', translation: 'Katakanlah, "Aku berlindung kepada Tuhan yang menguasai subuh (fajar),', transliteration: 'Qul a\'uudzu birabbil-falaq' },
    { number: 2, numberInSurah: 2, text: 'مِن شَرِّ مَا خَلَقَ', translation: 'dari kejahatan (makhluk yang) Dia ciptakan,', transliteration: 'Min syarri maa khalaq' },
    { number: 3, numberInSurah: 3, text: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', translation: 'dan dari kejahatan malam apabila telah gelap gulita,', transliteration: 'Wa min syarri ghaasiqin idzaa waqab' },
    { number: 4, numberInSurah: 4, text: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', translation: 'dan dari kejahatan (perempuan-perempuan) penyihir yang meniup pada buhul-buhul (talinya),', transliteration: 'Wa min syarrin-naffaatsaati fil-\'uqad' },
    { number: 5, numberInSurah: 5, text: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', translation: 'dan dari kejahatan orang yang dengki apabila dia dengki."', transliteration: 'Wa min syarri haasidin idzaa hasad' },
  ],

  // Surah An-Nas
  114: [
    { number: 1, numberInSurah: 1, text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', translation: 'Katakanlah, "Aku berlindung kepada Tuhannya manusia,', transliteration: 'Qul a\'uudzu birabbin-naas' },
    { number: 2, numberInSurah: 2, text: 'مَلِكِ النَّاسِ', translation: 'Raja manusia,', transliteration: 'Malikin-naas' },
    { number: 3, numberInSurah: 3, text: 'إِلَٰهِ النَّاسِ', translation: 'Sembahan manusia,', transliteration: 'Ilaahin-naas' },
    { number: 4, numberInSurah: 4, text: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', translation: 'dari kejahatan (bisikan) setan yang bersembunyi,', transliteration: 'Min syarril-waswaasil-khannaas' },
    { number: 5, numberInSurah: 5, text: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', translation: 'yang membisikkan (kejahatan) ke dalam dada manusia,', transliteration: 'Alladzii yuwaswisu fii shuduurin-naas' },
    { number: 6, numberInSurah: 6, text: 'مِنَ الْجِنَّةِ وَالنَّاسِ', translation: 'dari (golongan) jin dan manusia."', transliteration: 'Minal-jinnati wan-naas' },
  ],

  // Surah Al-Kautsar
  108: [
    { number: 1, numberInSurah: 1, text: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', translation: 'Sungguh, Kami telah memberimu (Muhammad) nikmat yang banyak.', transliteration: 'Innaa a\'thainaakal-kautsar' },
    { number: 2, numberInSurah: 2, text: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ', translation: 'Maka laksanakanlah sholat karena Tuhanmu, dan berkurbanlah.', transliteration: 'Fashalli lirabbika wanhar' },
    { number: 3, numberInSurah: 3, text: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ', translation: 'Sungguh, orang-orang yang membencimu dialah yang terputus (dari rahmat Allah).', transliteration: 'Inna syaani\'aka huwal-abtar' },
  ],

  // Surah Al-Asr
  103: [
    { number: 1, numberInSurah: 1, text: 'وَالْعَصْرِ', translation: 'Demi masa,', transliteration: 'Wal-\'ashr' },
    { number: 2, numberInSurah: 2, text: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ', translation: 'sungguh, manusia berada dalam kerugian,', transliteration: 'Innal-insaana lafii khusr' },
    { number: 3, numberInSurah: 3, text: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ', translation: 'kecuali orang-orang yang beriman dan mengerjakan kebajikan serta saling menasihati untuk kebenaran dan saling menasihati untuk kesabaran.', transliteration: 'Illal-ladziina aamanuu wa \'amilush-shaalihaati wa tawaashau bil-haqqi wa tawaashau bish-shabr' },
  ],

  // Surah Al-Mulk (first 5 ayahs sample and offline)
  67: [
    { number: 1, numberInSurah: 1, text: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', translation: 'Maha Berkah Allah yang di tangan-Nyalah segala kerajaan, dan Dia Maha Kuasa atas segala sesuatu.', transliteration: 'Tabaarakal-ladzii biyadihil-mulku wa huwa \'alaa kulli syai-in qadiir' },
    { number: 2, numberInSurah: 2, text: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ', translation: 'Yang menciptakan mati dan hidup, untuk menguji kamu, siapa di antara kamu yang lebih baik amalnya. Dan Dia Maha Perkasa, Maha Pengampun.', transliteration: 'Alladzii khalaqal-mauta wal-hayaata liyabluwakum ayyukum ahsanu \'amalaa, wa huwal-\'aziizul-ghafuur' },
    { number: 3, numberInSurah: 3, text: 'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ', translation: 'Yang menciptakan tujuh langit berlapis-lapis. Tidak akan kamu lihat sesuatu yang tidak seimbang pada ciptaan Tuhan Yang Maha Pengasih. Maka lihatlah sekali lagi, adakah kamu lihat sesuatu yang cacat?', transliteration: 'Alladzii khalaqa sab\'a samaawaatin thibaaqaa, maa taraa fii khalqir-rahmaani min tafaawut, farji\'il-bashara hal taraa min futhuur' },
    { number: 4, numberInSurah: 4, text: 'ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ', translation: 'Kemudian ulangi pandanganmu dua kali lagi, niscaya pandanganmu akan kembali kepadamu tanpa menemukan cacat dan pandanganmu itu dalam keadaan letih.', transliteration: 'Tsummarji\'il-bashara karrataini yanqalib ilaikal-basharu khaasi-an wa huwa hasiir' },
    { number: 5, numberInSurah: 5, text: 'وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ', translation: 'Dan sungguh, telah Kami hiasi langit yang dekat ini dengan bintang-bintang dan Kami jadikan bintang-bintang itu alat-alat pelempar setan, dan Kami sediakan bagi mereka azab neraka yang menyala-nyala.', transliteration: 'Wa laqad zayyannas-samaa-ad-dunyaa bimashaabiiha wa ja\'alnaahaa rujuumal-lisy-syayaathiini wa a\'tadnaa lahum \'adzaabas-sa\'iir' },
  ],
};

/**
 * Fetch verses dynamically from standard Indonesian API with local fallback
 */
export async function fetchSurahVerses(surahNumber: number): Promise<QuranAyah[]> {
  // If locally cached complete surah exists, check if user requests another
  try {
    const res = await fetch(`https://equran.id/api/v2/surat/${surahNumber}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.data && Array.isArray(data.data.ayat)) {
        return data.data.ayat.map((item: { nomorAyat: number; teksArab: string; teksIndonesia: string; teksLatin: string; audio: Record<string, string> }) => ({
          number: item.nomorAyat,
          numberInSurah: item.nomorAyat,
          text: item.teksArab,
          translation: item.teksIndonesia,
          transliteration: item.teksLatin,
          audioUrl: item.audio ? (item.audio['01'] || item.audio['05'] || Object.values(item.audio)[0]) : undefined,
        }));
      }
    }
  } catch (err) {
    console.warn(`Dynamic API fetch failed for Surah ${surahNumber}, trying secondary source...`, err);
  }

  // Secondary standard fallback: Al-Quran Cloud API (Uthmani + Indonesian translation)
  try {
    const res2 = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,id.indonesian`);
    if (res2.ok) {
      const json2 = await res2.json();
      if (json2 && json2.data && json2.data.length >= 2) {
        const arabicData = json2.data[0].ayahs;
        const indoData = json2.data[1].ayahs;
        return arabicData.map((ay: { numberInSurah: number; text: string }, idx: number) => ({
          number: ay.numberInSurah,
          numberInSurah: ay.numberInSurah,
          text: ay.text,
          translation: indoData[idx] ? indoData[idx].text : '',
          audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ay.numberInSurah}.mp3`,
        }));
      }
    }
  } catch (err2) {
    console.warn(`Secondary API fallback failed for Surah ${surahNumber}`, err2);
  }

  // If both networks fail or offline, return local bundle if available
  if (LOCAL_SURAHS_MAP[surahNumber]) {
    return LOCAL_SURAHS_MAP[surahNumber];
  }

  // Basic fallback
  return [
    {
      number: 1,
      numberInSurah: 1,
      text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      translation: 'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.',
      transliteration: 'Bismillaahir-rahmaanir-rahiim',
    },
  ];
}
