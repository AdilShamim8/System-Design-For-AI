# Flashcards — ML System Design

25 cards. Track A's patterns, failures, and the field-note connections.
---

**The three-stage recommendation pattern.**

> Candidate generation (cheap, recall, ~100s from millions) → ranking (expensive, precision, pointwise) → re-ranking (diversity, freshness, business rules). From Covington et al. / YouTube.

**Why blend multiple candidate sources?**

> Each source fails differently (popularity = no personalization; CF = cold-start; content = no serendipity). Blending covers weaknesses; production systems use dozens.

**Popularity bias — the number that makes it visceral.**

> MovieLens: ~50% of ratings land on the top decile of movies (my lab). Winner-take-all dynamics: the model shows what's popular, which generates the data that makes it popularer.

**Cold start — the two fixes.**

> Content-based candidates (embeddings from text/images) before behavioral data exists; exploration quotas so new items get impressions to generate data.

**Why time-split instead of random-split for recommenders/forecasts?**

> Random splits leak the future into training (you 'predict' a rating using later behavior). Time-split mimics deployment. My lab: random-split metrics ran 1.5–3× higher — pure leakage.

**The fraud class-imbalance headline number.**

> ULB dataset: 0.173% fraud. A model that always says 'legit' scores 99.83% accuracy and misses every fraud. This kills accuracy as a headline metric.

**Threshold selection by cost matrix — the fraud example.**

> FN costs the transaction amount (~$122 avg); FP costs support (~$5). Optimize total cost → my optimal threshold was ~0.06, not 0.5. The threshold is a business decision with dollar math.

**Label maturity — the fraud dashboard trap.**

> Fraud labels arrive days-weeks late (chargebacks). Day-1 precision looks great; matured precision is the truth. Compare same-maturity windows or you're comparing apples to last month's apples.

**Adversarial drift — why fraud drift is the hardest kind.**

> Fraudsters respond to your model: it's concept drift with intent. Fixes: velocity features (mechanisms), fast challenger retrains, and monitoring your own decision footprint.

**Why does a bidder need calibration but a ranker doesn't?**

> Bids multiply predicted probabilities (an uncalibrated 2× on cheap inventory = money lost); ranking is invariant to any monotonic transform. Platt/isotonic fixes calibration and provably doesn't move AUC.

**Reliability diagram + ECE — what they show.**

> Bin predictions by predicted probability; plot predicted vs. observed rate per bin. ECE = the size-weighted average gap. The 'overconfident at the top' bend is the classic GBT-on-rare-positives signature.

**The 10ms CTR bidder — where the time actually goes.**

> Model: 0.5–3ms. Feature fetching: the rest. The design work is the feature path (precomputed online features, feature store, co-location) — not the model.

**Feature store — the two problems it exists to solve.**

> (1) Training/serving skew: one feature definition, two runtimes. (2) Point-in-time correctness for training. Feast/Tecton-class, or disciplined Postgres+dbt at small scale.

**Feature stores: batch vs. streaming vs. on-demand features.**

> Batch: precomputed, hours-fresh (user demographics). Streaming: aggregated in motion, minutes-fresh (clicks/session). On-demand: computed at request time (distance-to-store). Freshness × latency × cost triangle.

**BM25 vs. embeddings — the failure mode of each.**

> BM25 dies on vocabulary mismatch ('car' vs. 'vehicle'). Embeddings die on rare entities, exact strings, negation. Hybrid + RRF buries both failures.

**The three RAG retrieval miss types.**

> Vocabulary mismatch (→ hybrid) · distractor twins (→ reranker) · multi-hop (→ decomposition). Name the miss before choosing the fix.

**Reranker economics — what it buys, what it costs.**

> A cross-encoder reading (query, passage) together: +NDCG (meaningful), +40–150ms for 20 pairs. Run only on the top-20/50. Quality with latency, at the top only.

**Drift: input vs. output vs. concept — and which fires first?**

> Input drift (distribution moves) fires first — early, noisy. Output drift (scores/answers move) — early, business-meaningful. Label metrics — late, definitive. Three-horizon dashboard watches all three.

**A data-pipeline rename masquerades as drift (PSI 2.0). The fix?**

> NOT retraining — the model would learn the bug. Fix the pipeline, backfill, re-verify. Alarm magnitude and response urgency are uncorrelated: diagnosis before response.

**Monitoring: the runbook's first line is a ___ .**

> Number. 'We degrade at N concurrent; today's peak was 0.4N.' Ops memorizes numbers, ignores prose.

**Feedback loops in ML systems — the Zillow example.**

> Zillow's own bids influenced the prices it predicted; iBuying converted point forecasts into irreversible purchases; the tails (not the mean) wrote off $500M+. Model error must be priced against decision asymmetry.

**The Netflix Prize — the two lessons.**

> (1) Model quality ≠ system value: the winning $1M ensemble was never fully deployed — complexity > marginal worth. (2) The 'anonymized' released data re-identified users (Narayanan & Shmatikov) — data release is an engineering decision with externalities.

**A/B test design — the four non-negotiables.**

> One pre-registered primary metric · guardrails with thresholds · AA test first · fixed horizon (or honest sequential). N = 16·p(1−p)/δ² per arm.

**Offline/online gap — say it with your own numbers.**

> 'My offline metrics and simulated-online outcomes disagreed often enough that I treat offline as a rumor worth testing' — the a2 lab showed rank order flipping between offline evals and simulation.

**Amazon's recruiting tool — the one-sentence root cause.**

> Trained on ten years of mostly-male hiring history, it learned history's bias and proposed to automate it — feedback loops over labels that encode past decisions. Fix: slice audits in CI; fairness is measured, not assumed.

---

*Study method: cover the answer, say it out loud, uncover. Cards you miss twice get copied into your journal. 10 minutes a day beats two hours on Sunday — spaced repetition is the mechanism, not effort.*
