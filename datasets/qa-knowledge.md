> Every dataset in this catalog is real, public, and used (or usable) somewhere in this course's labs. Sizes and access notes are as of late 2026 — always check the source page before relying on a number. **Check each dataset's license before commercial use**; many research datasets are non-commercial.

# QA & Knowledge Datasets

These power the RAG labs (b2, b4). The shape to internalize: (question, context passage, answer span/answer, and — for evaluation — distractor contexts).

### SQuAD v1.1 / v2.0 (Stanford, 2016/2018)

**What:** Questions written by crowdworkers on 536 Wikipedia articles. v1.1: 107,785 questions, every question answerable from its paragraph. v2.0 adds 53,775 unanswerable questions that *look* answerable.

**Size:** v1.1 ~100K questions; v2.0 ~160K (tens of MB)

**Get it:** https://rajpurkar.github.io/SQuAD-explorer/ (Hugging Face: `squad`, `squad_v2`)

**License:** CC BY-SA 4.0.

**Quirks & gotchas:** v1.1 teaches extraction; v2.0 teaches the 'no answer' case — which is the honest version of production RAG. Questions were written *while looking at* the passage, so phrasing overlaps more than real user questions do (a known dataset bias).

**Used in:** Lab b2 (RAG from scratch), Lab b4 (evaluation).

---
### Natural Questions (Google, 2019)

**What:** 307,373 real Google search queries, each annotated with a Wikipedia page and (where present) a long/short answer. The most 'real-user-shaped' public QA dataset.

**Size:** ~307K questions; 21GB full; ~4GB simplified (`natural_questions` on HF)

**Get it:** https://ai.google.com/research/NaturalQuestions

**License:** Open (CC BY-SA 3.0 for annotations).

**Quirks & gotchas:** Real queries are messy: typos, underspecified, sometimes unanswerable. Long-answer annotations (whole paragraphs) map naturally onto RAG chunking discussions.

**Used in:** Lab b4 alternative eval set.

---
### HotpotQA (2018)

**What:** 113K multi-hop questions requiring reasoning over two Wikipedia paragraphs, with supporting-fact labels telling you *which sentences* matter.

**Size:** ~113K questions (~600 MB)

**Get it:** https://hotpotqa.github.io/ (Hugging Face: `hotpot_qa`)

**License:** CC BY-SA 4.0.

**Quirks & gotchas:** The supporting-fact labels make it the best public dataset for practicing *multi-hop retrieval* and for demonstrating why single-hop top-k retrieval fails. Distractor setting is the cheap version; fullwiki is the realistic one.

**Used in:** Lab b4 extension; Mock 1 background.

---
### TriviaQA (2017)

**What:** ~95K trivia question-answer pairs, each paired with evidence documents (web + Wikipedia) — 650K question-evidence pairs.

**Size:** ~95K QA pairs; evidence ~few GB

**Get it:** https://nlp.cs.washington.edu/triviaqa/ (Hugging Face: `trivia_qa`)

**License:** Open (Apache 2.0 for the tooling; data for research).

**Quirks & gotchas:** Distantly-supervised pairing means some evidence documents don't actually contain the answer — a realistic 'retrieval succeeded, answer absent' failure mode.

**Used in:** Lab b4 extension.

---
### FEVER (2018)

**What:** 185,445 claims labeled SUPPORTS / REFUTES / NOT ENOUGH INFO against Wikipedia, with the evidence sentences for the labeled cases.

**Size:** ~185K claims (few hundred MB)

**Get it:** https://fever.ai/ (Hugging Face: `fever`)

**License:** Open (CC BY-SA / non-commercial check).

**Quirks & gotchas:** The canonical fact-verification dataset — the right vocabulary for RAG citation and 'prove your answer' features. Claim verification is a two-stage retrieval problem, just like RAG.

**Used in:** Reading for B.8; capstone cap1 extension.

---
