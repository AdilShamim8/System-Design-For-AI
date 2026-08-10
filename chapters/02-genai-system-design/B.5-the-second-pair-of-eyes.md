---
chapter_id: "B.5"
title: "The Second Pair of Eyes"
topic: "Reranking"
track: genai
bloom_stage: ["apply", "evaluate"]
est_read_minutes: 14
prerequisites: ["B.2", "B.3"]
teaching_goal: "Design a two-stage retrieval pipeline with bi-encoder retrieval and cross-encoder reranking, and quantify when reranking pays for itself."
primary_diagram: assets/diagrams/B.5/
common_misconception: "See chapter body"
status: stable
last_updated: 2026-08-10
---

# The Second Pair of Eyes

Vector search is fast and approximate. Cross-encoder reranking is slow and precise. Together, they're the cheapest accuracy multiplier in RAG — a 5-10% quality improvement for a 50ms latency cost. This is the 'second pair of eyes' that turns decent retrieval into great retrieval.

---

## Remember

**Bi-encoder** — embeds query and document separately, compares vectors. Fast, approximate. The first-pass retrieval model. **Cross-encoder** — feeds query and document together to a model. Slow, precise. The 'second pair of eyes.' **Two-stage retrieval** — retrieve many candidates with a bi-encoder, rerank a few with a cross-encoder. **Reranking** — the second stage that improves precision.

---

## Understand

In a RAG system, retrieval quality determines the ceiling of answer quality. If retrieval misses the right chunk, no amount of LLM cleverness can recover (see B.2). The bi-encoder (vector search) is fast but approximate — it finds *roughly* similar chunks, but its ranking isn't precise. A cross-encoder is slower but more precise — it reads the query and document *together* and scores their actual relevance.

**The two-stage pattern:**
1. **Retrieve** top-50 with a bi-encoder (vector search). Fast: ~50ms.
2. **Rerank** those 50 with a cross-encoder. Slower: ~50ms for 50 documents.
3. **Return** top-5 to the LLM.

The cross-encoder is more accurate because it sees the query and document *together* — it can judge actual relevance, not just vector similarity. But it's too slow to run on the entire corpus, so you use it only on the bi-encoder's candidates.

**Why it works:** the bi-encoder is good at *recall* (finding relevant documents in a large corpus) but bad at *precision* (ordering them correctly). The cross-encoder is good at precision but too slow for large-scale retrieval. Combining them gives you both: high recall from the bi-encoder, high precision from the cross-encoder.

---

## Apply

For a RAG system with 1M documents:
1. **Retrieve** top-50 with a bi-encoder (vector search). ~50ms.
2. **Rerank** those 50 with a cross-encoder (e.g., `bge-reranker-v2-m3`). ~50ms for 50 docs.
3. **Return** top-5 to the LLM.

Latency: 100ms for retrieval + reranking. Quality: 5-10% improvement in answer correctness vs. bi-encoder alone. Almost always worth it.

---

## Analyze

When does reranking *not* pay for itself? When retrieval quality is already high (small corpus, simple queries), the cross-encoder doesn't add much. When latency is extremely tight (voice assistants, real-time bidding), 50ms may be too much. For most RAG applications — support bots, research assistants, internal knowledge bases — reranking is a clear win.

---

## Evaluate

Cross-encoder options (as of 2026): `bge-reranker-v2-m3` (open-source, multilingual), Cohere Rerank (managed, easy), Jina Reranker (open-source, fast). The choice depends on whether you want managed or self-hosted, and whether you need multilingual support.

---

## Create

Design a retrieval pipeline for a legal research bot. The corpus is 5M legal documents. Queries are complex ('cases involving product liability for autonomous vehicles in California, 2020-2024'). How many candidates do you retrieve? What reranker? How do you handle the fact that legal queries often need multiple relevant documents (not just the top-5)?

---

## A common misconception

**'Reranking is a luxury.'** No. For any RAG system with more than a few thousand documents, reranking is the cheapest quality improvement available — 5-10% better answers for 50ms of latency. The teams that skip it are leaving quality on the table.

---

## Explain it back

A bi-encoder is _____; a cross-encoder is _____. The two-stage pattern works by _____, then _____. The bi-encoder is good at _____; the cross-encoder is good at _____. Reranking is worth it because _____.

---

## Further reading

- **Nogueira & Cho (2019), "Passage Re-ranking with BERT," arXiv** — the foundational cross-encoder reranking paper.
- **Khattab & Zaharia (2020), "ColBERT," SIGIR** — efficient cross-encoder variant.
- **Cohere Rerank documentation** — managed reranking.
