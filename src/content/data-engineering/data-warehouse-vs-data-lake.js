export const term = {
  id: "data-warehouse-vs-data-lake",
  track: "data-engineering",
  category: "Arsitektur",
  color: "#14b8a6",
  icon: "M21 5c0 1.66-4 3-9 3S3 6.66 3 5m18 0c0-1.66-4-3-9-3S3 3.34 3 5m18 0v14c0 1.66-4 3-9 3s-9-1.34-9-3V5",
  simulation: "dwlake",
  tools: ["BigQuery (DWH)", "Snowflake (DWH)", "GCS (Lake)", "S3 (Lake)", "ADLS (Lake)"],
  prerequisites: [],
  related: ["data-lakehouse", "schema-on-read-vs-schema-on-write"],
  name: { id: "Data Warehouse vs Data Lake", en: "Data Warehouse vs Data Lake" },
  content: {
    description: {
      id: `Data Warehouse dan Data Lake adalah dua paradigma penyimpanan data yang fundamental dan sering disandingkan. Data Warehouse bersifat structured, schema-on-write, dioptimalkan untuk query SQL — akurat dan cepat tapi relatif rigid terhadap perubahan. Data Lake bersifat format bebas, schema-on-read, mampu menyimpan semua jenis data — sangat fleksibel tapi butuh governance yang kuat agar tidak berubah menjadi "data swamp" yang sulit dipercaya. Memahami kapan memakai yang mana (atau menggabungkan keduanya) adalah keputusan arsitektural mendasar dalam merancang platform data apa pun.`,
      en: "",
    },
    concept: {
      id: `Data Warehouse ibarat perpustakaan dengan sistem katalogisasi ketat: setiap buku harus diklasifikasikan dan diletakkan di rak yang benar sebelum boleh masuk, sehingga mencari apa pun jadi cepat dan bisa diandalkan. Data Lake ibarat gudang penyimpanan besar tempat kamu bisa menaruh kardus apa saja dalam format apa pun begitu tiba — cepat disimpan, tapi kamu baru benar-benar tahu isinya dan cara mengorganisasinya saat ada yang datang mencari sesuatu yang spesifik.`,
      en: "",
    },
    methodology: {
      id: `Pipeline Data Warehouse: ETL mentransformasi dan memvalidasi data ke skema yang sudah ditentukan sebelum data dimuat — data yang tidak sesuai skema akan ditolak atau harus diperbaiki dulu. Pipeline Data Lake: data mentah langsung diingest dalam format aslinya, dan skema baru diterapkan saat query dijalankan (schema-on-read) — jauh lebih fleksibel untuk data semi-terstruktur, tidak terstruktur, atau data yang kegunaannya belum diketahui di masa depan, tapi beban interpretasi dan validasi data bergeser ke pihak yang query belakangan.`,
      en: "",
    },
    objective: {
      id: `Tidak ada satu pendekatan yang cukup untuk semua kebutuhan — Data Warehouse ada untuk melayani pelaporan BI yang andal, cepat, dan terstruktur, sementara Data Lake ada karena memaksa semua data (log, gambar, JSON, data sensor) masuk ke skema kaku sebelum disimpan sering kali tidak mungkin atau boros. Memilih (atau menggabungkan keduanya, misalnya lewat Data Lakehouse) tergantung pada kebutuhan spesifik use case.`,
      en: "",
    },
    goal: {
      id: `Hasil yang dicapai adalah memilih paradigma penyimpanan yang tepat per beban kerja — pelaporan terstruktur yang cepat dan bisa dipercaya dari warehouse, serta retensi data mentah yang murah dan fleksibel (untuk ML, reprocessing di masa depan, atau pertanyaan yang belum diketahui) dari data lake.`,
      en: "",
    },
    exampleImplementation: {
      id: `Ilustrasi pemisahan tanggung jawab dua sistem:

DWH: ETL → Schema Terdefinisi → Load → Query
Lake: Ingest Raw → Schema-on-read → Query

\`\`\`sql
-- Data Warehouse: tabel dengan skema ketat, ditolak jika kolom tidak sesuai
CREATE TABLE dwh.laporan_keuangan (
  periode DATE NOT NULL,
  total_pendapatan DECIMAL(18,2) NOT NULL,
  total_biaya DECIMAL(18,2) NOT NULL
);

-- Data Lake: cukup simpan file mentah apa adanya, skema baru dipakai saat query
-- gs://data-lake-raw/klaim/2026/07/klaim_batch_0001.json
\`\`\``,
      en: "",
    },
    exampleEnterprise: {
      id: `Bank Digital Nusa memakai BigQuery sebagai data warehouse untuk laporan keuangan resmi yang butuh akurasi dan struktur ketat, sementara Google Cloud Storage dipakai sebagai data lake untuk menyimpan seluruh data mentah dari berbagai sumber sebelum diproses lebih lanjut oleh tim data engineering.`,
      en: "",
    },
    prosAndCons: {
      pros: {
        id: `- Warehouse cocok untuk laporan bisnis yang butuh akurasi dan kecepatan query SQL tinggi.
- Lake cocok untuk menyimpan data mentah dalam volume besar dengan biaya rendah tanpa perlu desain skema di awal.
- Memahami keduanya membantu tim memilih arsitektur yang tepat sesuai kebutuhan, alih-alih memaksakan satu pendekatan untuk semua kasus.
- Keduanya bisa dipakai bersamaan sebagai pelengkap dalam satu platform data.`,
        en: "",
      },
      cons: {
        id: `- Warehouse bersifat rigid — perubahan skema atau data yang tidak sesuai bisa ditolak atau butuh proses migrasi ulang.
- Lake tanpa governance yang baik gampang berubah jadi "data swamp" yang sulit ditemukan dan dipercaya isinya.
- Menjalankan keduanya secara terpisah berarti duplikasi data dan pipeline tambahan untuk sinkronisasi antar sistem.
- Tim perlu keahlian berbeda untuk mengelola masing-masing — SQL/ETL untuk warehouse, manajemen format file dan katalog untuk lake.`,
        en: "",
      },
    },
  },
};
