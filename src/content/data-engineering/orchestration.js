export const term = {
  id: "orchestration",
  track: "data-engineering",
  category: "Pipeline",
  color: "#84cc16",
  icon: "M12 22V12M12 12L4 7M12 12l8-5",
  simulation: "dag",
  tools: ["Apache Airflow", "Cloud Composer", "Prefect", "Dagster", "Mage.ai"],
  prerequisites: [],
  related: [],
  name: { id: "Orchestration (DAG)", en: "Orchestration (DAG)" },
  content: {
    description: {
      id: `Orchestration adalah praktik mengelola dependency, penjadwalan, retry, dan alerting antar task-task yang membentuk sebuah pipeline data, biasanya dimodelkan sebagai DAG (Directed Acyclic Graph). Ini penting karena tanpa orkestrasi yang layak, sebuah pipeline dengan puluhan langkah yang saling bergantung menjadi mustahil dijalankan dan didiagnosis secara manual — orkestrator menjadi "otak" yang menjaga semua langkah berjalan sesuai urutan dan aturan yang tepat.`,
      en: "",
    },
    concept: {
      id: `Bayangkan seorang konduktor orkestra: setiap musisi (task) harus masuk di waktu yang tepat, hanya setelah musisi tertentu lainnya selesai memainkan bagiannya, dan jika ada yang salah, konduktor harus segera tahu dan memutuskan apakah berhenti, mengulang, atau lanjut. Kamu tidak bisa membiarkan setiap musisi mulai bermain kapan pun sesukanya — orkestrator adalah konduktor bagi pipeline data.`,
      en: "",
    },
    methodology: {
      id: `Sebuah pipeline dimodelkan sebagai DAG di mana setiap node adalah task dan setiap edge adalah dependency (task B menunggu task A berhasil dulu). Orkestrator menangani logika retry saat task gagal, alerting berbasis SLA saat sebuah task berjalan terlalu lama, backfilling untuk menjalankan ulang periode historis, serta cross-pipeline dependency (satu DAG menunggu DAG lain selesai lebih dulu).`,
      en: "",
    },
    objective: {
      id: `Orchestration hadir untuk mengatasi masalah koordinasi pada pipeline kompleks dan bertahap dengan task-task saling bergantung lintas sistem berbeda — tanpa orkestrator pusat, manajemen dependency, retry, dan alerting kegagalan harus dibuat manual dan menjadi rapuh serta sulit dipelihara seiring pipeline bertambah besar.`,
      en: "",
    },
    goal: {
      id: `Hasilnya adalah pipeline yang berjalan andal sesuai jadwal, otomatis melakukan retry terhadap kegagalan sementara, mengirim alert ke orang yang tepat saat ada masalah, dan bisa di-backfill atau dijalankan ulang untuk periode historis tanpa intervensi manual.`,
      en: "",
    },
    exampleImplementation: {
      id: `Alur: Schedule Trigger → Parse DAG → Task A → Task B (waits A) → C (waits A+B) → Success/Alert.

1. DAG didefinisikan dengan task dan dependency-nya dalam kode.
2. Orkestrator men-trigger DAG sesuai jadwal, menjalankan task sesuai urutan dependency.
3. Jika sebuah task gagal, orkestrator melakukan retry otomatis sesuai konfigurasi, dan mengirim alert jika retry tetap gagal.

\`\`\`python
# ilustrasi DAG sederhana dengan Airflow
with DAG("pipeline_klaim", schedule="0 2 * * *") as dag:
    ingest = PythonOperator(task_id="ingest_pdf", python_callable=ingest_pdf)
    extract = PythonOperator(task_id="llm_extract", python_callable=llm_extract)
    dq_check = PythonOperator(task_id="dq_check", python_callable=run_dq_check)
    load = BigQueryInsertJobOperator(task_id="load_bq", configuration={...})

    ingest >> extract >> dq_check >> load
\`\`\``,
      en: "",
    },
    exampleEnterprise: {
      id: `Grup Meranti menggunakan Cloud Composer untuk mengorkestrasi alur pipeline: ingest dokumen PDF, ekstraksi data dengan LLM, pengecekan kualitas data, load ke BigQuery, lalu notifikasi otomatis ke Slack jika ada kegagalan di salah satu tahap.`,
      en: "",
    },
    prosAndCons: {
      pros: {
        id: `- Manajemen dependency otomatis untuk pipeline multi-tahap yang kompleks.
- Retry dan alerting bawaan mengurangi kerja manual saat terjadi kegagalan.
- Dukungan backfill membuat reprocessing periode historis jadi mudah dilakukan.
- Visualisasi DAG meningkatkan observability dan memudahkan debugging alur pipeline.`,
        en: "",
      },
      cons: {
        id: `- Menambah satu sistem baru yang perlu dioperasikan dan dipantau uptime-nya sendiri.
- Ada learning curve untuk mendefinisikan DAG dengan benar, terutama yang dinamis/terparameterisasi.
- Bisa menjadi single point of failure jika tidak disiapkan dengan redundansi yang memadai.
- Debugging tetap perlu masuk ke log masing-masing task/sistem, orkestrator hanya memberi gambaran level atas.`,
        en: "",
      },
    },
  },
};
