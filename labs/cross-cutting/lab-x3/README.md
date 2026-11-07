# Lab x3 — Load-Test Your AI Service

| | |
|---|---|
| **Prerequisites** | Chapter X.5 (when production breaks) · Lab a1's serving patterns |
| **You will build** | A locust load test against your own b2 RAG service (or a1's model API), the p99 cliff chart, and the capacity playbook |
| **Est. time** | 2–3 hours |
| **Cost** | Generation for load: use a *mock* LLM (returns canned answer) for the high-volume runs — you're testing your pipes, not paying to test them |

**The story.** Every service has a cliff: at some concurrency, latency is flat; past it, queues explode, p99 goes vertical, and timeouts cascade (Chapter X.5's Friday night). You can find the cliff in production, at 7:42 PM on a Friday — or you can find it this afternoon, with a load generator, at zero emotional cost. Today you find yours, chart it, and write the playbook for the day the traffic arrives.

## Part 1 — The service under test (20 min)

Wrap your b2 RAG pipeline in FastAPI (a1's pattern): `/ask?q=...` → retrieve → generate → answer. **For load testing, mock the LLM call** — return a canned 400-token answer after a realistic simulated delay (e.g., `await asyncio.sleep(0.8)`). Rationale: you are testing *your* service's pipes (queueing, event loop, retrieval path); the provider's latency is not yours to test, and paying for 10,000 test generations tests only your credit limit.

## Part 2 — The ramp (40 min)

```python
# locustfile.py
from locust import HttpUser, task, between

class RagUser(HttpUser):
    wait_time = between(0.5, 1.5)
    @task
    def ask(self):
        self.client.get("/ask", params={"q": "who won Super Bowl 50"})
```

Run the ramp: 1 → 5 → 10 → 20 → 50 → 100 concurrent users, 2 minutes per step, recording p50/p95/p99 and throughput (req/s) per step. Plot the two curves: latency vs. concurrency, throughput vs. concurrency.

**Checkpoint 2:** Find the cliff — the concurrency where p99 inflects sharply (often 2–5× above it, everything is flat; below it, chaos). Before the cliff, throughput rises near-linearly with users; at the cliff, it *plateaus* while latency explodes — the definition of saturation. Write your cliff's coordinates: "flat to N users, cliff at M."

## Part 3 — Diagnose the bottleneck (30 min)

A cliff has a cause. The suspects, in rough order for a Python AI service:

1. **Event loop / worker count:** one uvicorn worker = one event loop; blocking calls (sync `requests`, heavy pandas) freeze everyone. Check: does p50 *rise* before p99? (Classic blocking signature.)
2. **The mock's sleep** (in this lab) or the real provider's rate limit (in production): per-connection limits serialize.
3. **Retrieval path:** vector search on CPU under concurrency — contention, not compute.
4. **Connection pool exhaustion:** DB/HTTP clients default to tiny pools; queuing starts at the pool, not the server.

**Checkpoint 3:** Add timing middleware (log per-stage: retrieve_ms, generate_ms, queue_ms). The stage whose latency grows with concurrency *while others stay flat* is your bottleneck — that sentence is the diagnosis template for every load test you'll ever run. Fix the top one (more workers? async client? bigger pool?), re-ramp, and measure the cliff move. One fix, one re-ramp: the loop of capacity engineering.

## Part 4 — The capacity playbook (20 min)

Write the one-pager ops will actually use:

- **The numbers:** cliff at M concurrent; safe operating point at M/2 (headroom rule); expected req/s at the safe point.
- **The autoscaling rule:** scale workers when p95 > X for 2 minutes (not p99 — too spiky); scale *out* the stateless service; never autoscale the vector DB blindly (stateful — X.5).
- **The degradation ladder** (X.5's graceful degradation, made concrete): at 80% cliff → shed low-priority traffic (batch jobs, analytics); at 95% → serve cache-only (b5 becomes the outage plan); at cliff → queue with honest ETAs instead of timing out silently.
- **The provider-rate-limit plan:** real LLM traffic hits *their* limits before your servers break — quota alerts, burst smoothing, and the fallback tier (Mock 4's design, again).

**Checkpoint 4:** The playbook's first sentence should be a number ("We degrade gracefully at N concurrent; today's peak was 0.4N"). If it opens with prose, ops won't read it; if it opens with a number, they'll memorize it.

---

## Explain it back

1. What defines "the cliff" — in both curves (latency and throughput)?
2. Why mock the LLM for load tests — what are you testing, and not testing?
3. p50 rising before p99: what's the classic cause in a Python service?
4. Why is "serve cache-only" a *better* outage mode than "try the full path with a 30s timeout"?

## Extensions

- **Real-LLM spot checks:** run one ramp *with* the real LLM at low concurrency (≤5 users) to measure the provider's variance under mild parallelism — the numbers that size your provider-side quota request.
- **Soak test:** 30 minutes at 60% of the cliff; watch for slow leaks (memory creep, connection accumulation). The bug class that only time finds.
- **Chaos injection:** kill a worker mid-ramp (or add 500ms random jitter to the mock). Does the load balancer spread and recover, or cascade? X.5's resilience patterns, experienced.

## What you can now claim in an interview

"I load-test to find the cliff before traffic does: ramped concurrency with per-stage timing, diagnosed the bottleneck from which stage grows while others stay flat, and wrote the capacity playbook — safe operating point with headroom, autoscale triggers on p95, and a graceful degradation ladder ending in cache-only rather than timeouts. For AI services, the provider's rate limit is part of your capacity planning."
