---
chapter_id: B.1
title: "Prompting as a Design Surface"
topic: "Context engineering"
track: genai
bloom_stage: ["understand", "apply"]
est_read_minutes: 16
prerequisites: ["B.0"]
teaching_goal: "Learner can treat prompting as a system design surface: system prompts, few-shot, tool schemas, structured output, prompt-as-code discipline."
primary_diagram: assets/diagrams/B.1/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#prompt-engineering"
status: coming-soon
last_updated: 2026-08-10
---
        # Prompting as a Design Surface

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        A prompt is not a question. It's a program — written in natural language, interpreted by a neural network, debugged by rephrasing. The prompt is the API. This chapter is about treating it that way.

        ---

        ## Teaching goal

        Learner can treat prompting as a system design surface: system prompts, few-shot, tool schemas, structured output, prompt-as-code discipline.

        ---

        ## What this chapter will cover

        - The prompt as API: inputs, outputs, behavior, versioning. The mental shift from 'talking to the LLM' to 'programming the LLM.'
- System prompt vs. user prompt: the persona and rules vs. the actual question. Why separation matters.
- Few-shot prompting: examples in the prompt. When it helps, when it's noise, when it's better than fine-tuning.
- Tool schemas: telling the LLM what tools exist and how to call them. The JSON-shaped bridge to action.
- Structured output: forcing the LLM to emit JSON. Why this unlocks composition with traditional software.
- Prompt-as-code: versioning, testing, review. The discipline that separates demos from products.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Understand → Apply.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [B.0](../02-genai-system-design/b0-the-box-that-predicts-the-next-word.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#prompt-engineering).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: Prompting as a Design Surface`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
