export default {
  id: 'etl',
  track: 'data-engineering',
  category: 'Pipeline',
  color: '#22d3ee',
  icon: 'M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3',
  simulation: 'etl',
  tools: ['Apache Spark', 'SSIS', 'Talend', 'Informatica', 'Pentaho'],
  prerequisites: [],
  related: [],
  name: {
    id: 'ETL — Extract, Transform, Load',
    en: 'ETL — Extract, Transform, Load',
  },
  content: {
    description: {
      id: 'ETL adalah pola pemrosesan data klasik: data diambil dari sumbernya (Extract), diubah bentuknya di server staging terpisah — dibersihkan, digabung, diformat ulang (Transform) — baru kemudian dimuat ke tempat penyimpanan akhir seperti data warehouse (Load). Urutan ini penting: transformasi terjadi sebelum data sampai ke tujuan akhirnya, biasanya di server/engine ETL yang terpisah dari warehouse itu sendiri. Pola ini sudah dipakai puluhan tahun sebelum cloud data warehouse yang murah dan bertenaga jadi umum, karena dulu compute di warehouse mahal dan terbatas.',
      en: "ETL is the classic data processing pattern: data is pulled from its source (Extract), reshaped on a separate staging server — cleaned, joined, reformatted (Transform) — and only then loaded into its final destination such as a data warehouse (Load). The order matters: transformation happens before the data reaches its final destination, usually on an ETL engine/server separate from the warehouse itself. This pattern predates cheap, powerful cloud data warehouses by decades, back when warehouse compute was expensive and limited.",
    },
    concept: {
      id: 'Bayangkan kamu pindah rumah. Daripada masukin semua barang apa adanya ke rumah baru (termasuk barang rusak, kardus kosong, dan barang yang gak kepake lagi), kamu dulu sortir dan bersihin semuanya di garasi tetangga (staging) — buang yang rusak, gabung barang sejenis jadi satu kardus, kasih label rapi. Baru setelah itu, kamu angkut yang udah rapi ke rumah baru. Garasi tetangga itu "staging server", rumah baru itu "data warehouse".',
      en: 'Imagine moving houses. Instead of dumping everything into the new house as-is (including broken items, empty boxes, stuff you don\'t need anymore), you first sort and clean everything in a neighbor\'s garage (staging) — throw away what\'s broken, combine similar items into one labeled box. Only then do you move the tidy boxes into the new house. The neighbor\'s garage is the "staging server", the new house is the "data warehouse".',
    },
    methodology: {
      id: 'Tiga tahap berurutan: (1) Extract — baca data mentah dari sumber (database operasional, API, file), biasanya lewat query atau koneksi terjadwal. (2) Transform — di server/engine staging terpisah, data dibersihkan (hapus duplikat, null handling), digabung (join antar sumber), diagregasi, dan diformat ulang sesuai skema tujuan. (3) Load — hasil yang sudah bersih dimuat ke warehouse tujuan, biasanya lewat bulk insert terjadwal (batch).',
      en: 'Three sequential stages: (1) Extract — read raw data from the source (operational database, API, files), usually via a query or scheduled connection. (2) Transform — on a separate staging server/engine, data is cleaned (deduplication, null handling), joined across sources, aggregated, and reshaped to match the destination schema. (3) Load — the now-clean result is loaded into the destination warehouse, typically via a scheduled bulk batch insert.',
    },
    objective: {
      id: 'Sebelum data dianalisis, ia sering datang kotor, tersebar di banyak sistem, dan dalam format yang beda-beda. ETL dibutuhkan supaya orang yang menganalisis data selalu berhadapan dengan data yang sudah bersih dan konsisten di warehouse, bukan data mentah yang berantakan dari puluhan sumber berbeda.',
      en: 'Before data can be analyzed, it often arrives dirty, scattered across many systems, and in inconsistent formats. ETL exists so that the people analyzing data always work with data that is already clean and consistent in the warehouse, not raw, messy data from dozens of different sources.',
    },
    goal: {
      id: 'Warehouse tujuan hanya berisi data yang sudah tervalidasi, terduplikasi, dan terformat sesuai skema yang disepakati, sehingga query analitik di atasnya bisa langsung dipercaya tanpa perlu membersihkan data lagi setiap kali dipakai.',
      en: 'The destination warehouse contains only validated, deduplicated data formatted to an agreed schema, so analytical queries on top of it can be trusted immediately, without needing to re-clean the data every time it is used.',
    },
    exampleImplementation: {
      id: 'Alur teknis umum pakai Apache Spark sebagai engine transform:\n\n1. **Extract** — baca data dari MySQL:\n```sql\nSELECT * FROM klaim WHERE tanggal >= CURRENT_DATE - 1\n```\n2. **Transform** — di Spark, bersihkan dan gabung:\n```python\ndf = df.dropDuplicates(["klaim_id"]).join(dim_cabang, "cabang_id")\n```\n3. **Load** — tulis hasil ke warehouse:\n```python\ndf.write.mode("append").saveAsTable("warehouse.fact_klaim")\n```',
      en: 'A typical technical flow using Apache Spark as the transform engine:\n\n1. **Extract** — read data from MySQL:\n```sql\nSELECT * FROM claims WHERE claim_date >= CURRENT_DATE - 1\n```\n2. **Transform** — clean and join in Spark:\n```python\ndf = df.dropDuplicates(["claim_id"]).join(dim_branch, "branch_id")\n```\n3. **Load** — write the result to the warehouse:\n```python\ndf.write.mode("append").saveAsTable("warehouse.fact_claims")\n```',
    },
    exampleEnterprise: {
      id: 'Sebuah perusahaan asuransi menjalankan job ETL tiap malam jam 01.00: data klaim harian diambil dari database operasional, dibersihkan dan digabung dengan data cabang & nasabah di server staging terpisah, lalu dimuat ke data warehouse pusat. Tim analitik yang datang pagi harinya langsung bisa bikin laporan tanpa perlu membersihkan data sendiri.',
      en: 'An insurance company runs an ETL job every night at 1 AM: daily claims data is pulled from the operational database, cleaned and joined with branch and customer data on a separate staging server, then loaded into the central data warehouse. The analytics team arriving the next morning can immediately build reports without having to clean the data themselves.',
    },
    prosAndCons: {
      pros: {
        id: '- Data yang sampai ke warehouse sudah pasti bersih dan konsisten\n- Warehouse gak perlu compute besar karena transformasi terjadi di tempat lain\n- Cocok untuk warehouse lama yang computenya terbatas/mahal',
        en: '- Data arriving at the warehouse is guaranteed clean and consistent\n- The warehouse doesn\'t need heavy compute since transformation happens elsewhere\n- Well suited to older warehouses with limited/expensive compute',
      },
      cons: {
        id: '- Butuh server/engine transform terpisah, jadi ada biaya infrastruktur tambahan\n- Data mentah asli seringkali tidak disimpan, jadi sulit re-transform kalau ada kesalahan\n- Kurang fleksibel dibanding ELT modern yang transformnya di dalam warehouse',
        en: '- Requires a separate transform server/engine, adding infrastructure cost\n- The original raw data is often not retained, making it hard to re-transform if something goes wrong\n- Less flexible than modern ELT, which transforms inside the warehouse itself',
      },
    },
  },
};
