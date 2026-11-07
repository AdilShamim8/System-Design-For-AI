# Lab b4 — Evaluate RAG Like You Mean It

| | |
|---|---|
| **Prerequisites** | Chapter B.8 ("it sounds right" is not good enough) · Lab b2 |
| **Dataset** | SQuAD (reused) + LLM-as-judge (your API) |
| **You will build** | A two-tier RAG evaluation harness — retrieval metrics (cheap, exact) + generation metrics (LLM-judged faithfulness and relevance) — and the failure taxonomy each tier catches |
| **Est. time** | 2–3 hours |
| **Cost** | < $0.20 with a small judge model (100–150 judged answers) |

**The story.** Your RAG demo looks great. How great, exactly? "It sounds right" is how the Air Canada chatbot shipped (FN-04). Evaluation is the difference between a demo and a system, and RAG eval has a shape that surprises people: **you grade the retriever and the generator separately, because they fail separately and need separate fixes.** Today you build the harness, learn what LLM-as-judge can and cannot see, and internalize the metric that actually predicts user trust: *faithfulness* — is every claim in the answer supported by the retrieved context?

---

## Part 1 — Tier 1: retrieval metrics, exact and cheap (30 min)

Reuse Lab b2's pipeline (chunker, embedder, index). On 150 SQuAD validation questions compute:

```python
def retrieval_metrics(questions, k=4):
    hits, mrr = [], []
    for _, row in questions.iterrows():
        gold = row.context
        retrieved = retrieve(row.question, k)          # from lab b2
        is_hit = [gold[:200] in r for r in retrieved]
        hits.append(any(is_hit))
        if any(is_hit):
            mrr.append(1 / (is_hit.index(True) + 1))   # rank of first gold chunk
        else:
            mrr.append(0.0)
    return {"hit_rate": round(sum(hits)/len(hits), 3),
            "mrr": round(sum(mrr)/len(mrr), 3)}
```

**Checkpoint 1:** Record hit_rate and MRR. Then the *cost* argument this tier earns: these metrics are **free, exact, and runnable in CI on every commit** — no LLM calls, no sampling noise, no judge bias. A team that only runs LLM-judged evals pays 100× more to learn less about half the system. Rule: **every question your retrieval tier answers doesn't need a judge.**

---

## Part 2 — Tier 2: faithfulness — the trust metric (45 min)

For questions where retrieval *hit*, judge the **answer against the retrieved context** (not the gold answer — RAG can be faithful to context while differing from SQuAD's span):

```python
import os, json
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()
client = OpenAI(api_key=os.environ["LLM_API_KEY"], base_url=os.environ.get("LLM_BASE_URL"))
JUDGE = os.environ.get("LLM_MODEL", "gpt-4o-mini")

FAITH_PROMPT = '''You are grading an AI answer for FAITHFULNESS.

Context given to the answerer:
{context}

Answer to grade:
{answer}

For each factual claim in the answer, decide: is it directly supported by the context?
Output JSON only: {{"faithful": true/false, "unsupported_claims": ["..."], "reason": "..."}}'''

def judge_faithfulness(answer, contexts):
    resp = client.chat.completions.create(
        model=JUDGE,
        messages=[{"role": "user", "content":
                   FAITH_PROMPT.format(context="\n---\n".join(contexts), answer=answer)}],
        temperature=0, max_tokens=300,
        response_format={"type": "json_object"})
    return json.loads(resp.choices[0].message.content)
```

Run it over 30 hit-questions. Also compute **answer relevance** (does the answer address the question? 1–5 scale, same judge pattern) — faithfulness without relevance is a faithfully *wrong* answer.

**Checkpoint 2:** Expect faithfulness ≈ 0.8–0.95 with a decent prompt, and find your first unfaithful answer. Read the judge's `unsupported_claims`. Two canonical species: (a) **prior leakage** — the model adds facts it "knows" that aren't in the context (the FN-04 disease); (b) **fusion** — the model merges two retrieved chunks into a claim neither makes. Note which you found; the fixes differ (a: stricter grounding instructions; b: better chunking or fewer chunks).

---

## Part 3 — Know your judge: bias tests (30 min)

LLM-as-judge is a *model*, with model problems. Three experiments, ten minutes each:

1. **Position bias:** ask the judge to compare answer A vs. B where A and B are *identical*. Does it pick the first? Run 10 times.
2. **Length bias:** same answer content, one padded with 100 words of fluff. Does the judge prefer the longer one?
3. **Self-agreement:** re-run 10 judgments at temperature 0 — do they repeat? Then at default temperature — how much do they drift?

**Checkpoint 3:** Record your judge's biases in the journal. The industry's mitigation menu: randomized A/B order in comparison prompts, length-controlled scoring rubrics ("penalize unsupported verbosity"), temperature 0 + fixed seed for reproducibility, and periodically **calibrating against a human-labeled sample** (50 answers, agreement rate on the dashboard). A judge you've never tested is a stranger grading your homework.

---

## Part 4 — The eval set is a product (15 min)

Your 150-question set + judgments is now an artifact: `evals/rag_eval_v1.jsonl`. Treat it like code:

- **Version it** with the pipeline (chunker settings, embedding model, prompts). Changing any of them without re-running the eval is flying blind.
- **Track it over time** — faithfulness regressions after a "prompt improvement" are the RAG version of Lab a7's drift, except *you* caused it.
- **Grow it from failures** — every production question that fails gets added to the set. Six months in, the set *is* your quality story.

**Checkpoint 4:** Write the CI rule you'd enforce: "Any prompt/chunker/model change must re-run the eval and show hit_rate ≥ [x] and faithfulness ≥ [y] before merge." That sentence — evals as merge gates — is the single strongest "we're serious about RAG" signal a team can send, and now you've built its mechanics.

---

## Explain it back

1. Why grade retrieval and generation separately? What does each tier cost and catch?
2. Faithfulness vs. relevance — define each in one sentence and name a failure each one misses.
3. Name three judge biases and their mitigations.
4. Your faithfulness is 0.95 but users still complain about wrong answers. Give the three-tier debugging order.

## Extensions

- **RAGAS-style metrics:** implement context-precision/context-recall with the judge (did the *right* chunks rank highest / were all needed chunks retrieved?). The RAGAS paper (Es et al., 2023) is your checklist; you now speak its language.
- **Golden set discipline:** hand-label 50 answers yourself (faithful or not) and compute judge-vs-you agreement (Cohen's κ). Below 0.6? Your judge needs a better rubric or a bigger model.
- **Regression demo:** "improve" the system prompt to be friendlier (allowing helpful additions), re-run the eval, watch faithfulness drop while answers sound better. You've just demonstrated why vibes-based prompt iteration is dangerous — with a number.

## What you can now claim in an interview

"I evaluate RAG in two tiers: exact retrieval metrics (hit, MRR — free, in CI) and LLM-judged faithfulness/relevance with tested, temperature-0 judging. I know my judge's position and length biases because I measured them, and my eval set is versioned with the pipeline so prompt changes can't ship without a regression check."
