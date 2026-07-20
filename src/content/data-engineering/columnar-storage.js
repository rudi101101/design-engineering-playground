export const term = {
  id: "columnar-storage",
  track: "data-engineering",
  category: "Storage & Format",
  color: "#f59e0b",
  icon: "M3 3h18M3 9h18M3 15h18",
  simulation: "columnar",
  tools: ["Apache Parquet", "Apache ORC", "BigQuery", "Snowflake", "DuckDB"],
  prerequisites: [],
  related: ["row-storage-vs-columnar", "compaction-vacuum"],
  name: { id: "Columnar Storage", en: "Columnar Storage" },
  content: {
    description: {
      id: "Columnar storage adalah cara menyimpan data di mana nilai-nilai dari kolom yang sama disimpan berdekatan secara fisik, bukan menyimpan seluruh baris secara berurutan seperti pada row storage tradisional. Pendekatan ini dirancang khusus untuk beban kerja analitik (OLAP), di mana sebuah query biasanya hanya butuh beberapa kolom dari tabel yang punya puluhan atau ratusan kolom — misalnya menghitung total penjualan tanpa perlu membaca kolom alamat pelanggan. Format seperti Parquet dan ORC menjadi standar de facto di ekosistem data lake modern justru karena keunggulan ini.",
      en: "Columnar storage is a way of storing data where values from the same column are stored physically close together, instead of storing entire rows sequentially like traditional row storage. This approach is specifically designed for analytical (OLAP) workloads, where a query typically only needs a handful of columns from a table that may have dozens or hundreds — for example, summing total sales without needing to read the customer address column. Formats like Parquet and ORC have become the de facto standard in modern data lake ecosystems precisely because of this advantage.",
    },
    concept: {
      id: "Bayangkan sebuah perpustakaan besar. Row storage seperti menyimpan setiap buku utuh di raknya masing-masing — kalau kamu hanya ingin tahu tahun terbit semua buku, kamu tetap harus mengambil setiap buku satu per satu dan membuka halaman judulnya. Columnar storage seperti sudah memindahkan semua informasi 'tahun terbit' ke satu buku indeks terpisah — kamu tinggal buka satu buku itu saja, tanpa perlu menyentuh buku aslinya sama sekali. Untuk pertanyaan yang hanya butuh satu atau dua atribut, ini jauh lebih cepat.",
      en: "Imagine a large library. Row storage is like storing each complete book on its own shelf — if you only want to know the publication year of every book, you'd still have to pull each book individually and open its title page. Columnar storage is like having already moved all the 'publication year' information into a single separate index book — you only open that one book, without touching the original books at all. For questions that only need one or two attributes, this is far faster.",
    },
    methodology: {
      id: "Saat menulis data, engine columnar men-transpose baris menjadi kolom, lalu mengompresi tiap kolom secara terpisah menggunakan teknik seperti Run-Length Encoding (RLE) atau dictionary encoding — kompresi jauh lebih efektif karena nilai dalam satu kolom cenderung homogen (misalnya kolom `status` hanya berisi beberapa nilai unik). Saat membaca, query engine hanya mengambil dan mendekompresi kolom yang benar-benar diminta oleh `SELECT`, sebuah teknik yang disebut predicate/column pushdown. Alurnya: Write: Row → Transpose → Compress per Column → Store | Read: SELECT cols → Decompress only target cols.",
      en: "When writing, a columnar engine transposes rows into columns, then compresses each column separately using techniques like Run-Length Encoding (RLE) or dictionary encoding — compression is far more effective because values within a single column tend to be homogeneous (e.g. a `status` column only has a few unique values). When reading, the query engine only fetches and decompresses the columns actually requested by the `SELECT`, a technique called predicate/column pushdown. The flow: Write: Row → Transpose → Compress per Column → Store | Read: SELECT cols → Decompress only target cols.",
    },
    objective: {
      id: "Row storage sangat efisien untuk beban kerja transaksional (OLTP) yang biasanya mengambil atau mengubah satu baris utuh sekaligus, tapi sangat tidak efisien untuk query analitik yang hanya butuh beberapa kolom dari tabel lebar — sistem tetap harus membaca seluruh baris dari disk meski hanya butuh satu kolom. Columnar storage lahir untuk menyelesaikan mismatch ini secara spesifik untuk beban kerja analitik, di mana I/O yang dihemat dengan hanya membaca kolom relevan bisa mencapai puluhan hingga ratusan kali lipat.",
      en: "Row storage is very efficient for transactional (OLTP) workloads that typically fetch or modify one whole row at a time, but very inefficient for analytical queries that only need a few columns from a wide table — the system still has to read entire rows from disk even if only one column is needed. Columnar storage was created specifically to solve this mismatch for analytical workloads, where the I/O saved by reading only relevant columns can reach tens to hundreds of times less.",
    },
    goal: {
      id: "Hasil yang dicapai adalah pengurangan I/O yang drastis untuk query analitik (sering kali 90%+ lebih sedikit data dibaca dari disk), rasio kompresi yang jauh lebih baik karena homogenitas nilai per kolom, dan query aggregate (SUM, AVG, COUNT) yang berjalan jauh lebih cepat pada tabel dengan puluhan kolom.",
      en: "The outcome is a drastic reduction in I/O for analytical queries (often 90%+ less data read from disk), a much better compression ratio thanks to per-column value homogeneity, and aggregate queries (SUM, AVG, COUNT) that run far faster on tables with dozens of columns.",
    },
    exampleImplementation: {
      id: "Menyimpan data klaim sebagai file Parquet dan membandingkan efisiensi baca:\n\n```python\nimport pandas as pd\n\ndf = pd.read_csv(\"claims.csv\")  # 50 kolom, 10 juta baris\ndf.to_parquet(\"claims.parquet\", compression=\"snappy\")\n\n# Query analitik: hanya baca kolom claim_amount\n# Row storage: harus baca semua 50 kolom dari disk\n# Columnar (Parquet): hanya baca 1 kolom claim_amount\nresult = pd.read_parquet(\"claims.parquet\", columns=[\"claim_amount\"]).sum()\n```\n\nDi BigQuery, karena tabel native sudah columnar, `SELECT SUM(claim_amount) FROM claims` otomatis hanya men-scan satu kolom itu saja — terlihat langsung dari byte yang di-billing jauh lebih kecil dibanding `SELECT *`.",
      en: "Storing claims data as a Parquet file and comparing read efficiency:\n\n```python\nimport pandas as pd\n\ndf = pd.read_csv(\"claims.csv\")  # 50 columns, 10 million rows\ndf.to_parquet(\"claims.parquet\", compression=\"snappy\")\n\n# Analytical query: only read claim_amount column\n# Row storage: must read all 50 columns from disk\n# Columnar (Parquet): only reads the claim_amount column\nresult = pd.read_parquet(\"claims.parquet\", columns=[\"claim_amount\"]).sum()\n```\n\nIn BigQuery, since native tables are already columnar, `SELECT SUM(claim_amount) FROM claims` automatically scans only that one column — visible directly in the much smaller bytes billed compared to `SELECT *`.",
    },
    exampleEnterprise: {
      id: "Toko Meta Retail menyimpan data transaksi penjualan dengan 60 kolom (produk, pelanggan, promosi, pengiriman, dll) dalam format Parquet di data lake mereka. Ketika tim finance hanya perlu menghitung total pendapatan harian, query hanya membaca kolom `revenue` dan `transaction_date`, membuat biaya query turun drastis dan waktu eksekusi dari puluhan detik menjadi kurang dari satu detik dibandingkan saat data masih disimpan dalam format CSV row-based.",
      en: "Toko Meta Retail stores sales transaction data with 60 columns (product, customer, promotion, shipping, etc.) in Parquet format in their data lake. When the finance team only needs to compute total daily revenue, the query reads only the `revenue` and `transaction_date` columns, dropping query cost drastically and execution time from tens of seconds to under a second compared to when the data was still stored as row-based CSV.",
    },
    prosAndCons: {
      pros: {
        id: "- I/O jauh lebih hemat untuk query yang hanya butuh sebagian kolom dari tabel lebar\n- Rasio kompresi tinggi karena nilai per kolom cenderung homogen\n- Query aggregate (SUM, AVG, COUNT) jauh lebih cepat\n- Standar de facto (Parquet/ORC) sehingga kompatibel lintas engine (Spark, BigQuery, DuckDB)",
        en: "- Much lower I/O for queries that only need a subset of columns from a wide table\n- High compression ratio thanks to homogeneous per-column values\n- Aggregate queries (SUM, AVG, COUNT) run far faster\n- De facto standard (Parquet/ORC) so it's compatible across engines (Spark, BigQuery, DuckDB)",
      },
      cons: {
        id: "- Tidak efisien untuk operasi yang butuh seluruh baris sekaligus, seperti INSERT/UPDATE satu record (khas OLTP)\n- Menulis data baru butuh menulis ulang seluruh kolom yang terpengaruh, membuatnya kurang cocok untuk update frequent\n- File kecil yang terlalu banyak (small file problem) justru memperlambat performa read\n- Butuh compaction berkala agar file tetap dalam ukuran optimal",
        en: "- Inefficient for operations that need an entire row at once, like inserting/updating a single record (typical OLTP)\n- Writing new data requires rewriting all affected columns, making it less suited for frequent updates\n- Too many small files (the small-file problem) actually slows read performance\n- Requires periodic compaction to keep files at an optimal size",
      },
    },
  },
};
