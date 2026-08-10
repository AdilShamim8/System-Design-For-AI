---
chapter_id: C.0
title: "The Bot That Thinks vs the Bot That Talks"
topic: "What makes an agent"
track: agentic
bloom_stage: ["remember", "understand"]
est_read_minutes: 14
prerequisites: ["B.0"]
teaching_goal: "Learner can distinguish an agent from a chatbot on three dimensions: action-taking, environment-state, and termination behavior."
primary_diagram: assets/diagrams/C.0/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#agentic-ai"
status: coming-soon
last_updated: 2026-08-10
---
        # The Bot That Thinks vs the Bot That Talks

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        A chatbot tells you how to book a flight. An agent books the flight. The difference is one word — 'action' — and that word is the entire premise of Track C. This chapter is the conceptual threshold: everything before it is AI that talks, everything after it is AI that acts.

        ---

        ## Teaching goal

        Learner can distinguish an agent from a chatbot on three dimensions: action-taking, environment-state, and termination behavior.

        ---

        ## What this chapter will cover

        - The three dimensions: action-taking, environment-state, termination behavior.
- Chatbot: produces text, no environment state, terminates when the user stops asking.
- Agent: takes actions, maintains and modifies state, terminates when the task is done.
- The borderline cases: is a chatbot with tools an agent? Is a workflow with LLM steps an agent? The spectrum.
- Why the distinction matters: agents can do harm. Chatbots can only waste your time.
- Setting up the rest of Track C: the loop, the tools, the memory, the guardrails.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Remember → Understand.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [B.0](../02-genai-system-design/b0-the-box-that-predicts-the-next-word.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#agentic-ai).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: The Bot That Thinks vs the Bot That Talks`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
