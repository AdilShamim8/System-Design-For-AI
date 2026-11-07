# 11 — Interview: The Last 48 Hours

## T-48h — Content pass
- Reread `interview-prep/01-the-framework.md` until the 6 steps are reflex
- One full mock, timed, out loud, drawn on paper (not read!) — pick your weakest track's mock
- Cheatsheets 5 (latency) + 7 (estimation) + 9 (metrics): drill until the numbers are yours
- Three field notes cold: **FN-02** (Zillow — model risk), **FN-04** (Air Canada — liability), **FN-11** (Netflix — model ≠ value). One-liner + root cause + fix each

## T-24h — Material pass
- Your resume, line by line: every claim maps to a lab/capstone you can draw in 60 seconds
- Your two best artifacts ready to reference by URL: cap1/cap3 + a design doc (x4)
- Prepare 4 stories in STAR: a debugging story (a1/a7's leakage/latency), a shipping story (cap1), a failure story (any lab mistake you made), an evaluation story (b4/a8)

## T-12h — Logistics + head
- Charge, quiet room, water, backup connection, paper + pen for drawing
- Sleep. Non-negotiable — design interviews are thinking endurance, not recall

## In the room — the framework
1. **Clarify** (5 min): users, scale, read/write, latency, cost — *ask before drawing*
2. **Estimate** (5 min): QPS, storage, $/day — powers of ten, assumptions aloud
3. **High-level** (10 min): boxes and arrows; walk the happy path end-to-end
4. **Deep dive** (15 min): the interviewer's chosen corner — data model, failure modes, eval
5. **Tradeoffs** (5 min): what you gave up and why; what changes at 10×
6. **Close** (2 min): monitoring + rollout + "the riskiest assumption is…"

## The sentences that score
- "Let me put a number on that before I choose."
- "The failure mode I'd watch for is X; I'd detect it with Y."
- "Offline this looks like Z, but I'd A/B it — my offline/online gap in the labs was real."
- "I built a toy version of this — the numbers were…" *(only if true — your labs make it true)*

## The anti-patterns (10-common-mistakes.md, condensed)
Don't name a tool before the shape · don't draw without requirements · don't claim unbounded scale without the cost · don't say "LLMs hallucinate, oh well" — say the measured rate and the guardrail stack · don't argue when corrected — "you're right, that changes X" is a *senior* move.

## After
Write down every question you fumbled, same day. Each one becomes a flashcard (that's how the flashcard files were born — keep the habit alive).
