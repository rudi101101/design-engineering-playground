export const term = {
  id: "table-bloat",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#e879f9",
  icon: "M2 2h20v8H2zM2 14h20v8H2z",
  simulation: "bloat",
  tools: ["pgstattuple", "pg_bloat_check", "pganalyze", "VACUUM FULL", "REINDEX CONCURRENTLY"],
  prerequisites: ["vacuum-autovacuum"],
  related: [],
  name: { id: "Table Bloat", en: "" },
  content: {
    description: {
      id: "Table bloat adalah kondisi di mana ukuran fisik sebuah tabel di disk jauh lebih besar daripada ukuran data aktual yang sebenarnya perlu disimpan. Penyebabnya adalah akumulasi dead tuples dari mekanisme MVCC yang belum dibersihkan, atau ruang bebas yang terfragmentasi sehingga tidak bisa dipakai ulang secara efisien oleh insert/update berikutnya. Bloat bukan cuma masalah kapasitas disk — ia langsung berdampak pada performa, karena query harus membaca lebih banyak halaman (page) dari disk untuk mendapatkan jumlah data hidup yang sama, sehingga operasi scan jadi lebih lambat dan cache jadi kurang efektif.",
      en: "",
    },
    concept: {
      id: "Bayangkan sebuah gudang penyimpanan yang tiap kali barang diganti, barang lama tidak langsung dibuang tapi cuma ditaruh di sudut dengan label \"sudah tidak dipakai\". Lama-lama, gudang itu penuh sesak dengan barang-barang usang yang sebenarnya tidak berguna, sementara barang yang benar-benar aktif dipakai cuma sebagian kecil dari total ruang gudang. Untuk mencari satu barang aktif, kamu harus melewati tumpukan barang usang itu dulu — itulah yang terjadi pada query yang harus scan tabel bloat: banyak \"ruang kosong berhantu\" yang harus dilewati sebelum sampai ke data yang benar-benar relevan.",
      en: "",
    },
    methodology: {
      id: "Bloat terbentuk lewat siklus: operasi UPDATE atau DELETE dalam jumlah besar membuat dead tuples menumpuk lebih cepat dari kecepatan VACUUM membersihkannya, sehingga ukuran tabel di disk terus bertambah meski jumlah baris hidup (live rows) relatif konstan. Query yang men-scan tabel jadi lebih lambat karena harus membaca lebih banyak halaman disk yang sebagian besar isinya dead tuples. Untuk mendiagnosis, tool seperti `pgstattuple` atau `pg_bloat_check` menghitung rasio ruang terpakai vs ruang seharusnya. Jika bloat melewati ambang batas tertentu, solusinya bisa VACUUM biasa (kalau fragmentasinya masih ringan dan cukup reclaim internal), atau VACUUM FULL / REINDEX CONCURRENTLY untuk kasus yang lebih parah yang benar-benar butuh mengecilkan ukuran fisik tabel dan index-nya.",
      en: "",
    },
    objective: {
      id: "Table bloat perlu dipahami sebagai gejala, bukan sekadar masalah kapasitas — ia adalah indikator bahwa proses pembersihan (VACUUM) tidak berjalan cukup cepat dibanding laju perubahan data. Tanpa monitoring dan penanganan bloat, tabel yang sering di-UPDATE bisa membengkak berkali-kali lipat dari ukuran datanya, membuat biaya storage naik dan performa query terus menurun secara bertahap tanpa penyebab yang jelas terlihat dari luar.",
      en: "",
    },
    goal: {
      id: "Tujuannya adalah menjaga rasio antara ukuran fisik tabel dan ukuran data aktual tetap mendekati 1:1 (atau minimal dalam batas wajar), sehingga query scan tetap efisien, biaya storage terkendali, dan performa sistem tidak terdegradasi secara diam-diam seiring waktu.",
      en: "",
    },
    exampleImplementation: {
      id: "Mendiagnosis dan menangani bloat pada tabel yang mengalami banyak UPDATE.\n\n1. Cek rasio bloat menggunakan extension `pgstattuple`.\n2. Jika bloat ringan, VACUUM biasa cukup untuk reclaim ruang internal.\n3. Jika bloat parah (misalnya lebih dari 2-3x ukuran seharusnya), pertimbangkan VACUUM FULL di jam sepi trafik, atau `pg_repack` sebagai alternatif yang tidak mengunci tabel penuh.\n\n```sql\n-- Cek statistik bloat detail pada satu tabel\nSELECT * FROM pgstattuple('klaim');\n-- kolom penting: tuple_percent (persentase ruang terpakai data hidup)\n--                free_percent (persentase ruang kosong/fragmented)\n\n-- Reclaim ruang internal (aman, tidak lock penuh)\nVACUUM ANALYZE klaim;\n\n-- Kompaksi penuh untuk mengecilkan ukuran fisik (lock, jadwalkan hati-hati)\nVACUUM FULL klaim;\n\n-- Rebuild index yang ikut bloat, tanpa mengunci tabel\nREINDEX INDEX CONCURRENTLY idx_klaim_status;\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Toko Meta Retail memproses jutaan update status pesanan tiap bulan pada tabel `klaim` retur mereka. Setelah satu juta operasi UPDATE terkumpul, tim data menyadari ukuran tabel di disk sudah tiga kali lebih besar dari estimasi ukuran data aktual, dan query laporan bulanan yang biasanya selesai dalam hitungan detik mulai memakan waktu satu menit lebih. Setelah dicek dengan `pgstattuple`, ternyata `free_percent` (ruang kosong akibat dead tuples yang belum ter-reclaim maksimal) sangat tinggi. Tim menjalankan `VACUUM ANALYZE` terjadwal di luar jam sibuk, dan performa query kembali ke level normal tanpa perlu VACUUM FULL yang lebih berisiko mengunci tabel produksi.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Memantau bloat secara rutin membantu mendeteksi masalah performa sebelum berdampak besar ke user\n- Solusi ringan seperti VACUUM biasa atau `pg_repack` bisa mengatasi bloat tanpa downtime signifikan\n- Rasio bloat yang terkendali langsung menurunkan biaya storage dan mempercepat backup/restore\n- Tooling seperti `pgstattuple` dan `pganalyze` memberi visibility konkret, bukan cuma tebakan soal kondisi tabel",
        en: "",
      },
      cons: {
        id: "- Bloat sering tidak terlihat sampai performa sudah terdampak nyata, karena tidak ada error eksplisit yang muncul\n- VACUUM FULL sebagai solusi paling tuntas butuh exclusive lock yang memblokir akses tabel selama proses berjalan\n- Index ikut mengalami bloat seiring waktu, jadi penanganan tabel saja tidak cukup, index juga perlu di-reindex berkala\n- Bloat yang dibiarkan terlalu lama bisa jauh lebih mahal untuk diperbaiki dibanding dicegah sejak awal lewat tuning autovacuum",
        en: "",
      },
    },
  },
};
