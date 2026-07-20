export const term = {
  id: "schema-on-read-vs-schema-on-write",
  track: "data-engineering",
  category: "Pipeline",
  color: "#e879f9",
  icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6",
  simulation: "schemrw",
  tools: ["BigQuery (SoW)", "Snowflake (SoW)", "Parquet on GCS (SoR)", "Hive (SoR)", "Iceberg (hybrid)"],
  prerequisites: [],
  related: ["data-warehouse-vs-data-lake"],
  name: { id: "Schema-on-Read vs Schema-on-Write", en: "Schema-on-Read vs Schema-on-Write" },
  content: {
    description: {
      id: `Schema-on-Read dan Schema-on-Write adalah dua filosofi yang berlawanan tentang kapan struktur sebuah dataset ditegakkan. Schema-on-Write (khas data warehouse) mendefinisikan dan memvalidasi skema sebelum data diizinkan masuk, menolak apa pun yang tidak sesuai. Schema-on-Read (khas data lake) menerima data dalam format apa pun, dan struktur baru diterapkan/diinterpretasikan saat data diquery. Trade-off antara akurasi upfront dan fleksibilitas ini adalah keputusan desain fundamental di hampir setiap pipeline data.`,
      en: "",
    },
    concept: {
      id: `Schema-on-Write ibarat pemeriksaan paspor dan dokumen di bandara sebelum kamu boleh naik pesawat — ketat, tapi begitu mendarat, semua penumpang di pesawat dijamin valid. Schema-on-Read ibarat membiarkan semua orang naik dulu dan baru memeriksa siapa mereka saat benar-benar perlu mencari penumpang tertentu — lebih fleksibel dan cepat naiknya, tapi beban untuk mencari tahu bergeser ke saat dibutuhkan nanti.`,
      en: "",
    },
    methodology: {
      id: `Schema-on-Write memvalidasi setiap penulisan data terhadap skema yang sudah ditentukan sebelumnya, memberi jaminan kualitas data yang tinggi tapi membuat sistem menjadi rigid — perubahan skema butuh migrasi, dan data yang tidak sesuai akan ditolak. Schema-on-Read menyimpan data apa adanya dalam format aslinya, dan skema baru diinterpretasikan/diterapkan saat query engine membacanya — memberi fleksibilitas ingest maksimal (menerima format apa pun, termasuk struktur yang berkembang atau belum diketahui), dengan konsekuensi risiko kualitas data bergeser ke saat query dilakukan.`,
      en: "",
    },
    objective: {
      id: `Trade-off ini ada karena tidak ada satu pendekatan yang cocok untuk setiap tahap pipeline data — ingestion data mentah umumnya diuntungkan oleh fleksibilitas schema-on-read (jangan sampai kehilangan data hanya karena tidak sesuai bentuk yang ditentukan sebelumnya), sementara pelaporan bisnis yang sudah dikurasi diuntungkan oleh jaminan upfront dari schema-on-write (jangan sampai data buruk merusak laporan keuangan).`,
      en: "",
    },
    goal: {
      id: `Hasilnya adalah pemilihan yang tepat per lapisan pipeline — ingestion yang fleksibel sehingga tidak pernah menolak atau kehilangan data mentah, dikombinasikan dengan struktur yang ketat dan bisa dipercaya begitu data tersebut sampai di lapisan pelaporan yang kritikal bagi bisnis.`,
      en: "",
    },
    exampleImplementation: {
      id: `Ilustrasi perbandingan dua alur:

SoW: Define Schema → Validate on ingest → Reject mismatch
SoR: Accept all → Apply schema at query

\`\`\`sql
-- Schema-on-Write: BigQuery menolak data yang tidak sesuai skema tabel
CREATE TABLE dwh.klaim (
  klaim_id STRING NOT NULL,
  tanggal DATE NOT NULL,
  jumlah NUMERIC NOT NULL
);
-- insert dengan kolom tak dikenal akan ditolak

-- Schema-on-Read: query Parquet di GCS, skema baru diterapkan saat query
SELECT klaim_id, field_baru_yang_belum_ada_di_tabel
FROM EXTERNAL_QUERY('gcs_parquet_klaim');
\`\`\``,
      en: "",
    },
    exampleEnterprise: {
      id: `BigQuery (schema-on-write) di Bank Digital Nusa mewajibkan tabel klaim mengikuti skema yang sudah ditentukan sebelum data bisa masuk, sementara file Parquet di Google Cloud Storage (schema-on-read) memungkinkan tim analitik query field baru yang baru muncul dari sumber data tanpa perlu mengubah struktur tabel terlebih dahulu.`,
      en: "",
    },
    prosAndCons: {
      pros: {
        id: `- Schema-on-write memberi jaminan kualitas data yang kuat dan bisa diprediksi, ideal untuk pelaporan bisnis yang kritikal.
- Schema-on-read memberi fleksibilitas ingest maksimal sehingga tidak ada data mentah yang ditolak atau hilang.
- Menggunakan keduanya di lapisan pipeline yang berbeda memberi manfaat terbaik dari kedua pendekatan.
- Schema-on-read secara alami beradaptasi dengan struktur data yang berkembang atau belum diketahui di masa depan.`,
        en: "",
      },
      cons: {
        id: `- Schema-on-write bersifat rigid — data yang sah tapi tidak terduga akan ditolak sampai skemanya dimigrasi.
- Schema-on-read menggeser risiko kualitas data ke hilir, artinya data buruk atau tidak sesuai format bisa diam-diam merusak query di kemudian hari.
- Menjalankan kedua pendekatan sepanjang pipeline menambah kompleksitas arsitektural dalam menentukan di mana batasnya.
- Schema-on-read membutuhkan governance yang disiplin, kalau tidak akan sulit dipercaya apa yang sebenarnya ada di dalam lake.`,
        en: "",
      },
    },
  },
};
