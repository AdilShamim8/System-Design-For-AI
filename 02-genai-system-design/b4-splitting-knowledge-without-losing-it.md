---
chapter_id: B.4
title: "Splitting Knowledge Without Losing It"
topic: "Chunking"
track: genai
bloom_stage: ["analyze", "evaluate"]
est_read_minutes: 15
prerequisites: ["B.2", "B.3"]
teaching_goal: "Learner can compare fixed, semantic, and structural chunking strategies, and identify chunking as the highest-leverage RAG decision."
primary_diagram: assets/diagrams/B.4/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#chunking"
status: coming-soon
last_updated: 2026-08-10
---
        # Splitting Knowledge Without Losing It

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        You can have the best embedding model, the best vector database, the best LLM — and your RAG system will still fail if your chunks are wrong. Chunking is the most under-discussed decision in RAG, and the one with the biggest impact on quality. This chapter is about getting it right.

        ---

        ## Teaching goal

        Learner can compare fixed, semantic, and structural chunking strategies, and identify chunking as the highest-leverage RAG decision.

        ---

        ## What this chapter will cover

        - Why chunk at all: documents are too big for context windows, and most of a document is irrelevant to most queries.
- Fixed-size chunking: every N words. Simple, brittle. Splits sentences, loses meaning.
- Sentence-aware chunking: split at sentence boundaries, target N words. Better, but still semantic-blind.
- Structural chunking: split at headings, paragraphs, sections. Best when documents are well-structured.
- Semantic chunking: split when the meaning changes. Uses embeddings to detect topic boundaries.
- The tradeoff: small chunks (precise retrieval, lost context) vs. large chunks (full context, imprecise retrieval).
- Evaluation: how to measure whether your chunking is working. The empiricism that RAG demands.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Analyze → Evaluate.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [B.2](../02-genai-system-design/b2-the-librarian-who-never-forgets.md), [B.3](../02-genai-system-design/b3-the-index-that-speaks-in-numbers.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#chunking).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: Splitting Knowledge Without Losing It`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
