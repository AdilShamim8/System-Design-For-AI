# Question Bank

Practice questions for AI system design, framed as **scenarios** — not bare "design X" prompts.

The reason for the scenario framing: bare prompts test recall. Scenarios test reasoning. A bare prompt is "design a recommendation system." A scenario is "you're a new engineer at a podcast app with 500K shows and 1M users; the homepage 'For You' row has 10 slots and a 300ms budget; the existing system was built 3 years ago and is starting to feel stale. Walk me through your redesign."

The second one is harder. It's also closer to what real system design work looks like — and what real system design interviews test, when they're done well.

---

## How to use this bank

1. **Pick a track** below.
2. **Read the scenario.** Don't skim — the details matter.
3. **Sketch your design.** On paper, in a doc, out loud to a friend. System design is kinesthetic; the act of articulating matters.
4. **Check the worked answer.** Not for "the right answer" — there isn't one. Check it for the *reasoning pattern* a story-taught learner would use.
5. **Follow the cross-links.** Each question points to the curriculum chapters a stuck learner should read first.

---

## The tracks

- [ML System Design](./ml-questions.md) — recommendation, search, fraud, ads, content moderation.
- [GenAI / LLM System Design](./genai-questions.md) — RAG, multi-tenant SaaS, chat, multimodal, cost redesign.
- [Agentic AI System Design](./agentic-questions.md) — tool use, multi-agent, coding agents, memory, voice.
- [Cross-Cutting](./cross-cutting-questions.md) — evaluation, security, drift, the "$50K bill, fix it" scenario.

---

## Question format

Every question in this bank has:

```markdown
## Q-N — Hook title

**Scenario** (2-4 sentences of realistic context — who you are, what the system is, what's broken or being built).

**Track:** ml | genai | agentic | cross-cutting
**Difficulty:** easy | medium | hard
**Read first:** [chapter links]

**Your task:** (the actual design question, framed concretely).

---

### Worked answer (how a story-taught learner would reason through this)

[The reasoning pattern, not the final answer. Walks through how to think about it, not what to draw.]
```

---

## What this bank is NOT

- **Not a bare interview cram sheet.** If you want that, [ai-system-design-guide's 122-question bank](https://github.com/ombharatiya/ai-system-design-guide#question-bank) already does it better than we ever could. We link to it as the "graduate to this next" resource.
- **Not a multiple-choice test.** System design doesn't have right answers. It has defensible answers and indefensible answers, and the difference is in the reasoning, not the conclusion.
- **Not exhaustive.** Each track starts with 5 sample questions. The bank grows as the curriculum grows.

---

## Contributing a question

See [CONTRIBUTING.md § Add a question to the question bank](../CONTRIBUTING.md#5-add-a-question-to-the-question-bank). The rules:

- Scenario-framed (2-4 sentences), not a bare prompt.
- Tagged with `track`, `difficulty`, and `chapters` (what to read first).
- Includes a "how a story-taught learner would reason through this" worked answer.

Bare "design X" prompts will be rejected. We teach, we don't just test.
