export const term = {
  id: "star-schema",
  track: "data-engineering",
  category: "Modeling",
  color: "#3b82f6",
  icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z",
  simulation: "star",
  tools: ["BigQuery", "dbt", "Looker", "Power BI", "Tableau"],
  prerequisites: ["medallion-architecture"],
  related: ["snowflake-schema", "data-vault-2-0"],
  name: { id: "Star Schema", en: "Star Schema" },
  content: {
    description: {
      id: "Star schema adalah pola pemodelan data warehouse paling umum, terdiri dari satu tabel fakta (fact table) di tengah yang berisi metrik/angka bisnis, dikelilingi oleh beberapa tabel dimensi (dimension tables) yang berisi atribut deskriptif. Disebut 'star' karena kalau digambar, tabel fakta ada di pusat dengan garis-garis relasi memancar ke setiap dimensi seperti bentuk bintang. Pola ini menjadi standar de facto untuk BI dan reporting karena strukturnya sederhana, mudah dipahami oleh analyst non-teknis, dan sangat cepat untuk query aggregate.",
      en: "Star schema is the most common data warehouse modeling pattern, consisting of one central fact table containing business metrics/numbers, surrounded by several dimension tables containing descriptive attributes. It's called 'star' because when diagrammed, the fact table sits at the center with relationship lines radiating out to each dimension like a star shape. This pattern has become the de facto standard for BI and reporting because its structure is simple, easy for non-technical analysts to understand, and very fast for aggregate queries.",
    },
    concept: {
      id: "Bayangkan star schema seperti nota belanja di kasir supermarket. Nota itu sendiri (fact table) hanya berisi angka-angka: jumlah barang, harga, total bayar. Tapi di sekitarnya ada 'buku referensi' terpisah yang menjelaskan detail: buku produk (dim_product) yang menjelaskan nama dan kategori barang berdasarkan kode SKU, buku pelanggan (dim_customer) yang menjelaskan siapa yang belanja, buku tanggal (dim_date) yang menjelaskan hari apa itu. Nota tidak perlu mengulang semua detail itu — cukup simpan kode referensinya saja, lalu 'sambungkan' ke buku yang tepat saat dibutuhkan.",
      en: "Think of a star schema like a supermarket checkout receipt. The receipt itself (fact table) only contains numbers: item quantity, price, total paid. But around it are separate 'reference books' explaining the detail: a product book (dim_product) explaining item names and categories by SKU code, a customer book (dim_customer) explaining who's shopping, a date book (dim_date) explaining what day it was. The receipt doesn't need to repeat all that detail — it just stores the reference code, then 'connects' to the right book when needed.",
    },
    methodology: {
      id: "Desain star schema dimulai dengan mendefinisikan grain — apa yang direpresentasikan satu baris di fact table (misalnya 'satu baris = satu item dalam satu transaksi'). Setelah grain jelas, tentukan measures (angka yang mau dianalisis, misalnya jumlah dan harga) dan dimensions (konteks deskriptif yang relevan). Dimension table sengaja didenormalisasi — tidak ada rantai JOIN bertingkat seperti pada snowflake schema — supaya query cukup melakukan satu JOIN langsung dari fact ke tiap dimension. Alurnya: Define grain → Choose facts → Choose dims → Build fact table → Connect dims with FK. Pendekatan ini dipopulerkan oleh Ralph Kimball.",
      en: "Star schema design begins by defining the grain — what one row in the fact table represents (e.g. 'one row = one line item in one transaction'). Once grain is clear, define measures (numbers to be analyzed, like quantity and price) and dimensions (relevant descriptive context). Dimension tables are deliberately denormalized — no multi-level JOIN chains like in a snowflake schema — so a query only needs one direct JOIN from fact to each dimension. The flow: Define grain → Choose facts → Choose dims → Build fact table → Connect dims with FK. This approach was popularized by Ralph Kimball.",
    },
    objective: {
      id: "Database OLTP yang ternormalisasi (mengikuti 3NF) sangat efisien untuk transaksi, tapi sangat tidak efisien untuk query analitik karena satu pertanyaan bisnis sederhana bisa butuh JOIN puluhan tabel. Star schema menyelesaikan ini dengan sengaja mendenormalisasi struktur data ke bentuk yang optimal untuk dibaca (bukan ditulis) — analyst dan BI tool bisa langsung memahami struktur tanpa perlu tahu detail internal sistem OLTP sumber.",
      en: "A normalized OLTP database (following 3NF) is very efficient for transactions but very inefficient for analytical queries, since one simple business question might require joining dozens of tables. Star schema solves this by deliberately denormalizing the data structure into a shape optimized for reading (not writing) — analysts and BI tools can understand the structure immediately without needing to know the internal details of the source OLTP system.",
    },
    goal: {
      id: "Hasil yang dicapai adalah query BI yang cepat karena hanya butuh JOIN langsung (bukan berantai), struktur yang mudah dipahami analyst non-teknis tanpa training mendalam, dan kemampuan BI tool (Looker, Power BI) untuk auto-generate visualisasi karena pola fact-dimension yang konsisten dan terprediksi.",
      en: "The outcome is fast BI queries since they only need direct JOINs (not chained ones), a structure easy for non-technical analysts to understand without deep training, and the ability for BI tools (Looker, Power BI) to auto-generate visualizations thanks to the consistent, predictable fact-dimension pattern.",
    },
    exampleImplementation: {
      id: "Membangun star schema untuk data klaim asuransi:\n\n```sql\nCREATE TABLE dim_date (date_sk INT PRIMARY KEY, full_date DATE, month INT, year INT);\nCREATE TABLE dim_branch (branch_sk INT PRIMARY KEY, branch_name STRING, region STRING);\nCREATE TABLE dim_patient (patient_sk INT PRIMARY KEY, patient_name STRING, age_group STRING);\n\nCREATE TABLE fact_claims (\n  claim_id STRING,\n  claim_amount NUMERIC,\n  date_sk INT REFERENCES dim_date(date_sk),\n  branch_sk INT REFERENCES dim_branch(branch_sk),\n  patient_sk INT REFERENCES dim_patient(patient_sk)\n);\n\n-- Query BI khas: total klaim per cabang per bulan\nSELECT b.branch_name, d.month, SUM(f.claim_amount)\nFROM fact_claims f\nJOIN dim_branch b ON f.branch_sk = b.branch_sk\nJOIN dim_date d ON f.date_sk = d.date_sk\nGROUP BY 1, 2;\n```",
      en: "Building a star schema for insurance claims data:\n\n```sql\nCREATE TABLE dim_date (date_sk INT PRIMARY KEY, full_date DATE, month INT, year INT);\nCREATE TABLE dim_branch (branch_sk INT PRIMARY KEY, branch_name STRING, region STRING);\nCREATE TABLE dim_patient (patient_sk INT PRIMARY KEY, patient_name STRING, age_group STRING);\n\nCREATE TABLE fact_claims (\n  claim_id STRING,\n  claim_amount NUMERIC,\n  date_sk INT REFERENCES dim_date(date_sk),\n  branch_sk INT REFERENCES dim_branch(branch_sk),\n  patient_sk INT REFERENCES dim_patient(patient_sk)\n);\n\n-- Typical BI query: total claims per branch per month\nSELECT b.branch_name, d.month, SUM(f.claim_amount)\nFROM fact_claims f\nJOIN dim_branch b ON f.branch_sk = b.branch_sk\nJOIN dim_date d ON f.date_sk = d.date_sk\nGROUP BY 1, 2;\n```",
    },
    exampleEnterprise: {
      id: "PT Nusantara Asuransi membangun `fact_claims` yang di-JOIN dengan `dim_patient`, `dim_branch`, dan `dim_date` untuk dashboard eksekutif di Looker. Tim BI yang tidak paham skema database sumber tetap bisa membangun visualisasi 'total klaim per cabang per bulan' hanya dengan drag-and-drop kolom dari fact dan dimension, tanpa perlu menulis JOIN kompleks sendiri.",
      en: "PT Nusantara Asuransi builds a `fact_claims` table joined with `dim_patient`, `dim_branch`, and `dim_date` for their executive dashboard in Looker. A BI team unfamiliar with the source database schema can still build a 'total claims per branch per month' visualization just by dragging and dropping columns from the fact and dimension tables, without writing complex JOINs themselves.",
    },
    prosAndCons: {
      pros: {
        id: "- Query cepat karena hanya butuh JOIN langsung fact-ke-dimension, bukan berantai\n- Struktur mudah dipahami analyst non-teknis dan BI tool\n- Standar industri yang didukung luas oleh tooling BI modern\n- Mudah ditambah dimension baru tanpa mengganggu fact table yang sudah ada",
        en: "- Fast queries since only direct fact-to-dimension JOINs are needed, not chained ones\n- Structure is easy for non-technical analysts and BI tools to understand\n- Industry standard broadly supported by modern BI tooling\n- Easy to add new dimensions without disrupting the existing fact table",
      },
      cons: {
        id: "- Dimension yang didenormalisasi bisa menyimpan redundansi data (nama cabang diulang di banyak baris)\n- Update pada atribut dimension (misalnya nama cabang berubah) butuh strategi khusus seperti SCD\n- Kurang fleksibel untuk model data yang sangat kompleks dengan hubungan many-to-many\n- Butuh proses ETL/ELT terpisah untuk membangunnya dari data OLTP sumber",
        en: "- Denormalized dimensions can store redundant data (branch name repeated across many rows)\n- Updating a dimension attribute (e.g. a branch name change) needs a dedicated strategy like SCD\n- Less flexible for very complex data models with many-to-many relationships\n- Requires a separate ETL/ELT process to build it from the source OLTP data",
      },
    },
  },
};
