# Lab a2 — Build a Recommendation Engine

| | |
|---|---|
| **Prerequisites** | Chapter A.2 (the three-stage pattern) · Lab a1 |
| **Dataset** | MovieLens 100K — 100,000 real ratings, 943 users, 1,682 movies ([card](../../datasets/recommendation.md)) |
| **You will build** | Candidate generation → ranking → offline evaluation, the architecture behind every "For You" feed |
| **Est. time** | 3–4 hours |
| **Hardware** | Laptop CPU. No GPU. No API key. |

**The story.** Every recommender you have ever used — Netflix, Spotify, YouTube — is not one model. It is a *funnel*: cheap candidate generation pulls a few thousand items from millions, an expensive ranker orders them, and business rules get the last word (Chapter A.2). Today you build the whole funnel at laptop scale, and you discover the two truths of the field: **popularity is a devastatingly strong baseline** and **offline metrics are only a rumor about online results.**

---

## Part 0 — Get the data (10 min)

```bash
cd labs/data
wget https://files.grouplens.org/datasets/movielens/ml-100k.zip
unzip ml-100k.zip
```

Load and look:

```python
import pandas as pd

ratings = pd.read_csv(
    "ml-100k/u.data", sep="\t",
    names=["user_id", "item_id", "rating", "timestamp"],
)
movies = pd.read_csv(
    "ml-100k/u.item", sep="|", encoding="latin-1",
    names=["item_id", "title", "release", "video_release", "url"] + [f"g{i}" for i in range(19)],
    usecols=["item_id", "title"],
)
print(ratings.shape, ratings.rating.describe())
```

**Checkpoint 0 (know your data):** Plot the rating distribution and the ratings-per-movie distribution (a histogram with log y-axis). What fraction of all ratings went to the top 10% of movies? (We got ~50% — your number may differ slightly; write yours down. That number is *popularity bias*, and it will explain half of what happens next.)

---

## Part 1 — The straw man: top-10 popular (15 min)

```python
def popularity_recommend(k=10):
    top = (ratings.groupby("item_id").rating.mean()
           .loc[lambda s: ratings.item_id.value_counts()[s.index] >= 50]  # min support
           .sort_values(ascending=False).head(k))
    return top.index.tolist()

print(movies.set_index("item_id").loc[popularity_recommend(), "title"])
```

A recommendation feed with **zero personalization**. Everyone on earth gets the same list. Before you sneer: this baseline ships in real products (the "Popular right now" row) and is the hardest thing to beat on offline metrics. Keep it — it's your control arm in Part 4.

---

## Part 2 — Candidate generation: two sources, blended (45 min)

The funnel's first stage must be *cheap* and *recall-oriented*: cast a wide net from ~1,700 items down to ~100 candidates. Build two generators:

**(a) Item-item similarity ("people who liked X also liked Y").** Build a binary like-matrix (rating ≥ 4 = like), then cosine similarity between item columns:

```python
from scipy.sparse import csr_matrix
from sklearn.metrics.pairwise import cosine_similarity

ratings["like"] = (ratings.rating >= 4).astype(int)
likes = ratings[ratings.like == 1]
M = csr_matrix((likes.like, (likes.user_id, likes.item_id)))
item_sim = cosine_similarity(M.T)                 # 1682 x 1682 — fine at this scale
# zero-out self-similarity so we don't recommend a movie to itself
import numpy as np
np.fill_diagonal(item_sim, 0)

def similar_candidates(item_id, k=20):
    return item_sim[item_id].argsort()[::-1][:k]

def cf_candidates(user_id, k=100):
    user_likes = likes[likes.user_id == user_id].sort_values("timestamp").tail(5)
    pool = []
    for it in user_likes.item_id:
        pool += similar_candidates(it, k=25).tolist()
    # dedupe preserving order
    seen, out = set(), []
    for it in pool:
        if it not in seen:
            seen.add(it); out.append(it)
    return out[:k]
```

**(b) Genre-based candidates** for users with thin history: from `u.item`, parse the 19 genre flags (columns 5–23 of the raw file), take the user's top genres by liked count, and add the most-liked movies in those genres the user hasn't rated.

**Blend:** interleave (a) and (b) 2:1, cap at 100. Blending multiple candidate sources is not a hack — it's exactly what Chapter A.2 says production systems do (YouTube's paper blends dozens of sources).

**Checkpoint 2:** For user 196 (`ratings[ratings.user_id==196]` — a heavy user), print their 5 most recent likes and your top-10 CF candidates. Would they be happy with this list? Find one user where CF fails badly (hint: users with ≤ 3 likes) and note *why* — that's the cold-start problem, and it's why source (b) exists.

---

## Part 3 — The ranker (45 min)

Candidates are unordered; the ranker orders them with a *pointwise* model: score each (user, item) pair with features, sort by score.

Build a training set: positives = likes in the train split (Part 4 defines the split); negatives = 5 random unrated movies per positive (sampled per user). Features per (user, item):

```python
def make_features(df):   # df: rows of (user_id, item_id, label)
    item_stats = ratings.groupby("item_id").agg(
        item_mean=("rating", "mean"), item_n=("rating", "count"))
    user_stats = ratings.groupby("user_id").agg(
        user_mean=("rating", "mean"), user_n=("rating", "count"))
    out = df.join(item_stats, on="item_id").join(user_stats, on="user_id")
    # genre affinity: fraction of the user's likes in this movie's genres
    # (compute from u.item genre flags + user's history — left as the lab's puzzle)
    return out[["item_mean", "item_n", "user_mean", "user_n"]].fillna(0)
```

Train `LogisticRegression` (or LightGBM if you want trees) on these features. The design point: **the ranker never sees user IDs or item IDs** — it sees *features*, so it can score a movie it has never been trained on. That property is called generalization, and it is the entire reason candidates from *any* source can flow through *one* ranker.

**Checkpoint 3:** Sort user 196's 100 candidates by ranker score. Did the order change vs. Part 2? Which feature is doing the most work? (Check `model.coef_` — with 4 features you can read the answer straight off the weights. It will probably be `item_mean` — popularity again. Note that in your journal; we'll fight it in Part 4.)

---

## Part 4 — Evaluate like it's production (45 min)

Two rules from Chapter A.2 you must implement, not just read:

**Rule 1 — split by time, not by row.** Random splits leak the future into the past (you'd "predict" a rating using later ratings). Split on `timestamp`:

```python
cut = ratings.timestamp.quantile(0.8)
train, test = ratings[ratings.timestamp <= cut], ratings[ratings.timestamp > cut]
```

**Rule 2 — measure what the user sees: top-K.** Accuracy on random negatives is meaningless; measure Precision@10 and Recall@10 against the user's *held-out likes*, plus **catalog coverage** (what % of the catalog ever appears in top-10s):

```python
def precision_at_k(recs, truth, k=10):
    return len(set(recs[:k]) & truth) / k

def recall_at_k(recs, truth, k=10):
    return len(set(recs[:k]) & truth) / max(len(truth), 1)
```

Evaluate three systems on the same test users: **(1)** popularity, **(2)** CF-only candidates ranked by similarity score, **(3)** your full funnel. Also compute coverage for each.

**Checkpoint 4 (the lab's payoff):** You will likely find: popularity wins or nearly ties on precision; CF wins on *personalized* metrics per active user; the full funnel wins coverage and cold-start users. None of these statements is true for every user — and that is precisely why products A/B test (Chapter X.2) instead of trusting offline metrics. Write your three-way comparison as one clean table in your journal.

---

## Explain it back

1. Why is the recommender a *funnel* instead of one model that scores all 1,682 movies? What changes at 1.6 million movies? At 160 million?
2. Why did we split by timestamp?
3. Your offline winner lost the A/B test. Give three hypotheses ranked by likelihood.
4. What is catalog coverage, and why would a business person care about it as much as precision?

## Extensions

- **Matrix factorization:** `TruncatedSVD` on the like-matrix's user rows (`M @ Vt` gives user and item embeddings in the same space). Use cosine distance in that space as candidate source (c). Did offline metrics move? Did coverage?
- **Popularity de-biasing:** multiply the ranker score by `1/log(1 + item_n)` and watch precision-vs-coverage trade. You just implemented a (crude) exposure-fairness lever.
- **The 300ms budget:** time each stage for one user (candidates: X ms, features: Y ms, scoring: Z ms). At MovieLens scale everything is instant — but write down which stage dominates, then explain what it would dominate at Netflix scale (hint: it's the candidate stage's *index lookups*, which is why ANN indexes from Chapter B.3 exist).

## What you can now claim in an interview

"I built a three-stage recommender — blended candidate generation, a feature-based pointwise ranker, time-split top-K evaluation with coverage — and I can explain why offline wins don't guarantee A/B wins, with numbers from my own lab."
