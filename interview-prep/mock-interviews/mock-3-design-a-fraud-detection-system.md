# Mock 3 — Design a Fraud-Detection System

## The prompt (read aloud, start the clock)

You're joining a payments processor: 2M transactions/day, average ticket $90, current fraud rate 0.2% by count but 0.5% by value. There's a rules engine from 2015 and a model from 2022 that the team doesn't trust. Losses are climbing. Design the detection system — you own the architecture, the ML, and the 3AM pager.

*45 minutes. Paper or a blank doc. Timer ON. Attempt cold before reading the walkthrough — the walkthrough is the grading key, and reading first is rehearsal-shaped cheating.*

---

## Candidate-quality walkthrough (time-marked)

**[0:00–5:00 Clarify]** "Three questions before anything: where does the decision go — hard-decline, hold-for-review, or invisible scoring? What's the latency context — this is card-present/online? And who's on the other side of a wrong decision — a blocked customer calls support, a missed fraud is a chargeback plus the customer maybe leaves?" Interviewer: online checkout, hard-decline or pass, 200ms end-to-end budget including everything, support cost ~$15/false positive, average fraud loss ~$200. "Then the shape of the problem is decided already: extreme imbalance (0.2%), asymmetric costs (200:15), hard latency, and *delayed labels* — chargebacks land in 30–60 days. That label delay will shape half my design."

**[5:00–10:00 Estimate]** "2M/day ≈ 25 QPS mean but bursty — flash sales and fraud attacks are the same shape: 10× spikes. Decision latency 200ms total: feature fetch 50, model 30, rules 20, network/queue — the budget is mostly NOT the model. Storage: 2M × ~1KB event ≈ 2GB/day raw, but feature history (velocity counters, device fingerprints) is the real store: per-card, per-device, per-merchant rolling windows — a feature store in Redis-class memory, tens of GB hot."

**[10:00–20:00 High-level]** Draws the flow: checkout → gateway → **feature assembly** (request-scoped: amount, merchant, channel + velocity features from the feature store: txn/card/hour, new-device flag, merchant-risk score) → **rules layer** (the 2015 rules stay — they're fast, interpretable, and catch the knowns) → **model scoring** (gradient-boosted trees, not deep — tabular, latency, interpretability for analysts) → **decision engine** (threshold + cost-matrix logic + allowlists) → decline/pass/hold. Offline ring: label ingestion (chargebacks + confirmed-fraud feeds) with maturity windows → weekly training with time-splits → champion/challenger deployment → drift monitors. "The three-stage answer to 'why keep the rules': velocity limits and card-testing patterns are *mechanisms*, not statistics — the model handles the fuzzy, the rules handle the known, and the rules make a great circuit breaker when the model degrades."

**[20:00–35:00 Deep dive — interviewer picks thresholds, drift, and the pager]** "Thresholds are a business decision wearing a math costume — my lab's cost-optimal threshold on the ULB dataset sat at 0.06, not 0.5, and it *moved* whenever the cost matrix moved. So: a monthly threshold review with the actual cost numbers ($200 FN vs $15 FP — at current rates the optimum tolerates ~13 false alarms per caught fraud), and the decision engine exposes the dial to the business, not just to me. Drift is the daily reality: fraudsters adapt (concept drift — the adversarial kind, A.7's hardest), merchants change, and *label maturity* means my precision dashboard from Tuesday lies until day 45 — I compare like windows or I don't compare. Monitoring: input PSI per feature (velocity features scream first when an attack starts), score-distribution drift (early warning), matured AUC/precision (confirmation), and an analyst-feedback loop: every reviewed-but-wrong case becomes a training label. The 3AM story: alerts page on (a) score-distribution PSI sustained 3h, (b) fraud-rate on *matured* labels above a band, (c) model latency — and the runbook's first move is always 'tighten thresholds + expand manual review,' never 'retrain at 3AM' — my lab's lesson: retraining on a live attack trains on the attack."

**[35:00–40:00 Tradeoffs]** "What I gave up: no deep learning (tabular + latency + analyst interpretability — GBTs are the boring winner); no real-time online learning (drift adaptation at 3AM-pager risk — weekly retrain + trigger-based for attacks, challenger absorbs the risk); hard-decline only at high confidence, grey zone goes to review (the $15 FP is cheap; the angry customer is not). At 10× volume: feature store sharding by card-id, model ensemble scoring in parallel, and the rules layer becomes a streaming engine — but the architecture holds because the funnel holds."

**[40:00–45:00 Operate]** "Rollout for the new model: shadow mode against the 2022 model for two weeks (log-only, zero risk), then champion/challenger at 10% — my A/B discipline: fraud-metrics A/Bs need *matured* labels, so two-week minimum read, guardrails on false-positive rate (support volume is the canary) and latency p99. The dashboard: input PSI, score distribution, matured precision/recall, $-loss curve, analyst throughput. Riskiest assumption: that the feature store's velocity counters stay trustworthy — a schema change upstream is my most likely 3AM, which is why parity monitoring on features pages before model metrics do." 

## The curveballs (expect 2–3)

- "The CEO asks why we can't block everything suspicious — 'we'd lose no money.'" → "We'd lose customers — at 0.2% fraud rate, aggressive blocking mostly hits good people; my cost matrix says every 13 false alarms cost what one caught fraud saves, and the customer-experience cost compounds beyond the $15. The optimum is measurable; 'block everything' is a February decision you reverse in March when checkout conversion craters."
- "Fraudsters figure out the model. Walk me through the arms race." → "Adversarial concept drift — my a7 lab's hardest case. Detection: velocity-feature PSI and score-distribution shifts (their behavior changes inputs even when labels lag). Response tiering: rules hot-patch same-day (mechanisms), challenger retrains weekly, and I add features they can't easily game (device, network, behavioral biometrics). The honest sentence: we never win permanently; we win the reaction-time race."
- "Chargeback labels arrive at 45 days. Your model trains on what, exactly?" → "Matured windows only — train on transactions ≥45 days old, so labels are complete; fast-path: a second model on early signals (real-time confirmed-fraud feeds, disputes) for rapid adaptation. And day-1 vs day-45 precision are *different metrics* — my dashboards show both, labeled."
- "Latency budget cut to 50ms. What dies?" → "The GBT survives (single-row ~1–2ms); what dies is feature *assembly* — precompute at authorization-request time, keep only 5 request-scoped features live, drop the cross-service merchant-risk call to a cached score. The model was never the latency problem; the feature path is — that's my a4 lab's whole finding." 

## Scoring rubric (grade yourself honestly)

| Dimension | Strong hire | Borderline | Weak |
|---|---|---|---|
| Clarify | Asked the wrongness cost (FN vs FP $) and the decision surface | Latency only | Drew immediately |
| Estimation | Budget decomposition (feature path > model) | QPS only | Skipped |
| Architecture | Rules+model layered; feature store explicit; label-delay designed for | "A model with features" | One box labeled ML |
| Deep dive | Cost-matrix threshold + label maturity + adversarial drift, each with mechanism | Mentions imbalance | "Use SMOTE" |
| Tradeoffs | No-DL justified three ways; grey-zone-to-review argued | Generic | None |
| Operate | Shadow→challenger, matured-label A/B, feature-parity alert | "Monitor drift" | Nothing |

**The hire-line:** label delay and cost asymmetry are the two concepts. Candidates who handle both unprompted have lived near a fraud system; candidates who reach for SMOTE and F1 have read a tutorial.

## After the mock

- Record your run's minute-20 state: did you have a diagram yet?
- Which curveball broke you? That's your next study block (bank/cheatsheet refs above).
- Re-attempt the *same* mock in 3 days; the delta is your actual progress.
