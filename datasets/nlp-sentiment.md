> Every dataset in this catalog is real, public, and used (or usable) somewhere in this course's labs. Sizes and access notes are as of late 2026 — always check the source page before relying on a number. **Check each dataset's license before commercial use**; many research datasets are non-commercial.

# Sentiment & Classification NLP Datasets

Sentiment is the 'hello world' of production NLP — and still a common interview question ("how would you build review sentiment for a marketplace?"). These datasets let you practice the whole lifecycle cheaply.

### IMDB Movie Reviews (2011)

**What:** 50,000 polarized movie reviews (25K train / 25K test), labeled positive/negative. No more than 30 reviews per movie to avoid leakage.

**Size:** 50,000 reviews (~80 MB)

**Get it:** https://ai.stanford.edu/~amaas/data/sentiment/ (Hugging Face: `imdb`)

**License:** Open for research.

**Quirks & gotchas:** Long reviews, sarcasm, and comparative sentences make it harder than accuracy numbers suggest. Train/test are disjoint by movie — a nice built-in example of leakage-aware design.

**Used in:** Lab b6 (fine-tune vs RAG decision).

---
### SST-2 (Stanford Sentiment Treebank, GLUE)

**What:** Sentence-level binary sentiment from movie review phrases; ~67K training sentences in the GLUE split, with phrase-level parse annotations in the original.

**Size:** ~67K sentences (small)

**Get it:** https://dl.fbaipublicfiles.com/glue/data/SST-2.zip (via https://gluebenchmark.com)

**License:** Open for research.

**Quirks & gotchas:** Short sentences → trains in minutes on CPU; the go-to dataset for a first fine-tuning loop (Lab b6) and for embedding-model baselines.

**Used in:** Lab b6.

---
### Sentiment140 (2009)

**What:** 1.6M tweets labeled automatically by emoticon (distant supervision): target polarity from :) / :( patterns.

**Size:** 1.6M tweets (~230 MB)

**Get it:** http://help.sentiment140.com/for-students

**License:** Open for research.

**Quirks & gotchas:** Distant supervision = noisy labels (sarcasm breaks it). Twitter conventions (#hashtags, @replies, URLs) need their own preprocessing — realistic text-muck, unlike SST-2.

**Used in:** Reading for X.0 (data pipelines).

---
### Amazon Polarity / Yelp Polarity (Zhang et al. 2015)

**What:** Amazon polarity: 3.6M train / 400K test review-score-derived labels. Yelp polarity: 560K train / 38K test. Built for character-level CNN-era scale experiments; still the standard 'big but simple' text classification pairs.

**Size:** 3.6M + 560K training rows (~600 MB / ~100 MB)

**Get it:** https://amazon-reviews-2023.github.io/ and https://www.yelp.com/dataset (both on Hugging Face: `amazon_polarity`, `yelp_polarity`)

**License:** Research (Amazon); academic (Yelp).

**Quirks & gotchas:** Labels derived from scores (1–2 stars = negative, 4–5 = positive) with 3-star reviews removed — a real-world labeling decision you should be able to critique in an interview.

**Used in:** Lab b6 scale extension.

---
