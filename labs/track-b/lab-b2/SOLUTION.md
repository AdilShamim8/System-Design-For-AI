# Lab b2 — Worked Solution and What the Numbers Mean

## Expected results (our runs, `all-MiniLM-L6-v2`, 400/50 chunks, 150 questions)

| Measurement | What we got |
|---|---|
| Chunks from 2,032 paragraphs | ≈ 2,200–2,400 |
| hit@1 | ≈ 0.50–0.60 |
| hit@4 | ≈ 0.70–0.80 |
| hit@8 | ≈ 0.78–0.85 |
| Miss taxonomy (of ~30 misses) | ~50% distractor twins, ~30% vocab mismatch, ~20% multi-hop |
| Refusal rate on out-of-corpus Qs | ≈ 50–70% with a plain system prompt; 85–95% after tightening |
| End-to-end correct (10 samples) | ≈ 60–80%, tracking hit@4 as predicted |

## The five lessons hidden in those numbers

1. **Retrieval quality bounds generation quality.** End-to-end correctness tracks hit@k with eerie fidelity: when the gold chunk is present, a decent model answers correctly ~90% of the time; when absent, near-zero. "The model hallucinates" is usually "the retriever missed, and the model did its job on the wrong inputs." This is why RAG debugging starts at hit rate, not at the prompt.
2. **The three miss types have three different fixes.** Vocabulary mismatch → hybrid BM25 (extension; also a5's lesson). Distractor twins → a reranker that reads the *question with* the chunk (B.5). Multi-hop → query decomposition or multi-hop retrieval (HotpotQA territory). If you can't name the miss type, you can't pick the fix — and you'll waste a sprint re-chunking when you needed a reranker.
3. **k is a budget dial, not a quality dial.** hit@8 > hit@4, but each retrieved chunk costs input tokens (b1's math: 8 chunks × 500 tokens = 4K input tokens ≈ your entire prompt budget) and *dilutes* attention — more context, more chances the model cites the wrong one. The professional move: rerank to keep quality at lower k, not crank k.
4. **Refusal is a system-prompt *and* evaluation problem.** Default models want to help; a bare "answer only from context" gets ignored under pressure. Highest-leverage pattern we measured: rule in the system prompt + repeated in the user message + a hard format ("if not in sources, reply exactly …"). And you *measure* refusal rate — 80% sounds high until it's one in five answers being Air Canada (FN-04).
5. **The 3 MB that becomes 6.5 GB.** Your numpy matrix is an in-memory toy: one process, no persistence, no filtering, no multi-tenant isolation. Multiply by a real corpus and you need an actual vector database (B.3's comparison table is the shopping list). Knowing *exactly* what the database does for you — ANN search, persistence, metadata filters — comes from having built the toy it replaces.

## Common mistakes

- **Evaluating generation without grading retrieval.** If you only score final answers, you can't attribute failures — and you'll "fix" retrieval bugs with prompt changes. Always compute both.
- **Substring-matching chunks to gold contexts incorrectly.** The hit check must verify the *retrieved chunk came from the gold paragraph* — chunk overlap means a prefix match (`gold[:200] in retrieved`) is the robust form. Exact equality never matches (chunks ≠ paragraphs).
- **One prompt, no measurements.** "I improved the prompt" without before/after numbers on the same 150 questions is a vibe. Labs b4 formalizes the eval set; the habit starts here.
- **Forgetting dedup:** build the corpus from `paragraphs` (deduped), never from `qa.context` (repeated) — duplicates distort hit-rate denominators.

## Interview lines this lab earns you

- "I graded retrieval separately from generation on labeled data — hit@4 ≈ 0.75 with MiniLM embeddings — and 90% of my 'hallucinations' were retrieval misses, which is why my first RAG debugging question is always 'was the gold chunk retrieved?'"
- "I measured refusal rate on out-of-corpus questions — the failure that cost Air Canada a court case — and took it from ~60% to ~90% with prompt structure alone. The last 10% is why guardrail layers exist (C.5)."
