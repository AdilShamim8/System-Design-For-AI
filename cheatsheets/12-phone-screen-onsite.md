# 12 — The Phone Screen & Onsite Day Card

*The last card, on purpose: everything here assumes the bank, mocks, and decks are already in your head. This is the day-of card — what to do in the 10 minutes before each round, what to say in the first 60 seconds, and how to spend the whiteboard's real estate.*

## Round-by-round: the 10-minute pre-brief

| Round | Read (10 min before) | Have loaded | Do NOT re-read |
|---|---|---|---|
| ML system design | Your round-2 bank's strongest answer + that track's cheatsheet | The 6-step framework, 3 numbers from YOUR labs | New material — zero new inputs after T-24h |
| GenAI/RAG | 02-rag-checklist + mock 1's walkthrough | Chunking→retrieval→rerank→cited-gen spine, b3's numbers | Vector-DB comparisons (use the card, don't re-derive) |
| Agents | 03-agent-checklist + mock 5 or 12 | The loop, the tool contract (6 items), the budget trio | Multi-agent papers you skimmed once |
| Coding | The coding deck + one SOLUTION you already wrote | The split-answer table, the cost-threshold formula | A new LeetCode problem (wrong game entirely) |
| Behavioral | Your top-5 STAR stories (one-liners only) | The deep-dive guide's 5 attack patterns | New stories — you'll reach for them under stress |
| Takehome defense | Your own artifact + the defense-call section | 3 deep-dive threads YOU want to be asked | The takehome spec (you know it; that's the point) |

## The first 60 seconds (every round)

1. **Restate the problem your way** — one sentence, their words + your frame ("So this is a recall/latency tradeoff on a changing corpus").
2. **Ask your two questions** — scale and failure cost. Asking "what's the budget?" and "what happens when it's wrong?" reads as senior in ANY round.
3. **State your structure** — "I'll clarify for ten, design for twenty, and leave the last ten for the failure modes — sound good?" The structure-offer is a free strong-yes.

## The whiteboard/map budget (design rounds)

| Real estate | Content | Why |
|---|---|---|
| Left third | The request path, top to bottom — user → gateway → retrieval → model → response | The spine interviewers photograph |
| Right third | The data path + feedback loop (training, eval, monitoring) | The AI-specific third that separates you from classical candidates |
| Bottom strip | Numbers: latency budget per hop, cost/request, the eval metrics with values | The strip that gets you hired — numbers are the seniority tell |

## The three recovery moves (when it's going badly)

- **Blanking:** "Let me back up — the constraint I'm designing around is X" — restart from a constraint, not the diagram.
- **Challenged hard:** concede specifics, not the frame ("You're right that p99 was the wrong percentile for a streaming product — p95 TTFT is the user-felt one"). A precise concession reads STRONGER than unchallenged certainty.
- **Out of time with a hole in the design:** name the hole yourself, with the fix you'd do next ("What's missing is the cache invalidation story — corpus versioning, five minutes if you want it"). Self-identified gaps are controlled; interviewer-identified ones aren't.

## Between rounds (onsite logistics)

- 5-minute reset ritual: bathroom, water, one slow breath, next round's pre-brief row. No post-morteming the previous round — it taxes the next one.
- Lunch with the team is a round: they're checking "would I sit next to this person." Curious questions about their systems > performing.
- The final "any questions?" — use the strong three (90 days, biggest AI risk, how evals gate releases). Then STOP talking.

## The same evening

Send one short thank-you per interviewer — one sentence referencing the specific technical thread from THEIR round. Not a template. Then close the laptop: the 48-hour rule applies to outcomes too — no re-litigating answers at midnight.

---

**Where this card shows up in the interview layer:** the day itself — round pre-briefs and recovery moves
