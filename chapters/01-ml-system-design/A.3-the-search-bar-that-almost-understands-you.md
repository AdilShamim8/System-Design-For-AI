---
chapter_id: "A.3"
title: "The Search Bar That Almost Understands You"
topic: "Search & ranking"
track: ml
bloom_stage: ["apply", "analyze"]
est_read_minutes: 18
prerequisites: ["A.0", "A.2"]
teaching_goal: "Design a search system with lexical and semantic retrieval, ranking, and result blending."
primary_diagram: assets/diagrams/A.3/
common_misconception: "See chapter body"
status: stable
last_updated: 2026-08-10
---

# The Search Bar That Almost Understands You

You type 'blue running shoes for flat feet.' The search returns 500 results. The first ten are perfect. The next 490 are irrelevant. How did it know which ten to put first? That's the search problem — sibling to recommendation, but with one critical difference: the user told you what they want.

---

## Remember

**Lexical retrieval** — matching based on word overlap (BM25, TF-IDF). Fast, precise, can't handle synonyms. **Semantic retrieval** — matching based on meaning (embeddings, vector search). Handles synonyms, slower, less precise for exact matches. **Hybrid search** — blending lexical and semantic. **Ranking** — scoring retrieved candidates to order them by relevance. **Re-ranking** — applying final business rules (personalization, freshness, diversity).

---

## Understand

Search and recommendation are siblings. Both retrieve items and rank them. The difference: in recommendation, the system infers intent from behavior. In search, the user tells you intent explicitly via a query. This makes search easier (you know what they want) and harder (they expect the top result to be exactly right).

**Lexical retrieval (BM25).** The classic approach. BM25 (Best Matching 25) scores documents based on term frequency and inverse document frequency — how often the query terms appear in the document, weighted by how rare those terms are across all documents. Fast (milliseconds), precise (exact matches score high), but dumb — 'sneakers' won't match 'running shoes.' Implemented in Elasticsearch, OpenSearch, Lucene.

**Semantic retrieval.** Embed the query and the documents into vectors. Find the documents whose vectors are closest to the query vector. Handles synonyms ('sneakers' ≈ 'running shoes' because their embeddings are close), but slower (vector search) and can miss exact matches (an embedding for 'blue running shoes' might be close to 'red running shoes' — wrong color).

**Hybrid search.** The production pattern. Run both retrievers in parallel, merge results, rank the merged set. Lexical catches exact matches; semantic catches intent. This is what most modern search systems do.

---

## Apply

Design search for an e-commerce site with 2M products:
1. **Retrieval**: Elasticsearch (lexical) + vector DB (semantic), run in parallel, merge top-100 from each.
2. **Ranking**: a model that scores each candidate based on text relevance, product popularity, user's past behavior, and context (time of day, device).
3. **Re-ranking**: business rules — boost sponsored products, ensure freshness, deduplicate by variant.

Latency budget: 150ms total. Lexical search: 20ms. Semantic search: 50ms (embedding + ANN). Ranking: 50ms. Re-ranking: 10ms. Network + render: 20ms.

---

## Analyze

Search quality depends on the query type. **Head queries** (popular, short — 'iPhone case') are easy; everyone searches for them, you have lots of data. **Tail queries** (rare, long — 'waterproof iPhone 15 Pro Max case with MagSafe and lanyard attachment') are hard; sparse data, high intent. Semantic search helps most with tail queries; lexical search handles head queries fine. Understanding your query distribution determines where to invest.

---

## Evaluate

How do you know if search is good? **Offline metrics**: recall@K (did the relevant items appear in top K?), NDCG (are the most relevant items ranked highest?). **Online metrics**: click-through rate, add-to-cart rate, purchase rate, zero-result rate (how often do users get no results?). The gap between offline and online is where surprises live — offline metrics can be perfect while users complain.

---

## Create

Design search for a legal research platform. The corpus is millions of statutes and case law. Queries range from 'statute of limitations California product liability' to 'cases involving autonomous vehicle liability 2024.' What retrieval methods? How do you handle legal citations? How do you rank relevance for legal professionals vs. laypeople?

---

## A common misconception

**'Semantic search replaced lexical search.'** No. Hybrid search is the production pattern. Lexical search is still the best tool for exact matches (product names, SKUs, brand queries). Semantic search is the best tool for intent queries ('shoes for flat feet'). Real users do both, and you don't know which is which in advance.

---

## Explain it back

The two main types of search retrieval are _____ (which matches on _____) and _____ (which matches on _____). Production systems use _____, which means _____. The offline metric I'd use to measure search quality is _____, and the online metric is _____.

---

## Further reading

- **Manning, Raghavan & Schütze (2008), *Introduction to Information Retrieval*** — the canonical textbook.
- **Elasticsearch documentation** — practical BM25 tuning.
- **Karpukhin et al. (2020), "Dense Passage Retrieval for Open-Domain Question Answering," EMNLP** — the DPR paper.
