---
chapter_id: B.3
title: "The Index That Speaks in Numbers"
topic: "Vector databases"
track: genai
bloom_stage: ["apply", "analyze"]
est_read_minutes: 17
prerequisites: ["B.0", "B.2"]
teaching_goal: "Learner can explain embeddings, ANN algorithms (HNSW, IVF), and decide when to use a vector DB vs. a traditional database."
primary_diagram: assets/diagrams/B.3/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#vector-databases"
status: coming-soon
last_updated: 2026-08-10
---
        # The Index That Speaks in Numbers

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        You have 10 million documents. Each one is a list of 1,536 numbers. You need to find the 10 most similar to a query, in 50 milliseconds. You cannot compare all 10 million. This is the problem vector databases were born to solve — and the math underneath is beautiful.

        ---

        ## Teaching goal

        Learner can explain embeddings, ANN algorithms (HNSW, IVF), and decide when to use a vector DB vs. a traditional database.

        ---

        ## What this chapter will cover

        - Embeddings recap: text → vector. Similar meaning → similar vector. The 'GPS coordinates of meaning.'
- The naive approach: brute-force compare to all 10M vectors. Works for 10K, dies at 10M.
- Approximate nearest neighbor (ANN): trade exactness for speed. The foundational tradeoff of vector search.
- HNSW (Hierarchical Navigable Small World): the graph-based approach. Fast, accurate, memory-hungry.
- IVF (Inverted File Index): the cluster-based approach. Lower memory, slightly slower.
- When to use a vector DB vs. when to use pgvector vs. when not to need one at all. The 'do you actually need this' test.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Apply → Analyze.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [B.0](../02-genai-system-design/b0-the-box-that-predicts-the-next-word.md), [B.2](../02-genai-system-design/b2-the-librarian-who-never-forgets.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#vector-databases).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: The Index That Speaks in Numbers`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
