export const term = {
  id: "caching",
  track: "data-engineering",
  category: "Performa",
  color: "#ef4444",
  icon: "M2 2h20v8H2zM2 14h20v8H2zM6 6h.01M6 18h.01",
  simulation: "caching",
  tools: ["Redis", "Memcached", "BigQuery BI Engine", "CloudFlare CDN", "Varnish"],
  prerequisites: [],
  related: ["materialized-view", "cdc"],
  name: { id: "Caching Layers", en: "Caching Layers" },
  content: {
    description: {
      id: "Caching adalah teknik menyimpan hasil komputasi atau query yang mahal di storage yang jauh lebih cepat diakses, sehingga permintaan berikutnya untuk data yang sama tidak perlu menghitung ulang dari awal. Dalam sistem data modern, caching sering diterapkan berlapis — dari cache di level aplikasi, Redis sebagai cache terpusat, sampai fitur cache bawaan data warehouse seperti BigQuery BI Engine — masing-masing menyeimbangkan trade-off antara kecepatan, kapasitas, dan biaya. Caching adalah salah satu teknik optimasi performa dengan dampak terbesar untuk effort implementasi yang relatif kecil.",
      en: "Caching is a technique for storing the result of an expensive computation or query in a much faster-to-access storage layer, so subsequent requests for the same data don't need to recompute from scratch. In modern data systems, caching is often applied in layers — from application-level caches, to Redis as a centralized cache, to a data warehouse's built-in cache feature like BigQuery BI Engine — each balancing the trade-off between speed, capacity, and cost. Caching is one of the highest-impact performance optimization techniques relative to its implementation effort.",
    },
    concept: {
      id: "Bayangkan caching seperti dapur restoran yang menyiapkan stok kaldu di awal hari, bukan memasak kaldu dari nol setiap kali ada pesanan sup. Membuat kaldu butuh waktu berjam-jam (setara query berat ke database), tapi begitu sudah jadi dan disimpan hangat di panci (cache), setiap pesanan sup berikutnya tinggal diambil dari panci itu dalam hitungan detik. Kalau kaldu di panci habis atau sudah terlalu lama (TTL kedaluwarsa), barulah dapur masak batch baru.",
      en: "Think of caching like a restaurant kitchen that prepares a batch of stock at the start of the day, instead of cooking stock from scratch for every soup order. Making stock takes hours (equivalent to a heavy database query), but once it's made and kept warm in a pot (the cache), every subsequent soup order is served from that pot within seconds. Once the pot runs low or the stock has sat too long (TTL expires), the kitchen cooks a fresh batch.",
    },
    methodology: {
      id: "Pola paling umum adalah cache-aside: aplikasi mengecek cache terlebih dahulu, jika ada (cache hit) langsung dikembalikan, jika tidak ada (cache miss) aplikasi mengambil data dari database, menyimpannya ke cache, baru mengembalikan ke pengguna. Pola lain adalah write-through, di mana setiap penulisan data langsung ditulis ke cache dan database secara bersamaan supaya cache tidak pernah stale. Setiap entry cache biasanya punya TTL (Time To Live) — waktu maksimal sebelum data dianggap kedaluwarsa dan harus diambil ulang dari sumber. Alurnya: Request → Check Cache → HIT: return cached | MISS: query DB → Store in cache → Return → Next req hits cache.",
      en: "The most common pattern is cache-aside: the application checks the cache first — if found (cache hit) it's returned immediately, if not (cache miss) the application fetches from the database, stores it in the cache, then returns it to the user. Another pattern is write-through, where every write goes to both the cache and the database simultaneously so the cache never goes stale. Every cache entry usually has a TTL (Time To Live) — the maximum time before data is considered expired and must be re-fetched from the source. The flow: Request → Check Cache → HIT: return cached | MISS: query DB → Store in cache → Return → Next req hits cache.",
    },
    objective: {
      id: "Banyak query analitik atau perhitungan bisnis melibatkan agregasi berat atas jutaan baris data yang bisa memakan waktu ratusan milidetik hingga beberapa detik, padahal hasilnya sering diminta berulang-ulang oleh banyak pengguna dalam rentang waktu singkat (misalnya seribu orang membuka dashboard yang sama). Tanpa cache, database sumber akan menerima beban query identik berulang kali secara sia-sia. Caching menyelesaikan ini dengan menghitung sekali, lalu menyajikan hasil yang sama berkali-kali dari storage yang jauh lebih cepat dan murah untuk diakses.",
      en: "Many analytical queries or business calculations involve heavy aggregation over millions of rows that can take hundreds of milliseconds to several seconds, yet the result is often requested repeatedly by many users within a short window (e.g. a thousand people opening the same dashboard). Without a cache, the source database would receive identical query load repeatedly and wastefully. Caching solves this by computing once, then serving the same result many times from storage that's far faster and cheaper to access.",
    },
    goal: {
      id: "Hasil yang dicapai adalah response time yang turun dari ratusan milidetik menjadi hitungan milidetik tunggal untuk data yang sudah di-cache, beban ke database sumber yang berkurang drastis meski jumlah pengguna meningkat, dan biaya komputasi yang lebih rendah karena query mahal hanya dijalankan sekali per periode TTL, bukan sekali per request.",
      en: "The outcome is response time dropping from hundreds of milliseconds to single-digit milliseconds for cached data, drastically reduced load on the source database even as user count grows, and lower compute cost since the expensive query only runs once per TTL period, not once per request.",
    },
    exampleImplementation: {
      id: "Implementasi cache-aside dengan Redis di depan sebuah endpoint dashboard:\n\n```python\nimport redis, json\n\nr = redis.Redis()\n\ndef get_dashboard_summary():\n    cache_key = \"dashboard:summary\"\n    cached = r.get(cache_key)\n    if cached:\n        return json.loads(cached)  # cache HIT — return in ~2ms\n\n    # cache MISS — query the expensive aggregation\n    result = run_bigquery_aggregation()\n    r.setex(cache_key, 300, json.dumps(result))  # TTL 5 minutes\n    return result\n```\n\nDengan TTL 5 menit, seribu pengguna yang membuka dashboard yang sama dalam rentang itu hanya memicu satu query mahal ke BigQuery — sisanya dilayani langsung dari Redis.",
      en: "A cache-aside implementation with Redis in front of a dashboard endpoint:\n\n```python\nimport redis, json\n\nr = redis.Redis()\n\ndef get_dashboard_summary():\n    cache_key = \"dashboard:summary\"\n    cached = r.get(cache_key)\n    if cached:\n        return json.loads(cached)  # cache HIT — return in ~2ms\n\n    # cache MISS — query the expensive aggregation\n    result = run_bigquery_aggregation()\n    r.setex(cache_key, 300, json.dumps(result))  # TTL 5 minutes\n    return result\n```\n\nWith a 5-minute TTL, a thousand users opening the same dashboard within that window trigger only one expensive query to BigQuery — the rest are served directly from Redis.",
    },
    exampleEnterprise: {
      id: "Fintech Cepat menyajikan dashboard 'ringkasan transaksi harian' kepada seribu cabang setiap pagi. Query aslinya butuh 4 detik karena mengagregasi jutaan baris transaksi. Dengan menaruh Redis di depan endpoint dashboard dengan TTL 5 menit, hanya query pertama dalam setiap window 5 menit yang benar-benar menyentuh BigQuery — 999 permintaan berikutnya dilayani dari cache dalam waktu kurang dari 5 milidetik, membuat biaya query BigQuery mereka turun lebih dari 90%.",
      en: "Fintech Cepat serves a 'daily transaction summary' dashboard to a thousand branches every morning. The original query took 4 seconds because it aggregates millions of transaction rows. By putting Redis in front of the dashboard endpoint with a 5-minute TTL, only the first query in each 5-minute window actually hits BigQuery — the next 999 requests are served from cache in under 5 milliseconds, cutting their BigQuery query costs by more than 90%.",
    },
    prosAndCons: {
      pros: {
        id: "- Response time turun drastis, dari ratusan milidetik menjadi hitungan milidetik tunggal\n- Mengurangi beban dan biaya ke database/warehouse sumber secara signifikan\n- Implementasi relatif sederhana (cache-aside) untuk dampak performa yang besar\n- Bisa diterapkan berlapis (aplikasi, Redis, warehouse built-in) sesuai kebutuhan",
        en: "- Response time drops drastically, from hundreds of milliseconds to single-digit milliseconds\n- Significantly reduces load and cost on the source database/warehouse\n- Relatively simple to implement (cache-aside) for a large performance payoff\n- Can be applied in layers (application, Redis, warehouse built-in) as needed",
      },
      cons: {
        id: "- Data yang disajikan bisa stale (tidak real-time) selama masih dalam periode TTL\n- Menambah komponen infrastruktur baru (Redis/Memcached) yang perlu dikelola dan dipantau\n- Cache invalidation yang salah bisa menyajikan data usang tanpa disadari — masalah klasik yang terkenal sulit\n- Cold cache (setelah restart) bisa menyebabkan lonjakan beban mendadak ke database sumber",
        en: "- Data served can be stale (not real-time) for the duration of the TTL window\n- Adds a new infrastructure component (Redis/Memcached) that needs managing and monitoring\n- Incorrect cache invalidation can silently serve stale data — a classic, notoriously hard problem\n- A cold cache (after a restart) can cause a sudden load spike on the source database",
      },
    },
  },
};
