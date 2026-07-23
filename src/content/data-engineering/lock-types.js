export const term = {
  id: "lock-types",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#6ee7b7",
  icon: "M3 11l19-9-9 19-2-8-8-2z",
  simulation: "locks",
  tools: ["PostgreSQL", "MySQL", "Oracle", "SQL Server", "MariaDB"],
  prerequisites: [],
  related: ["deadlock", "mvcc"],
  name: { id: "Lock Types", en: "" },
  content: {
    description: {
      id: "Lock adalah mekanisme yang dipakai database untuk mengendalikan akses konkuren ke data yang sama, mencegah dua transaction saling menimpa perubahan satu sama lain. Ada dua jenis dasar: **shared lock (S)**, yang mengizinkan banyak transaction membaca data yang sama secara bersamaan tapi melarang penulisan, dan **exclusive lock (X)**, yang hanya mengizinkan satu transaction untuk membaca sekaligus menulis, sambil memblokir transaction lain sepenuhnya. Lock juga punya granularitas berbeda — **row-level lock** mengunci satu baris spesifik (halus, minim gangguan ke baris lain), sedangkan **table-level lock** mengunci seluruh tabel (kasar, tapi kadang perlu untuk operasi struktural seperti DDL).",
      en: "",
    },
    concept: {
      id: "Bayangkan shared lock *seperti buku di perpustakaan* yang boleh dibaca banyak orang sekaligus — semua orang boleh pinjam untuk baca di tempat, tapi **tidak ada yang boleh mencoret-coret isinya** selama masih ada yang membaca. Exclusive lock seperti buku yang sedang dipinjam pulang oleh satu orang untuk direvisi total — selama itu, **tidak ada orang lain yang boleh pinjam** untuk baca maupun edit, sampai orang itu mengembalikannya. Row lock seperti mengunci satu laci arsip spesifik, sementara table lock seperti mengunci seluruh lemari arsip — yang terakhir **jauh lebih mengganggu** karena semua orang yang butuh laci lain pun ikut terblokir.",
      en: "",
    },
    methodology: {
      id: "Kompatibilitas antar lock mengikuti aturan sederhana: dua shared lock (S+S) kompatibel dan bisa berjalan bersamaan, tapi shared dengan exclusive (S+X) atau exclusive dengan exclusive (X+X) **tidak kompatibel dan salah satunya harus menunggu**. Ketika sebuah transaction meminta lock, lock manager database mengecek kompatibilitas dengan lock yang sudah dipegang transaction lain: jika kompatibel, lock langsung diberikan; jika tidak, transaction yang meminta harus menunggu sampai lock yang menghalangi dilepas, dengan risiko timeout atau bahkan **deadlock** jika dua transaction saling menunggu satu sama lain. Dalam praktiknya, **row lock lebih disukai** karena minim gangguan terhadap konkurensi, sementara table lock biasanya hanya dipakai untuk operasi DDL seperti ALTER TABLE yang memang butuh eksklusivitas penuh atas struktur tabel.",
      en: "",
    },
    objective: {
      id: "Lock dibutuhkan karena tanpa mekanisme ini, dua transaction yang mengubah baris yang sama secara bersamaan bisa menghasilkan **lost update** — perubahan salah satu transaction hilang begitu saja tertimpa yang lain, tanpa error apa pun. Memahami jenis-jenis lock penting bagi data engineer untuk mendiagnosis kenapa query tiba-tiba lambat atau macet (blocked), yang seringkali bukan karena query itu sendiri lambat, tapi karena **sedang menunggu lock dari transaction lain**.",
      en: "",
    },
    goal: {
      id: "Tujuannya adalah **konkurensi yang aman** — banyak transaction bisa berjalan bersamaan tanpa saling merusak data satu sama lain — sambil meminimalkan waktu tunggu (blocking) dengan memilih granularitas lock yang sesuai kebutuhan, idealnya **row-level untuk operasi harian** dan table-level hanya saat benar-benar perlu.",
      en: "",
    },
    exampleImplementation: {
      id: "Contoh penggunaan lock eksplisit di aplikasi yang perlu mencegah dua proses memproses baris yang sama secara bersamaan, misalnya sistem antrian pemrosesan klaim.\n\n1. `SELECT ... FOR UPDATE` mengambil **exclusive row lock** pada baris yang di-select, mencegah proses lain mengambil baris yang sama sampai transaction ini selesai.\n2. `SELECT` biasa tanpa FOR UPDATE hanya mengambil shared lock (atau tanpa lock sama sekali tergantung isolation level), sehingga **tidak memblokir pembaca lain**.\n3. Operasi DDL seperti `ALTER TABLE` otomatis mengambil table lock yang **memblokir hampir semua operasi lain** terhadap tabel tersebut.\n\n```sql\nBEGIN;\n\n-- Ambil exclusive lock pada baris klaim yang belum diproses, skip yang sudah dikunci proses lain\nSELECT id, status FROM klaim\nWHERE status = 'pending'\nORDER BY created_at\nLIMIT 1\nFOR UPDATE SKIP LOCKED;\n\nUPDATE klaim SET status = 'processing' WHERE id = :id;\n\nCOMMIT;\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Fintech Cepat menjalankan beberapa worker paralel yang sama-sama mengambil antrean transaksi pembayaran dari tabel `queue` untuk diproses. Tanpa lock yang tepat, dua worker berisiko mengambil baris antrean yang sama dan **memproses pembayaran yang sama dua kali** — bug yang sangat mahal di konteks keuangan. Tim engineering menggunakan `SELECT ... FOR UPDATE SKIP LOCKED` sehingga tiap worker otomatis melewati baris yang sedang dikunci worker lain dan langsung mengambil baris berikutnya yang bebas, membuat pemrosesan paralel **aman tanpa duplikasi maupun deadlock** antar worker.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- **Mencegah lost update dan race condition** saat banyak transaction menulis ke data yang sama secara bersamaan\n- Row-level lock memungkinkan **konkurensi tinggi** karena hanya baris yang benar-benar diakses yang terkunci\n- `SKIP LOCKED` dan varian sejenis memungkinkan pola antrean paralel yang aman tanpa proses saling menunggu\n- Kompatibilitas shared lock antar pembaca menjaga **performa baca tetap tinggi** meski banyak transaction membaca bersamaan",
        en: "",
      },
      cons: {
        id: "- Table-level lock bisa **memblokir seluruh operasi** terhadap tabel, jadi berbahaya kalau dipakai sembarangan di sistem produksi yang sibuk\n- Transaction yang menahan exclusive lock terlalu lama (misalnya karena logika aplikasi yang lambat) bisa membuat transaction lain menunggu lama atau timeout\n- Dua transaction yang saling menunggu lock milik satu sama lain bisa menghasilkan **deadlock** yang harus di-resolve oleh database\n- Memahami interaksi lock dengan isolation level butuh pemahaman mendalam, salah konfigurasi bisa menimbulkan **bug konkurensi yang sulit direproduksi**",
        en: "",
      },
    },
  },
};
