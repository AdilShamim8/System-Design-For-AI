# ML System Design Questions — Round 2

**Five more, harder.** Where round 1 tested the patterns, round 2 tests the *sequencing* — what you do first when everything is on fire, and what you refuse to do. Each answer is written the way a strong candidate speaks: decision, reason, number, then the tradeoff.

## Q-ML-10 — The Feature Store You Inherited

**Scenario:** You join a team with 400 features in a shared store. Nobody knows which are still used. Training jobs take 6 hours; 2 hours is feature fetching. The oncall rotation gets paged for 'feature freshness' daily.

**Your task:** Cut the store down without breaking anything. What's the sequence?

### Worked answer

Inventory before deletion: log feature-read patterns for two weeks (training reads and online reads, keyed by feature name) — in any store this size, 30–50% of features are dead within a year (they outlived the model that used them). Then the deletion protocol: mark deprecated, notify owners, hold 30 days, remove from the online store first (cheaper, user-visible if wrong), then from training. For the latency problem: the fix is almost never the store, it's the join — teams fetch point-wise what they could have batch-materialized; group features by entity, materialize training sets as of version, and stop re-fetching static features every run. For the paging: freshness alerts need SLOs per feature tier, not one global threshold — a feature used by a fraud model that needs <5 min freshness is different from a weekly aggregate (a7's tiered monitoring, applied to features instead of models). The one-sentence version: measure reads, delete dead, batch the joins, tier the alerts.

**Grounding:** Chapters A.1, A.7, X.0 · Labs a6, a7 · cheatsheet #8

---

## Q-ML-11 — Two Teams, One Label

**Scenario:** The risk team defines 'fraud' as chargeback-filed. The growth team defines it as chargeback-filed-within-90-days. Both train models on the same event stream; their numbers disagree by 15% in every review meeting.

**Your task:** Reconcile the definitions without weeks of relabeling.

### Worked answer

First, establish they are both *right*: they answer different questions (early fraud vs total fraud), and the disagreement is the maturity window, not a bug (a3's label maturity, at org scale). The reconciliation: publish both definitions as versioned label specs — same event stream, two windows, one registry — so the 15% is a documented transformation, not a mystery. Where a single number is required (exec dashboards), agree on the matured definition and report the early one as 'preliminary, matures in 90 days' with the historical revision factor. What you refuse: merging them into one 'compromise' window — you lose the early signal fraud detection needs and the precision the 90-day window provides. This question is really about data contracts (X.0): labels are APIs, and two consumers with different SLAs deserve two documented endpoints, not a fight.

**Grounding:** Chapter X.0 · Lab a3 · field-notes/FN-02 (label definitions moved)

---

## Q-ML-12 — The Model That Got Better (Suspiciously)

**Scenario:** Offline AUC rose from 0.84 to 0.89 after a routine feature refresh. No new features were added. The team wants to ship Friday. You smell a leak.

**Your task:** Find the leak in under an hour. What do you check, in order?

### Worked answer

Order matters because each check is cheaper than the next. (1) Feature importance: a jumped AUC almost always has one feature that suddenly dominates — look for the new top feature and ask 'could the production system know this at prediction time?' (2) That feature's timestamp semantics: the classic leak is a feature computed with knowledge of the future (a6: a rolling stat using the label's own window, or an aggregation that includes the prediction-time row). (3) Train/test boundary: did the refresh change the split? Time-split pipelines that get rebuilt with random splits leak by construction. (4) The null check: shuffle the suspect feature's values; if AUC collapses to baseline, you've found it. (5) Only then, re-derive the feature with point-in-time joins and compare. The Friday answer: ship nothing until the null test runs — it's 10 minutes of compute and has caught every leak of this class I've seen. The durable habit: every AUC jump you can't explain in one sentence is a leak until proven otherwise.

**Grounding:** Chapters A.1, X.2 · Lab a6 · cheatsheet #9

---

## Q-ML-13 — Inference at the Edge

**Scenario:** A delivery app wants on-device shipment-damage classification: 2,000 images/day per driver, 40K drivers, cellular-only, privacy says images never leave the device. Accuracy target: 90% of your server model.

**Your task:** Design it — model, update path, and what breaks.

### Worked answer

Model: distill the server model (a ViT-class teacher) into a MobileNet-class student until the accuracy gap is inside budget — distillation typically recovers half the gap that plain quantization loses; then quantize to int8 (2–4x size cut, ~1–3 point accuracy cost, usually your budget can absorb it). Ship as ~10–25 MB. Update path: models version like apps — staged rollout, shadow-eval on-device against a frozen calibration set before activation, rollback in one tap; never hot-swap a model silently (drift monitoring on the device is how you catch a bad build: log prediction-distribution hashes, compare to build baseline). What breaks: (1) label feedback — privacy means you can't upload images, so ship only *telemetry* (confidence histograms, class distribution, model version) and let aggregate drift detection run server-side on those summaries; (2) device heterogeneity — test the bottom decile of phones, not the flagship; (3) the 90% target itself — negotiate it per class (the 'damaged' class needs recall; 'unknown' can absorb error). The interview line: edge ML is a deployment problem wearing a modeling costume — the update and telemetry paths are the design.

**Grounding:** Chapters A.4, X.1 · cheatsheet #5, #7 · ai-stack/serving-infra.md

---

## Q-ML-14 — The Champion/Challenger Paperwork

**Scenario:** You want to run a challenger model against production. The champion serves 200 ms p99. The challenger is 15% better offline. Your org has never done champion/challenger; the team asks for 'a week of shadow' and calls it done.

**Your task:** Design the promotion gate properly.

### Worked answer

Shadow first, agree — but shadow proves *plumbing*, not *superiority*: it verifies the challenger can be served, its features arrive on time, and its latency fits; it says nothing about outcomes because shadow predictions don't drive decisions. The gate needs four stages: (1) shadow (1–3 days): latency p99, feature-parity alerts, error rates — no quality claims; (2) canary at 1–5%: decision-driving, guardrail metrics (revenue proxy, complaint rate, latency), auto-rollback on breach; (3) ramp 10 → 50%: watch the guardrails diverge by segment — 15% offline rarely survives contact with the online funnel (my a8 lab: rank order flipped between offline and simulated-online); (4) promotion review: the writeup is one page — what changed, what the guardrails said, rollback path. The paperwork line that wins the room: 'we are not asking whether the challenger is better; we are defining what evidence would make us stop asking.' That sentence converts a vibes-based process into a gate.

**Grounding:** Chapters A.6, X.2, X.5 · Lab a8 · mock 3

---

