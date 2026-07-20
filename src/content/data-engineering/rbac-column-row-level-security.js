export const term = {
  id: "rbac-column-row-level-security",
  track: "data-engineering",
  category: "Security",
  color: "#dc2626",
  icon: "M3 11l19-9-9 19-2-8-8-2z",
  simulation: "rbac",
  tools: ["BigQuery IAM", "Dataplex Policy Tags", "Snowflake RLS", "Apache Ranger"],
  prerequisites: [],
  related: ["data-masking-anonymization", "encryption"],
  name: { id: "RBAC & Column/Row-Level Security", en: "RBAC & Column/Row-Level Security" },
  content: {
    description: {
      id: "RBAC (Role-Based Access Control) adalah model kontrol akses di mana izin diberikan berdasarkan peran (role) pengguna, bukan per individu satu per satu — memudahkan pengelolaan akses saat organisasi tumbuh. Di atas RBAC, dua teknik tambahan memperhalus kontrol: Column-Level Security (CLS) menyembunyikan kolom sensitif tertentu (misalnya nomor identitas) dari role yang tidak berwenang, sementara Row-Level Security (RLS) memfilter baris data sehingga setiap pengguna hanya melihat baris yang relevan dengan mereka (misalnya hanya data cabangnya sendiri) — semuanya diterapkan secara otomatis oleh database, bukan mengandalkan aplikasi untuk memfilter dengan benar.",
      en: "RBAC (Role-Based Access Control) is an access control model where permissions are granted based on a user's role, not individually per person — making access management far easier as an organization grows. On top of RBAC, two additional techniques refine control further: Column-Level Security (CLS) hides specific sensitive columns (like national ID numbers) from unauthorized roles, while Row-Level Security (RLS) filters rows so each user only sees rows relevant to them (e.g. only their own branch's data) — all enforced automatically by the database itself, not relying on the application to filter correctly.",
    },
    concept: {
      id: "Bayangkan RBAC + CLS + RLS seperti sistem keamanan gedung kantor bertingkat. RBAC adalah kartu akses yang menentukan lantai mana yang boleh kamu masuki berdasarkan jabatanmu (role). CLS seperti ruangan di dalam satu lantai yang pintunya sengaja dikunci untuk role tertentu — semua orang di lantai itu bisa masuk ruangan lain, tapi ruang arsip rahasia tetap terkunci. RLS seperti loker pribadi — semua orang di ruangan yang sama, tapi masing-masing hanya bisa membuka loker miliknya sendiri, bukan loker orang lain di ruangan itu.",
      en: "Think of RBAC + CLS + RLS like a multi-floor office building's security system. RBAC is the access card that determines which floor you're allowed onto, based on your role. CLS is like a room on that floor whose door is deliberately locked for certain roles — everyone on that floor can enter other rooms, but the confidential archive room stays locked. RLS is like a personal locker — everyone shares the same room, but each person can only open their own locker, not anyone else's in that room.",
    },
    methodology: {
      id: "CLS diimplementasikan dengan menandai kolom sensitif menggunakan policy tag, lalu mengikat policy tag tersebut ke role tertentu — kolom itu otomatis disembunyikan atau ditampilkan sebagai redacted untuk role tanpa izin. RLS diimplementasikan dengan mendefinisikan filter policy yang secara otomatis menyuntikkan klausa `WHERE` tambahan ke setiap query berdasarkan identitas pengguna yang sedang login — misalnya `WHERE branch_id = current_user.branch_id`. Kedua mekanisme ini berjalan di level database/warehouse, sehingga berlaku konsisten untuk semua cara mengakses data (BI tool, query manual, API) tanpa bisa dilewati. Alurnya: User Query → IAM Auth → Column filter (CLS) → Row filter (RLS) → Return filtered.",
      en: "CLS is implemented by tagging sensitive columns with a policy tag, then binding that policy tag to specific roles — the column is automatically hidden or shown as redacted for roles without permission. RLS is implemented by defining a filter policy that automatically injects an extra `WHERE` clause into every query based on the identity of the currently logged-in user — e.g. `WHERE branch_id = current_user.branch_id`. Both mechanisms run at the database/warehouse level, so they apply consistently across every way data is accessed (BI tool, manual query, API) without being bypassable. The flow: User Query → IAM Auth → Column filter (CLS) → Row filter (RLS) → Return filtered.",
    },
    objective: {
      id: "Mengandalkan aplikasi untuk memfilter data sensitif secara manual berisiko tinggi — satu bug di satu endpoint saja bisa membocorkan seluruh data ke pengguna yang tidak berwenang, dan setiap tool baru yang mengakses database (BI tool baru, script ad-hoc) harus mengimplementasikan ulang logika filter yang sama. RBAC/CLS/RLS menyelesaikan ini dengan memindahkan enforcement ke level database, sehingga aturan akses berlaku otomatis di mana pun dan bagaimanapun data diakses, tanpa bergantung pada kedisiplinan setiap developer aplikasi.",
      en: "Relying on the application to manually filter sensitive data is high-risk — a single bug in one endpoint can leak all the data to unauthorized users, and every new tool accessing the database (a new BI tool, an ad-hoc script) has to re-implement the same filter logic. RBAC/CLS/RLS solve this by moving enforcement to the database level, so access rules apply automatically wherever and however the data is accessed, without depending on every application developer's discipline.",
    },
    goal: {
      id: "Hasil yang dicapai adalah kepatuhan terhadap regulasi perlindungan data (seperti UU PDP) karena data sensitif tidak pernah terekspos ke pihak yang tidak berwenang, kontrol akses yang konsisten di semua titik akses data tanpa celah, dan pengurangan risiko kebocoran data karena enforcement tidak bergantung pada logika aplikasi yang bisa saja punya bug.",
      en: "The outcome is compliance with data protection regulations (like GDPR or local equivalents) since sensitive data is never exposed to unauthorized parties, consistent access control across every data access point with no gaps, and reduced data-leak risk since enforcement doesn't depend on application logic that could have bugs.",
    },
    exampleImplementation: {
      id: "Menerapkan CLS dan RLS di BigQuery:\n\n```sql\n-- Column-Level Security: tag kolom sensitif dengan policy tag \"PII\"\nALTER TABLE claims ALTER COLUMN national_id\n  SET OPTIONS (policy_tags = 'projects/my-project/locations/us/taxonomies/1/policyTags/pii-tag');\n\n-- Row-Level Security: analyst hanya lihat baris cabangnya sendiri\nCREATE ROW ACCESS POLICY branch_filter\nON claims\nGRANT TO ('role:analyst')\nFILTER USING (branch_id = SESSION_USER_BRANCH());\n```\n\nSetelah diterapkan, seorang analyst yang login dan menjalankan `SELECT * FROM claims` hanya akan melihat baris dari cabangnya sendiri, dan kolom `national_id` akan tersembunyi otomatis — tanpa perlu mengubah query apa pun di sisi aplikasi.",
      en: "Applying CLS and RLS in BigQuery:\n\n```sql\n-- Column-Level Security: tag a sensitive column with a \"PII\" policy tag\nALTER TABLE claims ALTER COLUMN national_id\n  SET OPTIONS (policy_tags = 'projects/my-project/locations/us/taxonomies/1/policyTags/pii-tag');\n\n-- Row-Level Security: analysts only see rows from their own branch\nCREATE ROW ACCESS POLICY branch_filter\nON claims\nGRANT TO ('role:analyst')\nFILTER USING (branch_id = SESSION_USER_BRANCH());\n```\n\nOnce applied, an analyst who logs in and runs `SELECT * FROM claims` will only see rows from their own branch, and the `national_id` column will be hidden automatically — without needing to change any query on the application side.",
    },
    exampleEnterprise: {
      id: "PT Nusantara Asuransi punya 200 analyst tersebar di 40 cabang yang semuanya mengakses tabel `claims` yang sama di BigQuery. Dengan RLS, setiap analyst otomatis hanya melihat klaim dari cabangnya sendiri tanpa perlu tabel terpisah per cabang. Dengan CLS, kolom nomor identitas pasien disembunyikan dari semua role kecuali tim compliance, sehingga bahkan jika seorang analyst secara tidak sengaja membagikan hasil query-nya, data identitas sensitif tetap tidak pernah terekspos.",
      en: "PT Nusantara Asuransi has 200 analysts spread across 40 branches, all accessing the same `claims` table in BigQuery. With RLS, every analyst automatically sees only claims from their own branch without needing separate per-branch tables. With CLS, the patient ID number column is hidden from every role except the compliance team, so even if an analyst accidentally shares their query results, sensitive identity data is never exposed.",
    },
    prosAndCons: {
      pros: {
        id: "- Enforcement di level database — konsisten di semua cara akses data (BI tool, query manual, API)\n- Mengurangi risiko kebocoran data dibanding mengandalkan filter di kode aplikasi\n- Memudahkan kepatuhan terhadap regulasi perlindungan data pribadi\n- Skalabel — satu tabel bisa dipakai bersama tanpa perlu duplikasi per role/cabang",
        en: "- Enforced at the database level — consistent across every way data is accessed (BI tool, manual query, API)\n- Reduces data-leak risk compared to relying on application-level filtering\n- Eases compliance with personal data protection regulations\n- Scalable — one table can be shared without needing per-role/per-branch duplication",
      },
      cons: {
        id: "- Setup awal policy tag dan filter policy butuh perencanaan matang agar tidak salah konfigurasi\n- Query plan bisa menjadi lebih kompleks karena filter tambahan disuntikkan otomatis\n- Debugging query yang 'tidak mengembalikan data' bisa membingungkan jika RLS lupa dicek dulu\n- Tidak semua database/warehouse mendukung CLS/RLS secara native dengan kemampuan yang sama",
        en: "- Initial policy tag and filter policy setup requires careful planning to avoid misconfiguration\n- Query plans can become more complex since extra filters are injected automatically\n- Debugging a query that 'returns no data' can be confusing if RLS isn't checked first\n- Not every database/warehouse supports CLS/RLS natively with the same capabilities",
      },
    },
  },
};
