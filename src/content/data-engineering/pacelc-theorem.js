export const term = {
  id: "pacelc-theorem",
  track: "data-engineering",
  category: "Consistency",
  color: "#38bdf8",
  icon: "M12 2l10 18H2z",
  simulation: "pacelc",
  tools: ["DynamoDB (PA/EL)", "Google Spanner (PC/EC)", "HBase (PC/EC)", "Cassandra (tunable)"],
  prerequisites: ["cap-theorem"],
  related: ["eventual-consistency"],
  name: { id: "PACELC Theorem", en: "PACELC Theorem" },
  content: {
    description: {
      id: "PACELC Theorem adalah perluasan dari CAP Theorem yang mengoreksi kelemahan utamanya: CAP hanya bicara soal trade-off saat terjadi network partition, padahal sistem terdistribusi jauh lebih sering beroperasi dalam kondisi normal tanpa partition. PACELC menambahkan pertanyaan kedua yang relevan sepanjang waktu, bukan cuma saat krisis: bahkan ketika sistem berjalan normal (Else), tetap ada trade-off antara Latency dan Consistency yang harus dipilih. Ini membuat PACELC jauh lebih realistis sebagai kerangka untuk memahami perilaku database terdistribusi sehari-hari.",
      en: "",
    },
    concept: {
      id: "Bayangkan CAP Theorem seperti aturan darurat kebakaran (hanya berlaku saat ada kebakaran/partition), sementara PACELC menambahkan aturan operasional sehari-hari kantor (berlaku terus, bukan cuma saat darurat). Bahkan di hari-hari normal tanpa kebakaran, kantor tetap harus memutuskan: apakah proses persetujuan dokumen harus menunggu semua pihak menandatangani dulu (konsisten tapi lambat), atau boleh berjalan cepat dengan risiko ada pihak yang ketinggalan info sesaat (cepat tapi kurang konsisten)?",
      en: "",
    },
    methodology: {
      id: "PACELC dibaca sebagai dua kondisi bercabang. Jika terjadi Partition (P), sistem harus memilih antara Availability (A) — tetap melayani permintaan meski berisiko data tidak konsisten — atau Consistency (C) — memblokir permintaan sampai data konsisten kembali, ini persis trade-off CAP. Else (E), yaitu saat kondisi normal tanpa partition, sistem tetap harus memilih antara Latency (L) rendah dengan mengizinkan replikasi asynchronous, atau Consistency (C) tinggi dengan mewajibkan replikasi synchronous yang lebih lambat. Kombinasi klasifikasinya: sistem PA/EL seperti DynamoDB selalu memilih availability saat partition dan latency rendah saat normal (eventual consistency by default). Sistem PC/EC seperti Google Spanner selalu memilih consistency di kedua kondisi, dengan replikasi synchronous yang menjaga konsistensi kuat sepanjang waktu meski mengorbankan latency.",
      en: "",
    },
    objective: {
      id: "PACELC ada karena CAP Theorem, meski berguna, sering disalahpahami sebagai satu-satunya trade-off yang perlu dipertimbangkan dalam sistem terdistribusi — padahal partition adalah kejadian yang relatif jarang, sementara trade-off latency-vs-consistency terjadi setiap saat sistem beroperasi normal. Memahami PACELC membantu tim engineering memilih database yang tepat berdasarkan karakteristik operasional sehari-hari, bukan hanya skenario kegagalan.",
      en: "",
    },
    goal: {
      id: "Hasilnya adalah kerangka pengambilan keputusan yang lebih lengkap saat memilih atau mengonfigurasi database terdistribusi — tim bisa secara sadar memilih sistem PA/EL untuk kasus yang butuh latency rendah dan toleran stale data, atau PC/EC untuk kasus yang butuh konsistensi kuat meski harus membayar latency lebih tinggi, sesuai kebutuhan bisnis spesifik mereka.",
      en: "",
    },
    exampleImplementation: {
      id: "Cara memetakan sebuah sistem ke klasifikasi PACELC:\n\n1. Tanyakan: saat partition terjadi, sistem memilih Availability atau Consistency?\n2. Tanyakan: saat kondisi normal, sistem memilih Latency rendah atau Consistency tinggi?\n3. Gabungkan dua jawaban menjadi klasifikasi 4 huruf, misalnya PA/EL atau PC/EC.\n\nIlustrasi konfigurasi tunable consistency di Cassandra yang bisa digeser antara PA/EL dan lebih dekat ke PC/EC:\n\n```sql\n-- Prioritaskan latency rendah (mendekati PA/EL)\nCONSISTENCY ONE;\nSELECT * FROM transaksi WHERE id = 'T123';\n\n-- Prioritaskan konsistensi lebih kuat (mendekati PC/EC)\nCONSISTENCY QUORUM;\nSELECT * FROM transaksi WHERE id = 'T123';\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Toko Meta Retail mengevaluasi dua opsi database untuk sistem mereka. Untuk sistem keranjang belanja yang butuh respons sangat cepat dan toleran terhadap data yang sedikit basi, mereka memilih DynamoDB yang berperilaku PA/EL — default eventual consistency dengan latency rendah baik saat normal maupun saat partition. Sebaliknya, untuk sistem pembukuan keuangan yang tidak boleh salah sedikit pun, mereka memilih Google Spanner yang berperilaku PC/EC — replikasi synchronous yang menjamin konsistensi kuat meski latency-nya lebih tinggi dibanding DynamoDB.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Memberi gambaran trade-off yang lebih lengkap dan realistis dibanding CAP Theorem yang hanya bicara soal skenario partition\n- Membantu tim memilih database sesuai karakteristik operasional harian, bukan hanya skenario kegagalan jaringan\n- Mengungkap bahwa trade-off latency-vs-consistency itu konstan dan relevan sepanjang waktu, bukan cuma saat krisis\n- Beberapa sistem seperti Cassandra bersifat tunable, memungkinkan tim menyesuaikan posisi trade-off sesuai kebutuhan per query",
        en: "",
      },
      cons: {
        id: "- Tetap sebuah model penyederhanaan — perilaku database nyata bisa lebih nuansa dari sekadar klasifikasi 4 huruf\n- Kurang dikenal dibanding CAP Theorem, sehingga butuh usaha ekstra untuk menjelaskan konsepnya ke stakeholder non-teknis\n- Klasifikasi PACELC suatu sistem bisa berubah tergantung konfigurasi, membuat generalisasi kadang menyesatkan tanpa konteks konfigurasi spesifik\n- Tidak memberi resep siap pakai — tim tetap harus memahami kebutuhan bisnis spesifik untuk menentukan titik trade-off yang tepat",
        en: "",
      },
    },
  },
};
