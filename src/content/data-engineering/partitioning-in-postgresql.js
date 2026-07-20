export const term = {
  id: "partitioning-in-postgresql",
  track: "data-engineering",
  category: "Advanced SQL",
  color: "#14b8a6",
  icon: "M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z",
  simulation: "pgpartition",
  tools: ["PostgreSQL", "MySQL", "Oracle", "SQL Server", "MariaDB"],
  prerequisites: ["partitioning"],
  related: ["partitioning-in-bigquery-style", "clustering-sorting"],
  name: { id: "Partitioning in PostgreSQL", en: "Partitioning in PostgreSQL" },
  content: {
    description: {
      id: "Partitioning di PostgreSQL adalah kemampuan native (sejak versi 10) untuk membagi satu tabel logis menjadi beberapa tabel fisik (child partition) berdasarkan aturan tertentu, sambil tetap terlihat sebagai satu tabel dari sisi aplikasi yang melakukan query. PostgreSQL mendukung tiga strategi utama: RANGE (berdasarkan rentang nilai, misalnya tanggal), LIST (berdasarkan daftar nilai diskret, misalnya kode region), dan HASH (berdasarkan hash nilai untuk distribusi merata). Manfaat terbesarnya adalah query pruning otomatis — PostgreSQL cukup pintar untuk hanya membaca partition yang relevan dengan filter WHERE, mengabaikan sisanya sama sekali.",
      en: "",
    },
    concept: {
      id: "Bayangkan partitioning seperti lemari arsip kantor yang dibagi per tahun, bukan satu tumpukan raksasa berisi arsip dari semua tahun sekaligus. Kalau kamu butuh dokumen tahun 2024, kamu langsung buka laci 2024 tanpa perlu menggeledah laci 2020 sampai 2023 — jauh lebih cepat. Dan kalau arsip tahun 2020 sudah tidak diperlukan lagi, kamu tinggal buang seluruh laci 2020 sekaligus, tanpa harus mencabut dokumen satu per satu dari tumpukan besar.",
      en: "",
    },
    methodology: {
      id: "PostgreSQL menggunakan declarative partitioning: kamu membuat tabel induk (parent) dengan klausa PARTITION BY, lalu membuat tabel anak (child) yang masing-masing menampung rentang atau daftar nilai tertentu lewat klausa FOR VALUES. Setiap INSERT ke tabel induk otomatis dirutekan ke child partition yang sesuai berdasarkan nilai kolom partisi. Index dibuat per child partition secara independen, dan yang paling penting, saat query menyertakan filter WHERE pada kolom partisi, PostgreSQL secara otomatis melakukan pruning — hanya membaca partition yang cocok dengan filter, mengabaikan partition lain sepenuhnya tanpa harus melakukan scan di dalamnya.",
      en: "",
    },
    objective: {
      id: "Partitioning ada untuk mengatasi masalah tabel yang tumbuh sangat besar seiring waktu, di mana query dan maintenance (seperti VACUUM, index rebuild, atau penghapusan data lama) menjadi semakin lambat karena harus memproses seluruh tabel. Tanpa partitioning, menghapus data lama dari tabel besar berarti operasi DELETE yang mahal dan memakan waktu lama serta membebani sistem; dengan partitioning, seluruh partition bisa langsung di-drop tanpa perlu scan baris satu per satu.",
      en: "",
    },
    goal: {
      id: "Hasilnya adalah query yang jauh lebih cepat karena hanya membaca partition yang relevan (bukan seluruh tabel), operasi maintenance yang lebih ringan karena bisa dilakukan per partition, dan penghapusan data lama yang instan lewat DROP partition alih-alih DELETE massal yang lambat dan membebani sistem.",
      en: "",
    },
    exampleImplementation: {
      id: "Skenario: mempartisi tabel klaim berdasarkan tahun agar query dan maintenance lebih efisien.\n\n1. Buat tabel induk dengan PARTITION BY RANGE pada kolom tanggal.\n2. Buat child partition untuk setiap rentang tahun.\n3. INSERT ke tabel induk otomatis dirutekan ke child yang sesuai.\n4. Query dengan filter tanggal otomatis hanya membaca partition yang relevan.\n\n```sql\nCREATE TABLE tabel_klaim (\n  klaim_id BIGINT,\n  tanggal DATE NOT NULL,\n  jumlah NUMERIC\n) PARTITION BY RANGE (tanggal);\n\nCREATE TABLE klaim_2023 PARTITION OF tabel_klaim\n  FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');\nCREATE TABLE klaim_2024 PARTITION OF tabel_klaim\n  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');\n\n-- Hapus data 2023 secara instan tanpa DELETE scan\nDROP TABLE klaim_2023;\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Klinika Sehat memiliki tabel klaim dengan jutaan baris yang terus bertambah setiap tahun, dan laporan finansial mereka membutuhkan query yang cepat pada rentang tanggal tertentu. Dengan mempartisi tabel_klaim berdasarkan RANGE(tanggal) menjadi klaim_2023, klaim_2024, dan klaim_2025, tim data engineering bisa menghapus data klaim tahun-tahun lama sesuai kebijakan retensi cukup dengan DROP TABLE pada partition yang bersangkutan — instan, tanpa perlu menjalankan operasi DELETE yang bisa memakan waktu berjam-jam dan mengunci tabel pada pendekatan tabel monolitik sebelumnya.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Query pruning otomatis membuat query dengan filter pada kolom partisi jauh lebih cepat karena hanya membaca partition relevan\n- Penghapusan data lama menjadi instan lewat DROP partition, jauh lebih ringan dibanding DELETE massal\n- Operasi maintenance seperti VACUUM dan index rebuild bisa dilakukan per partition, mengurangi beban sekaligus\n- Mendukung tiga strategi (RANGE, LIST, HASH) yang fleksibel sesuai pola data dan kebutuhan query",
        en: "",
      },
      cons: {
        id: "- Desain partition key yang salah bisa membuat query tanpa filter pada kolom partisi tetap harus scan semua partition\n- Menambah kompleksitas skema karena harus mengelola pembuatan child partition baru secara berkala (misalnya partition tahun baru)\n- Constraint unik dan foreign key punya keterbatasan tertentu pada tabel yang dipartisi di PostgreSQL\n- Migrasi dari tabel non-partitioned ke partitioned pada tabel yang sudah besar butuh perencanaan matang agar tidak mengganggu produksi",
        en: "",
      },
    },
  },
};
