---
chapter_id: "S.2"
title: "Design a Multi-Tenant RAG Platform"
topic: "Capstone: multi-tenant RAG platform"
track: capstone
bloom_stage: ["create"]
est_read_minutes: 25
prerequisites: ["B.2", "B.3", "B.4", "B.5", "X.1", "X.3"]
teaching_goal: "Design a RAG platform serving multiple tenants with strict isolation, observability, and quality controls."
primary_diagram: assets/diagrams/S.2/
common_misconception: "See chapter body"
status: stable
last_updated: 2026-08-10
---

# Design a Multi-Tenant RAG Platform

You're building a RAG platform. Not a RAG demo — a platform. Multiple customers, each with their own knowledge base, each expecting their answers to be private, fast, and correct. This is the difference between a weekend project and a product. This capstone walks through the design, end to end.

---

## Remember

This capstone combines: RAG (B.2), vector databases (B.3), chunking (B.4), reranking (B.5), multi-tenancy (X.1), and observability (X.3).

---

## Understand

**The brief**: 50 enterprise tenants, average 100K documents each, strict data isolation, <2s latency per query, per-tenant quality metrics.

**The architecture:**

**Ingestion pipeline (per tenant):**
1. Document upload → tenant_id tagged.
2. Chunking: structural at H2, 50-word overlap. Average 400 words/chunk.
3. Embedding: text-embedding-3-small (1,536 dims).
4. Vector DB: one index (or namespace) per tenant. Pinecone or pgvector.
5. Metadata: source, section, jurisdiction, effective date — attached to each chunk.

**Query pipeline (per request):**
1. Request arrives with tenant_id.
2. Embed query.
3. Retrieve top-50 from tenant's index.
4. Rerank with cross-encoder → top-5.
5. Build prompt: system + context + query.
6. Generate with Claude Sonnet.
7. Return answer with citations.

**Multi-tenancy:**
- One vector index per tenant (Pinecone namespaces or separate indexes).
- Tenant_id on every request, enforced at the API gateway.
- No path from Tenant A's query to Tenant B's vectors.
- Per-tenant cost attribution for billing.

**Observability:**
- Tracing: every request traced from API → embed → search → rerank → LLM → response.
- Eval-in-production: 1% of requests sampled, graded by LLM-as-judge.
- Drift monitoring: per-tenant input/output distribution.
- Full prompt logging for debugging.
- Per-tenant quality dashboards.

**Cost management:**
- Prompt caching (system prompt).
- Semantic caching (repeated queries within a tenant).
- Model routing (easy queries to Haiku, hard to Sonnet).
- Per-tenant rate limiting.

---

## Apply

**Step 1 — Tenant isolation.** Separate vector indexes. The cost: slightly more infrastructure (50 indexes vs. 1). The benefit: strongest isolation, no risk of cross-tenant data leakage. For 50 tenants, this is the right choice. For 5,000, consider namespace-based isolation within fewer indexes.

**Step 2 — Ingestion.** Per-tenant ingestion pipeline. Documents uploaded → chunked → embedded → indexed in the tenant's index. Incremental updates: when a document changes, re-embed only that document. Nightly full re-embed as a safety net.

**Step 3 — Query.** As above. Latency budget: 50ms (embed) + 50ms (search) + 50ms (rerank) + 10ms (build prompt) + 1.5s (LLM) = ~1.7s. Under 2s budget.

**Step 4 — Observability.** Per-tenant dashboards: query volume, latency, cost, quality (eval scores). Alerts on quality drop, latency spike, cost spike. This is how you catch per-tenant issues before they become churn.

**Step 5 — Tradeoffs.** At 5 tenants: per-tenant indexes, managed Pinecone. At 50 tenants: same. At 500 tenants: consider namespace isolation, dedicated infrastructure. At 5,000: custom solution, possibly self-hosted vector DB. The architecture evolves with scale.

---

## Analyze

The scaling cliffs: where does the architecture break?
- **Vector DB**: Pinecone handles millions of vectors per index. At 100K docs × 400 words × 1.3 tokens/word ≈ 52M tokens → ~13M embeddings per tenant. 50 tenants = 650M embeddings. Pinecone can handle this, but at a cost.
- **LLM concurrency**: 50 tenants querying simultaneously → 50 concurrent LLM calls. Need sufficient API capacity.
- **Ingestion**: 50 tenants × 100K docs = 5M docs to embed. At 13M tokens/tenant × 50 = 650M tokens. At $0.02/1M = $13 one-time. Cheap.
- **Cost**: at 1,000 queries/tenant/day × 50 = 50K queries/day. At ~$0.01/query (with caching) = $500/day, $15K/month. Sustainable for enterprise pricing.

---

## Evaluate

The platform succeeds when tenants trust it. Trust comes from: isolation (my data is private), quality (my answers are correct), reliability (the system is available), and transparency (I can see my metrics). The architecture above delivers all four. Without any one, the platform fails — no enterprise customer will use a RAG platform that might leak data, give wrong answers, go down, or hide its performance.

---

## Create

Redesign this for a healthcare RAG platform. The corpus is medical literature and patient records. Tenants are hospitals. What isolation level do you need (HIPAA)? What additional guardrails (patient privacy)? What evaluation (medical accuracy)? What's the cost ceiling per hospital?

---

## A common misconception

**'A RAG platform is just RAG at scale.'** No. A platform adds multi-tenancy, observability, cost attribution, per-tenant quality, and operational discipline that a single-tenant RAG system doesn't need. The RAG pipeline is 30% of the work; the platform is the other 70%. Teams that think 'just scale the demo' build platforms that break on tenant 5.

---

## Explain it back

A multi-tenant RAG platform differs from single-tenant RAG because it adds _____, _____, _____, and _____. Tenant isolation is achieved by _____. The per-tenant observability includes _____, _____, and _____. The scaling cliffs are at _____, _____, and _____ tenants.

---

## Further reading

- **See chapters B.2, B.3, B.4, B.5, X.1, X.3 for the component patterns.**
- **Pinecone documentation, "Multi-tenancy"** — vector DB isolation patterns.
- **LangSmith / Langfuse** — observability platforms for RAG.
