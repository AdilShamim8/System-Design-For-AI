# 07 — WhatsApp Messaging (delivery at planet scale, small team)

**The system in three sentences.** A billion users on a famously tiny engineering team: the canonical 'do less, brutally well' system. The spine: per-device queues (the inbox IS the unit), end-to-end encryption (the server can't read messages — a DESIGN constraint, not a feature), store-and-forward delivery with read receipts, and fan-out as the only hard problem (groups). It's the design you cite when the interviewer says 'keep it simple.'

## The spine (draw it in 60 seconds)

```
sender → E2E-encrypt → server queues per (user, device) → push/fetch → recipient
groups: fan-out on send to N device queues (the write amplification problem)
offline: store-and-forward with retention clock; multi-device sync by device keys
```

## The numbers to carry

The famous stat: ~50 engineers at ~1B users at acquisition era (say 'orders of magnitude leaner than peers' — the exact number rots) · delivery = at-least-once + client dedupe (the classic exactly-once illusion, Q-BR-2's honest version) · groups are the scale problem: a 100-member group is a 100x write amplification on one message

## The failure modes that get probed

Group fan-out economics (the write-amplification math) · multi-device (the same message, encrypted per device — key management is the real cost) · offline sync/retention (the queue is a liability with a clock, C.4's rule) · ordering (per-sender sequence, not global)

**Interviews this arms you for:** Q-BR-2, Q-BR-7 (the pub-sub bridge), Q-BR-12 (idempotency at the boundary) · the 'design a chat/messaging system' classic, which remains the most-asked bridge question

**The AI-era twist (say it before they ask):** The AI twist is REAL now, not hypothetical: chat assistants, on-device models for privacy-preserving features, and summarization — and E2E encryption means the server-side AI CANNOT read your backlog; the assistant must be client-side or explicitly trusted. That constraint-vs-AI tension is a staff-level point that almost nobody makes.
