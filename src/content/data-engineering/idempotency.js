export const term = {
  id: "idempotency",
  track: "data-engineering",
  category: "Consistency",
  color: "#34d399",
  icon: "M20 6L9 17l-5-5",
  simulation: "idempotency",
  tools: ["BigQuery MERGE", "Kafka exactly-once", "Flink EOS", "Pub/Sub", "Airflow"],
  prerequisites: [],
  related: ["upsert", "cdc"],
  name: { id: "Idempotency", en: "Idempotency" },
  content: {
    description: {
      id: "Idempotency adalah properti sebuah operasi di mana menjalankannya berkali-kali menghasilkan efek akhir yang sama persis dengan menjalankannya satu kali. Ini adalah properti yang sangat penting dalam pipeline data terdistribusi, di mana retry akibat kegagalan jaringan, timeout, atau restart job adalah hal yang wajar dan sering terjadi — tanpa idempotency, setiap retry berisiko menghasilkan data duplikat atau efek samping yang tidak diinginkan. Dengan mendesain operasi agar idempotent, tim data bisa melakukan retry dengan aman kapan saja tanpa perlu khawatir merusak integritas data.",
      en: "Idempotency is a property of an operation where running it multiple times produces exactly the same end effect as running it once. This is a critically important property in distributed data pipelines, where retries due to network failures, timeouts, or job restarts are normal and frequent — without idempotency, every retry risks producing duplicate data or unwanted side effects. By designing operations to be idempotent, data teams can safely retry at any time without worrying about corrupting data integrity.",
    },
    concept: {
      id: "Bayangkan idempotency seperti tombol lift. Menekan tombol lantai 5 sepuluh kali berturut-turut tidak akan membuat lift berhenti di lantai 5 sebanyak sepuluh kali — hasil akhirnya tetap sama: lift berhenti sekali di lantai 5. Bandingkan dengan operasi yang tidak idempotent, seperti menambahkan uang ke celengan — kalau kamu 'menambahkan Rp10.000' sepuluh kali karena mengira transaksi pertama gagal, celengan itu akan bertambah Rp100.000, bukan Rp10.000. Idempotency memastikan operasimu berperilaku seperti tombol lift, bukan seperti menambah uang ke celengan.",
      en: "Think of idempotency like an elevator button. Pressing the button for floor 5 ten times in a row won't make the elevator stop at floor 5 ten times — the end result stays the same: the elevator stops once at floor 5. Compare this to a non-idempotent operation, like adding money to a piggy bank — if you 'add $10' ten times because you thought the first transaction failed, the piggy bank ends up with $100 more, not $10. Idempotency ensures your operation behaves like the elevator button, not like adding money to a piggy bank.",
    },
    methodology: {
      id: "Cara paling umum mencapai idempotency adalah mengganti operasi `INSERT` biasa dengan `MERGE`/`UPSERT` yang berbasis primary key atau unique identifier — jika record dengan ID yang sama sudah ada, operasi akan meng-update (atau tidak melakukan apa-apa) alih-alih membuat duplikat baru. Pendekatan lain adalah idempotency key: setiap event atau request diberi identifier unik, dan sistem menyimpan daftar ID yang sudah pernah diproses untuk melakukan deduplication sebelum memproses ulang. Alurnya: Event arrives → Check idempotency key → Already processed: SKIP & return same result | New: Process → Store key.",
      en: "The most common way to achieve idempotency is replacing a plain `INSERT` with a `MERGE`/`UPSERT` based on a primary key or unique identifier — if a record with the same ID already exists, the operation updates it (or does nothing) instead of creating a new duplicate. Another approach is an idempotency key: every event or request is given a unique identifier, and the system keeps a list of already-processed IDs to deduplicate before reprocessing. The flow: Event arrives → Check idempotency key → Already processed: SKIP & return same result | New: Process → Store key.",
    },
    objective: {
      id: "Dalam sistem terdistribusi, kegagalan parsial adalah hal yang wajar — sebuah job bisa crash setelah berhasil menulis sebagian data tapi sebelum mengonfirmasi keberhasilan, memaksa orchestrator untuk melakukan retry dari awal. Jika operasi write tidak idempotent, retry ini akan menghasilkan data duplikat karena bagian yang sudah berhasil ditulis sebelumnya akan ditulis ulang. Idempotency menyelesaikan masalah fundamental ini, membuat retry menjadi operasi yang aman dan bisa dilakukan kapan saja tanpa risiko merusak data.",
      en: "In distributed systems, partial failure is normal — a job can crash after successfully writing some data but before confirming success, forcing the orchestrator to retry from the start. If the write operation isn't idempotent, this retry will produce duplicate data since the portion already written successfully gets written again. Idempotency solves this fundamental problem, making retries a safe operation that can be performed at any time without risking data corruption.",
    },
    goal: {
      id: "Hasil yang dicapai adalah pipeline data yang tangguh terhadap kegagalan — retry otomatis bisa dilakukan tanpa rasa takut, tidak ada data duplikat meski sebuah job dijalankan berkali-kali akibat gangguan jaringan atau restart, dan tim data bisa tidur nyenyak tahu bahwa pipeline mereka aman dari duplikasi data yang sulit dideteksi.",
      en: "The outcome is a pipeline resilient to failure — automatic retries can happen without fear, no duplicate data even if a job runs multiple times due to network issues or restarts, and data teams can rest easy knowing their pipeline is safe from hard-to-detect data duplication.",
    },
    exampleImplementation: {
      id: "Membuat pipeline ingestion klaim yang idempotent dengan MERGE di BigQuery:\n\n```sql\nMERGE INTO warehouse.claims AS target\nUSING staging.claims_batch AS source\nON target.claim_id = source.claim_id\nWHEN MATCHED THEN\n  UPDATE SET target.status = source.status, target.amount = source.amount\nWHEN NOT MATCHED THEN\n  INSERT (claim_id, status, amount) VALUES (source.claim_id, source.status, source.amount);\n```\n\nJika job Airflow yang menjalankan query ini gagal di tengah jalan dan di-retry oleh orchestrator, menjalankan MERGE yang sama lagi tidak akan menghasilkan baris duplikat — setiap `claim_id` yang sudah ada akan di-update (bukan diduplikasi), persis seperti menekan tombol lift yang sama berkali-kali.",
      en: "Building an idempotent claims ingestion pipeline with MERGE in BigQuery:\n\n```sql\nMERGE INTO warehouse.claims AS target\nUSING staging.claims_batch AS source\nON target.claim_id = source.claim_id\nWHEN MATCHED THEN\n  UPDATE SET target.status = source.status, target.amount = source.amount\nWHEN NOT MATCHED THEN\n  INSERT (claim_id, status, amount) VALUES (source.claim_id, source.status, source.amount);\n```\n\nIf the Airflow job running this query fails midway and is retried by the orchestrator, running the same MERGE again won't produce duplicate rows — every existing `claim_id` gets updated (not duplicated), exactly like pressing the same elevator button repeatedly.",
    },
    exampleEnterprise: {
      id: "Pipeline Airflow milik PT Nusantara Asuransi yang memproses klaim harian sempat gagal di tengah proses akibat gangguan jaringan sementara ke BigQuery, lalu orchestrator otomatis melakukan retry seluruh task dari awal. Karena mereka menggunakan MERGE berbasis `claim_id` alih-alih INSERT biasa, retry itu berjalan mulus tanpa menghasilkan satu pun baris klaim duplikat, meski task yang sama secara efektif berjalan dua kali penuh.",
      en: "PT Nusantara Asuransi's Airflow pipeline processing daily claims once failed midway due to a temporary network glitch to BigQuery, and the orchestrator automatically retried the entire task from scratch. Because they use a MERGE based on `claim_id` instead of a plain INSERT, that retry ran smoothly without producing a single duplicate claim row, even though the same task effectively ran twice in full.",
    },
    prosAndCons: {
      pros: {
        id: "- Retry menjadi aman dilakukan kapan saja tanpa risiko data duplikat\n- Meningkatkan ketangguhan pipeline terhadap kegagalan jaringan atau restart job\n- Menyederhanakan strategi error handling — cukup retry, tidak perlu logika rollback rumit\n- Fondasi penting untuk mencapai exactly-once semantics di sistem streaming",
        en: "- Retries become safe to perform at any time without risking duplicate data\n- Increases pipeline resilience against network failures or job restarts\n- Simplifies error-handling strategy — just retry, no need for complex rollback logic\n- An important foundation for achieving exactly-once semantics in streaming systems",
      },
      cons: {
        id: "- Butuh desain eksplisit sejak awal — tidak semua operasi otomatis idempotent tanpa usaha\n- MERGE/UPSERT umumnya lebih lambat secara komputasi dibanding INSERT sederhana\n- Menyimpan idempotency key untuk deduplication menambah kebutuhan storage dan lookup\n- Operasi dengan efek samping eksternal (misalnya mengirim email) sulit dibuat benar-benar idempotent",
        en: "- Requires explicit design from the start — not every operation is automatically idempotent without effort\n- MERGE/UPSERT is generally more computationally expensive than a simple INSERT\n- Storing an idempotency key for deduplication adds storage and lookup overhead\n- Operations with external side effects (like sending an email) are hard to make truly idempotent",
      },
    },
  },
};
