export const term = {
  id: "open-table-format",
  track: "data-engineering",
  category: "Storage & Format",
  color: "#f97316",
  icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  simulation: "iceberg",
  tools: ["Apache Iceberg", "Delta Lake", "Apache Hudi", "BigLake", "Nessie Catalog"],
  prerequisites: ["data-lakehouse"],
  related: ["compaction-vacuum", "partitioning"],
  name: { id: "Open Table Format — Iceberg/Delta/Hudi", en: "Open Table Format — Iceberg/Delta/Hudi" },
  content: {
    description: {
      id: "Open Table Format adalah lapisan metadata terbuka yang diletakkan di atas file-file data mentah (biasanya Parquet) di object storage, yang mengubah kumpulan file tersebut menjadi sesuatu yang berperilaku seperti tabel database sungguhan — lengkap dengan transaksi ACID, evolusi skema, dan riwayat versi. Sebelum format ini ada, data lake klasik hanya berupa folder berisi file Parquet/CSV tanpa jaminan konsistensi: dua proses yang menulis bersamaan bisa saling menimpa, dan tidak ada cara resmi melacak versi data di masa lalu. Iceberg, Delta Lake, dan Hudi adalah tiga implementasi populer dari konsep yang sama ini, masing-masing menjadi fondasi arsitektur data lakehouse modern.",
      en: "",
    },
    concept: {
      id: "Bayangkan object storage seperti gudang besar berisi ribuan kardus (file Parquet) yang ditumpuk tanpa katalog. Tanpa open table format, mencari 'data klaim per 15 Juni 2026 versi sebelum revisi' berarti membongkar semua kardus. Open table format seperti menambahkan sistem katalog perpustakaan di atas gudang itu: setiap kali ada perubahan, katalog mencatat snapshot baru — daftar kardus mana saja yang berlaku pada titik waktu tertentu — sehingga kita bisa 'memutar waktu' ke katalog versi lama tanpa memindahkan satu kardus pun.",
      en: "",
    },
    methodology: {
      id: "Open table format bekerja sebagai metadata layer di atas object storage biasa. Setiap kali ada operasi tulis, sistem tidak mengubah file lama secara langsung — ia menulis file data baru, lalu membuat manifest baru yang mendaftar file mana saja yang tergabung dalam snapshot itu, dan akhirnya melakukan atomic commit yang menunjuk pointer 'snapshot terkini' ke manifest baru tersebut. Karena commit ini atomik, tidak pernah ada pembaca yang melihat kondisi data setengah-tertulis. Saat membaca, engine cukup mengecek pointer snapshot terbaru, lalu me-resolve daftar file dari manifest itu tanpa perlu melakukan list seluruh folder storage — dan karena snapshot lama tetap ada, pembaca bisa memilih membaca snapshot versi lama (time travel) alih-alih versi terbaru.",
      en: "",
    },
    objective: {
      id: "Data lake mentah tidak pernah didesain untuk menjamin konsistensi tulis-baca bersamaan, evolusi skema yang aman, atau audit historis — padahal kebutuhan itu semakin krusial begitu data lake dipakai untuk laporan finansial atau kepatuhan regulasi. Open table format hadir untuk menutup celah ini tanpa mengorbankan skalabilitas dan biaya murah object storage, dengan menambahkan garansi setara data warehouse di atas fondasi data lake.",
      en: "",
    },
    goal: {
      id: "Hasil konkretnya adalah tabel di atas object storage yang punya jaminan ACID penuh, mendukung schema evolution tanpa rewrite seluruh tabel, dan menyediakan time travel — kemampuan meng-query kondisi tabel persis seperti pada snapshot waktu tertentu di masa lalu, biasanya hingga periode retensi tertentu (misalnya beberapa bulan ke belakang).",
      en: "",
    },
    exampleImplementation: {
      id: "Alur penulisan dan pembacaan pada Apache Iceberg secara konseptual:\n\n1. Proses ETL menulis batch data baru ke tabel.\n2. Iceberg membuat file data Parquet baru di storage.\n3. Iceberg membuat manifest baru yang mendaftar file-file yang berlaku di snapshot ini.\n4. Iceberg melakukan atomic commit — pointer metadata tabel dialihkan ke snapshot baru.\n\n```sql\n-- Query normal: selalu membaca snapshot terbaru\nSELECT * FROM iceberg_catalog.klaim WHERE tanggal_klaim = '2026-07-20';\n\n-- Time travel: membaca kondisi tabel 6 bulan lalu untuk keperluan audit\nSELECT * FROM iceberg_catalog.klaim\nFOR SYSTEM_TIME AS OF '2026-01-20T00:00:00Z';\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Klinika Sehat Group menyimpan tabel histori klaim asuransi kesehatannya sebagai Apache Iceberg di atas Google Cloud Storage. Ketika tim audit internal maupun regulator OJK meminta bukti kondisi data klaim persis seperti enam bulan lalu — sebelum ada koreksi data — tim data engineering cukup menjalankan query time travel ke snapshot pada tanggal tersebut, tanpa perlu menyimpan backup terpisah atau merekonstruksi data secara manual.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Menyediakan transaksi ACID penuh di atas object storage yang murah, sesuatu yang tidak dimiliki data lake mentah.\n- Time travel memudahkan audit, debugging, dan rollback tanpa perlu backup terpisah.\n- Schema evolution (tambah/ubah/hapus kolom) bisa dilakukan tanpa menulis ulang seluruh data lama.\n- Mendukung concurrent read/write dari banyak engine berbeda (Spark, Trino, Flink) secara aman.",
        en: "",
      },
      cons: {
        id: "- Menambah kompleksitas operasional — perlu memahami konsep snapshot, manifest, dan catalog yang tidak ada di data lake sederhana.\n- Snapshot lama yang menumpuk butuh proses vacuum/expire rutin, kalau tidak storage akan terus membengkak.\n- Memilih di antara Iceberg, Delta Lake, dan Hudi bisa mengunci ekosistem tooling tertentu, migrasi antar format tidak trivial.\n- Metadata layer menambah overhead kecil di setiap operasi baca dibanding membaca file Parquet langsung.",
        en: "",
      },
    },
  },
};
