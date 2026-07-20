export const term = {
  id: "checkpoint",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#38bdf8",
  icon: "M20 6L9 17l-5-5",
  simulation: "checkpoint",
  tools: ["PostgreSQL", "MySQL InnoDB", "Oracle", "SQL Server", "RocksDB"],
  prerequisites: ["write-ahead-log"],
  related: ["vacuum-autovacuum"],
  name: { id: "Checkpoint", en: "Checkpoint" },
  content: {
    description: {
      id: "Checkpoint adalah proses periodik di mana database mem-flush (menulis permanen) semua 'dirty pages' — halaman data di memori (buffer pool) yang sudah berubah tapi belum disimpan ke disk — ke storage utama. Tujuannya adalah membatasi seberapa jauh WAL (Write-Ahead Log) yang harus di-replay saat proses crash recovery, sehingga waktu pemulihan database tetap singkat dan terprediksi.",
      en: "",
    },
    concept: {
      id: "Bayangkan checkpoint seperti menyimpan progress game (save point) secara berkala. Jika game tiba-tiba crash, kamu tidak perlu mengulang dari awal permainan — cukup dari save point terakhir. Tanpa checkpoint, database harus me-replay SELURUH log perubahan sejak sistem pertama kali dinyalakan setiap kali terjadi crash, yang bisa memakan waktu sangat lama pada sistem yang sudah berjalan lama.",
      en: "",
    },
    methodology: {
      id: "Buffer pool database menampung halaman-halaman data yang sedang aktif diakses dan dimodifikasi di memori untuk performa. Ketika checkpoint dipicu (baik terjadwal, misalnya setiap beberapa menit, atau berdasarkan ukuran WAL yang sudah menumpuk), database menulis semua dirty pages tersebut ke disk secara permanen, lalu mencatat posisi LSN (Log Sequence Number) terkini sebagai penanda checkpoint. Setelah checkpoint selesai, WAL sebelum posisi LSN tersebut tidak lagi dibutuhkan untuk crash recovery dan bisa di-arsipkan atau dihapus (di-truncate), karena semua perubahan sampai titik itu sudah dijamin tersimpan permanen di storage utama.",
      en: "",
    },
    objective: {
      id: "Checkpoint diperlukan karena WAL yang terus bertambah tanpa batas akan membuat proses crash recovery memakan waktu sangat lama — database harus replay semua log dari awal setiap kali restart setelah crash. Checkpoint memberikan 'garis batas aman' sehingga recovery hanya perlu memproses WAL setelah checkpoint terakhir, bukan seluruh sejarah database.",
      en: "",
    },
    goal: {
      id: "Hasilnya adalah waktu crash recovery yang jauh lebih singkat dan terprediksi — hanya proporsional dengan interval waktu antar checkpoint, bukan dengan usia total database — serta ukuran WAL yang bisa dijaga tetap terkendali karena log lama secara rutin bisa dibuang.",
      en: "",
    },
    exampleImplementation: {
      id: "Ilustrasi siklus checkpoint di PostgreSQL:\n\n1. Buffer pool mengakumulasi dirty pages seiring transaksi berjalan.\n2. Checkpoint terpicu, baik karena interval waktu (checkpoint_timeout) atau ukuran WAL mencapai batas (max_wal_size).\n3. Semua dirty pages di-flush ke disk secara permanen.\n4. LSN posisi checkpoint dicatat.\n5. WAL sebelum LSN tersebut bisa di-truncate atau di-arsipkan karena tidak lagi diperlukan untuk recovery.\n\n```sql\n-- Konfigurasi interval checkpoint di postgresql.conf\ncheckpoint_timeout = '5min'\nmax_wal_size = '1GB'\n\n-- Memicu checkpoint manual\nCHECKPOINT;\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Klinika Sehat mengatur checkpoint_timeout PostgreSQL mereka ke 5 menit untuk sistem rekam medis yang berjalan 24/7. Ketika server sempat mengalami crash tak terduga akibat bug driver storage, proses recovery hanya perlu me-replay WAL dari 5 menit terakhir sebelum crash — bukan dari titik database pertama kali dijalankan bertahun-tahun lalu — sehingga sistem kembali online dalam hitungan detik, bukan jam, dan operasional klinik nyaris tidak terganggu.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Membatasi waktu crash recovery menjadi jauh lebih singkat dan terprediksi\n- Memungkinkan WAL lama dibuang atau diarsipkan secara aman, menghemat storage\n- Mengurangi risiko WAL menumpuk tak terkendali di disk\n- Interval bisa disesuaikan untuk menyeimbangkan antara overhead I/O dan kecepatan recovery",
        en: "",
      },
      cons: {
        id: "- Checkpoint yang terlalu sering menambah beban I/O signifikan ke disk, bisa mengganggu performa saat berlangsung\n- Checkpoint yang terlalu jarang membuat waktu recovery lebih lama karena WAL yang perlu di-replay lebih banyak\n- Proses flush dirty pages besar bisa menyebabkan lonjakan I/O sesaat (checkpoint spike) yang terasa oleh user\n- Perlu tuning yang cermat sesuai karakteristik beban kerja masing-masing sistem",
        en: "",
      },
    },
  },
};
