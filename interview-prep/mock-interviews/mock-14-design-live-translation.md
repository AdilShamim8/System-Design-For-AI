# Mock 14 — Design Live Speech Translation for a Video Call

**45 minutes.** Interviewer reads the prompt, candidate drives. Timer segments: 10 clarify + scope · 20 architecture · 10 deep dive · 5 curveballs. The interviewer's job is to push ONE level past the candidate's comfort — the deep dive is where levels are decided.

## The prompt

Design real-time translation for video calls: 50 participants max, 8 language pairs at launch (say EN/ES/FR/DE/ZH/JA/PT/HI), latency budget under 1.5 seconds end-to-end from speech to translated captions, speaker diarization (who said what), and a transcript export afterwards. The honest constraint: translation quality degrades on domain jargon (this is for sales calls — pricing, contract terms, product names). 40K concurrent calls at peak. What's the architecture, and what do you tell the PM about the 1.5 seconds?

## Candidate-quality walkthrough

This mock separates audio-pipeline engineers from people who've read about ASR. The strong candidate structures it as a streaming graph with per-stage budgets.

**Clarify:** captions or synthesized voice? (Captions — cheaper, less latency, and the deaf/HoH accessibility case justifies the feature.) Is the 1.5s from END of sentence or from speech? (Must define — from last-word to caption-render is the honest metric.) Error tolerance: a mistranslated pricing number is a contract dispute; a stilted sentence is fine. Are both directions live? (Yes — the graph is per-language-pair, bidirectional.)

**The pipeline and its budget math (drill 23's math, extended):**
1. **Streaming ASR with partials:** Whisper-class streaming (or a low-latency vertical): partial hypotheses every 200-300ms let downstream start EARLY — the naive serial pipeline (finish ASR, then translate) burns the whole budget. Speaker diarization runs parallel on the audio stream (voice-print clustering per call — the call roster helps: known participants, enrollment at join).
2. **Incremental translation on the partial stream:** translate the stable prefix (the words that stopped changing) — retranslation of the tail is visible as caption churn, so the UI strategy is part of the design: show the stable translation, animate the streaming tail, cap rewrites per sentence (the UX and the pipeline co-design — say this, it's the senior tell).
3. **The numbers:** ASR partial at ~300ms, translate increment (200-500ms TTFT), caption render 100ms, network jitter 200ms — ~0.8-1.1s p50 achievable, 1.5s is a p95 target, not a promise. THE PM ANSWER: '1.5 seconds is a p95 on stable networks; on 5 percent of calls it will be worse, and the product needs a degraded mode (flagged delay, or English-ASR-only fallback) — latency SLOs for speech are distribution commitments, not constants.'
4. **Domain adaptation:** the jargon layer — a per-call glossary (product names, the deal terms from the CRM) injected as context into translation; company-specific terms pinned (never translate 'AcmeCloud'), and the honest residual: number and date formats get a deterministic post-check (a mistranslated price is the liability class — Q-GEN-12's billing lesson, now in speech).
5. **Scale:** 40K calls x ~0.3 speakers-active average = 12K concurrent streams x ~0.5 GPU-streams each on efficient serving = ~6K GPU-equivalents for ASR at peak, translation on CPU/GPU batch — this is a capacity-planning answer with numbers (drill 14's discipline applied to compute), plus regional deployment (latency is geography: each call routed to the nearest region's pipeline).

**The transcript export:** the ASR + diarization + translation logs, post-processed per call (punctuation, formatting) — a batch job on the event stream (X.0's shape), storage per data-retention policy, and the PII question answered: transcripts are call data with a retention clock, deletable on request.

## The curveballs

1. **"Two speakers overlap. Diarization merges them into one speaker with garbled translation. Fix?"** — Overlap is the known hard case: the honest architecture answer is (a) better separation upstream (source separation models exist but cost latency — make it an option per call tier), (b) confidence-tagged captions ('two voices detected' vs silently wrong), and (c) the export path can re-diarize offline where latency is free — live caption quality and transcript quality are different products with different budgets. The weak answer pretends overlap is solved; it is not, and the interviewer knows.
2. **"A customer demands: translation must never leave EU infrastructure. Your ASR models serve globally."** — Q-CC-11's residency analysis at streaming latency: models are not personal data (deploy the same weights per-region — the capacity bill doubles, the contract is satisfied); audio and transcripts stay in-region; and the degenerate case (an EU speaker and an US speaker on one call) is a product decision: the call runs in EU, the US participant eats the extra 100ms — residency beats symmetry, and you SAY the tradeoff out loud.
3. **"Quality complaints cluster on JA: the honorifics flatten, sales calls sound rude. Vendors show no fix. What now?"** — The Q-GEN-11 playbook in a new domain: per-language-pair dashboards (the aggregate CSAT hid this — per-slice metrics are the law), a JA-specific eval set from real call transcripts (graded by JA speakers), then the fix ladder: glossary/context injection first, a JA-specialized translation tier second, and the honest product answer — a tone register setting for JA calls (business vs casual) is a product feature that buys more satisfaction than 2 BLEU points ever will.

## Scoring rubric (grade yourself honestly)

- **Junior:** serial pipeline ASR-then-translate, knows diarization exists. Misses: partials, budget math, the degraded-mode answer, the glossary layer.
- **Mid:** streaming partials, incremental translation, per-stage latency numbers, diarization parallel. Handles curveball 3 with the eval-set instinct when pushed.
- **Senior:** the p95 distribution commitment to the PM, co-designed caption UX (rewrite caps), the glossary/pinned-terms layer with the deterministic number check, capacity math with GPU-equivalents, and regional residency from curveball 2 unprompted if asked about deployment.
- **Staff:** everything senior, plus: the platform fork (per-call translation vs a reusable streaming-media-inference service), the two-year bets (on-device ASR changing the capacity math; unified speech-to-speech models collapsing the pipeline), and the business frame: latency and language coverage ARE the product — the competition is human interpreters at $100/hour, and the honest roadmap prices against that.

**Grounding:** Chapters B.7, X.1, X.3 · Labs b8, x3 · Q-CC-11 · drill 23 · mock 9
