# 09 — The Twitter/X Timeline (the read/write seesaw)

**The system in three sentences.** 500M users, celebrity accounts with 100M+ followers, and a 200ms timeline load: the canonical fan-out-on-write system, and the canonical lesson in when it breaks (the celebrity write storm) and how hybrid designs absorb it. Ranked vs reverse-chronological is the product tension the interviewer probes — and the answer 'both, by mode' (Following = chrono, For You = ranked) is the modern resolution.

## The spine (draw it in 60 seconds)

```
tweet → fan-out to followers' timeline caches (Redis-class) — the write path
read: timeline cache hit → serve; miss/ranked mode → candidate fetch → ranker
celebrities: precomputed at read (the hybrid), never fanned out per post
```

## The numbers to carry

Fan-out-on-write vs on-read: the tradeoff table (write amplification vs read latency) — say it as a table, they'll hear the systems thinking · the 100M-follower account is the canonical breaker (write storm) · hybrid = the resolution · cache hit-rate IS the latency story (timeline caches make the 200ms possible)

## The failure modes that get probed

Celebrity write storms (the hybrid) · cache invalidation on deletes (the hardest correctness problem in the design — say it before asked) · ranked-timeline cold starts (the a2 family) · multi-device backfill (the read path after days offline)

**Interviews this arms you for:** Q-BR-3 (feed bridge), Mock 2 · the second-most-asked classic after rate limiting

**The AI-era twist (say it before they ask):** Same spine, new layer: the 'For You' path is now a learned ranker with the full feedback-loop machinery (FN-02's home turf), and the integrity layer (spam, bots, community notes) is the part interviewers actually care about in 2026 — mention community notes as adversarial fact-checking and you've made the design current.
