> Reference landscape, current as of **late 2026**. Tools change; the *categories* and the selection questions are durable. Every file leads with the questions you should ask before picking anything in its category.


# Vector Databases and Retrieval Stores

## The selection questions

1. **Scale:** 10K vectors (a numpy array — Lab b2), 1M (pgvector or any store), 100M+ (dedicated engine, ANN seriously)?
2. **Filters:** do you need `WHERE tenant_id = ? AND date > ?` *with* vector search? (You almost always do — metadata filtering is the difference between a demo and a product, and implementations vary wildly in how filter+ANN compose.)
3. **Ops surface:** who is on call for it? Postgres-you-already-run beats a new distributed system you don't understand (X.5's rule).
4. **Update pattern:** append-only, or heavy upserts (corpora that change hourly — CDC territory)?

## The options, honestly

| Option | Sweet spot | Watch out for |
|---|---|---|
| **pgvector** (Postgres extension) | ≤ a few M vectors; teams already on Postgres; ACID joins with your *actual data* | HNSW build time on big tables; it's one more thing your Postgres does |
| **Qdrant** | mid-scale, Rust, strong filtered search; self-host or cloud | smaller ecosystem than the giants |
| **Weaviate** | built-in hybrid search + modules; self-host or cloud | module magic adds conceptual weight |
| **Milvus / Zilliz** | very large scale, billion-vector class | ops complexity at the top end |
| **Pinecone** | managed-everything, fastest to start | closed source; vendor gravity; egress-style lock-in |
| **Vespa** | extreme hybrid (text+vector+ranking), battle-tested at Yahoo-scale | the steepest learning curve here |
| **Elasticsearch/OpenSearch** | you already run it; BM25 + kNN hybrid in one engine | resource-hungry; vector quality/perf historically behind dedicated engines |
| **FAISS / hnswlib / numpy** | embedded, in-process (labs, prototypes) | you own persistence, replication, filtering — it's a library, not a system |

**The lab-tested truth:** at lab scale (≤100K chunks) *everything works*, and the differences that matter are filtered-search semantics, upsert ergonomics, and ops burden — not benchmark Recall@10. Benchmarks matter at 100M+; below that, pick for your team's reality. (Mock 7 designs this decision end-to-end.)

## The questions that catch vendors out

- "Show me filtered ANN at *my* filter selectivity" (pre-filter vs. post-filter changes results, not just speed).
- "What's the p99 at 50 QPS with 500 concurrent filters?" (Lab x3's methodology, applied to their product.)
- "What happens to in-flight queries during a re-index?" (Your b3 re-chunking day will ask this for real.)
