export const term = {
  id: "schema-registry",
  track: "data-engineering",
  category: "Modern/ML",
  color: "#7c3aed",
  icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  simulation: "schemareg",
  tools: ["Confluent Schema Registry", "AWS Glue Schema Registry", "Apicurio", "Karapace"],
  prerequisites: ["message-queue-event-streaming"],
  related: [],
  name: { id: "Schema Registry", en: "Schema Registry" },
  content: {
    description: {
      id: "Schema Registry adalah layanan sentral yang menyimpan dan mengelola definisi schema untuk event atau message yang mengalir lewat sistem streaming seperti Kafka. Tanpa Schema Registry, producer dan consumer harus saling percaya secara implisit bahwa format data yang dikirim dan diterima cocok — begitu satu tim mengubah struktur event tanpa koordinasi, seluruh consumer di hilir bisa gagal parsing atau, lebih buruk, diam-diam salah membaca data. Schema Registry menjadikan kontrak data ini eksplisit, terversi, dan dapat divalidasi otomatis sebelum data dikirim.",
      en: "",
    },
    concept: {
      id: "Bayangkan Schema Registry seperti kantor notaris untuk kontrak antar departemen di sebuah perusahaan besar. Setiap kali departemen pengirim (producer) ingin mengubah format \"formulir\" yang mereka kirim ke departemen lain (consumer), mereka harus mendaftarkan versi formulir baru itu ke notaris dan notaris akan mengecek apakah formulir baru masih bisa dibaca oleh pihak yang masih memakai formulir versi lama. Kalau tidak kompatibel, notaris menolak — mencegah kekacauan sebelum terjadi, bukan setelah data rusak sampai ke tangan penerima.",
      en: "",
    },
    methodology: {
      id: "Schema Registry mendefinisikan aturan kompatibilitas yang menentukan seberapa jauh sebuah schema boleh berubah. Mode BACKWARD berarti consumer dengan kode baru harus tetap bisa membaca data lama yang ditulis dengan schema lama. Mode FORWARD kebalikannya: consumer lama harus tetap bisa membaca data yang ditulis dengan schema baru. Mode FULL mewajibkan keduanya sekaligus, paling ketat tapi paling aman untuk evolusi jangka panjang. Format schema yang umum dipakai adalah Avro atau Protobuf karena keduanya mendukung evolusi field secara terstruktur. Alurnya: producer menulis event, sebelum dikirim ke Kafka producer mendaftarkan atau mengecek schema ke registry, event lalu diserialisasi dalam format compact, dan saat consumer membaca event tersebut ia mengambil schema yang sesuai dari registry untuk mendeserialisasi data dengan benar.",
      en: "",
    },
    objective: {
      id: "Schema Registry ada untuk mencegah pipeline data yang bergantung pada Kafka rusak akibat perubahan format event yang tidak terkoordinasi. Dalam sistem event-driven berskala besar, satu topic Kafka bisa dibaca oleh puluhan consumer dari tim berbeda — tanpa mekanisme validasi terpusat, perubahan sekecil apa pun pada struktur event bisa memicu efek domino kegagalan di seluruh consumer yang tidak siap menerima format baru.",
      en: "",
    },
    goal: {
      id: "Hasilnya adalah evolusi schema yang aman: field baru bisa ditambahkan tanpa mematikan consumer lama, kesalahan format terdeteksi saat registrasi/serialisasi bukan saat data sudah tersebar ke banyak consumer, dan ukuran payload event lebih kecil karena schema tidak perlu disertakan berulang di setiap pesan — cukup referensi ID schema.",
      en: "",
    },
    exampleImplementation: {
      id: "Alur registrasi dan pemakaian schema:\n\n1. Producer menyiapkan event baru dengan schema Avro.\n2. Producer mengirim schema ke registry untuk dicek kompatibilitasnya dengan versi sebelumnya.\n3. Jika kompatibel, event diserialisasi dan dikirim ke Kafka bersama ID schema.\n4. Consumer membaca event, mengambil schema sesuai ID dari registry, lalu mendeserialisasi.\n\nContoh definisi schema Avro dengan field baru yang backward-compatible (field baru punya default value):\n\n```json\n{\n  \"type\": \"record\",\n  \"name\": \"TransaksiEvent\",\n  \"fields\": [\n    { \"name\": \"transaksi_id\", \"type\": \"string\" },\n    { \"name\": \"jumlah\", \"type\": \"double\" },\n    { \"name\": \"channel\", \"type\": \"string\", \"default\": \"unknown\" }\n  ]\n}\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "PT Nusantara Digital menjalankan event streaming Kafka untuk mencatat setiap transaksi yang terjadi di aplikasi mereka, dengan schema Avro yang didaftarkan ke Confluent Schema Registry. Ketika tim produk ingin menambahkan field baru `metode_pembayaran` ke event transaksi, registry secara otomatis mengecek apakah perubahan ini backward-compatible terhadap consumer yang masih berjalan dengan kode lama. Karena field baru diberi default value, perubahan lolos validasi dan di-deploy tanpa mematikan satu pun consumer yang sedang berjalan — termasuk consumer laporan finansial yang di-maintain oleh tim berbeda dan tidak sempat di-update bersamaan.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Mencegah breaking change menyebar ke seluruh consumer dengan validasi kompatibilitas otomatis sebelum data dikirim\n- Mengurangi ukuran payload karena schema penuh tidak perlu disertakan di setiap event, cukup ID referensi\n- Memberi dokumentasi hidup tentang struktur data yang mengalir di setiap topic Kafka\n- Mendukung evolusi schema bertahap (menambah field) tanpa harus mengoordinasikan deploy semua consumer sekaligus",
        en: "",
      },
      cons: {
        id: "- Menambah satu komponen infrastruktur kritis lagi yang harus tersedia (high availability) karena semua producer/consumer bergantung padanya\n- Perubahan schema yang breaking tetap butuh koordinasi manual dan proses migrasi bertahap\n- Tim yang terbiasa dengan JSON bebas format perlu belajar disiplin baru dalam mendefinisikan schema Avro/Protobuf\n- Menambah langkah ekstra (round-trip ke registry) di jalur kritis producer dan consumer, meski biasanya di-cache",
        en: "",
      },
    },
  },
};
