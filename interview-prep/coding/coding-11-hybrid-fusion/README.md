# Coding 11 — Fuse Lexical and Vector Retrieval With RRF

**Time budget: 35 min.** Open book (docs, not solutions). Narrate your tradeoffs.

## The scenario

The retrieval merge screen: you have two ranked lists for the same query — BM25 top-20 and vector top-20 (different orderings, partial overlap). Fuse them into one top-10 with Reciprocal Rank Fusion, then answer the follow-up every interviewer asks: when does fusion BEAT the best single list, and when does it not? Your ground truth: a5's measured result — hybrid + RRF beat the best single system by 3-8 NDCG points because the two systems fail differently.

## Your task

1. Implement RRF: score(d) = sum over systems of 1/(k + rank_i(d)), k=60. Produce the fused top-10.
2. Implement the weighted variant (alpha x BM25 + (1-alpha) x vector) and tune alpha on a dev split.
3. Evaluate all three (BM25, vector, RRF, weighted) with NDCG@10 on your set.
4. Identify the query classes where fusion wins most (vocabulary mismatch? rare entities?) and where it wins least.
5. State the production decision: which fusion ships, and what the reranker on top adds.

## Success looks like

RRF implemented correctly (k=60, missing documents contribute zero). NDCG@10 computed on all variants. The win/lose analysis names the query classes, not just the average. The production sentence covers latency (fusion is ~free) and the reranker's role on top.

## Dataset

Self-generate: 20 queries with graded relevance lists (or sample from SQuAD via the qa-knowledge card). Two retrievers can be mocked as noisy permutations of the truth — the fusion math is the point, not the retrievers.

## After your attempt

Open [SOLUTION.md](./SOLUTION.md). Grade yourself against the checklist at the end.
