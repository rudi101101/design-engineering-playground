export const term = {
  id: "reverse-etl",
  track: "data-engineering",
  category: "Pipeline",
  color: "#fb923c",
  icon: "M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3",
  simulation: "stream",
  tools: ["Hightouch", "Census", "Polytomic", "Grouparoo", "Omnata"],
  prerequisites: [],
  related: ["elt"],
  name: { id: "Reverse ETL", en: "Reverse ETL" },
  content: {
    description: {
      id: `Reverse ETL adalah praktik mensinkronkan data yang sudah diproses/dianalisis dari data warehouse kembali ke tools operasional bisnis seperti CRM, platform iklan, atau sistem customer support. Tujuannya adalah "mengaktivasi" hasil analitik agar tim garis depan seperti sales dan marketing bisa langsung bertindak berdasarkan data warehouse tersebut, di dalam tools yang sudah mereka pakai sehari-hari — bukan lewat dashboard BI terpisah yang jarang mereka buka.`,
      en: "",
    },
    concept: {
      id: `Kalau ELT/ETL ibarat mengumpulkan bahan mentah ke dapur pusat untuk dimasak jadi analisis yang matang, Reverse ETL ibarat pelayan yang membawa hidangan jadi itu keluar ke meja tempat pelanggan (tim sales) sebenarnya duduk — insight sehebat apa pun tidak ada gunanya kalau hanya terkunci di dapur dan tidak pernah sampai ke orang yang perlu bertindak atasnya.`,
      en: "",
    },
    methodology: {
      id: `Sebuah "sync model" — pada dasarnya query atau tabel di warehouse, misalnya skor churn atau segmen pelanggan — dipetakan ke field tertentu di tools SaaS tujuan. Tool reverse ETL kemudian secara berkala (atau nyaris real-time) membaca model tersebut dari warehouse dan mendorong/memperbarui data yang sesuai di sistem tujuan (CRM, platform iklan, helpdesk), sehingga tim operasional melihat insight hasil olahan warehouse langsung di tools yang mereka pakai sehari-hari.`,
      en: "",
    },
    objective: {
      id: `Reverse ETL hadir untuk menjawab masalah "last mile" analitik data — model prediksi churn yang brilian atau segmentasi pelanggan yang dihitung matang-matang di warehouse tidak akan memberi nilai bisnis apa pun jika hanya nangkring di dashboard BI yang jarang dicek tim operasional; insight tersebut perlu sampai ke tools tempat aksi bisnis sebenarnya terjadi.`,
      en: "",
    },
    goal: {
      id: `Hasilnya adalah tim operasional (sales, marketing, support) bisa langsung bertindak atas insight hasil olahan warehouse dari dalam tools yang sudah mereka pakai, tanpa perlu mengecek dashboard BI terpisah atau menunggu analis data mengekspor spreadsheet secara manual.`,
      en: "",
    },
    exampleImplementation: {
      id: `Alur: DWH → Define Sync Model → Reverse ETL → CRM / Ads / Support Tool → Action.

1. Tim data mendefinisikan sync model di warehouse, misalnya query skor risiko churn per pelanggan.
2. Tool reverse ETL memetakan kolom hasil query tersebut ke field tertentu di CRM tujuan.
3. Sinkronisasi berjalan terjadwal, mendorong update ke CRM setiap kali skor berubah.

\`\`\`sql
-- sync model: skor churn tinggi yang perlu dikirim ke CRM
select
  customer_id,
  churn_score,
  case when churn_score > 0.7 then 'high_risk' else 'normal' end as segment
from mart.customer_churn_score
where churn_score > 0.7;
\`\`\``,
      en: "",
    },
    exampleEnterprise: {
      id: `Skor risiko churn pelanggan yang dihitung di BigQuery disinkronkan lewat Hightouch ke Salesforce, sehingga tim sales Fintech Cepat bisa langsung melakukan outreach ke pelanggan berisiko tinggi tanpa menunggu laporan manual dari tim analitik.`,
      en: "",
    },
    prosAndCons: {
      pros: {
        id: `- Mengubah insight analitik menjadi aksi bisnis langsung tanpa proses ekspor dan handoff manual lewat spreadsheet.
- Tim operasional bekerja di dalam tools yang sudah mereka pakai sehari-hari, sehingga adopsinya lebih tinggi dibanding dashboard terpisah.
- Warehouse tetap menjadi satu sumber kebenaran yang kemudian didistribusikan ke banyak tools tujuan.
- Mengurangi ketergantungan pada engineer untuk membangun script sinkronisasi khusus per tujuan.`,
        en: "",
      },
      cons: {
        id: `- Menambah layer sinkronisasi baru yang perlu dipantau — sync yang basi atau gagal bisa diam-diam merusak keputusan bisnis.
- Ada risiko menimpa atau berkonflik dengan data yang diinput langsung di tools tujuan.
- Frekuensi sinkronisasi membatasi seberapa "real-time" aktivasi data ini sebenarnya.
- Menambah biaya vendor baru dan rate limit API yang perlu dikelola untuk tiap tools tujuan.`,
        en: "",
      },
    },
  },
};
