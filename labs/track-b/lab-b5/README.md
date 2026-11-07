# Lab b5 — Semantic Caching and Cost Control

| | |
|---|---|
| **Prerequisites** | Chapter B.6 (picking the brain you can afford) · Chapter X.4 (the bill) · Labs b1, b2 |
| **Dataset** | SQuAD questions (reused) — a realistic *query distribution* to cache against |
| **You will build** | A semantic cache with tunable similarity threshold, then the economics dashboard that decides whether it ships |
| **Est. time** | 2 hours |
| **Cost** | Embedding local & free; generation only for misses (< $0.10) |

**The story.** Your RAG service gets 10,000 questions a day. Tonight you look at the logs and find that 3,200 of them are the *same question* — not byte-identical ("How do I reset my password?" vs "how do I reset my password?" vs "I forgot my password, how reset?") but *semantically* the same. Every one of them paid full price for a fresh LLM call. A **semantic cache** — store the embedding of every answered question; new questions within a similarity threshold get the stored answer free — converts that repetition into margin. Today you build it, tune its single dangerous knob, and compute exactly when it pays.

---

## Part 1 — Exact-match caching: the warm-up (15 min)

```python
import hashlib

class ExactCache:
    def __init__(self):
        self.store = {}
    def key(self, question): return hashlib.md5(question.strip().lower().encode()).hexdigest()
    def get(self, question): return self.store.get(self.key(question))
    def put(self, question, answer): self.store[self.key(question)] = answer
```

Run SQuAD's 150 questions from b2 through your pipeline with this cache, twice. Hit rate on the second pass: 100%. Hit rate on *new* questions: ~0%. Real users don't repeat byte-for-byte — exact caching is a decent free floor (normalize case/whitespace first) and a rounding error on real traffic. Now the real thing.

---

## Part 2 — The semantic cache (40 min)

```python
from sentence_transformers import SentenceTransformer
import numpy as np

enc = SentenceTransformer("all-MiniLM-L6-v2")

class SemanticCache:
    def __init__(self, threshold=0.92):
        self.threshold = threshold          # cosine similarity to treat as "same question"
        self.keys, self.answers = [], []
    def get(self, question):
        if not self.keys: return None
        q = enc.encode([question], normalize_embeddings=True)
        sims = (q @ np.array(self.keys).T)[0] if self.keys else []
        best = sims.argmax()
        if sims[best] >= self.threshold:
            return self.answers[best], float(sims[best])
        return None
    def put(self, question, answer):
        self.keys.append(enc.encode([question], normalize_embeddings=True)[0])
        self.answers.append(answer)
```

**Checkpoint 2 — the knob:** With threshold 0.99, it's an exact cache (no false hits, no true hits). With 0.70, "What is the capital of France?" returns the answer for "What is the capital of Germany?" — catastrophic. Sweep 0.75 / 0.85 / 0.92 / 0.97 on 50 SQuAD questions, and for each threshold record: **hit rate** and **wrong-hit rate** (a hit whose cached question actually asks something different — hand-check 10 hits per threshold). Write the tradeoff line: "threshold [x] gives [y]% hit rate at [z]% wrong hits — acceptable for [product], not for [product]."

> **The wrong-hit asymmetry:** A cache miss costs money; a wrong hit costs *trust*. In a support bot, one confidently wrong cached answer can cost a customer (FN-04 again). The threshold is a business decision wearing a cosine costume — same shape as Lab a3's fraud threshold, different domain.

---

## Part 3 — The economics: when does this ship? (30 min)

Build the dashboard (b1's cost functions + your measurements):

```python
def cache_economics(n_daily, hit_rate, cost_full, cost_cache_hit,
                    embed_cost_per_q=0.0000004):    # ~30 tokens x $0.02/1M (embedding)
    served_from_cache = n_daily * hit_rate
    cost_no_cache  = n_daily * cost_full
    cost_with_cache = (n_daily * (1 - hit_rate) * cost_full
                       + served_from_cache * cost_cache_hit
                       + n_daily * embed_cost_per_q)
    return {"monthly_no_cache": cost_no_cache * 30,
            "monthly_with_cache": cost_with_cache * 30,
            "saving_pct": 100 * (1 - cost_with_cache / cost_no_cache)}
```

Using your b1 ChatDocs numbers ($0.015/req at mid tier) and your Part-2 hit rates:

**Checkpoint 3:** Fill the table:

| Threshold | Hit rate | Wrong-hit rate | Monthly cost (10K req/day, mid tier) | Saving |
|---|---|---|---|---|
| no cache | — | — | $4,500 | — |
| 0.97 | | | | |
| 0.92 | | | | |
| 0.85 | | | | |

Then two design caveats to write down: (a) **cache invalidation** — your docs changed; every cached answer built on stale chunks is now wrong *and* instant. The fix: version the cache by corpus hash (bump = flush). (b) **Cache-stampede** — a viral question with an empty cache means 5,000 simultaneous misses; the fix is request coalescing (one flight computes, others wait). Name both in your journal; they are the two interview follow-ups to "we added a semantic cache."

---

## Part 4 — The production shape (15 min)

Your in-memory cache dies with the process and lives on one machine. Sketch the production version on paper (this is the system-design deliverable):

1. Where does the cache live? (Redis with vector search, or your vector DB as a sidecar collection, or the LLM gateway's in-process LRU + shared tier)
2. What's the cache key? (question embedding + corpus version + model version + prompt template hash)
3. What do you log on every lookup? (threshold, best-sim, hit/miss, answer id) — because the dashboard that tunes the threshold is built from *these* logs, and a threshold nobody re-tunes is a threshold that quietly rots as query distribution drifts (a7, in cache clothing).
4. TTLs and eviction: which answers expire? (Everything, when corpus changes. Individually, when their source chunks change — that's CDC territory, Chapter X.0.)

**Checkpoint 4:** Draw the request path: client → gateway → cache lookup (embed + ANN) → hit? return : full RAG → store. Annotate latency for each hop. Your cache hit path should be ~50–100 ms (embedding + ANN) vs. ~1.5–4 s (full RAG). **The cache isn't just a cost tool — it's your fastest tier.** That dual identity is why gateways put it first.

---

## Explain it back

1. Why does the similarity threshold decide between "cost tool" and "liability machine"?
2. Your docs updated at 2AM. What does every cached answer built on them become, and what's the fix?
3. Cache hit path vs. full RAG path — latencies and why the difference is structural, not incidental.
4. Why is exact-match normalization still worth having *underneath* the semantic layer?

## Extensions

- **Query clustering first:** cluster a day of logs (k-means on embeddings), count cluster sizes — the top-20 clusters are your *actual* FAQ. This is the data-driven way to build "suggested questions" and to decide a cache is worth it at all (if the top 20 clusters are 2% of traffic, don't build a cache; build a better deflection page).
- **Persistent cache with eviction:** back it with SQLite and add an LRU (Python's `functools.lru_cache` won't do — keys are vectors; implement size-bounded eviction by recency). Now it survives restarts; measure cold-start vs. warm hit rates.
- **Negative caching:** cache the *refusal* for out-of-corpus questions too (b2 Part 5's failures repeat as often as the successes). What's different about invalidating negative answers?

## What you can now claim in an interview

"I built a semantic cache and tuned its threshold against both hit rate and wrong-hit rate — because a miss costs money but a wrong hit costs trust. I can compute the break-even, name the two failure modes teams forget (invalidation on corpus change, stampede on cold cache), and I know the cache is also the fastest serving tier, which is why it sits first in the gateway."
