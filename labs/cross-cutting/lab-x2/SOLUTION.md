# Lab x2 — Worked Solution and What the Numbers Mean

## Expected results (our model, using DATA.md inputs)

| Tenant | Requests/day | Cost/req | Daily cost | Margin @ $0.01/req |
|---|---|---|---|---|
| Corner cafe | 500 | ≈ $0.0008 | ≈ $0.40 | ≈ 92% |
| Regional chain | 5,000 | ≈ $0.0009 | ≈ $4.50 | ≈ 91% |
| The whale | 50,000 | ≈ $0.0015 | ≈ $75 | ≈ 85% |

## The five lessons hidden in those numbers

1. **The whale subsidizes nobody; the whale *is* the business — and the risk.** 90% of cost, 70% of revenue: your margins, your capacity planning, and your provider-rate-limit exposure all live in one customer's traffic pattern. Per-tenant dashboards aren't bureaucracy; they're concentration-risk management.
2. **Cost optimization is per-tenant once you can see per-tenant.** The whale's 40% hit rate (vs. 70% others) and 8-chunk contexts are *its* specific waste. Bumping the whale to the chain's efficiency is worth more than a global token-trimming sprint — and it's a b3/b5 fix (re-chunk their corpus, tune their cache threshold), not a model-architecture change.
3. **Generation input dominates — so input-side levers dominate.** The tree says 60–90% of RAG cost is context tokens. Chunk right-sizing, cache hit rate, and history trimming (c4!) all attack that leaf; "make answers shorter" attacks the 10–20% output leaf. Teams optimize what's visible; the tree makes the right leaf visible.
4. **Cost per successful answer is the only pricing-grade metric.** At 0.65 success, a quality fix worth +5pp is equivalent to a 7% cost cut — and quality fixes are often cheaper than token fixes. Engineering dashboards stop at cost/request; product dashboards divide by success. The one-line refinement changes which optimizations look rational.
5. **Scenarios, not snapshots, drive architecture.** "Provider cuts prices 50%" moves your margin ~5–10% (output is a small leaf); "small tier + reranker" moves it 60–80%. Knowing *which lever moves the number* is what makes the gateway/routing conversation (Mock 4) an engineering discussion instead of a fashion one.

## Common mistakes

- **Forgetting fixed amortization on small tenants.** The cafe's cost/request includes its share of index builds and monitoring; without it you under-price small plans and learn it at renewal time.
- **Using list prices without date stamps.** Providers reprice several times a year; an undated cost model is a rumor with a spreadsheet.
- **Modeling cache savings at hit-rate × 100%.** Cache hits still cost the embedding lookup (~5% of full request cost in our model) — the 0.95 factor matters at whale scale.
- **Never stress-testing the model.** The 10× volume scenario is where forgotten costs (rate limits, RAM-resident caches) surface. Run it before the customer growth does.

## Interview lines this lab earns you

- "I model unit economics as a per-tenant cost tree: for RAG, generation input is 60–90% of cost, so input-side levers (chunk sizing, cache hit rate, history management) outrank output trimming — and I price in cost-per-successful-answer, because at 65% success a 5-point quality fix is worth more than a 7% token cut."
- "My whale tenant runs 40% cache hit rate vs. 70% for others — per-tenant dashboards turned that from 'our costs are high' into a specific fix: re-chunk their corpus and retune their cache threshold."
