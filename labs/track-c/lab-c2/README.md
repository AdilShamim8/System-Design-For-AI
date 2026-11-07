# Lab c2 — Designing Tool Contracts

| | |
|---|---|
| **Prerequisites** | Chapter C.2 (the tools in the toolbox) · Lab c1 |
| **You will build** | Three generations of the same tool — from "promising" to "production" — and the contract rubric that explains every improvement |
| **Est. time** | 2–3 hours |
| **Cost** | < $0.10 |

**The story.** In Lab c1 the tools were trivial, so any contract worked. Real tools call databases, spend money, send emails — and the difference between a good and bad tool contract is the difference between an agent that recovers and an agent that emails your customers garbage at 3AM (the Chevy dealership's $1 car, FN-07, was a *contract* failure before it was a guardrail failure). A tool contract is an **API for a non-deterministic client that cannot read your docs**. Today you design one tool three ways and measure what changes.

## Part 1 — The v1 tool: plausible but dangerous (30 min)

Give your c1 agent a (simulated) email tool:

```python
def send_email_v1(to, subject, body):
    # docstring: "Send an email."  <- the entire "contract"
    EMAILS_SENT.append({"to": to, "subject": subject, "body": body})
    return {"status": "sent"}
```

Run episodes like "email the team that the deploy finished" and watch: wrong recipient guesses ("team@company.com" invented), missing subject, novels in the body, and — the classic — **the agent emails *you* mid-episode to ask a question** because the tool exists and seems helpful.

**Checkpoint 1:** Count the failure types over 10 episodes. Then the rubric that names them: a tool contract must specify **who/what may call it, with what validation, what it does on bad input, what it returns, and what it costs (money, side effects, reversibility).** v1 specifies none of these. Score it: 0/5.

## Part 2 — The v2 tool: explicit contract (30 min)

```python
SEND_EMAIL_V2 = {
    "name": "send_email",
    "description": "Send a plain-text email to ONE verified internal address. "
                   "Only use when the user explicitly asked to send an email. "
                   "NEVER send questions to the user via email — questions go "
                   "in your final answer instead.",
    "params": {
        "to": {"type": "string",
               "pattern": "^[a-z.]+@(internal\\.example\\.com)$",
               "description": "Verified internal address from the ALLOWED_RECIPIENTS list"},
        "subject": {"type": "string", "max_length": 80},
        "body": {"type": "string", "max_length": 2000,
                 "description": "Plain text. No attachments. Be concise."},
    },
    "side_effects": "irreversible — sends a real email",
    "cost": "one email",
}

def send_email_v2(to, subject, body):
    if to not in ALLOWED_RECIPIENTS:
        return {"error": f"recipient '{to}' not in allowed list: {ALLOWED_RECIPIENTS}"}
    if len(subject) > 80:
        return {"error": "subject too long (max 80 chars)"}
    EMAILS_SENT.append({"to": to, "subject": subject, "body": body})
    return {"status": "sent", "to": to, "bytes": len(body)}
```

**Checkpoint 2:** Re-run the same 10 episodes. Failures should collapse. For each contract element, write which failure it killed: allowed-list → invented recipients; the "never email questions" line → the 3AM-garbage class; max_lengths → novels; error returns → self-correction. Score v2: 4/5. What's missing? **Confirmation for side effects.**

## Part 3 — The v3 tool: the approval gate (30 min)

```python
def send_email_v3(to, subject, body, confirm_token=None):
    if confirm_token is None:
        return {"needs_confirmation": True,
                "summary": f"Send email to {to}: '{subject[:50]}'",
                "how_to_confirm": "call again with confirm_token='CONFIRM'"}
    if confirm_token != "CONFIRM":
        return {"error": "invalid confirm_token"}
    return send_email_v2(to, subject, body)
```

**Checkpoint 3:** Design decision, not code: which tools need gates? Build the **reversibility × cost grid** — reversible-cheap (calculator: no gate), reversible-expensive (write a draft: no gate, but log), irreversible-cheap (send one email: gate), irreversible-expensive (delete records, wire money: gate + human). Place five tools you can imagine on the grid. This grid — not vibes — is how production teams decide where approval gates go (Aishwarya Srinivasan's "approval gates and policy controls" building block, now in your hands).

## Part 4 — The rubric, assembled (20 min)

Write the tool-contract rubric as a checklist (this is the lab's takeaway artifact):

1. **Purpose stated negatively too** — when NOT to call it (kills the "helpful" misuse).
2. **Params fully constrained** — types, patterns, enums, lengths; examples in descriptions.
3. **Errors as data** — every failure returns a correctable message, never a crash.
4. **Side effects declared** — and gated on the reversibility × cost grid.
5. **Idempotency** — retries must not double-send (an idempotency key, like every payment API).
6. **Token-budget consciousness** — return summaries, not dumps; the model pays for every byte.

**Checkpoint 4:** Grade your b2 `retrieve` tool and c1's `calculator` against the rubric. Fix the worst violation in each. Now you have two production-graded tools and a rubric you can apply to any tool any team ever shows you.

---

## Explain it back

1. Why is "Send an email" an insufficient tool description for an LLM caller?
2. Walk the reversibility × cost grid and place: calculator, send_email, delete_database, write_draft.
3. What does idempotency mean for a tool, and why do retries make it mandatory?
4. Your agent double-charged a customer. Which rubric items failed, in what order?

## Extensions

- **Native function calling:** port v3 to your provider's tool-calling API with JSON schemas; compare 10-episode reliability vs. the JSON-in-prose protocol from c1.
- **A dangerous tool, properly caged:** build `delete_record(record_id)` with: allowlist scoping, dry-run mode returning a preview, and a confirmation token. The pattern generalizes to SQL-for-agents, file-system-for-agents, browser-for-agents.
- **Tool-choice eval:** write 15 episodes where exactly one tool is correct (or none). Measure tool-selection accuracy across v1/v2/v3 descriptions. Description engineering, quantified.

## What you can now claim in an interview

"I write tool contracts for a non-deterministic client that can't read docs: negative-purpose descriptions, fully constrained params, errors-as-data, side-effect gates on a reversibility × cost grid, and idempotency for anything retryable. I measured the failure-class collapse between contract generations — the Chevy $1 car was a contract failure before it was a guardrail one."
