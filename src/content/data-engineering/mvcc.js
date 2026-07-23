export const term = {
  id: "mvcc",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#a78bfa",
  icon: "M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z",
  simulation: "mvcc",
  tools: ["PostgreSQL", "Oracle", "MySQL InnoDB", "CockroachDB", "Snowflake"],
  prerequisites: [],
  related: ["isolation-levels", "vacuum-autovacuum", "lock-types"],
  name: { id: "MVCC — Multi-Version Concurrency Control", en: "MVCC — Multi-Version Concurrency Control" },
  content: {
    description: {
      id: "**Multi-Version Concurrency Control (MVCC)** adalah teknik yang memungkinkan database menangani banyak transaksi baca dan tulis secara bersamaan **tanpa saling mengunci** (*blocking*). Alih-alih meng-update baris data secara langsung, setiap perubahan menghasilkan **versi baru** dari baris tersebut, sementara versi lama tetap dipertahankan sementara. Reader membaca *snapshot* data yang konsisten sesuai waktu transaksinya dimulai, sehingga tidak perlu menunggu writer selesai — dan sebaliknya, writer tidak perlu menunggu reader. MVCC dipakai luas di PostgreSQL, Oracle, MySQL InnoDB, hingga database terdistribusi modern seperti CockroachDB.",
      en: "",
    },
    concept: {
      id: "*Bayangkan* MVCC seperti Google Docs dengan fitur *version history*. Ketika kamu sedang membaca sebuah dokumen, orang lain bisa saja sedang mengeditnya di saat bersamaan — tapi kamu tetap melihat **versi yang stabil** sesuai saat kamu membuka dokumen itu, bukan versi yang sedang berubah-ubah di tengah proses editing. Setelah editor menyimpan perubahan, versi baru itu tersedia untuk pembaca berikutnya, sementara versi lama tetap ada di riwayat sampai tidak dibutuhkan lagi.",
      en: "",
    },
    methodology: {
      id: "Secara teknis, setiap baris data menyimpan metadata **xmin** (ID transaksi yang membuat versi ini) dan **xmax** (ID transaksi yang menghapus/mengganti versi ini). Ketika sebuah transaksi membaca data, database menentukan versi baris mana yang 'visible' baginya berdasarkan snapshot ID transaksinya sendiri — versi yang dibuat setelah snapshot-nya dimulai akan diabaikan. Saat writer melakukan UPDATE, sistem **tidak mengubah baris lama secara langsung**, melainkan menandai baris lama sebagai usang (set xmax) dan menyisipkan baris baru (xmin baru). Baris-baris lama yang sudah tidak relevan ini nantinya dibersihkan oleh proses *vacuum*/garbage collection.",
      en: "",
    },
    objective: {
      id: "MVCC ada untuk mengatasi masalah klasik locking berbasis *read-write lock*, di mana reader dan writer saling memblokir sehingga **throughput sistem anjlok** saat trafik tinggi. Dengan MVCC, database bisa mencapai concurrency tinggi **tanpa mengorbankan konsistensi baca**, karena setiap transaksi punya 'pandangan' data yang stabil dan terisolasi dari perubahan yang sedang berlangsung.",
      en: "",
    },
    goal: {
      id: "Hasilnya adalah sistem dengan **concurrency tinggi** di mana ratusan reader dan writer bisa berjalan bersamaan tanpa saling block, sekaligus tetap menjamin setiap transaksi melihat data yang konsisten (**snapshot isolation**) sepanjang durasi transaksinya berlangsung.",
      en: "",
    },
    exampleImplementation: {
      id: "Ilustrasi alur MVCC di PostgreSQL:\n\n1. Transaksi A memulai SELECT dan mendapat snapshot berdasarkan transaction ID saat itu.\n2. Transaksi B melakukan UPDATE pada baris yang sama: baris lama ditandai xmax = B, baris baru disisipkan dengan xmin = B.\n3. Transaksi A tetap melihat versi baris lama karena snapshot-nya dibuat sebelum B commit — **tidak ada blocking**.\n4. Setelah A selesai dan tidak ada transaksi lain yang butuh versi lama, proses VACUUM membersihkan baris usang.\n\n```sql\n-- Melihat metadata versi baris secara manual di PostgreSQL\nSELECT xmin, xmax, * FROM orders WHERE order_id = 501;\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Klinika Sehat menjalankan sistem rekam medis di atas PostgreSQL dengan **ratusan dokter dan staf** mengakses data pasien secara bersamaan. Saat seorang admin sedang meng-update status pembayaran sebuah klaim, seratus lebih user lain tetap bisa membaca data pasien dan klaim lainnya **tanpa mengalami delay sedikit pun** berkat MVCC — reader melihat snapshot data sebelum UPDATE selesai, dan begitu UPDATE commit, pembaca berikutnya otomatis mendapat versi terbaru.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Reader dan writer **tidak saling memblokir** sehingga concurrency sangat tinggi\n- Transaksi mendapat snapshot konsisten sepanjang durasinya (snapshot isolation)\n- Mengurangi kebutuhan locking eksplisit untuk operasi baca, menyederhanakan aplikasi\n- Cocok untuk beban kerja OLTP dengan rasio baca tinggi bercampur tulis",
        en: "",
      },
      cons: {
        id: "- Menghasilkan **'dead tuples'** (baris versi lama) yang menumpuk dan memakan storage jika tidak dibersihkan\n- Membutuhkan proses vacuum/garbage collection rutin, kalau terlambat bisa menyebabkan *table bloat*\n- Overhead penyimpanan tambahan untuk metadata versioning (xmin/xmax) di setiap baris\n- Transaksi *long-running* bisa mencegah pembersihan versi lama, memperparah bloat",
        en: "",
      },
    },
  },
};
