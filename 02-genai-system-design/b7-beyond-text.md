---
chapter_id: B.7
title: "Beyond Text"
topic: "Multimodal generation"
track: genai
bloom_stage: ["apply", "analyze"]
est_read_minutes: 16
prerequisites: ["B.0", "B.2"]
teaching_goal: "Learner can design a multimodal pipeline with image/text/audio inputs, reason about embedding alignment, and identify the cost cliff of cross-modal calls."
primary_diagram: assets/diagrams/B.7/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#multimodal"
status: coming-soon
last_updated: 2026-08-10
---
        # Beyond Text

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        Text is easy. Images are expensive. Audio is the worst of both. The moment your AI system has to handle more than text — a photo, a voice memo, a PDF — the cost, latency, and complexity all jump. This chapter is about navigating that cliff without falling off.

        ---

        ## Teaching goal

        Learner can design a multimodal pipeline with image/text/audio inputs, reason about embedding alignment, and identify the cost cliff of cross-modal calls.

        ---

        ## What this chapter will cover

        - Multimodal inputs: image, audio, video, structured data. The new design surface.
- Multimodal outputs: image generation, audio synthesis, structured documents.
- Embedding alignment: how a text embedding and an image embedding end up in the same vector space.
- The cost cliff: image tokens are 5-50x more expensive than text tokens. Audio transcription is metered by the minute.
- Pipeline design: when to transcribe (audio → text), when to embed directly, when to use a multimodal model.
- Production pattern: route by modality. Cheap text path, expensive multimodal path, never the twain shall meet.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Apply → Analyze.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [B.0](../02-genai-system-design/b0-the-box-that-predicts-the-next-word.md), [B.2](../02-genai-system-design/b2-the-librarian-who-never-forgets.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#multimodal).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: Beyond Text`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
