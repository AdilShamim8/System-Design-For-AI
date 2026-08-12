---
chapter_id: "A.3"
title: "The Search Bar That Almost Understands You"
topic: "Search & ranking"
track: ml
bloom_stage: ["remember", "understand", "apply", "analyze", "evaluate", "create"]
est_read_minutes: 18
prerequisites: ["A.0", "A.2"]
teaching_goal: "Design a search system with lexical and semantic retrieval, ranking, and result blending."
status: stable
last_updated: 2026-08-12
---

# The Search Bar That Almost Understands You

You type "blue running shoes for flat feet." The search returns 500 results. The first ten are perfect. The next 490 are irrelevant. How did it know which ten to put first? That's the search problem — sibling to recommendation, but with one critical difference: the user told you what they want.

In recommendation, the system infers intent from behavior. In search, the user gives you intent explicitly via a query. This makes search easier (you know what they want) and harder (they expect the top result to be exactly right).

---

## Remember — name it

- **Lexical retrieval (BM25)** — matching based on word overlap. The classic approach. Fast (milliseconds), precise (exact matches score high), but dumb — "sneakers" won't match "running shoes." Implemented in Elasticsearch, OpenSearch, Lucene.
- **Semantic retrieval** — matching based on meaning (embeddings + vector search). Handles synonyms, but slower and less precise for exact matches.
- **Hybrid search** — blending lexical and semantic. The production pattern.
- **Ranking** — scoring retrieved candidates to order them by relevance. Same shape as recommendation's ranking stage.
- **Re-ranking** — applying final business rules: ads, sponsored results, freshness, personalization.

---

## Understand — why hybrid search wins

**Lexical search (BM25)** scores documents based on term frequency (how often the query terms appear) and inverse document frequency (how rare those terms are across all documents). It's fast, precise for exact matches, and well-understood. But it can't handle synonyms — "sneakers" won't match "running shoes" because the words don't overlap.

**Semantic search** embeds the query and documents into vectors. Similar meanings get similar vectors. "Sneakers" matches "running shoes" because their embeddings are close. But it's slower (vector search vs. inverted index) and can miss exact matches — an embedding for "blue running shoes" might be close to "red running shoes" (wrong color).

**Hybrid search** runs both retrievers in parallel, merges results, and ranks the merged set. Lexical catches exact matches; semantic catches intent. This is what most modern search systems do — Amazon, Google Shopping, and enterprise search platforms all use hybrid search.

---

## Apply — design search for an e-commerce site

**Setup:** 2M products, 200 QPS steady, 2,000 QPS peak. Budget: 150ms for retrieval.

1. **Retrieval**: Elasticsearch (lexical) + vector DB (semantic), run in parallel. Merge top-100 from each.
2. **Ranking**: a model scores each candidate based on text relevance, product popularity, user's past behavior, and context (time of day, device).
3. **Re-ranking**: boost sponsored products, ensure freshness, deduplicate by variant.

Latency: lexical 20ms + semantic 50ms (parallel, so max = 50ms) + ranking 50ms + re-ranking 10ms = ~110ms. Under budget.

**Query types:**
- **Head queries** (popular, short — "iPhone case"): lexical search handles these well.
- **Tail queries** (rare, long — "waterproof iPhone 15 Pro Max case with MagSafe and lanyard"): semantic search helps most.

---

## Analyze — search quality by query type

Search quality depends on the query type. **Head queries** (popular, short) are easy — everyone searches for them, you have lots of data. **Tail queries** (rare, long) are hard — sparse data, high intent. Semantic search helps most with tail queries; lexical search handles head queries fine.

Understanding your query distribution determines where to invest. If 80% of your traffic is head queries, invest in lexical search optimization. If 80% is tail queries, invest in semantic search.

---

## Evaluate — how to measure search quality

**Offline metrics:**
- **Recall@K** — did the relevant items appear in the top K?
- **NDCG** — are the most relevant items ranked highest?
- **MRR (Mean Reciprocal Rank)** — how far down is the first relevant result?

**Online metrics:**
- **Click-through rate (CTR)** — what fraction of results get clicked?
- **Add-to-cart rate** — do users buy what they find?
- **Zero-result rate** — how often do users get no results? (A high zero-result rate means your search can't handle the query vocabulary.)
- **Refinement rate** — how often do users reformulate their query? (High refinement means the first results weren't good enough.)

The gap between offline and online metrics is where surprises live — offline metrics can be perfect while users complain.

---

## Create — design search for a legal research platform

The corpus is millions of statutes and case law. Queries range from "statute of limitations California product liability" to "cases involving autonomous vehicle liability 2024." What retrieval methods? How do you handle legal citations? How do you rank relevance for legal professionals vs. laypeople?

Consider: legal search needs high precision (the top result must be the right statute) and high recall (don't miss any relevant case). Legal vocabulary is specialized — "res judicata," "stare decisis," "habeas corpus." A general-purpose embedding model might not handle these well. You might need a domain-specific embedding model or a legal-specific reranker.

---

## A common misconception

**"Semantic search replaced lexical search."** No. Hybrid search is the production pattern. Lexical search is still the best tool for exact matches (product names, SKUs, brand queries). Semantic search is the best tool for intent queries ("shoes for flat feet"). Real users do both, and you don't know which is which in advance.

---

## Explain it back

> "The two main types of search retrieval are _____ (which matches on _____) and _____ (which matches on _____). Production systems use _____, which means _____. The offline metric I'd use to measure search quality is _____, and the online metric is _____."

---

## References

- **Manning, C., Raghavan, P., & Schütze, H. (2008), *Introduction to Information Retrieval*, Cambridge University Press.** https://nlp.stanford.edu/IRBook/
- **Robertson, S., & Zaragoza, H. (2009), "The Probabilistic Relevance Framework: BM25 and Beyond."** https://doi.org/10.1561/1500000019
- **Karpukhin, V., et al. (2020), "Dense Passage Retrieval," EMNLP 2020.** arXiv:2004.04906 — https://arxiv.org/abs/2004.04906
- **Elasticsearch Documentation.** https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html
