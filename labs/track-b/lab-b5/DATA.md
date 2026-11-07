# Lab b5 — Data notes: SQuAD questions as a query distribution

Reuses Lab b2's SQuAD validation questions — but in a new role: not as labeled QA, as a **query stream** to cache against. That role shift is the realistic one: caches are designed against *traffic*, not against test sets.

**The distribution trick (do this — it makes the lab honest):** SQuAD questions are near-unique, so a raw pass gives you a ~0% hit rate and teaches nothing. Simulate real traffic by sampling with repetition and paraphrase:

```python
import numpy as np
stream = np.random.choice(questions, size=500, p=make_popularity_weights(questions))
```

- **Zipf weights** (a few questions dominate) — realistic for support traffic. Expect hit rates that make the cache obviously worth it.
- **Uniform sampling** — worst case for caches (no repetition). Expect near-zero hits at high thresholds; the cache isn't free, it's *conditional*.

Running both distributions and comparing is the point: **a cache's value is a property of the traffic, not the code.** Same cache, Zipf → ship it; uniform → skip it. Teams that don't model traffic before building caches build infrastructure for traffic they don't have.

**Calibration numbers:**

- MiniLM cosine between paraphrases of the same question: ≈ 0.85–0.95.
- Between *different but related* questions (same topic, different ask): ≈ 0.65–0.80.
- Between unrelated questions: < 0.5.
- So the operating threshold window is ~0.85–0.95 — narrow, and embedding-model-specific. A different embedding model moves the window: **re-tune the threshold when you change the embedder** (a silent migration bug teams actually hit).

**License:** as b2 (CC BY-SA 4.0).
