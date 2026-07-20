export const term = {
  id: "explain-analyze",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#bbf7d0",
  icon: "M13 2L3 14h9l-1 8 10-12h-9z",
  simulation: "explainplan",
  tools: ["PostgreSQL EXPLAIN", "pgMustard", "explain.dalibo.com", "BigQuery Execution Plan", "Snowflake Query Profile"],
  prerequisites: ["database-index"],
  related: ["explain-plan-reading-optimization", "query-optimization-explain"],
  name: { id: "EXPLAIN ANALYZE", en: "" },
  content: {
    description: {
      id: "EXPLAIN ANALYZE adalah perintah yang benar-benar menjalankan sebuah query sambil mengumpulkan statistik eksekusi aktualnya — bukan sekadar prediksi query planner, tapi angka nyata berupa waktu eksekusi tiap tahap dan jumlah baris yang benar-benar diproses. Ini berbeda dari EXPLAIN biasa yang hanya menampilkan rencana eksekusi tanpa benar-benar menjalankan query, sehingga hanya berisi estimasi. Dengan EXPLAIN ANALYZE, seorang data engineer bisa mendiagnosis dengan presisi di mana letak bottleneck sebuah query yang lambat — apakah karena full table scan yang seharusnya bisa pakai index, join yang tidak efisien, atau estimasi planner yang jauh meleset dari kenyataan.",
      en: "",
    },
    concept: {
      id: "Bayangkan EXPLAIN biasa seperti membaca peta rute perjalanan sebelum berangkat — kamu tahu jalan mana yang akan dilewati dan estimasi waktu tempuhnya, tapi itu semua masih perkiraan di atas kertas. EXPLAIN ANALYZE seperti benar-benar melakukan perjalanan itu sambil membawa stopwatch dan mencatat waktu tempuh aktual di tiap persimpangan — kamu jadi tahu persis di ruas jalan mana macet parah terjadi (bottleneck sesungguhnya), bukan cuma dugaan dari peta yang mungkin sudah tidak akurat karena kondisi jalan berubah (statistik tabel yang sudah usang).",
      en: "",
    },
    methodology: {
      id: "Saat `EXPLAIN ANALYZE query` dijalankan, database benar-benar mengeksekusi query tersebut sambil mencatat metrik detail di setiap node dalam pohon rencana eksekusi (execution plan tree) — termasuk jenis operasi (Seq Scan, Index Scan, Nested Loop, Hash Join), estimasi biaya (cost), waktu eksekusi aktual, dan jumlah baris yang benar-benar diproses vs yang diestimasi planner. Cara membaca output ini biasanya dari dalam ke luar (node paling dalam dieksekusi lebih dulu). Beberapa pola bottleneck umum yang bisa diidentifikasi: `Seq Scan` pada tabel besar biasanya menandakan perlunya index baru; `Nested Loop` dengan jumlah baris (N) besar biasanya lebih lambat dibanding `Hash Join` dan menandakan planner mungkin salah pilih strategi; dan selisih besar antara estimasi baris planner dengan jumlah baris aktual menandakan statistik tabel yang usang, biasanya diperbaiki dengan menjalankan `ANALYZE`.",
      en: "",
    },
    objective: {
      id: "EXPLAIN ANALYZE dibutuhkan karena mengoptimalkan query yang lambat tanpa data konkret sama saja menebak-nebak — perubahan yang dibuat berdasarkan intuisi semata bisa saja tidak menyentuh akar masalah sebenarnya atau bahkan memperburuk performa. Dengan data eksekusi aktual, data engineer bisa membuat keputusan optimisasi yang presisi dan terukur, seperti menambah index yang tepat sasaran, alih-alih coba-coba berbagai perubahan tanpa arah yang jelas.",
      en: "",
    },
    goal: {
      id: "Tujuannya adalah diagnosis yang akurat dan terukur terhadap bottleneck query, memungkinkan perbaikan performa yang tepat sasaran — misalnya menambah index spesifik yang mengubah Seq Scan jutaan baris menjadi Index Scan ratusan baris — dengan bukti konkret sebelum dan sesudah, bukan optimisasi berdasarkan tebakan.",
      en: "",
    },
    exampleImplementation: {
      id: "Mendiagnosis query lambat pada tabel besar dan memperbaikinya berdasarkan hasil EXPLAIN ANALYZE.\n\n1. Jalankan EXPLAIN ANALYZE pada query yang lambat, catat node dengan biaya dan waktu tertinggi.\n2. Identifikasi Seq Scan pada tabel besar sebagai kandidat penambahan index.\n3. Tambahkan index yang sesuai, lalu bandingkan hasil EXPLAIN ANALYZE sebelum dan sesudah.\n\n```sql\n-- Sebelum: full scan, lambat\nEXPLAIN ANALYZE\nSELECT * FROM klaim WHERE status = 'pending' AND created_at > '2026-01-01';\n-- Seq Scan on klaim (cost=0.00..50000.00 rows=10000000 width=120)\n--   (actual time=0.02..1250.30 rows=15320 loops=1)\n\n-- Tambahkan index gabungan yang sesuai pola filter\nCREATE INDEX idx_klaim_status_created ON klaim (status, created_at);\n\n-- Sesudah: index scan, jauh lebih cepat\nEXPLAIN ANALYZE\nSELECT * FROM klaim WHERE status = 'pending' AND created_at > '2026-01-01';\n-- Index Scan using idx_klaim_status_created on klaim (cost=0.43..500.12 rows=15320 width=120)\n--   (actual time=0.05..12.40 rows=15320 loops=1)\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Toko Meta Retail punya query laporan pesanan pending yang tadinya scan 10 juta baris secara sequential dengan cost planner 50000 dan waktu eksekusi lebih dari satu detik, membuat dashboard operasional mereka terasa lambat. Setelah tim data menjalankan EXPLAIN ANALYZE dan melihat node `Seq Scan` mendominasi waktu eksekusi, mereka menambahkan index gabungan pada kolom `status` dan `created_at` yang memang jadi pola filter paling sering dipakai. Setelah index ditambahkan, EXPLAIN ANALYZE yang sama menunjukkan perubahan ke `Index Scan` dengan cost turun ke 500 dan waktu eksekusi 100 kali lebih cepat, langsung terasa di responsivitas dashboard operasional mereka.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Memberi data eksekusi aktual, bukan estimasi, sehingga diagnosis bottleneck jauh lebih akurat dan terukur\n- Membantu memvalidasi apakah index atau perubahan query benar-benar berdampak, dengan perbandingan before-after yang konkret\n- Mengungkap masalah statistik planner yang usang lewat selisih besar antara estimasi dan aktual baris\n- Tersedia hampir di semua database SQL modern dengan konsep dasar yang serupa, meski format output berbeda",
        en: "",
      },
      cons: {
        id: "- EXPLAIN ANALYZE benar-benar menjalankan query, jadi hati-hati memakainya pada statement yang mengubah data (UPDATE/DELETE) di production tanpa membungkusnya dalam transaction yang bisa di-rollback\n- Membaca output plan yang kompleks (nested loop bertingkat, banyak join) butuh pengalaman dan bisa membingungkan pemula\n- Hasil eksekusi bisa berbeda antar run karena faktor seperti cache warm/cold, jadi sebaiknya dijalankan beberapa kali untuk hasil yang representatif\n- Menambahkan index berdasarkan satu query tertentu bisa memperlambat operasi write pada tabel tersebut, perlu dipertimbangkan trade-off-nya",
        en: "",
      },
    },
  },
};
