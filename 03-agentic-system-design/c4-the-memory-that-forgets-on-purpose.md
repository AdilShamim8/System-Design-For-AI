---
chapter_id: C.4
title: "The Memory That Forgets on Purpose"
topic: "Agent memory"
track: agentic
bloom_stage: ["apply", "evaluate"]
est_read_minutes: 16
prerequisites: ["C.1"]
teaching_goal: "Learner can design short-term and long-term memory for an agent, justify intentional forgetting, and treat the memory store as a first-class component."
primary_diagram: assets/diagrams/C.4/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#agent-memory"
status: coming-soon
last_updated: 2026-08-10
---
        # The Memory That Forgets on Purpose

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        An agent that remembers everything drowns in its own context. An agent that forgets everything repeats its own mistakes. The art of agent memory is the art of forgetting on purpose — keeping what matters, dropping what doesn't, and knowing which is which.

        ---

        ## Teaching goal

        Learner can design short-term and long-term memory for an agent, justify intentional forgetting, and treat the memory store as a first-class component.

        ---

        ## What this chapter will cover

        - Short-term memory: the context window. What the agent is holding in mind right now. Limited, expensive, immediate.
- Long-term memory: persistent storage across sessions. The agent's notebook, not its working memory.
- The case for intentional forgetting: context windows are finite. Irrelevant history crowds out relevant present.
- Memory strategies: sliding window (drop oldest), summarization (compress history), relevance-based (keep only what's useful now).
- The memory store as a first-class component: not an afterthought, but a designed system with its own schema, queries, and policies.
- Memory and personalization: long-term memory is what makes an agent 'know' a user over time.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Apply → Evaluate.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [C.1](../03-agentic-system-design/c1-the-loop-that-wont-stop.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#agent-memory).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: The Memory That Forgets on Purpose`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
