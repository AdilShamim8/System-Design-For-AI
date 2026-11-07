# Cross-Cutting System Design Questions
**8 scenario questions** on monitoring, cost, governance, data quality, eval culture, and incident response.

## Q-CC-1 — Green Dashboards, Dying Model

**Scenario:** Six months post-launch: uptime 99.99%, error rate 0.01%, no alerts. Business metrics down 12%. 'The infra is fine — the model must be fine.'

**Your task:** What's happening, and what do you install?

### Worked answer

Silent model rot — X.3's whole thesis and a7's manufactured incident: models degrade while infrastructure reports perfect health. Likely causes ranked: data drift (inputs moved), concept drift (the world moved), label maturity artifacts (metrics lie until labels land), or product-context drift (the metric's meaning moved — a8's proxy gap). Install the three-horizon dashboard (x1): input drift (PSI/KS per feature, embedding-centroid for queries), output drift (score/answer distributions, refusal rate), and business metrics with label-maturity-aware windows. Alert rules get sustain windows, owners, and runbooks — and you validate them against a simulated boring month (a rule that fires on normal traffic gets deleted). The retrofit lesson: monitoring was a launch requirement; the 12% is the interest on skipping it.

**Grounding:** Chapters X.3, A.7 · Labs a7, x1

---
## Q-CC-2 — The On-Call Runbook

**Scenario:** You're handed on-call for an AI service you didn't build. First week: write the runbook.

**Your task:** What's in it?

### Worked answer

Per alert (x1's discipline): what it means, how to confirm, first action, escalation, and the 'do NOT' line. The AI-specific entries: model-vs-pipeline triage ('metrics degraded' → check corpus_hash/prompt_version distributions first — GROUP BY, not archaeology), degradation ladder (shed batch → cache-only at ~50ms/hit — my x3 lab made the cache the availability plan → honest queueing), label-maturity rules (never compare 1-day vs 30-day precision windows), provider outage playbook (fallback tier, rate-limit math), and the kill switch procedure (tested — FN-03). Plus: who can approve a rollback, where the eval set lives, and the postmortem template. A runbook is done when a tired stranger could follow it at 3AM — that's the only test.

**Grounding:** Chapters X.3, X.5 · Labs x1, x3 · cheatsheet #8

---
## Q-CC-3 — Cost Review, Standing Up

**Scenario:** Your AI org's spend grew 3× in two quarters. You're asked to present at the leadership review.

**Your task:** What's on the five slides?

### Worked answer

Slide 1: unit economics — cost per 1K requests AND per successful answer, trended (x2's refinement: at 65% success, quality fixes are cost fixes). Slide 2: the decomposition — the cost tree by leaf (my RAG split: 60–90% generation *input*; history bloat and k-creep as named culprits with log evidence). Slide 3: the levers ranked by measured ROI (context trim → cache → routing: my 60–80% routing cut — with the quality guardrail eval that made it safe). Slide 4: per-tenant/concentration (the whale — cap2's economics; a 10% whale-efficiency fix beats a global sprint). Slide 5: the asks — budget alerts per tenant (x1), an eval gate so cost fixes can't regress quality (b4), and the one architectural decision (self-host crossover at your volume — gpu-compute math). Every slide opens with a number; leadership remembers numbers.

**Grounding:** Chapter X.4 · Labs b1, b5, x2

---
## Q-CC-4 — The Compliance Question

**Scenario:** Your bank's legal team asks: 'Can we use LLMs in customer-facing features? What's our exposure?'

**Your task:** Answer like an engineer, not a vendor.

### Worked answer

Frame exposure by failure class with a field note each: wrong statements (FN-04 Air Canada — liability follows deployment; mitigation: grounding, citations, measured refusal, human channel), bias (FN-01/FN-10 — slice evals in CI), privacy (what's in prompts leaves your perimeter — data residency, no PII in prompts, log scrubbing; 'anonymized is a claim,' FN-11), and auditability (transcript + version logging — b4/x1 — the artifact that turns disputes into lookups). Propose the governance artifact set: eval gates with compliance cases, the reversibility grid for agent capabilities, model/prompt change review, and the kill switch. The sentence that lands: 'we can't guarantee correctness — we can *measure* it, bound it, escalate the residue, and prove all three.' Legal respects bounds more than promises.

**Grounding:** Chapters X.1, C.5 · FN-01, 04, 10, 11 · cheatsheet #10

---
## Q-CC-5 — Data Quality Underground

**Scenario:** Your feature pipeline's upstream team 'improved' their schema. Your model's AUC dropped 2 points over a week. Nobody told you.

**Your task:** Recover, then make it structurally impossible.

### Worked answer

Recovery: pin the schema version and roll back the read (containment before diagnosis — X.5); quantify the damage window (which features went null/renamed — PSI screams, a7); decide retrain vs. repair (a rename is a data fix + backfill, NOT a retrain — the trap from my a7 lab: retraining on the bug teaches the bug). Structural fix: data contracts (c2's discipline for pipelines): schema-as-code, producer notifies consumers, breaking changes versioned; validation at ingestion (Great Expectations-class: null rates, ranges, cardinality) that ALERTS before the model eats it; and parity monitoring — feature-distribution dashboards with the same PSI machinery the model uses. The org fix is the real one: you were downstream of an unannounced change — contracts turn that from luck into process.

**Grounding:** Chapters X.0, A.7 · Labs a6, a7 · ai-stack/data-pipelines.md

---
## Q-CC-6 — Build the Eval Culture

**Scenario:** You join a team shipping LLM features with no evals — 'we test the prompts manually.' Features break silently every few weeks.

**Your task:** Where do you start, week one?

### Worked answer

Week one, three moves (b4's order): (1) **Log everything** — every request with prompt/model versions, retrieved context, outputs (x1's schema — you can't evaluate what you didn't record); (2) **Build the golden set** — 50 questions from *their* recent failures (failures are free labeled data — my c1→c5 pattern), graded with the two-tier harness: retrieval metrics free in CI, faithfulness/relevance via temp-0 judge; (3) **Gate one thing** — the highest-traffic prompt behind a CI check (hit@k and faithfulness floors) so the *next* silent break can't merge. Don't start with a platform purchase (observability-eval's rule: logs → evals → drift → platform, reverse it and you bought dashboards with nothing to render). Month one: the eval gate on every prompt, a weekly faithfulness trend, and one caught regression — the story that converts the skeptics.

**Grounding:** Chapters X.2, B.8 · Labs b4, x1

---
## Q-CC-7 — The Ten-Team Vector Database

**Scenario:** Ten product teams all want 'a vector database.' Each is prototyping their own. You're the platform lead.

**Your task:** Build or consolidate?

### Worked answer

Consolidate the *capability*, not necessarily one system (X.1): a platform service with golden paths (pgvector for the small teams — 'one less system to run' — my selection tree in cheatsheet #4; managed/dedicated for the big corpora with measured crossovers), shared embedding-model versioning (embedding migration is a silent-breakage factory — b5's threshold lesson), corpus-versioning conventions, and the isolation test as a platform primitive (cap2). The pitch writes itself: teams stop solving ingestion, freshness, and filtered-search semantics ten times; the platform owns the hard 20% (multi-tenancy, quotas, cost attribution per tenant — x2's ledger). Anti-pitch (say it out loud): the wrong consolidation is one shared index without isolation tests — that's ten data leaks behind one endpoint.

**Grounding:** Chapters X.1, B.3 · capstone cap2 · cheatsheet #4 · Mock 7

---
## Q-CC-8 — Postmortem: The Friday Release

**Scenario:** A prompt change shipped Friday; Monday's faithfulness metric is down 9%. No code changed. No alerts fired.

**Your task:** Write the postmortem.

### Worked answer

Blameless, four sections (X.5): **What happened** — prompt v41→v42 shipped without eval run; faithfulness (sampled, weekly job) dropped 9% by Monday. **Why** — prompts are code but shipped like config: no version pinning on rollout, no CI gate, no canary; the monitoring gap: faithfulness was sampled weekly, not daily, and nobody was paged — the metric existed, the *alert* didn't (x1's rule: a metric without a band is decoration). **Impact** — 3 days × X% of answers degraded; quantify from logs by version. **Actions** — prompt changes run the b4 gate before merge (blocking); rollout is canaried 5%→25%→100% with a faithuality guardrail and auto-rollback (A.6's pattern, applied to prompts — they're models' configs, not prose); faithfulness moves to daily sampled + alert; a 'prompt change review' runbook entry. The deeper action: classify prompts as versioned artifacts in the registry, exactly like models — that's the cultural fix that survives.

**Grounding:** Chapters X.5, A.6, B.8 · Labs b4, x1 · FN-08

---
