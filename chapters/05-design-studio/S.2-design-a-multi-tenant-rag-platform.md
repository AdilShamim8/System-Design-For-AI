---
chapter_id: "S.2"
title: "Design a Multi-Tenant RAG Platform"
topic: "Capstone: multi-tenant RAG platform"
track: capstone
bloom_stage: ["create"]
est_read_minutes: 22
prerequisites: ["B.2", "B.3", "B.4", "B.5", "X.1", "X.3"]
teaching_goal: "Design a RAG platform serving multiple tenants with strict isolation, observability, and quality controls."
status: stable
last_updated: "2026-08-12"
---

# Design a Multi-Tenant RAG Platform

You're building a RAG platform. Not a RAG demo — a platform. Multiple customers, each with their own knowledge base, each expecting their answers to be private, fast, and correct. This is the difference between a weekend project and a product.

---

## The brief

- 50 enterprise tenants, average 100K documents each
- Strict data isolation (Tenant A cannot see Tenant B's data)
- <2s latency per query
- Per-tenant quality metrics and cost attribution

---

## The architecture

**Ingestion pipeline (per tenant):**
1. Document upload, tenant_id tagged
2. Chunking: structural at H2, 50-word overlap
3. Embedding: text-embedding-3-small (1,536 dims)
4. Vector DB: one index (or namespace) per tenant

**Query pipeline (per request):**
1. Request arrives with tenant_id
2. Embed query
3. Retrieve top-50 from tenant's index
4. Rerank with cross-encoder, take top-5
5. Build prompt: system + context + query
6. Generate with Claude Sonnet
7. Return answer with citations

**Multi-tenancy:** one vector index per tenant (Pinecone namespaces). Tenant_id on every request, enforced at API gateway. No path from Tenant A's query to Tenant B's vectors.

**Observability:** per-tenant dashboards (query volume, latency, cost, quality). Alerts on quality drop, latency spike, cost spike.

**Cost management:** prompt caching, semantic caching, model routing. Per-tenant rate limiting.

---

## The scaling cliffs

- **Vector DB**: Pinecone handles millions of vectors per index. 50 tenants x 100K docs = 5M vectors total.
- **LLM concurrency**: 50 tenants querying simultaneously. Need sufficient API capacity.
- **Ingestion**: 50 tenants x 100K docs = 5M docs to embed. Batch pipeline, incremental updates.

---

## A common misconception

**"A RAG platform is just RAG at scale."** No. A platform adds multi-tenancy, observability, cost attribution, per-tenant quality, and operational discipline that a single-tenant RAG system doesn't need.

---

## Explain it back

> "A multi-tenant RAG platform differs from single-tenant RAG because it adds _____, _____, _____, and _____. Tenant isolation is achieved by _____. The scaling cliffs are at _____ tenants."

---

## References

- **See chapters B.2, B.3, B.4, B.5, X.1, X.3 for component patterns.**
- **Pinecone Multi-tenancy Documentation.** https://www.pinecone.io/learn/multi-tenancy/
- **LangSmith / Langfuse.** Observability platforms for RAG. https://docs.smith.langchain.com/
