---
chapter_id: A.5
title: "The 3am Fraud Alarm"
topic: "Fraud & anomaly detection"
track: ml
bloom_stage: ["apply", "evaluate"]
est_read_minutes: 17
prerequisites: ["A.0"]
teaching_goal: "Learner can design a fraud detection system with streaming and batch components, and reason about the precision/recall tradeoff in a UX context."
primary_diagram: assets/diagrams/A.5/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#fraud-detection"
status: coming-soon
last_updated: 2026-08-10
---
        # The 3am Fraud Alarm

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        3:14 AM. Your phone buzzes. 'Did you just attempt a $4,200 purchase in another country?' You didn't. The card gets frozen. The fraud team catches it before you even knew it was happening. That 30-second decision — block or allow — is the entire art of fraud detection.

        ---

        ## Teaching goal

        Learner can design a fraud detection system with streaming and batch components, and reason about the precision/recall tradeoff in a UX context.

        ---

        ## What this chapter will cover

        - The two speeds of fraud: streaming (real-time, milliseconds) and batch (post-hoc, hours/days).
- The precision/recall knife-edge: false positives are a UX emergency, false negatives are a money emergency.
- Streaming fraud detection: feature extraction in milliseconds, model inference, decisioning.
- Batch fraud detection: graph analysis, network detection, the patterns streaming can't see.
- The human-in-the-loop: when to escalate, when to auto-block, when to ask the user.
- Adversarial drift: fraudsters adapt. Your model must adapt faster. The retraining arms race.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Apply → Evaluate.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [A.0](../01-ml-system-design/a0-the-model-that-got-worse-on-monday.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#fraud-detection).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: The 3am Fraud Alarm`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
