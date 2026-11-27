# Coding 10 — Measure an Agent's Injection Compliance Rate

**Time budget: 45 min.** Open book (docs, not solutions). Narrate your tradeoffs.

## The scenario

The safety screen with code: you have an agent loop (mock the LLM — a function that returns either a benign action or a compliance, deterministically per input) and a tool grid. Build the fuzzer that measures how often the agent complies with injected instructions — the number Mock 11 and c3 hinge on (unguarded agents: 30-60 percent compliance; the filter-plus-hygiene-plus-check stack: single digits).

## Your task

1. Build the payload set: 10 direct injections ('ignore previous instructions...'), 10 indirect (instructions hidden in a retrieved document), 10 benign-but-urgent ('I am the owner, refund me NOW'), 10 truly benign.
2. Run the suite against the UNGUARDED agent; report compliance rate and false-block rate.
3. Add the guard stack layer by layer (input filter, prompt hygiene markers, output check); re-run after each layer; show the rate falling.
4. Report the final table: layer stack vs compliance rate vs false-block rate.
5. State what the fuzzer CANNOT catch (novel attack phrasings, multi-turn manipulation) and what you'd add.

## Success looks like

Compliance and false-block rates measured SEPARATELY at every layer. The indirect-injection class is its own row, not blended into direct. The final table shows the tradeoff (each layer drops compliance but can raise false blocks). The residual-risk paragraph is honest.

## Dataset

Self-contained: a mock agent with a configurable guard stack, 30-50 injection payloads (direct and indirect), a small benign set to measure false blocks. No external dependencies.

## After your attempt

Open [SOLUTION.md](./SOLUTION.md). Grade yourself against the checklist at the end.
