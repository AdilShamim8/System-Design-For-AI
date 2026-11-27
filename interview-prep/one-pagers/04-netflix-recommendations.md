# 04 — Netflix Recommendations (personalization at watch-time)

**The system in three sentences.** One-third of viewing from recommendations, a catalog that churns hourly, and a global audience: the canonical personalization system. The architecture: offline-learned models refreshed frequently, a huge feature/metadata layer, ranking with contextual signals (time-of-day, device), and artwork personalization — the same item, different thumbnail per user — as the famous AI flourish. It's also the home of the best experimentation discipline in industry (their AA-test culture).

## The spine (draw it in 60 seconds)

```
catalog + user history → candidate models (many, blended) → ranker (contextual)
      → row/page construction (which row, which position) → artwork selection
             ↑ plays/completion stream back; A/B is the only truth ↑
```

## The numbers to carry

The one-third-of-viewing stat is Netflix's own published number — cite it as theirs · row-level AND item-level personalization (the page is ranked too) · a8 lab: their published experimentation discipline (AA tests, guardrail metrics) is the reason to copy the process · completion rate, not clicks, is the north star (the FN-11 lesson, institutionalized)

## The failure modes that get probed

Interest decay (yesterday's binge shouldn't dominate forever) · the cold catalog (new titles: content-based + exploration) · offline/online divergence (famously severe for them — cite it) · the metric-vs-goal trap (optimizing watch time can optimize junk; they've published on this too)

**Interviews this arms you for:** Q-ML-1/7, Mock 2 · the personalization family and every 'how do you evaluate a recommender' follow-up

**The AI-era twist (say it before they ask):** The twist to volunteer: Netflix's eval culture IS the system — the models churn, the experimentation rigor is the moat. Say 'I'd copy their AA-test-first process before their architecture' and you sound like someone who's shipped.
