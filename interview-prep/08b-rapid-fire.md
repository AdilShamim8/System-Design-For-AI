# Rapid-Fire Round — 40 Questions, One Breath Each

**The flash pattern.** Real loops contain a 10-15 minute stretch of rapid-fire: the interviewer machine-gunning short questions to map your reflexes and your bluff surface. You cannot deliberate — you can only have the reflexes. Drill this file with a partner reading questions (or a timer): 30 seconds each, first-answer-wins, no essaying. Wrong-but-honest beats vague; "I don't know, here's how I'd find out" is a STRONG answer here.

*Format: the question, then the kernel the answer must contain. If your answer misses the kernel, drill it.*

## ML systems (1-10)

1. **AUC vs PR-AUC — when do you switch?** — imbalanced data: PR-AUC; the positive class is what you're buying.
2. **Why can't you threshold at 0.5 on an imbalanced problem?** — the base rate makes 0.5 arbitrary; threshold from the cost matrix (a3).
3. **Label leakage, one-sentence definition.** — a feature computed with information that postdates the prediction.
4. **Feature store — what's it actually FOR?** — one feature definition, two runtimes, parity by construction (point-in-time both).
5. **Time-split vs random split — the rule.** — temporal data, always time-split; random leaks the future.
6. **What's PSI?** — population stability index: distribution shift of a feature vs a reference; bands 0.1/0.2.
7. **Champion/challenger — what does shadow prove?** — plumbing only; no outcome claims (shadow doesn't drive decisions).
8. **Cold-start in recsys — the two standard fixes?** — content-based candidates; exploration quota.
9. **Why do offline metrics disagree with online?** — different distributions, proxy-vs-goal gap, and selection (FN-11's lesson).
10. **Calibration vs ranking — which does bidding need?** — calibration; bids multiply probabilities (A.4).

## GenAI / RAG (11-20)

11. **Hybrid retrieval — why does it win?** — the two systems fail differently (vocabulary mismatch vs rare entities); RRF fuses (a5).
12. **Chunking — the one rule.** — structure first, size second; never split tables/code blocks.
13. **Why does RAG hallucinate less than free generation?** — grounding constrains the output distribution; cite-or-refuse enforces it.
14. **What's a semantic cache's threshold tradeoff?** — hit rate vs wrong-hit rate; trust asymmetry sets it high (0.85-0.92).
15. **Embedding model deprecated — first move?** — freeze old as versioned alias; never mix old+new vectors in one query.
16. **Cross-encoder vs bi-encoder — one line each.** — bi: fast, approximate, precomputable; cross: slow, accurate, rerank-only.
17. **LLM-as-judge — what makes it trustworthy?** — versioned judge prompt, calibrated against human grades, temp 0.
18. **Why is 'just add more context' not the answer?** — 70-80 percent is irrelevant boilerplate; retrieval selects; cost and quality both argue.
19. **Token budget explodes mid-conversation — the fix?** — truncate tool results, summarize history, restart-with-summary; budgets outside the model.
20. **What's an adversarial eval slice?** — should-refuse and injection cases with known labels; the eval set's immune system.

## Agents (21-28)

21. **Agent vs workflow — the decision rule.** — agentify only what you cannot enumerate (Q-AG-12).
22. **Where do agent budgets live?** — outside the model, in the loop: steps, tokens, wall-clock (c1).
23. **Tool errors — raise or return?** — return as data; the model self-corrects; exceptions kill episodes.
24. **Prompt injection — the strongest single defense?** — capability scoping: no dangerous tool, nothing to hijack (c3).
25. **Idempotency keys — where do they matter most?** — every write tool; the money boundary especially (Q-BR-12).
26. **What's the tool contract's item 6?** — token-budget consciousness: tools return summaries, not dumps.
27. **Multi-agent — when is it worth it?** — when isolation is the point (parallelism, adversarial checking), not by default (C.3).
28. **Memory governance — the one-line version.** — memory is a liability surface with a retention policy, not a feature flag (C.4).

## Systems & ops (29-40)

29. **p50 vs p99 — what does each tell you?** — typical experience vs tail; users churn on the tail.
30. **TTFT — why does it matter more than total latency for chat?** — perceived responsiveness; streaming makes waiting visible-progress (x3).
31. **Circuit breaker — what does it protect?** — the caller from a dead dependency; and downstream from retry storms.
32. **Backoff with jitter — why jitter?** — synchronized retries create spikes; jitter flattens them (b4).
33. **At-least-once delivery — what does it force on consumers?** — idempotency; dedupe by key (the classic, asked every week).
34. **Feature freshness SLO — how do you tier it?** — by downstream use: fraud features minutes, aggregates days (Q-ML-10).
35. **What breaks first at 100x traffic — the honest general answer?** — the stateful joins and the per-request model calls — the places you stored or computed per-user things without sharding.
36. **Audit log vs observability log — one line.** — cold/complete/write-once vs hot/sampled/expensive; different retention, different consumers (Q-AG-11).
37. **Data residency — what actually has to stay in-region?** — personal data (docs, queries, outputs); model weights usually don't (verify per contract) (Q-CC-11).
38. **What's the first metric you'd put on a new AI feature?** — usage + failure taxonomy (refusals, errors, latency) — instrument before optimizing (x1).
39. **Cost per request — why report it AND the fully-loaded number?** — the first finds waste; the second tells the truth (2x) (Q-CC-10).
40. **The 2 AM page fires: model latency tripled. First action?** — check the blast radius and roll back to the last version — mitigate BEFORE diagnosing (X.5).

---

**The drill's scoring:** a partner counts kernels-hit in 30 seconds each. Below 28/40: run the decks (the answer IS in deck 1-10 for every one of these). Above 34: your rapid-fire is an asset — volunteer for it ("happy to go fast on fundamentals") in the real round.
