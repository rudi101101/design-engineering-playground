export default {
  id: 'caching-layers',
  track: 'data-engineering',
  category: 'Performa',
  color: '#22c55e',
  icon: 'M2 2h20v8H2zM2 14h20v8H2zM6 6h.01M6 18h.01',
  simulation: 'caching',
  tools: ['Redis', 'CloudFlare CDN', 'Memcached', 'Varnish'],
  prerequisites: [],
  related: [],
  name: {
    id: 'Lapisan Cache (Caching Layers)',
    en: 'Caching Layers',
  },
  content: {
    description: {
      id: 'Caching layer adalah lapisan penyimpanan sementara yang diletakkan di antara pengguna dan sumber data utama (database), bertujuan menyimpan salinan data yang sering diakses supaya request berikutnya tidak perlu menempuh seluruh jalur menuju database. Dalam praktiknya, caching diterapkan berlapis-lapis: mulai dari cache di sisi browser pengguna, cache di edge/CDN yang tersebar secara geografis, hingga cache di server (misalnya Redis) yang berada dekat dengan aplikasi. Setiap lapisan punya karakteristik latency dan kapasitas berbeda.',
      en: "A caching layer is a temporary storage layer placed between the user and the primary data source (the database), designed to hold copies of frequently accessed data so subsequent requests don't need to travel the full path to the database. In practice, caching is applied in multiple tiers: from a cache on the user's browser, to a geographically distributed edge/CDN cache, to a server-side cache (e.g. Redis) sitting close to the application. Each layer has different latency and capacity characteristics.",
    },
    concept: {
      id: 'Bayangkan kamu tinggal di sebuah rumah. Barang yang paling sering kamu pakai — kunci, dompet, HP — kamu taruh di meja dekat pintu (cache paling dekat, paling cepat diambil). Barang yang agak jarang dipakai kamu taruh di lemari kamar. Kalau ternyata barangnya gak ada di kedua tempat itu, baru kamu ke toko (ini "database" — sumber kebenaran, tapi paling jauh dan paling lama dicapai). Begitu kamu beli dari toko, barang itu kamu taruh juga di meja dekat pintu, supaya lain kali gak perlu ke toko lagi.',
      en: "Imagine you live in a house. The things you use most often — keys, wallet, phone — you keep on a table by the door (the closest, fastest cache). Things you use less often go in a closet in your room. If it turns out the item isn't in either place, you go to the store (this is the \"database\" — the source of truth, but the farthest and slowest to reach). Once you buy it from the store, you also place it on the table by the door, so next time you don't need to go to the store again.",
    },
    methodology: {
      id: 'Request dicek berurutan dari layer paling cepat ke paling lambat: browser cache dulu, lalu CDN, lalu server cache (Redis). Kalau ditemukan di satu layer (cache hit), request langsung dijawab dari situ tanpa lanjut ke layer berikutnya. Kalau tidak ditemukan di semua layer (cache miss), barulah request diteruskan ke database, dan hasilnya disalin balik ke tiap layer cache yang dilewati tadi.',
      en: 'A request is checked sequentially from the fastest layer to the slowest: browser cache first, then CDN, then server cache (Redis). If found in any layer (a cache hit), the request is answered immediately from there without continuing further. If not found in any layer (a cache miss), the request is finally forwarded to the database, and the result is copied back into each cache layer it passed through.',
    },
    objective: {
      id: 'Database tidak sanggup menangani ribuan atau jutaan permintaan baca secara langsung — tiap permintaan yang benar-benar sampai ke database itu mahal (I/O, lock contention, latency tinggi). Caching dibutuhkan supaya sebagian besar traffic baca bisa diselesaikan sebelum menyentuh database sama sekali.',
      en: "A database can't directly handle thousands or millions of read requests — every request that actually reaches the database is expensive (I/O, lock contention, high latency). Caching exists so that most read traffic can be resolved before ever touching the database.",
    },
    goal: {
      id: 'Dari 1.000 permintaan baca, hanya segelintir (misalnya 3) yang benar-benar sampai ke database, sisanya terjawab di layer cache terdekat dengan latency mendekati 0ms, sehingga database tetap ringan walau traffic-nya tinggi.',
      en: 'Out of 1,000 read requests, only a handful (say, 3) actually reach the database — the rest are answered at the nearest cache layer with latency close to 0ms, keeping the database lightly loaded even under high traffic.',
    },
    exampleImplementation: {
      id: 'Cache diterapkan berlapis, dari yang paling dekat ke pengguna:\n\n1. **Browser** — diatur lewat response header:\n```\nCache-Control: max-age=3600\n```\n2. **CDN** — TTL edge cache diset lewat page rule provider (mis. Cloudflare).\n3. **Redis** — server-side cache dengan expiry otomatis:\n```\nSETEX user:42 3600 "<data>"\n```',
      en: 'Cache is applied in layers, from closest to the user:\n\n1. **Browser** — set via a response header:\n```\nCache-Control: max-age=3600\n```\n2. **CDN** — edge cache TTL set via the provider\'s page rules (e.g. Cloudflare).\n3. **Redis** — server-side cache with automatic expiry:\n```\nSETEX user:42 3600 "<data>"\n```',
    },
    exampleEnterprise: {
      id: 'Sebuah platform e-commerce menyimpan data profil produk yang sering dilihat di Redis dengan expiry 1 jam. Saat traffic melonjak pas flash sale, 97% permintaan lihat produk terjawab dari Redis, dan database utama tetap stabil melayani transaksi checkout yang jauh lebih kritikal.',
      en: 'An e-commerce platform stores frequently-viewed product profile data in Redis with a 1-hour expiry. During a flash-sale traffic spike, 97% of product-view requests are answered from Redis, keeping the primary database stable enough to serve the far more critical checkout transactions.',
    },
    prosAndCons: {
      pros: {
        id: '- Mengurangi beban database secara drastis untuk data yang sering diakses\n- Latency baca jadi jauh lebih rendah buat pengguna\n- Bisa diterapkan bertahap per layer tanpa mengubah database',
        en: "- Drastically reduces database load for frequently accessed data\n- Much lower read latency for users\n- Can be adopted incrementally, layer by layer, without changing the database",
      },
      cons: {
        id: '- Data di cache bisa basi kalau sumber datanya berubah tapi cache belum expire\n- Menambah kompleksitas: perlu strategi invalidation yang jelas\n- Butuh infrastruktur & monitoring tambahan (Redis, CDN, dst)',
        en: '- Cached data can go stale if the source changes before the cache expires\n- Adds complexity: requires a clear invalidation strategy\n- Requires additional infrastructure and monitoring (Redis, CDN, etc.)',
      },
    },
  },
};
