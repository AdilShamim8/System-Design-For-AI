---
chapter_id: "C.0"
title: "The Bot That Thinks vs the Bot That Talks"
topic: "What makes an agent"
track: agentic
bloom_stage: ["remember", "understand", "apply", "analyze", "evaluate", "create"]
est_read_minutes: 16
prerequisites: ["B.0"]
teaching_goal: "Distinguish an agent from a chatbot on three dimensions: action-taking, environment-state, and termination behavior."
status: stable
last_updated: 2026-08-12
---

# The Bot That Thinks vs the Bot That Talks

A chatbot tells you how to book a flight. An agent books the flight. The difference is one word — "action" — and that word is the entire premise of Track C.

This chapter is the conceptual threshold: everything before it is AI that talks, everything after it is AI that acts. Crossing this threshold changes the engineering, the safety requirements, and the failure modes. A chatbot that gives bad advice is annoying. An agent that takes wrong actions is dangerous.

---

## Remember — name it

- **Chatbot** — produces text, no environment state, terminates when the user stops asking. A sophisticated autocomplete.
- **Agent** — takes actions, maintains and modifies state, terminates when the task is done. A junior employee who keeps working until the job is finished.
- **Action** — a change to the world: sending an email, running code, modifying a file, making a payment. The thing that makes an agent an agent.
- **Environment state** — the agent's view of the world, which it can observe and change. A chatbot has no state; an agent maintains state across actions.
- **Termination** — what makes the system stop. Chatbot: user ends conversation. Agent: task completes (or budget exhausted).

---

## Understand — the three dimensions

The distinction between chatbot and agent isn't about intelligence — it's about *what the system does*.

### Dimension 1: Action-taking

A chatbot produces text. You ask it a question, it responds with text. It has no memory of previous conversations (beyond the current session). It takes no actions. It changes nothing in the world.

An agent takes actions. You give it a task ("book me a flight to Tokyo"), and it *does* things: searches for flights, compares prices, enters your payment info, confirms the booking. Each action changes the state of the world — a flight is booked, a payment is made, a confirmation email is sent.

The jump from "tells you how to book a flight" to "books the flight" is the jump from chatbot to agent. It's also the jump from "annoying when wrong" to "dangerous when wrong."

### Dimension 2: Environment-state

A chatbot is stateless (or session-state only — it remembers the current conversation but nothing else). Each conversation starts fresh.

An agent maintains and modifies state across actions. It knows: "I've searched for flights, I found 3 options, the user chose option 2, I've started the booking process, I'm waiting for payment confirmation." This state evolves as the agent works, and it influences what the agent does next.

State management is one of the hardest parts of agent design (see chapter C.4). Too much state and the agent drowns in context; too little and it repeats mistakes.

### Dimension 3: Termination

A chatbot terminates when the user stops asking. The conversation ends, the session is cleaned up.

An agent terminates when the task is done — or when it can't proceed (needs user input, hit a budget limit, encountered an unrecoverable error). The agent decides when it's done, not the user. This is why termination conditions are a critical design decision (see chapter C.1).

---

## Apply — classify real systems

- **ChatGPT (default)**: chatbot. Produces text, no actions, user-terminated.
- **ChatGPT with web search**: chatbot with tools. Can search, but doesn't loop autonomously.
- **Claude with computer use**: agent. Takes actions (clicks, types), maintains state, terminates when task is done.
- **A customer support bot that only answers questions**: chatbot.
- **A customer support bot that can issue refunds**: agent (it takes a real-world action).
- **GitHub Copilot (code completion)**: chatbot (suggests code, doesn't run it).
- **Devin (coding agent)**: agent (writes code, runs tests, opens PRs).

The classification matters because agents require guardrails (chapter C.5) that chatbots don't. A chatbot that gives bad advice is annoying; an agent that takes wrong actions is dangerous.

---

## Analyze — why the distinction matters

Agents can cause harm. A chatbot can waste your time; an agent can spend your money, delete your files, send emails you didn't want, make purchases you didn't authorize. The jump from "AI that talks" to "AI that acts" is the jump from "annoying when wrong" to "dangerous when wrong."

This is why Track C emphasizes:
- **Guardrails** (C.5) — input/output validation, loop budgets, kill switches.
- **Budgets** (C.1) — hard caps on iterations, tokens, dollars, wall-clock.
- **Human-in-the-loop** (X.2) — for destructive actions, a human reviews before the action is committed.
- **Sandboxing** (C.6) — agents that run code or operate computers must be sandboxed.

---

## Evaluate — when to build a chatbot vs. an agent

Ask: does the user need the system to *do* something, or just *tell* them something? If the former, you need an agent — and the guardrails that come with it. If the latter, a chatbot is simpler, safer, and sufficient.

Don't build an agent when a chatbot would do. Agents are more complex, more dangerous, and more expensive to operate. Build an agent only when the user's goal requires action.

---

## Create — design a calendar management system

Is it a chatbot or an agent? What actions does it take? What state does it maintain? When does it terminate? What guardrails does it need?

If it only suggests meeting times → chatbot.
If it creates events, sends invites, reschedules conflicts → agent.

What guardrails does the agent version need? (Don't delete events without confirmation. Don't send invites to external attendees without approval. Don't move recurring meetings.)

---

## A common misconception

**"Agents are just smarter chatbots."** No. The distinction isn't intelligence — it's action. A chatbot with a PhD-level model is still a chatbot if it only produces text. An agent with a small model is still an agent if it takes actions. The agent-ness comes from the loop, the tools, and the state — not from the model's capability.

---

## Explain it back

> "The difference between a chatbot and an agent is _____. The three dimensions are _____, _____, and _____. A chatbot with tools is _____ (not yet an agent) because _____. The distinction matters because agents can _____, which chatbots can't."

---

## References

- **Yao, S., et al. (2022), "ReAct: Synergistic Reasoning and Acting in Language Models," ICLR 2023.** arXiv:2210.03629 — https://arxiv.org/abs/2210.03629
- **Anthropic (2024), "Building Effective Agents."** https://www.anthropic.com/research/building-effective-agents
- **Lilian Weng (2023), "LLM Powered Autonomous Agents."** https://lilianweng.github.io/posts/2023-06-23-agent/
