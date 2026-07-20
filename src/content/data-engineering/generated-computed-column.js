export const term = {
  id: "generated-computed-column",
  track: "data-engineering",
  category: "Advanced SQL",
  color: "#ef4444",
  icon: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z",
  simulation: "computed",
  tools: ["PostgreSQL GENERATED", "MySQL GENERATED", "SQL Server Computed", "BigQuery (via dbt)"],
  prerequisites: [],
  related: ["materialized-view", "view-vs-materialized-view"],
  name: { id: "Generated / Computed Column", en: "Generated / Computed Column" },
  content: {
    description: {
      id: "Generated atau Computed Column adalah kolom yang nilainya dihitung otomatis oleh database dari kolom lain di baris yang sama, alih-alih diisi manual lewat INSERT atau UPDATE. Ada dua varian: STORED, di mana nilai hasil hitungan benar-benar disimpan secara fisik di disk seperti kolom biasa dan bisa diberi index; dan VIRTUAL, di mana nilai dihitung ulang setiap kali kolom itu dibaca (on-the-fly) tanpa memakan ruang penyimpanan tambahan. Ini menghilangkan kebutuhan menghitung ulang ekspresi yang sama berulang kali di level aplikasi atau di setiap query.",
      en: "",
    },
    concept: {
      id: "Bayangkan generated column STORED seperti kalkulator kasir yang langsung mencetak total belanja di struk begitu barang dipindai — hasilnya sudah tercetak dan bisa langsung dilihat tanpa harus menghitung ulang. Sementara generated column VIRTUAL lebih seperti kalkulator yang kamu pegang sendiri dan hitung ulang setiap kali kamu butuh totalnya — tidak ada struk yang tercetak permanen, tapi kamu tidak perlu ruang untuk menyimpan struk itu.",
      en: "",
    },
    methodology: {
      id: "Saat kolom didefinisikan sebagai STORED, database menghitung nilai ekspresi setiap kali baris di-INSERT atau kolom sumber di-UPDATE, lalu menulis hasilnya ke disk seperti kolom biasa — konsekuensinya butuh ruang penyimpanan ekstra, tapi pembacaan jadi sangat cepat karena nilai sudah siap, dan kolom ini bahkan bisa diberi index untuk mempercepat query lebih jauh. Saat kolom didefinisikan sebagai VIRTUAL, tidak ada nilai yang disimpan sama sekali — setiap kali kolom dibaca lewat SELECT, database menghitung ulang ekspresinya dari kolom sumber saat itu juga, menghemat ruang penyimpanan tapi berpotensi lebih lambat jika kolom sering dibaca berulang kali dalam volume besar.",
      en: "",
    },
    objective: {
      id: "Generated column ada untuk menghindari duplikasi logika perhitungan yang sama di banyak tempat — tanpa fitur ini, ekspresi seperti perhitungan pajak atau total harus ditulis ulang di setiap query, aplikasi, atau bahkan di trigger yang rawan lupa di-update saat logika bisnis berubah. Dengan generated column, satu definisi ekspresi cukup ditulis sekali di skema tabel dan otomatis konsisten di seluruh sistem yang membaca tabel tersebut.",
      en: "",
    },
    goal: {
      id: "Hasilnya adalah konsistensi perhitungan yang terjamin karena logika ada di satu tempat (definisi kolom), query yang lebih sederhana karena tidak perlu mengulang ekspresi perhitungan setiap kali, dan untuk varian STORED, performa baca yang cepat karena nilai sudah tersedia langsung tanpa hitung ulang, bahkan bisa dipercepat lebih jauh lewat index.",
      en: "",
    },
    exampleImplementation: {
      id: "Skenario: menambahkan kolom total iuran yang otomatis dihitung dari jumlah klaim, tanpa perlu dihitung manual di setiap query.\n\n1. Definisikan kolom dengan klausa GENERATED ALWAYS AS (ekspresi).\n2. Tentukan STORED jika ingin nilai disimpan fisik dan bisa diindeks.\n3. Setiap INSERT/UPDATE pada kolom sumber otomatis memicu perhitungan ulang.\n4. Query langsung membaca kolom hasil tanpa perlu menulis ulang ekspresi.\n\n```sql\nCREATE TABLE klaim (\n  klaim_id BIGINT,\n  jumlah_klaim NUMERIC,\n  total_iur NUMERIC GENERATED ALWAYS AS (jumlah_klaim * 0.1) STORED\n);\n\nCREATE INDEX idx_total_iur ON klaim (total_iur);\n\nINSERT INTO klaim (klaim_id, jumlah_klaim) VALUES (1, 1000000);\n-- total_iur otomatis terisi 100000, langsung tersedia tanpa hitung ulang\n\nSELECT klaim_id, total_iur FROM klaim WHERE total_iur > 50000;\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Klinika Sehat menambahkan kolom `total_iur` sebagai generated column STORED pada tabel klaim mereka, dihitung otomatis dari `jumlah_klaim * 0.1` sesuai aturan iuran yang berlaku. Sebelumnya, perhitungan iuran ini ditulis ulang di setiap laporan dan dashboard yang berbeda, dan pernah terjadi ketidakkonsistenan ketika satu tim lupa mengikuti perubahan formula. Dengan generated column, formula hanya perlu diubah sekali di definisi tabel, dan seluruh laporan yang membaca kolom `total_iur` otomatis konsisten tanpa perlu update kode terpisah di tempat lain, plus query yang memfilter berdasarkan total_iur jadi cepat karena kolomnya sudah diindeks.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Menjamin konsistensi perhitungan karena logika ekspresi hanya didefinisikan sekali di skema tabel\n- Varian STORED memberi performa baca yang cepat dan bisa diindeks layaknya kolom biasa\n- Menyederhanakan query karena tidak perlu mengulang ekspresi perhitungan yang sama di banyak tempat\n- Mengurangi risiko bug akibat logika perhitungan yang tidak sinkron antar aplikasi atau laporan berbeda",
        en: "",
      },
      cons: {
        id: "- Varian STORED memakan ruang penyimpanan tambahan karena nilai hasil hitungan disimpan fisik di disk\n- Varian VIRTUAL bisa memperlambat query yang sering membaca kolom tersebut karena dihitung ulang setiap kali\n- Ekspresi yang bisa dipakai pada generated column punya keterbatasan tertentu, tidak semua logika kompleks bisa diekspresikan\n- Mengubah definisi generated column pada tabel besar yang sudah berisi banyak data bisa memerlukan operasi yang mahal untuk menghitung ulang seluruh baris",
        en: "",
      },
    },
  },
};
