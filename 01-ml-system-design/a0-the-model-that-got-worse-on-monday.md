---
chapter_id: A.0
title: "The Model That Got Worse on Monday"
topic: "The ML lifecycle"
track: ml
bloom_stage: ["remember", "understand"]
est_read_minutes: 16
prerequisites: ["0.0", "0.1"]
teaching_goal: "Learner can describe the data → training → serving → monitoring loop and explain why it's a loop, not a line."
primary_diagram: assets/diagrams/A.0/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#ml-lifecycle"
status: coming-soon
last_updated: 2026-08-10
---
        # The Model That Got Worse on Monday

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        The model worked on Friday. By Monday, support tickets were spiking. The data science team swore nothing changed. They were right — and wrong. Nothing in the code changed. But the world did, and the model was about to teach everyone why ML is never 'done.'

        ---

        ## Teaching goal

        Learner can describe the data → training → serving → monitoring loop and explain why it's a loop, not a line.

        ---

        ## What this chapter will cover

        - The four stages: data collection → training → serving → monitoring. Why it's a loop, not a line.
- Stage 1 — Data: where it comes from, why it's never clean, why 80% of ML work is here.
- Stage 2 — Training: the expensive offline phase. What 'training a model' actually means in compute terms.
- Stage 3 — Serving: the cheap online phase, but the one users feel. Latency, scale, the cold start.
- Stage 4 — Monitoring: the discipline that catches the 'Monday morning problem' before users do.
- The mystery introduced: why did the model get worse? The answer unfolds across Track A.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Remember → Understand.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [0.0](../00-start-here/0.0-the-friday-night-problem.md), [0.1](../00-start-here/0.1-why-ai-breaks-differently.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#ml-lifecycle).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: The Model That Got Worse on Monday`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
