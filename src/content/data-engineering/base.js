export const term = {
  id: "base",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#34d399",
  icon: "M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2",
  simulation: "base",
  tools: ["Cassandra", "DynamoDB", "MongoDB", "CouchDB", "Redis"],
  prerequisites: ["cap-theorem"],
  related: ["acid", "eventual-consistency", "replication"],
  name: { id: "BASE", en: "BASE" },
  content: {
    description: {
      id: "**BASE (Basically Available, Soft state, Eventually consistent)** adalah model konsistensi database yang menjadi kebalikan filosofis dari ACID. Alih-alih menjamin konsistensi ketat di setiap saat, sistem BASE memilih untuk **selalu tersedia** (*available*) dan menerima bahwa data mungkin sementara tidak sinkron antar node, dengan jaminan bahwa pada akhirnya (*eventually*) semua node akan konvergen ke nilai yang sama. Model ini populer di database NoSQL terdistribusi seperti Cassandra dan DynamoDB, yang harus melayani trafik skala besar di banyak region tanpa mengorbankan uptime.",
      en: "",
    },
    concept: {
      id: "*Bayangkan* BASE seperti grup chat WhatsApp yang tersebar di banyak server dunia. Ketika kamu kirim pesan, kamu langsung dapat centang terkirim (**available segera**) meskipun pesan itu belum tentu sudah sampai ke semua device temanmu di belahan bumi lain — tapi dalam hitungan detik, semua orang pasti akan melihat pesan yang sama (**eventually consistent**). Bandingkan dengan ACID yang seperti antrian teller bank: kamu **harus** menunggu sampai semua sistem benar-benar sinkron sebelum transaksi dianggap selesai.",
      en: "",
    },
    methodology: {
      id: "Secara teknis, ketika client menulis data ke node primary, sistem BASE langsung mengirim **ACK (acknowledgment)** ke client tanpa menunggu replikasi selesai. Setelah itu, perubahan tersebut disebarkan (*propagate*) secara asynchronous ke N replica lain di background. Selama periode propagasi ini, node yang berbeda bisa saja mengembalikan versi data yang berbeda jika di-query bersamaan — inilah **'soft state'**. Sistem mengandalkan mekanisme seperti *gossip protocol*, *read repair*, atau *hinted handoff* untuk memastikan semua node akhirnya konvergen ke state yang sama tanpa campur tangan manual.",
      en: "",
    },
    objective: {
      id: "BASE ada untuk menjawab kebutuhan sistem yang **harus tetap merespons** meskipun sebagian node down atau jaringan terputus (*partition tolerance*), sesuatu yang sulit dicapai jika sistem memaksakan *strict consistency* ala ACID. Ini krusial untuk aplikasi dengan skala global dan trafik tinggi, di mana menahan write demi menunggu semua replica sinkron akan menciptakan **latency yang tidak bisa diterima** pengguna.",
      en: "",
    },
    goal: {
      id: "Hasil yang dicapai adalah sistem dengan availability **sangat tinggi** (mendekati **100% uptime**) dan latency write yang rendah dan konsisten, dengan trade-off bahwa pembaca bisa saja melihat data yang sedikit basi (*stale*) selama jendela waktu propagasi — biasanya dalam hitungan milidetik hingga beberapa detik.",
      en: "",
    },
    exampleImplementation: {
      id: "Alur tipikal penulisan pada sistem BASE seperti Cassandra:\n\n1. Client mengirim write ke node primary/coordinator.\n2. Coordinator menyimpan data secara lokal dan langsung mengirim ACK ke client.\n3. Coordinator mempropagasikan perubahan secara asinkron ke replica lain sesuai replication factor.\n4. Node-node melakukan sinkronisasi melalui gossip protocol dan read-repair saat query berikutnya datang.\n\n```sql\n-- Contoh konfigurasi consistency level di Cassandra\n-- ONE = ACK setelah 1 replica menulis (write cepat, BASE penuh)\nCONSISTENCY ONE;\nINSERT INTO notifications (user_id, msg, ts)\nVALUES (1042, 'Pesanan Anda telah dikirim', toTimestamp(now()));\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Fintech Cepat menggunakan Cassandra untuk sistem notifikasi transaksi ke **jutaan pengguna**. Saat sebuah transaksi selesai, notifikasi ditulis dengan consistency level ONE sehingga user langsung menerima konfirmasi dalam **hitungan milidetik**. Di balik layar, data notifikasi tersebut baru sepenuhnya tersinkron ke semua replica dalam **1-2 detik** berikutnya — cukup cepat sehingga pengguna hampir tidak pernah menyadari adanya delay, namun sistem tetap bisa melayani lonjakan trafik saat jam sibuk tanpa downtime.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- **Availability sangat tinggi**, sistem tetap merespons walau sebagian node down\n- Latency write rendah karena tidak menunggu semua replica\n- **Skalabilitas horizontal** yang baik untuk trafik masif dan terdistribusi secara geografis\n- Toleran terhadap network partition sesuai prinsip CAP theorem",
        en: "",
      },
      cons: {
        id: "- Pembaca bisa mendapat data *stale*/tidak konsisten selama masa propagasi\n- **Tidak cocok** untuk kasus yang butuh konsistensi mutlak seperti saldo rekening bank\n- Logika aplikasi jadi lebih kompleks karena harus menangani kemungkinan conflict antar versi data\n- Debugging lebih sulit karena state antar node bisa berbeda sesaat",
        en: "",
      },
    },
  },
};
