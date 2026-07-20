export const term = {
  id: "vector-database",
  track: "data-engineering",
  category: "Modern/ML",
  color: "#5b21b6",
  icon: "M18 20V10M12 20V4M6 20v-6",
  simulation: "vectordb",
  tools: ["Pinecone", "Weaviate", "Qdrant", "pgvector (PostgreSQL)", "BigQuery Vector Search"],
  prerequisites: [],
  related: ["llm-data-pipeline", "database-index"],
  name: { id: "Vector Database", en: "Vector Database" },
  content: {
    description: {
      id: "Vector database adalah database yang dirancang khusus untuk menyimpan dan mencari embedding vector — representasi numerik dari teks, gambar, atau data lain yang dihasilkan oleh model machine learning. Berbeda dari database tradisional yang mencari berdasarkan kecocokan persis (exact match, misalnya `WHERE id = 5`), vector database mencari berdasarkan kemiripan makna (similarity search) — menemukan vector-vector yang 'paling dekat' secara matematis dengan vector query. Teknologi ini menjadi fondasi penting di era aplikasi berbasis LLM, khususnya untuk pola Retrieval-Augmented Generation (RAG) di mana model bahasa perlu mencari potongan informasi relevan dari basis pengetahuan yang sangat besar.",
      en: "A vector database is a database specifically designed to store and search embedding vectors — numerical representations of text, images, or other data produced by machine learning models. Unlike traditional databases that search by exact match (e.g. `WHERE id = 5`), a vector database searches by semantic similarity — finding vectors that are mathematically 'closest' to the query vector. This technology has become a critical foundation in the era of LLM-based applications, especially for the Retrieval-Augmented Generation (RAG) pattern, where a language model needs to find relevant snippets of information from a very large knowledge base.",
    },
    concept: {
      id: "Bayangkan vector database seperti pustakawan ahli yang tidak mencari buku berdasarkan judul persis, tapi berdasarkan 'kemiripan tema'. Kalau kamu bilang 'saya ingin buku tentang petualangan di laut', pustakawan ini tidak butuh judul yang sama persis — dia paham makna di balik permintaanmu dan bisa merekomendasikan buku tentang kapal bajak laut atau eksplorasi samudra meski judulnya sama sekali berbeda. Vector database melakukan hal serupa secara matematis: mengubah makna menjadi koordinat di ruang multi-dimensi, lalu mencari koordinat-koordinat yang berdekatan.",
      en: "Think of a vector database like an expert librarian who doesn't search for books by exact title, but by 'thematic similarity'. If you say 'I want a book about ocean adventure', this librarian doesn't need the exact same title — they understand the meaning behind your request and can recommend a book about pirate ships or ocean exploration even if the title is completely different. A vector database does something similar mathematically: turning meaning into coordinates in a multi-dimensional space, then finding coordinates that are close together.",
    },
    methodology: {
      id: "Teks atau gambar pertama-tama diubah menjadi vector angka (embedding) menggunakan model machine learning khusus (misalnya model embedding dari OpenAI atau Sentence Transformers) — setiap vector biasanya punya ratusan hingga ribuan dimensi. Vector database menyimpan vector ini beserta index khusus seperti HNSW (Hierarchical Navigable Small World) atau IVF (Inverted File Index) yang memungkinkan pencarian Approximate Nearest Neighbor (ANN) dalam skala jutaan vector tanpa harus membandingkan satu per satu ke seluruh dataset. Kemiripan dihitung menggunakan cosine similarity, dot product, atau euclidean distance. Alurnya: Text/Image → Embedding Model → Vector [0.2, 0.8, ...] → Store → Query vector → ANN search → Top-K similar.",
      en: "Text or images are first converted into number vectors (embeddings) using a dedicated machine learning model (e.g. an embedding model from OpenAI or Sentence Transformers) — each vector typically has hundreds to thousands of dimensions. A vector database stores these vectors along with a specialized index like HNSW (Hierarchical Navigable Small World) or IVF (Inverted File Index), which enables Approximate Nearest Neighbor (ANN) search at a scale of millions of vectors without comparing one by one against the entire dataset. Similarity is computed using cosine similarity, dot product, or euclidean distance. The flow: Text/Image → Embedding Model → Vector [0.2, 0.8, ...] → Store → Query vector → ANN search → Top-K similar.",
    },
    objective: {
      id: "Pencarian berbasis kata kunci tradisional (seperti `LIKE '%kata%'`) gagal menangkap makna — pencarian 'mobil murah' tidak akan menemukan dokumen yang membahas 'kendaraan terjangkau' meski maknanya sama persis. Vector database menyelesaikan masalah ini secara fundamental dengan mencari berdasarkan makna, bukan kecocokan teks literal, sehingga aplikasi pencarian dan chatbot bisa memahami maksud pengguna meski kata-kata yang dipakai berbeda dari yang ada di basis data.",
      en: "Traditional keyword-based search (like `LIKE '%word%'`) fails to capture meaning — searching for 'cheap car' won't find a document discussing 'affordable vehicle' even though the meaning is identical. Vector databases fundamentally solve this by searching based on meaning rather than literal text matches, so search applications and chatbots can understand user intent even when the words used differ from what's in the knowledge base.",
    },
    goal: {
      id: "Hasil yang dicapai adalah pencarian yang memahami konteks dan makna, bukan sekadar kecocokan kata kunci, kemampuan menangani jutaan hingga miliaran vector dengan latency pencarian dalam hitungan milidetik berkat indexing ANN, dan fondasi teknis untuk aplikasi RAG di mana model bahasa bisa 'membaca' basis pengetahuan eksternal yang jauh lebih besar dari context window-nya sendiri.",
      en: "The outcome is search that understands context and meaning rather than mere keyword matching, the ability to handle millions to billions of vectors with millisecond-scale search latency thanks to ANN indexing, and the technical foundation for RAG applications where a language model can 'read' an external knowledge base far larger than its own context window.",
    },
    exampleImplementation: {
      id: "Membangun pencarian semantik sederhana dengan pgvector di PostgreSQL:\n\n```sql\nCREATE EXTENSION vector;\n\nCREATE TABLE documents (\n  id SERIAL PRIMARY KEY,\n  content TEXT,\n  embedding VECTOR(1536)  -- dimensi sesuai model embedding yang dipakai\n);\n\n-- Insert dengan embedding hasil dari model (contoh disederhanakan)\nINSERT INTO documents (content, embedding)\nVALUES ('Cara reset password akun', '[0.12, 0.98, ...]');\n\n-- Cari 5 dokumen paling mirip dengan query embedding\nSELECT content, embedding <=> '[0.15, 0.91, ...]' AS distance\nFROM documents\nORDER BY distance\nLIMIT 5;\n```\n\nOperator `<=>` menghitung cosine distance antara embedding tersimpan dan embedding query, lalu hasil diurutkan dari yang paling mirip.",
      en: "Building simple semantic search with pgvector in PostgreSQL:\n\n```sql\nCREATE EXTENSION vector;\n\nCREATE TABLE documents (\n  id SERIAL PRIMARY KEY,\n  content TEXT,\n  embedding VECTOR(1536)  -- dimension matches the embedding model used\n);\n\n-- Insert with embedding produced by a model (simplified example)\nINSERT INTO documents (content, embedding)\nVALUES ('How to reset your account password', '[0.12, 0.98, ...]');\n\n-- Find the 5 documents most similar to a query embedding\nSELECT content, embedding <=> '[0.15, 0.91, ...]' AS distance\nFROM documents\nORDER BY distance\nLIMIT 5;\n```\n\nThe `<=>` operator computes the cosine distance between the stored embedding and the query embedding, and results are ordered from most to least similar.",
    },
    exampleEnterprise: {
      id: "Fintech Cepat membangun chatbot layanan pelanggan yang harus menjawab pertanyaan dari ribuan dokumen kebijakan internal. Setiap dokumen diubah menjadi embedding dan disimpan di Pinecone. Ketika pengguna bertanya 'kenapa transaksi saya ditolak', sistem mengubah pertanyaan itu menjadi vector, mencari dokumen paling mirip secara makna (bukan hanya yang mengandung kata 'ditolak'), lalu memberi konteks itu ke LLM untuk menghasilkan jawaban yang akurat dan relevan.",
      en: "Fintech Cepat builds a customer service chatbot that must answer questions from thousands of internal policy documents. Every document is converted into an embedding and stored in Pinecone. When a user asks 'why was my transaction declined', the system converts that question into a vector, finds the documents most similar in meaning (not just ones containing the word 'declined'), then feeds that context to an LLM to produce an accurate, relevant answer.",
    },
    prosAndCons: {
      pros: {
        id: "- Pencarian berdasarkan makna, bukan sekadar kecocokan kata kunci literal\n- Bisa menangani skala jutaan hingga miliaran vector dengan latency rendah berkat ANN indexing\n- Fondasi esensial untuk aplikasi RAG dan chatbot berbasis LLM modern\n- Mendukung multi-modal search (teks, gambar, audio) selama ada model embedding yang sesuai",
        en: "- Search based on meaning, not just literal keyword matching\n- Can handle millions to billions of vectors with low latency thanks to ANN indexing\n- An essential foundation for RAG applications and modern LLM-based chatbots\n- Supports multi-modal search (text, image, audio) as long as a suitable embedding model exists",
      },
      cons: {
        id: "- ANN search bersifat approximate — ada trade-off kecil antara kecepatan dan akurasi hasil\n- Kualitas hasil pencarian sangat bergantung pada kualitas model embedding yang dipakai\n- Menambah komponen infrastruktur baru yang perlu dikelola terpisah dari database utama\n- Biaya penyimpanan bisa signifikan untuk dataset besar karena setiap vector punya ratusan-ribuan dimensi",
        en: "- ANN search is approximate — there's a small trade-off between speed and result accuracy\n- Search result quality depends heavily on the quality of the embedding model used\n- Adds a new infrastructure component that needs to be managed separately from the main database\n- Storage cost can be significant for large datasets since each vector has hundreds to thousands of dimensions",
      },
    },
  },
};
