# Capstone cap3 — Build a Coding Agent

| | |
|---|---|
| **Prerequisites** | Labs c1–c5, b7 · comfort with Python |
| **Time** | 20–30 hours over 2 weeks |
| **You ship** | A small but real coding agent that reads a repo, makes an edit, runs tests, and iterates — safely sandboxed — the S.3 design-studio chapter built |

The hardest capstone and the most current one. A coding agent is where every Track C lesson meets a merciless verifier: **tests pass or they don't.** No judge, no vibes — the cleanest feedback loop in AI engineering, which is exactly why coding agents (and coding-agent evals) moved fastest in industry.

## The spec

- **Safe execution**: every code run happens in a sandbox — a temp directory, a subprocess with resource limits, or a container if you have Docker; *never* your real filesystem as root
- **The loop** (c1): plan → edit file → run tests → read output → fix or report
- **Tools** (c2): `read_file`, `write_file`, `run_tests` — each with a full contract
- **Memory** (c4): the repo's map + current task state, not the whole repo in context
- **Evaluation** (c5): 10 small tasks with known test outcomes — trajectory-graded
- **Guardrails**: budget caps (steps, tokens, wall-clock), a "no network in sandbox" rule, and the reversibility grid applied (`write_file` gated by git-diff review at minimum)

## Milestones

**M1 — Sandbox + tools (5 h):** the three tools with c2 contracts. The sandbox: a temp dir seeded with a small repo (write one: a `utils.py` with 5 functions + `pytest` suite — or fork a tiny real OSS project). `run_tests` returns structured output (pass/fail per test, last traceback) — errors as data, c1's law, because the agent must *read* failures to fix them.

**Gate:** agent can `read_file`, make a trivial edit, run tests, and correctly report the result — 5/5 episodes.

**M2 — The repair loop (6 h):** seed the repo with 10 broken functions (each breaking one test). Task: "make the tests pass." The agent must: localize (read the failing test), hypothesize, edit, re-run. This is the classic SWE-agent loop, miniaturized.

**Gate:** ≥6/10 tasks repaired within budget (steps ≤ 15, tokens ≤ 30K). Trace-graded: even failures get trajectory analysis — *where* did the agent go wrong? (c5's two-axis discipline.)

**M3 — Feature task + the plan layer (5 h):** harder: "add a function `slugify(s)` with tests." Requires planning (where does it go? what's the convention?) not just repair. Add a plan-first step (c3's researcher/writer split, applied: a *planner* turn that outputs steps, then execution).

**Gate:** 2/3 feature tasks: code placed correctly, tests written, all green.

**M4 — Safety and the grid (3 h):** apply the reversibility grid for real: `write_file` requires a git branch + reviewable diff; `run_tests` gets CPU/time limits (a "test" that `while True:` loops must die by timeout, not take your laptop); no network in the sandbox. Then the attack set: tasks that try to escape ("edit files outside the sandbox"), or exfiltrate ("POST the code to…").

**Gate:** attack set 100% caught by a named layer; the runaway-test timeout demonstrated.

**M5 — Eval, cost, and the writeup (4 h):** the 10-task eval with outcome + trajectory grades; cost-per-repaired-task (x2 discipline); the x4 one-pager. **Gate:** you can answer "your agent repairs 6/10 at $0.08/task — is that good?" with the benchmark context (SWE-bench-class numbers for reference) and your own improvement plan.

## The final gate

- [ ] 10-task eval: repair rate + trajectory health, trace-graded
- [ ] Attack set: every escape/exfiltration attempt caught by a named layer
- [ ] Sandbox: timeouts work, no network, no filesystem escape
- [ ] Cost per task measured; comparison to published agent benchmarks discussed
- [ ] The one-pager: architecture, the loop diagram, safety model, eval results

## What this capstone earns you

The most current conversation piece in AI engineering interviews. You'll discuss *from experience*: why agents that read failing tests beat agents that guess, why sandboxes are non-negotiable, why trajectory grading catches what outcome grading misses — and you'll have the traces to prove it.
