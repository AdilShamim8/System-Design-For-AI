---
chapter_id: X.3
title: "The Stethoscope on the System"
topic: "Evaluation & observability"
track: cross-cutting
bloom_stage: ["apply", "evaluate"]
est_read_minutes: 16
prerequisites: ["A.6", "B.8"]
teaching_goal: "Learner can design observability for AI: traces, spans, eval-in-production, drift signals, and explain why logging the prompt matters more than logging the response."
primary_diagram: assets/diagrams/X.3/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#observability"
status: coming-soon
last_updated: 2026-08-10
---
        # The Stethoscope on the System

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        The system is slow. Users are complaining. You look at your dashboards — CPU is fine, latency is fine, error rate is fine. Everything is fine, except the part where the system is broken. Traditional observability doesn't see AI problems. This chapter is about building the stethoscope that does.

        ---

        ## Teaching goal

        Learner can design observability for AI: traces, spans, eval-in-production, drift signals, and explain why logging the prompt matters more than logging the response.

        ---

        ## What this chapter will cover

        - Why AI observability is different: inputs and outputs are unstructured, failures are qualitative, drift is silent.
- Traces and spans: following a single request through the pipeline. The distributed tracing pattern applied to AI.
- Eval-in-production: sampling real traffic, grading outputs, feeding back into evals. The closed loop.
- Drift signals: input distribution drift, output distribution drift, ground-truth latency. The early warning system.
- Why logging the prompt matters more than logging the response: most failures originate upstream of the model.
- The observability stack: logs, metrics, traces, evals. Four pillars, one picture.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Apply → Evaluate.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [A.6](../01-ml-system-design/a6-two-models-walk-into-production.md), [B.8](../02-genai-system-design/b8-it-sounds-right-is-not-good-enough.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#observability).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: The Stethoscope on the System`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
