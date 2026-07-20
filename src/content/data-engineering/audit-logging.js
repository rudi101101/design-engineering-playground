export const term = {
  id: "audit-logging",
  track: "data-engineering",
  category: "Security",
  color: "#991b1b",
  icon: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
  simulation: "audit",
  tools: [
    "BigQuery Audit Logs",
    "Cloud Logging",
    "AWS CloudTrail",
    "Splunk",
    "Elastic SIEM",
  ],
  prerequisites: [],
  related: ["data-classification", "rbac-column-row-level-security"],
  name: { id: "Audit Logging", en: "Audit Logging" },
  content: {
    description: {
      id: "Audit Logging adalah praktik mencatat setiap aktivitas akses terhadap data — siapa yang mengakses, apa yang diakses, kapan, dan dari mana — secara sistematis dan tidak bisa diubah (immutable). Ini bukan sekadar logging teknis untuk debugging, melainkan jejak forensik yang harus bisa dipercaya sebagai bukti hukum atau kepatuhan regulasi. Ketika terjadi insiden keamanan atau audit dari regulator, audit trail inilah yang menjadi satu-satunya sumber kebenaran objektif tentang apa yang sebenarnya terjadi terhadap data sensitif, tanpa bergantung pada ingatan atau klaim manusia.",
      en: "",
    },
    concept: {
      id: "Bayangkan Audit Logging seperti kamera CCTV yang merekam terus-menerus di brankas bank, lengkap dengan buku catatan di pintu masuk yang mencatat setiap orang yang masuk, jam berapa, dan apa yang mereka ambil. Rekaman CCTV itu tersimpan di server terpisah yang tidak bisa diakses atau dihapus oleh siapa pun yang masuk ke brankas — bahkan jika seseorang berbuat curang di dalam, mereka tidak bisa menghapus jejak rekaman dirinya sendiri. Ketika ada barang hilang, bank tidak perlu bertanya-tanya siapa yang salah — cukup putar rekamannya.",
      en: "",
    },
    methodology: {
      id: "Sistem audit logging bekerja dengan mencegat (intercept) setiap operasi yang dilakukan terhadap database atau sistem data — baik itu SELECT, INSERT, UPDATE, maupun perubahan konfigurasi akses. Untuk setiap operasi, sistem mencatat detail lengkap: identitas pengguna, timestamp, kueri atau operasi persis yang dijalankan, jumlah baris yang terdampak atau diakses, dan alamat IP asal permintaan. Catatan ini disimpan di penyimpanan yang bersifat immutable — tidak bisa diubah atau dihapus, bahkan oleh administrator sistem sekalipun, untuk menjaga integritasnya sebagai bukti. Log ini kemudian sering diintegrasikan dengan sistem SIEM (Security Information and Event Management) yang secara otomatis menganalisis pola akses dan memicu alert jika terdeteksi anomali, misalnya seseorang mengakses ribuan baris data pelanggan di luar jam kerja normal.",
      en: "",
    },
    objective: {
      id: "Tanpa audit trail, organisasi tidak punya cara objektif untuk membuktikan siapa yang mengakses data sensitif tertentu — jika terjadi kebocoran data atau penyalahgunaan akses, investigasi menjadi mustahil karena tidak ada bukti forensik yang bisa diandalkan. Regulator di industri seperti keuangan dan kesehatan secara eksplisit mensyaratkan organisasi mampu menunjukkan bukti siapa mengakses data apa dan kapan sebagai bagian dari kepatuhan. Audit Logging menyelesaikan kebutuhan ini dengan menciptakan jejak yang lengkap, objektif, dan tidak bisa dimanipulasi.",
      en: "",
    },
    goal: {
      id: "Setiap akses terhadap data sensitif tercatat lengkap dan tidak bisa diubah, sehingga tim keamanan bisa merekonstruksi kronologi akses secara akurat saat investigasi insiden, dan organisasi bisa menunjukkan bukti kepatuhan regulasi kapan pun diminta auditor, dengan anomali akses terdeteksi dan dialertkan mendekati waktu nyata lewat integrasi SIEM.",
      en: "",
    },
    exampleImplementation: {
      id: "Alur kerja audit logging tipikal menggunakan BigQuery Audit Logs terintegrasi dengan SIEM:\n\n1. **User action** — seorang analyst menjalankan kueri terhadap tabel klaim.\n2. **Intercept** — platform secara otomatis mencegat dan mencatat operasi tersebut sebelum dieksekusi.\n3. **Log event** — dicatat: siapa (user ID), apa (kueri persis), kapan (timestamp), dari mana (IP address).\n4. **Immutable store** — log disimpan di penyimpanan yang tidak bisa diubah, terpisah dari sistem operasional.\n5. **SIEM** — log dikirim ke sistem SIEM untuk analisis pola.\n6. **Alert if anomaly** — jika terdeteksi pola tidak wajar, tim keamanan menerima notifikasi otomatis.\n\nContoh kueri untuk mengaudit siapa saja yang mengakses tabel sensitif dalam 24 jam terakhir:\n\n```sql\nSELECT\n  protopayload_auditlog.authenticationInfo.principalEmail AS accessed_by,\n  timestamp,\n  protopayload_auditlog.resourceName AS table_accessed\nFROM `project.region-asia.cloudaudit_googleapis_com_data_access`\nWHERE protopayload_auditlog.resourceName LIKE '%claims_sensitive%'\n  AND timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 24 HOUR)\nORDER BY timestamp DESC;\n```\n\nKueri ini memberi daftar lengkap siapa saja yang mengakses tabel klaim sensitif, kapan, dan bisa langsung dipakai sebagai bukti saat audit compliance.",
      en: "",
    },
    exampleEnterprise: {
      id: "Fintech Cepat mengaktifkan BigQuery Audit Logs untuk seluruh tabel yang menyimpan data klaim nasabahnya, sehingga setiap kueri yang menyentuh tabel tersebut tercatat lengkap dengan identitas pengguna dan waktu eksekusinya. Ketika regulator OJK melakukan audit kepatuhan dan meminta bukti siapa saja yang pernah mengakses data klaim nasabah tertentu selama enam bulan terakhir, tim compliance perusahaan bisa langsung menghasilkan laporan lengkap dari audit log tanpa perlu menginterogasi tim engineering secara manual. Dalam satu kasus, log ini juga membantu menemukan bahwa seorang karyawan mengakses data klaim di luar cakupan tugasnya, yang kemudian ditindaklanjuti lewat proses internal.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Menyediakan bukti forensik objektif yang tidak bisa dimanipulasi, krusial saat investigasi insiden keamanan\n- Mempermudah pembuktian kepatuhan terhadap regulator yang mensyaratkan jejak akses data yang jelas\n- Integrasi dengan SIEM memungkinkan deteksi anomali akses mendekati waktu nyata, bukan hanya investigasi setelah kejadian\n- Efek deteren — pengguna cenderung lebih berhati-hati mengakses data sensitif karena tahu aktivitasnya tercatat",
        en: "",
      },
      cons: {
        id: "- Volume log yang dihasilkan bisa sangat besar pada sistem dengan traffic tinggi, menambah biaya penyimpanan yang signifikan\n- Audit logging menambah sedikit overhead pada setiap operasi karena proses intercept dan pencatatan\n- Log yang melimpah tanpa analisis yang baik (tuning SIEM) justru menghasilkan alert fatigue — terlalu banyak notifikasi sehingga yang penting terlewat\n- Audit trail hanya efektif jika benar-benar diaktifkan secara menyeluruh; celah sekecil apa pun pada cakupan logging bisa jadi blind spot forensik",
        en: "",
      },
    },
  },
};
