export const term = {
  id: "primary-key-composite-key",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#a3e635",
  icon: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
  simulation: "primarykey",
  tools: ["MySQL", "PostgreSQL", "Oracle", "BigQuery", "SQLite"],
  prerequisites: [],
  related: ["foreign-key-referential-integrity", "surrogate-key-vs-natural-key"],
  name: { id: "Primary Key & Composite Key", en: "Primary Key & Composite Key" },
  content: {
    description: {
      id: "Primary Key adalah kolom (atau kombinasi kolom) yang secara unik mengidentifikasi setiap baris di sebuah tabel, dengan syarat **wajib tidak boleh NULL** dan **hanya boleh ada satu primary key per tabel**. Composite Key adalah bentuk khusus primary key yang terdiri dari gabungan dua kolom atau lebih, di mana **kombinasi nilainya-lah yang harus unik**, bukan masing-masing kolom secara individual. Composite key sangat umum dipakai pada junction table untuk merepresentasikan relasi *many-to-many*.",
      en: "",
    },
    concept: {
      id: "Bayangkan primary key *seperti nomor induk kependudukan (NIK)* — setiap warga negara **wajib punya satu NIK unik, tidak boleh kosong**, tidak boleh ada dua orang dengan NIK sama. Composite key seperti kombinasi nomor kursi dan nomor pertandingan di tiket bioskop: nomor kursi C5 saja bisa dipakai di banyak jadwal berbeda, dan nomor pertandingan saja tidak cukup spesifik, tapi **kombinasi (pertandingan, kursi) pasti unik** — tidak akan ada dua tiket dengan kombinasi persis sama.",
      en: "",
    },
    methodology: {
      id: "Ketika sebuah kolom didefinisikan sebagai primary key, database secara otomatis membuat **unique index** di baliknya untuk memastikan validasi keunikan berjalan cepat, sekaligus mempercepat lookup dan JOIN pada kolom tersebut. Untuk composite key, database membuat unique index gabungan dari seluruh kolom yang menyusunnya — **keunikan diperiksa terhadap kombinasi nilai, bukan kolom tunggal**. Setiap kali ada operasi INSERT, database memvalidasi bahwa nilai (atau kombinasi nilai) baru tidak bertabrakan dengan baris yang sudah ada. Foreign key dari tabel lain yang mereferensikan composite primary key juga **harus menyertakan seluruh kolom penyusunnya**, bukan sebagian saja.",
      en: "",
    },
    objective: {
      id: "Primary key ada untuk memberikan cara yang andal dan tegas mengidentifikasi setiap baris data secara unik, yang menjadi **fondasi bagi relasi antar tabel** (melalui foreign key), integritas data, dan performa lookup. Composite key khususnya dibutuhkan ketika **tidak ada satu kolom tunggal yang secara alami unik**, tapi kombinasi beberapa kolom bisa memberikan keunikan tersebut — situasi umum pada tabel penghubung relasi *many-to-many*.",
      en: "",
    },
    goal: {
      id: "Hasil yang dicapai adalah setiap baris di tabel dapat **diidentifikasi dan direferensikan secara pasti tanpa ambiguitas**, memungkinkan relasi antar tabel yang andal, mencegah duplikasi data yang tidak diinginkan, dan mempercepat operasi pencarian berkat **index otomatis** yang menyertainya.",
      en: "",
    },
    exampleImplementation: {
      id: "Contoh penerapan primary key sederhana dan composite key pada junction table:\n\n1. Tabel pasien menggunakan patient_id tunggal sebagai **primary key**.\n2. Tabel penghubung klaim-dokter merepresentasikan relasi many-to-many, menggunakan **composite primary key** dari claim_id dan doctor_id.\n\n```sql\nCREATE TABLE pasien (\n  patient_id SERIAL PRIMARY KEY,\n  nama VARCHAR(100)\n);\n\nCREATE TABLE link_klaim_dokter (\n  claim_id INT,\n  doctor_id INT,\n  peran VARCHAR(50),\n  PRIMARY KEY (claim_id, doctor_id)\n);\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Klinika Sehat mendesain tabel pasien dengan patient_id sebagai **primary key tunggal** yang menjadi acuan seluruh sistem rekam medis. Untuk mencatat bahwa satu klaim asuransi bisa ditangani oleh lebih dari satu dokter (dan satu dokter bisa menangani banyak klaim), mereka membuat tabel link_klaim_dokter dengan composite primary key dari (claim_id, doctor_id), memastikan kombinasi dokter-klaim yang sama **tidak pernah tercatat dua kali** secara tidak sengaja.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Menjamin setiap baris **teridentifikasi unik**, fondasi utama integritas relasional\n- Otomatis mendapat **unique index**, mempercepat lookup dan JOIN pada kolom tersebut\n- Composite key merepresentasikan relasi many-to-many **secara natural** tanpa kolom ID tambahan\n- Mencegah duplikasi baris yang secara logis seharusnya sama",
        en: "",
      },
      cons: {
        id: "- Composite key membuat foreign key referensi menjadi lebih rumit karena **harus menyertakan semua kolom penyusun**\n- Jika kolom penyusun composite key berubah nilainya, semua tabel yang mereferensikannya ikut terdampak\n- Primary key alami (natural key) **berisiko berubah seiring waktu**, berbeda dengan surrogate key yang stabil\n- Composite key dengan banyak kolom bisa membuat index lebih besar dan JOIN sedikit lebih berat dibanding single-column key",
        en: "",
      },
    },
  },
};
