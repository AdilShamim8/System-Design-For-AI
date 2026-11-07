# 9 — Multi-Tenant Vector Database Service

*The platform architecture for serving embeddings at tenant scale (Mock 7, capstone cap2).*

```mermaid
flowchart TB
    subgraph CP [CONTROL PLANE]
    TEN[(tenant registry<br/>quotas, plans)] --> ROUT[router]
    B[usage meters] --> BILL[billing]
    end
    subgraph DP [DATA PLANE]
    T[team tokens] --> AUTH[authZ] --> Q[quota check<br/>req/min + tokens/day]
    Q --> SH1[shared clusters<br/>small tenants, hard filters]
    Q --> SH2[dedicated clusters<br/>whales, own failure domain]
    SH1 --> ANN[filtered ANN<br/>pre/post-filter per selectivity]
    SH2 --> ANN
    ANN --> MERGE[merge top-k across shards] --> RESP[response]
    CAN[recall canary<br/>known-answer queries] --> SH1
    CAN --> SH2
    end
    ROUT --> Q
```

## The request to walk through

Tenant query → token auth → quota check → router: small tenant to a shared shard (hard tenant_id filter, isolation-tested), whale to its dedicated cluster → filtered ANN (pre-filter at 0.01% selectivity, post-filter otherwise — a measured choice) → shards merge local top-k (recall drops slightly; the canary measures it continuously) → response metered for billing.

## Failure modes the boxes are hiding

- Noisy neighbor: per-tenant rate AND concurrency caps (measured: innocent p99 ×3–5 without, <10% with)
- Recall as a soft SLO: node loss degrades recall, not just capacity — the canary makes it visible
- Re-indexing the whale: blue-green index builds (hours), atomic swap, rollback kept
- Deletes: tombstone + query-time filter (correct immediately) + periodic compaction — the GDPR pattern

## Tool families for each role

Data plane: Qdrant/Milvus/Vespa/pgvector by tier · Control plane: boring CRUD · Canary: known-answer sets. Full design: Mock 7 + cap2's isolation tests.
