---
chapter_id: A.3
title: "The Search Bar That Almost Understands You"
topic: "Search & ranking"
track: ml
bloom_stage: ["apply", "analyze"]
est_read_minutes: 18
prerequisites: ["A.0", "A.2"]
teaching_goal: "Learner can design a search system with lexical and semantic retrieval, ranking, and result blending."
primary_diagram: assets/diagrams/A.3/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#search-and-ranking"
status: coming-soon
last_updated: 2026-08-10
---
        # The Search Bar That Almost Understands You

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        You type 'blue running shoes for flat feet.' The search returns 500 results. The first ten are perfect. The next 490 are irrelevant. How did it know which ten to put first? That's the search problem — sibling to recommendation, but with one critical difference: the user told you what they want.

        ---

        ## Teaching goal

        Learner can design a search system with lexical and semantic retrieval, ranking, and result blending.

        ---

        ## What this chapter will cover

        - Search vs. recommendation: the user gives intent explicitly. Different signal, different design.
- Lexical retrieval: BM25 and friends. The classic 'match the words' approach. Fast, precise, dumb.
- Semantic retrieval: embeddings capture meaning, not just words. 'Sneakers' matches 'running shoes.'
- Hybrid retrieval: blend lexical and semantic. The pattern that wins in production.
- Ranking: take the retrieved set, score it precisely. Same shape as recommendation's ranking stage.
- Blending and re-ranking: ads, sponsored results, freshness, personalization. The final policy layer.
- The 'most relevant' problem: relevance is contextual. The same query means different things to different users.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Apply → Analyze.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [A.0](../01-ml-system-design/a0-the-model-that-got-worse-on-monday.md), [A.2](../01-ml-system-design/a2-the-front-page-mind-reader.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#search-and-ranking).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: The Search Bar That Almost Understands You`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
