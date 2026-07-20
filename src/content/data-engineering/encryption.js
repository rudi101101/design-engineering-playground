export const term = {
  id: "encryption",
  track: "data-engineering",
  category: "Security",
  color: "#b91c1c",
  icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  simulation: "encryption",
  tools: [
    "GCP KMS",
    "AWS KMS",
    "BigQuery CMEK",
    "TLS 1.3",
    "HashiCorp Vault",
  ],
  prerequisites: [],
  related: ["data-tokenization", "data-masking-anonymization"],
  name: { id: "Encryption — At-Rest & In-Transit", en: "Encryption — At-Rest & In-Transit" },
  content: {
    description: {
      id: "Encryption adalah proses mengubah data menjadi bentuk yang tidak terbaca (ciphertext) menggunakan kunci kriptografi, sehingga hanya pihak yang memegang kunci yang tepat yang bisa mengembalikannya ke bentuk asli (plaintext). Dalam konteks sistem data, ada dua dimensi penting: at-rest, yaitu enkripsi terhadap data yang tersimpan di storage atau database (biasanya menggunakan algoritma AES-256); dan in-transit, yaitu enkripsi terhadap data saat berpindah dari satu sistem ke sistem lain lewat jaringan (biasanya menggunakan protokol TLS). Konsep tambahan yang penting bagi organisasi dengan kebutuhan kontrol tinggi adalah CMEK (Customer-Managed Encryption Keys), di mana organisasi membawa dan mengontrol kunci enkripsinya sendiri, alih-alih sepenuhnya mempercayakan pengelolaan kunci kepada penyedia cloud.",
      en: "",
    },
    concept: {
      id: "Bayangkan encryption at-rest seperti brankas terkunci di ruang penyimpanan sebuah bank — barang berharga di dalamnya aman selama tersimpan, dan hanya bisa dibuka dengan kunci atau kombinasi yang tepat. Encryption in-transit lebih mirip mobil pengangkut uang lapis baja yang membawa uang dari satu cabang bank ke cabang lain — meski uangnya sedang 'bergerak' dan rawan dicegat di jalan, kendaraan lapis baja itu memastikan isinya tetap aman selama perjalanan. CMEK adalah seperti bank yang mengizinkan Anda membawa kunci brankas sendiri buatan sendiri, alih-alih memakai kunci standar yang dibuat dan dipegang oleh bank — Anda punya kendali penuh untuk mencabut akses kapan saja dengan menahan kunci itu.",
      en: "",
    },
    methodology: {
      id: "Untuk enkripsi at-rest, setiap kali data ditulis ke storage atau database, sistem mengenkripsi data tersebut dengan kunci kriptografi sebelum menyimpannya sebagai ciphertext di disk. Saat data dibaca kembali, sistem mendekripsinya dengan kunci yang sama untuk mengembalikan plaintext yang bisa dipakai aplikasi. Untuk enkripsi in-transit, lapisan TLS membungkus komunikasi jaringan antara dua sistem, melakukan pertukaran kunci yang aman di awal koneksi (handshake) lalu mengenkripsi seluruh data yang dikirim selama sesi tersebut berlangsung. Pada implementasi CMEK, alih-alih kunci enkripsi dikelola sepenuhnya oleh penyedia cloud, organisasi membawa dan mengontrol kuncinya sendiri lewat sistem manajemen kunci seperti GCP KMS, sehingga organisasi bisa mencabut akses ke datanya sendiri kapan saja dengan menonaktifkan kunci tersebut. Rotasi kunci secara periodik juga menjadi bagian penting dari proses ini untuk membatasi dampak jika sebuah kunci pernah bocor.",
      en: "",
    },
    objective: {
      id: "Data yang tersimpan atau berpindah tanpa enkripsi rentan terhadap akses tidak sah jika terjadi kebocoran fisik storage, penyadapan jaringan, atau akses tidak sah dari pihak dalam infrastruktur penyedia layanan. Encryption menyelesaikan risiko ini dengan memastikan bahwa bahkan jika data berhasil diakses secara tidak sah, isinya tetap tidak berguna tanpa kunci yang tepat. CMEK secara khusus menyelesaikan kekhawatiran organisasi yang tidak ingin sepenuhnya bergantung pada penyedia cloud untuk mengontrol siapa yang bisa membaca datanya — terutama penting bagi industri yang diregulasi ketat seperti keuangan dan kesehatan.",
      en: "",
    },
    goal: {
      id: "Seluruh data sensitif terenkripsi baik saat tersimpan maupun saat berpindah antar sistem, dengan kunci enkripsi yang dikelola dan dirotasi sesuai kebijakan keamanan organisasi, sehingga organisasi bisa membuktikan kepada regulator dan auditor bahwa data pelanggan terlindungi bahkan dalam skenario kebocoran infrastruktur.",
      en: "",
    },
    exampleImplementation: {
      id: "Alur penerapan enkripsi end-to-end untuk sebuah tabel sensitif di BigQuery dengan CMEK:\n\n1. **Write data** — aplikasi menulis data klaim ke BigQuery.\n2. **Encrypt with key** — BigQuery mengenkripsi data menggunakan kunci dari Cloud KMS yang dikontrol organisasi (bukan kunci default Google).\n3. **Store ciphertext** — data tersimpan di disk dalam bentuk terenkripsi.\n4. **Read** — aplikasi meminta data kembali.\n5. **Decrypt with key** — BigQuery mendekripsi menggunakan kunci yang sama untuk mengembalikan plaintext ke aplikasi yang berwenang.\n6. **Key rotation periodic** — kunci dirotasi secara berkala sesuai kebijakan keamanan.\n\nContoh konfigurasi CMEK saat membuat tabel:\n\n```sql\nCREATE TABLE finance_dataset.claims\n(\n  claim_id STRING,\n  claim_amount NUMERIC,\n  claim_date DATE\n)\nOPTIONS (\n  kms_key_name = 'projects/org-security/locations/asia/keyRings/finance-keys/cryptoKeys/claims-key'\n);\n```\n\nDengan konfigurasi ini, jika organisasi mencabut akses ke `claims-key` di Cloud KMS, seluruh data di tabel tersebut langsung tidak bisa dibaca lagi oleh siapa pun, termasuk oleh penyedia cloud sekalipun.",
      en: "",
    },
    exampleEnterprise: {
      id: "Fintech Cepat menggunakan BigQuery CMEK untuk mengenkripsi seluruh tabel yang berisi data klaim nasabahnya, dengan kunci enkripsi yang disimpan di Cloud KMS dan dikontrol penuh oleh tim keamanan internal perusahaan, bukan oleh penyedia cloud. Pendekatan ini menjadi persyaratan penting dari regulator sektor keuangan yang mensyaratkan perusahaan mampu membuktikan kontrol penuh atas akses data nasabahnya. Ketika kontrak dengan sebuah vendor analitik pihak ketiga berakhir, tim keamanan cukup mencabut akses vendor tersebut ke kunci KMS terkait — tanpa perlu menghapus atau memindahkan data secara fisik, akses vendor ke data langsung terputus karena mereka tidak lagi bisa mendekripsinya.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Melindungi data secara fundamental bahkan jika kontrol akses lain (seperti IAM) gagal atau terjadi kebocoran storage fisik\n- CMEK memberi organisasi kendali penuh untuk mencabut akses ke datanya sendiri kapan saja, termasuk dari penyedia cloud\n- Enkripsi in-transit dengan TLS mencegah penyadapan data saat berpindah antar sistem lewat jaringan publik atau internal\n- Menjadi persyaratan wajib di banyak regulasi industri (keuangan, kesehatan), sehingga penerapannya juga menyelesaikan kebutuhan compliance",
        en: "",
      },
      cons: {
        id: "- Mengelola kunci sendiri lewat CMEK menambah kompleksitas operasional — kehilangan kunci berarti kehilangan akses ke data secara permanen\n- Enkripsi dan dekripsi menambah sedikit overhead komputasi, meski biasanya kecil pada sistem modern\n- Enkripsi tidak melindungi dari akses tidak sah yang dilakukan lewat kredensial yang sah (misalnya akun yang dibajak) — perlu dikombinasikan dengan kontrol akses lain\n- Rotasi kunci yang tidak dikelola dengan baik bisa menyebabkan gangguan akses yang tidak disengaja terhadap sistem produksi",
        en: "",
      },
    },
  },
};
