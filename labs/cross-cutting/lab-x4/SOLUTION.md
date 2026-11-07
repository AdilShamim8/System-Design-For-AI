# Lab x4 — Worked Solution and What the Numbers Mean

## Expected results (the self-graded arc)

| Section | Typical draft-1 score | After rewrite |
|---|---|---|
| Problem & users | 3–4 | 4 |
| Requirements | 2–3 (numbers missing) | 4–5 |
| High-level design | 3 | 4 |
| Data & model choices | 3 (brands, thin whys) | 4–5 |
| Scariest failures | **2** | 4–5 |
| Evaluation & rollout | **2** | 4–5 |
| Cost | 2–3 or absent | 4 |

## The five lessons hidden in those numbers

1. **The two universal weak sections are failures and eval — the two sections that describe the future.** Draft-1s describe what the system *does*; senior docs describe what it *does when things go wrong* and *how you'll know*. Your whole Track A→X arc — a7's drift, x1's dashboards, b4's gates, a8's experiments — exists to fill exactly these two sections. The rewrite proves the course composited: numbers you didn't have twelve labs ago now appear in your doc unprompted.
2. **Numbers are the senior/junior boundary, not vocabulary.** A junior doc says "low latency"; a senior doc says "p99 < 1.5s at 200 RPS, TTFT-bound, small-tier with reranker escalation." Same architecture, one is auditable. Every section upgraded in the rewrite by replacing adjectives with measurements.
3. **Detection beats prevention in interviews.** "We'll prevent prompt injection" is a hope; "input filters catch patterns, output checks catch compliance, traces flag anomalies — 30–60% unguarded → single digits guarded, from my c5 attack table" is an *engineering answer*. You have attack tables, PSI thresholds, and degradation ladders from your labs — deploy them.
4. **Writing then speaking exposes different gaps.** Writers hide behind structure; speakers reveal which sections they *understand* vs. *transcribed*. The 10-minute spoken run always exposes two or three "I wrote it but can't defend it" spots — that's the drill doing its job. Fix them by understanding, not memorizing.
5. **The template is a career artifact.** Seven sections, one page, numbers everywhere, failures with detection paths. The same structure passes interviews, governs architecture reviews, and — scaled to 5 pages — becomes the RFC your future team debates. You are rehearsing the document form that runs the industry.

## Common mistakes

- **Ten-page docs.** The one-page limit is the exercise: constraint forces prioritization, and prioritization *is* senior judgment. Ten pages says "I can't decide what matters."
- **Grading yourself generously.** A rubric you flatter yourself with teaches nothing. Score the draft as if a skeptical staff engineer with your lab data in hand were reading.
- **Rewriting prose instead of thinking.** The rewrite must add *specificity* (numbers, mechanisms, detection paths), not adjectives. If v2 is just shorter, you edited; if it's *measurabler*, you upgraded.
- **Skipping the spoken run.** The doc that reads well and presents badly is the interview that goes badly. Ten minutes, out loud, recorded — the recording is the mirror.

## Interview lines this lab earns you

The doc itself is the line. Bring it: "Here's a one-page design for this exact problem — requirements with numbers, the three scariest failures with detection paths, eval gates, and unit cost from a cost tree I maintain. Want me to walk you through it or stress the failure section?"
