export const term = {
  id: "snowflake-schema",
  track: "data-engineering",
  category: "Modeling",
  color: "#1d4ed8",
  icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z",
  simulation: "snowflake",
  tools: ["BigQuery", "PostgreSQL", "dbt", "Snowflake", "SQL Server"],
  prerequisites: ["star-schema"],
  related: ["data-vault-2-0"],
  name: { id: "Snowflake Schema", en: "Snowflake Schema" },
  content: {
    description: {
      id: "Snowflake Schema adalah varian dari Star Schema di mana tabel-tabel dimensi dinormalisasi lebih lanjut menjadi sub-dimensi terpisah, alih-alih menyimpan semua atribut dimensi dalam satu tabel denormalized yang lebar. Namanya berasal dari bentuk diagram skema yang menyerupai kepingan salju bercabang-cabang, berbeda dari Star Schema yang bentuknya seperti bintang sederhana dengan satu fact table di tengah dan dimensi-dimensi langsung menempel di sekelilingnya. Snowflake Schema relevan ketika redundansi data pada dimensi besar menjadi masalah nyata, meski konsekuensinya adalah query harus melakukan lebih banyak JOIN.",
      en: "",
    },
    concept: {
      id: "Kalau Star Schema seperti map data pasien yang menyimpan nama kota dan nama provinsi langsung di dalam map itu (praktis diambil, tapi kalau ada seribu pasien dari kota yang sama, nama kota itu ditulis ulang seribu kali), Snowflake Schema seperti memisahkan daftar kota ke buku alamat tersendiri, dan daftar provinsi ke buku terpisah lagi — map pasien cukup menyimpan nomor referensi ke buku kota. Ini menghemat penulisan berulang, tapi begitu butuh tahu provinsi asal seorang pasien, kamu harus membuka map pasien, lalu buku kota, lalu buku provinsi secara berurutan.",
      en: "",
    },
    methodology: {
      id: "Proses normalisasi dimulai dari Star Schema yang sudah ada, lalu dimensi yang mengandung hierarki atau atribut berulang dipecah menjadi sub-dimensi terpisah — misalnya dim_pasien yang tadinya menyimpan kolom nama kota dan nama provinsi langsung, dinormalisasi sehingga kota dipindah ke tabel dim_kota tersendiri, dan dim_pasien hanya menyimpan foreign key ke dim_kota. Jika hierarki berlanjut, dim_kota sendiri bisa dinormalisasi lagi menjadi dim_provinsi. Query terhadap fact table kini harus melakukan JOIN berantai — dari fact ke dim_pasien, ke dim_kota, ke dim_provinsi — untuk mendapatkan atribut lengkap, dibanding Star Schema yang cukup satu JOIN langsung.",
      en: "",
    },
    objective: {
      id: "Star Schema yang denormalized penuh bisa menimbulkan redundansi signifikan ketika dimensi punya hierarki dengan kardinalitas rendah di level atas (misalnya ribuan pasien tapi hanya puluhan provinsi) — nama provinsi yang sama ditulis berulang-ulang di setiap baris dimensi pasien. Snowflake Schema ada untuk mengurangi redundansi dan duplikasi penyimpanan itu dengan menormalisasi bagian dimensi yang hierarkis, dengan konsekuensi query jadi lebih kompleks.",
      en: "",
    },
    goal: {
      id: "Hasil konkretnya adalah penghematan ruang penyimpanan pada dimensi besar berkat berkurangnya duplikasi data, dengan trade-off waktu eksekusi query yang sedikit lebih lambat karena harus melakukan JOIN chain lebih panjang dibanding Star Schema untuk mendapatkan atribut yang sama.",
      en: "",
    },
    exampleImplementation: {
      id: "Contoh struktur Snowflake Schema untuk dimensi pasien yang dinormalisasi:\n\n```sql\nCREATE TABLE dim_provinsi (\n  id_provinsi INT PRIMARY KEY,\n  nama_provinsi STRING\n);\n\nCREATE TABLE dim_kota (\n  id_kota INT PRIMARY KEY,\n  nama_kota STRING,\n  id_provinsi INT REFERENCES dim_provinsi(id_provinsi)\n);\n\nCREATE TABLE dim_pasien (\n  id_pasien INT PRIMARY KEY,\n  nama STRING,\n  id_kota INT REFERENCES dim_kota(id_kota)\n);\n\n-- Query butuh JOIN chain untuk mendapatkan nama provinsi pasien\nSELECT p.nama, k.nama_kota, pr.nama_provinsi\nFROM fact_klaim f\nJOIN dim_pasien p ON f.id_pasien = p.id_pasien\nJOIN dim_kota k ON p.id_kota = k.id_kota\nJOIN dim_provinsi pr ON k.id_provinsi = pr.id_provinsi;\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Klinika Sehat Group menormalisasi dimensi pasiennya menjadi dim_pasien, dim_kota, dan dim_provinsi karena punya jutaan baris pasien tapi hanya puluhan provinsi cakupan layanan — menyimpan nama provinsi berulang di setiap baris pasien dianggap terlalu boros. Konsekuensinya, laporan yang butuh breakdown per provinsi harus melewati JOIN chain tiga tabel dimensi, lebih panjang dibanding Star Schema yang tim BI mereka gunakan di dashboard lain yang lebih sederhana.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Mengurangi redundansi data pada dimensi dengan hierarki berkardinalitas rendah, menghemat ruang penyimpanan.\n- Struktur yang lebih ternormalisasi memudahkan menjaga konsistensi data referensi (mis. nama provinsi hanya ada di satu tempat).\n- Cocok ketika sub-dimensi (seperti kota atau provinsi) juga dipakai bersama oleh banyak dimensi lain, menghindari duplikasi lintas dimensi.\n- Update pada data referensi (mis. perubahan nama kota) cukup dilakukan di satu baris, bukan di ribuan baris dimensi utama.",
        en: "",
      },
      cons: {
        id: "- Query jadi lebih kompleks dan lebih lambat karena harus melewati JOIN chain lebih panjang dibanding Star Schema.\n- Lebih sulit dipahami oleh business user non-teknis yang terbiasa dengan struktur flat Star Schema.\n- Tooling BI self-service kadang kesulitan meng-generate query otomatis pada skema yang bercabang banyak seperti ini.\n- Manfaat penghematan storage biasanya marginal dibanding kerugian performa, kecuali dimensi benar-benar sangat besar dan hierarkis.",
        en: "",
      },
    },
  },
};
