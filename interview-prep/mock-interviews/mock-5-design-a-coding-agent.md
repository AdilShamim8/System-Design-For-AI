# Mock 5 — Design a Coding Agent

## The prompt

"Build an internal coding agent for our 200-engineer org: it takes a ticket, finds the relevant code in a 5M-line monorepo, makes the change, runs the tests, and opens a PR. Engineers must trust it enough to review its PRs quickly — and it must never do damage. Design it."

*45 minutes, paper, timer. Attempt cold first.*

---

## Candidate-quality walkthrough

**[0:00–5:00 Clarify]** "Trust and safety are the two words in your prompt doing the most work. Questions: what task mix — bug fixes, small features, refactors? What's the test-suite runtime and flake rate? What can the agent access — full repo read/write, CI, secrets? And 'never do damage' — is that legal/privacy damage, production damage, or code-review burden damage? Those have different answers." Interviewer: bug fixes + small features first; 40-minute CI with 5% flake rate; repo write on branches only, no prod access, no secrets; the danger is wasted review time and subtly-wrong merges.

**[5:00–10:00 Estimate]** "200 engineers, say 30% adopt in month one, ~5 tickets/week each touched by the agent ≈ 1,500 agent runs/week. At ~10 LLM loop-steps each with repo context (~10–20K tokens/step — the repo is 5M lines, so *context selection is the whole game*), that's ~1.5M tokens/run, ~2B tokens/week at frontier-ish pricing… $20–60K/month. That number tells me the architecture must be token-frugal: small models for the easy 80%, context that's *selected*, not stuffed. The cost model just decided my design before I drew a box."

**[10:00–20:00 High-level]** Draws the pipeline: ticket → **planner** (decompose into steps, identify files — one expensive-model call, structured output) → **retrieval** (code-aware: call-graph + symbol index + embeddings over files/functions — never raw grep) → **edit loop** (read file → propose diff → apply on a git branch → run focused tests → read failures → iterate, bounded) → **verification** (full test suite + lint + diff self-review pass) → **PR with evidence** (diff, test results, confidence, what-it-didn't-check). Infrastructure ring: sandboxed execution (containers, no network, resource caps), trace logging, eval set of completed tickets, budget guards per run. Walks one ticket end-to-end, naming token budgets per stage.

**[20:00–35:00 Deep dive — interviewer picks "how does it not waste my review time" and safety]** "Review burden is the product metric — a PR that takes longer to review than writing the fix is negative value. Mechanisms: (1) **evidence-first PRs**: diff + why-this-file + test-output + 'confidence + what I could not verify' — my capstone's repair loop showed agents that *read structured test output* fixed 9/10 localized bugs vs. ~5/10 with misleading failures; the same signal that fixes code grades the PR. (2) **Bounded scope**: small diffs, one-ticket-one-PR, planner refuses tickets needing >3 files touched without human pre-approval. (3) **The eval harness**: every completed human PR becomes a regression case — 'the agent on ticket X should produce a diff equivalent to this fix' — trajectory-graded, not just outcome (my agent-eval lab: outcome grades miss the flail; trajectory grades catch it). (4) **Tiering**: easy tickets (docs, renames, obvious fixes — the small model, fast+cheap), medium (the main loop), hard (flagged to humans *by the agent* with a summary — knowing when to bail is a trained behavior, not a hope). Safety, the concrete version: git-branch-only writes with reviewable diffs; sandboxed test execution — no network, CPU/time caps (a `while True:` test dies by timeout, not by taking the CI fleet); no secrets in the sandbox by construction; irreversible actions (force-push, branch delete) simply absent from the tool surface. The reversibility grid: repo edits = reversible-cheap (git), CI = shared resource (capped), production/secrets = not in the toolset at all. That's 'never do damage' as an architecture, not a promise."

**[35:00–40:00 Tradeoffs]** "What I gave up: full autonomy (PRs always human-reviewed — the org trusts review, not models, and that's *correct* for now); multi-agent architecture (planner + executor is two *roles* in one loop, not a team — my multi-agent lab showed handoffs multiply failure points without isolation wins here); and repo-wide context (retrieval discipline over 200K-token stuffing — cost and 'lost in the middle' both say no). The flake rate is a real enemy: flaky tests teach the agent false causality — the fix is test-attribution (re-run flakes before believing failure) plus a flake-blocklist."

**[40:00–45:00 Operate]** "Dashboards: PRs opened/merged without changes (the trust metric — target 60%+), review-time-per-PR vs. human baseline, test-pass rate at first PR, token cost per merged PR, sandbox escapes (zero, ever, with alerting), flake-correction rate. Rollout: dogfood on internal tooling tickets first (low blast radius), then bug-fix class, then features. The riskiest assumption is that the monorepo's test suite is trustworthy enough to be the agent's teacher — the 5% flake rate is actually my first project."

## The curveballs

- "It passes tests but the diff is ugly — functionally fine, unmaintainable." → "Style/quality gates in verification (lint + a code-quality model + the diff self-review pass), and training signal from review comments — every 'LGTM but refactor X' becomes data. Long-term: the eval set grades *review friction*, not just test-pass."
- "Two engineers argue it should write directly to main with auto-merge on green tests." → "Green tests ≠ correct — my misleading-failure lab result (agents follow the traceback; misdirection works) applies to *humans* accepting tests as ground truth too. The blast radius of a subtly-wrong auto-merge (a 200-engineer monorepo) vs. the savings of skipping review — that math never works. Auto-merge for docs and lockfile bumps; never for logic."
- "Frontier model scores 40% better on your eval but costs 3×. Route how?" → "Tier by ticket complexity with escalation: planner confidence routes the easy 70% to small, medium 25% to mid, hard 5% to frontier — my routing economics (60–80% savings at ±1pp quality). Eval-gate each tier monthly; models drift."

## Scoring rubric (condensed)

Strong-hire signals: cost estimation *before* architecture; context-selection as the core problem; review-burden treated as THE product metric; safety as absent capabilities + sandbox, not prompt rules; trajectory-graded eval set growing from human PRs. Weak signals: "RAG over the codebase" as the whole answer; tools with no contracts; no budget guards; "tests passing means it's correct."

**The hire-line:** coding agents are the current frontier interview — the winners talk *verification, evidence, and restraint*; the losers talk models and demos.
