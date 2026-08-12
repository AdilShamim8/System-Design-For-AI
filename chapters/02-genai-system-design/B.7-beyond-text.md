---
chapter_id: "B.7"
title: "Beyond Text"
topic: "Multimodal generation"
track: genai
bloom_stage: ["remember", "understand", "apply", "analyze", "evaluate", "create"]
est_read_minutes: 16
prerequisites: ["B.0", "B.2"]
teaching_goal: "Design a multimodal pipeline with image/text/audio inputs, reason about embedding alignment, and identify the cost cliff."
status: stable
last_updated: 2026-08-12
---

# Beyond Text

Text is easy. Images are expensive. Audio is the worst of both. The moment your AI system has to handle more than text — a photo, a voice memo, a PDF — the cost, latency, and complexity all jump.

This chapter is about navigating that cliff without falling off. The key insight: most "multimodal" needs can be decomposed into text operations (transcribe audio, OCR images) at far lower cost than true multimodal processing.

---

## Remember — name it

- **Multimodal** — handling multiple input types (text, image, audio, video) in a single system.
- **Embedding alignment** — mapping different modalities into a shared vector space. An image of a cat and the text "a photo of a cat" get similar vectors. (Radford et al., 2021 — CLIP)
- **Cost cliff** — image tokens are 5-50x more expensive than text tokens. A single image can consume 1,000+ tokens.
- **Modality routing** — routing by input type: text-only path (cheap), multimodal path (expensive).
- **ASR (Automatic Speech Recognition)** — converting audio to text. Whisper (OpenAI), Deepgram.
- **TTS (Text-to-Speech)** — converting text to audio. ElevenLabs, OpenAI TTS.

---

## Understand — the cost cliff

Text tokens are cheap (~$3/1M for Claude Sonnet). Image tokens are expensive — a single image can consume 1,000-5,000 tokens depending on resolution. At Claude Sonnet pricing, one image costs $0.003-0.015. At 10,000 images/day, that's $30-150/day just for image processing.

Audio is metered differently — by the minute, not the token. OpenAI's Whisper: $0.006/minute. A 10-minute audio file costs $0.06 to transcribe.

The cost cliff is why you should route carefully: don't send everything through the expensive multimodal path. Use text-only when possible, multimodal only when necessary.

---

## Apply — modality routing for content moderation

Design a content moderation system for images + text captions:

1. **Text path (70% of requests)**: text-only model classifies the caption. If confident (safe or unsafe), skip the image. Cost: ~$0.001/request.
2. **Image path (30%)**: only when the text is ambiguous. Send to a multimodal model. Cost: ~$0.01/request.
3. **Caching**: hash-based cache for exact duplicates (common in moderation). 20-30% hit rate.

Result: 70% of requests are cheap ($0.001), 25% are moderate, 5% are expensive. Overall cost is 10x lower than sending everything through the multimodal model.

---

## Analyze — when to transcribe vs. process directly

**Transcribe first (audio → text → text model):**
- Cheaper (Whisper: $0.006/min vs. direct audio processing)
- More accurate (text models are more mature than audio models)
- Lower latency (text inference is faster)

**Process directly (audio → multimodal model):**
- Preserves tone, emotion, emphasis
- Needed for tasks like "is the speaker angry?"
- More expensive, slower

For most applications, transcribe first. Use direct audio processing only when the audio characteristics themselves matter (emotion detection, speaker identification).

---

## Evaluate — do you actually need multimodal?

Before building a multimodal system, ask: can this task be solved with text alone?

- **Receipt processing**: OCR the receipt → process the text. Cheaper than multimodal.
- **Image classification**: use a specialized image model (ResNet, ViT) → process the label. Cheaper than a multimodal LLM.
- **"Describe what's unusual about this photo"**: needs true multimodal — the model must *see* the image.
- **"Extract the text from this document"**: OCR → text. Cheaper than multimodal.

Use true multimodal processing only when the task requires reasoning about the image/audio *as an image/audio*, not just extracting its text content.

---

## Create — design a multimodal medical assistant

Doctors upload photos of symptoms, X-rays, and text descriptions. The assistant suggests possible diagnoses. What modalities? How do you route? How do you handle the high stakes (wrong suggestions are dangerous)? What's the latency budget for a doctor waiting during a patient visit?

Consider: medical images need specialized models (not general-purpose multimodal). The text description is crucial context. The latency budget is tight — doctors won't wait more than 10 seconds. And the stakes are high — a wrong suggestion could harm a patient.

---

## A common misconception

**"Multimodal is always better."** No. Multimodal is more expensive, slower, and often unnecessary. If the task can be solved with text (after transcription or OCR), do that. Use true multimodal processing only when the task requires reasoning about the image/audio itself.

---

## Explain it back

> "Multimodal systems handle _____. The cost cliff is _____. Embedding alignment works by _____. The production pattern is _____, which means _____. The question to ask before building multimodal is _____."

---

## References

- **Radford, A., et al. (2021), "Learning Transferable Visual Models from Natural Language Supervision" (CLIP), ICML 2021.** arXiv:2103.00020 — https://arxiv.org/abs/2103.00020
- **OpenAI GPT-4V Documentation.** Multimodal capabilities and pricing. https://platform.openai.com/docs/guides/vision
- **Google Gemini Documentation.** Native multimodal model. https://ai.google.dev/docs
- **OpenAI Whisper.** ASR model. https://openai.com/research/whisper
