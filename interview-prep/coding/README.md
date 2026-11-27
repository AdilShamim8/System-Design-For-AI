# ML Coding Round — 8 Problems, Production-Flavored

**What this is:** the coding screen that AI-infra and ML-platform interviews actually give: a dataset, a time budget, and a production constraint that changes the answer. Not LeetCode in disguise — every problem here is a compressed version of a lab in this course, so the system-design knowledge and the code reinforce each other.

**How to use these:**

1. Read the problem. Give yourself the stated time budget with a real timer.
2. Write code in a notebook or script — the datasets are all real and downloadable (each problem names its `datasets/` card).
3. Compare against `SOLUTION.md` *after* producing something. The value is in the delta.
4. Say the tradeoffs out loud while coding — in a real screen, the narration IS the signal.

| # | Problem | Tests | Time | From |
|---|---|---|---|---|
| 1 | [Train a churn model with a time-split](./coding-1-churn-time-split/README.md) | leak-free CV, calibration | 40 min | Lab a3 |
| 2 | [Build the candidate generator](./coding-2-candidate-generation/README.md) | recall@k vs latency | 45 min | Lab a2 |
| 3 | [Point-in-time feature join](./coding-3-point-in-time-join/README.md) | leak audit passes | 35 min | Lab a6 |
| 4 | [Cache the hot queries](./coding-4-semantic-cache/README.md) | hit-rate + wrong-hit rate | 40 min | Lab b5 |
| 5 | [Chunk a corpus properly](./coding-5-chunking/README.md) | chunk stats, boundary QA | 30 min | Lab b3 |
| 6 | [Drift monitor in 50 lines](./coding-6-drift-monitor/README.md) | PSI correctness, alert logic | 35 min | Lab a7 |
| 7 | [Agent loop with budgets](./coding-7-agent-loop/README.md) | budget enforcement, error recovery | 45 min | Lab c1 |
| 8 | [Eval harness for a prompt change](./coding-8-eval-harness/README.md) | golden set, judge, regression gate | 45 min | Labs b2/b3 |

**The meta-rule:** in these screens the interviewer is grading whether your code *knows it lives in a system* — time-split before model, idempotency before cleverness, budgets before loops. A correct-but-naive answer scores lower than a simpler answer with the right guards.
