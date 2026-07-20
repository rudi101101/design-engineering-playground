export const term = {
  id: "object-vs-block-vs-file-storage",
  track: "data-engineering",
  category: "Storage & Format",
  color: "#4ade80",
  icon: "M2 2h8v8H2zM14 2h8v8h-8zM2 14h8v8H2zM14 14h8v8h-8z",
  simulation: "storagetypes",
  tools: ["GCS (object)", "AWS S3", "Persistent Disk (block)", "Cloud Filestore (file)", "Azure Blob"],
  prerequisites: [],
  related: ["data-tiering"],
  name: { id: "Object vs Block vs File Storage", en: "Object vs Block vs File Storage" },
  content: {
    description: {
      id: "Object, Block, dan File Storage adalah tiga model dasar penyimpanan data yang berbeda secara fundamental dalam cara mereka diakses, diskalakan, dan digunakan. Object storage (seperti GCS atau S3) menyimpan data sebagai objek dalam namespace datar dan diakses lewat kunci unik melalui HTTP, cocok untuk data lake berskala nyaris tak terbatas. Block storage menyimpan data sebagai blok-blok mentah berukuran tetap yang diakses langsung oleh sistem operasi/database untuk kebutuhan I/O acak berlatensi rendah. File storage menyediakan sistem file bergaya POSIX yang bisa diakses bersama oleh banyak klien lewat protokol seperti NFS. Memahami ketiganya penting karena memilih model yang salah untuk suatu beban kerja bisa berujung pada performa buruk atau biaya yang tidak perlu.",
      en: "",
    },
    concept: {
      id: "Bayangkan tiga cara berbeda menyimpan barang. Object storage seperti gudang penitipan barang self-storage raksasa: setiap barang diberi nomor tag unik, kamu ambil dan taruh barang lewat loket dengan menyebut nomor tagnya — tidak ada konsep 'folder' sungguhan, hanya nomor tag dan lokasi flat. Block storage seperti brankas pribadi dengan kompartemen bernomor yang bisa kamu buka-tutup dan ubah isinya sebagian-sebagian dengan sangat cepat — ini yang dipakai database untuk menulis ke lokasi spesifik dengan presisi tinggi. File storage seperti lemari arsip kantor bersama yang bisa diakses banyak orang sekaligus lewat jalur folder/sub-folder yang familiar, mirip cara kerja Windows Explorer atau Finder.",
      en: "",
    },
    methodology: {
      id: "Object storage bekerja lewat operasi PUT dan GET berbasis HTTP terhadap sebuah key — tidak ada konsep menulis sebagian dari objek (partial write), setiap perubahan berarti menulis ulang seluruh objek, tapi ini memungkinkan skala nyaris tak terbatas karena arsitekturnya terdistribusi secara horizontal. Block storage bekerja pada level sector, diakses lewat kernel driver dengan operasi baca/tulis presisi tinggi ke lokasi tertentu — inilah yang memungkinkan database melakukan random I/O berlatensi sangat rendah, karena block storage biasanya terpasang langsung sebagai disk virtual pada satu mesin. File storage bekerja lewat operasi POSIX standar seperti open/read/write berdasarkan path folder, dan didesain untuk diakses bersama oleh banyak klien secara simultan lewat jaringan, seperti kebutuhan aplikasi legacy yang mengharapkan filesystem tradisional.",
      en: "",
    },
    objective: {
      id: "Setiap beban kerja punya kebutuhan akses data yang berbeda: data lake butuh menyimpan file dalam volume masif dengan biaya rendah tanpa peduli struktur folder (object), database butuh I/O acak berlatensi sangat rendah ke lokasi spesifik (block), dan aplikasi lama yang mengharapkan filesystem bersama butuh akses gaya folder konvensional dari banyak mesin sekaligus (file). Tidak ada satu model storage yang optimal untuk ketiganya sekaligus — memaksakan satu model untuk semua kebutuhan akan menimbulkan mismatch performa atau biaya.",
      en: "",
    },
    goal: {
      id: "Hasil konkretnya adalah setiap komponen sistem mendapat model storage yang selaras dengan pola aksesnya: data lake mendapat skalabilitas nyaris tanpa batas dengan biaya per-GB rendah, database mendapat latensi I/O rendah yang stabil untuk transaksi, dan aplikasi legacy tetap bisa berjalan tanpa perlu ditulis ulang hanya karena beda model storage.",
      en: "",
    },
    exampleImplementation: {
      id: "Perbandingan cara mengakses data di ketiga model storage untuk skenario yang sama:\n\n```bash\n# Object storage: PUT/GET lewat key, tanpa konsep folder sungguhan\ngsutil cp klaim_2026_07.parquet gs://data-lake-klaim/raw/klaim_2026_07.parquet\n\n# Block storage: terpasang sebagai disk /dev/sdb, diformat dan di-mount seperti disk biasa\nmkfs.ext4 /dev/sdb && mount /dev/sdb /var/lib/postgresql/data\n\n# File storage: di-mount lewat NFS dan diakses banyak mesin sekaligus\nmount -t nfs fileserver:/shared/legacy-app /mnt/legacy-app\n```\n\nKetiga baris ini mengilustrasikan bagaimana model akses yang berbeda memerlukan cara interaksi yang sepenuhnya berbeda pula.",
      en: "",
    },
    exampleEnterprise: {
      id: "Klinika Sehat Group memakai tiga model storage sesuai kebutuhan masing-masing sistemnya. Data lake histori rekam medis disimpan di GCS (object storage) karena volumenya besar dan diakses lewat proses batch. Database PostgreSQL yang melayani transaksi pendaftaran pasien real-time berjalan di atas Persistent Disk (block storage) demi latensi I/O rendah. Sementara aplikasi lama untuk manajemen jadwal dokter yang masih mengharapkan shared filesystem tetap berjalan tanpa perubahan lewat Cloud Filestore (file storage) yang di-mount lewat NFS.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Object storage menawarkan skalabilitas nyaris tak terbatas dengan biaya per-GB yang sangat rendah, ideal untuk data lake.\n- Block storage memberikan latensi I/O acak yang rendah dan stabil, krusial untuk performa database transaksional.\n- File storage memungkinkan banyak klien mengakses data bersama lewat antarmuka folder yang familiar tanpa perubahan aplikasi.\n- Ketiganya bisa dipakai berdampingan dalam satu arsitektur, masing-masing untuk komponen yang paling cocok.",
        en: "",
      },
      cons: {
        id: "- Object storage tidak mendukung random write/partial update — setiap perubahan berarti menulis ulang seluruh objek.\n- Block storage biasanya terikat ke satu mesin/instance dan tidak diakses bersama oleh banyak klien sekaligus.\n- File storage umumnya punya throughput dan skalabilitas lebih terbatas dibanding object storage untuk beban kerja masif.\n- Salah memilih model (misalnya memaksakan database berjalan di atas object storage) akan menimbulkan masalah performa serius.",
        en: "",
      },
    },
  },
};
