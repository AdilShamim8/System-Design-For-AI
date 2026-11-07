# 3 — Agent Design Checklist (C.1–C.5, Labs c1–c5)

## The loop (write from memory)
```
while steps < max:
    action = model(state)           # tool call OR final answer (JSON contract)
    if tool:  state += run_tool()   # errors as DATA, never exceptions
    else:     return answer
budgets: steps · tokens · cost · wall-clock — enforced OUTSIDE the model
```

## Tools (c2 — the contract rubric)
- [ ] Negative purpose stated ("NEVER use for questions")
- [ ] Params fully constrained (types, patterns, lengths)
- [ ] Errors return correctable data
- [ ] Side effects declared and gated on the **reversibility × cost grid**: reversible-cheap → no gate; irreversible-cheap → token confirm; irreversible-expensive → human approval
- [ ] Idempotency keys on anything retryable

## Memory (c4)
- [ ] Working memory: last K turns verbatim (system prompt pinned)
- [ ] Episodic: rolling summary for arc (lossy — plan for it)
- [ ] Semantic: exact facts (IDs, amounts) in a *table*, injected verbatim — never in a summary

## Multi-agent (c3)
- [ ] Race against a single-agent control first
- [ ] Teams win on: context isolation, per-role model routing, change isolation — nothing else
- [ ] Handoffs are schema-validated contracts

## Evaluation (c5)
- [ ] Outcome grade AND trajectory grade (good outcome via garbage path = scheduled regression)
- [ ] Trace logging from day one (can't evaluate what you didn't record)
- [ ] Attack set: injection, loop-bait, blast-radius, authority abuse, budget bombs

## Guardrails — the layer stack, outermost last
```
input filter → tool contracts → budget guards → output validation → human escalation
```
Unguarded agents comply with 30–60% of injections; the stack gets single digits (Lab c5 numbers). **The kill switch is a feature** (FN-03).
