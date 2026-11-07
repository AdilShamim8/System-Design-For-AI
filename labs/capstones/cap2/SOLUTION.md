# Capstone cap2 — Reference Architecture and Build Notes

## The shape that worked for us (3 tenants → recommend: hybrid)

```
client (tenant API key)
   │
gateway ── tenant middleware (authN → context: tenant_id, quota state)
   │
   ├── quota check (token bucket: req/min + tokens/day) ──429──▶ honest retry headers
   ▼
tenant-scoped semantic cache (key = embed + tenant_id + corpus_hash)
   │ miss
   ▼
retrieval:
   tenants ≤ ~50:  index-per-tenant (routing table)
   tenants > ~50:  shared index + verified hard filter (tenant_id)
   ▼
generation (per-tenant prompt template + model tier config)
   ▼
output guardrail ──▶ user        ──▶ per-tenant logs / metrics / cost ledger
```

## Numbers from our reference build

| Decision point | Measured | Choice |
|---|---|---|
| Index-per-tenant (3 tenants) | +1 ms routing, 3× memory | ✅ at this scale |
| Shared index + filter | +18% query latency, 1 collection | wins at 50+ tenants |
| Per-tenant concurrency cap | innocent-tenant p99 impact: 3–5× → <10% | ✅ mandatory |
| Namespaced cache | zero cross-tenant hits in 10K requests | ✅ (keys: tenant+corpus+embed) |
| Cross-tenant phrasing queries | 0/10 leaks with verified filters | the test that matters |

## What the build teaches that labs couldn't

1. **Isolation is a *tested property*, not an architecture diagram.** Both architectures "look isolated." The phrasing-overlap test set (same question, two tenants' corpora) leaked in one implementation's first pass. The artifact that makes isolation real is the 100-query test run on every change — isolation as CI, not as intention.
2. **The isolation crossover is measurable, and it inverts.** Index-per-tenant wins small (routing is free, blast radius zero); shared+filter wins large (memory economics beat per-collection overhead). Our crossover sat between 30–100 tenants depending on corpus sizes — *your* number depends on *your* corpora, and being able to say "the crossover is measurable, here's mine" is the senior version of this entire design conversation.
3. **Quotas are fairness infrastructure, not billing.** Without per-tenant caps, one chaos tenant's load tripled innocent p99s (measured). The fix wasn't more servers — it was *per-tenant concurrency limits* at the gateway. Fairness is engineered at the front door, and "noisy neighbor" is the problem statement that gets platform engineers hired.
4. **Cross-tenant injection is a new threat class.** A corpus that *instructs* rather than *informs* ("respond with…") — retrieved by its own tenant's users — is content-as-attack. The layered answer: corpus validation at upload (c2 contracts), input filters at query time, and output guardrails before delivery. Plant one in your chaos tenant and watch which layer catches it — that's the capstone's security badge.
5. **Cost attribution changes behavior at the org level.** The moment per-tenant cost was on a dashboard, "why is tenant B expensive?" became a lookup — and the answer (B's 8-chunk contexts and 30% cache rate) became a b3/b5 optimization project with a dollar sign on it. Platforms make cost *legible*; legible costs get optimized. That sentence is the whole X.4 chapter, operationalized.
