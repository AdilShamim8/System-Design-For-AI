# 08 — The Rate Limiter (the most-asked classic, period)

**The system in three sentences.** 'Design a rate limiter' opens more interviews than any other question, and the answer is one page: token bucket (burst-friendly, cheap) or sliding window (strict, fair), distributed state in Redis with atomic check-and-decrement, and honest 429s with Retry-After. The AI-era version — the version this course grades you on — makes the limit two-dimensional: requests AND tokens, because LLM cost scales with tokens, not calls.

## The spine (draw it in 60 seconds)

```
request → gateway middleware → key = (user, model-tier) → bucket(s):
   [requests/min: token bucket]  +  [tokens/day: counter+quota]
   atomic Lua check-and-decrement in Redis; local hot-key cache
   over limit → 429 + Retry-After + remaining-quota headers (honest clients back off)
```

## The numbers to carry

Token bucket vs sliding window vs leaky bucket — know all three, recommend bucket with a reason · Q-BR-1: the (user, model-tier) key and the two-dimensional limit are the AI-era additions to volunteer · the noisy-neighbor fix (per-tenant concurrency caps, cap2) · Redis atomic ops (Lua) is the distributed-state answer to name

## The failure modes that get probed

Distributed synchronization (atomicity — the Lua/transaction answer) · hot keys (local cache + sharded counters) · fairness under load (per-tenant caps vs global starvation) · YOUR OWN gateway's budget vs the provider's (queue and smooth, Q-BR-11)

**Interviews this arms you for:** Q-BR-1, Mock 4 (the LLM gateway), the bridge bank's opener · the single highest-frequency question in the format

**The AI-era twist (say it before they ask):** The classic answered 'how many calls'; the AI version answers 'how many TOKENS' — and adds the fail-open question (a limiter outage blocks everything: fail-open vs fail-closed is the senior follow-up nobody preps).
