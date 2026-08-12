---
chapter_id: "B.3"
title: "The Index That Speaks in Numbers"
topic: "Vector databases"
track: genai
bloom_stage: ["remember", "understand", "apply", "analyze", "evaluate", "create"]
est_read_minutes: 17
prerequisites: ["B.0", "B.2"]
teaching_goal: "Explain embeddings, ANN algorithms (HNSW, IVF), and decide when to use a vector DB vs. a traditional database."
status: stable
last_updated: 2026-08-12
---

# The Index That Speaks in Numbers

You have 10 million documents. Each one is a list of 1,536 numbers. You need to find the 10 most similar to a query, in 50 milliseconds. You cannot compare all 10 million. This is the problem vector databases were born to solve.

The math underneath is beautiful: embeddings convert text into vectors (lists of numbers) such that similar meanings produce similar vectors. "The cat sat on the mat" and "The feline rested on the rug" have different words but similar embeddings — because they mean similar things. This is the foundation of semantic search.

---

## Remember — name it

- **Embedding** — a vector (list of numbers, typically 768-3,072 dimensions) representing the meaning of text. Texts with similar meanings get similar vectors. Produced by embedding models like OpenAI text-embedding-3-small (1,536 dims) or BAAI bge-large-en-v1.5 (1,024 dims).
- **Vector database** — a database optimized for storing and searching embeddings. Finds the K most similar vectors to a query vector. Options: Pinecone, Weaviate, Qdrant, Milvus, pgvector.
- **ANN (Approximate Nearest Neighbor)** — algorithms that find *roughly* the closest vectors without comparing all of them. Trades exactness for speed. HNSW and IVF are the two most common.
- **HNSW (Hierarchical Navigable Small World)** — a graph-based ANN algorithm. Fast, accurate, memory-hungry. The default choice for most production vector DBs. (Malkov & Yashunin, 2020)
- **IVF (Inverted File Index)** — a cluster-based ANN algorithm. Lower memory, slightly slower. Better for very large datasets.
- **Cosine similarity** — the metric used to compare vectors. Ranges from -1 (opposite) to 1 (identical). 0.9+ means very similar.

---

## Understand — the problem and the solution

### The problem: semantic search at scale

To find documents similar to a query: embed the query, then find the documents whose vectors are closest (by cosine similarity). The naive approach — compare the query vector to every document vector — works for 10K documents but dies at 10M. Comparing 10M vectors of 1,536 dimensions takes seconds, not milliseconds.

### The solution: ANN indexing

ANN algorithms build data structures that find *approximate* nearest neighbors without comparing every vector. They trade exactness for speed: HNSW with default parameters finds ~95% of the true top-10 nearest neighbors in milliseconds, not seconds.

### HNSW (Hierarchical Navigable Small World)

Builds a multi-layer graph where each vector is connected to its nearest neighbors. Search starts at the top layer (sparse, fast) and refines downward (dense, precise). Think of it like zooming in on a map: start at the country level, zoom to the city, zoom to the street.

- **Pros**: fast (milliseconds for millions of vectors), accurate (95%+ recall), well-supported (Pinecone, Weaviate, Qdrant all use HNSW).
- **Cons**: memory-hungry (the graph structure takes space, typically 1.5-2x the vector data itself).

### IVF (Inverted File Index)

Partitions vectors into clusters (using k-means). Search only examines the clusters closest to the query, not all vectors. Think of it like a library catalog: you don't scan every book; you go to the right section first.

- **Pros**: lower memory than HNSW, good for very large datasets (billions of vectors).
- **Cons**: slightly less accurate, slightly slower than HNSW for typical workloads.

---

## Apply — choose a vector database

| Use case | Recommended | Why |
|---|---|---|
| <100K vectors, already on Postgres | pgvector | No new infrastructure, good enough performance |
| 100K-10M vectors, want managed | Pinecone | Zero ops, good performance, pay for convenience |
| 10M-1B vectors, want control | Qdrant or Milvus | Self-hosted, high performance, scalable |
| >1B vectors, specialized | Milvus or custom | Designed for billion-scale |

The "do you actually need a vector DB?" test: if you have <10K vectors, brute-force search in memory is faster and simpler than any vector DB. Don't add infrastructure you don't need.

---

## Analyze — vector search is approximate

HNSW with default parameters finds ~95% of the true top-10 nearest neighbors. For most applications (RAG, recommendation), this is fine — the 5% miss rate has minimal impact on end quality. For applications where exactness matters (legal search, compliance), use brute-force or higher-accuracy ANN settings, accepting the latency cost.

---

## Evaluate — vector DBs are infrastructure, not magic

Vector databases solve one problem: fast similarity search over embeddings. They don't solve: chunking (B.4), reranking (B.5), embedding quality (that's the embedding model's job), or retrieval relevance (that's a system design problem). Choosing the right vector DB is important, but it's 10% of the RAG quality equation. The other 90% is chunking, embeddings, and reranking.

---

## Create — design a vector search system

Design a vector search system for a 10M-document corpus. What embedding model? What vector DB? What ANN algorithm and parameters? How do you handle updates (new documents, deleted documents)? How do you measure retrieval quality?

Consider: the embedding model determines the quality of semantic matching. The vector DB determines the speed of search. The ANN parameters determine the accuracy-speed tradeoff. Updates require re-indexing (HNSW graphs are expensive to modify).

---

## A common misconception

**"Vector databases replaced traditional databases."** No. Vector databases are a specialized tool for similarity search. They're terrible at everything else: filtering ("find documents from 2024"), joins, transactions. Production systems use both: a traditional database for structured data, a vector database for semantic search. They complement, not replace.

---

## Explain it back

> "An embedding is _____. Vector databases are optimized for _____. The two main ANN algorithms are _____ (which works by _____) and _____ (which works by _____). The 'do you actually need a vector DB?' test is _____. Vector DBs are _____% of the RAG quality equation; the rest is _____."

---

## References

- **Malkov, Y. A., & Yashunin, D. A. (2020), "Efficient and robust approximate nearest neighbor search using HNSW," IEEE TPAMI 42(4).** arXiv:1603.09320 — https://arxiv.org/abs/1603.09320
- **Johnson, J., Douze, M., & Jegou, H. (2017), "Billion-scale similarity search with GPUs," arXiv:1702.08734.** The FAISS paper. https://arxiv.org/abs/1702.08734
- **Pinecone Learning Center.** Practical vector search guides. https://www.pinecone.io/learn/
- **pgvector Documentation.** PostgreSQL extension for vector search. https://github.com/pgvector/pgvector
