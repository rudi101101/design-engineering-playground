export const term = {
  id: "connection-string-dsn",
  track: "data-engineering",
  category: "Advanced SQL",
  color: "#f59e0b",
  icon: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  simulation: "connstring",
  tools: ["PostgreSQL", "SQLAlchemy", "psycopg2", "BigQuery connection", "Cloud SQL Proxy"],
  prerequisites: [],
  related: ["connection-pooling"],
  name: { id: "Connection String & DSN", en: "Connection String & DSN" },
  content: {
    description: {
      id: "Connection String, atau juga disebut DSN (Data Source Name), adalah string terstruktur yang meng-encode semua informasi yang dibutuhkan aplikasi untuk terhubung ke database — mulai dari jenis database, kredensial, alamat host, port, hingga nama database dan parameter koneksi tambahan seperti mode SSL. Ini adalah komponen kecil tapi krusial dalam setiap aplikasi yang berinteraksi dengan database, dan salah satu kesalahan keamanan paling umum adalah meng-hardcode connection string lengkap dengan password langsung di dalam kode sumber, alih-alih menyimpannya secara aman terpisah dari kode.",
      en: "",
    },
    concept: {
      id: "Bayangkan connection string seperti alamat lengkap plus kunci rumah yang ditulis dalam satu kartu: 'jalan apa, nomor rumah berapa, kunci mana yang dipakai, dan pintu mana yang harus dibuka'. Menaruh kartu ini langsung di kode sumber yang tersimpan di Git sama seperti menempelkan kartu berisi alamat dan kunci rumahmu di papan pengumuman publik — siapa pun yang punya akses ke kode bisa langsung masuk ke rumahmu (database produksi).",
      en: "",
    },
    methodology: {
      id: "Format umum connection string mengikuti pola `dialect://user:password@host:port/dbname?params`, di mana dialect menunjukkan jenis database (postgresql, mysql, dll), diikuti kredensial, lokasi server, nama database spesifik, dan parameter tambahan seperti `sslmode` untuk mengatur enkripsi koneksi. Praktik yang benar adalah menyimpan connection string ini bukan sebagai teks polos di kode, melainkan di layanan seperti Secret Manager atau sebagai environment variable yang di-inject saat runtime. Aplikasi kemudian membaca connection string dari environment variable saat startup, mem-parsing komponennya, lalu menggunakan informasi itu untuk terhubung ke host dan port yang dituju, melakukan autentikasi, dan memilih database yang tepat.",
      en: "",
    },
    objective: {
      id: "Connection string ada sebagai cara standar untuk meng-encapsulate semua parameter koneksi database dalam satu format yang bisa dipahami berbagai driver dan library secara konsisten. Praktik menyimpannya di luar kode sumber ada karena kredensial database yang bocor ke repository kode (terutama yang public atau diakses banyak orang) adalah salah satu penyebab paling umum kebocoran data dalam insiden keamanan nyata.",
      en: "",
    },
    goal: {
      id: "Hasilnya adalah aplikasi yang bisa terhubung ke database dengan konfigurasi yang fleksibel antar environment (development, staging, production) tanpa mengubah kode, sekaligus kredensial database yang tidak pernah tersimpan dalam bentuk teks polos di dalam kode sumber atau riwayat Git yang bisa diakses siapa pun dengan akses ke repository.",
      en: "",
    },
    exampleImplementation: {
      id: "Praktik aman menangani connection string:\n\n1. Simpan connection string di Secret Manager atau sebagai environment variable, bukan hardcoded di kode.\n2. Aplikasi membaca environment variable saat startup.\n3. Library koneksi (misalnya psycopg2 atau SQLAlchemy) mem-parsing string tersebut.\n4. Koneksi dibuat ke host:port dengan autentikasi dan database yang sesuai.\n\n```python\nimport os\nfrom sqlalchemy import create_engine\n\n# Dibaca dari environment variable, bukan hardcoded\nDATABASE_URL = os.environ[\"DATABASE_URL\"]\n# contoh isi: postgresql://app:secret@10.0.0.1:5432/klaim_db?sslmode=require\n\nengine = create_engine(DATABASE_URL)\n```\n\n```bash\n# .env (tidak pernah di-commit ke Git, ditambahkan ke .gitignore)\nDATABASE_URL=postgresql://app:secret@10.0.0.1:5432/klaim_db?sslmode=require\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Fintech Cepat pernah mengalami insiden ketika seorang developer baru tanpa sengaja mem-push kode yang berisi connection string lengkap dengan password database produksi ke repository Git internal. Setelah insiden itu, tim platform mewajibkan seluruh connection string disimpan di Secret Manager dan diakses lewat environment variable saat runtime, dengan aturan bahwa file `.env` yang berisi kredensial lokal wajib masuk `.gitignore` — mencegah kejadian serupa terulang dan membatasi blast radius jika suatu saat kode memang bocor.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Format standar yang dipahami luas oleh berbagai driver dan library database, memudahkan portabilitas antar bahasa pemrograman\n- Memisahkan konfigurasi koneksi dari kode membuat aplikasi mudah dipindah antar environment tanpa perubahan kode\n- Menyimpan di Secret Manager mengurangi risiko kebocoran kredensial lewat riwayat Git atau kode yang dibagikan\n- Parameter tambahan seperti sslmode memungkinkan pengaturan keamanan koneksi langsung dari satu string terstruktur",
        en: "",
      },
      cons: {
        id: "- Tim yang tidak disiplin masih bisa dengan mudah hardcode connection string langsung di kode meski praktik terbaik tersedia\n- Perbedaan format connection string antar database (dialect) bisa membingungkan saat migrasi antar jenis database\n- Menyimpan di Secret Manager menambah satu dependency infrastruktur lagi yang harus tersedia saat aplikasi startup\n- Rotasi kredensial (mengganti password) butuh koordinasi agar semua service yang memakai connection string yang sama ikut diperbarui",
        en: "",
      },
    },
  },
};
