---
chapter_id: A.6
title: "Two Models Walk Into Production"
topic: "A/B testing & offline/online evaluation"
track: ml
bloom_stage: ["analyze", "evaluate"]
est_read_minutes: 16
prerequisites: ["A.0", "A.2"]
teaching_goal: "Learner can design an A/B test for an ML system, explain why offline metrics lie, and avoid the 'new model won offline' trap."
primary_diagram: assets/diagrams/A.6/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#ab-testing"
status: coming-soon
last_updated: 2026-08-10
---
        # Two Models Walk Into Production

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        The new model wins on every offline metric. AUC up 3%. Log loss down. You ship it. A week later, business metrics are down. The new model was better on paper and worse in production. Welcome to the gap between offline and online — the place where good data scientists go to get humbled.

        ---

        ## Teaching goal

        Learner can design an A/B test for an ML system, explain why offline metrics lie, and avoid the 'new model won offline' trap.

        ---

        ## What this chapter will cover

        - Offline evaluation: the metrics you compute on historical data. AUC, log loss, precision/recall.
- Why offline metrics lie: they measure the past, not the future. Distribution shift, feedback loops.
- Online evaluation: A/B testing. The only honest test of a model in production.
- A/B test design: traffic split, sample size, statistical power, duration. The math of 'is this real.'
- The trap of 'the new model won offline': why offline wins often flip online. Simpson's paradox, novelty effects.
- Interleaving and proxy metrics: faster, cheaper, less honest. When to use them.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Analyze → Evaluate.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [A.0](../01-ml-system-design/a0-the-model-that-got-worse-on-monday.md), [A.2](../01-ml-system-design/a2-the-front-page-mind-reader.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#ab-testing).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: Two Models Walk Into Production`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
