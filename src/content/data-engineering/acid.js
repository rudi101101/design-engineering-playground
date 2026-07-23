export const term = {
  id: "acid",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#22d3ee",
  icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  simulation: "acid",
  tools: ["PostgreSQL", "MySQL InnoDB", "Oracle", "BigQuery DML", "Apache Iceberg"],
  prerequisites: ["write-ahead-log"],
  related: ["base", "isolation-levels"],
  name: { id: "ACID", en: "ACID" },
  content: {
    description: {
      id: "ACID adalah singkatan dari empat properti fundamental yang menjamin keandalan transaksi database: **Atomicity** (semua-atau-tidak-sama-sekali), **Consistency** (database selalu berpindah antar state yang valid), **Isolation** (transaksi konkuren tidak saling mengganggu), dan **Durability** (data yang sudah commit **tidak akan pernah** hilang meski terjadi crash). Keempat properti ini menjadi fondasi mengapa database relasional bisa dipercaya untuk aplikasi kritis seperti perbankan — tanpa ACID, hal sederhana seperti transfer saldo antar rekening bisa berujung pada uang yang hilang atau dobel karena kegagalan di tengah proses.",
      en: "ACID stands for four fundamental properties that guarantee database transaction reliability: **Atomicity** (all-or-nothing), **Consistency** (the database always moves between valid states), **Isolation** (concurrent transactions don't interfere with each other), and **Durability** (committed data will **never** be lost even if a crash occurs). These four properties are the foundation for why relational databases can be trusted for critical applications like banking — without ACID, something as simple as transferring a balance between accounts could result in money being lost or duplicated due to a failure mid-process.",
    },
    concept: {
      id: "*Bayangkan* ACID seperti aturan main mengirim uang lewat ATM. **Atomicity** seperti mesin ATM yang **tidak akan pernah** 'setengah mengeluarkan' uang — kamu dapat semuanya atau tidak sama sekali, tidak ada kondisi tanggung. **Consistency** seperti saldo yang selalu masuk akal — tidak akan pernah negatif tanpa alasan sah. **Isolation** seperti antrian ATM — meski banyak orang mengantri bersamaan, setiap transaksi diproses seolah kamu sendirian di depan mesin. **Durability** seperti struk yang tercetak — begitu keluar, transaksinya benar-benar sudah tercatat permanen, bahkan jika ATM tiba-tiba mati listrik setelahnya.",
      en: "*Think of* ACID like the rules of sending money via an ATM. **Atomicity** is like an ATM that **never** 'half dispenses' cash — you get all of it or none of it, no in-between state. **Consistency** is like a balance that always makes sense — it will never go inexplicably negative. **Isolation** is like an ATM queue — even with many people queuing simultaneously, every transaction is processed as if you were alone at the machine. **Durability** is like the printed receipt — once it's out, the transaction is truly permanently recorded, even if the ATM suddenly loses power right after.",
    },
    methodology: {
      id: "Atomicity dijamin lewat **rollback log** — jika transaksi gagal di tengah jalan, database mengembalikan semua perubahan yang sudah dilakukan seolah tidak pernah terjadi. Consistency dijamin lewat **constraints** (foreign key, check constraint, dll) yang menolak transaksi yang akan menghasilkan state tidak valid. Isolation dijamin lewat mekanisme seperti **MVCC** atau *locking* yang mengatur bagaimana transaksi konkuren melihat satu sama lain. Durability dijamin dengan memastikan **Write-Ahead Log harus** ditulis ke disk sebelum transaksi dianggap commit dan ACK dikirim ke aplikasi. Alurnya: BEGIN → Execute ops → Validate → COMMIT (WAL flush + ACK) | CRASH → Rollback via undo log.",
      en: "Atomicity is guaranteed via a **rollback log** — if a transaction fails midway, the database reverts all changes made as if they never happened. Consistency is guaranteed via **constraints** (foreign keys, check constraints, etc.) that reject transactions which would produce an invalid state. Isolation is guaranteed via mechanisms like **MVCC** or *locking* that govern how concurrent transactions see each other. Durability is guaranteed by ensuring the **Write-Ahead Log must** be flushed to disk before a transaction is considered committed and an ACK is sent to the application. The flow: BEGIN → Execute ops → Validate → COMMIT (WAL flush + ACK) | CRASH → Rollback via undo log.",
    },
    objective: {
      id: "Tanpa jaminan ACID, operasi multi-langkah seperti transfer saldo (debit satu akun, kredit akun lain) rentan terhadap **kegagalan parsial** — misalnya listrik mati tepat setelah debit berhasil tapi sebelum kredit dilakukan, meninggalkan uang yang 'hilang' di antara dua state. ACID menyelesaikan kelas masalah ini secara menyeluruh, memberi **jaminan matematis** bahwa baik keseluruhan operasi berhasil sempurna, atau tidak ada perubahan sama sekali — tidak ada kondisi setengah jalan yang bisa merusak integritas data.",
      en: "Without ACID guarantees, multi-step operations like a balance transfer (debit one account, credit another) are vulnerable to **partial failure** — for instance, power loss right after the debit succeeds but before the credit happens, leaving money 'lost' between two states. ACID thoroughly solves this class of problem, providing a **mathematical guarantee** that either the entire operation succeeds completely, or nothing changes at all — no half-finished state that can corrupt data integrity.",
    },
    goal: {
      id: "Hasil yang dicapai adalah database yang bisa **dipercaya sepenuhnya** untuk aplikasi kritis seperti transaksi keuangan, di mana kegagalan sistem (crash, listrik mati, koneksi terputus) **tidak akan pernah** menghasilkan data yang tidak konsisten atau hilang, dan operasi konkuren dari ribuan pengguna sekaligus tetap menghasilkan hasil yang benar seolah dijalankan satu per satu.",
      en: "The outcome is a database that can be **fully trusted** for critical applications like financial transactions, where system failures (crashes, power loss, dropped connections) will **never** produce inconsistent or lost data, and concurrent operations from thousands of simultaneous users still produce correct results as if executed one at a time.",
    },
    exampleImplementation: {
      id: "Transaksi transfer saldo yang menjaga keempat properti ACID di PostgreSQL:\n\n```sql\nBEGIN;\n\nUPDATE accounts SET balance = balance - 300 WHERE account_id = 'A';\nUPDATE accounts SET balance = balance + 300 WHERE account_id = 'B';\n\n-- Constraint mencegah saldo negatif (Consistency)\n-- ALTER TABLE accounts ADD CONSTRAINT chk_balance CHECK (balance >= 0);\n\nCOMMIT;  -- Atomicity + Durability: WAL di-flush sebelum COMMIT dianggap sukses\n```\n\nJika terjadi crash tepat setelah UPDATE pertama tapi sebelum COMMIT, PostgreSQL akan **otomatis rollback** seluruh transaksi saat restart — saldo akun A kembali seperti semula, tidak ada uang yang hilang.",
      en: "A balance-transfer transaction preserving all four ACID properties in PostgreSQL:\n\n```sql\nBEGIN;\n\nUPDATE accounts SET balance = balance - 300 WHERE account_id = 'A';\nUPDATE accounts SET balance = balance + 300 WHERE account_id = 'B';\n\n-- Constraint prevents a negative balance (Consistency)\n-- ALTER TABLE accounts ADD CONSTRAINT chk_balance CHECK (balance >= 0);\n\nCOMMIT;  -- Atomicity + Durability: the WAL is flushed before COMMIT is considered successful\n```\n\nIf a crash happens right after the first UPDATE but before COMMIT, PostgreSQL will **automatically roll back** the entire transaction on restart — account A's balance reverts to its original value, no money is lost.",
    },
    exampleEnterprise: {
      id: "Fintech Cepat memproses transfer dana antar rekening penggunanya. Setiap transfer dibungkus dalam satu transaksi ACID: debit rekening pengirim dan kredit rekening penerima **harus** berhasil bersamaan. Suatu malam terjadi listrik padam di data center tepat di tengah proses **ribuan transfer** — berkat Durability dan Atomicity, saat sistem menyala kembali, setiap transfer yang belum sempat commit otomatis di-rollback penuh, dan yang sudah commit tetap utuh. Tidak ada satu pun laporan uang hilang atau dobel.",
      en: "Fintech Cepat processes fund transfers between its users' accounts. Every transfer is wrapped in a single ACID transaction: debiting the sender's account and crediting the recipient's account **must** succeed together. One night, a data center power outage hits right in the middle of processing **thousands of transfers** — thanks to Durability and Atomicity, when the system comes back online, every transfer that hadn't yet committed is fully rolled back, and every one that had committed remains intact. Not a single report of lost or duplicated money.",
    },
    prosAndCons: {
      pros: {
        id: "- **Jaminan keandalan yang kuat** untuk aplikasi kritis seperti keuangan dan e-commerce\n- Melindungi dari kegagalan parsial akibat crash, listrik mati, atau koneksi terputus\n- Konsistensi data terjamin **secara matematis**, bukan sekadar 'biasanya benar'\n- Fondasi yang sudah matang dan teruji puluhan tahun di database relasional",
        en: "- **Strong reliability guarantees** for critical applications like finance and e-commerce\n- Protects against partial failure from crashes, power loss, or dropped connections\n- Data consistency is **mathematically guaranteed**, not just 'usually correct'\n- A mature foundation tested for decades in relational databases",
      },
      cons: {
        id: "- **Overhead performa** dibanding sistem yang mengorbankan sebagian jaminan (misalnya BASE)\n- Isolation yang ketat bisa menyebabkan *lock contention* pada beban write yang tinggi\n- Sulit diterapkan penuh pada sistem terdistribusi berskala sangat besar (trade-off dengan CAP theorem)\n- Tidak semua use case butuh jaminan seketat ini — bisa jadi *overkill* untuk data non-kritis",
        en: "- **Performance overhead** compared to systems that trade off some guarantees (like BASE)\n- Strict isolation can cause *lock contention* under high write load\n- Hard to fully apply at very large distributed system scale (trade-off with the CAP theorem)\n- Not every use case needs guarantees this strict — can be *overkill* for non-critical data",
      },
    },
  },
};
