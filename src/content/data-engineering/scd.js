export const term = {
  id: "scd",
  track: "data-engineering",
  category: "Modeling",
  color: "#8b5cf6",
  icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2",
  simulation: "scd",
  tools: ["dbt Snapshots", "Apache Spark", "BigQuery MERGE", "Dataflow", "Informatica"],
  prerequisites: ["star-schema"],
  related: ["surrogate-key-vs-natural-key"],
  name: { id: "SCD — Slowly Changing Dimension", en: "SCD — Slowly Changing Dimension" },
  content: {
    description: {
      id: "Slowly Changing Dimension (SCD) adalah kumpulan teknik untuk menangani perubahan nilai atribut pada tabel dimensi dari waktu ke waktu, sesuatu yang tidak bisa dihindari karena data dunia nyata seperti alamat, jabatan, atau status pelanggan memang berubah. Ada tiga tipe utama: Type 1 menimpa nilai lama tanpa menyimpan riwayat, Type 2 menyimpan riwayat penuh dengan menambahkan baris baru setiap kali ada perubahan, dan Type 3 menyimpan versi sebelumnya dalam kolom tambahan di baris yang sama. Pilihan tipe SCD punya konsekuensi langsung terhadap apakah laporan historis bisa merefleksikan kondisi data yang benar pada suatu titik waktu di masa lalu.",
      en: "",
    },
    concept: {
      id: "Bayangkan formulir data diri yang diisi ulang setiap kali ada perubahan. Type 1 seperti mencoret alamat lama dan menuliskan alamat baru di atasnya — formulir cuma punya satu alamat yang berlaku, yang lama sudah tak terlihat lagi. Type 2 seperti selalu mengisi formulir baru setiap kali pindah alamat, lalu menyimpan semua formulir lama di arsip dengan tanggal berlaku masing-masing — kamu bisa tahu persis alamat seseorang pada tanggal tertentu di masa lalu. Type 3 seperti formulir yang punya dua kolom alamat: 'alamat sekarang' dan 'alamat sebelumnya' — cukup untuk tahu satu langkah perubahan terakhir, tapi tidak untuk riwayat yang lebih jauh.",
      en: "",
    },
    methodology: {
      id: "Untuk SCD Type 2, yang paling umum dipakai, sistem mendeteksi adanya perubahan pada atribut dimensi (misalnya lewat perbandingan hash atau MERGE), lalu menandai baris lama dengan is_current diset menjadi false dan mengisi expiry_date dengan tanggal saat ini, kemudian menyisipkan baris baru dengan is_current diset true, effective_date diisi tanggal hari ini, dan expiry_date kosong (masih berlaku). Karena baris lama tetap tersimpan dan tidak dihapus, laporan historis bisa melakukan JOIN ke baris dimensi yang effective_date dan expiry_date-nya mencakup tanggal transaksi yang relevan, sehingga mendapatkan nilai atribut yang benar-benar berlaku pada saat itu — bukan nilai atribut terkini.",
      en: "",
    },
    objective: {
      id: "Dimensi bisnis seperti data pasien, pelanggan, atau produk tidak pernah statis — alamat pindah, jabatan naik, kategori produk berubah. Tanpa strategi SCD yang eksplisit, laporan historis akan secara diam-diam menggunakan nilai atribut terkini untuk transaksi masa lalu, menghasilkan analisis yang menyesatkan (misalnya laporan penjualan lama seolah-olah terjadi di alamat pelanggan yang baru). SCD ada untuk membuat keputusan sadar tentang apakah riwayat perubahan itu perlu dipertahankan atau cukup ditimpa, sesuai kebutuhan analitik masing-masing atribut.",
      en: "",
    },
    goal: {
      id: "Hasil konkretnya, dengan SCD Type 2, laporan yang menggabungkan tabel fakta dengan dimensi selalu mendapat nilai atribut yang secara akurat berlaku pada tanggal transaksi tersebut terjadi, bukan nilai atribut versi terbaru — sehingga analisis historis tetap valid meskipun data dimensi sudah berubah berkali-kali sejak saat itu.",
      en: "",
    },
    exampleImplementation: {
      id: "Contoh implementasi SCD Type 2 dengan BigQuery MERGE:\n\n```sql\nMERGE INTO dim_pasien AS target\nUSING staging_pasien AS source\nON target.id_pasien = source.id_pasien AND target.is_current = TRUE\nWHEN MATCHED AND target.alamat != source.alamat THEN\n  UPDATE SET is_current = FALSE, expiry_date = CURRENT_DATE()\nWHEN NOT MATCHED THEN\n  INSERT (id_pasien, alamat, effective_date, expiry_date, is_current)\n  VALUES (source.id_pasien, source.alamat, CURRENT_DATE(), NULL, TRUE);\n```\n\nSetelah baris lama ditandai is_current = FALSE, baris baru dengan alamat terbaru disisipkan sebagai baris is_current = TRUE terpisah — riwayat alamat lama tetap tersimpan utuh di tabel yang sama.",
      en: "",
    },
    exampleEnterprise: {
      id: "Klinika Sehat Group menerapkan SCD Type 2 pada dim_pasien mereka. Ketika seorang pasien pindah alamat, baris lama di dim_pasien diberi expiry_date dan is_current diset false, lalu baris baru disisipkan dengan alamat terbaru. Saat tim compliance menjalankan laporan klaim historis, JOIN ke dim_pasien secara otomatis mengambil alamat yang benar-benar berlaku pada tanggal klaim diajukan — bukan alamat pasien saat ini — menjaga akurasi laporan audit meskipun pasien sudah pindah beberapa kali sejak itu.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- SCD Type 2 mempertahankan riwayat perubahan penuh, membuat laporan historis tetap akurat sesuai kondisi data pada waktunya.\n- SCD Type 1 sederhana diterapkan dan cocok untuk atribut yang koreksinya tidak perlu dilacak (misalnya perbaikan typo nama).\n- SCD Type 3 memberi jalan tengah murah untuk kasus yang hanya butuh membandingkan nilai sebelum dan sesudah, tanpa riwayat penuh.\n- Strategi SCD bisa dipilih berbeda per kolom dalam satu tabel dimensi, sesuai kebutuhan analitik masing-masing atribut.",
        en: "",
      },
      cons: {
        id: "- SCD Type 2 membuat tabel dimensi tumbuh terus seiring waktu karena setiap perubahan menambah baris baru, bukan menimpa.\n- Query terhadap dimensi SCD Type 2 jadi lebih kompleks karena harus memfilter is_current atau mencocokkan rentang effective_date/expiry_date.\n- SCD Type 1 kehilangan riwayat historis selamanya begitu nilai ditimpa, tidak bisa direkonstruksi ulang.\n- SCD Type 3 hanya menyimpan satu langkah perubahan terakhir, tidak cukup untuk kebutuhan audit yang butuh riwayat penuh.",
        en: "",
      },
    },
  },
};
