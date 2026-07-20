export const term = {
  id: "data-catalog",
  track: "data-engineering",
  category: "Governance",
  color: "#0ea5e9",
  icon: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
  simulation: "catalog",
  tools: [
    "Google Dataplex",
    "Apache Atlas",
    "Collibra",
    "DataHub",
    "Alation",
  ],
  prerequisites: [],
  related: ["data-lineage", "data-stewardship", "data-classification"],
  name: { id: "Data Catalog", en: "Data Catalog" },
  content: {
    description: {
      id: "Data Catalog adalah repository metadata terpusat yang menjawab pertanyaan paling dasar tapi paling sering hilang di organisasi data yang besar: data apa yang kita punya, di mana lokasinya, siapa pemiliknya, apa artinya secara bisnis, dan seberapa segar datanya. Tanpa catalog, pengetahuan tentang data tersebar di kepala beberapa orang senior, di dokumen Google Docs yang tidak pernah update, atau di Slack thread yang hilang ditelan waktu. Data Catalog mengubah pengetahuan tacit itu menjadi aset yang bisa dicari, di-browse, dan diandalkan oleh siapa pun di organisasi — analyst baru, data scientist, bahkan auditor eksternal.",
      en: "",
    },
    concept: {
      id: "Bayangkan Data Catalog seperti mesin pencari plus perpustakaan untuk seluruh data perusahaan. Kalau Google membantu Anda menemukan halaman web dengan mengindeks jutaan situs dan menampilkan cuplikan relevan, Data Catalog membantu Anda menemukan tabel `claims_2024` di antara ribuan tabel lain, lengkap dengan 'cuplikan' berupa deskripsi bisnis, siapa pemiliknya, kolom mana yang berisi PII, dan kapan terakhir di-update. Analogi lain: ini seperti katalog perpustakaan (card catalog) versi digital — bukan buku fisiknya yang dicari, tapi metadatanya (judul, pengarang, lokasi rak, ringkasan) supaya Anda tahu buku itu ada dan relevan sebelum repot mengambilnya.",
      en: "",
    },
    methodology: {
      id: "Data Catalog bekerja melalui beberapa lapisan proses. Pertama, auto-crawl: connector catalog secara berkala memindai sumber data (data warehouse, data lake, database operasional) dan mengekstrak metadata teknis — nama tabel, skema kolom, tipe data, ukuran, dan statistik dasar — tanpa menyentuh isi data itu sendiri. Kedua, business enrichment: metadata teknis ini diperkaya dengan konteks bisnis, seperti deskripsi 'tabel ini berisi klaim asuransi yang sudah disetujui' atau definisi glosarium 'net_revenue = gross_revenue dikurangi refund'. Ketiga, classify & tag: sistem (sering terintegrasi dengan tool DLP) menandai kolom sensitif seperti PII atau data finansial. Keempat, publish & search: semua metadata ini diindeks dan tersedia lewat antarmuka pencarian, sehingga pengguna bisa mengetik 'customer churn' dan menemukan tabel-tabel relevan lengkap dengan skor kualitas dan pemiliknya. Kolaborasi anotasi memungkinkan pengguna menambahkan catatan, memberi rating, atau mendiskusikan sebuah dataset langsung di dalam catalog.",
      en: "",
    },
    objective: {
      id: "Tanpa catalog, organisasi mengalami 'data discovery tax' — setiap analyst baru menghabiskan berminggu-minggu bertanya ke sana-sini hanya untuk tahu tabel mana yang benar dipakai, karena sering ada banyak tabel dengan nama mirip tapi kualitas dan definisi berbeda. Data Catalog menghilangkan biaya tersembunyi ini dengan menyediakan satu sumber kebenaran untuk 'apa data ini dan bisa dipercaya atau tidak', sekaligus menjadi fondasi untuk governance karena tanpa tahu data apa yang dimiliki, mustahil menerapkan kebijakan akses atau klasifikasi sensitivitas secara konsisten.",
      en: "",
    },
    goal: {
      id: "Setiap dataset penting di organisasi memiliki entri catalog yang lengkap — deskripsi bisnis, owner, tag sensitivitas, dan status kesegaran — sehingga waktu yang dibutuhkan seorang analyst baru untuk menemukan dan memahami dataset yang relevan turun dari hitungan minggu menjadi hitungan menit, dan tim governance bisa melakukan audit akses data berbasis klasifikasi yang tercatat rapi.",
      en: "",
    },
    exampleImplementation: {
      id: "Implementasi tipikal menggunakan Google Dataplex Catalog untuk BigQuery mengikuti alur berikut:\n\n1. **Crawl Sources** — Dataplex terhubung ke semua project BigQuery dan secara otomatis mendeteksi dataset serta tabel baru.\n2. **Extract Metadata** — mengambil skema, tipe kolom, jumlah baris, ukuran, dan waktu update terakhir.\n3. **Business Enrichment** — data steward menambahkan deskripsi bisnis dan menautkan tabel ke istilah glosarium.\n4. **Tag/Classify** — kolom seperti `national_id` otomatis ditandai sebagai PII lewat integrasi DLP.\n5. **Publish & Search** — hasil akhir bisa dicari lewat UI atau API.\n\nContoh query untuk mengambil metadata terklasifikasi lewat Data Catalog API:\n\n```sql\nSELECT\n  table_name,\n  column_name,\n  policy_tag.names AS sensitivity_tag\nFROM `project.region-asia.INFORMATION_SCHEMA.COLUMN_FIELD_PATHS`\nWHERE policy_tag.names IS NOT NULL\nORDER BY table_name;\n```\n\nQuery ini menampilkan semua kolom yang sudah diberi policy tag (misalnya `Restricted-PII`), sehingga tim keamanan bisa memverifikasi cakupan klasifikasi tanpa membuka data mentah.",
      en: "",
    },
    exampleEnterprise: {
      id: "PT Multi Finansial Group menggunakan Dataplex Catalog untuk mendokumentasikan seluruh tabel BigQuery lintas anak usahanya. Setiap tabel memiliki metadata lengkap: owner tim, tag PII pada kolom NIK dan nomor telepon, indikator freshness (kapan terakhir di-refresh), serta definisi bisnis yang disepakati bersama — misalnya 'active_policy' didefinisikan konsisten di seluruh grup, bukan lagi ditafsirkan berbeda oleh tiap unit bisnis. Ketika tim audit internal perlu memverifikasi tabel mana saja yang menyimpan data pelanggan sensitif, mereka cukup mencari lewat catalog alih-alih meminta setiap tim engineering menjelaskan skema tabelnya satu per satu.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Memangkas waktu discovery data secara drastis karena semua metadata terpusat dan bisa dicari\n- Menjadi fondasi governance — klasifikasi sensitivitas dan lineage jadi lebih mudah ditegakkan\n- Mengurangi duplikasi kerja karena analyst bisa melihat tabel serupa sudah ada sebelum membuat yang baru\n- Kolaborasi anotasi membangun pengetahuan institusional yang tidak hilang saat karyawan resign",
        en: "",
      },
      cons: {
        id: "- Butuh investasi berkelanjutan dari data steward untuk mengisi enrichment bisnis — auto-crawl saja tidak cukup\n- Catalog yang tidak terawat (metadata basi, deskripsi kosong) justru menurunkan kepercayaan pengguna terhadapnya\n- Overhead integrasi awal cukup besar untuk menghubungkan semua sumber data heterogen\n- Adopsi bergantung pada budaya organisasi — tanpa insentif, tim sering skip mengisi metadata",
        en: "",
      },
    },
  },
};
