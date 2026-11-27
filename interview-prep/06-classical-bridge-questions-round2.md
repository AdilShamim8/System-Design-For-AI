# Classical-to-AI Bridge Questions — Round 2

**Five more classics, re-asked.** The pattern holds from round 1: the classic design survives, the AI layer adds units and failure classes. This round's classics are the ones senior interviewers reach for when the candidate is good: consistency models, CDC, backpressure, idempotency, and the blob store.

## Q-BR-9 — The Consistency Lecture, RAG Edition

**Scenario:** Classic: CAP, eventual consistency, read-repair. Now: your RAG index (vector + lexical) is replicated across 3 regions. A doc is updated in region 1; queries in region 3 serve stale chunks for 90 seconds. Legal says a customer was misled by a stale policy doc.

**Your task:** Re-explain consistency for the AI era — and design the fix.

### Worked answer

The classic concepts transfer with new teeth: read-your-writes consistency, which databases solved with sessions and version tokens, becomes *citation freshness* — the user (or legal) must never be cited a version older than what they've already seen. The 90-second window is eventual consistency wearing a liability costume (FN-04's shape: the system worked as designed; the design was the problem). Fixes in order of leverage: (1) version-stamped citations — every generated answer carries the corpus version it retrieved from; when the doc updates, stale answers are *provable* stale (audit trail), not arguable (2) write-through invalidation for the hot set — policy docs get synchronous re-embedding on update (the small, legally-sensitive corpus pays the latency tax; the long tail stays async — a two-tier consistency model, which is the actual design pattern here), (3) cache invalidation keyed on corpus version (b5's runbook: semantic cache flushed by version hash, so an update kills cached answers derived from the old doc within seconds), (4) the honest product answer: a 'this answer reflects documents as of T' footer for compliance-relevant content — consistency as a user-visible contract, not just an infrastructure property. The interview line: 'eventual consistency was a database property; in RAG it's a legal exposure — so we version citations and pay synchronous cost exactly where the compliance risk lives.'

**Grounding:** Chapters B.2, B.5, X.0 · Labs b3, b5 · cheatsheet #2

---

## Q-BR-10 — CDC for Embeddings

**Scenario:** Classic: change-data-capture keeps a cache warm. Now: your RAG corpus lives in a docs CMS; docs change constantly. Chunks and embeddings must follow within minutes, not the current nightly batch.

**Your task:** Design the pipeline — and say what breaks.

### Worked answer

The classic spine holds: source WAL/oplog or webhooks → stream → transform → sink. The AI twist is the transform is *expensive and non-deterministic*: re-chunking and re-embedding a doc is a model call (seconds, dollars-per-thousand), so the pipeline needs debouncing (a doc saved 5 times in a minute is one re-embed, not 5 — batch within a 2-minute window), idempotency (doc-id + content-hash as the key: unchanged content skips the embed call entirely — typically 60–80% of edits don't change the chunks that matter), and ordering (re-embed v2 while v3 arrives → last-write-wins by version, never by arrival time). Sinks: the vector store (upsert by chunk-id), the lexical index (delete+insert, or upsert if supported), and the *cache invalidation* (b5: flush keys derived from the old corpus version — the sink everyone forgets until a stale answer survives the re-embed). What breaks at 3 AM: the embedder model's rate limit (backpressure: the queue is the buffer — c1's budget, applied to pipes), a schema change in the CMS (the pipeline validates event shape and dead-letters the unknown — fail loudly, never silently skip), and the re-embed drift (new embedder version mid-stream → tag vectors with model version and refuse mixed-version queries (Q-GEN-10's rule). The sentence: 'CDC's guarantees are unchanged; the transform is now a model call, so debounce, dedupe by content-hash, and treat the cache as a first-class sink.'

**Grounding:** Chapters X.0, B.2, B.3 · Labs b3, b5 · ai-stack/data-pipelines.md

---

## Q-BR-11 — Backpressure, Agent-Scale

**Scenario:** Classic: a queue protects a slow consumer. Now: your agent platform's LLM provider starts throttling (429s) at 2 PM daily. Agents hold open loops; users wait. Your gateway's retry logic is making it worse.

**Your task:** Explain why retries make it worse, then design the right pattern.

### Worked answer

Why retries backfire: retries add load to a provider already at capacity (the classic retry-storm), and for agents the damage compounds — each retry is a fresh context (tokens re-sent, cost re-incurred), so an agent near its budget burns out faster *because* of the retry (c1's killer #3, provider edition). The right pattern is the classic toolbox, adapted: (1) shed load *before* the provider does — a request admission queue at the gateway with per-tenant fairness (cap2's caps): better to hold 200 requests for 30 seconds than to have the provider hold 2,000 hostage; (2) exponential backoff with *jitter* at the individual-request level, but capped total attempts (my b4 numbers: provider 429s resolved with backoff+jitter in seconds; naive retry doubled effective load); (3) circuit breakers per provider-model pair — trip on sustained 429s, reroute to the fallback model (b6's routing ladder: frontier → mid → small, each hop pre-evaluated), degrade gracefully (x3's ladder: async mode, queue-and-notify, canned answers for the trivial intents) rather than failing hard; (4) budgets that propagate: the agent's token budget shrinks as it waits, so waiting agents *reduce* downstream pressure automatically. The sentence for the interview: 'the queue moved from between my services to between me and my provider — same pattern, new position, and the retry logic has to know that a 429 is the provider's queue telling me to stop.'

**Grounding:** Chapters C.1, X.5 · Labs b4, b6, x3 · cheatsheet #10

---

## Q-BR-12 — Idempotency at the Money Boundary

**Scenario:** Classic: idempotency keys prevent double-charges. Now: your shopping agent can complete purchases. The flow spans 4 services (agent → checkout → payment → inventory) and a timeout anywhere causes retries that have, twice, double-charged.

**Your task:** Design idempotency across the saga.

### Worked answer

The classic rule survives and extends: one idempotency key, minted once, at the entry point — the agent mints key = hash(user, session, cart-version) before the first call, and every downstream service (checkout, payment, inventory) must honor it (the saga pattern: each step records 'key → outcome' durably before acting; a retry reads the record, not the world). The AI-era additions: (1) the *non-deterministic decider* — the agent may decide twice (two generations, two purchase decisions for one intent), so the idempotency boundary is the *intent*, not the call: 'buy the cart' is one keyed operation regardless of how many times the model proposes it (c2's contract rubric, item 5, at the money boundary); (2) human-in-the-loop as an idempotency anchor — the approval event is part of the key lineage (approval-id + cart-version): a re-approved purchase after a timeout is a *new* intent and gets a new key, which is the correct semantics; (3) the read-path is exempt — product browsing, price checks are idempotent by nature; key only the state-changers (the grid's read/write split (c2), applied to keys). What you log: key, step, outcome, timestamp — the audit trail for the 'why was I charged twice' ticket, which is exactly the Q-AG-11 audit log content. The sentence: 'idempotency keys classically protect against transport retries; here they protect against the model re-deciding — the key follows the intent, not the request.'

**Grounding:** Chapters C.2, X.0 · Labs c1, c2 · FN-07

---

## Q-BR-13 — The Blob Store, Vector Edition

**Scenario:** Classic: S3-style object storage for files. Now: your platform stores 500M source documents (PDFs, HTML, images), and each doc fanned out into 3–8 chunks with vectors, lexical index entries, and cached summaries. Storage team wants one policy for all of it.

**Your task:** Design the storage tiers — and defend the lifecycle.

### Worked answer

The classic tiering survives (hot/warm/cold by access frequency), but the AI twist is *fan-out*: one source doc becomes 5–15 derived objects across 3 stores (vectors, postings, caches), and lifecycle policy must treat them as a family — deleting the source while keeping chunks is a correctness bug (retrieval cites a doc you can no longer serve — the citation-rot problem), and deleting derived data while keeping the source is a cost bug (you paid to embed a corpse). The design: source docs in versioned object storage with legal-hold capability (the audit trail of Q-AG-11 needs the original; deletion requests (GDPR) must cascade — doc-delete → chunk-delete → vector-delete → cache-flush, as a *saga* with verification, because a missed cascade is a compliance incident); derived artifacts in purpose-built stores (vector DB, inverted index) with their own tiering by *retrieval frequency* (the Zipf head of queries touches ~10–20% of chunks — tier the tail down or drop to disk-based indexes); the lineage metadata (doc-id → chunk-ids → vector-ids → cache-keys) in a cheap relational store — the map is small, hot, and load-bearing for every cascade and every migration (Q-GEN-10's dual-write used exactly this map). Lifecycle defense in numbers: embeddings ≈ 500M docs × 5 chunks × 1,536 dims × 4 B ≈ 15 TB vectors alone, plus postings and caches — the tiering isn't optimization, it's the difference between a storage bill you can pay and one you can't. The sentence: 'object storage's lesson was dedupe and tier; the vector era adds fan-out — every doc is a family of derived objects, and lifecycle policy operates on the family or not at all.'

**Grounding:** Chapters B.3, X.0, X.1 · Labs b3, b5 · cheatsheet #4 · ai-stack/vector-databases.md

---

