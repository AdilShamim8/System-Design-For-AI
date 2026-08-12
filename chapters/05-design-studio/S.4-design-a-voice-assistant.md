---
chapter_id: "S.4"
title: "Design a Voice Assistant"
topic: "Capstone: voice assistant"
track: capstone
bloom_stage: ["create"]
est_read_minutes: 22
prerequisites: ["B.7", "C.1", "0.2", "X.2"]
teaching_goal: "Design a voice assistant with multimodal input/output, the agent loop, latency budgets, and reliability under non-determinism."
status: stable
last_updated: "2026-08-12"
---

# Design a Voice Assistant

Voice breaks everything. The user can't see a loading spinner. They can't read a "thinking..." indicator. They speak, they expect a response, and if it takes more than a second, they assume it's broken. Designing a voice assistant is designing under the tightest latency budget in AI.

---

## The brief

- A voice assistant for a smart home device
- <800ms response time, multi-turn conversation
- Can control devices (lights, thermostat, music)

---

## The architecture

**The pipeline:** audio in -> ASR (150ms) -> LLM (400ms) -> TTS (200ms) -> audio out. Total: ~750ms.

**Optimizations:**
- **Intent classification shortcut**: for common commands ("turn off the lights"), skip the LLM. A fast classifier routes directly. Saves 400ms.
- **Streaming**: stream ASR -> LLM -> TTS. First audio chunk plays before full response generated.
- **Small model**: use Haiku or GPT-4o-mini, not Sonnet. 300ms vs 1.8s.

With these: simple commands ~350ms, complex queries ~650ms. Both under budget.

**The agent loop:** plan (understand intent) -> act (control devices) -> observe (confirm action) -> respond (speak).

**Reliability:** ASR errors (user said "68" but ASR heard "60"), LLM hallucinations (structured JSON commands, validated before execution), TTS mispronunciations. Each stage can fail. Fallback: "I didn't catch that, can you repeat?"

---

## A common misconception

**"Voice assistants are just chatbots with ASR and TTS bolted on."** No. The latency budget changes everything. A chatbot can take 2 seconds; a voice assistant must respond in <1 second.

---

## Explain it back

> "The voice assistant pipeline is _____ -> _____ -> _____. The latency budget is _____ms. The three optimizations are _____, _____, and _____. For voice, _____ is quality."

---

## References

- **See chapters B.7, C.1, 0.2, X.2 for component patterns.**
- **OpenAI Realtime API.** Streaming voice interactions. https://platform.openai.com/docs/guides/realtime
- **Google Dialogflow.** Voice assistant platform. https://cloud.google.com/dialogflow
- **Amazon Alexa Skills Kit.** Voice assistant design patterns. https://developer.amazon.com/alexa
