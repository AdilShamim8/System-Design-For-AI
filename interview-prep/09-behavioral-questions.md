# Behavioral Questions for AI Engineers

Technical rounds test your ceiling; behavioral rounds test your **floor** — what you're like when things go wrong. Your advantage: this course's labs and field notes give you *true* stories with numbers. Every story below should exist in your journal already.

## The six you will get

### 1. "Tell me about a time a model/AI system failed in production or a project."

The shape: **mistake → detection → durable fix** (12-common-mistakes #19). From your labs (all true, all yours):
- *Leakage story (a6):* "My demand forecaster's offline MAE improved 50% from one feature — because it leaked the target hour. Now every rolling feature gets a shift-audit; point-in-time correctness is a checklist item, not a hope."
- *Threshold story (a3):* "My fraud model's 'optimal' threshold was 0.06, not 0.5 — I had optimized the wrong thing initially (F1) and learned thresholds are business decisions with dollar math."
- *Refusal story (b2):* "My RAG bot happily answered questions outside its corpus — I measured 40% non-compliance with my own refusal rule and had to eat the prompt design twice."

### 2. "Tell me about a disagreement with a teammate about architecture."

Pick a *technical* disagreement with a resolution mechanism: "My teammate wanted fine-tuning for a docs bot; I built the few-shot + RAG baseline first — it hit the eval bar, so fine-tuning became a v2 trigger instead of a v1 bet. We settled it with a measurement, not seniority." (b6's actual lesson.)

### 3. "How do you evaluate AI systems you build?"

The floor-question in disguise — teams have been burned by vibe-driven AI work. Two-minute shape: two-tier evals (retrieval exact, generation judged — b4), versioned sets in CI, refusal on adversarial cases, A/B for online truth (a8). Close with: "in my lab runs, offline and simulated-online disagreed often enough that I treat offline metrics as rumors worth testing."

### 4. "Tell me about a time you had to explain an AI system to a non-technical stakeholder."

Use the cost-dashboard story (x2) or the threshold story (a3): "I explained why we couldn't 'just catch more fraud' with a cost curve — threshold on one axis, dollars on the other, current operating point circled. The business picked the point; I built the dial."

### 5. "What's the most complex system you've built?"

Your capstone (cap1/2/3) — but the senior move is *structured simplicity*: walk the one-pager (x4), not the git history. "A multi-tenant RAG platform: three tenants, isolation verified by a standing test, per-tenant cost ledgers, noisy-neighbor capped. Here's the diagram; ask me about any box."

### 6. "Why this company / why AI engineering?"

Have a *specific* answer referencing their product ("your support flow is exactly the cap1 problem, and your scale is where my cache economics change — I'd love to see your hit-rate numbers"). Generic enthusiasm is a rejection with a smile.

## The AI-specific behavioral traps

- **"Have you shipped LLM features to production?"** If no: "Not at company scale — I've shipped cap1 to real users and run the full loop: evals, guardrails, cost dashboard, one real-user iteration. Here's the URL and the numbers." Honest + evidenced beats inflated + probe-able.
- **Talking about a failure without owning it.** "The data was bad" is not ownership; "I didn't audit the labels before training, and the audit is now step one" is.
- **No questions for them.** Ask: "How do you evaluate model changes here? What's your rollback story for prompts?" — you're interviewing their engineering culture too, and those questions prove you know what matters.

## Preparation: the story bank

Write six stories in your journal, each with its numbers: failure (a lab mistake), disagreement (settled by measurement), evaluation (b4/a8), explanation (x2 to a layperson), complexity (capstone), learning (the field note that changed how you build). STAR format, 90 seconds each, out loud. The stories exist; the work is making them *tight*.
