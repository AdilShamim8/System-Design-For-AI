# Take-Home Assignments — Scoping Through Defense

Take-homes are the field guide's most-documented interview format for AI roles (its research: take-homes from 100+ public GitHub repos). They test what live interviews can't: real code, real data, real judgment — on your time, with your tools. They also eat weekends if you let them. This file is the playbook.

## Before you start: read it like a lawyer

- **What's actually required?** (vs. nice-to-have — usually marked, often buried). The bar is "meets the spec, defensible" — not "impresses."
- **Time budget stated?** Take it literally and take *less*. A great 4-hour artifact beats a good 12-hour one; reviewers can smell over-spending, and it reads as poor judgment (which it is).
- **Ask clarifying questions** — 2–4, in one email, before starting. This is a *tested behavior*: "should I optimize for latency or cost?", "is eval on held-out data or my own split required?"

## The scoping hour (do not skip)

Spend the first hour on decisions, not code:

1. **Restate the problem** in your own words — the README's first paragraph.
2. **Choose the boring architecture** that answers the question asked. Take-homes are graded against the rubric, not against novelty.
3. **Draw the eval first.** Whatever the task (ranker, RAG, classifier), decide what "good" is measured by BEFORE building — this is the single biggest differentiator (the graders are testing exactly the b4 discipline).
4. **Budget time:** ~40% core, ~20% eval, ~15% writing, ~25% buffer. Invert into code-first and you'll have an unprovable artifact.

## The build: habits graders notice

- **Small commits with messages** (a git history is part of the artifact — this course's commit style is exactly right)
- **A `README.md` with**: the decision log (3–5 "I chose X over Y because Z" lines — the seniority signal), how to run it, results with numbers, and **"with more time I would…"** (2–3 items — restraint + roadmap vision)
- **Tests or eval harness included and RUN** — even 10 asserts on the golden cases; most candidates ship zero
- **Handle failure paths**: empty inputs, malformed rows, out-of-scope queries — the b7 stack in miniature
- **No leaked credentials, no committed data**, a requirements pin file — hygiene is graded

## Common assignment shapes (and the trap in each)

| Shape | The trap | The differentiator |
|---|---|---|
| "Build a RAG bot over these docs" | Demo-ware with no eval | Labeled eval set + hit@k/faithfulness numbers + failure analysis |
| "Improve this ranker" (starter notebook) | Chasing the metric | Baselines first, time-split, one idea tested well + one discussed |
| "Design + prototype X" (open-ended) | Over-building | The smallest end-to-end thing that runs, plus the one-pager (x4) |
| "Analyze this dataset" | Chart soup | Three decisions the analysis enables, stated in the first paragraph |

## The defense call

Half the grade. They will ask: "why this?", "what breaks?", "how do you know it works?", "what would you do with a week more?" — your README already answered all four, so *defend with the same numbers*. Walk the tradeoff sentences, own the shortcuts ("I hard-coded X because time; the production version needs Y"). Never bluff a detail of your own artifact — it's *yours*; if you can't explain a line, delete it before submitting.

## The meta-rules

- **Timebox honestly and report it:** "I spent ~5 hours" is a credibility line, not a confession.
- **Ship the boring thing that works.** Flash dies in review; structure survives it.
- **If they ask for free work that looks like their roadmap** (>15–20 hours, real business value): that's a red flag about them — worth knowing before you accept.
