export const term = {
  id: "cdc",
  track: "data-engineering",
  category: "Pipeline",
  color: "#06b6d4",
  icon: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z",
  simulation: "cdc",
  tools: ["Debezium", "GCP Datastream", "Striim", "Fivetran", "Kafka Connect"],
  prerequisites: ["etl"],
  related: ["elt", "write-ahead-log"],
  name: { id: "CDC — Change Data Capture", en: "CDC — Change Data Capture" },
  content: {
    description: {
      id: "Change Data Capture (CDC) adalah teknik untuk menangkap perubahan data (INSERT, UPDATE, DELETE) di database sumber secara real-time, langsung dari transaction log internalnya — bukan dengan melakukan query berulang ke seluruh tabel. Ini adalah alternatif yang jauh lebih efisien dibanding pendekatan batch tradisional yang melakukan full table scan setiap kali ingin tahu apa yang berubah. CDC menjadi tulang punggung banyak arsitektur real-time modern karena memungkinkan sinkronisasi data antar sistem dengan latency rendah tanpa membebani database sumber.",
      en: "Change Data Capture (CDC) is a technique for capturing data changes (INSERT, UPDATE, DELETE) in a source database in real time, reading directly from its internal transaction log — rather than repeatedly querying the entire table. It's a far more efficient alternative to the traditional batch approach of doing a full table scan every time you want to know what changed. CDC is the backbone of many modern real-time architectures because it enables low-latency data synchronization between systems without burdening the source database.",
    },
    concept: {
      id: "Bayangkan CDC seperti mengintip buku catatan kasir di toko, bukan menghitung ulang seluruh barang di rak setiap lima menit. Buku catatan kasir (transaction log/binlog) sudah mencatat setiap transaksi yang terjadi secara berurutan — kamu tinggal membaca baris baru yang ditambahkan sejak terakhir kali kamu cek, jauh lebih cepat daripada menghitung ulang seluruh stok toko dari awal setiap kali.",
      en: "Think of CDC like peeking at a cashier's ledger in a shop, instead of recounting every item on the shelves every five minutes. The cashier's ledger (the transaction log/binlog) already records every transaction sequentially — you just read the new lines added since you last checked, far faster than recounting the entire store's stock from scratch every time.",
    },
    methodology: {
      id: "Setiap perubahan data di database (INSERT/UPDATE/DELETE) pertama-tama ditulis ke transaction log internal database — binlog di MySQL, Write-Ahead Log (WAL) di PostgreSQL. Tool CDC seperti Debezium membaca log ini secara terus-menerus dan mengubah setiap perubahan menjadi event yang dikirim ke message broker seperti Kafka, yang kemudian disalurkan ke sistem tujuan. Karena CDC membaca log, bukan melakukan query ke tabel, dampaknya terhadap performa database sumber nyaris nol. Alurnya: DB Transaction → Write Binlog/WAL → CDC reads log → Event to Kafka → Sink to Target.",
      en: "Every data change in a database (INSERT/UPDATE/DELETE) is first written to the database's internal transaction log — binlog in MySQL, Write-Ahead Log (WAL) in PostgreSQL. A CDC tool like Debezium continuously reads this log and turns each change into an event sent to a message broker like Kafka, which then routes it to the target system. Because CDC reads the log rather than querying the table, its performance impact on the source database is nearly zero. The flow: DB Transaction → Write Binlog/WAL → CDC reads log → Event to Kafka → Sink to Target.",
    },
    objective: {
      id: "Sebelum CDC, cara umum menyinkronkan data antar sistem adalah dengan query batch berkala (misalnya setiap jam), yang berarti data selalu terlambat dan setiap query membebani database sumber karena harus memindai banyak baris untuk mencari yang berubah. CDC menyelesaikan kedua masalah ini sekaligus: latency turun dari jam ke detik, dan beban ke database sumber turun drastis karena tidak ada lagi query pemindaian — CDC hanya membaca log yang memang sudah ditulis database untuk keperluan durability-nya sendiri.",
      en: "Before CDC, the common way to sync data between systems was periodic batch queries (e.g. hourly), meaning data was always stale and every query burdened the source database by scanning many rows to find what changed. CDC solves both problems at once: latency drops from hours to seconds, and the load on the source database drops sharply since there's no more scanning query — CDC merely reads the log the database already writes for its own durability purposes.",
    },
    goal: {
      id: "Hasil yang dicapai adalah sinkronisasi data lintas sistem dengan latency dalam hitungan detik (bukan jam), beban nyaris nol terhadap database sumber karena tidak ada query pemindaian tambahan, dan kemampuan menangkap setiap perubahan individual (termasuk delete) yang sering terlewat oleh pendekatan batch berbasis timestamp.",
      en: "The outcome is cross-system data synchronization with latency measured in seconds (not hours), near-zero load on the source database since there's no extra scanning query, and the ability to capture every individual change (including deletes) that timestamp-based batch approaches often miss.",
    },
    exampleImplementation: {
      id: "Setup CDC umum menggunakan Debezium di atas Kafka Connect untuk membaca binlog MySQL:\n\n1. Aktifkan binary logging di MySQL dengan `binlog_format=ROW`.\n2. Deploy Debezium MySQL connector yang terhubung ke source database dan membaca perubahan dari binlog.\n3. Setiap perubahan dipublikasikan sebagai event JSON ke topic Kafka, satu topic per tabel.\n4. Sink connector (misalnya ke BigQuery) mengkonsumsi topic tersebut dan menerapkan perubahan ke tabel tujuan via MERGE.\n\n```json\n// Contoh event CDC dari Debezium\n{\n  \"op\": \"u\",\n  \"before\": { \"id\": 101, \"status\": \"pending\" },\n  \"after\": { \"id\": 101, \"status\": \"approved\" },\n  \"source\": { \"table\": \"claims\", \"ts_ms\": 1719900000000 }\n}\n```",
      en: "A typical CDC setup uses Debezium on top of Kafka Connect to read MySQL's binlog:\n\n1. Enable binary logging in MySQL with `binlog_format=ROW`.\n2. Deploy the Debezium MySQL connector, which connects to the source database and reads changes from the binlog.\n3. Every change is published as a JSON event to a Kafka topic, one topic per table.\n4. A sink connector (e.g. to BigQuery) consumes that topic and applies the change to the target table via MERGE.\n\n```json\n// Example CDC event from Debezium\n{\n  \"op\": \"u\",\n  \"before\": { \"id\": 101, \"status\": \"pending\" },\n  \"after\": { \"id\": 101, \"status\": \"approved\" },\n  \"source\": { \"table\": \"claims\", \"ts_ms\": 1719900000000 }\n}\n```",
    },
    exampleEnterprise: {
      id: "Klinika Sehat, jaringan klinik dengan sistem pendaftaran berbasis MySQL, menggunakan Debezium untuk membaca binlog tabel `appointments` mereka. Setiap kali status janji temu berubah (dijadwalkan, dibatalkan, selesai), event dikirim ke Kafka lalu disalurkan ke BigQuery melalui GCP Datastream, membuat dashboard operasional real-time yang menunjukkan status klinik tanpa perlu query langsung ke database produksi yang bisa mengganggu performa aplikasi pendaftaran.",
      en: "Klinika Sehat, a clinic network with a MySQL-based booking system, uses Debezium to read the binlog of their `appointments` table. Every time an appointment status changes (scheduled, cancelled, completed), an event is sent to Kafka and routed to BigQuery via GCP Datastream, powering a real-time operational dashboard showing clinic status without needing direct queries against the production database, which could hurt the booking app's performance.",
    },
    prosAndCons: {
      pros: {
        id: "- Latency sangat rendah (detik) dibanding batch query berjam-jam\n- Dampak nyaris nol terhadap performa database sumber\n- Menangkap setiap perubahan individual, termasuk DELETE, yang sering terlewat pendekatan timestamp\n- Menjadi fondasi untuk arsitektur event-driven dan sinkronisasi multi-sistem",
        en: "- Very low latency (seconds) compared to hourly batch queries\n- Near-zero impact on source database performance\n- Captures every individual change, including DELETEs, which timestamp-based approaches often miss\n- Becomes the foundation for event-driven architectures and multi-system synchronization",
      },
      cons: {
        id: "- Setup awal lebih kompleks dibanding query batch sederhana\n- Perubahan skema di sumber (schema evolution) bisa mematahkan pipeline CDC jika tidak ditangani hati-hati\n- Butuh infrastruktur streaming (Kafka atau setara) yang menambah kompleksitas operasional\n- Beberapa sumber data (API, flat file) tidak punya transaction log sehingga CDC tidak bisa diterapkan langsung",
        en: "- More complex initial setup than a simple batch query\n- Schema evolution at the source can break the CDC pipeline if not handled carefully\n- Requires streaming infrastructure (Kafka or equivalent), adding operational complexity\n- Some data sources (APIs, flat files) don't have a transaction log, so CDC can't be applied directly",
      },
    },
  },
};
