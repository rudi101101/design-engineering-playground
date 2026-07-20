export const term = {
  id: "master-data-management",
  track: "data-engineering",
  category: "Governance",
  color: "#22c55e",
  icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z",
  simulation: "mdm",
  tools: [
    "Informatica MDM",
    "Reltio",
    "Semarchy",
    "Stibo Systems",
    "Talend MDM",
  ],
  prerequisites: [],
  related: ["data-stewardship", "data-quality"],
  name: { id: "Master Data Management (MDM)", en: "Master Data Management (MDM)" },
  content: {
    description: {
      id: "Master Data Management adalah disiplin dan sekumpulan proses untuk menciptakan satu sumber kebenaran (single source of truth) bagi entitas inti bisnis yang dipakai berulang di banyak sistem — seperti customer, product, vendor, atau employee. Di organisasi besar dengan banyak sistem operasional, entitas yang sama sering tercatat berbeda-beda di tiap sistem: nama pelanggan yang sama bisa punya ejaan berbeda, alamat yang beda-beda versi, atau bahkan ID yang tidak saling terhubung. MDM hadir untuk menyatukan representasi ini menjadi satu 'golden record' yang konsisten dan didistribusikan kembali ke semua sistem yang membutuhkannya.",
      en: "",
    },
    concept: {
      id: "Bayangkan sebuah keluarga besar di mana setiap anggota memanggil satu orang yang sama dengan nama panggilan berbeda-beda — 'Budi', 'Pak Budi', 'Kak Bud', 'B. Santoso' — sehingga ketika mereka membicarakan orang ini di grup keluarga besar, sering terjadi kebingungan apakah yang dimaksud orang yang sama atau bukan. MDM adalah proses menyepakati satu 'nama resmi' untuk orang itu, mencatatnya di satu tempat otoritatif, lalu memastikan semua anggota keluarga memakai nama resmi itu saat merujuk padanya, sambil tetap mengizinkan panggilan sayang di percakapan sehari-hari.",
      en: "",
    },
    methodology: {
      id: "MDM bekerja lewat proses entity resolution & matching — algoritma membandingkan record dari berbagai sumber untuk mendeteksi apakah dua entri sebenarnya merujuk pada entitas yang sama, misalnya dengan mencocokkan kombinasi nama, tanggal lahir, dan nomor identitas meski ejaannya sedikit berbeda. Setelah kecocokan ditemukan, sistem melakukan deduplication untuk menggabungkan record yang duplikat. Hasil penggabungan ini menjadi golden record — versi tunggal yang dianggap paling akurat dan lengkap dari entitas tersebut, biasanya dengan key identitas yang jelas (misalnya NIK sebagai master key). Golden record ini kemudian didistribusikan kembali ke semua sistem downstream sehingga setiap aplikasi merujuk ke definisi customer atau product yang sama, alih-alih menyimpan versi lokal masing-masing yang bisa saling bertentangan.",
      en: "",
    },
    objective: {
      id: "Tanpa MDM, organisasi dengan banyak lini bisnis atau sistem legacy akan mengalami duplikasi dan inkonsistensi data entitas inti — pelanggan yang sama dihitung sebagai dua orang berbeda di laporan agregat, atau produk yang sama punya deskripsi berbeda di tiap sistem penjualan. Ini merusak akurasi pelaporan, menyulitkan analisis lintas unit bisnis, dan berpotensi menimbulkan pengalaman pelanggan yang buruk (misalnya pelanggan menerima penawaran ganda karena dianggap dua orang berbeda). MDM ada untuk menjamin bahwa 'siapa pelanggan ini' punya satu jawaban yang sama di seluruh organisasi.",
      en: "",
    },
    goal: {
      id: "Seluruh sistem di organisasi merujuk ke golden record yang sama untuk entitas master seperti customer dan product, sehingga laporan lintas unit bisnis bisa diagregasi tanpa duplikasi, dan perubahan pada satu atribut master (misalnya alamat pelanggan) otomatis terpropagasi konsisten ke semua sistem yang membutuhkannya.",
      en: "",
    },
    exampleImplementation: {
      id: "Alur kerja MDM tipikal untuk entitas customer:\n\n1. **Multi-source ingestion** — data customer dikumpulkan dari sistem CRM, sistem billing, dan aplikasi mobile.\n2. **Entity matching & dedup** — algoritma fuzzy matching mencocokkan record berdasarkan kombinasi nama, nomor telepon, dan NIK.\n3. **Create golden record** — record yang cocok digabung, mengambil nilai paling lengkap/terbaru per atribut.\n4. **Distribute** — golden record dipublikasikan kembali ke semua sistem downstream lewat API atau event streaming.\n\nContoh aturan matching sederhana yang sering jadi dasar logika entity resolution:\n\n```sql\nSELECT a.customer_id AS source_a, b.customer_id AS source_b\nFROM crm_customers a\nJOIN billing_customers b\n  ON a.national_id = b.national_id\n  AND SIMILARITY(a.full_name, b.full_name) > 0.85\nWHERE a.national_id IS NOT NULL;\n```\n\nPasangan yang cocok lewat query ini menjadi kandidat untuk digabung menjadi satu golden record di sistem MDM.",
      en: "",
    },
    exampleEnterprise: {
      id: "Nusantara Grup, konglomerasi dengan beberapa anak usaha di bidang otomotif, pembiayaan, dan asuransi, menerapkan MDM untuk menyatukan definisi 'customer' di seluruh grup dengan NIK sebagai master key. Sebelumnya, satu individu yang membeli kendaraan lewat unit otomotif, mengambil pembiayaan lewat unit finance, dan membeli polis lewat unit asuransi tercatat sebagai tiga pelanggan berbeda di tiga sistem berbeda. Setelah MDM diterapkan, ketiga unit bisnis tersebut merujuk ke golden record yang sama, sehingga tim manajemen bisa melihat total nilai pelanggan (customer lifetime value) lintas seluruh grup secara akurat, dan tim pemasaran tidak lagi mengirim penawaran duplikat kepada orang yang sama.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Menghilangkan duplikasi dan inkonsistensi data entitas inti lintas sistem\n- Memungkinkan analisis dan pelaporan agregat yang akurat lintas unit bisnis\n- Meningkatkan kualitas pengalaman pelanggan karena setiap sistem punya pemahaman yang sama tentang siapa pelanggan tersebut\n- Menjadi fondasi untuk inisiatif data governance dan compliance yang butuh definisi entitas yang jelas",
        en: "",
      },
      cons: {
        id: "- Entity resolution tidak pernah 100% akurat — selalu ada risiko false match (dua orang berbeda digabung jadi satu) atau false non-match\n- Implementasi awal mahal dan memakan waktu, terutama saat menyatukan data dari sistem legacy yang berantakan\n- Butuh proses governance berkelanjutan untuk menentukan aturan penggabungan dan menyelesaikan konflik data\n- Perubahan pada golden record perlu strategi distribusi yang matang agar tidak menimbulkan masalah sinkronisasi di sistem downstream",
        en: "",
      },
    },
  },
};
