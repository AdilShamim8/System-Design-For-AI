# ML System Design Questions
**9 scenario questions.** Attempt each with a 5-minute spoken sketch BEFORE reading the worked answer — the gap is your study plan. Grounding tags point at the chapter/lab where the pattern was earned.

## Q-ML-1 — The Podcast Feed That Faded

**Scenario:** You join a podcast app: 500K podcasts, 1M users, a 'For You' row (10 slots, 300ms budget). Engagement has declined two quarters. The current system: one collaborative-filtering model, deployed 3 years ago.

**Your task:** Diagnose, then redesign. Where do you start, and what does the new architecture look like?

### Worked answer

Start by NOT reaching for a model: is candidate generation surfacing new content, or recycling? Has the user mix shifted? Pull offline metrics first, then check popularity concentration (my MovieLens lab measured top-decile ≈ 50% of ratings — the same spiral). Redesign toward the three-stage pattern (Covington et al.): blended candidates (CF + content + session), a pointwise ranker on shared features, re-rank for diversity/freshness. Time-split offline eval with Precision@K and coverage, then A/B — offline wins are rumors (my a2 numbers showed rank order flipping between offline and simulated-online). Land drift monitoring so decline #3 pages someone before the quarter closes (a7).

**Grounding:** Chapter A.2 · Labs a2, a7, a8 · Mock 2

---
## Q-ML-2 — Fraud at 3AM, Quietly

**Scenario:** Fraud losses tripled over a weekend. The fraud model is still running, still producing scores — but the scores no longer separate fraud from legit. You're on call.

**Your task:** Your first hour, your first day, your first quarter.

### Worked answer

First hour: contain — tighten thresholds, route more to manual review, pull the actual transactions and LOOK (what changed? new merchant category? card-testing pattern?). First day: diagnose drift type — data drift (inputs moved: schema change, new issuer) vs concept drift (same inputs, new fraud behavior — the adversary adapted, A.7). Check label maturity windows before trusting any metric (a3). First quarter: drift detection as code (PSI per feature with explicit bands — <0.1 stable, 0.1–0.2 investigate, >0.2 act — plus an output-distribution monitor that alerts after two consecutive days out of band), trigger-based retraining, champion/challenger for the new model, and layered rules for velocity patterns the model can't see. The quiet part: this system was already degraded — the monitoring gap is the root cause.

**Grounding:** Chapter A.5, A.7 · Labs a3, a7 · FN-02

---
## Q-ML-3 — The 10ms Bid

**Scenario:** Real-time bidding: 10ms from slot to bid. Your CTR model has 0.80 AUC but the business suspects miscalibration — bids run hot on cheap inventory.

**Your task:** What do you fix, in what order, and why that order?

### Worked answer

Calibration first — it's the money bug and the cheap fix. AUC measures ranking; bids multiply *probabilities*; a perfectly-ranked model that says 2% everywhere overbids 1%-CTR inventory and underbids 4% (A.4). Diagnose with a reliability diagram and ECE, fix with Platt/isotonic on a held-out calibration set — monotonic, so AUC is untouched (my a4 lab verified exactly this). Then latency: feature fetching, not the model, eats the 10ms budget — feature store with precomputed online features, GBT over neural nets, co-location. My lab measured single-row predict ~1–2ms; the design work is the other 8.

**Grounding:** Chapter A.4 · Lab a4 · cheatsheet #9

---
## Q-ML-4 — Forecasting for Drivers

**Scenario:** A ride-hailing app wants to pre-position drivers: forecast pickups per zone, per hour, 1–24h ahead, in 200 cities.

**Your task:** Design the system — model, features, pipeline, and what breaks at 3AM.

### Worked answer

The model is the easy 20%: gradient-boosted trees on lags (1h, 24h, 168h), rolling stats, hour-of-week, weather, events — a global model with zone as a feature beats per-zone models at this scale. The system is the hard part: streaming aggregation into a feature store with POINT-IN-TIME correctness (every feature shifted ≥1h — my a6 lab demonstrated a leaky rolling feature inflating MAE 50–60%), batch scoring on a scheduler with late-data grace periods, and monitored MAE by zone. At 3AM, what breaks is the pipes, not the model: late-arriving events, schema changes upstream, holiday regime shifts. Dashboard watches MAE on matured truth AND %-zones-with-missing-features (x1's law: one metric for the model, one for the pipes).

**Grounding:** Chapter A.1, X.0 · Lab a6 · diagrams/1

---
## Q-ML-5 — The A/B That Refused to Die

**Scenario:** Product wants to ship a new ranker. Your offline metrics are +3%. The PM wants an A/B. The CEO wants it Friday.

**Your task:** Design the experiment and tell the CEO what Friday costs.

### Worked answer

Offline +3% is a rumor — design the A/B: one primary metric (retention-proxy, pre-registered), guardrails with thresholds (latency p99, thumbs-down, cancel rate), AA test first (my a8 lab: the cheapest debugger in experimentation). Compute N: for a +1% relative effect on a 5%-class metric you need ~780K users per arm; N scales 1/lift², so 'Friday' means underpowered — you'll read noise and ship ghosts (my simulation: optional stopping took false positives from 5% to ~20%). Offer the honest menu: extend the test, restrict to a bigger effect, or accept sequential-testing overhead. The sentence for the CEO: 'we can decide Friday if we're willing to be wrong 40% of the time instead of 5%.'

**Grounding:** Chapter X.2 · Lab a8

---
## Q-ML-6 — Streaming Features, Skewed Truth

**Scenario:** Training pipeline computes 'transactions per card per hour' in Spark; the online path computes it in the API service from a Redis counter. Metrics are drifting between offline and online.

**Your task:** What's wrong, and what's the fix?

### Worked answer

Textbook training/serving skew (A.1): two implementations of one feature definition will diverge — different windows (Spark tumbling hour vs Redis rolling hour), different late-data handling, different reset semantics. Fix: one definition, two runtimes — a feature store where the transformation is computed by shared code, online and offline, with parity monitoring (sample features both paths, alert on divergence). Also check point-in-time correctness in training (a6): if Spark recomputes history with *current* counters, you've leaked. The durable principle: features are code, versioned and tested like code.

**Grounding:** Chapter A.1 · Lab a6 · ai-stack/data-pipelines.md

---
## Q-ML-7 — The Cold Start Catalog

**Scenario:** A marketplace with 2M listings adds 20K new listings daily; new items get no impressions, so they never train the recommender, so they never get impressions.

**Your task:** Break the loop.

### Worked answer

The exploration–exploitation loop is a *system* design, not a bandit formula to bolt on last. Levers: (1) content-based candidates for new items (embeddings from listing text/images — my b8 multimodal work), (2) an exploration quota in re-ranking (X% of slots for new items, sized by a real experiment — a8), (3) fast-feedback training (fresh-label pipeline, not weekly batches), (4) measure with coverage and new-item time-to-first-sale, not just precision (a2's metric lesson). The business framing sells it: the loop taxes every new seller, and sellers churn when their listings are invisible.

**Grounding:** Chapter A.2 · Labs a2, a2-ext, b8

---
## Q-ML-8 — Model Risk, CEO Edition

**Scenario:** Your CEO asks why the fraud model can't be 'just turned up' to catch more fraud — 'we're losing money.'

**Your task:** Explain the tradeoff and propose the right knob.

### Worked answer

There is no 'more fraud' knob — there's a threshold, and it's a cost-matrix decision (a3): catching X% more fraud freezes Y% more good customers, and Y's cost ($5–25 of support/churn each) grows superlinearly past some point. The honest deliverable is the cost curve: threshold vs. dollars, with the current operating point and 2–3 alternatives the business can choose. If the business wants more recall at fixed FP cost, that's a model/features conversation (velocity features, device fingerprints) — weeks, not a knob. My lab's optimal threshold sat at 0.06, not 0.5 — the point is that the business owns this number and engineering makes choosing it possible.

**Grounding:** Chapter A.5 · Lab a3 · cheatsheet #9

---
## Q-ML-9 — Two Weeks to Retrain

**Scenario:** Legal says the labeling rules change next month; the model must reflect the new definition. You have a training pipeline, no feature store, and two weeks.

**Your task:** What's the plan, and what will you tell your manager can't happen?

### Worked answer

Scope: is the *label* changing (relabel history, retrain — the definition of the target changed) or the *policy* (threshold only)? Relabeling 12 months is usually the long pole — estimate it first (sampling: label drift is usually concentrated; 10% relabeled + weighted may suffice — validate against a full month). Can't-happen list: (1) the definition cannot change silently in dashboards — metric continuity requires a version break, or every trend line lies (label maturity, a3); (2) no A/B of old-vs-new definition without the same window; (3) the two-week estimate breaks if late labels exist — check the maturity window before promising. Communicate the rollback: old model stays shadow until the new definition's numbers are trusted.

**Grounding:** Chapters A.6, X.2 · Labs a3, a7

---
