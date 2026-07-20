export const term = {
  id: "foreign-key-referential-integrity",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#f0abfc",
  icon: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  simulation: "foreignkey",
  tools: ["PostgreSQL", "MySQL", "Oracle", "SQL Server", "SQLite"],
  prerequisites: ["primary-key-composite-key"],
  related: ["unique-constraint-check-constraint"],
  name: { id: "Foreign Key & Referential Integrity", en: "Foreign Key & Referential Integrity" },
  content: {
    description: {
      id: "Foreign Key (FK) adalah kolom di sebuah tabel (child) yang merujuk ke primary key di tabel lain (parent), yang menjadi mekanisme utama database untuk menjaga referential integrity — jaminan bahwa nilai FK di child table selalu merujuk ke baris yang benar-benar ada di parent table. Database mencegah munculnya 'orphan record', yaitu baris child yang menunjuk ke parent yang sudah tidak ada, melalui aturan seperti ON DELETE CASCADE, RESTRICT, atau SET NULL.",
      en: "",
    },
    concept: {
      id: "Bayangkan foreign key seperti nomor pesanan yang tertera di resi pengiriman — resi itu hanya sah kalau nomor pesanan yang tertulis di dalamnya benar-benar terdaftar di sistem toko. Kalau seseorang mencoba membuat resi dengan nomor pesanan fiktif yang tidak pernah ada, sistem akan menolaknya. Begitu juga jika sebuah pesanan dibatalkan, sistem harus punya aturan jelas: apakah semua resi terkait ikut dibatalkan (CASCADE), ditolak dulu pembatalannya selama masih ada resi aktif (RESTRICT), atau resi itu tetap ada tapi kolom nomor pesanannya dikosongkan (SET NULL).",
      en: "",
    },
    methodology: {
      id: "Database menegakkan referential integrity secara otomatis pada setiap operasi INSERT, UPDATE, dan DELETE yang melibatkan kolom foreign key. Saat INSERT baris baru ke child table, database memeriksa apakah nilai FK tersebut ada sebagai primary key di parent table — jika tidak ditemukan, operasi ditolak dengan error FK violation. Saat baris di parent table hendak dihapus atau primary key-nya diubah, database mengikuti aturan yang didefinisikan: ON DELETE CASCADE akan otomatis menghapus semua baris child yang terkait, ON DELETE RESTRICT akan menolak penghapusan parent selama masih ada child yang mereferensikannya, dan ON DELETE SET NULL akan mengosongkan nilai FK di child alih-alih menghapus barisnya.",
      en: "",
    },
    objective: {
      id: "Foreign key ada untuk mencegah inkonsistensi data yang muncul ketika relasi antar tabel tidak dijaga secara ketat — misalnya baris transaksi yang menunjuk ke pelanggan yang sudah dihapus, atau baris klaim asuransi tanpa pasien yang valid. Tanpa referential integrity, aplikasi harus memvalidasi relasi ini secara manual di level kode, yang rawan celah dan bug, terutama saat banyak service atau developer berbeda mengakses database yang sama.",
      en: "",
    },
    goal: {
      id: "Hasil yang dicapai adalah database yang secara struktural mustahil memiliki orphan record — setiap relasi antar tabel dijamin valid oleh database itu sendiri, bukan hanya oleh disiplin kode aplikasi, sehingga integritas data tetap terjaga bahkan ketika banyak sistem berbeda menulis ke database yang sama.",
      en: "",
    },
    exampleImplementation: {
      id: "Contoh penerapan foreign key dengan referential integrity di tabel fakta klaim yang mereferensikan dimensi pasien:\n\n1. Tabel dim_pasien memiliki patient_sk sebagai primary key.\n2. Tabel fact_klaim memiliki kolom pasien_sk yang didefinisikan sebagai foreign key merujuk ke dim_pasien.\n3. Saat mencoba INSERT klaim dengan pasien_sk yang tidak ada di dim_pasien, database menolak dengan error FK violation.\n\n```sql\nCREATE TABLE dim_pasien (\n  patient_sk BIGINT PRIMARY KEY,\n  nik VARCHAR(20) UNIQUE\n);\n\nCREATE TABLE fact_klaim (\n  claim_id BIGINT PRIMARY KEY,\n  pasien_sk BIGINT REFERENCES dim_pasien(patient_sk)\n    ON DELETE RESTRICT,\n  jumlah_klaim NUMERIC(12,2)\n);\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Klinika Sehat membangun data warehouse dengan tabel fact_klaim yang kolom pasien_sk-nya didefinisikan sebagai foreign key ke tabel dim_pasien.patient_sk. Ketika tim ETL mencoba memuat data klaim dari sistem lama yang ternyata memiliki beberapa baris dengan referensi pasien yang rusak (data quality issue di sumber), database langsung menolak insert tersebut dengan error FK constraint violation, memaksa tim data engineering memperbaiki data sumber dulu sebelum data itu bisa masuk ke warehouse — mencegah laporan klaim yang tidak bisa ditelusuri ke pasien mana pun.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Mencegah orphan record secara struktural, dijaga langsung oleh database bukan hanya kode aplikasi\n- Menjaga konsistensi relasi antar tabel meski diakses banyak sistem atau service berbeda\n- Opsi CASCADE/RESTRICT/SET NULL memberi kontrol eksplisit atas perilaku saat data induk berubah\n- Membantu dokumentasi implisit tentang relasi antar tabel langsung dari skema database",
        en: "",
      },
      cons: {
        id: "- Menambah overhead validasi pada setiap operasi INSERT/UPDATE/DELETE yang terkait\n- ON DELETE CASCADE yang tidak hati-hati bisa menghapus data dalam jumlah besar secara tidak sengaja\n- Mempersulit proses bulk load atau migrasi data karena urutan insert harus mengikuti dependensi antar tabel\n- Pada sistem terdistribusi lintas database berbeda, referential integrity tidak bisa ditegakkan otomatis dan harus ditangani di level aplikasi",
        en: "",
      },
    },
  },
};
