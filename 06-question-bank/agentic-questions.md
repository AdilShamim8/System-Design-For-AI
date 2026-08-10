# Agentic AI System Design — Question Bank

Practice scenarios for agentic AI system design: tool use, multi-agent, coding agents, memory, voice.

---

## Q-AGT-1 — The Research Agent That Won't Stop

**Scenario:** You deployed a research agent that takes a question, searches the web, reads sources, and writes a cited summary. It works well for most queries, but for ambiguous ones ("what's the future of AI?"), it loops — searching, reading, searching more, never deciding it has enough. Average cost per query has crept from $0.30 to $2.10. Users haven't noticed yet, but the CFO will.

**Track:** agentic
**Difficulty:** medium
**Read first:** [C.1 The Loop That Won't Stop](../03-agentic-system-design/c1-the-loop-that-wont-stop.md), [C.5 The Guardrail Problem](../03-agentic-system-design/c5-the-guardrail-problem.md), [X.4 The Bill Nobody Warned You About](../04-cross-cutting/x4-the-bill-nobody-warned-you-about.md)

**Your task:** Diagnose. What's the root cause? What's the fix — both the immediate patch and the longer-term design change?

---

### Worked answer (how a story-taught learner would reason through this)

The story-taught learner recognizes this as the failure mode C.1 calls "the loop that won't stop" — the agent never reaches a termination signal because there's always "one more search" that might help.

**Root cause:** the termination condition is implicit. The agent is told to "write a summary when you have enough information," but "enough" is undefined. LLMs are biased toward continuation — "maybe one more source will be better" feels safer than "I'm done." Without an explicit stopping rule, the default is to keep going.

**Immediate patch — hard iteration cap.** Per C.5, set a maximum of, say, 10 iterations. When the agent hits the cap, force it to call `finish` with whatever it has. This caps cost at 10 × per-iteration-cost. Crude, but it stops the bleeding today.

**Better patch — explicit stopping rules.** Tell the agent: "You must call `finish` after retrieving at least 3 but no more than 7 sources. If your last search returned no new information (sources you've already read), call `finish` immediately." Make termination a first-class instruction, not a hope.

**Longer-term fix — budget-aware planning.** Per C.1's budget problem, tell the agent the budget up front: "You have $1.00 and 15 iterations. Plan accordingly." The LLM can then decide to skip the third search and write the summary now, rather than discovering the budget only when the orchestrator kills it.

**Deeper fix — task-aware budgets.** The reason "what's the future of AI?" loops is that it's an unbounded question with no natural stopping point. The fix isn't just a tighter budget — it's recognizing that some questions need different budgets than others. A factual lookup ("who won the 2024 election?") needs 2 iterations and $0.10. A market analysis needs 15 iterations and $5. The budget should be calibrated to task value, not set globally.

**Observability:** add per-query cost and iteration tracking. Alert when any single query exceeds $1. The next time an agent loops, you find out from a dashboard, not from the CFO.

---

## Q-AGT-2 — The Coding Agent That Breaks Tests

**Scenario:** Your coding agent takes GitHub issues and opens PRs. It works well ~70% of the time, but in the other 30%, it opens PRs that break existing tests. The agent runs tests before opening the PR — the tests pass at that moment — but the CI pipeline on the PR itself fails. Investigation reveals the agent is modifying files it wasn't supposed to touch, and those modifications break tests in other parts of the codebase.

**Track:** agentic
**Difficulty:** hard
**Read first:** [C.1 The Loop That Won't Stop](../03-agentic-system-design/c1-the-loop-that-wont-stop.md), [C.2 The Tools in the Toolbox](../03-agentic-system-design/c2-the-tools-in-the-toolbox.md), [C.6 The Agent That Drives Your Computer](../03-agentic-system-design/c6-the-agent-that-drives-your-computer.md)

**Your task:** Diagnose the gap between "tests pass locally" and "tests pass in CI." Design the fix.

---

### Worked answer

The story-taught learner sees two problems: a *scope* problem (the agent is modifying files it shouldn't) and an *environment* problem (the local test run doesn't match CI).

**The scope problem.** Per C.6, agents without explicit scope boundaries will make changes they think are helpful but aren't asked for. The agent is probably seeing a function that looks related to the issue, "fixing" it, and breaking callers elsewhere. The fix: scope the `write_file` tool. Before the agent runs, compute the set of files it's allowed to modify (based on the issue's labels, the affected component, or a human's pre-approval). The tool itself enforces the scope — `write_file` refuses to write outside the allowed set. The agent can still *read* anything (it needs to understand the codebase), but it can only *write* within scope.

**The environment problem.** The agent runs tests locally and they pass. CI runs the same tests and they fail. The gap is usually one of:

- *Different test suite:* the agent runs `pytest tests/` but CI runs `pytest tests/ integration/ e2e/`. The agent never ran the integration tests that are now failing.
- *Different environment:* the agent's sandbox has different library versions, different env vars, different database state than CI.
- *Different commit base:* the agent branched from `main` 2 hours ago; CI is running against `main` now, which has new commits that conflict.

**The fix for the environment gap:** make the agent's test run match CI exactly. Run the same test command CI runs. Run it in a CI-matching environment (same Docker image, same env vars). Run it against the latest `main`, not a stale branch. If the agent's test run passes, CI should pass — and if it doesn't, that's a bug in your CI parity, not in the agent.

**The deeper design change:** per C.1's failure modes, the agent is suffering from "silent error" — it believes its tests pass, but the test run was incomplete. Make the test result loud and structured. The agent shouldn't just receive "tests passed" — it should receive the full test output, the number of tests run, the number skipped, and a comparison to "expected test count for this repo." If the agent ran 100 tests but CI expects 500, that's a signal the agent missed something.

**Human-in-the-loop for scope:** for v1, require human review of the diff before the PR opens. The agent's job is to produce a draft; the human's job is to confirm scope. As trust builds, expand the agent's autonomy.

---

## Q-AGT-3 — The Multi-Agent Customer Support System

**Scenario:** You're designing a customer support system with three agents: a triage agent (routes the ticket), a knowledge agent (answers from docs), and an action agent (executes refunds, changes account settings). The product team wants them to collaborate: triage hands off to knowledge, knowledge can escalate to action, action can ask knowledge for context. You need to design the coordination.

**Track:** agentic
**Difficulty:** hard
**Read first:** [C.1 The Loop That Won't Stop](../03-agentic-system-design/c1-the-loop-that-wont-stop.md), [C.3 The Team in the Same Room](../03-agentic-system-design/c3-the-team-in-the-same-room.md), [C.5 The Guardrail Problem](../03-agentic-system-design/c5-the-guardrail-problem.md)

**Your task:** Design the orchestration. Which pattern — supervisor, swarm, or hierarchical? How do the agents communicate? Where are the guardrails?

---

### Worked answer

The story-taught learner recognizes this as a multi-agent design from C.3 and reaches for the **supervisor pattern** as the default, because the task has a natural routing structure (triage decides who handles it).

**Why supervisor, not swarm or hierarchical:**

- *Swarm* (peer-to-peer) is wrong because the agents aren't peers — triage has authority over routing, action has authority over destructive operations. Peer-to-peer would blur accountability.
- *Hierarchical* (managers of managers) is overkill for three agents. You don't need a layer of management for a team of three.
- *Supervisor* (one boss, many workers) fits: triage is the supervisor, knowledge and action are the workers. Triage receives the ticket, decides who handles it, monitors progress, and decides when the task is complete.

**The orchestration:**

1. Ticket arrives. Triage agent reads it, classifies it (informational / billing / technical / escalation), and routes to the appropriate worker.
2. If informational: knowledge agent takes over, answers from docs, returns the answer to triage, triage closes the ticket.
3. If billing with refund request: action agent takes over, but **must request approval from triage** before executing the refund. Triage verifies the refund is within policy, then approves. Action executes, returns confirmation, triage closes.
4. If the knowledge agent doesn't have enough context: it can request help from the action agent ("pull this user's recent orders"), but only through triage as intermediary. No direct knowledge→action calls.

**Why all communication goes through triage:** per C.3's "coordination tax," direct agent-to-agent communication creates coupling and makes the system hard to reason about. Routing everything through the supervisor means there's one place to log, one place to enforce policy, one place to intervene if something goes wrong.

**Guardrails (per C.5):**

- *Action agent* has the tightest guardrails. Destructive operations (refunds, account changes) require triage approval. A hard cap on action per ticket (e.g., max 1 refund per ticket). All actions logged for audit.
- *Knowledge agent* has medium guardrails. Read-only access to docs. No tool calls that modify state. Output checked for PII before returning to user.
- *Triage agent* has the loosest guardrails but the most responsibility. It's the kill switch — if anything looks wrong, triage can terminate the whole flow and hand off to a human.

**The budget:** the whole multi-agent flow has a shared budget (e.g., $2 per ticket, 30 seconds wall-clock). The supervisor (triage) is told the budget and is responsible for deciding when to cut losses and hand off to a human.

---

## Q-AGT-4 — The Voice Agent's Latency Budget

**Scenario:** You're building a voice assistant for a smart home device. The user says "turn off the kitchen lights and set the thermostat to 68." The current pipeline is: audio in → ASR (200ms) → LLM (1.8s) → TTS (300ms) → audio out. Total: 2.3 seconds. The product team says it feels laggy and wants it under 1 second.

**Track:** agentic
**Difficulty:** hard
**Read first:** [C.1 The Loop That Won't Stop](../03-agentic-system-design/c1-the-loop-that-wont-stop.md), [B.7 Beyond Text](../02-genai-system-design/b7-beyond-text.md), [X.2 Confidently Wrong](../04-cross-cutting/x2-confidently-wrong.md)

**Your task:** Where do you cut 1.3 seconds? What tradeoffs are you making?

---

### Worked answer

The story-taught learner looks at the latency budget and sees that the LLM is the biggest chunk (1.8s of 2.3s). That's where the leverage is — but cutting it has consequences.

**Cut 1 — smaller model.** A frontier model takes 1.8s; a small model (Haiku, 4o-mini) takes 300-500ms. For "turn off the kitchen lights and set the thermostat to 68," a small model is more than capable. Save: ~1.3s. Cost: minimal quality loss for simple commands. This alone gets you under budget.

**Cut 2 — streaming.** Per B.7, stream the LLM output token-by-token to the TTS, rather than waiting for the full response before synthesizing. The first audio chunk can start playing before the LLM has finished generating. Save: ~500ms (the TTS latency overlaps with the tail of LLM generation). Cost: complexity in the pipeline, and the TTS has to handle partial sentences gracefully.

**Cut 3 — intent classification shortcut.** For common commands ("turn off the lights," "set the thermostat to X"), skip the LLM entirely. A fast intent classifier (a small model or even a rule-based system) detects the pattern and routes directly to the action. Save: the full LLM latency (1.8s → 0). Cost: the classifier has to be very accurate — false routes are worse than slow responses. This is the model-routing pattern from X.4 applied at the voice layer.

**Cut 4 — ASR streaming.** Stream audio to ASR as the user is still speaking, rather than waiting for them to finish. Save: depends on utterance length, but for a 2-second utterance, this can save 1-1.5s. Cost: the ASR has to handle partial audio and the LLM has to handle partial transcripts (or wait for a pause).

**The tradeoffs you're making:**

- *Smaller model:* simple commands work fine; complex queries ("should I adjust my schedule for tomorrow's weather?") may degrade. Mitigation: route complex queries to a larger model, accept the latency hit for those.
- *Streaming:* the user hears the response start before it's fully generated. If the response is wrong mid-stream, you can't take it back. Mitigation: for voice, keep responses short and structured.
- *Intent shortcut:* fast for common cases, but the classifier is a new failure surface. Mitigation: log every classification decision, monitor accuracy, fall back to LLM on uncertainty.
- *ASR streaming:* the system starts processing before the user is done talking. If they pause mid-sentence, the system might respond prematurely. Mitigation: use a pause threshold (e.g., 500ms of silence) before committing to ASR output.

**The realistic target:** with cuts 1, 2, and 3, you can get simple commands to ~600ms and complex queries to ~1.5s. That's a big improvement. Cut 4 (ASR streaming) is a v2 optimization — it's the hardest to get right and has the most edge cases.

**What you're not cutting:** ASR base latency (200ms) and TTS base latency (300ms) are mostly fixed by the providers. You can shave a bit with model choice, but the big wins are in the LLM and the routing layer above it.

---

## Q-AGT-5 — The Agent That Forgets the User

**Session-spanning memory design.** You're building a personal assistant agent that should "know" the user over time — their preferences, their recurring tasks, their idiosyncrasies. The current system stuffs the full conversation history into the context window on every session. By session 10, the context is 50,000 tokens and the agent is slow, expensive, and forgetful of early details anyway.

**Track:** agentic
**Difficulty:** medium
**Read first:** [C.1 The Loop That Won't Stop](../03-agentic-system-design/c1-the-loop-that-wont-stop.md), [C.4 The Memory That Forgets on Purpose](../03-agentic-system-design/c4-the-memory-that-forgets-on-purpose.md)

**Your task:** Design the memory architecture. What gets remembered? What gets forgotten? How does the agent retrieve relevant memory for the current session?

---

### Worked answer

The story-taught learner reaches for C.4's framework: short-term memory (the context window) vs. long-term memory (an external store). The current system is trying to use short-term memory for everything, which is why it's breaking.

**The architecture:**

- *Short-term memory:* the current session's context. Bounded — last K turns, plus a summary of earlier turns in this session. Resets when the session ends.
- *Long-term memory:* a persistent store of facts about the user, written across sessions. This is a vector database (or even just a structured key-value store for simple cases) that the agent can query at the start of each session.

**What gets remembered (written to long-term memory):**

- *Stated preferences:* "I prefer morning meetings." "Don't use jargon." "I'm vegetarian." These are explicit, durable, and high-value.
- *Recurring tasks:* "Every Monday, summarize my week." Patterns the agent notices over multiple sessions.
- *Corrections:* when the user says "no, I said X, not Y," that correction is written to memory so it doesn't recur.
- *Facts about the user's context:* "User is a backend engineer." "User's team uses Python." Background that shapes how the agent should respond.

**What gets forgotten (not written to long-term memory):**

- *Transient state:* "The user is currently in a meeting." This is true now, irrelevant tomorrow.
- *Session-specific details:* "The user asked about the API docs today." Unless it reveals a pattern, it doesn't need to persist.
- *Wrong turns:* if the agent suggested something and the user ignored it, don't write that to memory. It's noise.

**How the agent retrieves relevant memory:**

- At the start of each session, the agent embeds the user's first message and retrieves the top-K most relevant memories from long-term storage. These are injected into the context as "what I know about you that's relevant right now."
- Mid-session, if the agent needs more context ("did we discuss this before?"), it can query long-term memory with a targeted retrieval.

**The forgetting strategy:**

- *Decay:* memories have a "last accessed" timestamp. Memories not accessed in 90 days are candidates for archival.
- *Conflict resolution:* if a new memory contradicts an old one ("I prefer morning meetings" → "I've switched to afternoons"), the new one wins. Don't keep both.
- *Volume control:* cap long-term memory at, say, 1,000 facts per user. Beyond that, the retrieval signal gets noisy. Summarize or archive the oldest.

**The deeper pattern:** memory is not a log. A log records everything; memory records what matters. The art is in the curation — deciding what's worth keeping and what's noise. This is the same art as chunking in RAG (B.4): the quality of the system is bounded by the quality of what you put into it.

---

*More questions coming as the curriculum grows. Want to add one? See [CONTRIBUTING.md](../CONTRIBUTING.md#5-add-a-question-to-the-question-bank).*
