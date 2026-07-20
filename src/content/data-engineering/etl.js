export const term = {
  id: "etl",
  track: "data-engineering",
  category: "Pipeline",
  color: "#22d3ee",
  icon: "M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3",
  simulation: "etl",
  tools: ["Apache Spark", "SSIS", "Talend", "Informatica", "Pentaho"],
  prerequisites: [],
  related: ["elt", "cdc"],
  name: { id: "ETL — Extract Transform Load", en: "ETL — Extract, Transform, Load" },
  content: {
    description: {
      id: "ETL (Extract, Transform, Load) adalah pola pipeline data paling klasik: data diambil dari sumber (Extract), dibersihkan dan diubah bentuknya di server staging terpisah (Transform), baru kemudian dimuat ke tujuan akhir seperti data warehouse (Load). Urutan ini penting — transformasi terjadi *sebelum* data masuk ke target, bukan sesudahnya seperti pada ELT. Pola ini dominan sejak era data warehouse tradisional dan masih sangat relevan ketika target sistem tidak punya compute yang cukup kuat untuk melakukan transformasi berat, atau ketika ada kebutuhan compliance yang mengharuskan data disaring sebelum menyentuh sistem tujuan.",
      en: "ETL (Extract, Transform, Load) is the classic data pipeline pattern: data is pulled from a source (Extract), cleaned and reshaped on a separate staging server (Transform), and only then loaded into a final destination like a data warehouse (Load). The order matters — transformation happens *before* data lands in the target, unlike ELT. This pattern has dominated since the traditional data warehouse era and remains highly relevant when the target system lacks strong compute for heavy transformation, or when compliance requires data to be filtered before it ever touches the destination system.",
    },
    concept: {
      id: "Bayangkan ETL seperti proses katering untuk acara besar. Bahan mentah diambil dari pasar (Extract), dimasak dan disajikan rapi di dapur katering terpisah (Transform) — bukan di lokasi acara — baru kemudian makanan jadi dikirim dan disajikan di meja tamu (Load). Kamu tidak ingin memasak langsung di meja tamu karena dapur di sana mungkin tidak memadai; sama seperti target data warehouse yang sering tidak dirancang untuk menangani transformasi berat.",
      en: "Think of ETL like catering for a large event. Raw ingredients are bought from the market (Extract), cooked and neatly prepared in a separate catering kitchen (Transform) — not at the venue — and only then is the finished food delivered and served at the guest tables (Load). You don't want to cook right at the guest table because the kitchen facilities there are often inadequate; similarly, the target data warehouse is often not designed to handle heavy transformation.",
    },
    methodology: {
      id: "Data diekstrak dari sistem sumber (OLTP database, API, file) menggunakan connector atau query terjadwal. Transformasi terjadi di ETL engine atau server staging khusus — bukan di database target — meliputi pembersihan nilai null, join antar sumber, agregasi, dan enrichment. Setelah divalidasi, data hasil transformasi dimuat ke target dalam bentuk yang sudah siap pakai. Alurnya: Source → Extract → Staging Transform (clean/join/agg) → Validate → Load to DWH. Karena compute transformasi terpisah dari target, tim punya kontrol penuh atas resource dan logika transformasi, tapi harus menyediakan infrastruktur staging sendiri.",
      en: "Data is extracted from source systems (OLTP databases, APIs, files) using connectors or scheduled queries. Transformation happens in an ETL engine or dedicated staging server — not in the target database — covering null cleanup, joins across sources, aggregation, and enrichment. Once validated, the transformed data is loaded into the target already ready for use. The flow: Source → Extract → Staging Transform (clean/join/agg) → Validate → Load to DWH. Because transformation compute is separate from the target, teams have full control over resources and transformation logic, but must provision their own staging infrastructure.",
    },
    objective: {
      id: "ETL muncul karena data warehouse generasi awal (on-premise, seperti Teradata atau SQL Server) punya compute yang mahal dan terbatas — melakukan transformasi berat langsung di dalamnya akan mengganggu performa query pengguna lain. Dengan memindahkan beban transformasi ke server staging terpisah, target warehouse hanya menerima data yang sudah bersih dan siap pakai, sehingga bebannya jauh lebih ringan.",
      en: "ETL emerged because early-generation data warehouses (on-premise, like Teradata or SQL Server) had expensive and limited compute — running heavy transformations directly inside them would degrade query performance for other users. By moving the transformation workload to a separate staging server, the target warehouse only receives already-clean, ready-to-use data, keeping its load far lighter.",
    },
    goal: {
      id: "Hasil yang dicapai adalah target data warehouse yang tetap ringan bebannya karena hanya menerima data bersih, kontrol penuh atas logika transformasi di lingkungan staging yang terpisah, dan kemampuan menerapkan aturan kepatuhan/keamanan (masking data sensitif, misalnya) sebelum data pernah menyentuh sistem tujuan.",
      en: "The outcome is a target data warehouse that stays lightly loaded since it only receives clean data, full control over transformation logic in a separate staging environment, and the ability to enforce compliance/security rules (such as masking sensitive data) before it ever touches the destination system.",
    },
    exampleImplementation: {
      id: "Pipeline ETL klasik menggunakan Apache Spark sebagai engine transformasi:\n\n1. **Extract**: baca tabel `employees` dari PostgreSQL OLTP menggunakan JDBC connector.\n2. **Transform**: di cluster Spark terpisah — buang baris dengan `salary IS NULL`, join dengan tabel `departments`, hitung `bonus = salary * 0.1`.\n3. **Load**: tulis hasil akhir ke tabel `dwh.fact_employee_compensation` di Snowflake.\n\n```python\n# Contoh transform di Spark sebelum load\ndf = spark.read.jdbc(source_url, \"employees\")\ndf_clean = df.filter(df.salary.isNotNull()) \\\n  .join(departments_df, \"dept_id\") \\\n  .withColumn(\"bonus\", df.salary * 0.1)\ndf_clean.write.jdbc(target_url, \"dwh.fact_employee_compensation\", mode=\"overwrite\")\n```",
      en: "A classic ETL pipeline using Apache Spark as the transformation engine:\n\n1. **Extract**: read the `employees` table from a PostgreSQL OLTP database via a JDBC connector.\n2. **Transform**: on a separate Spark cluster — drop rows where `salary IS NULL`, join with the `departments` table, compute `bonus = salary * 0.1`.\n3. **Load**: write the final result into the `dwh.fact_employee_compensation` table in Snowflake.\n\n```python\n# Example transform in Spark before load\ndf = spark.read.jdbc(source_url, \"employees\")\ndf_clean = df.filter(df.salary.isNotNull()) \\\n  .join(departments_df, \"dept_id\") \\\n  .withColumn(\"bonus\", df.salary * 0.1)\ndf_clean.write.jdbc(target_url, \"dwh.fact_employee_compensation\", mode=\"overwrite\")\n```",
    },
    exampleEnterprise: {
      id: "Fintech Cepat menggunakan Talend untuk memindahkan data HR dari sistem payroll internal ke SQL Server data warehouse setiap malam. Data karyawan diekstrak dari sistem sumber, ditransformasi di server staging — nama distandardisasi, gaji dikonversi ke mata uang tunggal, data karyawan yang resign difilter — baru kemudian dimuat ke warehouse untuk dipakai tim finance menyusun laporan bulanan.",
      en: "Fintech Cepat uses Talend to move HR data from an internal payroll system into a SQL Server data warehouse every night. Employee data is extracted from the source system, transformed on a staging server — names standardized, salaries converted to a single currency, resigned employees filtered out — and only then loaded into the warehouse for the finance team to build monthly reports.",
    },
    prosAndCons: {
      pros: {
        id: "- Target warehouse tetap ringan karena hanya menerima data yang sudah bersih\n- Kontrol penuh atas logika transformasi di lingkungan staging terpisah\n- Cocok untuk menerapkan aturan compliance/masking sebelum data menyentuh target\n- Matang dan didukung banyak tool enterprise (Informatica, SSIS, Talend)",
        en: "- Target warehouse stays lightweight since it only receives already-clean data\n- Full control over transformation logic in a separate staging environment\n- Well-suited for enforcing compliance/masking rules before data touches the target\n- Mature and supported by many enterprise tools (Informatica, SSIS, Talend)",
      },
      cons: {
        id: "- Butuh infrastruktur staging terpisah, menambah biaya dan kompleksitas operasional\n- Perubahan kebutuhan bisnis mengharuskan re-run seluruh pipeline dari Extract, bukan sekadar query ulang\n- Lebih lambat dibanding ELT modern karena transformasi tidak memanfaatkan compute besar dari cloud warehouse\n- Skema staging yang kaku menyulitkan eksplorasi data mentah oleh analyst",
        en: "- Requires separate staging infrastructure, adding operational cost and complexity\n- Changing business requirements forces a full pipeline re-run from Extract, not just a re-query\n- Slower than modern ELT since transformation doesn't leverage the large compute of cloud warehouses\n- Rigid staging schema makes raw-data exploration harder for analysts",
      },
    },
  },
};
