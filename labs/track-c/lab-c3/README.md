# Lab c3 — Multi-Agent Handoff

| | |
|---|---|
| **Prerequisites** | Chapter C.3 (the team in the same room) · Lab c1 |
| **You will build** | An orchestrator + two specialists (researcher, writer), a handoff protocol, and — the honest part — the measurement that says whether the team is worth it |
| **Est. time** | 2–3 hours |
| **Cost** | < $0.20 |

**The story.** "Multi-agent" sounds like an architecture upgrade. Sometimes it is: a specialist that sees only its slice of context can be sharper, cheaper (smaller context per agent), and independently testable. Sometimes it's just a single agent with extra steps — *more* handoffs, *more* failure points, *more* tokens, same output. The only way to know which is to **build both and measure**. Today you build an orchestrator-specialist system for a real task, race it against a single agent, and learn when the team wins.

## Part 1 — The single-agent baseline (20 min)

Task: "Research [topic from your b2 corpus] and write a 150-word brief with citations." One agent, your c1 loop, one `search_docs` tool, straight to the brief. Log: steps, tokens, latency, and a b4-style faithfulness judgment of the output. This is your control — *any* multi-agent system must beat it to justify existing.

## Part 2 — The team (45 min)

```python
RESEARCHER_SYS = ("You are the RESEARCHER. You call search_docs to gather "
                  "sources, then reply with FINDINGS: <bullet list of facts "
                  "with [source_id]>. Do not write the brief.")
WRITER_SYS = ("You are the WRITER. You receive FINDINGS and write a 150-word "
              "brief. Cite [source_id] inline. If findings are insufficient, "
              "reply REQUEST: <what you need>.")
ORCHESTRATOR_SYS = ("You are the ORCHESTRATOR. Route the task: (1) ask the "
                    "RESEARCHER for findings, (2) pass findings to the WRITER, "
                    "(3) if the WRITER requests more, return to the RESEARCHER "
                    "once, (4) return the final brief. Max 2 round trips.")

def run_team(question, max_handoffs=6):
    trace = []
    findings = researcher(question)
    trace.append({"agent": "researcher", "out": findings[:200]})
    for _ in range(max_handoffs):
        draft = writer(findings)
        trace.append({"agent": "writer", "out": draft[:200]})
        if not draft.startswith("REQUEST"):
            return draft, trace
        findings = researcher(draft)          # one more research pass
    return "HANDOFF BUDGET EXHAUSTED", trace
```

(The `researcher`/`writer` functions are each a c1-style loop with their own system prompt; write them — 20 lines each. Keep the orchestrator *explicit and dumb*: a fixed protocol beats a clever router at lab scale.)

**Checkpoint 2:** Run the same 5 questions through team and baseline. Record: output quality (blind-rate the two briefs yourself, or b4-judge them), total tokens, latency, and handoff count. **Expect a real possibility that the single agent wins on all axes** for easy tasks — that result, honestly recorded, is the lab's most valuable output.

## Part 3 — Where the team earns its keep (30 min)

Now make the task *genuinely need* separation — three ways, run each:

1. **Context isolation:** 20K tokens of raw search results would swamp one agent. The researcher digests to 300 tokens of findings; the writer never sees the swamp. Measure single-agent quality *with* the full context vs. the team's — the "lost in the middle" effect (Liu et al. 2023) makes the team win here.
2. **Different models per role:** researcher = small cheap model; writer = better model. Compute the cost mix vs. all-big-model baseline. Routing is a cost tool before it's a quality tool (b6's lesson, now organizational).
3. **Independent testability:** fix the writer's tone by editing WRITER_SYS alone; rerun. In a monolith, tone edits risk breaking retrieval behavior — in the team, they can't. Write one paragraph on why *change isolation* is an underrated multi-agent benefit.

**Checkpoint 3:** Your verdict table: task type → winner (single / team) → why. The pattern worth internalizing: **teams win when contexts must be isolated, roles need different models, or changes must be isolated; monoliths win on simple tasks by removing handoff overhead.** Everything else is fashion.

## Part 4 — The handoff protocol as a contract (15 min)

Look at your trace: every handoff is a *contract* — researcher's `FINDINGS:` prefix, writer's `REQUEST:` prefix. What breaks when one side drifts? (Test: delete the prefix from one output; watch the other side misroute.) The production answers: structured outputs (b7's schemas) as inter-agent messages, and a schema validation at every hop — the same trust-boundary discipline, now *between* your own agents. LLM-to-LLM interfaces deserve the same validation rigor as LLM-to-database ones. Most outages in multi-agent systems are handoff drift wearing a debugging costume.

---

## Explain it back

1. When does a multi-agent system *lose* to a single agent? Give three specific reasons.
2. What is change isolation, and when is it worth tokens?
3. Your trace shows 6 handoffs for a task that needed 2. What does that tell you, and what do you fix?
4. Why validate inter-agent messages if you wrote both prompts yourself?

## Extensions

- **Parallel specialists:** two researchers (facts vs. counterarguments) running concurrently, writer merges. Latency should drop; watch merge quality. You've built the read-side of C.3's "team in the same room."
- **A bad router:** let the orchestrator *choose* agents per step (free-form). Count misroutes over 20 tasks. Now you know why production orchestrators are usually explicit protocols, not improv.
- **Agent-as-a-service:** give the writer its own tool (word_count) and watch role-tool ownership emerge. Which tools belong to which agent is a real design decision — document yours.

## What you can now claim in an interview

"I built both the monolith and the orchestrator-specialist version and measured them: teams win on context isolation, per-role model routing, and change isolation; monoliths win on simple tasks by skipping handoff overhead. My handoffs are schema-validated contracts because LLM-to-LLM interfaces need the same validation as any other boundary — most 'multi-agent bugs' are handoff drift."
