# Lab c1 — Worked Solution and What the Numbers Mean

## Expected results (our runs, small hosted model, temp 0)

| Episode type | Success rate | Mean steps | Notes |
|---|---|---|---|
| Single tool call | ≈ 95%+ | 2 | trivial |
| Chained (2 tool calls) | ≈ 85–90% | 4–5 | the model must *wait* for result 1 |
| Multi-tool mix | ≈ 75–85% | 4–6 | |
| Knowledge (zero calls) | ≈ 90% | 1 | sometimes calls a tool needlessly |
| Impossible-with-tools | ≈ 40–70% | up to max_steps | the refusal gap |
| Malformed/hostile | ≈ 70–85% | 2–4 | dispatch errors usually self-correct |

## The five lessons hidden in those numbers

1. **The loop is simple; the failure modes aren't.** ~30 lines of Python produce a working agent — and four distinct production killers that frameworks exist to manage. Knowing the killers *by experiment* (your Part-3 table) is what separates "used LangGraph" from "understands agents."
2. **Chaining is where accuracy compounds down.** Two-step chains at ~88% means ~11 episode-success loss vs. single calls — errors multiply across steps exactly like RAG stages did in b4 (0.95² ≈ 0.90). Every added step costs reliability; every step you *remove* buys some back. Step-count minimization is an actual optimization target, not an aesthetic.
3. **Tool errors as conversation is the single best design decision in the lab.** Returning `{"error": ...}` lets the model self-correct within the episode (measured: most dispatch-error episodes recover in +1 step). Raising instead turns a recoverable blip into a dead episode — and in production, into a support ticket.
4. **Context growth is the silent tax.** Each step resends the whole history; by step 10 the episode costs several× its first step. c4's memory management (summarize, window) is the cure; today's measurement — history bytes per step, in your journal — is the diagnosis. This is also why "max context window" ≠ "free steps."
5. **Traces are the only real debugging tool.** Step-level replay answers the three questions plain logs can't (which step, what did the model see, tool-design vs. model-reasoning). Every serious agent platform (LangSmith, Langfuse — see `ai-stack/observability-eval.md`) is, at its core, a trace browser. You built the substrate yourself; the platforms are chrome around it.

## Common mistakes

- **`eval` without a whitelist.** The regex guard in `calculator` matters — a naive `eval(expr)` in a tool an LLM controls is remote code execution by prompt. (Security people call this the "agent is an untrusted code generator" problem; C.5 and the guardrails cheatsheet cover it properly.)
- **Killing the episode on JSON parse errors.** One malformed reply shouldn't end the run; a corrective nudge fixes most. Bounded retries, again (b7's pattern, third appearance).
- **No temperature control.** Agents want determinism while debugging; temperature 0 makes traces reproducible, which is the entire point of having them.
- **Testing only happy paths.** Episodes 6–10 (the hard ones) are where the design actually proves out. If your episode set has no impossible questions, you haven't tested the loop — you've tested the demo.

## Interview lines this lab earns you

- "I built the ReAct loop from scratch and stress-tested it: chaining compounds errors (~0.95² per two steps), impossible questions loop without a step budget, and per-step cost grows because the whole history resends every turn — so I treat step count as a cost/reliability optimization target, not a detail."
- "Tool errors are conversation, not crashes: my dispatch table returns error objects, and most episodes self-correct in one extra step. That single decision moved my hostile-episode success rate more than any prompt tweak."
