# Coding 3 — The Point-in-Time Feature Join

**Time budget: 35 min.** Open book (docs, not solutions). Narrate your tradeoffs.

## The scenario

The classic ML-platform screen: two tables — `events` (one row per transaction: user, timestamp, amount) and `users_daily` (a daily snapshot table: user, date, rolling features). Your task: build a training set where every feature value is *knowable at prediction time*. The bug you must not commit: joining the daily snapshot *as-of the event's own date* — that snapshot may include the event itself (a6's rolling-stat leak, in its native habitat).

## Your task

A concrete leak example shown (an event included in its own 7-day count). The PIT join uses strictly-prior snapshots. The AUC gap quantified (a6 measured 50–60% MAE inflation on the forecast variant — here expect a visible AUC drop). The rule stated: *features may not see their own outcome's window.*

## Success looks like

1. Write the naive join (event LEFT JOIN snapshot ON user AND same-date). Show it's leaky — one concrete example row is enough.
2. Write the point-in-time join: every event joins the snapshot *strictly before* its timestamp (typically the prior completed day).
3. Quantify the leak: train a tiny model both ways, report the AUC gap.
4. Write the one-sentence rule for your code comments and your interview narration.

## Dataset

Synthesize your own tables (10 min) or use the generator in Lab a6 — the data doesn't matter, the join logic does. 20 users × 90 days of events + a daily snapshot with `txn_count_7d`, `amount_mean_7d`.

## After your attempt

Open [SOLUTION.md](./SOLUTION.md). Grade yourself against the checklist at the end.
