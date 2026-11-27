# Coding 8 — An Eval Harness That Gates a Prompt Change

**Time budget: 45 min.** Open book (docs, not solutions). Narrate your tradeoffs.

## The scenario

The applied-LLM screen: 'We changed a prompt. Build the thing that tells us whether to ship it. Inputs: a golden set of 100 question/answer/doc-triplet rows, old-prompt and new-prompt outputs for each, and a judge prompt. Requirements: score both variants, per-slice breakdown (by question type), a regression gate (new must not lose >2 points on any slice), and a verdict: SHIP / NO SHIP / INVESTIGATE.' b2/b3's discipline as a take-home-grade artifact.

## Your task

Both metric types computed correctly (retrieval exact, generation judged). Per-slice table present. Verdict logic closed and explainable. The two harness-failure modes named: judge drift (version the judge prompt, re-baseline on change) and golden-set skew (resample quarterly from production, stratified).

## Success looks like

1. Load the golden set; compute per-row scores for both variants (exact metrics for retrieval — hit@k on doc overlap; judged scores for answers — faithfulness 1-5).
2. Per-slice aggregation with the regression rule: any slice worse by >2 points → flag.
3. The verdict logic: SHIP (no slice regression and overall ≥ baseline), NO SHIP (overall regression), INVESTIGATE (mixed).
4. Emit a one-page report: overall, worst slice, the 5 biggest per-row deltas both directions.
5. State the two ways this harness itself can lie (judge drift, golden-set skew) and the guard for each.

## Dataset

Golden set: 100 rows with columns [question, expected_answer, retrieved_docs, slice]. Generate outputs for both prompts however you like (mock-able: the harness takes output columns as inputs). Judge: an LLM-as-judge call or a pre-scored judge column — the harness must work with both (grading offline vs API mode).

## After your attempt

Open [SOLUTION.md](./SOLUTION.md). Grade yourself against the checklist at the end.
