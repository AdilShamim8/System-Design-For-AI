# Lab b3 — Worked Solution and What the Numbers Mean

## Expected results (our runs, Apple FY2023 10-K, 12 questions, MiniLM embeddings)

| Chunker | n_chunks | hit@3 | Prompt cost @ k=3 |
|---|---|---|---|
| Fixed 1800/200 | ≈ 200–300 | ≈ 0.50–0.65 | ~1,350 tokens |
| Recursive 1800/200 | ≈ 200–300 | ≈ 0.65–0.80 | ~1,350 tokens |
| Section-aware 1800 | ≈ 210–320 | ≈ 0.75–0.90 | ~1,350 tokens |
| Best chunker @ 300 chars | ≈ 1,200–1,600 | ≈ −5 to +5 pts | ~225 tokens |
| Best chunker @ 4,500 chars | ≈ 80–120 | ≈ flat to −10 pts | ~3,375 tokens |

*(Question sets are author-dependent — your absolute numbers will differ from ours. The *ordering* is the robust part; reproduce it and you've validated the harness.)*

## The five lessons hidden in those numbers

1. **Structure beats cleverness on structured documents.** The 10-K *tells you* its semantic units (Items); a chunker that listens ("section-aware") beats a generic one that doesn't. The general law: exploit any structure the corpus already has — sections, headings, paragraphs, paragraphs' authors — before inventing your own.
2. **Recursive chunking is the floor, not the ceiling.** It exists to stop mid-sentence cuts, the dumbest possible failure. It cannot know that "Item 1A." matters. Most "we upgraded our chunker" stories are this floor finally being installed.
3. **The size curve has a knee, and your corpus owns it.** Quality rises with size (more context per chunk), then dilution and cost dominate. Legal prose's knee differs from chat logs' knee — which is the entire argument for *measuring* rather than *citing blogs*. Your Part-3 paragraph with a measured knee is worth more in a design review than any reference.
4. **Hit-rate is necessary, not sufficient.** The Part-4 trap is real: a tiny chunk can *match* the query (high similarity) yet *fail* the answer (missing the year, the unit, the comparison). End-to-end checks on a handful of questions catch what retrieval metrics miss — the two-tier eval (big retrieval set, small generation set) is the pragmatic pattern teams land on.
5. **Tables are the real boss fight.** Financial documents are half tables, and text chunking mangles them. Every serious enterprise RAG effort ends up with a table-extraction path (the extension). Saying "we special-cased tables" in an interview signals you've actually shipped something against real documents.

## Common mistakes

- **Gold fragments that don't exist verbatim.** Your `gold_fragment` must be an exact substring of the *chunked text* — check before running, or every question silently fails.
- **Comparing chunkers at different total sizes.** Fixed 1800/200 and recursive 1800/200 have near-equal chunk counts; keep sizes aligned or the comparison is confounded.
- **Evaluating on questions the document can't answer.** If your question set includes things the 10-K doesn't state, you're measuring your reading, not your chunker. Verify every gold fragment.
- **Forgetting overlap's cost:** overlap duplicates tokens (200/1800 = 11% more embedding cost and prompt tokens when both halves retrieve). It's a patch for boundary cuts, not a free lunch.

## Interview lines this lab earns you

- "On a real 10-K with a 12-question labeled set, section-aware chunking beat fixed by 15–25 hit points at identical prompt cost — structure the document already had, for free. I start every RAG engagement by asking what structure the corpus secretly contains."
- "I sweep chunk size against hit@k *and* prompt cost together; the knee on the corpus I tested was ~450 tokens. The one-line version: chunk size is a measured tradeoff, not a blog-post constant."
