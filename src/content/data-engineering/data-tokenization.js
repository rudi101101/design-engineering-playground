export const term = {
  id: "data-tokenization",
  track: "data-engineering",
  category: "Security",
  color: "#7f1d1d",
  icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  simulation: "tokenization",
  tools: [
    "Protegrity",
    "Voltage Security",
    "AWS Payment Cryptography",
    "HashiCorp Vault",
  ],
  prerequisites: [],
  related: ["encryption", "data-masking-anonymization"],
  name: { id: "Data Tokenization", en: "Data Tokenization" },
  content: {
    description: {
      id: "Data Tokenization adalah teknik mengganti data sensitif dengan token acak yang secara matematis tidak punya hubungan atau makna yang bisa diturunkan dari nilai aslinya. Ini berbeda secara fundamental dari enkripsi: nilai terenkripsi secara teoritis bisa didekripsi kembali menggunakan kunci yang tepat karena ada hubungan matematis antara ciphertext dan plaintext, sedangkan token yang dihasilkan tokenization tidak bisa dibalik (reverse) sama sekali tanpa mengakses token vault — basis data terpisah yang menyimpan pemetaan antara token dan nilai aslinya. Pendekatan ini menjadi standar industri, khususnya untuk data pembayaran, dan menjadi bagian inti dari kepatuhan PCI-DSS.",
      en: "",
    },
    concept: {
      id: "Bayangkan Data Tokenization seperti sistem nomor antrean di sebuah klinik. Ketika Anda datang, resepsionis memberi Anda nomor antrean acak seperti 'B047' alih-alih memanggil nama asli Anda di ruang tunggu umum. Nomor B047 itu sendiri tidak mengandung informasi apa pun tentang siapa Anda — orang lain yang melihat nomor itu tidak bisa menebak identitas Anda darinya. Hanya resepsionis yang memegang buku pendaftaran (token vault) yang tahu bahwa B047 sebenarnya merujuk pada Anda. Sistem lain di klinik — misalnya sistem antrean di layar tunggu — cukup bekerja dengan nomor B047 tanpa pernah perlu tahu nama asli Anda sama sekali.",
      en: "",
    },
    methodology: {
      id: "Ketika sebuah nilai sensitif perlu diproses, misalnya nomor kartu kredit, nilai tersebut dikirim ke tokenization service. Service ini menghasilkan token acak yang sama sekali tidak berhubungan secara matematis dengan nilai aslinya, lalu menyimpan pemetaan antara nilai asli dan token tersebut secara aman di dalam token vault — sebuah sistem yang diisolasi dengan kontrol akses sangat ketat. Token acak inilah yang kemudian dikembalikan dan disimpan oleh semua sistem lain di organisasi, bukan nilai aslinya. Karena sistem-sistem tersebut hanya menyimpan token, bahkan jika salah satu sistem itu diretas, penyerang hanya mendapatkan token yang tidak berguna tanpa akses ke token vault. Hanya sistem tertentu yang benar-benar berwenang — misalnya payment processor saat memproses transaksi sungguhan — yang diberi akses untuk menukar token kembali menjadi nilai aslinya lewat vault tersebut.",
      en: "",
    },
    objective: {
      id: "Menyimpan data sensitif seperti nomor kartu kredit di banyak sistem berbeda (sistem pemesanan, sistem loyalty, sistem analitik) memperbesar permukaan serangan secara drastis — setiap sistem yang menyimpan data asli menjadi target potensial. Data Tokenization menyelesaikan masalah ini dengan memusatkan data sensitif hanya di satu tempat yang sangat terkontrol (token vault), sementara seluruh sistem lain bisa tetap beroperasi normal menggunakan token yang aman meski dicuri, karena token tidak berguna tanpa akses ke vault.",
      en: "",
    },
    goal: {
      id: "Data sensitif seperti nomor kartu pembayaran hanya benar-benar tersimpan di satu lokasi yang sangat terisolasi dan diaudit ketat, sementara seluruh sistem lain di organisasi beroperasi dengan token yang aman untuk dicuri, sehingga cakupan kepatuhan PCI-DSS dan risiko kebocoran data pembayaran berkurang drastis dibanding menyimpan data asli di banyak tempat.",
      en: "",
    },
    exampleImplementation: {
      id: "Alur tokenisasi nomor kartu pembayaran yang khas:\n\n1. **Sensitive value** — nomor kartu kredit nasabah diterima saat transaksi.\n2. **Tokenization service** — nilai dikirim ke layanan tokenisasi terpisah.\n3. **Generate random token** — layanan menghasilkan token acak, misalnya `tok_9f2ab7c4`.\n4. **Store mapping in vault** — pemetaan nomor kartu asli ke token disimpan di vault yang terisolasi.\n5. **Return token to system** — sistem yang meminta hanya menerima dan menyimpan token, bukan nomor kartu asli.\n\nContoh alur pemanggilan layanan tokenisasi:\n\n```json\n// Request ke tokenization service\n{\n  \"action\": \"tokenize\",\n  \"value\": \"4111111111111111\"\n}\n\n// Response — hanya token yang dikembalikan ke sistem pemanggil\n{\n  \"token\": \"tok_9f2ab7c4\",\n  \"format\": \"card_number\",\n  \"vault_ref\": \"vault-eu-west-1\"\n}\n```\n\nSistem e-commerce yang menerima response ini hanya menyimpan `tok_9f2ab7c4` di database transaksinya. Untuk memproses pembayaran sesungguhnya, hanya payment processor yang punya izin memanggil vault untuk menukar token itu kembali menjadi nomor kartu asli.",
      en: "",
    },
    exampleEnterprise: {
      id: "Fintech Cepat menerapkan tokenisasi untuk seluruh nomor kartu kredit nasabahnya yang tersimpan di berbagai sistem — aplikasi mobile, sistem billing, dan platform analitik internal. Setiap sistem tersebut hanya menyimpan token acak, bukan nomor kartu asli, sementara hanya payment processor yang diberi izin mengakses token vault untuk memproses transaksi sungguhan. Ketika terjadi insiden di mana database platform analitik internal sempat diakses tanpa izin oleh pihak ketiga akibat celah konfigurasi, data yang berpotensi bocor hanyalah token acak yang tidak berguna tanpa akses vault, sehingga insiden itu tidak berkembang menjadi kebocoran data kartu kredit yang sesungguhnya.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Mengurangi cakupan kepatuhan PCI-DSS secara signifikan karena data kartu asli hanya tersimpan di satu tempat terisolasi\n- Token yang bocor dari sistem non-vault tidak berguna bagi penyerang karena tidak bisa dibalik tanpa akses vault\n- Memungkinkan sistem lain tetap beroperasi normal (referensi transaksi, analitik) tanpa perlu menyimpan data sensitif asli\n- Mengurangi permukaan serangan organisasi secara drastis dibanding menyimpan data sensitif tersebar di banyak sistem",
        en: "",
      },
      cons: {
        id: "- Token vault menjadi single point of failure yang kritis — jika vault tidak tersedia, semua proses yang butuh nilai asli ikut terhenti\n- Menambah latensi untuk operasi yang butuh nilai asli karena harus memanggil vault terlebih dahulu\n- Implementasi dan pengelolaan token vault yang aman membutuhkan investasi keamanan dan operasional yang signifikan\n- Migrasi sistem lama yang sudah terlanjur menyimpan data asli ke pola tokenisasi butuh effort besar dan perlu dilakukan bertahap",
        en: "",
      },
    },
  },
};
