---
chapter_id: A.4
title: "The Penny That Decides a Billion Dollars"
topic: "Ad click prediction"
track: ml
bloom_stage: ["apply", "evaluate"]
est_read_minutes: 17
prerequisites: ["A.0", "A.2"]
teaching_goal: "Learner can design a CTR prediction system, explain the latency budget, and reason about why 0.1% accuracy is real money."
primary_diagram: assets/diagrams/A.4/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#ad-click-prediction"
status: coming-soon
last_updated: 2026-08-10
---
        # The Penny That Decides a Billion Dollars

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        An ad is shown. A user clicks, or doesn't. That binary outcome, multiplied by a billion impressions a day, is the entire economics of the internet. A 0.1% improvement in click prediction is a nine-figure revenue change. This is ML at industrial scale, with industrial stakes.

        ---

        ## Teaching goal

        Learner can design a CTR prediction system, explain the latency budget, and reason about why 0.1% accuracy is real money.

        ---

        ## What this chapter will cover

        - The setup: real-time bidding. You have 10 milliseconds to decide whether to bid and how much.
- The latency budget: 10ms total. Why CTR prediction is a latency-constrained problem first.
- Feature engineering: user features, ad features, context features, cross-features. The engineering art.
- Calibration: predicting 'probability of click' not just 'click vs. no click.' Why calibration matters for bidding.
- Why 0.1% accuracy is real money: the economics of small lifts at huge scale.
- The offline/online gap: why your offline AUC is meaningless until you A/B test.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Apply → Evaluate.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [A.0](../01-ml-system-design/a0-the-model-that-got-worse-on-monday.md), [A.2](../01-ml-system-design/a2-the-front-page-mind-reader.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#ad-click-prediction).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: The Penny That Decides a Billion Dollars`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
