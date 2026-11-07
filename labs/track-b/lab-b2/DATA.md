# Lab b2 — Dataset: SQuAD v1.1 (validation split)

Full card in [`datasets/qa-knowledge.md`](../../../datasets/qa-knowledge.md). Lab-specific notes:

**Getting it:** `load_dataset("squad", split="validation")` — downloads once via Hugging Face `datasets`, ~30 MB. No account needed.

**Why the validation split:** ~10,573 QA pairs over ~2,032 unique paragraphs — small enough for instant experiments, real enough to have genuine difficulty (Super Bowl questions vs. Normans questions — yes, the Normans one is in there). The training split (87K pairs, ~19K paragraphs) is the extension if you want a bigger index.

**Shape:** each row = question, context paragraph (the gold retrieval target), answers (text + start position), id, title. The context *is* the gold label for retrieval — that's what makes honest hit-rate grading possible.

**Known quirks you will hit:**

- **Questions were written while looking at the paragraph** (crowdworkers saw the context). Phrasing overlaps the gold context more than real user questions would — meaning your hit rates here are an *upper bound* on production hit rates. Real users paraphrase harder.
- **Every question is answerable** (v1.1). The refusal behavior you test in Part 5 has no native examples — which is exactly why we inject out-of-corpus questions manually. (SQuAD v2's unanswerables are the upgrade path.)
- **Contexts repeat across questions:** dedupe by `context` before building the corpus, or your index has copies and your hit-rate math gets weird.
- **Single-hop by design:** most questions need one paragraph. Your multi-hop misses preview why HotpotQA exists (see the dataset card).

**License:** CC BY-SA 4.0 — usable, share-alike. Fine for labs and demos; attribution required.
