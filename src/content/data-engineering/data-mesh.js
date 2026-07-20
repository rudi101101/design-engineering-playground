export const term = {
  id: "data-mesh",
  track: "data-engineering",
  category: "Arsitektur",
  color: "#ec4899",
  icon: "M12 2L2 7l10 5 10-5-10-5M2 17l10 5 10-5M2 12l10 5 10-5",
  simulation: "mesh",
  tools: ["Dataplex", "Collibra", "DataHub", "Apache Atlas", "dbt"],
  prerequisites: ["data-catalog"],
  related: ["data-fabric"],
  name: { id: "Data Mesh", en: "Data Mesh" },
  content: {
    description: {
      id: `Data Mesh adalah paradigma organisasi sekaligus arsitektur yang mendesentralisasi kepemilikan data: setiap domain bisnis memiliki dan mengelola "data product"-nya sendiri, alih-alih menyerahkan semuanya ke satu tim data pusat yang akhirnya menjadi bottleneck bagi seluruh permintaan pipeline di perusahaan. Konsep ini lahir sebagai reaksi terhadap skala — semakin besar organisasi dengan semakin banyak domain bisnis, semakin sulit satu tim pusat memahami konteks dan menjaga kualitas seluruh data dari setiap domain.`,
      en: "",
    },
    concept: {
      id: `Bayangkan sebuah kota yang tadinya punya satu kantor pemerintahan pusat untuk mengurus semua izin (satu tim data pusat, semua orang antre di sana), lalu berubah menjadi tiap distrik punya kantor izinnya sendiri (domain team) yang mengurus izinnya masing-masing — tapi tetap mengikuti aturan kota yang sama (federated governance) supaya izin dari distrik manapun tetap saling kompatibel dan mudah ditemukan.`,
      en: "",
    },
    methodology: {
      id: `Data Mesh dibangun di atas empat prinsip: (1) Domain ownership — tim yang paling dekat dengan data adalah yang memilikinya, bukan tim pusat yang jauh dari konteks bisnis; (2) Data as a product — data domain diperlakukan seperti produk dengan SLA, dokumentasi, dan standar kualitas, bukan sekadar output sampingan; (3) Self-serve data platform — tim platform pusat menyediakan tooling dan infrastruktur generik agar tiap domain tidak perlu membangun pipeline dari nol; (4) Federated computational governance — standar bersama (penamaan, keamanan, interoperabilitas) tetap dijaga lintas domain lewat kebijakan yang disepakati bersama, bukan dikontrol terpusat penuh.`,
      en: "",
    },
    objective: {
      id: `Tujuan Data Mesh adalah mengatasi bottleneck dan hilangnya konteks yang terjadi ketika satu tim data pusat mencoba memahami dan membangun pipeline untuk setiap domain bisnis — padahal tim domain sendirilah yang paling memahami data mereka, sementara tim pusat sering kali harus menebak-nebak konteks bisnis yang bukan keahliannya.`,
      en: "",
    },
    goal: {
      id: `Hasil yang dicapai adalah percepatan time-to-insight karena tiap domain bisa mempublikasikan data product-nya sendiri tanpa mengantre giliran dari tim pusat, sambil tetap menjaga data tersebut dapat ditemukan dan diatur secara konsisten lintas organisasi lewat katalog bersama.`,
      en: "",
    },
    exampleImplementation: {
      id: `Alur: Domain Team → Build Data Product → Publish to Catalog → Consumer Domain.

1. Tim domain (misal tim finance) membangun data product-nya sendiri menggunakan dbt di atas data operasionalnya.
2. Data product tersebut didaftarkan ke katalog bersama lengkap dengan deskripsi, owner, dan SLA kualitas.
3. Domain lain (misal tim marketing) menemukan data product tersebut lewat katalog dan mengaksesnya secara self-serve tanpa perlu meminta tim pusat membangunkan pipeline baru.

\`\`\`yaml
# contoh metadata data product yang didaftarkan ke katalog
data_product:
  name: klaim_summary
  domain: finance
  owner: tim-finance-data@perusahaan.com
  sla: "refresh harian, kualitas > 99% completeness"
  access: self-serve via BigQuery
\`\`\``,
      en: "",
    },
    exampleEnterprise: {
      id: `Grup Meranti memiliki tiga unit bisnis — Meranti Motor, Meranti Finance, dan Meranti Digital — yang masing-masing punya domain data sendiri. Tiap unit mempublikasikan data product-nya ke shared Dataplex Catalog milik grup, sehingga tim lain bisa menemukan dan memakai data lintas unit bisnis tanpa harus meminta akses manual ke satu tim data pusat.`,
      en: "",
    },
    prosAndCons: {
      pros: {
        id: `- Skalabilitas lebih baik untuk organisasi besar dengan banyak domain bisnis yang berbeda konteks.
- Kualitas data lebih terjaga karena dikelola oleh tim yang paling memahami konteks bisnisnya.
- Mengurangi bottleneck tim data pusat yang sebelumnya harus menangani semua permintaan.
- Domain bisa iterasi lebih cepat tanpa menunggu antrean prioritas dari tim pusat.`,
        en: "",
      },
      cons: {
        id: `- Membutuhkan perubahan organisasi yang signifikan, bukan sekadar adopsi tooling baru.
- Risiko kualitas data tidak konsisten antar domain jika governance federated tidak dijalankan dengan disiplin.
- Butuh investasi awal yang besar untuk membangun self-serve platform yang matang.
- Kurang cocok untuk organisasi kecil dengan sedikit domain — kompleksitasnya jadi berlebihan dibanding manfaatnya.`,
        en: "",
      },
    },
  },
};
