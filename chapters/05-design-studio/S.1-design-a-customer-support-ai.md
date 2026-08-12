---
chapter_id: "S.1"
title: "Design a Customer Support AI"
topic: "Capstone: customer support AI"
track: capstone
bloom_stage: ["create"]
est_read_minutes: 22
prerequisites: ["B.2", "B.6", "B.8", "C.5", "X.1", "X.4"]
teaching_goal: "Combine RAG, model selection, evaluation, guardrails, multi-tenancy, and cost optimization into one end-to-end design."
status: stable
last_updated: 2026-08-12
---

# Design a Customer Support AI

You're the tech lead. The CEO wants a customer support AI shipped in eight weeks. The support team handles 50,000 tickets a month, mostly repetitive. The legal team is nervous (the Air Canada precedent). The CFO is nervous (cost). Your job is to design the system — out loud, on a whiteboard, in a way that survives the design review.

This capstone combines everything: RAG (B.2), model selection & cost (B.6, X.4), evaluation (B.8), guardrails (C.5), multi-tenancy (X.1), and reliability (X.2). Each is a piece of the puzzle; this chapter assembles them.

---

## The brief

- 50K tickets/month, 8-week timeline
- Multi-tenant (two business units with different knowledge bases)
- Strict cost ceiling: $2/ticket ($100K/month)
- Legal: no autonomous financial commitments (the Air Canada lesson)
- Target: auto-resolve 40% of tickets, escalate 30% to humans, 30% are complex

---

## The architecture

1. **Intake**: ticket arrives via email/chat/web. Routed to the AI system.
2. **Classification**: a small model (Haiku, ~$0.001/ticket) classifies the ticket (billing, technical, general). Routes accordingly.
3. **RAG retrieval**: for technical questions, retrieve from the knowledge base (5,000 docs). Structural chunking at H2 boundaries, top-5 chunks, cross-encoder reranking.
4. **Generation**: Claude 3.5 Sonnet generates the response, grounded in retrieved context. System prompt: "answer only from context; if not in context, say I don't know."
5. **Guardrails**: output validation (PII check, harmful content filter). For refund/credit actions: human approval required.
6. **Fallback**: if confidence < 90%, or if the ticket is high-stakes (legal, financial), escalate to a human agent.
7. **Cost optimization**: prompt caching (system prompt 90% off), semantic caching (40% of queries are repeats), model routing (70% to Haiku, 30% to Sonnet).
8. **Multi-tenancy**: separate vector indexes per business unit. Tenant_id on every request. Per-tenant cost attribution.
9. **Evaluation**: regression suite (200 test tickets with known-good answers). LLM-as-judge on 1% of production traffic. Weekly human review of 50 random tickets.
10. **Monitoring**: latency, cost per ticket, auto-resolution rate, escalation rate, customer satisfaction.

---

## The cost math

- Classification (Haiku): $0.001 × 50K = $50/month
- RAG + generation (Sonnet, 30% of tickets): $0.02 × 15K = $300/month
- Simple Q&A (Haiku, 70% of tickets): $0.003 × 35K = $105/month
- Prompt caching savings: ~60% off input costs
- Semantic caching savings: ~40% fewer LLM calls

**Total: ~$200-500/month** — well under the $100K ceiling. The cost ceiling is not the constraint; quality and safety are.

---

## The tradeoffs

To hit 8 weeks: ship with the core (RAG + guardrails + human escalation). Defer: advanced eval suite (ship with basic, build the full suite in weeks 9-10), multi-agent orchestration (not needed for v1), voice support (v2).

---

## The launch checklist

Before shipping:
- [ ] Legal review of system prompt
- [ ] Eval suite passing (200 test tickets, >85% accuracy)
- [ ] Guardrails tested (PII, harmful content, financial commitments)
- [ ] Cost dashboard live (per-ticket cost, cache hit rate, routing accuracy)
- [ ] On-call rotation established
- [ ] Rollback plan (can disable AI and route all to humans)
- [ ] Multi-tenancy verified (tenant A cannot see tenant B's data)

---

## A common misconception

**"Customer support AI should auto-resolve everything."** No. The goal isn't to replace humans — it's to handle the repetitive cases so humans can focus on the complex ones. A system that auto-resolves 40% safely is more valuable than one that auto-resolves 80% with errors.

---

## Explain it back

> "The customer support AI combines _____, _____, _____, _____, _____, and _____. The cost ceiling is achieved through _____, _____, and _____. The legal concern is addressed by _____. The system auto-resolves _____% of tickets, not _____%, because _____."

---

## References

- **See chapters B.2, B.6, B.8, C.5, X.1, X.4 for the component patterns.**
- **Air Canada Chatbot Case (2024), *Moffatt v. Air Canada*, 2024 BCCRT 149.** https://decisions.civlresolutiontb.ca/crt/crtd/en/item/522164/index.do
- **Intercom Fin AI Documentation.** A production customer support AI. https://www.intercom.com/ai
