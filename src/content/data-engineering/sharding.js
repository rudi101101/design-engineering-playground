export const term = {
  id: "sharding",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#c084fc",
  icon: "M21 5c0 1.66-4 3-9 3S3 6.66 3 5m18 0c0-1.66-4-3-9-3S3 3.34 3 5m18 0v14c0 1.66-4 3-9 3s-9-1.34-9-3V5",
  simulation: "sharding",
  tools: ["MongoDB", "Cassandra", "MySQL Vitess", "CockroachDB", "PostgreSQL Citus"],
  prerequisites: ["partitioning"],
  related: ["replication", "cap-theorem"],
  name: { id: "Sharding — Horizontal Partitioning", en: "Sharding — Horizontal Partitioning" },
  content: {
    description: {
      id: "Sharding adalah **teknik memecah database secara horizontal** menjadi beberapa bagian (shard) yang tersebar di banyak server berbeda, di mana setiap shard menyimpan sebagian data berdasarkan sebuah **shard key**. Ini berbeda dari replikasi, yang menyalin seluruh data ke banyak server: sharding justru membagi data sehingga masing-masing server hanya menyimpan sebagian saja. Teknik ini menjadi solusi utama ketika satu server database sudah **tidak lagi cukup**, baik dari sisi kapasitas storage maupun throughput, dan scale-up (menambah spesifikasi satu server) sudah mencapai batasnya secara fisik atau ekonomis.",
      en: "Sharding is a technique for **horizontally splitting a database** into several parts (shards) spread across many different servers, where each shard stores a portion of the data based on a **shard key**. This differs from replication, which copies all the data to many servers: sharding instead divides the data so each server only holds a portion. This technique is the primary solution when a single database server is **no longer enough**, either in storage capacity or throughput, and scaling up (upgrading one server's specs) has hit its physical or economic limit.",
    },
    concept: {
      id: "Bayangkan sharding seperti *sebuah perpustakaan kota yang bukunya sudah terlalu banyak untuk satu gedung*. Solusinya bukan membangun gedung yang lebih besar dan lebih besar lagi (scale-up), tapi membuka beberapa cabang perpustakaan di berbagai wilayah kota, di mana buku dibagi berdasarkan aturan tertentu: misalnya cabang A menyimpan buku dengan judul A-M, cabang B menyimpan N-Z. Ketika kamu tahu judul buku yang dicari, kamu langsung tahu harus ke cabang mana (**routing berdasarkan shard key**), tanpa perlu mengecek semua cabang.",
      en: "Think of sharding like *a city library whose books have become too numerous for one building*. The solution isn't building an ever-bigger building (scaling up), but opening several branch libraries across different areas of the city, where books are divided by a certain rule: branch A holds titles A-M, branch B holds N-Z. When you know the title you're looking for, you immediately know which branch to go to (**routing based on the shard key**), without needing to check every branch.",
    },
    methodology: {
      id: "Setiap operasi write atau read pertama-tama melewati sebuah router atau layer aplikasi yang menghitung **hash dari shard key** (misalnya `user_id`) untuk menentukan shard mana yang harus dituju, lalu request diteruskan langsung ke server shard tersebut. **Consistent hashing** sering dipakai agar penambahan/pengurangan shard di kemudian hari tidak memaksa hampir semua data untuk dipindah ulang (resharding). Query yang butuh data dari banyak shard sekaligus (cross-shard query) **jauh lebih mahal** karena harus melakukan scatter-gather: mengirim query ke semua shard lalu menggabungkan hasilnya. Alurnya: Write → Hash(shard_key) → Route to shard N → Execute local | Cross-shard: scatter all → gather → merge.",
      en: "Every write or read operation first passes through a router or application layer that **hashes the shard key** (e.g. `user_id`) to determine which shard to target, then the request is routed directly to that shard's server. **Consistent hashing** is often used so that adding or removing shards later doesn't force nearly all data to be moved again (resharding). Queries that need data from multiple shards at once (cross-shard queries) are **much more expensive** because they require scatter-gather: sending the query to every shard then merging the results. The flow: Write → Hash(shard_key) → Route to shard N → Execute local | Cross-shard: scatter all → gather → merge.",
    },
    objective: {
      id: "Sebuah server database tunggal, seberapapun kuat spesifikasinya, pada akhirnya akan mencapai **batas fisik**: baik dari sisi kapasitas disk yang bisa dipasang maupun jumlah request per detik yang bisa dilayani satu mesin. Vertical scaling (menambah CPU/RAM/disk pada server yang sama) juga punya titik jenuh secara ekonomis: server dengan spesifikasi sangat tinggi harganya melonjak tidak proporsional. Sharding menyelesaikan ini dengan **scale-out**: menambah lebih banyak server yang lebih murah, bukan satu server yang semakin mahal.",
      en: "A single database server, however powerful its specs, will eventually hit a **physical limit**: both in the disk capacity that can be installed and the number of requests per second one machine can serve. Vertical scaling (adding CPU/RAM/disk to the same server) also has an economic saturation point: very high-spec servers get disproportionately expensive. Sharding solves this with **scale-out**: adding more, cheaper servers, instead of one increasingly expensive server.",
    },
    goal: {
      id: "Hasil yang dicapai adalah kapasitas storage dan throughput yang bisa **terus bertambah secara horizontal** seiring pertumbuhan data, tanpa dibatasi oleh kemampuan fisik satu mesin, serta **biaya infrastruktur yang lebih efisien** karena menggunakan banyak server dengan spesifikasi wajar dibanding satu server super besar yang harganya tidak proporsional.",
      en: "The outcome is storage and throughput capacity that can **keep growing horizontally** as data grows, without being limited by one machine's physical capability, along with **more cost-efficient infrastructure** since it uses many reasonably-specced servers instead of one super-large server priced disproportionately.",
    },
    exampleImplementation: {
      id: "Menerapkan sharding sederhana berbasis range di aplikasi:\n\n```python\ndef get_shard(user_id):\n    if user_id < 1_000_000:\n        return \"shard-1\"  # 0 - 999,999\n    elif user_id < 2_000_000:\n        return \"shard-2\"  # 1,000,000 - 1,999,999\n    else:\n        return \"shard-3\"  # 2,000,000+\n\ndef write_user(user_id, data):\n    shard = get_shard(user_id)\n    connection = get_connection(shard)\n    connection.execute(\"INSERT INTO users VALUES (%s, %s)\", (user_id, data))\n```\n\nDengan MongoDB, sharding bisa dikonfigurasi secara native:\n\n```javascript\nsh.shardCollection(\"mydb.users\", { user_id: \"hashed\" });\n```\n\nMongoDB **otomatis mendistribusikan data ke shard** berdasarkan hash dari `user_id`, dan router (`mongos`) menangani routing query **secara transparan** ke aplikasi.",
      en: "Implementing simple range-based sharding at the application layer:\n\n```python\ndef get_shard(user_id):\n    if user_id < 1_000_000:\n        return \"shard-1\"  # 0 - 999,999\n    elif user_id < 2_000_000:\n        return \"shard-2\"  # 1,000,000 - 1,999,999\n    else:\n        return \"shard-3\"  # 2,000,000+\n\ndef write_user(user_id, data):\n    shard = get_shard(user_id)\n    connection = get_connection(shard)\n    connection.execute(\"INSERT INTO users VALUES (%s, %s)\", (user_id, data))\n```\n\nWith MongoDB, sharding can be configured natively:\n\n```javascript\nsh.shardCollection(\"mydb.users\", { user_id: \"hashed\" });\n```\n\nMongoDB **automatically distributes data across shards** based on a hash of `user_id`, and the router (`mongos`) handles query routing **transparently** to the application.",
    },
    exampleEnterprise: {
      id: "Fintech Cepat memiliki **5 juta pengguna aktif** dan tabel transaksi tunggal mereka sudah tidak muat lagi di satu server PostgreSQL. Mereka menerapkan sharding dengan PostgreSQL Citus, membagi data berdasarkan `user_id` ke **4 shard**. Setiap query transaksi dari aplikasi mobile selalu menyertakan `user_id`, sehingga router bisa langsung mengarahkan ke shard yang tepat tanpa perlu scatter-gather. Hanya laporan agregat bulanan lintas semua pengguna yang butuh query cross-shard, yang mereka jadwalkan berjalan di jam sepi.",
      en: "Fintech Cepat has **5 million active users** and their single transaction table no longer fits on one PostgreSQL server. They implement sharding with PostgreSQL Citus, splitting data by `user_id` across **4 shards**. Every transaction query from the mobile app always includes `user_id`, so the router can route directly to the correct shard without needing scatter-gather. Only the monthly aggregate report across all users needs a cross-shard query, which they schedule to run during off-peak hours.",
    },
    prosAndCons: {
      pros: {
        id: "- Skalabilitas horizontal yang hampir tidak terbatas — tinggal tambah shard baru\n- Biaya infrastruktur lebih efisien dibanding terus memperbesar satu server\n- Throughput meningkat karena beban tersebar ke banyak server sekaligus\n- Kegagalan satu shard tidak selalu melumpuhkan seluruh sistem (blast radius lebih kecil)",
        en: "- Nearly unlimited horizontal scalability — just add new shards\n- More cost-efficient infrastructure compared to continually upsizing one server\n- Higher throughput since load is spread across many servers at once\n- One shard's failure doesn't always cripple the entire system (smaller blast radius)",
      },
      cons: {
        id: "- Cross-shard query (JOIN atau aggregate lintas shard) jauh lebih mahal dan kompleks\n- Memilih shard key yang buruk bisa menyebabkan hot shard — satu shard menerima beban jauh lebih besar dari yang lain\n- Resharding (menambah/mengurangi jumlah shard) adalah operasi yang rumit dan berisiko\n- Menambah kompleksitas operasional signifikan dibanding database tunggal",
        en: "- Cross-shard queries (JOINs or aggregates across shards) are far more expensive and complex\n- Choosing a poor shard key can cause a hot shard — one shard receiving far more load than the others\n- Resharding (adding/removing shards) is a complex and risky operation\n- Adds significant operational complexity compared to a single database",
      },
    },
  },
};
