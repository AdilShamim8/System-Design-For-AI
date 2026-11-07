> Every dataset in this catalog is real, public, and used (or usable) somewhere in this course's labs. Sizes and access notes are as of late 2026 — always check the source page before relying on a number. **Check each dataset's license before commercial use**; many research datasets are non-commercial.

# Recommendation Datasets

The canonical lab here is **MovieLens 100K** — small enough to train in seconds, real enough to have cold-start users, popularity bias, and temporal effects. Everything about the three-stage recommendation pattern (Chapter A.2) can be demonstrated on it.

### MovieLens 100K (GroupLens, 1998)

**What:** 100,000 integer ratings (1–5) from 943 users on 1,682 movies; each user rated at least 20 movies. Ships with user demographics and movie metadata.

**Size:** ~100K ratings, ~1,700 items, ~950 users (~4.5 MB)

**Get it:** https://grouplens.org/datasets/movielens/100k/

**License:** Research/educational use; no commercial redistribution.

**Quirks & gotchas:** Popularity bias (a few blockbusters dominate), 5-point integer scale (no half-stars), timestamps let you build temporal splits — always train on the past, test on the future.

**Used in:** Lab a2 — build candidate generation + ranking end-to-end.

---
### MovieLens 25M / 32M (GroupLens, 2019/2021)

**What:** The same collection grown up: 25M ratings from 162K users on 62K movies (25M version), with tags, links, and genome scores.

**Size:** 25M ratings (~250 MB); 32M version larger

**Get it:** https://grouplens.org/datasets/movielens/

**License:** Research/educational use.

**Quirks & gotchas:** Big enough that naive pandas joins hurt — good for practicing columnar thinking and approximate retrieval, but use the 100K version to learn concepts first.

**Used in:** Optional extension of Lab a2.

---
### Netflix Prize (2006–2009)

**What:** 100,480,507 ratings from 480,189 users on 17,770 movies, 1998–2005. The dataset that created modern recommender research — and its own privacy scandal.

**Size:** ~100M ratings (~600 MB compressed)

**Get it:** Originally from Netflix; **withdrawn from distribution** after an anonymity lawsuit — copies exist but the official source is gone.

**License:** Historic; no official license today.

**Quirks & gotchas:** The $1M winning solution was never fully deployed (see Field Note FN-11) — the canonical story of the model-vs-system gap. Never use for products.

**Used in:** FN-11; reading for A.2.

---
### Amazon Reviews 2023 (McAuley Lab, UCSD)

**What:** The largest public reviews corpus: reviews, ratings, text, and item metadata spanning 1996–2023 across 33 categories.

**Size:** 571M reviews (~tens of GB; category subsets available)

**Get it:** https://amazon-reviews-2023.github.io/ (also on Hugging Face: `McAuley-Lab/Amazon-Reviews-2023`)

**License:** Released for research; check the page for terms.

**Quirks & gotchas:** Duplicate reviews, category imbalance, and time drift (rating norms changed over two decades). The 5-core subsets (each user/item with ≥5 reviews) are the clean starting point.

**Used in:** Alternative for Lab a2 extensions.

---
### Yelp Open Dataset

**What:** Reviews, businesses, users, and check-ins, mostly US/Canada restaurants and services.

**Size:** ~7M reviews, ~150K businesses (a few GB; subset JSON files available)

**Get it:** https://business.yelp.com/data/resources/open-dataset/

**License:** Academic use only.

**Quirks & gotchas:** Photos and tip text are noisy; strong city skew (a handful of metros dominate) — a good lesson in geographic bias.

**Used in:** Capstone cap2 alternative corpus.

---
### Spotify Million Playlist Dataset (2018)

**What:** 1,000,000 playlists created by real Spotify users, with track sequences and metadata, released for the RecSys Challenge 2018.

**Size:** 1M playlists, ~66M track placements (~300 GB uncompressed; sampled subsets float around)

**Get it:** https://www.aicrowd.com/challenges/spotify-million-playlist-dataset-challenge

**License:** Research-only.

**Quirks & gotchas:** Track IDs are anonymized; auto-generated playlists (e.g., 'Starred') pollute the signal; the 'next track' task is the well-posed version of the challenge.

**Used in:** Reading for A.2; interview-prep Mock 2 background.

---
