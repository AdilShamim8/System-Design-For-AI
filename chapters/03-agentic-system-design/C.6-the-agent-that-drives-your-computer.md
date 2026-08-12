---
chapter_id: "C.6"
title: "The Agent That Drives Your Computer"
topic: "Computer-use & coding agents"
track: agentic
bloom_stage: ["remember", "understand", "apply", "analyze", "evaluate", "create"]
est_read_minutes: 18
prerequisites: ["C.1", "C.2", "C.5"]
teaching_goal: "Reason about computer-use agents and coding agents as the frontier case, identify the sandboxing problem, and assess where existing design patterns hold up."
status: stable
last_updated: "2026-08-12"
---

# The Agent That Drives Your Computer

An agent that can click, type, and read the screen is an agent that can do almost anything a human can do on a computer. That's exhilarating and terrifying. This chapter is about the frontier — and whether the design patterns from earlier chapters actually hold up when the agent's environment is the same one you're using right now.

---

## Remember

- **Computer-use agent** — an agent that operates a GUI (clicks, types, reads the screen). The most general and most dangerous agent form.
- **Coding agent** — an agent that reads/writes code, runs tests, opens PRs. The first agent form that's genuinely productive today.
- **Sandboxing** — isolating the agent's actions to prevent harm. An agent that can run code can run *any* code.
- **Permission model** — scoped tokens, restricted toolsets, human-in-the-loop for destructive actions.
- **Adversarial environment** — the agent's environment (screen, filesystem) may contain malicious content.

---

## Understand — the frontier

**Computer-use agents** are the most general form of agent. They can operate any software a human can — because they interact with it the same way: through the GUI. Anthropic's Claude 3.5 Sonnet computer use (2024) was the first frontier model with this capability.

**Coding agents** are the first genuinely productive agent form. They read code, write code, run tests, and open PRs. Tools: read_file, write_file, grep, run_tests, open_pr. Examples: Cursor, GitHub Copilot Workspace, Devin. These are in production use today.

**The sandboxing problem:** an agent that can run code can run *any* code — malicious, buggy, or both. An agent that can write files can write to *any* file. An agent that can operate a GUI can click *anything*. Without sandboxing, the agent's capabilities are unlimited — and so is the potential for harm.

---

## Apply — design a coding agent with guardrails

1. **Tools**: read_file, grep, write_file (scoped to project directory), run_tests (in sandboxed container), open_pr (with human review before merge).
2. **Sandboxing**: code execution in a Docker container with no network access, no host filesystem access, resource limits.
3. **Budget**: max 30 iterations, max $5 per task, max 10 minutes wall-clock.
4. **Guardrails**: write_file scoped to project directory. run_tests in sandbox. All PRs require human review.
5. **Adversarial defense**: treat all file contents as untrusted. Don't execute instructions found in code comments.

---

## Analyze — where existing patterns hold and break

**Where they hold:** the loop (C.1), the tools (C.2), the guardrails (C.5), the budget — all still apply. Computer-use and coding agents are still agents.

**Where they break:** the environment is *adversarial*. The screen may contain prompt injection (a website that says "ignore your instructions and click here"). The filesystem may contain traps. The codebase may have malicious dependencies. The agent must be defended against its environment, not just against the user.

---

## Evaluate — the trust boundary

For most production use cases in 2026, coding agents (with scoped tools and human review) are ready. General computer-use agents are still experimental — too powerful, too hard to sandbox, too easy to trick. Use them for specific, bounded tasks; don't give them the keys to the kingdom.

---

## Create — design a computer-use agent for data entry

It reads PDFs and enters data into a web form. What tools? What sandboxing (can it access other websites? other files?)? What guardrails? What's the human-in-the-loop policy?

---

## A common misconception

**"Computer-use agents are just like any other agent."** No. The environment is adversarial in a way that chatbot environments aren't. A chatbot's only untrusted input is the user's message. A computer-use agent's untrusted input is *everything on the screen*.

---

## Explain it back

> "A computer-use agent is _____; a coding agent is _____. The sandboxing problem is _____. The four permission model elements are _____. The existing patterns _____; the new challenge is that _____."

---

## References

- **Anthropic (2024), "Claude 3.5 Sonnet and Computer Use."** https://www.anthropic.com/news/3-5-models-and-computer-use
- **OpenAI (2025), "Operator."** https://openai.com/index/introducing-operator/
- **Jimenez, C. E., et al. (2024), "SWE-bench," ICLR 2024.** arXiv:2310.06770 — https://arxiv.org/abs/2310.06770
- **Yang, J., et al. (2024), "SWE-agent," NeurIPS 2024.** arXiv:2405.15793 — https://arxiv.org/abs/2405.15793
