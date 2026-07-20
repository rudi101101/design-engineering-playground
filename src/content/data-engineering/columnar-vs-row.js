export const term = {
  id: "columnar-vs-row",
  track: "data-engineering",
  category: "Advanced SQL",
  color: "#991b1b",
  icon: "M3 3h18M3 9h18M3 15h18",
  simulation: "rowvscol",
  tools: ["MySQL (row)", "PostgreSQL (row)", "BigQuery (col)", "DuckDB (col)", "ClickHouse (col)"],
  prerequisites: ["columnar-storage"],
  related: ["row-storage-vs-columnar"],
  name: { id: "Columnar vs Row", en: "Columnar vs Row" },
  content: {
    description: {
      id: "Columnar vs Row adalah keputusan arsitektural mendasar tentang bagaimana memilih format penyimpanan database berdasarkan karakteristik beban kerja (workload) yang akan dilayani. Row storage menyimpan seluruh kolom dari satu baris secara berdekatan di disk, cocok untuk sistem OLTP yang sering melakukan operasi single-row seperti insert, update, atau ambil satu record lengkap. Columnar storage menyimpan nilai dari kolom yang sama secara berdekatan di disk, cocok untuk sistem OLAP yang sering melakukan agregasi pada sebagian kolom saja dari tabel yang sangat lebar dan banyak baris.",
      en: "",
    },
    concept: {
      id: "Bayangkan row storage seperti rak buku yang disusun per judul buku — setiap buku (baris) berisi semua babnya (kolom) tersusun berurutan, jadi kalau kamu mau baca satu buku utuh, kamu ambil satu buku dan semua isinya sudah lengkap di tanganmu. Columnar storage seperti perpustakaan yang menyimpan semua 'Bab 1' dari semua buku dalam satu rak, semua 'Bab 2' di rak lain, dan seterusnya — kalau kamu cuma butuh membaca dan merangkum Bab 3 dari semua buku (agregasi satu kolom), kamu tidak perlu menyentuh bab-bab lain sama sekali, jauh lebih efisien untuk kebutuhan itu.",
      en: "",
    },
    methodology: {
      id: "Aturan praktisnya sederhana: kalau pola query yang dominan adalah SELECT * atau mengambil semua kolom dari satu atau beberapa baris spesifik (misalnya ambil detail satu transaksi lengkap), row storage lebih efisien karena semua data yang dibutuhkan sudah berdekatan secara fisik di disk, cukup satu kali baca. Kalau pola query dominan adalah SELECT dengan agregasi pada beberapa kolom saja dari jutaan baris (misalnya SUM(jumlah) GROUP BY cabang), columnar storage jauh lebih efisien karena hanya kolom yang relevan yang perlu dibaca dari disk, sementara kolom lain yang tidak dipakai dalam query itu diabaikan sepenuhnya — mengurangi I/O secara signifikan. Prosesnya: analisis pola query yang paling sering dijalankan pada suatu sistem, lalu pilih format storage yang sesuai dengan pola dominan tersebut.",
      en: "",
    },
    objective: {
      id: "Pemahaman trade-off ini penting karena memilih format storage yang salah untuk suatu beban kerja bisa menyebabkan performa yang jauh di bawah optimal — menjalankan analitik agregasi berat pada database row-oriented seperti MySQL bisa lambat dan mahal, sementara menjalankan operasi transaksional frequent-write pada database columnar seperti BigQuery juga tidak ideal karena overhead penulisan per-kolom yang lebih tinggi untuk update baris tunggal.",
      en: "",
    },
    goal: {
      id: "Hasilnya adalah arsitektur data yang tepat guna: sistem transaksional yang responsif untuk operasi CRUD sehari-hari lewat row storage, dan sistem analitik yang mampu mengagregasi miliaran baris dalam hitungan detik lewat columnar storage — sering kali keduanya dipakai bersamaan dalam satu organisasi, masing-masing untuk kebutuhannya sendiri, dihubungkan lewat proses sinkronisasi data.",
      en: "",
    },
    exampleImplementation: {
      id: "Skenario: memisahkan sistem transaksional dan analitik sesuai karakteristik workload masing-masing.\n\n1. Analisis pola query dominan pada tiap sistem.\n2. Sistem input klaim harian (banyak insert/update single-row) menggunakan row storage.\n3. Sistem laporan analitik (agregasi lintas jutaan baris) menggunakan columnar storage.\n4. Data disinkronkan dari sistem row ke sistem columnar lewat CDC secara berkala.\n\n```sql\n-- Row storage (MySQL): efisien untuk operasi single-row\nINSERT INTO klaim (klaim_id, pasien_id, tanggal, jumlah)\nVALUES (1001, 'P001', '2024-01-15', 500000);\n\n-- Columnar storage (BigQuery): efisien untuk agregasi lintas jutaan baris\nSELECT cabang, SUM(jumlah) AS total\nFROM klaim\nGROUP BY cabang;\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Klinika Sehat menjalankan sistem input klaim harian di atas MySQL (row storage) karena staf terus-menerus melakukan insert dan update klaim satu per satu sepanjang hari — operasi single-row yang sangat cocok dengan karakteristik row storage. Untuk kebutuhan laporan analitik bulanan yang mengagregasi jutaan baris klaim menjadi ringkasan per cabang dan per jenis penyakit, mereka menyalin data ke BigQuery (columnar storage) lewat proses CDC harian, karena agregasi pada volume besar seperti itu jauh lebih cepat dan murah dilakukan di sistem columnar dibanding menjalankannya langsung di MySQL produksi.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Memilih format storage sesuai workload memberi performa optimal untuk masing-masing kebutuhan, transaksional maupun analitik\n- Row storage unggul untuk operasi CRUD single-row yang sering terjadi pada sistem operasional sehari-hari\n- Columnar storage unggul drastis untuk agregasi pada sebagian kolom dari tabel yang sangat lebar dan besar\n- Memahami trade-off ini membantu tim menghindari kesalahan arsitektur mahal seperti menjalankan analitik berat di database OLTP",
        en: "",
      },
      cons: {
        id: "- Menjalankan kedua jenis sistem sekaligus (row untuk OLTP, columnar untuk OLAP) menambah kompleksitas karena butuh sinkronisasi data antar keduanya\n- Columnar storage kurang efisien untuk operasi update pada satu baris tunggal karena data kolom tersebar secara fisik\n- Row storage kurang efisien untuk agregasi besar karena harus membaca seluruh baris meski hanya butuh sebagian kolom\n- Keputusan yang salah di awal desain sistem sulit diubah belakangan tanpa migrasi data yang signifikan",
        en: "",
      },
    },
  },
};
