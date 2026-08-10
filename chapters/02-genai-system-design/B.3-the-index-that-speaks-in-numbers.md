---
chapter_id: "B.3"
title: "The Index That Speaks in Numbers"
topic: "Vector databases"
track: genai
bloom_stage: ["apply", "analyze"]
est_read_minutes: 17
prerequisites: ["B.0", "B.2"]
teaching_goal: "Explain embeddings, ANN algorithms (HNSW, IVF), and decide when to use a vector DB vs. a traditional database."
primary_diagram: assets/diagrams/B.3/
common_misconception: "See chapter body"
status: stable
last_updated: 2026-08-10
---

# The Index That Speaks in Numbers

You have 10 million documents. Each one is a list of 1,536 numbers. You need to find the 10 most similar to a query, in 50 milliseconds. You cannot compare all 10 million. This is the problem vector databases were born to solve — and the math underneath is beautiful.

---

## Remember

**Embedding** — a vector (list of numbers) representing the meaning of text. **Vector database** — a database optimized for storing and searching embeddings. **ANN (Approximate Nearest Neighbor)** — algorithms that find *roughly* the closest vectors without comparing all of them. **HNSW** — a graph-based ANN algorithm (fast, accurate, memory-hungry). **IVF** — a cluster-based ANN algorithm (lower memory, slightly slower). **pgvector** — a Postgres extension for vector search.

---

## Understand

Embeddings convert text into vectors such that similar meanings produce similar vectors. 'The cat sat on the mat' and 'The feline rested on the rug' have different words but similar embeddings — because they mean similar things. This is the foundation of semantic search.

To find documents similar to a query: embed the query, then find the documents whose vectors are closest (by cosine similarity or Euclidean distance). The naive approach — compare the query vector to every document vector — works for 10K documents but dies at 10M. You need an index that finds *approximate* nearest neighbors without comparing everything.

**HNSW (Hierarchical Navigable Small World).** Builds a multi-layer graph where each vector is connected to its nearest neighbors. Search starts at the top layer (sparse, fast) and refines downward (dense, precise). Fast (milliseconds for millions of vectors), accurate (finds 95%+ of true nearest neighbors), but memory-hungry (the graph structure takes space). The default choice for most production vector DBs.

**IVF (Inverted File Index).** Partitions vectors into clusters. Search only examines the clusters closest to the query, not all vectors. Lower memory than HNSW, slightly less accurate, slightly slower. Better for very large datasets where memory is constrained.

**Vector database options (as of 2026):** Pinecone (managed, popular), Weaviate (open-source, feature-rich), Qdrant (open-source, Rust-based, fast), Milvus (open-source, scales to billions), pgvector (Postgres extension — use if you're already on Postgres and don't need a separate system).

---

## Apply

Choose a vector database for your use case:
- **<100K vectors, already on Postgres**: pgvector. No new infrastructure, good enough performance.
- **100K-10M vectors, want managed**: Pinecone. Zero ops, good performance, pay for convenience.
- **10M-1B vectors, want control**: Qdrant or Milvus (self-hosted) or Weaviate.
- **>1B vectors, specialized needs**: Milvus or a custom solution.

The 'do you actually need a vector DB?' test: if you have <10K vectors, brute-force search in memory is faster and simpler than any vector DB. Don't add infrastructure you don't need.

---

## Analyze

Vector search is approximate. HNSW with default parameters finds ~95% of the true top-10 nearest neighbors. For most applications (RAG, recommendation), this is fine — the 5% miss rate has minimal impact on end quality. For applications where exactness matters (legal search, compliance), use brute-force or higher-accuracy ANN settings, accepting the latency cost.

---

## Evaluate

Vector databases are infrastructure, not magic. They solve one problem: fast similarity search over embeddings. They don't solve: chunking (see B.4), reranking (see B.5), embedding quality (that's the embedding model's job), or retrieval relevance (that's a system design problem). Choosing the right vector DB is important, but it's 10% of the RAG quality equation. The other 90% is chunking, embeddings, and reranking.

---

## Create

Design a vector search system for a 10M-document corpus. What embedding model? What vector DB? What ANN algorithm and parameters? How do you handle updates (new documents, deleted documents)? How do you measure retrieval quality?

---

## A common misconception

**'Vector databases replaced traditional databases.'** No. Vector databases are a specialized tool for similarity search. They're terrible at everything else: filtering ('find documents from 2024'), joins ('find the author of this document'), transactions ('update this document and its metadata atomically'). Production systems use both: a traditional database for structured data, a vector database for semantic search. They complement, not replace.

---

## Explain it back

An embedding is _____. Vector databases are optimized for _____. The two main ANN algorithms are _____ (which works by _____) and _____ (which works by _____). The 'do you actually need a vector DB?' test is _____. Vector DBs are _____% of the RAG quality equation; the rest is _____.

---

## Further reading

- **Malkov & Yashunin (2020), "Efficient and robust approximate nearest neighbor search using HNSW," IEEE TPAMI** — the HNSW paper. (arXiv:1603.09320, 2016)
- **Johnson, Douze & Jégou (2017), "Billion-scale similarity search with GPUs"** — the FAISS paper.
- **Pinecone Learning Center** — practical vector search guides.
