---
chapter_id: "B.4"
title: "Splitting Knowledge Without Losing It"
topic: "Chunking"
track: genai
bloom_stage: ["analyze", "evaluate"]
est_read_minutes: 15
prerequisites: ["B.2", "B.3"]
teaching_goal: "Compare fixed, semantic, and structural chunking strategies, and identify chunking as the highest-leverage RAG decision."
primary_diagram: assets/diagrams/B.4/
common_misconception: "See chapter body"
status: stable
last_updated: 2026-08-10
---

# Splitting Knowledge Without Losing It

You can have the best embedding model, the best vector database, the best LLM — and your RAG system will still fail if your chunks are wrong. Chunking is the most under-discussed decision in RAG, and the one with the biggest impact on quality. This chapter is about getting it right.

---

## Remember

**Chunk** — a piece of a document, the unit of retrieval in RAG. **Fixed-size chunking** — every N words. **Sentence-aware chunking** — split at sentence boundaries, target N words. **Structural chunking** — split at headings, paragraphs, sections. **Semantic chunking** — split when the meaning changes. **Overlap** — including the end of one chunk at the start of the next, to preserve context across boundaries.

---

## Understand

Why chunk at all? Documents are too big for context windows, and most of a document is irrelevant to most queries. If a user asks 'how do I reset my password,' they don't need the entire 50-page IT handbook — they need the paragraph about password resets. Chunking splits documents into retrievable units.

The chunking strategy determines what gets retrieved. Bad chunking splits ideas mid-sentence ('To reset your password, click the' | 'Forgot Password link on the login page'). Good chunking preserves semantic units ('To reset your password, click the Forgot Password link on the login page').

**Fixed-size chunking (every 500 words).** Simple, fast, brittle. Splits sentences, loses meaning. Good baseline for testing, rarely the production choice.

**Sentence-aware chunking.** Split at sentence boundaries, target ~500 words. Better — no split sentences — but still semantic-blind (a 500-word chunk might span three unrelated topics).

**Structural chunking.** Split at headings (H2, H3) or paragraphs. Best when documents are well-structured (wikis, documentation, legal statutes). Each chunk maps to a semantic unit the author intended.

**Semantic chunking.** Use embeddings to detect topic boundaries — split when the meaning shifts. Good for unstructured text (transcripts, long-form articles). More expensive (requires embedding each sentence and comparing adjacent ones).

**Overlap.** Include the last 50-100 words of one chunk at the start of the next. This ensures that a chunk ending mid-idea gets continued in the next chunk, so a query matching either chunk retrieves the complete idea. Overlap costs tokens (you store and retrieve duplicated text) but improves recall.

---

## Apply

For a company wiki with well-structured H2 sections: structural chunking at H2 boundaries, 50-word overlap. Average chunk: ~400 words. This preserves the author's intended semantic boundaries.

For a corpus of call transcripts (unstructured): semantic chunking, detecting topic shifts. Average chunk: ~300 words. This handles the unstructured nature of conversation.

For a legal corpus (statutes → sections → subsections): structural chunking at the subsection level, with metadata (jurisdiction, statute number, effective date) attached to each chunk. This preserves legal precision.

---

## Analyze

The tradeoff: **small chunks** (100-200 words) have precise embeddings (each chunk has a tight, specific meaning) but may lack context (the LLM sees fragments, not whole ideas). **Large chunks** (1000-2000 words) have complete context but imprecise embeddings (the embedding averages over too much meaning). The sweet spot for most use cases: 300-500 words, structural chunking, with overlap.

There's no universal best chunk size. There's the best chunk size *for your documents, your queries, and your model*. You find it empirically: build an eval set, try 200/500/1000/structural, measure retrieval recall and answer quality, pick the winner.

---

## Evaluate

Chunking is the highest-leverage RAG decision because it's upstream of everything else. If chunking is wrong, no embedding model, vector DB, or reranker can fix it — the retrieved chunks are semantically broken. Yet most teams spend days tuning the LLM prompt and zero time on chunking. This is backwards. Invest in chunking first; it has the biggest ROI.

---

## Create

Design a chunking strategy for a medical literature database. Papers have abstract, introduction, methods, results, discussion. Queries range from 'what are the side effects of [drug]' to 'compare the efficacy of [drug A] vs [drug B] for [condition].' How do you chunk? What metadata do you attach? How do you handle the fact that the answer to a query might span multiple papers?

---

## A common misconception

**'Just use 500-word chunks.'** This is the most common chunking advice, and it's wrong for most use cases. Fixed-size chunking splits ideas mid-sentence and ignores document structure. The right chunking strategy depends on your documents and queries — and finding it requires experimentation, not a default.

---

## Explain it back

Chunking is the _____ RAG decision. The four strategies are _____, _____, _____, and _____. The tradeoff is between _____ (small chunks) and _____ (large chunks). The sweet spot for most use cases is _____. You find the best chunk size by _____, not by _____.

---

## Further reading

- **LangChain documentation, "Text Splitters"** — practical chunking implementations.
- **Greg Kamradt (2024), "Chunking Strategies for LLM Applications"** — a systematic comparison.
- **LlamaIndex documentation** — chunking patterns for RAG.
