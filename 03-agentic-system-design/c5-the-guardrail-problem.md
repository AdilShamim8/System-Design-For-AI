---
chapter_id: C.5
title: "The Guardrail Problem"
topic: "When the loop runs away"
track: agentic
bloom_stage: ["evaluate", "create"]
est_read_minutes: 17
prerequisites: ["C.1", "C.2"]
teaching_goal: "Learner can design guardrails (input/output validation, loop budgets, kill switch) and identify failure patterns from real runaway-agent incidents."
primary_diagram: assets/diagrams/C.5/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#guardrails"
status: coming-soon
last_updated: 2026-08-10
---
        # The Guardrail Problem

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        An agent is given a task. It starts well. It loops. It calls a tool that costs $5 per call. It loops. It calls the tool 1,000 times in 20 minutes. It loops. By the time anyone notices, the bill is $5,000 and the task isn't done. This is the guardrail problem — and every agent team learns it the expensive way.

        ---

        ## Teaching goal

        Learner can design guardrails (input/output validation, loop budgets, kill switch) and identify failure patterns from real runaway-agent incidents.

        ---

        ## What this chapter will cover

        - The failure modes: runaway loops, tool abuse, infinite refinement, context bloat, silent drift.
- Input guardrails: validate user requests before the agent sees them. Block malicious prompts, rate-limit abusers.
- Output guardrails: validate agent responses before they reach the user. Block PII, block harmful content, block nonsense.
- Loop budgets: hard caps on iterations, tokens, dollars, wall-clock. Enforced by the orchestrator, not the LLM.
- The kill switch: how a human (or another agent) can interrupt a running agent. The 'pause' button that must exist.
- Real incident patterns: the Air Canada chatbot, the NYC MyCity bot, the $5K agent loop. What each teaches.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Evaluate → Create.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [C.1](../03-agentic-system-design/c1-the-loop-that-wont-stop.md), [C.2](../03-agentic-system-design/c2-the-tools-in-the-toolbox.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#guardrails).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: The Guardrail Problem`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
