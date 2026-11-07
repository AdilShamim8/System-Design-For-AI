# Flashcards — GenAI & RAG

25 cards. Track B's pipeline, evaluation, and economics.
---

**RAG in one sentence — and the one word that matters most.**

> Retrieve relevant chunks, generate an answer grounded in them. The word: *grounded* — the alternative is Air Canada (the tribunal: the chatbot is the company).

**The five RAG stages and each one's failure mode.**

> Chunking (severed context) → embedding (domain mismatch) → retrieval (vocab/distractor/multi-hop misses) → generation (grounding drift, refusal failure) → ops (staleness, no evals).

**Chunk size — the tradeoff, stated as a decision.**

> Small: tight matches, cheap prompts, fragmented answers. Large: coherent context, diluted attention, expensive. My measured knee: ~450 tokens on a 10-K. The knee is corpus-specific — measure it.

**Chunking strategy ranking on structured documents — and why.**

> Section-aware > recursive > fixed (my 10-K lab: +15–25 hit points for section-aware at identical cost). Structure the corpus already has is free retrieval quality.

**k (retrieved chunks) — why is it a budget dial, not a quality dial?**

> More chunks = more input cost AND attention dilution AND wrong-citation chances. The professional move: rerank to keep quality at LOWER k, not crank k.

**Grounding prompt — the three components.**

> Answer ONLY from context · cite chunks like [1] · explicit refusal instruction ('say exactly: I don't have that in my sources'). Measured: refusal on out-of-corpus went ~60% → ~90% with all three.

**Two-tier RAG evaluation — the tiers and their costs.**

> Retrieval: hit@k, MRR — free, exact, in CI. Generation: faithfulness + relevance via temp-0 judge — costs tokens, needs bias-testing. Tier 1 first: every question it answers doesn't need a judge.

**The judge biases to test before trusting.**

> Position (identical A/B flips ~25%+ without randomization) · length (verbose wins unless penalized) · self-agreement (temp 0 ≈ 0.95+, default temp drifts).

**The debugging order for 'the RAG bot answered wrongly.'**

> Was the gold chunk retrieved? NO → retrieval problem (classify the miss type). YES → generation problem (prompt/model). Attribute before fixing — the most common mistake is prompt-fixing a retrieval bug.

**RAG vs. fine-tuning — the decision sentence.**

> Fine-tuning changes behavior (style, format, classification); retrieval changes knowledge (corpus, citations, freshness). Behavior → weights; knowledge → index.

**The few-shot baseline rule.**

> Run a few-shot prompted LLM on the same eval set BEFORE any fine-tune. My lab: within a point of a DistilBERT fine-tune at zero training cost. Fine-tuning must beat it to justify existing.

**RAG cost structure — the headline split.**

> ~4.5K in / 400 out per request → 60–90% of cost is INPUT tokens. Optimize input: context trim → cache → route down-tier. Answer-length optimization polishes the 10–20%.

**The four cost levers, ranked.**

> 1. Trim context (chunk size, k, history) 2. Semantic cache (30–50% on Zipf-ish traffic) 3. Tier routing (60–80% cut in my labs) 4. Self-host (crossover ~10M–100M tokens/day, mid-tier).

**Semantic cache — the threshold tradeoff, with numbers.**

> Higher threshold: fewer hits, fewer wrong hits. My MiniLM band: 0.85–0.92 → 30–50% hit rate, 1–3% wrong hits (hand-audited). A miss costs cents; a wrong hit costs trust.

**Semantic cache — the two failure modes teams forget.**

> Invalidation (corpus changed → every cached answer silently wrong; fix: version keys by corpus hash) and stampede (viral question, 5,000 concurrent misses; fix: request coalescing).

**Structured outputs — the trust boundary framing.**

> LLM output writing into a database is untrusted input at a trust boundary: schema validation (Pydantic), JSON mode, temp 0, bounded repair with error feedback, dead-letter queue, circuit breaker on failure-rate spikes.

**Repair loop economics.**

> Error-feedback retry rescues most failures at 2–3× single-call cost — fine at 5% failure rate, pathological at 40% (fix the prompt). Monitor repair-rate as a first-class metric.

**Hallucination rate — the honest answer to 'what's your rate?'**

> 'Measured per release on a versioned adversarial set: ~10% out-of-corpus compliance before hardening, low single digits after; the residue is why guardrails and citations exist.' Never zero — never claimed.

**The modality gap.**

> Image→image similarity systematically beats image→text in a joint space — the two modality clouds don't overlap. Practical: never mix similarity scores across modality pairs in one ranking; visual search should take photos as queries when possible.

**CLIP-style retrieval — strong at / weak at.**

> Strong: scene-level semantics ('dog on beach'). Weak: counting, fine attributes ('the RED kite'), relations ('behind'), text-in-images. Mitigations: metadata filters, rerankers, OCR sidecars, human review.

**Context window economics — why not stuff everything?**

> Cost scales linearly with context · attention dilutes ('lost in the middle', Liu et al. 2023) · latency grows. Big windows are for *selective* depth, not hoarding.

**Embedding model selection — the MTEB trap.**

> MTEB ranks generic benchmarks; your domain decides. Rerun a 50-pair eval on YOUR corpus before committing. And: models differ in similarity scale — re-tune cache/dedupe thresholds on migration.

**Vector DB at small scale — the boring right answer.**

> ≤ a few million vectors and already on Postgres → pgvector (one less system). Everything works below ~100M vectors; choose on filtered-search semantics, upserts, ops — not Recall@10 benchmarks.

**Corpus freshness — the production pattern.**

> Source DB changes → CDC events → re-embed changed chunks → upsert index → invalidate cache by chunk lineage. Plus: canary questions ('what's the refund window?') checked against the source — the 9-days-stale failure mode.

**Prompt versioning — the postmortem that enforces it.**

> Prompt v41→v42 shipped Friday without eval; faithfulness −9% by Monday; no alert because the metric existed but the alert didn't. Fix: prompts are versioned artifacts in CI with canary rollout — identical to models.

---

*Study method: cover the answer, say it out loud, uncover. Cards you miss twice get copied into your journal. 10 minutes a day beats two hours on Sunday — spaced repetition is the mechanism, not effort.*
