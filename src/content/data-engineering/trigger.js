export const term = {
  id: "trigger",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#86efac",
  icon: "M22 12h-4l-3 9L9 3l-3 9H2",
  simulation: "trigger",
  tools: ["PostgreSQL", "MySQL", "Oracle", "SQL Server", "SQLite"],
  prerequisites: [],
  related: ["stored-procedure-function", "audit-logging"],
  name: { id: "Trigger", en: "" },
  content: {
    description: {
      id: "Trigger adalah prosedur yang dijalankan secara otomatis oleh database ketika sebuah event tertentu terjadi pada tabel — biasanya INSERT, UPDATE, atau DELETE. Trigger bisa diatur untuk berjalan BEFORE (sebelum) atau AFTER (setelah) event terjadi, dan bisa dieksekusi per-row (sekali untuk tiap baris yang terdampak) atau per-statement (sekali untuk keseluruhan statement, tidak peduli berapa baris yang terdampak). Trigger memungkinkan logika bisnis tertentu — seperti audit logging, validasi, atau penurunan nilai kolom otomatis — dijalankan konsisten di level database, terlepas dari aplikasi mana pun yang melakukan perubahan data.",
      en: "",
    },
    concept: {
      id: "Bayangkan trigger seperti sensor otomatis di pintu toko — setiap kali ada orang yang masuk atau keluar (event INSERT/UPDATE/DELETE), sensor itu otomatis mencatat waktu dan mengirim notifikasi ke sistem keamanan tanpa kasir perlu melakukan apa pun secara manual. Sensor itu bisa dipasang untuk aktif tepat sebelum pintu terbuka (BEFORE, untuk mencegah masuk kalau ada alasan tertentu) atau tepat setelah pintu terbuka (AFTER, untuk mencatat kejadian yang sudah pasti terjadi) — dan ini berlaku otomatis untuk siapa pun yang lewat pintu itu, tidak peduli lewat pintu depan atau pintu belakang (aplikasi mana pun yang mengubah data).",
      en: "",
    },
    methodology: {
      id: "Trigger didaftarkan pada kombinasi spesifik: tabel target, jenis event (INSERT/UPDATE/DELETE), dan timing (BEFORE/AFTER). Ketika event yang sesuai terjadi pada tabel tersebut, database secara otomatis memanggil fungsi trigger yang sudah didefinisikan sebelum operasi tersebut dianggap selesai. Di dalam fungsi trigger, kamu punya akses ke representasi baris lama (`OLD`) dan/atau baris baru (`NEW`) tergantung jenis event-nya, dan bisa memodifikasi nilai `NEW` sebelum benar-benar disimpan (khusus BEFORE trigger), atau melakukan aksi tambahan seperti menulis ke tabel lain (umum untuk AFTER trigger, seperti audit log). Setelah trigger selesai dieksekusi, operasi asli (INSERT/UPDATE/DELETE) dilanjutkan seperti biasa.",
      en: "",
    },
    objective: {
      id: "Trigger dibutuhkan ketika ada aturan bisnis atau proses turunan yang harus berlaku konsisten setiap kali data berubah, tanpa bergantung pada aplikasi tertentu untuk mengingat menjalankannya. Ini penting terutama untuk kebutuhan seperti audit trail — di mana setiap perubahan data harus tercatat siapa yang mengubah, kapan, dan apa yang berubah — yang tidak boleh terlewat meski perubahan datang dari jalur aplikasi yang berbeda-beda atau bahkan dari query manual langsung ke database.",
      en: "",
    },
    goal: {
      id: "Tujuannya adalah konsistensi logika bisnis di level database yang tidak bisa dilewati (bypass) oleh aplikasi mana pun, memastikan aturan seperti audit logging, validasi data, atau penurunan nilai kolom otomatis selalu diterapkan setiap kali data berubah, tanpa perlu duplikasi logika yang sama di setiap titik aplikasi yang mungkin mengubah data.",
      en: "",
    },
    exampleImplementation: {
      id: "Membuat trigger untuk mencatat audit log otomatis setiap kali status klaim berubah.\n\n1. Buat fungsi trigger yang akan dijalankan.\n2. Daftarkan trigger tersebut pada event AFTER UPDATE di tabel klaim.\n3. Setiap kali status berubah, baris baru otomatis masuk ke tabel audit_log.\n\n```sql\nCREATE OR REPLACE FUNCTION log_perubahan_status()\nRETURNS TRIGGER AS $$\nBEGIN\n  IF OLD.status IS DISTINCT FROM NEW.status THEN\n    INSERT INTO audit_log (claim_id, old_status, new_status, changed_by, changed_at)\n    VALUES (NEW.id, OLD.status, NEW.status, current_user, now());\n  END IF;\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;\n\nCREATE TRIGGER trg_audit_status_klaim\nAFTER UPDATE ON klaim\nFOR EACH ROW\nEXECUTE FUNCTION log_perubahan_status();\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Fintech Cepat wajib menjaga jejak audit lengkap untuk setiap perubahan status klaim asuransi mereka demi kebutuhan kepatuhan regulasi. Alih-alih mengandalkan setiap tim aplikasi (web app, mobile app, admin panel internal) untuk secara konsisten menulis log perubahan di kode masing-masing — yang rawan lupa atau berbeda implementasi — tim data memasang trigger AFTER UPDATE langsung di level database. Hasilnya, setiap kali status klaim berubah lewat jalur mana pun, termasuk query manual dari tim support saat troubleshooting, baris audit log otomatis tercatat lengkap dengan siapa yang mengubah, kapan, dan nilai lama-baru, tanpa ada satu perubahan pun yang lolos dari pencatatan.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Logika bisnis diterapkan konsisten di level database, tidak bisa dilewati oleh aplikasi mana pun yang mengakses data\n- Sangat cocok untuk audit logging yang harus lengkap tanpa bergantung pada disiplin tiap tim aplikasi\n- Bisa mencegah perubahan data yang tidak valid dengan menolak operasi lewat BEFORE trigger\n- Mengurangi duplikasi logika yang seharusnya sama di banyak titik aplikasi berbeda",
        en: "",
      },
      cons: {
        id: "- Logika yang tersembunyi di trigger sulit terlihat oleh developer yang hanya membaca kode aplikasi, membuat perilaku sistem jadi kurang transparan\n- Trigger menambah overhead pada setiap operasi INSERT/UPDATE/DELETE, bisa memperlambat write-heavy workload kalau logikanya berat\n- Debugging jadi lebih rumit karena efek trigger tidak langsung terlihat dari query yang memicunya\n- Trigger yang saling memicu trigger lain (cascading triggers) bisa menciptakan alur eksekusi yang sulit ditelusuri dan berisiko infinite loop",
        en: "",
      },
    },
  },
};
