---
chapter_id: "C.0"
title: "The Bot That Thinks vs the Bot That Talks"
topic: "What makes an agent"
track: agentic
bloom_stage: ["remember", "understand"]
est_read_minutes: 14
prerequisites: ["B.0"]
teaching_goal: "Distinguish an agent from a chatbot on three dimensions: action-taking, environment-state, and termination behavior."
primary_diagram: assets/diagrams/C.0/
common_misconception: "See chapter body"
status: stable
last_updated: 2026-08-10
---

# The Bot That Thinks vs the Bot That Talks

A chatbot tells you how to book a flight. An agent books the flight. The difference is one word — 'action' — and that word is the entire premise of Track C. This chapter is the conceptual threshold: everything before it is AI that talks, everything after it is AI that acts.

---

## Remember

**Chatbot** — produces text, no environment state, terminates when the user stops asking. **Agent** — takes actions, maintains and modifies state, terminates when the task is done. **Action** — a change to the world (sending an email, running code, modifying a file). **Environment state** — the agent's view of the world, which it can observe and change. **Termination** — what makes the system stop (user ends conversation vs. task completes).

---

## Understand

The distinction between chatbot and agent isn't about intelligence — it's about *what the system does*.

A chatbot produces text. You ask it a question, it responds with text. It has no memory of previous conversations (beyond the current session). It takes no actions. It changes nothing in the world. If you ask it 'how do I book a flight,' it tells you the steps. That's it.

An agent takes actions. You give it a task ('book me a flight to Tokyo'), and it *does* things: searches for flights, compares prices, enters your payment info, confirms the booking. It maintains state (which flights it considered, which it rejected). It terminates when the task is done (booking confirmed) or when it can't proceed (needs your input). The agent doesn't just *talk* about booking a flight — it *books* the flight.

**Three dimensions of the distinction:**
1. **Action-taking**: chatbots produce text; agents take actions that change the world.
2. **Environment-state**: chatbots are stateless (or session-state only); agents maintain and modify state across actions.
3. **Termination**: chatbots terminate when the user stops; agents terminate when the task is done (or the budget is exhausted).

**The borderline cases.** Is a chatbot with tools (function calling) an agent? Partially — it can take actions, but if it doesn't loop (plan → act → observe → repeat), it's a chatbot with tools, not a full agent. Is a workflow with LLM steps an agent? Only if the steps are dynamically chosen by the LLM, not pre-defined. The spectrum: chatbot → chatbot with tools → simple agent (fixed loop) → full agent (dynamic loop, multi-step, stateful).

---

## Apply

Classify these systems:
- **ChatGPT (default)**: chatbot. Produces text, no actions, user-terminated.
- **ChatGPT with web search**: chatbot with tools. Can search, but doesn't loop autonomously.
- **Claude with computer use**: agent. Takes actions (clicks, types), maintains state, terminates when task is done.
- **A customer support bot that only answers questions**: chatbot.
- **A customer support bot that can issue refunds**: agent (it takes a real-world action).

The classification matters because agents require guardrails (see C.5) that chatbots don't. A chatbot that gives bad advice is annoying; an agent that takes wrong actions is dangerous.

---

## Analyze

Why does the distinction matter? Because agents can cause harm. A chatbot can waste your time; an agent can spend your money, delete your files, send emails you didn't want. The jump from 'AI that talks' to 'AI that acts' is the jump from 'annoying when wrong' to 'dangerous when wrong.' This is why Track C emphasizes guardrails (C.5), budgets (C.1), and human-in-the-loop (X.2) — the safety disciplines that agents require and chatbots don't.

---

## Evaluate

When deciding whether to build a chatbot or an agent, ask: does the user need the system to *do* something, or just *tell* them something? If the former, you need an agent — and the guardrails that come with it. If the latter, a chatbot is simpler, safer, and sufficient. Don't build an agent when a chatbot would do; do build an agent when the user's goal requires action.

---

## Create

Design a system that helps users manage their calendar. Is it a chatbot or an agent? What actions does it take? What state does it maintain? When does it terminate? What guardrails does it need?

---

## A common misconception

**'Agents are just smarter chatbots.'** No. The distinction isn't intelligence — it's action. A chatbot with a PhD-level model is still a chatbot if it only produces text. An agent with a small model is still an agent if it takes actions. The agent-ness comes from the loop, the tools, and the state — not from the model's capability.

---

## Explain it back

The difference between a chatbot and an agent is _____. The three dimensions are _____, _____, and _____. A chatbot with tools is _____ (not yet an agent) because _____. The distinction matters because agents can _____, which chatbots can't.

---

## Further reading

- **Yao et al. (2022), "ReAct"** — the foundational agent paper.
- **Anthropic (2024), "Building Effective Agents"** — a practical guide to agent patterns.
- **Lilian Weng (2023), "LLM Powered Autonomous Agents"** — a comprehensive survey.
