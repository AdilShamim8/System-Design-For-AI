# Lab b4 — Worked Solution and What the Numbers Mean

## Expected results (our runs, 150 questions, MiniLM + small judge model)

| Measurement | What we got |
|---|---|
| hit@4 / MRR@4 | ≈ 0.75 / ≈ 0.58 (your b2 numbers carry over) |
| Faithfulness (judged, on hits) | ≈ 0.85–0.95 |
| Answer relevance ≥ 4/5 | ≈ 0.85–0.95 |
| Judge position bias (identical A/B) | ≈ 25–35% non-tie picks without randomization |
| Judge self-agreement, temp 0 | ≈ 0.95+ |
| End-to-end "good answer" (hit AND faithful AND relevant) | ≈ 0.65–0.75 |

That last row is the number to quote: the **compounding** of stage quality. 0.75 retrieval × 0.9 faithfulness × 0.9 relevance ≈ 0.61 — and users experience the product of stages, never the stages.

## The five lessons hidden in those numbers

1. **Users experience the product, not the parts.** Each stage looks healthy alone; their product is your dashboard's truth. This is why single-stage metrics mislead and why the two-tier harness exists — you can only fix the stage you can *see*.
2. **Cheap exact metrics come first, expensive fuzzy metrics second.** Hit/MRR cost nothing and catch half the failures (retrieval). Judges cost tokens and catch the other half (generation). Teams that invert this order spend 100× more for noisier signal — and teams that skip tier 1 judge *retrieval* failures as *generation* failures and "fix" the wrong stage (b2's central lesson, now with a budget attached).
3. **Faithfulness is the trust metric; relevance is the usefulness metric.** Faithful-but-irrelevant = politely recites the wrong page. Relevant-but-unfaithful = sounds helpful, cites nothing — the most *dangerous* quadrant, because users can't tell (this is precisely the Air Canada pattern). Grading both forces every answer to clear two bars, and the unsupported-claims list turns "hallucination" from a vibe into a *countable object*.
4. **Judges have measured biases; measure them before trusting them.** Position and length bias are real and cheap to expose (Part 3's identical-A/B test is ten minutes). Mitigations — randomized order, rubrics, temp 0 — cost nothing once you know they're needed. "We calibrated the judge against 50 hand-labeled answers, κ = 0.72" is a sentence that instantly separates you from demo-driven teams.
5. **The eval set is the system's memory.** Pipelines rot (a7) and prompts churn (b2's Part 5); the versioned eval set is what makes change *safe*. The CI gate from Checkpoint 4 — no merge without a re-run — is the cultural difference between "we sometimes test it" and "we have an eval discipline."

## Common mistakes

- **Judging against the gold answer instead of the retrieved context.** RAG answers can legitimately differ from SQuAD's extraction span; faithfulness is about the *context*, relevance is about the *question*. Judging against gold measures span-matching, not grounding.
- **Running the judge at default temperature.** Judgments drift run-to-run; your eval becomes irreproducible. Temp 0 (+ JSON output mode) is the minimum discipline.
- **Sampling only easy questions.** SQuAD validation is front-loaded with famous paragraphs; sample randomly, and once failures accumulate, add the hard ones to the set deliberately.
- **Reporting one aggregate score.** "RAG score: 87" hides which stage regressed. The two-tier dashboard (hit + faithfulness + relevance, separately) is the entire point.

## Interview lines this lab earns you

- "I grade retrieval and generation separately because they fail separately: hit/MRR are free and exact and run in CI; faithfulness and relevance get a temperature-0 LLM judge whose position bias I measured before trusting — 25%+ flip rate on identical pairs until I randomized order."
- "Users experience the product of stages — my 0.75 hit × 0.9 faithfulness × 0.9 relevance compounds to ~0.61 good answers, and that compound number is the only one I put on the dashboard."
