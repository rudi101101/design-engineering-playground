export const term = {
  id: "connection-pooling",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#67e8f9",
  icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  simulation: "connpool",
  tools: ["PgBouncer", "HikariCP", "SQLAlchemy Pool", "pgpool-II", "Supabase Pooler"],
  prerequisites: [],
  related: ["connection-string-dsn"],
  name: { id: "Connection Pooling", en: "Connection Pooling" },
  content: {
    description: {
      id: "**Connection pooling** adalah teknik menyimpan dan menggunakan kembali (*reuse*) sejumlah koneksi database yang sudah terbuka, alih-alih membuka dan menutup koneksi baru setiap kali ada request. Membuka koneksi database baru itu **mahal secara komputasi** karena melibatkan proses TCP handshake, autentikasi, dan alokasi resource di sisi server database. Dengan connection pool, aplikasi cukup 'meminjam' koneksi yang sudah siap pakai dari pool, memakainya, lalu mengembalikannya untuk dipakai request berikutnya.",
      en: "",
    },
    concept: {
      id: "*Bayangkan* connection pooling seperti sistem antrian taksi di bandara, bukan memanggil taksi baru dari garasi setiap kali ada penumpang. Sejumlah taksi (koneksi) sudah standby dan mesin menyala di area penjemputan. Penumpang (request) tinggal naik ke taksi yang tersedia, dan begitu selesai, taksi itu kembali antre untuk penumpang berikutnya — **jauh lebih cepat** dibanding harus memanggil taksi baru dari nol setiap kali, yang makan waktu dan bahan bakar ekstra.",
      en: "",
    },
    methodology: {
      id: "Pool mempertahankan sejumlah N koneksi aktif ke database sesuai konfigurasi (min/max pool size). Ketika aplikasi butuh mengeksekusi query, ia meminta koneksi *idle* dari pool manager. Jika ada koneksi bebas, pool langsung memberikannya; jika semua koneksi sedang dipakai, request baru akan **masuk antrian (queue)** sampai ada koneksi yang dilepas kembali. Setelah query selesai dieksekusi, koneksi tidak ditutup melainkan dikembalikan ke pool dalam keadaan siap pakai untuk request berikutnya. Beberapa pooler seperti PgBouncer bahkan berjalan sebagai *proxy* terpisah di depan database, memungkinkan **multiplexing ribuan koneksi** aplikasi ke jumlah koneksi database yang jauh lebih kecil.",
      en: "",
    },
    objective: {
      id: "Connection pooling ada untuk mengatasi masalah **overhead pembuatan koneksi** yang berulang-ulang, terutama pada aplikasi web modern yang menerima ribuan request per detik dengan pola *short-lived connection*. Tanpa pooling, database bisa **cepat kehabisan slot koneksi maksimum** dan setiap request akan terasa lambat karena harus melalui proses handshake dan autentikasi dari nol setiap kali.",
      en: "",
    },
    goal: {
      id: "Hasil yang dicapai adalah **penurunan latency per-request secara signifikan** karena menghilangkan overhead pembuatan koneksi berulang, serta database yang tetap stabil dan tidak kehabisan slot koneksi meskipun menghadapi **ribuan request concurrent** dari aplikasi.",
      en: "",
    },
    exampleImplementation: {
      id: "Contoh alur kerja connection pooling dengan PgBouncer di depan PostgreSQL:\n\n1. Aplikasi mengirim request query ke PgBouncer, bukan langsung ke PostgreSQL.\n2. PgBouncer mengambil koneksi idle dari pool internalnya (misal **20 koneksi aktif** ke PostgreSQL).\n3. Query dieksekusi menggunakan koneksi tersebut.\n4. Koneksi dikembalikan ke pool begitu query selesai, siap dipakai request berikutnya.\n5. Jika semua koneksi sedang sibuk, request baru masuk antrian sampai ada slot kosong.\n\n```ini\n; pgbouncer.ini\n[databases]\nappdb = host=127.0.0.1 port=5432 dbname=appdb\n\n[pgbouncer]\npool_mode = transaction\nmax_client_conn = 1000\ndefault_pool_size = 20\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Fintech Cepat menjalankan API pembayaran yang menerima lonjakan hingga **1000 request concurrent** saat jam sibuk. Sebelum memakai PgBouncer, database sering kehabisan slot koneksi dan aplikasi crash dengan error 'too many connections'. Setelah mengimplementasikan PgBouncer dengan pool **20 koneksi** ke PostgreSQL, seluruh 1000 request tersebut masuk antrian ringan di level pooler dan dilayani secara efisien tanpa pernah membuat 1000 koneksi fisik baru ke database, sehingga **latency turun drastis** dan database tetap stabil.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- **Mengurangi drastis** overhead pembuatan koneksi berulang, menurunkan latency per-request\n- Mencegah database kehabisan slot koneksi maksimum saat trafik tinggi\n- Memungkinkan aplikasi menangani **jauh lebih banyak** concurrent request daripada jumlah koneksi fisik ke database\n- Beberapa pooler mendukung mode *transaction-level pooling* yang memaksimalkan pemakaian ulang koneksi",
        en: "",
      },
      cons: {
        id: "- Menambah komponen infrastruktur baru yang perlu dikelola dan dimonitor\n- Mode pooling tertentu (*transaction mode*) **tidak kompatibel** dengan fitur session-level seperti prepared statement atau temporary table\n- Konfigurasi pool size yang salah bisa menyebabkan antrian panjang atau justru pemborosan resource\n- Menambah satu hop jaringan tambahan yang berpotensi menjadi **single point of failure** jika tidak di-setup high availability",
        en: "",
      },
    },
  },
};
