export const term = {
  id: "deadlock",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#4ade80",
  icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM4.93 4.93l14.14 14.14",
  simulation: "deadlock",
  tools: ["PostgreSQL", "MySQL", "SQL Server", "Oracle", "CockroachDB"],
  prerequisites: ["lock-types"],
  related: ["mvcc", "transaction-savepoint"],
  name: { id: "Deadlock", en: "Deadlock" },
  content: {
    description: {
      id: "Deadlock terjadi ketika dua transaksi atau lebih saling menunggu lock yang sedang dipegang oleh transaksi lainnya, sehingga tidak ada satu pun yang bisa melanjutkan eksekusi — sistem terjebak dalam kebuntuan permanen. Database modern memiliki mekanisme deteksi otomatis yang akan mengenali situasi ini dan secara paksa membatalkan (rollback) salah satu transaksi, yang disebut sebagai 'victim', agar transaksi lainnya bisa berjalan lagi.",
      en: "",
    },
    concept: {
      id: "Bayangkan dua mobil di jalan sempit satu arah yang berpapasan dari arah berlawanan, masing-masing menunggu yang lain mundur duluan — tidak ada yang bergerak selamanya kalau tidak ada yang mengalah. Deadlock database persis seperti ini: Transaksi A memegang kunci meja pertama dan menunggu kunci meja kedua yang dipegang Transaksi B, sementara B menunggu kunci meja pertama yang dipegang A. Petugas lalu lintas (database) harus turun tangan menyuruh salah satu mobil mundur (rollback) agar jalan kembali lancar.",
      en: "",
    },
    methodology: {
      id: "Database mendeteksi deadlock menggunakan struktur wait-for graph, di mana setiap transaksi yang menunggu lock digambarkan sebagai edge menuju transaksi pemegang lock tersebut. Jika graph ini membentuk sebuah siklus (cycle), berarti terjadi deadlock. Database secara berkala memindai graph ini, dan begitu mendeteksi siklus, ia akan memilih satu transaksi sebagai victim (biasanya berdasarkan biaya rollback terkecil atau umur transaksi) untuk dibatalkan, sehingga transaksi lain yang menunggu bisa melanjutkan lock yang dilepas. Selain deteksi, ada juga strategi pencegahan seperti mengurutkan akuisisi lock secara konsisten di semua transaksi, atau menggunakan lock timeout agar transaksi yang menunggu terlalu lama otomatis dibatalkan.",
      en: "",
    },
    objective: {
      id: "Konsep deadlock penting dipahami karena locking adalah mekanisme wajar untuk menjaga konsistensi data saat banyak transaksi berjalan bersamaan, tapi locking yang tidak hati-hati bisa menciptakan kebuntuan yang membekukan sistem. Database harus punya cara otomatis untuk mendeteksi dan memutus siklus ini agar sistem tetap responsif, sementara developer perlu memahami pola penyebabnya agar bisa menulis transaksi yang menghindari deadlock sejak awal.",
      en: "",
    },
    goal: {
      id: "Hasil yang diinginkan adalah sistem yang tidak pernah benar-benar 'membeku' — begitu deadlock terjadi, database secara otomatis memulihkan diri dalam hitungan milidetik dengan me-rollback satu transaksi, sementara aplikasi di sisi klien dirancang untuk mendeteksi error ini dan melakukan retry secara aman.",
      en: "",
    },
    exampleImplementation: {
      id: "Skenario klasik terjadinya deadlock dan penyelesaiannya:\n\n1. Transaksi A: UPDATE row1 lalu mencoba UPDATE row2.\n2. Transaksi B: UPDATE row2 lalu mencoba UPDATE row1 (urutan terbalik dari A).\n3. A menunggu lock row2 (dipegang B), B menunggu lock row1 (dipegang A) → wait-for graph membentuk siklus.\n4. Database mendeteksi deadlock, membatalkan salah satu transaksi dengan error khusus.\n\n```sql\n-- Praktik terbaik: selalu urutkan akuisisi lock berdasarkan ID untuk menghindari deadlock\nBEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = LEAST(101, 202);\nUPDATE accounts SET balance = balance + 100 WHERE id = GREATEST(101, 202);\nCOMMIT;\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Di sistem pemrosesan pesanan Toko Meta Retail, dua proses backend yang berjalan bersamaan pernah meng-update baris pesanan dan baris inventaris dengan urutan tabel yang berbeda satu sama lain. PostgreSQL mendeteksi deadlock dalam wait-for graph dan membatalkan salah satu transaksi dengan error 'deadlock detected'. Tim engineering kemudian memperbaiki kode aplikasi agar selalu mengunci baris pesanan sebelum baris inventaris di kedua proses, dan menambahkan mekanisme retry otomatis untuk transaksi yang gagal akibat deadlock.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Database modern otomatis mendeteksi dan memulihkan diri dari deadlock tanpa intervensi manual\n- Wait-for graph memberikan cara sistematis dan cepat untuk mengidentifikasi siklus kebuntuan\n- Mekanisme victim selection meminimalkan dampak dengan membatalkan transaksi yang paling murah untuk di-rollback\n- Bisa dicegah sepenuhnya di level aplikasi dengan disiplin urutan locking yang konsisten",
        en: "",
      },
      cons: {
        id: "- Transaksi yang menjadi victim kehilangan pekerjaannya dan harus di-retry, menambah latency\n- Deadlock yang sering terjadi menandakan desain transaksi atau indexing yang buruk\n- Sulit direproduksi dan didiagnosis karena bersifat timing-dependent dan tidak selalu konsisten muncul\n- Aplikasi harus secara eksplisit menangani error deadlock dengan logika retry, menambah kompleksitas kode",
        en: "",
      },
    },
  },
};
