export const term = {
  id: "data-lakehouse",
  track: "data-engineering",
  category: "Arsitektur",
  color: "#6366f1",
  icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  simulation: "lakehouse",
  tools: ["Databricks", "Apache Iceberg", "Delta Lake", "BigQuery", "Snowflake"],
  prerequisites: ["data-warehouse-vs-data-lake"],
  related: ["open-table-format"],
  name: { id: "Data Lakehouse", en: "Data Lakehouse" },
  content: {
    description: {
      id: `Data Lakehouse adalah arsitektur yang menggabungkan kelebihan Data Lake (storage murah, format bebas, cocok untuk semua jenis data) dengan kelebihan Data Warehouse (structured, reliable, query-ready) menjadi satu platform tunggal. Alih-alih menjaga dua sistem terpisah — lake untuk raw data/ML dan warehouse untuk BI — organisasi cukup punya satu tempat penyimpanan yang bisa dipakai untuk kebutuhan analitik SQL maupun machine learning sekaligus. Ini menjadi relevan karena praktik lama (lake + warehouse terpisah) sering menghasilkan duplikasi data, pipeline ETL ganda, dan risiko data di kedua sistem jadi tidak sinkron.`,
      en: "",
    },
    concept: {
      id: `Bayangkan sebuah gudang serbaguna: biasanya kamu harus punya dua tempat — gudang penyimpanan barang mentah yang berantakan (data lake) dan toko ritel yang rapi dengan rak-rak terorganisir (data warehouse), lalu barang harus dipindah dari gudang ke toko sebelum bisa dijual. Data Lakehouse seperti menambahkan sistem pelabelan dan indeks pintar di atas gudang yang sama, sehingga barang tetap disimpan mentah dan murah, tapi bisa "ditemukan dan dijual" langsung dari gudang itu juga — tanpa perlu memindahkannya ke toko terpisah dulu.`,
      en: "",
    },
    methodology: {
      id: `Secara teknis, raw data pertama-tama disimpan di object storage seperti GCS atau S3 dalam format bebas (Parquet, JSON, CSV, dll). Di atas storage mentah ini diterapkan sebuah open table format layer — seperti Apache Iceberg atau Delta Lake — yang menambahkan kemampuan setingkat warehouse: transaksi ACID, enforcement skema, version history, dan time travel, tanpa harus menyalin data ke sistem warehouse proprietary yang terpisah. Query engine seperti BigQuery, Databricks SQL, atau Trino kemudian bisa langsung membaca data melalui layer Iceberg/Delta ini, seolah-olah itu adalah tabel warehouse biasa.`,
      en: "",
    },
    objective: {
      id: `Tujuan utamanya adalah menghilangkan masalah "dua sistem" klasik: organisasi biasanya menjaga data lake untuk data mentah/ML dan data warehouse terpisah untuk BI, yang berarti biaya storage ganda, pipeline ETL tambahan untuk memindahkan data dari lake ke warehouse, dan risiko kedua salinan data saling tidak sinkron seiring waktu. Data Lakehouse lahir untuk menyatukan keduanya jadi satu sumber kebenaran.`,
      en: "",
    },
    goal: {
      id: `Hasil konkretnya adalah satu platform data yang bisa diquery langsung baik untuk dashboard BI maupun training model ML, dengan keandalan setara warehouse (ACID, skema terjaga) tapi biaya setara object storage — dan tanpa langkah ETL tambahan untuk "mempromosikan" data dari lake ke warehouse.`,
      en: "",
    },
    exampleImplementation: {
      id: `Alur implementasi tipikal: Ingest → Object Storage → Iceberg Layer → Query Engine → BI / ML.

1. Data mentah masuk ke object storage (GCS/S3) dalam format Parquet.
2. Di atasnya dibuat tabel Iceberg yang mendefinisikan skema dan metadata versi.
3. Query engine membaca tabel Iceberg tersebut langsung untuk analitik maupun feature engineering ML.

Contoh membuat tabel Iceberg sederhana:

\`\`\`sql
CREATE TABLE lakehouse.klaim_asuransi (
  klaim_id STRING,
  tanggal_klaim DATE,
  jumlah_klaim DECIMAL(18,2),
  status STRING
)
USING iceberg
PARTITIONED BY (tanggal_klaim);
\`\`\`

Setelah tabel ini dibuat, tim BI bisa langsung \`SELECT\` dari tabel yang sama yang dipakai tim data science untuk training model, tanpa proses ETL terpisah ke warehouse lain.`,
      en: "",
    },
    exampleEnterprise: {
      id: `Asuransi Lindung Sejahtera menyimpan dokumen klaim PDF mentah di Google Cloud Storage, lalu menambahkan Iceberg layer di atasnya sehingga tim analitik bisa langsung query lewat BigQuery untuk laporan klaim harian, sekaligus tim data science memakai data mentah yang sama untuk melatih model deteksi klaim fraud — tanpa proses ETL terpisah ke data warehouse konvensional.`,
      en: "",
    },
    prosAndCons: {
      pros: {
        id: `- Biaya storage rendah karena berbasis object storage, bukan warehouse proprietary yang mahal.
- Transaksi ACID dan schema enforcement tetap terjaga meski data disimpan dalam format terbuka.
- Menghilangkan duplikasi data dan pipeline ETL ganda antara lake dan warehouse.
- Satu platform bisa melayani kebutuhan BI (SQL) maupun ML (raw data) sekaligus.
- Mendukung schema evolution dan time travel untuk audit histori data.`,
        en: "",
      },
      cons: {
        id: `- Ekosistem tooling (Iceberg, Delta Lake) masih lebih baru dan kurang matang dibanding data warehouse konvensional.
- Performa query untuk join kompleks kadang masih kalah dibanding warehouse kolumnar khusus yang sudah teroptimasi puluhan tahun.
- Butuh maintenance table format secara aktif (compaction, vacuum file kecil) agar performa tidak menurun seiring waktu.
- Memerlukan tim dengan keahlian khusus untuk mengelola internal table format, bukan sekadar SQL biasa.`,
        en: "",
      },
    },
  },
};
