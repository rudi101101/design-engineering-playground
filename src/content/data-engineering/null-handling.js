export const term = {
  id: "null-handling",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#d8b4fe",
  icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4M12 16h.01",
  simulation: "null",
  tools: ["PostgreSQL", "MySQL", "BigQuery", "Snowflake", "DuckDB"],
  prerequisites: [],
  related: ["upsert"],
  name: { id: "NULL Handling", en: "" },
  content: {
    description: {
      id: "NULL adalah representasi dari nilai yang **tidak diketahui atau tidak ada**, bukan angka nol, bukan string kosong, dan bukan false. Perbedaan ini kelihatan sepele tapi jadi sumber bug yang sangat sering muncul di query SQL — mulai dari perhitungan agregat yang hasilnya meleset, kondisi WHERE yang diam-diam **tidak pernah match**, sampai laporan bisnis yang jumlahnya salah tanpa error apa pun yang terlihat. Karena NULL merepresentasikan ketidaktahuan, hampir semua operasi yang melibatkan NULL — perbandingan, aritmatika, bahkan penggabungan string — **akan menghasilkan NULL lagi**, bukan true/false atau angka.",
      en: "",
    },
    concept: {
      id: "Bayangkan NULL *seperti kolom \"alamat\" di formulir* yang sengaja dikosongkan orang karena dia belum tahu mau pindah ke mana — itu beda jauh dengan menulis \"tidak ada alamat\" (string kosong) atau menulis \"0\" di kolom nomor rumah. Kosong artinya *tidak tahu*, bukan *tahu bahwa isinya nol*. Karena itu, kalau kamu bertanya \"apakah alamat si A sama dengan alamat si B\" dan keduanya sama-sama kosong (belum diisi), jawaban logisnya **bukan \"ya\"** — jawabannya \"tidak tahu\", karena kamu tidak benar-benar tahu apakah keduanya memang akan sama. Inilah kenapa `NULL = NULL` di SQL **tidak menghasilkan `TRUE`**, melainkan `NULL` lagi (unknown).",
      en: "",
    },
    methodology: {
      id: "Secara mekanisme, NULL punya dua sifat penting yang sering dilupakan. Pertama, **propagasi**: operasi aritmatika atau logika apa pun yang melibatkan NULL akan menghasilkan NULL — misalnya `1 + NULL` menghasilkan `NULL`, bukan `1`. Kedua, **perbandingan**: `NULL != NULL` dan `NULL = NULL` sama-sama tidak menghasilkan TRUE, karena secara three-valued logic SQL, hasilnya adalah UNKNOWN — itulah sebabnya SQL menyediakan operator khusus `IS NULL` dan `IS NOT NULL` untuk mengecek NULL, bukan `=` atau `!=`. Di sisi agregasi, fungsi seperti `SUM`, `AVG`, `MAX`, `MIN` secara otomatis mengabaikan baris ber-NULL, sedangkan `COUNT(*)` menghitung semua baris termasuk yang NULL, tapi `COUNT(nama_kolom)` hanya menghitung baris yang kolom tersebut tidak NULL. Untuk menangani NULL saat query, `COALESCE(value, default)` mengembalikan nilai pertama yang tidak NULL dari daftar argumennya, sering dipakai untuk memberi nilai pengganti saat tampil ke user.",
      en: "",
    },
    objective: {
      id: "NULL Handling penting dipahami karena kesalahan menafsirkan NULL adalah salah satu **bug data paling umum dan paling sulit dideteksi** — query bisa berjalan tanpa error sama sekali tapi menghasilkan angka yang salah secara diam-diam. Tanpa pemahaman yang benar tentang bagaimana NULL berperilaku dalam agregasi, perbandingan, dan join, seorang data engineer bisa membuat laporan yang **under-count**, filter yang tidak sengaja membuang data, atau join yang kehilangan baris tanpa disadari.",
      en: "",
    },
    goal: {
      id: "Tujuannya adalah query dan pipeline yang **secara eksplisit dan sadar menangani nilai hilang** — baik dengan mengecualikannya secara sengaja, menggantinya dengan default yang masuk akal via **COALESCE**, atau memastikan agregasi menghitung populasi yang benar (bukan under-count karena baris NULL diam-diam terlewat).",
      en: "",
    },
    exampleImplementation: {
      id: "Skenario umum: kamu punya tabel `klaim` dengan kolom `diagnosis` yang boleh kosong (belum diisi dokter) dan `jumlah_klaim` yang **seharusnya selalu terisi**.\n\n1. Menghitung total klaim yang sudah punya diagnosis (bukan total semua baris):\n2. Menghitung total nilai klaim, **otomatis abaikan** baris yang jumlahnya NULL:\n3. Menyediakan nilai tampilan default untuk kolom yang mungkin NULL:\n\n```sql\n-- COUNT(*) vs COUNT(kolom)\nSELECT COUNT(*) AS total_baris,\n       COUNT(diagnosis) AS baris_dengan_diagnosis\nFROM klaim;\n\n-- SUM otomatis skip NULL\nSELECT SUM(jumlah_klaim) AS total_nilai_klaim\nFROM klaim;\n\n-- COALESCE untuk default tampilan\nSELECT nama_pasien, COALESCE(nomor_telepon, 'N/A') AS telepon\nFROM pasien;\n\n-- Filter eksplisit baris yang NULL\nSELECT * FROM klaim WHERE diagnosis IS NULL;\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Klinika Sehat, penyedia layanan kesehatan digital, punya dashboard yang menghitung rata-rata nilai klaim per bulan. Tim data awalnya heran kenapa angka rata-ratanya lebih tinggi dari ekspektasi finance. Setelah ditelusuri, ternyata query memakai `AVG(jumlah_klaim)` yang otomatis mengabaikan baris dengan `jumlah_klaim IS NULL` (klaim yang belum diproses lengkap) — sehingga pembagi (jumlah baris) yang dipakai AVG lebih kecil dari jumlah baris sebenarnya, dan **rata-rata jadi bias ke atas**. Solusinya, tim mengubah query untuk **secara eksplisit memisahkan** klaim \"selesai diproses\" vs \"masih pending\" menggunakan `WHERE status = 'selesai'`, alih-alih mengandalkan perilaku implisit NULL-skipping dari AVG.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- **Semantik NULL yang jelas** (unknown, bukan zero/empty) mencegah pencampuran makna data yang berbeda dalam satu representasi\n- Fungsi agregat yang **otomatis skip NULL** memudahkan perhitungan statistik dari data yang tidak lengkap tanpa perlu filter manual\n- `COALESCE` memberi cara ringkas untuk menyediakan default value tanpa CASE WHEN yang panjang\n- Constraint `NOT NULL` di level skema jadi **alat validasi data yang murah dan efektif** sejak titik masuk data",
        en: "",
      },
      cons: {
        id: "- Perilaku three-valued logic (`TRUE`/`FALSE`/`UNKNOWN`) **mudah disalahpahami**, terutama saat NULL masuk ke kondisi `WHERE` atau `NOT IN`\n- `NOT IN` dengan subquery yang mengandung NULL bisa membuat **seluruh hasil query kosong tanpa error apa pun**, ini jebakan klasik\n- Agregat yang diam-diam skip NULL bisa membuat metrik seperti AVG **bias tanpa terlihat**, kalau engineer tidak sadar\n- Menangani NULL secara konsisten di banyak layer (aplikasi, ETL, laporan) butuh disiplin karena tiap layer bisa punya interpretasi berbeda soal \"kosong\"",
        en: "",
      },
    },
  },
};
