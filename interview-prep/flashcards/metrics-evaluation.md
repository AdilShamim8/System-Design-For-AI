# Flashcards — Metrics & Evaluation

25 cards. The numbers layer: what to measure, what it hides, and what to say when asked "how do you evaluate it?"
---

**Precision@K vs hit@K — the difference in one line.**

> Precision@K: of the K items shown, fraction that were relevant. Hit@K: did ANY of the top-K contain a relevant item (binary). Hit@k is the retrieval metric (cheap to label, one relevant doc suffices); precision@k is the ranking metric (rewards ordering).

**NDCG@10 in one sentence — and why 'N'?**

> Discounted gain: relevant docs score higher when ranked higher, with logarithmic discount; normalized by the ideal ranking so 1.0 = perfect. The @10 because users see the first page — measure what the user sees.

**Why is AUC the wrong metric for a bidding system?**

> AUC measures ranking quality; bids multiply *probabilities*. A perfectly-ranked model with bad calibration overbids cheap inventory and underbids rich (A.4). Fix: reliability diagram + ECE, then Platt/isotonic — monotonic, so ranking survives.

**ECE — what it measures, and a good-enough number.**

> Expected Calibration Error: weighted average gap between confidence and accuracy across bins. <0.05 is decent, >0.15 is a money bug if decisions multiply by the probability.

**The AA test — what and why.**

> Run A vs A (same everything). Any "significant" winner proves the experiment machinery is broken. The cheapest debugger in experimentation (a8): run it before believing any A/B.

**Optional stopping takes false positives from _ to _.**

> ~5% to ~20% (my a8 simulation). Peeking and calling early manufactures wins. Guard: fixed sample size or sequential-testing corrections.

**N for a +1% relative effect on a 5%-class metric.**

> ~780K users per arm. N scales with 1/lift-squared — small effects need enormous samples; that's the sentence for the CEO who wants Friday.

**PSI bands — the numbers and their honest status.**

> <0.1 stable · 0.1–0.2 investigate · >0.2 act. Credit-industry rules of thumb; the honest version: log PSI against your incident history and own your bands (a7).

**Label maturity window — define it.**

> The delay between prediction and trustworthy label (chargebacks mature ~90 days; fraud labels days). Metrics computed inside the window are preliminary and will be revised — every dashboard needs the revision factor (a3).

**Offline/online rank disagreement — the phenomenon and the response.**

> Offline metrics ranked two models one way; the A/B flipped them (my a2 numbers). Offline wins are rumors — design the A/B, don't skip it.

**Per-slice evals — the one-line justification.**

> A global average hid ten broken languages (Q-GEN-11): any metric that can hide a third of your users is a filter, not a metric. Always cut by slice.

**Faithfulness vs relevance (generation metrics).**

> Faithfulness: is the answer supported by the retrieved context (graded exact-ish against citations)? Relevance: does it answer the question? A faithful-but-irrelevant answer cites correctly and misses the point; both are needed (B.8).

**Refusal rate — and the number that matters more.**

> Overall refusal rate is meaningless without the denominator: appropriate refusal on should-refuse questions (~90% after prompt structure, b2) vs false refusals on should-answer questions (the corrosive one — measure it separately).

**Hit-rate economics of a semantic cache — the Zipf dependency.**

> 30–50% on support-class traffic (repeats cluster), ~0% on unique-query traffic. The cache's value is decided by your traffic's shape, not the cache's cleverness (b5).

**Wrong-hit vs miss — the cost asymmetry.**

> A miss costs cents (one LLM call); a wrong hit costs trust permanently. So the similarity threshold errs high (0.85–0.92 band), and the exact-match layer catches the free wins below it.

**Latency: the two numbers for an LLM product.**

> TTFT (time to first token — perceived responsiveness, ~300ms–2s hosted) and end-to-end p95 (completion). Users forgive a streaming delay they can see; they punish a silent wait of the same length (x3).

**Cost per resolved interaction — why it beats monthly spend.**

> $11K/month is unactionable; $0.11/resolved ticket vs $2.90 human baseline is a strategy. Unit economics is the metric the CFO can use (Q-CC-10).

**Coverage — the growth metric.**

> % of query intents the system handles at all, tracked monthly. Every refusal classification is next quarter's roadmap — the support-bot flywheel.

**Staleness — the liability metric.**

> Median age of cited documents. A perfectly faithful answer citing deprecated policy is a quality score wearing a liability (FN-04 adjacent).

**Champion/challenger: what shadow proves and doesn't.**

> Shadow proves plumbing (latency, feature parity, error rates); it says NOTHING about outcomes — shadow predictions don't drive decisions. The gate: shadow → canary 1–5% with guardrails → ramp → promotion review (Q-ML-14).

**Guardrail metrics in an A/B — name three.**

> Latency p99, complaint/thumbs-down rate, cancel/refund rate. Pre-registered with thresholds; a breach rolls back regardless of the primary metric's direction.

**Null-shuffle check — the 10-minute leak detector.**

> Shuffle the suspect feature's values; if the metric collapses to baseline, the feature was leaking. Any unexplained metric jump gets this before celebration (Q-ML-12).

**Reliability diagram — read one in five seconds.**

> x = predicted confidence, y = actual accuracy; the diagonal is perfect calibration. Above the diagonal = underconfident; below = overconfident (the dangerous side for money decisions).

**Winner's curse in online experiments — one sentence.**

> The observed effect of a winning A/B overestimates the true effect (you promoted it BECAUSE the noise was favorable); expect regression toward the mean post-launch.

**Eval set: 100 vs 300 rows — the honest tradeoff.**

> 100 stratified rows catches the citation-class break and starts this week; 300+ gives per-slice power. v1 = 100 and grow 20/week; don't wait for statistical perfection to have ANY gate (Q-GEN-14).
