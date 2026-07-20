export const term = {
  id: "cardinality",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#6ee7b7",
  icon: "M18 20V10M12 20V4M6 20v-6",
  simulation: "cardinality",
  tools: ["BigQuery", "Snowflake", "PostgreSQL", "DuckDB", "Apache Spark"],
  prerequisites: [],
  related: ["database-index", "query-optimization-explain"],
  name: { id: "Cardinality", en: "Cardinality" },
  content: {
    description: {
      id: "Cardinality adalah ukuran jumlah nilai unik yang ada di sebuah kolom relatif terhadap total jumlah baris di tabel. Kolom dengan high cardinality memiliki banyak sekali nilai berbeda (misalnya kolom ID transaksi yang hampir semua nilainya unik), sementara kolom dengan low cardinality hanya memiliki sedikit nilai yang berulang (misalnya kolom status yang cuma punya 5 kemungkinan nilai). Pemahaman cardinality sebuah kolom menjadi dasar penting dalam menentukan strategi index maupun strategi partisi/clustering yang tepat.",
      en: "",
    },
    concept: {
      id: "Bayangkan cardinality seperti membedakan antara nomor KTP dan jenis kelamin di sebuah database kependudukan. Nomor KTP adalah high cardinality — hampir setiap orang punya nilai yang berbeda, jadi kalau kamu cari satu nomor spesifik, kamu langsung dapat satu orang saja (cocok untuk index B-tree, seperti mencari nama di buku telepon tebal). Jenis kelamin adalah low cardinality — cuma ada segelintir kemungkinan nilai, jadi kalau kamu ingin mengelompokkan atau memfilter berdasarkan itu, lebih efisien memakai teknik pengelompokan cepat (bitmap) daripada pohon pencarian.",
      en: "",
    },
    methodology: {
      id: "Untuk menganalisis cardinality suatu kolom, database atau engineer biasanya menjalankan query COUNT(DISTINCT kolom) dibandingkan dengan total jumlah baris tabel untuk mendapatkan rasio cardinality. Berdasarkan hasil ini, strategi optimasi dipilih: kolom high cardinality lebih cocok menggunakan B-tree index atau dijadikan clustering/sort key karena setiap pencarian akan mengerucut ke sedikit baris. Kolom low cardinality lebih cocok menggunakan bitmap index atau dijadikan kolom partisi, karena jumlah kelompok nilainya sedikit sehingga operasi filter dan agregasi bisa dilakukan secara efisien per kelompok. Query optimizer juga menggunakan statistik cardinality ini untuk memperkirakan jumlah baris hasil (row estimation) sebelum memilih execution plan terbaik.",
      en: "",
    },
    objective: {
      id: "Memahami cardinality penting karena strategi optimasi yang cocok untuk satu kolom belum tentu cocok untuk kolom lain — menerapkan index atau partisi yang salah pilih justru bisa memperlambat query alih-alih mempercepatnya. Cardinality memberikan sinyal kuantitatif objektif untuk mengambil keputusan desain skema dan indexing yang tepat, alih-alih menebak-nebak.",
      en: "",
    },
    goal: {
      id: "Hasil yang dicapai adalah strategi indexing, partisi, dan clustering yang benar-benar selaras dengan karakteristik data sesungguhnya, sehingga query planner bisa membuat estimasi biaya yang akurat dan memilih execution plan paling efisien, alih-alih terjebak memakai struktur yang justru kontraproduktif untuk pola data tertentu.",
      en: "",
    },
    exampleImplementation: {
      id: "Langkah menganalisis cardinality sebelum menentukan strategi clustering di BigQuery:\n\n1. Hitung jumlah nilai unik dibanding total baris untuk kandidat kolom.\n2. Kolom dengan cardinality rendah (misal kode_cabang dengan 50 nilai unik) dipilih sebagai clustering key.\n3. Kolom dengan cardinality sangat tinggi (misal claim_id yang hampir semuanya unik) dihindari sebagai clustering key karena tidak efektif mengelompokkan data.\n\n```sql\n-- Mengecek cardinality kolom\nSELECT\n  COUNT(DISTINCT kode_cabang) AS unique_cabang,\n  COUNT(DISTINCT claim_id) AS unique_claim,\n  COUNT(*) AS total_baris\nFROM fact_klaim;\n\n-- Clustering berdasarkan kolom low cardinality\nCREATE TABLE fact_klaim\nCLUSTER BY kode_cabang AS\nSELECT * FROM staging_klaim;\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Tim data engineering di PT Nusantara Logistik awalnya mencoba melakukan clustering tabel fakta pengiriman berdasarkan claim_id, namun performa query tidak membaik karena claim_id memiliki cardinality yang sangat tinggi — hampir setiap baris punya nilai berbeda sehingga tidak menghasilkan pengelompokan yang berguna. Setelah dianalisis ulang, mereka beralih melakukan CLUSTER BY pada kolom kode_cabang yang hanya memiliki sekitar 50 nilai unik (low cardinality), dan query laporan per cabang menjadi jauh lebih cepat karena BigQuery bisa langsung melompat ke blok data yang relevan.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Memberikan dasar kuantitatif objektif untuk memilih strategi index, partisi, atau clustering yang tepat\n- Membantu query optimizer membuat estimasi biaya dan row count yang lebih akurat\n- Analisisnya sederhana (COUNT DISTINCT) sehingga mudah diterapkan pada kolom mana pun\n- Mencegah keputusan desain skema berdasarkan tebakan atau asumsi yang keliru",
        en: "",
      },
      cons: {
        id: "- Cardinality bisa berubah seiring waktu seiring pertumbuhan data, membutuhkan evaluasi ulang berkala\n- Menghitung COUNT(DISTINCT) pada tabel sangat besar bisa mahal secara komputasi jika dilakukan sering\n- Keputusan berdasarkan cardinality saja tidak cukup — pola query aktual (filter, join, agregasi) juga harus dipertimbangkan\n- Statistik cardinality yang usang (belum di-refresh) bisa menyesatkan optimizer memilih plan yang buruk",
        en: "",
      },
    },
  },
};
