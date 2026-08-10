---
chapter_id: "S.4"
title: "Design a Voice Assistant"
topic: "Capstone: voice assistant"
track: capstone
bloom_stage: ["create"]
est_read_minutes: 25
prerequisites: ["B.7", "C.1", "0.2", "X.2"]
teaching_goal: "Design a voice assistant with multimodal input/output, the agent loop, latency budgets, and reliability."
primary_diagram: assets/diagrams/S.4/
common_misconception: "See chapter body"
status: stable
last_updated: 2026-08-10
---

# Design a Voice Assistant

Voice breaks everything. The user can't see a loading spinner. They can't read a 'thinking...' indicator. They speak, they expect a response, and if it takes more than a second, they assume it's broken. Designing a voice assistant is designing under the tightest latency budget in AI. This capstone walks through it.

---

## Remember

This capstone combines: multimodal (B.7), the agent loop (C.1), latency budgets (0.2), and reliability (X.2).

---

## Understand

**The brief**: a voice assistant for a smart home device. <800ms response time, multi-turn conversation, can control devices (lights, thermostat, music).

**The pipeline:**
1. **Audio in** → ASR (Automatic Speech Recognition) → text.
2. **Text** → LLM → response text + any actions (control devices).
3. **Response text** → TTS (Text-to-Speech) → audio out.

**The latency budget (800ms total):**
- ASR: 150ms (streaming, starts processing as user speaks).
- LLM: 400ms (small model, streaming first token fast).
- TTS: 200ms (streaming, starts synthesizing as LLM generates).
- Network: 50ms.
- Total: 850ms. Slightly over budget — need to optimize.

**Optimizations:**
- **Intent classification shortcut**: for common commands ('turn off the lights'), skip the LLM entirely. A fast classifier detects the intent and routes directly to the action. Saves 400ms (the LLM latency) for these cases.
- **Streaming**: stream ASR → LLM → TTS. The first audio chunk plays before the full response is generated. Saves ~200ms of perceived latency.
- **Small model**: use Haiku or 4o-mini, not Sonnet or GPT-4o. 300ms vs 1.8s for the LLM call.

With these optimizations: simple commands (intent shortcut) = ~350ms. Complex queries (LLM) = ~650ms. Both under budget.

**The agent loop:**
- **Plan**: understand the user's intent.
- **Act**: control devices if needed (turn off lights, set thermostat).
- **Observe**: confirm the action succeeded.
- **Respond**: speak the response.

For voice, the loop is usually single-iteration (one command, one response). Multi-turn conversations are a sequence of single-iteration loops, with short-term memory maintaining context across turns.

**Reliability (X.2):**
- **ASR errors**: the user said 'set the thermostat to 68' but ASR heard 'set the thermostat to 60.' The system must handle this — either confirm ('setting to 68, correct?') or have a correction mechanism.
- **LLM hallucinations**: for device control, the LLM should output structured commands (JSON), not free-form text. The command is validated before execution.
- **TTS mispronunciations**: less critical, but can be jarring. Use a good TTS engine; for names and unusual words, pre-cache pronunciations.
- **Fallback**: if any stage fails, respond with 'I didn't catch that, can you repeat?' — don't execute wrong actions.

---

## Apply

**Step 1 — The pipeline.** ASR → LLM → TTS, with streaming between stages. Intent classifier as a shortcut for common commands.

**Step 2 — The agent loop.** Single-iteration for most commands. Multi-turn for conversations (with short-term memory).

**Step 3 — Latency budget.** 800ms total. Optimized through: small model, streaming, intent shortcut. Simple commands: 350ms. Complex queries: 650ms.

**Step 4 — Reliability.** Structured output (JSON commands) for device control. Validation before execution. Confirmation for destructive actions ('set thermostat to 68?' → user confirms → execute). Fallback for ASR/LLM failures.

**Step 5 — Tradeoffs.**
- **Streaming vs. batch**: streaming is faster but harder to handle (partial sentences, mid-stream errors). For voice, streaming is worth it.
- **Small model vs. large**: small is fast but less capable. Route complex queries to a larger model, accept the latency hit.
- **Autonomy vs. confirmation**: for 'turn off lights,' auto-execute. For 'set thermostat,' confirm. For 'unlock the door,' always confirm. Match the confirmation policy to the action's stakes.

---

## Analyze

Voice is the hardest AI surface because of latency. Users tolerate 2-second text responses; they don't tolerate 2-second voice responses (it feels broken). Every millisecond matters. The design is driven by the latency budget — every other consideration (model choice, architecture, features) is secondary to hitting the budget. This is why voice assistants use small models, streaming, and intent shortcuts — not because they're better, but because they're fast.

---

## Evaluate

A voice assistant that responds in <800ms feels magical. One that responds in 2s feels broken. The difference isn't the quality of the responses — it's the latency. This is the lesson: for voice, latency *is* quality. A fast, slightly-wrong response is better than a slow, perfect one. Optimize for speed first, quality second.

---

## Create

Redesign this for a voice assistant in a car. The user is driving (safety critical). The assistant can control navigation, music, climate, and phone calls. What additional safety guardrails? What's the latency budget (the user is driving, can't wait long)? How do you handle the fact that ASR is harder in a noisy car?

---

## A common misconception

**'Voice assistants are just chatbots with ASR and TTS bolted on.'** No. The latency budget changes everything. A chatbot can take 2 seconds to respond; a voice assistant must respond in <1 second or it feels broken. This forces different architectural choices: small models, streaming, intent shortcuts, and a relentless focus on latency over quality. Voice is a different design problem, not a chatbot with audio I/O.

---

## Explain it back

The voice assistant pipeline is _____ → _____ → _____. The latency budget is _____ms, broken down as: ASR _____, LLM _____, TTS _____. The three optimizations are _____, _____, and _____. For voice, _____ is quality — a fast, slightly-wrong response is better than _____.

---

## Further reading

- **See chapters B.7, C.1, 0.2, X.2 for the component patterns.**
- **OpenAI Realtime API** — streaming voice interactions.
- **Google Dialogflow** — voice assistant platform.
- **Amazon Alexa Skills Kit** — voice assistant design patterns.
