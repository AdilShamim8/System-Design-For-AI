# Lab c5 — Agent Evaluation and Guardrails

| | |
|---|---|
| **Prerequisites** | Chapter C.5 (the guardrail problem) · Labs c1–c4, b4 |
| **Dataset** | Your accumulated traces from c1–c4 (the whole track was building this) |
| **You will build** | Trace-level evaluation — trajectory checks, outcome checks, and the layered guardrail stack — the difference between an agent that demos and an agent that ships |
| **Est. time** | 2–3 hours |
| **Cost** | < $0.15 (judge calls) |

**The story.** An agent that works 90% of the time is *worse* than useless in production — it's a liability with a demo reel (Chapter C.5's whole argument, and FN-07/FN-08's whole cause). Agent evaluation is harder than RAG eval (b4) because the object being graded is a *trajectory*: a sequence of decisions, any of which can be wrong in a way that only matters three steps later. Today you build the two-tier eval every serious agent team runs — **outcome checks and trajectory checks** — then the guardrail stack that catches what evals miss.

## Part 1 — The eval set: your traces, graded (30 min)

Collect 30+ episodes from c1–c4 (you have them in `agent_traces.jsonl` — if you skipped logging, that's lesson zero: you can't evaluate what you didn't record). Grade each on two axes:

```python
def grade_episode(ep):
    return {
        "outcome": grade_outcome(ep),        # did the final answer satisfy the task?
        "trajectory": grade_trajectory(ep),  # were the STEPS sensible?
    }

# outcome: programmatic where possible — exact answer, schema-valid, unit test passes
def grade_trajectory(ep):
    # the checks that catch "right answer, insane path":
    return {
        "n_steps": len([s for s in ep["trace"] if "tool_result" in s]),
        "looped": did_any_tool_repeat_3x(ep),
        "called_wrong_tool": judge("Was each tool call appropriate? " + json.dumps(ep)),
        "hallucinated_call": any("unknown tool" in str(s) for s in ep["trace"]),
        "respected_budget": len(ep["trace"]) <= 8,
    }
```

**Checkpoint 1:** Compute your agent's **outcome rate and trajectory-health rate** separately. Find (they exist) an episode with a *good outcome and an unhealthy trajectory* — a lucky answer via a looping, wasteful path. That episode is the argument for trajectory grading: right answers via broken paths are regressions scheduled for later. Record its trace as your exhibit A.

## Part 2 — LLM-as-judge for trajectories (30 min)

Trajectory "sensibleness" can't be fully scripted — use b4's judge discipline:

```python
JUDGE_PROMPT = '''Grade this agent trajectory.
Question: {q}
Trajectory: {t}
Check: (1) was each tool call reasonable given the visible state?
(2) did any step waste budget? (3) is the final answer grounded in tool results?
Output JSON: {{"tool_sanity": 1-5, "waste": 1-5, "grounded": 1-5, "issues": ["..."]}}'''
```

**Checkpoint 2:** Judge your 30 episodes (temperature 0, JSON mode — b4's rules). Spot-check 5 judgments by hand — judges are useful exactly to the degree you've verified them. Then compute the correlation between judge scores and your programmatic checks: where they disagree, *read the trace* and decide who's right. You're not just measuring the agent — you're calibrating your instrumentation.

## Part 3 — The guardrail stack (40 min)

Evals grade offline; guardrails run online. Build the layers (each is a few lines against your c1 loop):

1. **Input guardrail:** filter/inject against prompt injection — if the *user* text contains "ignore previous instructions" patterns, log and route to a hardened path. (Test with a crafted injection; watch the naive agent comply without it.)
2. **Tool guardrails:** the c2 contracts — allowlists, validation, approval gates on the reversibility grid. Already yours; wire them in.
3. **Output guardrail:** schema validation (b7) + banned-content checks on the final answer before the user sees it.
4. **Budget guardrails:** max steps (c1), max tokens per episode, max cost per day — enforced in code *outside* the loop, alerting when tripped.
5. **The human layer:** the dead-letter queue (b7) + approval gates (c2) — the layer that catches what all the above miss, with response-time expectations set.

**Checkpoint 3:** Attack your guarded agent with the field notes'greatest hits: an injected instruction in a "document" your agent retrieves (FN-07's cousin), an impossible task (loop bait), a request to email 500 people (blast radius). For each: which layer catches it? Any attack that reaches the user uncaught is a *finding* — fix the stack until none do. That table (attack → catching layer) is the lab's deliverable and the single best artifact to bring to an "how do we make agents safe?" conversation.

## Part 4 — The eval gate (10 min)

Wire it into "CI": a script that runs the 30-episode eval set and fails if outcome rate < X% or trajectory-health < Y% or any attack succeeds. Prompt changes, tool changes, model upgrades — all now run the gate before shipping. **An agent without an eval gate is a demo with deployment access.**

**Checkpoint 4:** Write your gate's thresholds and justify each in one sentence. Thresholds you can defend are the difference between governance and theater.

---

## Explain it back

1. Why does a good outcome with a bad trajectory count as a failure?
2. Name the five guardrail layers and one attack each catches.
3. Why must budget guards live outside the model?
4. Your eval gate failed after a model upgrade: outcome same, trajectory-health down. What probably changed, and what do you do?

## Extensions

- **Regression hunting:** run the eval set on two different models (or two prompt versions); produce the diff table — which episode types regressed? That's the model-upgrade review process, miniaturized.
- **Cost-per-success:** divide total eval cost by successful outcomes. Now "agent quality" has a price tag, and you can compare (model A, 85% at $0.02) vs. (model B, 92% at $0.09) like an engineer instead of a fan.
- **Adversarial set growth:** every new attack idea becomes a permanent eval case. Track the set's size as a KPI — an eval set that stops growing is a team that stopped learning about failure.

## What you can now claim in an interview

"I evaluate agents on outcomes AND trajectories — because right answers via looping paths are scheduled regressions — with programmatic checks, calibrated LLM judges, and an attack-driven guardrail stack: input filters, tool contracts, output validation, budget guards, human escalation. My eval gate blocks any prompt/tool/model change that regresses it, and I bring the attack-to-layer table to every 'agent safety' conversation."
