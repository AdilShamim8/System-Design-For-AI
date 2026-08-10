---
chapter_id: "C.4"
title: "The Memory That Forgets on Purpose"
topic: "Agent memory"
track: agentic
bloom_stage: ["apply", "evaluate"]
est_read_minutes: 16
prerequisites: ["C.1"]
teaching_goal: "Design short-term and long-term memory for an agent, justify intentional forgetting, and treat the memory store as a first-class component."
primary_diagram: assets/diagrams/C.4/
common_misconception: "See chapter body"
status: stable
last_updated: 2026-08-10
---

# The Memory That Forgets on Purpose

An agent that remembers everything drowns in its own context. An agent that forgets everything repeats its own mistakes. The art of agent memory is the art of forgetting on purpose — keeping what matters, dropping what doesn't, and knowing which is which.

---

## Remember

**Short-term memory** — the agent's context window, what it's holding in mind right now. **Long-term memory** — persistent storage across sessions. **Intentional forgetting** — dropping irrelevant context to keep the context window focused. **Memory strategies**: sliding window (drop oldest), summarization (compress history), relevance-based (keep only what's useful now). **Memory store** — a first-class component with its own schema, queries, and policies.

---

## Understand

Agents need memory for two reasons: **working memory** (what am I doing right now?) and **long-term memory** (what do I know from past interactions?). These are different problems with different solutions.

**Short-term memory = the context window.** Everything the agent has seen in the current session: the task, the plan, all actions taken, all observations. This grows with each loop iteration. Eventually, it exceeds the LLM's context window — and even before that, the LLM pays less attention to early content ('lost in the middle,' Liu et al. 2023). Unbounded short-term memory makes the agent slow, expensive, and forgetful of early details.

**Long-term memory = persistent storage.** Facts about the user, the world, past interactions — stored in a database, retrieved on demand. This is the agent's 'notebook' — it persists across sessions, doesn't consume context window tokens, and can be queried selectively.

**The case for intentional forgetting.** Context windows are finite. If you try to remember everything, the important stuff gets crowded out by noise. A good agent forgets:
- **Transient state**: 'the user is currently in a meeting' — true now, irrelevant tomorrow.
- **Failed approaches**: 'I tried searching for X and got nothing' — unless it teaches a lesson ('don't search for X that way').
- **Verbose tool outputs**: the full text of a 10K-token document — keep the summary, drop the raw text.

**Memory strategies:**
- **Sliding window**: keep only the last K turns. Simple, loses long-term context.
- **Summarization**: after N turns, summarize the conversation so far. Keep summary + recent turns. Bounded, preserves gist.
- **Relevance-based**: keep only memories relevant to the current task. Requires retrieval, but most focused.
- **External memory**: write important facts to a database, retrieve on demand. Most capable, most complex.

**The memory store as a first-class component.** Not an afterthought — a designed system with its own schema (what facts do we store?), queries (how do we retrieve?), and policies (what do we forget?). For agents that need to 'know' a user over time, this is the component that makes it possible.

---

## Apply

Design memory for a personal assistant agent:
- **Short-term**: sliding window of last 10 turns + summary of earlier turns in the current session.
- **Long-term**: a vector database of facts about the user (preferences, recurring tasks, corrections). At the start of each session, retrieve top-5 most relevant memories and inject into context.
- **Forgetting policy**: facts not accessed in 90 days are candidates for archival. Conflicting facts: the newer one wins.

This gives: bounded short-term memory (no context overflow), persistent long-term memory (the agent 'knows' the user), and selective retrieval (only relevant memories consume context).

---

## Analyze

The tradeoff between remembering and forgetting is the tradeoff between context and noise. More memory = more context, but also more noise (irrelevant information competing for attention). Less memory = less noise, but also less context (the agent might miss relevant history). The optimal point depends on the task: a coding agent that needs to remember the project structure benefits from more memory; a simple Q&A agent benefits from less.

---

## Evaluate

Memory is not a log. A log records everything; memory records what matters. The art is in curation — deciding what's worth keeping. This is the same art as chunking in RAG (B.4): the quality of the system is bounded by the quality of what you put into it. Garbage in, garbage out — even for memory.

---

## Create

Design a memory system for a coding agent that works on the same codebase over months. What goes in short-term memory (current task, files being edited)? What goes in long-term (project structure, conventions, past decisions)? How do you handle the fact that the codebase changes — memories might become stale?

---

## A common misconception

**'More memory is always better.'** No. More memory = more context, but also more noise, higher cost, and slower retrieval. The optimal memory system is curated — it remembers what matters and forgets what doesn't. An agent that remembers everything is as useless as an agent that remembers nothing; both fail to surface the relevant information at the right time.

---

## Explain it back

Short-term memory is _____; long-term memory is _____. The case for intentional forgetting is _____. The three memory strategies are _____, _____, and _____. The memory store should be _____, not an afterthought. Memory is not a _____; it's _____.

---

## Further reading

- **Park et al. (2023), "Generative Agents"** — memory streams for long-term agent memory.
- **MemGPT (2024), "Towards LLMs as Operating Systems"** — a memory hierarchy for LLM agents.
- **LangChain Memory documentation** — practical memory patterns.
