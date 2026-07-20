export const term = {
  id: "data-observability",
  track: "data-engineering",
  category: "Modern/ML",
  color: "#6d28d9",
  icon: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  simulation: "observability",
  tools: ["Monte Carlo", "Bigeye", "Acceldata", "dbt tests", "Datafold"],
  prerequisites: [],
  related: ["data-quality", "data-lineage"],
  name: { id: "Data Observability", en: "Data Observability" },
  content: {
    description: {
      id: "Data Observability adalah praktik memantau kesehatan data pipeline secara berkelanjutan agar masalah data terdeteksi sebelum sampai ke tangan pengguna bisnis. Berbeda dari data quality check tradisional yang biasanya dijalankan manual atau terjadwal untuk aturan spesifik, data observability bersifat proaktif dan menyeluruh — ia memantau pola data secara otomatis dari waktu ke waktu sehingga anomali yang bahkan belum terpikirkan sebelumnya tetap bisa terdeteksi. Ini penting karena kerusakan data sering kali senyap: pipeline tetap berjalan tanpa error teknis, tapi angka yang dihasilkan sudah salah.",
      en: "",
    },
    concept: {
      id: "Bayangkan data observability seperti sistem monitoring tanda-tanda vital pasien di rumah sakit — bukan hanya mengecek sekali sehari apakah pasien masih hidup, tapi terus memantau detak jantung, tekanan darah, dan suhu tubuh secara real-time, lalu membunyikan alarm begitu ada pola yang menyimpang dari normal, bahkan sebelum dokter sempat memeriksa manual. Data observability melakukan hal yang sama pada pipeline data: memantau \"tanda vital\" data seperti volume dan freshness terus-menerus, dan membunyikan alarm begitu ada yang aneh.",
      en: "",
    },
    methodology: {
      id: "Data observability umumnya dibangun di atas lima pilar. Freshness mengecek apakah data ter-update tepat waktu sesuai jadwal yang diharapkan. Volume mengecek apakah jumlah baris yang masuk wajar dibanding histori — lonjakan atau penurunan drastis adalah sinyal masalah. Distribution mengecek apakah pola nilai dalam kolom masih normal, misalnya rata-rata atau persentase null tidak melenceng jauh dari biasanya. Schema memantau apakah ada perubahan struktur tabel yang tidak terduga, seperti kolom hilang atau tipe data berubah. Lineage memetakan hubungan antar tabel sehingga saat terjadi anomali, root cause bisa ditelusuri ke sumbernya. Alurnya: sistem memantau pipeline secara kontinu, mendeteksi anomali pada salah satu dari lima pilar tersebut, mengirim alert ke tim terkait, lalu tim menelusuri akar masalah lewat lineage untuk tahu tabel atau proses mana yang jadi sumbernya.",
      en: "",
    },
    objective: {
      id: "Data observability ada karena kerusakan data sering tidak menimbulkan error teknis — pipeline tetap 'sukses' secara status job, tapi data yang dihasilkan sudah salah atau tidak lengkap. Tanpa observability, masalah semacam ini baru ketahuan ketika laporan bisnis sudah terlanjur salah dan dilihat oleh eksekutif atau pelanggan, yang jauh lebih mahal untuk diperbaiki dibanding dideteksi lebih awal secara otomatis.",
      en: "",
    },
    goal: {
      id: "Tujuannya adalah mendeteksi anomali data dalam hitungan menit setelah terjadi, bukan hari, sehingga tim data bisa memperbaiki masalah sebelum laporan atau model yang bergantung pada data tersebut terpengaruh — idealnya insiden data terdeteksi dan diatasi sebelum ada satu pun stakeholder bisnis yang menyadarinya.",
      en: "",
    },
    exampleImplementation: {
      id: "Alur kerja data observability pada satu tabel kritis:\n\n1. Sistem monitoring terus memantau metrik volume, freshness, distribution, dan schema tabel setiap kali ada update.\n2. Sistem mendeteksi anomali, misalnya volume turun drastis dibanding baseline historis.\n3. Alert otomatis dikirim ke channel tim data engineering.\n4. Tim menelusuri lineage untuk menemukan job atau sumber data yang jadi penyebab.\n\nContoh aturan sederhana dengan dbt tests untuk memantau volume minimum:\n\n```yaml\nmodels:\n  - name: tabel_klaim\n    tests:\n      - dbt_utils.recency:\n          datepart: hour\n          field: updated_at\n          interval: 2\n    columns:\n      - name: klaim_id\n        tests:\n          - not_null\n          - unique\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Klinika Sehat memakai Monte Carlo untuk memantau tabel klaim asuransi mereka. Suatu malam pukul 03.00, volume data yang masuk ke tabel klaim tiba-tiba turun 90% dibanding rata-rata harian karena ada job upstream yang gagal secara diam-diam tanpa melempar error. Monte Carlo mendeteksi anomali volume ini secara otomatis dan mengirim alert ke tim data engineering jam 03.05, jauh sebelum laporan klaim harian dijadwalkan tayang ke manajemen jam 08.00 — tim sempat memperbaiki job yang gagal dan menjalankan ulang sebelum ada satu angka pun yang salah dilaporkan.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Mendeteksi anomali data secara proaktif tanpa harus mendefinisikan setiap aturan validasi secara manual\n- Memangkas waktu deteksi masalah dari hitungan hari (saat laporan sudah salah) menjadi hitungan menit\n- Lineage membantu root cause analysis jauh lebih cepat dibanding menelusuri manual lintas puluhan tabel\n- Membangun kepercayaan stakeholder bisnis terhadap data karena masalah ketahuan sebelum sampai ke laporan mereka",
        en: "",
      },
      cons: {
        id: "- Butuh periode 'pembelajaran' baseline sebelum deteksi anomali cukup akurat, sehingga di awal rawan false positive\n- Menambah biaya tooling dan kompleksitas operasional, terutama untuk organisasi dengan ratusan tabel yang perlu dipantau\n- Tidak menggantikan data quality check berbasis aturan bisnis spesifik — keduanya saling melengkapi, bukan pengganti\n- Alert fatigue bisa terjadi jika threshold tidak di-tuning dengan baik, membuat tim mengabaikan alert penting",
        en: "",
      },
    },
  },
};
