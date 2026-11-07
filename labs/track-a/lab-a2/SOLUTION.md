# Lab a2 — Worked Solution and What the Numbers Mean

## Expected results (our runs; your numbers will wobble by a few points — that's fine, the *shape* is the lesson)

| System | Precision@10 | Recall@10 | Catalog coverage |
|---|---|---|---|
| Popularity (min-support) | 0.02–0.05 | 0.02–0.04 | 0.4–1.5% (same 10 movies for everyone) |
| CF candidates, sim-scored | 0.03–0.07 | 0.03–0.06 | 15–40% |
| Full funnel (blend + ranker) | 0.03–0.08 | 0.03–0.07 | 25–60% |

Read the precision numbers slowly. They look tiny; they are *normal*. Held-out likes are hard to predict: a user's future taste is mostly unexplained by their past — and the evaluation counts a miss even when the recommended movie is great but the user just never rated it. This is exactly why **offline metrics are a rumor about online truth** (Chapter X.2): the online question is not "did we predict their rating" but "did they click, watch, and come back."

## The five lessons hidden in those numbers

1. **Popularity is strong on precision, catastrophic on coverage.** Same 10 movies for every user: great precision for heavy users, a dead feed for everyone else, and a feedback loop that buries the long tail (A.2's popularity-spiral, now in your own numbers).
2. **The ranker mostly learns popularity** (`item_mean` dominates the weights). Feature engineering *is* recommender design: the moment you add genre affinity and freshness, diversity improves and precision barely drops. That trade is the job.
3. **Time-split ≠ random-split.** If you evaluate both ways, random-split numbers will be 1.5–3× higher. That gap is pure leakage, and the interviewer version of this question ("how would you split an ephemeral dataset?") is answered with *this lab*, not theory.
4. **Negatives matter as much as positives.** We sampled 5 random unrated movies per positive. Sample 50 instead and the ranker learns the data is 98% negative and gets conservative; sample 1 and it over-recommends. This knob is invisible in accuracy metrics and obvious in top-K ones.
5. **Cold-start is a funnel-design problem, not a model problem.** The CF source dies for users with < 3 likes; genre source carries them. No ranker fixes an empty candidate pool — candidate-source *blending* is the fix, which is why production recommenders blend dozens of sources.

## Common mistakes

- **Recommending movies the user already rated.** Filter `user_id`'s rated items out of every candidate list — the most common bug, and it inflates precision (you "predict" known likes). If your precision is > 0.15, you almost certainly have this bug.
- **Fitting the ranker on test-period data.** All item/user stats must come from the *train* period only — otherwise the features whisper the test labels (point-in-time correctness, Chapter A.1's law).
- **Cosine similarity on raw ratings instead of likes.** Disliked movies (1–2 stars) then count as "similar items" — raw-rating item-item similarity recommends things users *hate*. Binary likes are the honest beginner choice.

## Interview lines this lab earns you

- "I quantified popularity bias in MovieLens: top decile of movies takes ~half the ratings, which is why my popularity baseline beat my fancy model on precision and lost catastrophically on coverage."
- "My offline evaluation uses time-split, per-user top-K metrics, and catalog coverage — and I still don't trust it more than an A/B test, because my own numbers showed rank order flipping between offline and simulated-online."
