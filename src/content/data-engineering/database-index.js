export const term = {
  id: "database-index",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#fbbf24",
  icon: "M18 20V10M12 20V4M6 20v-6",
  simulation: "btree",
  tools: ["PostgreSQL", "MySQL", "BigQuery Clustering", "MongoDB", "Elasticsearch"],
  prerequisites: [],
  related: ["cardinality", "query-optimization-explain"],
  name: { id: "Index — B-tree, Hash, Bitmap, GiST", en: "Index — B-tree, Hash, Bitmap, GiST" },
  content: {
    description: {
      id: "**Index** adalah struktur data tambahan yang dibangun di samping tabel untuk mempercepat proses pencarian data, tanpa harus melakukan *full table scan* yang membaca setiap baris satu per satu. Ada beberapa tipe index dengan karakteristik berbeda: **B-tree** cocok untuk pencarian range dan equality secara umum, **Hash** hanya untuk pencocokan *exact-match*, **Bitmap** efektif untuk kolom dengan cardinality rendah, dan **GiST** untuk data khusus seperti geospasial atau full-text. Pemilihan tipe index yang tepat berdampak besar pada performa query database.",
      en: "",
    },
    concept: {
      id: "*Bayangkan* index seperti daftar isi di buku tebal. Tanpa daftar isi, kamu harus membuka halaman satu per satu untuk mencari topik tertentu (*full table scan*). Dengan daftar isi (**B-tree index**), kamu langsung tahu topik itu ada di halaman berapa. **Bitmap index** mirip seperti checklist warna pada peta — cocok kalau kategorinya sedikit (misalnya cuma 5 status), karena kamu bisa langsung menggabungkan beberapa 'lapisan warna' sekaligus dengan cepat.",
      en: "",
    },
    methodology: {
      id: "B-tree menyusun data dalam struktur pohon seimbang (*balanced tree*) sehingga pencarian, penyisipan, dan range query bisa dilakukan dalam kompleksitas **O(log n)**. Hash index menggunakan hash table sehingga pencarian equality bisa mendekati **O(1)**, tapi tidak mendukung range query. Bitmap index menyimpan 1 bit per baris untuk setiap nilai unik suatu kolom, sangat efisien saat cardinality rendah karena operasi AND/OR antar bitmap sangat cepat secara bitwise. GiST (Generalized Search Tree) adalah struktur index yang **dapat diperluas** (*extensible*) untuk tipe data kompleks seperti polygon geospasial atau pencarian kemiripan. Setiap kali data di-INSERT atau di-UPDATE, database juga **harus** memperbarui index terkait, yang menambah sedikit overhead penulisan.",
      en: "",
    },
    objective: {
      id: "Index diciptakan untuk mengatasi masalah mendasar: mencari data di tabel besar tanpa struktur bantu berarti database harus memindai **seluruh baris** (*linear scan*), yang menjadi **sangat lambat** seiring pertumbuhan data. Index memberikan jalan pintas terstruktur sehingga query yang sering dijalankan bisa berjalan jauh lebih cepat, terutama untuk filter (WHERE), join, dan sorting (ORDER BY).",
      en: "",
    },
    goal: {
      id: "Hasil yang dicapai adalah waktu eksekusi query yang **turun drastis** dari O(n) menjadi O(log n) untuk kolom yang di-index dengan tepat, dengan trade-off tambahan waktu penulisan dan ruang penyimpanan yang harus dijaga seimbang sesuai pola akses data.",
      en: "",
    },
    exampleImplementation: {
      id: "Contoh pemilihan index sesuai karakteristik kolom:\n\n1. Kolom dengan banyak nilai unik dan sering di-range query (misal tanggal transaksi) → gunakan **B-tree**.\n2. Kolom dengan sedikit nilai unik (misal status pesanan: pending/paid/shipped) → pertimbangkan **bitmap index**.\n3. Kolom yang hanya butuh exact match, bukan range → hash index bisa lebih efisien.\n\n```sql\n-- B-tree index untuk range query tanggal\nCREATE INDEX idx_order_date ON orders (order_date);\n\n-- Query yang memanfaatkan index tersebut\nEXPLAIN SELECT * FROM orders\nWHERE order_date BETWEEN '2026-01-01' AND '2026-01-31';\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Toko Meta Retail memiliki tabel transaksi dengan **puluhan juta baris**. Tim data engineering membuat B-tree index pada kolom claim_date sehingga laporan penjualan bulanan yang sebelumnya butuh belasan detik kini selesai dalam **hitungan milidetik**. Untuk kolom status pembayaran yang hanya memiliki **5 nilai kemungkinan**, mereka memakai bitmap index sehingga query filter gabungan seperti status IN ('pending', 'failed') bisa memanfaatkan operasi bitwise yang sangat cepat.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- **Mempercepat** query SELECT, JOIN, dan ORDER BY secara signifikan pada kolom yang tepat\n- B-tree mendukung range query dan equality sekaligus, sangat serbaguna\n- Bitmap index sangat efisien untuk kolom cardinality rendah dan kombinasi filter\n- Query planner bisa memilih index terbaik secara **otomatis** berdasarkan statistik data",
        en: "",
      },
      cons: {
        id: "- Menambah overhead setiap kali INSERT/UPDATE/DELETE karena index **harus ikut diperbarui**\n- Memakan ruang penyimpanan tambahan, bisa signifikan untuk tabel besar dengan banyak index\n- Index yang salah pilih (misal hash untuk kebutuhan range query) **tidak akan terpakai** optimizer\n- Terlalu banyak index justru memperlambat *write-heavy workload* dan menyulitkan maintenance",
        en: "",
      },
    },
  },
};
