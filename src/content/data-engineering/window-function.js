export const term = {
  id: "window-function",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#a5f3fc",
  icon: "M3 3h18v18H3z",
  simulation: "window",
  tools: ["PostgreSQL", "BigQuery", "Snowflake", "MySQL 8+", "DuckDB"],
  prerequisites: [],
  related: ["cte", "recursive-cte"],
  name: { id: "Window Function", en: "Window Function" },
  content: {
    description: {
      id: "Window function adalah fungsi analitik SQL yang melakukan perhitungan pada sekumpulan baris yang saling berkaitan (disebut 'window'), tapi tanpa menyatukan (collapse) baris-baris tersebut menjadi satu hasil seperti yang dilakukan `GROUP BY`. Setiap baris asli tetap muncul di hasil, dengan tambahan kolom hasil perhitungan window di sampingnya. Ini membuka kemampuan yang sangat sulit atau bahkan mustahil dilakukan dengan SQL biasa, seperti membuat ranking per kelompok, menghitung running total, atau membandingkan nilai baris ini dengan baris sebelumnya — semuanya dalam satu query tanpa subquery berlapis.",
      en: "A window function is a SQL analytic function that performs calculations across a set of related rows (called a 'window'), but without collapsing those rows into one result like `GROUP BY` does. Every original row still appears in the result, with an extra column for the window calculation's result next to it. This unlocks capabilities that are very hard or even impossible with plain SQL, like ranking within groups, computing running totals, or comparing a row's value to the previous row — all in a single query without nested subqueries.",
    },
    concept: {
      id: "Bayangkan window function seperti seorang juri lomba lari yang mengumumkan peringkat setiap pelari tanpa menghilangkan identitas pelari itu sendiri. `GROUP BY` seperti mengumumkan 'rata-rata waktu semua pelari adalah 12 menit' — informasi individu hilang, hanya tersisa satu angka ringkasan. Window function seperti mengumumkan 'Budi finish di posisi 3 dari 20 pelari dalam kategorinya' — Budi tetap muncul sebagai individu, tapi sekarang dia punya informasi tambahan (peringkat) tentang posisinya relatif terhadap pelari lain di sekitarnya.",
      en: "Think of a window function like a race referee announcing each runner's rank without erasing the runner's own identity. `GROUP BY` is like announcing 'the average time of all runners is 12 minutes' — individual information is lost, leaving only one summary number. A window function is like announcing 'Budi finished in 3rd place out of 20 runners in his category' — Budi still appears as an individual, but now he has extra information (his rank) about his position relative to the other runners around him.",
    },
    methodology: {
      id: "Window function didefinisikan menggunakan klausa `OVER()`, yang bisa berisi `PARTITION BY` (mengelompokkan baris ke dalam window-window terpisah, mirip GROUP BY tapi tanpa collapse), `ORDER BY` (menentukan urutan baris di dalam tiap window, penting untuk fungsi seperti ranking atau lag/lead), dan opsional `ROWS`/`RANGE` (mendefinisikan batas window secara lebih presisi, misalnya 'hanya 3 baris sebelumnya'). Fungsi seperti `ROW_NUMBER()`, `RANK()`, `SUM() OVER()` dievaluasi untuk tiap baris berdasarkan window yang relevan dengan baris tersebut. Alurnya: Define window OVER() → For each row: apply function over window → Return value alongside original row (no collapse).",
      en: "A window function is defined using the `OVER()` clause, which can contain `PARTITION BY` (grouping rows into separate windows, similar to GROUP BY but without collapsing), `ORDER BY` (determining row order within each window, important for functions like ranking or lag/lead), and optionally `ROWS`/`RANGE` (defining the window boundary more precisely, e.g. 'only the previous 3 rows'). Functions like `ROW_NUMBER()`, `RANK()`, `SUM() OVER()` are evaluated for each row based on the window relevant to that row. The flow: Define window OVER() → For each row: apply function over window → Return value alongside original row (no collapse).",
    },
    objective: {
      id: "Sebelum window function tersedia luas, kebutuhan seperti 'tampilkan ranking tiap produk dalam kategorinya, tapi tetap tampilkan semua detail produk' harus diselesaikan dengan subquery berlapis atau self-join yang rumit, lambat, dan sulit dibaca. Window function menyelesaikan ini dengan menyediakan cara native dan efisien di dalam SQL untuk melakukan perhitungan analitik per baris relatif terhadap kelompoknya, tanpa kehilangan detail baris individual.",
      en: "Before window functions became widely available, needs like 'show each product's rank within its category, but still show all product details' had to be solved with nested subqueries or complex, slow, hard-to-read self-joins. Window functions solve this by providing a native, efficient way within SQL to perform per-row analytic calculations relative to a group, without losing individual row detail.",
    },
    goal: {
      id: "Hasil yang dicapai adalah query analitik yang jauh lebih ringkas dan mudah dibaca dibanding subquery berlapis, performa yang lebih baik karena database bisa mengoptimalkan eksekusi window function secara native, dan kemampuan menjawab pertanyaan bisnis kompleks (top-N per kategori, running total, perbandingan periode-ke-periode) dalam satu query SQL tunggal.",
      en: "The outcome is analytical queries that are far more concise and readable than nested subqueries, better performance since the database can natively optimize window function execution, and the ability to answer complex business questions (top-N per category, running totals, period-over-period comparisons) in a single SQL query.",
    },
    exampleImplementation: {
      id: "Menemukan klaim terbaru per pasien tanpa kehilangan detail baris lain:\n\n```sql\nSELECT\n  patient_id,\n  claim_date,\n  claim_amount,\n  ROW_NUMBER() OVER (\n    PARTITION BY patient_id\n    ORDER BY claim_date DESC\n  ) AS rn\nFROM claims;\n\n-- Ambil hanya klaim terbaru per pasien:\nSELECT * FROM (\n  SELECT *, ROW_NUMBER() OVER (PARTITION BY patient_id ORDER BY claim_date DESC) AS rn\n  FROM claims\n) t\nWHERE rn = 1;\n\n-- Running total pengeluaran klaim per bulan:\nSELECT\n  month,\n  monthly_total,\n  SUM(monthly_total) OVER (ORDER BY month) AS running_total\nFROM monthly_claims;\n```",
      en: "Finding each patient's latest claim without losing other row details:\n\n```sql\nSELECT\n  patient_id,\n  claim_date,\n  claim_amount,\n  ROW_NUMBER() OVER (\n    PARTITION BY patient_id\n    ORDER BY claim_date DESC\n  ) AS rn\nFROM claims;\n\n-- Get only the latest claim per patient:\nSELECT * FROM (\n  SELECT *, ROW_NUMBER() OVER (PARTITION BY patient_id ORDER BY claim_date DESC) AS rn\n  FROM claims\n) t\nWHERE rn = 1;\n\n-- Running total of monthly claim spend:\nSELECT\n  month,\n  monthly_total,\n  SUM(monthly_total) OVER (ORDER BY month) AS running_total\nFROM monthly_claims;\n```",
    },
    exampleEnterprise: {
      id: "Tim analytics PT Nusantara Asuransi perlu tahu status klaim terbaru dari setiap pasien untuk dashboard operasional, dari tabel `claims` yang punya jutaan baris riwayat klaim historis. Alih-alih menulis subquery berlapis yang lambat, mereka menggunakan `ROW_NUMBER() OVER (PARTITION BY patient_id ORDER BY claim_date DESC)` untuk mendapatkan satu baris terbaru per pasien dalam satu query yang berjalan dalam hitungan detik, bukan menit.",
      en: "PT Nusantara Asuransi's analytics team needs to know each patient's latest claim status for an operational dashboard, from a `claims` table with millions of rows of historical claims. Instead of writing slow nested subqueries, they use `ROW_NUMBER() OVER (PARTITION BY patient_id ORDER BY claim_date DESC)` to get one latest row per patient in a single query that runs in seconds, not minutes.",
    },
    prosAndCons: {
      pros: {
        id: "- Query jauh lebih ringkas dan mudah dibaca dibanding subquery berlapis atau self-join\n- Performa lebih baik karena database mengoptimalkan eksekusi window function secara native\n- Mempertahankan detail baris individual sambil tetap memberi konteks agregat/ranking\n- Mendukung berbagai use case analitik: ranking, running total, lag/lead, moving average",
        en: "- Queries are far more concise and readable than nested subqueries or self-joins\n- Better performance since the database natively optimizes window function execution\n- Preserves individual row detail while still providing aggregate/ranking context\n- Supports many analytic use cases: ranking, running totals, lag/lead, moving averages",
      },
      cons: {
        id: "- Sintaksnya butuh waktu untuk dipahami oleh yang baru belajar SQL\n- Bisa mahal secara komputasi pada dataset sangat besar tanpa indexing/partitioning yang tepat\n- Kurang didukung atau punya perilaku sedikit berbeda antar dialek SQL yang lebih lama\n- Mudah salah menempatkan `WHERE` vs filter setelah window function (window function tidak bisa langsung difilter dengan WHERE)",
        en: "- The syntax takes time to grasp for those new to SQL\n- Can be computationally expensive on very large datasets without proper indexing/partitioning\n- Less supported or behaves slightly differently across older SQL dialects\n- Easy to misplace `WHERE` vs. filtering after a window function (a window function result can't be filtered directly with WHERE)",
      },
    },
  },
};
