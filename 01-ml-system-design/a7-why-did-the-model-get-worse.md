---
chapter_id: A.7
title: "Why Did the Model Get Worse?"
topic: "Drift, retraining, closing the loop"
track: ml
bloom_stage: ["evaluate", "create"]
est_read_minutes: 18
prerequisites: ["A.0", "A.1", "A.6"]
teaching_goal: "Learner can diagnose data drift vs. concept drift, design detection signals, and implement a shadow-and-promote retraining pattern."
primary_diagram: assets/diagrams/A.7/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#ml-monitoring"
status: coming-soon
last_updated: 2026-08-10
---
        # Why Did the Model Get Worse?

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        We started this track with a mystery: the model worked Friday, failed Monday. We've spent six chapters building the vocabulary to solve it. This chapter is the resolution — and the design patterns that prevent it from happening again.

        ---

        ## Teaching goal

        Learner can diagnose data drift vs. concept drift, design detection signals, and implement a shadow-and-promote retraining pattern.

        ---

        ## What this chapter will cover

        - The resolution: data drift (the inputs changed) vs. concept drift (the relationship changed).
- Detection signals: input distribution monitoring, prediction distribution monitoring, ground-truth latency.
- Retraining cadence: scheduled (weekly) vs. triggered (when drift detected). When each wins.
- The shadow-and-promote pattern: train new model, run it in parallel, compare, promote if better.
- Champion/challenger: continuous evaluation in production, not just at retraining time.
- Closing the loop: feedback collection, label acquisition, the full cycle from A.0 back to itself.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Evaluate → Create.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [A.0](../01-ml-system-design/a0-the-model-that-got-worse-on-monday.md), [A.1](../01-ml-system-design/a1-the-recipe-box-everyone-cooks-from.md), [A.6](../01-ml-system-design/a6-two-models-walk-into-production.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#ml-monitoring).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: Why Did the Model Get Worse?`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
