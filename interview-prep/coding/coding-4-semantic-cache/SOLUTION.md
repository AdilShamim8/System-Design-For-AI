# Coding 4 — Worked Solution

*(Attempt the problem first. The value is the delta between your answer and this one.)*

The screen's real question is *where the threshold lives and who pays for a miss*. The code is short; the policy is the answer.

```python
from sentence_transformers import SentenceTransformer
import numpy as np

enc = SentenceTransformer("all-MiniLM-L6-v2")

class SemanticCache:
    def __init__(self, tau=0.88):
        self.tau = tau
        self.exact = {}                    # layer 1: normalized string
        self.embs, self.answers = [], []   # layer 2: semantic

    def get(self, q):
        # Layer 1 first — exact hits are free and never wrong
        key = " ".join(q.lower().split())
        if key in self.exact:
            return self.exact[key], "exact"
        if not self.embs:
            return None, "miss"
        e = enc.encode(q, normalize_embeddings=True)
        sims = np.asarray(self.embs) @ e
        i = int(np.argmax(sims))
        if sims[i] >= self.tau:            # THE decision — everything else is plumbing
            return self.answers[i], "semantic"
        return None, "miss"

    def put(self, q, a):
        self.exact[" ".join(q.lower().split())] = a
        self.embs.append(enc.encode(q, normalize_embeddings=True))
        self.answers.append(a)

# The sweep: for tau in [0.75, 0.80, ..., 0.95]:
#   hit_rate = hits / queries; wrong_hits = hits_where_answered_wrong / hits
# Plot both. The curve's knee on support-class traffic lands ~0.85–0.92 (b5).
```

The narration that scores: "a wrong hit costs trust, a miss costs cents — so τ errs high, the exact layer catches the free wins, and the semantic layer only answers when it's *sure*. And the flush is keyed on corpus version: a cache that outlives its corpus is a stale-answer machine (Q-BR-9's citation-freshness point)."
The two hardening steps: (1) corpus-version flush — cache keys carry the version; re-embedding a doc invalidates its derived answers; (2) stampede protection — coalesce concurrent misses on the same query (one LLM call, many waiters).

## Complexity and cost

Embedding: ~10–30ms per query on CPU (this is the cache's own latency floor — say so). At scale, the list-scan becomes ANN (b3's territory), but the policy (τ, layers, flush) survives unchanged.

## Self-check

- [ ] Exact layer implemented first
- [ ] τ sweep with both rates measured separately
- [ ] Operating τ defended with the trust asymmetry
- [ ] Corpus-version flush named
- [ ] Stampede protection named
