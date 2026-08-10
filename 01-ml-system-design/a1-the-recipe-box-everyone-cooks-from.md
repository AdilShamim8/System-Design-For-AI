---
chapter_id: A.1
title: "The Recipe Box Everyone Cooks From"
topic: "Feature stores"
track: ml
bloom_stage: ["understand", "apply"]
est_read_minutes: 15
prerequisites: ["A.0"]
teaching_goal: "Learner can explain what a feature store is, why it solves training-serving skew, and when you do vs. don't need one."
primary_diagram: assets/diagrams/A.1/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#feature-stores"
status: coming-soon
last_updated: 2026-08-10
---
        # The Recipe Box Everyone Cooks From

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        Two cooks. Same recipe. One uses fresh tomatoes from the garden, the other uses canned. Same recipe, very different dish. That's training-serving skew — and the feature store is the shared recipe box that prevents it.

        ---

        ## Teaching goal

        Learner can explain what a feature store is, why it solves training-serving skew, and when you do vs. don't need one.

        ---

        ## What this chapter will cover

        - The problem: training uses one set of features, serving uses another. The model learns the wrong recipe.
- Training-serving skew: the silent killer. Why offline metrics lie.
- The feature store: a shared registry of features, used identically at training and serving time.
- Online vs. offline feature stores: low-latency lookup for serving, batch compute for training.
- Feature freshness: some features are timeless (user's country), some decay in minutes (last 5 clicks).
- When you need a feature store and when you don't. The YAGNI principle applied to ML infrastructure.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Understand → Apply.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [A.0](../01-ml-system-design/a0-the-model-that-got-worse-on-monday.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#feature-stores).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: The Recipe Box Everyone Cooks From`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
