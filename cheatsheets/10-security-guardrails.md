# 10 — Security & Guardrails (C.5, Labs c2, c5; field notes 03, 07, 08)

## Threat model, LLM edition
| Threat | The idea | Field note |
|---|---|---|
| Direct prompt injection | user rewrites your rules | Chevy $1 car (FN-07) |
| Indirect injection | *retrieved content* carries instructions | FN-07's cousin, worse |
| Data exfiltration | model talked into leaking context/keys | agent tool design |
| Persona drift / long-con attacks | two-hour conversations exit every tested envelope | Sydney (FN-12) |
| Poisoning | adversaries train your system (live or corpus) | Tay (FN-03) |
| Corpus leakage | tenant A's data answers tenant B | cap2's isolation tests |

## The layer stack (defense in depth — no single layer suffices)
```
1. input filters (injection patterns)     — cuts the easy 60%
2. prompt hygiene (privilege separation: instructions ≠ data in context)
3. tool contracts (allowlists, constraints, reversibility×cost gates, idempotency)
4. output validation (schemas, banned content, citation checks)
5. budget guards (steps/tokens/cost/wall-clock) — OUTSIDE the model
6. sandboxing (fs/network/CPU limits — "the sandbox is the product", cap3)
7. human escalation / dead-letters (the layer that catches the rest)
```
Lab numbers: unguarded agents comply with 30–60% of injections; the stack → single digits. **The prompt is advice; code is law** — anything with dollar signs or side effects flows through deterministic validation or a human.

## Data-side rules
- Never log secrets; scrub PII from traces before sharing (c5)
- Corpus uploads are untrusted input: size caps, content checks, per-tenant isolation (cap2)
- `.env` for keys, never hardcoded (setup); tokens scope-limited and rotated
- "Anonymized" is a claim, not a property (FN-11's de-anonymization lesson)

## The governance artifacts that prove seriousness
Attack-to-layer table (c5) · reversibility × cost grid per tool (c2) · eval gate with attack cases in CI · kill switch tested pre-launch (FN-03) · incident runbook for "model said something wrong" (FN-04/08: rollback + transcript + legal review)
