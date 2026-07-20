export const term = {
  id: "lateral-join",
  track: "data-engineering",
  category: "Advanced SQL",
  color: "#22d3ee",
  icon: "M4 6h16M4 12h16M4 18h7",
  simulation: "lateral",
  tools: ["PostgreSQL", "BigQuery (CROSS JOIN UNNEST)", "MySQL 8.0+", "DuckDB", "Redshift"],
  prerequisites: [],
  related: ["window-function", "cte"],
  name: { id: "Lateral Join", en: "Lateral Join" },
  content: {
    description: {
      id: "Lateral Join adalah jenis join di SQL di mana subquery di sisi kanan JOIN diizinkan mengakses kolom dari baris yang sedang diproses di sisi kiri — sesuatu yang tidak mungkin dilakukan subquery biasa. Ini membuka kemampuan yang sangat berguna untuk kasus per-row computation, terutama pola 'top-N per group' seperti mengambil 3 transaksi terbaru untuk setiap pelanggan, yang tanpa LATERAL biasanya butuh window function bertingkat atau query yang jauh lebih rumit dan lebih lambat.",
      en: "",
    },
    concept: {
      id: "Bayangkan LATERAL join seperti asisten pribadi yang berjalan mengikuti setiap tamu di sebuah acara satu per satu. Untuk setiap tamu (baris di tabel kiri), asisten ini langsung mencari informasi spesifik tentang tamu itu saja — misalnya '3 pesanan terakhir tamu ini' — bukan mengumpulkan semua data semua tamu sekaligus lalu menyaringnya belakangan. Subquery biasa tidak bisa 'melihat' tamu mana yang sedang diproses; LATERAL memberi kemampuan itu.",
      en: "",
    },
    methodology: {
      id: "Secara mekanis, untuk setiap baris di tabel kiri, database menjalankan subquery LATERAL dengan akses penuh ke nilai kolom baris kiri tersebut sebagai konteks. Hasil dari subquery itu kemudian digabungkan (append) dengan baris kiri yang bersangkutan. Proses ini berulang untuk setiap baris di tabel kiri, sehingga hasil akhirnya adalah kombinasi setiap baris kiri dengan hasil subquery yang relevan khusus untuknya — bukan hasil subquery global yang sama untuk semua baris seperti subquery biasa.",
      en: "",
    },
    objective: {
      id: "LATERAL join ada untuk mengatasi keterbatasan subquery konvensional yang tidak bisa mereferensikan kolom dari query luar di level baris. Sebelum LATERAL, pola 'top-N per group' harus diakali dengan window function seperti ROW_NUMBER() dikombinasikan dengan subquery filter, yang meski bisa dilakukan, kadang kurang intuitif dan kurang efisien dibanding pendekatan LATERAL yang langsung mengekspresikan niat 'untuk setiap baris ini, ambil top-N terkait'.",
      en: "",
    },
    goal: {
      id: "Hasilnya adalah query yang lebih ringkas dan sering kali lebih efisien untuk kasus per-row computation dan top-N per group, dengan logika yang lebih mudah dibaca karena langsung mengekspresikan 'untuk setiap baris di sini, ambil data terkait ini' tanpa perlu trik window function bertingkat.",
      en: "",
    },
    exampleImplementation: {
      id: "Skenario: mengambil 3 klaim terbaru untuk setiap pasien dalam satu query.\n\n1. Tabel kiri (pasien) dibaca baris demi baris.\n2. Untuk setiap pasien, LATERAL subquery mengambil 3 klaim terbaru miliknya.\n3. Hasil digabung menjadi satu set hasil akhir.\n\n```sql\nSELECT p.pasien_id, p.nama, k.klaim_id, k.tanggal, k.jumlah\nFROM pasien p\nCROSS JOIN LATERAL (\n  SELECT klaim_id, tanggal, jumlah\n  FROM klaim\n  WHERE klaim.pasien_id = p.pasien_id\n  ORDER BY tanggal DESC\n  LIMIT 3\n) k;\n```\n\nDi BigQuery, pola serupa dicapai dengan `CROSS JOIN UNNEST` pada array/repeated field.",
      en: "",
    },
    exampleEnterprise: {
      id: "Klinika Sehat perlu menampilkan dashboard yang menunjukkan 3 klaim terakhir setiap pasien untuk tim customer service. Alih-alih menjalankan query terpisah per pasien atau menulis window function bertingkat yang rumit, tim data engineering menggunakan LATERAL join sekali jalan: untuk setiap baris pasien, subquery LATERAL langsung mengambil 3 klaim terbaru miliknya, menghasilkan satu query ringkas yang berjalan jauh lebih cepat dibanding pendekatan aplikasi yang query per pasien satu-satu.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Mengekspresikan pola top-N per group dengan cara yang jauh lebih intuitif dibanding window function bertingkat\n- Bisa lebih efisien dibanding subquery biasa karena database bisa mengoptimalkan eksekusi per baris kiri\n- Mendukung logika kompleks per baris, termasuk agregasi atau filter yang berbeda tergantung nilai baris kiri\n- Didukung oleh banyak database modern termasuk PostgreSQL, MySQL 8+, dan pola setara di BigQuery lewat UNNEST",
        en: "",
      },
      cons: {
        id: "- Sintaks LATERAL kurang familiar bagi banyak developer SQL yang terbiasa dengan JOIN dan subquery konvensional\n- Bisa menjadi lambat jika tabel kiri sangat besar karena subquery dijalankan berulang untuk setiap baris\n- Tidak semua database mendukung LATERAL secara native dengan sintaks yang sama, ada variasi antar platform\n- Query plan bisa lebih sulit dibaca dan dioptimalkan dibanding pendekatan window function untuk kasus tertentu",
        en: "",
      },
    },
  },
};
