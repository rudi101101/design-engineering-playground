export const term = {
  id: "kappa-architecture",
  track: "data-engineering",
  category: "Arsitektur",
  color: "#a855f7",
  icon: "M22 12h-4l-3 9L9 3l-3 9H2",
  simulation: "stream",
  tools: ["Apache Kafka", "Apache Flink", "Google Pub/Sub", "Dataflow"],
  prerequisites: ["stream-processing"],
  related: ["lambda-architecture"],
  name: { id: "Kappa Architecture", en: "Kappa Architecture" },
  content: {
    description: {
      id: `Kappa Architecture adalah penyederhanaan dari Lambda Architecture: hanya ada satu layer pemrosesan, yaitu stream processing. Semua data — termasuk yang biasanya dianggap "data batch" — diperlakukan sebagai stream event, dan kebutuhan reprocessing histori dipenuhi dengan cara memutar ulang (replay) event log dari awal, bukan dengan menjalankan pipeline batch terpisah. Pendekatan ini populer sebagai reaksi terhadap kompleksitas Lambda yang mengharuskan dua codebase paralel.`,
      en: "",
    },
    concept: {
      id: `Kalau Lambda seperti mempekerjakan dua departemen berbeda (kasir cepat + auditor lambat), Kappa seperti merekam semuanya di satu kaset perekam panjang (event log) — dan kalau suatu saat kamu perlu menghitung ulang histori, kamu tinggal memutar ulang kasetnya dari awal melalui prosesor yang sama. Satu tim, satu alat, satu logika — tidak perlu dua departemen terpisah yang harus selalu sinkron satu sama lain.`,
      en: "",
    },
    methodology: {
      id: `Event disimpan di Kafka (atau message log sejenis) dengan retention period yang panjang, bahkan bisa dikonfigurasi hampir tanpa batas waktu. Ketika perlu reprocessing — misalnya karena ada perbaikan logika bisnis — cukup jalankan consumer baru yang membaca dari offset paling awal, memproses ulang seluruh event melalui logika stream processing yang sama, lalu menulis hasilnya ke serving store baru. Setelah consumer baru ini caught-up dengan data terkini, traffic tinggal dialihkan ke serving store yang baru tanpa downtime.`,
      en: "",
    },
    objective: {
      id: `Kappa Architecture ada untuk menghilangkan masalah utama Lambda: duplikasi logika bisnis di dua codebase terpisah (batch dan streaming) yang rawan menjadi tidak konsisten seiring waktu. Dengan menyatukan semuanya dalam satu paradigma stream, tim hanya perlu menjaga satu logika pemrosesan.`,
      en: "",
    },
    goal: {
      id: `Hasilnya adalah satu pipeline/codebase tunggal yang menangani baik kebutuhan real-time maupun kebutuhan reprocessing histori, mengurangi overhead operasional dan risiko duplikasi logika dibanding Lambda Architecture.`,
      en: "",
    },
    exampleImplementation: {
      id: `Alur: Event Log (Kafka long-retention) → Stream Processor → Serving Store → Query.

1. Semua event ditulis ke topic Kafka dengan retention panjang (misalnya berbulan-bulan atau tanpa batas).
2. Flink membaca stream tersebut secara kontinu dan menulis hasil ke serving store.
3. Saat logika bisnis berubah, deploy consumer group baru yang membaca ulang dari offset paling awal.

\`\`\`bash
# contoh membuat consumer group baru untuk replay penuh dari awal
kafka-consumer-groups.sh --bootstrap-server kafka:9092 \\
  --group fraud-detection-v2 \\
  --topic transaksi-pembayaran \\
  --reset-offsets --to-earliest --execute
\`\`\`

Setelah consumer group baru ini selesai memproses ulang seluruh histori dan caught-up dengan data terbaru, traffic query dialihkan ke serving store hasil consumer baru tersebut.`,
      en: "",
    },
    exampleEnterprise: {
      id: `Fintech Cepat memperlakukan seluruh transaksi pembayaran sebagai event Kafka. Flink memproses stream yang sama secara paralel untuk dua kebutuhan: fraud detection real-time dan perhitungan tagihan bulanan — tanpa job batch terpisah untuk masing-masing kebutuhan tersebut.`,
      en: "",
    },
    prosAndCons: {
      pros: {
        id: `- Hanya satu codebase logika bisnis yang perlu dijaga, menghindari risiko inkonsistensi Lambda.
- Operasional lebih sederhana karena cukup menjalankan satu jenis sistem pemrosesan (stream).
- Reprocessing histori cukup dilakukan dengan replay event log, bukan pipeline batch terpisah.
- Desainnya secara alami real-time-first, cocok untuk kebutuhan bisnis modern.`,
        en: "",
      },
      cons: {
        id: `- Membutuhkan storage log dengan retention panjang yang bisa jadi mahal untuk volume data besar.
- Replay seluruh histori data yang sangat besar bisa memakan waktu dan biaya compute signifikan.
- Tidak semua use case cocok dipaksakan ke model stream-only — beberapa agregasi historis berat justru lebih murah dengan batch murni.
- Butuh keahlian stream processing yang matang (windowing, state management, exactly-once) di seluruh tim.`,
        en: "",
      },
    },
  },
};
