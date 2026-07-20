export const term = {
  id: "batch-processing",
  track: "data-engineering",
  category: "Pipeline",
  color: "#10b981",
  icon: "M2 7h20M2 12h20M2 17h20",
  simulation: "batch",
  tools: ["Apache Spark", "Apache Hive", "Hadoop MapReduce", "Dataproc", "AWS Glue"],
  prerequisites: [],
  related: ["stream-processing"],
  name: { id: "Batch Processing", en: "Batch Processing" },
  content: {
    description: {
      id: `Batch Processing adalah pendekatan di mana data dikumpulkan dulu selama periode tertentu (per jam atau per hari), lalu diproses sekaligus sebagai satu job besar — berbeda dengan stream processing yang memproses data secara kontinu saat mengalir. Pendekatan ini menukar sedikit latensi demi throughput yang lebih tinggi, operasional yang lebih sederhana, dan lebih mudah dinalar kebenarannya karena bekerja di atas dataset yang sudah lengkap dan tetap (tidak berubah-ubah saat diproses).`,
      en: "",
    },
    concept: {
      id: `Bayangkan mencuci baju sekali sehari dengan mesin cuci penuh muatan, dibanding mencuci satu kaus kaki setiap kali kotor. Cara kedua lebih instan, tapi cara pertama jauh lebih efisien per unit usaha dan jauh lebih sederhana untuk dikelola — itulah esensi batch processing dibanding stream processing.`,
      en: "",
    },
    methodology: {
      id: `Job batch dipicu berdasarkan jadwal tetap (misalnya trigger mirip cron) atau berdasarkan ambang batas volume data yang terkumpul. Engine seperti Spark atau Hive kemudian membaca seluruh dataset yang terkumpul sekaligus, menerapkan transformasi ke seluruh set data itu dalam satu proses, lalu menulis hasilnya. Pendekatan ini efisien untuk volume besar karena bisa melakukan optimasi bulk I/O dan pemrosesan atas konteks dataset penuh, namun secara inheren memperkenalkan latensi karena hasil baru tersedia setelah seluruh job selesai.`,
      en: "",
    },
    objective: {
      id: `Batch Processing hadir untuk kebutuhan pemrosesan data volume besar secara efisien dan berbiaya rendah, di mana mendapatkan hasil dalam hitungan detik bukanlah kebutuhan utama — menjalankan satu job besar yang teroptimasi jauh lebih murah dan sederhana dibanding memaksakan semuanya lewat pipeline streaming yang kontinu.`,
      en: "",
    },
    goal: {
      id: `Hasilnya adalah pemrosesan dataset besar yang andal dan hemat biaya pada jadwal yang bisa diprediksi, dengan proses rerun atau backfill yang mudah jika terjadi kegagalan, dengan konsekuensi hasil hanya tersedia setelah window batch tersebut selesai.`,
      en: "",
    },
    exampleImplementation: {
      id: `Alur: Accumulate Data (hour/day) → Schedule Trigger → Spark Job reads all → Transform → Write Output.

1. Data terkumpul sepanjang hari di storage sementara (misal staging table atau file harian).
2. Job batch terjadwal berjalan setiap dini hari membaca seluruh data hari itu.
3. Spark menjalankan transformasi atas seluruh dataset sekaligus, lalu menulis hasil ke data mart.

\`\`\`python
# ilustrasi job batch harian dengan PySpark
df = spark.read.parquet("gs://raw-data/klaim/2026-07-19/")
hasil = (df.groupBy("cabang")
           .agg(F.sum("jumlah_klaim").alias("total_klaim")))
hasil.write.mode("overwrite").parquet("gs://mart/klaim_harian/2026-07-19/")
\`\`\``,
      en: "",
    },
    exampleEnterprise: {
      id: `Asuransi Lindung Sejahtera menjalankan Spark job setiap jam 01.00 dini hari untuk memproses seluruh transaksi klaim hari sebelumnya sekaligus, kemudian memuat hasilnya ke data mart agar siap dipakai untuk laporan pagi tim manajemen.`,
      en: "",
    },
    prosAndCons: {
      pros: {
        id: `- Efisien untuk volume data besar karena bisa melakukan optimasi bulk I/O dan konteks dataset penuh.
- Lebih sederhana untuk dinalar, di-debug, dan dijalankan ulang dibanding pipeline streaming.
- Umumnya lebih hemat biaya infrastruktur karena tidak perlu berjalan terus-menerus.
- Tooling sudah matang dan sangat dipahami luas (Spark, Hive) oleh komunitas data engineering.`,
        en: "",
      },
      cons: {
        id: `- Ada latensi inheren — hasil baru tersedia setelah seluruh window batch selesai diproses.
- Tidak cocok untuk use case yang butuh reaksi real-time terhadap data.
- Kegagalan satu job bisa menunda seluruh data downstream untuk siklus tersebut.
- Memproses ulang volume historis yang besar bisa lambat dan mahal jika logika bisnisnya berubah.`,
        en: "",
      },
    },
  },
};
