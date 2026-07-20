export const term = {
  id: "data-vault-2-0",
  track: "data-engineering",
  category: "Modeling",
  color: "#6366f1",
  icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  simulation: "datavault",
  tools: ["dbt", "datavault4dbt", "WhereScape", "BigQuery", "Snowflake"],
  prerequisites: [],
  related: ["star-schema", "snowflake-schema"],
  name: { id: "Data Vault 2.0", en: "Data Vault 2.0" },
  content: {
    description: {
      id: "Data Vault 2.0 adalah metodologi pemodelan data yang memisahkan struktur tabel menjadi tiga jenis: Hub (menyimpan business key murni dari suatu entitas), Link (menyimpan relasi antar entitas), dan Satellite (menyimpan atribut deskriptif beserta riwayat perubahannya dari waktu ke waktu). Berbeda dari Star Schema yang dioptimalkan untuk kemudahan query pelaporan, Data Vault dirancang untuk menjadi lapisan penyimpanan mentah yang sangat auditable, insert-only, dan tahan terhadap perubahan struktur sumber data — cocok dipakai sebagai lapisan integrasi data warehouse sebelum data diolah lagi menjadi model yang lebih ramah pelaporan.",
      en: "",
    },
    concept: {
      id: "Bayangkan Data Vault seperti sistem pencatatan notaris yang tidak pernah menghapus atau menimpa dokumen lama. Hub seperti buku besar berisi daftar nomor identitas resmi setiap orang (KTP saja, tanpa detail lain). Link seperti buku catatan hubungan — 'orang A menikah dengan orang B pada tanggal X'. Satellite seperti map berisi detail deskriptif seseorang dari waktu ke waktu — setiap kali alamatnya berubah, notaris tidak mencoret alamat lama, tapi menambahkan lembar baru bertanggal, sehingga riwayat lengkap alamat seseorang dari dulu hingga sekarang tetap bisa ditelusuri utuh.",
      en: "",
    },
    methodology: {
      id: "Data dari sumber dipecah menjadi tiga struktur terpisah saat masuk ke Data Vault: Hub hanya menyimpan business key unik (misalnya NIK) tanpa atribut deskriptif apapun. Link menyimpan kombinasi business key dari dua entitas atau lebih untuk merepresentasikan relasi many-to-many (misalnya NIK dan ID klaim). Satellite menyimpan seluruh atribut deskriptif (nama, alamat) beserta kolom load_date yang menandai kapan baris itu dimuat. Karena semua operasi bersifat insert-only — tidak pernah UPDATE atau DELETE — setiap perubahan pada atribut apapun menghasilkan baris satellite baru dengan load_date baru, sehingga riwayat lengkap perubahan data selalu tersimpan utuh tanpa kehilangan versi lama.",
      en: "",
    },
    objective: {
      id: "Data warehouse tradisional yang langsung memodelkan data ke Star Schema sering kesulitan mengakomodasi perubahan struktur sumber data (misalnya sistem sumber baru ditambahkan, atau skema sumber berubah) tanpa merombak ulang model dan kehilangan riwayat historis. Data Vault ada untuk menyediakan lapisan integrasi yang sangat stabil terhadap perubahan struktural, sepenuhnya auditable karena sifat insert-only-nya, dan mudah diperluas ketika sumber data baru ditambahkan tanpa mengganggu struktur yang sudah ada.",
      en: "",
    },
    goal: {
      id: "Hasil konkretnya adalah audit trail lengkap dari setiap perubahan data sejak awal — setiap nilai historis suatu atribut pada titik waktu manapun bisa direkonstruksi ulang dari satellite, dan penambahan sumber data baru bisa dilakukan dengan menambah hub/link/satellite baru tanpa mengubah struktur yang sudah ada sebelumnya.",
      en: "",
    },
    exampleImplementation: {
      id: "Contoh struktur Hub, Link, dan Satellite untuk entitas pasien dan klaim:\n\n```sql\nCREATE TABLE hub_pasien (\n  hash_key_pasien STRING PRIMARY KEY,\n  nik STRING,\n  load_date TIMESTAMP,\n  source_system STRING\n);\n\nCREATE TABLE link_klaim (\n  hash_key_link STRING PRIMARY KEY,\n  hash_key_pasien STRING REFERENCES hub_pasien(hash_key_pasien),\n  claim_id STRING,\n  load_date TIMESTAMP\n);\n\nCREATE TABLE sat_pasien (\n  hash_key_pasien STRING REFERENCES hub_pasien(hash_key_pasien),\n  nama STRING,\n  alamat STRING,\n  load_date TIMESTAMP\n);\n\n-- Setiap perubahan alamat menghasilkan baris baru, bukan UPDATE\nINSERT INTO sat_pasien VALUES ('hk123', 'Rina Wulandari', 'Jl. Baru No. 5', '2026-07-20');\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "PT Nusantara Asuransi membangun lapisan integrasi data warehouse-nya dengan Data Vault 2.0: hub_pasien menyimpan NIK sebagai business key, link_klaim menghubungkan NIK dengan ID klaim, dan sat_pasien menyimpan nama serta alamat pasien beserta load_date. Setiap kali seorang pasien pindah alamat, sistem tidak menimpa data lama — baris satellite baru ditambahkan dengan load_date terkini, sehingga tim compliance selalu bisa merekonstruksi alamat pasien yang berlaku pada saat klaim tertentu diajukan, bukan alamat terkininya.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Audit trail lengkap secara natural karena sifat insert-only — tidak ada data historis yang pernah hilang atau tertimpa.\n- Sangat resilient terhadap perubahan struktur sumber data — sumber baru bisa ditambahkan tanpa merombak struktur yang sudah ada.\n- Memisahkan business key (Hub), relasi (Link), dan atribut (Satellite) memudahkan paralelisasi proses loading dari banyak sumber sekaligus.\n- Cocok untuk industri dengan kebutuhan kepatuhan regulasi ketat yang menuntut jejak audit penuh.",
        en: "",
      },
      cons: {
        id: "- Jumlah tabel jauh lebih banyak dibanding Star Schema untuk memodelkan entitas yang sama, menambah kompleksitas.\n- Query langsung terhadap Data Vault untuk kebutuhan pelaporan biasanya lambat dan rumit — umumnya perlu lapisan tambahan (Business Vault atau mart) di atasnya.\n- Kurva belajar metodologi ini cukup curam bagi tim yang terbiasa dengan pemodelan dimensional konvensional.\n- Volume data tumbuh lebih cepat karena sifat insert-only menyimpan setiap versi historis, bukan hanya kondisi terkini.",
        en: "",
      },
    },
  },
};
