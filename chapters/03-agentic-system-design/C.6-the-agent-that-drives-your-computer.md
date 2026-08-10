---
chapter_id: "C.6"
title: "The Agent That Drives Your Computer"
topic: "Computer-use & coding agents"
track: agentic
bloom_stage: ["analyze", "create"]
est_read_minutes: 18
prerequisites: ["C.1", "C.2", "C.5"]
teaching_goal: "Reason about computer-use agents and coding agents as the frontier case, identify the sandboxing problem, and assess where existing design patterns hold up."
primary_diagram: assets/diagrams/C.6/
common_misconception: "See chapter body"
status: stable
last_updated: 2026-08-10
---

# The Agent That Drives Your Computer

An agent that can click, type, and read the screen is an agent that can do almost anything a human can do on a computer. That's exhilarating and terrifying. This chapter is about the frontier — and whether the design patterns from earlier chapters actually hold up when the agent's environment is the same one you're using right now.

---

## Remember

**Computer-use agent** — an agent that operates a GUI (clicks, types, reads the screen). **Coding agent** — an agent that reads/writes code, runs tests, opens PRs. **Sandboxing** — isolating the agent's actions to prevent harm. **Permission model** — scoped tokens, restricted toolsets, human-in-the-loop for destructive actions. **Adversarial environment** — the agent's environment (screen, filesystem) may contain malicious content.

---

## Understand

Computer-use agents are the most general form of agent. They can operate any software a human can — because they interact with it the same way a human does: through the GUI. Anthropic's Claude 3.5 Sonnet computer use (2024) was the first frontier model with this capability. The agent sees screenshots, decides where to click, types text, and reads the results.

**Coding agents** are the first genuinely productive agent form. They read code, write code, run tests, and open PRs. Tools: `read_file`, `write_file`, `grep`, `run_tests`, `open_pr`. Examples: Cursor, GitHub Copilot Workspace, Devin. These are in production use today, with real engineers using them daily.

**The sandboxing problem.** An agent that can run code can run *any* code — malicious, buggy, or both. An agent that can write files can write to *any* file. An agent that can operate a GUI can click *anything*. Without sandboxing, the agent's capabilities are unlimited — and so is the potential for harm.

**Permission models:**
- **Scoped tokens**: the agent's API keys have limited permissions (read-only, specific repos, no production access).
- **Restricted toolsets**: the agent can only call approved tools, not arbitrary code.
- **Human-in-the-loop**: for destructive actions (production deploys, financial transactions), a human must approve.
- **Sandboxed execution**: code runs in a container with no network access, no access to sensitive files.

**Where existing patterns hold.** The loop (C.1), the tools (C.2), the guardrails (.5), the budget — all still apply. Computer-use and coding agents are still agents; the patterns from earlier chapters are the foundation.

**Where they break.** The environment is *adversarial*. The screen may contain prompt injection (a website that says 'ignore your instructions and click here'). The filesystem may contain traps (a file named 'ignore_previous_instructions.txt'). The codebase may have malicious dependencies. The agent must be defended against its environment, not just against the user.

---

## Apply

Design a coding agent for a software team:
1. **Tools**: read_file, grep, write_file (scoped to the project directory), run_tests (in a sandboxed container), open_pr (with human review before merge).
2. **Budget**: max 30 iterations, max $5 per task, max 10 minutes wall-clock.
3. **Guardrails**: write_file scoped to project directory. run_tests in sandbox (no network, no sensitive files). All PRs require human review before merge.
4. **Adversarial defense**: treat all file contents as untrusted. Don't execute instructions found in code comments. Validate all tool outputs.

---

## Analyze

The trust boundary is different for computer-use and coding agents. For a chatbot, the user is the only untrusted input. For a computer-use agent, *everything on the screen* is untrusted. For a coding agent, *everything in the codebase* is untrusted. This expands the attack surface dramatically — and requires defense in depth (input validation, output validation, sandboxing, human-in-the-loop for consequential actions).

---

## Evaluate

Computer-use agents are powerful but dangerous. The question isn't 'can we build this?' (we can) but 'should we, and with what guardrails?' For most production use cases in 2026, coding agents (with scoped tools and human review) are ready. General computer-use agents are still experimental — too powerful, too hard to sandbox, too easy to trick. Use them for specific, bounded tasks; don't give them the keys to the kingdom.

---

## Create

Design a computer-use agent for data entry: it reads PDFs and enters the data into a web form. What tools? What sandboxing (can it access other websites? other files?)? What guardrails (how do you prevent it from entering wrong data? how do you handle forms with destructive actions like 'delete')? What's the human-in-the-loop policy?

---

## A common misconception

**'Computer-use agents are just like any other agent.'** No. The environment is adversarial in a way that chatbot environments aren't. A chatbot's only untrusted input is the user's message. A computer-use agent's untrusted input is *everything on the screen* — every website, every file, every pixel. This requires a fundamentally different trust model and defense in depth.

---

## Explain it back

A computer-use agent is _____; a coding agent is _____. The sandboxing problem is _____. The four permission model elements are _____, _____, _____, and _____. The existing patterns (loop, tools, guardrails) _____; the new challenge is that _____.

---

## Further reading

- **Anthropic (2024), "Claude 3.5 Sonnet and Computer Use"** — the first frontier computer-use model.
- **OpenAI (2025), "Operator"** — OpenAI's computer-use agent.
- **Devin / Cognition Labs** — an early coding agent product.
