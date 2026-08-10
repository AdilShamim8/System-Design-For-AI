---
chapter_id: C.6
title: "The Agent That Drives Your Computer"
topic: "Computer-use & coding agents"
track: agentic
bloom_stage: ["analyze", "create"]
est_read_minutes: 18
prerequisites: ["C.1", "C.2", "C.5"]
teaching_goal: "Learner can reason about computer-use agents and coding agents as the frontier case, identify the sandboxing problem, and assess where existing design patterns hold up."
primary_diagram: assets/diagrams/C.6/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#computer-use"
status: coming-soon
last_updated: 2026-08-10
---
        # The Agent That Drives Your Computer

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        An agent that can click, type, and read the screen is an agent that can do almost anything a human can do on a computer. That's exhilarating and terrifying. This chapter is about the frontier — and whether the design patterns from earlier chapters actually hold up when the agent's environment is the same one you're using right now.

        ---

        ## Teaching goal

        Learner can reason about computer-use agents and coding agents as the frontier case, identify the sandboxing problem, and assess where existing design patterns hold up.

        ---

        ## What this chapter will cover

        - Computer-use agents: see the screen, move the mouse, type. The most general and most dangerous agent form.
- Coding agents: read and write code, run tests, push commits. The first agent form that's genuinely productive today.
- The sandboxing problem: an agent that can run code can run any code. Malicious, buggy, or both.
- Permission models: scoped tokens, restricted toolsets, human-in-the-loop for destructive actions.
- Where existing patterns hold: the loop, the budget, the guardrails all still apply.
- Where they break: the environment is adversarial. The screen may contain prompt injection. The filesystem may contain traps.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Analyze → Create.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [C.1](../03-agentic-system-design/c1-the-loop-that-wont-stop.md), [C.2](../03-agentic-system-design/c2-the-tools-in-the-toolbox.md), [C.5](../03-agentic-system-design/c5-the-guardrail-problem.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#computer-use).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: The Agent That Drives Your Computer`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
