export const term = {
  id: "upsert",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#fda4af",
  icon: "M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14",
  simulation: "upsert",
  tools: ["PostgreSQL ON CONFLICT", "MySQL ON DUPLICATE KEY", "BigQuery MERGE", "Snowflake MERGE", "SQLite UPSERT"],
  prerequisites: [],
  related: ["idempotency"],
  name: { id: "Upsert", en: "" },
  content: {
    description: {
      id: "Upsert adalah operasi database yang menggabungkan INSERT dan UPDATE dalam satu statement atomik: jika baris dengan key tertentu belum ada, ia akan di-INSERT sebagai baris baru; jika sudah ada, ia akan di-UPDATE alih-alih menyebabkan error duplikasi. Karena berjalan sebagai satu operasi atomik di level database, upsert tidak punya celah race condition seperti pendekatan manual \"cek dulu baru insert/update\" yang dilakukan lewat dua query terpisah dari sisi aplikasi. Ini menjadikan upsert komponen krusial untuk membangun pipeline data yang idempotent — pipeline yang aman dijalankan ulang berkali-kali dengan input yang sama tanpa menghasilkan duplikasi atau error.",
      en: "",
    },
    concept: {
      id: "Bayangkan upsert seperti resepsionis hotel yang mengelola daftar tamu: kalau ada tamu baru check-in dengan nomor kamar yang belum terdaftar, resepsionis langsung menambahkan entri baru ke buku tamu. Tapi kalau ternyata nomor kamar itu sudah ada di buku (tamu yang sama check-in ulang atau ada perubahan data), resepsionis cukup memperbarui entri yang sudah ada, bukan menambahkan baris duplikat yang membingungkan. Semua ini terjadi dalam satu gerakan tanpa jeda — resepsionis tidak perlu berhenti sejenak untuk mengecek dulu \"apakah kamar ini sudah terdaftar?\" sebagai langkah terpisah yang bisa diselak tamu lain di tengah proses.",
      en: "",
    },
    methodology: {
      id: "Secara mekanisme, upsert mencoba INSERT seperti biasa, tapi database secara internal mendeteksi jika ada pelanggaran unique/primary key constraint pada kolom yang ditentukan. Jika terjadi konflik key, alih-alih menggagalkan seluruh statement dengan error, database mengeksekusi klausa UPDATE khusus yang kamu definisikan (biasanya memakai nilai baru yang coba di-insert tadi, direferensikan lewat keyword seperti `EXCLUDED` di PostgreSQL). Jika tidak ada konflik, INSERT berjalan normal seperti biasa. Seluruh proses ini — cek konflik dan aksi yang mengikutinya — terjadi sebagai satu operasi atomik yang tidak bisa diselak transaction lain di tengah jalan, berbeda dari pendekatan aplikasi yang mengecek keberadaan baris lewat SELECT dulu baru memutuskan INSERT atau UPDATE secara terpisah.",
      en: "",
    },
    objective: {
      id: "Upsert dibutuhkan terutama pada pipeline data yang perlu retry-safe — misalnya proses ETL yang bisa gagal di tengah jalan dan perlu dijalankan ulang dari awal, atau sistem yang menerima event duplikat karena delivery-at-least-once dari message queue. Tanpa upsert, retry pada pipeline semacam ini akan menghasilkan baris duplikat (kalau pakai INSERT biasa) atau error constraint violation yang menghentikan proses (kalau key sudah ada), keduanya sama-sama tidak diinginkan untuk sistem yang perlu tahan terhadap kegagalan dan retry.",
      en: "",
    },
    goal: {
      id: "Tujuannya adalah operasi tulis data yang aman diulang berkali-kali (idempotent) tanpa menghasilkan duplikasi atau error, sehingga pipeline data bisa retry dengan percaya diri saat terjadi kegagalan sementara, tanpa perlu logika kompleks di aplikasi untuk mengecek keberadaan data terlebih dahulu.",
      en: "",
    },
    exampleImplementation: {
      id: "Pipeline yang menerima update status klaim berulang kali (misalnya dari retry setelah kegagalan jaringan) dan perlu aman terhadap duplikasi.\n\n1. Coba INSERT baris klaim baru.\n2. Jika `id` sudah ada (konflik unique key), update kolom status dengan nilai terbaru alih-alih gagal.\n3. Retry pipeline dengan input yang sama tidak akan menghasilkan duplikasi atau error.\n\n```sql\nINSERT INTO klaim (id, status, jumlah_klaim, updated_at)\nVALUES (12345, 'diverifikasi', 5000000, now())\nON CONFLICT (id)\nDO UPDATE SET\n  status = EXCLUDED.status,\n  jumlah_klaim = EXCLUDED.jumlah_klaim,\n  updated_at = EXCLUDED.updated_at;\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Pipeline data streaming milik Digital Motor Group menerima event status klaim dari message queue yang punya jaminan delivery-at-least-once — artinya event yang sama bisa terkirim lebih dari sekali kalau ada masalah jaringan sesaat. Sebelum memakai upsert, pipeline mereka memakai INSERT biasa dan sering gagal dengan error duplicate key setiap kali ada retry dari queue, memaksa tim ops turun tangan manual untuk membersihkan data yang macet. Setelah pipeline diubah memakai `INSERT ... ON CONFLICT(id) DO UPDATE SET status = EXCLUDED.status`, retry dari queue jadi sepenuhnya aman — event yang sama yang terkirim ulang cukup memperbarui baris yang sudah ada tanpa error maupun duplikasi.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Operasi atomik yang bebas race condition, jauh lebih aman dibanding pola manual cek-lalu-insert/update dari aplikasi\n- Membuat pipeline data idempotent, sehingga retry setelah kegagalan tidak menghasilkan duplikasi atau error\n- Mengurangi jumlah round-trip query dibanding pendekatan SELECT-lalu-INSERT/UPDATE dua langkah\n- Didukung luas di berbagai database modern meski dengan sintaks yang sedikit berbeda-beda",
        en: "",
      },
      cons: {
        id: "- Sintaksnya berbeda-beda antar database (`ON CONFLICT` di PostgreSQL, `ON DUPLICATE KEY` di MySQL, `MERGE` di BigQuery/Snowflake), jadi kurang portable\n- Upsert menyembunyikan apakah operasi sebenarnya INSERT atau UPDATE, kadang menyulitkan tracking metrik seperti jumlah baris baru vs diperbarui\n- Butuh unique/primary key yang jelas didefinisikan pada kolom yang jadi acuan konflik, tidak bisa dipakai sembarangan tanpa constraint yang tepat\n- Pada volume sangat tinggi, upsert bisa sedikit lebih mahal secara komputasi dibanding INSERT murni karena database harus mengecek konflik lebih dulu",
        en: "",
      },
    },
  },
};
