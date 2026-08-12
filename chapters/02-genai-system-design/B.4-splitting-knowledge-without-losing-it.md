---
chapter_id: "B.4"
title: "Splitting Knowledge Without Losing It"
topic: "Chunking"
track: genai
bloom_stage: ["remember", "understand", "apply", "analyze", "evaluate", "create"]
est_read_minutes: 15
prerequisites: ["B.2", "B.3"]
teaching_goal: "Compare fixed, semantic, and structural chunking strategies, and identify chunking as the highest-leverage RAG decision."
status: stable
last_updated: 2026-08-12"
---

# Splitting Knowledge Without Losing It

You can have the best embedding model, the best vector database, the best LLM — and your RAG system will still fail if your chunks are wrong. Chunking is the most under-discussed decision in RAG, and the one with the biggest impact on quality.

---

## Remember

- **Chunk** — a piece of a document, the unit of retrieval. Typically 200-800 words.
- **Fixed-size chunking** — every N words. Simple, brittle. Splits sentences.
- **Sentence-aware chunking** — split at sentence boundaries, target N words.
- **Structural chunking** — split at headings (H2, H3). Best for structured documents.
- **Semantic chunking** — split when meaning changes. Uses embeddings.
- **Overlap** — including the end of one chunk at the start of the next, to preserve context across boundaries.

---

## Understand — why chunk size matters

**Small chunks (100-200 words):** precise embeddings (each chunk has a tight meaning), but may lack context. The LLM sees fragments, not whole ideas.

**Large chunks (1,000-2,000 words):** complete context, but embeddings average over too much meaning. Vector search returns chunks that contain the answer somewhere, but the LLM has to find it.

**The tradeoff:** small chunks = precise retrieval, lost context. Large chunks = full context, imprecise retrieval. The sweet spot for most use cases: 300-500 words with 50-word overlap.

---

## Apply — choose a chunking strategy

| Document type | Strategy | Why |
|---|---|---|
| Wiki/documentation | Structural at H2 | Maps to semantic boundaries |
| Legal statutes | Structural at subsection | Preserves legal precision |
| Call transcripts | Semantic | Handles unstructured conversation |
| Research papers | Structural at sections | Methods, results, discussion are distinct |

**Overlap matters:** 50-100 words of overlap ensures a chunk ending mid-idea gets continued in the next chunk. Without overlap, a query matching either chunk retrieves only half the answer.

---

## Analyze — the evaluation problem

There is no universal best chunk size. There's the best for *your documents, queries, and model*. You find it empirically:

1. Build an eval set (50 questions with known-correct answers).
2. Try chunk sizes 200, 500, 1,000, structural.
3. Measure retrieval recall (did the right chunk appear in top-5?) and answer correctness.
4. Pick the winner.

This is system design as empiricism. You measure your way to the right chunk size.

---

## Evaluate — chunking is the highest-leverage RAG decision

Chunking is upstream of everything else. If chunking is wrong, no embedding model, vector DB, or reranker can fix it — the retrieved chunks are semantically broken. Yet most teams spend days tuning the LLM prompt and zero time on chunking. This is backwards. Invest in chunking first; it has the biggest ROI.

---

## Create — design chunking for a medical literature database

Papers have abstract, introduction, methods, results, discussion. Queries range from "side effects of [drug]" to "compare efficacy of [A] vs [B]." How do you chunk? What metadata do you attach? How do you handle the fact that the answer might span multiple papers?

---

## A common misconception

**"Just use 500-word chunks."** This is the most common chunking advice, and it's wrong for most use cases. Fixed-size chunking splits ideas mid-sentence and ignores document structure. The right chunking strategy depends on your documents and queries — and finding it requires experimentation.

---

## Explain it back

> "Chunking is the _____ RAG decision. The four strategies are _____, _____, _____, and _____. The tradeoff is between _____ and _____. You find the best chunk size by _____, not by _____."

---

## References

- **LangChain Text Splitters Documentation.** https://python.langchain.com/docs/how_to/#text-splitters
- **Greg Kamradt (2024), "Chunking Strategies for LLM Applications."** Systematic comparison of chunking strategies.
- **LlamaIndex Documentation.** Chunking patterns for RAG. https://docs.llamaindex.ai/
