export const term = {
  id: "semantic-layer",
  track: "data-engineering",
  category: "Modeling",
  color: "#a855f7",
  icon: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z",
  simulation: "semantic",
  tools: ["dbt Semantic Layer", "Cube.js", "LookML", "AtScale", "Metriql"],
  prerequisites: [],
  related: ["star-schema"],
  name: { id: "Semantic Layer", en: "Semantic Layer" },
  content: {
    description: {
      id: "Semantic Layer adalah lapisan abstraksi yang diletakkan di antara data fisik di warehouse dan pengguna bisnis yang mengonsumsinya, di mana metrik dan logika bisnis didefinisikan satu kali secara terpusat lalu dipakai konsisten di berbagai tools BI, spreadsheet, maupun kode analitik. Tanpa lapisan ini, setiap tim atau tools cenderung mendefinisikan ulang metrik yang sama secara berbeda-beda — misalnya 'Revenue' dihitung berbeda antara dashboard Looker, laporan Excel finance, dan notebook data scientist — yang berujung pada angka yang saling bertentangan meski merujuk pada nama metrik yang sama.",
      en: "",
    },
    concept: {
      id: "Bayangkan sebuah perusahaan dengan banyak cabang yang masing-masing punya cara sendiri menghitung 'penjualan bersih' — cabang A memasukkan diskon, cabang B tidak, cabang C menghitungnya sebelum retur. Semantic Layer seperti menerbitkan satu buku pedoman resmi pusat yang mendefinisikan persis bagaimana 'penjualan bersih' dihitung, lalu setiap cabang, laporan, dan sistem wajib merujuk ke buku pedoman itu — bukan menghitung sendiri-sendiri dengan asumsi masing-masing. Begitu definisi berubah, cukup ubah satu buku pedoman itu, dan seluruh laporan yang merujuk ke sana otomatis konsisten.",
      en: "",
    },
    methodology: {
      id: "Data mentah yang sudah ditransformasi (biasanya lewat dbt) dijadikan input bagi semantic layer, di mana metrik didefinisikan secara deklaratif — misalnya 'Revenue' = SUM(amount) WHERE status = 'settled'. Definisi ini disimpan satu kali di semantic layer, lalu diekspos lewat API standar yang bisa dikonsumsi oleh berbagai tools BI (Looker, Power BI), spreadsheet, maupun kode Python/notebook. Setiap kali sebuah tool meminta metrik 'Revenue', semantic layer yang menerjemahkannya menjadi query SQL yang konsisten terhadap warehouse, sehingga logika bisnis tidak pernah di-hardcode ulang secara terpisah di masing-masing tool.",
      en: "",
    },
    objective: {
      id: "Ketika logika bisnis (definisi metrik, filter, agregasi) tersebar dan diduplikasi di banyak dashboard dan query terpisah, setiap perubahan definisi bisnis harus diikuti perubahan manual di puluhan tempat berbeda — dan celah sinkronisasi ini yang menyebabkan angka metrik yang sama terlihat berbeda di laporan yang berbeda. Semantic layer ada untuk menjadikan definisi bisnis sebagai single source of truth yang terpusat, dipisahkan dari cara data itu ditampilkan.",
      en: "",
    },
    goal: {
      id: "Hasil konkretnya adalah konsistensi angka metrik lintas seluruh tools dan tim — begitu satu definisi metrik diubah di semantic layer, seluruh dashboard, laporan, dan query yang merujuk ke metrik itu otomatis ikut konsisten tanpa perlu mengubah satu-satu di setiap tempat.",
      en: "",
    },
    exampleImplementation: {
      id: "Contoh definisi metrik terpusat memakai dbt Semantic Layer (MetricFlow):\n\n```yaml\nmetrics:\n  - name: klaim_valid\n    label: Klaim Valid\n    type: simple\n    type_params:\n      measure: jumlah_klaim\n    filter: |\n      {{ Dimension('klaim__status') }} = 'settled'\n```\n\nDefinisi ini disimpan satu kali di repository dbt. Ketika Looker, Power BI, atau notebook Python meminta metrik 'klaim_valid' lewat API semantic layer, ketiganya mendapat hasil perhitungan yang identik — karena semuanya menerjemahkan permintaan ke query SQL yang sama persis di belakang layar.",
      en: "",
    },
    exampleEnterprise: {
      id: "Fintech Cepat mendefinisikan metrik klaim_valid satu kali di dbt Semantic Layer mereka — mencakup filter status settled dan pengecualian klaim yang masih dalam sengketa. Sebelumnya, dashboard Looker tim operasional, laporan Power BI tim finance, dan notebook Jupyter tim data science masing-masing punya definisi klaim_valid yang sedikit berbeda, menghasilkan angka yang tidak pernah cocok satu sama lain di rapat manajemen. Setelah semantic layer diterapkan, ketiga tools tersebut menarik definisi yang sama persis, dan perbedaan angka lintas laporan itu hilang.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Menjamin konsistensi definisi metrik di seluruh tools BI, spreadsheet, dan kode analitik tanpa duplikasi logika.\n- Perubahan definisi bisnis cukup dilakukan satu kali dan otomatis merambat ke semua konsumen metrik.\n- Memisahkan logika bisnis dari presentasi, sehingga business user tidak perlu memahami skema tabel mentah untuk memakai metrik yang benar.\n- Memudahkan governance metrik karena semua definisi terdokumentasi terpusat, bukan tersebar di banyak file query.",
        en: "",
      },
      cons: {
        id: "- Menambah satu lapisan infrastruktur baru yang perlu dikelola, dikonfigurasi, dan disinkronkan dengan perubahan skema warehouse.\n- Tools BI atau proses lama yang belum terintegrasi dengan semantic layer masih bisa mem-bypass-nya dan mendefinisikan metrik sendiri secara liar.\n- Kurva belajar bagi tim yang terbiasa menulis SQL langsung ke warehouse tanpa lapisan abstraksi tambahan.\n- Ketergantungan pada satu semantic layer terpusat berarti kesalahan definisi di sana berdampak luas ke seluruh laporan sekaligus.",
        en: "",
      },
    },
  },
};
