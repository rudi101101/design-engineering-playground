export const term = {
  id: "isolation-levels",
  track: "data-engineering",
  category: "Consistency",
  color: "#fb7185",
  icon: "M3 11l19-9-9 19-2-8-8-2z",
  simulation: "isolation",
  tools: ["PostgreSQL", "MySQL InnoDB", "Oracle", "SQL Server", "BigQuery"],
  prerequisites: ["acid"],
  related: ["mvcc"],
  name: { id: "Isolation Levels", en: "Isolation Levels" },
  content: {
    description: {
      id: "Isolation Levels adalah pengaturan yang menentukan seberapa 'terisolasi' satu transaksi database dari transaksi lain yang berjalan bersamaan. Ini adalah implementasi konkret dari huruf 'I' (Isolation) dalam ACID, dan berbentuk spektrum dari READ UNCOMMITTED (paling longgar, mengizinkan dirty read) sampai SERIALIZABLE (paling ketat, transaksi seolah dijalankan satu per satu berurutan). Pemilihan isolation level adalah trade-off eksplisit antara konsistensi data dan performa — makin ketat isolasinya, makin aman dari anomali konkurensi, tapi makin besar juga potensi transaksi saling memblokir dan menurunkan throughput.",
      en: "",
    },
    concept: {
      id: "Bayangkan isolation level seperti aturan privasi di ruang kerja bersama (coworking space). READ UNCOMMITTED seperti ruang terbuka penuh tanpa sekat — kamu bisa mengintip dokumen orang lain bahkan saat mereka masih mencoret-coret draft yang belum final (dirty read). SERIALIZABLE seperti setiap orang mendapat ruang privat terkunci dan harus antre bergiliran masuk satu per satu — sangat aman dari gangguan, tapi jelas lebih lambat karena tidak ada yang bisa bekerja paralel di ruang yang sama.",
      en: "",
    },
    methodology: {
      id: "Empat level isolasi standar SQL, dari longgar ke ketat: READ UNCOMMITTED mengizinkan transaksi membaca perubahan dari transaksi lain yang bahkan belum di-commit (dirty read) — jarang dipakai di praktik karena risikonya tinggi. READ COMMITTED hanya mengizinkan pembacaan data yang sudah di-commit, tapi nilai bisa berubah antar pembacaan dalam transaksi yang sama (non-repeatable read) — ini default PostgreSQL. REPEATABLE READ menjamin nilai yang dibaca tetap konsisten sepanjang transaksi berjalan — ini default MySQL InnoDB. SERIALIZABLE adalah level paling ketat, memastikan hasil eksekusi transaksi konkuren setara dengan jika dijalankan berurutan satu per satu. Di balik layar, banyak database modern seperti PostgreSQL mengimplementasikan level-level ini lewat MVCC (Multi-Version Concurrency Control), yang memberi setiap transaksi snapshot data tersendiri alih-alih mengunci baris secara fisik.",
      en: "",
    },
    objective: {
      id: "Isolation level ada karena ketika banyak transaksi berjalan bersamaan pada data yang sama, bisa muncul berbagai anomali seperti dirty read, non-repeatable read, dan phantom read yang membuat hasil query menjadi tidak dapat diandalkan. Tanpa kontrol isolasi yang jelas, aplikasi berisiko membaca atau menulis data yang tidak konsisten meski masing-masing transaksi individual sudah benar secara logika.",
      en: "",
    },
    goal: {
      id: "Tujuannya adalah memberi developer kontrol eksplisit atas trade-off antara konsistensi dan performa: memilih level yang cukup ketat untuk mencegah anomali yang relevan bagi kasus bisnis tertentu, sambil tetap secepat mungkin untuk kasus yang tidak butuh isolasi ketat — hasil akhirnya adalah query yang bisa diandalkan tanpa mengorbankan throughput sistem secara berlebihan.",
      en: "",
    },
    exampleImplementation: {
      id: "Cara menetapkan isolation level secara eksplisit dalam sebuah transaksi PostgreSQL:\n\n1. Mulai transaksi dengan level isolasi yang diinginkan.\n2. Isolation level menentukan snapshot data mana yang terlihat oleh transaksi.\n3. Transaksi dieksekusi terhadap snapshot tersebut.\n4. Commit atau rollback melepas kunci dan snapshot.\n\n```sql\nBEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;\n\nSELECT total_saldo FROM rekening WHERE id = 'REK001';\n-- di tengah transaksi ini, transaksi lain melakukan UPDATE pada baris yang sama\n-- tapi REPEATABLE READ menjamin SELECT berikutnya tetap melihat nilai yang sama\nSELECT total_saldo FROM rekening WHERE id = 'REK001';\n\nCOMMIT;\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Fintech Cepat menjalankan proses tutup buku laporan finansial bulanan yang menghitung agregat dari jutaan baris transaksi. Untuk memastikan hasilnya konsisten meski ada transaksi baru yang masuk selama proses laporan berjalan, tim database menetapkan isolation level REPEATABLE READ khusus untuk query laporan ini — menjamin snapshot data yang dilihat query tetap konsisten dari awal sampai akhir eksekusi, meski transaksi lain terus berjalan di latar belakang tanpa mengganggu hasil laporan.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Memberi kontrol granular untuk menyeimbangkan konsistensi dan performa sesuai kebutuhan tiap query atau transaksi\n- Level ketat seperti SERIALIZABLE mencegah hampir semua anomali konkurensi, cocok untuk operasi finansial kritis\n- Level longgar seperti READ COMMITTED memberi throughput tinggi untuk beban kerja yang tidak sensitif terhadap sedikit ketidakkonsistenan\n- Implementasi berbasis MVCC di database modern memungkinkan isolasi tinggi tanpa selalu mengorbankan konkurensi lewat locking berat",
        en: "",
      },
      cons: {
        id: "- Level isolasi yang lebih ketat (SERIALIZABLE) bisa menyebabkan lebih banyak transaction abort/retry akibat konflik serialisasi\n- Salah memilih level yang terlalu longgar berisiko anomali data yang sulit dilacak, seperti non-repeatable read pada laporan\n- Default level berbeda antar database (PostgreSQL: READ COMMITTED, MySQL: REPEATABLE READ) bisa membingungkan tim yang bekerja lintas platform\n- Level ketat cenderung menurunkan throughput pada beban kerja dengan concurrency tinggi karena lebih banyak blocking atau retry",
        en: "",
      },
    },
  },
};
