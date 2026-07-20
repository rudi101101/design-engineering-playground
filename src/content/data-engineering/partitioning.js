export const term = {
  id: "partitioning",
  track: "data-engineering",
  category: "Storage & Format",
  color: "#ef4444",
  icon: "M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z",
  simulation: "partitioning",
  tools: ["BigQuery", "Snowflake", "PostgreSQL", "Apache Iceberg", "MySQL"],
  prerequisites: [],
  related: ["clustering-sorting", "partitioning-in-bigquery-style", "partitioning-in-postgresql"],
  name: { id: "Partitioning — Date, Range, List, Hash", en: "Partitioning — Date, Range, List, Hash" },
  content: {
    description: {
      id: "Partitioning adalah teknik membagi satu tabel besar menjadi beberapa segmen fisik terpisah berdasarkan nilai kolom tertentu, sehingga query yang hanya butuh sebagian data tidak perlu memindai keseluruhan tabel. Pembagian ini bisa berdasarkan tanggal (date partitioning), rentang nilai (range), daftar nilai eksplisit (list), atau hasil fungsi hash untuk pemerataan beban. Partitioning adalah salah satu teknik optimasi paling fundamental dan paling berdampak di data warehouse modern, karena tabel fakta di DWH sering berisi miliaran baris yang terus bertambah setiap hari.",
      en: "",
    },
    concept: {
      id: "Bayangkan sebuah gudang arsip surat berukuran raksasa. Tanpa partitioning, semua surat dari sepuluh tahun terakhir ditumpuk jadi satu tumpukan besar — mencari surat bulan Januari tahun ini berarti menggeledah seluruh tumpukan. Partitioning seperti memberi rak terpisah untuk setiap bulan: begitu ada permintaan 'surat bulan Januari 2026', petugas cukup langsung menuju rak Januari 2026 dan mengabaikan sebelas rak lainnya sama sekali.",
      en: "",
    },
    methodology: {
      id: "Saat data di-INSERT, sistem menentukan partition key dari nilai kolom yang dipartisi (misalnya tanggal transaksi), lalu merutekan baris tersebut ke segmen fisik yang sesuai. Saat query dijalankan, query optimizer memeriksa klausa WHERE, mencocokkannya dengan batas-batas partisi yang ada, lalu melakukan partition pruning — mengabaikan seluruh partisi yang pasti tidak relevan dan hanya memindai partisi yang cocok. Date partitioning paling umum dipakai di data warehouse karena mayoritas query analitik memfilter berdasarkan rentang waktu; hash partitioning dipakai ketika tidak ada kolom natural yang bisa menyebarkan beban secara merata, seperti pada sistem OLTP yang butuh distribusi tulis seimbang antar partisi.",
      en: "",
    },
    objective: {
      id: "Tanpa partitioning, setiap query terhadap tabel fakta besar harus memindai seluruh tabel meskipun hanya butuh data satu hari atau satu cabang tertentu — ini boros biaya (di sistem berbasis biaya-per-byte-dipindai seperti BigQuery) dan boros waktu. Partitioning ada untuk memberi struktur fisik yang selaras dengan pola query paling umum, sehingga optimizer bisa mengeliminasi data yang tidak relevan sebelum proses scan dimulai.",
      en: "",
    },
    goal: {
      id: "Hasil konkretnya, query yang memfilter berdasarkan kolom partisi hanya memindai sebagian kecil tabel — misalnya query yang memfilter satu bulan pada tabel yang dipartisi harian hanya menyentuh sekitar 1/12 dari total data, secara langsung memangkas biaya query dan waktu eksekusi secara proporsional.",
      en: "",
    },
    exampleImplementation: {
      id: "Contoh partitioning berbasis tanggal di BigQuery:\n\n```sql\nCREATE TABLE laporan.klaim (\n  id_klaim INT64,\n  tanggal_klaim DATE,\n  kode_cabang STRING,\n  jumlah NUMERIC\n)\nPARTITION BY tanggal_klaim;\n\n-- Query ini hanya memindai partisi bulan Januari, bukan seluruh tabel\nSELECT SUM(jumlah)\nFROM laporan.klaim\nWHERE tanggal_klaim BETWEEN '2026-01-01' AND '2026-01-31';\n```\n\nOptimizer secara otomatis mengeliminasi seluruh partisi di luar rentang WHERE tersebut sebelum scan dimulai — ini terlihat di execution plan sebagai jumlah byte yang dipindai jauh lebih kecil dari ukuran total tabel.",
      en: "",
    },
    exampleEnterprise: {
      id: "Fintech Cepat mempartisi tabel klaim asuransi mikronya di BigQuery berdasarkan PARTITION BY DATE(tanggal_klaim). Saat tim finance menjalankan laporan bulanan yang memfilter WHERE bulan = Januari, BigQuery hanya memindai partisi bulan itu — sekitar satu per dua belas dari total data setahun — sehingga biaya query dan waktu tunggu laporan turun drastis dibanding jika tabel tidak dipartisi sama sekali.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Partition pruning memangkas volume data yang dipindai secara drastis untuk query yang memfilter kolom partisi.\n- Mengurangi biaya query pada platform berbasis bayar-per-byte seperti BigQuery.\n- Memudahkan manajemen data siklus hidup — partisi lama bisa dihapus atau dipindah ke tier murah per segmen, bukan per baris.\n- Mempercepat operasi maintenance karena bisa dilakukan per partisi tanpa mengunci seluruh tabel.",
        en: "",
      },
      cons: {
        id: "- Pemilihan kolom partisi yang salah (kardinalitas terlalu tinggi atau tidak sesuai pola query) bisa membuat partitioning tidak memberi manfaat sama sekali.\n- Terlalu banyak partisi kecil (over-partitioning) justru menambah overhead metadata dan memperlambat query.\n- Query yang tidak memfilter kolom partisi tetap harus memindai seluruh partisi, tidak mendapat manfaat apa pun.\n- Mengubah strategi partitioning pada tabel yang sudah besar biasanya butuh rebuild total, bukan sekadar ALTER ringan.",
        en: "",
      },
    },
  },
};
