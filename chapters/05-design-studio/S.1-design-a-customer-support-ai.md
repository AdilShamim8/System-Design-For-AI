---
chapter_id: "S.1"
title: "Design a Customer Support AI"
topic: "Capstone: customer support AI"
track: capstone
bloom_stage: ["create"]
est_read_minutes: 25
prerequisites: ["B.2", "B.6", "B.8", "C.5", "X.1", "X.4"]
teaching_goal: "Combine RAG, model selection, evaluation, guardrails, multi-tenancy, and cost optimization into one end-to-end design."
primary_diagram: assets/diagrams/S.1/
common_misconception: "See chapter body"
status: stable
last_updated: 2026-08-10
---

# Design a Customer Support AI

You're the tech lead. The CEO wants a customer support AI shipped in eight weeks. The support team handles 50,000 tickets a month, mostly repetitive. The legal team is nervous. The CFO is nervous. Your job is to design the system — out loud, on a whiteboard, in a way that survives the design review. This is that whiteboard.

---

## Remember

This capstone combines: RAG (B.2), model selection & cost (B.6, X.4), evaluation (B.8), guardrails (C.5), multi-tenancy (X.1), and reliability (X.2). Each is a piece of the puzzle; this chapter assembles them.

---

## Understand

**The brief**: 50K tickets/month, 8-week timeline, multi-tenant (two business units), strict cost ceiling ($2/ticket), legal review required for any commitment to customers.

**The architecture:**
1. **Intake**: ticket arrives via email/chat/web. Routed to the AI system.
2. **Classification**: a small model (Haiku) classifies the ticket (billing, technical, general). Routes accordingly.
3. **RAG retrieval**: for technical questions, retrieve from the knowledge base (5,000 docs). Structural chunking at H2 boundaries, top-5 chunks, cross-encoder reranking.
4. **Generation**: Claude Sonnet generates the response, grounded in retrieved context. System prompt: 'answer only from context; if not in context, say I don't know.'
5. **Guardrails**: output validation (PII check, harmful content filter). For refund/credit actions: human approval required.
6. **Fallback**: if confidence < 90%, or if the ticket is high-stakes (legal, financial), escalate to a human agent.
7. **Cost optimization**: prompt caching (system prompt), semantic caching (40% of queries are repeats), model routing (70% to Haiku, 30% to Sonnet).
8. **Multi-tenancy**: separate vector indexes per business unit. Tenant_id on every request. Per-tenant cost attribution.
9. **Evaluation**: regression suite (200 test tickets with known-good answers). LLM-as-judge on 1% of production traffic. Weekly human review of 50 random tickets.
10. **Monitoring**: latency, cost per ticket, auto-resolution rate, escalation rate, customer satisfaction.

---

## Apply

**Step 1 — Requirements.** What does 'good' look like? Auto-resolve 40% of tickets (the repetitive ones). Customer satisfaction ≥ 4.0/5. Cost ≤ $2/ticket. Escalation rate ≤ 30%. No incorrect financial commitments (the Air Canada lesson).

**Step 2 — Architecture.** As above. The key decisions: RAG for knowledge grounding, model routing for cost, guardrails for safety, human-in-the-loop for consequential actions.

**Step 3 — The hard parts.**
- **Multi-tenancy**: two business units, separate indexes, shared model. Tenant isolation at the vector DB level.
- **Escalation**: when does the AI hand off to a human? Confidence < 90%, ticket type = legal/financial, customer request for human, repeated dissatisfaction.
- **Evaluation**: how do you know the AI is doing a good job? Auto-resolution rate, customer satisfaction, escalation rate, weekly human review.
- **Cost control**: prompt caching, semantic caching, model routing. Target: $2/ticket. With 50K tickets, that's $100K/month.

**Step 4 — Tradeoffs.** To hit 8 weeks: ship with the core (RAG + guardrails + human escalation). Defer: advanced eval suite (ship with basic, build the full suite in weeks 9-10), multi-agent orchestration (not needed for v1), voice support (v2).

**Step 5 — Launch checklist.** Before shipping: legal review of system prompt. Eval suite passing. Guardrails tested. Cost dashboard live. On-call rotation established. Rollback plan (can disable AI and route all to humans).

---

## Analyze

The design survives review because it addresses the three concerns:
- **CFO**: cost is bounded ($2/ticket, $100K/month) through caching and routing.
- **Legal**: no autonomous financial commitments (human approval required). Output validation prevents harmful content.
- **Support team**: AI handles the repetitive 40%, humans handle the complex 60%. Escalation is smooth.

---

## Evaluate

The system isn't perfect — it auto-resolves 40%, not 80%. But it's honest about its limits, safe in its guardrails, and cheap in its operation. That's a v1 that ships. v2 can improve auto-resolution; v1 establishes the foundation.

---

## Create

Redesign this for a bank's customer support. The stakes are higher (financial advice), the regulations stricter (SEC, FINRA), the data more sensitive (account numbers, transactions). What changes? What guardrails get tighter? What's the new cost ceiling?

---

## A common misconception

**'Customer support AI should auto-resolve everything.'** No. The goal isn't to replace humans — it's to handle the repetitive cases so humans can focus on the complex ones. A system that auto-resolves 40% safely is more valuable than one that auto-resolves 80% with errors. The former helps the support team; the latter creates liability.

---

## Explain it back

The customer support AI combines _____, _____, _____, _____, _____, and _____. The cost ceiling is achieved through _____, _____, and _____. The legal concern is addressed by _____. The system auto-resolves _____% of tickets, not _____%, because _____.

---

## Further reading

- **See chapters B.2, B.6, B.8, C.5, X.1, X.4 for the component patterns.**
- **Air Canada chatbot case (2024)** — why guardrails matter for customer-facing AI.
- **Intercom Fin AI documentation** — a production customer support AI.
