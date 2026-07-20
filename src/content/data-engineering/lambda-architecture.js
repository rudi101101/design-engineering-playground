export const term = {
  id: "lambda-architecture",
  track: "data-engineering",
  category: "Arsitektur",
  color: "#8b5cf6",
  icon: "M22 12h-4l-3 9L9 3l-3 9H2",
  simulation: "lambda",
  tools: ["Apache Spark", "Apache Flink", "Kafka", "Hadoop", "BigQuery"],
  prerequisites: ["batch-processing", "stream-processing"],
  related: ["kappa-architecture"],
  name: { id: "Lambda Architecture", en: "Lambda Architecture" },
  content: {
    description: {
      id: `Lambda Architecture adalah pola arsitektur yang menjalankan dua jalur pemrosesan data secara paralel: Batch Layer yang lambat tapi akurat (memproses ulang seluruh histori data secara periodik), dan Speed Layer yang cepat tapi bersifat approximate (memproses data terbaru secara real-time). Hasil dari kedua layer ini digabungkan di Serving Layer untuk menjawab query pengguna. Pola ini relevan untuk kasus yang butuh laporan historis akurat sekaligus insight real-time dari data yang sama, sesuatu yang sulit dipenuhi satu jalur pemrosesan saja.`,
      en: "",
    },
    concept: {
      id: `Bayangkan kamu punya dua akuntan: satu auditor yang teliti dan menghitung ulang seluruh pembukuan setiap malam agar hasilnya benar-benar akurat (tapi baru selesai besok pagi), dan satu kasir yang cepat memberi total sementara sepanjang hari (cepat tapi kasar/approximate). Saat tutup buku, angka pasti dari auditor menggantikan angka sementara dari kasir. Lambda Architecture bekerja persis seperti itu — batch layer sebagai "auditor", speed layer sebagai "kasir", digabung di serving layer.`,
      en: "",
    },
    methodology: {
      id: `Data dari source dikirim ke dua jalur sekaligus: Batch Layer memakai engine seperti Spark untuk memproses ulang seluruh histori data secara periodik (misal tiap malam) demi hasil yang akurat dan reproducible. Speed Layer memakai engine streaming seperti Flink untuk memproses hanya data terbaru secara near real-time, memberikan hasil cepat meski belum sepenuhnya diverifikasi. Serving Layer kemudian menggabungkan keduanya: data lama diambil dari batch view yang sudah pasti akurat, sedangkan celah data terbaru (yang belum sempat diproses ulang oleh batch) diisi oleh speed view.`,
      en: "",
    },
    objective: {
      id: `Lambda Architecture lahir untuk menjawab tegangan antara kebutuhan akan agregat historis yang akurat dan kebutuhan akan tampilan data terkini dengan latensi rendah — dua kebutuhan yang sulit dipenuhi murah oleh satu jalur pemrosesan tunggal saja.`,
      en: "",
    },
    goal: {
      id: `Hasilnya adalah dashboard atau sistem alerting yang sekaligus real-time (latensi level detik dari speed layer) dan pada akhirnya sepenuhnya akurat serta reproducible begitu batch layer selesai memproses ulang data yang sama.`,
      en: "",
    },
    exampleImplementation: {
      id: `Alur: Source → Batch Layer (Spark) + Speed Layer (Flink) → Serving Layer → Query.

1. Event dikirim ke Kafka sebagai source bersama.
2. Flink membaca stream Kafka untuk menghasilkan speed view (agregat approximate near real-time).
3. Spark menjalankan job batch tiap malam membaca seluruh histori Kafka/Hadoop untuk menghasilkan batch view yang akurat.
4. Serving layer (misalnya di BigQuery) menyatukan batch view dan speed view saat query dijalankan.

\`\`\`yaml
# ilustrasi scheduling batch job
batch_layer:
  engine: spark
  schedule: "0 1 * * *"  # tiap jam 01:00
  source: hadoop_raw_events
  output: batch_view

speed_layer:
  engine: flink
  mode: streaming
  source: kafka_topic_events
  output: speed_view
\`\`\``,
      en: "",
    },
    exampleEnterprise: {
      id: `PT Armada Nusantara memantau telemetri kendaraan mereka: Flink di speed layer memicu alert real-time saat mesin kendaraan overheat, sementara Spark di batch layer menjalankan job tiap malam untuk menghasilkan laporan efisiensi bahan bakar harian yang akurat dari seluruh histori perjalanan.`,
      en: "",
    },
    prosAndCons: {
      pros: {
        id: `- Memenuhi dua kebutuhan sekaligus: real-time alerting dan laporan historis yang akurat.
- Toleran terhadap kesalahan — batch layer secara berkala mengoreksi hasil approximate dari speed layer.
- Kedua layer bisa diskalakan secara independen sesuai beban masing-masing.
- Pola yang sudah terbukti dan banyak dipakai di industri sebelum tren Kappa.`,
        en: "",
      },
      cons: {
        id: `- Perlu memelihara dua codebase logic bisnis yang terpisah (batch dan streaming) — risiko bug ketika logikanya tidak konsisten.
- Kompleksitas operasional tinggi karena harus menjalankan dan memonitor dua sistem berbeda (Spark dan Flink).
- Sudah banyak digantikan oleh Kappa Architecture pada desain-desain baru yang lebih sederhana.
- Sulit mendiagnosis ketika hasil batch view dan speed view berbeda signifikan.`,
        en: "",
      },
    },
  },
};
