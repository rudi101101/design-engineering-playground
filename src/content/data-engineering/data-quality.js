export const term = {
  id: "data-quality",
  track: "data-engineering",
  category: "Governance",
  color: "#14b8a6",
  icon: "M20 6L9 17l-5-5",
  simulation: "dq",
  tools: [
    "Great Expectations",
    "dbt Tests",
    "Soda Core",
    "Monte Carlo",
    "Lightup",
  ],
  prerequisites: [],
  related: ["data-observability", "data-catalog"],
  name: { id: "Data Quality (DQ)", en: "Data Quality (DQ)" },
  content: {
    description: {
      id: "Data Quality adalah disiplin memastikan data yang mengalir lewat pipeline memenuhi standar tertentu — completeness (tidak ada nilai penting yang hilang), accuracy (nilainya benar), consistency (format seragam), timeliness (data cukup segar), dan uniqueness (tidak ada duplikasi yang tidak diinginkan). Alih-alih mengandalkan analyst menemukan anomali secara manual setelah dashboard sudah salah, pendekatan modern menerapkan 'DQ as Code' — aturan kualitas ditulis sebagai kode yang dieksekusi otomatis setiap kali data baru masuk, sehingga masalah tertangkap di sumbernya sebelum menyebar ke seluruh organisasi.",
      en: "",
    },
    concept: {
      id: "Bayangkan Data Quality seperti quality control di jalur produksi pabrik. Sebelum sebuah produk dikirim ke gudang, ada stasiun pemeriksaan yang mengecek: apakah beratnya sesuai, apakah label terpasang benar, apakah tidak cacat. Produk yang gagal cek langsung dipisahkan (quarantine) dan tidak lanjut ke tahap berikutnya, sementara alarm dibunyikan untuk investigasi. Data Quality bekerja persis begitu — setiap batch data yang masuk 'diperiksa' oleh serangkaian aturan otomatis sebelum diizinkan mengalir ke layer berikutnya atau dipakai laporan bisnis.",
      en: "",
    },
    methodology: {
      id: "Implementasi DQ as Code dimulai dengan mendefinisikan 'expectations' — aturan kualitas yang ditulis sebagai kode, misalnya 'kolom NIK tidak boleh null', 'kolom jumlah harus lebih besar dari 0', atau 'claim_id harus unik'. Aturan ini disimpan di repository dan menjadi bagian dari pipeline, bukan dokumen terpisah yang mudah basi. Setelah setiap proses load data, suite pengujian ini dijalankan secara otomatis. Jika semua aturan lolos (pass), data diizinkan lanjut ke layer berikutnya secara transparan. Jika ada yang gagal (fail), sistem melakukan tiga hal sekaligus: mengarantina data yang bermasalah supaya tidak ikut terpakai, mengirim alert ke tim terkait, dan memblokir proses downstream yang bergantung pada data tersebut supaya kesalahan tidak menjalar.",
      en: "",
    },
    objective: {
      id: "Masalah yang diselesaikan DQ adalah 'garbage in, garbage out' yang baru ketahuan setelah kerusakan menyebar — laporan finansial yang salah, model machine learning yang dilatih dari data cacat, atau keputusan bisnis yang diambil dari angka yang keliru. Tanpa validasi otomatis, kualitas data bergantung pada ketelitian manual yang tidak konsisten dan lambat. DQ as Code menggeser deteksi masalah sedekat mungkin ke sumbernya, sehingga biaya perbaikan jauh lebih murah dibanding memperbaiki laporan yang sudah terlanjur dipakai eksekutif.",
      en: "",
    },
    goal: {
      id: "Setiap dataset kritis punya suite pengujian kualitas yang berjalan otomatis di setiap load, dengan tingkat kegagalan yang terpantau dan tren membaik dari waktu ke waktu — hasil akhirnya adalah data yang sampai ke dashboard dan model bisa dipercaya tanpa perlu verifikasi manual berulang.",
      en: "",
    },
    exampleImplementation: {
      id: "Menggunakan Great Expectations, tim data engineering mendefinisikan suite validasi untuk tabel klaim asuransi lalu menjalankannya sebagai step wajib di pipeline:\n\n1. **Data arrives** — file batch klaim harian tiba di staging area.\n2. **Run DQ rules** — suite expectation dieksekusi terhadap data staging.\n3. **Pass** — data lanjut ke tabel produksi (layer berikutnya).\n4. **Fail** — data dikarantina, tim on-call menerima alert, dan job downstream dihentikan.\n\nContoh definisi expectation:\n\n```python\nimport great_expectations as gx\n\nvalidator = gx.get_validator(batch_request=claims_batch)\n\nvalidator.expect_column_values_to_not_be_null(\"national_id\")\nvalidator.expect_column_values_to_be_between(\"claim_amount\", min_value=0)\nvalidator.expect_column_values_to_match_strftime_format(\n    \"claim_date\", \"%Y-%m-%d\"\n)\nvalidator.expect_column_values_to_be_unique(\"claim_id\")\n\nresult = validator.validate()\nif not result.success:\n    raise ValueError(\"DQ check failed — quarantining batch\")\n```\n\nJika salah satu expectation gagal, pipeline berhenti sebelum data cacat mencapai tabel yang dipakai laporan.",
      en: "",
    },
    exampleEnterprise: {
      id: "Klinika Sehat, penyedia layanan asuransi kesehatan, menjalankan Great Expectations untuk memvalidasi setiap batch klaim yang masuk dari mitra rumah sakit. Aturan yang dijalankan mencakup: NIK peserta tidak boleh kosong, jumlah klaim harus lebih dari nol, format tanggal harus ISO 8601, dan tidak boleh ada claim_id duplikat. Sebelum menerapkan DQ as Code, tim finance sering menemukan klaim dengan tanggal salah format hanya setelah laporan bulanan selesai dibuat dan harus direvisi ulang. Setelah DQ diterapkan, batch bermasalah otomatis dikarantina dan tim operasional menerima notifikasi dalam hitungan menit, jauh sebelum data itu sempat memengaruhi laporan keuangan.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Masalah kualitas data tertangkap di sumbernya, jauh sebelum menyebar ke dashboard atau model\n- Aturan kualitas tersimpan sebagai kode versi-terkontrol, bukan pengetahuan tacit yang mudah hilang\n- Otomasi menghilangkan ketergantungan pada pengecekan manual yang lambat dan tidak konsisten\n- Quarantine dan block downstream mencegah efek domino dari satu batch data yang cacat",
        en: "",
      },
      cons: {
        id: "- Menulis dan memelihara expectation membutuhkan effort awal yang tidak sedikit, terutama untuk dataset kompleks\n- Aturan yang terlalu ketat bisa menghasilkan false alarm dan memblokir pipeline yang sebetulnya sah\n- Tidak menjamin akurasi semantik — data bisa lolos semua aturan format tapi tetap salah secara bisnis\n- Menambah latensi pipeline karena setiap load harus melewati tahap validasi tambahan",
        en: "",
      },
    },
  },
};
