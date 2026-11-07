# Lab a5 — Search Ranking: BM25 vs Embeddings vs Hybrid

| | |
|---|---|
| **Prerequisites** | Chapter A.3 (the search bar that almost understands you) · Chapter B.3 (embeddings) can be read in parallel |
| **Dataset** | ANTIQUE — ~2,600 non-factoid questions, ~34K candidate passages ([card](../../../datasets/search-rank-retrieval.md)) |
| **You will build** | Two full retrieval systems (lexical + semantic), a hybrid that beats both, and the NDCG-vs-latency tradeoff table that every search interview asks for |
| **Est. time** | 2–3 hours |
| **Hardware** | Laptop CPU (embedding 34K passages takes ~2–5 min with `all-MiniLM-L6-v2`). No API key. |

**The story.** A user types "how do I stop my neighbor's dog from barking at 3am?" into a forum search. Lexical search (BM25) hunts for word overlap — "dog," "barking." Semantic search hunts for meaning — "noise complaint," "quiet hours." Neither wins everywhere: BM25 dies on vocabulary mismatch, embeddings die on rare terms ("model XG-3400"). Production search is almost always **hybrid** — and today you build all three and see the numbers move.

---

## Part 0 — Get the data (10 min)

```bash
cd labs/data
git clone https://github.com/CSIPranay/ANTIQUE.git
```

The repo has `antique_training.txt` etc. Parse into DataFrames: columns are `qid`, `pid` (passage id), `text`, `relevance` in the qrel files, and `passage` text in the collection. (Exact filenames vary by release — DATA.md lists what to expect; loading code below assumes train qrels + collection.)

```python
import pandas as pd
qrels = pd.read_csv("ANTIQUE/antique_training.txt", sep="\t",
                    names=["qid", "Q0", "pid", "rel"], usecols=[0, 2, 3])
texts = pd.read_csv("ANTIQUE/antique_collection.txt", sep="\t",
                    names=["pid", "text"]).set_index("pid")
print(qrels.shape, len(texts), "relevance range:", qrels.rel.min(), qrels.rel.max())
```

**Checkpoint 0:** What fraction of qrels have relevance ≥ 2 (the "useful" bar you'll rank against)? Non-factoid questions mean *opinion-shaped* answers — no single correct passage. Write down why that makes ranking (ordering) the right frame and "finding the one answer" the wrong one.

---

## Part 1 — The lexical baseline: BM25 (30 min)

```python
from rank_bm25 import BM25Okapi
import numpy as np, time

passages = texts.text.tolist()
tokenized = [t.lower().split() for t in passages]        # simple whitespace tokenizer
bm25 = BM25Okapi(tokenized)

def bm25_search(query, k=10):
    return bm25.get_scores(query.lower().split())

t0 = time.perf_counter()
scores = bm25_search("how do i stop my neighbor's dog from barking")
print("BM25 scoring 34K passages: %.0f ms" % ((time.perf_counter() - t0) * 1000))
```

BM25 scores *every passage* per query (that's its cost model — fine at 34K, fatal at 34M). Now evaluate: for each of the first 100 test questions (hold out the training qrels from tuning; use the test file), retrieve top-10 and compute **NDCG@10** with the graded relevance labels.

```python
def ndcg_at_k(ranked_pids, qid, qrels, k=10):
    rel = qrels[qrels.qid == qid].set_index("pid").rel
    gains = [float(rel.get(p, 0)) for p in ranked_pids[:k]]
    ideal = sorted(rel.reindex(ranked_pids).fillna(0).tolist() + rel.tolist(), reverse=True)[:k]
    dcg  = sum(g / np.log2(i + 2) for i, g in enumerate(gains))
    idcg = sum(g / np.log2(i + 2) for i, g in enumerate(ideal))
    return dcg / idcg if idcg else 0.0
```

**Checkpoint 1:** Mean NDCG@10 for BM25 over 100 questions (expect ≈ 0.35–0.45). Also record mean latency per query. Find one query where BM25 embarrasses itself (vocabulary mismatch) and one where it's unbeatable (rare exact term). Save both — they're your interview anecdotes.

---

## Part 2 — The semantic system: embeddings + ANN (40 min)

```python
from sentence_transformers import SentenceTransformer
import numpy as np

enc = SentenceTransformer("all-MiniLM-L6-v2")          # 384-dim, CPU-friendly
P = enc.encode(passages, batch_size=64, normalize_embeddings=True, show_progress_bar=True)

def semantic_search(query, k=10):
    q = enc.encode([query], normalize_embeddings=True)
    return (q @ P.T)[0]                                 # cosine sim (normalized)
```

Same evaluation as Part 1 (NDCG@10, latency). This is the brute-force version — full matrix multiply per query. Then implement **ANN** with FAISS and compare:

```python
import faiss
index = faiss.IndexFlatIP(P.shape[1])                  # exact, for sanity
index.add(P.astype("float32"))
D, I = index.search(q.astype("float32"), 10)           # top-10 in one call
# then: nlist/nprobe IVF index for the approximate version
```

**Checkpoint 2:** Embedding NDCG@10 (expect ≈ 0.40–0.50 — semantic wins on average), latency per query (brute force vs. IVF with nlist=100, nprobe=8). Two design observations to write down: (1) embeddings pay a *one-time* index cost for *every-query* speed — the opposite trade of BM25's zero-index, full-scan; (2) the model's idea of "relevant" is a *distributional* judgment — find one query where the semantic system retrieves a passage BM25 missed and explain the miss in one sentence.

---

## Part 3 — Hybrid: reciprocal rank fusion (30 min)

The industrial-strength trick is embarrassingly simple — fuse the two *rankings* (not scores):

```python
def rrf(rank_lists, k=60):
    # rank_lists: list of pid-lists, best first
    scores = {}
    for lst in rank_lists:
        for rank, pid in enumerate(lst):
            scores[pid] = scores.get(pid, 0) + 1 / (k + rank + 1)
    return sorted(scores, key=scores.get, reverse=True)
```

Evaluate RRF(BM25 top-100, embeddings top-100) on the same 100 questions.

**Checkpoint 3 (the lab's payoff):** You should observe hybrid ≥ max(BM25, embeddings) on NDCG@10 — often by a visible margin — at roughly double the single-system latency. Fill the table:

| System | NDCG@10 | Latency/query |
|---|---|---|
| BM25 | | |
| Embeddings (ANN) | | |
| Hybrid (RRF) | | |

Then one paragraph: when would you *not* ship the hybrid? (Answers you should be able to defend: latency budget under 20 ms and no parallel index budget; domain where vocabulary is fully controlled — part numbers, SKUs.)

---

## Part 4 — The design layer (20 min)

On paper, for a search box on a 34-million-passage corpus (1000× ANTIQUE):

1. BM25 full-scan doesn't scale — what replaces it? (Inverted index with term pruning — Elasticsearch/Lucene — the engine, not the algorithm, changes.)
2. Your vector index needs *memory math*: 34M × 384 dims × 4 bytes ≈ 52 GB raw. IVF/HNSW compress via PQ — at what quality cost? Write the tradeoff sentence.
3. Where does a **reranker** (Chapter B.5, a cross-encoder over top-50) fit, and what does it buy you at what latency cost? Sketch the full funnel: candidates (BM25+ANN) → fusion → rerank top-50 → top-10. This *is* modern search architecture, and you just derived it.

**Checkpoint 4:** Write the funnel's latency budget for a 200 ms p99: assign ms to each stage and defend it.

---

## Explain it back

1. Why does BM25 fail on "car won't start" vs documents saying "vehicle fails to crank"? Name the failure and the fix (two fixes: one lexical — stemming/synonyms; one architectural — embeddings).
2. Why does RRF use ranks instead of raw scores?
3. What breaks first at 1000× scale: BM25, brute-force vectors, or IVF? Why?
4. Your A/B test shows hybrid beats BM25 on NDCG *proxy* but not on click-through. What now?

## Extensions

- **Cross-encoder rerank:** rerank the hybrid top-20 with `cross-encoder/ms-marco-MiniLM-L-6-v2`; expect a meaningful NDCG bump at a heavy latency price. You have now built the full production funnel.
- **Query-side BM25 tuning:** try `BM25Okapi(..., k1=1.5, b=0.75)` vs `k1=0.9, b=0.4`; watch domain sensitivity. ANTIQUE's long passages change the best `b`.
- **Chunking meets search:** passages here are forum answers; re-run semantic search after splitting passages into 2 chunks. Does NDCG move? You just previewed Lab b3.

## What you can now claim in an interview

"I built lexical, semantic, and RRF-hybrid retrieval on a real graded dataset, measured NDCG@10 and latency for each, and can design the candidate→fuse→rerank funnel with a latency budget — because I've run every stage myself."
