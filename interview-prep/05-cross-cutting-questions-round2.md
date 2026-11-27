# Cross-Cutting AI Questions — Round 2

**Five more, all senior-level.** These are the questions asked at the boundary between engineering and the business: cost governance, multi-region reality, the eval platform nobody budgeted, what you measure when accuracy is solved, and the fine print in vendor contracts. If round 1 was the systems, round 2 is the money and the risk.

## Q-CC-10 — The Cost Review You Didn't Ask For

**Scenario:** Your AI org runs 15 LLM-powered services. The CFO asks each team to justify spend. Teams report numbers that don't add up: some report API cost, some fully-loaded (compute + storage + people), some just their share of a shared gateway. Total claimed: $340K/month.

**Your task:** Design the cost-accounting standard.

### Worked answer

The problem is *units*, not math. Standard one: every service reports at three layers — (1) inference (API spend or GPU-hours, the direct cost), (2) fully-loaded (inference + storage + eval + embedding/retrieval + observability — the systems the service drags along, often 1.5–3x inference alone (x2's cost tree: my b-series labs' fully-loaded was ~2x the sticker price)), (3) marginal (cost of the next 1,000 requests — the number capacity planning needs; marginal is where caching and routing pay off, and it's often 30–50% below average cost). Standard two: allocation keys for shared infra (gateway, vector DB) by usage, published monthly — shared costs that aren't allocated are costs nobody optimizes. Standard three: unit economics as the headline — cost per successful request, cost per resolved ticket, cost per generated doc; $340K/month is unactionable, '$0.11 per resolved ticket vs $2.90 human baseline' is a strategy. The CFO meeting: present the three-layer table, the trend line, and the three biggest levers (routing, caching, prompt diet — b1/b6's 10x-plus combined headroom). What you refuse: a single blended number — it hides exactly the outliers the review exists to find.

**Grounding:** Chapters X.4, B.6 · Labs b1, b6, x2 · cheatsheet #6 · ai-stack/serving-infra.md

---

## Q-CC-11 — Multi-Region RAG Is a Lie (Mostly)

**Scenario:** Your multinationaI customer contract requires in-region data residency for their content: EU documents stay in EU. But your embedding model serves from us-east, your reranker too, and your eval set is global.

**Your task:** Design what 'residency' actually requires — and what it doesn't.

### Worked answer

Split the data by what the contract (GDPR-style) actually constrains: *personal data* — the documents, queries, and generated outputs — must stay in-region; *models* — weights, embeddings-as-code, the reranker — are not personal data and can serve globally (verify with counsel per contract, but this is the usual reading; a multilingual embedding model doesn't 'contain' EU personal data by serving an EU query). Architecture: regional stacks for the data plane (regional vector stores, regional generation with a fallback chain), global control plane (routing, policy, model registry), and per-region eval sets — a global eval number is meaningless when the EU corpus and query mix differ (Q-GEN-11's lesson generalized). The parts nobody budgets: (1) per-region index freshness — CDC replication for *metadata* is fine, but re-embedding EU docs must run in-region (compute footprint per region), (2) the degenerate case: query in EU, answer needs a US-only doc — the contract answer is 'the system says it can't answer from that source,' which is a product behavior you must design, not an incident (refusal as a residency feature), (3) testing residency — you need a periodic audit job proving no EU personal data crossed (hash-sampled query logs, region-tagged). The interview point: 'multi-region AI' is 20% architecture and 80% defining which data is regulated, per contract, in writing — the engineering follows the legal map.

**Grounding:** Chapters X.1, B.3 · cap2 · cheatsheet #4 · ai-stack/vector-databases.md

---

## Q-CC-12 — The Eval Platform Nobody Budgeted

**Scenario:** Your org has 15 AI services; each team built its own eval (spreadsheets, notebooks, one team has a real harness). Quality incidents keep recurring. You're asked to propose 'a central eval platform' with a realistic budget ask.

**Your task:** What's the platform, and what's the pitch?

### Worked answer

The platform is boring on purpose: a shared harness (golden sets, metrics, CI hooks), a shared judge service (temp-0 LLM-as-judge with a versioned judge prompt — the judge is *code*, versioned and evaluated like any model, because judge drift silently re-rates every service), and a results store with per-slice drill-down (the slice view is the product — global averages hide every real failure (Q-GEN-11's broken languages were averaged away)). The build-vs-buy line: buy the harness plumbing if it saves a quarter (eval frameworks are commodities), build the golden sets (they're your data and your moat — nobody else has your production queries). The budget pitch is three numbers: (1) incident cost — 'the citation incident cost one week of three engineers and churned two accounts; the platform is 2 engineers for a quarter'; (2) leverage — '15 teams × 1 engineer each maintaining evals = 15 engineers doing it badly; 2 doing it well centrally is a net saving'; (3) the compounding asset — golden sets appreciate (every incident adds cases; every model migration re-uses them). What you refuse: the platform grading itself (adoption by mandate fails — win two pilot teams, publish their regression catches, let the pull spread) and eval-gating every prompt change on day one (start advisory, flip to blocking where the incident history justifies it — trust is earned per service).

**Grounding:** Chapters X.3, B.8 · Labs b2, b3, b7 · cheatsheet #9 · ai-stack/observability-eval.md

---

## Q-CC-13 — Beyond Accuracy

**Scenario:** Your RAG system finally hits its quality bar: 92% faithfulness, 94% citation accuracy on the golden set. The business asks 'so what should we improve now?' Nobody has an answer.

**Your task:** Define the next-tier metrics — what matters after accuracy?

### Worked answer

Accuracy was table stakes; the next tier is everything users actually feel. (1) *Latency as experienced*: p50 TTFT and p95 end-to-end, because 'the answer is right' plus 'the answer is late' is a lost user — track answer-abandonment by latency bucket, not just p99 (x3's degradation ladder: users forgive a fast honest 'still working' more than a slow right answer). (2) *Refusal quality*: wrong refusals (could have answered, didn't) are invisible in faithfulness metrics and corrosive in production — measure refusal-appropriateness on a should-answer slice (my b2 numbers: prompt structure moved refusal from ~60% to ~90% *appropriate* — the metric that matters is the false-refusal rate on legitimate questions). (3) *Cost per resolved interaction*: the efficiency frontier — same quality at half the cost is a product feature (routing + caching, Q-CC-10's unit economics). (4) *Coverage*: % of query intents the system can handle at all, tracked monthly — the metric that grows the product; every 'I'm sorry, I can't help with that' is logged, classified, and becomes next quarter's roadmap (the support-bot flywheel). (5) *Staleness*: median age of cited documents — a perfectly faithful answer citing a deprecated policy is a liability wearing a quality score (FN-04 adjacent). The strategic answer for the business: 'we stop optimizing the model and start optimizing the funnel: who asks, what we refuse, how fast, at what cost, and what we still can't do.'

**Grounding:** Chapters X.2, X.3, B.8 · Labs b2, b5, x3 · cheatsheet #9

---

## Q-CC-14 — The Vendor Contract Fine Print

**Scenario:** You're evaluating two LLM providers for a 5-year commitment. Same list price. Provider A: data retention 30 days for 'abuse monitoring,' no SLA on eval-set reproducibility, deprecation policy '90 days notice.' Provider B: zero retention, 99.9% SLA, model versions pinned for 24 months. Provider B is 15% pricier at your volume.

**Your task:** Build the decision framework — what's the real comparison?

### Worked answer

Price is the third-most-important term. (1) *Reproducibility* is the hidden killer: without version pinning, the model under your product changes without your consent — every eval score is a snapshot of a model you no longer run (A's 90-day deprecation means your eval platform chases a moving target; B's 24-month pins make regression meaningful). Weight this highest: it's the difference between engineering and gambling. (2) *Data terms*: A's 30-day retention for abuse monitoring is standard, but check the sub-terms — is retained data used for training? Who accesses it? For regulated workloads this is a go/no-go, not a preference (GDPR + 'we retain your customer data' can be a contract breach with *your* customers — the residency analysis of Q-CC-11, pointed inward). (3) *SLA structure*: 99.9% on what — API uptime or token throughput? An uptime SLA that ignores throttling is decorative; negotiate credits that scale with your business impact, not flat fees. (4) *Exit terms*: export of fine-tunes, eval sets, and logs on termination; a provider that owns your fine-tune owns your migration (the leverage question). The framework output: score each provider per axis, and let the 15% buy the pinning and the zero-retention if your workload is regulated — 'the expensive provider is the one that changes under you' is the sentence for the committee.

**Grounding:** Chapters B.6, X.1 · cheatsheet #6 · ai-stack/models-and-providers.md

---

