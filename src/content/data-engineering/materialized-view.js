export const term = {
  id: "materialized-view",
  track: "data-engineering",
  category: "Performa",
  color: "#f59e0b",
  icon: "M2 3h20v14H2zM8 21h8M12 17v4",
  simulation: "mv",
  tools: [
    "BigQuery Materialized View",
    "Snowflake Dynamic Tables",
    "PostgreSQL MV",
    "dbt incremental",
  ],
  prerequisites: ["view-vs-materialized-view"],
  related: ["query-optimization-explain", "caching"],
  name: { id: "Materialized View", en: "Materialized View" },
  content: {
    description: {
      id: "Materialized View adalah view yang hasil kueri kompleksnya dihitung terlebih dahulu (precomputed) dan disimpan secara fisik di storage, alih-alih dihitung ulang setiap kali ada permintaan seperti view biasa. Konsep ini adalah trade-off eksplisit antara storage dan kecepatan kueri: Anda membayar ruang penyimpanan tambahan dan kompleksitas refresh, tapi mendapat kecepatan baca yang jauh lebih tinggi untuk kueri agregasi berat yang sering diakses berulang kali, seperti ringkasan penjualan harian atau dashboard metrik bisnis.",
      en: "",
    },
    concept: {
      id: "Bayangkan Materialized View seperti meal prep di awal minggu. Alih-alih memasak dari nol setiap kali lapar (seperti view biasa yang menghitung ulang setiap kueri), Anda menyiapkan dan menyimpan beberapa porsi makanan matang di kulkas pada akhir pekan. Ketika lapar di tengah minggu, Anda tinggal memanaskan makanan yang sudah jadi — jauh lebih cepat daripada memasak dari bahan mentah setiap kali. Trade-off-nya jelas: butuh ruang kulkas (storage) dan makanan bisa jadi sedikit basi kalau tidak sering disegarkan (data bisa sedikit tertinggal dari sumber aslinya).",
      en: "",
    },
    methodology: {
      id: "Setelah sebuah Materialized View didefinisikan, sistem melakukan initial build — menjalankan kueri dasarnya sekali dan menyimpan hasilnya secara fisik. Selanjutnya, alih-alih membangun ulang seluruh hasil dari nol setiap kali data sumber berubah, sistem modern menjalankan refresh incremental — hanya menghitung dan menambahkan delta (perubahan baru) sejak refresh terakhir, jauh lebih efisien dibanding full rebuild. Refresh ini bisa dijadwalkan berkala (misalnya tiap jam) atau dipicu otomatis saat data sumber berubah. Bagian yang membuat Materialized View terasa 'ajaib' bagi pengguna adalah query optimizer secara otomatis me-routing kueri ke Materialized View yang cocok jika strukturnya sesuai dengan kueri yang diminta, sepenuhnya transparan — pengguna tetap menulis kueri terhadap tabel asli, tapi di baliknya sistem menjawab dari hasil precomputed yang jauh lebih cepat.",
      en: "",
    },
    objective: {
      id: "Masalah yang diselesaikan Materialized View adalah biaya komputasi berulang dari kueri agregasi berat yang sering diakses — misalnya dashboard yang di-refresh ratusan kali sehari oleh berbagai pengguna, padahal kueri dasarnya menghitung ulang jutaan baris setiap kali. Tanpa precompute, setiap load dashboard membebani mesin kueri dan pengguna menunggu lama. Materialized View memindahkan biaya komputasi dari 'saat dibaca' menjadi 'saat data berubah', yang jauh lebih jarang terjadi dibanding jumlah pembacaan.",
      en: "",
    },
    goal: {
      id: "Kueri agregasi yang sebelumnya butuh puluhan detik untuk dihitung dari tabel mentah bisa dijawab dalam hitungan milidetik lewat Materialized View, dengan kesegaran data yang tetap terjaga lewat jadwal refresh yang sesuai kebutuhan bisnis (near real-time hingga harian, tergantung use case).",
      en: "",
    },
    exampleImplementation: {
      id: "Alur penerapan Materialized View di BigQuery untuk dashboard operasional:\n\n1. **Define MV** — mendefinisikan view agregasi klaim harian per cabang.\n2. **Initial build** — sistem menghitung dan menyimpan hasil agregasi pertama kali.\n3. **Schedule incremental refresh** — refresh delta dijadwalkan berjalan tiap jam.\n4. **Query hits MV** — dashboard mengirim kueri seperti biasa ke tabel dasar.\n5. **Return pre-computed result** — optimizer secara transparan mengarahkan kueri ke MV, hasil dikembalikan hampir instan.\n\nContoh definisi:\n\n```sql\nCREATE MATERIALIZED VIEW claims_daily_summary\nOPTIONS (\n  enable_refresh = true,\n  refresh_interval_minutes = 60\n)\nAS\nSELECT\n  branch_id,\n  DATE(claim_date) AS claim_day,\n  COUNT(*) AS total_claims,\n  SUM(claim_amount) AS total_amount\nFROM claims_raw\nGROUP BY branch_id, claim_day;\n```\n\nSetelah dibuat, kueri terhadap `claims_raw` yang polanya cocok dengan agregasi ini akan otomatis dijawab lewat `claims_daily_summary` tanpa perlu mengubah kueri aplikasi.",
      en: "",
    },
    exampleEnterprise: {
      id: "Klinika Sehat memiliki dashboard operasional yang menampilkan agregasi harian jumlah dan nilai klaim per cabang untuk 200 cabang di seluruh Indonesia. Sebelum menggunakan Materialized View, setiap kali dashboard dimuat, kueri agregasi terhadap tabel klaim mentah yang berukuran puluhan juta baris membutuhkan sekitar 10 detik — pengalaman yang buruk bagi manajer cabang yang mengecek dashboard berkali-kali sehari. Setelah membuat Materialized View dengan refresh otomatis tiap jam, dashboard yang sama dimuat hampir instan karena hanya membaca hasil yang sudah dihitung sebelumnya, sementara data tetap cukup segar untuk kebutuhan monitoring operasional harian.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Mempercepat kueri agregasi berat secara dramatis karena hasil sudah dihitung sebelumnya\n- Refresh incremental jauh lebih efisien dibanding menghitung ulang seluruh dataset setiap kali\n- Routing otomatis oleh query optimizer membuatnya transparan — aplikasi tidak perlu diubah untuk memanfaatkan percepatan ini\n- Mengurangi beban komputasi berulang pada mesin kueri, menghemat biaya pada platform berbasis bayar-per-kueri",
        en: "",
      },
      cons: {
        id: "- Menambah biaya storage karena hasil kueri disimpan secara fisik, berlipat untuk setiap MV yang dibuat\n- Data di Materialized View bisa sedikit tertinggal (stale) dari sumber aslinya tergantung jadwal refresh, tidak cocok untuk kasus yang butuh data real-time murni\n- Menambah kompleksitas operasional — perlu memantau job refresh dan menangani kegagalannya\n- Tidak semua kueri bisa memanfaatkan MV secara otomatis; kueri yang polanya tidak cocok tetap harus menghitung dari tabel dasar",
        en: "",
      },
    },
  },
};
