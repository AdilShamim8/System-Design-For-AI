# Path: From Student / Beginner

**You are:** a student or early-career learner with some Python (variables, loops, functions, maybe a pandas tutorial) and no production experience. Everything about "systems" is new. Good — you have no bad habits and (we assume) some schedule flexibility.

**How this path works:** you follow the course spine in order, with three beginner-specific rules:

1. **Never skip the lab.** Chapters make sense; labs make skill. If a week is tight, cut reading, not doing.
2. **Write everything down.** Keep a lab journal: one paragraph per lab — what you built, what broke, what you'd change. This journal becomes your interview story bank.
3. **Explain it back, always.** Every chapter's closing checkpoint is done out loud, to a friend, a rubber duck, or your phone's voice recorder.

**Realistic timeline:** 16–20 weeks at 8–10 hours/week. That is one serious semester. Students who try to do it in a month retain nothing — spaced repetition is the point of the flashcards and the Review step.

---

## What you have that career-switchers don't

- **Time.** Working engineers do this course in stolen evenings; you can do labs properly, including the optional extensions.
- **No legacy mental model.** You won't complain that LLMs "aren't real engineering" — you'll just learn how they fail.
- **A portfolio-shaped goal.** Every lab here is a commit; the capstone is a public project. By week 20 you'll have receipts, not certificates.

## The sequence (do not reorder)

The course is layered: foundations → classical ML → GenAI → agents → cross-cutting → capstones. Beginners sometimes want to jump straight to "build a chatbot" (Track B). Don't. Track B assumes you can reason about latency, caching, and evaluation — which Track A teaches on simpler, deterministic systems where cause and effect are still visible.

| Weeks | Read | Do | Milestone |
|---|---|---|---|
| 1–2 | 0.0–0.3 | Setup, start Lab a1 | Can explain the four questions; environment works |
| 3–4 | A.0, A.6, A.1 | Finish a1, start a2 | First model served behind an API |
| 5–6 | A.2, A.5 | Finish a2, do a3 | Can whiteboard the three-stage recommender |
| 7–8 | A.4, A.7 | a4, a7 | Can explain drift with the fraud example |
| 9–10 | A.3, X.2 | a5, a8 | Search ranking + A/B testing without peeking |
| 11–12 | B.0–B.2 | b1, start b2 | Token cost math on real prices; RAG chapter |
| 13–14 | B.3–B.5 | b2, b3 | RAG built from scratch — your flagship lab |
| 15 | B.6, B.8 | b4, b5 | Can defend chunk size and top-k with your own numbers |
| 16 | B.7, B.1 | b7 or b8 | Multimodal or structured outputs (pick one) |
| 17–18 | C.0–C.5 | c1, c2 | Agent loop from scratch; tool contracts |
| 19 | X.0–X.5 | x1 or x2 | Monitoring or cost (do x2 if choosing) |
| 20 | S.1, S.2 | Capstone cap1 + mocks 1, 4 | Ship something public; two mock interviews |

---

## Your interview profile

**Strengths (if you follow the plan):** freshness of the full stack. You'll have touched serving, RAG, agents, evaluation, and cost — many mid-career candidates have only done two of those.

**Blind spots to patch:**
- **No war stories** → that's what `field-notes/` is for. Learn FN-02 (Zillow), FN-04 (Air Canada), FN-11 (Netflix Prize) cold; citing a real incident with its root cause *is* a war story in an interview.
- **Whiteboard panic** → every mock interview in `interview-prep/mock-interviews/` has a time budget; rehearse with a literal timer, on paper.
- **Tool-name dropping** ("I'd use LangChain") — the #1 junior tell (see `interview-prep/10-common-mistakes.md`). This course makes you build the loop once by hand (c1) precisely so you can say what the framework does for you.
- **Resume claims you can't defend.** Every line on your resume should map to a lab or the capstone. If you can't draw its architecture in 60 seconds, don't claim it.

**First 48 hours:** set up the environment (`labs/setup/`), read Chapter 0.0 (the Friday night problem), and write your first lab-journal entry — even if it's just "the spinner spun because the *system*, not the app, fell over."
