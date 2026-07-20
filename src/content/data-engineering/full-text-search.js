export const term = {
  id: "full-text-search",
  track: "data-engineering",
  category: "Advanced SQL",
  color: "#84cc16",
  icon: "M21 21l-4.35-4.35M17 11a6 6 0 1 1-12 0 6 6 0 0 1 12 0z",
  simulation: "fts",
  tools: ["PostgreSQL FTS", "Elasticsearch", "Solr", "BigQuery Search", "Typesense"],
  prerequisites: [],
  related: ["database-index"],
  name: { id: "Full-Text Search", en: "Full-Text Search" },
  content: {
    description: {
      id: "Full-Text Search (FTS) adalah kemampuan mencari teks di dalam dokumen atau kolom secara jauh lebih cerdas dibanding pola `LIKE '%keyword%'` yang sederhana. FTS melibatkan tokenization (memecah teks jadi kata-kata), stemming atau normalisasi (menyamakan bentuk kata seperti 'diabetic' dan 'diabetes' ke akar kata yang sama), serta ranking hasil berdasarkan relevansi — bukan sekadar cocok atau tidak cocok seperti LIKE, tapi seberapa relevan sebuah dokumen terhadap query pencarian, lengkap dengan dukungan boolean query untuk pencarian yang lebih kompleks.",
      en: "",
    },
    concept: {
      id: "Bayangkan `LIKE '%keyword%'` seperti mencari kata di buku dengan membaca setiap halaman dari awal sampai akhir, kata per kata, setiap kali kamu mencari sesuatu — lambat dan tidak paham konteks. Full-Text Search seperti memakai indeks di belakang buku yang sudah disusun oleh pustakawan ahli: kata 'diabetes' di indeks itu bahkan sudah menghubungkan ke halaman yang membahas 'diabetic' dan 'diabetes mellitus', karena pustakawan tahu kata-kata itu berakar sama, dan hasil pencarian diurutkan dari yang paling relevan terlebih dulu.",
      en: "",
    },
    methodology: {
      id: "Proses dimulai saat dokumen dimasukkan: teks dipecah lewat tokenization menjadi kata-kata individual, lalu setiap kata dinormalisasi lewat stemming (misalnya 'berlari', 'lari', 'berlarian' disamakan ke akar kata 'lari'). Hasil normalisasi ini disimpan dalam struktur inverted index — struktur data yang memetakan setiap kata ke daftar dokumen yang mengandungnya, kebalikan dari cara baca dokumen biasa. Saat query masuk, ia juga diparsing dan dinormalisasi dengan cara yang sama, lalu dicocokkan terhadap inverted index. Hasil yang cocok kemudian diberi skor relevansi, umumnya menggunakan pendekatan seperti TF-IDF (term frequency-inverse document frequency), dan diurutkan dari yang paling relevan.",
      en: "",
    },
    objective: {
      id: "FTS ada karena pencarian teks bebas adalah kebutuhan yang sangat umum tapi tidak bisa dilayani baik oleh index B-tree konvensional yang dirancang untuk pencarian exact-match atau range. Pencarian `LIKE '%keyword%'` yang tidak bisa memakai index sama sekali akan melakukan full table scan pada setiap pencarian — sangat lambat pada tabel besar, dan sama sekali tidak paham variasi bentuk kata seperti bentuk jamak atau tenses berbeda.",
      en: "",
    },
    goal: {
      id: "Hasilnya adalah pencarian teks yang jauh lebih cepat (memakai index, bukan full scan) dan jauh lebih relevan (memahami variasi bentuk kata dan mengurutkan berdasarkan relevansi), memungkinkan fitur pencarian yang terasa 'pintar' seperti mesin pencari sungguhan, bukan sekadar pencocokan string sederhana.",
      en: "",
    },
    exampleImplementation: {
      id: "Skenario: membangun pencarian diagnosis pada tabel klaim yang bisa menemukan variasi kata terkait.\n\n1. Buat kolom tsvector atau index full-text pada kolom teks yang ingin dicari.\n2. Saat data di-insert, teks otomatis di-tokenize dan di-stem, lalu diindeks.\n3. Query menggunakan operator pencocokan full-text, bukan LIKE.\n4. Hasil diurutkan berdasarkan skor relevansi.\n\n```sql\nALTER TABLE klaim ADD COLUMN diagnosis_tsv tsvector\n  GENERATED ALWAYS AS (to_tsvector('indonesian', diagnosis)) STORED;\n\nCREATE INDEX idx_diagnosis_fts ON klaim USING GIN (diagnosis_tsv);\n\nSELECT klaim_id, diagnosis,\n       ts_rank(diagnosis_tsv, query) AS relevansi\nFROM klaim, to_tsquery('indonesian', 'diabetes') query\nWHERE diagnosis_tsv @@ query\nORDER BY relevansi DESC;\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Klinika Sehat membangun fitur pencarian diagnosis untuk tim customer service yang perlu mencari klaim berdasarkan kata kunci penyakit. Dengan PostgreSQL Full-Text Search, pencarian kata 'diabetes' berhasil menemukan klaim dengan catatan 'diabetic' maupun 'diabetes mellitus' berkat stemming, sesuatu yang mustahil dilakukan pencarian `LIKE '%diabetes%'` biasa. Hasil pencarian juga diurutkan berdasarkan relevansi, sehingga klaim yang paling cocok dengan kata kunci muncul di posisi teratas.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Jauh lebih cepat dibanding `LIKE '%keyword%'` karena memakai inverted index alih-alih full table scan\n- Memahami variasi bentuk kata lewat stemming, sehingga pencarian lebih toleran dan relevan secara semantik\n- Mendukung ranking hasil berdasarkan relevansi, bukan sekadar cocok atau tidak\n- Mendukung boolean query kompleks (AND, OR, NOT antar kata kunci) yang sulit diekspresikan dengan LIKE",
        en: "",
      },
      cons: {
        id: "- Setup awal lebih kompleks dibanding LIKE, perlu membuat kolom tsvector atau index khusus dan memahami konfigurasi bahasa\n- Stemming berbasis kamus bahasa tertentu, sehingga hasil kurang akurat untuk teks campuran bahasa atau istilah teknis khusus\n- Untuk kebutuhan pencarian yang sangat kompleks (typo tolerance, faceted search skala besar), sistem khusus seperti Elasticsearch lebih unggul dibanding FTS bawaan database relasional\n- Index full-text menambah overhead penyimpanan dan sedikit memperlambat operasi write dibanding tabel tanpa index tersebut",
        en: "",
      },
    },
  },
};
