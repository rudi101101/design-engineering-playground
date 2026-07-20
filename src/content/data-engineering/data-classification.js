export const term = {
  id: "data-classification",
  track: "data-engineering",
  category: "Governance",
  color: "#84cc16",
  icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  simulation: "classification",
  tools: [
    "Google DLP",
    "Microsoft Purview",
    "AWS Macie",
    "BigQuery Policy Tags",
    "Collibra",
  ],
  prerequisites: [],
  related: ["data-masking-anonymization", "rbac-column-row-level-security", "data-catalog"],
  name: { id: "Data Classification", en: "Data Classification" },
  content: {
    description: {
      id: "Data Classification adalah proses mengkategorikan setiap dataset atau kolom data berdasarkan tingkat sensitivitasnya — umumnya dibagi menjadi Public, Internal, Confidential, dan Restricted. Klasifikasi ini bukan sekadar label administratif, melainkan dasar yang menentukan siapa boleh mengakses data tersebut, kontrol keamanan apa yang harus diterapkan, dan bagaimana data itu harus ditangani sepanjang siklus hidupnya. Tanpa klasifikasi yang jelas, organisasi cenderung menerapkan kontrol akses yang seragam untuk semua data — baik terlalu longgar (data sensitif jadi mudah diakses siapa saja) maupun terlalu ketat (data publik jadi sulit diakses tim yang butuh).",
      en: "",
    },
    concept: {
      id: "Bayangkan Data Classification seperti sistem label di sebuah gudang farmasi. Obat bebas dijual di rak depan yang bisa diambil siapa saja (Public). Obat resep disimpan di belakang konter, hanya diberikan dengan resep dokter (Internal/Confidential). Obat golongan narkotika dikunci di brankas terpisah dengan pencatatan setiap kali diambil (Restricted). Label pada kemasan menentukan di rak mana obat itu disimpan dan prosedur apa yang harus diikuti untuk mengaksesnya — persis seperti tag klasifikasi menentukan bagaimana sebuah kolom data harus diperlakukan.",
      en: "",
    },
    methodology: {
      id: "Klasifikasi data dilakukan lewat kombinasi otomasi dan kurasi manusia. Secara otomatis, tool DLP (Data Loss Prevention) memindai konten data untuk mendeteksi pola sensitif — nomor identitas, nomor kartu kredit, alamat email — dan langsung menandainya. Proses ini dimulai saat data masuk (ingest), lalu dipindai (DLP scan) untuk mendeteksi PII atau PHI (informasi kesehatan), kemudian di-tag otomatis sesuai tingkat sensitivitas yang terdeteksi. Selain otomasi, Data Steward juga melakukan tagging manual untuk kasus yang butuh konteks bisnis, misalnya kolom agregat yang secara teknis tidak mengandung PII tapi tetap sensitif secara komersial. Setelah tag klasifikasi ditetapkan, sistem menerapkan kebijakan akses (policy enforcement) sesuai levelnya — data Restricted mungkin hanya bisa diakses role tertentu, sementara data Public bebas diakses siapa saja. Setiap akses ke data terklasifikasi tercatat dalam audit trail.",
      en: "",
    },
    objective: {
      id: "Masalah yang diselesaikan Data Classification adalah kesenjangan antara volume data yang terus tumbuh dan kemampuan organisasi menerapkan kontrol keamanan yang proporsional secara manual. Regulator seperti OJK atau GDPR mensyaratkan penanganan berbeda untuk data pribadi dibanding data agregat biasa, dan tanpa klasifikasi eksplisit, mustahil membuktikan kepatuhan atau bahkan menerapkan kebijakan akses secara konsisten di ribuan tabel dan kolom. Klasifikasi menjadi jembatan antara kebijakan keamanan level organisasi dan implementasi teknis di level kolom.",
      en: "",
    },
    goal: {
      id: "Setiap kolom yang mengandung data sensitif memiliki tag klasifikasi yang akurat dan konsisten, sehingga kebijakan akses bisa diterapkan secara otomatis berdasarkan tag tersebut, dan organisasi mampu menunjukkan bukti audit yang jelas tentang bagaimana data sensitif ditangani dari ujung ke ujung.",
      en: "",
    },
    exampleImplementation: {
      id: "Alur klasifikasi tipikal menggunakan Google DLP terintegrasi dengan BigQuery Policy Tags:\n\n1. **Ingest Data** — data pelanggan baru masuk ke staging table.\n2. **DLP Scan** — job pemindaian berjalan untuk mendeteksi pola PII/PHI di setiap kolom.\n3. **Detect PII/PHI** — kolom seperti nomor identitas dan nomor telepon terdeteksi.\n4. **Auto-tag** — kolom yang terdeteksi otomatis diberi policy tag sesuai tingkat sensitivitas.\n5. **Apply access policies** — akses ke kolom bertag Restricted dibatasi hanya untuk role tertentu.\n6. **Audit trail** — setiap query yang menyentuh kolom terklasifikasi tercatat.\n\nContoh definisi taksonomi klasifikasi:\n\n```yaml\nclassification_policy:\n  restricted:\n    - national_id\n    - credit_card_number\n  confidential:\n    - full_name\n    - phone_number\n  internal:\n    - aggregate_claim_count\n  public:\n    - branch_city\n```\n\nTaksonomi seperti ini menjadi acuan bagi tool DLP dan mesin kebijakan akses untuk menentukan perlakuan tiap kolom secara konsisten.",
      en: "",
    },
    exampleEnterprise: {
      id: "Fintech Cepat menerapkan klasifikasi empat tingkat untuk seluruh data pelanggannya. Nomor identitas nasional diklasifikasikan Restricted dan hanya bisa diakses tim compliance dengan approval khusus. Nama lengkap pelanggan diklasifikasikan Confidential, bisa diakses tim operasional tapi tidak tim marketing eksternal. Jumlah klaim yang sudah diagregasi per wilayah diklasifikasikan Internal, bisa diakses semua karyawan untuk keperluan analisis. Dashboard performa bisnis yang sudah dianonimkan sepenuhnya diklasifikasikan Public dan bisa ditampilkan ke calon investor. Struktur ini memungkinkan tim keamanan menerapkan kontrol akses berbasis tag alih-alih mengevaluasi setiap tabel satu per satu.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Memberi dasar objektif untuk menerapkan kontrol akses secara proporsional, tidak terlalu longgar atau terlalu ketat\n- Mempermudah pembuktian kepatuhan terhadap regulasi perlindungan data seperti OJK atau GDPR\n- Otomasi lewat DLP mengurangi ketergantungan pada review manual yang lambat dan tidak konsisten\n- Menjadi fondasi bagi kontrol lanjutan seperti masking dan row-level security",
        en: "",
      },
      cons: {
        id: "- Deteksi otomatis lewat DLP bisa menghasilkan false positive atau false negative, terutama untuk data semi-terstruktur\n- Klasifikasi butuh pemeliharaan berkelanjutan karena skema data terus berubah seiring waktu\n- Menetapkan taksonomi yang tepat butuh kesepakatan lintas tim bisnis dan legal, yang sering memakan waktu\n- Kolom yang salah klasifikasi (under- atau over-classified) bisa menimbulkan risiko keamanan atau menghambat produktivitas tim",
        en: "",
      },
    },
  },
};
