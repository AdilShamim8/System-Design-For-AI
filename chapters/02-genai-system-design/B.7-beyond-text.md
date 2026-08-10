---
chapter_id: "B.7"
title: "Beyond Text"
topic: "Multimodal generation"
track: genai
bloom_stage: ["apply", "analyze"]
est_read_minutes: 16
prerequisites: ["B.0", "B.2"]
teaching_goal: "Design a multimodal pipeline with image/text/audio inputs, reason about embedding alignment, and identify the cost cliff."
primary_diagram: assets/diagrams/B.7/
common_misconception: "See chapter body"
status: stable
last_updated: 2026-08-10
---

# Beyond Text

Text is easy. Images are expensive. Audio is the worst of both. The moment your AI system has to handle more than text — a photo, a voice memo, a PDF — the cost, latency, and complexity all jump. This chapter is about navigating that cliff without falling off.

---

## Remember

**Multimodal** — handling multiple input types (text, image, audio, video). **Embedding alignment** — mapping different modalities into a shared vector space. **Cost cliff** — multimodal tokens are 5-50x more expensive than text tokens. **Modality routing** — routing by input type: text-only path (cheap), multimodal path (expensive). **ASR (Automatic Speech Recognition)** — converting audio to text. **TTS (Text-to-Speech)** — converting text to audio.

---

## Understand

Multimodal systems handle more than text. An image, a voice memo, a PDF — each is a different modality, and each has different cost, latency, and quality characteristics.

**The cost cliff.** Text tokens are cheap (~$3/1M for Claude Sonnet). Image tokens are 5-50x more expensive — a single image can consume 1,000+ tokens. Audio transcription is metered by the minute. Sending every multimodal request to a frontier model is how you get $80K bills (see X.4, Q-GEN-4).

**Embedding alignment.** How does a model 'understand' an image and text together? Multimodal models (like CLIP, GPT-4o, Gemini) map both into a shared vector space. An image of a cat and the text 'a photo of a cat' end up with similar vectors. This alignment is what enables cross-modal search ('find images matching this text description').

**The production pattern: modality routing.** Don't send every request through the expensive multimodal path. Route by modality:
- **Text-only requests** → cheap text model. Most requests.
- **Image + text** → multimodal model, but only if the image is necessary.
- **Audio** → transcribe first (ASR), then treat as text. Cheaper than direct audio processing.

This can cut costs 10x without sacrificing quality, because most requests don't actually need the multimodal path.

---

## Apply

Design a content moderation system for images + text:
1. **Text path** (70% of requests): text-only model, classifies text safety. Cheap.
2. **Image path** (30%): text model classifies the caption; if ambiguous, multimodal model classifies the image. Expensive, but only 5-10% of total requests reach this stage.
3. **Caching**: hash-based cache for exact duplicates (common in moderation).

Result: 70% of requests are cheap, 25% are moderate, 5% are expensive. Overall cost is 10x lower than sending everything through the multimodal model.

---

## Analyze

The cost cliff isn't just about money — it's about latency too. Multimodal models are slower (more compute per request). For real-time applications (voice assistants, live chat), the latency budget may force you to transcribe audio → process as text → synthesize response, rather than using an end-to-end audio model. The tradeoff: lower quality (transcription loses nuance) but acceptable latency.

---

## Evaluate

When building multimodal systems, ask: does this *need* to be multimodal? Many 'multimodal' features can be decomposed: transcribe audio to text, OCR images to text, then process as text. This is cheaper and often higher quality (text models are more mature than multimodal ones). True multimodal processing (where the model reasons about the image *as an image*) is needed for tasks like 'describe what's unusual about this photo' — not for 'extract the text from this receipt.'

---

## Create

Design a multimodal assistant for a medical application. Doctors upload photos of symptoms, X-rays, and text descriptions. The assistant suggests possible diagnoses. What modalities? How do you route? How do you handle the high stakes (wrong suggestions are dangerous)? What's the latency budget for a doctor waiting during a patient visit?

---

## A common misconception

**'Multimodal is always better.'** No. Multimodal is more expensive, slower, and often unnecessary. If the task can be solved with text (after transcription or OCR), do that. Use true multimodal processing only when the task requires reasoning about the image/audio *as an image/audio*, not just extracting its text.

---

## Explain it back

Multimodal systems handle _____. The cost cliff is _____. Embedding alignment works by _____. The production pattern is _____, which means _____. The question to ask before building multimodal is _____.

---

## Further reading

- **Radford et al. (2021), "Learning Transferable Visual Models from Natural Language Supervision" (CLIP), ICML** — the foundational multimodal embedding paper.
- **OpenAI GPT-4V documentation** — multimodal capabilities and pricing.
- **Google Gemini documentation** — native multimodal model.
