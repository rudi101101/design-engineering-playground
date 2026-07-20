export const term = {
  id: "normalization-1nf-3nf-bcnf",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#fcd34d",
  icon: "M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z",
  simulation: "normalization",
  tools: ["MySQL", "PostgreSQL", "Oracle", "SQL Server", "ERwin"],
  prerequisites: ["primary-key-composite-key"],
  related: ["star-schema", "snowflake-schema"],
  name: { id: "Normalization 1NF–3NF–BCNF", en: "Normalization 1NF–3NF–BCNF" },
  content: {
    description: {
      id: "Normalisasi adalah proses merestrukturisasi desain tabel database untuk menghilangkan redundansi data dan anomali update, dengan cara memecah tabel besar menjadi tabel-tabel lebih kecil yang saling berelasi. Prosesnya berjalan bertahap melalui level-level formal: 1NF (First Normal Form) mensyaratkan nilai atomik dan baris unik, 2NF menghilangkan partial dependency, 3NF menghilangkan transitive dependency, dan BCNF (Boyce-Codd Normal Form) adalah versi yang lebih ketat dari 3NF untuk menutup celah kasus tertentu.",
      en: "",
    },
    concept: {
      id: "Bayangkan tabel yang belum dinormalisasi seperti satu lembar spreadsheet raksasa yang mencatat nama pelanggan berulang-ulang di setiap baris transaksi mereka. Kalau nama pelanggan itu salah ketik atau berubah, kamu harus mengubahnya di ratusan baris sekaligus — rawan human error dan tidak konsisten. Normalisasi seperti memisahkan spreadsheet itu menjadi 'buku alamat pelanggan' terpisah dan 'buku catatan transaksi' yang hanya mereferensikan ID pelanggan — ubah nama sekali di buku alamat, otomatis berlaku ke semua transaksi terkait.",
      en: "",
    },
    methodology: {
      id: "Proses normalisasi berjalan bertahap. 1NF mensyaratkan setiap kolom berisi nilai atomik (tidak ada daftar atau grup berulang dalam satu sel) dan setiap baris bisa diidentifikasi unik. 2NF membangun di atas 1NF dengan mensyaratkan setiap atribut non-key harus bergantung penuh pada seluruh primary key, bukan hanya sebagian darinya (menghindari partial dependency, relevan untuk tabel dengan composite key). 3NF melangkah lebih jauh dengan menghilangkan transitive dependency — atribut non-key tidak boleh bergantung pada atribut non-key lainnya, melainkan harus bergantung langsung pada primary key. BCNF adalah penyempurnaan 3NF untuk menangani kasus di mana ada lebih dari satu candidate key yang saling tumpang tindih secara fungsional.",
      en: "",
    },
    objective: {
      id: "Normalisasi ada untuk mengatasi tiga jenis anomali klasik pada desain database yang buruk: anomali insert (tidak bisa menambah data tanpa data lain yang tidak relevan), anomali update (harus mengubah data yang sama di banyak tempat, rawan inkonsistensi), dan anomali delete (menghapus satu baris tidak sengaja menghilangkan informasi lain yang masih dibutuhkan). Dengan struktur ternormalisasi, setiap fakta hanya disimpan di satu tempat.",
      en: "",
    },
    goal: {
      id: "Hasil yang dicapai adalah database transaksional (OLTP) yang bebas dari redundansi data, konsisten secara integritas, dan hemat ruang penyimpanan — meskipun trade-off-nya adalah query analitik yang butuh JOIN antar banyak tabel menjadi lebih kompleks, sehingga di dunia data warehouse, denormalisasi justru sering sengaja dilakukan demi performa baca.",
      en: "",
    },
    exampleImplementation: {
      id: "Contoh progresi normalisasi dari tabel mentah ke 3NF:\n\n1. Unnormalized: tabel pesanan menyimpan nama_pelanggan, alamat_pelanggan, dan daftar_item dalam satu kolom bertumpuk.\n2. 1NF: pecah daftar_item menjadi baris-baris terpisah, setiap sel berisi nilai atomik.\n3. 2NF: pisahkan atribut yang hanya bergantung sebagian pada composite key (order_id, item_id) ke tabel tersendiri.\n4. 3NF: pindahkan alamat_pelanggan yang sebenarnya bergantung pada pelanggan (bukan langsung pada pesanan) ke tabel pelanggan terpisah.\n\n```sql\n-- Setelah normalisasi 3NF\nCREATE TABLE pelanggan (\n  pelanggan_id SERIAL PRIMARY KEY,\n  nama VARCHAR(100),\n  alamat VARCHAR(255)\n);\nCREATE TABLE pesanan (\n  pesanan_id SERIAL PRIMARY KEY,\n  pelanggan_id INT REFERENCES pelanggan(pelanggan_id),\n  tanggal DATE\n);\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Sistem klaim asuransi milik Klinika Sehat awalnya dirancang dalam MySQL dengan struktur ternormalisasi penuh hingga 3NF — data pasien, dokter, dan klaim masing-masing disimpan sekali di tabelnya sendiri tanpa redundansi, sehingga update alamat pasien cukup dilakukan di satu tempat. Namun ketika tim data warehouse membangun data mart di BigQuery untuk kebutuhan pelaporan, mereka justru sengaja mendenormalisasi data tersebut ke bentuk Star Schema agar query analitik lintas jutaan baris klaim tidak perlu melakukan banyak JOIN dan bisa berjalan jauh lebih cepat.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Menghilangkan redundansi data sehingga update cukup dilakukan di satu tempat\n- Mencegah anomali insert, update, dan delete yang umum terjadi pada desain tabel datar\n- Menjaga integritas data lebih baik karena setiap fakta punya satu sumber kebenaran\n- Struktur tabel lebih hemat storage untuk beban kerja transaksional (OLTP)",
        en: "",
      },
      cons: {
        id: "- Query analitik membutuhkan lebih banyak JOIN antar tabel, yang bisa memperlambat pembacaan data skala besar\n- Desain skema menjadi lebih kompleks dan butuh pemahaman mendalam tentang functional dependency\n- Tidak selalu cocok untuk sistem data warehouse yang justru mengutamakan kecepatan baca lewat denormalisasi\n- Perubahan skema (menambah tabel baru saat naik level normalisasi) bisa berdampak luas ke aplikasi yang sudah berjalan",
        en: "",
      },
    },
  },
};
