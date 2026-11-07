# Lab c1 — Data notes: episodes, not datasets

**This lab has no external dataset.** Agents are evaluated by *episodes* — (question, trajectory, outcome) triples you generate. That's not a shortcut; it's the field's actual state: agent eval is built from traces (c5 formalizes it), because behavior depends on your tools, your protocol, and your model in a way no public dataset captures.

**The episode set (write these 12, keep them forever):**

| # | Episode | What it tests |
|---|---|---|
| 1–3 | Pure tool chains ("2*(3+4) squared") | basic loop, chaining |
| 4–5 | Multi-tool ("words in X, plus 10") | tool selection |
| 6 | Zero-tool knowledge question | knowing *not* to call |
| 7 | Impossible with tools given | loop risk, graceful "I can't" |
| 8 | Ambiguous ("average word length of...") | decomposition |
| 9 | Hostile input (huge text into word_count) | tool robustness |
| 10 | Malformed question | protocol adherence |
| 11–12 | Your two hardest ideas | stretch |

Keep `agent_traces.jsonl` — it seeds c5's evaluation lab directly.

**Calibration numbers (small hosted model, temperature 0):**

- Simple chains: succeed in 2–3 steps, ~85–95%.
- Episodes needing "I can't": the hardest category; 40–70% without explicit prompting about refusal.
- Mean episode cost: 3–6 calls × (system+history+reply) — track yours in the journal.
- Without `max_steps`: the impossible-questions episode loops until you stop it. Watch it once, never forget the guardrail.

**License:** your episodes and traces are yours. If you later publish traces, scrub anything personal — traces contain full model outputs and any user text you fed them.
