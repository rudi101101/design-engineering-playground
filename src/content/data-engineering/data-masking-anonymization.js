export const term = {
  id: "data-masking-anonymization",
  track: "data-engineering",
  category: "Security",
  color: "#ef4444",
  icon: "M17.94 17.94A10 10 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9 9 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22",
  simulation: "masking",
  tools: [
    "BigQuery Dynamic Masking",
    "Google DLP",
    "Delphix",
    "Snowflake DDM",
    "Informatica",
  ],
  prerequisites: ["data-classification"],
  related: ["data-tokenization", "encryption", "rbac-column-row-level-security"],
  name: { id: "Data Masking & Anonymization", en: "Data Masking & Anonymization" },
  content: {
    description: {
      id: "Data Masking & Anonymization adalah teknik menyembunyikan atau mengubah nilai data sensitif agar tidak bisa diidentifikasi, tanpa harus menghapus datanya sepenuhnya. Ada dua pendekatan utama: static masking, yang mengganti data PII secara permanen sebelum data disalin ke lingkungan non-produksi seperti staging atau development; dan dynamic masking, yang menyamarkan data secara real-time saat kueri dijalankan, tergantung role pengguna yang mengakses. Anonymization berbeda dari masking dalam satu hal penting: anonymization bersifat irreversible (tidak bisa dikembalikan ke nilai asli), sementara masking bisa bersifat reversible tergantung implementasinya.",
      en: "",
    },
    concept: {
      id: "Bayangkan static masking seperti fotokopi dokumen yang sebagian tulisannya sudah ditipp-ex permanen sebelum dibagikan ke pihak luar — sekali dihapus, tidak ada cara mengembalikan tulisan aslinya dari fotokopi itu. Sementara dynamic masking lebih mirip kaca film satu arah pada mobil pejabat: orang di luar (misalnya analyst biasa) hanya melihat bayangan gelap, tapi orang yang berwenang duduk di dalam (misalnya admin) tetap bisa melihat dengan jelas apa yang terjadi di sekitarnya — datanya sama, tapi apa yang ditampilkan berbeda tergantung siapa yang melihat.",
      en: "",
    },
    methodology: {
      id: "Implementasi dimulai dengan mengidentifikasi kolom mana saja yang mengandung PII, biasanya hasil dari proses klasifikasi data sebelumnya. Untuk setiap kolom tersebut, ditentukan kebijakan masking per role — misalnya role 'analyst' melihat versi tersamar, role 'admin' melihat versi asli. Saat sebuah kueri dijalankan, sistem mengevaluasi kebijakan berdasarkan identitas pengguna yang mengeksekusi kueri, lalu mengembalikan versi masked atau versi asli sesuai hasil evaluasi tersebut — semuanya transparan tanpa pengguna perlu menulis kueri berbeda. Salah satu teknik penting adalah format-preserving masking: misalnya NIK 12 digit diganti dengan angka acak 12 digit lain yang formatnya tetap valid, sehingga integritas referensial (join antar tabel berdasarkan NIK yang sudah di-mask secara konsisten) tetap terjaga meski nilainya bukan NIK asli.",
      en: "",
    },
    objective: {
      id: "Tim development dan analytics sering butuh akses ke data yang realistis untuk testing dan analisis, tapi menggunakan data produksi asli di lingkungan non-produksi menciptakan risiko kebocoran data pribadi yang besar — lingkungan development biasanya punya kontrol keamanan yang jauh lebih longgar dibanding produksi. Data Masking & Anonymization menyelesaikan ketegangan ini: memberi data yang tetap 'terasa nyata' secara struktural dan statistik, tapi tidak lagi bisa dipakai untuk mengidentifikasi individu sungguhan.",
      en: "",
    },
    goal: {
      id: "Data sensitif tidak pernah terekspos dalam bentuk asli kepada pihak yang tidak berwenang, baik di lingkungan non-produksi maupun saat kueri langsung di produksi, sambil tetap mempertahankan kegunaan data untuk testing, analisis, dan pengembangan tanpa perlu meminta akses khusus berulang kali.",
      en: "",
    },
    exampleImplementation: {
      id: "Alur penerapan dynamic masking di BigQuery:\n\n1. **Identify PII cols** — kolom `national_id` dan `phone_number` ditandai sebagai PII lewat policy tag.\n2. **Define mask policy per role** — role `analyst` mendapat kebijakan mask, role `admin` mendapat akses penuh.\n3. **Query** — analyst menjalankan SELECT terhadap tabel yang sama seperti biasa.\n4. **Policy evaluation** — sistem mengecek role pengguna yang menjalankan kueri.\n5. **Return masked or real** — hasil dikembalikan sesuai role, tanpa analyst perlu tahu ada masking di baliknya.\n\nContoh definisi masking policy:\n\n```sql\nCREATE OR REPLACE MASKING POLICY mask_national_id\n  ON COLUMN customers.national_id\n  USING (\n    CASE\n      WHEN CURRENT_ROLE() = 'admin' THEN national_id\n      ELSE CONCAT(REPEAT('*', 8), RIGHT(national_id, 4))\n    END\n  );\n```\n\nDengan kebijakan ini, analyst yang menjalankan `SELECT national_id FROM customers` akan melihat `********1234`, sementara admin tetap melihat nomor lengkap — tanpa ada perbedaan dalam kueri yang ditulis keduanya.",
      en: "",
    },
    exampleEnterprise: {
      id: "Klinika Sehat menerapkan BigQuery Dynamic Masking untuk melindungi data pasien di tabel klaim kesehatan. Analyst yang melakukan analisis tren klaim melihat kolom NIK sebagai deretan tanda bintang, cukup untuk keperluan agregasi dan analisis pola tanpa perlu tahu identitas spesifik pasien. Sementara itu, tim admin klaim yang memang bertugas memverifikasi identitas pasien untuk keperluan pembayaran tetap melihat NIK lengkap sesuai kewenangannya. Kebijakan masking ini diterapkan di level kolom pada satu tabel yang sama, sehingga tidak perlu membuat salinan tabel terpisah untuk tiap level akses, mengurangi kompleksitas dan risiko data yang tidak sinkron antar salinan.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Melindungi data sensitif tanpa menghambat kebutuhan legitimate tim development dan analytics terhadap data yang realistis\n- Dynamic masking menghilangkan kebutuhan membuat dan memelihara salinan tabel terpisah untuk tiap level akses\n- Format-preserving masking menjaga integritas referensial sehingga data tetap bisa di-join dan dianalisis secara struktural\n- Mengurangi permukaan risiko kebocoran data di lingkungan non-produksi yang kontrol keamanannya biasanya lebih longgar",
        en: "",
      },
      cons: {
        id: "- Anonymization yang benar-benar irreversible bisa menghilangkan informasi yang sebenarnya masih dibutuhkan untuk analisis tertentu\n- Dynamic masking menambah overhead evaluasi kebijakan di setiap kueri, meski biasanya kecil\n- Kebijakan masking yang salah konfigurasi bisa membuat data terekspos tanpa sengaja atau justru terlalu tersamar sehingga tidak berguna\n- Static masking membutuhkan proses tambahan untuk menjaga data sample di non-produksi tetap representatif dari data produksi terbaru",
        en: "",
      },
    },
  },
};
