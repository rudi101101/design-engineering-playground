export const term = {
  id: "clustering-sorting",
  track: "data-engineering",
  category: "Storage & Format",
  color: "#f43f5e",
  icon: "M18 20V10M12 20V4M6 20v-6",
  simulation: "clustering",
  tools: ["BigQuery", "Snowflake", "Apache Iceberg", "DuckDB", "Redshift"],
  prerequisites: ["partitioning"],
  related: [],
  name: { id: "Clustering & Sorting", en: "Clustering & Sorting" },
  content: {
    description: {
      id: "Clustering & Sorting adalah teknik mengurutkan data di dalam setiap partisi berdasarkan kolom tertentu, sehingga baris-baris dengan nilai kolom yang sama saling berdekatan secara fisik. Berbeda dari partitioning yang membagi tabel menjadi segmen terpisah, clustering bekerja di dalam satu partisi (atau bahkan di tabel yang tidak dipartisi sama sekali) untuk mempercepat filter pada kolom yang bukan kolom partisi. BigQuery menyediakannya lewat klausa CLUSTER BY, sementara Snowflake mengimplementasikannya secara otomatis lewat micro-partition sorting.",
      en: "",
    },
    concept: {
      id: "Kalau partitioning seperti memberi rak terpisah per bulan di gudang arsip, clustering seperti menyusun surat-surat di dalam satu rak itu berdasarkan nama pengirim, bukan asal ditumpuk. Begitu ada permintaan 'semua surat dari cabang Bandung bulan ini', petugas tidak perlu memeriksa satu-satu seluruh surat di rak bulan itu — karena surat dari Bandung sudah mengelompok di satu bagian rak, mereka bisa langsung mengambil segmen itu saja dan mengabaikan sisanya.",
      en: "",
    },
    methodology: {
      id: "Saat data ditulis, engine mengurutkan baris berdasarkan cluster key yang ditentukan sebelum menyimpannya, sehingga baris dengan nilai cluster key yang sama saling co-located dalam blok penyimpanan yang berdekatan. Setiap blok menyimpan statistik ringkas (nilai minimum dan maksimum dari cluster key di blok itu). Saat query memfilter berdasarkan cluster key, optimizer membaca statistik tersebut dan melakukan block pruning — melewati blok-blok yang berdasarkan statistiknya pasti tidak mengandung nilai yang dicari, tanpa perlu membaca isi bloknya sama sekali.",
      en: "",
    },
    objective: {
      id: "Partitioning saja tidak cukup ketika query sering memfilter kolom lain di luar kolom partisi — misalnya tabel dipartisi per hari, tapi kebanyakan query juga memfilter per cabang. Tanpa clustering, filter kedua ini tetap harus memindai seluruh isi partisi hari itu. Clustering ada untuk menambah lapisan optimasi kedua di dalam partisi, menyasar kolom filter yang sering dipakai tapi tidak layak dijadikan kolom partisi sendiri karena kardinalitasnya terlalu tinggi.",
      en: "",
    },
    goal: {
      id: "Hasil konkretnya, query yang memfilter berdasarkan cluster key bisa melewati (skip) sebagian besar blok dalam satu partisi — pada kasus nyata seperti filter kode cabang, ini bisa memangkas hingga 95% blok yang perlu dipindai dalam partisi hari itu, jauh melampaui manfaat partitioning saja.",
      en: "",
    },
    exampleImplementation: {
      id: "Contoh clustering di atas tabel yang sudah dipartisi per hari di BigQuery:\n\n```sql\nCREATE TABLE laporan.klaim (\n  id_klaim INT64,\n  tanggal_klaim DATE,\n  kode_cabang STRING,\n  jumlah NUMERIC\n)\nPARTITION BY tanggal_klaim\nCLUSTER BY kode_cabang;\n\n-- Query ini memanfaatkan partition pruning DAN block pruning sekaligus\nSELECT SUM(jumlah)\nFROM laporan.klaim\nWHERE tanggal_klaim = '2026-07-20' AND kode_cabang = 'BDG-01';\n```\n\nPartisi mengeliminasi seluruh hari di luar 20 Juli 2026, lalu clustering mengeliminasi hampir seluruh blok di dalam partisi itu yang bukan milik cabang BDG-01.",
      en: "",
    },
    exampleEnterprise: {
      id: "Toko Meta Retail mempartisi tabel transaksi hariannya dan menambahkan CLUSTER BY kode_cabang di BigQuery. Tim regional yang biasanya hanya butuh laporan satu cabang tertentu kini menjalankan query yang, di dalam partisi hari itu, hanya menyentuh sebagian kecil blok data milik cabangnya — sisanya di-skip berkat statistik blok — sehingga laporan per cabang yang tadinya lambat karena harus memindai seluruh partisi hari itu jadi jauh lebih responsif.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Mempercepat filter pada kolom yang bukan kolom partisi tanpa perlu membuat partisi tambahan.\n- Block pruning berdasarkan statistik min/max sangat efektif untuk kolom dengan kardinalitas menengah-tinggi seperti kode cabang atau ID pelanggan.\n- Di Snowflake, clustering otomatis dikelola sistem lewat micro-partition sehingga tidak perlu maintenance manual berlebihan.\n- Bisa dikombinasikan dengan partitioning untuk efek pruning berlapis yang jauh lebih kuat daripada masing-masing sendiri.",
        en: "",
      },
      cons: {
        id: "- Manfaat clustering menurun seiring waktu jika data terus ditulis tanpa reorganisasi ulang (data baru menumpuk tidak terurut).\n- Memilih cluster key yang salah (misalnya kardinalitas terlalu rendah atau terlalu tinggi) memberi manfaat pruning yang minim.\n- Di beberapa platform, reclustering data lama butuh proses maintenance eksplisit yang menambah biaya komputasi.\n- Tidak menggantikan kebutuhan partitioning untuk data dalam skala sangat besar — keduanya saling melengkapi, bukan saling substitusi.",
        en: "",
      },
    },
  },
};
