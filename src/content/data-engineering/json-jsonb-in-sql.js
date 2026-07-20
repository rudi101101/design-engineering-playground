export const term = {
  id: "json-jsonb-in-sql",
  track: "data-engineering",
  category: "Advanced SQL",
  color: "#10b981",
  icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6",
  simulation: "json",
  tools: ["PostgreSQL JSONB", "BigQuery JSON", "Snowflake VARIANT", "MySQL JSON", "MongoDB"],
  prerequisites: [],
  related: ["database-index"],
  name: { id: "JSON & JSONB in SQL", en: "JSON & JSONB in SQL" },
  content: {
    description: {
      id: "Dukungan JSON native di database relasional modern memungkinkan penyimpanan data semi-terstruktur langsung di dalam kolom tabel SQL, menjembatani dunia relasional yang kaku dengan fleksibilitas dokumen NoSQL. PostgreSQL punya dua tipe: JSON yang menyimpan teks apa adanya, dan JSONB yang menyimpan dalam format biner terparsing, bisa diindeks, dan jauh lebih cepat untuk query. BigQuery punya pendekatannya sendiri lewat nested dan repeated fields yang secara konseptual mirip tapi dioptimalkan untuk skala kolumnar analitik.",
      en: "",
    },
    concept: {
      id: "Bayangkan kolom JSON biasa seperti menyimpan surat dalam amplop tertutup — untuk membaca isinya, kamu harus buka amplop dan baca ulang setiap kali. JSONB seperti surat yang sudah difoto dan diberi indeks kata kunci di perpustakaan — kamu bisa langsung mencari 'bab mana yang mengandung kata tertentu' tanpa harus membuka dan membaca ulang seluruh surat dari awal setiap kali dicari.",
      en: "",
    },
    methodology: {
      id: "Saat data JSON di-insert ke kolom JSONB, PostgreSQL mem-parsing teks tersebut dan menyimpannya dalam format biner yang sudah terstruktur, bukan sekadar teks mentah — proses ini menambah sedikit overhead saat penulisan, tapi hasilnya query jadi jauh lebih cepat. Untuk mempercepat pencarian di dalam struktur JSONB, GIN index bisa dibuat pada kolom tersebut, memungkinkan pencarian key atau value tertentu tanpa harus mem-parsing ulang seluruh dokumen setiap kali query. Operator seperti `->>` dipakai untuk mengekstrak nilai sebagai teks dari suatu key, sementara fungsi seperti `JSON_VALUE` di database lain menyediakan kemampuan serupa untuk menavigasi struktur JSON bersarang.",
      en: "",
    },
    objective: {
      id: "Dukungan JSON native ada karena tidak semua data cocok dipaksakan ke skema relasional yang kaku sejak awal — misalnya detail pembayaran yang strukturnya bisa bervariasi antar metode, atau payload API pihak ketiga yang formatnya berubah-ubah. Sebelum ada JSONB, developer harus memilih antara memaksakan skema kaku yang sering berubah, atau menyimpan JSON sebagai teks biasa yang lambat untuk di-query — JSONB memberi jalan tengah yang tetap dalam ekosistem SQL yang matang dan andal.",
      en: "",
    },
    goal: {
      id: "Hasilnya adalah fleksibilitas skema untuk data yang bentuknya bervariasi, tanpa mengorbankan kecepatan query berkat binary storage dan GIN index — memungkinkan tim membangun fitur baru yang butuh struktur data dinamis tanpa harus migrasi skema tabel setiap kali ada perubahan kecil pada struktur data tersebut.",
      en: "",
    },
    exampleImplementation: {
      id: "Skenario: menyimpan detail pembayaran yang strukturnya bervariasi antar metode dalam kolom JSONB dengan index untuk pencarian cepat.\n\n1. Buat kolom bertipe JSONB pada tabel.\n2. Insert data JSON, otomatis disimpan dalam format biner terparsing.\n3. Buat GIN index pada kolom tersebut untuk mempercepat pencarian.\n4. Query menggunakan operator `->>` untuk mengekstrak nilai spesifik.\n\n```sql\nCREATE TABLE klaim (\n  klaim_id BIGINT,\n  detail_pembayaran JSONB\n);\n\nCREATE INDEX idx_detail_pembayaran ON klaim USING GIN (detail_pembayaran);\n\nINSERT INTO klaim (klaim_id, detail_pembayaran)\nVALUES (1, '{\"metode\": \"transfer\", \"bank\": \"BCA\", \"jumlah\": 500000}');\n\nSELECT * FROM klaim\nWHERE detail_pembayaran->>'metode' = 'transfer';\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Klinika Sehat menyimpan detail pembayaran klaim dalam kolom `detail_pembayaran` bertipe JSONB, karena struktur detail berbeda-beda tergantung metode pembayaran — transfer bank punya field nomor rekening dan nama bank, sementara kartu kredit punya field nomor kartu dan bank penerbit. Dengan GIN index pada kolom ini, query seperti mencari semua klaim dengan metode transfer bisa berjalan cepat meski struktur JSON di dalamnya bervariasi antar baris, tanpa harus membuat kolom terpisah untuk setiap kemungkinan field metode pembayaran.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Memberi fleksibilitas skema untuk data yang strukturnya bervariasi tanpa perlu migrasi skema tabel setiap ada perubahan\n- JSONB dengan GIN index memberi performa query yang mendekati kolom relasional biasa untuk pencarian di dalam struktur JSON\n- Menghindari kebutuhan sistem NoSQL terpisah untuk kasus yang sebenarnya masih bisa ditangani database relasional yang sama\n- Cocok untuk menyimpan payload API atau metadata yang strukturnya sering berubah seiring waktu",
        en: "",
      },
      cons: {
        id: "- Query pada struktur JSON bersarang dalam lebih rumit dan kurang intuitif dibanding kolom relasional biasa\n- Terlalu banyak mengandalkan JSONB alih-alih kolom terstruktur bisa mengaburkan skema dan menyulitkan validasi data\n- Beberapa operasi update pada field JSON tertentu tetap harus menulis ulang seluruh dokumen JSONB, bukan update parsial murni\n- Constraint dan foreign key tidak bisa diterapkan langsung pada field di dalam struktur JSON seperti pada kolom relasional biasa",
        en: "",
      },
    },
  },
};
