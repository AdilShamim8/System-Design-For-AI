# Coding 7 — Worked Solution

*(Attempt the problem first. The value is the delta between your answer and this one.)*

The loop fits on one screen; the budgets are the design.

```python
import time, json

STOP = ("COMPLETED", "BUDGET_STEPS", "BUDGET_TOKENS", "BUDGET_WALLCLOCK", "TOOL_ERROR_FATAL")

def agent_loop(llm, tools, user_msg, max_steps=8, max_tokens=4_000, wall_clock=30.0):
    state = [{"role": "user", "content": user_msg}]
    spent_tokens = 0
    for step in range(max_steps):                    # budget 1: steps
        if time.time() - t0 > wall_clock:            # budget 2: wall clock
            return "BUDGET_WALLCLOCK", state
        out = llm(state)                             # the ONLY model call site
        spent_tokens += estimate_tokens(out) + estimate_tokens(state)
        if spent_tokens > max_tokens:                # budget 3: tokens
            return "BUDGET_TOKENS", state
        call = parse_tool_call(out)                  # {"name": ..., "args": ...}
        if call is None:
            return "COMPLETED", state                # model produced a final answer
        if call["name"] not in tools:
            # Unknown tool: error AS DATA — the model self-corrects next step
            state.append({"role": "tool", "content": json.dumps(
                {"error": f"unknown tool '{call['name']}'; available: {list(tools)}"})})
            continue
        try:
            result = tools[call["name"]](**call["args"])
            state.append({"role": "tool", "content": json.dumps(result)[:2_000]})
        except Exception as e:
            # Tool failure: STILL data. An exception kills the episode — and in
            # production becomes a ticket. The model reads and recovers (c1:
            # most dispatch errors recover in +1 step).
            state.append({"role": "tool", "content": json.dumps({"error": str(e)})})
    return "BUDGET_STEPS", state

# Demo: a mock LLM that calls the same tool forever. The loop returns
# BUDGET_STEPS at step 8 — with the full trace, which is the postmortem.
# Result truncation ([...:2_000]) is c1's contract item 6: tools return
# summaries, not dumps — token-budget consciousness at the contract level.
```

The narration: "budgets live outside the model because the model is the *advocate* for continuing — it will always think one more step is worth it (C.1). The loop is the adult in the room. And every stop reason is named because ops needs to alert differently on 'ran out of steps' (a design smell: prompts or tools need work) vs 'ran out of wall clock' (a latency incident).

## Complexity and cost

Per-step: one model call + one tool call. The budget check is O(1). At fleet scale, this loop is per-episode state in a durable store with the saga pattern for approvals (c2) — say that the *code* shown is the happy path; production adds durable state, retries with idempotency keys, and the approval grid.

## Self-check

- [ ] Three budgets, all enforced outside the model call
- [ ] Tool errors as data, never raised
- [ ] Closed stop taxonomy
- [ ] Looping-LLM demo terminates for the right reason
- [ ] Result truncation (token-conscious tool contracts)
