# Capstone cap2 — The Multi-Tenant RAG Platform

| | |
|---|---|
| **Prerequisites** | Chapter X.1 (two competitors, one backend) · Labs b2–b5, x1–x3 · cap1 recommended |
| **Time** | 20–30 hours over 2 weeks |
| **You ship** | The platform version: N tenants, each with their own corpus, isolated by design — quotas, per-tenant indexes, per-tenant cost — the S.2 design-studio chapter built |

cap1 shipped *a* support bot. cap2 ships the *machine that makes support bots* — the difference between an app and a platform, and the hardest interview flex in the repo (S.2). The core problem is **isolation**: one tenant's corpus, cost, and traffic must never leak into another's answers, bills, or latency.

## The spec

- **3 tenants minimum**, each with its own corpus (reuse cap1's + two smaller ones)
- **Tenant-scoped retrieval** — index isolation or hard-filtered shared index (build both; measure)
- **Quotas**: per-tenant requests/day and tokens/day, enforced server-side, with 429s that don't lie
- **Per-tenant everything**: cache (namespaced), logs, cost (x2's model per tenant), eval sets
- **The noisy-tenant test**: one tenant hammering (x3's locust) while others stay under p99
- **Admin API**: create tenant, upload corpus, rotate keys — the platform's actual surface

## Milestones

**M1 — Tenant model & routing (4 h):** API keys → tenant context middleware; every request carries tenant_id through *every* layer (logs, cache keys, metrics). The discipline: grep your codebase — any code path that doesn't know the tenant is a leak waiting to happen.

**M2 — Two isolation architectures (5 h):** (a) **index-per-tenant**: separate vector collections; (b) **shared index + hard tenant filter**: one collection, `WHERE tenant_id = ?` on every query (B.3's metadata filtering). Measure: retrieval latency, memory, hit-rate correctness (tenant A's query must *never* return tenant B's chunks — test it explicitly), and re-index blast radius (one tenant's corpus update in the shared index: does anything else move?).

**Gate:** isolation test passes 100/100 queries; you can state which architecture you'd pick at 3 tenants, 300, and 30,000 — *with the numbers* (per-tenant overhead vs. scale economics).

**M3 — Quotas & the noisy neighbor (4 h):** token-bucket per tenant (b1's rate-limiter cousin); a tenant over quota gets 429 + honest headers (`Retry-After`). Then the x3 locust test: tenant C at 10× load — tenants A/B's p99 must stay within SLO. If it moves, find the shared bottleneck (it's usually one of: event loop, connection pool, or vector DB contention) and fix with per-tenant concurrency caps.

**Gate:** noisy-neighbor test shows <10% p99 impact on innocent tenants, and you know *why* (which resource you capped).

**M4 — Per-tenant economics & eval (4 h):** x2's model per tenant; each tenant has its own eval set and dashboard (hit rate, faithfulness, refusal — b4 machinery, namespaced). **Gate:** the "why did tenant B's bill double" query returns in one lookup.

**M5 — The hardening pass (3 h):** prompt-injection *across* tenants (a malicious corpus in tenant A trying to steer tenant B — indirect injection at platform scale); corpus-upload validation (size caps, content checks — c2's contracts on the admin API); audit log of every admin action.

## The final gate

- [ ] Isolation: 100/100 correctness; cross-tenant injection attempts caught
- [ ] Quotas enforced with honest 429s; noisy-neighbor p99 impact <10%
- [ ] Two isolation architectures measured; recommendation with numbers
- [ ] Per-tenant dashboards + cost model answer any "tenant X" question in one lookup
- [ ] The x4 one-pager: "multi-tenant RAG platform" as you'd present it

## What this capstone earns you

The strongest seniority signal in this course. Multi-tenancy is where "the model is 5% of the system" becomes literal — the model barely changes, and everything hard (isolation, fairness, quotas, cost attribution) is systems engineering. This is Mock 2 territory: design interviews for platform roles probe exactly this capstone's decisions.
