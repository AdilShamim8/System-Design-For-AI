# Mock 9 — Design a Voice Assistant for Doctors' Clinical Notes

**45 minutes.** Interviewer reads the prompt, candidate drives. Timer segments: 10 clarify + scope · 20 architecture · 10 deep dive · 5 curveballs. The interviewer's job is to push ONE level past the candidate's comfort — the deep dive is where levels are decided.

## The prompt

You're the first AI engineer at a health-tech startup. Doctors want to dictate clinical notes instead of typing them: 50 doctors now, 500 target. Requirements: real-time dictation into structured notes (SOAP format), medical terminology accuracy, HIPAA compliance, and notes must never contain invented content — a hallucinated medication is a patient-safety incident, full stop. Dictation happens in exam rooms, sometimes with background noise. Doctors will NOT review edits more than 30 seconds per note. Budget: $40/doctor/month for AI spend.

## Candidate-quality walkthrough

A strong candidate structures this as three pipelines sharing a spine.

**Clarify (don't skip):** latency tolerance ("dictate real-time" — is that live transcription with a visible ghost text, or turn-around within a minute?), the review workflow (does the doctor sign the note, or does it go to the EHR as draft?), error budget per field type (medication dosage vs social-history color), and what HIPAA actually constrains (BAA with every vendor in the pipeline — audio, transcription, LLM — or on-prem/deployment-in-region).

**Architecture — the three pipelines:**
1. **Audio → text:** streaming ASR with medical fine-tuning (Whisper-class or a medical-vertical API), partial hypotheses for live ghost text, final transcript with word-level timestamps and confidence. The word confidences become the review UI's highlighting — the doctor's 30 seconds should aim at the low-confidence spans, not the whole note. Endpointing (detecting the doctor finished) needs care in noisy rooms: speaker verification + a push-to-talk fallback beats pure VAD when the accuracy bar is clinical.
2. **Text → structured note:** LLM extraction into the SOAP schema with *constrained output* — a JSON schema the model must fill, plus a rule that any field with no supporting transcript span is left empty, never guessed. This is Q-GEN-12's structured-output lesson at clinical stakes: a field with a plausible-looking invented value is worse than an empty field flagged for review. Retrieval over the patient's prior notes + the clinic's templates grounds the summary sections (RAG, not free generation).
3. **The verification layer:** medication names and dosages checked against a drug database (deterministic code — never a model's memory); flagged discrepancies block the note's completion until the doctor confirms. Numbers in the transcript vs numbers in the note: an exact-match check. The system's core product is *making the doctor's 30 seconds maximally effective*, so the UI surfaces: low-confidence spans (ASR), unsupported fields (extraction), database mismatches (medications) — three risk layers, three visual treatments.

**HIPAA spine:** BAA-chained vendors (or in-region deployment for the audio path — the audio is the most sensitive artifact), audit logs of every transformation (Q-AG-11's append-only decision log), and a retention policy where raw audio is deleted after final-note sign-off (the transcript is the medical record input; the audio is scaffolding).

**Cost:** dictation ~10 min/doctor/day ≈ 600–900 audio-seconds/day; ASR at ~$0.006–0.01/min ≈ $1.50–3/doctor/month; extraction ~8K tokens/note × 20 notes/day at mid-tier routed ≈ $15–25/doctor/month; total ~$20–30 — inside the $40 budget with headroom, and routing (b6) buys the margin. Say the budget and the numbers; it's the difference between a designer and an engineer.

**The honest limits:** the system can guarantee *no invented medications* (database check) and *no unverified low-confidence text silently passing* (highlighting + empty-field policy); it cannot guarantee the note captures everything the doctor meant — that's the review workflow's job, and the 30-second design is how you make that workflow real.

## The curveballs

1. **"The ASR mis-hears a drug name as a similar-sounding one — 'Cipro' vs 'Zithro' — and the drug DB check passes because both are real. What now?"** — The strong answer: this is the phonetic-confusion class; defense is (a) the drug check should compare against the *acoustic neighbors* of the heard name, not just existence; (b) the extraction prompt receives word confidences and must flag low-confidence drug tokens for review — always; (c) the honest residual: some will pass, which is why the doctor signs the note and the sign-off is a logged human decision, not a formality. The weak answer treats it as an ASR problem to "improve" — you can't tune your way out of a phonetic ambiguity; you design the review to catch it.
2. **"The doctor dictates in Spanish. Halfway. Everything you built is English."** — Language detection at the ASR tier, a multilingual extraction prompt evaluated per language (Q-GEN-11's whole lesson: per-language eval sets, language-filtered retrieval, or query-translate; and the drug DB check now needs the Spanish name mapping). The honest answer includes "the UI review design matters MORE now — the doctor's 30 seconds is the last line of defense."
3. **"Regulation changes: audio of EU patients must be processed in-EU, and your ASR vendor is us-east only."** — Q-CC-11's residency analysis: per-region data plane (EU audio → EU-processed), global control plane, and the degenerate case designed for refusal: "if the EU ASR tier is down, EU dictation queues rather than routing to us-east" — a product behavior, not an incident.

## Scoring rubric (grade yourself honestly)

- **Junior:** draws ASR → LLM → note; knows the pieces. Misses: constrained output, the verification layers, cost, HIPAA's vendor-chain implication.
- **Mid:** adds the structured-output schema, the empty-field rule, confidence surfacing, and a cost estimate with numbers. Handles curveball 1 with the acoustic-neighbor idea when pushed.
- **Senior:** opens with the review workflow as the product ("we're designing 30 seconds of a doctor's attention"), prices failure (patient-safety incident framing), separates deterministic checks (drug DB, number match) from probabilistic ones (extraction quality), designs the refusal/queue behaviors for residency, and says what they'd NOT build v1 (no auto-EHR-writeback until the sign-off telemetry earns it).
- **Staff:** everything senior, plus: the platform fork (one clinic's assistant vs a HIPAA-compliant notes platform other features build on), the two-year failure modes (vendor BAA changes, model deprecations mid-deployment), and the org answer (who reviews the audit logs; what the incident drill looks like).

**Grounding:** Chapters B.7, X.1, C.5 · Labs b7, b8 · Q-GEN-12, Q-CC-11 · FN-04
