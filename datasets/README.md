> Every dataset in this catalog is real, public, and used (or usable) somewhere in this course's labs. Sizes and access notes are as of late 2026 — always check the source page before relying on a number. **Check each dataset's license before commercial use**; many research datasets are non-commercial.

# Real-World Dataset Catalog

Why a dataset catalog in a system-design course? Because **the dataset is a design constraint**. Its size decides your storage architecture, its label quality decides your evaluation strategy, its license decides what you may ship, and its quirks (imbalance, drift, leakage traps) decide what your system must survive. Every lab in `labs/` draws from this catalog.

## How to choose a dataset (for your own projects)

1. **Match the shape to the problem.** A recommender needs interaction logs (user, item, rating/timestamp) — not a table of "user profiles." Retrieval needs (query, passages, relevance labels). Classification needs labeled rows. Start from the system's data flow, then pick.
2. **Prefer small-but-real over big-but-synthetic.** A 100K-row real dataset with real mess teaches more than a perfect synthetic million. The labs use MovieLens 100K, not MovieLens 32M, for exactly this reason.
3. **Read the quirk notes.** Every card below lists gotchas (class imbalance, train/test leakage by time, PCA-only features, etc.). Interviewers love asking "what's wrong with this dataset?" — the answer is always in the quirks.
4. **Respect the license.** Research-only datasets (MovieLens, Yelp, MS MARCO, most benchmarks) cannot legally power a commercial product. For commercial work, use openly-licensed data (NYC TLC, Common Voice) or your own.

## Master table

| Domain | Datasets | Used in labs |
|---|---|---|
| [Recommendation](./recommendation.md) | MovieLens, Netflix Prize, Amazon Reviews 2023, Yelp, Spotify MPD | a2 |
| [Fraud & anomaly](./fraud-anomaly.md) | ULB Credit Card, IEEE-CIS, PaySim, Elliptic, Sparkov | a3 |
| [Tabular classification](./tabular-classification.md) | UCI Adult, Bank Marketing, Home Credit, HIGGS, Telco Churn | a1, a7 |
| [CTR & advertising](./ctr-ads.md) | Criteo, Avazu, Taobao User Behavior | a4 |
| [Search & retrieval](./search-rank-retrieval.md) | MS MARCO, ANTIQUE, BEIR, FiQA-2018 | a5 |
| [QA & knowledge](./qa-knowledge.md) | SQuAD, Natural Questions, HotpotQA, TriviaQA, FEVER | b2, b4 |
| [Sentiment & NLP](./nlp-sentiment.md) | IMDB, SST-2, Sentiment140, Amazon/Yelp polarity | b6 |
| [Time series & geo](./time-series-geo.md) | NYC TLC, Citi Bike, M5 Walmart, US DOT flights | a6, x1 |
| [Vision](./vision.md) | COCO, Open Images, CIFAR, ImageNet, Flickr8k/30k | b8 |
| [Audio & speech](./audio-speech.md) | LibriSpeech, Common Voice, LJSpeech, ESC-50, RAVDESS | — (S.4 reading) |
| [LLM benchmarks](./benchmarks-eval.md) | MMLU, MTEB, TruthfulQA, GSM8K, HumanEval, Chatbot Arena | b4, b6 |
| [LLM training corpora](./llm-training-corpora.md) | Common Crawl, FineWeb, RedPajama, The Pile, The Stack | reading for B.0 |

## A note on honesty about data

Datasets rot: URLs move, licenses change, files get pulled (the Netflix Prize data was withdrawn from distribution after a privacy lawsuit; The Pile was taken down from official hosting in 2024 after publisher complaints). Every card carries the date its facts were last checked. If a link is dead, open an issue — that's a real lesson about data infrastructure too.
