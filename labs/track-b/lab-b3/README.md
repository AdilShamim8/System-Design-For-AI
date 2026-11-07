# Lab b3 — Chunking Strategies, Measured

| | |
|---|---|
| **Prerequisites** | Chapter B.4 (splitting knowledge without losing it) · Lab b2 |
| **Dataset** | Real SEC 10-K filings — 100+ page corporate disclosures ([card](../../../datasets/qa-knowledge.md)) |
| **You will build** | Three chunkers (fixed / recursive / section-aware), one eval harness, and the numbers behind every chunk-size argument you'll ever have |
| **Est. time** | 2–3 hours |
| **Cost** | Embedding local & free. Generation optional (only Part 4, < $0.05) |

**The story.** "What chunk size do you use?" is the most-asked RAG question and the most-answered-with-a-vibe question in the field. The honest answer is: **it depends on the corpus and the questions, and you can measure it in an afternoon.** Today you take the messiest real document type most enterprises have — a 10-K annual report — and measure fixed-size, recursive, and section-aware chunking against the same question set. By the end, "400 tokens with 50 overlap" will be something you *derived*, not something you read on a blog.

---

## Part 0 — Get a real 10-K (20 min)

SEC EDGAR has a clean, free JSON API (rate-limited; be polite — the SEC requires a User-Agent identifying you):

```python
import requests, time

HDRS = {"User-Agent": "system-design-course-lab contact@example.com"}  # SEC rule: identify yourself
CIK = "0000320193"                                    # Apple. Try 0000789019 (Microsoft) too.

subs = requests.get(f"https://data.sec.gov/submissions/CIK{CIK}.json",
                    headers=HDRS).json()
recent = subs["filings"]["recent"]
tenk = next((i, f) for i, f in enumerate(recent["form"]) if f == "10-K")
acc = recent["accessionNumber"][tenk[0]].replace("-", "")
doc = [d for d in subs["filings"]["recent"]["document"] if d.endswith(".htm")]
url = f"https://www.sec.gov/Archives/edgar/data/{int(CIK)}/{acc}/{doc[-1]}"
time.sleep(0.2)
html = requests.get(url, headers=HDRS).text
print(url, "chars:", len(html))
```

Strip to text (`pip install beautifulsoup4` if needed):

```python
from bs4 import BeautifulSoup
text = BeautifulSoup(html, "html.parser").get_text(" ", strip=True)
print("plain text chars:", len(text))            # expect 300K-600K — a real document
```

**Checkpoint 0:** Locate three things in the text: (1) the table of contents, (2) "Risk Factors" (usually Item 1A — the longest section), (3) the financial statements (Item 8 — mostly tables). A 10-K is *structurally heterogeneous*: prose, legal boilerplate, and numeric tables. Chunkers that ignore structure pay for it — hold that thought for Part 3.

---

## Part 1 — Three chunkers (40 min)

```python
import re

def fixed_chunks(text, size=1800, overlap=200):
    # size in characters (~450 tokens at 4 chars/token)
    steps = list(range(0, len(text), size - overlap)) or [0]
    return [text[i:i+size] for i in steps]

def recursive_chunks(text, size=1800, overlap=200):
    # split on natural boundaries, largest first, then pack
    seps = ["\n\n", "\n", ". ", " "]
    pieces = [text]
    for sep in seps:
        pieces = [q for p in pieces for q in p.split(sep)]
        if all(len(p) <= size for p in pieces):
            break
    out, buf = [], ""
    for p in pieces:
        if len(buf) + len(p) + 1 > size and buf:
            out.append(buf); buf = buf[-overlap:] + " " + p
        else:
            buf = (buf + " " + p).strip()
    out.append(buf)
    return out

def section_chunks(text, size=1800):
    # 10-K structure: "Item 1A.", "Item 7." etc. split first, then fixed within
    heads = re.split(r"(?=Item \d+[A-C]?\. )", text)
    out = []
    for h in heads:
        out.extend(fixed_chunks(h, size) if len(h) > size else [h])
    return out
```

**Checkpoint 1:** For each chunker, print: chunk count, mean chunk length, and **the first 100 characters of three random chunks**. Read them. Fixed chunking cuts mid-sentence (and mid-table — find one); recursive preserves sentence boundaries; section-aware keeps "Item 1A" context with its content. You are looking at *semantic integrity* — the property that makes a chunk retrievable by its meaning rather than its words.

---

## Part 2 — The eval: retrieval quality per chunker (45 min)

You need questions with known answers. Write 12 questions against the 10-K (you're the annotator — that's how real eval sets start), e.g. "What was total net sales in fiscal 2023?", "What risk does Apple cite about component suppliers?", each with the *chunk location* you verified by reading. Then:

```python
from sentence_transformers import SentenceTransformer
import numpy as np

enc = SentenceTransformer("all-MiniLM-L6-v2")

def evaluate(chunks, questions, k=3):
    C = enc.encode(chunks, batch_size=64, normalize_embeddings=True)
    hits = 0
    for q in questions:
        qv = enc.encode([q["question"]], normalize_embeddings=True)
        top = (qv @ C.T)[0].argsort()[::-1][:k]
        hits += any(q["gold_fragment"] in chunks[i] for i in top)
    return {"n_chunks": len(chunks), "hit@3": round(hits / len(questions), 2)}

# QUESTIONS = [{"question": ..., "gold_fragment": <exact substring you verified>}, ...]
for name, fn in [("fixed 1800/200", lambda: fixed_chunks(text)),
                 ("recursive 1800/200", lambda: recursive_chunks(text)),
                 ("section-aware", lambda: section_chunks(text))]:
    print(name, evaluate(fn(), QUESTIONS))
```

**Checkpoint 2 (the lab's payoff):** Expect section-aware ≥ recursive > fixed, typically by 5–20 points of hit@3. Then the *drill-down* that makes you dangerous: find one question each chunker missed and diagnose *why* — a table split across chunks (fixed), a sentence severed from its antecedent (fixed), an "Item" header divorced from its body (recursive without sections). **Every chunk-size debate ends when someone shows hit@k numbers for their corpus. Be that someone.**

---

## Part 3 — Size sweep: the 300/800/1800 curve (20 min)

Run your best chunker at 300, 800, 1800 chars (~75/200/450 tokens). Record hit@3 and the *prompt cost* at k=3 (chunk_size × 3 ÷ 4 = input tokens). You should see quality rise then flatten (or dip — huge chunks dilute) while cost rises linearly. The professional framing to write down:

> "Chunk size trades retrieval precision for context completeness. Small chunks match queries tightly but fragment answers; large chunks preserve reasoning but bury the answer and cost tokens. Our corpus's knee is at [your number] — measured, not vibes."

## Part 4 — The generation check (15 min)

Pick your two best chunking configs and answer 5 questions end-to-end (b2's `answer()`). A chunker can win hit-rate and *lose* answers: a 75-token chunk contains "net sales: $383.3B" but not "fiscal 2023" — retrieved, cited, and useless. **Retrieval metrics are necessary, not sufficient.** Write your two-line conclusion.

---

## Explain it back

1. Why does fixed chunking lose to recursive — and in what corpus would the gap shrink to zero? (Hint: homogeneous prose.)
2. Why is "section-aware" another name for "use the document's own semantics"?
3. Your CFO asks why not just stuff the whole 10-K in the context window (200K tokens — it fits!). Give the three-part answer (cost per b1, attention/dilution, and "lost in the middle" quality decay).
4. Chunk overlap: what failure does it mitigate, and what does it NOT fix?

## Extensions

- **Semantic chunking:** embed sentences, split where cosine similarity between consecutive sentences drops below a threshold. More code, sometimes better — measure whether it beats section-aware *on this corpus*. (Spoiler: on structured 10-Ks, structure usually wins; on messy transcripts, semantic wins. Corpus decides.)
- **Table awareness:** extract tables with `pandas.read_html` and index them as *rows* ("metric | value | unit | period") rather than text blobs. This is the beginning of real document intelligence.
- **Multi-document:** add Microsoft's 10-K, ask "which company grew cloud revenue faster?" — watch single-hop chunking fail, and describe the decomposition fix (query → per-company retrieval → synthesis).

## What you can now claim in an interview

"I've measured chunking strategies on real 100-page SEC filings with a labeled question set: section-aware chunking beat fixed-size by [your number] hit points, and the size sweep's quality/cost knee on my corpus was [your number] characters. I run this exact harness before believing any chunking blog post — including my own."
