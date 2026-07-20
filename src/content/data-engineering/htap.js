export const term = {
  id: "htap",
  track: "data-engineering",
  category: "Arsitektur",
  color: "#06b6d4",
  icon: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 0 3-3h7z",
  simulation: "htap",
  tools: ["TiDB", "SingleStore", "SAP HANA", "Google AlloyDB", "CockroachDB"],
  prerequisites: [],
  related: ["row-storage-vs-columnar"],
  name: { id: "HTAP", en: "HTAP" },
  content: {
    description: {
      id: `HTAP (Hybrid Transactional/Analytical Processing) adalah kategori database engine yang mampu menangani beban kerja transaksional (OLTP — insert/update cepat per transaksi) dan beban kerja analitik (OLAP — query agregat besar) sekaligus dalam satu sistem, tanpa perlu pipeline ETL terpisah untuk memindahkan data dari database operasional ke data warehouse. Ini relevan bagi bisnis yang butuh dashboard analitik atas data operasional yang benar-benar terkini, bukan data yang tertunda karena menunggu proses ETL berjalan.`,
      en: "",
    },
    concept: {
      id: `Bayangkan dapur restoran yang bisa mencatat pesanan pelanggan satu per satu secara cepat (transaksional) SEKALIGUS secara bersamaan menghasilkan laporan ringkasan penjualan malam itu secara real-time (analitik) — dari struk pesanan yang sama persis, tanpa harus menunggu sampai tutup toko untuk menghitung ulang semuanya secara terpisah.`,
      en: "",
    },
    methodology: {
      id: `Secara internal, engine HTAP menggabungkan row store yang dioptimalkan untuk penulisan/update individual cepat (melayani beban OLTP) dengan column store yang dioptimalkan untuk query scan dan agregat besar (melayani beban OLAP) — keduanya berjalan dalam satu engine yang sama, disinkronkan secara asynchronous atau lewat mekanisme change capture internal. Hasilnya, query analitik bisa membaca data operasional yang nyaris real-time, bukan salinan basi hasil ETL yang tertunda jam-jaman.`,
      en: "",
    },
    objective: {
      id: `HTAP hadir untuk menghilangkan jeda antara "apa yang sedang terjadi secara operasional saat ini" dan "apa yang bisa dilihat tim analitik" — banyak bisnis butuh dashboard real-time di atas data transaksional yang sedang berjalan, bukan angka dari batch load kemarin atau beberapa jam lalu.`,
      en: "",
    },
    goal: {
      id: `Hasil konkretnya adalah query analitik yang mengembalikan data operasional yang benar-benar segar (hitungan detik hingga menit), tanpa perlu membangun pipeline sinkronisasi real-time terpisah ke sebuah data warehouse.`,
      en: "",
    },
    exampleImplementation: {
      id: `Alur: Transactional Write → Row Store (OLTP) + async sync → Column Store (OLAP) → Real-time Analytics.

1. Setiap transaksi penjualan ditulis ke row store engine HTAP.
2. Engine secara internal mensinkronkan perubahan tersebut ke representasi columnar untuk keperluan analitik, tanpa campur tangan pipeline eksternal.
3. Query agregat dijalankan langsung terhadap data yang sama, dengan latensi rendah dari saat transaksi terjadi.

\`\`\`sql
-- insert transaksi (beban OLTP)
INSERT INTO penjualan (produk_id, jumlah, harga, waktu)
VALUES ('SKU-102', 3, 45000, NOW());

-- query agregat (beban OLAP) atas tabel yang sama, hampir real-time
SELECT produk_id, SUM(jumlah) AS total_terjual
FROM penjualan
WHERE waktu >= CURRENT_DATE
GROUP BY produk_id;
\`\`\``,
      en: "",
    },
    exampleEnterprise: {
      id: `Toko Meta Retail menggunakan TiDB untuk mencatat setiap transaksi penjualan secara real-time di kasir, sekaligus menjalankan query laporan agregat penjualan harian dari sistem yang sama — tanpa delay proses ETL ke data warehouse terpisah seperti pendekatan konvensional.`,
      en: "",
    },
    prosAndCons: {
      pros: {
        id: `- Menghilangkan jeda ETL antara data operasional dan data analitik.
- Menyederhanakan arsitektur karena tidak perlu database OLTP terpisah plus warehouse plus pipeline sinkronisasi.
- Memungkinkan dashboard bisnis real-time langsung dari data transaksional yang sedang berjalan.
- Mengurangi duplikasi data antara sistem operasional dan sistem analitik.`,
        en: "",
      },
      cons: {
        id: `- Kategori database yang relatif baru dan belum semapan engine OLTP atau OLAP murni yang sudah terbukti puluhan tahun.
- Bisa lebih mahal dan kompleks dioperasikan dibanding sistem khusus tunggal.
- Beban query analitik yang berat berpotensi bersaing sumber daya dengan beban transaksional jika tidak diisolasi dengan baik.
- Masih sedikit engineer yang berpengalaman melakukan tuning khusus untuk sistem HTAP.`,
        en: "",
      },
    },
  },
};
