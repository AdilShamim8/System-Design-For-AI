# Mock 7 — Design a Vector-Database-as-a-Service

## The prompt

"Your cloud wants to offer a managed vector-database service: customers upload embeddings collections, query them with metadata filters, pay by usage. Target: 1,000 customers at launch, collections from 10K to 1B vectors. Design it — multi-tenant, isolated, and profitable."

*45 minutes, paper, timer.*

---

## Candidate-quality walkthrough

**[0:00–5:00 Clarify]** "The workload spread decides everything: what's the query mix — pure ANN, or ANN + heavy metadata filters (the filtered-ANN problem is notoriously implementation-sensitive)? Consistency requirements — eventual ok on writes? And the isolation promise: performance isolation between tenants (noisy neighbor), or just data isolation? Those are different products." Interviewer: filters on most queries (e-commerce, security use cases); eventual consistency fine; BOTH isolations promised — it's in the launch deck.

**[5:00–10:00 Estimate]** "The tenant distribution: 1,000 customers, but the size range (10K–1B) means the top 10 tenants hold most of the *vectors* — say the median tenant is 1M vectors, the top 10 are 100M+. Memory: 1B vectors × 1,536-dim × 4B = 6TB raw + HNSW ~1.7× ≈ 10TB for one whale — a cluster by itself. The fleet is bimodal: hundreds of tiny tenants (shared, containerized) and a handful of whales (dedicated). Capacity math IS the product design here."

**[10:00–20:00 High-level]** The control plane / data plane split: **control plane** — tenant registry, quotas, billing meters, schema/metadata management, index lifecycle. **Data plane** — bimodal: small tenants on *shared* clusters with hard tenant_id filtering (metadata-partitioned shards; isolation verified by a standing cross-tenant test suite), large tenants on dedicated clusters (their own failure domain). Query path: authN → quota check → router (tenant → cluster/shard) → filtered ANN (pre-filter for selective filters, post-filter for loose ones — a *measured* choice per query, since pre-filtering at 0.01% selectivity can be slower than post-filtering; my selection cheatsheet's vendor-catcher) → merge top-k across shards → response. Write path: upserts with versioning, compaction, and index updates (the hard part — HNSW inserts degrade the graph; periodic background rebuilds). Ops: per-tenant metrics (QPS, p99, recall — *recall as a tenant-visible SLA metric is the differentiator most teams miss*).

**[20:00–35:00 Deep dive — interviewer picks noisy neighbor, the 1B-vector whale, and failure]** "Noisy neighbor on shared clusters: per-tenant rate limits AND concurrency caps at the query coordinator — my platform lab measured innocent-tenant p99 going 3–5× under one chaos tenant without caps; with them, <10%. The caps are tenant-configurable *up to their plan tier* — fairness as a pricing feature. The whale: dedicated cluster, sharded by their metadata partitions (their filters align with natural shards — e.g., by locale), replicas for HA, and *recall verification* — sharded ANN merges local top-k, recall drops slightly with shard count; the SLA number (0.99 recall@10, say) must be tested per shard configuration, not assumed. Re-indexing the whale: blue-green index builds — build new alongside, swap atomically, keep old for rollback — because a 1B-vector rebuild is *hours* and doing it in place means degraded recall mid-rebuild. Failure modes: node loss = recall degradation (not just capacity — vector services fail *soft*, and my SLOs must say so explicitly); the recovery is shard-replica promotion + graph-repair in background. The most dangerous failure is *silent*: a bad index build that drops recall 2% — caught only by a standing recall-canary suite querying known-answer sets continuously."

**[35:00–40:00 Tradeoffs]** "What I gave up: strong consistency (eventual, with versioned reads — customers' embeddings lag their writes by seconds; fine for the stated use cases, would NOT be fine for dedup-critical workloads — say so in the docs); pure multi-tenancy (the bimodal fleet costs operational complexity — one product, two ops runbooks — but shared-only can't host the whales and dedicated-only can't price the small tenants); and one universal index type (HNSW default, IVF-PQ for the size-vs-recall tier at whale scale — a tenant-selectable knob with honest tradeoff documentation)."

**[40:00–45:00 Operate]** "Per-tenant dashboards: QPS, p50/p99, filter-selectivity mix, recall canary, index age/health, spend. Business: fleet utilization (memory is the capacity unit — idle RAM is the margin killer), tenant cost-to-serve vs. plan price (the small-tenant fixed-cost trap from my cost lab), whale concentration risk. Rollout: design partners on the shared tier first (the dedicated tier's ops load needs its own staffing plan), isolation test suite in CI from day one — cap2's lesson: isolation is a tested property, not an architecture diagram. Riskiest assumption: that filtered-ANN performance generalizes across filter shapes — the per-tenant query mix will surprise us; the measurement plan is the mitigation."

## The curveballs

- "A tenant wants real-time deletes — GDPR, right-to-be-forgotten, 500M vectors." → "Deletes are the vector-DB graveyard: HNSW doesn't really delete, it tombstones — tombstones accumulate, recall/perf rot. Design: tombstone + filter at query (correct, immediately) + periodic compaction (physical removal) + the SLA says 'excluded within X seconds, physically removed within Y days.' GDPR cares about correctness of exclusion; we deliver that instantly and the physical part on a schedule."
- "Your shared-cluster isolation test suite — what's IN it?" → "The cap2 set: 100 queries across tenants including shared-phrasing traps (same words, different tenants — the classic leak), injection attempts via metadata, and cross-tenant nearest-neighbor audits — retrieve top-100 for tenant A's queries, assert zero tenant-B chunks, run on every release."
- "Customers demand 'exact' KNN — no approximation." → "Offer it, priced honestly: exact brute-force on a shard is fine at 1M vectors (~50ms), absurd at 1B. Tiered product: exact for small collections, ANN with recall SLA for large — and the recall canary makes the SLA credible. Most customers actually want *auditable* recall, which the canary provides."

## Scoring rubric (condensed)

Strong-hire: bimodal fleet derived from the size distribution math; filtered-ANN treated as the hard problem it is; noisy-neighbor caps with measured numbers; recall as an SLA with canaries; deletes/GDPR handled with the tombstone+compaction pattern. Weak: "shard it" without the merge-recall subtlety; isolation as a promise; no capacity math.

**The hire-line:** this is a *stateful multi-tenant platform* question — the winners import distributed-systems fundamentals (sharding, isolation, blue-green) and add exactly two vector-specific realities: memory math and soft-failure recall.
