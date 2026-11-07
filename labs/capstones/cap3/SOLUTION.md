# Capstone cap3 — Reference Architecture and Build Notes

## The shape that worked for us

```
task ──▶ planner (c3-style separate turn: "steps to solve, files to touch")
            │
            ▼
        agent loop (c1, max 15 steps, token budget 30K)
            │ tools (c2 contracts):
            ├── read_file(path)          — size-capped, returns with line numbers
            ├── write_file(path, content) — gated: git branch + diff log (reversibility grid)
            └── run_tests()              — subprocess, 10s CPU / 20s wall cap, no network,
                                            structured result {passed: [...], failed: [{name, traceback}]}
            │
            ▼
        outcome: tests green? ──▶ report with diff
        (any budget breach ──▶ dead-letter + trace dump)
```

## Numbers from our reference build

| Metric | Value |
|---|---|
| Localized repairs | 9/10 |
| Misleading-failure repairs | 5/10 — the traceback is a *hint*, and misdirection works |
| Feature tasks | 2/3 (one wrong placement: put `slugify` in `math_utils`) |
| Mean loop iterations | 4.2 (median 3 — a long tail of 10+ flails) |
| Cost per repaired task | $0.09 median |
| Attack set | 5/5 caught (sandbox timeout, path allowlist, budget caps) |

## What the build teaches that labs couldn't

1. **Structured test output is the difference between an agent and a flail.** Returning `{failed: [{name, traceback}]}` instead of raw stdout moved repair rate more than any prompt change — the agent *reads* the traceback and self-corrects. c1's errors-as-data law, at its most profitable.
2. **The planner pays for itself exactly when tasks need placement, not repair.** Repair tasks: planner added ~15% tokens for ~0 gain. Feature tasks: planner (which file? which conventions?) took placement success from 1/3 to 2/3. c3's rule — teams win when contexts and *judgment* must be isolated — in miniature.
3. **Misleading failures expose the agent's epistemology.** When the test message points at the wrong function, agents follow the message, not the evidence — 5/10 recovered. The trajectory trace shows the exact step where the agent trusted the hint over the code. This is why trajectory grading exists (c5): outcome alone would say "fail"; the trace says "misled at step 2, never re-examined the assumption" — an actionable finding.
4. **The sandbox is the product.** Timeouts, path allowlists, no network, budget caps — every attack in the set died at a *mechanical* layer, not a prompt. The uncomfortable, true lesson: agent safety is mostly infrastructure, not instructions. The reversibility grid (c2) decides which layer each tool needs, and the layer table proves it works.
5. **Cost-per-repaired-task is the honest unit.** $0.09/task median says nothing alone; against published SWE-bench-class agent economics (and their success rates) it says "small models + tight loops are economically real for bounded tasks, and the frontier models earn their price only on the misleading/multi-fix tail." That sentence — derived from your own numbers — is the capstone's payoff and a complete interview answer on its own.
