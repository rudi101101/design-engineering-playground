export const term = {
  id: "transaction-savepoint",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#fdba74",
  icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  simulation: "savepoint",
  tools: ["PostgreSQL", "MySQL", "Oracle", "SQL Server", "SQLite"],
  prerequisites: ["acid"],
  related: [],
  name: { id: "Transaction & Savepoint", en: "" },
  content: {
    description: {
      id: "Transaction adalah unit kerja atomik di database — kumpulan satu atau lebih operasi (INSERT, UPDATE, DELETE) yang diperlakukan sebagai satu kesatuan yang tidak bisa dipecah: semua berhasil bersama, atau semua dibatalkan bersama. Savepoint adalah penanda checkpoint di dalam sebuah transaction yang memungkinkan kamu melakukan rollback parsial ke titik tertentu tanpa harus membatalkan seluruh transaction dari awal. Kombinasi keduanya penting untuk operasi batch besar atau alur kerja bertahap, di mana kegagalan pada satu bagian kecil tidak seharusnya memaksa pembatalan seluruh pekerjaan yang sudah berhasil.",
      en: "",
    },
    concept: {
      id: "Bayangkan transaction seperti menulis draft surat resmi dengan pensil — kamu bisa mencoret-coret bebas, tapi surat itu baru resmi berlaku (COMMIT) setelah kamu tanda tangan di akhir; kalau di tengah jalan berubah pikiran, kamu bisa merobek seluruh draft (ROLLBACK). Savepoint seperti menaruh penanda kertas di halaman tertentu draft itu — kalau kamu salah tulis di halaman 5, kamu bisa robek balik ke penanda itu tanpa harus merobek halaman 1-4 yang sudah benar, lalu lanjut menulis dari sana lagi.",
      en: "",
    },
    methodology: {
      id: "Alurnya dimulai dengan `BEGIN` untuk membuka transaction, lalu operasi-operasi dijalankan secara berurutan. Di titik yang dianggap aman, kamu menandai `SAVEPOINT sp1` — ini menyimpan state transaction pada titik tersebut tanpa mengakhirinya. Jika operasi setelah savepoint gagal atau perlu dibatalkan, `ROLLBACK TO sp1` akan membatalkan hanya operasi-operasi setelah sp1, sementara semua operasi sebelum sp1 tetap dipertahankan dalam transaction yang masih terbuka. Transaction bisa punya beberapa savepoint bertingkat, dan setelah semua operasi selesai dengan hasil yang diinginkan, `COMMIT` menuliskan seluruh perubahan secara permanen ke database.",
      en: "",
    },
    objective: {
      id: "Konsep ini dibutuhkan karena operasi database dunia nyata sering terdiri dari banyak langkah yang saling bergantung, dan tanpa transaction, kegagalan di tengah proses bisa meninggalkan data dalam keadaan setengah jadi yang tidak konsisten. Savepoint secara khusus menjawab masalah operasi batch besar: tanpa savepoint, satu kegagalan kecil di tengah 1000 baris insert akan memaksa rollback total dan mengulang semuanya dari nol, yang mahal dan tidak efisien.",
      en: "",
    },
    goal: {
      id: "Hasil yang dicapai adalah operasi database yang konsisten secara atomik — baik seluruhnya berhasil atau seluruhnya batal — sekaligus proses batch yang bisa pulih dari kegagalan parsial dengan biaya retry yang minimal, karena hanya bagian yang gagal yang perlu diulang, bukan keseluruhan pekerjaan.",
      en: "",
    },
    exampleImplementation: {
      id: "Kasus: memasukkan 1000 baris data klaim dalam batch, dengan checkpoint tiap 100 baris agar kegagalan di tengah tidak membatalkan semuanya.\n\n1. Mulai transaction dan proses batch pertama.\n2. Setelah tiap 100 baris berhasil, buat savepoint baru.\n3. Jika satu batch gagal (misalnya karena constraint violation), rollback hanya ke savepoint batch sebelumnya, lalu retry batch yang gagal itu saja.\n\n```sql\nBEGIN;\n\n-- batch 1 (baris 1-100)\nINSERT INTO klaim (...) VALUES (...), (...), ...;\nSAVEPOINT batch_1;\n\n-- batch 2 (baris 101-200)\nINSERT INTO klaim (...) VALUES (...), (...), ...;\nSAVEPOINT batch_2;\n\n-- ... hingga batch 7 gagal karena data tidak valid\nROLLBACK TO SAVEPOINT batch_6;\n-- retry batch 7 dengan data yang sudah diperbaiki\nINSERT INTO klaim (...) VALUES (...);\nSAVEPOINT batch_7;\n\nCOMMIT;\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "PT Nusantara Asuransi menjalankan proses migrasi 1000 data klaim lama ke sistem baru dalam satu batch job malam hari, dengan savepoint dibuat tiap 100 baris. Pada eksekusi tertentu, batch ke-7 (baris 601-700) gagal karena satu baris punya format tanggal yang rusak dari sistem lama. Alih-alih seluruh job harus diulang dari baris 1 — yang berarti membuang waktu proses 600 baris yang sudah berhasil — tim ops cukup rollback ke savepoint batch ke-6, memperbaiki baris bermasalah, lalu melanjutkan proses hanya dari batch ke-7. Job selesai dalam hitungan menit, bukan harus diulang dari nol.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Transaction menjamin konsistensi data — tidak ada state setengah jadi yang terlihat oleh proses lain\n- Savepoint memungkinkan recovery granular pada batch besar tanpa membatalkan seluruh pekerjaan yang sudah sukses\n- Bisa punya banyak savepoint bertingkat dalam satu transaction untuk kontrol rollback yang lebih presisi\n- Mengurangi biaya retry secara signifikan dibanding rollback total pada proses batch panjang",
        en: "",
      },
      cons: {
        id: "- Transaction yang berjalan lama (long-running) bisa menahan lock dan menghambat proses lain yang butuh akses ke baris/tabel yang sama\n- Savepoint menambah overhead memori dan state yang harus dijaga database selama transaction berlangsung\n- Terlalu banyak savepoint dalam satu transaction bisa membuat logika aplikasi jadi kompleks dan sulit di-debug\n- Tidak semua database mendukung savepoint dengan cara yang sama, jadi ada risiko portabilitas antar sistem",
        en: "",
      },
    },
  },
};
