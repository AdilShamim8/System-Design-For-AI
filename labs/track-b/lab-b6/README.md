# Lab b6 — Fine-tune vs. RAG: The Decision Lab

| | |
|---|---|
| **Prerequisites** | Chapter B.6 (picking the brain you can afford) · Labs b1–b2 |
| **Dataset** | IMDB movie reviews (25K labeled) — you'll fine-tune a small transformer on it and feel every step of the decision |
| **You will build** | (1) A working fine-tune on a small model, (2) a RAG-style alternative for the same task, (3) the decision matrix that picks between them — with your own numbers in it |
| **Est. time** | 2–3 hours |
| **Hardware** | CPU works (small model, optional subsample); GPU makes it comfortable. API cost < $0.05 (only Part 3). |

**The story.** Every team hits the fork: "Should we fine-tune a model or build RAG?" The internet's answer is a shrug in both directions. The engineer's answer is a **decision matrix with four axes**: what changes (knowledge vs. behavior), how often it changes, how much labeled data you have, and what latency/cost you can afford. Today you fine-tune a real model (so you know what it actually costs), build the RAG alternative for the same task, and leave with a matrix you can defend in any design review — plus the single most useful sentence in this domain: **fine-tuning changes how the model behaves; retrieval changes what it knows.**

---

## Part 1 — The task where fine-tuning genuinely wins (50 min)

Sentiment classification: fixed label set, stable "knowledge," behavior is the whole job. Fine-tune a small transformer:

```python
from datasets import load_dataset
from transformers import (AutoTokenizer, AutoModelForSequenceClassification,
                          TrainingArguments, Trainer)
import numpy as np

ds = load_dataset("imdb")
ds = ds.shuffle(seed=42)                       # note: IMDB is pre-split train/test
small_train = ds["train"].select(range(4000))  # subsample: CPU-friendly
small_test  = ds["test"].select(range(1000))

tok = AutoTokenizer.from_pretrained("distilbert-base-uncased")
def prep(b): return tok(b["text"], truncation=True, padding="max_length", max_length=256)

model = AutoModelForSequenceClassification.from_pretrained(
    "distilbert-base-uncased", num_labels=2)
args = TrainingArguments(
    output_dir="ft-imdb", num_train_epochs=2, per_device_train_batch_size=16,
    learning_rate=2e-5, report_to="none", save_strategy="no", logging_steps=50,
)
def metrics(p):
    return {"acc": float((p.predictions.argmax(1) == p.label_ids).mean())}

trainer = Trainer(model=model, args=args,
                  train_dataset=small_train.map(prep, batched=True),
                  eval_dataset=small_test.map(prep, batched=True),
                  compute_metrics=metrics)
trainer.train()
print(trainer.evaluate())
```

**Checkpoint 1:** Expect ≈ 0.88–0.92 accuracy from 4,000 examples (2 epochs, 256 tokens). Record: wall-clock train time, dataset size, and accuracy. Then the two follow-ups that make you sound senior: (a) what happens with 500 examples? 500 *good* ones? (b) this model now *is* your classifier — what does "deploying" it cost vs. calling an API? (b1's math applies: a DistilBERT-class model on CPU serves in ~10–30 ms/query at near-zero marginal cost — the fine-tune's economics *improve* with volume.)

> **What fine-tuning did NOT do:** teach the model anything new about the world. It tuned *behavior* — "map review text to a label" — on a task small enough to fit in its weights. Hold that line; Part 2 breaks the other way.

---

## Part 2 — The task where RAG wins, structurally (30 min)

Same dataset, different question: "What did critics say about *The Dark Knight* in this corpus?" — a **knowledge** question. The answer lives in specific documents, changes when the corpus changes, and must be *citable*. Try to solve it with fine-tuning on paper:

1. The fine-tuned model from Part 1 is a classifier — wrong shape entirely.
2. Fine-tune a *generative* model to "know" the reviews? You'd need to retrain whenever a review is added; you cannot cite anything; and knowledge baked into weights can't be audited (which sentence came from which review?).

Now build the RAG version with machinery you already have: embed the 1,000 test reviews (b2's pipeline), retrieve by query "Dark Knight critic reception," and generate a cited summary. It works *today*, cites its sources, and automatically covers reviews added tomorrow — **no retraining, ever, for corpus changes.**

**Checkpoint 2:** Write the two-column table: "changes daily / must cite → RAG" vs. "fixed labels / behavior-shaped / latency-tight → fine-tune." Then the hybrid row that production actually ships: fine-tune the *style/tone/domain* (a model that speaks support-ese), retrieve the *facts* (your policies). The sentence to keep for interviews: **behavior belongs in weights, knowledge belongs in the index.**

---

## Part 3 — The economics axis (20 min)

Both paths have money shapes (b1's functions). With your own numbers:

| | RAG (mid-tier API) | Fine-tuned small model (self-host) |
|---|---|---|
| Upfront | ~0 (index build, ~$1 at 20K chunks) | training run + eval + deployment eng (~days) |
| Per 1K requests | ~$15 (4.5K in / 400 out tokens) | ~$0 marginal + serving infra (~$50–200/mo) |
| Break-even | — | ~[compute it: upfront ÷ (per-1K savings)] K requests |
| Knowledge update | re-embed changed docs (minutes, $) | full retrain (days, $$$$) |
| Behavior update | prompt edit (minutes, risky-ish) | retrain (days) + eval (b4-style gates) |

**Checkpoint 3:** Compute your break-even volume. Below it, API + RAG wins (no fixed cost); above it, the fine-tune's marginal-cost advantage eats the setup cost. This crossover computation — not vibes about "fine-tuning is expensive" — is what a real architecture review does. (Field-guide job data adds market context: fine-tuning is a focus of under 5% of AI-engineer postings — the industry already leaned toward the cheap-to-change side.)

---

## Part 4 — The decision matrix, assembled (20 min)

Write the artifact — this lab's deliverable, reusable in every future design review:

**Fine-tune when:** (1) the task is *behavior* — classification, style, format, domain tone; (2) labels are stable and plentiful (≥ 1K good examples moves mountains); (3) latency/cost at volume demands owning the inference; (4) the knowledge involved is stable and small enough to bake in (a 50-label taxonomy, a house style).

**RAG when:** (1) the task is *knowledge* — answer from a corpus; (2) the corpus changes faster than a training cycle; (3) citations/auditability are required (legal, medical, finance — anywhere "where did that come from?" has a compliance answer); (4) the corpus exceeds what any context window economically holds.

**Both when:** domain-adapted generation (fine-tune the voice) over retrieved context (supply the facts). **Neither when:** a prompt change fixes it — the cheapest knob first, always (B.1).

**Checkpoint 4:** Apply the matrix to three scenarios from `interview-prep/03-genai-questions.md` (a legal doc bot, a brand-voice chatbot, a receipt-line classifier). Write one paragraph each. If your paragraphs disagree with the matrix, fix the matrix — it's *your* tool now.

---

## Explain it back

1. "Fine-tuning changes behavior; retrieval changes knowledge" — give one example task for each, and one for both.
2. Your fine-tuned classifier's accuracy dropped 4 points after a month. Which axis of the matrix does that question live on, and what do you check first?
3. Why can't a fine-tuned model cite its sources, structurally?
4. 1,000 labeled examples arrive weekly. Fine-tune, RAG, or neither — and what changes at 100 examples?

## Extensions

- **LoRA instead of full fine-tune:** `peft` + LoRA on the same task — a fraction of the trainable parameters, similar accuracy, tiny artifacts. This is how real fine-tuning ships in 2026; feel the difference in checkpoint size.
- **Prompt-vs-fine-tune baseline:** before any fine-tune, run a few-shot prompt on your LLM API for the same 1,000 test examples. If few-shot gets 0.90 and your fine-tune gets 0.91, the fine-tune's economics just died. (This baseline is the one teams skip most and regret most.)
- **Data-efficiency curve:** fine-tune on 100 / 500 / 2,000 / 4,000 examples; plot accuracy. You now *know* your labeling budget's marginal return.

## What you can now claim in an interview

"I've fine-tuned a real model, built the RAG alternative, and computed the break-even: behavior goes in weights, knowledge goes in the index, prompts are the first knob, and the crossover volume — not fashion — decides self-hosting. I can defend that with numbers from a lab I ran, and I always run the few-shot baseline before any fine-tune."
