# Lab b2 — RAG From Scratch

| | |
|---|---|
| **Prerequisites** | Chapters B.2 (the librarian), B.3 (the index that speaks in numbers) · Lab b1 |
| **Dataset** | SQuAD v1.1 contexts — 18,896 real Wikipedia paragraphs ([card](../../../datasets/qa-knowledge.md)) |
| **You will build** | The entire RAG pipeline with your own hands: chunk → embed → index → retrieve → generate → cite — **no framework**, so you know exactly what LangChain is doing *for* you (and hiding from you) |
| **Est. time** | 3–4 hours |
| **Cost** | Embedding: local & free (`all-MiniLM-L6-v2`). Generation: < $0.10 with a small model, or free with Ollama |

**The story.** You've read that RAG is "search the docs and stuff them into the prompt." That sentence is true the way "cooking is putting food near heat" is true. Today you build every joint of the machine — the chunker, the embedder, the vector index, the retriever, the prompt assembler, the citation layer — and you break each one on purpose. When it's done, you'll never be fooled by a RAG demo again, because you'll know exactly which of its five stages is lying to you.

> **No frameworks in this lab.** Not because frameworks are bad — because you can't reason about what you've never built bare-handed. In Lab c1 you'll build the agent loop bare-handed for the same reason.

---

## Part 0 — Get the corpus (10 min)

SQuAD gives us 18,896 real Wikipedia paragraphs *with questions and answers written against them* — a perfect RAG testbed because we can *grade* retrieval.

```python
from datasets import load_dataset
squad = load_dataset("squad", split="validation")   # 10,573 QA pairs, ~2,032 unique contexts
contexts = squad.remove_columns([c for c in squad.column_names
                                 if c != "context"]).to_pandas()
paragraphs = contexts.context.unique().tolist()      # ~2,032 paragraphs, each ~120 tokens
qa = squad.to_pandas()[["question", "context", "answers"]]
print(len(paragraphs), "paragraphs;", len(qa), "questions")
```

(Small on purpose: every experiment runs in seconds. The *architecture* scales; the lab is where you learn the architecture.)

---

## Part 1 — Chunking: size actually matters (30 min)

SQuAD paragraphs are already chunk-sized (~120 tokens). Ignore that gift — build a chunker and measure it, because your corpus will not always be polite:

```python
def chunk_text(text, size=400, overlap=50):
    words = text.split()
    steps = list(range(0, len(words), size - overlap)) or [0]
    return [" ".join(words[i:i + size]) for i in steps if words[i:i + size]]
```

**Checkpoint 1:** Run over all paragraphs with `size=800` then `size=120`, count the chunks produced. Then answer: retrieval wants **small, focused chunks** (fewer irrelevant tokens per retrieved unit → better precision, cheaper prompts); authoring wants **large, coherent chunks** (a sentence cut from its paragraph retrieves *worse* — losing "it" and "the treaty" antecedents). Write your chunk-size tension paragraph in your journal — it's the exact tradeoff Lab b3 measures properly, and the one B.4 exists to explain.

---

## Part 2 — Embed and index (30 min)

```python
from sentence_transformers import SentenceTransformer
import numpy as np

enc = SentenceTransformer("all-MiniLM-L6-v2")           # 384-dim, CPU-friendly
chunks = [c for p in paragraphs for c in chunk_text(p, 400, 50)]
C = enc.encode(chunks, batch_size=64, normalize_embeddings=True, show_progress_bar=True)
print("chunk count:", len(chunks), "| matrix:", C.shape)  # ~2.2K x 384
```

(That's ~3 MB of vectors. At 2,200× the corpus — a Wikipedia-scale build — the same matrix is ~6.5 GB, which is *why vector databases exist* (B.3): your numpy array doesn't shard, replicate, or survive a restart. Do the memory math in your journal.)

---

## Part 3 — Retrieve, and grade it honestly (45 min)

```python
def retrieve(question, k=4):
    q = enc.encode([question], normalize_embeddings=True)
    sims = (q @ C.T)[0]
    return [chunks[i] for i in sims.argsort()[::-1][:k]]

def retrieval_hit_rate(questions, k=4):
    # did the gold context appear in top-k retrieved chunks?
    hits = 0
    for _, row in questions.iterrows():
        gold = row.context
        retrieved = retrieve(row.question, k)
        hits += any(gold[:200] in r for r in retrieved)   # substring match on chunk origin
    return hits / len(questions)

sample = qa.sample(150, random_state=42)
for k in [1, 2, 4, 8]:
    print(f"hit@{k}: {retrieval_hit_rate(sample, k):.2f}")
```

**Checkpoint 3 (the honesty moment):** Expect hit@4 ≈ 0.65–0.80. Not 1.0 — *retrieval is a ranking system and it misses*. Every downstream "hallucination" you'll see in Part 4 has a decent chance of being a *retrieval* failure wearing a generation costume. Record hit@k for all four k values. Now diagnose three misses by hand: read the question, the gold paragraph, and what you retrieved instead. Classify each miss: vocabulary mismatch (B.3's reason for embeddings) vs. multi-hop (question needs two paragraphs — no single chunk can answer) vs. distractor twin (two paragraphs genuinely similar; the ranker needs the *question*, not just the topic). This taxonomy is your debugging toolkit for every RAG system you'll ever touch.

---

## Part 4 — Generate, with citations (45 min)

```python
import os
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()
client = OpenAI(api_key=os.environ["LLM_API_KEY"], base_url=os.environ.get("LLM_BASE_URL"))
MODEL = os.environ.get("LLM_MODEL", "gpt-4o-mini")

SYSTEM = ("You answer ONLY from the provided context. "
          "Cite the context number you used like [1], [2]. "
          "If the context does not contain the answer, say exactly: "
          "\"I don't have that in my sources.\"")

def answer(question, k=4):
    ctxs = retrieve(question, k)
    ctx_block = "\n\n".join(f"[{i+1}] {c}" for i, c in enumerate(ctxs))
    resp = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "system", "content": SYSTEM},
                  {"role": "user",
                   "content": f"Context:\n{ctx_block}\n\nQuestion: {question}"}],
        max_tokens=300)
    return resp.choices[0].message.content, ctxs

for _, row in sample.head(3).iterrows():
    a, _ = answer(row.question)
    gold = row.answers["text"][0] if row.answers["text"] else ""
    print("Q:", row.question)
    print("A:", a[:300])
    print("Gold:", gold, "\n" + "-" * 60)
```

**Checkpoint 4:** Run 10 questions. For each, mark: **correct / partially correct / wrong / refused**. Then trace every wrong answer back: was the gold context retrieved (Part 3's hit rate)? If yes, the *generator* failed to use it — prompt or model problem. If no, the *retriever* failed — embedding or chunking problem. **This single habit — attribute the failure to the right stage before fixing anything — is the most valuable RAG debugging skill, and most teams never learn it.**

---

## Part 5 — The adversarial question (15 min)

Ask the system something *not in the corpus* ("Who won the 2031 Super Bowl?"). Watch three behaviors across your 10 questions:

1. Does it refuse (the system prompt working)?
2. Does it "helpfully" answer anyway from parametric memory (the Air Canada failure mode — FN-04)?
3. Does it hedge ("Based on my sources…") while making things up?

**Checkpoint 5:** The honest answer to an out-of-corpus question is refusal, and getting it reliably is *harder* than getting right answers to in-corpus questions — because the model's prior is to be helpful. Write your refusal rate. If it's below ~80%, tighten the system prompt (say "MUST", put the rule in the user message too, add a final instruction) and re-measure. Prompt engineering, measured, not vibes.

---

## Explain it back

1. Name the five stages of the pipeline and the failure mode of each.
2. Why does hit@4 < 1.0 matter for the "hallucination" conversation?
3. Chunk size: what does small buy you? What does it cost?
4. Your RAG answers wrongly. Write the *three questions in order* you ask before touching the prompt.

## Extensions

- **BM25 hybrid:** add the a5 machinery — BM25 over chunks, RRF fusion. Hit-rate bump on SQuAD is real (vocabulary mismatch is common in trivia phrasing). You've now rebuilt Lab a5's conclusion in RAG clothing.
- **Rerank:** score the top-10 retrieved with a cross-encoder (`cross-encoder/ms-marco-MiniLM-L-6-v2`), keep top-3. Measure hit@3 before/after. That's Chapter B.5, earned.
- **Bad chunking, measured:** chunk at size 800 with no overlap and re-run hit@4. Feel the drop. Now you have *numbers* for the B.4 conversation.

## What you can now claim in an interview

"I built a RAG pipeline from scratch — chunker, embedder, index, retriever, cited generation — and graded retrieval against labeled data (hit@4 ≈ [your number]). I debug it stage-by-stage: attribute the failure to retrieval vs. generation before changing anything, and I know the three miss types by name because I read my own misses."
