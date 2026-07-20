export const term = {
  id: "fact-table-types",
  track: "data-engineering",
  category: "Modeling",
  color: "#c084fc",
  icon: "M12 2l7 4v8l-7 4-7-4V6z",
  simulation: "facttypes",
  tools: ["BigQuery", "dbt", "Snowflake", "Power BI", "Tableau"],
  prerequisites: ["star-schema"],
  related: ["scd"],
  name: { id: "Fact Table Types", en: "Fact Table Types" },
  content: {
    description: {
      id: "Fact Table Types menjelaskan empat pola desain tabel fakta yang umum dipakai dalam pemodelan dimensional, masing-masing cocok untuk karakteristik proses bisnis yang berbeda: Transaction Fact Table mencatat satu baris per kejadian/event, Periodic Snapshot mencatat kondisi terukur pada interval waktu tetap, Accumulating Snapshot melacak progres suatu proses melalui beberapa tahap/milestone dalam satu baris yang terus diperbarui, dan Factless Fact Table mencatat kejadian atau relasi tanpa metrik numerik sama sekali, sekadar menandai bahwa suatu peristiwa terjadi.",
      en: "",
    },
    concept: {
      id: "Bayangkan empat cara berbeda mencatat perjalanan sebuah klaim asuransi. Transaction fact table seperti buku catatan yang menulis satu baris setiap kali ada kejadian — klaim diajukan, dicatat; klaim direvisi, dicatat lagi sebagai baris baru. Periodic snapshot seperti mengambil foto saldo rekening setiap akhir hari, walau tidak ada transaksi sama sekali hari itu, tetap ada satu baris foto kondisi hari itu. Accumulating snapshot seperti satu lembar form pelacakan pengiriman paket yang terus ditambahi cap stempel setiap kali paket mencapai tahap baru — diterima, diverifikasi, dibayar — semua di baris form yang sama, bukan form baru tiap tahap. Factless fact table seperti buku tamu yang hanya mencatat 'si A hadir di acara B pada tanggal ini', tanpa angka apapun untuk dijumlahkan, sekadar mencatat bahwa kehadiran itu terjadi.",
      en: "",
    },
    methodology: {
      id: "Transaction fact table melakukan INSERT satu baris baru setiap kali event bisnis terjadi — ini pola paling umum dan paling granular. Periodic snapshot fact table melakukan INSERT satu baris di akhir setiap periode (harian, mingguan) yang mencatat seluruh state terukur pada saat itu, terlepas dari ada tidaknya aktivitas di periode tersebut — cocok untuk metrik seperti saldo. Accumulating snapshot fact table berbeda dari dua lainnya karena melibatkan UPDATE berulang pada baris yang sama — satu baris dibuat saat proses dimulai, lalu kolom timestamp untuk setiap milestone (submitted, verified, paid) diisi/diperbarui seiring proses itu maju ke tahap berikutnya, sehingga satu baris merepresentasikan seluruh siklus hidup satu entitas.",
      en: "",
    },
    objective: {
      id: "Proses bisnis punya karakteristik waktu yang sangat berbeda-beda: sebagian adalah kejadian diskrit (satu klaim, satu transaksi), sebagian adalah kondisi yang perlu dipantau berkala meski tidak ada aktivitas (saldo harian), dan sebagian adalah proses multi-tahap yang progresnya perlu dilacak dari awal sampai selesai (pipeline klaim). Memaksakan satu pola fact table untuk seluruh kasus ini akan menghasilkan model yang janggal — misalnya mencoba melacak progres multi-tahap dengan transaction fact table murni akan memaksa banyak JOIN rumit untuk merekonstruksi urutan tahap yang sebenarnya bisa dibaca langsung dari satu baris di accumulating snapshot.",
      en: "",
    },
    goal: {
      id: "Hasil konkretnya, memilih tipe fact table yang tepat membuat query analitik jadi jauh lebih natural dan efisien sesuai kebutuhan: transaction fact table memudahkan penghitungan volume/agregasi event, periodic snapshot memudahkan pelaporan tren kondisi dari waktu ke waktu, dan accumulating snapshot memudahkan analisis durasi antar tahap (misalnya rata-rata waktu dari klaim diajukan sampai dibayar) tanpa perlu JOIN kompleks.",
      en: "",
    },
    exampleImplementation: {
      id: "Contoh tiga jenis fact table untuk proses klaim yang sama:\n\n```sql\n-- Transaction fact: satu baris per event klaim\nCREATE TABLE fact_klaim (\n  id_klaim INT, tanggal_klaim DATE, jumlah NUMERIC, id_pasien INT\n);\n\n-- Periodic snapshot fact: satu baris per hari, terlepas ada aktivitas atau tidak\nCREATE TABLE fact_saldo_harian (\n  tanggal DATE, id_polis INT, saldo_klaim_tersedia NUMERIC\n);\n\n-- Accumulating snapshot fact: satu baris per klaim, kolom milestone di-UPDATE seiring proses\nCREATE TABLE fact_proses_klaim (\n  id_klaim INT,\n  tgl_submitted DATE,\n  tgl_verified DATE,\n  tgl_paid DATE\n);\n\n-- Update saat klaim naik ke tahap verified\nUPDATE fact_proses_klaim SET tgl_verified = CURRENT_DATE() WHERE id_klaim = 10234;\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "PT Nusantara Asuransi memakai ketiga jenis fact table sekaligus untuk kebutuhan berbeda: fact_klaim (transaction) mencatat setiap pengajuan klaim sebagai baris terpisah untuk laporan volume harian, fact_saldo_harian (periodic snapshot) mencatat sisa plafon klaim setiap polis setiap akhir hari untuk pemantauan risiko, dan fact_proses_klaim (accumulating snapshot) melacak satu baris per klaim yang kolom tanggalnya terisi bertahap — submitted, verified, paid — sehingga tim operasional bisa langsung menghitung rata-rata waktu proses klaim dari satu tabel tanpa JOIN rumit.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Transaction fact table memberi granularitas tertinggi, cocok untuk hampir semua analisis volume dan agregasi event.\n- Periodic snapshot fact table memudahkan pelacakan tren metrik yang berubah perlahan seperti saldo atau inventori, termasuk saat tidak ada aktivitas.\n- Accumulating snapshot fact table menyederhanakan analisis durasi antar tahap proses menjadi perhitungan sederhana antar kolom dalam satu baris.\n- Factless fact table memungkinkan pemodelan kejadian atau relasi penting (mis. kehadiran) yang secara alami tidak punya metrik numerik.",
        en: "",
      },
      cons: {
        id: "- Periodic snapshot fact table bisa menghasilkan volume data sangat besar karena mencatat baris di setiap periode meski tidak ada perubahan berarti.\n- Accumulating snapshot fact table butuh proses UPDATE berulang pada baris yang sama, yang bertentangan dengan pola insert-only yang lebih umum di data warehouse modern.\n- Salah memilih tipe fact table untuk suatu proses bisnis bisa memaksa query melakukan rekonstruksi rumit yang seharusnya bisa dihindari dari awal.\n- Accumulating snapshot menyimpan hanya kondisi terkini per baris, sehingga kurang cocok jika riwayat perubahan tiap milestone (bukan cuma tanggal terakhirnya) juga perlu dilacak.",
        en: "",
      },
    },
  },
};
