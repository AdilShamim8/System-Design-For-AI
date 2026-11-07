# 3 — The LLM API Gateway

*What every org with more than three teams calling LLMs ends up building (Mock 4).*

```mermaid
flowchart LR
    T1[team A] --> G[gateway<br/>OpenAI-compatible]
    T2[team B] --> G
    T3[team C] --> G
    G --> AUTH[authZ<br/>scoped team tokens]
    AUTH --> RL[rate limits + quotas<br/>req/min AND tokens/day]
    RL --> C{semantic cache<br/>namespaced by team}
    C -->|hit| R[response]
    C -->|miss| RT[router<br/>tier + task policy]
    RT --> P1[small tier]
    RT --> P2[mid tier]
    RT --> P3[frontier]
    P1 --> FB[fallback chain<br/>provider A to B to degraded]
    P2 --> FB
    P3 --> FB
    FB --> OG[output checks] --> R
    G --> LOG[(per-request ledger<br/>team, tokens, latency, cost)]
    LOG --> DASH[dashboards + chargeback]
```

## The request to walk through

'Team B's agent asks a question' → team token authenticated → under quota → cache miss (namespaced — team A's answers never leak) → router sends the easy query to small tier → provider A is degraded → failover to provider B → output check → response; the ledger records team-B tokens for chargeback and the dashboards show the provider-B shift.

## Failure modes the boxes are hiding

- The gateway itself: SPOF — fail-open data plane (cached route tables), multi-region
- Provider failover: thundering-herd on the backup — burst-smoothing queue
- Cache: cross-team leakage without namespacing (isolation is a tested property)
- Ledgers: silent cost creep — context bloat and k-creep live in the token mix (the $14K-bill story, Q-GEN-6)

## Tool families for each role

Gateway: custom on FastAPI/Envoy, or vendor gateways · Cache: Redis+embeddings · Routing policy: config-as-code · Observability: OpenTelemetry + Langfuse-class. Full design: Mock 4.
