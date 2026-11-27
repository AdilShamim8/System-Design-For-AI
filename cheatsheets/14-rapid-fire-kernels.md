# 14 — The Rapid-Fire Kernels Card

*The 40-question stretch (08b) compressed to the kernels — this is the card you review in the 10 minutes before any screen that might go fast. If a kernel doesn't ring a bell, its home deck is in parentheses.*

## ML (deck 1, 5)

AUC vs PR-AUC → imbalance switches to PR · threshold from the cost matrix, never 0.5 · leakage = postdated information · feature store = one definition, two runtimes · temporal data, time-split always · PSI bands 0.1/0.2 · shadow proves plumbing only · cold-start: content candidates + exploration quota · offline/online gap: distribution + proxy (FN-11) · bidding needs calibration not ranking (A.4).

## GenAI (deck 3, 5)

Hybrid wins: different failures, RRF fuses (a5) · chunking: structure first, never split tables/code · cite-or-refuse is the hallucination control · semantic cache: trust asymmetry sets τ high (0.85-0.92) · deprecated embedder: freeze alias, never mix (Q-GEN-10) · bi-encoder = fast/approximate, cross-encoder = slow/accurate-rerank · judge trustworthy: versioned, calibrated, temp 0 · "more context" is 70-80 percent boilerplate — retrieve · token explosion: truncate tools, summarize, budgets outside · adversarial slice = the eval set's immune system.

## Agents (deck 4)

Agent vs workflow: agentify only the unenumerable (Q-AG-12) · budgets in the loop, outside the model (c1) · tool errors return as data · injection's strongest defense: capability scoping (c3) · idempotency keys on every write, money especially · contract item 6: summaries not dumps · multi-agent only when isolation is the point (C.3) · memory = liability surface with retention policy (C.4).

## Systems & ops (deck 1, 6, 10)

p99 = the tail users churn on · TTFT > total for chat UX (x3) · circuit breaker protects caller AND downstream · jitter flattens synchronized retry spikes (b4) · at-least-once forces consumer idempotency · freshness SLOs tier by downstream use (Q-ML-10) · 100x breaks stateful joins and per-request model calls first · audit = cold/complete/WORM, observability = hot/sampled (Q-AG-11) · residency binds personal data, usually not weights (Q-CC-11) · new feature: instrument usage + failure taxonomy BEFORE optimizing (x1) · cost per request finds waste, fully-loaded (2x) tells truth (Q-CC-10) · 2 AM latency page: roll back first, diagnose second (X.5).

## The two legal rapid-fire answers

- "I don't know — here's how I'd find out in five minutes" — a STRONG rapid-fire answer; bluffing is the only weak one.
- Wrong-but-confident loses to right-and-brief: 30 seconds, kernel, stop. Essaying marks you as not knowing the kernel.
