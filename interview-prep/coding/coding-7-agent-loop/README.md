# Coding 7 — An Agent Loop That Cannot Run Away

**Time budget: 45 min.** Open book (docs, not solutions). Narrate your tradeoffs.

## The scenario

Agent-platform screen: 'Implement the agent loop. Model = a function `llm(messages) -> str` (mock it — no API calls in my screen). Tools = a dict of name → callable. The loop must: enforce a max-steps budget, a token budget, and a wall-clock budget; return tool errors as *data* (never raise into the loop); and stop conditions for all three budget types plus completion. Then show me an episode where the model loops and the budget saves you.' C.1 and c1's contract, as code.

## Your task

All three budgets demonstrably enforced (the demo terminates for the *right* reason). Tool error handled as data — an erroring tool doesn't crash the episode, and the model gets a chance to recover (c1's measured behavior: most error episodes recover in +1 step). The taxonomy is a closed set — callers can branch on it.

## Success looks like

1. Implement the loop with the three budgets enforced OUTSIDE the model call.
2. Tool errors returned as data (the model reads them; the episode continues).
3. A stopping taxonomy as return values: COMPLETED, BUDGET_STEPS, BUDGET_TOKENS, BUDGET_WALLCLOCK, TOOL_ERROR_FATAL.
4. Demo: the looping mock LLM; the loop terminates with the right reason.
5. State what each budget protects against, and why enforcement outside the model is non-negotiable.

## Dataset

All self-contained: mock LLM that loops on a tool (returns the same tool call forever), two toy tools (one that errors — returns an error string), budget params. No external dependencies.

## After your attempt

Open [SOLUTION.md](./SOLUTION.md). Grade yourself against the checklist at the end.
