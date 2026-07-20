export const term = {
  id: "partitioning-in-bigquery-style",
  track: "data-engineering",
  category: "Advanced SQL",
  color: "#dc2626",
  icon: "M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z",
  simulation: "bqpartition",
  tools: ["BigQuery", "Snowflake", "Redshift", "Azure Synapse", "Apache Iceberg"],
  prerequisites: ["partitioning"],
  related: ["partitioning-in-postgresql", "clustering-sorting"],
  name: { id: "Partitioning in BigQuery Style", en: "Partitioning in BigQuery Style" },
  content: {
    description: {
      id: "Partitioning di BigQuery adalah cara membagi tabel besar menjadi segmen-segmen penyimpanan terpisah berdasarkan nilai kolom, biasanya DATE, TIMESTAMP, atau RANGE, sehingga query yang memfilter pada kolom tersebut hanya perlu memindai (scan) segmen yang relevan saja. Karena BigQuery menagih biaya berdasarkan volume data yang di-scan per query, partitioning bukan cuma soal kecepatan tapi juga langsung berdampak pada biaya operasional — semakin sedikit data yang perlu dipindai, semakin murah query tersebut dijalankan. BigQuery juga mendukung CLUSTER BY yang bisa dikombinasikan dengan partitioning untuk pruning yang lebih presisi lagi.",
      en: "",
    },
    concept: {
      id: "Bayangkan tabel besar di BigQuery tanpa partisi seperti gudang raksasa berisi jutaan kotak barang yang ditumpuk acak — mencari barang tertentu berarti memeriksa hampir seluruh gudang. Partitioning seperti menata gudang itu jadi rak-rak terpisah per bulan pengiriman, sehingga saat kamu cari barang bulan Januari 2024, kamu langsung menuju rak Januari 2024 saja tanpa menyentuh rak bulan lain. CLUSTER BY menambahkan satu lapis lagi: di dalam rak Januari itu sendiri, barang juga sudah disusun berdasarkan kota tujuan, jadi pencarian jadi makin cepat lagi.",
      en: "",
    },
    methodology: {
      id: "Saat tabel dibuat dengan PARTITION BY DATE pada suatu kolom, BigQuery secara otomatis membuat partisi terpisah untuk setiap hari (atau bulan/tahun tergantung granularitas), dan setiap baris data yang masuk otomatis dirutekan ke partisi yang sesuai berdasarkan nilai kolom tersebut. Saat query dijalankan dengan filter WHERE pada rentang tanggal, BigQuery hanya memindai partisi yang cocok dengan rentang tersebut, mengabaikan partisi lain sepenuhnya — inilah yang disebut partition pruning. CLUSTER BY menambahkan lapisan pengurutan fisik data di dalam setiap partisi berdasarkan kolom tertentu, sehingga kombinasi filter tambahan pada kolom cluster (misalnya cabang) bisa mempersempit data yang dibaca lebih jauh lagi, bahkan di dalam satu partisi.",
      en: "",
    },
    objective: {
      id: "Partitioning di BigQuery ada karena model biaya BigQuery berbasis volume data yang di-scan, sehingga tabel besar tanpa partisi bisa menghasilkan biaya query yang sangat mahal meski hanya butuh sebagian kecil data. Ini berbeda motivasinya dari partitioning di database OLTP tradisional yang lebih fokus pada kecepatan dan maintenance — di BigQuery, partitioning adalah kontrol biaya yang sama pentingnya dengan kontrol performa.",
      en: "",
    },
    goal: {
      id: "Hasilnya adalah query yang jauh lebih murah dan cepat karena hanya memindai fraksi kecil dari total data tabel — dengan kombinasi PARTITION BY dan CLUSTER BY yang tepat, query yang tadinya harus scan seluruh tabel bisa memindai sebagian kecil saja dari total volume data, menerjemahkan langsung ke penghematan biaya yang signifikan pada skala data besar.",
      en: "",
    },
    exampleImplementation: {
      id: "Skenario: mempartisi tabel klaim berdasarkan tanggal dan mengelompokkan berdasarkan cabang untuk mempercepat dan menghemat biaya query laporan bulanan per cabang.\n\n1. Buat tabel dengan PARTITION BY DATE pada kolom tanggal.\n2. Tambahkan CLUSTER BY pada kolom cabang untuk pruning lebih presisi.\n3. Query dengan filter tanggal dan cabang hanya memindai data yang relevan.\n\n```sql\nCREATE TABLE proyek.dataset.tabel_klaim (\n  klaim_id INT64,\n  tanggal DATE,\n  cabang STRING,\n  jumlah NUMERIC\n)\nPARTITION BY tanggal\nCLUSTER BY cabang;\n\n-- Query ini hanya scan partisi Januari 2024, lalu dalam partisi itu\n-- hanya baca blok data yang relevan dengan cabang JKT\nSELECT SUM(jumlah)\nFROM proyek.dataset.tabel_klaim\nWHERE tanggal BETWEEN '2024-01-01' AND '2024-01-31'\n  AND cabang = 'JKT';\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Klinika Sehat menyimpan tabel klaim historis dengan volume mencapai ratusan juta baris di BigQuery, dan tim analitik sering menjalankan laporan bulanan per cabang. Dengan mempartisi tabel berdasarkan DATE(tanggal) dan meng-cluster berdasarkan cabang, query laporan Januari 2024 untuk cabang Jakarta hanya perlu memindai sekitar 1/365 dari total data (satu bulan dari total setahun) dikalikan lagi dengan fraksi kecil untuk satu cabang dari puluhan cabang yang ada — memangkas biaya query BigQuery secara drastis dibanding harus memindai seluruh tabel setiap kali laporan dijalankan.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Mengurangi biaya query secara signifikan karena BigQuery menagih berdasarkan volume data yang di-scan, bukan waktu eksekusi\n- Kombinasi PARTITION BY dan CLUSTER BY memberi pruning berlapis yang mempersempit data yang dibaca lebih jauh\n- Partisi berbasis tanggal otomatis terkelola oleh BigQuery tanpa perlu membuat partisi manual satu per satu seperti di PostgreSQL\n- Mempercepat query analitik pada tabel skala sangat besar tanpa perlu infrastruktur tambahan di luar BigQuery itu sendiri",
        en: "",
      },
      cons: {
        id: "- Query tanpa filter pada kolom partisi akan tetap memindai seluruh tabel dan berpotensi mahal, sehingga disiplin penulisan query penting\n- Terlalu banyak partisi (misalnya partisi per jam pada volume rendah) bisa menyebabkan overhead metadata yang tidak sepadan manfaatnya\n- Pemilihan kolom CLUSTER BY yang salah tidak memberi manfaat pruning berarti, sehingga perlu memahami pola query sebenarnya\n- Berbeda dari partitioning PostgreSQL, developer tidak punya kontrol granular untuk mengelola partisi individual secara manual",
        en: "",
      },
    },
  },
};
