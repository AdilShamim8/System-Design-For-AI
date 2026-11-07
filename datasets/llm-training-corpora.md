> Every dataset in this catalog is real, public, and used (or usable) somewhere in this course's labs. Sizes and access notes are as of late 2026 — always check the source page before relying on a number. **Check each dataset's license before commercial use**; many research datasets are non-commercial.

# LLM Training Corpora (Reference)

You will not train a foundation model in this course, but Chapter B.0's mental model — "the box that predicts the next word" — is grounded in these corpora. Knowing what's in the training data explains most model behaviors (knowledge cutoffs, language mix, biases).

### Common Crawl (2008–)

**What:** Petabytes of raw web crawls, updated roughly monthly; the base of nearly every LLM training corpus.

**Size:** Petabytes; each monthly crawl is ~2–3B pages

**Get it:** https://commoncrawl.org/

**License:** Open (crawl data; page contents belong to their authors).

**Quirks & gotchas:** Raw ≠ usable: quality filtering, dedup, and domain mix are where the engineering lives (C4, FineWeb, RedPajama are all filtered Common Crawl derivatives). Explains why models know 2015 better than yesterday.

**Used in:** B.0 reading.

---
### FineWeb (2024)

**What:** Hugging Face's curated 15-trillion-token web corpus with published filtering recipes and ablations (FineWeb-Edu variant for educational quality).

**Size:** 15T tokens (~44 TB deduplicated)

**Get it:** https://huggingface.co/datasets/HuggingFaceFW/fineweb

**License:** Open (ODC-By for the dataset).

**Quirks & gotchas:** The current reference for 'how do you clean web data' — its published ablations are the best public education on corpus engineering.

**Used in:** B.0 reading.

---
### RedPajama (2023)

**What:** Together AI's open reproduction of the LLaMA training recipe: ~1.2T tokens mixing Common Crawl, C4, GitHub, books, arXiv, Wikipedia, and StackExchange.

**Size:** 1.2T tokens (~5 TB per dedup'd version)

**Get it:** https://www.together.ai/blog/redpajama

**License:** Apache 2.0.

**Quirks & gotchas:** The dataset that proved open recipes could match closed ones. Its per-source mix table is the cleanest public picture of 'what's in an LLM's diet'.

**Used in:** B.0 reading.

---
### The Pile (2020) — historic

**What:** EleutherAI's 825 GiB, 22-subset corpus (arXiv, PubMed, GitHub, books, web…) used by GPT-J/NeoX. Official hosting was taken down in 2024 after publisher takedown requests (books subsources).

**Size:** 825 GiB (historic)

**Get it:** Was https://pile.eleuther.ai/ — see the takedown note on the page

**License:** Was mixed; effectively historical now.

**Quirks & gotchas:** Cited here as the definitive case study of *dataset legal risk* — the corpus itself became a liability after publication. Any data strategy must plan for this.

**Used in:** Reading for X.1 (data governance).

---
### The Stack (BigCode, 2022–2024)

**What:** Multiple terabytes of permissively-licensed (MIT/Apache/etc.) source code across hundreds of programming languages, with opt-out tooling for authors; the training base of StarCoder models.

**Size:** v1 ~3 TB / v2 ~67 TB pre-dedup (subsets downloadable)

**Get it:** https://huggingface.co/datasets/bigcode/the-stack

**License:** Permissive-only licenses; software heritage archives.

**Quirks & gotchas:** The exemplary 'consent-aware' corpus: per-license filtering plus an opt-out registry — the template responsible LLM data engineering now follows.

**Used in:** B.0 reading; Mock 5 background.

---
