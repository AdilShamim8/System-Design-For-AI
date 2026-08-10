---
chapter_id: "C.2"
title: "The Tools in the Toolbox"
topic: "Tool use & MCP"
track: agentic
bloom_stage: ["apply", "analyze"]
est_read_minutes: 17
prerequisites: ["C.1"]
teaching_goal: "Design a tool interface for an agent, explain tool schemas, and describe why MCP matters as a standard."
primary_diagram: assets/diagrams/C.2/
common_misconception: "See chapter body"
status: stable
last_updated: 2026-08-10
---

# The Tools in the Toolbox

An agent without tools is just a chatbot that talks to itself. Tools are what let an agent actually do things — search the web, run code, query a database, send an email. The Model Context Protocol is what stops every team from reinventing the tool interface, badly, every time.

---

## Remember

**Tool** — a function the agent can call (search the web, run code, query a database). **Tool schema** — JSON description of a tool's name, description, inputs, and outputs. **Function calling** — the LLM's ability to emit structured tool calls. **MCP (Model Context Protocol)** — an open standard (Anthropic, 2024) for connecting LLMs to external tools and data. **Tool interface** — the contract between the agent and the tool.

---

## Understand

Tools are the agent's hands. Without them, the agent can only produce text — it can't act on the world. With tools, it can search, compute, retrieve, write, and send.

**Tool schemas.** Each tool is described to the LLM as a JSON schema: name, description, input parameters (with types), output format. The LLM reads these descriptions and decides which tool to call, with what arguments. Good tool descriptions are the difference between an agent that works and one that fumbles every call. A tool description should be: clear (what does it do?), specific (what inputs does it take?), and honest (what does it return?).

**The call-and-return contract.** The LLM emits a tool call (function name + arguments). The orchestrator executes the tool. The result goes back into the LLM's context. The LLM reads the result and decides the next step. This is the 'act' and 'observe' in the agent loop (see C.1).

**The Model Context Protocol (MCP).** Introduced by Anthropic in 2024, MCP is an open standard for connecting LLMs to external tools and data sources. Think of it as 'USB-C for AI' — one standard connector so you don't need a different integration for every tool. Before MCP, every team built custom tool integrations: custom schemas, custom execution, custom error handling. MCP standardizes all of it. An MCP-compatible tool works with any MCP-compatible LLM — no custom integration needed.

**Why MCP matters.** Network effects. As more tools support MCP, and more LLMs support MCP, the ecosystem compounds. A developer can write an MCP server for their tool once, and it works with Claude, GPT, Gemini, and any future MCP-compatible model. This is the same dynamic that made USB-C ubiquitous: one standard, many devices.

---

## Apply

Design tools for a research agent:
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

Note: the description tells the LLM *when* to use the tool ('for current events, recent papers, anything not in training data'). This is crucial — the LLM needs to know not just *what* the tool does, but *when* to use it.

---

## Analyze

Good tool design is like good API design: small, composable, well-named, well-documented. Bad tool design makes even smart agents fumble. Common mistakes:
- **Tools too broad**: one tool that 'does everything' is hard for the LLM to use correctly. Split into focused tools.
- **Poor descriptions**: if the LLM doesn't know when to use a tool, it won't use it (or will use it wrong).
- **No error handling**: if a tool fails silently, the agent proceeds with bad data. Tools should return structured errors.
- **No permission boundaries**: an agent with a 'run code' tool can run *any* code. Scope it.

The tool interface is a design surface — invest in it.

---

## Evaluate

MCP vs. custom integrations: MCP is the future, but in 2026 it's still early. Most production systems use custom tool integrations. The transition: new systems should use MCP if possible; existing systems should plan to migrate. The network effects are real — the earlier you adopt, the more you benefit as the ecosystem grows.

---

## Create

Design a tool set for a coding agent. What tools does it need (read_file, write_file, grep, run_tests, open_pr)? How do you scope write_file to prevent the agent from modifying files it shouldn't? How do you sandbox run_tests to prevent arbitrary code execution?

---

## A common misconception

**'Tools are just API calls.'** No. Tools are the agent's interface to the world, and their design determines whether the agent succeeds or fails. A well-designed tool set makes a mediocre model look smart; a poorly-designed tool set makes a frontier model look incompetent. The tool interface is a first-class design surface, not an afterthought.

---

## Explain it back

Tools are _____. A tool schema describes _____. The call-and-return contract is _____. MCP is _____, and it matters because _____. Good tool design requires _____, _____, and _____.

---

## Further reading

- **Anthropic (2024), "Introducing the Model Context Protocol"** — the MCP spec.
- **Schick et al. (2023), "Toolformer," NeurIPS** — on teaching LLMs to use tools.
- **MCP documentation (modelcontextprotocol.io)** — the official spec and SDKs.
