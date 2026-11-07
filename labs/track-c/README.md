# Track C — Agentic Labs

Five labs from the loop up: bare-handed first (c1), then contracts, teams, memory, and evaluation. Frameworks are deliberately absent until you've built what they wrap.

| # | Lab | Prereq | Time |
|---|---|---|---|
| [c1](./lab-c1/) | The Agent Loop, From Scratch | C.1, Lab b1 | 3 h |
| [c2](./lab-c2/) | Designing Tool Contracts | C.2, Lab c1 | 2–3 h |
| [c3](./lab-c3/) | Multi-Agent Handoff | C.3, Lab c1 | 2–3 h |
| [c4](./lab-c4/) | Memory and State | C.4, Lab c1 | 2 h |
| [c5](./lab-c5/) | Agent Evaluation and Guardrails | C.5, Labs c1–c4 | 2–3 h |

**The arc:** c1 is the course's third "build it bare-handed" moment (after the serving API in a1 and RAG in b2) — the loop, its four killers, and trace logging. c2 is where safety becomes contracts. c3–c4 add team structure and memory *with the measurements that justify them*. c5 is the shipping gate: outcome + trajectory grading, the attack set, and the guardrail stack.

Keep your `agent_traces.jsonl` from c1 onward — it becomes c5's evaluation corpus.
