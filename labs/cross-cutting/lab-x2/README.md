# Lab x2 — The Cost Dashboard: Unit Economics of an AI Service

| | |
|---|---|
| **Prerequisites** | Chapter X.4 (the bill nobody warned you about) · Labs b1, b5 |
| **You will build** | A per-tenant cost model and the cost dashboard — the artifact that decides pricing, architecture, and which fires to fight first |
| **Est. time** | 2 hours |
| **Cost** | Free (spreadsheet-and-code lab; uses your b1/b5 numbers) |

**The story.** Your RAG product has three tenants: a small one (500 questions/day), a medium (5,000), and a whale (50,000). The CEO asks two questions every week: *"What does a customer cost us?"* and *"Why did the whale's bill double?"* — and the answers must come from a dashboard, not a scramble. Unit economics is the skill of making cost *per-something* (request, tenant, day, feature) so those questions are lookups instead of investigations. You have every number you need from b1 and b5; today you assemble them into the model.

## Part 1 — The cost tree (30 min)

Decompose cost per request into its parts (all from your prior labs):

```
cost_per_request
├── embedding (cache lookup)     — b5: ~30 tokens at embedding prices
├── retrieval                    — vector DB: amortized infra / 1K reqs
├── generation input             — b1: (system + chunks + history + question) × input price
├── generation output            — answer tokens × output price
├── guardrails/eval overhead     — c5: judge calls on sampled answers
└── fixed amortized              — index builds (b3), monitoring (x1), the on-call pager
```

**Checkpoint 1:** Fill the tree with *your* measured numbers from b1/b5 (prices date-stamped). Which leaf is biggest? (RAG: generation input, ~60–90%.) Compute the fully-loaded cost per request at each tenant size — note the small tenant is *more* expensive per request (fixed costs amortize over less volume). That curve is why SaaS pricing has minimums.

## Part 2 — The tenant dashboard (30 min)

```python
def tenant_cost(usage, prices, fixed_amortized):
    per_req = (usage["mean_input_tokens"]/1e6*prices["in"]
               + usage["mean_output_tokens"]/1e6*prices["out"])
    variable = per_req * usage["requests"]
    cache_saving = per_req * usage["requests"] * usage["hit_rate"] * 0.95
    return {"variable": variable, "cache_saving": cache_saving,
            "fixed_share": fixed_amortized,
            "total": variable - cache_saving + fixed_amortized,
            "per_request": (variable - cache_saving + fixed_amortized)/usage["requests"]}
```

Build the table for your three tenants at day/month scale. Add the two rows every exec dashboard needs: **gross margin at the current price** (pick a price — say $0.01/request — and show margin per tenant) and **cost mix** (what % is the top leaf).

**Checkpoint 2:** The whale is 90% of cost and 70% of revenue — now what? Sketch the levers by leverage order (b1's list, now with tenant data): their hit rate is 40% vs. 70% for others (their users repeat questions — cache harder for them); their chunk count is 8 vs. 6 (their corpus is messy — b3 re-chunking saves *their* bill specifically). **Cost optimization is per-tenant work once you have per-tenant data.**

## Part 3 — The scenarios (40 min)

The dashboard earns its keep by answering "what if" in seconds. Build three scenarios and write one paragraph each:

1. **Price change:** provider cuts output price 50%. What happens to margin? (Output is ~8–15% of RAG cost — margin moves little. *Know which price moves you.*)
2. **Volume 10×:** every tenant grows 10×. Which costs scale linearly (tokens), which sub-linearly (fixed), which super-linearly (the cache that no longer fits RAM; the rate limits you now hit)? Where does the architecture crack first? (Usually: rate limits + vector DB sizing — the LLM bill just grows with revenue, which is *fine*.)
3. **The migration:** swap mid-tier for small-tier + reranker. Input tokens rise 10% (reranker context), price drops ~20×. Net effect? (Compute it — the answer surprises people: usually a large win, which is why gateways route this way. Mock 4's centerpiece, quantified.)

**Checkpoint 3:** For each scenario, write the *decision* the dashboard enables. A dashboard that doesn't change decisions is a hobby.

## Part 4 — The cost-per-success refinement (20 min)

Raw cost per request flatters a system that answers badly and cheaply. Pull in your b4 numbers: end-to-end success ≈ 0.65. **Cost per successful answer = cost_per_request / success_rate** — the only unit that prices quality. Recompute the tenant table with it. Note how a quality fix (say, +5pp success via reranking) is mathematically equivalent to a ~7% cost cut — and often cheaper than any token optimization. This one refinement is the difference between an engineering dashboard and a product dashboard.

---

## Explain it back

1. Walk the cost tree; which leaf dominates RAG and why does that dictate optimization order?
2. Why is the small tenant more expensive per request, and what does that imply for pricing?
3. Cost per request vs. cost per successful answer — when do they disagree enough to change a decision?
4. The provider cut prices 50% and your margin barely moved. Explain to the CEO in two sentences.

## Extensions

- **Reserved-capacity math:** add a self-hosted column (GPU-hour pricing ÷ realistic utilization) and compute the crossover volume for your three tenants. You've built the build-vs-buy calculator every platform team maintains.
- **FinOps alerts:** extend x1's alert config with cost rules — tenant daily cost > 2× their 7-day mean → ticket (not page). Cost incidents deserve paging only when they're *runaway* (10× and climbing).
- **The COGS line:** convert your model into the accounting COGS per tenant per month, and write the three assumptions you'd defend to a CFO. (FinOps vocabulary — unit cost, amortization, utilization — is interview gold for platform roles.)

## What you can now claim in an interview

"I model AI service costs as a tree — embedding, retrieval, generation input/output, eval overhead, amortized fixed — tracked per tenant, with cache savings and cost-per-successful-answer as the headline metrics. I can answer 'why did the whale's bill double' from the dashboard, price a tenant from the curve, and I know which scenario each architectural lever actually moves."
