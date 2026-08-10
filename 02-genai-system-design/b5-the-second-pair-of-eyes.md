---
chapter_id: B.5
title: "The Second Pair of Eyes"
topic: "Reranking"
track: genai
bloom_stage: ["apply", "evaluate"]
est_read_minutes: 14
prerequisites: ["B.2", "B.3"]
teaching_goal: "Learner can design a two-stage retrieval pipeline with bi-encoder retrieval and cross-encoder reranking, and quantify when reranking pays for itself."
primary_diagram: assets/diagrams/B.5/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#reranking"
status: coming-soon
last_updated: 2026-08-10
---
        # The Second Pair of Eyes

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        Vector search is fast and approximate. Cross-encoder reranking is slow and precise. Together, they're the cheapest accuracy multiplier in RAG — a 5-10% quality improvement for a 50ms latency cost. This is the 'second pair of eyes' that turns decent retrieval into great retrieval.

        ---

        ## Teaching goal

        Learner can design a two-stage retrieval pipeline with bi-encoder retrieval and cross-encoder reranking, and quantify when reranking pays for itself.

        ---

        ## What this chapter will cover

        - The two-stage pattern: retrieve many candidates cheaply, rerank a few precisely.
- Bi-encoders: embed query and document separately, compare vectors. Fast, approximate.
- Cross-encoders: feed query and document together to a model. Slow, precise. The 'second pair of eyes.'
- The latency budget: 50ms of reranking for 5-10% quality improvement. Almost always worth it.
- When reranking pays for itself: the cost-benefit math. When to skip it.
- Production pattern: retrieve top-50, rerank to top-5. The sweet spot for most RAG systems.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Apply → Evaluate.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [B.2](../02-genai-system-design/b2-the-librarian-who-never-forgets.md), [B.3](../02-genai-system-design/b3-the-index-that-speaks-in-numbers.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#reranking).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: The Second Pair of Eyes`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
