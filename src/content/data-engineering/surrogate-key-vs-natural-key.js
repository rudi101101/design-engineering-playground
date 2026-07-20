export const term = {
  id: "surrogate-key-vs-natural-key",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#fca5a5",
  icon: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5",
  simulation: "surrogatekey",
  tools: ["dbt", "BigQuery", "Snowflake", "Data Vault Hub", "PostgreSQL SEQUENCE"],
  prerequisites: ["primary-key-composite-key"],
  related: ["scd", "star-schema"],
  name: { id: "Surrogate Key vs Natural Key", en: "Surrogate Key vs Natural Key" },
  content: {
    description: {
      id: "Natural Key adalah identifier yang berasal dari data bisnis itu sendiri dan punya makna di dunia nyata, seperti NIK, nomor plat kendaraan, atau kode SKU produk — informatif tapi berpotensi berubah atau tidak selalu konsisten formatnya antar sumber data. Surrogate Key adalah identifier buatan sistem, biasanya berupa angka urut (BIGINT) atau UUID, yang tidak punya makna bisnis sama sekali, hanya berfungsi sebagai referensi teknis yang stabil dan tidak pernah berubah. Di dunia data warehouse, praktik terbaiknya adalah menggunakan surrogate key sebagai primary key pada dimension table, sambil tetap menyimpan natural key untuk keperluan pencarian bisnis.",
      en: "",
    },
    concept: {
      id: "Bayangkan natural key seperti nama lengkap seseorang, dan surrogate key seperti nomor antrian yang diberikan bank saat kamu datang. Nama lengkap bisa saja ada yang kembar, berubah karena menikah, atau ditulis dengan variasi ejaan berbeda di sistem berbeda — tidak sepenuhnya bisa diandalkan sebagai identitas teknis. Nomor antrian, di sisi lain, tidak punya arti apa pun di luar konteks bank itu, tapi dijamin unik dan tidak pernah berubah selama kamu berada dalam sistem itu — itulah sebabnya sistem lebih suka menggunakan nomor antrian sebagai referensi internal, sambil tetap mencatat nama aslimu untuk keperluan pelayanan.",
      en: "",
    },
    methodology: {
      id: "Dalam praktik data warehouse, setiap kali data baru masuk dari sistem sumber dengan natural key tertentu (misalnya NIK), proses ETL/ELT akan melakukan lookup ke dimension table: jika natural key tersebut sudah pernah ada, sistem mengembalikan surrogate key yang sudah ada sebelumnya; jika belum ada, sistem men-generate surrogate key baru (biasanya lewat sequence atau hash) dan menyimpan pasangan natural key beserta surrogate key barunya. Fact table kemudian selalu mereferensikan dimension melalui surrogate key, bukan natural key, sehingga JOIN menjadi lebih cepat (karena biasanya integer) dan tetap stabil meskipun natural key di sistem sumber berubah format atau nilainya di kemudian hari.",
      en: "",
    },
    objective: {
      id: "Perbandingan ini penting karena natural key punya kelemahan signifikan untuk dipakai sebagai primary key jangka panjang: bisa berubah (nomor plat kendaraan bisa diganti), formatnya bisa tidak konsisten antar sistem sumber yang berbeda, atau bahkan bisa digunakan ulang (reused) oleh sistem sumber. Surrogate key menghilangkan seluruh risiko ini karena sepenuhnya dikontrol oleh data warehouse sendiri, sekaligus memberikan performa JOIN yang lebih baik dibanding key berbasis string.",
      en: "",
    },
    goal: {
      id: "Hasil yang dicapai adalah dimension table yang stabil terhadap perubahan data di sistem sumber, mendukung teknik Slowly Changing Dimension (SCD) dengan baik karena satu natural key bisa punya banyak versi surrogate key seiring waktu, sekaligus performa JOIN antar fact dan dimension table yang lebih cepat berkat key berbasis integer.",
      en: "",
    },
    exampleImplementation: {
      id: "Alur pembuatan surrogate key saat memuat data ke dimension table:\n\n1. Data sumber datang dengan natural key (misal NIK pasien).\n2. Proses ETL melakukan lookup: apakah NIK ini sudah ada di dim_pasien?\n3. Jika sudah ada, gunakan patient_sk yang sudah ada. Jika belum, generate patient_sk baru dan simpan bersama NIK-nya.\n4. Fact table menyimpan referensi ke patient_sk, bukan NIK langsung.\n\n```sql\nCREATE TABLE dim_pasien (\n  patient_sk BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  nik VARCHAR(20) UNIQUE NOT NULL,\n  nama VARCHAR(100)\n);\n\nCREATE TABLE fact_klaim (\n  claim_id BIGINT PRIMARY KEY,\n  pasien_sk BIGINT REFERENCES dim_pasien(patient_sk),\n  jumlah_klaim NUMERIC(12,2)\n);\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Klinika Sehat membangun data warehouse dengan dim_pasien yang memiliki patient_sk BIGINT sebagai surrogate key dan kolom nik VARCHAR sebagai natural key yang tetap disimpan. Tabel fact_klaim melakukan JOIN ke dim_pasien lewat patient_sk yang jauh lebih cepat dibanding JOIN berbasis string NIK, sementara tim analitik yang perlu mencari pasien tertentu tetap bisa melakukan lookup lewat kolom NIK. Ketika suatu saat sistem sumber mengganti format penomoran NIK karena migrasi sistem kependudukan, surrogate key di data warehouse tetap stabil tidak terpengaruh sama sekali.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Surrogate key tetap stabil meskipun natural key di sistem sumber berubah format atau nilai\n- JOIN antar fact dan dimension table lebih cepat karena berbasis integer, bukan string\n- Mendukung teknik Slowly Changing Dimension dengan baik, satu natural key bisa punya banyak versi historis\n- Natural key tetap disimpan sehingga lookup bisnis dan proses dedup CDC tetap memungkinkan",
        en: "",
      },
      cons: {
        id: "- Menambah kompleksitas proses ETL karena harus melakukan lookup/generate surrogate key setiap load\n- Surrogate key tidak punya makna bisnis, menyulitkan debugging manual tanpa join balik ke natural key\n- Butuh mekanisme khusus (sequence, hash, atau UUID) yang harus konsisten dan tidak boleh bentrok\n- Jika natural key hilang atau salah mapping saat lookup, bisa menciptakan duplikasi surrogate key untuk entitas yang sama",
        en: "",
      },
    },
  },
};
