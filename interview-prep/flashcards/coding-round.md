# Flashcards — The Coding Round

21 cards. The ML coding screen's reflexes: what to reach for first, what to say while typing, and the traps that fail good candidates.
---

**The first 60 seconds of any ML coding problem.**

> Restate the task, name the split you'll use and why, and state the metric BEFORE writing code. "I'll do a time split because this is temporal, and report AUC plus calibration" — three sentences that disqualify the naive answer.

**The split-answer table (memorize it).**

> Temporal data (churn, fraud, forecasts): time split · User-labeled data (recsys): per-user time split or leave-last-K-out · i.i.d.-ish (images, NLP sentiment): random is fine but SAY the assumption. Random split on temporal data = leak (coding-1).

**Leak check: the two-question reflex on any feature.**

> (1) Could production have known this value at prediction time? (2) Does its computation window overlap the label's window? Any 'no' to (1) or 'yes' to (2): drop or recompute with point-in-time semantics (coding-3).

**Why LightGBM/HistGradientBoosting as the default model in a screen?**

> Best accuracy-per-minute on tabular, no GPU, handles missing values, and trains in seconds — every screen minute you don't spend on model config goes to the split/leak/threshold story where the points are.

**The class-imbalance reflex.**

> Report AUC/PR-AUC (threshold-free) before accuracy; if you resample or reweight, say the tradeoff (SMOTE-class tricks distort calibration; class weights are usually enough); pick the threshold from costs, never from the imbalance.

**The threshold-from-cost formula.**

> Act if p × cost_miss > (1 − p) × cost_false_alarm → threshold = cost_false_alarm / (cost_miss + cost_false_alarm). Example: $30 offer vs $200 churn → 0.13. The business owns the costs; you make choosing possible (a3, coding-1).

**Calibration in one line — and the fix that preserves ranking.**

> Reliability diagram / ECE to detect; Platt or isotonic on a held-out set to fix — both monotonic, so AUC survives. "I calibrate when decisions multiply by the probability."

**Recall@K vs precision@K for candidate generation.**

> Candidate gen is a recall game — the ranker fixes order; a pool with high recall@50 gives the ranker something to rank. Popularity baseline first (the control), then the CF/content blend.

**Precomputed vs on-the-fly — the recommender screen's silent bar.**

> Item-item similarities are an OFFLINE artifact; the online path is seed-lookup-merge (sub-10ms). Computing cosine per request = seconds = fail. Say which side of the line every artifact lives on (coding-2).

**merge_asof with allow_exact_matches=False — what it guarantees.**

> Every event joins a snapshot strictly BEFORE its timestamp: features cannot see same-day (or later) state. The one-flag answer to the point-in-time join screen.

**The semantic cache's two layers — order matters.**

> Exact-normalized-string first (free, never wrong), then embedding similarity at a high threshold (0.85–0.92). Hit rate AND wrong-hit rate measured separately across the sweep — the operating point is the trust argument (coding-4).

**Chunking: the 'structure first, size second' rule.**

> Split on the corpus's own semantics (headers, sections) first; never split code blocks or tables; pack to size with overlap after. Fixed-size is the control, not the answer; report split-table count = 0 (coding-5).

**PSI implementation — the two discipline points.**

> Bin edges from the REFERENCE (fixed, comparable across days); new categories in current data get their own bucket. Small samples explode PSI — min-bin-count guard (coding-6).

**Agent loop: where do budgets live and why?**

> Outside the model call — in the loop: max steps, token budget, wall clock. The model is the advocate for continuing; the loop is the adult. Stop reasons are a closed set: COMPLETED / BUDGET_STEPS / BUDGET_TOKENS / BUDGET_WALLCLOCK (coding-7).

**Tool errors: raise or return?**

> Return as data — the model reads and self-corrects (most dispatch errors recover in +1 step, c1). An exception kills the episode; in production it becomes a ticket.

**Tool results: full or summarized?**

> Summaries, not dumps — truncate results (c1's contract item 6). A tool returning 50K tokens is a budget attack on every downstream step.

**Eval harness: the two metric types.**

> Retrieval graded exact (hit@k on labeled pairs — free, deterministic, CI) and generation judged (faithfulness via versioned LLM judge). The gate verdict: SHIP / NO SHIP / INVESTIGATE with a per-slice regression margin someone owns (coding-8).

**What to say while coding — the narration protocol.**

> Every non-obvious line gets one spoken reason ("reference-fixed edges so days are comparable"). Silence reads as either memorized or lost; narration converts typing time into signal.

**The 'I don't know this API' moment.**

> Name what you'd look up ("I'd check the docs for the exact merge_asof signature") and continue with the logic — screens test reasoning, not recall. Failing silently or freezing is the only wrong move.

**The complexity-and-cost close (every coding answer).**

> End with: runtime complexity in one phrase + the production note ("at 100M events this join is the feature store's job"). Code that knows it lives in a system scores a level above code that just runs.

**The 40-minute screen's time allocation.**

> 5 setup/split · 15 core logic · 10 metrics/verification · 5 complexity+production · 5 buffer. The naive candidate spends 30 on the model and 10 improvising the story — invert it.
