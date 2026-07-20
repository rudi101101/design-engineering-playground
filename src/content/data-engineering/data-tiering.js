export const term = {
  id: "data-tiering",
  track: "data-engineering",
  category: "Storage & Format",
  color: "#22d3ee",
  icon: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  simulation: "tiering",
  tools: ["GCS Lifecycle", "AWS S3 Intelligent-Tiering", "Azure Blob Tiers", "BigQuery Long-term"],
  prerequisites: [],
  related: ["object-vs-block-vs-file-storage"],
  name: { id: "Data Tiering — Hot, Warm, Cold", en: "Data Tiering — Hot, Warm, Cold" },
  content: {
    description: {
      id: "Data Tiering adalah strategi menyimpan data pada tingkatan (tier) storage yang berbeda-beda berdasarkan seberapa sering data itu diakses, dengan tujuan menyeimbangkan kecepatan akses dan biaya penyimpanan. Data yang sering diakses (hot) disimpan di media cepat namun mahal seperti SSD, data yang jarang diakses (warm) dipindah ke media lebih murah seperti HDD standar, dan data yang nyaris tidak pernah diakses lagi (cold) diarsipkan ke storage paling murah meski dengan latensi akses yang jauh lebih tinggi. Strategi ini sangat relevan karena mayoritas data operasional punya pola akses yang menurun tajam seiring bertambahnya usia data.",
      en: "",
    },
    concept: {
      id: "Bayangkan lemari pakaian di rumah. Baju yang dipakai setiap minggu diletakkan di lemari utama yang mudah dijangkau (hot). Baju musiman yang cuma dipakai beberapa kali setahun disimpan di kotak di gudang (warm) — masih bisa diambil, tapi butuh usaha lebih. Baju kenangan yang hampir tidak pernah dipakai lagi disimpan di kardus tersegel di loteng (cold) — makan tempat sedikit dan murah menyimpannya, tapi mengambilnya butuh waktu dan usaha ekstra. Menyimpan semua baju di lemari utama akan cepat penuh dan mahal ruangnya; menyimpan semua di loteng akan membuat baju harian sulit dijangkau.",
      en: "",
    },
    methodology: {
      id: "Sebuah lifecycle policy dikonfigurasi untuk memindahkan data secara otomatis berdasarkan usia atau frekuensi akses tanpa campur tangan manual. Data yang baru dibuat masuk ke tier hot (misalnya tabel aktif di BigQuery atau SSD). Setelah melewati ambang usia tertentu tanpa banyak diakses, sistem otomatis memindahkannya ke tier warm (misalnya GCS Standard). Setelah usia bertambah lagi dan akses semakin jarang, data dipindah lagi ke tier cold/archive (misalnya GCS Archive), yang biayanya jauh lebih murah namun waktu untuk mengambil kembali datanya (retrieval time) jauh lebih lambat.",
      en: "",
    },
    objective: {
      id: "Menyimpan seluruh data historis selamanya di tier tercepat dan termahal jelas tidak efisien secara biaya, terutama karena kebanyakan data operasional — seperti klaim atau transaksi — hanya sering diakses dalam beberapa minggu atau bulan pertama setelah dibuat, lalu aksesnya menurun drastis. Data tiering ada untuk mencocokkan biaya penyimpanan dengan nilai aktual data terhadap bisnis pada suatu titik waktu, tanpa harus menghapus data yang mungkin masih dibutuhkan untuk kepatuhan atau audit di masa depan.",
      en: "",
    },
    goal: {
      id: "Hasil konkretnya adalah penghematan biaya storage yang signifikan — dalam kasus umum, memindahkan data berusia lebih dari setahun ke tier archive bisa memangkas biaya penyimpanan data tersebut hingga 90% dibanding tetap disimpan di tier hot, sambil tetap menjaga data itu bisa diakses kembali bila benar-benar dibutuhkan.",
      en: "",
    },
    exampleImplementation: {
      id: "Contoh konfigurasi lifecycle policy pada Google Cloud Storage yang memindahkan data secara bertahap:\n\n```json\n{\n  \"lifecycle\": {\n    \"rule\": [\n      {\n        \"action\": { \"type\": \"SetStorageClass\", \"storageClass\": \"NEARLINE\" },\n        \"condition\": { \"age\": 30 }\n      },\n      {\n        \"action\": { \"type\": \"SetStorageClass\", \"storageClass\": \"ARCHIVE\" },\n        \"condition\": { \"age\": 365 }\n      }\n    ]\n  }\n}\n```\n\nDengan konfigurasi ini, objek yang berusia lebih dari 30 hari otomatis turun ke tier Nearline (warm), dan yang berusia lebih dari setahun otomatis turun lagi ke tier Archive (cold) — semua tanpa intervensi manual.",
      en: "",
    },
    exampleEnterprise: {
      id: "Fintech Cepat menerapkan kebijakan tiering pada data klaim asuransi mikronya: klaim berusia 0-30 hari tetap berada di BigQuery sebagai tier hot karena tim operasional dan customer service masih sering mengaksesnya. Klaim berusia 30 hari sampai satu tahun dipindah ke GCS Standard sebagai tier warm untuk kebutuhan pelaporan berkala. Klaim berusia lebih dari satu tahun diarsipkan ke GCS Archive sebagai tier cold, tetap tersimpan untuk keperluan audit regulator namun dengan biaya penyimpanan sekitar 90% lebih murah dibanding tetap berada di BigQuery.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Memangkas biaya storage secara signifikan untuk data lama yang jarang diakses, tanpa perlu menghapusnya.\n- Bisa diotomatiskan penuh lewat lifecycle policy, tidak butuh proses manual berulang.\n- Tetap menjaga data tersedia untuk kebutuhan audit atau kepatuhan regulasi jangka panjang.\n- Fleksibel — jumlah dan ambang batas tier bisa disesuaikan dengan pola akses spesifik tiap organisasi.",
        en: "",
      },
      cons: {
        id: "- Mengambil kembali data dari tier cold/archive punya latensi jauh lebih tinggi, kadang butuh waktu jam-an, tidak cocok untuk kebutuhan mendadak.\n- Kesalahan menentukan ambang usia pemindahan bisa memindahkan data yang ternyata masih sering diakses ke tier lambat.\n- Beberapa provider mengenakan biaya retrieval tambahan saat data di tier cold diakses kembali, di luar biaya penyimpanan bulanan.\n- Menambah kompleksitas arsitektur karena tim harus memahami di tier mana data tertentu berada saat troubleshooting.",
        en: "",
      },
    },
  },
};
