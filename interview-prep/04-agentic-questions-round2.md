# Agentic System Design Questions — Round 2

**Five more, all operations.** Round 1 covered the loop and the tools; round 2 covers what happens when agents run for real — at 3 AM, in front of auditors, and across a fleet you can't watch. These are staff-level probes: the design is assumed; the question is whether you can *run* it.

## Q-AG-10 — The Fleet at 3 AM

**Scenario:** Your company runs 4,000 conversational agents in production. At 02:14, an upstream prompt-template service starts returning templates with an unrendered placeholder. Agents are producing malformed replies to every user. Nobody is awake.

**Your task:** Design the 3 AM story before it happens.

### Worked answer

The oncall's experience is the design artifact. Detection (before humans notice): output-schema validation on every generation (b7's layer) fires within seconds — malformed output rate crosses its SLO and pages; the runbook's first line is the mitigation, not the diagnosis. Mitigation (minutes): the gateway applies the last-known-good template from its local cache — versioned templates mean rollback is config, not code (this is why template/version pinning is an agent-platform requirement, not a nicety). Blast-radius control: per-tenant circuit breakers (cap2's isolation) stop one upstream's failure from becoming every agent's failure; the fleet degrades to template-less canned responses rather than garbage. Diagnosis (morning): the trace on the first failed generation (c5: traces are the product) shows the unrendered placeholder — root cause is a 20-line diff in the template service, found before the postmortem meeting starts. The staff-level point: every element here — schema validation, versioned rollback, circuit breakers, trace-first debugging — was an architecture decision made months before the incident. 3 AM is when architecture pays its bill.

**Grounding:** Chapters C.1, X.5 · Labs b7, c5 · cheatsheet #10 · diagrams/5

---

## Q-AG-11 — The Auditor Wants the Tapes

**Scenario:** An enterprise customer's auditors demand 18 months of agent decision logs: every tool call, every input, every output, who approved what, and provable integrity. Your logs currently live in a 30-day observability backend.

**Your task:** Design for auditability without drowning in storage.

### Worked answer

The core move: separate *observability* from *audit* — they look like the same data but have opposite economics (observability is hot, sampled, expensive-per-GB, 30-day; audit is cold, complete, write-once, 18-month). Audit stream: every decision-relevant event (tool call, approval, generation, human override) lands in an append-only log (S3-class object storage with object lock / WORM), partitioned by tenant and month — storage at ~$23/TB/month for cold tiers means 18 months of even a heavy fleet is a rounding error next to your LLM bill. Completeness is the hard part: define the event schema *before* the first audit (c5's trace schema is the starting point — tool name, hashed inputs, output hash, approver, policy version), because you cannot backfill what you didn't capture. Integrity: hash-chain events per tenant-day (each record includes the previous record's hash — tampering is provable, not assumed) and anchor the chain head periodically. Access: audit logs are read-on-demand, not searchable — build the export path (auditor gets signed manifests + a manifest-verifier script), not a query interface. The trap in the question: retrofitting audit onto an observability tool — you'll pay hot-storage prices for cold data and still fail the completeness check.

**Grounding:** Chapters C.2, C.5, X.3 · cheatsheet #10 · ai-stack/observability-eval.md

---

## Q-AG-12 — Agent or Workflow?

**Scenario:** A stakeholder wants 'an agent' for invoice processing: 3 document types, 5 extraction fields, a validation rule set, and a $500 approval threshold. Volumes are 2,000/day. You suspect a workflow engine would be better.

**Your task:** Make the case — either way — with a decision framework.

### Worked answer

The framework: agentification pays when the *path* is unpredictable and the *failure cost* is bounded; workflow pays when the path is enumerable and the failure cost is high. Invoice processing: the path IS enumerable (parse → extract → validate → route by amount → approve) — the variance is in the *extraction*, not the routing. So: deterministic workflow spine + LLM at the two genuinely fuzzy steps (extraction, and maybe a classification edge case) — this is the C.1 lesson inverted: agents earn their complexity budget only where variability lives. The math that wins the room: an LLM call at each of 5 steps for 2,000 invoices/day at ~2K tokens/call ≈ $180–600/month at mid-tier pricing *per step* — a workflow with LLM at 2 steps cuts that 60% and removes 3 non-determinism surfaces from an audit-relevant process. Where the stakeholder is right: if invoices arrive in 40 formats across 12 languages with routing rules that change quarterly, the path stops being enumerable — then an agent with a tool grid (c2) plus human gates at the $500 line is justified. The decision test to say out loud: 'we agentify the steps where we cannot enumerate the cases; we workflow everything else.' That sentence is the whole answer.

**Grounding:** Chapters C.1, C.2, B.6 · Lab c1 · cheatsheet #3

---

## Q-AG-13 — The Sandbox That Leaked

**Scenario:** Your coding agent runs user-submitted code in a sandbox. Security review finds: the sandbox shares a host with other tenants, has network access, and keeps a 30-day credential on disk. The agent is 30% slower in a stricter sandbox.

**Your task:** Design the sandbox tier list — and defend the 30%.

### Worked answer

Tier by blast radius, not by user. Tier 0 (trusted, signed, org-internal code): shared host, warm pool — speed matters, code is accountable. Tier 1 (untrusted, user-submitted, no credentials): ephemeral VM or gVisor-class isolation, no network egress by default (allow-listed package registries only), no persistent disk — 30% slower, non-negotiable (my c4 lab ran exactly this trade: strict isolation cost ~30% latency; the alternative is a tenant escaping into another tenant's run). Tier 2 (untrusted + needs network, e.g. 'test against my staging API'): network policy per-destination with per-run credentials minted and destroyed at run end — nothing 30-day on disk, ever; the credential lifetime equals the run lifetime. The defense of the 30%: frame it as the price of the worst day — 'the 30% applies to untrusted code only, and the counterfactual is cross-tenant data exposure, which is an incident report and a contract breach, not a latency number.' Where you can win the 30% back: warm pools of pre-booted Tier-1 sandboxes (amortize the boot, keep the isolation), snapshot-restore instead of cold start, and running the *model* call outside the sandbox (the agent decides outside; only the execution is jailed). The architecture sentence: the agent's intelligence is expensive and shared; its *hands* are cheap and disposable — isolate the hands.

**Grounding:** Chapter C.5, C.6 · Lab c4 · cheatsheet #10 · ai-stack/serving-infra.md

---

## Q-AG-14 — The Agent That Got Promoted

**Scenario:** Your support agent works so well the business wants to expand it: refund approvals up to $200, subscription changes, and account deletion. Each new capability was 'just one more tool.' Nobody has re-looked at the design in six months.

**Your task:** Audit the agent's capability surface — what's the checklist?

### Worked answer

The audit has five gates; anything failing a gate gets demoted until fixed. (1) Capability inventory: list every tool with its blast radius (read, write-money, write-identity, irreversible) — the exercise usually finds tools nobody remembers adding; cap the inventory at what the *current* eval set covers (an unevaluated tool is an unmonitored tool). (2) Authority alignment: irreversible actions need human gates regardless of accuracy (c2's grid) — account deletion has no rollback, so it never gets full autonomy; $200 refunds sit at the edge: acceptable with per-customer daily caps and a sampled human audit. (3) Injection surface: each new tool multiplies the attack surface (indirect injection via a 'refund my order' note inside a support email — my c3 numbers: unguarded compliance 30–60%, the filter+hygiene+check stack takes it to single digits, but single digits × 4,000 refunds/day is still weekly events — hence caps). (4) Eval coverage: every tool needs its own adversarial slice in the eval set (the refund tool gets 'can I get a refund for a competitor's order?' attempts); eval sets grow with capabilities or they're theater. (5) Blast-radius math per tool: expected loss = error rate × cost × frequency — it turns 'just one more tool' into a number the business signs. The meta-point: agent scope creep is a governance problem disguised as a product roadmap; the checklist is the governance.

**Grounding:** Chapters C.2, C.5 · Labs c2, c3 · cheatsheet #10 · FN-04, FN-07

---

