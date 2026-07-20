export const term = {
  id: "message-queue-event-streaming",
  track: "data-engineering",
  category: "Pipeline",
  color: "#f59e0b",
  icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  simulation: "mqueue",
  tools: ["Apache Kafka", "Google Pub/Sub", "RabbitMQ", "AWS SQS", "Azure Service Bus"],
  prerequisites: [],
  related: ["stream-processing"],
  name: { id: "Message Queue & Event Streaming", en: "Message Queue & Event Streaming" },
  content: {
    description: {
      id: `Message Queue dan Event Streaming adalah sistem asinkron untuk mengirim dan menerima event/pesan antar service yang saling terpisah (decoupled). Ada dua gaya utama: Kafka bergaya log event berthroughput tinggi yang bisa diputar ulang (replayable) dan disimpan lama, sementara RabbitMQ bergaya message queue tradisional berbasis routing di mana pesan hilang dari antrean begitu sudah dikonsumsi. Keduanya menjadi tulang punggung arsitektur berbasis event modern.`,
      en: "",
    },
    concept: {
      id: `Kafka ibarat papan pengumuman publik: setiap pengumuman yang ditempel tetap ada di sana untuk dibaca siapa saja — termasuk dibaca ulang nanti atau dari titik tertentu di masa lalu — dan banyak departemen berbeda bisa membaca papan yang sama secara independen. RabbitMQ lebih mirip kotak surat fisik: begitu seseorang mengambil suratnya dan mengonfirmasi penerimaan, surat itu hilang dari kotak, terkirim tepat sekali ke siapa pun yang mengambilnya lebih dulu.`,
      en: "",
    },
    methodology: {
      id: `Producer mempublikasikan pesan/event ke sebuah topic atau queue. Consumer membaca secara independen — Kafka menyimpan event selama periode retention yang bisa dikonfigurasi sehingga banyak consumer group berbeda bisa membaca stream yang sama secara penuh (bahkan memutar ulang dari offset tertentu), sementara RabbitMQ umumnya menghapus pesan begitu sudah dikonsumsi dan di-ACK, lebih mengutamakan jaminan pengiriman dan routing dibanding kemampuan replay.`,
      en: "",
    },
    objective: {
      id: `Sistem ini hadir untuk mengatasi tight coupling antar service — tanpa broker asinkron di tengah, setiap producer harus tahu dan memanggil langsung setiap consumer, membuat sistem rapuh dan sulit diskalakan atau diubah secara independen satu sama lain.`,
      en: "",
    },
    goal: {
      id: `Hasilnya adalah service-service yang bisa mempublikasikan dan mengonsumsi event secara independen sesuai kecepatan masing-masing, dengan broker menyerap lonjakan beban (backpressure buffering), dan pada Kafka, consumer baru bisa memutar ulang histori tanpa producer perlu mengirim ulang apa pun.`,
      en: "",
    },
    exampleImplementation: {
      id: `Alur: Producer → Publish to Topic → Broker stores → Consumer Group reads → Process → ACK.

1. Producer mempublikasikan event ke sebuah topic di broker.
2. Broker menyimpan event tersebut (dengan retention tertentu pada Kafka).
3. Beberapa consumer group berbeda membaca topic yang sama secara independen dan paralel.

\`\`\`python
# ilustrasi publish event pembayaran ke Pub/Sub
publisher.publish(
    topic="payment-events",
    data=json.dumps({"order_id": "ORD-8821", "status": "paid"}).encode("utf-8"),
)
\`\`\``,
      en: "",
    },
    exampleEnterprise: {
      id: `Fintech Cepat mempublikasikan setiap event pembayaran ke Pub/Sub, dan beberapa consumer berbeda — fraud detection, notifikasi pelanggan, serta analitik — membaca event yang sama secara paralel dan independen tanpa saling mengganggu satu sama lain.`,
      en: "",
    },
    prosAndCons: {
      pros: {
        id: `- Melepas ketergantungan langsung antara producer dan consumer, masing-masing bisa berkembang dan diskalakan sendiri.
- Retensi ala Kafka memungkinkan replay untuk reprocessing atau consumer baru tanpa menyentuh producer.
- Menyerap lonjakan trafik dan backpressure dengan baik lewat mekanisme buffering broker.
- Mendukung banyak consumer independen membaca stream yang sama secara paralel.`,
        en: "",
      },
      cons: {
        id: `- Menambah kompleksitas operasional — perlu cluster broker yang harus dijalankan, dimonitor, dan di-tuning.
- Jaminan urutan pesan dan pengiriman exactly-once membutuhkan desain yang hati-hati.
- Retensi panjang ala Kafka bisa berarti biaya storage signifikan pada skala besar.
- Debugging alur asinkron lintas banyak consumer lebih sulit dibanding pola request/response yang sinkron.`,
        en: "",
      },
    },
  },
};
