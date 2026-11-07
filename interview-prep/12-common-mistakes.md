# Common Mistakes — How Candidates Lose

Every item here is a real, repeated pattern (the course's videos, the field guide's research, and every mock we've graded). T-48h before an interview: read once, wince at the three you'd make, fix those.

## Process mistakes (lose the interview in the first 10 minutes)

1. **Drawing before clarifying.** The #1 killer. Requirements exist so you don't architect the wrong thing. 4–6 questions, then boxes.
2. **Silent thinking.** Dead air reads as floundering. Think *out loud* — "I'm considering two options here, A versus B because…" is the whole game.
3. **Accepting zero numbers.** If the interviewer says "large scale," you ask "like 10K or 10M users a day?" Vague in, vague out — and vague never passes.
4. **No time awareness.** Minute 25 still on requirements = fail. The framework's clock is a survival skill.
5. **Arguing with a hint.** When redirected, "you're right — that changes the caching choice because…" scores *higher* than never being redirected. Defensive candidates fail; adaptive ones pass.

## Content mistakes (lose it in the middle 25)

6. **Tool-first thinking.** "I'd use LangChain and Pinecone" is a citation, not a design. Category → choice → reason → swap-condition (ai-stack/README).
7. **No failure modes.** Every system you design gets asked "what breaks?" Have three: one load, one data, one model. Detection before mitigation.
8. **"We'll monitor it."** With what metric, against what threshold, alerting whom, sustained how long? (Cheatsheet #8 exists for this moment.)
9. **Forgetting the bill.** LLM systems have per-request *cash* costs. A design without a cost line is half a design — quote the cost tree (x2).
10. **Hallucination shrug.** "LLMs hallucinate, we add human review" — the Air Canada case is the counterargument (FN-04). Measured refusal rates, guardrail layers, liability scoping: the answer is a stack, not a shrug.
11. **Offline metrics as truth.** "My AUC is 0.93" → "would you ship on that?" → A/B test, guardrails, peeking discipline (a8). Say the gap *before* they probe it.
12. **The gold-plated v1.** Designing fine-tuning, multi-agent, and personalization into day one. Senior is what you *don't* build (seniority ladder).

## AI-specific mistakes (the tells that read "hasn't shipped")

13. **No data freshness story.** Where do docs come from? What happens when they change? CDC, re-embed, cache invalidation (ai-stack/data-pipelines).
14. **Eval as an afterthought.** "We'd test some questions." Which set? Versioned? CI-gated? Faithfulness measured how? (b4's tiers, said in two sentences.)
15. **Context windows are free.** Stuffing 200K tokens because it fits. Cost × attention dilution × "lost in the middle" — you did the math in b1/b3.
16. **Agents without budgets.** Infinite loops, runaway costs — the four killers (c1). "Max steps, max tokens, dead-letter, kill switch" — four phrases, ten seconds, huge signal.
17. **Vector DB as a noun.** Filtered search, upserts, re-index behavior, memory math — cheatsheet #4's four questions. "Pinecone" is not an answer to any of them.

## Behavioral mistakes (lose it in the last 10)

18. **Invented war stories.** Every claim gets probed twice. Your lab numbers survive probing — that's why they exist.
19. **Failure stories without learning.** "I leaked data into features, caught it because my time-split metric collapsed, and now every rolling feature gets a shift-audit" — mistake, detection, durable fix. That's the shape.
20. **No questions for them.** "How do you evaluate model changes here?" signals exactly the seniority you're claiming.

## The meta-mistake

Reading this list and changing nothing. Pick your three — the ones that made you wince — and drill their antidotes in one mock each. That's what mocks are for.
