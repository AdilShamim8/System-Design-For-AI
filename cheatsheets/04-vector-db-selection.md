# 4 — Vector DB Selection (B.3, Lab b2, Mock 7)

## The decision tree
```
≤ ~100K vectors, already on Postgres ──────────▶ pgvector (one less system)
need managed/everything, fast start ───────────▶ Pinecone
self-host, mid-scale, strong filtered search ──▶ Qdrant
hybrid (BM25+vectors) built-in, modules ───────▶ Weaviate
100M+ vectors, serious scale ──────────────────▶ Milvus/Zilliz
extreme hybrid ranking, big org ───────────────▶ Vespa
already run Elasticsearch ──────────────────────▶ ES/OpenSearch kNN
in-process, prototype, lab ────────────────────▶ FAISS / hnswlib / numpy
```

## The numbers that size everything
- Vector bytes = dims × 4 (fp32): 384-d MiniLM ≈ 1.5 KB; 1,536-d OpenAI ≈ 6 KB
- 1M × 1,536-d ≈ **6 GB raw** (before HNSW index ~1.5–2× overhead)
- PQ compression: 8–32× smaller, measurable recall cost — benchmark on *your* corpus
- Memory = the capacity plan: index must fit RAM (or pay disk-backed latency)

## The questions that catch vendors out
1. Filtered ANN at *your* selectivity (pre- vs post-filter changes results, not just speed)
2. p99 under concurrent filters at your QPS (x3 methodology)
3. In-flight queries during re-index (your b3 day will ask this)
4. Upsert path: cost of updating 1% of vectors nightly (CDC freshness)

## The rule that beats benchmarks
Below ~100M vectors, **everything works**; choose on: filtered-search semantics, upsert ergonomics, ops burden, team familiarity. Benchmarks (ANN-Benchmarks, MTEB-adjacent retrieval tests) matter at scale — mock 7 has the full design conversation.
