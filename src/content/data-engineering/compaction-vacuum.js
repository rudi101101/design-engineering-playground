export const term = {
  id: "compaction-vacuum",
  track: "data-engineering",
  category: "Storage & Format",
  color: "#fb923c",
  icon: "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  simulation: "compaction",
  tools: ["Apache Iceberg", "Delta Lake OPTIMIZE+VACUUM", "PostgreSQL VACUUM", "Spark", "Hudi"],
  prerequisites: ["open-table-format"],
  related: ["vacuum-autovacuum"],
  name: { id: "Compaction & Vacuum", en: "Compaction & Vacuum" },
  content: {
    description: {
      id: "Compaction & Vacuum adalah dua proses maintenance yang saling melengkapi untuk menjaga kesehatan tabel di sistem yang menggunakan pola tulis insert-heavy atau streaming. Compaction menggabungkan ribuan file kecil hasil tulisan yang sering dan bertahap menjadi lebih sedikit file berukuran optimal, sementara vacuum menghapus versi data lama yang sudah tidak relevan setelah melewati periode retensi tertentu untuk membebaskan ruang penyimpanan. Tanpa keduanya, tabel di data lakehouse modern (Iceberg, Delta Lake, Hudi) maupun database tradisional seperti PostgreSQL akan terus membengkak dan melambat seiring waktu.",
      en: "",
    },
    concept: {
      id: "Bayangkan sebuah gudang penerimaan barang yang menerima ratusan paket kecil setiap menit sepanjang hari, masing-masing langsung ditumpuk begitu tiba. Setelah beberapa minggu, gudang penuh dengan ribuan kardus kecil yang membuat pencarian barang jadi lambat karena harus membuka satu-satu. Compaction seperti tim malam yang menggabungkan kardus-kardus kecil itu menjadi beberapa kardus besar berlabel jelas. Vacuum seperti proses terpisah yang membuang barang-barang yang statusnya sudah 'kadaluarsa' atau 'sudah diganti versi barunya' agar gudang tidak terus penuh oleh barang yang sebenarnya sudah tidak dibutuhkan lagi.",
      en: "",
    },
    methodology: {
      id: "Pada sistem streaming atau insert-heavy, setiap batch tulis kecil menghasilkan satu file baru — dalam skala harian ini bisa menghasilkan puluhan ribu file kecil yang masing-masing jauh di bawah ukuran optimal (idealnya 128MB sampai 1GB per file). Sistem memonitor ukuran file secara berkala, lalu proses compaction membaca banyak file kecil itu, menggabungkannya menjadi file baru berukuran optimal, dan memperbarui manifest tabel agar menunjuk ke file gabungan yang baru. Proses vacuum berjalan terpisah: ia mengecek snapshot atau versi data yang usianya sudah melewati batas retensi (misalnya lebih dari 7 hari), lalu menghapus (expire) snapshot dan file fisik yang sudah tidak lagi dirujuk oleh snapshot manapun yang masih hidup, sehingga ruang penyimpanan benar-benar dibebaskan.",
      en: "",
    },
    objective: {
      id: "Streaming write yang datang terus-menerus secara natural menghasilkan banyak file kecil, dan file kecil dalam jumlah besar adalah musuh performa — setiap query harus membuka lebih banyak file yang masing-masing punya overhead metadata sendiri (small file problem). Di sisi lain, sistem berbasis snapshot atau MVCC (seperti open table format dan PostgreSQL) tidak pernah benar-benar menghapus data lama secara langsung demi mendukung time travel atau concurrent read, sehingga versi lama yang tidak lagi dibutuhkan harus dibersihkan secara eksplisit lewat vacuum, atau storage akan terus bertumbuh tanpa batas.",
      en: "",
    },
    goal: {
      id: "Hasil konkretnya adalah jumlah file yang jauh lebih sedikit dan lebih besar (mendekati ukuran optimal), yang mempercepat query karena overhead pembukaan file berkurang drastis, sekaligus ruang penyimpanan yang terpakai kembali proporsional dengan data yang benar-benar masih relevan, bukan menumpuk versi-versi lama yang tidak terpakai.",
      en: "",
    },
    exampleImplementation: {
      id: "Contoh siklus compaction dan vacuum pada tabel Iceberg yang menerima streaming write:\n\n```sql\n-- Menggabungkan file-file kecil menjadi file berukuran optimal\nCALL catalog.system.rewrite_data_files(\n  table => 'laporan.klaim',\n  options => map('min-input-files', '10')\n);\n\n-- Menghapus snapshot yang lebih tua dari 7 hari\nCALL catalog.system.expire_snapshots(\n  table => 'laporan.klaim',\n  older_than => TIMESTAMP '2026-07-13 00:00:00'\n);\n```\n\nSetelah rewrite_data_files, ribuan file kecil hasil streaming selama sebulan bisa menyusut menjadi puluhan file besar; setelah expire_snapshots, snapshot-snapshot lama yang sudah melewati batas retensi audit dihapus permanen beserta file fisiknya.",
      en: "",
    },
    exampleEnterprise: {
      id: "PT Nusantara Logistik menjalankan streaming write ke tabel klaim asuransi pengiriman berbasis Iceberg. Selama 30 hari, proses streaming ini menghasilkan sekitar 10.000 file kecil karena data masuk dalam batch-batch mikro sepanjang hari. Job compaction terjadwal setiap malam menggabungkan file-file itu menjadi sekitar 50 file berukuran optimal, sementara job vacuum mingguan menghapus snapshot yang lebih tua dari 7 hari — menjaga query tim analitik tetap cepat dan biaya storage tetap terkendali meskipun volume data terus tumbuh.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Compaction mengatasi small file problem yang jadi penyebab utama query lambat pada tabel dengan pola streaming write.\n- Vacuum membebaskan ruang penyimpanan dari versi data lama yang sudah tidak relevan, menjaga biaya storage tetap terkendali.\n- Keduanya bisa dijadwalkan otomatis sebagai job maintenance rutin tanpa mengganggu proses tulis yang sedang berjalan.\n- Menjaga performa query tetap stabil seiring waktu, alih-alih terus menurun seiring bertambahnya jumlah file.",
        en: "",
      },
      cons: {
        id: "- Compaction sendiri butuh sumber daya komputasi (biasanya Spark job) yang menambah biaya operasional infrastruktur.\n- Menjalankan vacuum terlalu agresif bisa menghapus snapshot yang ternyata masih dibutuhkan untuk audit atau rollback historis.\n- Jika compaction tidak dijadwalkan rutin, small file problem akan terus terakumulasi dan makin sulit diatasi seiring waktu.\n- Proses compaction pada tabel yang sangat besar bisa memakan waktu lama dan perlu direncanakan agar tidak bentrok dengan jam sibuk query.",
        en: "",
      },
    },
  },
};
