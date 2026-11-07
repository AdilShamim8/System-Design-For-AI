# Track B — GenAI / LLM Labs

Eight labs covering the full LLM product surface — tokens, RAG, chunking, evaluation, caching, fine-tuning decisions, structured output, multimodal. All run on a CPU laptop; total API spend under $5 (or free with Ollama).

| # | Lab | Real dataset / source | Prereq chapters | Time |
|---|---|---|---|---|
| [b1](./lab-b1/) | Tokens, Latency, and Money | Published API prices | B.0, X.4 | 1–2 h |
| [b2](./lab-b2/) | RAG From Scratch | SQuAD | B.2, B.3 | 3–4 h |
| [b3](./lab-b3/) | Chunking Strategies, Measured | SEC 10-K filings | B.4 | 2–3 h |
| [b4](./lab-b4/) | Evaluate RAG Like You Mean It | SQuAD + LLM judge | B.8 | 2–3 h |
| [b5](./lab-b5/) | Semantic Caching and Cost Control | SQuAD query stream | B.6, X.4 | 2 h |
| [b6](./lab-b6/) | Fine-tune vs. RAG: The Decision Lab | IMDB | B.6 | 2–3 h |
| [b7](./lab-b7/) | Structured Outputs That Don't Break | Hostile corpus (yours) | B.1 | 2 h |
| [b8](./lab-b8/) | Multimodal Embeddings | Flickr8k | B.7 | 2–3 h |

**The arc:** b1 gives you the unit economics; b2–b4 build the RAG machine and its measurement; b5–b7 optimize it (cache, route, constrain); b8 extends it past text. This track is the employable core — [Mock 1, 4, 8](../../interview-prep/mock-interviews/) are all Track B designs.
