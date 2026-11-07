# GenAI / LLM System Design Questions
**9 scenario questions** on RAG, cost, caching, fine-tuning, and structured output. Same drill: your 5-minute sketch first, worked answer second.

## Q-GEN-1 — Docs Bot, Legal Watching

**Scenario:** A 40-person company wants a chatbot over its 8K internal docs (HR, finance, engineering). Legal is nervous about wrong answers. 2K employees, ~30 questions/user/month.

**Your task:** Design it — and tell legal what you'll show them.

### Worked answer

RAG (not fine-tuning — the corpus changes and citations are the point, b6's matrix): section-aware chunking with metadata, hybrid retrieval (BM25+embeddings, RRF), reranker, cited generation with a strict refusal line. The legal answer is the *measurement plan*: faithfulness + refusal-rate eval on an adversarial set before launch (my b2 lab took refusal from ~60% to ~90% with prompt structure; the residual is why output guardrails + 'not legal advice' scoping exist — FN-04's lesson: liability follows deployment). Show them: the eval report, the transcript logs with versions, the escalation path, and the corpus governance (which docs, what freshness). Cost: ~4.5K input tokens/req × 60K req/month ≈ ~$1K/month at mid tier — or ~$150 routed (b1/b6 economics).

**Grounding:** Chapters B.2–B.8 · Labs b2–b4 · Mock 1 · cap1

---
## Q-GEN-2 — Multi-Tenant RAG SaaS

**Scenario:** You're building 'ChatDocs-as-a-service': each customer uploads their own docs. 50 customers now, big ones coming.

**Your task:** The three hardest problems, in order.

### Worked answer

(1) **Isolation** — tenant-scoped retrieval verified end-to-end (my cap2: cross-tenant phrasing queries leaked 5–15% on an unverified shared index; the fix is hard filters + a standing isolation test in CI), plus namespaced caches and per-tenant keys. (2) **Quotas & fairness** — per-tenant token buckets and concurrency caps (without them, one chaos tenant tripled innocent p99s in my load lab). (3) **Cost attribution** — per-tenant ledgers from day one (x2); the whale's inefficiency is your margin problem. Choose index-per-tenant now, shared+filter at ~50–100 (measurable crossover, don't guess), and design the admin API as the real product surface.

**Grounding:** Chapter X.1 · capstone cap2 · Mock 4, 7

---
## Q-GEN-3 — The Stale Answer Problem

**Scenario:** Your RAG bot answers 'our refund policy is 30 days' — the policy changed to 45 last week. Nobody noticed for 9 days.

**Your task:** Design freshness so it can't happen again.

### Worked answer

The corpus is a data pipeline, not a pile (X.0): CDC on the source system (docs live in a CMS/DB that others mutate) → event per changed doc → re-chunk and re-embed *that document* → upsert index with new doc-version → invalidate cache entries by chunk-lineage (my b5's corpus-hash flush is the blunt version; lineage-based is the precise one). The monitoring layer: answer-freshness canary questions ('what is the refund window?' checked hourly against the source), doc-version mix on a dashboard, and an alert when the index's newest doc-age exceeds SLA (x1's horizons). The 9-day silence is the deeper bug: nothing queried freshness — canaries close that hole.

**Grounding:** Chapters X.0, B.2 · Labs b5, x1 · ai-stack/data-pipelines.md

---
## Q-GEN-4 — Chunk-Size Argument

**Scenario:** Two engineers on your team are fighting: 200-token chunks with k=8 vs 800-token chunks with k=3. Both cite blog posts. Ship stops.

**Your task:** End the argument.

### Worked answer

You end it with the only artifact that can: a measurement on YOUR corpus and YOUR questions (b3's harness — I ran exactly this on a real 10-K: section-aware beat fixed by 15–25 hit points, and the size sweep's quality/cost knee landed ~450 tokens). The method: 20+ labeled questions with verified gold fragments, run all four configs (200/8, 800/3, and two between), compare hit@k AND end-to-end answer quality AND prompt cost (200×8 = 1,600 in-tokens vs 800×3 = 2,400 — the 'cheap' small chunks aren't). Likely outcome: both lose to the middle. The durable lesson for the team: chunking is a measured tradeoff, and the harness settles it in an afternoon — every time.

**Grounding:** Chapter B.4 · Lab b3

---
## Q-GEN-5 — To Fine-Tune or Not

**Scenario:** Stakeholder: 'OpenAI just dropped a fine-tuning API — let's fine-tune on our docs and skip all this retrieval complexity.'

**Your task:** Respond — with the decision matrix, not opinion.

### Worked answer

The sentence that reframes: fine-tuning changes *behavior*, retrieval changes *knowledge* (b6). Their docs change daily (knowledge), need citations (auditability), and exceed what weights hold economically — all three point to RAG. Fine-tuning earns its cost when: fixed-output style/format, a stable label taxonomy, or volume economics (my break-even: ~10M+ tokens/day before self-hosting/fine-tuning pays). The killer experiment: run the few-shot prompt baseline first (in my lab it came within a point of a fine-tune at zero training cost) — if prompting + RAG hits the eval bar, fine-tuning is a solution hunting for a problem. Offer it as v2 with a trigger: 'if evals show style-compliance failures at >X%, we revisit.'

**Grounding:** Chapter B.6 · Lab b6

---
## Q-GEN-6 — The $14K Surprise Bill

**Scenario:** Month 2 of your chatbot: the API bill is $14K, up from $3.2K. Traffic grew 40%.

**Your task:** Find the money before the CFO finds you.

### Worked answer

Cost grew 4.4× on 1.4× traffic — something *else* doubled. Diagnose from request logs (x2): token mix (did contexts fatten — k creep, history growth (c4's linear tax), longer system prompts?), tier mix (did the router silently start escalating more?), cache hit rate (did the corpus re-index flush the cache and change the key distribution?), and per-tenant concentration (the whale's 8-chunk habit, cap2). My money-is-here priors: uncapped conversation history is the most common silent 3× (every turn resends everything — c1's curve); a prompt 'improvement' that added 1K tokens is the second. The levers by ROI: trim context → cache harder → route down-tier (60–80% cut in my labs) → re-chunk the whale. Then: budget alerts per tenant so month 3 doesn't surprise anyone (x1's cost rules).

**Grounding:** Chapters X.4, c4 · Labs b1, b5, x2

---
## Q-GEN-7 — Structured Extraction at Scale

**Scenario:** Extract structured data (name, SKU, price, condition) from 1M messy marketplace listings. Downstream: a Postgres table. Currently: humans, $0.05/listing.

**Your task:** Design the pipeline — and the eval that gates it.

### Worked answer

LLM-as-extractor with the b7 stack: schema (Pydantic) as the contract, JSON mode, temperature 0, bounded repair loop with error feedback (rescues most failures at 2–3× cost — my lab: 98–99% after one repair), dead-letter queue with human review for the residue, circuit breaker on validation-failure spikes. The gate: a hostile eval corpus (price ranges, missing fields, contradictions) with per-field precision/recall; ship when wrong-field cost < human cost at the dead-letter rate (the math: $0.05 human vs ~$0.002 LLM+review — worth it at up to ~10% dead-letters). Rollout: shadow against human labels for a week, then auto-accept the confident band, humans review the tail. FN-04 discipline applies: this writes to a database — validation is a trust boundary.

**Grounding:** Chapter B.1, B.8 · Lab b7

---
## Q-GEN-8 — The Semantic Cache Fight

**Scenario:** Teammate ships a semantic cache at similarity 0.75 to 'maximize savings.' Savings are real. So are the wrong answers.

**Your task:** The threshold conversation, and the broader economics.

### Worked answer

A miss costs cents; a wrong hit costs trust (b5's asymmetry — same shape as fraud's FN/FP). At 0.75 on MiniLM-scale embeddings, different questions cluster together (my calibration: different-ask lands 0.65–0.80 — the danger zone is exactly there). Process: hand-audit 100 hits, set threshold from the measured wrong-hit curve (0.85–0.92 was my band), re-tune on embedder change, and log best-sim per lookup so the threshold is a *dashboard-adjustable* number, not a constant. Broader: the cache's value is traffic-shaped (Zipf yes, uniform no — my 30–50% vs near-zero measurement) — model the query distribution before crediting savings, version keys by corpus hash (invalidation, FN-adjacent: stale answers are wrong answers), and coalesce concurrent misses (stampede).

**Grounding:** Chapters B.6, X.4 · Lab b5

---
## Q-GEN-9 — Half a Second or Nothing

**Scenario:** The product spec: 'AI autocomplete in the editor — p95 full-suggestion latency 400ms.' The model alone takes 350ms to first token.

**Your task:** What are your options, ranked?

### Worked answer

The budget is the boss — work the three clocks (b1): (1) TTFT and total are different problems; autocomplete needs *streamed partial* suggestions (show the first 2–3 words, keep generating — perceived latency collapses), (2) shrink the path: smaller/faster model class or quantized self-host for the autocomplete tier (routing by task — b6), prefix-cache the enormous system+context so only the query embeds fresh (KV/prompt caching — why the shared context is nearly free on modern engines), (3) move work offline: precompute suggestions on idle keystrokes, predict-ahead on cursor position, speculative generation on the previous token. If none fits: the honest escalation is a product conversation with numbers ('400ms total means 15ms retrieval + 300ms generation — the spec buys us a smaller model or streaming UI'). Never silently miss SLOs; that's how X.5 incidents start.

**Grounding:** Chapters B.1, X.4 · Labs b1, x3 · cheatsheet #5

---
