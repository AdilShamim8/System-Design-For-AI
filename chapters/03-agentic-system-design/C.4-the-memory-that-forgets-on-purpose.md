---
chapter_id: "C.4"
title: "The Memory That Forgets on Purpose"
topic: "Agent memory"
track: agentic
bloom_stage: ["remember", "understand", "apply", "analyze", "evaluate", "create"]
est_read_minutes: 16
prerequisites: ["C.1"]
teaching_goal: "Design short-term and long-term memory for an agent, justify intentional forgetting, and treat the memory store as a first-class component."
status: stable
last_updated: "2026-08-12"
---

# The Memory That Forgets on Purpose

An agent that remembers everything drowns in its own context. An agent that forgets everything repeats its own mistakes. The art of agent memory is the art of forgetting on purpose — keeping what matters, dropping what doesn't, and knowing which is which.

---

## Remember

- **Short-term memory** — the context window. What the agent is holding in mind right now. Limited, expensive, immediate.
- **Long-term memory** — persistent storage across sessions. The agent's notebook, not its working memory.
- **Intentional forgetting** — dropping irrelevant context to keep the context window focused. Context windows are finite; irrelevant history crowds out relevant present.
- **Memory strategies**: sliding window (drop oldest), summarization (compress history), relevance-based (keep only what's useful now).
- **Memory store** — a first-class component with its own schema, queries, and policies.

---

## Understand — short-term vs. long-term

**Short-term memory = the context window.** Everything the agent has seen in the current session: the task, the plan, all actions taken, all observations. This grows with each loop iteration. Eventually, it exceeds the LLM's context window — and even before that, the LLM pays less attention to early content ("lost in the middle").

**Long-term memory = persistent storage.** Facts about the user, the world, past interactions — stored in a database, retrieved on demand. This is the agent's "notebook" — it persists across sessions, doesn't consume context window tokens, and can be queried selectively.

**The case for intentional forgetting:** context windows are finite. If you try to remember everything, the important stuff gets crowded out by noise. A good agent forgets: transient state ("the user is currently in a meeting"), failed approaches (unless they teach a lesson), verbose tool outputs (keep the summary, drop the raw text).

---

## Apply — design memory for a personal assistant agent

- **Short-term**: sliding window of last 10 turns + summary of earlier turns in the current session.
- **Long-term**: a vector database of facts about the user (preferences, recurring tasks, corrections). At the start of each session, retrieve top-5 most relevant memories and inject into context.
- **Forgetting policy**: facts not accessed in 90 days are candidates for archival. Conflicting facts: the newer one wins.

---

## Evaluate — memory is not a log

A log records everything; memory records what matters. The art is in curation — deciding what's worth keeping. This is the same art as chunking in RAG: the quality of the system is bounded by the quality of what you put into it.

---

## Create — design a memory system for a coding agent

What goes in short-term memory (current task, files being edited)? What goes in long-term (project structure, conventions, past decisions)? How do you handle the fact that the codebase changes — memories might become stale?

---

## A common misconception

**"More memory is always better."** No. More memory = more context, but also more noise, higher cost, and slower retrieval. The optimal memory system is curated.

---

## Explain it back

> "Short-term memory is _____; long-term memory is _____. The case for intentional forgetting is _____. The three memory strategies are _____, _____, and _____. Memory is not a _____; it's _____."

---

## References

- **Park, J. S., et al. (2023), "Generative Agents: Interactive Simulacra of Human Behavior," UIST 2023.** arXiv:2304.03442 — https://arxiv.org/abs/2304.03442
- **MemGPT (2024), "Towards LLMs as Operating Systems."** Memory hierarchy for LLM agents. https://memgpt.ai/
- **LangChain Memory Documentation.** https://python.langchain.com/docs/modules/memory/
