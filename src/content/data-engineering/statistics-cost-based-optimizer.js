export const term = {
  id: "statistics-cost-based-optimizer",
  track: "data-engineering",
  category: "Performa",
  color: "#a855f7",
  icon: "M18 20V10M12 20V4M6 20v-6",
  simulation: "cbo",
  tools: [
    "PostgreSQL ANALYZE",
    "BigQuery (auto)",
    "Snowflake (auto)",
    "MySQL ANALYZE TABLE",
    "Oracle DBMS_STATS",
  ],
  prerequisites: [],
  related: ["query-optimization-explain", "database-index"],
  name: { id: "Statistics & Cost-Based Optimizer", en: "Statistics & Cost-Based Optimizer" },
  content: {
    description: {
      id: "Statistics & Cost-Based Optimizer (CBO) adalah mekanisme internal database yang mengumpulkan statistik distribusi data — seperti jumlah baris total, jumlah nilai unik per kolom, dan histogram distribusi nilai — lalu menggunakan statistik itu untuk memilih rencana eksekusi kueri (query plan) yang diperkirakan paling murah dari sisi biaya komputasi. Ini adalah 'otak' di balik kenapa database bisa secara otomatis memutuskan apakah harus memakai index scan atau full table scan, atau urutan join mana yang paling efisien, tanpa engineer harus menentukannya secara manual di setiap kueri.",
      en: "",
    },
    concept: {
      id: "Bayangkan Cost-Based Optimizer seperti aplikasi navigasi yang memilih rute tercepat berdasarkan data lalu lintas real-time, bukan sekadar jarak terpendek di peta. Aplikasi itu tahu (dari data historis) bahwa jalan tol biasanya macet jam segini, atau jalan alternatif ini biasanya lancar meski jaraknya lebih jauh. Statistik distribusi data adalah 'data lalu lintas' bagi database — dari situ optimizer bisa memperkirakan rute (query plan) mana yang benar-benar tercepat, bukan yang terlihat tercepat di atas kertas. Kalau data lalu lintasnya sudah basi (statistik usang), aplikasi navigasi bisa mengarahkan Anda ke jalan yang ternyata macet parah.",
      en: "",
    },
    methodology: {
      id: "Proses dimulai dengan perintah ANALYZE (atau proses otomatis di sistem modern seperti BigQuery dan Snowflake) yang memindai tabel untuk mengumpulkan statistik: jumlah baris, jumlah nilai distinct per kolom, dan histogram yang menggambarkan sebaran nilai (misalnya kolom status punya 90% nilai 'completed' dan 10% nilai lainnya). Ketika sebuah kueri dijalankan, Cost-Based Optimizer mengevaluasi berbagai kemungkinan rencana eksekusi — urutan join berbeda, pemakaian index atau tidak, strategi scan berbeda — dan untuk setiap kemungkinan itu memperkirakan biayanya berdasarkan estimasi I/O dan CPU yang dibutuhkan, dengan memanfaatkan statistik yang sudah dikumpulkan. Rencana dengan estimasi biaya paling rendah kemudian dipilih dan dieksekusi.",
      en: "",
    },
    objective: {
      id: "Tanpa statistik yang akurat, optimizer database pada dasarnya 'buta' dan harus menebak-nebak rencana eksekusi mana yang efisien, sering kali salah pilih strategi — misalnya memilih nested loop join padahal hash join jauh lebih cepat untuk data sebesar itu. Statistik dan CBO menyelesaikan masalah ini dengan memberi optimizer informasi berbasis data nyata untuk membuat keputusan yang tepat secara otomatis, tanpa engineer harus menulis hint manual di setiap kueri.",
      en: "",
    },
    goal: {
      id: "Query optimizer secara konsisten memilih rencana eksekusi yang benar-benar efisien untuk beban kerja yang berubah-ubah, dengan statistik yang selalu diperbarui mengikuti pertumbuhan dan perubahan distribusi data, sehingga performa kueri tetap stabil dan bisa diprediksi seiring dataset bertambah besar.",
      en: "",
    },
    exampleImplementation: {
      id: "Alur pemeliharaan statistik untuk menjaga CBO tetap akurat:\n\n1. **ANALYZE** — dijalankan setelah load data besar atau secara terjadwal.\n2. **Collect stats** — sistem mengumpulkan jumlah baris, nilai distinct, dan histogram per kolom.\n3. **Query** — sebuah kueri kompleks dikirim ke database.\n4. **CBO enumerate plans** — optimizer membuat beberapa kandidat rencana eksekusi.\n5. **Estimate costs** — setiap kandidat diberi skor biaya berdasarkan statistik.\n6. **Choose min** — rencana dengan biaya estimasi terendah dipilih untuk dieksekusi.\n\nContoh di PostgreSQL setelah operasi bulk load:\n\n```sql\n-- Setelah insert besar, statistik jadi usang\nCOPY orders FROM '/data/orders_2024.csv' CSV HEADER;\n\n-- Perbarui statistik agar optimizer tahu distribusi data terbaru\nANALYZE orders;\n\n-- Cek plan yang dipilih setelah statistik diperbarui\nEXPLAIN ANALYZE\nSELECT * FROM orders WHERE status = 'completed';\n```\n\nTanpa `ANALYZE` setelah bulk load, optimizer masih memakai statistik lama yang mungkin sudah tidak mencerminkan volume dan distribusi data yang baru, sehingga bisa memilih plan yang jauh dari optimal.",
      en: "",
    },
    exampleEnterprise: {
      id: "Tim data engineering di Fintech Cepat mengalami insiden performa serius setelah melakukan migrasi data historis besar-besaran ke tabel transaksi PostgreSQL mereka tanpa menjalankan ANALYZE setelahnya. Optimizer masih menggunakan statistik lama dari sebelum migrasi yang memperkirakan tabel hanya berisi ratusan ribu baris, padahal setelah migrasi jumlahnya mencapai puluhan juta baris. Akibatnya, optimizer memilih nested loop join yang cocok untuk data kecil, membuat sebuah laporan yang biasanya selesai dalam hitungan detik menjadi berjalan lebih dari 100 kali lebih lambat dan hampir menghabiskan resource database produksi. Setelah tim menjalankan ANALYZE secara manual, optimizer langsung beralih ke hash join yang jauh lebih sesuai dan performa kembali normal.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Memungkinkan database memilih rencana eksekusi optimal secara otomatis tanpa intervensi manual di setiap kueri\n- Beradaptasi terhadap perubahan volume dan distribusi data seiring waktu, selama statistik rutin diperbarui\n- Sistem modern seperti BigQuery dan Snowflake mengotomasi pengumpulan statistik sepenuhnya, mengurangi beban operasional\n- Mengurangi kebutuhan menulis query hint manual yang rapuh dan sulit dipelihara",
        en: "",
      },
      cons: {
        id: "- Statistik yang usang (stale) setelah perubahan data besar bisa menyebabkan optimizer memilih plan yang sangat buruk, kadang 100x lebih lambat\n- Proses ANALYZE sendiri membutuhkan resource dan waktu, terutama pada tabel yang sangat besar\n- Estimasi cost tetaplah perkiraan, bukan jaminan — kadang optimizer tetap salah pilih meski statistik akurat, terutama pada kueri dengan korelasi kolom yang kompleks\n- Pada sistem yang mengelola statistik secara manual (seperti PostgreSQL), mudah lupa menjalankan ANALYZE setelah operasi data besar, menjadi sumber insiden performa yang tersembunyi",
        en: "",
      },
    },
  },
};
