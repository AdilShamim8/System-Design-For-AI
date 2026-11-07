# Lab x3 — Data notes: your own service, your own numbers

No external dataset — the "data" is your service's **latency distributions across the ramp**, and the deliverable is the two curves plus the playbook. Calibration numbers from our runs (FastAPI + mocked 0.8s LLM delay, 1 worker, laptop):

| Concurrent users | p50 (ms) | p99 (ms) | Throughput (req/s) |
|---|---|---|---|
| 1 | ≈ 850 | ≈ 900 | ≈ 1.1 |
| 5 | ≈ 900 | ≈ 1,100 | ≈ 5 |
| 10 | ≈ 950 | ≈ 1,400 | ≈ 9.5 |
| 20 | ≈ 1,100 | ≈ 2,500 | ≈ 15 |
| 50 | ≈ 2,000+ | ≈ 5,000+ | ≈ 17 (plateau — the cliff) |

Your absolute numbers will differ (CPU, worker count, retrieval cost) — **the shape is the deliverable**: flat, flat, inflection, plateau. If you see no cliff by 100 users, your mock is too fast or your service is genuinely efficient; raise concurrency or add retrieval load until the shape appears.

**Notes that keep the lab honest:**

- Mock the LLM (canned answer + fixed delay). Real-API load tests measure *their* queueing, cost real money, and get your key rate-limited — all three teach the wrong lesson.
- Log per-stage timings (retrieve / generate / queue) from request one; retrofitting timing into a screaming service is how outages get longer.
- The degradation ladder must be *built before* the outage: cache-only mode is a feature flag you tested in this lab, not a hero move at 7:42 PM Friday.

**License:** yours. The playbook is the artifact; carry it to interviews.
