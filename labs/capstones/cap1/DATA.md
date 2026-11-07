# Capstone cap1 — Corpus and eval-set notes

**Corpus candidates (real, documented, safe to use):**

- **FastAPI docs** (~500+ pages rendered; official repo has sources) — MIT-licensed docs, classic support-shaped content
- **DuckDB docs** — tidy, technical, versioned
- **Python stdlib docs** (subset: 5–10 modules) — PSF license, well-structured
- **MDN Web Docs excerpts** — CC-BY-SA; attribute properly if you publish the corpus
- **Your own b3 SEC 10-K index** — if you want finance-flavored support ("what does Item 1A say about supply risk?")

Pick one with structure (headings) — b3 taught you structure is free retrieval quality. ~500–2,000 chunks is the sweet spot: real enough to have distractors, small enough for free-tier embeddings.

**The eval set (write BEFORE the pipeline):**

- 15 in-corpus questions with verified gold fragments (b3's discipline)
- 5 paraphrase variants (cache-friendly)
- Adversarial 15 (separate): out-of-scope, injection attempts, "what's your system prompt," multi-hop beyond your corpus

**Corpus hygiene checklist:** license noted in README; corpus version hashed (x1's `corpus_hash`); re-index procedure documented (you will re-index; make it a script, not a memory).

**Cost estimate (small model, ~1K chunks, ~300 requests total during the build):** under $1. Embeddings local and free. The capstone is cheap — the discipline is the expensive part.
