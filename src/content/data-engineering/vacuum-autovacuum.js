export const term = {
  id: "vacuum-autovacuum",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#fbbf24",
  icon: "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  simulation: "vacuum",
  tools: ["PostgreSQL VACUUM", "pg_stat_user_tables", "pganalyze", "Supabase", "RDS PostgreSQL"],
  prerequisites: ["mvcc"],
  related: ["table-bloat"],
  name: { id: "VACUUM & AUTOVACUUM", en: "" },
  content: {
    description: {
      id: "VACUUM adalah proses pemeliharaan khusus di PostgreSQL yang membersihkan \"dead tuples\" — sisa-sisa baris lama yang ditinggalkan oleh mekanisme MVCC (Multi-Version Concurrency Control) setiap kali terjadi UPDATE atau DELETE. AUTOVACUUM adalah proses background otomatis yang menjalankan VACUUM tanpa perlu campur tangan manual, dipicu berdasarkan ambang batas jumlah perubahan pada tabel. Tanpa VACUUM yang berjalan cukup sering, dead tuples menumpuk, tabel jadi bengkak (bloat) jauh melebihi ukuran data aktualnya, dan performa query menurun karena database harus membaca lebih banyak halaman disk yang sebagian besar isinya sampah.",
      en: "",
    },
    concept: {
      id: "Bayangkan MVCC seperti sistem arsip yang tidak pernah benar-benar menghapus dokumen lama saat direvisi — setiap kali kamu \"mengedit\" dokumen, sistem sebenarnya membuat salinan baru dan menandai versi lama sebagai \"kadaluarsa\", bukan langsung merobeknya. Ini bagus karena orang lain yang sedang membaca versi lama tidak terganggu di tengah proses baca. Tapi kalau tidak ada petugas kebersihan yang rutin membuang dokumen-dokumen kadaluarsa itu, lemari arsip lama-lama penuh sesak dengan kertas usang yang tidak berguna — itulah peran VACUUM, si petugas kebersihan yang membuang dokumen kadaluarsa dan mengembalikan ruang untuk dipakai lagi.",
      en: "",
    },
    methodology: {
      id: "Ketika sebuah baris di-UPDATE atau di-DELETE di PostgreSQL, baris lama tidak langsung dihapus secara fisik — ia hanya ditandai sebagai mati dengan mengeset `xmax` (transaction ID yang menghapusnya), sambil versi baru dari baris tersebut ditulis di tempat lain. Baris yang ditandai mati ini disebut dead tuple, dan ia tetap memakan ruang disk sampai dibersihkan. VACUUM bekerja dengan memindai tabel, mencari dead tuples yang tidak lagi dibutuhkan oleh transaction manapun yang sedang berjalan, lalu menandai ruang yang mereka tempati sebagai bebas untuk dipakai ulang oleh insert/update berikutnya (bukan mengembalikan ruang ke sistem operasi — itu tugas VACUUM FULL yang jauh lebih berat dan mengunci tabel). Setelah membersihkan, VACUUM biasanya diikuti ANALYZE untuk memperbarui statistik tabel yang dipakai query planner dalam membuat keputusan eksekusi.",
      en: "",
    },
    objective: {
      id: "Konsep ini eksis karena MVCC — fitur yang membuat PostgreSQL bisa melayani banyak transaction baca-tulis konkuren tanpa saling mengunci — punya efek samping berupa akumulasi dead tuples yang harus dibersihkan secara aktif. Tanpa VACUUM, sistem yang punya volume UPDATE/DELETE tinggi akan mengalami degradasi performa secara bertahap dan bahkan berisiko transaction ID wraparound, masalah serius yang bisa membuat database berhenti menerima transaction baru sama sekali.",
      en: "",
    },
    goal: {
      id: "Tujuannya adalah menjaga ukuran tabel tetap proporsional dengan data aktualnya, ruang disk yang dipakai ulang secara efisien, dan performa query tetap stabil dalam jangka panjang meski tabel mengalami banyak UPDATE/DELETE berulang, tanpa perlu campur tangan manual berkat AUTOVACUUM yang berjalan otomatis di background.",
      en: "",
    },
    exampleImplementation: {
      id: "Memantau dan menjalankan VACUUM pada tabel dengan banyak dead tuples akibat UPDATE status berulang.\n\n1. Cek jumlah dead tuples pada tabel via `pg_stat_user_tables`.\n2. Jalankan VACUUM ANALYZE secara manual jika autovacuum belum sempat berjalan atau tabel sangat besar.\n3. Untuk kasus bloat parah, pertimbangkan VACUUM FULL (tapi ini mengunci tabel, jadi harus dijadwalkan di jam sepi).\n\n```sql\n-- Cek statistik dead tuples per tabel\nSELECT relname, n_dead_tup, n_live_tup,\n       last_vacuum, last_autovacuum\nFROM pg_stat_user_tables\nWHERE relname = 'klaim';\n\n-- Jalankan VACUUM manual + update statistik planner\nVACUUM ANALYZE klaim;\n\n-- Konfigurasi autovacuum lebih agresif untuk tabel dengan write tinggi\nALTER TABLE klaim SET (autovacuum_vacuum_scale_factor = 0.05);\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Klinika Sehat punya tabel `klaim` yang menerima ribuan UPDATE status per hari (dari \"diajukan\" ke \"diverifikasi\" ke \"disetujui\"). Setelah beberapa bulan berjalan, tim ops mulai melihat query dashboard yang biasanya instan mulai melambat beberapa detik. Investigasi lewat `pg_stat_user_tables` menunjukkan jumlah dead tuples jauh melebihi baris hidup — autovacuum memang berjalan tapi ambang batasnya terlalu longgar untuk volume write setinggi itu. Setelah tim menurunkan `autovacuum_vacuum_scale_factor` khusus untuk tabel tersebut agar autovacuum trigger lebih sering, ruang bekas dead tuples berhasil di-reclaim secara konsisten dan performa query kembali ke level normal.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- AUTOVACUUM berjalan otomatis di background, tidak butuh campur tangan manual untuk operasi sehari-hari\n- Mencegah transaction ID wraparound, masalah kritikal yang bisa menghentikan database menerima transaction baru\n- Reclaim ruang disk membuat query scan lebih cepat karena lebih sedikit halaman sampah yang perlu dibaca\n- ANALYZE yang menyertai VACUUM menjaga statistik planner tetap akurat untuk keputusan query plan yang optimal",
        en: "",
      },
      cons: {
        id: "- Konfigurasi default autovacuum kadang terlalu longgar untuk tabel dengan volume write sangat tinggi, butuh tuning manual per tabel\n- VACUUM FULL yang benar-benar mengecilkan ukuran fisik tabel butuh exclusive lock, sehingga memblokir akses selama proses berjalan\n- VACUUM biasa tidak mengembalikan ruang ke sistem operasi, hanya menandainya bebas untuk dipakai ulang internal tabel\n- Pada tabel sangat besar, VACUUM bisa memakan waktu lama dan membebani I/O, perlu dijadwalkan dengan hati-hati",
        en: "",
      },
    },
  },
};
