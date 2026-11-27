# 06 — The Facebook/Meta News Feed (fan-out and its economics)

**The system in three sentences.** Five hundred million posters, billions of scrollers, and one question: compute the feed when it's written or when it's read? The classic answer — fan-out on write for mortals, fan-out on read for celebrities (the hybrid), because a celebrity's post written to every follower's feed queue would be a write storm. Then ranking on top, and the feedback loop that made 'the algorithm' a household word.

## The spine (draw it in 60 seconds)

```
post → fan-out decision (celebrity? read-time) → feed store / computed-at-read
read: candidate feed + retrieval sources → ranker (~100-300ms) → re-rank (integrity, diversity)
             ↑ impressions/clicks/dwell → training data → the loop FN-02 documented ↑
```

## The numbers to carry

The hybrid fan-out split is the expected vocabulary (celebrity vs mortal) · ranking budget ~100-300ms at read time · the feedback-loop pathologies are THIS course's a2/FN-02 material: popularity spirals, filter bubbles, and the exploration quota as the fix · integrity re-ranking exists (say it — feeds fight spam/engagement-bait as a first-class layer)

## The failure modes that get probed

Fan-out storms (the celebrity write problem — the hybrid IS the fix) · feedback loops (the model trains on what it showed — FN-02's footprint problem) · integrity/spam co-optimization (engagement vs health: the guardrail-metric discipline) · stale feeds (pull vs push freshness)

**Interviews this arms you for:** Q-BR-3 (news feed → AI feed, the direct bridge), Mock 2 · every feed question and every feedback-loop follow-up

**The AI-era twist (say it before they ask):** The AI-era feed is the same spine plus LLM-summarized content, semantic retrieval as a candidate source, and — the honest twist — the regulation: feed-ranking is now a compliance surface (explainability, 'why am I seeing this'), which is Q-AG-11's audit trail wearing a social costume.
