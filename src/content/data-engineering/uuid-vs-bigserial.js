export const term = {
  id: "uuid-vs-bigserial",
  track: "data-engineering",
  category: "DB Fundamentals",
  color: "#f9a8d4",
  icon: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5",
  simulation: "uuid",
  tools: ["PostgreSQL BIGSERIAL", "UUID v4 (gen_random_uuid)", "UUID v7", "ULID", "NanoID"],
  prerequisites: ["sequence-auto-increment"],
  related: ["surrogate-key-vs-natural-key", "sharding"],
  name: { id: "UUID vs BIGSERIAL", en: "" },
  content: {
    description: {
      id: "Ini adalah keputusan desain fundamental soal strategi ID: UUID adalah identifier 128-bit yang secara praktis dijamin unik secara global tanpa perlu koordinasi terpusat, cocok untuk sistem terdistribusi di mana banyak node harus bisa membuat ID sendiri-sendiri tanpa saling bertanya. BIGSERIAL adalah integer 64-bit sekuensial yang dihasilkan satu sumber pusat (sequence di satu database), kompak dan sangat efisien untuk index tapi butuh koordinasi terpusat itu tadi. Pilihan antara keduanya bukan soal mana yang \"lebih baik\" secara universal, tapi soal trade-off yang cocok dengan arsitektur sistem: monolitik dengan satu database vs arsitektur microservice yang tersebar.",
      en: "",
    },
    concept: {
      id: "Bayangkan BIGSERIAL seperti nomor antrean di satu loket bank — rapi, berurutan, dan sangat efisien untuk dicatat, tapi hanya bisa dikeluarkan oleh mesin nomor yang satu itu, jadi kalau ada banyak cabang bank yang perlu keluarkan nomor sendiri-sendiri, mereka harus terus-menerus telepon ke pusat supaya nomornya tidak bentrok. UUID seperti nomor paspor internasional — setiap negara (setiap node/service) bisa menerbitkan paspornya sendiri secara independen dengan format acak yang panjang, dan hampir mustahil dua paspor punya nomor yang sama meski diterbitkan di ujung dunia yang berbeda tanpa saling koordinasi sama sekali.",
      en: "",
    },
    methodology: {
      id: "UUID v4 dibuat sepenuhnya dari nilai acak (random), yang membuatnya tidak bisa ditebak tapi juga berarti urutan penulisannya ke index B-tree jadi acak — ini bisa merusak performa index karena database harus menulis di lokasi-lokasi yang tersebar, bukan selalu di ujung seperti nilai sekuensial. UUID v7 mengatasi masalah ini dengan menyisipkan komponen timestamp di awal nilainya, sehingga tetap unik secara global tapi juga time-ordered — jauh lebih ramah terhadap index dibanding v4. BIGSERIAL sebaliknya murni sekuensial lewat `NEXTVAL` pada sequence pusat, menghasilkan penulisan index yang selalu di ujung (append-only), sangat efisien untuk B-tree, tapi setiap generate nilai baru harus melalui satu sumber sequence yang sama, yang jadi bottleneck kalau sistemnya terdistribusi di banyak node independen.",
      en: "",
    },
    objective: {
      id: "Trade-off ini penting dipahami karena arsitektur sistem modern makin sering terdistribusi — microservice, sistem event-driven, sinkronisasi multi-region — di mana ID harus bisa dibuat secara independen tanpa round-trip ke satu sumber pusat. Di sisi lain, sistem monolitik dengan satu database tetap sangat diuntungkan oleh kesederhanaan dan performa index BIGSERIAL, sehingga pilihan yang salah — memakai UUID acak di tempat yang tidak butuh, atau memaksa BIGSERIAL di sistem terdistribusi — sama-sama bisa menimbulkan masalah performa atau kompleksitas yang tidak perlu.",
      en: "",
    },
    goal: {
      id: "Tujuannya adalah memilih strategi ID yang selaras dengan topologi sistem: BIGSERIAL untuk performa index maksimal di database tunggal, atau UUID (idealnya v7 demi index-friendliness) untuk keunikan tanpa koordinasi di sistem terdistribusi — bukan memilih salah satu secara default tanpa mempertimbangkan konteks arsitektur yang sebenarnya.",
      en: "",
    },
    exampleImplementation: {
      id: "Membandingkan kedua strategi dalam definisi tabel yang berbeda konteks penggunaannya.\n\n1. Sistem monolitik dengan satu PostgreSQL: gunakan BIGSERIAL untuk primary key internal.\n2. Sistem microservice yang menerbitkan event ke banyak konsumer terdistribusi: gunakan UUID v7 agar tiap service bisa generate event_id sendiri tanpa koordinasi.\n\n```sql\n-- Monolitik: BIGSERIAL, index B-tree sangat efisien\nCREATE TABLE pasien (\n  patient_id BIGSERIAL PRIMARY KEY,\n  nama TEXT NOT NULL\n);\n\n-- Terdistribusi: UUID v7, time-ordered, aman digenerate di banyak node\nCREATE TABLE event_log (\n  event_id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),\n  service_name TEXT NOT NULL,\n  payload JSONB,\n  created_at TIMESTAMPTZ DEFAULT now()\n);\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Digital Motor Group menjalankan arsitektur hybrid: microservice mereka yang menangani event dari berbagai sensor kendaraan terdistribusi di banyak region memakai UUID v7 sebagai `event_id`, karena tiap instance service di tiap region harus bisa menghasilkan ID sendiri tanpa harus bolak-balik ke satu database pusat yang jadi bottleneck. Sementara itu, sistem inti monolitik mereka yang menyimpan data pasien/pelanggan di satu PostgreSQL tetap memakai `BIGSERIAL patient_id`, karena di sana tidak ada kebutuhan koordinasi terdistribusi dan mereka ingin performa index B-tree yang maksimal untuk query volume tinggi.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- UUID memungkinkan generate ID sepenuhnya independen di banyak node tanpa risiko konflik, ideal untuk sistem terdistribusi\n- BIGSERIAL menghasilkan index B-tree yang jauh lebih efisien karena penulisan selalu berurutan di ujung index\n- UUID v7 menggabungkan keunggulan keduanya — unik secara global sekaligus time-ordered untuk performa index yang lebih baik dari v4\n- BIGSERIAL jauh lebih hemat ruang (8 byte) dibanding UUID (16 byte), signifikan pada tabel dengan miliaran baris",
        en: "",
      },
      cons: {
        id: "- UUID v4 yang sepenuhnya acak bisa merusak performa index B-tree karena pola penulisan yang tersebar, bukan sekuensial\n- BIGSERIAL butuh satu sumber sequence terpusat, jadi kurang cocok untuk arsitektur microservice yang perlu generate ID independen\n- UUID memakan dua kali lebih banyak ruang storage dibanding BIGSERIAL, berdampak pada ukuran index dan biaya storage jangka panjang\n- Migrasi dari satu strategi ID ke strategi lain di tabel yang sudah besar dan production sangat mahal dan berisiko, jadi keputusan ini idealnya diambil di awal desain",
        en: "",
      },
    },
  },
};
