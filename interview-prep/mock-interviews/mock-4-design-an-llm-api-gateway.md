# Mock 4 — Design an LLM API Gateway

## The prompt (read aloud, start the clock)

Your company has 15 product teams all calling LLM providers directly — each with its own keys, prompts, and error handling. Last month: one team got rate-limited into an outage, another got a $30K surprise bill, and security found API keys in three repos. You're tasked with 'fix this mess' — design the internal LLM gateway/platform.

*45 minutes. Paper or a blank doc. Timer ON. Attempt cold before reading the walkthrough — the walkthrough is the grading key, and reading first is rehearsal-shaped cheating.*

---

## Candidate-quality walkthrough (time-marked)

**[0:00–5:00 Clarify]** "Who are my users — 15 product teams, so the customer is *engineers*: what do they want, self-serve? What providers are in play, and is multi-provider a requirement or a nice-to-have? Volumes and variance across teams? And who pays — central platform budget or chargeback? That last one shapes everything." Interviewer: two providers live, a third in procurement; one team is 70% of volume; chargeback is the stated goal; the outage team wants retries, the bill team wants limits, security wants zero keys in repos.

**[5:00–10:00 Estimate]** "The whale is the design case: 70% of volume means per-tenant fairness is a first-class feature, not an add-on. Say 50M requests/month across teams ≈ 20 QPS mean, spiky per product. Cost: at mid-tier and mixed workloads, call it $50–150K/month today — the gateway's routing and caching are worth 30–60% of that, which funds the platform team by itself. That's my one-line pitch to leadership, and it's measured, not hoped."

**[10:00–20:00 High-level]** Draws it: product team → **SDK/proxy** (OpenAI-compatible endpoint — zero code change to adopt) → **authN/Z** (team tokens, scoped; the ONLY keys in town — providers' keys live in the gateway's vault) → **rate limiting + quotas** (two-dimensional: req/min and tokens/day per team AND per model tier — cost is tokens, so requests-only limits don't protect budgets) → **router** (model tier selection by task/route + escalation policy) → **semantic cache** (shared, versioned by prompt+corpus) → **provider adapters** (uniform interface, provider-specific quirks absorbed) → **fallback chain** (primary → secondary provider → degraded mode) → **the observability spine**: every request logged with team, prompt-version, tokens, latency, cost — feeding per-team ledgers (chargeback), dashboards, and the eval taps. "The pattern name: a gateway with cache-first routing. The cache isn't an optimization bolted on — at ~50ms per hit vs 1.5–4s full calls, it's my fastest tier AND my availability story."

**[20:00–35:00 Deep dive — interviewer picks the outage, the bill, and isolation]** "The rate-limit outage: the failure was a team consuming the provider quota alone and everyone sharing the blast radius. Gateway answers in three layers: (1) token-bucket per team per tier — one team's spike queues *them*, not the platform; (2) concurrency caps per team — my capstone load lab measured innocent-tenant p99 going 3–5× without them; (3) circuit breakers and provider health routing — when provider A degrades, traffic shifts automatically, with a burst-smoothing queue so we don't thunder-herd provider B. The $30K bill: two-dimensional quotas with hard token/day ceilings per team, alerts at 50/80/100% — a *ticket* at 80, a page at 100%×sustained — plus per-request cost attribution in the ledgers so the conversation is 'your team, your curve,' not 'the AI bill.' My cost-tree work: 60–90% of RAG spend is input tokens, so the gateway's biggest lever is context policy — prompt-size linting and cache-hit reporting per team. Security: keys centralize in the vault, teams get scoped, rotatable tokens; audit log every admin action; prompt/response sampling for data-loss prevention (with a privacy carve-out teams can see — trust is the product here). Isolation, the subtle one: caches keyed by team + corpus version — a shared cache without namespacing is a cross-team data leak wearing a performance costume."

**[35:00–40:00 Tradeoffs]** "What the gateway costs: it's a critical-path dependency — every product now depends on my team's uptime, so I design it boring: stateless core, queue-first writes, and its own degradation mode (if the gateway's *control plane* dies, the data plane fails open to a cached route table rather than failing closed and taking all 15 products down). What I chose: adopt-via-proxy (OpenAI-compatible) over a mandated SDK — adoption is the whole game, and the compatible endpoint gets me 90% of teams in a sprint. Deliberately NOT building: prompt management for teams (their tools, their repos — the gateway ingests prompt-version as a header, it doesn't own the content), and eval (a platform tap that *feeds* teams' eval pipelines — b4 stays with the product teams who own quality)."

**[40:00–45:00 Operate]** "Success metrics: adoption (teams onboarded — 15/15 is the goal in a quarter), cache hit rate per team, cost-per-1K-requests trend, p99 TTFT through the gateway vs direct (the proxy tax must stay under ~10ms or teams will bypass me — that number is my SLA), quota-exceeded incidents (target: zero *surprises* — teams should always have seen the 80% warning). Rollout: side-by-side — one team (the whale, ironically — biggest win, most load-shape knowledge) → 3 → all, with the direct-path keys revoked only when a team's ledgers look right for two weeks. Riskiest assumption: that provider pricing stays stable — the ledgers make any repricing a data conversation instead of a panic." 

## The curveballs (expect 2–3)

- "The gateway itself is now your single point of failure — the thing you were hired to fix." → "Fail-open data plane: routing tables cached at the edge, the control plane can die without killing inference. Plus boring-infrastructure discipline — stateless, multi-region, and a game-day where we kill it on purpose. I'm trading 15 scattered failure modes for 1 engineered one; that's the deal, and it's a good one."
- "A team demands the raw provider API — 'your gateway adds latency.'" → "I'd show them the numbers: proxy tax measured (target <10ms), cache hits making the gateway path *faster* than direct for their repeat traffic, and the outage/bill/security post-mortems. If they still want direct after that, they sign a policy exception with their name on it — in my experience the 80%-quota warning changes minds first."
- "New provider offers 50% cheaper tokens. What happens?" → "Ledger data decides: route the cost-sensitive classes (classification, extraction) there via the router's tier policy — my routing lab cut 60–80% at ±1pp quality — but behind an eval gate: their eval sets run against the new provider before traffic shifts, because cheap tokens that fail faithfulness aren't cheap."
- "One team's agent is in a loop, 4,000 calls/hour, burning the shared provider quota." → "Token buckets catch the volume (they queue), but the real answer is episode-level budgets — my agent lab's killer #4: the gateway can enforce max-tokens-per-session via request headers the SDK sets, and the agent platform should enforce steps/cost per episode. Gateway is the backstop; the agent runtime is the fix." 

## Scoring rubric (grade yourself honestly)

| Dimension | Strong hire | Borderline | Weak |
|---|---|---|---|
| Clarify | Asked who pays (chargeback) and who the user is (engineers) | Vague scale | Drew immediately |
| Estimation | Whale-as-design-case + gateway-pays-for-itself math | QPS only | Skipped |
| Architecture | Cache-first gateway + two-dimensional quotas + observability spine | Standard proxy boxes | "A proxy with a cache" |
| Deep dive | Three original sins each solved by a named mechanism; fail-open control-plane | Solves one well | "Add retries" |
| Tradeoffs | Adopt-via-proxy rationale; deliberately-not-building list | Generic | None |
| Operate | Adoption + proxy-tax SLA + kill-the-credentials plan | Basic metrics | Nothing |

**The hire-line:** this is a platform-engineering interview wearing an LLM costume. The winners talk tenants, quotas, ledgers, and fail-open design; the losers talk prompt templates. (Field-guide data point: gateways are among the most common *take-home* and *system-design* prompts for AI-platform roles.)

## After the mock

- Record your run's minute-20 state: did you have a diagram yet?
- Which curveball broke you? That's your next study block (bank/cheatsheet refs above).
- Re-attempt the *same* mock in 3 days; the delta is your actual progress.
