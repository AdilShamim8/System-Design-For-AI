---
chapter_id: "B.5"
title: "The Second Pair of Eyes"
topic: "Reranking"
track: genai
bloom_stage: ["remember", "understand", "apply", "analyze", "evaluate", "create"]
est_read_minutes: 14
prerequisites: ["B.2", "B.3"]
teaching_goal: "Design a two-stage retrieval pipeline with bi-encoder retrieval and cross-encoder reranking, and quantify when reranking pays for itself."
status: stable
last_updated: 2026-08-12
---

# The Second Pair of Eyes

Vector search is fast and approximate. Cross-encoder reranking is slow and precise. Together, they're the cheapest accuracy multiplier in RAG — a 5-10% quality improvement for 50ms of latency cost.

The pattern is simple: retrieve many candidates cheaply, rerank a few precisely. But the "why" is deeper than it looks, and the implementation details matter.

---

## Remember — name it

- **Bi-encoder** — embeds query and document *separately*, compares vectors. Fast (pre-computed document embeddings), approximate. The first-pass retrieval model used in vector search.
- **Cross-encoder** — feeds query and document *together* to a model. Slow (must process each query-document pair), precise. The "second pair of eyes."
- **Two-stage retrieval** — retrieve top-50 with a bi-encoder, rerank top-50 with a cross-encoder, return top-5. The production pattern.
- **Reranking** — the second stage that improves precision without sacrificing recall.

---

## Understand — why two stages

The bi-encoder (vector search) is good at **recall** — finding relevant documents in a large corpus. It's fast because document embeddings are pre-computed; at query time, you only embed the query (one API call) and do an ANN search (~50ms).

But the bi-encoder is bad at **precision** — ordering the retrieved documents correctly. It uses cosine similarity, which is a rough proxy for relevance. Two documents might have similar embeddings but very different actual relevance to the query.

The cross-encoder is good at precision — it reads the query and document *together* and scores actual relevance. But it's too slow for large-scale retrieval: you'd have to run it on every document in the corpus.

**The two-stage pattern combines both:**
1. **Retrieve** top-50 with the bi-encoder (fast, ~50ms). High recall, low precision.
2. **Rerank** those 50 with the cross-encoder (slower, ~50ms for 50 docs). High precision.
3. **Return** top-5 to the LLM. The best of both worlds.

---

## Apply — implement reranking in a RAG pipeline

```python
# Stage 1: Bi-encoder retrieval (fast, approximate)
query_embedding = embed_model.encode(question)  # ~50ms
candidates = vector_db.search(query_embedding, top_k=50)  # ~50ms

# Stage 2: Cross-encoder reranking (slow, precise)
from sentence_transformers import CrossEncoder
reranker = CrossEncoder("BAAI/bge-reranker-v2-m3")  # open-source, multilingual

# Score each (query, document) pair
pairs = [(question, c.text) for c in candidates]
scores = reranker.predict(pairs)  # ~50ms for 50 pairs

# Sort by reranker score, take top-5
ranked = sorted(zip(candidates, scores), key=lambda x: x[1], reverse=True)
top_5 = [c for c, s in ranked[:5]]
```

Latency: 50ms (embed) + 50ms (search) + 50ms (rerank) = ~150ms total. The reranking adds 50ms — about 1/3 of the total retrieval latency. Almost always worth it.

**Popular cross-encoder models (as of 2026):**
- `BAAI/bge-reranker-v2-m3` — open-source, multilingual, strong performance
- Cohere Rerank — managed, easy to use, ~$0.002 per 1000 searches
- Jina Reranker — open-source, fast

---

## Analyze — when reranking doesn't pay for itself

Reranking adds ~50ms of latency. When is that NOT worth it?

- **Small corpus (<1,000 documents)**: brute-force search with a cross-encoder is fast enough. No need for the bi-encoder stage.
- **Simple queries**: if queries are always exact-match ("find document #12345"), lexical search is sufficient. No reranking needed.
- **Ultra-low-latency applications (voice, real-time bidding)**: 50ms might be too much. Use only the bi-encoder.
- **High-quality embeddings + small candidate set**: if your embedding model is excellent and you only retrieve top-5, the bi-encoder's ranking might be good enough.

For most RAG applications — support bots, research assistants, internal knowledge bases — reranking is a clear win. The 50ms cost is negligible compared to the 2-3 seconds the LLM takes to generate the answer.

---

## Evaluate — the cost-benefit math

| Metric | Without reranking | With reranking |
|---|---|---|
| Retrieval latency | ~100ms | ~150ms |
| Recall@5 | 85% | 92% |
| Answer accuracy | 78% | 84% |
| Cost per query | $0.00001 | $0.00003 |

The 6% accuracy improvement for 50ms latency and $0.00002 cost is almost always worth it. The question isn't "should I rerank?" but "which cross-encoder should I use?"

---

## Create — design reranking for a legal research bot

The corpus is 5M legal documents. Queries are complex ("cases involving product liability for autonomous vehicles in California, 2020-2024"). How many candidates do you retrieve? What reranker? How do you handle the fact that legal queries often need multiple relevant documents (not just the top-5)?

Consider: legal queries need high recall (don't miss any relevant case) and high precision (the top results must be actually relevant). You might retrieve top-100, rerank to top-20, and return top-10 to the LLM. The cross-encoder must handle legal vocabulary — a general-purpose reranker might not understand "res judicata" or "stare decisis."

---

## A common misconception

**"Reranking is a luxury."** No. For any RAG system with more than a few thousand documents, reranking is the cheapest quality improvement available — 5-10% better answers for 50ms of latency. The teams that skip it are leaving quality on the table.

---

## Explain it back

> "A bi-encoder is _____; a cross-encoder is _____. The two-stage pattern works by _____, then _____. The bi-encoder is good at _____; the cross-encoder is good at _____. Reranking is worth it because _____."

---

## References

- **Nogueira, R., & Cho, K. (2019), "Passage Re-ranking with BERT," arXiv:1901.04085.** The foundational cross-encoder reranking paper. https://arxiv.org/abs/1901.04085
- **Khattab, O., & Zaharia, M. (2020), "ColBERT: Efficient and Effective Passage Search via Contextualized Late Interaction over BERT," SIGIR 2020.** arXiv:2004.12832 — https://arxiv.org/abs/2004.12832
- **Cohere Rerank Documentation.** https://docs.cohere.com/docs/reranking
- **BAAI/bge-reranker-v2-m3.** https://huggingface.co/BAAI/bge-reranker-v2-m3
