---
chapter_id: X.5
title: "When Production Breaks"
topic: "Real failure patterns from real incidents"
track: cross-cutting
bloom_stage: ["analyze", "create"]
est_read_minutes: 18
prerequisites: ["C.5", "X.2"]
teaching_goal: "Learner can analyze real public AI incidents, extract the design pattern that would have prevented each, and apply those patterns forward."
primary_diagram: assets/diagrams/X.5/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#case-studies"
status: coming-soon
last_updated: 2026-08-10
---
        # When Production Breaks

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        Air Canada's chatbot promised a refund the airline didn't intend to honor. A court said the airline had to honor it anyway. NYC's MyCity bot told businesses to break the law. A DPDP prompt leak exposed system prompts across the industry. These aren't footnotes — they're the case studies that should shape every design decision you make.

        ---

        ## Teaching goal

        Learner can analyze real public AI incidents, extract the design pattern that would have prevented each, and apply those patterns forward.

        ---

        ## What this chapter will cover

        - The Air Canada chatbot (2024): a chatbot's promise is the company's promise. The hallucination liability.
- The NYC MyCity bot (2024): a bot trained on a corpus gave legally wrong advice. The 'it sounded authoritative' trap.
- DPDP prompt leaks (2024): system prompts leaked through crafted user inputs. The injection surface.
- Runaway agent cost blowups (2024-2025): agents looping into five-figure bills. The budget enforcement gap.
- The pattern in every incident: a failure mode that was predictable, preventable, and only addressed after the fact.
- The design pattern that would have prevented each: guardrails, evals, isolation, budgets, human-in-the-loop.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Analyze → Create.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [C.5](../03-agentic-system-design/c5-the-guardrail-problem.md), [X.2](../04-cross-cutting/x2-confidently-wrong.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#case-studies).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: When Production Breaks`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
