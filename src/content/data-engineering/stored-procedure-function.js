export const term = {
  id: "stored-procedure-function",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#67e8f9",
  icon: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  simulation: "storedproc",
  tools: ["PostgreSQL (PL/pgSQL)", "MySQL", "Oracle (PL/SQL)", "SQL Server (T-SQL)", "Snowflake"],
  prerequisites: [],
  related: ["trigger", "orm-vs-raw-sql"],
  name: { id: "Stored Procedure & Function", en: "" },
  content: {
    description: {
      id: "Stored Procedure adalah blok logika SQL yang ditulis dan dikompilasi terlebih dahulu di dalam database, lalu dieksekusi dengan perintah `CALL` kapan pun dibutuhkan, tanpa perlu mengirim ulang seluruh teks SQL-nya dari aplikasi. Function mirip, tapi secara khusus mengembalikan sebuah nilai dan bisa dipakai langsung di dalam statement `SELECT` seperti fungsi bawaan database lainnya. Keduanya memindahkan sebagian logika aplikasi ke dalam layer database itu sendiri, yang punya trade-off signifikan: performa dan konsistensi eksekusi lebih baik, tapi maintainability dan testability jadi lebih sulit dibanding logika yang ditulis di kode aplikasi biasa.",
      en: "",
    },
    concept: {
      id: "Bayangkan stored procedure seperti resep masakan cepat saji yang instruksinya sudah dihafal luar kepala oleh koki di dapur — begitu ada pesanan dengan kode resep tertentu (`CALL proc_masak_nasi_goreng`), koki langsung tahu semua langkahnya tanpa perlu dijelaskan ulang dari nol, jauh lebih cepat dibanding menyerahkan resep tertulis panjang setiap kali (mengirim seluruh SQL dari aplikasi). Bedanya, karena resepnya \"terkunci\" di kepala koki dapur (database) dan bukan di buku resep terpusat yang gampang dibaca semua orang, tim dapur lain (developer aplikasi) jadi sulit tahu persis apa yang sebenarnya terjadi di balik satu pesanan itu tanpa masuk ke dapur langsung.",
      en: "",
    },
    methodology: {
      id: "Saat aplikasi memanggil `CALL proc(params)`, database memuat execution plan yang sudah dikompilasi sebelumnya untuk prosedur tersebut, lalu menjalankan seluruh isi tubuhnya — yang bisa berisi banyak statement SQL berurutan, percabangan logika, loop, dan penanganan error — sebagai satu unit eksekusi di sisi server, baru mengembalikan hasil akhirnya (result set atau nilai) ke pemanggil. Karena plan sudah dikompilasi sebelumnya dan seluruh logika berjalan di server database, jumlah round-trip jaringan antara aplikasi dan database jauh berkurang dibanding mengirim beberapa query terpisah satu per satu dari aplikasi. Konsekuensinya, logika yang tertanam di stored procedure jadi sulit di-version-control dan di-test dengan cara yang sama seperti kode aplikasi biasa, dan menciptakan tight coupling antara logika bisnis dan database tertentu.",
      en: "",
    },
    objective: {
      id: "Stored procedure dan function dipakai ketika ada operasi kompleks yang melibatkan banyak langkah SQL berurutan yang idealnya dijalankan sebagai satu unit atomik di sisi server, mengurangi latency dari banyak round-trip jaringan, atau ketika logika tertentu harus dijalankan konsisten terlepas dari aplikasi klien mana pun yang memanggilnya — mirip trigger, tapi dipanggil eksplisit alih-alih otomatis oleh event.",
      en: "",
    },
    goal: {
      id: "Tujuannya adalah eksekusi operasi database multi-langkah yang efisien (minim round-trip jaringan) dan konsisten (logika terpusat di satu tempat, tidak perlu diduplikasi di tiap klien), dengan trade-off yang disadari penuh terhadap kemudahan testing dan version control dibanding menaruh logika yang sama di layer aplikasi.",
      en: "",
    },
    exampleImplementation: {
      id: "Membuat stored procedure yang menggabungkan beberapa operasi terkait pemrosesan klaim menjadi satu panggilan atomik.\n\n1. Definisikan procedure yang menerima parameter claim_id.\n2. Di dalamnya, jalankan validasi, update status, insert audit, dan notifikasi — empat operasi dalam satu unit.\n3. Aplikasi cukup memanggil satu `CALL`, bukan empat query terpisah.\n\n```sql\nCREATE OR REPLACE PROCEDURE proc_process_klaim(p_claim_id BIGINT)\nLANGUAGE plpgsql AS $$\nBEGIN\n  -- 1. Validasi\n  IF NOT EXISTS (SELECT 1 FROM klaim WHERE id = p_claim_id AND status = 'pending') THEN\n    RAISE EXCEPTION 'Klaim tidak valid atau sudah diproses';\n  END IF;\n\n  -- 2. Update status\n  UPDATE klaim SET status = 'processing', updated_at = now() WHERE id = p_claim_id;\n\n  -- 3. Insert audit\n  INSERT INTO audit_log (claim_id, action, changed_at)\n  VALUES (p_claim_id, 'status_changed_to_processing', now());\n\n  -- 4. Notifikasi (via tabel antrean notifikasi)\n  INSERT INTO notification_queue (claim_id, message) VALUES (p_claim_id, 'Klaim sedang diproses');\nEND;\n$$;\n\nCALL proc_process_klaim(12345);\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "PT Nusantara Asuransi punya alur pemrosesan klaim yang melibatkan empat langkah berurutan: validasi data klaim, update status, pencatatan audit, dan pengiriman notifikasi ke pelanggan. Awalnya tim engineering menulis keempat langkah ini sebagai empat query terpisah dari aplikasi backend, yang berarti empat round-trip jaringan tiap kali satu klaim diproses, dan berisiko satu langkah gagal di tengah tanpa yang lain ikut ter-rollback dengan rapi. Setelah dipindahkan menjadi satu stored procedure `proc_process_klaim`, seluruh alur berjalan sebagai satu panggilan atomik dari sisi database, mengurangi latency secara signifikan dan menjamin keempat langkah selalu konsisten bersama-sama.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Mengurangi jumlah round-trip jaringan signifikan dengan menjalankan banyak langkah SQL sebagai satu panggilan\n- Execution plan yang precompiled memberi keuntungan performa untuk operasi yang sering dipanggil berulang\n- Logika terpusat di database memastikan konsistensi perilaku terlepas dari klien aplikasi mana pun yang memanggilnya\n- Cocok untuk operasi atomik multi-langkah yang idealnya tidak terpecah jadi beberapa query terpisah dari aplikasi",
        en: "",
      },
      cons: {
        id: "- Sulit di-version-control dan diuji secara terisolasi dibanding kode aplikasi biasa yang punya tooling testing matang\n- Menciptakan tight coupling antara logika bisnis dan vendor database tertentu, menyulitkan migrasi ke database lain\n- Debugging dan profiling logika yang kompleks di dalam stored procedure lebih sulit dibanding debugging kode aplikasi\n- Tim developer aplikasi sering kesulitan melihat/memahami logika yang tersembunyi di database, menurunkan visibilitas sistem secara keseluruhan",
        en: "",
      },
    },
  },
};
