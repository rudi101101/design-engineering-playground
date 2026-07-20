export const term = {
  id: "llm-data-pipeline",
  track: "data-engineering",
  category: "Modern/ML",
  color: "#4c1d95",
  icon: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z",
  simulation: "llmpipeline",
  tools: ["Vertex AI Gemini", "OpenAI API", "LangChain", "Instructor", "Pydantic"],
  prerequisites: [],
  related: ["vector-database"],
  name: { id: "LLM + Data Pipeline", en: "LLM + Data Pipeline" },
  content: {
    description: {
      id: "LLM + Data Pipeline adalah pola integrasi Large Language Model sebagai salah satu tahap transformasi di dalam pipeline data, khususnya untuk mengubah data tidak terstruktur (PDF, email, dokumen scan, teks bebas) menjadi data terstruktur yang bisa dimuat ke tabel dan dianalisis. Ini adalah kemampuan yang sebelumnya sangat sulit dicapai dengan pendekatan rule-based atau regex — LLM bisa 'membaca' dokumen dengan pemahaman kontekstual mirip manusia dan mengekstrak field yang relevan meski format dokumennya bervariasi.",
      en: "",
    },
    concept: {
      id: "Bayangkan LLM di dalam pipeline seperti mempekerjakan seorang staf data entry yang sangat cepat dan bisa membaca ribuan dokumen per menit, tapi staf ini kadang 'mengarang' jawaban kalau tidak yakin (halusinasi) — jadi setiap hasil kerjanya tetap perlu diperiksa oleh supervisor (proses validasi) sebelum dianggap final dan disimpan ke database resmi perusahaan.",
      en: "",
    },
    methodology: {
      id: "Dalam pipeline ini, LLM diperlakukan sebagai satu transformation step layaknya fungsi transformasi lain, hanya saja inputnya berupa teks atau PDF mentah dan outputnya diharapkan berupa JSON terstruktur sesuai schema yang ditentukan. Prompt dirancang untuk mengarahkan LLM mengekstrak field spesifik, dan library seperti Instructor atau Pydantic dipakai untuk memaksa output LLM mematuhi struktur data yang valid — jika LLM mengembalikan format yang tidak sesuai, sistem bisa meminta ulang atau menandai untuk review manual. Setelah output didapat, tetap perlu tahap validasi tambahan dan data quality check karena LLM bisa berhalusinasi, yaitu menghasilkan informasi yang terdengar masuk akal tapi sebenarnya tidak ada di dokumen sumber.",
      en: "",
    },
    objective: {
      id: "Pola ini muncul karena banyak data bisnis penting tersembunyi dalam format tidak terstruktur — dokumen PDF, email, catatan bebas — yang sulit diproses dengan pipeline data tradisional yang mengasumsikan input sudah terstruktur (CSV, tabel database, JSON rapi). Sebelum ada LLM, ekstraksi informasi dari dokumen semacam ini butuh proses manual yang lambat atau sistem OCR plus rule-based yang rapuh terhadap variasi format dokumen.",
      en: "",
    },
    goal: {
      id: "Hasil yang dicapai adalah proses ekstraksi data dari dokumen tidak terstruktur yang jauh lebih cepat dan scalable dibanding entry manual, dengan tetap menjaga akurasi lewat lapisan validasi terstruktur — targetnya data yang masuk ke tabel akhir sudah bersih dan bisa dipercaya, bukan sekadar 'tebakan' LLM mentah.",
      en: "",
    },
    exampleImplementation: {
      id: "Alur ekstraksi data terstruktur dari dokumen dengan LLM:\n\n1. Dokumen PDF/teks mentah masuk ke pipeline.\n2. Teks dikirim ke LLM API dengan prompt dan schema output yang jelas.\n3. Output JSON divalidasi terhadap schema yang diharapkan.\n4. Data quality check tambahan dijalankan (misalnya cek field wajib tidak kosong).\n5. Data yang lolos dimuat ke tabel terstruktur.\n\nContoh definisi schema output dengan Pydantic:\n\n```python\nfrom pydantic import BaseModel\nimport instructor\n\nclass DataKlaim(BaseModel):\n    diagnosis: str\n    nama_obat: list[str]\n    jumlah_tagihan: float\n\nclient = instructor.from_openai(openai_client)\nhasil = client.chat.completions.create(\n    model=\"gpt-4o\",\n    response_model=DataKlaim,\n    messages=[{\"role\": \"user\", \"content\": teks_pdf_dokter}],\n)\n```",
      en: "",
    },
    exampleEnterprise: {
      id: "Klinika Sehat membangun pipeline klaim asuransi yang menerima ribuan dokumen PDF hasil scan resep dokter setiap hari. Sebelumnya, staf harus mengetik ulang diagnosis, nama obat, dan jumlah tagihan secara manual dari tiap dokumen — proses yang lambat dan rawan salah ketik. Dengan LLM + Data Pipeline, sistem mengirim teks hasil OCR dari PDF ke Vertex AI Gemini, yang mengekstrak field diagnosis, obat, dan jumlah menjadi JSON terstruktur, lalu dimuat langsung ke BigQuery setelah lolos validasi — memangkas waktu proses dari puluhan menit per dokumen menjadi hitungan detik.",
      en: "",
    },
    prosAndCons: {
      pros: {
        id: "- Mampu mengekstrak data terstruktur dari dokumen tidak terstruktur dengan format bervariasi, sesuatu yang sulit dicapai rule-based\n- Mempercepat proses yang sebelumnya butuh entry manual dari puluhan menit menjadi hitungan detik per dokumen\n- Bisa beradaptasi dengan variasi format dokumen tanpa harus menulis ulang aturan ekstraksi setiap kali format berubah\n- Library seperti Instructor/Pydantic memaksa output tetap terstruktur meski sumbernya teks bebas",
        en: "",
      },
      cons: {
        id: "- LLM bisa berhalusinasi, menghasilkan data yang terdengar masuk akal tapi sebenarnya tidak akurat dari dokumen sumber\n- Biaya API LLM bisa signifikan pada skala volume dokumen yang besar dan perlu dipertimbangkan dalam desain pipeline\n- Butuh lapisan validasi dan data quality check ekstra yang tidak diperlukan pada pipeline data terstruktur biasa\n- Latency panggilan API LLM lebih tinggi dibanding transformasi data konvensional, sehingga kurang cocok untuk kebutuhan real-time yang sangat ketat",
        en: "",
      },
    },
  },
};
