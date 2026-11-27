# Coding 12 — Worked Solution

*(Attempt the problem first. The value is the delta between your answer and this one.)*

The simulator is a fold over the request log; the decision analysis is the answer.

```python
PRICE = {"frontier": 15.0, "mid": 3.0, "small": 0.5}   # $/M tokens blended
CACHE_HIT_INPUT_FACTOR = 0.10                          # prompt-cache economics

def config_a(log):                       # all-frontier
    return sum(r.tokens * PRICE["frontier"] for r in log) / 1e6

def config_b(log):                       # + exact cache
    cache, bill = {}, 0.0
    for r in log:
        key = " ".join(r.prompt.lower().split())
        if key in cache:
            bill += r.tokens * CACHE_HIT_INPUT_FACTOR * PRICE["frontier"] / 1e6
        else:
            bill += r.tokens * PRICE["frontier"] / 1e6
            cache[key] = True
    return bill                          # on support-shaped traffic: ~25-35% off

def config_c(log):                       # routing + caches
    cache, sem, bill = {}, [], 0.0       # sem: the 0.88-threshold semantic layer
    for r in log:
        if exact_hit(cache, r):  bill += hit_price(r, "frontier"); continue
        if semantic_hit(sem, r): bill += 0.0; continue   # serve cached answer
        tier = "frontier" if r.intent == "hard_reasoning" else "mid"
        bill += r.tokens * PRICE[tier] / 1e6
    return bill
# Expected shape on the synthetic mix: A = 100% baseline; B ~ 70-75% of A;
# C ~ 25-35% of A (the 70% routed down at 1/5 price, plus the semantic layer
# catching the paraphrase repeats the exact layer missed — b5 + b6 composed).
```

The decision paragraph that closes the screen: "C ships — but the routing tier is GATED: the eval set (coding-8's harness) must show mid-tier within the quality bar on extraction and simple-QA slices before any traffic moves (b6's evidence, not faith). The residual bill is dominated by hard-reasoning on frontier — which is the honest place for spend to live. Next lever, in order: prompt diet on the frontier slice (X.4), then distillation of the extraction tier (Mock 10's decision at smaller scale). Cost work ends when the eval says so, not when the bill looks small.

## Complexity and cost

O(n) over the log per config; embedding for the semantic layer is the real cost (~10-30ms/request on CPU — the cache's own latency floor, per coding-4). In production this simulator becomes the cost-model page of the gateway dashboard: replay yesterday's real log nightly, price tonight's config change before it ships.

## Self-check

- [ ] Baseline priced before any lever
- [ ] Savings decomposed per lever (cache vs routing vs semantic)
- [ ] Routing gated on eval evidence, stated
- [ ] Residual bill's dominant component named
- [ ] The 'what would I cut next' ladder ordered
