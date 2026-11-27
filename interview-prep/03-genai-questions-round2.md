# GenAI System Design Questions — Round 2

**Five more, one level deeper.** Round 1 covered the architectures; round 2 covers the *operations* — migrations, multilingual corners, structured output, and the economics of context. These are the follow-up questions that separate 'read the blog post' from 'ran the system.'

## Q-GEN-10 — The Embedding Migration

**Scenario:** Your RAG system's embedding model is being deprecated. 80M chunks, 400 GB of vectors, 12 downstream consumers (search, dedupe, recommendation, clustering). The new model is 4 points better on your eval set.

**Your task:** Run the migration without a 3-week outage.

### Worked answer

The trap is treating it as one migration; it's twelve. Sequence: (1) freeze the old model as a versioned alias (never delete — dedupe and clustering jobs comparing *within* a corpus can keep old vectors as long as they never mix with new in one query); (2) dual-write new vectors alongside old during re-embedding (80M chunks at ~1–2K chunks/sec/worker = a few days of batch compute — budget it, it's the long pole); (3) backfill in corpus-version order, newest first (freshest content serves most queries); (4) per-consumer cutover behind a flag, search last (it's the only consumer where mixing old and new vectors in one query breaks correctness — cross-model cosine similarity is meaningless); (5) eval before and after each consumer cutover: NDCG@10 and hit@k on the frozen set (my b3 discipline: eval is the only migration-safe metric). What you tell stakeholders: the 4-point gain is *aggregate* — some queries get worse; the per-consumer eval is where you find which ones, and that's the rollback trigger, not the average.

**Grounding:** Chapters B.3, B.6 · Lab b3 · cheatsheet #4 · ai-stack/vector-databases.md

---

## Q-GEN-11 — The Multilingual Corner

**Scenario:** Your support RAG serves 30 languages. CSAT is fine in 8, mediocre in 12, and quietly broken in 10 — the retrieval returns English docs for non-English queries. Nobody noticed for a quarter.

**Your task:** Diagnose and fix the retrieval language gap.

### Worked answer

Diagnose first: is it retrieval or generation? Sample 50 low-CSAT transcripts per language tier and grade retrieval separately (does the cited doc match the question's language and actually answer it?) — in this pattern it's usually retrieval: multilingual embedders are strongest in their training-heavy languages and degrade on the tail (Turkish, Thai, Vietnamese), and BM25 without proper per-language analyzers tokenizes non-Latin scripts into noise. The fix stack, in order of leverage: (1) a language-ID tag on every query and chunk, stored as metadata — you cannot fix what you cannot route; (2) hybrid retrieval with language-filtered search (query language = doc language by default, English fallback only for technical terms — the filter alone often recovers most of the gap); (3) per-language eval sets — a global NDCG number hides exactly this failure (the broken 10 languages were averaged away — that's why nobody noticed); (4) translation-tier triage: for the worst languages, query-translate-then-retrieve beats degraded native embeddings (measure per language; don't assume). The governance fix: per-language dashboards, not one global CSAT — a metric that can hide a third of your users is not a metric, it's a filter.

**Grounding:** Chapters B.2, B.3, B.8 · Lab b3 · cheatsheet #9

---

## Q-GEN-12 — Structured Output That Cannot Lie

**Scenario:** Your LLM gateway returns JSON for a downstream billing system. Once every ~3,000 requests the model returns malformed JSON; once every ~20,000 it returns valid JSON with a *wrong* schema field (price_cents as a string). Billing is downstream and strict.

**Your task:** Make the contract unbreakable — layers, in order.

### Worked answer

Layer 1 — make violation hard: constrained decoding / structured output modes (JSON schema enforcement at the API level) eliminates the malformed case almost entirely; if your provider lacks it, a grammar-constrained local parser is the fallback. Layer 2 — make violation visible: schema validation at the gateway (JSON Schema or Pydantic) with a typed error channel — never a silent retry that might double-charge (idempotency keys on every billing call, c2's rubric applied to pipes). Layer 3 — make violation cheap: a repair loop (one retry with the validation error in the prompt, temperature 0) catches the residue for <0.1% cost; beyond one retry, refuse and escalate — a human fixing 1-in-20,000 beats a model improvising a price (FN-04's lesson: confident wrong answers are the liability, not the format error). Layer 4 — make violation measurable: log validation-failure rate as a first-class metric with SLO (my b7 numbers: output validation caught ~2–5% of generations pre-ship). The billing-specific hard line: price fields get a type check *and* a range check — a valid number that is 10x too large is the failure that actually reaches a customer.

**Grounding:** Chapters B.6, X.3 · Labs b7, c2 · ai-stack/observability-eval.md

---

## Q-GEN-13 — The Context Window You Cannot Afford

**Scenario:** Your document analysis product pours 30–50 documents (200–400K tokens) into the frontier model's context. Quality is fine. The bill is $11K/month and the CFO saw it.

**Your task:** Cut the context bill without cutting quality. What's the order of operations?

### Worked answer

First, measure where tokens go: full-context products are usually 70–80% *repetitive boilerplate and irrelevant docs* — prompt-usage dashboards (provider-side) or a token-accounting proxy (x2's cost tree) turn the $11K into a per-component number. Then the order: (1) retrieval instead of inclusion — if the answer depends on 5 of 40 docs, retrieval selects the 5 (RAG over your own corpus; my b3 numbers: chunked retrieval matched full-context quality at ~4.5K tokens/request vs 300K — a 60x cut); (2) prompt caching for the static prefix (system prompt, few-shots, tool schemas — often 20–40% of the bill and cache-hit pricing is ~10x cheaper); (3) model routing — the frontier model for reasoning-heavy requests, a mid-tier for extraction/classification (my b6 routing runs: 70% of traffic routed down with no measurable quality loss, ~$150 vs ~$1K/month at my scale); (4) only then, summarization/compression of what remains (lossy — last resort, and eval-gated). The CFO line: 'we keep the frontier model for the 30% of calls that need it; the rest go to a model 10x cheaper, and quality is unchanged on the eval set.' That's a cost story with a number and a metric — the only kind that survives a CFO meeting.

**Grounding:** Chapters B.4, B.6, X.4 · Labs b1, b6 · cheatsheet #6

---

## Q-GEN-14 — Eval Is a Product

**Scenario:** Your team ships prompt changes weekly. Every change gets a 20-question vibe-check. Last month a prompt change broke citations and it reached users before anyone noticed. Your manager asks for 'a real eval suite' with no budget for annotators.

**Your task:** Build it — what's in v1, and what deliberately isn't.

### Worked answer

v1 has four assets. (1) A frozen golden set: 100–300 real production queries sampled stratified (by intent, language, difficulty), with graded answers — start with the ones you already have transcripts for and grade 20/week until the set fills (no annotators: engineers grade against a written rubric — slower but it starts this week and teaches the team what 'good' means). (2) Exact-graded retrieval metrics in CI: hit@k on labeled query-doc pairs, runs on every PR, blocks on regression (b3's discipline — this alone catches the citation-class break). (3) LLM-judged generation metrics on the golden set: faithfulness and refusal-rate against an adversarial slice, temp 0, two judges if you can afford one extra call — the refusal eval is what catches the Air Canada pattern (FN-04) before users do. (4) A canary eval in production: sample 1% of traffic weekly against the same rubric — the vibe-check's replacement, automated. What's deliberately not in v1: human preference panels (wait for volume), red-teaming at scale (borrow the adversarial set from your refusal slice), and statistical significance on every metric (you have 100 examples; report per-slice, don't p-hack). The sequencing argument that wins budget later: 'v1 costs one engineer-week and catches the class of failure we just had; v2 needs annotators precisely when v1 proves which slices matter.'

**Grounding:** Chapters B.8, X.3 · Labs b2, b3, b7 · cheatsheet #9 · mock 1

---

