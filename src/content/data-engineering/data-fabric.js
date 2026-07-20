export const term = {
  id: "data-fabric",
  track: "data-engineering",
  category: "Arsitektur",
  color: "#f43f5e",
  icon: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  simulation: "fabric",
  tools: ["Microsoft Purview", "Google Dataplex", "Informatica", "Talend"],
  prerequisites: ["data-catalog", "data-lineage"],
  related: ["data-mesh"],
  name: { id: "Data Fabric", en: "Data Fabric" },
  content: {
    description: {
      id: `Data Fabric adalah sebuah intelligence layer berbasis AI dan metadata yang secara otomatis menghubungkan dan menyatukan akses ke data yang tersebar di berbagai sumber — bukan arsitektur fisik yang memindahkan atau menyatukan lokasi penyimpanan data. Ini relevan bagi organisasi dengan data yang tersebar di banyak sistem berbeda (multi-cloud, on-prem, SaaS) di mana mengatalogkan dan menghubungkan semuanya secara manual sudah tidak lagi mungkin dilakukan pada skala besar.`,
      en: "",
    },
    concept: {
      id: `Bayangkan Data Fabric seperti penerjemah universal sekaligus buku alamat pintar untuk sebuah kota besar: ia tidak memindahkan gedung-gedung (sumber data) ke satu lokasi, tapi ia tahu persis di mana setiap gedung berada, memahami "bahasa" masing-masing sistem, dan bisa membantumu — atau mengambilkan data untukmu — secara otomatis, bahkan makin pintar merekomendasikan jalan pintas seiring waktu berkat AI.`,
      en: "",
    },
    methodology: {
      id: `Data Fabric memanfaatkan AI/ML untuk melakukan auto-discovery metadata dari berbagai sumber data secara otomatis, melacak data lineage tanpa perlu didokumentasikan manual, dan memberi rekomendasi akses atau jalur join antar dataset. Semua ini dibangun di atas sebuah knowledge graph yang memetakan relasi antar dataset, sistem, dan istilah bisnis — menjadi fondasi yang memungkinkan pencarian dan akses data terasa seperti satu sistem terpadu meski sumber datanya tersebar di banyak platform berbeda.`,
      en: "",
    },
    objective: {
      id: `Data Fabric hadir untuk mengatasi masalah data yang tersebar di banyak sistem terputus-putus, di mana mengatalogkan dan menghubungkan semuanya secara manual tidak lagi bisa diskalakan — otomasi berbasis AI mengisi celah ini dengan mempercepat discovery dan pemahaman hubungan antar data secara otomatis.`,
      en: "",
    },
    goal: {
      id: `Hasilnya adalah akses data yang menyatu secara semantik lintas sumber yang heterogen, dengan upaya pemeliharaan metadata manual yang minim serta discovery dataset relevan yang dibantu AI, alih-alih mengandalkan dokumentasi manual yang cepat usang.`,
      en: "",
    },
    exampleImplementation: {
      id: `Alur: Multi-Source → Metadata Crawl → Knowledge Graph → AI Recommendation → Unified Access.

1. Tool data fabric melakukan crawl metadata dari berbagai sumber (database, data lake, SaaS) secara berkala.
2. Metadata tersebut dipetakan ke dalam knowledge graph yang menghubungkan tabel, kolom, dan istilah bisnis terkait.
3. Ketika seorang analis mencari data, sistem merekomendasikan dataset relevan beserta jalur join yang disarankan berdasarkan pola akses historis.

\`\`\`json
{
  "source": "gcp-bigquery",
  "asset": "klaim_summary",
  "linkedTerms": ["customer_id", "domain: finance"],
  "recommendedJoin": "azure-sql.customer_master.customer_id"
}
\`\`\``,
      en: "",
    },
    exampleEnterprise: {
      id: `Grup Meranti menggunakan Microsoft Purview untuk membangun unified catalog lintas Google Cloud dan Azure, sehingga tim analitik bisa menemukan dan memahami hubungan antar data dari kedua cloud tersebut tanpa harus memindahkan datanya terlebih dahulu ke satu platform.`,
      en: "",
    },
    prosAndCons: {
      pros: {
        id: `- Tidak memerlukan migrasi fisik atau konsolidasi data ke satu lokasi.
- AI mengurangi beban kerja manual dalam pencatatan metadata dan pembuatan katalog.
- Bekerja lintas lingkungan hybrid dan multi-cloud tanpa perlu menyatukan infrastruktur.
- Meningkatkan discoverability data secara signifikan pada skala organisasi besar.`,
        en: "",
      },
      cons: {
        id: `- Sangat bergantung pada kualitas AI dan metadata vendor — hasil buruk kalau input metadata buruk.
- Bisa mahal karena umumnya memakai tooling enterprise seperti Purview atau Informatica.
- Tidak menyelesaikan masalah kualitas data di sumbernya sendiri, hanya membantu menemukan dan menghubungkannya.
- Kategori tooling yang masih relatif baru dengan konsistensi fitur antar vendor yang belum seragam.`,
        en: "",
      },
    },
  },
};
