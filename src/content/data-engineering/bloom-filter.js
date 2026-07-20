export const term = {
  id: "bloom-filter",
  track: "data-engineering",
  category: "Performa",
  color: "#22d3ee",
  icon: "M21 21l-4.35-4.35M17 11a6 6 0 1 1-12 0 6 6 0 0 1 12 0z",
  simulation: "bloom",
  tools: [
    "Apache Parquet (bloom)",
    "Apache Kafka",
    "Cassandra",
    "Redis",
    "PostgreSQL",
  ],
  prerequisites: [],
  related: ["columnar-storage", "database-index"],
  name: { id: "Bloom Filter", en: "Bloom Filter" },
  content: {
    description: {
      id: "Bloom Filter adalah struktur data probabilistik yang menjawab satu pertanyaan sederhana dengan sangat efisien dari segi memori: apakah sebuah elemen MUNGKIN ada di dalam sebuah kumpulan data, atau PASTI TIDAK ada. Sifat uniknya adalah asimetris — false positive mungkin terjadi (bilang 'mungkin ada' padahal sebenarnya tidak ada), tapi false negative TIDAK PERNAH terjadi (kalau bilang 'pasti tidak ada', maka memang benar-benar tidak ada). Sifat ini membuatnya sangat berguna sebagai filter cepat sebelum melakukan operasi pencarian yang jauh lebih mahal, karena Anda bisa mempercayai penuh jawaban 'tidak ada' untuk melewati pencarian yang tidak perlu.",
      en: "",
    },
    concept: {
      id: "Bayangkan Bloom Filter seperti seorang resepsionis di gedung apartemen besar yang hafal secara samar siapa saja yang pernah dilaporkan tinggal di sana, tapi tidak punya daftar lengkap yang pasti. Kalau Anda tanya 'apakah Budi tinggal di sini?', resepsionis bisa dengan yakin bilang 'TIDAK, saya yakin dia bukan penghuni sini' — dan Anda bisa langsung pergi ke gedung lain tanpa perlu mengecek lebih jauh. Tapi kalau dia bilang 'sepertinya iya, mungkin dia tinggal di sini', Anda tetap perlu memverifikasi lebih lanjut (misalnya cek langsung ke unit) karena resepsionis bisa saja keliru mengira Budi tinggal di sana padahal itu orang lain yang mirip.",
      en: "",
    },
    methodology: {
      id: "Bloom Filter bekerja dengan sebuah array bit berukuran tetap dan sejumlah k fungsi hash. Saat sebuah elemen dimasukkan (INSERT), elemen tersebut di-hash dengan k fungsi hash berbeda, menghasilkan k posisi di array bit, dan semua posisi itu di-set menjadi 1. Saat melakukan pencarian (LOOKUP), elemen yang dicari di-hash dengan k fungsi hash yang sama untuk mendapatkan k posisi yang seharusnya. Jika ada satu saja dari posisi tersebut yang bernilai 0, maka elemen itu DIPASTIKAN TIDAK ADA di dalam set — karena kalau memang pernah dimasukkan, semua posisi itu pasti sudah di-set 1. Namun jika semua posisi bernilai 1, elemen tersebut hanya PROBABLY PRESENT (mungkin ada) — karena bisa saja posisi-posisi itu ter-set 1 oleh kombinasi elemen lain (hash collision), bukan oleh elemen yang sedang dicari.",
      en: "",
    },
    objective: {
      id: "Bloom Filter menyelesaikan masalah biaya I/O yang mahal saat harus mencari apakah sebuah nilai ada di dalam dataset besar yang tersebar di banyak file atau node. Tanpa filter ini, sistem harus membuka dan memindai setiap file kandidat untuk memastikan sebuah nilai tidak ada di dalamnya — proses yang lambat dan mahal jika dilakukan berulang kali pada dataset besar. Dengan menyimpan struktur bit yang jauh lebih kecil di memori, sistem bisa dengan cepat 'melewati' (skip) file-file yang pasti tidak relevan, dan hanya melakukan pencarian mahal pada file yang benar-benar berpotensi mengandung nilai tersebut.",
      en: "",
    },
    goal: {
      id: "Operasi pencarian yang sebelumnya harus memindai seluruh file atau partisi data bisa melewati sebagian besar kandidat yang tidak relevan secara instan, mengurangi I/O secara drastis — dalam kasus tipikal bisa menghemat mayoritas operasi baca — dengan trade-off ruang memori yang jauh lebih kecil dibanding menyimpan daftar lengkap seluruh elemen.",
      en: "",
    },
    exampleImplementation: {
      id: "Alur pemanfaatan Bloom Filter di Apache Parquet untuk mempercepat pencarian claim_id tertentu:\n\n1. **INSERT (saat penulisan file)** — setiap claim_id yang ditulis ke sebuah file Parquet di-hash k kali, dan bit yang sesuai di-set 1, lalu bloom filter tersebut disimpan sebagai bagian dari metadata file.\n2. **LOOKUP (saat query)** — sebelum membuka dan memindai isi file, mesin kueri mengecek bloom filter file tersebut terlebih dahulu.\n3. Jika bloom filter menunjukkan 'pasti tidak ada', file itu dilewati sepenuhnya tanpa dibuka.\n4. Jika menunjukkan 'mungkin ada', file baru dibuka dan dipindai untuk verifikasi.\n\nContoh konfigurasi bloom filter saat menulis file Parquet:\n\n```python\nimport pyarrow.parquet as pq\n\npq.write_table(\n    table,\n    \"claims_2024.parquet\",\n    use_bloom_filter=True,\n    bloom_filter_columns=[\"claim_id\"],\n)\n```\n\nDengan konfigurasi ini, mesin kueri seperti Spark atau Trino yang membaca file tersebut bisa langsung melewati file yang bloom filter-nya menunjukkan claim_id target pasti tidak ada, tanpa membuka satu byte pun dari file itu.",
      en: "",
    },
    exampleEnterprise: {
      id: "PT Nusantara Logistik menyimpan data pengiriman dalam ribuan file Parquet yang terpartisi per hari, dengan total miliaran baris. Ketika tim customer service perlu mencari status pengiriman berdasarkan nomor resi tertentu, tanpa bloom filter, mesin kueri harus membuka dan memindai setiap file kandidat yang mungkin mengandung resi tersebut — proses yang lambat karena harus melakukan I/O ke storage untuk ribuan file. Setelah bloom filter diaktifkan pada kolom nomor resi, mesin kueri bisa langsung melewati sekitar 90% file yang pasti tidak mengandung resi yang dicari hanya dengan mengecek metadata ringan, sehingga waktu respons pencarian turun drastis tanpa perlu menambah kapasitas storage yang signifikan.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Sangat hemat memori dibanding menyimpan daftar lengkap seluruh elemen, terutama untuk dataset masif\n- Jaminan tidak ada false negative membuatnya bisa dipercaya penuh untuk melewati (skip) pencarian yang tidak perlu\n- Operasi insert dan lookup berjalan dalam waktu konstan O(k), sangat cepat terlepas dari ukuran dataset\n- Sangat efektif dikombinasikan dengan format kolom seperti Parquet untuk mengurangi I/O secara signifikan",
        en: "",
      },
      cons: {
        id: "- Menghasilkan false positive yang tidak bisa dihindari sepenuhnya, sehingga tetap butuh verifikasi tambahan saat elemen 'mungkin ada'\n- Tidak bisa menghapus elemen dari bloom filter standar tanpa struktur tambahan (counting bloom filter)\n- Ukuran array bit dan jumlah fungsi hash harus dikonfigurasi dengan tepat di awal — terlalu kecil meningkatkan false positive rate, terlalu besar memboroskan memori\n- Tidak menyimpan elemen aslinya, jadi tidak bisa dipakai untuk mengambil data, hanya untuk memeriksa keberadaan",
        en: "",
      },
    },
  },
};
