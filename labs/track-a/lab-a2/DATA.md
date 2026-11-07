# Lab a2 — Dataset: MovieLens 100K

Full card in [`datasets/recommendation.md`](../../../datasets/recommendation.md). Lab-specific notes:

**Getting it:** `wget https://files.grouplens.org/datasets/movielens/ml-100k.zip` (~5 MB). Unzip into `labs/data/ml-100k/`.

**Files you'll use:**

- `u.data` — 100,000 lines: `user_id, item_id, rating, timestamp` (tab-separated). *Ratings, with timestamps* — the timestamps are what make an honest temporal split possible.
- `u.item` — movie metadata: id, title, release date, and 19 binary genre flags (columns 6–24, `|`-separated file, `latin-1` encoding — the 90s called).
- `u.user` — demographics (age, gender, occupation, zip). Not used in the core lab; a good extension for fairness conversations.

**Shape:** 943 users (each with ≥ 20 ratings — GroupLens pre-filtered), 1,682 movies, ratings 1–5, collected 1997–1998.

**Known quirks you will hit:**

- **Popularity bias:** ~50% of ratings land on the top decile of movies. Your popularity baseline will be embarrassingly good. Real products fight this; your lab quantifies it.
- **Integer ratings, forced minimum:** every user rated ≥ 20 movies — the lightest cold-start you will ever see. Real systems face users with zero history (that's the genre-based source's job).
- **The genre flags are 1998 genres** — no "thriller-comedy" hybrids. Genre affinity is therefore coarse; your ranker's job is to add signal on top, not to make genres sing.
- Timestamps are Unix seconds; the last 20% by time is roughly the dataset's final months.

**License:** research/educational use only — you may not ship this data in a product. For a commercial recommender prototype, swap in your own event logs or the Yelp Open Dataset (academic) — never MovieLens.
