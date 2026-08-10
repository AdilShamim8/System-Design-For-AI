# GenAI / LLM System Design — Questions

## Q-GEN-1 — The Law Firm's Hallucinating Bot

**Scenario:** A law firm deploys a RAG assistant over 50,000 legal documents. Lawyers report it confidently cites cases that don't exist. Three weeks of prompt tuning haven't helped.

**Track:** genai | **Difficulty:** hard | **Read first:** B.2, B.4, B.8

### Worked answer

The problem is upstream of the LLM. If retrieval misses the right chunk, generation cannot recover. Three weeks of prompt tuning is the wrong lever. Diagnose: pick 20 hallucinated answers, look at what chunks were retrieved. Fix chunking (legal docs are structured — split at section boundaries). Check the embedding model. Add cross-encoder reranking. Only then touch the LLM prompt. Build a regression suite of 100 known-good legal questions.

---

## Q-GEN-2 — The Multi-Tenant SaaS Launch

**Scenario:** B2B AI SaaS, 5 launch customers, strict data isolation. 8 weeks to launch.

**Track:** genai | **Difficulty:** hard | **Read first:** B.2, X.1

### Worked answer

Simplest isolation: one vector index per tenant. Shared model, private data — the retrieved context is what makes answers tenant-specific. For 5 tenants, per-tenant indexes are trivially cheap. At 500 tenants, consider namespace isolation. Ship the simple version, monitor, evolve.

---

## Q-GEN-3 — The Chat That Drowns in Context

**Scenario:** Team chat AI gets slower and "forgets" early details as conversations hit 50+ turns. Token costs tripled.

**Track:** genai | **Difficulty:** medium | **Read first:** B.0, C.4, X.4

### Worked answer

Two problems: context window overflow and token cost growth. Both from sending full history on every turn. Fix: conversation summarization — after N turns, summarize and send summary + last 2 turns. Add prompt caching for the system prompt. The assistant isn't "forgetting" — it's reading full history but attending poorly to early turns (the "lost in the middle" problem, Liu et al. 2023).
