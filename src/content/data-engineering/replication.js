export const term = {
  id: "replication",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#fb7185",
  icon: "M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2",
  simulation: "replication",
  tools: ["PostgreSQL Streaming Rep", "MySQL Group Replication", "Galera Cluster", "Cloud Spanner", "Patroni"],
  prerequisites: ["write-ahead-log"],
  related: ["cap-theorem", "eventual-consistency", "base"],
  name: { id: "Replication — Sync vs Async", en: "Replication — Sync vs Async" },
  content: {
    description: {
      id: "Replication adalah proses menyalin data dari database primary ke satu atau lebih database replica, sehingga ada salinan data yang bisa dipakai untuk failover, load balancing query baca, atau disaster recovery. Ada dua model utama: **sinkron (sync)**, di mana primary menunggu ACK dari semua replica sebelum menganggap transaksi selesai, dan **asinkron (async)**, di mana primary langsung ACK ke client tanpa menunggu replika selesai menyalin data. Pilihan antara keduanya adalah **trade-off klasik antara konsistensi/durability dan latency**.",
      en: "",
    },
    concept: {
      id: "Bayangkan sync replication *seperti mengirim surat penting via kurir* yang mengharuskan kamu menunggu tanda tangan bukti terima dari SEMUA penerima sebelum kamu bisa pulang — aman, tapi kalau salah satu penerima jauh atau lambat, kamu ikut tertahan. Async replication *seperti mengirim surat lewat pos biasa*: kamu langsung pergi setelah menyerahkan surat ke kotak pos, percaya bahwa surat itu akan sampai — lebih cepat, tapi ada **risiko kecil surat hilang di jalan** sebelum sampai ke tujuan.",
      en: "",
    },
    methodology: {
      id: "Pada replikasi sinkron, saat primary menerima write, ia mengirimkan perubahan ke semua replica dan menunggu konfirmasi ACK dari mereka sebelum mengembalikan sukses ke client — ini menjamin **zero data loss**, tapi latency transaksi menjadi sama lambatnya dengan replica paling lambat. Pada replikasi asinkron, primary langsung mengembalikan ACK ke client segera setelah data ditulis lokal, lalu mereplikasi perubahan ke background secara terpisah — latency jadi rendah, tapi jika primary gagal sebelum replikasi selesai, **data yang belum sempat tersalin bisa hilang saat failover**. Di PostgreSQL misalnya, mekanisme ini biasanya memanfaatkan streaming dari **Write-Ahead Log (WAL)** yang dikirim ke replica secara terus-menerus.",
      en: "",
    },
    objective: {
      id: "Replikasi ada untuk menjawab kebutuhan ketersediaan tinggi (high availability) dan pemulihan bencana (disaster recovery) — sebuah database tunggal adalah **single point of failure**. Dengan replika, **sistem bisa terus berjalan meski primary down**, dan trafik baca yang berat bisa dialihkan ke replica agar tidak membebani primary. Pilihan sync vs async ditentukan oleh seberapa kritis toleransi kehilangan data dibanding kebutuhan latency rendah untuk kasus penggunaan tertentu.",
      en: "",
    },
    goal: {
      id: "Hasil yang dicapai adalah sistem yang lebih tahan terhadap kegagalan node tunggal (**failover cepat dengan minimal atau tanpa kehilangan data** pada replikasi sinkron), serta kemampuan menyebar beban baca ke banyak replica sehingga **throughput query keseluruhan meningkat**.",
      en: "",
    },
    exampleImplementation: {
      id: "Contoh konfigurasi kombinasi sync dan async replica di PostgreSQL:\n\n1. Primary menerima write, menulis ke WAL lokal.\n2. WAL di-stream ke **replica sinkron** — primary menunggu ACK dari replica ini sebelum commit dianggap selesai (menjamin DR guarantee).\n3. WAL juga di-stream ke **replica asinkron** secara paralel tanpa menunggu — dipakai untuk read scaling.\n\n```sql\n-- postgresql.conf di primary\nsynchronous_standby_names = 'replica_dr_1';\n\n-- replica_dr_1 wajib ACK dulu (sync)\n-- replica lain (read_replica_2) tetap async secara default\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "PT Nusantara Logistik menjalankan PostgreSQL dengan satu replica sinkron di data center kedua sebagai jaminan disaster recovery, dan satu replica asinkron di region lain khusus untuk melayani query pelaporan (read-only) tim analitik. Saat data center utama mengalami gangguan, replica sinkron langsung bisa **di-promote menjadi primary baru tanpa kehilangan satu transaksi pun**, sementara replica asinkron tetap melayani dashboard laporan operasional tanpa membebani database utama.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Replikasi sinkron menjamin **zero data loss** saat failover, ideal untuk kebutuhan disaster recovery kritis\n- Replikasi asinkron memberi **latency write yang rendah** karena tidak menunggu replica\n- Read replica memungkinkan **penyebaran beban query baca** sehingga primary tidak overload\n- Kombinasi keduanya (satu sync, beberapa async) memberi fleksibilitas trade-off sesuai kebutuhan",
        en: "",
      },
      cons: {
        id: "- Replikasi sinkron **menambah latency write** karena tergantung kecepatan replica paling lambat\n- Replikasi asinkron **berisiko kehilangan data** yang belum sempat tersalin saat primary gagal mendadak\n- Replication lag pada mode async bisa membuat read replica menyajikan **data yang stale**\n- Menambah kompleksitas operasional: monitoring lag, failover, dan konsistensi antar node",
        en: "",
      },
    },
  },
};
