export const term = {
  id: "write-ahead-log",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#fb923c",
  icon: "M3 6h18M3 12h18M3 18h18",
  simulation: "wal",
  tools: ["PostgreSQL WAL", "MySQL binlog", "Oracle Redo Log", "Debezium", "GCP Datastream"],
  prerequisites: [],
  related: ["checkpoint", "replication"],
  name: { id: "Write-Ahead Log (WAL)", en: "Write-Ahead Log (WAL)" },
  content: {
    description: {
      id: "Write-Ahead Log (WAL) adalah teknik fundamental di hampir semua database relasional di mana setiap perubahan data ditulis terlebih dahulu ke sebuah log sekuensial sebelum benar-benar diterapkan ke storage utama (heap/tabel). Teknik ini menjadi dasar dari jaminan durability pada ACID, mekanisme crash recovery, dan bahkan menjadi sumber data untuk Change Data Capture (CDC). Tanpa WAL, database rentan kehilangan data setiap kali server crash di tengah proses penulisan.",
      en: "",
    },
    concept: {
      id: "Bayangkan WAL seperti buku catatan kasir di toko sebelum barang benar-benar dipindahkan ke rak inventaris. Setiap transaksi dicatat dulu di buku catatan (log) secara berurutan — cepat karena tinggal menambah baris baru di akhir buku. Kalau tiba-tiba listrik mati sebelum barang sempat ditata ulang di rak, kasir cukup membaca ulang buku catatan itu dari halaman terakhir yang sudah 'disegel' (checkpoint) untuk tahu persis transaksi mana yang harus diulang.",
      en: "",
    },
    methodology: {
      id: "WAL bekerja dengan menulis setiap perubahan ke sebuah file append-only secara sekuensial, yang jauh lebih cepat dibanding random write ke halaman data di storage utama karena disk (terutama HDD) jauh lebih efisien untuk penulisan berurutan. Setelah entri WAL berhasil ditulis ke disk, database baru mengirim ACK ke client bahwa transaksi commit. Perubahan aktual ke halaman data (heap) di-apply belakangan secara asynchronous. Jika terjadi crash, proses recovery akan replay seluruh entri WAL sejak checkpoint terakhir untuk mengembalikan database ke state konsisten tanpa kehilangan data yang sudah di-commit.",
      en: "",
    },
    objective: {
      id: "WAL diciptakan untuk menyelesaikan dilema antara kecepatan tulis dan keamanan data: menulis langsung ke halaman data tersebar di disk itu lambat dan berisiko korup jika crash terjadi di tengah proses. Dengan mencatat perubahan secara sekuensial dulu, database bisa menjamin durability (huruf D pada ACID) tanpa mengorbankan performa penulisan.",
      en: "",
    },
    goal: {
      id: "Hasil yang dicapai adalah zero data loss untuk transaksi yang sudah di-commit meskipun terjadi crash mendadak, ditambah throughput write yang jauh lebih tinggi dibanding penulisan acak langsung ke storage utama, serta jejak perubahan (log) yang dapat dimanfaatkan ulang untuk replikasi dan CDC.",
      en: "",
    },
    exampleImplementation: {
      id: "Alur penulisan dengan WAL secara umum:\n\n1. Client mengirim request UPDATE/INSERT.\n2. Database menulis entri perubahan ke WAL (sequential append, fast I/O).\n3. Setelah WAL ter-flush ke disk, database mengirim ACK ke client — transaksi dianggap commit.\n4. Perubahan diterapkan ke heap/halaman data secara asynchronous di background.\n5. Checkpoint berkala memastikan WAL lama bisa dibuang setelah data benar-benar tersimpan permanen.\n\n```sql\n-- Melihat status WAL di PostgreSQL\nSELECT pg_current_wal_lsn(), pg_walfile_name(pg_current_wal_lsn());\n\n-- Mengatur ukuran WAL segment agar checkpoint tidak terlalu sering\nALTER SYSTEM SET max_wal_size = '2GB';\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "PT Nusantara Logistik memakai PostgreSQL sebagai sumber data operasional utama. Tim data engineering memasang Debezium yang membaca WAL PostgreSQL secara real-time untuk melakukan Change Data Capture, lalu mengalirkan setiap perubahan pesanan ke BigQuery untuk analitik near real-time. Suatu ketika server database sempat mati mendadak akibat listrik padam; setelah dinyalakan ulang, PostgreSQL otomatis me-replay WAL sejak checkpoint terakhir dan seluruh transaksi yang sudah di-commit sebelum crash tetap utuh, tanpa kehilangan satu pun data pesanan.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Menjamin durability penuh, tidak ada data ter-commit yang hilang saat crash\n- Write jauh lebih cepat karena sequential I/O dibanding random write langsung ke halaman data\n- Menjadi sumber data siap pakai untuk CDC dan replikasi tanpa beban tambahan ke tabel utama\n- Recovery time singkat karena hanya perlu replay dari checkpoint terakhir, bukan dari awal",
        en: "",
      },
      cons: {
        id: "- Menambah overhead penyimpanan karena setiap perubahan tercatat dua kali (log dan data)\n- WAL yang menumpuk bisa memenuhi disk jika checkpoint atau proses konsumsi (replikasi/CDC) tertinggal\n- Menambah kompleksitas operasional: perlu monitoring retention WAL, terutama saat ada replica atau consumer yang lambat\n- Recovery tetap butuh waktu proporsional dengan jumlah WAL yang harus di-replay sejak checkpoint terakhir",
        en: "",
      },
    },
  },
};
