export const term = {
  id: "explain-plan-reading-optimization",
  track: "data-engineering",
  category: "Advanced SQL",
  color: "#b91c1c",
  icon: "M13 2L3 14h9l-1 8 10-12h-9z",
  simulation: "explainopt",
  tools: ["PostgreSQL EXPLAIN", "pgMustard", "explain.dalibo.com", "BigQuery Execution", "Snowflake Query Profile"],
  prerequisites: ["explain-analyze"],
  related: ["query-optimization-explain", "statistics-cost-based-optimizer"],
  name: { id: "EXPLAIN PLAN Reading & Optimization", en: "EXPLAIN PLAN Reading & Optimization" },
  content: {
    description: {
      id: "EXPLAIN PLAN Reading & Optimization adalah keterampilan membaca dan menginterpretasikan execution plan yang dihasilkan database untuk memahami bagaimana sebuah query sesungguhnya dieksekusi, lalu menggunakan pemahaman itu untuk mengoptimalkan query yang lambat. Execution plan terdiri dari berbagai node operasi seperti Seq Scan (baca seluruh tabel baris demi baris), Index Scan (baca lewat index), Hash Join, Nested Loop, Sort, dan Aggregate — masing-masing punya karakteristik biaya yang berbeda tergantung ukuran data dan konteks query.",
      en: "",
    },
    concept: {
      id: "Bayangkan membaca execution plan seperti membaca resep hasil rekaman CCTV dapur restoran untuk mencari tahu kenapa satu pesanan butuh 30 menit padahal biasanya 5 menit. Kamu memutar rekaman itu dan menemukan koki menghabiskan 25 menit hanya mencari satu bahan di gudang besar tanpa sistem rak (Seq Scan pada tabel besar), padahal kalau gudang punya sistem rak terorganisir (index), bahan itu bisa ditemukan dalam hitungan detik (Index Scan). Membaca plan adalah proses forensik untuk menemukan langkah mana yang jadi bottleneck sesungguhnya.",
      en: "",
    },
    methodology: {
      id: "Proses membaca dan mengoptimalkan execution plan biasanya dimulai dengan menjalankan EXPLAIN ANALYZE pada query yang bermasalah, yang tidak hanya menunjukkan rencana eksekusi tapi juga waktu aktual yang dihabiskan setiap node. Plan dibaca dari bawah ke atas (bottom-up) karena node paling dalam adalah yang dieksekusi lebih dulu dan hasilnya mengalir ke node di atasnya. Dari situ, cari node yang paling mahal — misalnya Seq Scan pada tabel jutaan baris yang sebenarnya bisa dipercepat dengan menambah index, atau Nested Loop dengan jumlah iterasi sangat besar yang sebaiknya diganti Hash Join oleh optimizer (biasanya dipicu dengan memperbaiki statistik tabel), atau operasi Sort yang spill ke disk karena `work_mem` terlalu kecil. Setelah perbaikan diterapkan (menambah index, update statistik, menaikkan memory setting), query diukur ulang dan proses ini diulang sampai performa memuaskan.",
      en: "",
    },
    objective: {
      id: "Kemampuan ini ada karena query yang lambat sering kali tidak jelas penyebabnya hanya dari melihat teks SQL-nya saja — dua query yang terlihat mirip bisa punya performa sangat berbeda tergantung index yang tersedia, statistik tabel, atau ukuran data aktual. EXPLAIN PLAN memberi visibilitas ke keputusan internal optimizer database, mengubah proses debugging performa dari tebak-tebakan menjadi analisis berbasis data yang konkret.",
      en: "",
    },
    goal: {
      id: "Hasil yang dicapai adalah kemampuan mendiagnosis dan memperbaiki query lambat secara sistematis, seringkali dengan peningkatan performa yang dramatis — dari cost puluhan ribu menjadi ratusan, atau dari scan jutaan baris menjadi ratusan baris — dengan pendekatan iteratif ukur, perbaiki, ukur ulang sampai target performa tercapai.",
      en: "",
    },
    exampleImplementation: {
      id: "Alur diagnosis dan optimasi query lambat:\n\n1. Jalankan EXPLAIN ANALYZE pada query yang lambat.\n2. Baca plan dari node paling dalam (bottom) ke luar (top).\n3. Identifikasi node dengan cost atau actual time tertinggi.\n4. Terapkan perbaikan yang sesuai (index, statistik, memory setting).\n5. Ukur ulang dan bandingkan hasilnya.\n\n```sql\nEXPLAIN ANALYZE\nSELECT c.nama, SUM(k.jumlah)\nFROM klaim k\nJOIN customer c ON k.customer_id = c.customer_id\nWHERE k.tanggal >= '2024-01-01'\nGROUP BY c.nama;\n\n-- Sebelum: Seq Scan on klaim (cost=0..50000 rows=10000000)\n--          Nested Loop (cost=50000..900000)\n-- Setelah menambah index pada klaim.tanggal dan klaim.customer_id:\n--          Index Scan on klaim (cost=0..500 rows=100000)\n--          Hash Join (cost=500..5000)\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Fintech Cepat memiliki laporan bulanan yang tiba-tiba berjalan sangat lambat, dari biasanya 10 detik menjadi 15 menit. Tim data engineering menjalankan EXPLAIN ANALYZE dan menemukan optimizer memilih Nested Loop dengan cost 50000 untuk join antar dua tabel besar, alih-alih Hash Join yang jauh lebih murah dengan cost 500 — ternyata statistik tabel sudah usang setelah lonjakan data besar minggu sebelumnya, sehingga optimizer salah mengestimasi jumlah baris. Setelah menjalankan ANALYZE untuk memperbarui statistik dan menambah index yang sesuai, Seq Scan pada 10 juta baris berubah menjadi Index Scan pada sekitar 100 ribu baris relevan saja — peningkatan performa sekitar 100 kali lipat.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Mengubah debugging performa query dari tebakan menjadi analisis berbasis data konkret tentang apa yang sesungguhnya terjadi\n- Bisa menghasilkan peningkatan performa dramatis, sering kali puluhan hingga ratusan kali lipat dengan perbaikan yang tepat sasaran\n- Membantu memahami perilaku optimizer database, ilmu yang bisa diterapkan lintas query dan lintas proyek\n- Tersedia di hampir semua database modern (PostgreSQL, BigQuery, Snowflake) dengan konsep dasar yang serupa",
        en: "",
      },
      cons: {
        id: "- Membutuhkan kurva belajar yang cukup curam untuk memahami semua jenis node dan interaksi antar operasi dalam plan\n- Plan bisa berbeda antara EXPLAIN biasa (estimasi) dan EXPLAIN ANALYZE (eksekusi aktual), berpotensi membingungkan pemula\n- Perbaikan yang diterapkan (misalnya menambah index) bisa memperbaiki satu query tapi memperlambat operasi write pada tabel yang sama\n- Pada sistem terdistribusi skala besar seperti BigQuery, plan bisa jauh lebih kompleks dengan banyak stage paralel yang lebih sulit ditelusuri dibanding database single-node",
        en: "",
      },
    },
  },
};
