# Lab a5 — Worked Solution and What the Numbers Mean

## Expected results (our runs, `all-MiniLM-L6-v2`, 100 test questions)

| System | NDCG@10 | Latency/query (34K passages) |
|---|---|---|
| BM25 (rank_bm25, brute scan) | ≈ 0.38–0.45 | ≈ 25–60 ms (pure Python scan) |
| Embeddings, brute-force matmul | ≈ 0.42–0.50 | ≈ 1–3 ms (after one-time indexing) |
| FAISS IVF (nlist=100, nprobe=8) | ≈ 0.41–0.49 (−0.5–1.5 pts) | ≈ 0.3–1 ms |
| RRF hybrid | ≈ 0.46–0.53 | sum of the two, minus fusion (~µs) |
| + cross-encoder rerank (ext.) | ≈ 0.50–0.57 | +40–150 ms for 20 pairs |

The pattern to internalize: **no single retriever wins everywhere.** Semantic wins average NDCG; BM25 wins rare-term queries; hybrid wins the *aggregate* and never loses badly anywhere — which is why production ships hybrid.

## The five lessons hidden in those numbers

1. **The two systems fail differently — that's the whole reason hybrid works.** BM25's failure is vocabulary mismatch (query says "car," doc says "vehicle"); embeddings' failure is rare entities and negation. RRF doesn't fix either failure; it *buries* both under the other's strength. If you can name the two failure modes cold, you can design any retrieval system.
2. **RRF beats score-fusion because scores are incomparable.** BM25's 11.3 and cosine's 0.83 live on different planets; ranks live on the same one. The 1/(k+rank) form is robust, parameter-light, and — a real interviews bonus — what several production systems (Elasticsearch's RRF, Vespa) shipped after it proved itself in research (Cormack et al., 2009).
3. **The index shifts cost from query-time to build-time.** BM25: zero prep, full scan per query. Vectors: minutes of encoding + an index build, then sub-ms queries. At 34K passages both are toys; at 34M the vector path is the only one with a query-time chance *provided* you accept ANN's quality tax (measure it — our IVF lost ~1 NDCG point for 3–10× speed).
4. **Rerankers buy quality with latency, at the top only.** A cross-encoder reads (query, passage) *together* — far more accurate, far more expensive, so you only run it on 20–50 candidates. This is Chapter B.5's "second pair of eyes," and its economics (quality/latency trade) is the most-asked reranker interview question.
5. **Offline NDCG is a rumor about clicks.** Checkpoint 4's scenario — proxy improves, clicks don't — is the commonest real-world outcome and has a standard response: examine position bias and presentation effects first (higher-ranked results get clicked regardless of quality), then reconsider the metric definition against user behavior (X.2's offline/online gap, now in search clothing).

## Common mistakes

- **Using test questions for tuning.** The qrels file you tune k1/b against must not be the one you report on; keep the train/test split the dataset ships with.
- **Mixing normalized and unnormalized vectors.** `normalize_embeddings=True` makes cosine = dot product; forget it and dot-product scores mix magnitude into "relevance," quietly costing NDCG.
- **Computing NDCG against only retrieved-and-judged items.** The ideal-DCG must use *all* judged relevances for the query (the lab code's `ideal` line does this correctly — shrinking it inflates NDCG).
- **Trusting one latency number.** First FAISS query includes warm-up; measure after a warm-up call (same lesson as Lab a1, recurring because production keeps teaching it).

## Interview lines this lab earns you

- "I measured lexical vs semantic vs RRF-hybrid on ANTIQUE: hybrid won NDCG@10 by 3–8 points over the best single system, at the cost of running both indexes — and I can tell you which queries each system fails on, because I read them."
- "At 1000× scale my brute-force matmul dies; the design answer is ANN (IVF/HNSW) plus BM25 via an inverted index, fused with RRF, reranked by a cross-encoder on top-50 — I've built every stage at lab scale."
