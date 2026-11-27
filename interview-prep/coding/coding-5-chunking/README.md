# Coding 5 — Chunk a Corpus Like You'll Defend It

**Time budget: 30 min.** Open book (docs, not solutions). Narrate your tradeoffs.

## The scenario

RAG screen: 'Chunk these docs for retrieval. Here's the corpus (technical docs with headers, tables, and code blocks). Show me your chunker and the chunk statistics you'd check before indexing.' The hidden test: fixed-size chunking splits tables and code blocks mid-structure, and the candidate who ships it without checking has never debugged retrieval misses.

## Your task

Split-table count = 0 for the structure-aware version (that's the whole point). Size distribution sensible (median near target, no giant chunks). The 3 QA checks named: boundary sanity (chunk starts make sense), entity containment (a chunk about X contains X's name), no-orphan rule (merge tiny tails upward).

## Success looks like

1. Implement fixed-size chunking (500 chars, no overlap) — the baseline.
2. Implement structure-aware chunking: split on headers first; keep code blocks and tables intact (never split them); pack to ~1,500 chars with ~150 overlap.
3. Produce chunk statistics for both: count, size distribution, orphans (chunks < 100 chars), split-tables (a table row separated from its header).
4. Write the 3 QA checks you'd run before indexing.

## Dataset

Any structured corpus: a handful of real docs with headers/tables/code. The [qa-knowledge](../../datasets/qa-knowledge.md) card's SQuAD paragraphs work; a raw markdown dump of 3–4 of this repo's own chapters is ideal (dogfooding).

## After your attempt

Open [SOLUTION.md](./SOLUTION.md). Grade yourself against the checklist at the end.
