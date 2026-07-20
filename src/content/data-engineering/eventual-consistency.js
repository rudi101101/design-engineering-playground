export const term = {
  id: "eventual-consistency",
  track: "data-engineering",
  category: "Consistency",
  color: "#c084fc",
  icon: "M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2",
  simulation: "eventual",
  tools: ["Cassandra", "DynamoDB", "BigQuery Streaming", "MongoDB", "CouchDB"],
  prerequisites: ["cap-theorem"],
  related: ["base", "pacelc-theorem", "read-your-writes-consistency"],
  name: { id: "Eventual Consistency", en: "Eventual Consistency" },
  content: {
    description: {
      id: "Eventual Consistency adalah model konsistensi di mana sistem terdistribusi menjamin bahwa data akan konsisten di semua node pada akhirnya, tapi tidak seketika setelah operasi tulis terjadi. Ini adalah trade-off sadar yang diambil banyak sistem terdistribusi modern demi mendapatkan ketersediaan (availability) dan latency rendah yang tinggi — konsekuensinya, ada jendela waktu singkat di mana pembaca berbeda bisa melihat versi data yang berbeda pula, sebelum akhirnya semua replica konvergen ke nilai yang sama.",
      en: "",
    },
    concept: {
      id: "Bayangkan eventual consistency seperti kabar gosip yang menyebar di kantor besar dengan banyak cabang. Ketika satu orang mendengar kabar terbaru di cabang pusat, kabar itu tidak langsung sampai ke semua cabang dalam sekejap — butuh waktu beberapa menit sampai jam untuk kabar itu menyebar dan akhirnya semua orang di semua cabang tahu versi cerita yang sama. Selama masa penyebaran itu, ada karyawan di cabang lain yang masih memegang versi kabar lama, bukan karena salah, tapi karena kabarnya belum sampai ke mereka.",
      en: "",
    },
    methodology: {
      id: "Mekanismenya: ketika data ditulis, sistem menulis ke node primary dan langsung mengirim acknowledgment (ACK) ke klien tanpa menunggu replica lain ikut ter-update — inilah yang membuat write terasa cepat. Setelah ACK dikirim, sistem mempropagasi perubahan ke node-node replica lain secara asynchronous di latar belakang. Jika terjadi konflik, misalnya dua write berbeda tiba hampir bersamaan di node berbeda, sistem menyelesaikannya dengan strategi seperti Last Write Wins (LWW) yang memilih write dengan timestamp terbaru, atau vector clock yang melacak urutan kausal perubahan secara lebih presisi. Prosesnya secara garis besar: write ke primary, ACK segera dikirim, propagasi asynchronous berjalan, dan seluruh node akhirnya konvergen ke nilai yang sama.",
      en: "",
    },
    objective: {
      id: "Model ini ada karena dalam sistem terdistribusi berskala global, menunggu semua replica ter-update secara synchronous sebelum mengonfirmasi write akan membuat latency sangat tinggi dan mengorbankan availability saat terjadi network partition — sesuai trade-off yang dijelaskan CAP Theorem. Eventual consistency memilih memprioritaskan availability dan latency rendah, dengan menerima bahwa konsistensi sempurna butuh sedikit waktu untuk tercapai.",
      en: "",
    },
    goal: {
      id: "Hasil yang dicapai adalah sistem yang tetap responsif dan tersedia meski sebagian node sedang bermasalah atau terputus jaringan, dengan jaminan bahwa selama tidak ada write baru, semua replica pada akhirnya akan konvergen ke nilai yang identik — biasanya dalam hitungan milidetik hingga detik pada praktiknya.",
      en: "",
    },
    exampleImplementation: {
      id: "Simulasi sederhana skenario eventual consistency pada sistem replikasi:\n\n1. Klien menulis update ke node primary.\n2. Primary langsung mengirim ACK ke klien — dari sudut pandang klien, operasi selesai.\n3. Primary mempropagasi perubahan ke replica secara async di background.\n4. Selama propagasi berlangsung (bisa puluhan hingga ratusan milidetik), pembaca yang membaca dari replica berbeda bisa mendapat data lama.\n5. Setelah propagasi selesai, semua node konvergen ke nilai yang sama.\n\nContoh ilustrasi query pada MySQL dengan read replica yang mengalami lag:\n\n```sql\n-- Ditulis ke primary\nUPDATE saldo SET jumlah = 500000 WHERE user_id = 'U123';\n\n-- Dibaca ~100ms kemudian dari read replica, masih bisa menunjukkan nilai lama\nSELECT jumlah FROM saldo WHERE user_id = 'U123'; -- misal masih 450000\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "PT Nusantara Logistik menggunakan BigQuery Streaming Insert untuk mencatat setiap update status pengiriman secara real-time. Tim mereka sempat bingung karena data yang baru saja di-insert kadang belum langsung muncul saat dijalankan SELECT beberapa detik kemudian — ini adalah perilaku eventual consistency yang normal pada BigQuery streaming buffer. Tim akhirnya mendesain dashboard operasional mereka untuk toleran terhadap delay singkat ini, alih-alih memaksakan konsistensi instan yang tidak dijamin oleh sistem.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Write terasa sangat cepat karena klien tidak perlu menunggu semua replica ter-update sebelum mendapat ACK\n- Sistem tetap tersedia (available) meski sebagian node mengalami gangguan jaringan atau down\n- Skala horizontal jauh lebih mudah karena tidak ada bottleneck koordinasi synchronous antar node\n- Cocok untuk kasus penggunaan yang toleran terhadap data sedikit basi, seperti feed sosial atau counter agregat",
        en: "",
      },
      cons: {
        id: "- Pembaca bisa mendapat data basi (stale) untuk sementara waktu, tidak cocok untuk kasus yang butuh akurasi instan seperti saldo bank\n- Menambah kompleksitas aplikasi karena developer harus menangani kemungkinan konflik dan resolusi seperti Last Write Wins\n- Debugging lebih sulit karena perilaku sistem tidak deterministik — hasil bisa berbeda tergantung timing propagasi\n- Last Write Wins berisiko kehilangan data secara diam-diam jika dua write terjadi hampir bersamaan tanpa penanganan konflik yang cermat",
        en: "",
      },
    },
  },
};
