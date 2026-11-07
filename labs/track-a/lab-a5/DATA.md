# Lab a5 — Dataset: ANTIQUE

Full card in [`datasets/search-rank-retrieval.md`](../../../datasets/search-rank-retrieval.md). Lab-specific notes:

**Getting it:** `git clone https://github.com/CSIPranay/ANTIQUE` into `labs/data/`. No account, no download drama — one reason this lab uses ANTIQUE instead of the (better but heavier) MS MARCO.

**Files you'll use:**

- `antique_collection.txt` — passage id + text (~34K passages, Yahoo Answers non-factoid answers)
- `antique_training.txt` / `antique_test.txt` — qrels: `qid, Q0, pid, relevance` with graded relevance 0–3

**Shape:** ~2,600 questions total, ~34K passages, judgments are sparse (not every passage judged for every question — NDCG handles this honestly; precision-style metrics would punish it).

**Known quirks you will hit:**

- **Non-factoid = opinion-shaped.** "How do I deal with a jealous sibling?" has no single right answer; the graded labels encode *usefulness*, not truth. This changes what "relevance" means and is a great calibration for RAG work (Lab b2).
- **Long, messy passages.** Forum answers with typos, greetings, and tangents — realistic corpus muck, unlike clean Wikipedia. Your whitespace tokenizer will do fine; a fancier one (spaCy) buys little here and costs setup time.
- **Cold vocabulary:** questions use words that rarely appear in passages (and vice versa). This *deliberately* stresses BM25 so the semantic system can shine — the dataset was built for exactly this comparison.
- **Sparse judgments mean "unjudged ≠ irrelevant."** When you compute metrics, unjudged retrieved passages count as 0 relevance but might actually be good — all offline search metrics share this humility.

**License:** open for research (see the repo). Small enough to keep the whole thing in RAM forever.
