# Flashcards — The Classical Bridge

22 cards. The classics re-asked for AI: what survives, what changes, and the one sentence that shows you know both. Pairs with the bridge banks (06, 06-round2).
---

**The bridge pattern, stated once.**

> The classic design survives; the AI layer adds units (tokens), failure classes (non-determinism, drift, injection), and feedback loops. Every bridge answer opens with that shape — 'the classic spine holds, here's what changes.'

**Rate limiter, LLM edition — the twist in one line.**

> Two-dimensional limits: requests/min AND tokens/day, because cost scales with tokens, not calls (Q-BR-1). Buckets keyed by (user, model-tier); the frontier tier needs its own tighter bucket.

**Notification system, LLM edition — the new failure class.**

> A non-deterministic producer upstream: the assistant double-decides (idempotency at the DECISION layer), notification storms (max N/user/day in code), and LLM-written content needs output validation before it reaches email (Q-BR-2).

**News feed → AI feed — what becomes load-bearing.**

> The feedback path: every impression/click/dwell streams into training — the feed is now a learning system with drift, popularity spirals, and A/B as the only truth (Q-BR-3).

**The 2026 search answer — the one-liner.**

> Hybrid by default: BM25 + vectors + RRF beat the best single system by 3-8 NDCG points because vocabulary-mismatch failures and rare-entity failures are DIFFERENT failures (a5, Q-BR-5, coding-11).

**Semantic cache vs classic cache — the three deltas.**

> Keys are meanings not strings (embedding + threshold); wrong-hits are a new failure class (a miss costs cents, a wrong hit costs trust — the 0.85-0.92 band); invalidation is semantic (corpus version flushes) (Q-BR-6).

**Pub-sub → agent events — what the new messages carry.**

> Traces (fan-out, consumed by observability AND eval), human approvals (a saga with timeouts and escalation), tool results back to the loop (correlation IDs + TTLs) (Q-BR-7).

**Sharded SQL → sharded vectors — the two new problems.**

> ANN doesn't shard cleanly (per-shard search + K-way merge, recall drops — measure it), and memory math dominates: 2B x 1,536d x 4B is ~12TB raw before HNSW overhead (Q-BR-8).

**Consistency, RAG edition — the legal reframe.**

> Eventual consistency was a database property; in RAG it's a legal exposure — stale citations mislead customers. Fixes: version-stamped citations, two-tier consistency (sync for the sensitive corpus), corpus-version cache flushes (Q-BR-9).

**CDC for embeddings — the three AI-specific guards.**

> Debounce (5 saves in a minute = 1 re-embed), dedupe by content-hash (60-80 percent of edits don't change the chunks that matter), and the cache is a first-class sink (everyone forgets it until a stale answer survives) (Q-BR-10).

**Retries under provider throttling — why they backfire.**

> Retries add load to an already-saturated provider, and each agent retry re-sends context (tokens re-billed). Fix: admission queue with per-tenant fairness BEFORE the provider, backoff+jitter capped, circuit breakers per provider-model with routing fallback (Q-BR-11).

**Idempotency at the money boundary — the AI extension.**

> The key follows the INTENT, not the request: the agent may decide twice, but 'buy the cart' is one keyed operation. The approval event is part of the key lineage (Q-BR-12).

**Blob store, vector edition — the family rule.**

> One doc becomes 5-15 derived objects across 3 stores; lifecycle policy operates on the family (source delete cascades to chunks, vectors, caches) or not at all. The lineage map is small, hot, and load-bearing (Q-BR-13).

**What CAP means for a RAG index.**

> The C and A tensions appear as citation freshness vs availability; the practical answer is per-corpus consistency tiers, not a global setting — legal sensitivity decides where you pay synchronous cost.

**The one-sentence bridge for ANY classic question.**

> 'The classic concepts still power half the system; the interview answer names both halves and the fusion.' Say it, then draw the classic spine with the AI units annotated.

**When an interviewer asks a pure classic (no AI twist) in an AI loop.**

> Answer it as a classic first — the probe is whether your AI knowledge sits ON TOP of fundamentals, not instead of them. Depth first, bridge second.

**Backpressure — the position change.**

> The queue moved from between my services to between me and my provider — same pattern, new position, and a 429 is the provider's queue telling me to stop (Q-BR-11).

**Read-your-writes, AI costume.**

> The user must never be cited a document version older than one they've already seen — session-scoped consistency tokens on retrieval (Q-BR-9's session case).

**Why feature stores are 'just CDC with a contract.'**

> Same log-processing spine; the additions are point-in-time guarantees and training/online parity checks — the contract IS the product (A.1, Q-ML-6).

**The double-write migration, one line.**

> Never delete the old index; dual-write, backfill newest-first, cut over per-consumer behind flags, search LAST (cross-model similarity is meaningless) (Q-GEN-10 — the bridge's hardest practical question).

**The tell that separates bridge-fluent candidates.**

> They volunteer what DOESN'T change — 'the classic spine holds' — before listing the AI additions. Candidates who only list additions read as not knowing the classics.
