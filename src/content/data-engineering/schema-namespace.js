export const term = {
  id: "schema-namespace",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#ddd6fe",
  icon: "M2 2h20v8H2zM2 14h20v8H2z",
  simulation: "schema_ns",
  tools: ["PostgreSQL", "MySQL", "BigQuery (dataset)", "Oracle", "Snowflake"],
  prerequisites: [],
  related: ["rbac-column-row-level-security"],
  name: { id: "Schema & Namespace", en: "" },
  content: {
    description: {
      id: "Schema adalah namespace logis yang dipakai untuk mengelompokkan dan mengorganisasi objek-objek database — tabel, view, function, dan lainnya — di dalam satu database fisik. Dengan schema, kamu bisa memisahkan objek berdasarkan tujuan atau tahap pemrosesan data (misalnya data mentah vs data yang sudah diproses) tanpa perlu membuat database fisik terpisah, sekaligus mengatur akses (grant/revoke) secara granular per schema. Ini jadi fondasi penting untuk organisasi data warehouse modern yang biasanya memisahkan data ke beberapa lapisan bernama sesuai fungsinya.",
      en: "",
    },
    concept: {
      id: "Bayangkan sebuah database seperti satu gedung kantor besar, dan schema seperti lantai-lantai berbeda di dalamnya yang masing-masing punya fungsi spesifik — lantai dasar untuk penerimaan barang mentah (raw), lantai tengah untuk area pemrosesan (staging), dan lantai atas untuk ruang pamer hasil jadi yang siap dilihat tamu (mart/analytics). Setiap lantai bisa punya aturan akses berbeda — staf gudang boleh masuk lantai dasar tapi tidak lantai atas, sementara tamu eksekutif hanya diizinkan masuk lantai atas — tanpa perlu membangun gedung terpisah untuk tiap fungsi.",
      en: "",
    },
    methodology: {
      id: "Schema dibuat dengan `CREATE SCHEMA nama_schema`, lalu objek seperti tabel dibuat di dalamnya dengan notasi `nama_schema.nama_tabel`. Kontrol akses diberikan secara granular per schema lewat `GRANT`/`REVOKE`, misalnya memberi akses SELECT pada schema `analytics` ke role tertentu tanpa memberi akses ke schema `raw` yang berisi data mentah sensitif. Konvensi penamaan umum di data warehouse memakai lapisan seperti `raw` (data mentah apa adanya dari sumber), `staging` (data yang sudah dibersihkan sebagian, tahap transisi), dan `mart` (data yang sudah difinalisasi dan siap dikonsumsi oleh laporan/dashboard). Di BigQuery, konsep yang setara dengan schema adalah dataset, sementara di database lain istilahnya konsisten memakai kata schema.",
      en: "",
    },
    objective: {
      id: "Schema dibutuhkan karena tanpa pemisahan namespace yang jelas, database besar dengan ratusan atau ribuan tabel dari berbagai sumber dan tahap pemrosesan akan jadi berantakan dan sulit dikelola — sulit membedakan mana tabel mentah, mana yang sudah divalidasi, dan sulit menerapkan kontrol akses yang berbeda-beda sesuai sensitivitas data di tiap tahap.",
      en: "",
    },
    goal: {
      id: "Tujuannya adalah organisasi database yang rapi dan terstruktur berdasarkan tahap pemrosesan atau fungsi data, dengan kontrol akses yang bisa diterapkan secara granular per schema, sehingga tim yang berbeda hanya bisa mengakses lapisan data yang memang relevan dan aman untuk peran mereka.",
      en: "",
    },
    exampleImplementation: {
      id: "Mengorganisasi database dengan tiga lapisan schema sesuai tahap pemrosesan data, plus kontrol akses per schema.\n\n1. Buat schema untuk tiap lapisan: raw, staging, mart.\n2. Buat tabel di dalam schema yang sesuai.\n3. Berikan akses berbeda ke role berbeda per schema.\n\n```sql\nCREATE SCHEMA raw;\nCREATE SCHEMA staging;\nCREATE SCHEMA analytics;\n\nCREATE TABLE raw.klaim_mentah (...);\nCREATE TABLE staging.klaim_bersih (...);\nCREATE TABLE analytics.agregasi_klaim (...);\n\n-- Analyst hanya boleh baca schema analytics, tidak boleh sentuh raw\nGRANT SELECT ON SCHEMA analytics TO analyst_role;\nGRANT USAGE ON SCHEMA analytics TO analyst_role;\nREVOKE ALL ON SCHEMA raw FROM analyst_role;\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "PT Nusantara Asuransi mengorganisasi data warehouse mereka di PostgreSQL menjadi tiga schema: `raw` yang berisi salinan data klaim persis seperti yang datang dari sistem sumber, `staging` yang berisi data yang sudah dibersihkan dan divalidasi sebagian, dan `mart` yang berisi tabel agregasi siap pakai untuk dashboard tim eksekutif. Tim analis bisnis hanya diberi akses SELECT ke schema `mart`, sehingga mereka tidak pernah berisiko melihat data mentah yang belum divalidasi atau mengganggu proses transformasi yang sedang berjalan di schema `staging`, sementara tim data engineering yang mengelola pipeline punya akses penuh ke ketiga lapisan.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Memisahkan objek database secara logis berdasarkan fungsi atau tahap pemrosesan tanpa perlu database fisik terpisah\n- Memungkinkan kontrol akses granular per schema, membatasi paparan data sensitif hanya ke role yang memang membutuhkan\n- Konvensi penamaan layer (raw/staging/mart) memberi struktur yang jelas dan mudah dipahami tim baru\n- Memudahkan pengelolaan banyak objek database dalam skala besar tanpa nama tabel yang saling bentrok",
        en: "",
      },
      cons: {
        id: "- Terlalu banyak schema tanpa konvensi yang konsisten bisa membuat navigasi database justru makin membingungkan\n- Query lintas schema butuh penulisan nama lengkap (`schema.tabel`) yang lebih verbose dibanding satu schema default\n- Kontrol akses per schema butuh disiplin pengelolaan grant/revoke yang konsisten, kalau tidak bisa jadi celah keamanan\n- Terminologi berbeda antar platform (schema di PostgreSQL vs dataset di BigQuery) bisa membingungkan tim yang bekerja lintas platform",
        en: "",
      },
    },
  },
};
