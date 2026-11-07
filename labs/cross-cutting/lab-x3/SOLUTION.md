# Lab x3 — Worked Solution and What the Numbers Mean

## The five lessons hidden in the ramp

1. **The cliff is a property of the *weakest stage*, and only per-stage timing finds it.** Aggregate latency tells you *that* you're saturated; per-stage timing tells you *which* stage — the diagnosis template ("the stage whose latency grows while others stay flat"). In our reference runs it was the single event loop (blocking retrieval); in yours it may be the pool or the vector search. Same method, different culprit.
2. **Throughput plateau is the earlier signal.** Latency p99 is noisy and spiky; throughput stops rising *before* latency screams. Watch both curves: when added users buy no more req/s, you've found capacity regardless of what latency says.
3. **Headroom is a policy, not a feeling.** "Cliff at M, operate at M/2" — because real traffic has bursts (2–3× mean is normal), and the autoscaler needs reaction time. Services running at 80% of cliff are services that were down last Friday; the playbook's first number encodes this.
4. **Degrade, don't die — and pre-build the degradation.** The ladder (shed batch → cache-only → honest queues) is graceful degradation from Chapter 0.0, made operational. The deep insight: **cache-only mode is your outage plan** — b5's semantic cache at ~50ms per hit can serve degraded-but-useful answers when the full path is dead. A cache you built for cost becomes your availability story; that duality is worth a whole interview paragraph.
5. **For AI services, capacity is two-sided.** Your servers have a cliff; your *provider* has a rate limit — and you'll usually hit theirs first for generation-heavy traffic. Quota planning, burst smoothing, and multi-provider fallback (Mock 4) are capacity engineering, not just reliability engineering. The lab's mock hides this on purpose (to protect your bill), and the extension surfaces it at low concurrency.

## Common mistakes

- **Testing with real LLM calls at volume.** You're measuring the provider, paying for it, and risking your key. Mock for volume, spot-check real at ≤5 users.
- **One long ramp instead of discrete steps.** You need per-step steady-state stats (2 min/step minimum), not one continuous ramp whose numbers average across regimes.
- **Tuning the first bottleneck you *suspect*.** Fix what the per-stage timing *shows*, re-ramp, re-measure. Capacity engineering is the same loop as debugging: hypothesize from data, change one thing, re-measure.
- **No degradation ladder, just "add more servers."** Autoscaling can't save you from a stateful bottleneck (the vector DB, the provider limit) — only pre-built degradation modes can.

## Interview lines this lab earns you

- "I ramp-test with per-stage timing and read the plateau before the p99 spike: in my lab the single event loop was the cliff — blocking retrieval calls froze every request — and the fix (async client + more workers) moved the cliff 5×."
- "My capacity playbook opens with a number — safe operating point at half the cliff — and ends with a degradation ladder whose middle rung is cache-only: the semantic cache we built for cost becomes the availability plan, at 50ms a hit."
