export const term = {
  id: "two-phase-commit",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#86efac",
  icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4",
  simulation: "twopc",
  tools: ["PostgreSQL XA", "MySQL XA", "JTA", "Google Spanner", "Saga Pattern (alt)"],
  prerequisites: [],
  related: ["cap-theorem"],
  name: { id: "Two-Phase Commit (2PC)", en: "Two-Phase Commit (2PC)" },
  content: {
    description: {
      id: "Two-Phase Commit (2PC) adalah protokol yang menjamin sebuah transaksi yang melibatkan banyak sistem database berbeda (distributed transaction) **tercommit secara atomik** — artinya semua participant berhasil commit bersama-sama, atau semua di-rollback bersama-sama, **tidak ada kondisi di tengah-tengah**. Sebuah node **coordinator** bertugas mengkoordinasikan seluruh participant melalui dua fase eksplisit sebelum transaksi dianggap final.",
      en: "",
    },
    concept: {
      id: "Bayangkan 2PC seperti *prosesi pernikahan* di mana penghulu (coordinator) bertanya ke kedua mempelai (participant) satu per satu: 'apakah Anda bersedia?' (fase Prepare). Hanya jika **KEDUA mempelai** menjawab 'bersedia', penghulu baru mengucapkan pernikahan sah (fase Commit). Jika salah satu menjawab tidak, pernikahan **dibatalkan sepenuhnya** (Abort) — tidak mungkin hanya satu pihak yang 'setengah menikah'.",
      en: "",
    },
    methodology: {
      id: "2PC berjalan dalam **dua fase** yang jelas. Fase 1 (Prepare): coordinator mengirim pesan 'siapkah commit?' ke semua participant. Setiap participant menyiapkan transaksinya (menulis ke WAL lokal tapi belum commit final) lalu membalas vote YES (siap) atau NO (tidak bisa). Fase 2 (Commit/Abort): jika **SEMUA participant** menjawab YES, coordinator mengirim perintah COMMIT ke semua node agar transaksi difinalisasi; jika **ADA SATU SAJA** yang menjawab NO atau timeout, coordinator mengirim perintah ABORT ke semua node agar transaksi dibatalkan sepenuhnya. Mekanisme ini menjamin atomicity lintas sistem, meski dengan konsekuensi semua participant **harus menahan lock** sampai keputusan final diterima.",
      en: "",
    },
    objective: {
      id: "2PC diciptakan untuk mengatasi masalah menjaga konsistensi transaksi yang melibatkan **lebih dari satu sistem database independen** — sesuatu yang tidak bisa dijamin oleh mekanisme transaksi lokal biasa. Tanpa 2PC, **kegagalan parsial** (satu sistem berhasil commit, sistem lain gagal) bisa menciptakan inkonsistensi data yang sulit dipulihkan, misalnya saldo terpotong di satu sistem tapi tidak bertambah di sistem lain.",
      en: "",
    },
    goal: {
      id: "Hasil yang dicapai adalah jaminan **atomicity penuh** untuk transaksi lintas sistem — baik semua participant commit bersama, atau semuanya rollback bersama — sehingga **tidak pernah ada** state 'setengah jadi' yang membuat data antar sistem menjadi tidak konsisten.",
      en: "",
    },
    exampleImplementation: {
      id: "Alur eksekusi 2PC untuk transfer dana lintas dua sistem database berbeda:\n\n1. Coordinator mengirim PREPARE ke Database A (debit) dan Database B (kredit).\n2. Database A menyiapkan debit saldo, membalas vote YES. Database B menyiapkan kredit saldo, membalas vote YES.\n3. Karena **semua vote YES**, coordinator mengirim COMMIT ke A dan B.\n4. Kedua database memfinalisasi transaksi masing-masing **secara permanen**.\n\n```sql\n-- Contoh sintaks XA transaction (representasi konseptual)\nXA START 'txn-001';\nUPDATE accounts SET balance = balance - 500000 WHERE id = 'A001'; -- di Database A\nXA END 'txn-001';\nXA PREPARE 'txn-001';\n-- jika semua participant PREPARE sukses:\nXA COMMIT 'txn-001';\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Fintech Cepat memiliki dua sistem database terpisah untuk mengelola transfer antar mitra bisnis: satu untuk mencatat pendebitan saldo pengirim, satu lagi untuk mencatat pengkreditan saldo penerima di sistem mitra. Dengan 2PC, kedua operasi ini dijamin **commit atomik bersama-sama** — jika sistem penerima sedang bermasalah dan tidak bisa menyiapkan transaksinya, seluruh proses termasuk pendebitan di sistem pengirim akan **dibatalkan otomatis**, mencegah saldo pengirim terpotong tanpa saldo penerima bertambah.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Menjamin **atomicity penuh** untuk transaksi yang melibatkan banyak sistem database berbeda\n- Menghindari kondisi inkonsistensi 'setengah commit' yang sulit dipulihkan secara manual\n- Model yang jelas dan **terstandarisasi (XA)**, didukung banyak database enterprise\n- Cocok untuk skenario yang benar-benar membutuhkan **strong consistency** lintas sistem",
        en: "",
      },
      cons: {
        id: "- Coordinator menjadi **single point of failure** — jika coordinator crash saat fase commit, participant bisa terjebak menahan lock tanpa batas waktu (blocking problem)\n- Latency tinggi karena harus menunggu respons dari semua participant di dua fase\n- Semua participant harus menahan lock sepanjang proses, **menurunkan throughput** sistem secara signifikan\n- Di sistem terdistribusi skala besar modern, pola alternatif seperti Saga Pattern sering lebih disukai karena tidak memblokir sepanjang itu",
        en: "",
      },
    },
  },
};
