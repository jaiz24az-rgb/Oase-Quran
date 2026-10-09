import { QuranMappingItem, SurahFlowSection } from '../types';

export interface GrandOverviewTheme {
  title: string;
  surahRange: string;
  period: string;
  coreTheme: string;
  description: string;
  keySurahs: string[];
}

export const QURAN_GRAND_MAP_OVERVIEW: GrandOverviewTheme[] = [
  {
    title: 'Bagian I: Fondasi Risalah & Penataan Umat Berperadaban',
    surahRange: 'Surah 1 (Al-Fatihah) s/d 9 (At-Taubah)',
    period: 'Dominan Madaniyyah (Pasca-Hijrah)',
    coreTheme: 'Syariat, Hukum Publik, Kontrak Sosial, Piagam Umat & Penegakan Keadilan',
    description:
      'Dimulai dari doa inti petunjuk hidup (Al-Fatihah), disambut oleh panduan hukum terlengkap: akidah, ibadah, ekonomi tanpa riba, hukum keluarga, piagam perdamaian, hingga pertahanan dakwah.',
    keySurahs: ['Al-Fatihah', 'Al-Baqarah', "Ali 'Imran", 'An-Nisa', "Al-Ma'idah"],
  },
  {
    title: 'Bagian II: Penguatan Jiwa, Ujian Hidup & Keteladanan Para Rasul',
    surahRange: 'Surah 10 (Yunus) s/d 18 (Al-Kahf)',
    period: 'Dominan Makkiyyah (Fase Ujian Berat & Boikot Makkah)',
    coreTheme: 'Keteguhan Hati, Resiliensi Menghadapi Badai Kehidupan, & Hikmah Kisah Sejarah',
    description:
      'Membentangkan kisah-kisah perjuangan para nabi (Nuh, Hud, Shalih, Ibrahim, Yusuf, Musa) dan pemuda Al-Kahfi sebagai benteng tauhid melawan 4 fitnah terbesar: fitnah kekuasaan, harta, ilmu, dan agama.',
    keySurahs: ['Yunus', 'Hud', 'Yusuf', 'Ibrahim', 'Al-Kahf'],
  },
  {
    title: 'Bagian III: Spiritual, Keluarga, Tazkiyatun Nafs & Keajaiban Ciptaan',
    surahRange: 'Surah 19 (Maryam) s/d 35 (Fathir)',
    period: 'Kombinasi Makkiyyah & Madaniyyah Awal',
    coreTheme: 'Kemuliaan Ibadah, Kemurnian Akhlak, Adab Rumah Tangga, & Tadabbur Alam Semesta',
    description:
      'Mengajak manusia merenungi mukjizat penciptaan, adab interaksi sosial dan rumah tangga (An-Nur, Al-Furqan), serta keagungan rububiyyah Allah di seluruh penjuru langit dan bumi.',
    keySurahs: ['Maryam', 'Thaha', 'Al-Anbiya', 'An-Nur', 'Al-Furqan', 'Luqman'],
  },
  {
    title: 'Bagian IV: Pengukuhan Hati, Kepastian Akhirat & Dzikir Benteng Jiwa',
    surahRange: 'Surah 36 (Yasin) s/d 114 (An-Naas)',
    period: 'Dominan Makkiyyah & Penutup Madinah',
    coreTheme: 'Hari Kebangkitan, Hisab, Neraca Keadilan, Refleksi Diri, & Perlindungan Hakiki',
    description:
      'Surah-surah yang menggetarkan hati dengan ritme ayat padat, menyadarkan manusia akan fana-nya dunia, kepastian hisab akhirat, hingga ditutup dengan dua surat perlindungan pamungkas (Al-Mu’awwidzatain).',
    keySurahs: ['Yasin', 'Az-Zumar', 'Ar-Rahman', 'Al-Waqi’ah', 'Al-Mulk', 'Al-Ikhlas', 'An-Naas'],
  },
];

// Complete 114 Surahs mapping data with rich 5-pillar insights
export const QURAN_MAPPING_LIST: QuranMappingItem[] = [
  {
    surahNumber: 1,
    surahName: 'Al-Fatihah',
    arabicName: 'الفاتحة',
    meaning: 'Pembukaan (Ummul Kitab)',
    revelationType: 'Makkiyyah',
    numberOfAyahs: 7,
    chronologicalOrder: 5,
    juz: 'Juz 1',
    estimatedReadingMinutes: 5,
    pokokKandungan: {
      temaUtama: 'Intisari seluruh ajaran Al-Qur’an: Tauhid Rububiyyah, Uluhiyyah, Asma wa Sifat, Ibadah, dan Permohonan Hidayah.',
      konteksDanLatarBelakang: 'Diturunkan di Makkah pada awal masa kenabian sebagai mukadimah sempurna bagi kitab suci dan rukun wajib dalam setiap rakaat sholat.',
      urgensiMemahami: 'Merupakan induk Al-Qur’an (Ummul Qur’an) yang merangkum relasi kehambaan: memuji Allah, menyatakan ketergantungan mutlak, lalu memohon jalan lurus (ash-shirath al-mustaqim).',
    },
    pelajaranDanHikmah: [
      'Memulai segala urusan yang berharga dengan basmalah untuk mendatangkan berkah Allah.',
      'Keseimbangan antara rasa cinta (ar-Rahman), harap (ar-Rahim), dan takut (Maliki yaumid-din) dalam beribadah.',
      'Sadar bahwa manusia tidak memiliki daya tanpa pertolongan Allah (Iyyaka na’budu wa iyyaka nasta’in).',
      'Pentingnya memilih lingkaran pertemanan: meneladani kaum yang diberi nikmat, bukan mereka yang dimurkai atau tersesat.',
    ],
    hukumIslam: {
      perintah: [
        'Wajib membaca Al-Fatihah dalam setiap rakaat sholat (HR. Bukhari No. 756).',
        'Memurnikan ibadah dan doa hanya kepada Allah semata.',
      ],
      larangan: [
        'Dilarang menyekutukan Allah atau meminta pertolongan gaib kepada selain-Nya.',
        'Dilarang mengikuti jalan orang-orang yang mengetahui kebenaran namun membangkang (al-maghdhub) atau beramal tanpa ilmu (adh-dhallin).',
      ],
      prinsipSyariah: 'Menetapkan asas tauhid murni sebagai pondasi seluruh hukum dan etika dalam Islam.',
    },
    keterkaitanAntarSurah: {
      denganSebelumnya: 'Berfungsi sebagai pembuka agung mushaf; tidak ada surah sebelum Al-Fatihah.',
      denganSesudahnya: 'Doa memohon petunjuk di Al-Fatihah ("Ihdinash-shirathal mustaqim") langsung dijawab di awal Al-Baqarah: "Kitab Al-Qur’an ini tidak ada keraguan padanya; petunjuk bagi orang-orang yang bertakwa".',
      benangMerah: 'Al-Fatihah adalah proposal permohonan hamba, sedangkan 113 surah berikutnya adalah rincian jawaban petunjuk dari Allah SWT.',
    },
    gambaranBesar: {
      posisiDalamQuran: 'Surah Pertama (Pintu gerbang mushaf dan intisari 30 juz).',
      petaAlurTema: [
        { ayatRange: 'Ayat 1-4', title: 'Pujian & Pengagungan Asma Allah', coreMessage: 'Pengakuan atas sifat Rahman, Rahim, Rabb alam semesta, dan Raja Hari Pembalasan.' },
        { ayatRange: 'Ayat 5', title: 'Kontrak Kehambaan Mutlak', coreMessage: 'Pernyataan tauhid ibadah dan tauhid isti’anah (hanya kepada-Mu kami menyembah dan memohon pertolongan).' },
        { ayatRange: 'Ayat 6-7', title: 'Permohonan Hidayah Jalan Lurus', coreMessage: 'Doa istiqamah di jalan para nabi, shiddiqin, syuhada, dan shalihin.' },
      ],
      kunciPesan: 'Hidup yang berkah bermula dari pengakuan tauhid yang tulus dan permohonan hidayah yang tiada henti.',
    },
  },
  {
    surahNumber: 2,
    surahName: 'Al-Baqarah',
    arabicName: 'البقرة',
    meaning: 'Sapi Betina',
    revelationType: 'Madaniyyah',
    numberOfAyahs: 286,
    chronologicalOrder: 87,
    juz: 'Juz 1, 2, & 3',
    estimatedReadingMinutes: 15,
    pokokKandungan: {
      temaUtama: 'Tanggung jawab kekhalifahan manusia di bumi melalui ketundukan pada hukum Allah dan pembuktian iman lewat amal nyata.',
      konteksDanLatarBelakang: 'Diturunkan di Madinah pasca-Hijrah saat kaum muslimin mulai membangun tatanan masyarakat baru, berhadapan dengan kaum Yahudi dan orang munafik.',
      urgensiMemahami: 'Surah terpanjang yang memuat Ayat Kursi (ayat teragung) dan ayat hukum terpanjang tentang muamalah/utang-piutang (ayat 282), serta bantahan tuntas terhadap keraguan.',
    },
    pelajaranDanHikmah: [
      'Ketaatan tanpa banyak berdalih: kontras antara sikap patuh Nabi Ibrahim dengan watak Bani Israil yang suka mendebat perintah sapi betina.',
      'Sifat orang bertakwa: mengimani yang gaib, mendirikan sholat, menafkahkan rezeki, dan meyakini hari akhir.',
      'Ujian hidup (ketakutan, kelaparan, kekurangan harta) adalah keniscayaan untuk menyaring kesabaran hamba sejati.',
      'Larangan keras terhadap riba sebagai perusak ekonomi umat yang memicu permusuhan dari Allah dan Rasul-Nya.',
    ],
    hukumIslam: {
      perintah: [
        'Kewajiban puasa Ramadhan (ayat 183-185).',
        'Kewajiban menunaikan haji dan umrah dengan sempurna (ayat 196).',
        'Hukum qishash untuk menjamin kelangsungan hidup berkeadilan (ayat 178-179).',
        'Pencatatan dan penyaksian transaksi utang-piutang non-tunai (ayat 282).',
      ],
      larangan: [
        'Pengharaman mutlak praktik riba (ayat 275-279).',
        'Pengharaman memakan bangkai, darah, daging babi, dan sembelihan selain nama Allah (ayat 173).',
        'Larangan menikahi orang musyrik sebelum beriman (ayat 221).',
      ],
      prinsipSyariah: 'Syariat Islam ditegakkan untuk menjaga agama, jiwa, akal, keturunan, dan harta benda secara seimbang.',
    },
    keterkaitanAntarSurah: {
      denganSebelumnya: 'Menjawab doa permohonan petunjuk di Al-Fatihah: inilah kitab petunjuk bagi yang bertakwa (Al-Baqarah: 2).',
      denganSesudahnya: 'Al-Baqarah menuntaskan dialog dan kritik terhadap Bani Israil (Yahudi), lalu Ali ‘Imran melanjutkan dialektika tauhid dengan Ahli Kitab (Nasrani/Kristen Najran).',
      benangMerah: 'Menyiapkan komunitas mukmin sebagai umat penengah (ummatan wasathan) yang memikul risalah risalah ilahi di pentas sejarah.',
    },
    gambaranBesar: {
      posisiDalamQuran: 'Surah Kedua (Pondasi konstitusi hukum, ibadah, muamalah, dan etika kemasyarakatan Islam).',
      petaAlurTema: [
        { ayatRange: 'Ayat 1-20', title: 'Tiga Tipologi Manusia', coreMessage: 'Karakteristik orang beriman, orang kafir yang menutup hati, dan kaum munafik bermuka dua.' },
        { ayatRange: 'Ayat 21-39', title: 'Penciptaan Adam & Kekhalifahan', coreMessage: 'Amanah kepemimpinan manusia di bumi, tipu daya Iblis, dan taubat pertama.' },
        { ayatRange: 'Ayat 40-141', title: 'Evaluasi Sejarah Bani Israil', coreMessage: 'Pelajaran dari kelalaian umat terdahulu dan teladan tauhid murni Nabi Ibrahim AS.' },
        { ayatRange: 'Ayat 142-242', title: 'Konstitusi Hukum & Ibadah Umat', coreMessage: 'Kiblat Ka’bah, sholat, puasa, haji, perang membela diri, pernikahan, perceraian, dan wasiat.' },
        { ayatRange: 'Ayat 243-286', title: 'Infaq, Anti-Riba, & Doa Puncak', coreMessage: 'Kisah Thalut-Jalut, Ayat Kursi, bahaya riba, etika akad muamalah, dan doa penyerahan diri total.' },
      ],
      kunciPesan: 'Iman sejati tidak cukup dengan klaim lisan; ia diuji lewat kesiapan tunduk pada hukum Allah dalam kehidupan nyata.',
    },
  },
  {
    surahNumber: 3,
    surahName: "Ali 'Imran",
    arabicName: 'آل عمران',
    meaning: 'Keluarga Imran',
    revelationType: 'Madaniyyah',
    numberOfAyahs: 200,
    chronologicalOrder: 89,
    juz: 'Juz 3 & 4',
    estimatedReadingMinutes: 12,
    pokokKandungan: {
      temaUtama: 'Keteguhan memegang kebenaran (tsabat): mempertahankan kemurnian akidah dari syubhat pemikiran dan menghadapi ujian fisik di medan juang.',
      konteksDanLatarBelakang: 'Diturunkan terkait kedatangan delegasi Kristen Najran (dialog teologis seputar Nabi Isa AS) dan evaluasi pasca-Perang Uhud yang penuh dinamika.',
      urgensiMemahami: 'Membentengi umat dari keraguan intelektual (ayat mutasyabihat) dan mengajarkan evaluasi mental saat mengalami kekalahan akibat melanggar instruksi pemimpin.',
    },
    pelajaranDanHikmah: [
      'Tawadhu dalam ilmu: orang yang berilmu mendalam (ar-rasikhuna fil ‘ilmi) tidak mencari-cari takwil menyimpang dari ayat mutasyabihat.',
      'Keluarga teladan: ketulusan istri Imran menazarkan anaknya untuk Allah melahirkan figur suci Maryam dan Nabi Isa AS.',
      'Kedisiplinan di medan perjuangan: kekalahan di Bukit Uhud terjadi karena pasukan tergoda oleh ghanimah (harta duniawi).',
      'Pentingnya musyawarah dan kelembutan hati dalam memimpin (ayat 159).',
    ],
    hukumIslam: {
      perintah: [
        'Kewajiban berpegang teguh pada tali Allah secara berjamaah dan larangan berpecah belah (ayat 103).',
        'Melaksanakan amar ma’ruf nahi munkar sebagai syarat predikat umat terbaik (khairu ummah, ayat 110).',
        'Bermusyawarah dalam urusan publik dan bertawakal bulat setelah tekad diambil (ayat 159).',
      ],
      larangan: [
        'Larangan memakan riba berlipat ganda (ayat 130).',
        'Larangan menjadikan musuh sebagai orang dalam yang membocorkan rahasia umat (ayat 118).',
      ],
      prinsipSyariah: 'Menegakkan prinsip ketahanan ideologi umat dan kepatuhan syar’i dalam menghadapi pergolakan politik dan militer.',
    },
    keterkaitanAntarSurah: {
      denganSebelumnya: 'Al-Baqarah diakhiri dengan doa keteguhan iman; Ali ‘Imran dimulai dengan penetapan bahwa Al-Qur’an membenarkan kitab-kitab sebelumnya dan menjelaskan hakikat Isa AS.',
      denganSesudahnya: 'Melanjutkan tatanan perlindungan kelompok rentan (yatim dan perempuan) dalam An-Nisa pasca gugurnya banyak syuhada di Perang Uhud.',
      benangMerah: 'Mengokohkan ketahanan internal umat dari guncangan pemikiran teologis maupun benturan fisik militer.',
    },
    gambaranBesar: {
      posisiDalamQuran: 'Surah Ketiga (Pilar pertahanan akidah tauhid dan resiliensi kolektif umat).',
      petaAlurTema: [
        { ayatRange: 'Ayat 1-32', title: 'Kemurnian Wahyu & Hakikat Ketuhanan', coreMessage: 'Al-Qur’an pembeda haq-bathil, sifat ayat muhkam-mutasyabih, dan seruan cinta Allah lewat taat Rasul.' },
        { ayatRange: 'Ayat 33-63', title: 'Kisah Keluarga Imran & Kelahiran Isa AS', coreMessage: 'Kelahiran Maryam, Nabi Zakariya, dan Nabi Isa AS sebagai hamba dan utusan Allah, bukan anak Tuhan.' },
        { ayatRange: 'Ayat 64-120', title: 'Dialog Teologis & Integritas Umat', coreMessage: 'Seruan kalimatun sawa’ (kesepakatan tauhid), kritik distorsi Ahli Kitab, dan misi Khairu Ummah.' },
        { ayatRange: 'Ayat 121-180', title: 'Evaluasi & Refleksi Perang Uhud', coreMessage: 'Teguran atas kelalaian pasukan panah, pengampunan bagi yang bertaubat, dan hikmah kesyahidan.' },
        { ayatRange: 'Ayat 181-200', title: 'Ulul Albab & Perintah Sabar Total', coreMessage: 'Tafakkur alam semesta, doa orang berakal, dan seruan kesabaran berlapis (Ishbiru wa shaabiru).' },
      ],
      kunciPesan: 'Kemenangan hakiki bukan semata persenjataan, melainkan ketulusan niat, kedisiplinan syariat, dan keteguhan hati di jalan Allah.',
    },
  },
  {
    surahNumber: 4,
    surahName: 'An-Nisa',
    arabicName: 'النساء',
    meaning: 'Wanita',
    revelationType: 'Madaniyyah',
    numberOfAyahs: 176,
    chronologicalOrder: 92,
    juz: 'Juz 4, 5, & 6',
    estimatedReadingMinutes: 14,
    pokokKandungan: {
      temaUtama: 'Penegakan keadilan sosial, perlindungan hak kaum rentan (anak yatim, wanita, kaum dhu’afa), dan hukum keluarga/kewarisan.',
      konteksDanLatarBelakang: 'Banyak kepala keluarga gugur sebagai syuhada di Uhud, meninggalkan ribuan janda dan anak yatim yang memerlukan regulasi perlindungan harta dan pengasuhan yang adil.',
      urgensiMemahami: 'Membangun pilar peradaban yang bermartabat dengan menempatkan wanita dan anak yatim sebagai subjek hukum yang dihormati, menghapus tradisi jahiliyah yang menindas wanita.',
    },
    pelajaranDanHikmah: [
      'Semua manusia berasal dari satu jiwa (nafs wahidah), maka diskriminasi dan penindasan bertentangan dengan fitrah penciptaan.',
      'Harta anak yatim adalah amanah suci: memakannya secara zalim sama dengan menelan bara api ke dalam perut.',
      'Keadilan dalam rumah tangga: mahar adalah hak murni istri yang wajib ditunaikan dengan kerelaan hati.',
      'Kewajiban berlaku adil bahkan terhadap diri sendiri, orang tua, dan kerabat, tanpa terpengaruh rasa iba atau benci.',
    ],
    hukumIslam: {
      perintah: [
        'Hukum pembagian waris secara rinci dan matematis (faraidh, ayat 11-12, 176).',
        'Menunaikan amanah kepada yang berhak dan menetapkan hukum secara adil (ayat 58).',
        'Menaati Allah, Rasul, dan Ulil Amri (pemimpin yang sah) (ayat 59).',
        'Tata cara sholat khauf dalam kondisi darurat perang dan sholat qashar (ayat 101-102).',
      ],
      larangan: [
        'Memakan harta sesama secara batil (ayat 29).',
        'Menikahi wanita-wanita yang diharamkan (mahram nasab, susuan, dan mushaharah, ayat 23).',
        'Berlaku zalim dalam membagi keadilan bagi para istri jika berpoligami (ayat 3, 129).',
      ],
      prinsipSyariah: 'Menjamin hifzhun nafs (jiwa), hifzhun nasl (keturunan/keluarga), dan hifzhul maal (harta benda) secara proporsional.',
    },
    keterkaitanAntarSurah: {
      denganSebelumnya: 'Ali ‘Imran menceritakan gugurnya para pahlawan perang di Uhud; An-Nisa langsung mengatur nasib para janda dan anak yatim yang ditinggalkan.',
      denganSesudahnya: 'An-Nisa membahas ikatan perkawinan dan hak waris; Al-Ma’idah memperluas prinsip ikatan perjanjian (uqud) ke ranah publik, antar-bangsa, dan makanan halal.',
      benangMerah: 'Keadilan sosial adalah cermin ketakwaan; tidak ada masyarakat yang kuat jika kaum paling lemah di dalamnya terzalimi.',
    },
    gambaranBesar: {
      posisiDalamQuran: 'Surah Keempat (Manifesto keadilan sosial, hukum keluarga, dan hak asasi manusia dalam Islam).',
      petaAlurTema: [
        { ayatRange: 'Ayat 1-14', title: 'Perlindungan Yatim, Wanita, & Hukum Waris', coreMessage: 'Persaudaraan universal manusia, pengelolaan harta anak yatim, pembatasan poligami, dan ketentuan faraidh.' },
        { ayatRange: 'Ayat 15-42', title: 'Etika Seksualitas, Mahram, & Nafkah', coreMessage: 'Penegakan batasan kesucian, wanita yang haram dinikahi, kepemimpinan suami dengan ihsan, dan wasiat tolong-menolong.' },
        { ayatRange: 'Ayat 43-70', title: 'Ketaatan Syariat & Kriteria Kemunafikan', coreMessage: 'Perintah bersuci, kepatuhan kepada Rasul sebagai hakim pemutus perkara, dan bahaya hasad.' },
        { ayatRange: 'Ayat 71-104', title: 'Ketahanan Militer, Sholat Khauf, & Hijrah', coreMessage: 'Kesiapsiagaan menghadapi ancaman, kewajiban berhijrah dari negeri penindas, dan dispensasi sholat qashar.' },
        { ayatRange: 'Ayat 105-176', title: 'Keadilan Hukum Tanpa Pandang Bulu', coreMessage: 'Larangan membela pengkhianat, keadilan saksi di pengadilan, bantahan trinitas, dan waris kalalah.' },
      ],
      kunciPesan: 'Tolak ukur kemuliaan suatu masyarakat diukur dari sejauh mana hak orang-orang yang paling lemah dilindungi.',
    },
  },
  {
    surahNumber: 5,
    surahName: "Al-Ma'idah",
    arabicName: 'المائدة',
    meaning: 'Hidangan',
    revelationType: 'Madaniyyah',
    numberOfAyahs: 120,
    chronologicalOrder: 112,
    juz: 'Juz 6 & 7',
    estimatedReadingMinutes: 12,
    pokokKandungan: {
      temaUtama: 'Penyempurnaan syariat, kesucian akad/perjanjian, hukum makanan halal-haram, dan penegasan kesempurnaan agama Islam.',
      konteksDanLatarBelakang: 'Termasuk surah-surah yang paling akhir diturunkan di Madinah, memuat ayat deklarasi kesempurnaan Islam yang turun saat Haji Wada’ (ayat 3).',
      urgensiMemahami: 'Menyempurnakan seluruh bangunan hukum perdata, pidana, dan ritual ibadah, menegaskan bahwa melanggar komitmen akad adalah dosa besar.',
    },
    pelajaranDanHikmah: [
      'Pentingnya menepati seluruh janji dan akad (uqud), baik kepada Allah maupun sesama manusia.',
      'Menolong dalam kebajikan dan takwa (ta’awun ‘alal birri wat-taqwa), bukan dalam dosa dan permusuhan.',
      'Menjaga satu nyawa manusia tanpa alasan haq nilainya setara dengan menyelamatkan seluruh umat manusia.',
      'Kisah Qabil dan Habil: iri dengki adalah akar pembunuhan pertama dalam sejarah manusia.',
    ],
    hukumIslam: {
      perintah: [
        'Rukun wudhu secara terperinci dan tata cara tayamum (ayat 6).',
        'Kewajiban menegakkan keadilan saksi meski terhadap pihak yang dibenci (ayat 8).',
        'Hukum qishash dan pemaafan (ayat 45).',
      ],
      larangan: [
        'Pengharaman khamr (minuman keras), judi, berkorban untuk berhala, dan mengundi nasib dengan panah (ayat 90).',
        'Pengharaman berburu saat sedang berihram haji atau umrah (ayat 1, 95-96).',
        'Larangan memakan bangkai, darah, babi, dan binatang yang tercekik atau jatuh (ayat 3).',
      ],
      prinsipSyariah: 'Menjaga kesucian akal dari zat adiktif, menjaga integritas transaksi, dan menyempurnakan batasan halal-haram.',
    },
    keterkaitanAntarSurah: {
      denganSebelumnya: 'An-Nisa diakhiri dengan hukum waris; Al-Ma’idah diawali dengan perintah menepati seluruh jenis akad dan komitmen.',
      denganSesudahnya: 'Al-Ma’idah menutup empat surah panjang Madaniyyah (tatanan hukum); surah berikutnya (Al-An’am) membuka siklus Makkiyyah yang berfokus pada ketauhidan dan bantahan kemusyrikan.',
      benangMerah: 'Islam telah sempurna: tiada ruang untuk menambah atau mengurangi syariat yang telah ditetapkan Allah dan Rasul-Nya.',
    },
    gambaranBesar: {
      posisiDalamQuran: 'Surah Kelima (Puncak penutup legislasi hukum dan penegasan kesempurnaan syariat Islam).',
      petaAlurTema: [
        { ayatRange: 'Ayat 1-5', title: 'Integritas Akad, Makanan Halal, & Kesempurnaan Islam', coreMessage: 'Kewajiban menepati janji, rincian makanan halal-haram, dan turunnya deklarasi sempurnanya agama Islam.' },
        { ayatRange: 'Ayat 6-26', title: 'Kesucian Bersuci & Tragedi Pembangkangan Bani Israil', coreMessage: 'Syariat wudhu-tayamum, keadilan saksi, dan kisah pembangkangan kaum Nabi Musa menolak masuk tanah suci.' },
        { ayatRange: 'Ayat 27-40', title: 'Kisah Qabil-Habil & Hukum Kriminalitas Berat', coreMessage: 'Kriminalitas pertama di bumi, sakralitas jiwa manusia, dan sanksi tegas bagi perusak keamanan (hirabah) serta pencurian.' },
        { ayatRange: 'Ayat 41-86', title: 'Kewajiban Berhukum dengan Hukum Allah', coreMessage: 'Taurat, Injil, dan Al-Qur’an sebagai standar hukum; larangan mengikuti hawa nafsu kaum jahiliyah.' },
        { ayatRange: 'Ayat 87-120', title: 'Haramnya Khamr-Judi & Dialog Akhirat Nabi Isa AS', coreMessage: 'Pengharaman total judi-khamr, tebusan sumpah, mukjizat hidangan dari langit, dan kesaksian Nabi Isa AS di hadapan Allah.' },
      ],
      kunciPesan: 'Menepati janji kepada Allah diwujudkan dengan menjaga kesucian apa yang masuk ke dalam perut dan mematuhi hukum yang Dia turunkan.',
    },
  },
  {
    surahNumber: 6,
    surahName: "Al-An'am",
    arabicName: 'الأنعام',
    meaning: 'Binatang Ternak',
    revelationType: 'Makkiyyah',
    numberOfAyahs: 165,
    chronologicalOrder: 55,
    juz: 'Juz 7 & 8',
    estimatedReadingMinutes: 12,
    pokokKandungan: {
      temaUtama: 'Penegakan Tauhid murni, pemurnian ibadah, bantahan terhadap mitos tahayul kaum musyrik, dan bukti kekuasaan Allah di alam semesta.',
      konteksDanLatarBelakang: 'Diturunkan sekaligus di Makkah pada malam hari, diiringi oleh ribuan malaikat, menandai perlawanan total terhadap dogma syirik Quraisy.',
      urgensiMemahami: 'Membimbing akal sehat manusia untuk menemukan Sang Pencipta lewat observasi fenomena alam (metode Nabi Ibrahim AS).',
    },
    pelajaranDanHikmah: [
      'Metode berpikir logis Nabi Ibrahim AS mengamati bintang, bulan, dan matahari untuk membuktikan kefanaan makhluk dan keabadian Khaliq.',
      'Bahaya keyakinan mistis jahiliyah yang mengharamkan binatang ternak tertentu berdasarkan mitos tanpa dasar wahyu.',
      'Sifat istiqamah: hidup, mati, ibadah, dan pengorbanan hanya dipersembahkan secara eksklusif untuk Allah semata (ayat 162).',
      'Setiap amal kebaikan akan dilipatgandakan sepuluh kali lipat karunia-Nya.',
    ],
    hukumIslam: {
      perintah: [
        'Menyebut nama Allah saat menyembelih binatang ternak (ayat 118, 121).',
        'Menunaikan hak zakat hasil pertanian pada hari panennya (ayat 141).',
        'Sepuluh wasiat agung Allah (al-Washaya al-‘Asyr) dalam ayat 151-153: berbakti pada orang tua, jangan membunuh anak karena takut miskin, jauhi kekejian.',
      ],
      larangan: [
        'Memakan daging sembelihan yang tidak disebut nama Allah atasnya (ayat 121).',
        'Membuat-buat kedustaan hukum halal-haram berdasarkan hawa nafsu (ayat 143-144).',
        'Mencaci sesembahan kaum musyrik karena mereka akan membalas mencaci Allah secara melampaui batas (ayat 108).',
      ],
      prinsipSyariah: 'Menjaga kemurnian akidah dari syirik dan memastikan sumber makanan memenuhi standar halal thoyyib.',
    },
    keterkaitanAntarSurah: {
      denganSebelumnya: 'Al-Ma’idah membahas hukum makanan halal dan batasan syariat; Al-An’am membongkar akar teologis kenapa binatang ternak dikeramatkan atau diharamkan secara batil oleh musyrikin.',
      denganSesudahnya: 'Al-An’am memaparkan dalil-dalil tauhid secara rasional; Al-A’raf membuktikan kebenaran tauhid tersebut lewat rekam jejak sejarah kehancuran kaum yang mendustakannya.',
      benangMerah: 'Allah adalah satu-satunya Pencipta, Pemelihara, dan Pemilik hak mutlak untuk menetapkan hukum di alam semesta.',
    },
    gambaranBesar: {
      posisiDalamQuran: 'Surah Keenam (Kitab argumentasi rasional tauhid dan penghancur mitologi syirik Makkah).',
      petaAlurTema: [
        { ayatRange: 'Ayat 1-32', title: 'Keagungan Penciptaan & Kerasnya Hati Kaum Penentang', coreMessage: 'Penciptaan langit-bumi, siklus gelap-terang, dan kerugian orang yang mengabaikan panggilan fitrah.' },
        { ayatRange: 'Ayat 33-73', title: 'Penghiburan Rasul & Metode Logika Nabi Ibrahim AS', coreMessage: 'Nabi tidak mendustakan melainkan menolak ayat Allah; perjalanan intelektual Ibrahim mencari Tuhan sejati.' },
        { ayatRange: 'Ayat 74-90', title: 'Silsilah 18 Nabi & Teladan Hidayah', coreMessage: 'Pujian bagi para nabi dan seruan mengikuti jejak keteladanan tauhid mereka.' },
        { ayatRange: 'Ayat 91-140', title: 'Tadabbur Alam Raya & Pembongkaran Mitos Hewan', coreMessage: 'Benih yang tumbuh, bintang sebagai penunjuk arah, dan bantahan atas pembagian ternak ala jahiliyah.' },
        { ayatRange: 'Ayat 141-165', title: 'Sepuluh Perintah Suci & Deklarasi Hidup-Mati', coreMessage: 'Dekalog syariat Islam (ayat 151-153) dan ikrar abadi: Inna shalaati wa nusukii wa mahyaaya wa mamaatii lillaahi rabbil ‘aalamiin.' },
      ],
      kunciPesan: 'Tauhid bukan sekadar konsep abstrak; ia adalah pandangan hidup yang membebaskan akal dari takhayul dan mengarahkan seluruh gerak hidup hanya untuk Allah.',
    },
  },
  {
    surahNumber: 7,
    surahName: "Al-A'raf",
    arabicName: 'الأعراف',
    meaning: 'Tempat Tertinggi',
    revelationType: 'Makkiyyah',
    numberOfAyahs: 206,
    chronologicalOrder: 39,
    juz: 'Juz 8 & 9',
    estimatedReadingMinutes: 12,
    pokokKandungan: {
      temaUtama: 'Pertarungan abadi antara kebenaran wahyu dan tipu daya Iblis sepanjang sejarah umat manusia, serta nasib para penentang risalah.',
      konteksDanLatarBelakang: 'Diturunkan di Makkah untuk menguatkan mental Nabi SAW dan sahabat saat menghadapi intimidasi kaum musyrik yang kian represif.',
      urgensiMemahami: 'Membongkar strategi Iblis dalam melucuti pakaian takwa manusia dan menggambarkan detail geografi hisab di akhirat (ahli surga, ahli neraka, dan ashabul A’raf).',
    },
    pelajaranDanHikmah: [
      'Kesombongan adalah dosa pertama di alam raya: Iblis menolak sujud kepada Adam karena merasa elemen apinya lebih unggul daripada tanah.',
      'Iblis menyerang manusia dari depan, belakang, kanan, dan kiri untuk menghalangi mereka bersyukur.',
      'Pakaian takwa adalah pakaian terbaik; jangan tertipu oleh kenikmatan semu yang menelanjangi kehormatan diri.',
      'Kisah para nabi (Nuh, Hud, Shalih, Luth, Syu’aib, Musa): kezaliman selalu berakhir dengan kebinasaan, sedangkan kesabaran membawa keselamatan.',
    ],
    hukumIslam: {
      perintah: [
        'Memakai pakaian yang pantas dan indah setiap kali memasuki masjid (ayat 31).',
        'Makan dan minum secukupnya tanpa berlebih-lebihan (israf, ayat 31).',
        'Mendengarkan dengan tenang dan khusyuk saat Al-Qur’an dibacakan agar mendapat rahmat (ayat 204).',
        'Berdzikir mengingat Allah dalam hati dengan rasa rendah hati dan takut pada waktu pagi dan petang (ayat 205).',
      ],
      larangan: [
        'Larangan melakukan perbuatan keji, baik yang tampak maupun tersembunyi (ayat 33).',
        'Larangan mengada-adakan dusta terhadap syariat Allah tanpa dasar ilmu (ayat 33).',
        'Larangan berbuat kerusakan di muka bumi setelah diperbaiki (ayat 56, 85).',
      ],
      prinsipSyariah: 'Menjaga adab berpakaian, kelestarian lingkungan, dan etika interaksi terhadap kalam ilahi.',
    },
    keterkaitanAntarSurah: {
      denganSebelumnya: 'Al-An’am menguraikan tauhid secara doktrinal rasional; Al-A’raf memaparkan fakta historis jatuh-bangunnya peradaban manusia akibat menerima atau menolak tauhid tersebut.',
      denganSesudahnya: 'Al-A’raf menceritakan konfrontasi Musa melawan tirani Fir’aun; Al-Anfal menyajikan konfrontasi nyata kaum muslimin melawan tiran Quraisy di Perang Badar.',
      benangMerah: 'Sejarah adalah laboratorium hukum Allah; kaum yang congkak menentang kebenaran pasti akan ditumbangkan.',
    },
    gambaranBesar: {
      posisiDalamQuran: 'Surah Ketujuh (Peta sejarah peradaban nubuwah dan dialektika hisab di padang mahsyar).',
      petaAlurTema: [
        { ayatRange: 'Ayat 1-30', title: 'Penciptaan Adam, Dendam Iblis, & Pakaian Takwa', coreMessage: 'Iblis terusir karena takabbur, godaan buah terlarang, penelanjangan aurat, dan peringatan kepada anak-cucu Adam.' },
        { ayatRange: 'Ayat 31-53', title: 'Dialog Tiga Golongan Akhirat', coreMessage: 'Percakapan dramatis antara penghuni surga, neraka, dan orang-orang di atas benteng Al-A’raf.' },
        { ayatRange: 'Ayat 54-102', title: 'Kronik Kenabian (Nuh, Hud, Shalih, Luth, Syu’aib)', coreMessage: 'Dakwah para rasul mengajak tauhid dan kehancuran bangsa yang mendustakan lewat gempa, banjir, dan angin topan.' },
        { ayatRange: 'Ayat 103-171', title: 'Epik Perjuangan Nabi Musa AS Melawan Fir’aun', coreMessage: 'Pertarungan mukjizat tongkat vs tukang sihir, laut terbelah, hingga pembangkangan Bani Israil menyembah anak sapi.' },
        { ayatRange: 'Ayat 172-206', title: 'Perjanjian Primordial Jiwa & Perintah Khusyuk', coreMessage: 'Persaksian fitrah manusia di alam arwah (Alastu bi rabbikum), bahaya orang yang melupakan ayat, dan adab mendengarkan Al-Qur’an.' },
      ],
      kunciPesan: 'Pakaian terindah seorang manusia adalah pakaian ketakwaan yang melindungi dirinya dari jebakan tipu daya kesombongan Iblis.',
    },
  },
  {
    surahNumber: 8,
    surahName: 'Al-Anfal',
    arabicName: 'الأنفال',
    meaning: 'Harta Rampasan Perang',
    revelationType: 'Madaniyyah',
    numberOfAyahs: 75,
    chronologicalOrder: 88,
    juz: 'Juz 9 & 10',
    estimatedReadingMinutes: 10,
    pokokKandungan: {
      temaUtama: 'Hukum pertahanan militer, manajemen harta rampasan, dan faktor spiritual penentu kemenangan di medan juang (Evaluasi Perang Badar).',
      konteksDanLatarBelakang: 'Diturunkan pasca-kemenangan gemilang 313 mujahid mukmin melawan 1.000 pasukan elit musyrikin Quraisy pada 17 Ramadhan 2 H.',
      urgensiMemahami: 'Mengingatkan bahwa kemenangan sejati bukan ditentukan oleh kuantitas senjata atau pasukan, melainkan oleh pertolongan gaib malaikat dan keteguhan dzikir.',
    },
    pelajaranDanHikmah: [
      'Harta dan materi bukan tujuan perjuangan; perselisihan ghanimah diselesaikan dengan penyerahan hak mutlak kepada Allah dan Rasul.',
      'Sifat mukmin sejati: bila disebut nama Allah hatinya bergetar, dan bila dibacakan ayat-ayat-Nya bertambah imannya.',
      'Kemenangan Badar adalah anugerah murni: "Bukan kamu yang membunuh mereka, melainkan Allahlah yang membunuh mereka" (ayat 17).',
      'Pentingnya mempersiapkan kekuatan fisik dan teknologi pertahanan semaksimal mungkin untuk menggentarkan pihak zalim.',
    ],
    hukumIslam: {
      perintah: [
        'Membagi harta rampasan perang menjadi lima bagian (khumus) untuk Allah, Rasul, kerabat, anak yatim, miskin, dan ibnu sabil (ayat 41).',
        'Mempersiapkan kekuatan sarana militer untuk pertahanan negara (ayat 60).',
        'Menerima tawaran perdamaian jika pihak lawan cenderung kepada damai, dengan tetap bertawakal kepada Allah (ayat 61).',
      ],
      larangan: [
        'Lari mundur dari medan perang saat pasukan berhadapan dengan musuh (ayat 15-16).',
        'Mengkhianati Allah, Rasul, dan amanah yang dipercayakan (ayat 27).',
      ],
      prinsipSyariah: 'Mengatur hukum perang berkeadaban (siyar), perlindungan tawanan, dan distribusi kekayaan negara secara berkeadilan.',
    },
    keterkaitanAntarSurah: {
      denganSebelumnya: 'Al-A’raf menceritakan penyelamatan Bani Israil dari Fir’aun; Al-Anfal menyajikan pertolongan Allah menyelamatkan umat Muhammad SAW dari keangkuhan Abu Jahal di Badar.',
      denganSesudahnya: 'Al-Anfal membahas perjanjian dan perang Badar; At-Taubah melanjutkan fase pembatalan perjanjian bagi kaum musyrik yang melanggar kesepakatan damai secara sepihak.',
      benangMerah: 'Ketundukan spiritual dan persatuan barisan adalah kunci mutlak pertolongan Allah dalam setiap pertempuran hidup.',
    },
    gambaranBesar: {
      posisiDalamQuran: 'Surah Kedelapan (Buku panduan strategi pertahanan, persatuan barisan, dan etika kepemilikan harta publik).',
      petaAlurTema: [
        { ayatRange: 'Ayat 1-19', title: 'Regulasi Ghanimah & Mukjizat Perang Badar', coreMessage: 'Karakter mukmin sejati, turunnya ribuan bala bantuan malaikat, dan kantuk yang menenangkan.' },
        { ayatRange: 'Ayat 20-40', title: 'Larangan Khianat & Ujian Harta-Anak', coreMessage: 'Perintah taat total, waspada fitnah harta dan anak, serta pemisahan tegas antara haq dan bathil (Furqan).' },
        { ayatRange: 'Ayat 41-49', title: 'Aturan Pembagian Seperlima Ghanimah & Keteguhan Dzikir', coreMessage: 'Hukum khumus dan kunci kemenangan militer: teguh, perbanyak dzikir, taati komando, dan jangan riya.’' },
        { ayatRange: 'Ayat 50-75', title: 'Kesiapan Militer, Tawaran Damai, & Solidaritas Muhajirin-Anshar', coreMessage: 'Persiapan alutsista pertahanan, diplomasi damai, etika tawanan, dan ikatan persaudaraan sejati Muhajirin-Anshar.' },
      ],
      kunciPesan: 'Kemenangan tidak diraih dengan kecongkakan materi, melainkan dengan hati yang senantiasa terhubung dengan Allah di saat genting.',
    },
  },
  {
    surahNumber: 9,
    surahName: 'At-Taubah',
    arabicName: 'التوبة',
    meaning: 'Pengampunan / Bara’ah',
    revelationType: 'Madaniyyah',
    numberOfAyahs: 129,
    chronologicalOrder: 113,
    juz: 'Juz 10 & 11',
    estimatedReadingMinutes: 14,
    pokokKandungan: {
      temaUtama: 'Pernyataan pemutusan hubungan (bara’ah) dari kaum musyrik yang berulang kali mengkhianati perjanjian, penyingkapan kedok orang munafik, dan luasnya pintu taubat Allah.',
      konteksDanLatarBelakang: 'Diturunkan menjelang dan pasca-Ekspedisi Perang Tabuk (9 H) dalam cuaca panas ekstrem. Menjadi satu-satunya surah dalam Al-Qur’an yang tidak diawali basmalah karena berisi ketegasan pemutusan ikatan dengan musuh pengkhianat.',
      urgensiMemahami: 'Menguji ketulusan pengorbanan hamba: membedakan antara pejuang sejati, orang lemah yang tertinggal dengan udzur syar’i, dan kaum munafik yang mencari-cari alasan.',
    },
    pelajaranDanHikmah: [
      'Pintu taubat senantiasa terbuka lebar bahkan bagi kesalahan fatal, seperti kisah tiga sahabat (Ka’ab bin Malik dkk) yang tertunda taubatnya 50 hari.',
      'Sikap tegas terhadap pengkhianatan: toleransi tidak berarti membiarkan pihak lain menusuk dari belakang.',
      'Kisah hijrah di Gua Tsur: ketenangan Nabi SAW saat bersabda kepada Abu Bakar: "Laa tahzan, innallaaha ma’anaa" (Jangan sedih, Allah bersama kita).',
      'Masjid Dirar: tempat ibadah yang dibangun untuk memecah belah persatuan umat wajib ditinggalkan.',
    ],
    hukumIslam: {
      perintah: [
        'Pendistribusian delapan asnaf mustahik zakat mal yang baku (ayat 60).',
        'Kewajiban berjihad dengan harta dan jiwa di jalan Allah (ayat 41).',
        'Perintah kepada sebagian umat untuk bertafaqquh fiddin (memperdalam ilmu agama) agar dapat membimbing masyarakatnya (ayat 122).',
      ],
      larangan: [
        'Larangan mensholatkan jenazah orang munafik yang wafat dalam kekafiran atau berdiri di atas kuburnya (ayat 84).',
        'Larangan memakmurkan masjid bagi kaum musyrik yang menentang tauhid (ayat 17).',
      ],
      prinsipSyariah: 'Menjaga integritas kedaulatan negara Islam, kepastian alokasi jaminan sosial (zakat), dan kemurnian fungsi rumah ibadah.',
    },
    keterkaitanAntarSurah: {
      denganSebelumnya: 'Al-Anfal membahas perjanjian dan etika perang; At-Taubah mendeklarasikan pembatalan perjanjian bagi musuh yang secara konsisten berkhianat.',
      denganSesudahnya: 'Menutup 9 surah pertama yang padat syariat dan tata peradaban; surah berikutnya (Yunus) membuka siklus pembahasan iman, takdir, dan kisah para rasul.',
      benangMerah: 'Tidak ada kompromi dengan kepalsuan iman (nifak); ketulusan taubat adalah penyelamat tunggal di hadapan pengadilan ilahi.',
    },
    gambaranBesar: {
      posisiDalamQuran: 'Surah Kesembilan (Operasi pembersihan internal umat dari virus kemunafikan dan pembukaan gerbang taubat seluas-luasnya).',
      petaAlurTema: [
        { ayatRange: 'Ayat 1-28', title: 'Maklumat Bara’ah & Batas Waktu 4 Bulan', coreMessage: 'Pemutusan hubungan diplomatik dengan musyrikin pelanggar perjanjian dan jaminan keamanan bagi pencari suaka kebenaran.' },
        { ayatRange: 'Ayat 29-59', title: 'Mobilisasi Perang Tabuk & Pembongkaran Alasan Munafik', coreMessage: 'Kisah keberangkatan Tabuk, ujian cuaca ekstrem, dan sindiran tajam bagi yang beralasan tidak sanggup ikut.' },
        { ayatRange: 'Ayat 60-93', title: 'Delapan Golongan Zakat & Kontras Sikap Munafik vs Mukmin', coreMessage: 'Rincian asnaf zakat (ayat 60), watak munafik penghasut, dan profil mukmin yang saling tolong-menolong.' },
        { ayatRange: 'Ayat 94-118', title: 'Kisah Taubat Tiga Sahabat & Penghancuran Masjid Dirar', coreMessage: 'Kisah pengucilan sosial Ka’ab bin Malik hingga diterimanya taubatnya, serta bahaya masjid pemecah belah.' },
        { ayatRange: 'Ayat 119-129', title: 'Kewajiban Menuntut Ilmu & Kasih Sayang Rasul SAW', coreMessage: 'Perintah bersama orang jujur, spesialisasi pencari ilmu (ayat 122), dan kelembutan hati Rasulullah yang berat memikirkan penderitaan umatnya.' },
      ],
      kunciPesan: 'Allah Maha Menerima Taubat bagi siapa saja yang jujur mengakui kesalahannya dan tidak berlindung di balik topeng kemunafikan.',
    },
  },
  {
    surahNumber: 10,
    surahName: 'Yunus',
    arabicName: 'يونس',
    meaning: 'Nabi Yunus AS',
    revelationType: 'Makkiyyah',
    numberOfAyahs: 109,
    chronologicalOrder: 51,
    juz: 'Juz 11',
    estimatedReadingMinutes: 10,
    pokokKandungan: {
      temaUtama: 'Kepastian wahyu Al-Qur’an, ketetapan takdir ilahi (Qadha & Qadar), serta peringatan bahwa penyesalan saat azab telah turun tidak lagi berguna.',
      konteksDanLatarBelakang: 'Diturunkan di Makkah saat kaum musyrik menuntut mukjizat fisik yang mustahil dan mengklaim Al-Qur’an adalah sihir atau buatan Muhammad SAW.',
      urgensiMemahami: 'Membangun keyakinan bahwa seluruh fenomena alam dan sejarah manusia berada di bawah kendali tunggal Allah yang penuh hikmah.',
    },
    pelajaranDanHikmah: [
      'Keistimewaan kaum Nabi Yunus AS: satu-satunya kaum dalam sejarah yang taubatnya diterima saat azab sudah berada di ambang pelupuk mata.',
      'Sifat manusia yang tidak konsisten: khusyuk berdoa saat ditimpa gelombang badai di tengah lautan, namun langsung sombong berpaling setelah sampai di daratan.',
      'Kebenaran wahyu Al-Qur’an tak terbantahkan; tantangan membuat satu surah semisal tidak pernah mampu dijawab oleh musuh Islam.',
      'Jasad Fir’aun diselamatkan sebagai tanda peringatan abadi bagi generasi setelahnya (ayat 92).',
    ],
    hukumIslam: {
      perintah: [
        'Kewajiban bertawakal dan memurnikan agama hanya untuk Allah (ayat 104-105).',
        'Menyampaikan dakwah tanpa paksaan: "Apakah kamu hendak memaksa manusia sampai mereka menjadi orang beriman?" (ayat 99).',
      ],
      larangan: [
        'Larangan menyembah atau memohon kepada sesuatu yang tidak dapat memberi manfaat atau bahaya selain Allah (ayat 106).',
        'Larangan meragukan kepastian datangnya hari pembalasan.',
      ],
      prinsipSyariah: 'Menjaga kebebasan berkeyakinan dari pemaksaan fisik dan meneguhkan landasan akidah tauhid murni.',
    },
    keterkaitanAntarSurah: {
      denganSebelumnya: 'At-Taubah mengupas hukum perjuangan di bumi; Yunus mengajak manusia merenungi hakikat wahyu langit dan takdir ilahi.',
      denganSesudahnya: 'Yunus menekankan prinsip qadha dan hikmah wahyu; Hud melanjutkan dengan rincian dialektika kisah rasul-rasul yang mendalam.',
      benangMerah: 'Manusia tidak berdaya mengubah ketetapan Allah; keselamatan hanya diraih dengan kepasrahan sebelum waktu hisab tiba.',
    },
    gambaranBesar: {
      posisiDalamQuran: 'Surah Kesepuluh (Awal klaster surah-surah nubuwah yang memperkokoh keyakinan atas kebenaran Al-Qur’an).',
      petaAlurTema: [
        { ayatRange: 'Ayat 1-20', title: 'Keotentikan Al-Qur’an & Siklus Ciptaan', coreMessage: 'Matahari bercahaya, bulan bersinar sebagai alat hitung waktu, dan ketidakmampuan manusia menandingi kalamullah.' },
        { ayatRange: 'Ayat 21-40', title: 'Perumpamaan Kehidupan Duniawi & Analogi Badai Laut', coreMessage: 'Dunia ibarat air hujan yang menumbuhkan tanaman lalu mengering; kepanikan manusia di perahu yang diombang-ambing ombak.' },
        { ayatRange: 'Ayat 41-70', title: 'Tugas Kerasulan & Karunia Para Wali Allah', coreMessage: 'Kewajiban rasul hanya menyampaikan; wali Allah tidak memiliki rasa takut dan sedih di dunia dan akhirat.' },
        { ayatRange: 'Ayat 71-93', title: 'Kisah Nabi Nuh, Musa, & Tenggelamnya Fir’aun', coreMessage: 'Tenggelamnya Fir’aun di Laut Merah dan penyelamatan tubuh kasarnya sebagai bukti arkeologis bagi masa depan.' },
        { ayatRange: 'Ayat 94-109', title: 'Pengecualian Kaum Yunus & Prinsip Keikhlasan', coreMessage: 'Taubat kaum Yunus yang membatalkan azab, dan penegasan bahwa jika Allah menimpakan mudharat, tiada yang bisa menghilangkannya selain Dia.' },
      ],
      kunciPesan: 'Gunakan kesempatan hidup sekarang untuk beriman dan bertaubat; jangan menunggu hingga gelombang azab menutup pintu taubatmu.',
    },
  },
  {
    surahNumber: 12,
    surahName: 'Yusuf',
    arabicName: 'يوسف',
    meaning: 'Nabi Yusuf AS',
    revelationType: 'Makkiyyah',
    numberOfAyahs: 111,
    chronologicalOrder: 53,
    juz: 'Juz 12 & 13',
    estimatedReadingMinutes: 15,
    pokokKandungan: {
      temaUtama: 'Kisah terbaik (Ahsanul Qashash): skenario takdir Allah yang indah di balik konspirasi kejahatan, kesabaran menghadapi fitnah syahwat, dan rekonsiliasi keluarga.',
      konteksDanLatarBelakang: 'Diturunkan pada "Aamul Huzn" (Tahun Kesedihan) saat Khadijah RA dan Abu Thalib wafat, untuk menghibur hati Rasulullah SAW yang terluka akibat penolakan keras penduduk Tha’if.',
      urgensiMemahami: 'Mengajarkan manajemen kesabaran menghadapi pengkhianatan saudara sendiri, keteguhan menjaga kehormatan moral dari rayuan nafsu, dan kepemimpinan ekonomi saat krisis pangan.',
    },
    pelajaranDanHikmah: [
      'Iri hati di antara saudara kandung dapat membutakan nurani hingga tega membuang saudara ke dalam sumur tua.',
      'Keteguhan menjaga kesucian diri: Yusuf memilih dinginnya penjara daripada mengikuti hawa nafsu istri al-Aziz.',
      'Kesabaran yang indah (shabr jamil): Nabi Ya’qub tidak pernah berputus asa dari rahmat Allah meski puluhan tahun berpisah dengan anak tercinta.',
      'Kemuliaan memaafkan: saat berkuasa sebagai bendaharawan Mesir, Yusuf tidak membalas dendam kepada kakak-kakaknya, melainkan berucap: "Laa tatsriiba ‘alaikumul yaum" (Hari ini tidak ada celaan atas kalian).',
    ],
    hukumIslam: {
      perintah: [
        'Menyembunyikan mimpi atau rencana baik dari orang yang dikhawatirkan memiliki sifat hasad (ayat 5).',
        'Menjaga profesionalisme dan integritas dalam mengemban amanah publik: "Jadikanlah aku bendaharawan negeri; sesungguhnya aku orang yang pandai menjaga lagi berpengetahuan" (ayat 55).',
      ],
      larangan: [
        'Berputus asa dari rahmat dan pertolongan Allah (ayat 87).',
        'Mendekati perbuatan zina dan khianat terhadap kepercayaan majikan atau atasan (ayat 23).',
      ],
      prinsipSyariah: 'Menjaga kesucian nasab/kehormatan moral (hifzhul ‘irdh) dan manajemen ketahanan pangan nasional.',
    },
    keterkaitanAntarSurah: {
      denganSebelumnya: 'Surah Hud diakhiri dengan penegasan bahwa kisah para rasul diteguhkan untuk menguatkan hati nabi; Yusuf menjadi bukti konkret terindah dari peneguhan hati tersebut.',
      denganSesudahnya: 'Yusuf memaparkan takdir Allah lewat alur kehidupan seorang manusia; Ar-Ra’d melanjutkan pembuktian kekuasaan takdir ilahi lewat fenomena petir dan hukum alam semesta.',
      benangMerah: 'Skenario manusia sehebat apa pun tidak akan pernah mampu mengalahkan ketetapan rencana Allah yang Maha Lembut (Lathiif).',
    },
    gambaranBesar: {
      posisiDalamQuran: 'Surah Kedua Belas (Satu-satunya surah dalam Al-Qur’an yang menceritakan satu kisah utuh dari awal hingga akhir secara kronologis penuh estetika sastra tingkat tinggi).',
      petaAlurTema: [
        { ayatRange: 'Ayat 1-20', title: 'Mimpi Sebelas Bintang & Konspirasi Sumur', coreMessage: 'Visi masa depan Yusuf, kecemburuan saudara kandung, tipu daya serigala palsu, dan pertolongan kafilah dagang.' },
        { ayatRange: 'Ayat 21-35', title: 'Ujian Rumah Tangga Mesir & Fitnah Syahwat', coreMessage: 'Didikan di istana Al-Aziz, rayuan Zulaikha, robeknya baju dari belakang sebagai bukti kejujuran, dan pilihan penjara.' },
        { ayatRange: 'Ayat 36-57', title: 'Dakwah di Penjara & Interpretasi Mimpi Raja', coreMessage: 'Mentauhidkan tahanan, tafsir 7 sapi gemuk dan 7 sapi kurus, pembersihan nama baik, dan pelantikan menteri logistik pangan.' },
        { ayatRange: 'Ayat 58-93', title: 'Kedatangan Saudara & Siasat Kasih Sayang', coreMessage: 'Ujian gandum, piala raja di karung Benyamin, pengorbanan Ya’qub, hingga terbukanya identitas Yusuf di hadapan kakak-kakaknya.' },
        { ayatRange: 'Ayat 94-111', title: 'Sujud Penghormatan & Pengakuan Takdir Indah', coreMessage: 'Sembuhnya mata Ya’qub dengan gamis Yusuf, terwujudnya mimpi masa kecil di atas tahta, dan doa husnul khatimah.' },
      ],
      kunciPesan: 'Di balik setiap episode perih sumur penolakan dan penjara fitnah, Allah sedang menyiapkan tahta kemuliaan bagi jiwa yang sabar dan bertakwa.',
    },
  },
  {
    surahNumber: 18,
    surahName: 'Al-Kahf',
    arabicName: 'الكهف',
    meaning: 'Gua',
    revelationType: 'Makkiyyah',
    numberOfAyahs: 110,
    chronologicalOrder: 69,
    juz: 'Juz 15 & 16',
    estimatedReadingMinutes: 15,
    pokokKandungan: {
      temaUtama: 'Benteng pertahanan iman dari 4 fitnah terbesar di akhir zaman: fitnah agama (Ashabul Kahfi), fitnah harta (pemilik dua kebun), fitnah ilmu (Musa & Khidhir), dan fitnah kekuasaan (Dzulqarnain).',
      konteksDanLatarBelakang: 'Diturunkan sebagai jawaban atas tiga teka-teki yang diajukan rabi Yahudi melalui musyrikin Makkah: tentang pemuda tertidur di gua, pengembara penakluk timur-barat, dan hakikat roh.',
      urgensiMemahami: 'Disunnahkan dibaca setiap hari Jumat sebagai pemancar cahaya spiritual dari satu Jumat ke Jumat berikutnya dan pelindung dari fitnah Dajjal.',
    },
    pelajaranDanHikmah: [
      'Fitnah Agama: Para pemuda Kahfi rela meninggalkan kenyamanan kota demi menjaga tauhid; Allah menidurkan mereka 309 tahun di dalam gua yang aman.',
      'Fitnah Harta: Pemilik dua kebun yang sombong lupa bahwa kesuburan panen adalah karunia Allah; kebunnya hangus dalam semalam saat ia kufur nikmat.',
      'Fitnah Ilmu: Nabi Musa AS belajar bahwa di balik takdir yang tampak buruk (perahu dilubangi, anak dibunuh, dinding ditegakkan) tersimpan hikmah ilahi yang agung.',
      'Fitnah Kekuasaan: Dzulqarnain mencontohkan pemimpin adil berteknologi tinggi (benteng tembaga besi penahan Ya’juj-Ma’juj) yang tetap rendah hati.',
    ],
    hukumIslam: {
      perintah: [
        'Membiasakan mengucapkan "Insya Allah" saat berjanji melakukan sesuatu di masa depan (ayat 23-24).',
        'Bersabar bersama orang-orang yang senantiasa menyeru Tuhan mereka di waktu pagi dan petang (ayat 28).',
        'Memurnikan amal ibadah hanya untuk Allah tanpa mempersekutukan-Nya dengan apa pun (ayat 110).',
      ],
      larangan: [
        'Memperdebatkan jumlah detail yang tidak penting tanpa dasar ilmu wahyu (seperti spekulasi jumlah pemuda gua, ayat 22).',
        'Mengikuti kemauan orang yang hatinya telah dilalaikan dari mengingat Allah dan menuruti hawa nafsunya (ayat 28).',
      ],
      prinsipSyariah: 'Menjaga kemurnian tauhid dari sekularisme, menjaga tawadhu dalam ilmu pengetahuan, dan memanfaatkan kekuasaan untuk proteksi masyarakat rentan.',
    },
    keterkaitanAntarSurah: {
      denganSebelumnya: 'Al-Isra dibuka dengan tasbih dan diakhiri dengan tahmid; Al-Kahf dibuka langsung dengan tahmid atas diturunkannya Al-Qur’an yang lurus tanpa bengkok.',
      denganSesudahnya: 'Al-Kahf mengisahkan mukjizat perlindungan fisik selama 309 tahun; Maryam melanjutkan dengan mukjizat kelahiran biologis tanpa perantara ayah.',
      benangMerah: 'Al-Qur’an adalah kompas penunjuk arah yang menyelamatkan akal dan hati manusia dari kebingungan menghadapi tipuan peradaban materi.',
    },
    gambaranBesar: {
      posisiDalamQuran: 'Surah Kedelapan Belas (Jantung mushaf Al-Qur’an: pertengahan juz 15-16, perisai peradaban menghadapi hegemoni fitnah Dajjal).',
      petaAlurTema: [
        { ayatRange: 'Ayat 1-8', title: 'Kesempurnaan Al-Qur’an & Ujian Hiasan Bumi', coreMessage: 'Al-Qur’an penunjuk jalan lurus dan penegasan bahwa gemerlap bumi diciptakan semata untuk menguji siapa yang terbaik amalnya.' },
        { ayatRange: 'Ayat 9-31', title: 'Kisah Pemuda Gua (Fitnah Agama)', coreMessage: 'Pelarian tauhid pemuda Kahfi, tidur ajaib 309 tahun, bangun di era baru, dan perisai dzikir pagi-petang.' },
        { ayatRange: 'Ayat 32-49', title: 'Kisah Pemilik Dua Kebun (Fitnah Harta)', coreMessage: 'Dialog orang kaya arogan vs mukmin sederhana, hancurnya kebun kebanggaan, dan hakikat kefanaan duniawi.' },
        { ayatRange: 'Ayat 50-82', title: 'Kisah Nabi Musa & Khidhir (Fitnah Ilmu)', coreMessage: 'Teguran Iblis, perjalanan mencari guru Khidhir, 3 misteri perahu, anak muda, dan dinding anak yatim.' },
        { ayatRange: 'Ayat 83-110', title: 'Kisah Dzulqarnain (Fitnah Kekuasaan) & Ayat Penutup', coreMessage: 'Ekspedisi barat-timur, benteng besi pencegah Ya’juj Ma’juj, kerugian orang yang sia-sia amalnya, dan lautan tinta yang tak cukup menulis kalimat Allah.' },
      ],
      kunciPesan: 'Kekayaan, ilmu, dan kekuasaan adalah ujian berat; benteng terkuat menghadapinya adalah tawadhu, kesadaran akhirat, dan kepatuhan pada wahyu.',
    },
  },
  {
    surahNumber: 36,
    surahName: 'Yasin',
    arabicName: 'يس',
    meaning: 'Yasin (Jantung Al-Qur’an)',
    revelationType: 'Makkiyyah',
    numberOfAyahs: 83,
    chronologicalOrder: 41,
    juz: 'Juz 22 & 23',
    estimatedReadingMinutes: 8,
    pokokKandungan: {
      temaUtama: 'Tiga pilar utama Islam: Kerasulan Muhammad SAW, kemukjizatan Al-Qur’an, dan kepastian hari kebangkitan jasmani setelah tulang belulang hancur.',
      konteksDanLatarBelakang: 'Diturunkan di Makkah saat para pembesar Quraisy mencemooh gagasan bahwa manusia yang telah menjadi tanah dapat dihidupkan kembali.',
      urgensiMemahami: 'Dikenal sebagai "Qalbul Qur’an" (Jantung Al-Qur’an) karena ritmenya yang menghentak nurani dan merangkum tauhid, risalah, serta eskatologi akhirat secara utuh.',
    },
    pelajaranDanHikmah: [
      'Kisah Habib an-Najjar (lelaki dari ujung kota): keberanian membela dakwah para rasul meski harus mengorbankan nyawa; seketika disambut dengan ucapan: "Masuklah ke dalam surga!"',
      'Tanda-tanda kebesaran Allah di alam semesta: tanah tandus yang dihidupkan dengan air hujan, pergantian malam-siang, peredaran matahari pada garis edarnya, dan kapal yang berlayar.',
      'Pada hari kiamat, mulut manusia akan dikunci rapat; tangan yang akan berbicara dan kaki yang akan bersaksi atas seluruh perbuatan di dunia.',
      'Kemudahan Allah membangkitkan ciptaan: cukup dengan berfirman "Kun fayakuun" (Jadilah! Maka terjadilah).',
    ],
    hukumIslam: {
      perintah: [
        'Memperhatikan ayat-ayat kauniyah (alam semesta) sebagai sarana memperkuat iman kepada Hari Kiamat.',
        'Mengikuti seruan para pendakwah yang ikhlas tanpa meminta imbalan materi (ayat 21).',
      ],
      larangan: [
        'Larangan menganggap remeh hari kebangkitan atau mendebat kekuasaan Allah dengan analogi picik manusia (ayat 77-79).',
        'Menyembah setan dan hawa nafsu sebagai bentuk pengkhianatan terhadap perjanjian primordial (ayat 60).',
      ],
      prinsipSyariah: 'Meneguhkan keimanan pada rukun iman kelima (Hari Akhir) sebagai pendorong utama kesalehan moral manusia.',
    },
    keterkaitanAntarSurah: {
      denganSebelumnya: 'Fathir memaparkan malaikat pencatat amal dan keagungan ciptaan; Yasin melanjutkan dengan konfrontasi langsung mengenai hisab amal di hadapan Allah.',
      denganSesudahnya: 'Yasin diakhiri dengan tasbih kepada Pemilik kerajaan alam; Ash-Shaffat dibuka dengan barisan malaikat yang bersumpah menegakkan tauhid.',
      benangMerah: 'Kematian bukan titik akhir, melainkan pintu gerbang menuju keadilan sejati yang tak terelakkan.',
    },
    gambaranBesar: {
      posisiDalamQuran: 'Surah Ke-36 (Jantung Al-Qur’an yang menggugah kesadaran jiwa manusia akan hakikat hidup, mati, dan kebangkitan).',
      petaAlurTema: [
        { ayatRange: 'Ayat 1-12', title: 'Sumpah Kerasulan & Belenggu Kekafiran', coreMessage: 'Kerasulan Muhammad SAW yang hakiki dan hati yang terkunci akibat kesombongan.' },
        { ayatRange: 'Ayat 13-32', title: 'Kisah Penduduk Negeri & Keteladanan Syuhada', coreMessage: 'Tiga rasul yang ditolak, pembelaan lelaki saleh dari ujung kota, dan azab satu teriakan dahsyat.' },
        { ayatRange: 'Ayat 33-47', title: 'Tafakkur Fenomena Kosmologis', coreMessage: 'Bumi mati yang berbuah, orbit matahari-bulan, dan kapal bahtera sebagai sarana transportasi manusia.' },
        { ayatRange: 'Ayat 48-70', title: 'Sangkakala Kiamat, Suasana Surga, & Kesaksian Anggota Tubuh', coreMessage: 'Kebangkitan dari kubur, kenikmatan salamun qaulam mir rabbir rahiim, pemisahan pendosa, dan kesaksian tangan-kaki.' },
        { ayatRange: 'Ayat 71-83', title: 'Bantahan Logika Kebangkitan Tulang Hancur', coreMessage: 'Dzat yang menciptakan pertama kali pasti mampu mengulanginya; kemahakuasaan Kun Fayakuun.' },
      ],
      kunciPesan: 'Tuhan yang mampu menumbuhkan pohon hijau dari air dingin dan menyalakan api dari kayu basah, teramat mudah menghidupkan kembali jasadmu untuk mempertanggungjawabkan setiap detik umurmu.',
    },
  },
  {
    surahNumber: 55,
    surahName: 'Ar-Rahman',
    arabicName: 'الرحمن',
    meaning: 'Yang Maha Pengasih',
    revelationType: 'Madaniyyah',
    numberOfAyahs: 78,
    chronologicalOrder: 97,
    juz: 'Juz 27',
    estimatedReadingMinutes: 8,
    pokokKandungan: {
      temaUtama: 'Tadabbur curahan nikmat Allah yang tak terhitung di alam semesta, dunia manusia dan jin, serta penggambaran detail surga dan neraka.',
      konteksDanLatarBelakang: 'Diturunkan untuk menyadarkan jin dan manusia agar tidak menjadi makhluk yang kufur nikmat, dihiasi pengulangan retoris sebanyak 31 kali.',
      urgensiMemahami: 'Dikenal sebagai "‘Arusul Qur’an" (Pengantin Al-Qur’an) karena keindahan ritme fonetiknya yang memikat dan pesan syukurnya yang mendalam.',
    },
    pelajaranDanHikmah: [
      'Pertanyaan retoris yang menggetarkan: "Fabiayyi aalaaa’i rabbikumaa tukadzdzibaan?" (Maka nikmat Tuhanmu yang manakah yang kamu dustakan?).',
      'Keseimbangan kosmis: Allah menegakkan mizan (timbangan keadilan) di langit, maka janganlah manusia merusak timbangan dalam kehidupan sosial.',
      'Dua laut yang mengalir berdampingan namun tidak saling melampaui karena ada batas pemisah (barzakh) sebagai fenomena sains oseanografi.',
      'Segala sesuatu di muka bumi akan binasa; yang kekal abadi hanyalah Wajah Tuhanmu Yang Memiliki Keagungan dan Kemuliaan.',
    ],
    hukumIslam: {
      perintah: [
        'Menegakkan timbangan keadilan dengan jujur dan larangan mengurangi takaran (ayat 9).',
        'Mensyukuri setiap helaan nafas dan fasilitas hidup yang diciptakan Allah.',
      ],
      larangan: [
        'Mendustakan nikmat Allah lewat lisan, hati, maupun tindakan kemaksiatan.',
        'Mencoba menembus penjuru langit dan bumi untuk lari dari hisab Allah tanpa izin dan kekuatan-Nya (ayat 33).',
      ],
      prinsipSyariah: 'Menjaga keadilan transaksi ekonomi dan etika ekologis melestarikan ciptaan Allah.',
    },
    keterkaitanAntarSurah: {
      denganSebelumnya: 'Al-Qamar mengulas azab-azab yang menimpa kaum pembangkang; Ar-Rahman menyeimbangkannya dengan hamparan rahmat dan keindahan surga.',
      denganSesudahnya: 'Ar-Rahman melukiskan keindahan dua pasang surga; Al-Waqi’ah mengelompokkan manusia secara detail menjadi tiga golongan di hari kiamat.',
      benangMerah: 'Rahmat Allah mendahului murka-Nya; syukur adalah kunci mempertahankan kelimpahan karunia.',
    },
    gambaranBesar: {
      posisiDalamQuran: 'Surah Ke-55 (Simfoni syukur agung yang meruntuhkan kesombongan jin dan manusia).',
      petaAlurTema: [
        { ayatRange: 'Ayat 1-25', title: 'Nikmat Pengajaran Al-Qur’an & Keseimbangan Kosmis', coreMessage: 'Allah mengajarkan Al-Qur’an, menciptakan manusia berbicara, orbit matahari-bulan, dan dua lautan yang berdampingan.' },
        { ayatRange: 'Ayat 26-45', title: 'Kefanaan Total Semesta & Ketakberdayaan Menembus Langit', coreMessage: 'Kullu man ‘alaihaa faan; ketidakberdayaan jin-manusia lari dari hisab, dan rupa pendosa di hari hisab.' },
        { ayatRange: 'Ayat 46-61', title: 'Dua Surga Tingkat Pertama (Jannataan)', coreMessage: 'Bagi yang takut pada kebesaran Tuhannya: mata air mengalir, buah-buahan berpasangan, dan bidadari penyejuk mata.' },
        { ayatRange: 'Ayat 62-78', title: 'Dua Surga Tingkat Kedua & Pujian Asma Allah', coreMessage: 'Dua surga hijau gelap, kemah-kemah mutiara, dan penutup agung: Tabaarakasmu rabbika dzil jalaali wal ikraam.' },
      ],
      kunciPesan: 'Tidak ada alasan bagi hamba untuk tidak bersyukur; nikmat-Nya mengepung kita dari ujung langit hingga dasar palung lautan.',
    },
  },
  {
    surahNumber: 56,
    surahName: "Al-Waqi'ah",
    arabicName: 'الواقعة',
    meaning: 'Hari Kiamat yang Pasti Terjadi',
    revelationType: 'Makkiyyah',
    numberOfAyahs: 96,
    chronologicalOrder: 46,
    juz: 'Juz 27',
    estimatedReadingMinutes: 8,
    pokokKandungan: {
      temaUtama: 'Tiga kategori manusia saat kiamat tiba: As-Sabiqun (Golongan Terdepan), Ashabul Yamin (Golongan Kanan), dan Ashabusy Syimal (Golongan Kiri).',
      konteksDanLatarBelakang: 'Diturunkan di Makkah untuk meruntuhkan strata sosial palsu jahiliyah dan menetapkan bahwa kemuliaan manusia hanya dinilai dari amal salehnya.',
      urgensiMemahami: 'Membimbing manusia menata prioritas hidup: tidak sekadar menjadi orang rata-rata, melainkan berjuang menjadi golongan pelopor kebaikan (Muqarrabun).',
    },
    pelajaranDanHikmah: [
      'Kiamat adalah "Khafidhatur Rafi’ah" (Merendahkan yang tinggi dan meninggikan yang rendah): menjungkirbalikkan status sosial duniawi.',
      'As-Sabiqunas Sabiqun: mereka yang bersegera dalam ketaatan di dunia akan menjadi tetangga dekat Allah di surga kenikmatan.',
      'Refleksi penciptaan biologis dan agraria: Siapakah yang memancarkan air mani? Siapakah yang menumbuhkan benih? Siapakah yang menurunkan air tawar dari awan mendung?',
      'Menghadapi sakaratul maut: saat nyawa telah sampai di kerongkongan, tidak ada dokter atau keluarga yang mampu menahannya.',
    ],
    hukumIslam: {
      perintah: [
        'Bertasbih mengagungkan nama Tuhan Yang Maha Besar (ayat 74, 96).',
        'Menyentuh mushaf Al-Qur’an dalam keadaan suci: "Tidak menyentuhnya kecuali hamba-hamba yang disucikan" (ayat 79).',
      ],
      larangan: [
        'Melakukan dosa-dosa besar secara terus-menerus dan membangkang terhadap kebenaran wahyu (ayat 46).',
        'Mendustakan rezeki dari Allah dengan mengaitkannya semata-mata pada faktor bintang atau keberuntungan.',
      ],
      prinsipSyariah: 'Menjaga kesucian interaksi terhadap kitab suci dan menumbuhkan mentalitas perlombaan dalam amal kebajikan (fastabiqul khairat).',
    },
    keterkaitanAntarSurah: {
      denganSebelumnya: 'Ar-Rahman menggambarkan kenikmatan surga; Al-Waqi’ah menjelaskan siapa saja kriteria penghuni yang berhak menempatinya.',
      denganSesudahnya: 'Al-Waqi’ah ditutup dengan tasbih agung; Al-Hadid dibuka dengan tasbih seluruh penghuni langit dan bumi serta seruan infaq.',
      benangMerah: 'Kedudukan manusia di akhirat ditentukan secara mutlak oleh responnya terhadap seruan dakwah tauhid selama di dunia.',
    },
    gambaranBesar: {
      posisiDalamQuran: 'Surah Ke-56 (Peta demografi akhirat dan pengelompokan abadi umat manusia).',
      petaAlurTema: [
        { ayatRange: 'Ayat 1-10', title: 'Terjadinya Al-Waqi’ah & Pembagian Tiga Golongan', coreMessage: 'Bumi bergoncang dahsyat, gunung hancur lebur jadi debu, dan munculnya 3 faksi manusia.' },
        { ayatRange: 'Ayat 11-26', title: 'Potret Kemuliaan As-Sabiqun (Al-Muqarrabun)', coreMessage: 'Dipan bertatahkan emas permata, bejana perak, buah pilihan, dan ucapan kedamaian (Salamaa Salamaa).' },
        { ayatRange: 'Ayat 27-40', title: 'Potret Kenikmatan Ashabul Yamin (Golongan Kanan)', coreMessage: 'Pohon bidara tak berduri, naungan terbentang luas, air tercurah, dan kasur empuk tebal.' },
        { ayatRange: 'Ayat 41-56', title: 'Potret Siksaan Ashabusy Syimal (Golongan Kiri)', coreMessage: 'Angin sangat panas, air mendidih, asap hitam pekat, pohon zaqqum, dan minuman air panas mendidih.' },
        { ayatRange: 'Ayat 57-96', title: 'Argumen Sains Penciptaan & Momen Sakaratul Maut', coreMessage: 'Air mani, benih tanaman, air hujan, api kayu, momen roh di kerongkongan, dan kepastian Haqqul Yaqin.' },
      ],
      kunciPesan: 'Pilihlah nasib akhiratmu hari ini: menjadi pelopor terdepan yang mendekat kepada-Nya, atau terlempar dalam penyesalan abadi.',
    },
  },
  {
    surahNumber: 67,
    surahName: 'Al-Mulk',
    arabicName: 'الملك',
    meaning: 'Kerajaan / Kekuasaan',
    revelationType: 'Makkiyyah',
    numberOfAyahs: 30,
    chronologicalOrder: 77,
    juz: 'Juz 29',
    estimatedReadingMinutes: 6,
    pokokKandungan: {
      temaUtama: 'Kekuasaan mutlak Allah atas kehidupan dan kematian, kesempurnaan ciptaan alam semesta tanpa cacat, dan penyelamat dari siksa kubur.',
      konteksDanLatarBelakang: 'Diturunkan di Makkah untuk membuka Juz 29 (Juz Tabarak), menantang manusia mencari cacat dalam penciptaan langit bertingkat.',
      urgensiMemahami: 'Dikenal sebagai "Al-Munjiyah" (Penyelamat) dan "Al-Waqiyah" (Pelindung); Rasulullah SAW tidak tidur sebelum membacanya setiap malam.',
    },
    pelajaranDanHikmah: [
      'Tujuan hidup dan mati: "Alladzii khalaqal mauta wal hayaata liyabluwakum ayyukum ahsanu ‘amalaa" (Dialah yang menciptakan mati dan hidup untuk menguji siapa yang terbaik amalnya).',
      'Observasi kesempurnaan langit: pandanglah berulang kali ke angkasa, pandanganmu akan kembali dalam keadaan lelah tanpa menemukan celah sedikit pun.',
      'Mendengarkan dan berpikir sehat: penyesalan penghuni neraka adalah karena mereka tidak menggunakan akal dan pendengaran saat di dunia.',
      'Burung yang terbang mengembangkan dan mengatupkan sayapnya di udara hanya ditahan oleh rahmat Allah Yang Maha Pengasih.',
    ],
    hukumIslam: {
      perintah: [
        'Membaca dan merenungi Surah Al-Mulk secara rutin setiap malam sebelum tidur sebagai syafaat di alam barzakh.',
        'Berjalan di berbagai penjuru bumi dan memakan sebagian dari rezeki-Nya dengan kesadaran akan hari kebangkitan (ayat 15).',
      ],
      larangan: [
        'Merasa aman dari ancaman murka Allah (seperti bumi yang digoncangkan atau badai batu yang dihujankan, ayat 16-17).',
        'Menyembunyikan niat buruk: sesungguhnya Allah Maha Mengetahui apa yang tersimpan dalam rongga dada.',
      ],
      prinsipSyariah: 'Menjaga ketundukan tauhid dan memfungsikan panca indra (pendengaran, penglihatan, hati nurani) untuk beriman.',
    },
    keterkaitanAntarSurah: {
      denganSebelumnya: 'At-Tahrim menutup juz 28 dengan contoh wanita salehah vs wanita kufur; Al-Mulk membuka juz 29 dengan menatap cakrawala kosmis kerajaan Allah.',
      denganSesudahnya: 'Al-Mulk menguji kesadaran akal akan ciptaan; Al-Qalam mencontohkan akhlak agung Nabi Muhammad SAW dan ujian harta pemilik kebun.',
      benangMerah: 'Seluruh kerajaan langit dan bumi berada di genggaman tangan Allah; selamatkan dirimu dengan amal terbaik.',
    },
    gambaranBesar: {
      posisiDalamQuran: 'Surah Ke-67 (Pintu gerbang Juz Tabarak dan benteng pertahanan spiritual dari kegelapan alam kubur).',
      petaAlurTema: [
        { ayatRange: 'Ayat 1-5', title: 'Kerajaan Allah, Ujian Hidup-Mati, & Langit Berlapis', coreMessage: 'Kekuasaan mutlak, tujuan eksistensial hidup-mati, dan kesempurnaan arsitektur kosmik.' },
        { ayatRange: 'Ayat 6-12', title: 'Gejolak Neraka Jahannam & Penyesalan Akal', coreMessage: 'Suara neraka yang menyala-nyala, dialog malaikat penjaga, dan pengakuan penghuni neraka atas kelalaian akal.' },
        { ayatRange: 'Ayat 13-22', title: 'Keluasan Rezeki Bumi & Kepasrahan Burung Terbang', coreMessage: 'Bumi yang ditundukkan untuk dijelajahi, ancaman bencana mendadak, dan sayap burung di angkasa.' },
        { ayatRange: 'Ayat 23-30', title: 'Pertanyaan Eksistensial Sumber Air Bersih', coreMessage: 'Penciptaan indra, kepastian janji kiamat, dan renungan: jika airmu mengering ke dalam tanah, siapakah yang sanggup mengalirkan air jernih untukmu?' },
      ],
      kunciPesan: 'Tolak ukur kesuksesan hidup di mata Allah bukan siapa yang paling banyak menumpuk harta, melainkan siapa yang mempersembahkan amal terbaik (ahsanu ‘amala).',
    },
  },
  {
    surahNumber: 112,
    surahName: 'Al-Ikhlas',
    arabicName: 'الإخلاص',
    meaning: 'Kemurnian Tauhid',
    revelationType: 'Makkiyyah',
    numberOfAyahs: 4,
    chronologicalOrder: 22,
    juz: 'Juz 30',
    estimatedReadingMinutes: 5,
    pokokKandungan: {
      temaUtama: 'Pemurnian konsep ketuhanan secara total dari segala bentuk antropomorfisme, syirik, sekutu, dan silsilah keturunan.',
      konteksDanLatarBelakang: 'Diturunkan sebagai jawaban telak saat kaum musyrik Makkah meminta Nabi SAW menyebutkan nasab atau bahan pembuat Tuhannya (apakah dari emas, perak, atau tembaga).',
      urgensiMemahami: 'Bernilai setara dengan sepertiga Al-Qur’an (Tsulutsul Qur’an) karena Al-Qur’an terbagi menjadi tiga bahasan pokok: akidah, hukum syariat, dan sejarah; surah ini merangkum seluruh akidah tauhid.',
    },
    pelajaranDanHikmah: [
      'Keesaan Allah (Ahad): Allah Maha Tunggal dalam esensi Dzat, sifat, dan perbuatan-Nya; tiada tuhan selain Dia.',
      'As-Shamad: Tempat bergantung seluruh makhluk di alam semesta; Dia tidak membutuhkan apa pun, sedangkan segala sesuatu membutuhkan-Nya.',
      'Membantah doktrin politeisme dan trinitas: "Lam yalid wa lam yuulad" (Dia tidak beranak dan tidak pula diperanakkan).',
      'Tiada tandingan atau kesetaraan (Kufuwan ahad): Allah sama sekali tidak serupa dengan apa pun di antara makhluk-Nya.',
    ],
    hukumIslam: {
      perintah: [
        'Membaca Surah Al-Ikhlas secara rutin dalam wirid pagi-petang, sebelum tidur, dan setelah sholat fardhu.',
        'Mengesakan Allah secara mutlak dalam niat, doa, dan peribadatan.',
      ],
      larangan: [
        'Menyerupakan Allah dengan makhluk atau membayangkan bentuk Dzat-Nya dengan khayalan fisik.',
        'Meyakini Allah memiliki keturunan atau orang tua.',
      ],
      prinsipSyariah: 'Menjaga orisinalitas akidah Islam dari kontaminasi paganisme dan penyimpangan teologis.',
    },
    keterkaitanAntarSurah: {
      denganSebelumnya: 'Al-Lahab menceritakan kehancuran musuh tauhid (Abu Lahab); Al-Ikhlas menegaskan hakikat inti tauhid yang diperjuangkan.',
      denganSesudahnya: 'Setelah meneguhkan tauhid murni di Al-Ikhlas, dua surah penutup (Al-Falaq dan An-Naas) mengajarkan bagaimana berlindung dengan tauhid tersebut dari kejahatan makhluk.',
      benangMerah: 'Tauhid adalah jantung peradaban Islam; tanpanya, seluruh bangunan amal akan gugur sia-sia.',
    },
    gambaranBesar: {
      posisiDalamQuran: 'Surah Ke-112 (Puncak kemurnian doktrin monoteisme Islam di penghujung mushaf).',
      petaAlurTema: [
        { ayatRange: 'Ayat 1-2', title: 'Deklarasi Ke-Esaan & As-Shamad', coreMessage: 'Katakanlah: Dialah Allah Yang Maha Esa; Allah tempat bergantung segala sesuatu.' },
        { ayatRange: 'Ayat 3-4', title: 'Penyucian dari Silsilah & Ketiadaan Tandingan', coreMessage: 'Dia tidak beranak dan tidak diperanakkan, dan tiada satu pun yang setara dengan-Nya.' },
      ],
      kunciPesan: 'Tuhan yang sejati tidak membutuhkan pembelaan darah atau silsilah; Dia Maha Berdiri Sendiri, tempat bersandar seluruh alam semesta.',
    },
  },
  {
    surahNumber: 113,
    surahName: 'Al-Falaq',
    arabicName: 'الفلق',
    meaning: 'Waktu Subuh',
    revelationType: 'Makkiyyah',
    numberOfAyahs: 5,
    chronologicalOrder: 20,
    juz: 'Juz 30',
    estimatedReadingMinutes: 5,
    pokokKandungan: {
      temaUtama: 'Permohonan perlindungan kepada Penguasa fajar dari empat bahaya fisik dan metafisik eksternal: kejahatan makhluk, kegelapan malam, sihir, dan kedengkian (hasad).',
      konteksDanLatarBelakang: 'Diturunkan bersama Surah An-Naas (Al-Mu’awwidzatain) sebagai obat dan benteng saat Nabi Muhammad SAW disihir oleh seorang Yahudi bernama Labid bin al-A’sham.',
      urgensiMemahami: 'Membentengi diri dari energi negatif eksternal, penyakit ‘ain (pandangan dengki), dan praktik okultisme yang merusak ketentraman jiwa.',
    },
    pelajaranDanHikmah: [
      'Rabbul Falaq: Allah mampu membelah kegelapan malam pekat dengan cahaya subuh yang gemilang; Dia pasti sanggup mengangkat segala kesulitan hidupmu.',
      'Bahaya malam gelap (ghasiqin idza waqab): malam hari sering menjadi waktu beraksinya kejahatan manusia, hewan buas, dan gangguan jin.',
      'Sihir adalah realitas yang berbahaya (an-naffatsati fil ‘uqad): perlindungan terbaik bukan jimat atau dukun, melainkan kalamullah.',
      'Racun kedengkian (hasad): orang yang dengki berusaha melenyapkan nikmat dari orang lain; bentengnya adalah tawakal kepada Allah.',
    ],
    hukumIslam: {
      perintah: [
        'Membaca Al-Falaq 3 kali setiap pagi dan sore bersama Al-Ikhlas dan An-Naas untuk mencukupi dari segala marabahaya.',
        'Meniupkan bacaan ke telapak tangan lalu mengusapkannya ke seluruh tubuh sebelum tidur.',
      ],
      larangan: [
        'Memiliki sifat hasad (dengki) terhadap nikmat yang Allah karuniakan kepada orang lain.',
        'Mendatangi atau mempraktikkan sihir, perdukunan, dan buhul-buhul gaib.',
      ],
      prinsipSyariah: 'Menjaga keselamatan jiwa raga (hifzhun nafs) dari ancaman fisik maupun non-fisik.',
    },
    keterkaitanAntarSurah: {
      denganSebelumnya: 'Al-Ikhlas mengajarkan siapa Tuhan yang kita sembah; Al-Falaq mengajarkan bagaimana memohon perlindungan kepada-Nya dari bahaya duniawi eksternal.',
      denganSesudahnya: 'Al-Falaq fokus pada bahaya eksternal (makhluk, malam, sihir, hasad); An-Naas fokus pada bahaya internal yang paling berbahaya: bisikan godaan setan di dalam dada.',
      benangMerah: 'Tiada tempat berlindung yang hakiki dari marabahaya kosmis selain kepada Dzat yang membelah fajar.',
    },
    gambaranBesar: {
      posisiDalamQuran: 'Surah Ke-113 (Perisai perlindungan pertama dari bahaya luar dan racun kedengkian).',
      petaAlurTema: [
        { ayatRange: 'Ayat 1-2', title: 'Perlindungan kepada Penguasa Fajar', coreMessage: 'Katakanlah: Aku berlindung kepada Tuhan yang menguasai subuh dari kejahatan makhluk yang Dia ciptakan.' },
        { ayatRange: 'Ayat 3-5', title: 'Tiga Ancaman Spesifik: Malam, Sihir, & Hasad', coreMessage: 'Berlindung dari malam yang gulita, wanita-wanita penyihir pada buhul, dan orang yang dengki ketika ia mendengki.' },
      ],
      kunciPesan: 'Cahaya fajar Allah selalu lebih kuat daripada seribu kegelapan malam; bentengi dirimu dengan Al-Qur’an dari racun kedengkian manusia.',
    },
  },
  {
    surahNumber: 114,
    surahName: 'An-Naas',
    arabicName: 'الناس',
    meaning: 'Manusia',
    revelationType: 'Makkiyyah',
    numberOfAyahs: 6,
    chronologicalOrder: 21,
    juz: 'Juz 30',
    estimatedReadingMinutes: 5,
    pokokKandungan: {
      temaUtama: 'Permohonan perlindungan kepada Pemelihara, Raja, dan Sesembahan manusia dari musuh internal yang paling berbahaya: bisikan jahat setan dan manusia perusak hati.',
      konteksDanLatarBelakang: 'Surah penutup Al-Qur’an yang menyempurnakan perisai spiritual manusia, membongkar taktik gerilya setan pembisik (al-waswas al-khannas).',
      urgensiMemahami: 'Menutup mushaf dengan mengingatkan bahwa medan perang terbesar seorang manusia bukanlah melawan musuh fisik, melainkan perang batin menjaga kemurnian hati dari bisikan was-was.',
    },
    pelajaranDanHikmah: [
      'Tiga gelar keagungan Allah terkait manusia: Rabbin-naas (Pencipta & Pemelihara), Malikin-naas (Raja Penguasa), dan Ilaahin-naas (Satu-satunya Sesembahan).',
      'Karakter Al-Khannas: setan akan membisikkan keraguan saat manusia lalai, namun ia akan mundur bersembunyi (khannas) begitu asma Allah diingat.',
      'Dua jenis pembisik: "Minal jinnati wan-naas" (dari golongan jin dan golongan manusia). Sahabat buruk yang mengajak maksiat seringkali lebih berbahaya daripada bisikan jin.',
      'Kesempurnaan arsitektur mushaf: dimulai dari memohon petunjuk di Al-Fatihah, ditutup dengan memohon perlindungan dari bisikan yang merusak petunjuk tersebut di An-Naas.',
    ],
    hukumIslam: {
      perintah: [
        'Menjadikan Surah An-Naas sebagai wirid harian wajib perlindungan diri dari gangguan was-was sholat dan keraguan iman.',
        'Membentengi rumah dari godaan setan dengan dzikir dan tilawah Al-Qur’an.',
      ],
      larangan: [
        'Menyerah pada bisikan was-was dalam berwudhu, sholat, dan akidah.',
        'Menjadi "setan manusia" yang memprovokasi, mengadu domba, dan membisikkan kejahatan kepada sesama.',
      ],
      prinsipSyariah: 'Menjaga kemurnian jiwa (tazkiyatun nafs) dan kesehatan mental spiritual manusia.',
    },
    keterkaitanAntarSurah: {
      denganSebelumnya: 'Al-Falaq melindungi raga dari kejahatan makhluk luar; An-Naas melindungi jiwa dari penyakit was-was dalam hati.',
      denganSesudahnya: 'Sebagai surah penutup, An-Naas terhubung melingkar dengan pembuka Al-Qur’an (Al-Fatihah): Al-Fatihah diawali "Alhamdu lillahi Rabbil ‘Alamin" (Rabb semesta alam), sedangkan An-Naas diakhiri "Qul a’udzu bi Rabbin-Naas" (Rabb manusia). Sebuah lingkaran mahakarya yang saling menyempurnakan.',
      benangMerah: 'Perjalanan Al-Qur’an dimulai dengan doa mencari petunjuk hidup, dan ditutup dengan perisai agar petunjuk tersebut tidak dicuri oleh bisikan setan.',
    },
    gambaranBesar: {
      posisiDalamQuran: 'Surah Ke-114 (Khatimah / Penutup agung seluruh 30 juz Al-Qur’an Al-Karim).',
      petaAlurTema: [
        { ayatRange: 'Ayat 1-3', title: 'Tiga Dimensi Rububiyyah, Mulkiyyah, & Uluhiyyah', coreMessage: 'Katakanlah: Aku berlindung kepada Rabb manusia, Raja manusia, dan Sembahan manusia.' },
        { ayatRange: 'Ayat 4-6', title: 'Identifikasi Musuh Tersembunyi: Al-Khannas', coreMessage: 'Dari kejahatan bisikan yang bersembunyi, yang membisikkan ke dalam dada manusia, dari golongan jin dan manusia.' },
      ],
      kunciPesan: 'Tutup lembaran harimu dan perjalanan hidupmu dengan senantiasa bersandar pada Raja Manusia; jangan biarkan bisikan fana mengotori hatimu.',
    },
  },
];

// Helper to retrieve mapping by surah number
export function getQuranMapping(surahNumber: number): QuranMappingItem | undefined {
  return QURAN_MAPPING_LIST.find((item) => item.surahNumber === surahNumber);
}

// Fallback generator for other surahs to ensure all 114 surahs are fully accessible in mapping view
export function getOrGenerateSurahMapping(surah: {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}): QuranMappingItem {
  const existing = getQuranMapping(surah.number);
  if (existing) return existing;

  const isMakkiyyah = surah.revelationType === 'Meccan';
  const typeText = isMakkiyyah ? 'Makkiyyah' : 'Madaniyyah';

  return {
    surahNumber: surah.number,
    surahName: surah.englishName,
    arabicName: surah.name,
    meaning: surah.englishNameTranslation,
    revelationType: typeText,
    numberOfAyahs: surah.numberOfAyahs,
    chronologicalOrder: surah.number,
    juz: surah.number <= 2 ? 'Juz 1' : surah.number <= 11 ? 'Juz 1-11' : surah.number <= 77 ? 'Juz 12-28' : 'Juz 29-30',
    estimatedReadingMinutes: Math.min(15, Math.max(5, Math.ceil(surah.numberOfAyahs / 15))),
    pokokKandungan: {
      temaUtama: `Penegasan tauhid, kebenaran wahyu ilahi, dan bimbingan hidup melalui Surah ${surah.englishName} (${surah.englishNameTranslation}).`,
      konteksDanLatarBelakang: `Diturunkan pada periode ${typeText}, memuat ${surah.numberOfAyahs} ayat yang membimbing kaum mukminin dalam menata ketakwaan dan memperkuat keyakinan atas janji Allah.`,
      urgensiMemahami: `Memahami pesan sentral Surah ${surah.englishName} untuk mengambil pelajaran praktis, panduan hukum, dan keterkaitannya dengan surah-surah sebelum dan sesudahnya dalam grand design Al-Qur’an.`,
    },
    pelajaranDanHikmah: [
      `Memperkuat komitmen ketakwaan dan ketundukan kepada Allah dalam kehidupan pribadi maupun sosial.`,
      `Menjadikan nilai-nilai Surah ${surah.englishName} sebagai cermin refleksi diri dalam menghadapi ujian dan dinamika hidup.`,
      `Merenungkan ayat-ayat kauniyah dan sejarah umat terdahulu untuk mengambil hikmah keselamatan.`,
      `Menjaga istiqamah di jalan kebaikan dan memperbanyak amal saleh sebelum datangnya hari hisab.`,
    ],
    hukumIslam: {
      perintah: [
        `Menegakkan ibadah dengan ikhlas dan memperbanyak dzikir serta tadabbur ayat-ayat Allah.`,
        `Berlaku adil, berbuat ihsan, dan menjaga hubungan silaturahim dengan sesama.`,
      ],
      larangan: [
        `Menjauhi segala bentuk kemusyrikan, kesombongan, dan pembangkangan terhadap petunjuk rasul.`,
        `Larangan berbuat aniaya dan menyia-nyiakan amanah hidup.`,
      ],
      prinsipSyariah: `Mewujudkan maqashid syariah: memelihara agama, jiwa, akal, keturunan, dan harta dalam koridor ridha ilahi.`,
    },
    keterkaitanAntarSurah: {
      denganSebelumnya: `Melanjutkan benang merah tema dan hikmah dari surah sebelumnya dalam rangkaian mushaf.`,
      denganSesudahnya: `Mempersiapkan pembaca menyambut pesan pelengkap yang akan diuraikan pada surah berikutnya.`,
      benangMerah: `Bagian integral dari mozaik 114 surah yang saling menguatkan sebagai satu kesatuan petunjuk hidup paripurna.`,
    },
    gambaranBesar: {
      posisiDalamQuran: `Surah Ke-${surah.number} dari total 114 surah (${typeText}, ${surah.numberOfAyahs} ayat).`,
      petaAlurTema: [
        {
          ayatRange: `Ayat 1 s/d ${Math.ceil(surah.numberOfAyahs / 2)}`,
          title: 'Prolog & Penegasan Fondasi Risalah',
          coreMessage: `Seruan pengagungan kepada Allah, peringatan bagi manusia, dan penetapan prinsip kebenaran.`,
        },
        {
          ayatRange: `Ayat ${Math.ceil(surah.numberOfAyahs / 2) + 1} s/d ${surah.numberOfAyahs}`,
          title: 'Konsekuensi Amal & Epilog Janji Allah',
          coreMessage: `Penjelasan balasan bagi orang yang taat dan ancaman bagi yang lalai, diakhiri dorongan ketakwaan.`,
        },
      ],
      kunciPesan: `Setiap ayat dalam Surah ${surah.englishName} adalah lentera penerang yang membimbing langkah manusia menuju keselamatan dunia dan akhirat.`,
    },
  };
}
