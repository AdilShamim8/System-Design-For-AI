---
chapter_id: X.0
title: "The Pipes Behind the Magic"
topic: "Infrastructure & MLOps basics"
track: cross-cutting
bloom_stage: ["understand", "apply"]
est_read_minutes: 16
prerequisites: ["0.0", "A.0"]
teaching_goal: "Learner can describe the substrate of an AI system (compute, serving, registries, pipelines) and the deploy/monitor/retrain loop."
primary_diagram: assets/diagrams/X.0/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#mlops"
status: coming-soon
last_updated: 2026-08-10
---
        # The Pipes Behind the Magic

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        The model gets the glory. The infrastructure gets the bill. Behind every 'AI-powered feature' is a layer of compute, storage, pipelines, and operational discipline that determines whether the feature ships and whether it survives. This chapter is that layer.

        ---

        ## Teaching goal

        Learner can describe the substrate of an AI system (compute, serving, registries, pipelines) and the deploy/monitor/retrain loop.

        ---

        ## What this chapter will cover

        - Compute: CPU vs. GPU vs. TPU. When each matters. The cost difference that drives every architectural decision.
- Serving patterns: real-time (low latency, high cost), batch (high latency, low cost), streaming (in between).
- Model registries: versioning models the way you version code. The artifact, the metadata, the lineage.
- Pipelines: the DAG of data → train → evaluate → deploy. The 'CI/CD for ML' that most teams underbuild.
- The deploy/monitor/retrain loop: production is never 'done.' The operational discipline that keeps ML alive.
- MLOps vs. DevOps: what's the same, what's different, what traditional SREs get wrong about ML.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Understand → Apply.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [0.0](../00-start-here/0.0-the-friday-night-problem.md), [A.0](../01-ml-system-design/a0-the-model-that-got-worse-on-monday.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#mlops).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: The Pipes Behind the Magic`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
