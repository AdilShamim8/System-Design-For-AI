> Every dataset in this catalog is real, public, and used (or usable) somewhere in this course's labs. Sizes and access notes are as of late 2026 — always check the source page before relying on a number. **Check each dataset's license before commercial use**; many research datasets are non-commercial.

# Search & Retrieval Datasets

Chapter A.3 (search ranking) and Labs b2–b4 (RAG) live on these. Retrieval datasets share a shape: a corpus of passages, a set of queries, and relevance judgments.

### MS MARCO Passage Ranking (Microsoft, 2016–)

**What:** Real Bing queries with human-relevant passages. Passage version: ~8.8M passages, ~500K training queries with relevance labels; query variation is real (typos, ambiguity, shorthand).

**Size:** ~8.8M passages; ~500K queries (a few GB)

**Get it:** https://microsoft.github.io/msmarco/ (also on Hugging Face: `ms_marco`)

**License:** Research (Microsoft).

**Quirks & gotchas:** Labels are sparse (often only 1 judged passage per query), so offline metrics undercount. The standard small-scale workflow: take the top-1000-retrieved subset (provided) and rerank it — that's exactly the two-stage pattern of Chapter B.5.

**Used in:** Lab a5 (ranking) and Mock 6 background.

---
### ANTIQUE (2019)

**What:** Non-factoid question retrieval: ~2,600 Yahoo Answers questions judged against ~34K answer passages. The classic open small dataset for learning-to-rank on *subjective* questions.

**Size:** ~2,600 queries, ~34K passages (small)

**Get it:** https://github.com/CSIPranay/ANTIQUE

**License:** Open (research).

**Quirks & gotchas:** Small enough to run exhaustive experiments in seconds; relevance grades are graded (0–3), so you can practice NDCG vs binary MAP honestly.

**Used in:** Lab a5 — search ranking.

---
### BEIR (2021)

**What:** A zero-shot retrieval benchmark: 18 diverse datasets (science, finance, COVID, StackExchange, Wikipedia…) with a unified evaluation harness, used to prove BM25 still beats many neural retrievers out-of-domain.

**Size:** 18 tasks; ~100K–15M docs per task (harness runs per-task)

**Get it:** https://github.com/beir-cellar/beir

**License:** Open (MIT for the harness; per-dataset licenses vary).

**Quirks & gotchas:** The lesson every RAG builder needs: a retriever that wins on one corpus can lose on yours. Always benchmark on *your* domain — BEIR is how you say that with evidence.

**Used in:** Lab b2/b3 reading; Mock 7 background.

---
### FiQA-2018 (2018)

**What:** Financial opinion QA from the FIQA workshop: ~6.6K questions paired against a corpus of ~57K financial-advice passages (StackExchange/Reddit finance communities).

**Size:** ~6.6K queries, ~57K passages

**Get it:** https://sites.google.com/view/fiqa/home (via BEIR for the easiest route)

**License:** Open (via BEIR packaging).

**Quirks & gotchas:** A standard BEIR task and a good demo corpus for domain-specific RAG (finance jargon, ambiguous questions). Sparse judgments; expect noisy evals at small sample sizes.

**Used in:** Lab b3 alternative corpus.

---
