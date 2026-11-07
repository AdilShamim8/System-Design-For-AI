# Flashcards — Foundations & Numbers

30 cards. The vocabulary and the numbers that everything else assumes.
---

**What are the four questions every system design answers?**

> What are the parts? How do they talk? What happens when a part fails? What happens when load grows?

**Latency vs. throughput — one line each.**

> Latency: how long ONE request takes (ms). Throughput: how many requests per second. Related, not the same — you can optimize either at the other's expense.

**p50 / p95 / p99 — why does p99 get the SLO?**

> Averages hide the tail; users ARE the tail. p99 = the worst experience 1% of users get — at scale that's thousands of people, and they're the ones who churn and open tickets.

**Latency anchors: instant / flow / visible thought / abandonment.**

> <100ms feels instant · <1s preserves flow · 1–3s acceptable 'thinking' for AI features · >10s abandonment begins.

**LLM first token (TTFT), hosted models — ballpark?**

> ~300ms–2s. The chat-experience metric: what the user feels as 'thinking.'

**LLM streaming speed, hosted vs. local 8B — ballpark?**

> Hosted: 30–150 tok/s. Local 8B quantized on a laptop: 5–30 tok/s. Human reading ≈ 5 words/s ≈ 7 tok/s.

**In-memory cache get / Postgres warm query / ANN over 1M vectors — ms each?**

> ~0.2–1ms / ~1–5ms / ~1–10ms. (Cheatsheet #5's AI ladder.)

**Tokens: English chars-per-token, words-per-1K-tokens?**

> ≈4 chars/token; 1,000 tokens ≈ 750 words. Chinese ≈ 1–2 chars/token.

**The two-proportion sample-size law.**

> N scales as 1/lift² — halving the detectable effect quadruples the users needed. +1% relative on a 5% metric ≈ 780K/arm at α=.05, power=.8.

**What does peeking do to false positives?**

> Optional stopping inflates them: 5% nominal → ~20% with daily checks in my 1,000-run simulation. Fix: pre-registered horizon or proper sequential tests.

**Training/serving skew — define in one sentence.**

> The same feature computed differently offline and online (or on different windows/data), so the model serves features it never trained on.

**Point-in-time correctness — the one-line test.**

> Could this feature's value have been known AT the moment of prediction? If not, it's leakage.

**Champion/challenger deployment.**

> New model runs alongside (shadow or partial traffic), gets compared on live data, promoted only on evidence — never a flag flip on faith.

**Semantic cache hit path vs. full RAG path — latency shapes?**

> Cache: embed query + ANN lookup ≈ 10–100ms. Full: retrieve + generate ≈ 1.5–4s. The cache is both the cost fix AND the availability plan.

**VRAM for a 70B model at 4-bit / fp16 — ballpark.**

> ≈35GB / ≈140GB weights. Formula: params × bytes-per-param + KV-cache + overhead.

**Vector storage math: 1M vectors, 1,536-dim, fp32.**

> 1M × 1,536 × 4B ≈ 6GB raw; ~1.5–2× with HNSW overhead ≈ 10–12GB.

**PSI bands and their origin.**

> <0.1 stable, 0.1–0.25 watch, >0.25 investigate — credit-scoring heuristics, not laws. Calibrate per feature against observed noise.

**ROC-AUC vs. PR-AUC on imbalanced data — which and why?**

> PR. ROC's false-positive denominator (the sea of negatives) flatters you; PR's denominator (your own positive calls) is the business reality.

**Calibration (reliability) — define.**

> Predicted 2% clicks ~2% of the time. Measured with reliability diagrams / ECE. Vital for bidders and decisions; free for rankers (monotonic fixes don't change AUC).

**Precision@k / Recall@k — when are they the right metrics?**

> Recommenders/search: the user sees top-k. Precision@k = how many of the k are good; Recall@k = how many of the good are in the k. Plus coverage — % of catalog ever surfacing.

**Hybrid retrieval: what fuses and what wins.**

> BM25 (lexical) + embeddings (semantic), fused by RRF (ranks, not scores). Wins because the two fail differently — vocab mismatch vs. rare entities. My lab: +3–8 NDCG over the best single system.

**RRF — the formula and why ranks not scores.**

> score = Σ 1/(k + rank), k≈60. Ranks are comparable across systems; BM25's 11.3 and cosine's 0.83 are not.

**NDCG@10 in one sentence.**

> Ranking quality with graded relevance, log-discounted by position, normalized by the ideal ordering.

**MRR in one sentence.**

> Mean Reciprocal Rank: 1/rank of the first correct result, averaged over queries.

**LLM-as-judge: the three discipline rules.**

> Temperature 0 + JSON output · randomize A/B order (position bias ~25%+ otherwise) · calibrate against ~50 hand labels (κ ≥ 0.6 workable).

**Faithfulness vs. relevance (RAG eval).**

> Faithfulness: every claim in the answer is supported by retrieved context (the trust metric). Relevance: the answer addresses the question asked. Both needed — each catches what the other misses.

**Compound quality math — the RAG example.**

> Users experience the product of stages: 0.75 retrieval × 0.9 faithfulness × 0.9 relevance ≈ 0.61 good answers. Single-stage metrics hide the product.

**The four agent-loop killers.**

> Infinite loops (fix: step budgets) · hallucinated tool calls (fix: contracts + errors-as-data) · context bloat (fix: c4 memory tiers) · budget blowout (fix: caps enforced outside the model).

**The reversibility × cost grid.**

> Reversible-cheap: no gate. Reversible-expensive: log. Irreversible-cheap (send email): token-confirm. Irreversible-expensive (delete data, move money): human approval.

**Cost per successful answer — why it beats cost per request.**

> Dividing by success rate prices quality: at 65% success, a +5pp quality fix = ~7% effective cost cut. Request-cost flatters systems that answer badly and cheaply.

---

*Study method: cover the answer, say it out loud, uncover. Cards you miss twice get copied into your journal. 10 minutes a day beats two hours on Sunday — spaced repetition is the mechanism, not effort.*
