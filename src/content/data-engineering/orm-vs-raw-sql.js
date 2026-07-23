export const term = {
  id: "orm-vs-raw-sql",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#fef08a",
  icon: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  simulation: "orm",
  tools: ["SQLAlchemy", "Django ORM", "Prisma", "TypeORM", "Hibernate"],
  prerequisites: [],
  related: ["stored-procedure-function"],
  name: { id: "ORM vs Raw SQL", en: "" },
  content: {
    description: {
      id: "**ORM (Object-Relational Mapping)** adalah lapisan abstraksi yang memetakan objek dalam kode program ke baris tabel database, secara otomatis menghasilkan SQL di baliknya sehingga developer bisa berinteraksi dengan database memakai sintaks bahasa pemrograman yang familiar alih-alih menulis SQL mentah. **Raw SQL** adalah pendekatan sebaliknya — menulis query SQL secara langsung dan eksplisit. Keduanya **bukan pilihan yang saling meniadakan**; kebanyakan sistem nyata memakai kombinasi keduanya, ORM untuk operasi CRUD sehari-hari yang butuh produktivitas tinggi, dan raw SQL untuk query analitik kompleks yang butuh kontrol performa maksimal.",
      en: "",
    },
    concept: {
      id: "*Bayangkan* ORM seperti memakai aplikasi ride-hailing untuk pergi ke suatu tempat — kamu cukup masukkan tujuan, dan aplikasi otomatis mengurus rute, driver, dan navigasinya, praktis dan cepat untuk perjalanan sehari-hari. Raw SQL seperti menyetir mobil sendiri dengan peta di tangan — lebih repot untuk perjalanan biasa, tapi kalau kamu perlu ambil rute alternatif yang sangat spesifik karena tahu jalan pintas yang aplikasi tidak tahu (optimisasi query yang sangat spesifik), menyetir sendiri memberimu **kontrol penuh** yang aplikasi ride-hailing tidak bisa berikan.",
      en: "",
    },
    methodology: {
      id: "Dengan ORM, developer mendefinisikan model (class) yang merepresentasikan struktur tabel, lalu memanggil method-method ORM (misalnya `User.objects.filter(status='aktif')`) yang secara internal diterjemahkan ORM menjadi SQL yang sesuai, dieksekusi ke database, dan hasilnya dipetakan otomatis kembali menjadi objek program. Dengan raw SQL, developer menulis SQL secara eksplisit, mengeksekusinya langsung, lalu memetakan hasil secara manual ke struktur data yang dibutuhkan. Trade-off utamanya: ORM memberi **type-safety** dari bahasa pemrograman, perlindungan otomatis dari SQL injection lewat *parameterized query*, dan kemudahan migrasi skema — tapi rawan masalah **N+1 query** (ORM secara tidak sadar menjalankan satu query tambahan per baris hasil, alih-alih satu query gabungan) dan kontrol yang lebih terbatas atas SQL yang benar-benar dihasilkan.",
      en: "",
    },
    objective: {
      id: "Perdebatan ORM vs raw SQL muncul dari tegangan antara **produktivitas developer** dan **kontrol performa**: ORM mempercepat pengembangan fitur CRUD standar secara drastis dan mengurangi risiko bug keamanan seperti SQL injection, tapi abstraksinya bisa menyembunyikan inefisiensi (seperti N+1 query) yang baru terasa saat sistem sudah berjalan di skala produksi dengan volume data besar, di mana raw SQL yang dioptimalkan tangan jadi jauh lebih unggul.",
      en: "",
    },
    goal: {
      id: "Tujuannya adalah memilih pendekatan yang sesuai konteks: ORM untuk kecepatan pengembangan pada operasi CRUD standar yang tidak butuh optimisasi ekstrem, dan raw SQL untuk query analitik kompleks atau titik kritis performa yang butuh kontrol penuh atas rencana eksekusi — **bukan memaksakan satu pendekatan** untuk semua kasus.",
      en: "",
    },
    exampleImplementation: {
      id: "Perbandingan langsung: operasi CRUD sederhana lewat ORM vs query analitik kompleks lewat raw SQL, dalam konteks Python.\n\n1. CRUD sederhana (ambil klaim aktif seorang pasien) **lebih cepat ditulis** dan dipelihara lewat ORM.\n2. Query analitik dengan agregasi dan window function kompleks lebih baik ditulis sebagai raw SQL untuk **kontrol performa penuh**.\n\n```python\n# ORM (SQLAlchemy) - CRUD sederhana, cepat ditulis, type-safe\nklaim_aktif = session.query(Klaim).filter(\n    Klaim.patient_id == patient_id,\n    Klaim.status == 'aktif'\n).all()\n\n# Raw SQL - query analitik kompleks, kontrol penuh atas performa\nquery = \"\"\"\n    SELECT patient_id,\n           SUM(jumlah_klaim) AS total,\n           RANK() OVER (ORDER BY SUM(jumlah_klaim) DESC) AS peringkat\n    FROM klaim\n    WHERE created_at >= %s\n    GROUP BY patient_id\n    HAVING SUM(jumlah_klaim) > %s\n\"\"\"\nwith psycopg2.connect(dsn) as conn:\n    result = conn.execute(query, (tanggal_mulai, ambang_batas))\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Klinika Sehat memakai SQLAlchemy ORM untuk seluruh operasi CRUD sehari-hari di sistem pendaftaran pasien dan pencatatan klaim mereka — menambah pasien baru, mengubah status klaim, mencari data pasien berdasarkan ID — karena tim engineering bisa **bergerak cepat** dan aman dari risiko SQL injection tanpa menulis SQL manual berulang-ulang. Namun untuk laporan analitik bulanan yang menghitung peringkat klaim per cabang dengan window function dan agregasi kompleks lintas **jutaan baris**, tim data justru menulis raw SQL langsung dengan psycopg2, karena mereka perlu **kontrol penuh** atas query plan yang dihasilkan ORM cenderung tidak optimal untuk query seberat itu.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- ORM **mempercepat pengembangan** fitur CRUD standar secara signifikan dengan sintaks yang familiar di bahasa pemrograman\n- ORM secara otomatis melindungi dari SQL injection lewat parameterized query, mengurangi risiko keamanan\n- ORM memudahkan pengelolaan migrasi skema database secara terversion dan terlacak\n- Raw SQL memberi **kontrol penuh** atas query plan, ideal untuk query analitik kompleks yang butuh performa maksimal",
        en: "",
      },
      cons: {
        id: "- ORM **rawan masalah N+1 query** yang sering tidak disadari sampai sistem berjalan di skala produksi dengan data besar\n- Abstraksi ORM membatasi kontrol atas SQL yang benar-benar dihasilkan, menyulitkan optimisasi kasus tertentu\n- Raw SQL lebih *verbose* dan butuh penanganan manual untuk mencegah SQL injection lewat parameterized query yang benar\n- Raw SQL kehilangan type-safety dan kemudahan migrasi skema otomatis yang biasanya disediakan ORM",
        en: "",
      },
    },
  },
};
