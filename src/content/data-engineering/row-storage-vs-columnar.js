export const term = {
  id: "row-storage-vs-columnar",
  track: "data-engineering",
  category: "Storage & Format",
  color: "#a78bfa",
  icon: "M3 3h18v4H3zM3 10h18v4H3zM3 17h18v4H3z",
  simulation: "rowcol",
  tools: ["MySQL/PostgreSQL (row)", "InnoDB", "BigQuery (col)", "Parquet", "Cassandra (row)"],
  prerequisites: [],
  related: ["columnar-storage", "columnar-vs-row"],
  name: { id: "Row Storage vs Columnar", en: "Row Storage vs Columnar" },
  content: {
    description: {
      id: "Row storage dan columnar storage adalah dua cara fundamental berbeda untuk menyusun data fisik di disk, dan pilihan di antara keduanya menentukan apakah sebuah database cocok untuk beban kerja transaksional (OLTP) atau analitik (OLAP). Pada row storage, seluruh kolom dari satu baris disimpan berdampingan secara fisik, sehingga mengambil atau mengubah satu record utuh sangat efisien. Pada columnar storage, nilai dari satu kolom yang sama disimpan berdampingan lintas jutaan baris, sehingga query yang hanya butuh beberapa kolom dari tabel yang sangat lebar bisa mengabaikan kolom lain sepenuhnya. Perbedaan tata letak fisik inilah yang menjelaskan mengapa MySQL terasa gesit untuk input transaksi satu-per-satu, sementara BigQuery unggul saat mengagregasi miliaran baris.",
      en: "",
    },
    concept: {
      id: "Bayangkan row storage seperti lemari arsip kantor: setiap map berisi satu berkas pegawai lengkap — KTP, slip gaji, riwayat cuti — semua ditumpuk jadi satu supaya begitu dibutuhkan, satu map itu langsung diambil utuh. Columnar storage lebih mirip ruang arsip yang disusun ulang per kategori: semua slip gaji dari seluruh pegawai dikumpulkan dalam satu rak, semua KTP di rak lain. Kalau HR cuma butuh menjumlahkan gaji seluruh pegawai bulan ini, mereka tinggal buka satu rak slip gaji tanpa harus membongkar setiap map pegawai satu-satu — tapi kalau mau lihat data lengkap satu pegawai, mereka harus mondar-mandir ke banyak rak sekaligus.",
      en: "",
    },
    methodology: {
      id: "Pada row storage, saat terjadi INSERT, seluruh kolom dari baris baru itu ditulis berurutan ke satu blok/page di heap — mesin storage seperti InnoDB menyimpan baris sebagai satu unit fisik yang berdekatan, sehingga membaca satu baris cukup satu I/O ke satu lokasi. Sebaliknya pada columnar storage, data disusun ulang per kolom: semua nilai kolom 'jumlah_klaim' disimpan berurutan, terpisah dari kolom 'tanggal', dan biasanya dikompresi dengan teknik seperti run-length encoding atau dictionary encoding karena nilai dalam satu kolom cenderung mirip. Saat query analitik menjalankan SELECT SUM(jumlah_klaim), engine cukup men-scan satu kolom itu saja dan mengabaikan seluruh kolom lain di tabel — inilah yang disebut column pruning, dan itulah sumber utama kecepatan OLAP dibanding row storage untuk beban agregasi.",
      en: "",
    },
    objective: {
      id: "Konsep ini ada karena pola akses OLTP dan OLAP secara fundamental bertentangan. Sistem OLTP — seperti aplikasi input klaim oleh petugas — butuh menulis dan membaca satu record utuh berulang kali dengan latensi rendah, dan row storage dioptimalkan tepat untuk itu. Sistem OLAP — seperti dashboard pelaporan yang mengagregasi jutaan baris — hanya butuh beberapa kolom dari tabel yang sangat lebar, dan menyusun data per baris di sini justru memaksa engine membaca kolom yang tidak relevan. Tanpa memilih tata letak storage yang tepat, salah satu dari dua beban kerja ini akan selalu lambat secara tidak proporsional.",
      en: "",
    },
    goal: {
      id: "Hasil konkretnya: sistem OLTP dengan row storage bisa menjaga latensi insert/update di kisaran milidetik untuk satu record, sementara sistem OLAP dengan columnar storage bisa memangkas volume data yang di-scan hingga 80-95% dibanding row storage untuk query agregasi pada tabel lebar, karena hanya kolom yang relevan yang dibaca dari disk.",
      en: "",
    },
    exampleImplementation: {
      id: "Ilustrasi paling jelas adalah membandingkan query yang sama secara konsep di dua sistem penyimpanan berbeda:\n\n1. Sistem OLTP (row storage) — petugas input satu klaim baru:\n\n```sql\n-- MySQL/InnoDB: seluruh baris ditulis sebagai satu unit\nINSERT INTO klaim (id_klaim, tanggal_klaim, nama_pasien, jumlah, status)\nVALUES (10234, '2026-07-20', 'Rina Wulandari', 2500000, 'submitted');\n```\n\n2. Sistem OLAP (columnar storage) — tim analitik mengagregasi ribuan klaim:\n\n```sql\n-- BigQuery: engine hanya menyentuh kolom jumlah dan status\nSELECT status, SUM(jumlah) AS total_klaim\nFROM laporan.klaim\nGROUP BY status;\n```\n\nPada query kedua, meskipun tabel klaim punya puluhan kolom (nama pasien, alamat, catatan dokter, dst), engine columnar hanya membaca blok data dari kolom 'jumlah' dan 'status' — kolom lain tidak pernah disentuh dari disk sama sekali.",
      en: "",
    },
    exampleEnterprise: {
      id: "PT Nusantara Asuransi menjalankan dua sistem storage berdampingan sesuai kebutuhannya: MySQL (row storage) dipakai di aplikasi front-office tempat petugas cabang menginput klaim satu per satu sepanjang hari — setiap insert harus responsif dalam hitungan milidetik. Setiap malam, data klaim direplikasi ke BigQuery (columnar storage) tempat tim analitik menjalankan laporan agregat harian atas ratusan ribu klaim untuk manajemen — query yang kalau dijalankan langsung di MySQL akan memindai seluruh tabel dan membebani sistem transaksional, tapi di BigQuery selesai dalam hitungan detik karena hanya kolom yang relevan yang dipindai.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Row storage sangat cepat untuk membaca atau menulis satu record utuh, karena semua kolomnya berdekatan secara fisik dalam satu I/O.\n- Row storage cocok untuk transaksi ACID dengan banyak insert/update kecil dan sering, seperti aplikasi operasional harian.\n- Columnar storage memberikan rasio kompresi jauh lebih tinggi karena nilai-nilai dalam satu kolom cenderung serupa.\n- Columnar storage mempercepat query agregasi pada tabel lebar secara drastis, karena hanya kolom yang di-SELECT yang dibaca dari disk.",
        en: "",
      },
      cons: {
        id: "- Row storage boros I/O saat query hanya butuh beberapa kolom dari tabel yang sangat lebar, karena tetap harus membaca seluruh baris.\n- Row storage punya rasio kompresi lebih rendah dibanding columnar karena nilai antar kolom dalam satu baris jarang mirip.\n- Columnar storage lambat untuk update atau insert satu baris, karena satu perubahan bisa berarti menulis ulang banyak segmen kolom berbeda.\n- Columnar storage tidak ideal untuk pola akses transaksional dengan volume insert/update tinggi per detik.",
        en: "",
      },
    },
  },
};
