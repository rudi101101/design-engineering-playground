export const term = {
  id: "unique-constraint-check-constraint",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#93c5fd",
  icon: "M20 6L9 17l-5-5",
  simulation: "unique",
  tools: ["PostgreSQL", "MySQL", "Oracle", "BigQuery", "SQLite"],
  prerequisites: [],
  related: ["primary-key-composite-key"],
  name: { id: "Unique Constraint & Check Constraint", en: "Unique Constraint & Check Constraint" },
  content: {
    description: {
      id: "Unique Constraint dan Check Constraint adalah dua aturan validasi data di level database yang menjaga kualitas data tanpa bergantung pada logika aplikasi. Unique Constraint memastikan tidak ada nilai duplikat pada suatu kolom atau kombinasi kolom (mirip primary key, tapi sebuah tabel bisa punya banyak unique constraint, sedangkan primary key hanya boleh satu). Check Constraint memvalidasi bahwa nilai yang dimasukkan memenuhi kondisi logis tertentu, seperti rentang angka atau daftar nilai yang diperbolehkan.",
      en: "",
    },
    concept: {
      id: "Bayangkan Unique Constraint seperti aturan bahwa setiap karyawan di kantor wajib punya nomor pegawai yang berbeda-beda — bisa jadi ada beberapa 'ID unik' berbeda yang berlaku sekaligus, misalnya nomor pegawai DAN alamat email kantor, masing-masing harus unik dengan caranya sendiri. Check Constraint seperti satpam pintu masuk yang memeriksa apakah tamu membawa kartu identitas dengan format yang valid — bukan soal keunikan, tapi soal apakah nilainya masuk akal sesuai aturan yang ditetapkan, misalnya umur harus di atas 0 atau status harus salah satu dari daftar yang diizinkan.",
      en: "",
    },
    methodology: {
      id: "Di balik layar, Unique Constraint diimplementasikan database dengan membuat index tersembunyi (biasanya B-tree) pada kolom atau kombinasi kolom terkait, sehingga pengecekan duplikasi bisa berjalan cepat melalui index lookup, bukan full table scan. Check Constraint dievaluasi sebagai ekspresi boolean setiap kali ada operasi INSERT atau UPDATE — jika ekspresi menghasilkan FALSE, operasi ditolak dengan error constraint violation. Kedua jenis constraint ini bisa dikombinasikan bersamaan pada satu kolom atau tabel, dan database akan memvalidasi semuanya secara berurutan sebelum operasi dianggap berhasil.",
      en: "",
    },
    objective: {
      id: "Kedua constraint ini ada untuk memindahkan tanggung jawab validasi data dari kode aplikasi yang tersebar (dan mudah terlewat atau tidak konsisten antar service) ke satu titik pusat yang pasti dijalankan: database itu sendiri. Ini penting terutama saat banyak aplikasi atau tim berbeda menulis ke tabel yang sama — validasi di level database menjamin aturan bisnis dasar tetap ditegakkan apa pun jalur masuknya data.",
      en: "",
    },
    goal: {
      id: "Hasil yang dicapai adalah data yang secara struktural terjamin bebas dari duplikasi pada kolom kritis dan selalu memenuhi aturan validasi dasar, tanpa harus mengandalkan disiplin setiap developer untuk menambahkan validasi yang sama berulang kali di berbagai lapisan aplikasi.",
      en: "",
    },
    exampleImplementation: {
      id: "Contoh kombinasi Unique dan Check Constraint pada tabel pasien dan klaim:\n\n1. Kolom NIK pasien harus unik agar tidak ada dua rekam pasien dengan NIK sama.\n2. Kolom jumlah_klaim harus lebih besar dari nol, tidak boleh negatif atau kosong.\n3. Kolom status hanya boleh berisi salah satu dari nilai yang telah ditentukan.\n\n```sql\nCREATE TABLE klaim (\n  claim_id SERIAL PRIMARY KEY,\n  nik VARCHAR(20) UNIQUE NOT NULL,\n  jumlah_klaim NUMERIC(12,2) CHECK (jumlah_klaim > 0),\n  status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected'))\n);\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Klinika Sehat menerapkan UNIQUE constraint pada kolom NIK pasien agar tidak ada dua rekam medis terdaftar dengan NIK yang sama, mencegah duplikasi identitas pasien yang bisa membahayakan riwayat pengobatan. Mereka juga menambahkan CHECK constraint pada kolom jumlah_klaim agar selalu bernilai lebih dari nol, serta pada kolom status klaim agar hanya bisa diisi 'pending', 'approved', atau 'rejected' — mencegah staf input data yang salah ketik status menjadi nilai lain yang tidak dikenali sistem pelaporan.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Menjamin validasi data konsisten di satu tempat, terlepas dari aplikasi atau service mana pun yang menulis data\n- Unique constraint mencegah duplikasi pada kolom penting selain primary key, bisa lebih dari satu per tabel\n- Check constraint menangkap data tidak valid sejak dini, sebelum sempat mencemari laporan atau analitik\n- Mengurangi kebutuhan validasi berulang di banyak lapisan kode aplikasi",
        en: "",
      },
      cons: {
        id: "- Menambah sedikit overhead pada setiap operasi tulis karena harus dievaluasi setiap saat\n- Perubahan aturan bisnis (misalnya menambah status baru) membutuhkan migrasi skema database, bukan sekadar update kode aplikasi\n- Pesan error dari constraint violation sering kurang ramah pengguna, perlu ditangani ulang di sisi aplikasi\n- Check constraint kompleks bisa menyulitkan debugging saat batch insert besar tiba-tiba gagal sebagian",
        en: "",
      },
    },
  },
};
