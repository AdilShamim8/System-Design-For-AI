# Mock 13 — Design the AI Code-Review Bot (Trust, but Grade)

**45 minutes.** Interviewer reads the prompt, candidate drives. Timer segments: 10 clarify + scope · 20 architecture · 10 deep dive · 5 curveballs. The interviewer's job is to push ONE level past the candidate's comfort — the deep dive is where levels are decided.

## The prompt

You join a 400-engineer company shipping 1,200 PRs/day. The platform team wants an AI review bot: comment on correctness, security, and style before humans look. Hard requirements: reviewers spend less time, no bot comment may be confidently wrong (one hallucinated 'this is a bug' on a correct line costs the program its credibility), and it must handle the long tail: 40 languages, 200 repos with different conventions. The CTO asks: what accuracy bar, what latency, and how do you roll it out without burning trust in week one?

## Candidate-quality walkthrough

The winning structure treats the bot as a *precision-gated trust product*, not a model demo.

**Clarify (the bar-setting):** what's the current review latency and how much must it drop? What fraction of PR touches are high-risk (security, payments, auth — maybe 5 percent)? What happens on a wrong comment today (nothing — that's the credibility problem)? The precision question IS the product question: a bot that comments must be right.

**Architecture — three layers plus the trust meter:**
1. **Triage router:** classify each diff hunk by risk and language — the 5 percent high-risk hunks get the frontier model with full context; the style/tail hunks get deterministic linters FIRST (the cheapest reviewer is a compiler: type errors, lint, and static analysis are free and never hallucinate — the LLM only sees what deterministic tools cannot catch). The router itself is cheap: hunk size, path patterns (tests vs src vs infra), language.
2. **Comment generation with evidence constraints:** the model must cite line numbers and quote the exact code it refers to (verifiable claims only — 'this loop can overflow: line 47, `while i <= len(xs)`' can be checked; 'this is bad practice' cannot), and each comment carries a severity tag and a confidence band. Low-confidence findings post to the PR as 'possible issue, unverified' or stay silent — the asymmetry: a missed minor issue costs little; a wrong confident comment costs the program.
3. **The evaluation harness (the part that makes this a system):** a golden set of PRs with known issues (mined from historical bug-fix commits: 'the diff that FIXED a bug' implies the prior diff INTRODUCED it — a free labeled dataset nobody at the company has mined), precision measured weekly on sampled live comments with reviewer feedback buttons (helpful / wrong / noise), and a rollback trigger: comment precision below 90 percent pauses the bot automatically.

**The rollout (the trust plan):** week 1-2: silent mode — the bot reviews but only logs; measure precision against actual review outcomes. Weeks 3-4: opt-in repos with the founding team's projects (they file the false-positive bugs fast and kindly). Then: default-on for style/low-severity comments, opt-in for correctness claims. Auto-post on high-severity NEVER until precision on that class is >95 percent measured, not estimated. The CTO's answer: the accuracy bar is 90 percent overall, 95 for correctness-class comments, latency under 60 seconds (before the first human typically looks), and the rollout is precision-gated at every step.

**Cost:** 1,200 PRs/day x ~3K tokens of diff+context x ~30 percent routed to frontier at $15/M = ~$500-800/month; the rest on mid-tier or deterministic tools — an rounding error against 400 engineering salaries.

## The curveballs

1. **"A reviewer replies to the bot: 'wrong again.' The comment looks right to you. What's the protocol?"** — The strong answer: every reviewer reply is a label; this one goes to the disagreement queue, a human (not the model) adjudicates within 24h, and the pattern matters more than the instance — if the class is 'bot misreads cross-file invariants,' that class gets disabled, not re-prompted. The system's job is making ITS errors cheap to correct and fast to learn from. The weak answer: 'we tune the prompt' — prompt-tuning a precision problem on a live trust product is gambling with the brand.
2. **"Security team: the bot reads every repo's code. Walk me through the data governance."** — The bot is a data-flow problem wearing a reviewer costume: model calls must stay in-tenant (no shared caching across repos with different access levels — a cache hit leaking one repo's code into another's comment is a breach), vendor contracts cover code as training-data-opt-out, and the audit log (Q-AG-11's append-only pattern) records what code went to which model version — because in two years someone WILL ask 'was our code sent anywhere?' and the answer must be a query, not an archaeology dig.
3. **"The model vendor ships a new version. Comment style changes overnight and precision moves. What do you do?"** — Version pinning (Q-CC-14): the bot runs a pinned model; new versions roll out through the SAME golden-set gate as any code change — precision on the eval set, shadow for a week, then promote. The insight they're probing: the bot is a production system with a model-shaped dependency, and production systems don't take surprise upgrades.

## Scoring rubric (grade yourself honestly)

- **Junior:** model-on-diff architecture, knows hallucination is the risk. Misses: deterministic-tools-first, the precision bar, the rollout gates, the free labeled dataset.
- **Mid:** triage routing, evidence-constrained comments, a precision metric, a phased rollout. Handles curveball 1 with the disagreement queue when pushed.
- **Senior:** opens with the trust economics ('every wrong comment spends program credibility — the bot's product is precision'), mines the bug-fix history as a labeled set, defines per-class precision bars with auto-pause, and answers curveball 2 with tenant-scoped caching and the audit trail unprompted.
- **Staff:** everything senior, plus: the org design (who owns the bot's precision — platform, or a review-quality team?), the second-order effects (do humans review LESS because the bot commented? — measure review-depth metrics, not just latency), and the honest strategic frame: the bot should raise the floor (style, common bugs) precisely so humans can raise the ceiling (architecture, risk) — say what the bot is FOR, or the org will decide it's for replacing reviewers.

**Grounding:** Chapter C.1–C.2 · Labs b7, c2, c5 · Q-GEN-12 · mock 5 · FN-04
