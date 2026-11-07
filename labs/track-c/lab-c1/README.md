# Lab c1 — The Agent Loop, From Scratch

| | |
|---|---|
| **Prerequisites** | Chapter C.1 (the loop that won't stop) · Lab b1 |
| **You will build** | A working tool-using agent — the ReAct loop, tool dispatch, and a trace log — in ~100 lines, **no agent framework** |
| **Est. time** | 3 hours |
| **Cost** | < $0.20 (a handful of multi-turn episodes) |

**The story.** Every agent framework on earth — LangGraph, smolagents, whatever ships next month — is a wrapper around one while-loop: **model decides → code executes a tool → result goes back to the model → repeat until "final answer" or the budget dies.** Build it bare-handed once and frameworks stop being magic and start being convenience. More importantly, you'll meet the agent's four production killers *in person*: the infinite loop, the hallucinated tool call, the context bloat, and the silent budget blowout.

## Part 1 — Two tools and a dispatch table (30 min)

```python
import json
TOOLS = [
    {"name": "calculator",
     "description": "Evaluate a basic arithmetic expression, e.g. '2*(3+4)'.",
     "params": {"expr": "string"}},
    {"name": "word_count",
     "description": "Count words in a text.",
     "params": {"text": "string"}},
]

def calculator(expr):
    # safe-ish eval: digits and math only
    import re
    if not re.fullmatch(r"[0-9+\-*/(). ]+", expr):
        return {"error": "invalid characters in expression"}
    try:
        return {"result": eval(expr, {"__builtins__": {}}, {})}
    except Exception as e:
        return {"error": str(e)}

def word_count(text):
    return {"words": len(text.split())}

DISPATCH = {"calculator": calculator, "word_count": word_count}

def run_tool(name, args):
    if name not in DISPATCH:
        return {"error": f"unknown tool '{name}'"}    # never crash the loop
    return DISPATCH[name](**args)
```

**Checkpoint 1:** Why return an error *dictionary* instead of raising? Because the model sees the error and can correct itself — an exception kills the episode and the user experience. **Tool errors are conversation, not crashes.** (This is half of c2's whole lesson; you've just met it early.)

## Part 2 — The loop (45 min)

```python
import os
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()
client = OpenAI(api_key=os.environ["LLM_API_KEY"], base_url=os.environ.get("LLM_BASE_URL"))
MODEL = os.environ.get("LLM_MODEL", "gpt-4o-mini")

SYSTEM = '''You are a tool-using agent. On each turn you may either:
1. Call a tool: reply with ONLY a JSON object:
   {"tool": "<name>", "args": {...}}
2. Give the final answer: reply with ONLY:
   {"final_answer": "<your answer>"}

Available tools:
''' + json.dumps(TOOLS, indent=2)

def agent_loop(question, max_steps=8):
    messages = [{"role": "system", "content": SYSTEM},
                {"role": "user", "content": question}]
    trace = []
    for step in range(max_steps):
        r = client.chat.completions.create(model=MODEL, messages=messages,
                                           temperature=0, max_tokens=300)
        reply = r.choices[0].message.content.strip()
        trace.append({"step": step, "reply": reply})
        try:
            action = json.loads(reply)
        except json.JSONDecodeError:
            messages.append({"role": "user",
                "content": "That was not valid JSON. Reply with the JSON object only."})
            continue
        if "final_answer" in action:
            return action["final_answer"], trace
        if "tool" in action:
            result = run_tool(action["tool"], action.get("args", {}))
            trace.append({"step": step, "tool_result": result})
            messages.append({"role": "assistant", "content": reply})
            messages.append({"role": "user",
                             "content": "TOOL RESULT: " + json.dumps(result)})
            continue
        messages.append({"role": "user",
            "content": "Reply with either a tool call or final_answer JSON."})
    return "BUDGET EXHAUSTED (max steps)", trace
```

**Checkpoint 2:** Run three episodes: "What is 2*(3+4) squared?" (two tool calls chained), "How many words are in 'the quick brown fox' plus 10?" (multi-tool), and one pure-knowledge question (zero tool calls, straight to final answer). Print the trace and *read it* — each step is the model thinking in JSON. You have built the same loop C.1 draws, with real tokens.

## Part 3 — Meet the four killers (45 min)

Break your agent on purpose, one killer at a time. Document each in the journal:

1. **The infinite loop.** Remove `max_steps` (set it huge). Ask a question the tools can't help with but the model keeps retrying ("what's the weather?"). Watch the loop burn tokens calling `calculator` with nonsense. *The fix you'll appreciate forever: a step budget is a safety system, not a suggestion.*
2. **The hallucinated call.** Give the model a tool description that says "params: expression" but the function expects `expr`. Watch it call wrong names / wrong params. Your dispatch table's error path is what saves the episode — the model reads `unknown tool` and self-corrects. **Schema clarity is agent insurance.**
3. **Context bloat.** Ask a 15-step question (or set `max_steps=15` with a chatty prompt). Print `len(json.dumps(messages))` per step — it grows *quadratically-ish* since every step appends and the whole history is resent. Each step costs more than the last. (c4 fixes this; today you *measure* the disease.)
4. **Budget blowout.** Sum the tokens across a looping episode. One runaway episode = hundreds of normal ones. Now explain to yourself why every production agent has a *token budget* per episode enforced *outside* the model.

**Checkpoint 3:** Your journal table: killer | how you triggered it | what it cost | the guardrail. Four rows. That table is the "what breaks in production" answer for any agent interview question, with receipts.

## Part 4 — The trace log is the product (20 min)

Your `trace` list is the most important artifact agent engineering has: **the trajectory.** When (not if) something goes wrong, the trajectory is how you debug — step by step, which tool call was wrong, what the model saw. Wrap it:

```python
import datetime
def log_trace(question, trace, outcome):
    entry = {"ts": datetime.datetime.now().isoformat(),
             "question": question, "outcome": outcome, "trace": trace}
    with open("agent_traces.jsonl", "a") as f:
        f.write(json.dumps(entry) + "\n")
```

**Checkpoint 4:** Write the three questions a trace lets you answer that a plain log doesn't: (1) which step went wrong, (2) what the model *saw* when it made the bad call, (3) was it a tool-design problem or a model-reasoning problem. c5 turns traces into an *evaluation* dataset; today they're your debugging superpower.

---

## Explain it back

1. Write the agent loop from memory — five lines of pseudocode.
2. Why are tool errors returned, not raised?
3. Why does per-step cost grow across an episode, and what's the c4 fix?
4. Your agent ran 200 steps in production last night. Walk me through your postmortem with the trace.

## Extensions

- **A retrieval tool:** add `search_docs(query)` backed by your b2 RAG index. Now your agent can answer knowledge questions *and* compute — and you've built the anatomy of every "RAG agent" product (which is: a RAG system with a loop around it).
- **Structured tool calling:** swap the JSON-in-prose protocol for your provider's native function-calling API. Compare reliability across 20 episodes — native modes exist because Part-3 killer #2 is common.
- **Parallel tool calls:** let one reply contain multiple tool calls; execute them concurrently. Now you've met the scheduler problem every real agent runtime solves.

## What you can now claim in an interview

"I built the agent loop from scratch — dispatch table, JSON protocol, step budget, trace logging — and triggered its four production killers deliberately: infinite loops, hallucinated calls, context bloat, budget blowout. Frameworks are convenience; the loop, the guards, and the traces are the product."
