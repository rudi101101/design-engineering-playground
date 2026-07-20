export const term = {
  id: "stream-processing",
  track: "data-engineering",
  category: "Pipeline",
  color: "#14b8a6",
  icon: "M22 12h-4l-3 9L9 3l-3 9H2",
  simulation: "stream",
  tools: ["Apache Flink", "Google Dataflow", "Spark Streaming", "Kafka Streams", "Bytewax"],
  prerequisites: [],
  related: ["batch-processing", "message-queue-event-streaming"],
  name: { id: "Stream Processing", en: "Stream Processing" },
  content: {
    description: {
      id: `Stream Processing adalah paradigma pemrosesan data yang menghitung data secara kontinu saat ia mengalir masuk, bukan mengumpulkannya dulu lalu memproses belakangan seperti batch. Ini memungkinkan latensi rendah dan komputasi yang terus-menerus, cocok untuk kasus penggunaan yang membutuhkan hasil dalam hitungan detik sejak sebuah event terjadi — sesuatu yang secara struktural tidak bisa dipenuhi oleh pemrosesan batch.`,
      en: "",
    },
    concept: {
      id: `Bayangkan menonton siaran langsung pertandingan olahraga dan bereaksi terhadap setiap momen saat itu juga (stream processing), dibandingkan menonton kompilasi highlight yang baru disusun setelah pertandingan selesai (batch processing). Kamu tidak bisa "menunggu sampai pertandingan usai" kalau kamu perlu memperingatkan seseorang tepat saat sesuatu terjadi.`,
      en: "",
    },
    methodology: {
      id: `Event mengalir melalui strategi windowing — tumbling window (jendela waktu tetap, tidak overlap), sliding window (jendela yang saling tumpang tindih), dan session window (dikelompokkan berdasarkan jeda aktivitas) — untuk mengelompokkan stream data yang tak terbatas menjadi potongan-potongan yang bisa dihitung. Mekanisme watermark menangani data yang datang terlambat atau tidak berurutan. Operasinya bisa bersifat stateless (filter/map sederhana per event) atau stateful (agregasi, join antar event sepanjang waktu).`,
      en: "",
    },
    objective: {
      id: `Stream Processing hadir untuk memenuhi kebutuhan latensi yang secara struktural tidak bisa dipenuhi batch processing — beberapa keputusan (memblokir transaksi fraud, alert keselamatan, dashboard live) harus terjadi dalam hitungan detik sejak event terjadi, bukan menunggu job batch berikutnya berjalan berjam-jam kemudian.`,
      en: "",
    },
    goal: {
      id: `Hasilnya adalah latensi sub-detik hingga beberapa detik antara sebuah event terjadi dan sistem bereaksi/mengirim alert atasnya, dengan korektnya hasil tetap terjaga bahkan untuk event yang datang terlambat atau tidak berurutan berkat mekanisme watermark.`,
      en: "",
    },
    exampleImplementation: {
      id: `Alur: Event Source → Message Queue → Window → Aggregate/Join/Filter → Emit → Sink.

1. Event dikirim dari source (misalnya GPS kendaraan) ke message queue seperti Pub/Sub.
2. Stream processor (Dataflow/Flink) membaca event dan mengelompokkannya dalam window waktu tertentu.
3. Dalam window tersebut dilakukan agregasi/filter, lalu hasilnya di-emit ke sink (database, alert system).

\`\`\`python
# ilustrasi windowing pada Apache Beam / Dataflow
(events
 | "Window" >> beam.WindowInto(window.SlidingWindows(size=60, period=10))
 | "DeteksiAnomali" >> beam.Filter(lambda e: e.kecepatan > BATAS_KECEPATAN)
 | "KirimAlert" >> beam.Map(kirim_notifikasi))
\`\`\``,
      en: "",
    },
    exampleEnterprise: {
      id: `PT Armada Nusantara mengirim data GPS kendaraan mereka melalui Pub/Sub ke Dataflow, yang memicu alert real-time ketika sebuah kendaraan keluar dari area geofence yang ditentukan atau terdeteksi kecepatan yang tidak wajar.`,
      en: "",
    },
    prosAndCons: {
      pros: {
        id: `- Reaksi terhadap event nyaris instan, dalam hitungan detik sejak event terjadi.
- Memungkinkan use case yang mustahil dilakukan dengan batch, seperti alerting langsung atau pemblokiran fraud real-time.
- Menangani data yang sifatnya kontinu/tak terbatas secara alami.
- Bisa diskalakan secara horizontal mengikuti volume event yang masuk.`,
        en: "",
      },
      cons: {
        id: `- Jauh lebih kompleks dibangun dan dioperasikan dibanding batch — perlu state management, watermark, dan semantik exactly-once.
- Lebih sulit di-debug karena data tidak statis, tidak bisa sekadar "dijalankan ulang" pada kondisi yang persis sama.
- Biasanya biaya infrastruktur lebih tinggi karena berjalan terus-menerus, dibanding job batch yang hanya jalan sesuai jadwal.
- Membutuhkan keahlian khusus (windowing, backpressure, checkpointing) yang tidak semua tim data miliki.`,
        en: "",
      },
    },
  },
};
