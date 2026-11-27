# 01 — YouTube Recommendations (the three-stage pattern)

**The system in three sentences.** Billions of users, a corpus nobody can rank exhaustively, and a latency budget measured in tens of milliseconds. The answer that defined the industry: split ranking into cheap recall and expensive precision — candidate generation (hundreds from millions), then ranking (hundreds scored), then re-ranking (diversity, freshness, business rules). The pattern transfers to every feed, search, and ads system you will ever be asked about.

## The spine (draw it in 60 seconds)

```
user → candidate generation (CF + trends + session) → ~500 candidates
      → ranking (pointwise model, shared features) → top-N scored
      → re-ranking (diversity, freshness, caps) → the page
             ↑ every impression/click/dwell streams back to training ↑
```

## The numbers to carry

Covington et al. (2016) is the citation to name · my a2 lab: top-decile items take ~50 percent of ratings (the popularity spiral the re-rank layer fights) · offline/online rank flips (a8) — offline wins are rumors · latency: the whole funnel in ~100-200ms, per the Covington paper's constraint

## The failure modes that get probed

Popularity spiral (the model trains on what it showed — exploration quotas) · cold-start users and items (content-based + exploration budget) · feedback latency (training on yesterday's behavior) · metric gaming (watch TIME vs clicks — optimizing the proxy isn't the goal, FN-11)

**Interviews this arms you for:** Q-ML-1, Q-ML-7, Mock 2, Mock 15 · the three-stage vocabulary is expected at every level

**The AI-era twist (say it before they ask):** The classic was 'two towers' (retrieval + ranking); the 2026 version adds learned retrieval, LLM-written item summaries as features, and the eval discipline (offline/online divergence) becoming the hard part — the architecture survived, the measurement got harder.
