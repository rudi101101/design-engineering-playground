export const term = {
  id: "elt",
  track: "data-engineering",
  category: "Pipeline",
  color: "#0ea5e9",
  icon: "M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3",
  simulation: "elt",
  tools: ["dbt", "Fivetran", "Airbyte", "BigQuery", "Snowflake"],
  prerequisites: [],
  related: ["etl"],
  name: { id: "ELT (Extract, Load, Transform)", en: "ELT (Extract, Load, Transform)" },
  content: {
    description: {
      id: `ELT adalah pendekatan integrasi data modern di mana data mentah dimuat terlebih dahulu ke data warehouse cloud, dan transformasi baru dilakukan setelahnya di dalam warehouse itu sendiri memakai compute-nya — berbeda dengan pendekatan ETL tradisional di mana transformasi dilakukan di engine terpisah sebelum data dimuat. Pendekatan ini menjadi populer seiring warehouse cloud modern (BigQuery, Snowflake) menyediakan compute yang murah dan elastis, sehingga transformasi tidak lagi perlu dilakukan di luar warehouse.`,
      en: "",
    },
    concept: {
      id: `Bayangkan pindah rumah dengan cara langsung memasukkan semua kardus ke dalam rumah baru dulu (load raw), lalu membongkar dan merapikannya ruangan demi ruangan menggunakan ruang dan alat yang sudah ada di rumah itu (transform di dalam warehouse) — dibanding menyortir semuanya rapi-rapi di gudang sewa dulu sebelum boleh dibawa masuk rumah (pendekatan ETL tradisional dengan engine transform terpisah).`,
      en: "",
    },
    methodology: {
      id: `ELT memanfaatkan compute elastis warehouse cloud seperti BigQuery atau Snowflake untuk melakukan transformasi langsung di dalamnya, artinya data mentah yang belum ditransformasi selalu tersimpan sebagai fallback jika logika bisnis berubah atau perlu diproses ulang. Transformasi biasanya ditulis sebagai SQL yang versioned dan bisa ditest menggunakan tool seperti dbt, disusun berlapis dari staging → intermediate → mart agar mudah dikelola dan ditelusuri.`,
      en: "",
    },
    objective: {
      id: `ELT hadir untuk mengatasi kekakuan ETL, di mana logika transformasi harus didefinisikan dan dijalankan inline sebelum data dimuat — akibatnya data mentah seringkali hilang/dibuang dan menjalankan ulang transformasi berarti harus extract ulang dari source. ELT memisahkan tahap load dari tahap transform, sehingga data mentah tetap menjadi sumber kebenaran permanen yang bisa diproses ulang kapan saja.`,
      en: "",
    },
    goal: {
      id: `Hasilnya adalah pipeline yang lebih cepat dan fleksibel: logika transformasi bisa diiterasi, ditest, dan dijalankan ulang (versioned di git) tanpa perlu extract ulang dari sistem sumber, dan data mentah selalu tersedia untuk keperluan audit atau reprocessing di masa depan.`,
      en: "",
    },
    exampleImplementation: {
      id: `Alur: Source → Extract → Load Raw to DWH → Transform in-DWH (dbt) → Mart → Analytics.

1. Fivetran atau Airbyte melakukan extract data dari source (misalnya MySQL) tanpa transformasi apa pun.
2. Data mentah dimuat apa adanya ke tabel raw di BigQuery/Snowflake.
3. dbt menjalankan transformasi SQL berlapis dari staging ke intermediate hingga mart.

\`\`\`sql
-- model dbt: staging (bersihkan tipe data mentah)
-- models/staging/stg_klaim.sql
select
  cast(klaim_id as string) as klaim_id,
  cast(tanggal as date) as tanggal_klaim,
  cast(jumlah as numeric) as jumlah_klaim
from {{ source('raw', 'klaim_mysql') }}
\`\`\``,
      en: "",
    },
    exampleEnterprise: {
      id: `Fintech Cepat menggunakan Fivetran untuk extract data klaim dari MySQL, memuatnya sebagai raw table ke BigQuery, lalu dbt mentransformasikannya melalui layer staging, intermediate, hingga mart untuk kebutuhan analitik tim finance.`,
      en: "",
    },
    prosAndCons: {
      pros: {
        id: `- Data mentah selalu tersimpan sehingga bisa diproses ulang atau diaudit kapan saja.
- Logika transformasi versioned dan bisa ditest lewat dbt beserta git, memudahkan kolaborasi tim.
- Memanfaatkan compute warehouse cloud yang elastis dan murah dibanding cluster transformasi terpisah.
- Lebih cepat iterasi logika bisnis karena tidak perlu extract ulang dari source setiap kali ada perubahan.`,
        en: "",
      },
      cons: {
        id: `- Volume data mentah di warehouse bisa membengkak dan menambah biaya jika tidak dikelola dengan baik.
- Kesalahan transformasi lebih sulit dideteksi sebelum load, dibanding ETL yang memvalidasi sebelum data masuk.
- Membutuhkan warehouse dengan kapasitas compute dan kemampuan SQL yang mumpuni.
- Kurang cocok jika validasi ketat harus terjadi sebelum data bahkan disimpan, misalnya kasus regulasi yang mewajibkan reject saat ingest.`,
        en: "",
      },
    },
  },
};
