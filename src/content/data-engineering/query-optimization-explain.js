export const term = {
  id: "query-optimization-explain",
  track: "data-engineering",
  category: "Performa",
  color: "#f97316",
  icon: "M13 2L3 14h9l-1 8 10-12h-9z",
  simulation: "queryopt",
  tools: [
    "BigQuery Query Plan",
    "Snowflake Query Profile",
    "EXPLAIN ANALYZE",
    "DBeaver",
    "pgMustard",
  ],
  prerequisites: ["statistics-cost-based-optimizer", "database-index"],
  related: ["explain-analyze", "explain-plan-reading-optimization", "bloom-filter"],
  name: { id: "Query Optimization & EXPLAIN", en: "Query Optimization & EXPLAIN" },
  content: {
    description: {
      id: "Query Optimization adalah disiplin membuat kueri berjalan efisien lewat teknik seperti partition pruning (melewati partisi data yang tidak relevan), predicate pushdown (menerapkan filter sedini mungkin), column pruning (hanya membaca kolom yang dibutuhkan), pemilihan urutan join yang tepat, dan penggunaan index yang sesuai. Perintah EXPLAIN (atau EXPLAIN ANALYZE) adalah alat diagnosa utama untuk memahami bagaimana sebenarnya database engine mengeksekusi sebuah kueri, sehingga engineer bisa mengidentifikasi bottleneck secara berbasis bukti, bukan tebakan.",
      en: "",
    },
    concept: {
      id: "Bayangkan EXPLAIN seperti GPS yang menunjukkan rute yang sebenarnya diambil kendaraan pengiriman, bukan rute yang Anda kira akan diambil. Anda mungkin berpikir kurir akan lewat jalan tol yang cepat, tapi ternyata GPS menunjukkan dia terjebak lewat jalan kampung yang berputar-putar (misalnya karena scan seluruh tabel padahal ada index yang harusnya dipakai). Dengan melihat rute sebenarnya, Anda bisa memperbaiki instruksi rute (menambah index, mengubah urutan join) supaya perjalanan berikutnya lebih cepat.",
      en: "",
    },
    methodology: {
      id: "Proses optimasi kueri bersifat iteratif dan berbasis bukti. Dimulai dengan menulis kueri, lalu menjalankan EXPLAIN ANALYZE untuk melihat rencana eksekusi (query plan) yang sebenarnya dijalankan mesin database, termasuk berapa baris yang diproses di tiap tahap dan berapa lama waktunya. Dari plan ini, engineer mengidentifikasi bottleneck: jika ditemukan 'Seq Scan' (pemindaian seluruh tabel) pada tabel besar padahal hanya sebagian kecil baris yang dibutuhkan, solusinya adalah menambah index pada kolom filter tersebut. Jika ditemukan full partition scan padahal tabel sudah dipartisi, solusinya adalah menambahkan klausa WHERE yang memfilter berdasarkan kolom partisi agar partition pruning bekerja. Jika ditemukan nested loop join pada dataset yang besar (yang kompleksitasnya kuadratik), solusinya adalah mengarahkan optimizer memakai hash join yang lebih efisien untuk data besar. Setelah optimasi diterapkan, kueri diukur ulang, dan proses ini diulang sampai performa memuaskan.",
      en: "",
    },
    objective: {
      id: "Tanpa optimasi kueri yang sadar biaya, sistem data modern — terutama data warehouse berbasis bayar-per-byte-yang-dipindai seperti BigQuery — bisa membengkakkan biaya operasional secara drastis dan membuat pengguna dashboard menunggu lama tanpa alasan yang jelas. Banyak masalah performa sebenarnya berakar dari kueri yang ditulis tanpa mempertimbangkan bagaimana mesin database benar-benar mengeksekusinya, bukan dari keterbatasan hardware. EXPLAIN memberi visibility yang dibutuhkan untuk membedakan masalah desain kueri dari masalah infrastruktur.",
      en: "",
    },
    goal: {
      id: "Kueri yang sebelumnya lambat dan mahal bisa dipangkas waktu eksekusi dan biaya pemrosesannya secara signifikan — sering kali penghematan puluhan hingga ratusan persen — dengan perubahan yang tertarget berdasarkan bukti dari query plan, bukan optimasi coba-coba tanpa dasar.",
      en: "",
    },
    exampleImplementation: {
      id: "Alur diagnosa dan optimasi kueri yang khas:\n\n1. **Write Query** — kueri awal ditulis untuk laporan transaksi bulanan.\n2. **EXPLAIN ANALYZE** — dijalankan untuk melihat plan eksekusi aktual.\n3. **Identify bottleneck** — ditemukan bahwa kueri memindai seluruh tabel meski hanya butuh data bulan tertentu.\n4. **Optimize** — menambahkan filter partisi dan index yang sesuai.\n5. **Measure** — menjalankan ulang EXPLAIN ANALYZE untuk membandingkan.\n6. **Iterate** — mengulangi sampai performa memadai.\n\nContoh sebelum dan sesudah optimasi di BigQuery:\n\n```sql\n-- Sebelum: memindai seluruh tabel, mahal\nSELECT customer_id, SUM(amount)\nFROM transactions\nGROUP BY customer_id;\n\n-- Sesudah: partition pruning + join ke tabel kecil dulu\nSELECT t.customer_id, SUM(t.amount)\nFROM transactions t\nJOIN active_customers ac ON t.customer_id = ac.customer_id\nWHERE t.transaction_date >= '2024-01-01'\nGROUP BY t.customer_id;\n```\n\nMenambahkan filter `WHERE date >= '2024-01'` pada tabel yang dipartisi berdasarkan tanggal bisa menghemat hingga 95% byte yang dipindai, karena mesin kueri melewati partisi-partisi lama sepenuhnya.",
      en: "",
    },
    exampleEnterprise: {
      id: "Toko Meta Retail menjalankan laporan penjualan bulanan di BigQuery yang awalnya memindai seluruh histori transaksi lima tahun terakhir setiap kali dijalankan, menghabiskan biaya pemrosesan data yang signifikan setiap bulan. Setelah tim data engineering menganalisis query plan dan menemukan bahwa filter tanggal tidak diterapkan sedini mungkin, mereka menambahkan klausa WHERE yang memanfaatkan partition pruning dan mengubah urutan join agar tabel kecil (daftar pelanggan aktif) diproses lebih dulu sebelum join ke tabel transaksi besar. Hasilnya, byte yang dipindai turun 95% dan biaya bulanan untuk laporan tersebut berkurang drastis, tanpa mengubah hasil akhir laporan sama sekali.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Bisa menghasilkan penghematan biaya dan waktu eksekusi yang sangat besar dengan perubahan kueri yang relatif kecil\n- EXPLAIN memberi bukti objektif untuk mendiagnosa masalah, menghindari optimasi berbasis tebakan\n- Sering tidak butuh perubahan infrastruktur — cukup menulis ulang kueri atau menambah index\n- Kemampuan ini bisa diterapkan berulang di seluruh basis kode kueri organisasi, dampaknya bersifat compounding",
        en: "",
      },
      cons: {
        id: "- Membaca dan menginterpretasi query plan butuh keahlian khusus yang tidak semua engineer punya\n- Optimasi berbasis EXPLAIN pada satu mesin database (misalnya PostgreSQL) belum tentu berlaku sama di mesin lain (misalnya BigQuery)\n- Menambah index untuk mempercepat SELECT bisa memperlambat operasi INSERT/UPDATE, butuh trade-off yang dipertimbangkan\n- Query plan bisa berubah seiring pertumbuhan data, sehingga optimasi yang berhasil hari ini bisa jadi tidak optimal lagi di masa depan",
        en: "",
      },
    },
  },
};
