export const term = {
  id: "sequence-auto-increment",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#818cf8",
  icon: "M3 6h18M3 12h18M3 18h18",
  simulation: "sequence",
  tools: ["PostgreSQL SERIAL/BIGSERIAL", "MySQL AUTO_INCREMENT", "Oracle SEQUENCE", "SQL Server IDENTITY", "UUID alt"],
  prerequisites: ["primary-key-composite-key"],
  related: ["uuid-vs-bigserial"],
  name: { id: "Sequence & Auto-increment", en: "" },
  content: {
    description: {
      id: "Sequence adalah objek database khusus yang bertugas menghasilkan deretan **nilai integer unik secara berurutan**, biasanya dipakai untuk mengisi kolom primary key secara otomatis tanpa aplikasi perlu memikirkan sendiri nilai berikutnya. Auto-increment adalah istilah umum untuk fitur ini di berbagai database — meski implementasinya berbeda-beda, intinya sama: setiap kali baris baru dimasukkan, database otomatis memberikan angka unik berikutnya. Yang penting dipahami, sequence **tidak menjamin urutan tanpa celah (gap)** — nilai bisa melompat karena transaction yang di-rollback atau server yang crash — tapi ia **selalu menjamin keunikan**, bahkan di bawah beban insert yang sangat tinggi dan konkuren.",
      en: "",
    },
    concept: {
      id: "Bayangkan sequence *seperti mesin nomor antrean di bank* — setiap orang yang datang menekan tombol dan mendapat nomor berikutnya secara otomatis, tanpa perlu berkoordinasi dengan orang lain di antrean untuk memastikan nomor mereka tidak bentrok. Kalau ada orang yang menekan tombol tapi ternyata batal mengantre (transaction di-rollback), nomor itu **tetap \"terbakar\" dan tidak dipakai ulang** — jadi nomor antrean 47 mungkin saja tidak pernah dipanggil, tapi itu tidak masalah, karena yang penting setiap orang yang benar-benar mengantre **punya nomor yang unik**, bukan urutannya rapi tanpa celah.",
      en: "",
    },
    methodology: {
      id: "Secara teknis, sequence bekerja dengan mekanisme pre-allocation dari sebuah shared counter di level database — beberapa database bahkan mengambil sekaligus sekumpulan nilai (cache) untuk mengurangi kontensi saat banyak insert terjadi bersamaan. Setiap kali sebuah baris di-INSERT tanpa nilai eksplisit untuk kolom ber-sequence, database memanggil fungsi `NEXTVAL` (atau mekanisme setara) pada sequence terkait, yang mengembalikan integer unik berikutnya dan langsung memajukan counter internal sequence tersebut **secara atomik**, sehingga **aman dipanggil dari banyak transaction konkuren** tanpa risiko dua transaction mendapat nilai yang sama. Implementasinya bervariasi antar database: PostgreSQL punya tipe kolom `SERIAL`/`BIGSERIAL` yang otomatis membuat sequence di baliknya, MySQL punya `AUTO_INCREMENT` sebagai atribut kolom, Oracle punya objek `SEQUENCE` eksplisit, dan SQL Server punya properti `IDENTITY`.",
      en: "",
    },
    objective: {
      id: "Sequence dibutuhkan karena setiap tabel yang punya primary key numerik butuh cara yang aman dan efisien untuk menghasilkan nilai unik tanpa aplikasi harus melakukan query tambahan untuk mengecek \"nilai terakhir + 1\" sendiri — pendekatan manual semacam itu **rawan race condition** kalau dua proses insert bersamaan. Sequence memindahkan tanggung jawab generate ID unik ke level database yang memang dirancang untuk menanganinya **secara atomik dan aman di bawah konkurensi tinggi**.",
      en: "",
    },
    goal: {
      id: "Hasil yang dicapai adalah primary key yang **selalu unik dan cepat dihasilkan** tanpa koordinasi eksplisit dari aplikasi, dengan overhead minimal bahkan saat insert terjadi dari banyak koneksi sekaligus, meski konsekuensinya urutan nilai bisa punya **celah (gap)** yang memang bisa diterima untuk kebanyakan kasus penggunaan.",
      en: "",
    },
    exampleImplementation: {
      id: "Membuat tabel dengan primary key yang otomatis di-generate menggunakan BIGSERIAL di PostgreSQL.\n\n1. Definisikan kolom id dengan tipe `BIGSERIAL`, yang otomatis membuat sequence tersembunyi di baliknya.\n2. Saat INSERT tanpa menyebutkan nilai id, database otomatis mengisi dengan nilai berikutnya dari sequence.\n3. Nilai boleh ada gap (misalnya karena rollback), tapi **keunikan tetap terjamin**.\n\n```sql\nCREATE TABLE pasien (\n  patient_id BIGSERIAL PRIMARY KEY,\n  nama TEXT NOT NULL,\n  created_at TIMESTAMPTZ DEFAULT now()\n);\n\n-- Insert tanpa menyebut patient_id, otomatis terisi 1, 2, 3, ...\nINSERT INTO pasien (nama) VALUES ('Budi Santoso');\nINSERT INTO pasien (nama) VALUES ('Siti Aminah');\n\n-- Cek nilai sequence saat ini\nSELECT currval('pasien_patient_id_seq');\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Klinika Sehat menggunakan `patient_id BIGSERIAL` sebagai primary key di tabel pasien pada sistem monolitik PostgreSQL mereka. Setiap kali pasien baru mendaftar, sistem otomatis menghasilkan ID berurutan 1, 2, 3, dan seterusnya tanpa aplikasi perlu memikirkan logika penomoran sendiri. Tim engineering sempat khawatir soal gap nomor yang muncul akibat beberapa transaction pendaftaran yang gagal validasi dan di-rollback, tapi setelah dikonfirmasi bahwa **gap semacam itu memang normal dan tidak memengaruhi keunikan atau integritas data**, mereka tetap memakai BIGSERIAL karena kesederhanaan dan **performa index B-tree-nya yang jauh lebih baik** dibanding alternatif seperti UUID acak.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Menjamin **keunikan nilai secara atomik** meski di bawah beban insert konkuren tinggi, tanpa perlu logika tambahan di aplikasi\n- Nilai integer sekuensial menghasilkan **index B-tree yang sangat efisien** karena penulisan cenderung selalu di ujung index\n- Ukurannya kompak (**4 atau 8 byte**) dibanding alternatif seperti UUID, menghemat ruang storage dan index\n- Sudah didukung native oleh hampir semua database relasional dengan sintaks yang mudah dipahami",
        en: "",
      },
      cons: {
        id: "- Gap pada urutan nilai (akibat rollback atau crash) bisa membingungkan kalau aplikasi keliru mengasumsikan urutan harus rapat tanpa celah\n- Nilai sequential yang bisa ditebak **berpotensi jadi masalah keamanan** kalau dipakai sebagai ID publik yang bisa dienumerasi orang luar\n- Butuh **koordinasi terpusat** (satu instance database) sehingga kurang cocok untuk sistem terdistribusi yang butuh generate ID di banyak node independen\n- Migrasi atau merge data antar sistem yang sama-sama pakai sequence bisa menimbulkan **konflik ID** yang harus ditangani manual",
        en: "",
      },
    },
  },
};
