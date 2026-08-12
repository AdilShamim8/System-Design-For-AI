---
chapter_id: "C.2"
title: "The Tools in the Toolbox"
topic: "Tool use & MCP"
track: agentic
bloom_stage: ["remember", "understand", "apply", "analyze", "evaluate", "create"]
est_read_minutes: 17
prerequisites: ["C.1"]
teaching_goal: "Design a tool interface for an agent, explain tool schemas, and describe why MCP matters as a standard."
status: stable
last_updated: "2026-08-12"
---

# The Tools in the Toolbox

An agent without tools is just a chatbot that talks to itself. Tools are what let an agent actually do things — search the web, run code, query a database, send an email. The Model Context Protocol (MCP) is what stops every team from reinventing the tool interface, badly, every time.

---

## Remember

- **Tool** — a function the agent can call. "Search the web," "run SQL," "send a Slack message."
- **Tool schema** — JSON description of a tool: name, description, input parameters, output format. The LLM reads these to decide which tool to call.
- **Function calling** — the LLM's ability to emit structured tool calls. Supported by Claude, GPT-4o, Gemini.
- **MCP (Model Context Protocol)** — an open standard (Anthropic, 2024) for connecting LLMs to external tools and data. "USB-C for AI."
- **Tool interface** — the contract between the agent and the tool. The design surface that determines whether the agent succeeds or fumbles.

---

## Understand — tool schemas

Each tool is described to the LLM as a JSON schema:

```json
{
  "name": "web_search",
  "description": "Search the web for recent information. Use for queries about current events, recent papers, or anything not in your training data.",
  "input": {
    "query": {"type": "string", "description": "The search query"},
    "max_results": {"type": "integer", "default": 10}
  },
  "output": {
    "results": [{"url": "string", "title": "string", "snippet": "string"}]
  }
}
```

The description tells the LLM *when* to use the tool ("for current events, recent papers"). This is crucial — the LLM needs to know not just *what* the tool does, but *when* to use it.

---

## Apply — design tools for a research agent

Tools: `web_search(query)`, `fetch_page(url)`, `write_summary(text)`, `finish(summary)`.

Good tool design principles:
- **Small and focused**: one tool does one thing. Don't build a "do_everything" tool.
- **Clear descriptions**: the LLM decides based on the description. If the description is vague, the LLM will misuse the tool.
- **Structured errors**: return error objects, not empty strings. The LLM needs to know "this failed" vs. "this found nothing."
- **Permission boundaries**: an agent with a "run code" tool can run *any* code. Scope it.

---

## Analyze — why MCP matters

Before MCP, every team built custom tool integrations: custom schemas, custom execution, custom error handling. MCP standardizes all of it. An MCP-compatible tool works with any MCP-compatible LLM — no custom integration needed.

This is the same dynamic that made USB-C ubiquitous: one standard, many devices. As more tools support MCP, and more LLMs support MCP, the ecosystem compounds.

---

## Evaluate — MCP vs. custom integrations

MCP is the future, but in 2026 it's still early. Most production systems use custom tool integrations. The transition: new systems should use MCP if possible; existing systems should plan to migrate.

---

## Create — design tools for a coding agent

Tools: `read_file(path)`, `grep(pattern)`, `write_file(path, content)`, `run_tests()`, `open_pr(diff, description)`. How do you scope `write_file` to prevent the agent from modifying files it shouldn't? How do you sandbox `run_tests`?

---

## A common misconception

**"Tools are just API calls."** No. Tools are the agent's interface to the world, and their design determines whether the agent succeeds or fails. A well-designed tool set makes a mediocre model look smart; a poorly-designed tool set makes a frontier model look incompetent.

---

## Explain it back

> "Tools are _____. A tool schema describes _____. MCP is _____, and it matters because _____. Good tool design requires _____, _____, and _____."

---

## References

- **Anthropic (2024), "Introducing the Model Context Protocol."** https://www.anthropic.com/news/model-context-protocol
- **Schick, T., et al. (2023), "Toolformer," NeurIPS 2023.** arXiv:2302.04761 — https://arxiv.org/abs/2302.04761
- **MCP Documentation.** https://modelcontextprotocol.io/
