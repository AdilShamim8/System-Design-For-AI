# Coding 12 — Simulate the Routing-Plus-Caching Cost Curve

**Time budget: 45 min.** Open book (docs, not solutions). Narrate your tradeoffs.

## The scenario

The unit-economics screen: you have a request log (prompt, intent class, tokens) for one month of traffic. Build the simulator that prices three configurations: (A) all-frontier, (B) frontier + exact cache, (C) tiered routing + exact cache + semantic cache. The ground truth from the labs: b5's 30-50 percent cache hit on support traffic, b6's 70 percent routed down-tier with no measurable quality loss.

## Your task

1. Implement config A (all-frontier): the baseline monthly bill.
2. Add the exact cache (normalized prompt string -> response, hit = 10 percent input price). Report savings and hit rate.
3. Add routing: extraction and simple QA go to mid-tier, hard reasoning stays frontier. Report the new bill and the per-tier traffic split.
4. Add the semantic cache in front of routing (tau=0.88, embed the repeats). Report the final stack's bill.
5. Draw the decision: which config ships, what quality evidence gates the routing tier (the eval set), and what the remaining bill is dominated by.

## Success looks like

Each config's bill, hit rate, and routed split reported separately. The savings decompose (which lever bought what). The routing decision is gated on eval evidence, not just price. The final analysis names what dominates the residual bill.

## Dataset

Self-generate: 100K synthetic requests — 30 percent repeats (Zipf-shaped), 70 percent unique, tagged with intent (extraction, simple QA, hard reasoning). Price sheet: frontier $15/M blended, mid $3/M, small $0.50/M; cache-hit input at 10 percent of normal.

## After your attempt

Open [SOLUTION.md](./SOLUTION.md). Grade yourself against the checklist at the end.
