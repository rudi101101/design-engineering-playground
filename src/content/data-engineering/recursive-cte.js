export const term = {
  id: "recursive-cte",
  track: "data-engineering",
  category: "Advanced SQL",
  color: "#06b6d4",
  icon: "M4 6h16M4 12h16M4 18h7",
  simulation: "recursive",
  tools: ["PostgreSQL", "BigQuery", "Snowflake", "MySQL 8+", "SQL Server"],
  prerequisites: ["cte"],
  related: ["lateral-join"],
  name: { id: "Recursive CTE", en: "Recursive CTE" },
  content: {
    description: {
      id: "Recursive CTE adalah Common Table Expression yang mereferensikan dirinya sendiri, memungkinkan SQL menelusuri struktur hierarkis atau graph seperti org chart, category tree, atau jaringan dealer bertingkat, dalam satu query tunggal. Tanpa recursive CTE, menelusuri struktur berjenjang yang kedalamannya tidak diketahui di awal (misalnya 5 level ke bawah, atau bahkan tidak terbatas) biasanya butuh loop di level aplikasi atau query terpisah untuk setiap level — recursive CTE memungkinkan seluruh penelusuran dilakukan murni di database.",
      en: "",
    },
    concept: {
      id: "Bayangkan recursive CTE seperti instruksi origami berulang: 'lipat kertas ini, lalu ulangi instruksi yang sama pada hasil lipatan tadi, sampai tidak ada lagi yang bisa dilipat.' Setiap putaran menghasilkan bentuk baru yang jadi bahan untuk putaran berikutnya, dan proses berhenti sendiri ketika tidak ada lagi yang bisa diproses — persis seperti recursive CTE yang terus 'melipat' hasil query ke dirinya sendiri sampai tidak ada baris baru yang dihasilkan.",
      en: "",
    },
    methodology: {
      id: "Recursive CTE terdiri dari dua bagian yang digabung dengan UNION ALL. Anchor member adalah base case — biasanya query yang mengambil baris akar (root nodes), misalnya dealer paling atas tanpa parent. Recursive member adalah query yang men-join CTE ke dirinya sendiri untuk mengambil level berikutnya, menggunakan hasil dari iterasi sebelumnya sebagai input. Proses ini berulang secara otomatis: setiap iterasi menghasilkan baris baru yang jadi input iterasi berikutnya, dan terminasi terjadi secara alami ketika iterasi tidak lagi menghasilkan baris baru (misalnya sudah sampai ke level daun/leaf node yang tidak punya anak).",
      en: "",
    },
    objective: {
      id: "Recursive CTE ada untuk menangani data yang secara natural berbentuk hierarki atau graph dengan kedalaman yang bisa bervariasi atau tidak diketahui sebelumnya — struktur org chart yang bisa punya 3 level di satu divisi dan 7 level di divisi lain, misalnya. Pendekatan non-recursive seperti self-join berulang untuk setiap level fixed jumlahnya dan tidak fleksibel terhadap kedalaman yang bervariasi.",
      en: "",
    },
    goal: {
      id: "Hasilnya adalah kemampuan menelusuri seluruh hierarki atau graph dalam satu query SQL tunggal, tanpa perlu logika loop di level aplikasi atau mengetahui kedalaman struktur di awal — database secara otomatis berhenti ketika seluruh cabang sudah ditelusuri sampai ke ujungnya.",
      en: "",
    },
    exampleImplementation: {
      id: "Skenario: menelusuri semua sub-dealer di bawah satu dealer utama, berapa pun level kedalamannya.\n\n1. Anchor member mengambil dealer akar yang ingin ditelusuri.\n2. Recursive member mencari dealer yang parent_id-nya cocok dengan dealer di level sebelumnya.\n3. Proses berulang sampai tidak ada lagi sub-dealer yang ditemukan.\n\n```sql\nWITH RECURSIVE hierarki_dealer AS (\n  -- Anchor: dealer akar\n  SELECT dealer_id, nama, parent_id, 1 AS level\n  FROM dealer\n  WHERE dealer_id = 'DLR-001'\n\n  UNION ALL\n\n  -- Recursive: cari sub-dealer di level berikutnya\n  SELECT d.dealer_id, d.nama, d.parent_id, hd.level + 1\n  FROM dealer d\n  JOIN hierarki_dealer hd ON d.parent_id = hd.dealer_id\n)\nSELECT * FROM hierarki_dealer ORDER BY level;\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "PT Nusantara Logistik memiliki jaringan mitra distribusi berjenjang dengan struktur dealer utama, sub-dealer, dan sub-sub-dealer hingga 5 level ke bawah. Untuk menghitung total penjualan yang mengalir dari satu dealer utama beserta seluruh jaringan di bawahnya, tim data engineering menulis satu recursive CTE yang menelusuri seluruh hierarki dealer X tanpa perlu tahu di awal berapa level kedalaman jaringan tersebut — query yang sama bekerja baik untuk dealer dengan 2 level maupun 5 level sub-dealer.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Mampu menelusuri hierarki atau graph dengan kedalaman tidak terbatas dalam satu query tunggal tanpa loop di aplikasi\n- Lebih deklaratif dan mudah dibaca dibanding logika traversal manual yang ditulis di kode aplikasi\n- Bekerja konsisten baik untuk struktur dangkal maupun sangat dalam tanpa perlu mengubah query\n- Didukung luas oleh database modern termasuk PostgreSQL, BigQuery, dan Snowflake",
        en: "",
      },
      cons: {
        id: "- Berisiko infinite loop jika data punya siklus (misalnya A adalah parent B, B adalah parent A) tanpa deteksi siklus eksplisit\n- Bisa menjadi lambat pada hierarki yang sangat dalam atau lebar karena setiap iterasi menambah beban komputasi\n- Sintaksnya kurang intuitif bagi yang belum terbiasa berpikir secara rekursif dalam SQL\n- Debugging query recursive CTE yang salah lebih sulit dibanding query SQL biasa karena sifatnya iteratif tersembunyi",
        en: "",
      },
    },
  },
};
