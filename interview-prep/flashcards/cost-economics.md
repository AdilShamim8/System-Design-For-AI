# Flashcards — Cost Economics

20 cards. The money layer: pricing mechanics, the levers in order, the CFO conversations. Pairs with cheatsheet #6, drill bank 07b, Q-CC-10, and Mock 10.
---

**The three cost layers every service must report.**

> Inference (API spend or GPU-hours) · fully-loaded (plus storage, eval, embedding, observability — often 1.5-3x inference) · marginal (the next 1,000 requests — where caching and routing pay; often 30-50 percent below average) (Q-CC-10).

**The headline metric that beats monthly spend.**

> Cost per successful interaction: $0.11/resolved ticket vs $2.90 human baseline is a strategy; $11K/month is unactionable (Q-CC-10).

**The four cost levers, in order of deployment.**

> (1) Prompt diet (delete the boilerplate — most bills are 70-80 percent repetitive context), (2) caching (exact then semantic), (3) routing (tier down the easy 70 percent), (4) only then: fine-tune or distill (Q-GEN-13, coding-12).

**Prompt-cache economics — the number.**

> Cache-hit input is ~10 percent of normal input price; static prefixes (system prompt, few-shots, tool schemas) are often 20-40 percent of the bill — pinning the prefix turns them into near-free.

**The semantic cache's value depends on traffic shape.**

> 30-50 percent hit on support-class traffic (repeats cluster Zipf-style), ~0 percent on unique queries — measure YOUR traffic's repeat curve before promising savings (b5).

**Routing's measured claim.**

> 70 percent of traffic routed down-tier with no measurable quality loss ON THE EVAL SET — the gate is the eval set, not faith (b6, coding-12).

**Frontier vs mid vs small — the price shape.**

> Roughly an order of magnitude per tier down ($15/M frontier, $3/M mid, $0.5/M small blended-class); the ratio matters more than the absolutes — prices rot, ratios persist.

**The fine-tune's honest cost structure.**

> One-time: labeling (50-100K verified examples, $50-100K) + training (LoRA on 3B: ~12 GPU-hours — an afternoon, drill 16). Recurring: serving (self-hosted GPUs, $2-4K/month at modest volume). Payback: 6-12 months IF accuracy parity holds — which the eval gate must prove (Mock 10).

**When fine-tuning is the WRONG answer, one line.**

> When the knowledge changes daily — models can't memorize a moving corpus; that's retrieval's job (B.6's matrix: fine-tune for FORM, retrieve for FACTS).

**The $11K/month context-bill decomposition.**

> 30-50 docs poured into context = mostly irrelevant: retrieval selects the 5 that matter (~60x token cut at parity — b3's 4.5K vs 300K), then cache the static prefix, then route — say the levers in order with their sizes (Q-GEN-13).

**GPU-hours vs dollars — why the unit matters.**

> GPU prices move; GPU-HOURS are the stable unit for capacity math. '12 A100-hours for the LoRA, ~6K GPU-equivalents for 40K concurrent streams' translates to money only at the end (drill 16, mock 14).

**The eval platform's budget pitch — three numbers.**

> (1) Incident cost (one week of three engineers + churned accounts), (2) leverage (15 teams x 1 engineer each doing evals badly = 15; 2 central = net saving), (3) the compounding asset (golden sets appreciate) (Q-CC-12).

**Vendor contract: the expensive provider is the one that changes under you.**

> Version pinning and reproducibility beat list price: without pinning, every eval score is a snapshot of a model you no longer run. 15 percent premium for 24-month pins + zero retention is usually right for regulated workloads (Q-CC-14).

**The cost of a wrong answer vs a slow one.**

> Latency degrades experience recoverably; a confidently wrong answer is a liability event (Air Canada) — guardrail and eval spend is insurance priced against the incident, not a feature cost (FN-04).

**The canary's cost — why experimentation is cheap.**

> 2 percent of 50M requests x $0.002 = ~$2-3K for a two-week champion/challenger — 'the cheapest insurance in the stack' (drill 24, Q-ML-14).

**The storage classes by temperature.**

> Observability: hot, sampled, 30-day, expensive-per-GB. Audit: cold, complete, write-once, 18-month, ~$23/TB/month. Retrofitting audit onto observability tools pays hot prices for cold data (Q-AG-11).

**Unit economics for agents — the worst-case math.**

> Max 15 steps x growing context: re-sent context dominates — ~255K tokens worst case ≈ $0.004/episode frontier-class. The lever is context truncation (tool results summarized, not dumped) — 3-5x cheaper, same task (drill 21, c1).

**The 'what would I cut next' ladder — memorize the order.**

> Prompt diet → cache (exact, then semantic) → route down-tier → distill the stable tier → re-architect the product. Always present the ladder, never a single cut (coding-12).

**The CFO conversation, one sentence.**

> 'We keep the frontier model for the 30 percent of calls that need it; the rest go to a model 10x cheaper, quality unchanged on the eval set — here's the curve and what would change my mind.' Cost stories need a number, a metric, and a falsifier.

**The trend that beats every optimization.**

> Model prices fall ~10x per 2 years at constant capability — run the fine-tune's payback math AGAINST 'just wait' at frontier prices, and say the comparison out loud (Mock 10's staff-level close).
