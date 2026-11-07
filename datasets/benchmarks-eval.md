> Every dataset in this catalog is real, public, and used (or usable) somewhere in this course's labs. Sizes and access notes are as of late 2026 — always check the source page before relying on a number. **Check each dataset's license before commercial use**; many research datasets are non-commercial.

# LLM Benchmarks & Evaluation Datasets

Chapter B.8 and Lab b4 are about *your* evals; these are the field's shared yardsticks. Rule: benchmarks tell you about the benchmark. They are a sanity check, not a product evaluation.

### MMLU (2021)

**What:** Multiple-choice questions across 57 subjects (STEM, humanities, law, medicine…), ~14K test questions; the default 'does this model know things' benchmark (with known contamination caveats).

**Size:** ~14K test questions (+ dev/validation sets)

**Get it:** https://github.com/hendrycks/test (Hugging Face: `cais/mmlu`)

**License:** Open for evaluation use (check per-subset).

**Quirks & gotchas:** Contamination (test items in training corpora) is the standing concern; newer variants (MMLU-Pro, MMLU-redux) exist to patch it. Four-choice format rewards guessing at 25% baseline.

**Used in:** Lab b4 background; B.6 model selection.

---
### MTEB (2022–)

**What:** Massive Text Embedding Benchmark: embedding models scored across task types (retrieval, classification, STS, reranking, clustering…) and 100+ languages. The reference leaderboard for 'which embedding model should I use?'

**Size:** 10+ task types, 100+ datasets, multilingual (harness runs the sweep)

**Get it:** https://github.com/embeddings-benchmark/mteb (leaderboard on Hugging Face)

**License:** Open (Apache 2.0 harness; per-dataset licenses).

**Quirks & gotchas:** Leaderboard winners on generic corpora are not guaranteed winners on your corpus — rerun a slice on your own data before committing (the BEIR lesson, applied to embeddings).

**Used in:** Lab b2/b3 model choice; Mock 7.

---
### TruthfulQA (2021)

**What:** 817 short questions designed to elicit 'imitative falsehoods' — common misconceptions models repeat because the internet repeats them.

**Size:** 817 questions (small)

**Get it:** https://github.com/sylinrl/TruthfulQA

**License:** Open (Apache 2.0).

**Quirks & gotchas:** The reference benchmark for the hallucination/misconception axis; tiny on purpose. GPT-judge (fine-tuned) is the standard grader — an early, citable example of LLM-as-judge.

**Used in:** B.8 reading; FN-04 companion.

---
### GSM8K (2021)

**What:** 8,500 grade-school math word problems (7,473 train / 1,319 test) requiring multi-step reasoning; answers with worked solutions.

**Size:** ~8.5K problems (small)

**Get it:** https://github.com/openai/grade-school-math

**License:** Open (MIT).

**Quirks & gotchas:** Small enough to memorize (contamination again). Chain-of-thought prompting was demonstrated on this dataset — a piece of history you can run on a laptop.

**Used in:** B.1 reading (prompting).

---
### HumanEval / MBPP (2021/2021)

**What:** HumanEval: 164 hand-written Python problems scored by unit tests (pass@k). MBPP: ~1,000 crowd-authored basic Python problems. The coding-ability pair.

**Size:** 164 + ~1,000 problems (small)

**Get it:** HumanEval: https://github.com/openai/human-eval; MBPP: https://huggingface.co/datasets/mbpp

**License:** Open (MIT).

**Quirks & gotchas:** Function-level only — says little about repo-scale agent coding (for that see SWE-bench). Unit-test scoring is the honest part: evaluation without a human judge.

**Used in:** Mock 5 background.

---
### Chatbot Arena / LMSYS (2023–)

**What:** Live crowdsourced pairwise battles between anonymous models on user prompts, converted to Elo-style ratings. Continuously updated.

**Size:** Millions of human votes (ongoing)

**Get it:** https://lmarena.ai/ (data: https://huggingface.co/datasets/lmsys/chatbot_arena_conversations)

**License:** Open (data for research).

**Quirks & gotchas:** Preference-of-real-users > accuracy-on-a-test for 'which model feels better', but subject to prompt-mix bias (heavy on casual/coding prompts). The *method* is the lesson: online, human, adversarial-resistant evaluation.

**Used in:** B.8; X.2 reading.

---
