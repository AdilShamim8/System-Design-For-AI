# Classical-to-AI Bridge Questions
**8 classics, re-asked for the AI era.** The pattern: the classic design survives, and the AI layer adds units (tokens), failure classes (non-determinism, drift, injection), and feedback loops. If you know the classics (the videos in this course's research list cover them), these are the fastest points in any interview.

*Why this file exists:* interviewers trained on classical system design probe whether your AI knowledge sits *on top of* fundamentals or *instead of* them. Answering "the classic spine holds, here's what changes" is the strongest position in the room.

## Q-BR-1 — Rate Limiter for an LLM API

**Scenario:** Your LLM gateway needs rate limiting: per-user, per-model, with burst tolerance. Costs are per-token, limits are per-request.

**Your task:** Adapt the classic to AI.

### Worked answer

Token bucket (the classic winner: burst-friendly, cheap, stateless-ish per key) — but the AI twist is *two-dimensional* limits: requests/min AND tokens/day, because cost scales with tokens, not calls (b1). Buckets keyed by (user, model-tier) — the frontier tier needs its own, tighter bucket (x2's tier economics). Redis for distributed state (the standard: Lua/atomic check-and-decrement), local cache for hot counters, and honest 429s with Retry-After and a headers showing remaining quota. Harder follow-ups: distinguishing abuse from popularity (concurrency caps per tenant — cap2's noisy-neighbor fix), downstream provider limits (your gateway's *own* budget against the API provider — smooth bursts with a queue, escalate on sustained pressure), and fair queuing when you're capacity-bound (x3's degradation ladder). The classic design survives; the *units* change.

**Grounding:** Labs b1, x3 · cap2 · Mock 4 · KodeKloud problem 2

---
## Q-BR-2 — Notification System, LLM Edition

**Scenario:** Design the notification pipeline for an AI assistant: the assistant decides WHEN to notify ('your report is ready'), and messages must never duplicate or arrive twice.

**Your task:** The classic problem with a non-deterministic producer.

### Worked answer

The classic spine holds: queue (Kafka/SQS-class), fan-out per channel, idempotency keys, user preferences, rate caps. The AI twist is the *producer*: a non-deterministic decider upstream. Dedupe by idempotency key = hash(event_type + entity + day) — retry-safe across the whole pipeline (the classic exactly-once illusion, honestly: at-least-once + dedupe). New failure modes: the assistant double-decides (LLM called twice, decides twice — idempotency at the decision layer too), notification storms (budget: max N/user/day, enforced in code — c1's killer #4 in delivery clothing), and content quality (an LLM-written notification needs the b7 output validation before it reaches email — FN-08's tone lesson). Delivery receipts + user-level circuit breaker (3 marks-as-spam → pause and flag) close the loop.

**Grounding:** Lab b7, c1 · KodeKloud problem 3

---
## Q-BR-3 — News Feed → Recommendation Feed

**Scenario:** You know the classic news-feed design (fan-out on write vs read). Now it's an AI-curated feed with a ranker and ads slots.

**Your task:** What changes, what stays?

### Worked answer

Stays: the fan-out economics (write-time for celebrities, read-time for mortals — the hybrid), the feed store, the fanout queues. Changes: the read path gains the three-stage funnel (candidates from the feed store + retrieval sources → ranker at 100–300ms budget → re-rank with diversity + ad slots — a2's architecture, at feed scale), and the *feedback* path becomes load-bearing: every impression/click/dwell streams back into training (X.0's pipeline) — the feed is now a learning system with drift, popularity spirals (a2's coverage lesson), and A/B as the only truth (a8). New failure mode class: the feedback loop itself (the model trains on what it showed — FN-02's footprint problem, requiring exploration quotas and freshness injection). The classic question 'fan-out on write or read?' is now the *second* question; the first is 'what does the ranker see and when?'

**Grounding:** Chapter A.2 · Lab a2, a8 · Mock 2 · freeCodeCamp problem 4

---
## Q-BR-4 — URL Shortener → Model Endpoint Registry

**Scenario:** The classic URL shortener (hash, redirect, cache) vs a model-endpoint registry: every model version gets a stable URL, routed to serving infra.

**Your task:** Map the classic onto MLOps.

### Worked answer

Same skeleton: stable ID → routing table → target, heavy read cache, and the ID-assignment problem (collision policy). The MLOps differences: (1) the 'redirect' is a *load-balanced serving decision* — health-checked (x3's probes), shadow/canary aware (A.6: registry routes 5% to the challenger), (2) metadata is richer — version, eval scores, owner, rollback target — the registry IS the deployment state machine (my a1 extension hashed the artifact; registries do it for real), (3) mutation discipline: model swaps must be atomic and auditable (blue-green the routing table, never the models), (4) the cache layer is *semantic* (b5) not just HTTP. Interview framing: 'it's a redirect service where every target is stateful, expensive, and versioned — so the routing table is the product.'

**Grounding:** Chapters A.6, X.5 · Lab a1 · KodeKloud problem 1

---
## Q-BR-5 — The Search Bar, Ten Years Later

**Scenario:** Classic: search with an inverted index. Now: semantic search, hybrid, and the same p99 budget.

**Your task:** What's the 2026 answer?

### Worked answer

Hybrid is the default (my a5 lab: BM25 + vectors + RRF beat the best single system by 3–8 NDCG points — vocabulary mismatch and rare-entity failures are *different*, so fusion wins). Architecture: inverted index (ES-class) for lexical, ANN index (HNSW/IVF) for vectors — the memory math from cheatsheet #4 decides sizing — RRF fusion, optional cross-encoder rerank on top-50 (B.5: quality/latency trade — 40–150ms for 20 pairs). The 2026 additions that interviewers probe: embedding-model versioning (migrate = re-embed = index rebuild — plan it), freshness (CDC into both indexes), and eval as a standing asset (NDCG@10 on your corpus, in CI — a5's discipline). The classic concepts (term postings, tf-idf → BM25) still power half the system; the interview answer names both halves and the fusion.

**Grounding:** Chapters A.3, B.3, B.5 · Lab a5 · Mock 6

---
## Q-BR-6 — The Cache Hierarchy, Fuzzed

**Scenario:** You know LRU caches and CDNs. Now: a semantic cache in front of an LLM. What's different?

**Your task:** The shortest correct answer in this bank.

### Worked answer

Keys stop being exact: a semantic cache hashes *meaning* (embedding + threshold) — hit-rate economics are Zipf-dependent (b5: my 30–50% on support traffic, ~0% on unique queries), wrong-hits are a new failure class (a miss costs cents, a wrong hit costs trust — the trust dial: 0.85–0.92 threshold band, hand-audited), and invalidation becomes *semantic* (corpus change → flush by version hash; chunk-lineage for precision — my b5 runbook). The classic lessons survive: hierarchy (exact-match layer under the semantic layer — normalization first, embeddings second), stampede protection (coalesce concurrent misses), and monitoring (hit rate + wrong-hit rate + latency — all three on the dashboard). One sentence for the interview: 'a semantic cache is a CDN whose cache key is a query's meaning, whose TTL is corpus version, and whose miss penalty is $0.015.'

**Grounding:** Chapters X.0, B.6 · Lab b5

---
## Q-BR-7 — From Pub/Sub to Event-Driven Agents

**Scenario:** Classic pub-sub: producers, topics, consumers. Your agent platform needs: tool events, traces, and human approvals flowing between services.

**Your task:** Extend the classic.

### Worked answer

Pub-sub's guarantees (at-least-once, ordered per partition, consumer groups) carry over; what's new is *semantics*: (1) traces are fan-out topics (every service appends spans — OpenTelemetry-shaped), consumed by observability AND eval pipelines (c5's traces are the product), (2) human approvals are a *saga* pattern — the agent's state machine parks on a 'pending approval' event with a timeout and an escalation path (c2's grid made durable), (3) tool results flow back to the agent loop — request/reply over pub-sub needs correlation IDs and TTLs (the loop must not hang forever: c1's budget enforced as message TTL). The classic question 'at-least-once vs exactly-once?' becomes concrete: tool side effects need idempotency keys *because* redelivery happens (c2's rubric item 5).

**Grounding:** Chapters C.1–C.2, X.0 · Labs c1, c2 · ai-stack/data-pipelines.md

---
## Q-BR-8 — The Sharded Database, Vector Edition

**Scenario:** Classic: shard a SQL database by key. Now: shard a 2-billion-vector index across nodes.

**Your task:** What transfers, what's new?

### Worked answer

Transfers: shard by key (tenant or document-set — natural isolation, cap2's crossover logic), replication for availability, rebalancing pain. New: (1) ANN doesn't shard cleanly — each shard searches locally and you merge top-k (the K-way merge is approximate: recall drops slightly — measure it), (2) memory math dominates: 2B × 1,536-d × 4B ≈ 12 TB raw + HNSW overhead → ~25+ TB RAM-class capacity → dozens of nodes, and now node loss = *recall* degradation, not just capacity loss (the X.5 conversation gets new teeth), (3) hot shards by tenant/popularity (the whale again — cap2's fairness caps), (4) re-indexing a shard while serving (b3's bad day, distributed edition). The interview shape: same sharding principles, new physics — vector count × dims × 4 × overhead is the capacity plan, and recall-at-scale is the SLO that replaced 'rows served.'

**Grounding:** Chapters B.3, X.1 · cheatsheet #4 · Mock 7

---
