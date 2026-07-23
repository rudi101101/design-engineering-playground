export const term = {
  id: "cte",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#c4b5fd",
  icon: "M4 6h16M4 12h16M4 18h7",
  simulation: "cte",
  tools: ["PostgreSQL", "BigQuery", "Snowflake", "MySQL 8+", "SQL Server"],
  prerequisites: [],
  related: ["recursive-cte", "lateral-join"],
  name: { id: "CTE — Common Table Expression", en: "" },
  content: {
    description: {
      id: "**CTE (Common Table Expression)** adalah hasil query bernama sementara yang didefinisikan menggunakan klausa `WITH`, dan bisa dirujuk berkali-kali di dalam query utama yang sama seolah-olah ia adalah tabel biasa. CTE membuat query kompleks yang biasanya penuh subquery bersarang menjadi **jauh lebih terbaca**, karena logika bisa dipecah jadi langkah-langkah bernama yang mengalir secara linear dari atas ke bawah. Selain versi biasa, ada juga **Recursive CTE** yang secara khusus dipakai untuk data hierarkis atau bertingkat, seperti struktur organisasi atau kategori bertingkat, di mana query perlu memanggil dirinya sendiri berulang kali sampai kondisi tertentu terpenuhi.",
      en: "",
    },
    concept: {
      id: "*Bayangkan* menulis query kompleks tanpa CTE seperti menulis satu kalimat panjang bertele-tele dengan banyak anak kalimat bersarang di dalamnya — sulit dibaca karena kamu harus terus melacak konteks mana yang sedang dibicarakan. CTE seperti memecah kalimat panjang itu menjadi beberapa kalimat pendek yang masing-masing punya **nama jelas**: \"Pertama, definisikan A. Lalu, pakai A untuk hitung B. Terakhir, gabungkan A dan B.\" Setiap langkah punya nama sendiri yang bisa dirujuk balik, jadi alur logikanya jauh lebih mudah diikuti pembaca lain, bahkan diri kamu sendiri enam bulan kemudian.",
      en: "",
    },
    methodology: {
      id: "Klausa `WITH nama_cte AS (SELECT ...)` mendefinisikan sebuah CTE — database membaca definisi query ini sekali, lalu hasilnya bisa dirujuk berkali-kali di query utama menggunakan nama yang sudah didefinisikan, mirip seperti tabel sungguhan meski sebenarnya hanya berlaku selama eksekusi query itu. Untuk kasus data hierarkis, Recursive CTE bekerja dengan pola **\"anchor member UNION ALL recursive member\"**: *anchor member* adalah query awal yang mendefinisikan titik mulai (misalnya baris root di sebuah hierarki), sementara *recursive member* merujuk kembali ke CTE itu sendiri untuk terus mengambil level berikutnya, berulang sampai **tidak ada lagi baris baru** yang dihasilkan (kondisi berhenti otomatis tercapai).",
      en: "",
    },
    objective: {
      id: "CTE dibutuhkan karena query analitik dan pipeline transformasi data sering melibatkan **banyak tahap perhitungan berurutan** — filter, agregasi, join — yang kalau ditulis sebagai subquery bersarang jadi sangat sulit dibaca dan dipelihara. CTE memberi struktur yang lebih **deklaratif dan modular**, memisahkan tiap tahap logika jadi blok bernama yang jelas maksudnya, sekaligus membuka kemungkinan menangani data hierarkis lewat rekursi yang tidak bisa dilakukan dengan SQL biasa tanpa CTE.",
      en: "",
    },
    goal: {
      id: "Tujuannya adalah query kompleks yang **lebih terbaca dan mudah dipelihara** dibanding subquery bersarang, sekaligus membuka kemampuan menangani struktur data hierarkis atau bertingkat lewat Recursive CTE yang sebelumnya sulit atau *tidak mungkin* diekspresikan dalam SQL standar non-rekursif.",
      en: "",
    },
    exampleImplementation: {
      id: "Menggunakan CTE untuk memecah query agregasi bulanan menjadi langkah yang lebih terbaca, lalu memfilter hasilnya di query utama.\n\n1. Definisikan CTE `monthly` yang menghitung **total klaim per bulan**.\n2. Query utama merujuk CTE tersebut seperti tabel biasa untuk filter lebih lanjut.\n\n```sql\nWITH monthly AS (\n  SELECT DATE_TRUNC('month', created_at) AS bulan,\n         SUM(jumlah_klaim) AS total_klaim\n  FROM klaim\n  GROUP BY DATE_TRUNC('month', created_at)\n)\nSELECT bulan, total_klaim\nFROM monthly\nWHERE total_klaim > 1000000000;\n\n-- Recursive CTE untuk struktur organisasi bertingkat\nWITH RECURSIVE hierarki AS (\n  SELECT id, nama, manager_id, 1 AS level\n  FROM karyawan\n  WHERE manager_id IS NULL  -- anchor: root/direktur\n  UNION ALL\n  SELECT k.id, k.nama, k.manager_id, h.level + 1\n  FROM karyawan k\n  JOIN hierarki h ON k.manager_id = h.id  -- recursive member\n)\nSELECT * FROM hierarki ORDER BY level;\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Tim analitik di PT Nusantara Asuransi rutin membuat laporan klaim bulanan yang butuh beberapa tahap perhitungan: agregasi per bulan, lalu filter bulan-bulan dengan nilai klaim di atas ambang batas tertentu, lalu join dengan data referensi lain. Sebelum memakai CTE, query ini ditulis sebagai **subquery bersarang tiga tingkat** yang sangat sulit dibaca ulang oleh anggota tim baru. Setelah direfaktor memakai `WITH monthly AS (...)`, query jadi mengalir sebagai langkah-langkah bernama yang jelas maksudnya, dan waktu onboarding anggota tim baru untuk memahami query analitik inti mereka **berkurang signifikan**.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Membuat query kompleks **jauh lebih terbaca** dibanding subquery bersarang berlapis-lapis\n- Bisa dirujuk berkali-kali dalam query yang sama tanpa perlu menulis ulang definisinya\n- **Recursive CTE** membuka kemampuan menangani data hierarkis/graph yang sulit diekspresikan dengan SQL non-rekursif\n- Memecah logika kompleks jadi blok-blok bernama memudahkan *debugging bertahap*, bisa dicek hasil tiap CTE secara terpisah",
        en: "",
      },
      cons: {
        id: "- Di beberapa database (versi lama PostgreSQL), CTE dieksekusi sebagai **optimization fence** sehingga planner tidak bisa mengoptimalkan lintas batas CTE, berpotensi lebih lambat dari subquery biasa\n- Recursive CTE tanpa kondisi berhenti yang jelas **berisiko infinite loop** pada data yang punya siklus (circular reference)\n- Tidak semua database punya dukungan CTE yang setara, terutama versi database lama\n- CTE yang dirujuk berkali-kali bisa saja dihitung ulang tiap referensi tergantung optimizer, tidak selalu otomatis di-cache",
        en: "",
      },
    },
  },
};
