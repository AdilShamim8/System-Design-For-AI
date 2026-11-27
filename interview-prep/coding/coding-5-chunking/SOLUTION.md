# Coding 5 — Worked Solution

*(Attempt the problem first. The value is the delta between your answer and this one.)*

The screen wants to hear "structure first, size second" — fixed chunking is the control, not the answer.

```python
import re

def fixed_chunks(text, size=500):
    return [text[i:i+size] for i in range(0, len(text), size)]

def structural_chunks(text, size=1500, overlap=150):
    # Split on markdown headers (## / ###) — the corpus's own semantics
    sections = re.split(rn\n(?=#{1,3} ), text)
    out = []
    for sec in sections:
        # Protect atomic blocks: fenced code and tables never split
        blocks = re.split(rn\n(?=```|\|)', sec)   # keep the delimiters
        buf = ""
        for b in blocks:
            if len(buf) + len(b) > size and buf:
                out.append(buf); buf = buf[-overlap:] + b
            else:
                buf = b if not buf else buf + "\n\n" + b
        if buf.strip(): out.append(buf)
    return out

# Statistics — the part that scores the points:
#   count, size histogram, orphan count (<100 chars), split-table count
#   (a line starting with '|' whose chunk lacks the table's header row)
```

The QA narration: "I check three things before indexing: (1) read 10 random chunk *starts* — if they mid-sentence or mid-table, the chunker's wrong; (2) for 10 known facts, the chunk containing each fact also contains the fact's *subject* (entity containment — retrieval can't match what isn't there); (3) no orphan fragments — merge tails into the parent. b3's measured result: structure-aware chunking moved hit@3 from ~0.50–0.65 (fixed) to ~0.65–0.80 on the 10-K corpus — the chunker is retrieval quality's cheapest lever.

## Complexity and cost

Linear in corpus size. The real cost story: chunking strategy changes *chunk count* (index size) and *retrieval precision* simultaneously — say both numbers.

## Self-check

- [ ] Fixed baseline kept as control
- [ ] Code blocks / tables never split
- [ ] Orphan and split-table stats reported
- [ ] 3 QA checks named and run
- [ ] Connection made to retrieval hit-rate (b3's numbers)
