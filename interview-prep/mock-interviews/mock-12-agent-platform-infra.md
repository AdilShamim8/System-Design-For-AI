# Mock 12 — Design the Internal Agent Platform (the Team Everyone Builds On)

**45 minutes.** Interviewer reads the prompt, candidate drives. Timer segments: 10 clarify + scope · 20 architecture · 10 deep dive · 5 curveballs. The interviewer's job is to push ONE level past the candidate's comfort — the deep dive is where levels are decided.

## The prompt

You're the founding engineer for an internal agent platform at a 2,000-person company. Five product teams will build agents on it. Known requirements: a shared tool-calling layer with per-team permissions, an LLM gateway with cost attribution, shared eval infrastructure, and a human-approval framework. One team ships a customer-facing support agent in Q1. Design the platform — v1 scope, the abstractions, and what you'd deliberately NOT build.

## Candidate-quality walkthrough

This is a platform-engineering interview with agent-shaped problems. The winning structure:

**Start with the customer (the support-agent team) and the anti-customer (a team doing a one-off script — tell them to use the API directly; platforms that serve everyone serve no one).** The platform exists to make the *second through fifth* agent cheap: v1 is opinionated infrastructure for the 80% case.

**The four v1 services:**
1. **The LLM gateway** (x2/x3's domain): routing (model tiers per use-case, b6), caching (exact + semantic, b5), rate limits and budgets per team, cost attribution per request (the metering MUST exist day one — retrofitting cost telemetry is how platforms lose the finance argument), and the fallback chain (frontier → mid → small with per-hop eval basis). The gateway is the platform's revenue story: it saves every team 40–70% (routing + caching) — the platform pays for itself in the first quarter (Q-CC-10's unit economics).
2. **The tool registry (c2's contract made into infrastructure):** tools declared with a schema (name, params, side-effect class: read / write / write-money / irreversible), permissions per team, and the approval grid as a *platform service* — the human-approval workflow (park the agent, notify the approver, timeout + escalation) is the piece every team builds badly if left to themselves. Idempotency keys at the registry level for any write tool.
3. **Eval-as-a-service:** the shared golden-set harness, the versioned LLM-judge (Q-CC-12: the judge is code, versioned, re-baselined), and per-team regression gates wired into their CI. V1 is advisory (adoption by pull, not mandate); the support team's Q1 launch makes it blocking *for them* because they're customer-facing.
4. **The observability spine:** traces (c5) with a standard span schema — the agent loop, every tool call, every approval — because 3 AM debugging (Q-AG-10) and audits (Q-AG-11) both consume the same trace data. Plus the fleet dashboard: spend, latency, refusal rates, approval latency per team.

**What you deliberately DON'T build v1** (the senior signal — restraint): no multi-agent orchestration framework (teams compose the loop themselves with a provided library — the market consensus keeps shifting and premature abstraction calcifies); no fine-tuning infrastructure (no one's ready; buy until the eval set exists to justify it — mock 10's decision applied to a platform); no visual agent builder (the two teams who'd use it aren't shipping Q1); no self-serve onboarding portal — five teams is a config file and a meeting, not a product.

**The Q1 critical path:** gateway + tool registry + the support team's specific needs (their tool list, their approval workflow, their eval set) — everything else lands Q2. The platform's first job is ONE team's launch, executed well; the second team is the proof.

## The curveballs

1. **"Team B wants a tool the registry doesn't support: arbitrary SQL against the production warehouse. Deadline: Friday. The platform answer?"** — The trap is saying yes (the registry's permission model exists precisely for this) or a flat no (you're now the bottleneck teams route around). The strong answer: the registry supports it as a *read-only, query-cost-limited, result-truncated* tool class with per-team allow-lists of tables/views, gated behind data-access review — the platform's job is making the dangerous thing safely expressible, not impossible. If the deadline can't wait for review: a scoped temporary credential with expiry and a post-hoc audit flag. This probes whether the candidate understands that platform power comes from *enabling with guardrails*.
2. **"The support agent, in production, is stuck in an approval loop: approvers don't respond, agents hold state for hours, users see 'pending' forever. Walk me through the fix and the platform feature it birthed."** — The saga-timeout answer (Q-AG-10's c2 layer): approvals need TTLs, escalation chains (primary → secondary → oncall), and the agent's *degradation path* (after TTL: resolve without the privileged action, or hand the whole conversation to a human queue — never hold a user hostage to an approver's lunch break). The platform feature: approval SLA dashboards — the metric that makes the org fix its own approval latency.
3. **"A team bypasses the platform entirely — direct API calls from their service. CFO asks why the platform's cost-saving numbers don't add up. Go."** — The honest platform-ops answer: mandate doesn't work (shadow IT always wins unless the platform is *the easiest path*); make the gateway the default by being better (free caching, one-line SDK, per-team dashboards they can't easily build themselves), track adoption as the platform's own north-star metric, and escalate the *cost* story to finance with per-team numbers (the bypassing team's spend vs platform peers — finance conversations move engineering orgs). The weak answer: "it's policy" — policy without convenience is a suggestion.

## Scoring rubric (grade yourself honestly)

- **Junior:** draws the boxes (gateway, registry, eval) with correct responsibilities. Misses: the v1 scope discipline, the critical path, the adoption story.
- **Mid:** solid v1 with the four services, the don't-build list with reasons, and handles curveball 1's read-only SQL class. May miss the cost-attribution-day-one point or the approval-saga design.
- **Senior:** the customer/anti-customer framing, metering as a day-one requirement, the approval workflow as the highest-value shared service, the eval adoption-by-pull strategy, and curveball 3's platform-ops maturity.
- **Staff:** everything senior, plus: the two-year architecture bets (which abstractions calcify — the multi-agent framework call), the org design (platform team staffing vs golden-path enablement), the governance interfaces (finance's cost view, security's audit view as platform *products* with their own users), and the build-vs-buy line per service (buy the gateway plumbing if it saves a quarter; the registry and approval grid are the moat — nobody sells your company's permission model).

**Grounding:** Chapters C.1–C.5, X.1–X.4 · Labs c1–c5, x2 · Q-AG-10..14, Q-CC-10..12 · mock 4
