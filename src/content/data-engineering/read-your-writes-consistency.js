export const term = {
  id: "read-your-writes-consistency",
  track: "data-engineering",
  category: "Consistency",
  color: "#a78bfa",
  icon: "M22 12h-4l-3 9L9 3l-3 9H2",
  simulation: "ryw",
  tools: ["DynamoDB (session)", "MongoDB (read pref)", "Redis", "Cassandra", "CockroachDB"],
  prerequisites: [],
  related: ["eventual-consistency"],
  name: { id: "Read-Your-Writes Consistency", en: "Read-Your-Writes Consistency" },
  content: {
    description: {
      id: "Read-Your-Writes Consistency (RYW) adalah jaminan spesifik dalam sistem eventual consistency bahwa seorang pengguna akan selalu melihat perubahan yang baru saja ia tulis sendiri, meskipun sistem secara keseluruhan belum sepenuhnya konsisten di semua replica. Ini adalah kompromi praktis yang sangat penting: sistem tidak perlu menjamin konsistensi kuat untuk semua pembaca, cukup menjamin bahwa penulis tidak akan merasa aneh melihat perubahannya sendiri 'hilang' setelah ia baru saja menyimpannya. Konsep terkait yang sering disertakan adalah Monotonic Reads, yaitu jaminan bahwa pengguna tidak akan pernah melihat data yang lebih lama dari yang sudah pernah ia lihat sebelumnya — tidak ada 'time travel' mundur dari sudut pandang pengguna.",
      en: "",
    },
    concept: {
      id: "Bayangkan kamu baru saja mengubah nama profil di media sosial, lalu me-refresh halaman dan tiba-tiba melihat nama lamamu lagi — rasanya aneh dan membingungkan, seolah perubahanmu tidak tersimpan. Read-Your-Writes Consistency adalah jaminan bahwa hal itu tidak akan terjadi: seperti pelayan restoran yang selalu ingat pesanan yang baru saja kamu ubah, meski dapur (sistem backend) di belakang masih memproses info itu ke seluruh cabang lain.",
      en: "",
    },
    methodology: {
      id: "Ada dua pendekatan umum untuk mengimplementasikan RYW. Pertama, sticky session atau session affinity: setelah pengguna melakukan write, seluruh permintaan read berikutnya dari pengguna yang sama diarahkan secara konsisten ke replica yang sama yang menerima write tersebut, sehingga ia pasti melihat data terbarunya sendiri. Kedua, selalu membaca dari node primary khusus untuk data milik pengguna tersebut, mengorbankan sedikit performa demi jaminan konsistensi personal. Untuk Monotonic Reads, sistem melacak versi terakhir yang sudah dilihat pengguna dan memastikan pembacaan berikutnya tidak pernah mengembalikan versi yang lebih lama dari itu, meski dibaca dari replica berbeda.",
      en: "",
    },
    objective: {
      id: "RYW ada karena eventual consistency murni, meski bagus untuk skalabilitas, menciptakan pengalaman pengguna yang membingungkan jika penulis sendiri melihat perubahannya 'hilang' sesaat setelah disimpan. Ini adalah masalah UX nyata yang dialami banyak aplikasi awal berbasis database eventually consistent — pengguna kehilangan kepercayaan pada sistem meski secara teknis data akan konsisten 'pada akhirnya'.",
      en: "",
    },
    goal: {
      id: "Hasil yang dicapai adalah pengalaman pengguna yang terasa konsisten secara personal — meski sistem di baliknya masih eventually consistent secara global — sehingga pengguna tidak pernah merasa aksinya gagal tersimpan padahal sebenarnya berhasil, dan tidak pernah melihat data mundur ke versi yang lebih lama dari yang sudah pernah ia lihat.",
      en: "",
    },
    exampleImplementation: {
      id: "Alur implementasi RYW dengan session affinity:\n\n1. Pengguna melakukan write, sistem mencatat replica mana yang menerima write dan timestamp/versi terkait.\n2. Sistem menyimpan informasi ini di session pengguna (cookie/token).\n3. Setiap read berikutnya dari sesi yang sama diarahkan ke replica yang sama, atau menyertakan syarat versi minimum.\n4. Jika replica yang dituju belum menerima propagasi terbaru, request bisa di-retry atau diarahkan ke primary.\n\nContoh ilustrasi dengan read preference MongoDB yang mewajibkan baca dari primary untuk data milik user aktif:\n\n```javascript\ndb.profil.updateOne(\n  { user_id: \"U123\" },\n  { $set: { nama: \"Budi Santoso\" } }\n);\n\n// Baca berikutnya dari sesi yang sama, dipaksa dari primary\ndb.profil.findOne(\n  { user_id: \"U123\" },\n  { readPreference: \"primary\" }\n);\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Toko Meta Retail mengalami keluhan pengguna yang bingung karena setelah mengubah alamat pengiriman di aplikasi, halaman konfirmasi kadang masih menampilkan alamat lama selama beberapa detik. Tim engineering mengimplementasikan Read-Your-Writes Consistency dengan session affinity: setelah pengguna menulis perubahan alamat, seluruh permintaan baca dari sesi yang sama diarahkan ke replica yang sama yang menerima write tersebut, sehingga pengguna langsung melihat alamat barunya sendiri, meski pengguna lain di sistem lain masih membaca data lewat replica yang belum ter-update.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Memberi pengalaman pengguna yang terasa konsisten secara personal tanpa harus mengorbankan skalabilitas sistem secara keseluruhan\n- Lebih murah diimplementasikan dibanding strong consistency global karena hanya perlu menjamin konsistensi untuk sesi penulis itu sendiri\n- Mencegah kebingungan dan hilangnya kepercayaan pengguna akibat melihat perubahannya sendiri 'menghilang' sesaat\n- Monotonic Reads mencegah pengalaman aneh melihat data mundur ke versi lebih lama setelah sempat melihat versi lebih baru",
        en: "",
      },
      cons: {
        id: "- Session affinity menambah kompleksitas routing dan bisa jadi titik lemah jika sesi berpindah node tanpa penanganan yang tepat\n- Tidak menjamin konsistensi untuk pengguna lain yang membaca data yang sama, hanya untuk penulis aslinya\n- Membaca selalu dari primary untuk menjamin RYW bisa mengurangi manfaat load balancing pada read replica\n- Butuh mekanisme pelacakan versi/timestamp tambahan yang menambah beban di sisi aplikasi atau infrastruktur",
        en: "",
      },
    },
  },
};
