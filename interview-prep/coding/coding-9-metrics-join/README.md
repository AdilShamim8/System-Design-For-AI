# Coding 9 — Join Model Scores to Business Outcomes (Without Lying)

**Time budget: 40 min.** Open book (docs, not solutions). Narrate your tradeoffs.

## The scenario

The platform screen that follows every deployed model: two logs — `predictions` (user_id, timestamp, model_version, score) and `outcomes` (user_id, event_time, converted: bool, revenue) — with no shared key except the user and time. Your manager asks one question: 'does the new model version make us more money?' The traps: outcomes arrive on a delay (a conversion can land days after the prediction), users appear in both logs multiple times, and the naive join attributes every outcome to every prediction.

## Your task

1. Write the naive join (every prediction × every outcome for the same user). Show one concrete row where it double-counts.
2. Write the attribution rule: each outcome belongs to the MOST RECENT prediction STRICTLY BEFORE it. Implement it.
3. Handle unattributed outcomes (no prior prediction) and never-predicted users — decide and justify.
4. Compute revenue per prediction and per model version; state the comparison you'd report.
5. Name the two ways this analysis could still mislead (attribution-window choice; version-overlap periods).

## Success looks like

The double-count row is shown before it is fixed. The attribution uses strictly-prior, most-recent logic. Unattributed outcomes are handled with a stated rule, not dropped silently. The comparison names its window and its overlap caveat.

## Dataset

Self-generate: 1,000 predictions across 2 model versions over 14 days; outcomes with a 0–3 day delay; some users convert twice, some never. Or adapt Lab a3's data.

## After your attempt

Open [SOLUTION.md](./SOLUTION.md). Grade yourself against the checklist at the end.
