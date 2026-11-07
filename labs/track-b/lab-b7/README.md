# Lab b7 — Structured Outputs That Don't Break

| | |
|---|---|
| **Prerequisites** | Chapter B.1 (prompting as a design surface) · Lab b1 |
| **Dataset** | Your own test corpus: 30 messy product descriptions (write them, or take product blurbs from any shop site) |
| **You will build** | A schema-validated extraction pipeline with retries and repair — the pattern behind every "LLM meets a database" integration |
| **Est. time** | 2 hours |
| **Cost** | < $0.05 |

**The story.** The demo extracts `{name, price, category}` from product descriptions into JSON, and it works — *twice*. Then someone's description contains a price range, a category the schema never heard of, or (inevitably) a model that decides today is the day to wrap JSON in markdown fences. Downstream, your parser throws, the pipeline stalls, and the on-call learns about LLMs. Structured output is where LLM non-determinism meets the most deterministic layer of your stack — and this lab is the defensive engineering that survives the meeting.

---

## Part 1 — The naive version and its funeral (20 min)

```python
import json
def extract_naive(text):
    prompt = (f'Extract name, price (number), category from this product '
              f'description. Reply with JSON only.\n\n{text}')
    r = client.chat.completions.create(model=MODEL,
        messages=[{"role": "user", "content": prompt}], max_tokens=200)
    return json.loads(r.choices[0].message.content)   # <- the funeral
```

Run it on 30 descriptions that include: a price range ("$12–15"), a missing price, a weird category ("hand sanitizer? candle? mood lighting?"), and a 600-character SEO rant. **Count the failure modes** — expect at least: markdown-fenced JSON, trailing commas, string prices ("$12.99"), invented fields, and an occasional polite refusal to be a JSON machine.

**Checkpoint 1:** Log each failure type with a count. This table *is* the requirements document for Parts 2–4 — every mechanism you build next maps to a row.

---

## Part 2 — Validation as a contract: Pydantic + JSON mode (30 min)

```python
from pydantic import BaseModel, Field, field_validator
from typing import Optional

class Product(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    price: Optional[float] = Field(default=None, ge=0)
    category: str
    currency: str = Field(default="USD", pattern="^[A-Z]{3}$")

    @field_validator("category")
    @classmethod
    def known_category(cls, v):
        allowed = {"electronics", "home", "beauty", "toys", "grocery", "other"}
        if v.lower() not in allowed:
            return "other"                      # or raise — a design decision
        return v.lower()

def extract_validated(text):
    r = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": f"...{text}..."}],
        response_format={"type": "json_object"},   # provider JSON mode, if available
        temperature=0, max_tokens=200)
    return Product.model_validate_json(r.choices[0].message.content)
```

**Checkpoint 2:** Re-run your 30. The failure table from Part 1 should collapse to near-zero *format* failures (JSON mode + schema) — note which *semantic* failures survive (wrong category, plausible-but-wrong price). Write the distinction: **format correctness is a solved problem (mechanisms); semantic correctness is an eval problem (b4's machinery).** Teams that conflate the two fix the wrong one.

---

## Part 3 — The repair loop: retries with error feedback (30 min)

Validation failures shouldn't crash the pipeline; they should *teach* the model:

```python
def extract_with_repair(text, max_attempts=3):
    messages = [{"role": "user", "content": build_prompt(text)}]
    for attempt in range(max_attempts):
        r = client.chat.completions.create(model=MODEL, messages=messages,
                                           response_format={"type": "json_object"},
                                           temperature=0, max_tokens=200)
        try:
            return Product.model_validate_json(r.choices[0].message.content)
        except Exception as e:
            messages += [{"role": "assistant", "content": r.choices[0].message.content},
                         {"role": "user",
                          "content": f"Your JSON failed validation: {e}. "
                                     f"Reply with corrected JSON only."}]
    return None      # after N attempts: dead-letter, human review — never a silent guess
```

**Checkpoint 3:** Measure: success rate after attempt 1, 2, 3 (expect repair to rescue most attempt-1 failures at 2–3× the cost of a single call). Then the two design questions this pattern raises: (a) what's your dead-letter policy — drop, queue for human, or fallback to a default? (b) when does repair *hide* a prompt problem you should fix upstream? (If 40% of your calls need repair, your prompt is broken; fix the prompt, don't celebrate the loop.)

---

## Part 4 — The production wrapper (15 min)

Assemble the full contract on paper: prompt version + schema version + model, all logged together (b4's versioning discipline). Add an outer **circuit breaker** — if validation-failure rate crosses 30% in a minute, stop calling (something upstream changed: a model update, a prompt regression) and alert. You now have the full anatomy of an LLM-as-extractor service: **schema in, validation at the boundary, repair in the loop, dead-letters at the end, breaker on the outside.**

**Checkpoint 4:** Sketch the component diagram and mark where each Part-1 failure type dies. If any type survives to the user, add a mechanism until none do.

---

## Explain it back

1. Format correctness vs. semantic correctness — which mechanism owns each?
2. Why must the repair loop have a maximum, and what happens at the maximum?
3. Your validation-failure rate jumps from 3% to 35% at 14:02. What changed, in order of likelihood, and what does the circuit breaker do meanwhile?
4. Why log prompt version + schema version + model on every call?

## Extensions

- **Function-calling / native tool schemas:** if your provider supports structured tool-call arguments, replace JSON mode with a tool schema; compare failure rates. Native modes are the 2026+ answer — but know both, because the wrapper pattern outlives any provider feature.
- **Batch eval harness:** generate 100 synthetic products, run the full pipeline, produce the failure-mix report per category. You've built a tiny eval gate for extraction — b4's pattern, applied to a new surface.
- **Cost of repair:** compute p50/p95 latency and cost with repair enabled vs. a single strict call at a stronger model. Sometimes the bigger model once beats the small model thrice — measure, don't assume.

## What you can now claim in an interview

"I treat LLM output as untrusted input at a trust boundary: schema validation, bounded repair loops with error feedback, dead-letter queues instead of silent guesses, and a circuit breaker on failure-rate spikes. Format correctness is a mechanism; semantic correctness is an eval — I own them separately."
