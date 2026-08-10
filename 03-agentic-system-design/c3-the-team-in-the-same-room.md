---
chapter_id: C.3
title: "The Team in the Same Room"
topic: "Multi-agent & A2A"
track: agentic
bloom_stage: ["analyze", "evaluate"]
est_read_minutes: 18
prerequisites: ["C.1", "C.2"]
teaching_goal: "Learner can design multi-agent orchestration patterns (supervisor, swarm, hierarchical), describe A2A protocol, and reason about the coordination tax."
primary_diagram: assets/diagrams/C.3/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#multi-agent"
status: coming-soon
last_updated: 2026-08-10
---
        # The Team in the Same Room

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        One agent is powerful. Two agents are complicated. Five agents are a meeting. Multi-agent systems promise the productivity of a team — but they also inherit the coordination overhead of one. This chapter is about when the team is worth the meeting.

        ---

        ## Teaching goal

        Learner can design multi-agent orchestration patterns (supervisor, swarm, hierarchical), describe A2A protocol, and reason about the coordination tax.

        ---

        ## What this chapter will cover

        - Why multiple agents: specialization. A researcher agent, a writer agent, an editor agent — each better at its job than a generalist.
- Orchestration patterns: supervisor (one boss, many workers), swarm (peer-to-peer), hierarchical (managers of managers of workers).
- The Agent-to-Agent (A2A) protocol: a standard for agents to communicate. The shared language that makes the team possible.
- The coordination tax: every cross-agent message costs latency, tokens, and risk of misunderstanding.
- When multi-agent wins: genuinely separable subtasks, parallelizable work, specialization that matters.
- When multi-agent loses: tightly coupled tasks where the coordination overhead exceeds the specialization benefit.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Analyze → Evaluate.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [C.1](../03-agentic-system-design/c1-the-loop-that-wont-stop.md), [C.2](../03-agentic-system-design/c2-the-tools-in-the-toolbox.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#multi-agent).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: The Team in the Same Room`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
