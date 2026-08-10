---
chapter_id: B.8
title: ""It Sounds Right" Is Not Good Enough"
topic: "GenAI evaluation"
track: genai
bloom_stage: ["evaluate", "create"]
est_read_minutes: 17
prerequisites: ["B.0", "B.2"]
teaching_goal: "Learner can design a GenAI evaluation strategy combining human eval, LLM-as-judge, and regression suites, and explain why 'vibes' ship broken products."
primary_diagram: assets/diagrams/B.8/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#evaluation"
status: coming-soon
last_updated: 2026-08-10
---
        # "It Sounds Right" Is Not Good Enough

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        You read the LLM's output. It sounds right. It looks right. You ship it. Three weeks later, a user finds it confidently explaining that the capital of France is London. 'Sounds right' is not an evaluation. This chapter is about building one.

        ---

        ## Teaching goal

        Learner can design a GenAI evaluation strategy combining human eval, LLM-as-judge, and regression suites, and explain why 'vibes' ship broken products.

        ---

        ## What this chapter will cover

        - Why GenAI eval is hard: outputs are open-ended, multiple correct answers exist, ground truth is subjective.
- Human evaluation: the gold standard, the cost, the slowness. When to use it.
- LLM-as-judge: use a frontier LLM to grade outputs of a smaller LLM. Cheap, fast, biased. The pitfalls.
- Regression suites: a fixed set of test queries with known-good answers. The CI/CD for prompts.
- Multi-dimensional eval: factuality, helpfulness, safety, tone. One score is never enough.
- The 'vibes' failure mode: why human gut feelings about LLM quality are systematically miscalibrated.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Evaluate → Create.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [B.0](../02-genai-system-design/b0-the-box-that-predicts-the-next-word.md), [B.2](../02-genai-system-design/b2-the-librarian-who-never-forgets.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#evaluation).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: "It Sounds Right" Is Not Good Enough`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
