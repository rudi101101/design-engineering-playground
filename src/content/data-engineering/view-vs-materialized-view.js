export const term = {
  id: "view-vs-materialized-view",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#fde68a",
  icon: "M2 3h20v14H2zM8 21h8M12 17v4",
  simulation: "viewmv",
  tools: ["PostgreSQL MV", "BigQuery MV", "Snowflake Dynamic Tables", "Oracle MV", "MySQL (no native MV)"],
  prerequisites: [],
  related: ["materialized-view", "caching"],
  name: { id: "View vs Materialized View", en: "" },
  content: {
    description: {
      id: "View adalah tabel virtual — ia tidak menyimpan data sendiri, melainkan hanya menyimpan definisi query yang akan dijalankan ulang setiap kali view tersebut diakses, sehingga hasilnya selalu mencerminkan data terkini di tabel dasarnya. Materialized View (MV) sebaliknya menyimpan hasil query secara fisik di disk, seperti tabel biasa, sehingga jauh lebih cepat diakses karena tidak perlu menjalankan ulang query kompleksnya setiap kali — tapi konsekuensinya, data di MV bisa jadi \"basi\" (stale) sampai di-refresh secara eksplisit. Keduanya menjawab kebutuhan yang berbeda: View untuk abstraksi query yang selalu fresh, MV untuk performa pada query berat yang sering diakses.",
      en: "",
    },
    concept: {
      id: "Bayangkan View seperti resep masakan yang kamu masak ulang dari nol setiap kali ada tamu datang — hasilnya selalu segar dan sesuai bahan terbaru di kulkas, tapi butuh waktu masak setiap kali. Materialized View seperti masakan yang sudah dimasak dan disimpan di kulkas, siap disajikan instan kapan pun tamu datang — jauh lebih cepat, tapi kalau bahan di dapur berubah (data sumber ter-update), masakan yang sudah tersimpan itu tidak otomatis ikut berubah sampai kamu memasak ulang batch baru (refresh).",
      en: "",
    },
    methodology: {
      id: "Ketika View diakses lewat SELECT, database menjalankan ulang query SQL yang tersimpan di definisi view tersebut terhadap tabel dasar secara langsung, lalu mengembalikan hasil yang selalu fresh — tapi tanpa keuntungan performa apa pun dibanding menjalankan query itu manual, karena sebenarnya memang itulah yang terjadi di baliknya. Materialized View sebaliknya, ketika diakses, cukup membaca hasil yang sudah tersimpan secara fisik dari eksekusi sebelumnya — jauh lebih cepat karena tidak ada komputasi ulang — tapi hasilnya bisa saja sudah ketinggalan dari kondisi data terbaru sampai proses `REFRESH MATERIALIZED VIEW` dijalankan, baik secara manual maupun terjadwal. MV paling cocok dipakai untuk query mahal (agregasi berat, join kompleks lintas tabel besar) yang sering diakses berulang kali tapi tidak butuh data yang detik-per-detik real-time.",
      en: "",
    },
    objective: {
      id: "Kebutuhan akan dua bentuk ini muncul dari tegangan klasik antara kesegaran data dan performa query: beberapa kasus penggunaan (misalnya laporan operasional harian) benar-benar butuh data yang selalu real-time meski agak lambat, sementara kasus lain (misalnya dashboard analitik agregat) jauh lebih diuntungkan oleh kecepatan instan meski datanya hanya diperbarui tiap beberapa jam.",
      en: "",
    },
    goal: {
      id: "Tujuannya adalah memilih bentuk view yang sesuai trade-off kebutuhan spesifik: View untuk kasus yang butuh selalu fresh meski lambat, atau Materialized View untuk kasus yang butuh kecepatan tinggi dan bisa mentolerir data yang refresh-nya terjadwal, sehingga sistem tidak membebani database dengan query berat berulang kali padahal hasilnya bisa dihitung sekali dan dipakai berkali-kali.",
      en: "",
    },
    exampleImplementation: {
      id: "Membuat kedua jenis view untuk kebutuhan berbeda: laporan klaim yang butuh selalu fresh, dan agregasi harian yang bisa refresh berkala.\n\n1. View biasa untuk laporan yang harus selalu real-time.\n2. Materialized View untuk agregasi berat yang diakses berulang kali oleh dashboard.\n3. Jadwalkan refresh MV secara berkala, misalnya tiap jam via cron atau scheduler.\n\n```sql\n-- View: selalu fresh, dijalankan ulang tiap akses\nCREATE VIEW laporan_klaim_aktif AS\nSELECT k.id, k.status, p.nama\nFROM klaim k\nJOIN pasien p ON p.id = k.patient_id\nWHERE k.status != 'selesai';\n\n-- Materialized View: hasil disimpan fisik, instan saat diakses\nCREATE MATERIALIZED VIEW agregasi_klaim_harian AS\nSELECT DATE(created_at) AS tanggal,\n       COUNT(*) AS jumlah_klaim,\n       SUM(jumlah_klaim) AS total_nilai\nFROM klaim\nGROUP BY DATE(created_at);\n\n-- Refresh terjadwal (misal tiap jam)\nREFRESH MATERIALIZED VIEW CONCURRENTLY agregasi_klaim_harian;\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "PT Nusantara Asuransi punya dua kebutuhan berbeda di sistem klaim mereka. Tim operasional butuh laporan status klaim yang selalu real-time untuk menjawab pertanyaan pelanggan — mereka pakai View biasa yang query-nya dijalankan ulang tiap akses, memang butuh sekitar 10 detik tapi datanya dijamin akurat detik itu juga. Sementara tim eksekutif hanya butuh melihat dashboard agregasi jumlah dan nilai klaim per hari untuk pengambilan keputusan strategis — untuk ini tim data membuat Materialized View yang di-refresh tiap jam, sehingga dashboard yang tadinya butuh 10 detik untuk load agregasi berat itu sekarang tampil instan, dengan trade-off data maksimal telat satu jam yang sepenuhnya bisa diterima untuk kebutuhan itu.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- View memberi abstraksi query yang selalu fresh tanpa duplikasi data fisik apa pun\n- Materialized View memberi lonjakan performa signifikan untuk query agregasi berat yang sering diakses berulang\n- View memudahkan pemeliharaan logika query kompleks di satu tempat, dipakai ulang tanpa copy-paste SQL\n- MV bisa diberi index sendiri di atas hasil yang tersimpan, sesuatu yang tidak mungkin dilakukan pada View biasa",
        en: "",
      },
      cons: {
        id: "- View tidak memberi keuntungan performa apa pun dibanding menjalankan query aslinya secara langsung\n- Materialized View bisa menyajikan data basi (stale) sampai proses refresh berikutnya dijalankan, berisiko kalau dipakai di tempat yang butuh real-time\n- Refresh MV pada dataset besar bisa memakan waktu dan resource signifikan, perlu dijadwalkan dengan hati-hati\n- MySQL tidak punya dukungan native untuk Materialized View, sehingga butuh workaround seperti tabel summary manual yang di-update via trigger atau job terjadwal",
        en: "",
      },
    },
  },
};
