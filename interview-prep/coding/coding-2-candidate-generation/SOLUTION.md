# Coding 2 — Worked Solution

*(Attempt the problem first. The value is the delta between your answer and this one.)*

The screen is testing whether you know that candidate generation is a *systems* problem — the math is trivial, the precompute-vs-online split is the answer.

```python
import numpy as np
from scipy.sparse import csr_matrix

R = ratings.pivot(index="movieId", columns="userId", values="rating").fillna(0)
M = csr_matrix(R.values)                    # items × users

# 1. Popularity — with the exclusion rule (never re-recommend a rated item):
pop = np.asarray(M.sum(axis=1)).ravel()     # popularity per item

# 2. Item-item CF, PRECOMPUTED (the production answer):
#    normalize rows, then cosine similarity — S is items × items, build it once
#    offline (this is the sentence the interviewer wants: "S is offline; the
#    online path is a lookup")
from sklearn.preprocessing import normalize
Mn = normalize(M)
S = (Mn @ Mn.T).toarray()                   # 9,742² floats ≈ 380 MB — fine for small,
np.fill_diagonal(S, 0)                      # for real catalogs: keep top-K per row, sparse

def candidates(user, K=50):
    seen = user_rated_items(user)
    seeds = user_top_rated(user, n=5)       # the 5 items they liked most
    scores = S[seeds].sum(axis=0)           # candidate scoring = table lookups
    scores[seen] = -1                       # exclusion: the classic bug is forgetting it
    cf_pool = top_k(scores, K)
    pop_pool = top_k_excluding(pop, seen, K)  # fallback for cold users
    return dedupe_blend(cf_pool, pop_pool, K) # union, CF-weighted

# 3. Recall@50 on a time-split holdout: what fraction of the user's holdout
#    items appear in the 50 candidates? That's the metric the ranker inherits.
```

The trap in this screen: computing cosine similarity per-request (seconds — you blew the 50ms budget in the first line). The winning narration: "similarities are an offline artifact; the online path is gather-seeds → lookup → merge — single-digit milliseconds.

## Complexity and cost

Precompute: 9.7K items → S is ~380 MB dense (say this out loud, it's a real constraint); at 100K+ items, store top-K neighbors per item instead — 100 × 100K × 8 B ≈ 80 MB. Online: 5 seed rows of S + a merge — sub-10ms including Python overhead.

## Self-check

- [ ] Popularity baseline reported (not skipped — it's the control)
- [ ] CF source precomputed, not computed per-request
- [ ] Already-rated exclusion correct
- [ ] Recall@50 computed on a *time* split
- [ ] Precompute vs online split stated explicitly
