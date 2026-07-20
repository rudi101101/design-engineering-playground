export const term = {
  id: "feature-store",
  track: "data-engineering",
  category: "Modern/ML",
  color: "#8b5cf6",
  icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4l3 3",
  simulation: "featurestore",
  tools: ["Vertex AI Feature Store", "Feast", "Tecton", "Hopsworks", "AWS SageMaker FS"],
  prerequisites: [],
  related: ["vector-database"],
  name: { id: "Feature Store", en: "Feature Store" },
  content: {
    description: {
      id: "Feature Store adalah platform khusus untuk menyimpan, mengelola, dan menyajikan feature (variabel input) untuk model machine learning. Masalah yang ia selesaikan sangat konkret: tim data science sering menghitung feature yang sama berulang-ulang di notebook berbeda, dengan logika yang sedikit berbeda antara waktu training dan waktu inference — akibatnya model yang bagus saat training bisa berperforma buruk saat live karena feature yang dihitung saat serving tidak identik dengan yang dipakai saat training. Feature Store memusatkan definisi dan komputasi feature sehingga satu definisi \"avg_transaksi_30_hari\" dipakai konsisten oleh model fraud, churn, dan recommendation sekaligus.",
      en: "",
    },
    concept: {
      id: "Bayangkan Feature Store seperti dapur pusat sebuah restoran cepat saji dengan banyak cabang. Alih-alih setiap cabang (setiap model ML) meracik saus rahasia mereka sendiri dengan resep yang sedikit berbeda-beda, dapur pusat membuat satu batch saus standar yang dikirim ke semua cabang — rasanya selalu sama, entah dimakan pagi (training) atau malam (serving). Feature Store adalah dapur pusat itu: sekali feature didefinisikan dan dihitung, semua model \"memesan\" feature yang sama tanpa harus meracik ulang dari bahan mentah.",
      en: "",
    },
    methodology: {
      id: "Feature Store bekerja dengan dua penyimpanan yang saling melengkapi. Offline store menyimpan feature dalam volume besar dengan histori panjang, biasanya di BigQuery atau file Parquet, dipakai untuk training model yang butuh jutaan baris data historis. Online store menyimpan versi terbaru dari feature yang sama dengan latency sangat rendah (milidetik), biasanya di Redis atau Bigtable, dipakai saat model melakukan prediksi real-time — misalnya saat transaksi sedang diproses dan sistem butuh skor fraud dalam hitungan milidetik. Feature pipeline bertugas menjaga kedua store ini tetap sinkron: setiap kali data mentah baru masuk, pipeline menghitung ulang feature dan menulis ke offline store sekaligus meng-update online store, sehingga tidak ada training-serving skew.",
      en: "",
    },
    objective: {
      id: "Tujuan utama Feature Store adalah menghilangkan training-serving skew — perbedaan halus antara feature yang dipakai saat model dilatih dengan feature yang dihitung saat model dipakai di produksi, yang merupakan salah satu penyebab paling umum model ML gagal di dunia nyata meski sudah lolos evaluasi offline. Selain itu ia mendorong reusability: feature yang mahal dihitung (misalnya agregasi transaksi 30 hari terakhir) hanya dihitung sekali dan dipakai ulang lintas tim dan lintas model, bukan diduplikasi di setiap proyek.",
      en: "",
    },
    goal: {
      id: "Hasil yang dicapai: satu definisi feature yang identik dipakai secara konsisten di training dan serving, waktu pengembangan model baru berkurang karena feature yang sudah ada tinggal dipakai ulang, dan latency serving feature untuk inference real-time bisa ditekan hingga level milidetik lewat online store.",
      en: "",
    },
    exampleImplementation: {
      id: "Alur kerja tipikal Feature Store:\n\n1. Raw data (transaksi, klik, profil user) masuk ke feature pipeline.\n2. Pipeline menghitung feature terdefinisi, misalnya `avg_transaksi_30d`.\n3. Hasil ditulis ke offline store (untuk training) dan online store (untuk serving) secara bersamaan.\n4. Model ML membaca dari salah satu store tergantung konteks pemakaian.\n\nContoh definisi feature dengan Feast:\n\n```yaml\nfeature_view:\n  name: user_transaction_features\n  entities:\n    - user_id\n  ttl: 30d\n  features:\n    - name: avg_transaksi_30d\n      dtype: FLOAT\n    - name: jumlah_transaksi_30d\n      dtype: INT64\n  online: true\n  batch_source:\n    path: bq://project.dataset.user_transactions\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Fintech Cepat menggunakan Vertex AI Feature Store untuk menghitung feature `avg_transaksi_30d` sekali saja dari data transaksi mentah. Feature ini kemudian dipakai oleh tiga model berbeda: model deteksi fraud saat transaksi berlangsung, model prediksi churn pelanggan yang dijalankan mingguan, dan model rekomendasi produk yang berjalan harian. Sebelum ada Feature Store, tim data science masing-masing model menghitung metrik serupa dengan query SQL yang sedikit berbeda, menyebabkan tiga model punya definisi \"rata-rata transaksi\" yang tidak konsisten satu sama lain — setelah migrasi, semua model menggunakan angka yang identik.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Menghilangkan training-serving skew karena definisi feature terpusat dan konsisten\n- Feature yang mahal dihitung bisa dipakai ulang lintas banyak model, menghemat kompute dan waktu pengembangan\n- Online store memungkinkan serving feature dengan latency milidetik untuk kebutuhan inference real-time\n- Mempermudah kolaborasi karena tim data science punya katalog feature yang bisa dicari dan dipakai bersama",
        en: "",
      },
      cons: {
        id: "- Menambah kompleksitas infrastruktur karena harus mengelola dua sistem penyimpanan (offline dan online) yang harus tetap sinkron\n- Butuh investasi awal yang tidak kecil, biasanya baru sepadan jika organisasi punya banyak model ML aktif\n- Latency sinkronisasi antara offline dan online store bisa menyebabkan feature online sedikit tertinggal (staleness)\n- Menambah satu lagi sistem yang harus dipantau dan di-maintain oleh tim data/ML engineering",
        en: "",
      },
    },
  },
};
