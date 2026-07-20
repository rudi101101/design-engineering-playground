export const term = {
  id: "data-lineage",
  track: "data-engineering",
  category: "Governance",
  color: "#06b6d4",
  icon: "M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3",
  simulation: "lineage",
  tools: ["OpenLineage", "dbt Lineage", "Google Dataplex", "Marquez", "Monte Carlo"],
  prerequisites: [],
  related: ["data-catalog", "data-quality"],
  name: { id: "Data Lineage", en: "Data Lineage" },
  content: {
    description: {
      id: "Data lineage adalah kemampuan untuk melacak perjalanan data secara end-to-end — dari sumber asalnya, melalui setiap transformasi yang dialaminya, sampai ke tujuan akhirnya di dashboard atau laporan. Pada tingkat paling detail (column-level lineage), sistem bisa menjawab pertanyaan seperti 'kolom `total_revenue` di dashboard ini dihitung dari kolom apa saja di tabel sumber mana, melalui transformasi apa saja?'. Ini menjadi krusial ketika pipeline data sudah terdiri dari puluhan atau ratusan job yang saling bergantung, di mana tanpa lineage, melacak akar masalah data yang salah bisa memakan waktu berhari-hari.",
      en: "Data lineage is the ability to trace data's journey end-to-end — from its original source, through every transformation it undergoes, to its final destination in a dashboard or report. At the most granular level (column-level lineage), the system can answer questions like 'which source columns, through which transformations, produce the `total_revenue` column in this dashboard?'. This becomes critical once a data pipeline consists of dozens or hundreds of interdependent jobs, where without lineage, tracing the root cause of wrong data can take days.",
    },
    concept: {
      id: "Bayangkan data lineage seperti resi pelacakan paket (tracking number). Kamu bisa melihat perjalanan lengkap paket itu — dari gudang asal, melewati beberapa hub distribusi, sampai ke alamat tujuan — beserta timestamp di setiap titik. Kalau paket rusak atau hilang, kamu bisa lacak persis di hub mana masalahnya terjadi, tanpa perlu menelusuri ulang seluruh rute secara manual. Data lineage memberikan 'resi pelacakan' yang sama untuk setiap angka di dashboard-mu.",
      en: "Think of data lineage like a package tracking number. You can see the package's full journey — from the origin warehouse, through several distribution hubs, to the final address — along with a timestamp at each point. If the package is damaged or lost, you can pinpoint exactly which hub the problem occurred at, without manually retracing the entire route. Data lineage gives that same 'tracking number' for every number on your dashboard.",
    },
    methodology: {
      id: "Lineage bisa dibangun otomatis dengan dua pendekatan utama: parsing SQL secara statis (menganalisis kode query/dbt model untuk mengekstrak mapping kolom sumber-ke-tujuan tanpa menjalankannya) atau instrumentasi runtime seperti OpenLineage yang mencatat metadata setiap kali sebuah job benar-benar berjalan. Hasilnya disimpan sebagai graph dependency, di mana setiap node adalah tabel/kolom dan setiap edge adalah transformasi. Graph ini kemudian bisa divisualisasikan dan di-query untuk impact analysis. Alurnya: Parse SQL/Pipeline → Extract column mappings → Build Lineage DAG → Store → Visualize → Impact query.",
      en: "Lineage can be built automatically via two main approaches: static SQL parsing (analyzing query/dbt model code to extract source-to-target column mappings without running it) or runtime instrumentation like OpenLineage, which records metadata every time a job actually executes. The result is stored as a dependency graph, where each node is a table/column and each edge is a transformation. This graph can then be visualized and queried for impact analysis. The flow: Parse SQL/Pipeline → Extract column mappings → Build Lineage DAG → Store → Visualize → Impact query.",
    },
    objective: {
      id: "Semakin kompleks pipeline data sebuah organisasi, semakin sulit menjawab dua pertanyaan mendasar: 'dari mana angka ini berasal?' (untuk debugging) dan 'apa yang akan rusak kalau saya ubah tabel ini?' (untuk impact analysis sebelum melakukan perubahan). Tanpa lineage, kedua pertanyaan ini dijawab secara manual dengan membaca kode satu per satu — proses yang lambat dan rawan kesalahan. Data lineage menyelesaikan ini dengan menyediakan peta dependency yang selalu up-to-date secara otomatis.",
      en: "The more complex an organization's data pipeline becomes, the harder it is to answer two fundamental questions: 'where did this number come from?' (for debugging) and 'what will break if I change this table?' (for impact analysis before making a change). Without lineage, both questions are answered manually by reading code line by line — a slow, error-prone process. Data lineage solves this by automatically providing an always up-to-date dependency map.",
    },
    goal: {
      id: "Hasil yang dicapai adalah waktu debugging yang jauh lebih singkat (dari berhari-hari menjadi hitungan menit) karena akar masalah bisa dilacak langsung ke sumbernya, kemampuan melakukan impact analysis sebelum mengubah skema tabel untuk mencegah pipeline downstream rusak tanpa peringatan, dan dokumentasi pipeline yang selalu akurat karena dibangun otomatis, bukan ditulis manual yang cepat basi.",
      en: "The outcome is far shorter debugging time (from days to minutes) since the root cause can be traced directly to its source, the ability to perform impact analysis before changing a table's schema to prevent downstream pipelines from breaking without warning, and pipeline documentation that stays accurate since it's built automatically rather than manually written and quickly outdated.",
    },
    exampleImplementation: {
      id: "Menggunakan dbt yang secara native membangun lineage dari model SQL:\n\n```sql\n-- models/marts/fact_claims.sql\nSELECT\n  c.claim_id,\n  c.claim_amount,\n  d.date_sk\nFROM {{ ref('stg_claims') }} c\nJOIN {{ ref('dim_date') }} d ON c.claim_date = d.full_date\n```\n\nKarena menggunakan fungsi `ref()`, dbt otomatis membangun dependency graph: `stg_claims` dan `dim_date` → `fact_claims`. Menjalankan `dbt docs generate` menghasilkan visualisasi lineage lengkap yang bisa diklik untuk melihat setiap langkah transformasi, dan `dbt run --select +fact_claims` bisa menjawab 'model apa saja yang perlu dijalankan lebih dulu untuk menghasilkan fact_claims ini?'",
      en: "Using dbt, which natively builds lineage from SQL models:\n\n```sql\n-- models/marts/fact_claims.sql\nSELECT\n  c.claim_id,\n  c.claim_amount,\n  d.date_sk\nFROM {{ ref('stg_claims') }} c\nJOIN {{ ref('dim_date') }} d ON c.claim_date = d.full_date\n```\n\nBecause it uses the `ref()` function, dbt automatically builds a dependency graph: `stg_claims` and `dim_date` → `fact_claims`. Running `dbt docs generate` produces a full clickable lineage visualization showing every transformation step, and `dbt run --select +fact_claims` can answer 'which models need to run first to produce this fact_claims?'",
    },
    exampleEnterprise: {
      id: "Tim data di Fintech Cepat menemukan angka `total_transaction_value` di dashboard eksekutif tiba-tiba turun drastis. Dengan lineage graph di Google Dataplex, mereka melacak mundur dalam hitungan menit: dashboard ← mart layer ← staging layer ← raw ingestion, dan menemukan bahwa job ingestion dari salah satu partner pembayaran gagal sejak dua hari lalu. Tanpa lineage, tim harus membaca kode setiap job satu per satu — proses yang sebelumnya memakan waktu satu hari penuh.",
      en: "Fintech Cepat's data team notices the `total_transaction_value` figure on the executive dashboard has suddenly dropped sharply. Using the lineage graph in Google Dataplex, they trace backward within minutes: dashboard ← mart layer ← staging layer ← raw ingestion, and find that the ingestion job from one payment partner had been failing for two days. Without lineage, the team would have to read every job's code one by one — a process that previously took a full day.",
    },
    prosAndCons: {
      pros: {
        id: "- Debugging jauh lebih cepat karena akar masalah bisa dilacak langsung ke sumbernya\n- Impact analysis sebelum perubahan skema mencegah pipeline downstream rusak tanpa peringatan\n- Dokumentasi pipeline yang selalu akurat karena dibangun otomatis dari kode\n- Meningkatkan kepercayaan pengguna dashboard terhadap angka yang mereka lihat",
        en: "- Debugging is far faster since the root cause can be traced directly to its source\n- Impact analysis before schema changes prevents downstream pipelines from breaking without warning\n- Pipeline documentation stays accurate since it's built automatically from code\n- Increases dashboard users' trust in the numbers they see",
      },
      cons: {
        id: "- Lineage berbasis parsing SQL statis bisa gagal menangkap logika yang ditulis di kode aplikasi (bukan SQL)\n- Instrumentasi runtime (OpenLineage) butuh integrasi tambahan di setiap tool pipeline yang dipakai\n- Graph lineage yang sangat besar bisa sulit divisualisasikan secara berguna tanpa fitur filter/zoom yang baik\n- Butuh maintenance berkelanjutan agar tetap akurat saat tooling data berubah",
        en: "- Static SQL-parsing-based lineage can fail to capture logic written in application code (not SQL)\n- Runtime instrumentation (OpenLineage) requires extra integration in every pipeline tool used\n- Very large lineage graphs can be hard to visualize usefully without good filter/zoom features\n- Requires ongoing maintenance to stay accurate as the data tooling changes",
      },
    },
  },
};
