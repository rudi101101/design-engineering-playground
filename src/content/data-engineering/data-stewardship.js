export const term = {
  id: "data-stewardship",
  track: "data-engineering",
  category: "Governance",
  color: "#fb923c",
  icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  simulation: "steward",
  tools: [
    "Collibra",
    "Atlan",
    "DataHub",
    "Alation",
    "Microsoft Purview",
  ],
  prerequisites: ["data-catalog"],
  related: ["master-data-management", "data-quality"],
  name: { id: "Data Stewardship", en: "Data Stewardship" },
  content: {
    description: {
      id: "Data Stewardship adalah peran dan tanggung jawab manusia untuk menjaga kualitas, definisi, dan akses data di sebuah domain bisnis tertentu. Ini penting untuk dibedakan dari tooling seperti catalog atau DQ framework — stewardship adalah tentang orang dan proses, bukan sistem. Seorang Data Steward biasanya berasal dari tim bisnis (bukan hanya IT) yang paham betul makna sebuah metrik atau entitas dalam konteks operasionalnya, dan bertanggung jawab memastikan definisi itu tetap akurat, disepakati bersama, serta digunakan secara konsisten oleh semua orang yang mengakses data domainnya.",
      en: "",
    },
    concept: {
      id: "Bayangkan Data Steward seperti kepala perpustakaan (bukan sekadar petugas rak buku). Kepala perpustakaan tidak hanya menata buku secara fisik, tapi memutuskan buku mana yang layak masuk koleksi, memastikan katalognya akurat, menjawab pertanyaan pengunjung tentang buku mana yang relevan untuk kebutuhan mereka, dan menindaklanjuti keluhan jika ada buku yang salah kategori. Tool catalog adalah rak dan sistem pencarian, tapi steward adalah orang yang menjaga agar seluruh sistem itu tetap dipercaya dan relevan.",
      en: "",
    },
    methodology: {
      id: "Proses stewardship dimulai saat seorang steward ditunjuk untuk sebuah domain data tertentu — misalnya domain 'Finance' atau 'Customer'. Steward tersebut bertanggung jawab mendefinisikan istilah bisnis (business glossary) untuk domainnya, misalnya menetapkan definisi resmi 'net_revenue' agar tidak ditafsirkan berbeda oleh tim yang berbeda. Steward juga mengurasi metadata — meninjau dan menyetujui deskripsi tabel di catalog agar akurat dan tidak menyesatkan. Ketika masalah kualitas data (DQ) muncul di domainnya, steward menjadi pihak yang bertanggung jawab menyelidiki dan menyelesaikan akar masalahnya, bukan sekadar meneruskan ke tim engineering. Steward juga menetapkan kebijakan akses untuk domainnya — siapa yang boleh melihat data apa — dan pada akhirnya 'mensertifikasi' dataset tertentu sebagai layak dipercaya untuk pelaporan resmi.",
      en: "",
    },
    objective: {
      id: "Tanpa stewardship, tooling governance seperti catalog dan DQ framework hanya menjadi sistem kosong tanpa pemilik — metadata jadi basi, definisi bisnis saling bertentangan antar tim, dan tidak ada pihak yang jelas bertanggung jawab ketika kualitas data bermasalah. Stewardship mengisi kesenjangan antara kapabilitas teknis governance dan akuntabilitas manusia yang sesungguhnya menjaga data itu tetap bernilai dan terpercaya dari waktu ke waktu.",
      en: "",
    },
    goal: {
      id: "Setiap domain data penting memiliki steward yang jelas dan aktif, sehingga definisi istilah bisnis konsisten di seluruh organisasi, masalah kualitas data terselesaikan dengan pemilik yang jelas, dan dataset yang disertifikasi steward bisa dipakai untuk pengambilan keputusan tanpa keraguan.",
      en: "",
    },
    exampleImplementation: {
      id: "Alur kerja stewardship untuk sebuah domain baru biasanya mengikuti tahapan berikut:\n\n1. **Steward assigned** — seorang analis finance senior ditunjuk sebagai steward domain 'Finance'.\n2. **Define business terms** — steward menuliskan definisi resmi istilah seperti 'net_revenue' dan 'gross_margin' di business glossary.\n3. **Curate metadata** — steward meninjau deskripsi tabel di catalog yang berada di domainnya, memperbaiki yang tidak akurat.\n4. **Monitor DQ** — steward memantau dashboard hasil pengujian kualitas data domainnya secara berkala.\n5. **Resolve issues** — ketika ada anomali, steward berkoordinasi dengan tim sumber data untuk memperbaiki akar masalah.\n6. **Certify data** — dataset yang sudah memenuhi standar diberi status 'certified' agar pengguna lain tahu data itu bisa diandalkan.\n\nContoh entri business glossary yang dikelola steward:\n\n```yaml\nterm: net_revenue\nowner: finance_steward\ndefinition: >\n  Pendapatan kotor dikurangi retur dan diskon,\n  dihitung per bulan kalender, tidak termasuk pajak.\ncertified_tables:\n  - finance.monthly_revenue_summary\nlast_reviewed: 2026-06-01\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Di Fintech Cepat, seorang Finance Data Steward bertanggung jawab penuh atas definisi metrik 'net_revenue' yang dipakai di seluruh laporan keuangan perusahaan. Sebelum peran ini ada, tim marketing dan tim finance masing-masing punya perhitungan net_revenue yang berbeda, menyebabkan angka yang dilaporkan ke manajemen sering tidak cocok satu sama lain. Setelah steward ditunjuk, definisi tunggal disepakati dan didokumentasikan, dan steward tersebut juga menjadi pihak yang menyetujui siapa saja yang boleh mengakses tabel keuangan sensitif, sehingga permintaan akses tidak lagi diputuskan sembarangan oleh tim IT tanpa konteks bisnis.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Memberi akuntabilitas yang jelas untuk kualitas dan definisi data di setiap domain, bukan tanggung jawab yang mengambang\n- Menyelaraskan definisi metrik bisnis lintas tim, mengurangi angka yang saling bertentangan\n- Mempercepat resolusi masalah kualitas data karena ada pemilik yang paham konteks bisnisnya\n- Melengkapi tooling governance dengan penilaian manusia yang tidak bisa sepenuhnya diotomasi",
        en: "",
      },
      cons: {
        id: "- Peran ini butuh waktu dan effort nyata dari orang bisnis, yang sering dianggap 'kerja sampingan' di luar tugas utamanya\n- Tanpa dukungan manajemen dan insentif yang jelas, peran steward gampang terbengkalai\n- Efektivitas sangat bergantung pada kompetensi dan konsistensi individu steward, bukan sistem\n- Skalanya terbatas — satu steward tidak bisa mengawasi terlalu banyak domain sekaligus tanpa kualitas menurun",
        en: "",
      },
    },
  },
};
