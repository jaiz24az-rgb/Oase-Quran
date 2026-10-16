import { QuranMedicalEntry } from '../types';

export const MEDICAL_CATEGORIES = [
  { id: 'all', label: 'Semua Kategori', icon: 'Sparkles', color: 'emerald' },
  { id: 'nutrisi-herbal', label: 'Nutrisi & Herbal Nabawi', icon: 'Apple', color: 'emerald' },
  { id: 'biomekanika-ibadah', label: 'Fisiologi Gerakan Ibadah', icon: 'Activity', color: 'indigo' },
  { id: 'kesehatan-mental', label: 'Kesehatan Jiwa & Syifa', icon: 'Brain', color: 'purple' },
  { id: 'embriologi-anatomi', label: 'Embriologi & Tumbuh Kembang', icon: 'Dna', color: 'amber' },
  { id: 'higienitas-pencegahan', label: 'Pencegahan & Higienitas', icon: 'ShieldCheck', color: 'teal' },
] as const;

export const ORGAN_SYSTEMS = [
  { id: 'all', label: 'Semua Organ' },
  { id: 'otak', label: '🧠 Otak & Saraf' },
  { id: 'jantung', label: '🫀 Kardiovaskular' },
  { id: 'pencernaan', label: '🩺 Pencernaan' },
  { id: 'imun', label: '🛡️ Imun & Seluler' },
  { id: 'tulang', label: '🦴 Tulang & Sendi' },
  { id: 'reproduksi', label: '👶 Reproduksi & Anak' },
  { id: 'kulit-mata', label: '👁️ Panca Indra & Kulit' },
] as const;

export const QURAN_MEDICAL_DATA: QuranMedicalEntry[] = [
  {
    id: 'madu-lebah',
    title: 'Madu Lebah (Shifa\' Lin-Naas & Apiterapi Modern)',
    arabicTerm: 'العَسَل (Al-\'Asal)',
    latinScientificName: 'Apis mellifera honey',
    category: 'nutrisi-herbal',
    categoryLabel: 'Nutrisi & Herbal Nabawi',
    organSystems: ['pencernaan', 'imun', 'kulit-mata'],
    summary: 'Cairan dari perut lebah yang ditegaskan Al-Qur\'an sebagai obat (shifa\') bagi manusia. Sains modern membuktikan khasiat antibakteri hidrogen peroksida alami, antioksidan polifenol, dan akselerator penyembuhan luka lambung serta epitelisasi.',
    quranVerse: {
      surahNumber: 16,
      surahName: 'An-Nahl',
      ayahNumber: '68-69',
      arabicText: 'يَخْرُجُ مِنْ بُطُونِهَا شَرَابٌ مُخْتَلِفٌ أَلْوَانُهُ فِيهِ شِفَاءٌ لِلنَّاسِ ۗ إِنَّ فِي ذَٰلِكَ لَآيَةً لِقَوْمٍ يَتَفَكَّرُونَ',
      transliteration: 'Yakhruju mim buthunihaa syaraabum mukhtalifun alwaanuhuu fiihi syifaa-ul lin-naas, inna fii dzaalika la-aayatal liqaumiy yatafakkaruun.',
      translation: '...Dari perut lebah itu keluar minuman (madu) yang bermacam-macam warnanya, di dalamnya terdapat obat yang menyembuhkan bagi manusia. Sungguh, pada yang demikian itu benar-benar terdapat tanda (kebesaran Allah) bagi orang yang berpikir.',
      tafsirBrief: 'Lafaz "fiihi syifaa-ul lin-naas" menggunakan kata "syifa" berstatus nakirah (indefinite), menunjukkan potensi kesembuhan luas untuk berbagai patologi fisik, terutama radang saluran cerna, infeksi mikroba, dan pemulihan stamina seluler.'
    },
    hadith: {
      narrator: 'HR. Al-Bukhari (no. 5684) & Muslim (no. 2205)',
      arabicText: 'الشِّفَاءُ فِي ثَلاَثَةٍ: شَرْبَةِ عَسَلٍ، وَشَرْطَةِ مِحْجَمٍ، وَكَيَّةِ نَارٍ، وَأَنْهَى أُمَّتِي عَنِ الْكَيِّ',
      translation: 'Kesembuhan itu ada pada tiga hal: minum madu, sayatan pisau bekam, dan sengatan api (cauterisasi). Dan aku melarang umatku dari pengobatan dengan sengatan api.',
      grade: 'Shahih',
      context: 'Nabi SAW juga menyarankan meminum madu dingin dicampur air hangat di pagi hari saat lambung kosong (empty stomach) untuk melunakkan dinding pencernaan.'
    },
    modernScience: {
      keyCompounds: ['Glukosa & Fruktosa Monosakarida', 'Hidrogen Peroksida (H2O2) Alami', 'Methylglyoxal (MGO)', 'Flavonoid Chrysin & Pinocembrin', 'Enzim Invertase & Glukosa Oksidase'],
      biochemicalMechanism: 'Kombinasi osmolaritas tinggi (menarik air keluar dari bakteri sehingga mengalami lisis), pH asam (3.2 - 4.5), dan pelepasan enzimatik H2O2 menghasilkan aktivitas antimikroba berspektrum luas terhadap S. aureus dan H. pylori tanpa menimbulkan resistensi antibiotik.',
      clinicalBenefits: [
        'Membasmi bakteri penyebab tukak lambung (Helicobacter pylori) dan meredakan gastritis',
        'Akselerasi epitelisasi jaringan luka bakar dan luka diabetik (dressing madu medis)',
        'Meredakan batuk nokturnal pada anak di atas usia 1 tahun (rekomendasi WHO & AAP)',
        'Antioksidan protektif terhadap peroksidasi lipid hepatoseluler'
      ],
      modernResearchStudies: [
        {
          journal: 'Cochrane Database of Systematic Reviews (2018)',
          finding: 'Madu terbukti lebih efektif meredakan frekuensi dan keparahan batuk infeksi saluran napas atas (ISPA) dibandingkan plasebo dan setara dengan dextromethorphan.'
        },
        {
          journal: 'British Journal of Surgery (2020)',
          finding: 'Aplikasi madu medis terstandar menstimulasi pelepasan sitokin TNF-alpha dan IL-1beta yang mempercepat granulasi penyembuhan luka bedah.'
        }
      ]
    },
    practicalGuide: {
      recommendedUsage: 'Larutkan 1-2 sendok makan madu murni ke dalam 150 ml air hangat kuku (suhu < 40°C agar enzim tidak terdenaturasi), diminum pagi hari saat perut kosong.',
      dosageOrMethod: 'Dewasa: 1-2 sendok makan (15-30 ml) sehari. Anak > 1 tahun: 1 sendok teh (5 ml).',
      contraindicationsAndCautions: [
        'KONTRAINDIKASI MUTLAK: Bayi usia di bawah 1 tahun dilarang keras mengonsumsi madu mentah karena risiko botulisme infantil (spora Clostridium botulinum).',
        'Penderita diabetes melitus tetap harus menghitung beban glikemik madu dalam asupan karbohidrat harian.'
      ],
      lifestyleTips: [
        'Gunakan sendok kayu atau plastik steril, hindari mencampur madu dengan air mendidih (100°C).',
        'Dapat dikombinasikan dengan perasan lemon hangat untuk booster imunitas harian.'
      ]
    },
    visualIllustration: {
      type: 'bio-diagram',
      caption: 'Mekanisme Tripel Antibakteri & Epitelisasi Mukosa Lambung oleh Madu Murni',
      accentColor: '#D97706',
      diagramData: {
        title: 'Mekanisme Perlindungan Seluler Madu',
        subtitle: 'Apis Mellifera Enzymatic Pathway & Gastrointestinal Shield',
        labels: [
          { id: 'm1', title: 'Aktivasi Enzim Glukosa Oksidase', desc: 'Menghasilkan H2O2 dosis mikro yang membasmi bakteri tanpa merusak sel sehat', x: 22, y: 25 },
          { id: 'm2', title: 'Hiperosmolaritas Gula Alami', desc: 'Menarik cairan dari sel mikroba patogen hingga dehidrasi dan mati', x: 74, y: 32 },
          { id: 'm3', title: 'Lapisan Pelindung Mukosa Lambung', desc: 'Flavonoid pinocembrin menekan prostaglandin inflamasi lambung', x: 48, y: 72 },
          { id: 'm4', title: 'Stimulasi Angiogenesis & Kolagen', desc: 'Mempercepat penutupan luka dan jaringan parut baru', x: 80, y: 80 }
        ]
      }
    }
  },
  {
    id: 'minyak-zaitun',
    title: 'Minyak Zaitun (Syajarah Mubarokah & Kardioprotektif)',
    arabicTerm: 'زَيْتُ الزَّيْتُون (Zaituz-Zaitun)',
    latinScientificName: 'Olea europaea extra virgin oil',
    category: 'nutrisi-herbal',
    categoryLabel: 'Nutrisi & Herbal Nabawi',
    organSystems: ['jantung', 'pencernaan', 'otak', 'kulit-mata'],
    summary: 'Minyak dari pohon yang diberkahi sebagaimana disebutkan dalam QS. An-Nur:35 dan QS. At-Tin:1. Penelitian global memvalidasi asam oleat tak jenuh tunggal dan senyawa oleocanthal sebagai pilar emas pencegahan penyakit jantung koroner dan stroke.',
    quranVerse: {
      surahNumber: 24,
      surahName: 'An-Nur',
      ayahNumber: 35,
      arabicText: 'يُوقَدُ مِنْ شَجَرَةٍ مُبَارَكَةٍ زَيْتُونَةٍ لَا شَرْقِيَّةٍ وَلَا غَرْبِيَّةٍ يَكَادُ زَيْتُهَا يُضِيءُ وَلَوْ لَمْ تَمْسَسْهُ نَارٌ',
      transliteration: 'Yuuqadu min syajaratim mubaarakatin zaituunatil laa syarqiyyatiw wa laa gharbiyyatiy yakaadu zaituhaa yudhii-u wa lau lam tamsas-hu naar.',
      translation: '...dinyalakan dengan minyak dari pohon yang diberkahi, (yaitu) pohon zaitun yang tumbuh tidak di timur dan tidak pula di barat, yang minyaknya (saja) hampir-hampir menerangi, walaupun tidak disentuh api...',
      tafsirBrief: 'Penyebutan pohon zaitun sebagai "mubarakah" (diberkahi) mencakup manfaat ekologis, nutrisi, dan farmakologis yang tahan lintas generasi dengan kemurnian biokimia luar biasa.'
    },
    hadith: {
      narrator: 'HR. At-Tirmidzi (no. 1851) & Ibnu Majah (no. 3319)',
      arabicText: 'كُلُوا الزَّيْتَ وَادَّهِنُوا بِهِ فَإِنَّهُ مِنْ شَجَرَةٍ مُبَارَكَةٍ',
      translation: 'Makanlah minyak zaitun dan berminyaklah dengannya (oleskan pada kulit/rambut), karena sesungguhnya ia berasal dari pohon yang diberkahi.',
      grade: 'Shahih',
      context: 'Nabi SAW memanfaatkan zaitun baik secara enteral (dikonsumsi oral bersama roti) maupun topikal (perawatan kulit kepala, sendi, dan pencegahan kekeringan kulit).'
    },
    modernScience: {
      keyCompounds: ['Asam Oleat (Monounsaturated Fatty Acid / MUFA 70-80%)', 'Oleocanthal (Penghambat COX-1 & COX-2 alami)', 'Hidroksitirosol & Tirosol', 'Squalene', 'Vitamin E (Alfa-tokoferol)'],
      biochemicalMechanism: 'Oleocanthal meniru aksi obat antiinflamasi nonsteroid (seperti ibuprofen) dengan menginhibisi enzim siklooksigenase (COX). Asam oleat meningkatkan sensitivitas insulin dan mencegah peroksidasi lipid kolesterol LDL pada endotel pembuluh darah.',
      clinicalBenefits: [
        'Menurunkan risiko penyakit jantung koroner (PJK) hingga 30% pada diet Mediterania',
        'Mencegah penumpukan plak aterosklerosis dan menjaga elastisitas dinding arteri',
        'Antiinflamasi kronis sistemik yang melindungi neuron dari degradasi amiloid-beta (Alzheimer)',
        'Melindungi mukosa lambung dari asam klorida dan melancarkan empedu'
      ],
      modernResearchStudies: [
        {
          journal: 'New England Journal of Medicine (PREDIMED Trial)',
          finding: 'Konsumsi Extra Virgin Olive Oil harian menurunkan kejadian kardiovaskular mayor (stroke, infark miokard) secara signifikan pada populasi berisiko tinggi.'
        },
        {
          journal: 'Nature Chemical Biology',
          finding: 'Oleocanthal dalam minyak zaitun murni menunjukkan potensi selektif melisiskan sel kanker tanpa merusak sel sehat melalui kerusakan lisosom terprogram.'
        }
      ]
    },
    practicalGuide: {
      recommendedUsage: 'Pilih jenis Extra Virgin Olive Oil (EVOO) perasan pertama (cold-pressed). Konsumsi 1 sendok makan mentah di pagi hari atau sebagai dressing salad sayuran.',
      dosageOrMethod: '1-2 sendok makan (15-30 ml) per hari. Untuk kulit: oleskan tipis setelah mandi.',
      contraindicationsAndCautions: [
        'Hindari menggoreng minyak zaitun ekstra virgin pada suhu sangat tinggi (> 190°C) dalam waktu lama untuk mencegah degradasi polifenol.',
        'Penderita batu empedu (kolelitiasis) akut perlu berkonsultasi karena minyak merangsang kontraksi kantung empedu.'
      ],
      lifestyleTips: [
        'Simpan di botol kaca gelap tertutup rapat di tempat sejuk, terlindung dari sinar matahari langsung.',
        'Jadikan pengganti margarin atau minyak sawit jenuh dalam pola makan harian.'
      ]
    },
    visualIllustration: {
      type: 'anatomy-flow',
      caption: 'Aksi Proteksi Endotel Arteri Jantung & Vasodilatasi oleh Polifenol Zaitun',
      accentColor: '#10B981',
      diagramData: {
        title: 'Proteksi Vaskular Minyak Zaitun',
        subtitle: 'Endothelial Nitric Oxide & Plaque Prevention Pathway',
        labels: [
          { id: 'z1', title: 'Inhibisi Oksidasi Kolesterol LDL', desc: 'Hidroksitirosol menangkal radikal bebas mencegah busa makrofag (foam cell)', x: 28, y: 30 },
          { id: 'z2', title: 'Stimulasi Sintesis Nitric Oxide (NO)', desc: 'Melebarkan lumen pembuluh darah sehingga tensi darah terjaga stabil', x: 68, y: 28 },
          { id: 'z3', title: 'Penghambatan Enzim Inflamasi COX', desc: 'Oleocanthal meredakan peradangan kronis dinding endotel pembuluh', x: 45, y: 65 },
          { id: 'z4', title: 'Peningkatan Kadar HDL Protektif', desc: 'Membantu mengangkut kolesterol berlebih kembali ke organ hati', x: 82, y: 75 }
        ]
      }
    }
  },
  {
    id: 'habbatussauda',
    title: 'Habbatussauda (Thymoquinone & Imunomodulator Super)',
    arabicTerm: 'الحَبَّة السَّوْدَاء (Al-Habbatus-Sauda\')',
    latinScientificName: 'Nigella sativa seed',
    category: 'nutrisi-herbal',
    categoryLabel: 'Nutrisi & Herbal Nabawi',
    organSystems: ['imun', 'jantung', 'otak', 'pencernaan'],
    summary: 'Jintan hitam yang disabdakan Nabi SAW mengandung obat untuk segala penyakit kecuali maut. Riset farmakologi abad ke-21 mengonfirmasi senyawa thymoquinone sebagai anti-kanker, bronkodilator, anti-alergi, dan peningkat aktivitas sel Natural Killer (NK cells).',
    quranVerse: {
      surahNumber: 31,
      surahName: 'Luqman',
      ayahNumber: 10,
      arabicText: 'وَأَنْزَلْنَا مِنَ السَّمَاءِ مَاءً فَأَنْبَتْنَا فِيهَا مِنْ كُلِّ زَوْجٍ كَرِيمٍ',
      transliteration: 'Wa anzalnaa minas-samaa-i maa-an fa-ambatnaa fiihaa min kulli zaujin kariim.',
      translation: '...dan Kami turunkan air hujan dari langit, lalu Kami tumbuhkan padanya segala macam tumbuh-tumbuhan yang baik (bermanfaat).',
      tafsirBrief: 'Para ulama mengaitkan ayat ini dengan kekayaan flora obat (tumbuhan kariim) yang diciptakan Allah dengan kandungan zat kimiawi penyembuh bagi manusia, termasuk biji Nigella sativa.'
    },
    hadith: {
      narrator: 'HR. Al-Bukhari (no. 5688) & Muslim (no. 2215)',
      arabicText: 'إِنَّ فِي الْحَبَّةِ السَّوْدَاءِ شِفَاءً مِنْ كُلِّ دَاءٍ إِلاَّ السَّامَ، وَالسَّامُ الْمَوْتُ',
      translation: 'Sesungguhnya pada habbatussauda (jintan hitam) terdapat obat untuk segala macam penyakit, kecuali as-sam (kematian).',
      grade: 'Shahih',
      context: 'Ibnu Hajar Al-Asqalani dalam Fathul Bari menjelaskan lafaz "kulli daa\'" bermakna penyakit yang bersifat dingin/lembab atau penyakit yang dapat diobati melalui aktivasi sistem imun tubuh manusia.'
    },
    modernScience: {
      keyCompounds: ['Thymoquinone (TQ 30-48%)', 'Dithymoquinone (Nigellone)', 'Thymohydroquinone', 'Asam Linoleat & Oleat', 'Nigellidine'],
      biochemicalMechanism: 'Thymoquinone menekan produksi interleukin pro-inflamasi (IL-6, TNF-alpha) dan NF-kB, sekaligus memicu apoptosis sel mutan abnormal tanpa mengganggu sel sehat serta menstimulasi proliferasi sel limfosit T.',
      clinicalBenefits: [
        'Meningkatkan rasio sel T-helper (CD4/CD8) dan aktivitas sel Natural Killer hingga 70%',
        'Bronkodilasi relaksasi otot polos saluran pernapasan pada penderita asma bronkial',
        'Menurunkan glukosa darah puasa dan hemoglobin A1c pada diabetes tipe 2',
        'Efek hepatoprotektif dan nefroprotektif dari zat toksin'
      ],
      modernResearchStudies: [
        {
          journal: 'Frontiers in Pharmacology (2021)',
          finding: 'Tinjauan komprehensif membuktikan Thymoquinone efektif sebagai adjuvan imun dalam menekan badai sitokin dan infeksi pernapasan akut.'
        },
        {
          journal: 'Phytomedicine',
          finding: 'Ekstrak minyak Nigella sativa memperlihatkan efikasi signifikan dalam menurunkan tekanan darah diastolik dan sistolik ringan.'
        }
      ]
    },
    practicalGuide: {
      recommendedUsage: 'Bisa berupa serbuk biji asli (ditumbuk halus dicampur madu) atau minyak kapsul terstandar berizin BPOM.',
      dosageOrMethod: 'Biji serbuk: 1-2 gram per hari. Minyak perasan: 1-2 kapsul (500-1000 mg) per hari setelah makan.',
      contraindicationsAndCautions: [
        'Wanita hamil dilarang mengonsumsi dosis berlebih karena Nigella sativa memiliki efek stimulan uterus ringan.',
        'Hentikan penggunaan 2 minggu sebelum operasi bedah terencana karena efek pengencer darah ringan.'
      ],
      lifestyleTips: [
        'Konsumsi bersama madu murni untuk efek sinergis penyerapan biokimia yang optimal.',
        'Simpan di tempat kering dan sejuk, hindari kelembapan.'
      ]
    },
    visualIllustration: {
      type: 'biochemical-cell',
      caption: 'Modulasi Respon Imun Sel T & Supresi Sitokin Pro-Inflamasi oleh Thymoquinone',
      accentColor: '#4F46E5',
      diagramData: {
        title: 'Kaskade Imunomodulasi Thymoquinone',
        subtitle: 'Nigella Sativa Cellular Defense Pathway',
        labels: [
          { id: 'h1', title: 'Blokade Jalur NF-kB', desc: 'Mencegah pelepasan sitokin berlebih perusak jaringan tubuh', x: 25, y: 22 },
          { id: 'h2', title: 'Aktivasi Sel Natural Killer (NK)', desc: 'Meningkatkan kesiapsiagaan membunuh virus dan sel patogen asing', x: 75, y: 25 },
          { id: 'h3', title: 'Relaksasi Otot Polos Bronkus', desc: 'Nigellone membuka saluran napas yang menyempit pada alergi/asma', x: 35, y: 68 },
          { id: 'h4', title: 'Antioksidan Pembersih Radikal Bebas', desc: 'Melindungi membran mitokondria sel dari stres oksidatif', x: 80, y: 72 }
        ]
      }
    }
  },
  {
    id: 'kurma-rutob-ajwah',
    title: 'Kurma Basah & Kering (Rutob & \'Ajwah - Ginekologi & Detoks)',
    arabicTerm: 'الرُّطَب وَالتَّمْر (Ar-Ruthab wat-Tamr)',
    latinScientificName: 'Phoenix dactylifera',
    category: 'nutrisi-herbal',
    categoryLabel: 'Nutrisi & Herbal Nabawi',
    organSystems: ['reproduksi', 'pencernaan', 'jantung', 'otak'],
    summary: 'Buah yang diwahyukan kepada Maryam saat melahirkan Nabi Isa AS (QS. Maryam:25-26). Mengandung analog hormon oksitosin alami, kalium tinggi, serat larut, dan mikronutrien pembentuk energi kilat yang terbukti memperlancar persalinan dan pemulihan nifas.',
    quranVerse: {
      surahNumber: 19,
      surahName: 'Maryam',
      ayahNumber: '25-26',
      arabicText: 'وَهُزِّي إِلَيْكِ بِجِذْعِ النَّخْلَةِ تُسَاقِطْ عَلَيْكِ رُطَبًا جَنِيًّا ۝ فَكُلِي وَاشْرَبِي وَقَرِّي عَيْنًا',
      transliteration: 'Wa huzziii ilaiki bijidz\'in-nakhlati tusaaqith \'alaiki ruthaban janiyyaa. Fakulii wasyrabii wa qarrii \'ainaa.',
      translation: 'Dan goyanglah pangkal pohon kurma itu ke arahmu, niscaya pohon itu akan menggugurkan buah kurma yang masak kepadamu. Maka makan, minum, dan bersenanghatilah kamu...',
      tafsirBrief: 'Petunjuk ilahi agar Maryam mengonsumsi kurma basah (ruthab) saat proses persalinan adalah mukjizat medis Al-Qur\'an, karena ruthab kaya glukosa siap serap, hormon penguat rahim, dan pencegah pendarahan masif post-partum.'
    },
    hadith: {
      narrator: 'HR. Al-Bukhari (no. 5445) & Muslim (no. 2047)',
      arabicText: 'مَنْ تَصَبَّحَ كُلَّ يَوْمٍ سَبْعَ تَمَرَاتٍ عَجْوَةً، لَمْ يَضُرَّهُ فِي ذَلِكَ الْيَوْمِ سُمٌّ وَلاَ سِحْرٌ',
      translation: 'Barangsiapa memakan tujuh butir kurma \'Ajwah di pagi hari, maka pada hari itu ia tidak akan dibahayakan oleh racun maupun sihir.',
      grade: 'Shahih',
      context: 'Nabi SAW juga senantiasa berbuka puasa dengan ruthab sebelum sholat Maghrib; jika tidak ada maka dengan tamr, dan jika tidak ada maka dengan meneguk beberapa teguk air.'
    },
    modernScience: {
      keyCompounds: ['Oksitosin-like Phyto-compounds', 'Fruktosa & Glukosa Alami Rantai Pendek', 'Kalium & Magnesium Tinggi', 'Serat Pektin & Beta-D-Glukan', 'Zat Besi & Folat'],
      biochemicalMechanism: 'Kandungan kurma merangsang reseptor oksitosin pada sel miometrium uterus untuk kontraksi persalinan yang ritmis dan adekuat, sekaligus melancarkan involusi uteri pasca-melahirkan untuk mencegah atonia uteri.',
      clinicalBenefits: [
        'Mempersingkat fase laten persalinan dan mengurangi kebutuhan induksi oksitosin sintetis',
        'Mencegah pendarahan hebat pasca-persalinan (post-partum hemorrhage)',
        'Pemulihan glikogen otot dan sel darah merah yang cepat bagi orang berpuasa',
        'Mengikat logam berat racun melalui serat larut pektin (detoksifikasi hepatoseluler)'
      ],
      modernResearchStudies: [
        {
          journal: 'Journal of Obstetrics and Gynaecology',
          finding: 'Wanita hamil yang rutin mengonsumsi kurma pada 4 minggu terakhir kehamilan memiliki dilatasi serviks awal lebih tinggi dan tingkat persalinan spontan 96%.'
        },
        {
          journal: 'International Journal of Food Sciences and Nutrition',
          finding: 'Kurma merupakan sumber antioksidan polifenol tinggi yang secara efektif melindungi membran eritrosit dari lisis oksidatif.'
        }
      ]
    },
    practicalGuide: {
      recommendedUsage: 'Ibu hamil trimester 3 (mulai minggu ke-36): konsumsi 3-6 butir kurma per hari. Saat berbuka puasa: awali 3 butir bersama air putih.',
      dosageOrMethod: '3-7 butir per hari (sunnah ganjil).',
      contraindicationsAndCautions: [
        'Ibu hamil dengan diabetes gestasional harus memonitor kadar gula darah setelah konsumsi kurma.',
        'Penderita gagal ginjal tahap lanjut perlu membatasi kurma karena kadar kaliumnya yang sangat tinggi.'
      ],
      lifestyleTips: [
        'Kurma basah (ruthab) simpan di lemari pendingin agar kesegarannya terjaga.',
        'Sangat baik dijadikan infused water (air nabeez) dengan merendam kurma semalaman dalam air matang.'
      ]
    },
    visualIllustration: {
      type: 'anatomy-flow',
      caption: 'Stimulasi Oksitosin Alami & Kontraksi Ritmis Miometrium Rahim oleh Kurma Rutob',
      accentColor: '#EA580C',
      diagramData: {
        title: 'Mekanisme Ginekologi & Energi Kurma',
        subtitle: 'Uterine Contraction & Rapid Glycemic Replenishment',
        labels: [
          { id: 'k1', title: 'Aktivasi Reseptor Oksitosin Uterus', desc: 'Membantu pelunakan serviks dan kontraksi fisiologis rahim yang teratur', x: 30, y: 25 },
          { id: 'k2', title: 'Absorbsi Fruktosa & Glukosa Kilat', desc: 'Memulihkan energi otot ibu melahirkan tanpa lonjakan insulin drastis', x: 72, y: 25 },
          { id: 'k3', title: 'Elektrolit Kalium & Magnesium', desc: 'Mencegah kram otot dinding perut dan mengatur ritme miokardium', x: 35, y: 70 },
          { id: 'k4', title: 'Vasokonstriksi Hemostasis Postpartum', desc: 'Tannin kurma menghentikan rembesan kapiler darah setelah melahirkan', x: 78, y: 72 }
        ]
      }
    }
  },
  {
    id: 'sujud-hemodinamika-otak',
    title: 'Sujud & Hemodinamika Serebral (Perfusi Darah Otak Prefrontal)',
    arabicTerm: 'السُّجُود (As-Sujuud)',
    latinScientificName: 'Cerebral hemodynamics & Prefrontal perfusion',
    category: 'biomekanika-ibadah',
    categoryLabel: 'Fisiologi Gerakan Ibadah',
    organSystems: ['otak', 'jantung', 'tulang'],
    summary: 'Posisi terendah fisik manusia yang menjadi posisi terdekat dengan Sang Khalik. Secara neurosains, sujud membalikkan gradien gravitasi sehingga arteri karotis membanjiri korteks prefrontal (pusat penalaran, empati, dan moralitas) dengan oksigen dan mikronutrien secara maksimal.',
    quranVerse: {
      surahNumber: 96,
      surahName: 'Al-\'Alaq',
      ayahNumber: 19,
      arabicText: 'كَلَّا لَا تُطِعْهُ وَاسْجُدْ وَاقْتَرِبْ',
      transliteration: 'Kallaa laa tuthi\'hu wasjud waqtarib.',
      translation: 'Sekali-kali tidak! Janganlah kamu patuh kepadanya; dan sujudlah serta dekatkanlah (dirimu kepada Allah).',
      tafsirBrief: 'Korelasinya dengan ayat sebelumnya tentang "ubun-ubun yang mendustakan" (an-naashiyah - prefrontal cortex). Sujud menundukkan area otak eksekutif ini ke tanah seraya membanjirinya dengan sirkulasi darah penyegar jiwa.'
    },
    hadith: {
      narrator: 'HR. Muslim (no. 482)',
      arabicText: 'أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ، فَأَكْثِرُوا الدُّعَاءَ',
      translation: 'Keadaan paling dekat seorang hamba dengan Tuhannya adalah ketika ia sedang bersujud, maka perbanyaklah doa.',
      grade: 'Shahih',
      context: 'Nabi SAW menganjurkan memperlama sujud dan melarang meletakkan lengan menempel di tanah menyerupai anjing (agar rongga dada dan diafragma bebas mengembang).'
    },
    modernScience: {
      keyCompounds: ['Cerebral Blood Flow (CBF)', 'Circulus Arteriosus Willisi', 'Venous Drainage Vena Jugularis', 'Neurotropin BDNF (Brain-Derived Neurotrophic Factor)'],
      biochemicalMechanism: 'Pada posisi berdiri, jantung harus memompa darah melawan gravitasi menuju otak (tinggi ~30-40 cm di atas jantung). Saat sujud, kepala berada di bawah jantung, meningkatkan venous return dan perfusi kapiler di lobus frontalis tanpa menyebabkan hipertensi intrakranial berkat regulasi autoregulasi serebral.',
      clinicalBenefits: [
        'Meningkatkan oksigenasi pada korteks prefrontal (pusat konsentrasi, kontrol emosi, dan memori)',
        'Mencegah stasis vena serebral dan sakit kepala tegang (tension-type headache)',
        'Melatih autoregulasi elastisitas pembuluh darah otak mencegah aneurisma dan stroke',
        'Dekompresi ruas tulang leher (servikal) dan peregangan fasia suboksipitalis'
      ],
      modernResearchStudies: [
        {
          journal: 'Journal of Medical Engineering & Technology',
          finding: 'Pengukuran elektroensefalogram (EEG) selama sujud menunjukkan peningkatan dominan gelombang Alpha di lobus frontal dan oksipital yang berkorelasi dengan relaksasi parasimpatis mendalam.'
        },
        {
          journal: 'European Journal of Physiology',
          finding: 'Posisi inversi fisiologis sujud terbukti meningkatkan laju drainase limfatik kepala dan leher secara alami.'
        }
      ]
    },
    practicalGuide: {
      recommendedUsage: 'Lakukan sujud dengan thuma\'ninah (tenang tidak tergesa-gesa), minimal 5-10 detik setiap sujud dalam sholat fardhu maupun sunnah tahajud.',
      dosageOrMethod: 'Pastikan 7 anggota badan menempel sempurna di lantai: dahi bersama hidung, kedua telapak tangan, kedua lutut, dan ujung jari-jari kedua kaki.',
      contraindicationsAndCautions: [
        'Penderita vertigo paroksismal posisional jinak (BPPV) fase akut atau glaukoma tekanan tinggi yang tidak terkontrol dapat melakukan sujud dengan sudut kemiringan yang disesuaikan/isyarat duduk sesuai kaidah rukhsah sholat.'
      ],
      lifestyleTips: [
        'Jangan menahan napas saat sujud; bernapaslah perlahan dan dalam dari diafragma perut.',
        'Gunakan waktu sujud terakhir dalam sholat untuk berdoa khusyuk dengan ketenangan jiwa.'
      ]
    },
    visualIllustration: {
      type: 'posture-biomechanics',
      caption: 'Vektor Hemodinamika Arteri Karotis & Sirkulasi Willis Menuju Korteks Prefrontal',
      accentColor: '#6366F1',
      diagramData: {
        title: 'Hemodinamika Vaskular Posisi Sujud',
        subtitle: 'Gravity-Assisted Prefrontal Cortex Oxygenation',
        labels: [
          { id: 's1', title: 'Perfusi Lobus Frontal & Korteks Prefrontal', desc: 'Area pengambilan keputusan dan kontrol moral dibanjiri oksigen segar', x: 26, y: 35 },
          { id: 's2', title: 'Aliran Gravitasi Arteri Karotis Interna', desc: 'Darah dari arkus aorta mengalir lancar tanpa tahanan gravitasi vertikal', x: 62, y: 40 },
          { id: 's3', title: 'Dekompresi Diskus Servikalis (Leher)', desc: 'Peregangan lembut otot trapezius melepaskan beban stres leher', x: 42, y: 70 },
          { id: 's4', title: 'Ekspansi Rongga Dada & Diafragma', desc: 'Kedua siku terangkat membuka rongga pleura untuk ventilasi paru optimal', x: 80, y: 65 }
        ]
      }
    }
  },
  {
    id: 'autofagi-puasa',
    title: 'Autofagi Sel Melalui Puasa (Ash-Shiyam & Daur Ulang Seluler)',
    arabicTerm: 'الصِّيَام وَالأَوْتُوفَاجِي (Ash-Shiyaam)',
    latinScientificName: 'Intermittent fasting & Cellular autophagy',
    category: 'higienitas-pencegahan',
    categoryLabel: 'Pencegahan & Higienitas',
    organSystems: ['imun', 'pencernaan', 'jantung', 'otak'],
    summary: 'Puasa yang disyariatkan dalam Al-Qur\'an terbukti secara Nobel Kedokteran memicu "Autofagi" (self-eating)—mekanisme cerdas tubuh membersihkan mitokondria rusak, menghancurkan sel mutan kanker, dan meremajakan sel induk setelah puasa 12-16 jam.',
    quranVerse: {
      surahNumber: 2,
      surahName: 'Al-Baqarah',
      ayahNumber: 184,
      arabicText: 'وَأَنْ تَصُومُوا خَيْرٌ لَكُمْ ۖ إِنْ كُنْتُمْ تَعْلَمُونَ',
      transliteration: 'Wa an tashuumuu khairul lakum in kuntum ta\'lamuun.',
      translation: '...Dan berpuasa itu lebih baik bagimu jika kamu mengetahui.',
      tafsirBrief: 'Kalimat "in kuntum ta\'lamuun" (jika kamu mengetahui) adalah isyarat mukjizat ilmiah, bahwa di balik rasa lapar dan haus puasa, tersimpan rahasia medis regenerasi sel yang baru tersibak sains di era modern.'
    },
    hadith: {
      narrator: 'HR. At-Thabrani (Al-Mu\'jam Al-Ausath no. 8312)',
      arabicText: 'صُومُوا تَصِحُّوا',
      translation: 'Berpuasalah niscaya kalian akan menjadi sehat.',
      grade: 'Hasan',
      context: 'Nabi SAW mencontohkan puasa rutin Senin-Kamis dan Ayyamul Bidh (pertengahan bulan hijriah 13, 14, 15) yang sejalan dengan siklus ritme biologis regenerasi tubuh.'
    },
    modernScience: {
      keyCompounds: ['Autofagosom & Lisosom', 'AMPK (AMP-activated protein kinase)', 'Supresi mTOR (mechanistic target of rapamycin)', 'Penurunan Hormon IGF-1', 'Sirtuin (SIRT1 Longevity Gene)'],
      biochemicalMechanism: 'Ketika glukosa dan asam amino eksternal tidak masuk selama 12-16 jam, kadar insulin turun dan AMPK aktif menekan mTOR. Sel beralih ke mode pembersihan (autofagi): membungkus debris protein beracun, virus intraseluler, dan mitokondria tua ke dalam vesikel autofagosom untuk dicerna ulang menjadi asam amino baru.',
      clinicalBenefits: [
        'Menghancurkan protein amiloid abnormal penyebab penyakit neurodegeneratif (Alzheimer, Parkinson)',
        'Meningkatkan sensitivitas reseptor insulin dan menyembuhkan perlemakan hati (NAFLD)',
        'Memicu regenerasi sel punca darah (hematopoietik stem cells) sistem imun',
        'Menurunkan tekanan darah dan penanda inflamasi C-Reactive Protein (CRP)'
      ],
      modernResearchStudies: [
        {
          journal: 'Nobel Prize in Physiology or Medicine (2016)',
          finding: 'Penghargaan Nobel dianugerahkan kepada Yoshinori Ohsumi atas penemuan mekanisme autofagi seluler yang terpicu saat organisme mengalami pembatasan nutrisi (fasting).'
        },
        {
          journal: 'Cell Metabolism (2019)',
          finding: 'Puasa berkala secara signifikan menurunkan resistensi insulin sistemik, menekan stres oksidatif mitokondria, dan memperpanjang rentang usia sehat sel mamalia.'
        }
      ]
    },
    practicalGuide: {
      recommendedUsage: 'Terapkan puasa Ramadhan dengan benar, serta amalkan puasa sunnah Senin-Kamis atau Daud (selang-seling sehari). Sahurlah di akhir waktu dan segerakan berbuka.',
      dosageOrMethod: 'Durasi puasa fardhu/sunnah 13-14 jam di Indonesia sangat ideal untuk mengaktifkan kaskade autofagi jam ke-12 hingga ke-16.',
      contraindicationsAndCautions: [
        'Hindari "balas dendam" saat berbuka dengan makan gorengan dan gula berlebih yang langsung mematikan proses autofagi dan memicu lonjakan glukosa ekstrem.',
        'Penderita diabetes dengan terapi insulin wajib konsultasi dokter untuk penyesuaian dosis obat.'
      ],
      lifestyleTips: [
        'Awali berbuka dengan air putih dan kurma, beri jeda sholat Maghrib sebelum makan berat.',
        'Jaga hidrasi cukup (2 liter air dengan pola 2-4-2: 2 gelas saat berbuka, 4 gelas malam hari, 2 gelas saat sahur).'
      ]
    },
    visualIllustration: {
      type: 'biochemical-cell',
      caption: 'Fase Pembentukan Autofagosom, Fusi Lisosom, dan Daur Ulang Sampah Sitoplasma Sel',
      accentColor: '#059669',
      diagramData: {
        title: 'Mekanisme Autofagi Seluler Puasa',
        subtitle: 'Cellular Cleansing & Stem Cell Renewal Process',
        labels: [
          { id: 'a1', title: 'Aktivasi Sensor Energi AMPK', desc: 'Penurunan insulin memicu sinyal pembersihan sitoplasma internal sel', x: 25, y: 28 },
          { id: 'a2', title: 'Pembentukan Kantung Autofagosom', desc: 'Menelan mitokondria rusak, protein amiloid, dan fragmen mikroba patogen', x: 70, y: 26 },
          { id: 'a3', title: 'Fusi Enzimatis dengan Lisosom', desc: 'Enzim hidrolitik mencerna sampah seluler menjadi asam amino bersih', x: 42, y: 72 },
          { id: 'a4', title: 'Regenerasi Energi & Anti-Penuaan', desc: 'Menghasilkan ATP murni dan merangsang pembentukan sel punca baru', x: 80, y: 75 }
        ]
      }
    }
  },
  {
    id: 'kaidah-sepertiga-lambung',
    title: 'Kaidah 1/3 Lambung & Moderasi Makan (Pencegahan GERD & Obesitas)',
    arabicTerm: 'ثُلُثُ طَعَامٍ وَثُلُثُ شَرَابٍ وَثُلُثُ نَفَسٍ',
    latinScientificName: 'Gastric biomechanics & Volumetric regulation',
    category: 'higienitas-pencegahan',
    categoryLabel: 'Pencegahan & Higienitas',
    organSystems: ['pencernaan', 'jantung', 'otak'],
    summary: 'Kaidah emas kedokteran pencernaan yang disabdakan Nabi SAW: membagi lambung menjadi sepertiga makanan, sepertiga minuman, dan sepertiga udara. Fisiologi modern membuktikan prinsip ini mencegah distensi lambung, GERD, dan kelelahan jantung.',
    quranVerse: {
      surahNumber: 7,
      surahName: 'Al-A\'raf',
      ayahNumber: 31,
      arabicText: 'وَكُلُوا وَاشْرَبُوا وَلَا تُسْرِفُوا ۚ إِنَّهُ لَا يُحِبُّ الْمُسْرِفِينَ',
      transliteration: 'Wa kuluu wasyrabuu wa laa tusrifuu, innahuu laa yuhibbul musrifiin.',
      translation: '...Makan dan minumlah, tetapi jangan berlebih-lebihan. Sungguh, Allah tidak menyukai orang-orang yang berlebih-lebihan.',
      tafsirBrief: 'Ibnu Katsir menegaskan bahwa pangkal segala penyakit adalah memasukkan makanan di atas makanan yang belum selesai dicerna, dan larangan israf (berlebih-lebihan) merupakan kaidah preventif kedokteran nomor wahid.'
    },
    hadith: {
      narrator: 'HR. At-Tirmidzi (no. 2380) & Ibnu Majah (no. 3349)',
      arabicText: 'مَا مَلأَ آدَمِيٌّ وِعَاءً شَرًّا مِنْ بَطْنٍ، بِحَسْبِ ابْنِ آدَمَ أُكُلاَتٌ يُقِمْنَ صُلْبَهُ، فَإِنْ كَانَ لاَ مَحَالَةَ، فَثُلُثٌ لِطَعَامِهِ، وَثُلُثٌ لِشَرَابِهِ، وَثُلُثٌ لِنَفَسِهِ',
      translation: 'Tidaklah anak Adam memenuhi wadah yang lebih buruk daripada perutnya. Cukuplah bagi anak Adam beberapa suapan yang dapat menegakkan tulang punggungnya. Jika pun harus, maka sepertiga untuk makanannya, sepertiga untuk minumannya, dan sepertiga untuk napasnya.',
      grade: 'Shahih',
      context: 'Imam Syafi\'i mengomentari hadits ini sebagai rangkuman seluruh ilmu kedokteran dunia.'
    },
    modernScience: {
      keyCompounds: ['Kapasitas Volume Lambung (1.0 - 1.5 L)', 'Lower Esophageal Sphincter (LES)', 'Hormon Leptin (Sinyal Kenyang)', 'Hormon Ghrelin (Sinyal Lapar)', 'Tekanan Intragastrik'],
      biochemicalMechanism: 'Lambung memerlukan rongga udara dan cairan bebas untuk gerakan peristaltik mengaduk kimus secara mekanis. Jika lambung terisi 100%, tekanan intragastrik melonjak memaksa spingter esofagus bawah (LES) membuka ke atas, memicu asam klorida naik ke kerongkongan (GERD/Heartburn) dan menekan diafragma ke atas.',
      clinicalBenefits: [
        'Mencegah penyakit asam lambung kronis (GERD) dan esofagitis erosif',
        'Mencegah sindrom kantuk berat post-prandial akibat pergeseran darah masif ke usus',
        'Memberi waktu bagi hormon leptin mengirim sinyal kenyang ke hipotalamus (butuh ~20 menit)',
        'Mencegah obesitas viseral, sindrom metabolik, dan diabetes melitus tipe 2'
      ],
      modernResearchStudies: [
        {
          journal: 'Gastroenterology Clinics of North America',
          finding: 'Distensi dinding lambung akibat makan berlebih (> 80% kapasitas fungsional) merupakan penyebab utama disfungsi sfingter esofagus bawah dan refluks asam lambung.'
        },
        {
          journal: 'American Journal of Clinical Nutrition',
          finding: 'Makan perlahan dan menyisakan ruang kapasitas lambung meningkatkan respons hormon GLP-1 dan PYY yang secara alami menekan nafsu makan berlebih.'
        }
      ]
    },
    practicalGuide: {
      recommendedUsage: 'Berhenti makan sebelum kenyang total (sekitar 80% rasa kenyang). Kunyah makanan perlahan (20-30 kali kunyahan) untuk mencampur enzim amilase liur.',
      dosageOrMethod: 'Gunakan piring berukuran lebih kecil, jangan langsung minum air es dalam jumlah banyak saat sedang mengunyah makanan berat.',
      contraindicationsAndCautions: [
        'Hindari langsung berbaring atau tidur setelah makan; beri jeda minimal 2-3 jam agar lambung sempat mengosongkan isinya ke duodenum.'
      ],
      lifestyleTips: [
        'Makan dengan posisi duduk tegak, hindari makan sambil menonton layar agar otak fokus membaca sinyal kenyang.',
        'Minum segelas air 15-30 menit sebelum makan untuk membantu hidrasi dinding mukosa.'
      ]
    },
    visualIllustration: {
      type: 'anatomy-flow',
      caption: 'Perbandingan Kompartemen Lambung Sehat (1/3 Makanan, Air, Udara) vs Lambung GERD',
      accentColor: '#14B8A6',
      diagramData: {
        title: 'Fisiologi Tripartit Lambung Manusia',
        subtitle: 'Gastric Pressure & Lower Esophageal Sphincter Dynamics',
        labels: [
          { id: 'l1', title: '1/3 Makanan (Kimus)', desc: 'Volume padat ideal untuk dicerna enzim pepsin secara optimal', x: 30, y: 35 },
          { id: 'l2', title: '1/3 Cairan Pencernaan', desc: 'Menjaga cairan asam lambung pada pH tepat melarutkan nutrisi', x: 68, y: 38 },
          { id: 'l3', title: '1/3 Rongga Udara Bebas', desc: 'Memberi ruang motilitas peristaltik dan mencegah tekanan ke paru-paru', x: 35, y: 72 },
          { id: 'l4', title: 'Katup Sfingter Esofagus (LES)', desc: 'Tetap tertutup rapat mencegah asam naik ke tenggorokan (bebas GERD)', x: 78, y: 75 }
        ]
      }
    }
  },
  {
    id: 'rukuk-biomekanika-tulang',
    title: 'Rukuk & Biomekanika Tulang Punggung (Dekompresi Diskus Lumbal)',
    arabicTerm: 'الرُّكُوع (Ar-Rukuu\')',
    latinScientificName: 'Spinal biomechanics & Lumbar disc decompression',
    category: 'biomekanika-ibadah',
    categoryLabel: 'Fisiologi Gerakan Ibadah',
    organSystems: ['tulang', 'otak', 'jantung'],
    summary: 'Gerakan membungkuk 90 derajat dengan punggung lurus mendatar dan tangan mencengkeram lutut. Posisi ini memberikan peregangan statis pada otot hamstring dan paraspinal, sekaligus membuka ruang intervertebra lumbal sehingga mencegah saraf kejepit (HNP).',
    quranVerse: {
      surahNumber: 2,
      surahName: 'Al-Baqarah',
      ayahNumber: 43,
      arabicText: 'وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ',
      transliteration: 'Wa aqiimus-shalaata wa aatuz-zakaata warka\'uu ma\'ar-raaki\'iin.',
      translation: 'Dan laksanakanlah sholat, tunaikanlah zakat, dan rukuklah beserta orang-orang yang rukuk.',
      tafsirBrief: 'Penyebutan kata rukuk secara khusus mewakili esensi ketundukan raga, di mana ruas tulang belakang membungkuk simetris sejajar menghadap keagungan Allah SWT.'
    },
    hadith: {
      narrator: 'HR. Abu Dawud (no. 865) & At-Tirmidzi (no. 260)',
      arabicText: 'إِذَا رَكَعْتَ فَضَعْ كَفَّيْكَ عَلَى رُكْبَتَيْكَ وَفَرِّجْ بَيْنَ أَصَابِعِكَ ثُمَّ امْكُثْ حَتَّى يَأْخُذَ كُلُّ عُضْوٍ مَأْخَذَهُ',
      translation: 'Jika engkau rukuk, letakkanlah kedua telapak tanganmu di atas kedua lututmu dan renggangkanlah jari-jarimu, kemudian diamlah (thuma\'ninah) hingga setiap persendian kembali ke posisinya dengan tenang.',
      grade: 'Shahih',
      context: 'Dalam riwayat lain diceritakan bahwa jika dituangkan bejana air di atas punggung Nabi SAW saat rukuk, niscaya air tersebut tidak akan tumpah karena lurusnya posisi punggung beliau.'
    },
    modernScience: {
      keyCompounds: ['Diskus Intervertebralis (L1-S1)', 'Cairan Serebrospinal', 'Otot Erector Spinae & Hamstrings', 'Ligamentum Flavum'],
      biochemicalMechanism: 'Posisi 90 derajat mendatar mendistribusikan beban aksial dari bantalan tulang belakang bawah (lumbal L4-L5-S1) ke sendi panggul dan lutut. Tekanan negatif yang tercipta pada celah diskus merangsang imbibisi (penyerapan nutrisi cairan kembali ke nukleus pulposus yang aus).',
      clinicalBenefits: [
        'Mencegah dan merehabilitasi nyeri punggung bawah kronis (Low Back Pain)',
        'Mencegah penekanan radiks saraf skiatika / saraf kejepit (Hernia Nukleus Pulposus)',
        'Melancarkan aliran darah aorta abdominalis ke organ panggul dan ginjal',
        'Mengoreksi lordosis atau kifosis postural akibat kebiasaan duduk membungkuk'
      ],
      modernResearchStudies: [
        {
          journal: 'International Journal of Physiotherapy',
          finding: 'Analisis sudut postur sholat membuktikan sudut rukuk 90 derajat secara signifikan mengurangi ketegangan miofasial paraspinal dan meningkatkan fleksibilitas rantai kinetik posterior.'
        },
        {
          journal: 'Journal of Physical Therapy Science',
          finding: 'Aktivasi isometrik otot punggung selama thuma\'ninah rukuk memperkuat stabilitas otot korset inti (core muscles).'
        }
      ]
    },
    practicalGuide: {
      recommendedUsage: 'Posisikan punggung lurus horizontal sejajar lantai, kepala tidak mendongak ke atas dan tidak terlalu menunduk ke bawah (lurus sejajar tulang leher).',
      dosageOrMethod: 'Cengkeram lutut kuat-kuat dengan jari-jari direnggangkan seperti menggenggam mangkok untuk menopang berat tubuh atas.',
      contraindicationsAndCautions: [
        'Bagi penderita radang sendi lutut (osteoarthritis) berat, lutut boleh sedikit ditekuk (soft knees) agar tidak hiperekstensi.'
      ],
      lifestyleTips: [
        'Tahan posisi rukuk minimal selama membaca doa rukuk "Subhana Rabbiyal \'Adzimi wa bihamdih" 3 kali dengan thuma\'ninah sejati.'
      ]
    },
    visualIllustration: {
      type: 'posture-biomechanics',
      caption: 'Distribusi Garis Beban Tulang Belakang & Dekompresi Celah Lumbal L4-L5',
      accentColor: '#0284C7',
      diagramData: {
        title: 'Biomekanika Sudut 90° Rukuk Sempurna',
        subtitle: 'Lumbar Vertebrae Alignment & Hamstring Kinetic Chain',
        labels: [
          { id: 'r1', title: 'Punggung Datar Sejajar Air', desc: 'Meluruskan lordosis servikal dan torakal menjadi satu garis lurus', x: 42, y: 28 },
          { id: 'r2', title: 'Pelepasan Beban Celah Lumbal L4-S1', desc: 'Membuka rongga foramen intervertebral mencegah jepitan saraf', x: 26, y: 35 },
          { id: 'r3', title: 'Peregangan Hamstring & Gluteus', desc: 'Memperbaiki kelenturan panggul yang kaku akibat kelamaan duduk', x: 24, y: 72 },
          { id: 'r4', title: 'Tangan Mencengkeram Erat Lutut', desc: 'Menopang poros berat badan sehingga persendian stabil tanpa beban kejut', x: 65, y: 70 }
        ]
      }
    }
  },
  {
    id: 'wudhu-hidroterapi-saraf',
    title: 'Wudhu & Hidroterapi Stimulasi Saraf Kranial (Refleks Relaksasi & Orofaring)',
    arabicTerm: 'الوُضُوء (Al-Wudhuu\')',
    latinScientificName: 'Facial nerve stimulation & Hydrotherapy',
    category: 'biomekanika-ibadah',
    categoryLabel: 'Fisiologi Gerakan Ibadah',
    organSystems: ['otak', 'kulit-mata', 'imun'],
    summary: 'Pensucian raga dengan air bersih minimal 5 kali sehari. Secara neurofisiologis, sentuhan air sejuk pada wajah dan ekstremitas menstimulasi cabang Nervus Trigeminus (CN V) dan Nervus Facialis (CN VII), memicu pelepasan endorfin, menurunkan denyut jantung, dan menstabilkan sistem otonom.',
    quranVerse: {
      surahNumber: 5,
      surahName: 'Al-Ma\'idah',
      ayahNumber: 6,
      arabicText: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ وَامْسَحُوا بِرُءُوسِكُمْ وَأَرْجُلَكُمْ إِلَى الْكَعْبَيْنِ',
      transliteration: 'Yaaa ayyuhalladziina aamanuuu idzaa qumtum ilash-shalaati faghsiluu wujuuhakum wa aidiyakum ilal maraafiqi wamsahuu biru-uusikum wa arjulakum ilal ka\'bain.',
      translation: 'Wahai orang-orang yang beriman! Apabila kamu hendak melaksanakan sholat, maka basuhlah wajahmu dan tanganmu sampai ke siku, dan usaplah kepalamu dan (basuh) kedua kakimu sampai ke kedua mata kaki...',
      tafsirBrief: 'Perintah pembasuhan titik-titik wudhu menyasar organ-organ tubuh yang paling sering terpapar polutan luar dan sekaligus memiliki kepadatan reseptor sensorik saraf tertinggi pada homunculus korteks serebral.'
    },
    hadith: {
      narrator: 'HR. Muslim (no. 244) & At-Tirmidzi (no. 2)',
      arabicText: 'مَنْ تَوَضَّأَ فَأَحْسَنَ الْوُضُوءَ خَرَجَتْ خَطَايَاهُ مِنْ جَسَدِهِ حَتَّى تَخْرُجَ مِنْ تَحْتِ أَظْفَارِهِ',
      translation: 'Barangsiapa berwudhu lalu menyempurnakan wudhunya, niscaya keluarlah dosa-dosa dan kesalahannya dari jasadnya hingga keluar dari bawah kuku-kukunya.',
      grade: 'Shahih',
      context: 'Nabi SAW juga menyunnahkan bersiwak saat wudhu dan melakukan istinsyaq (menghirup air ke rongga hidung lalu menghembuskannya kuat-kuat).'
    },
    modernScience: {
      keyCompounds: ['Nervus Trigeminus (CN V)', 'Nervus Facialis (CN VII)', 'Sistem Saraf Parasimpatis', 'Pembersihan Mukosa Silia Orofaring', 'Akupresur Refleksologi Kaki'],
      biochemicalMechanism: 'Sensasi termal air mengaktifkan refleks menyelam mamalia ringan (diving reflex) yang menurunkan denyut nadi takikardia, melebarkan pembuluh darah mikrosirkulasi kulit (vasodilatasi reaktif), serta membersihkan biofilm bakteri dan virus pada kavum nasi sebelum sempat menginfeksi bronkus.',
      clinicalBenefits: [
        'Menurunkan kadar hormon kortisol (stres) dan meredakan amarah/emosi meledak',
        'Istinsyaq hidung membuang 90% debu, alergen, dan partikel polusi PM2.5 dari rongga hidung',
        'Mencegah infeksi saluran pernapasan atas (ISPA) dan sinusitis kranialis',
        'Menjaga hidrasi mikrobioma kulit wajah dan melancarkan mikrosirkulasi perifer kaki'
      ],
      modernResearchStudies: [
        {
          journal: 'International Journal of Healthcare Sciences',
          finding: 'Praktik istinsyaq dalam wudhu terbukti menurunkan kolonisasi bakteri patogen Staphylococcus aureus di mukosa hidung hingga 80% dibanding kelompok non-wudhu.'
        },
        {
          journal: 'Journal of Neurotherapy',
          finding: 'Percikan air wudhu pada wajah memicu gelombang otak Theta dan Alpha yang menciptakan relaksasi mental instan.'
        }
      ]
    },
    practicalGuide: {
      recommendedUsage: 'Lakukan wudhu dengan tertib dan sempurna (isbaghul wudhu), tidak berlebih-lebihan membuang air kran. Lakukan istinsyaq (hirup air ke hidung) dan berkumur.',
      dosageOrMethod: 'Basuh setiap anggota sebanyak 3 kali disertai sela-sela jari tangan dan kaki serta meratakan air ke siku dan mata kaki.',
      contraindicationsAndCautions: [
        'Pada kondisi luka basah operasi atau demam menggigil berat, Islam memberikan rukhsah tayamum dengan debu bersih.'
      ],
      lifestyleTips: [
        'Bila sedang emosi atau marah, segera berwudhu; Nabi SAW bersabda marah itu dari api, dan api hanya padam dengan air.'
      ]
    },
    visualIllustration: {
      type: 'anatomy-flow',
      caption: 'Stimulasi Cabang Saraf Kranial V & VII dan Titik Akupresur Kaki pada Wudhu',
      accentColor: '#0EA5E9',
      diagramData: {
        title: 'Pemetaan Neurofisiologi Wudhu',
        subtitle: 'Trigeminal Nerve & Peripheral Reflexology Points',
        labels: [
          { id: 'w1', title: 'Stimulasi Cabang Nervus Trigeminus', desc: 'Membasuh wajah mengaktifkan cabang oftalmikus, maksilaris, mandibularis', x: 48, y: 22 },
          { id: 'w2', title: 'Istinsyaq & Higiene Rongga Hidung', desc: 'Membersihkan mukosilia dari mikroba penyebab sinusitis & influenza', x: 28, y: 32 },
          { id: 'w3', title: 'Pijatan Sela Jari & Mikrosirkulasi', desc: 'Melancarkan aliran vena balik ekstremitas atas menuju jantung', x: 74, y: 48 },
          { id: 'w4', title: 'Stimulasi Refleksologi Kaki & Tumit', desc: 'Titik refleksi ginjal dan hati pada telapak kaki terstimulasi air dingin', x: 50, y: 78 }
        ]
      }
    }
  },
  {
    id: 'karantina-wabah-amwas',
    title: 'Karantina Epidemi & Higienitas Pencegahan (Amwas & Prosedur Isolasi)',
    arabicTerm: 'الحَجْر الصِّحِّي (Al-Hajrus-Shihhi)',
    latinScientificName: 'Infectious disease isolation & Quarantine protocol',
    category: 'higienitas-pencegahan',
    categoryLabel: 'Pencegahan & Higienitas',
    organSystems: ['imun', 'otak'],
    summary: 'Fondasi keilmuan epidemiologi kesehatan masyarakat modern yang dicanangkan Nabi SAW 14 abad silam: melarang masuk ke wilayah wabah dan melarang keluar darinya, serta etika menutup hidung/mulut saat bersin.',
    quranVerse: {
      surahNumber: 2,
      surahName: 'Al-Baqarah',
      ayahNumber: 195,
      arabicText: 'وَلَا تُلْقُوا بِأَيْدِيكُمْ إِلَى التَّهْلُكَةِ ۛ وَأَحْسِنُوا ۛ إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ',
      transliteration: 'Wa laa tulquu bi-aidiikum ilat-tahlukati wa ahsinuu, innallaaha yuhibbul muhsiniin.',
      translation: '...Dan janganlah kamu menjatuhkan dirimu sendiri ke dalam kebinasaan, dan berbuat baiklah. Sungguh, Allah menyukai orang-orang yang berbuat baik.',
      tafsirBrief: 'Kaidah syariah fundamental melarang tindakan ceroboh yang memaparkan diri atau orang lain pada bahaya penularan penyakit mematikan.'
    },
    hadith: {
      narrator: 'HR. Al-Bukhari (no. 5728) & Muslim (no. 2218)',
      arabicText: 'إِذَا سَمِعْتُمْ بِالطَّاعُونِ بِأَرْضٍ فَلاَ تَدْخُلُوهَا، وَإِذَا وَقَعَ بِأَرْضٍ وَأَنْتُمْ بِهَا فَلاَ تَخْرُجُوا مِنْهَا فِرَارًا مِنْهُ',
      translation: 'Jika kamu mendengar ada wabah tha\'un di suatu negeri, maka janganlah kamu memasukinya; dan jika wabah itu terjadi di negeri tempat kamu berada, maka janganlah kamu keluar darinya karena hendak lari darinya.',
      grade: 'Shahih',
      context: 'Dipraktikkan secara tegas oleh Khalifah Umar bin Khattab dan Abu Ubaidah bin Al-Jarrah saat menghadapi wabah pes Amwas di Syam.'
    },
    modernScience: {
      keyCompounds: ['Angka Reproduksi Dasar (R0 / R-naught)', 'Droplet Transmission Dynamics', 'Inkubasi Asimtomatik', 'Barrier Isolation'],
      biochemicalMechanism: 'Karantina memotong rantai transmisi vektor patogen (R0 < 1). Orang yang terinfeksi namun belum bergejala (presimtomatik) dicegah menularkan virus/bakteri ke populasi rentan di luar zona episentrum.',
      clinicalBenefits: [
        'Mencegah kolapsnya fasilitas kesehatan dan rumah sakit akibat lonjakan pasien serentak',
        'Menekan kurva epidemiologis hingga vaksin atau terapi definitif tersedia',
        'Etika bersin Nabi SAW (menutup wajah dengan tangan/pakaian) menahan semburan aerosol mikroba',
        'Mencuci tangan setelah bangun tidur sebelum menyentuh bejana air mencegah kontaminasi fekal-oral'
      ],
      modernResearchStudies: [
        {
          journal: 'The Lancet Infectious Diseases',
          finding: 'Analisis historis mencatat bahwa aturan karantina isolasi terbukti sebagai instrumen kesehatan masyarakat paling efektif sepanjang sejarah peradaban manusia.'
        },
        {
          journal: 'World Health Organization (WHO) Guidelines',
          finding: 'Penerapan isolasi kasus, pembatasan mobilitas, dan higiene etika batuk/bersin memangkas transmisi virus pernapasan hingga lebih dari 70%.'
        }
      ]
    },
    practicalGuide: {
      recommendedUsage: 'Terapkan protokol isolasi mandiri saat menderita penyakit menular. Tutup mulut dan hidung dengan lengan baju dalam atau masker saat batuk/bersin.',
      dosageOrMethod: 'Cuci tangan dengan sabun dan air mengalir minimal 20 detik, terutama sebelum makan dan setelah beraktivitas di ruang publik.',
      contraindicationsAndCautions: [
        'Tidak boleh bepergian keluar kota saat sedang demam batuk menular agar tidak menjadi perantara bahaya bagi orang lain.'
      ],
      lifestyleTips: [
        'Terapkan hadits Nabi: "La dharara wa la dhirar" (Tidak boleh membahayakan diri sendiri dan tidak boleh membahayakan orang lain).'
      ]
    },
    visualIllustration: {
      type: 'anatomy-flow',
      caption: 'Pencegahan Transmisi R0 & Barrier Isolasi Karantina Epidemik',
      accentColor: '#0D9488',
      diagramData: {
        title: 'Epidemiologi Isolasi Wilayah Wabah',
        subtitle: 'Transmission Containment & Community Protection Barrier',
        labels: [
          { id: 'q1', title: 'Zona Episentrum Terisolasi', desc: 'Warga di dalam tidak keluar, warga di luar tidak masuk menahan infeksi', x: 30, y: 30 },
          { id: 'q2', title: 'Pemutusan Kurva R0 Penularan', desc: 'Rasio penularan ditekan hingga di bawah angka 1 agar wabah padam', x: 70, y: 32 },
          { id: 'q3', title: 'Etika Menutup Bersin & Batuk', desc: 'Menahan partikel aerosol droplet agar tidak terbang di udara publik', x: 40, y: 72 },
          { id: 'q4', title: 'Higiene Cuci Tangan 5x Sehari', desc: 'Menghilangkan lapisan lipid amplop virus dan kuman patogen', x: 78, y: 70 }
        ]
      }
    }
  },
  {
    id: 'embriologi-fase-penciptaan',
    title: 'Embriologi Manusia (Nuthfah, \'Alaqah, Mudghah & Keith Moore)',
    arabicTerm: 'عِلْمُ الأَجِنَّة (Ilmul Ajinnah)',
    latinScientificName: 'Human embryogenesis & organogenesis stages',
    category: 'embriologi-anatomi',
    categoryLabel: 'Embriologi & Tumbuh Kembang',
    organSystems: ['reproduksi', 'tulang', 'otak'],
    summary: 'Deskripsi Al-Qur\'an tentang tahapan pembentukan janin dalam rahim: dari Nuthfah (zigot), \'Alaqah (struktur menggantung seperti lintah), Mudghah (seperti segumpal daging yang dikunyah), pembentukan tulang (Idzam), lalu dibungkus otot (Lahm). Akurasi ini diverifikasi oleh para pakar anatomi dunia.',
    quranVerse: {
      surahNumber: 23,
      surahName: 'Al-Mu\'minun',
      ayahNumber: '12-14',
      arabicText: 'ثُمَّ خَلَقْنَا النُّطْفَةَ عَلَقَةً فَخَلَقْنَا الْعَلَقَةَ مُضْغَةً فَخَلَقْنَا الْمُضْغَةَ عِظَامًا فَكَسَوْنَا الْعِظَامَ لَحْمًا ثُمَّ أَنْشَأْنَاهُ خَلْقًا آخَرَ ۚ فَتَبَارَكَ اللَّهُ أَحْسَنُ الْخَالِقِينَ',
      transliteration: 'Tsumma khalaqnan-nuthfata \'alaqatan fa khalaqnal-\'alaqata mudhghatan fa khalaqnal-mudhghata \'idzaaman fa kasaunal-\'idzaama lahmaa, tsumma ansya\'naahu khalqan aakhar, fatabaarakallaahu ahsanul khaaliqiin.',
      translation: 'Kemudian air mani itu Kami jadikan sesuatu yang melekat (\'alaqah), lalu sesuatu yang melekat itu Kami jadikan segumpal daging (mudghah), dan segumpal daging itu Kami jadikan tulang belulang, lalu tulang belulang itu Kami bungkus dengan daging. Kemudian Kami menjadikannya makhluk yang (berbentuk) lain. Maka Mahasuci Allah, Pencipta yang paling baik.',
      tafsirBrief: 'Penyusunan urutan kata \'idzam (tulang) yang mendahului lahm (daging/otot) merupakan bukti mukjizat ilmiah, karena osteogenesis terjadi sebelum miogenesis membungkus rangka janin.'
    },
    hadith: {
      narrator: 'HR. Al-Bukhari (no. 3208) & Muslim (no. 2643)',
      arabicText: 'إِنَّ أَحَدَكُمْ يُجْمَعُ خَلْقُهُ فِي بَطْنِ أُمِّهِ أَرْبَعِينَ يَوْمًا نُطْفَةً، ثُمَّ يَكُونُ عَلَقَةً مِثْلَ ذَلِكَ، ثُمَّ يَكُونُ مُضْغَةً مِثْلَ ذَلِكَ...',
      translation: 'Sesungguhnya salah seorang di antara kalian dikumpulkan penciptaannya dalam perut ibunya selama empat puluh hari sebagai nuthfah, kemudian menjadi \'alaqah dalam waktu serupa, kemudian menjadi mudghah dalam waktu serupa...',
      grade: 'Shahih',
      context: 'Disampaikan oleh Abdullah bin Mas\'ud RA dan dikonfirmasi langsung oleh Rasulullah SAW sebagai pembawa wahyu.'
    },
    modernScience: {
      keyCompounds: ['Blastokista & Vili Korionik', 'Somit Mesodermal', 'Kondrogenesis Kartilago', 'Miogenesis Otot Rangka', 'Placental Syncytiotrophoblast'],
      biochemicalMechanism: 'Istilah \'Alaqah (24-25 hari) memiliki 3 makna bahasa arab: lintah, sesuatu yang melekat, dan gumpalan darah. Mikroskop elektron modern membuktikan embrio hari ke-24 menyerupai bentuk lintah air yang menyerap nutrisi dari dinding rahim melalui vili korionik. Fase mudghah (hari ke-28) memperlihatkan lekukan somit persis seperti bekas gigitan gigi.',
      clinicalBenefits: [
        'Memberikan landasan bioetika kedokteran tentang perlindungan hak hidup janin',
        'Pentingnya suplementasi asam folat pada masa pra-konsepsi mencegah spina bifida',
        'Pengetahuan anatomi perkembangan sistem organ janin (organogenesis)',
        'Memahami fase kehamilan dalam konseling ginekologi dan obstetri'
      ],
      modernResearchStudies: [
        {
          journal: 'The Developing Human: Clinically Oriented Embryology (Prof. Keith L. Moore)',
          finding: 'Profesor Anatomi Universitas Toronto menyatakan: Deskripsi tahap embriogenesis dalam Al-Qur\'an tidak mungkin didasarkan pada pengetahuan ilmiah abad ke-7, melainkan wahyu yang selaras dengan mikroskop modern.'
        },
        {
          journal: 'Journal of Islamic Medical Association of North America',
          finding: 'Kajian kronologis perkembangan tulang rawan (kartilago primer) terbukti secara histologis berkembang sebelum serabut otot lurik membungkusnya.'
        }
      ]
    },
    practicalGuide: {
      recommendedUsage: 'Edukasi pasangan usia subur dan ibu hamil untuk menjaga asupan gizi seimbang, asam folat, kalsium, zat besi, dan menjauhi zat teratogenik (rokok, alkohol, obat tanpa resep).',
      dosageOrMethod: 'Pemeriksaan antenatal care (USG) teratur pada trimester 1, 2, dan 3.',
      contraindicationsAndCautions: [
        'Hindari paparan radiasi sinar-X dan obat-obatan kategori D/X selama periode emas organogenesis (minggu ke-3 hingga minggu ke-8).'
      ],
      lifestyleTips: [
        'Perbanyak tilawah Al-Qur\'an dan doa kebaikan untuk janin selama kehamilan; stimulasi suara auditori janin aktif sejak usia 20 minggu.'
      ]
    },
    visualIllustration: {
      type: 'bio-diagram',
      caption: 'Korelasi Mikroanatomi Embrio: Nuthfah -> \'Alaqah (Lintah) -> Mudghah (Somit) -> Rangka Tulang & Otot',
      accentColor: '#F59E0B',
      diagramData: {
        title: 'Tahapan Embriogenesis Qur\'ani',
        subtitle: 'Comparative Microscopic Stages of Human Life',
        labels: [
          { id: 'e1', title: '1. Nuthfah Amsyaj (Zigot)', desc: 'Penyatuan sperma dan ovum membentuk sel berdaya pembelahan tinggi', x: 20, y: 28 },
          { id: 'e2', title: '2. \'Alaqah (Melekat/Lintah)', desc: 'Blastokista menempel di endometrium dengan bentuk persis lintah penyerap nutrisi', x: 50, y: 25 },
          { id: 'e3', title: '3. Mudghah (Bekas Gigitan)', desc: 'Munculnya somit-somit mesoderm menyerupai bekas gigitan gigi', x: 80, y: 28 },
          { id: 'e4', title: '4. \'Idzam & Lahm (Tulang & Otot)', desc: 'Kondrifikasi tulang terbentuk lalu dibungkus jaringan serabut otot', x: 50, y: 74 }
        ]
      }
    }
  },
  {
    id: 'syifa-quran-gelombang-alpha',
    title: 'Terapi Syifa\' Al-Qur\'an & Gelombang Alpha Otak (Psikosomatis & Stres)',
    arabicTerm: 'شِفَاءٌ وَرَحْمَة (Syifaa-uw wa Rahmah)',
    latinScientificName: 'Psychoacoustics & Alpha brainwaves neurotheology',
    category: 'kesehatan-mental',
    categoryLabel: 'Kesehatan Jiwa & Syifa',
    organSystems: ['otak', 'jantung', 'imun'],
    summary: 'Al-Qur\'an ditegaskan sebagai penawar (syifa\') bagi penyakit jiwa dan raga. Riset EEG modern membuktikan mendengarkan lantunan tartil Al-Qur\'an memicu lonjakan gelombang Alpha (8-12 Hz) di korteks serebral, menurunkan kortisol, dan mengaktivasi sistem imun alami.',
    quranVerse: {
      surahNumber: 17,
      surahName: 'Al-Isra\'',
      ayahNumber: 82,
      arabicText: 'وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِلْمُؤْمِنِينَ ۙ وَلَا يَزِيدُ الظَّالِمِينَ إِلَّا خَسَارًا',
      transliteration: 'Wa nunazzilu minal-qur-aani maa huwa syifaaa-uw wa rahmatul lil-mu\'miniin, wa laa yaziiduzh-zhaalimiina illaa khasaaraa.',
      translation: 'Dan Kami turunkan dari Al-Qur\'an (sesuatu) yang menjadi penawar dan rahmat bagi orang-orang yang beriman, sedangkan bagi orang-orang yang zalim (Al-Qur\'an itu) hanya akan menambah kerugian.',
      tafsirBrief: 'Syifa Al-Qur\'an bersifat holistik: menyembuhkan penyakit qalb (syubhat, dengki, cemas, depresi) sekaligus menyembuhkan penyakit raga melalui ketenangan saraf, ruqyah syar\'iyyah, dan resonansi akustik seluler.'
    },
    hadith: {
      narrator: 'HR. Al-Bukhari (no. 5016) & Muslim (no. 2192)',
      arabicText: 'أَنَّ النَّبِيَّ ﷺ كَانَ إِذَا أَوَى إِلَى فِرَاشِهِ كُلَّ لَيْلَةٍ جَمَعَ كَفَّيْهِ ثُمَّ نَفَثَ فِيهِمَا فَقَرَأَ فِيهِمَا: قُلْ هُوَ اللَّهُ أَحَدٌ، وَقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، وَقُلْ أَعُوذُ بِرَبِّ النَّاسِ، ثُمَّ يَمْسَحُ بِهِمَا مَا اسْتَطَاعَ مِنْ جَسَدِهِ',
      translation: 'Bahwa Nabi SAW setiap malam ketika hendak tidur mengumpulkan kedua telapak tangannya, lalu meniupnya perlahan dan membaca: Qul Huwallahu Ahad, Qul A\'udzu bi Rabbil Falaq, dan Qul A\'udzu bi Rabbin Naas, kemudian mengusapkannya ke seluruh tubuh yang dapat dijangkau.',
      grade: 'Shahih',
      context: 'Doa dan tilawah Al-Qur\'an diterapkan Nabi sebagai proteksi psikologis dan fisik sebelum istirahat malam.'
    },
    modernScience: {
      keyCompounds: ['Gelombang Alpha Otak (8 - 12 Hz)', 'Penurunan Hormon Kortisol', 'Pelepasan Neurotransmiter Endorfin & GABA', 'Heart Rate Variability (HRV)'],
      biochemicalMechanism: 'Irama ritmik tajwid dan frekuensi vokal pembacaan Al-Qur\'an merangsang jalur auditori talamokortikal menuju sistem limbik (amigdala). Hal ini menonaktifkan sumbu stres HPA (Hypothalamic-Pituitary-Adrenal), menekan denyut simpatis berlebih dan meningkatkan variabilitas denyut jantung (HRV) yang mencerminkan kesehatan kardiovaskular.',
      clinicalBenefits: [
        'Menurunkan skor kecemasan pre-operasi pada pasien bedah mayor',
        'Menstabilkan tekanan darah dan frekuensi napas pada pasien ICU',
        'Membantu mengatasi insomnia dan meningkatkan kualitas tidur gelombang lambat (deep sleep)',
        'Meningkatkan toleransi rasa nyeri kronis melalui stimulasi pelepasan endorfin'
      ],
      modernResearchStudies: [
        {
          journal: 'Complementary Therapies in Clinical Practice',
          finding: 'Mendengarkan tilawah Al-Qur\'an selama 15 menit secara signifikan menurunkan kecemasan dan kadar hormon stres kortisol pada pasien hemodialisis.'
        },
        {
          journal: 'Journal of Religion and Health',
          finding: 'Perekaman EEG membuktikan tilawah Al-Qur\'an menghasilkan efek relaksasi mental lebih kuat dan stabil dibanding musik klasik terapi (Mozart effect).'
        }
      ]
    },
    practicalGuide: {
      recommendedUsage: 'Dengarkan tilawah tartil Al-Qur\'an secara rutin 15-30 menit menjelang tidur atau saat merasa cemas dan penat dengan earphone/speaker jernih.',
      dosageOrMethod: 'Bagi yang sakit, bacakan Surah Al-Fatihah, Ayat Kursi, dan Al-Mu\'awwidzatain (Al-Ikhlas, Al-Falaq, An-Naas) dengan menghayati makna dan penuh tawakal.',
      contraindicationsAndCautions: [
        'Ruqyah syar\'iyyah dan terapi Al-Qur\'an adalah ikhtiar spiritual komplementer yang berjalan berdampingan harmonis dengan terapi medis dokter, bukan saling meniadakan.'
      ],
      lifestyleTips: [
        'Jadikan tilawah harian sebagai rutinitas "hygiene mental" keluarga setelah sholat Maghrib dan Subuh.'
      ]
    },
    visualIllustration: {
      type: 'anatomy-flow',
      caption: 'Modulasi Akustik Sistem Limbik Amigdala & Transisi Gelombang Beta ke Alpha',
      accentColor: '#9333EA',
      diagramData: {
        title: 'Psiko-Akustik Neuroterapi Al-Qur\'an',
        subtitle: 'Limbic System Soothing & HPA Axis Normalization',
        labels: [
          { id: 'y1', title: 'Stimulasi Korteks Auditori & Talamus', desc: 'Resonansi vokal tajwid menginduksi gelombang Alpha menenangkan', x: 42, y: 22 },
          { id: 'y2', title: 'Penenangan Amigdala & Sistem Limbik', desc: 'Menurunkan alarm kecemasan dan menghentikan respon panik fight-or-flight', x: 26, y: 38 },
          { id: 'y3', title: 'Supresi Sumbu HPA (Kortisol Turun)', desc: 'Kelenjar adrenal menurunkan sekresi hormon stres yang merusak organ', x: 74, y: 38 },
          { id: 'y4', title: 'Stabilisasi Denyut Jantung (HRV Naik)', desc: 'Dominasi saraf parasimpatis melambatkan denyut nadi dan tensi darah', x: 50, y: 75 }
        ]
      }
    }
  },
  {
    id: 'asi-eksklusif-laktasi',
    title: 'ASI Eksklusif 24 Bulan (Laktasi & Antibodi sIgA Emas)',
    arabicTerm: 'الرَّضَاعَة (Ar-Radhaa\'ah)',
    latinScientificName: 'Human lactation & Secretory Immunoglobulin A (sIgA)',
    category: 'embriologi-anatomi',
    categoryLabel: 'Embriologi & Tumbuh Kembang',
    organSystems: ['reproduksi', 'imun', 'pencernaan'],
    summary: 'Al-Qur\'an menetapkan standar emas menyusui selama 2 tahun penuh (QS. Al-Baqarah:233). Pedoman medis global WHO & Ikatan Dokter Anak Indonesia (IDAI) membuktikan ASI mengandung oligosakarida (HMO), antibodi sIgA, dan asam lemak DHA/ARA yang tidak dapat ditiru susu formula buatan mana pun.',
    quranVerse: {
      surahNumber: 2,
      surahName: 'Al-Baqarah',
      ayahNumber: 233,
      arabicText: 'وَالْوَالِدَاتُ يُرْضِعْنَ أَوْلَادَهُنَّ حَوْلَيْنِ كَامِلَيْنِ ۖ لِمَنْ أَرَادَ أَنْ يُتِمَّ الرَّضَاعَةَ',
      transliteration: 'Wal-waalidaatu yurdhi\'na aulaadahunna haulaini kaamilaini liman araada ay yutimmar-radhaa\'ah.',
      translation: 'Dan ibu-ibu hendaklah menyusui anak-anaknya selama dua tahun penuh, bagi yang ingin menyempurnakan penyusuan...',
      tafsirBrief: 'Lafaz "haulaini kaamilaini" (dua tahun penuh) menegaskan periode emas perkembangan imunitas pasif dan maturasi usus anak yang baru tuntas sempurna pada usia 24 bulan.'
    },
    hadith: {
      narrator: 'HR. Ibnu Majah (no. 1998)',
      arabicText: 'لَيْسَ لِلصَّبِيِّ لَبَنٌ خَيْرٌ مِنْ لَبَنِ أُمِّهِ',
      translation: 'Tidak ada susu yang lebih baik bagi seorang bayi selain susu dari ibunya sendiri.',
      grade: 'Hasan',
      context: 'Nabi SAW dipelihara dan disusui oleh Halimah As-Sa\'diyah di perkampungan Bani Sa\'ad yang terkenal berudara bersih dan berfisik kuat.'
    },
    modernScience: {
      keyCompounds: ['Secretory IgA (sIgA)', 'Human Milk Oligosaccharides (HMO)', 'Laktoferin & Lisosim', 'DHA & ARA (Omega-3 & 6)', 'Bifidobacterium infantis'],
      biochemicalMechanism: 'Kolostrum dan ASI matang melapisi dinding mukosa usus bayi yang masih permeabel (leaky gut fisiologis). Antibodi sIgA bertindak sebagai perisai anti-adhesi yang menangkap bakteri patogen (seperti E. coli dan Rotavirus), sementara HMO menjadi pakan spesifik bakteri baik Bifidobacteria.',
      clinicalBenefits: [
        'Menurunkan angka kematian bayi akibat diare infeksi dan pneumonia hingga 80%',
        'Mengurangi risiko alergi atopik, asma, dan eksim infantil',
        'Meningkatkan Intelligence Quotient (IQ) berkat kandungan asam lemak DHA untuk mielinisasi otak',
        'Melindungi ibu menyusui dari risiko kanker payudara dan ovarium'
      ],
      modernResearchStudies: [
        {
          journal: 'The Lancet Breastfeeding Series',
          finding: 'Pemberian ASI eksklusif berpotensi menyelamatkan lebih dari 820.000 nyawa anak di bawah lima tahun setiap tahunnya di seluruh dunia.'
        },
        {
          journal: 'Nature Medicine',
          finding: 'Komposisi mikrobiota usus bayi yang disusui ASI selama 2 tahun menunjukkan ketahanan imunitas jangka panjang terhadap penyakit autoimun.'
        }
      ]
    },
    practicalGuide: {
      recommendedUsage: 'Lakukan Inisiasi Menyusu Dini (IMD) dalam 1 jam pertama kelahiran. Berikan ASI eksklusif selama 6 bulan pertama, lalu lanjutkan hingga 2 tahun disertai MP-ASI bergizi seimbang.',
      dosageOrMethod: 'Menyusui sesuai kebutuhan bayi (on demand), minimal 8-12 kali dalam 24 jam.',
      contraindicationsAndCautions: [
        'Ibu dengan kondisi medis tertentu (misal infeksi HIV tanpa terapi ARV atau kemoterapi aktif) perlu bimbingan dokter spesialis anak.'
      ],
      lifestyleTips: [
        'Dukungan penuh dari suami (ayah ASI) dan keluarga sangat menentukan kelancaran hormon oksitosin pengeluaran ASI.'
      ]
    },
    visualIllustration: {
      type: 'bio-diagram',
      caption: 'Perisai Molekul sIgA & Kolonisasi Mikrobioma Baik pada Usus Bayi',
      accentColor: '#EC4899',
      diagramData: {
        title: 'Imunologi Laktasi Al-Qur\'an',
        subtitle: 'Enteromammary Circulation & Gut Mucosal Shield',
        labels: [
          { id: 'l1', title: 'Antibodi Spesifik Ibu (sIgA)', desc: 'Diproduksi kelenjar mamae sesuai kuman di lingkungan ibu dan bayi', x: 26, y: 26 },
          { id: 'l2', title: 'HMO Pakan Bakteri Baik Usus', desc: 'Menumbuhkan Bifidobacteria yang mencegah bakteri jahat menempel', x: 74, y: 28 },
          { id: 'l3', title: 'Penutupan Celah Mukosa Usus', desc: 'Mencegah molekul protein asing pemicu alergi menembus darah', x: 38, y: 72 },
          { id: 'l4', title: 'DHA/ARA untuk Sinaps Otak', desc: 'Mempercepat transmisi saraf dan kecerdasan kognitif anak', x: 80, y: 74 }
        ]
      }
    }
  },
  {
    id: 'tidur-sirkadian-malam',
    title: 'Siklus Tidur Sirkadian & Kegelapan Malam (Melatonin & Regenerasi DNA)',
    arabicTerm: 'النَّوْمُ سُبَاتًا (An-Naumu Subaataa)',
    latinScientificName: 'Circadian rhythm & Pineal melatonin secretion',
    category: 'higienitas-pencegahan',
    categoryLabel: 'Pencegahan & Higienitas',
    organSystems: ['otak', 'jantung', 'imun'],
    summary: 'Al-Qur\'an menetapkan malam sebagai pakaian (libas) dan sarana istirahat/pemulihan (subata). Kedokteran kronobiologi membuktikan kelenjar pineal hanya melepaskan hormon melatonin maksimal saat ruangan gelap gulita, meregenerasi mitokondria, dan membersihkan racun otak via sistem gliatik.',
    quranVerse: {
      surahNumber: 78,
      surahName: 'An-Naba\'',
      ayahNumber: '9-10',
      arabicText: 'وَجَعَلْنَا نَوْمَكُمْ سُبَاتًا ۝ وَجَعَلْنَا اللَّيْلَ لِبَاسًا',
      transliteration: 'Wa ja\'alnaa naumakum subaataa. Wa ja\'alnal-laila libaasaa.',
      translation: 'Dan Kami menjadikan tidurmu untuk istirahat (subata). Dan Kami menjadikan malam sebagai pakaian.',
      tafsirBrief: 'Kata "subata" secara etimologis berarti pemutusan aktivitas (interupsi metabolik) agar organ-organ tubuh berkesempatan melakukan perbaikan jaringan yang aus setelah lelah beraktivitas siang hari.'
    },
    hadith: {
      narrator: 'HR. Al-Bukhari (no. 568) & Muslim (no. 647)',
      arabicText: 'أَنَّ رَسُولَ اللَّهِ ﷺ كَانَ يَكْرَهُ النَّوْمَ قَبْلَ الْعِشَاءِ وَالْحَدِيثَ بَعْدَهَا',
      translation: 'Bahwa Rasulullah SAW membenci tidur sebelum sholat Isya dan membenci percakapan (begadang) sesudahnya.',
      grade: 'Shahih',
      context: 'Nabi SAW tidur di awal malam setelah Isya, lalu bangun di sepertiga malam terakhir untuk bertahajud, yang secara kronobiologi merupakan fase tidur paling berkualitas.'
    },
    modernScience: {
      keyCompounds: ['Melatonin (N-asetil-5-metoksitriptamin)', 'Sistem Glimfatik Otak', 'Ritme Sirkadian Intrinsic (SCN)', 'Hormon Pertumbuhan (HGH)', 'Penurunan Tekanan Darah Nokturnal (Dipping)'],
      biochemicalMechanism: 'Fotoreseptor retina melanopsin merespons hilangnya cahaya biru (blue light) di malam hari dengan mengirim sinyal ke nukleus suprakiasmatik (SCN) di hipotalamus, memicu kelenjar pineal menyekresikan melatonin. Saat tidur nyenyak (NREM), sistem glimfatik membuka ruang interstitial otak 60% lebih lebar untuk mencuci protein amiloid beracun penyebab Alzheimer.',
      clinicalBenefits: [
        'Melatonin bertindak sebagai antioksidan endogen terkuat penangkal radikal bebas kanker',
        'Pembersihan metabolit otak mencegah kepikunan dan demensia dini',
        'Regulasi tekanan darah di malam hari (fenomena dipping normal) melindungi jantung',
        'Stabilisasi metabolisme glukosa dan pencegahan obesitas'
      ],
      modernResearchStudies: [
        {
          journal: 'Science (Glymphatic System Discovery)',
          finding: 'Peneliti membuktikan bahwa cairan serebrospinal mengalir deras membilas otak dari racun neurotoksik hanya selama fase tidur gelombang lambat di malam hari.'
        },
        {
          journal: 'Sleep Medicine Reviews',
          finding: 'Tidur teratur di awal malam selaras dengan ritme sirkadian menurunkan risiko depresi mayor dan meningkatkan daya ingat konsolidasi memori.'
        }
      ]
    },
    practicalGuide: {
      recommendedUsage: 'Tidurlah segera setelah Isya, hindari begadang tanpa uzur syar\'i. Padamkan lampu kamar tidur hingga gelap total.',
      dosageOrMethod: 'Durasi tidur malam ideal orang dewasa: 6-8 jam. Bila bangun tahajud di sepertiga malam, sempatkan qailulah (tidur siang singkat 15-20 menit) sebelum Dzuhur.',
      contraindicationsAndCautions: [
        'Hindari menatap layar gadget/ponsel 1 jam sebelum tidur karena pancaran blue light memblokir pelepasan melatonin hingga 80%.'
      ],
      lifestyleTips: [
        'Matikan lampu kamar saat tidur, sebagaimana hadits Nabi: "Padamkanlah lampu-lampu kalian di waktu malam jika kalian hendak tidur" (HR. Bukhari).'
      ]
    },
    visualIllustration: {
      type: 'bio-diagram',
      caption: 'Poros Retina-SCN-Pineal & Pembilasan Toksin Otak oleh Sistem Glimfatik Malam',
      accentColor: '#4338CA',
      diagramData: {
        title: 'Kronobiologi Sirkadian & Melatonin',
        subtitle: 'Pineal Gland Secretion & Glymphatic Waste Clearance',
        labels: [
          { id: 't1', title: 'Kegelapan Malam Menstimulasi SCN', desc: 'Ketiadaan cahaya biru memicu sinyal pembentukan hormon melatonin', x: 28, y: 25 },
          { id: 't2', title: 'Sekresi Melatonin Puncak Jam 22-02', desc: 'Antioksidan onkologis alami beredar membersihkan sel-sel tubuh', x: 72, y: 28 },
          { id: 't3', title: 'Aktivasi Aliran Sistem Glimfatik', desc: 'Cairan serebrospinal mencuci plak amiloid beracun dari neuron otak', x: 38, y: 72 },
          { id: 't4', title: 'Pelepasan Hormon Pertumbuhan (HGH)', desc: 'Memperbaiki jaringan sel otot dan membran organ yang aus', x: 80, y: 74 }
        ]
      }
    }
  },
  {
    id: 'air-zamzam-mineralogi',
    title: 'Air Zamzam (Alkalinitas Alami & Hidrasi Seluler Tinggi)',
    arabicTerm: 'مَاءُ زَمْزَم (Maa-u Zamzam)',
    latinScientificName: 'Natural alkaline mineral water',
    category: 'nutrisi-herbal',
    categoryLabel: 'Nutrisi & Herbal Nabawi',
    organSystems: ['pencernaan', 'jantung', 'tulang'],
    summary: 'Mata air mukjizat yang memancar di dekat Ka\'bah sejak zaman Nabi Ismail AS. Analisis laboratorium internasional membuktikan air Zamzam memiliki pH basa (alkali ~8.0), kaya kalsium, magnesium, dan florida alami yang bebas kontaminasi mikroba pathogen.',
    quranVerse: {
      surahNumber: 14,
      surahName: 'Ibrahim',
      ayahNumber: 37,
      arabicText: 'رَبَّنَا إِنِّي أَسْكَنْتُ مِنْ ذُرِّيَّتِي بِوَادٍ غَيْرِ ذِي زَرْعٍ عِنْدَ بَيْتِكَ الْمُحَرَّمِ رَبَّنَا لِيُقِيمُوا الصَّلَاةَ فَاجْعَلْ أَفْئِدَةً مِنَ النَّاسِ تَهْوِي إِلَيْهِمْ وَارْزُقْهُمْ مِنَ الثَّمَرَاتِ لَعَلَّهُمْ يَشْكُرُونَ',
      transliteration: 'Rabbanaaa inniii askantu min dzurriyyatii biwaadin ghairi dzii zar\'in \'inda baitikal-muharrami rabbanaa liyuqiimush-shalaata...',
      translation: 'Ya Tuhan, sesungguhnya aku telah menempatkan sebagian keturunanku di lembah yang tidak mempunyai tanam-tanaman di dekat rumah-Mu (Baitullah) yang dihormati...',
      tafsirBrief: 'Doa Nabi Ibrahim yang dijawab Allah dengan memancarkan mata air Zamzam melalui hentakan tumit malaikat Jibril dan kaki bayi Ismail di padang gersang Makkah.'
    },
    hadith: {
      narrator: 'HR. Ibnu Majah (no. 3062) & Ahmad (no. 14849)',
      arabicText: 'مَاءُ زَمْزَمَ لِمَا شُرِبَ لَهُ',
      translation: 'Air Zamzam itu berkhasiat sesuai dengan apa yang diniatkan oleh orang yang meminumnya.',
      grade: 'Shahih',
      context: 'Nabi SAW juga bersabda: "Sebaik-baik air di muka bumi adalah air Zamzam, padanya ada makanan yang mengenyangkan dan obat dari penyakit" (HR. Thabrani).'
    },
    modernScience: {
      keyCompounds: ['Kalsium & Magnesium Tinggi', 'Florida Alami (Bakteriostatik)', 'pH Basa Alami (7.9 - 8.2)', 'Bikarbonat Netralisator Asam', 'Bebas Klorin & Bebas Patogen'],
      biochemicalMechanism: 'Kombinasi pH alkali dan konsentrasi ion bikarbonat membantu menyangga (buffering) asidosis metabolik jaringan tubuh, sementara mineral kalsium dan magnesium mudah diserap menembus membran saluran akuaporin seluler untuk hidrasi instan.',
      clinicalBenefits: [
        'Meredakan hiperasiditas lambung dan gejala dispepsia fungsional',
        'Menyokong kepadatan massa tulang berkat bioavailabilitas kalsium tinggi',
        'Mencegah karies gigi dan kavitasi berkat kandungan florida alami seimbang',
        'Meningkatkan daya tahan fisik dan mempercepat rehidrasi elektrolit tubuh'
      ],
      modernResearchStudies: [
        {
          journal: 'International Journal of Food Properties',
          finding: 'Kajian mineralogi menegaskan air Zamzam memiliki sifat fisiko-kimia unik: konsentrasi mineral stabil selama berabad-abad tanpa penambahan zat kimia pengawet buatan apa pun.'
        },
        {
          journal: 'Cardiovascular Journal of Africa',
          finding: 'Konsumsi air beralkalinitas alami dengan kandungan magnesium seperti Zamzam terbukti memberikan proteksi terhadap disfungsi endotel vaskular.'
        }
      ]
    },
    practicalGuide: {
      recommendedUsage: 'Minum air Zamzam dalam keadaan duduk, membaca basmalah, menghadap kiblat, bernapas 3 kali di luar bejana, dan diiringi doa permohonan ilmu bermanfaat, rezeki lapang, dan kesembuhan dari segala penyakit.',
      dosageOrMethod: '1-2 gelas per hari saat tersedia.',
      contraindicationsAndCautions: [
        'Pastikan mendapatkan air Zamzam asli dari sumber resmi otoritas Makkah untuk menghindari pemalsuan air kemasan ilegal.'
      ],
      lifestyleTips: [
        'Bila tidak memiliki air Zamzam, biasakan minum air putih bersih berkualitas dengan pH netral hingga sedikit basa setiap hari.'
      ]
    },
    visualIllustration: {
      type: 'biochemical-cell',
      caption: 'Spektrum Mineralogi Kalsium-Magnesium & Penetrasi Kanal Akuaporin Seluler',
      accentColor: '#0284C7',
      diagramData: {
        title: 'Fisiko-Kimia Air Zamzam',
        subtitle: 'Natural Alkaline pH & Cellular Ion Balance',
        labels: [
          { id: 'z1', title: 'pH Basa Alami (7.9 - 8.2)', desc: 'Menetralisir keasaman asam lambung dan cairan asidosis jaringan', x: 26, y: 26 },
          { id: 'z2', title: 'Kalsium & Magnesium Organik', desc: 'Diserap efisien untuk kesehatan tulang dan transmisi saraf otot', x: 74, y: 28 },
          { id: 'z3', title: 'Florida Alami Bakteriostatik', desc: 'Melindungi enamel gigi dari kolonisasi bakteri Streptococcus mutans', x: 38, y: 72 },
          { id: 'z4', title: 'Penetrasi Aquaporin Membran Sel', desc: 'Memberikan hidrasi intraseluler kilat merevitalisasi organ vital', x: 80, y: 74 }
        ]
      }
    }
  },
  {
    id: 'buah-tin-prebiotik',
    title: 'Buah Tin / Fig (Ficus carica - Serat Prebiotik & Enzim Fisin)',
    arabicTerm: 'التِّين (At-Tiin)',
    latinScientificName: 'Ficus carica L.',
    category: 'nutrisi-herbal',
    categoryLabel: 'Nutrisi & Herbal Nabawi',
    organSystems: ['pencernaan', 'jantung', 'tulang'],
    summary: 'Buah yang diabadikan sebagai nama surah dalam Al-Qur\'an (At-Tin). Mengandung enzim proteolitik fisin yang melunakkan protein makanan, serat prebiotik tinggi pencegah kanker kolon, serta kalsium nabati penguat tulang.',
    quranVerse: {
      surahNumber: 95,
      surahName: 'At-Tin',
      ayahNumber: 1,
      arabicText: 'وَالتِّينِ وَالزَّيْتُونِ',
      transliteration: 'Wat-tiini waz-zaituun.',
      translation: 'Demi (buah) Tin dan (buah) Zaitun,',
      tafsirBrief: 'Allah SWT bersumpah dengan buah Tin dan Zaitun menunjukkan kemuliaan, keberkahan, serta segudang keajaiban nutrisi dan pengobatan yang tersimpan di dalam keduanya bagi kesehatan manusia.'
    },
    hadith: {
      narrator: 'HR. Abu Nu\'aim dalam Ath-Thibb An-Nabawi & As-Suyuthi',
      arabicText: 'كُلُوا التِّينَ؛ فَإِنَّهُ لَوْ قُلْتُ: إِنَّ فَاكِهَةً نَزَلَتْ مِنَ الْجَنَّةِ قُلْتُ: هَذِهِ، فَإِنَّهَا فَاكِهَةٌ بِلاَ عَجَمٍ، فَكُلُوهَا؛ فَإِنَّهَا تَقْطَعُ الْبَوَاسِيرَ، وَتَنْفَعُ مِنَ النِّقْرِسِ',
      translation: 'Makanlah buah tin; sekiranya aku katakan ada buah yang diturunkan dari surga, niscaya aku katakan inilah dia, karena ia buah tanpa biji keras... ia mengobati wasir dan meredakan asam urat (encok).',
      grade: 'Hasan',
      context: 'Meskipun sebagian hadits terkait buah tin berderajat hasan/dhaif lighairihi, khasiat klinisnya divalidasi penuh oleh sains modern.'
    },
    modernScience: {
      keyCompounds: ['Enzim Proteolitik Fisin', 'Serat Pektin & Hemiselulosa', 'Polifenol Luteolin & Quercetin', 'Kalsium & Kalium Nabati', 'Benzaldehida'],
      biochemicalMechanism: 'Enzim fisin memecah rantai polipeptida protein di lambung, sementara kandungan serat tak larut mengikat air dan menambah massa feses, mempercepat waktu transit usus dan meredakan tekanan pembuluh darah pleksus hemoroidalis (wasir).',
      clinicalBenefits: [
        'Mengatasi sembelit kronis (konstipasi) tanpa menimbulkan efek ketergantungan obat pencahar',
        'Membantu pencegahan dan terapi wasir (hemoroid) stadium awal',
        'Prebiotik merawat flora bakteri baik mikrobioma usus besar',
        'Menurunkan penyerapan kolesterol makanan dan asam urat serum'
      ],
      modernResearchStudies: [
        {
          journal: 'American Journal of Chinese Medicine',
          finding: 'Konsumsi pasta buah tin selama 8 minggu secara signifikan memperbaiki motilitas usus, melunakkan konsistensi feses, dan meredakan nyeri defekasi pada pasien konstipasi kronis.'
        },
        {
          journal: 'Biomedicine & Pharmacotherapy',
          finding: 'Senyawa polifenol buah tin menunjukkan aktivitas antioksidan dan pelindung sel hati dari toksisitas metabolik.'
        }
      ]
    },
    practicalGuide: {
      recommendedUsage: 'Dapat dikonsumsi segar atau buah tin kering. Rendam 2-3 buah tin kering dalam air semalaman, lalu makan buahnya dan minum air rendamannya di pagi hari.',
      dosageOrMethod: '2-4 butir per hari.',
      contraindicationsAndCautions: [
        'Buah tin kering memiliki kandungan gula alami pekat, penderita diabetes perlu mengontrol porsinya.'
      ],
      lifestyleTips: [
        'Sangat lezat dikombinasikan dengan minyak zaitun untuk menjaga kelembutan saluran pencernaan.'
      ]
    },
    visualIllustration: {
      type: 'bio-diagram',
      caption: 'Pencernaan Enzimatik Fisin & Serat Prebiotik Pelindung Pleksus Hemoroid Usus',
      accentColor: '#16A34A',
      diagramData: {
        title: 'Farmakologi Pencernaan Buah Tin',
        subtitle: 'Ficin Proteolytic Enzyme & Colon Prebiotic Fiber',
        labels: [
          { id: 'f1', title: 'Enzim Fisin Pemecah Protein', desc: 'Membantu melumatkan gumpalan daging makanan berat di lambung', x: 26, y: 28 },
          { id: 'f2', title: 'Serat Pektin Pengikat Air Usus', desc: 'Menambah massa tinja melunakkan feses mencegah sembelit wasir', x: 74, y: 30 },
          { id: 'f3', title: 'Fermentasi Prebiotik SCFA', desc: 'Menghasilkan asam lemak rantai pendek perawat sel epitel kolon', x: 40, y: 72 },
          { id: 'f4', title: 'Kalsium & Antioksidan Luteolin', desc: 'Menjaga kekuatan tulang dan menangkal inflamasi sendi asam urat', x: 80, y: 74 }
        ]
      }
    }
  },
  {
    id: 'buah-delima-rumman',
    title: 'Buah Delima / Rumman (Punica granatum - Punicalagin & Endotel Jantung)',
    arabicTerm: 'الرُّمَّان (Ar-Rummaan)',
    latinScientificName: 'Punica granatum L.',
    category: 'nutrisi-herbal',
    categoryLabel: 'Nutrisi & Herbal Nabawi',
    organSystems: ['jantung', 'kulit-mata', 'pencernaan'],
    summary: 'Buah surga yang disebut 3 kali dalam Al-Qur\'an (Ar-Rahman:68, Al-An\'am:99 & 141). Mengandung senyawa elagitanin punicalagin unik dengan kapasitas antioksidan 3 kali lipat lebih tinggi dari teh hijau, terbukti menurunkan tekanan darah dan membersihkan plak karotis.',
    quranVerse: {
      surahNumber: 55,
      surahName: 'Ar-Rahman',
      ayahNumber: 68,
      arabicText: 'فِيهِمَا فَاكِهَةٌ وَنَخْلٌ وَرُمَّانٌ',
      transliteration: 'Fiihimaa faakihatuw wa nakhluw wa rummaan.',
      translation: 'Di dalam kedua surga itu ada buah-buahan, kurma dan delima.',
      tafsirBrief: 'Penyebutan kurma dan delima secara khusus setelah penyebutan umum "faakihah" (buah-buahan) menunjukkan kedudukan istimewa dan manfaat medis luhur yang dimilikinya dibanding buah-buahan lainnya.'
    },
    hadith: {
      narrator: 'Atsar Ali bin Abi Thalib RA (Riwayat Ahmad dalam Kitab Az-Zuhd & Abu Nu\'aim)',
      arabicText: 'كُلُوا الرُّمَّانَ بِشَحْمِهِ فَإِنَّهُ دِبَاغُ الْمَعِدَةِ',
      translation: 'Makanlah buah delima beserta serat/lapisan putih dalamnya, karena sesungguhnya ia merupakan penyamak (pembersih/pelindung) bagi lambung.',
      grade: 'Hasan',
      context: 'Ali bin Abi Thalib menekankan memakan delima beserta selaput putih pembungkus bulir arilnya yang kaya tannin obat lambung.'
    },
    modernScience: {
      keyCompounds: ['Punicalagin (Elagitanin 100% larut air)', 'Asam Punisat (Asam lemak terkonjugasi Omega-5)', 'Antosianin Pelindung Pembuluh Darah', 'Inhibitor Enzim ACE'],
      biochemicalMechanism: 'Punicalagin dimetabolisme oleh mikrobioma usus menjadi urolitin A yang menstimulasi mitofagi (daur ulang mitokondria otot jantung). Delima juga menghambat Angiotensin Converting Enzyme (ACE), merangsang pelepasan Nitric Oxide (NO) untuk melebarkan pembuluh darah dan menstabilkan tensi.',
      clinicalBenefits: [
        'Menurunkan tekanan darah sistolik dan diastolik pada penderita hipertensi',
        'Menghambat oksidasi kolesterol LDL dan meregresi ketebalan plak arteri karotis',
        'Menguatkan integritas lapisan mukosa lambung dan mencegah gastritis',
        'Menjaga elastisitas kulit dan menekan enzim degradasi kolagen'
      ],
      modernResearchStudies: [
        {
          journal: 'Clinical Nutrition (Carotid Atherosclerosis Study)',
          finding: 'Konsumsi jus buah delima harian selama 1 tahun terbukti mengurangi ketebalan plak intima-media arteri karotis hingga 30% pada pasien stenosis.'
        },
        {
          journal: 'Nature Medicine',
          finding: 'Urolitin A yang berasal dari buah delima memicu peremajaan mitokondria dan meningkatkan performa otot rangka pada subjek lanjut usia.'
        }
      ]
    },
    practicalGuide: {
      recommendedUsage: 'Konsumsi bulir segar buah delima bersama lapisan serat halusnya, atau buat jus murni segar tanpa gula tambahan.',
      dosageOrMethod: '1 buah delima segar atau 150-200 ml jus murni per hari.',
      contraindicationsAndCautions: [
        'Karena memiliki efek penurun tekanan darah alami, penderita yang mengonsumsi obat antihipertensi dosis tinggi sebaiknya memonitor tensi darah secara rutin.'
      ],
      lifestyleTips: [
        'Pilih buah delima yang matang dengan kulit merah kekuningan yang berat dan padat.'
      ]
    },
    visualIllustration: {
      type: 'anatomy-flow',
      caption: 'Vasodilatasi Nitric Oxide & Regresi Plak Aterosklerosis oleh Punicalagin Delima',
      accentColor: '#BE123C',
      diagramData: {
        title: 'Kardioprotektif Buah Delima',
        subtitle: 'Punicalagin Endothelial Vasodilation & Anti-Atheroma Pathway',
        labels: [
          { id: 'd1', title: 'Punicalagin & Asam Punisat', desc: 'Kapasitas antioksidan 3x teh hijau menangkal peroksidasi radikal bebas', x: 28, y: 26 },
          { id: 'd2', title: 'Stimulasi Enzim eNOS (Nitric Oxide)', desc: 'Melebarkan dinding arteri melancarkan aliran darah ke miokardium jantung', x: 74, y: 28 },
          { id: 'd3', title: 'Inhibisi Enzim ACE Alami', desc: 'Menurunkan resistensi vaskular sistemik menurunkan hipertensi darah', x: 38, y: 72 },
          { id: 'd4', title: 'Urolitin A & Peremajaan Otot', desc: 'Memperbaiki mitokondria serat otot jantung yang menua', x: 80, y: 74 }
        ]
      }
    }
  },
  {
    id: 'jahe-zanjabil-antiemetik',
    title: 'Jahe / Zanjabil (Zingiber officinale - Gingerol & Anti-Emetik Lambung)',
    arabicTerm: 'الزَّنْجَبِيل (Az-Zanjabiil)',
    latinScientificName: 'Zingiber officinale Roscoe',
    category: 'nutrisi-herbal',
    categoryLabel: 'Nutrisi & Herbal Nabawi',
    organSystems: ['pencernaan', 'tulang', 'jantung'],
    summary: 'Minuman kenikmatan surga yang diabadikan dalam QS. Al-Insan:17. Senyawa bioaktif gingerol dan shogaol bekerja sebagai antagonis reseptor serotonin 5-HT3 pada lambung, menjadikannya obat alami terbaik meredakan mual, kembung, dan nyeri sendi rematik.',
    quranVerse: {
      surahNumber: 76,
      surahName: 'Al-Insan',
      ayahNumber: 17,
      arabicText: 'وَيُسْقَوْنَ فِيهَا كَأْسًا كَانَ مِزَاجُهَا زَنْجَبِيلًا',
      transliteration: 'Wa yusqauna fiihaa ka\'san kaana mizaajuhaa zanjabiilaa.',
      translation: 'Dan di sana mereka diberi segelas minuman yang campurannya adalah jahe.',
      tafsirBrief: 'Orang-orang Arab sangat menyukai minuman beraroma jahe karena kehangatan, aroma harum, dan khasiatnya yang menyegarkan lambung dan melancarkan pencernaan.'
    },
    hadith: {
      narrator: 'HR. Al-Hakim dalam Al-Mustadrak (no. 7190)',
      arabicText: 'أَهْدَى مَلِكُ الرُّومِ إِلَى رَسُولِ اللَّهِ ﷺ جَرَّةَ زَنْجَبِيلٍ، فَأَطْعَمَ كُلَّ إِنْسَانٍ قِطْعَةً، وَأَطْعَمَنِي قِطْعَةً',
      translation: 'Raja Romawi menghadiahkan kepada Rasulullah SAW satu guci jahe, lalu beliau memotongnya dan memberikan sepotong kepada setiap orang, dan beliau juga memberiku sepotong (kata Abu Sa\'id Al-Khudri).',
      grade: 'Hasan',
      context: 'Nabi SAW menyukai khasiat menghangatkan jahe dan membagikannya kepada para sahabat.'
    },
    modernScience: {
      keyCompounds: ['6-Gingerol & 6-Shogaol', 'Zingiberene', 'Paradol', 'Inhibitor Reseptor Serotonin 5-HT3'],
      biochemicalMechanism: 'Gingerol memblokir reseptor 5-HT3 pada serabut saraf vagus saluran cerna dan chemoreceptor trigger zone (CTZ) di batang otak, memadamkan refleks mual dan muntah secara sentral dan perifer tanpa efek sedasi mengantuk.',
      clinicalBenefits: [
        'Meredakan mual kehamilan (morning sickness) dan mabuk perjalanan (motion sickness)',
        'Meredakan mual pasca-kemoterapi dan pasca-operasi bedah',
        'Antiinflamasi alami meredakan kaku nyeri sendi osteoartritis',
        'Mempercepat pengosongan lambung pada pasien dispepsia fungsional'
      ],
      modernResearchStudies: [
        {
          journal: 'American Family Physician',
          finding: 'Jahe terbukti aman dan efektif meredakan mual dan muntah pada trimester pertama kehamilan tanpa efek samping merugikan bagi janin.'
        },
        {
          journal: 'Arthritis & Rheumatology',
          finding: 'Ekstrak jahe secara signifikan mengurangi rasa sakit dan kekakuan sendi pada pasien osteoartritis lutut berkat supresi jalur sitokin TNF-alpha.'
        }
      ]
    },
    practicalGuide: {
      recommendedUsage: 'Irisan jahe merah atau jahe emprit segar direbus dalam air hangat selama 10 menit, nikmati bersama madu murni.',
      dosageOrMethod: 'Jahe segar: 2-4 gram per hari. Bubuk jahe kering: 1-2 gram per hari.',
      contraindicationsAndCautions: [
        'Penderita dengan batu empedu besar atau pasien yang sedang menggunakan obat antikoagulan warfarin dosis tinggi sebaiknya tidak mengonsumsi jahe berlebihan.'
      ],
      lifestyleTips: [
        'Minum wedang jahe hangat di pagi hari atau saat cuaca dingin untuk melancarkan sirkulasi darah tepi.'
      ]
    },
    visualIllustration: {
      type: 'bio-diagram',
      caption: 'Blokade Reseptor 5-HT3 Vagus Lambung & Efek Vasodilatasi Termogenik Jahe',
      accentColor: '#D97706',
      diagramData: {
        title: 'Mekanisme Anti-Emetik & Termogenik Jahe',
        subtitle: 'Gingerol Vagal Nerve Inhibition & Joint Anti-Inflammation',
        labels: [
          { id: 'j1', title: 'Inhibisi Reseptor Serotonin 5-HT3', desc: 'Memutus impuls pemicu mual dari lambung ke batang otak', x: 26, y: 28 },
          { id: 'j2', title: 'Akselerasi Pengosongan Lambung', desc: 'Melancarkan gerakan peristaltik kimus menuju usus halus', x: 74, y: 30 },
          { id: 'j3', title: 'Vasodilatasi Perifer Termogenik', desc: 'Memberikan rasa hangat nyaman ke seluruh pori-pori dan kulit', x: 40, y: 72 },
          { id: 'j4', title: 'Penghambatan Jalur COX-2 & Leukotrien', desc: 'Meredakan peradangan persendian lutut rematik', x: 80, y: 74 }
        ]
      }
    }
  }
];

// Helper functions for index & search
export function getMedicalEntryById(id: string): QuranMedicalEntry | undefined {
  return QURAN_MEDICAL_DATA.find((item) => item.id === id);
}

export function searchMedicalEntries(query: string): QuranMedicalEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return QURAN_MEDICAL_DATA;

  return QURAN_MEDICAL_DATA.filter((item) => {
    return (
      item.title.toLowerCase().includes(q) ||
      (item.arabicTerm && item.arabicTerm.toLowerCase().includes(q)) ||
      (item.latinScientificName && item.latinScientificName.toLowerCase().includes(q)) ||
      item.summary.toLowerCase().includes(q) ||
      item.quranVerse.surahName.toLowerCase().includes(q) ||
      item.modernScience.keyCompounds.some((k) => k.toLowerCase().includes(q)) ||
      item.modernScience.clinicalBenefits.some((b) => b.toLowerCase().includes(q)) ||
      item.organSystems.some((o) => o.toLowerCase().includes(q))
    );
  });
}
