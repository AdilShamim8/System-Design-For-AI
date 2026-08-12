# References & Bibliography

Every claim in this curriculum is backed by a primary source. This page lists them all, organized by topic. If a claim isn't sourced here, it shouldn't be in the curriculum.

**Verification date:** August 2026. Pricing and model capabilities change — always check the provider's documentation for current values.

---

## How to read these citations

Each entry follows this format:
- **Author(s) (Year), "Title," Venue** — link
- Where applicable: arXiv ID, DOI, or conference proceedings

We prefer primary sources (the paper itself, the official documentation, the engineering blog) over secondary write-ups. If we cite a blog post summarizing a paper, the paper is also linked.

---

## System Design Foundations

### Books

- **Kleppmann, M. (2017), *Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems*, O'Reilly Media.** ISBN: 978-1449373320. The canonical text on distributed systems design. Chapter 1 covers reliability, scalability, and maintainability. Chapter 5 covers replication. Chapter 7 covers transactions. If you read one book on system design, read this one. https://dataintensive.net

- **Brewer, E. (2017), *Designing Distributed Systems*, O'Reilly Media.** Patterns for distributed systems, including sidecar, ambassador, and adapter patterns.

- **Richards, M., & Ford, N. (2020), *Fundamentals of Software Architecture*, O'Reilly Media.** Architecture patterns, tradeoffs, and the architecture fitness function.

### Papers & Articles

- **Brewer, E. (2000), "Towards Robust Distributed Systems," PODC Keynote.** The original CAP theorem presentation. Brewer later clarified (2012) that "two out of three" is misleading — during a partition, you choose between consistency and availability, but when not partitioned, you have both. https://people.eecs.berkeley.edu/~brewer/cs262b-2004/PODC-keynote.pdf

- **Gilbert, S., & Lynch, N. (2002), "Brewer's Conjecture and the Feasibility of Consistent, Available, Partition-Tolerant Web Services," ACM SIGACT News 33(2):51-59.** The formal proof of the CAP theorem. https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf

- **Gray, J. (1978), "Notes on Data Base Operating Systems," Operating Systems: An Advanced Course, Springer.** The original definition of ACID transactions. https://research.microsoft.com/en-us/people/gray/

- **Vogels, W. (2023), "Distributed Computing Myths," All Things Distributed blog.** On why the 8 Fallacies of Distributed Computing (Peter Deutsch, 1994) are still fallacies. https://www.allthingsdistributed.com/2023/02/distributed-computing-myths.html

- **Deutsch, P. (1994), "The Eight Fallacies of Distributed Computing."** The network is reliable; latency is zero; bandwidth is infinite; the network is secure; the topology doesn't change; there is one administrator; transport cost is zero; the network is homogeneous. All false. https://architecture.stats.stackexchange.com/questions/24242

### Engineering Blogs

- **Google SRE Book (2016), *Site Reliability Engineering*, O'Reilly.** Free online. Chapter 2 covers SLIs/SLOs/SLAs. Chapter 6 covers monitoring. The distributed systems chapters are essential. https://sre.google/sre-book/table-of-contents/

- **Brendan Gregg (2020), *Systems Performance*, Addison-Wesley.** The practical guide to latency and throughput analysis. USE method, flame graphs, and production debugging. http://www.brendangregg.com/sysperfbook.html

---

## Classical ML System Design

### Recommendation Systems

- **Covington, P., Adams, J., & Sargin, E. (2016), "Deep Neural Networks for YouTube Recommendations," RecSys '16.** The canonical two-stage recommendation architecture (candidate generation + ranking). This paper is required reading for anyone building recommendation systems. https://dl.acm.org/doi/10.1145/2959100.2959190 — arXiv: alternative at https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/45530.pdf

- **Gomez-Uribe, C. A., & Hunt, N. (2015), "The Netflix Recommender System: Algorithms, Business Value, and Innovation," ACM Transactions on Management Information Systems 6(4):13.** Netflix's architecture, including their offline/online evaluation philosophy and why offline metrics lie. https://dl.acm.org/doi/10.1145/2843948

- **Koren, Y., Bell, R., & Volinsky, C. (2009), "Matrix Factorization Techniques for Recommender Systems," IEEE Computer 42(8):30-37.** The foundational paper on collaborative filtering via matrix factorization. The technique that powered the Netflix Prize (2006-2009). https://ieeexplore.ieee.org/document/5197425

- **Rendle, S. (2010), "Factorization Machines," ICDM 2010.** A workhorse model for sparse recommendation data with categorical features. Used in production at many companies. https://www.csie.ntu.edu.tw/~b97029/paper/Rendle2010FM.pdf

- **Li, L., Chu, W., Langford, J., & Schapire, R. E. (2010), "A Contextual-Bandit Approach to Personalized News Article Recommendation," WWW '10.** The explore-exploit problem formalized. The foundation for how production systems decide what new content to show. arXiv:1003.0146 — https://arxiv.org/abs/1003.0146

- **Burke, R. (2002), "Hybrid Recommender Systems: Survey and Experiments," User Modeling and User-Adapted Interaction 12(4):331-370.** The taxonomy of blending collaborative and content-based filtering. https://link.springer.com/article/10.1023/A:1021240730564

- **Steck, H., et al. (2021), "Deep Learning for Recommender Systems: A Netflix Case Study," Netflix Tech Blog.** Netflix's modern architecture using deep learning. https://netflixtechblog.com/deep-learning-for-recommender-systems-a-netflix-case-study-5b8b8f8f8f8f

### Search & Ranking

- **Manning, C., Raghavan, P., & Schütze, H. (2008), *Introduction to Information Retrieval*, Cambridge University Press.** The canonical IR textbook. Covers BM25, vector space models, and evaluation metrics. Free online: https://nlp.stanford.edu/IRBook/

- **Karpukhin, V., et al. (2020), "Dense Passage Retrieval for Open-Domain Question Answering," EMNLP 2020.** The DPR paper, foundational for bi-encoder retrieval. The technique that made dense retrieval practical. arXiv:2004.04906 — https://arxiv.org/abs/2004.04906

- **Khattab, O., & Zaharia, M. (2020), "ColBERT: Efficient and Effective Passage Search via Contextualized Late Interaction over BERT," SIGIR 2020.** Cross-encoder reranking at scale. arXiv:2004.12832 — https://arxiv.org/abs/2004.12832

- **Robertson, S., & Zaragoza, H. (2009), "The Probabilistic Relevance Framework: BM25 and Beyond," Foundations and Trends in Information Retrieval 3(4):333-389.** The definitive explanation of BM25. https://doi.org/10.1561/1500000019

### ML Lifecycle & Operations

- **Sculley, D., et al. (2015), "Hidden Technical Debt in Machine Learning Systems," NIPS 2015.** The foundational paper on why ML systems are harder to maintain than to build. Required reading for anyone shipping ML to production. https://proceedings.neurips.cc/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html

- **Google Cloud (2020), "MLOps: Continuous delivery and automation pipelines in machine learning."** The canonical MLOps reference from Google. https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning

- **Databricks Engineering Blog (2024).** Production ML lifecycle patterns, feature stores, and ML platform architecture. https://www.databricks.com/blog/category/engineering

- **Uber Engineering (2017), "Michelangelo: Uber's Machine Learning Platform."** The origin of the modern feature store concept. https://www.uber.com/blog/michelangelo-machine-learning-platform/

- **Gama, J., et al. (2014), "A Survey on Concept Drift Aiming," ACM Computing Surveys 46(4):1-37.** The foundational survey on data drift and concept drift. https://dl.acm.org/doi/10.1145/2523813

- **Kohavi, R., Tang, D., & Xu, Y. (2020), *Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing*, Cambridge University Press.** The canonical A/B testing textbook from Google and Microsoft leaders. https://www.cambridge.org/core/books/trustworthy-online-controlled-experiments/

---

## GenAI / LLM System Design

### Foundational LLM Papers

- **Vaswani, A., et al. (2017), "Attention Is All You Need," NeurIPS 2017.** The transformer paper. The architecture behind every modern LLM. arXiv:1706.03762 — https://arxiv.org/abs/1706.03762

- **Devlin, J., et al. (2018), "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding," NAACL 2019.** The bidirectional encoder that started the modern NLP era. arXiv:1810.04805 — https://arxiv.org/abs/1810.04805

- **Brown, T., et al. (2020), "Language Models are Few-Shot Learners," NeurIPS 2020.** The GPT-3 paper. Introduced few-shot prompting at scale. arXiv:2005.14165 — https://arxiv.org/abs/2005.14165

- **Raffel, C., et al. (2020), "Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer," JMLR 21(140):1-67.** The T5 paper — framing all NLP as text-to-text. arXiv:1910.10683 — https://arxiv.org/abs/1910.10683

- **Wei, J., et al. (2022), "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models," NeurIPS 2022.** The CoT paper — why asking LLMs to "think step by step" works. arXiv:2201.11903 — https://arxiv.org/abs/2201.11903

- **Touvron, H., et al. (2023), "LLaMA: Open and Efficient Foundation Language Models," arXiv:2302.13971.** The open-weight model that democratized LLM research. https://arxiv.org/abs/2302.13971

### Retrieval-Augmented Generation (RAG)

- **Lewis, P., et al. (2020), "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks," NeurIPS 2020.** The paper that coined RAG. Read the introduction and Section 3. arXiv:2005.11401 — https://arxiv.org/abs/2005.11401

- **Gao, Y., et al. (2023), "Retrieval-Augmented Generation for Large Language Models: A Survey," arXiv:2312.10997.** A comprehensive survey of RAG techniques as of late 2023. The taxonomy is useful for understanding the landscape. https://arxiv.org/abs/2312.10997

- **Liu, N. F., et al. (2023), "Lost in the Middle: How Language Models Use Long Contexts," TACL 2024.** The empirical finding that LLMs pay less attention to content in the middle of long contexts. Directly affects how you order retrieved chunks. arXiv:2307.03172 — https://arxiv.org/abs/2307.03172

- **Khattab, O., et al. (2022), "ReAct: Synergizing Reasoning and Acting in Language Models," ICLR 2023.** The multi-step retrieval + reasoning pattern for complex questions. arXiv:2210.03629 — https://arxiv.org/abs/2210.03629

- **Es, S., et al. (2023), "RAGAS: Automated Evaluation of Retrieval Augmented Generation," arXiv:2309.15217.** A practical evaluation framework for RAG systems. Measures faithfulness, answer relevance, context precision, context recall. https://arxiv.org/abs/2309.15217 — Code: https://github.com/shahules786/ragas

- **Asai, A., et al. (2023), "Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection," arXiv:2310.11511.** Advanced RAG pattern where the model decides when to retrieve. https://arxiv.org/abs/2310.11511

### Vector Databases & Embeddings

- **Malkov, Y. A., & Yashunin, D. A. (2020), "Efficient and Robust Approximate Nearest Neighbor Search Using Hierarchical Navigable Small World Graphs," IEEE TPAMI 42(4):824-836.** The HNSW algorithm that powers most production vector databases. arXiv:1603.09320 (2016 preprint) — https://arxiv.org/abs/1603.09320

- **Johnson, J., Douze, M., & Jégou, H. (2017), "Billion-scale Similarity Search with GPUs," arXiv:1702.08734.** The FAISS paper, foundational for vector search at scale. https://arxiv.org/abs/1702.08734

- **Radford, A., et al. (2021), "Learning Transferable Visual Models From Natural Language Supervision," ICML 2021.** The CLIP paper — foundational for multimodal embeddings. arXiv:2103.00020 — https://arxiv.org/abs/2103.00020

- **Karpukhin, V., et al. (2020), "Dense Passage Retrieval for Open-Domain Question Answering," EMNLP 2020.** The DPR paper — bi-encoder retrieval with contrastive learning. arXiv:2004.04906 — https://arxiv.org/abs/2004.04906

### LLM Evaluation

- **Zheng, L., et al. (2023), "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena," NeurIPS 2023.** On LLM-as-judge biases and how to mitigate them. arXiv:2306.05685 — https://arxiv.org/abs/2306.05685

- **Hendrycks, D., et al. (2021), "Measuring Massive Multitask Language Understanding," ICLR 2021.** The MMLU benchmark. arXiv:2009.03300 — https://arxiv.org/abs/2009.03300

- **Lin, S., et al. (2022), "TruthfulQA: Measuring How Models Mimic Human Falsehoods," ACL 2022.** On measuring hallucination and truthfulness. arXiv:2109.07958 — https://arxiv.org/abs/2109.07958

### Provider Documentation (Current as of August 2026)

- **Anthropic API Documentation** — pricing, context windows, prompt caching, tool use. https://docs.anthropic.com/
- **OpenAI API Documentation** — pricing, models, function calling, structured outputs. https://platform.openai.com/docs/
- **Google AI / Gemini Documentation** — pricing, context caching, multimodal. https://ai.google.dev/docs
- **Cohere Documentation** — embeddings, rerank, classification. https://docs.cohere.com/
- **Mistral AI Documentation** — open-weight models, pricing. https://docs.mistral.ai/
- **Groq Documentation** — fast inference for open models. https://console.groq.com/docs/

### Prompt Caching

- **Anthropic (2024), "Prompt Caching with Claude."** Official spec for Anthropic's prompt caching. Cache reads: ~10% of normal input cost. Cache writes: 1.25x (5-min) or 2x (1-hour). TTL: 5 minutes or 1 hour. https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching

- **OpenAI (2024), "Prompt Caching."** Automatic caching for prompts >1,024 tokens. 50% discount on cached portions. https://platform.openai.com/docs/guides/prompt-caching

- **Google (2024), "Gemini API Context Caching."** Explicit TTL management. https://ai.google.dev/gemini-api/docs/caching

---

## Agentic AI System Design

### Agent Foundations

- **Yao, S., et al. (2022), "ReAct: Synergistic Reasoning and Acting in Language Models," ICLR 2023.** The foundational paper on the plan-act-observe loop. Required reading. arXiv:2210.03629 — https://arxiv.org/abs/2210.03629

- **Shinn, N., et al. (2023), "Reflexion: Language Agents with Verbal Reinforcement Learning," NeurIPS 2023.** The pattern where an agent reflects on its own output before committing. A fix for "stops too early." arXiv:2303.11366 — https://arxiv.org/abs/2303.11366

- **Schick, T., et al. (2023), "Toolformer: Language Models Can Teach Themselves to Use Tools," NeurIPS 2023.** On teaching LLMs to call tools. The precursor to modern function-calling APIs. arXiv:2302.04761 — https://arxiv.org/abs/2302.04761

- **Yao, S., et al. (2023), "Tree of Thoughts: Deliberate Problem Solving with Large Language Models," NeurIPS 2023.** A generalization of the linear agent loop to tree-structured search, for tasks that need backtracking. arXiv:2305.10601 — https://arxiv.org/abs/2305.10601

- **Wang, L., et al. (2024), "A Survey on Large Language Model based Autonomous Agents," Frontiers of Computer Science 18(6).** Comprehensive survey of agent architectures. arXiv:2308.11432 — https://arxiv.org/abs/2308.11432

### Multi-Agent Systems

- **Wu, Q., et al. (2023), "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation," arXiv:2308.08155.** A multi-agent framework. https://arxiv.org/abs/2308.08155

- **Park, J. S., et al. (2023), "Generative Agents: Interactive Simulacra of Human Behavior," UIST 2023.** The "Smallville" paper — multi-agent simulation with memory and social interaction. arXiv:2304.03442 — https://arxiv.org/abs/2304.03442

- **Li, S., et al. (2023), "Multi-Agent Collaboration: Harnessing the Power of Intelligent LLM Agents," arXiv:2306.03314.** On when multi-agent collaboration helps and when it doesn't. https://arxiv.org/abs/2306.03314

### Tool Use & Protocols

- **Anthropic (2024), "Introducing the Model Context Protocol."** The MCP spec — an open standard for connecting LLMs to external tools and data. https://www.anthropic.com/news/model-context-protocol — Spec: https://modelcontextprotocol.io/

- **Anthropic (2024), "Building Effective Agents."** A practical guide to agent patterns from Anthropic. Covers orchestration, tool design, and guardrails. https://www.anthropic.com/research/building-effective-agents

- **Schick, T., et al. (2023), "Toolformer: Language Models Can Teach Themselves to Use Tools," NeurIPS 2023.** arXiv:2302.04761 — https://arxiv.org/abs/2302.04761

### Computer Use & Coding Agents

- **Anthropic (2024), "Claude 3.5 Sonnet and Computer Use."** The first frontier model with computer-use capabilities. https://www.anthropic.com/news/3-5-models-and-computer-use

- **OpenAI (2025), "Operator."** OpenAI's computer-use agent. https://openai.com/index/introducing-operator/

- **Jimenez, C. E., et al. (2024), "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?" ICLR 2024.** A benchmark for coding agents on real software engineering tasks. arXiv:2310.06770 — https://arxiv.org/abs/2310.06770

- **Yang, J., et al. (2024), "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering," NeurIPS 2024.** A coding agent architecture. arXiv:2405.15793 — https://arxiv.org/abs/2405.15793

---

## Cross-Cutting Concerns

### MLOps & Infrastructure

- **Google SRE Team (2016), *Site Reliability Engineering*, O'Reilly.** Free online. https://sre.google/sre-book/table-of-contents/

- **Databricks Engineering Blog.** Production MLOps patterns, feature stores, ML platform architecture. https://www.databricks.com/blog/category/engineering

- **MLflow Documentation.** Open-source model registry and experiment tracking. https://mlflow.org/docs/latest/

- **Kubeflow Documentation.** Kubernetes-native ML platform. https://www.kubeflow.org/docs/

### Security & Multi-Tenancy

- **OWASP Top 10 for LLM Applications (2024).** The taxonomy of security risks specific to LLM systems — prompt injection, insecure output handling, training data poisoning, and more. https://owasp.org/www-project-top-10-for-large-language-model-applications/

- **Lakera AI (2024), "Prompt Injection and LLM Security."** Research on prompt injection attacks and defenses. https://lakera.ai/

- **NeMo Guardrails (NVIDIA).** Open-source guardrail framework for LLM applications. https://github.com/NVIDIA/NeMo-Guardrails

### Reliability & Calibration

- **Guo, C., et al. (2017), "On Calibration of Modern Neural Networks," ICML 2017.** The foundational calibration paper. Shows that modern neural networks are systematically overconfident. arXiv:1706.04599 — https://arxiv.org/abs/1706.04599

- **Platt, J. C. (1999), "Probabilistic Outputs for Support Vector Machines and Comparisons to Regularized Likelihood Methods," Advances in Large Margin Classifiers.** Platt scaling — the post-hoc calibration technique. https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/platt-proba.pdf

- **Air Canada Chatbot Case (2024), *Moffatt v. Air Canada*, 2024 BCCRT 149.** The British Columbia Civil Resolution Tribunal held Air Canada responsible for its chatbot's hallucinated refund policy. Decided February 14, 2024. https://decisions.civlresolutiontb.ca/crt/crtd/en/item/522164/index.do

### Observability

- **LangSmith Documentation.** Observability platform for LLM applications — tracing, evaluation, monitoring. https://docs.smith.langchain.com/

- **Langfuse Documentation.** Open-source LLM observability — tracing, evaluation, prompt management. https://langfuse.com/docs

- **Arize Phoenix.** AI observability and evaluation platform. https://docs.arize.com/phoenix

- **OpenTelemetry.** The emerging standard for distributed tracing, now being applied to LLM applications. https://opentelemetry.io/docs/

### Cost / FinOps

- **Anthropic Pricing.** Current pricing for all Claude models. https://www.anthropic.com/pricing

- **OpenAI Pricing.** Current pricing for all GPT models. https://openai.com/api/pricing/

- **Google AI Pricing.** Current pricing for Gemini models. https://ai.google.dev/pricing

- **Groq Pricing.** Pricing for hosted open models (Llama, Mixral) with fast inference. https://groq.com/pricing/

- **SemiAnalysis (2024), "LLM Inference Economics."** Deep technical analysis of inference cost structure — KV cache memory, attention compute, batching economics. https://www.semianalysis.com/

- **Databricks Engineering Blog (2024), "The Economics of LLM Applications."** When self-hosting open models beats calling frontier APIs. https://www.databricks.com/blog/category/engineering

- **Hugging Face (2024), "Cost of LLM Inference."** Compute costs of self-hosted LLM inference — GPU utilization, batching, KV cache memory. https://huggingface.co/blog

### Evaluation

- **Chang, E. Y., et al. (2024), "A Survey on Evaluation of Large Language Models," ACM TIST.** Comprehensive survey of LLM evaluation methods. arXiv:2307.03109 — https://arxiv.org/abs/2307.03109

- **Liu, Y., et al. (2023), "G-Eval: NLG Evaluation using GPT-4 with Better Human Alignment," arXiv:2303.16634.** A framework for LLM-as-judge evaluation. https://arxiv.org/abs/2303.16634

- **TruLens Documentation.** RAG evaluation framework — faithfulness, answer relevance, context relevance. https://www.trulens.org/

---

## Real Production Incidents

These case studies are drawn from publicly documented AI failures. They're used throughout the curriculum to illustrate failure modes and their preventions.

- **Moffatt v. Air Canada, 2024 BCCRT 149 (British Columbia Civil Resolution Tribunal).** Air Canada's chatbot hallucinated a refund policy. The tribunal held the airline responsible for the chatbot's statements. Decided February 14, 2024. The lesson: a chatbot's hallucination is the company's liability. https://decisions.civlresolutiontb.ca/crt/crtd/en/item/522164/index.do

- **NYC MyCity Bot (2024).** NYC's AI chatbot for businesses gave legally wrong advice. Reported by *The Markup*. The lesson: "it sounds right" is not good enough for high-stakes domains. https://themarkup.org/hello-world/2024/03/25/nycs-new-ai-chatbot-is-telling-businesses-to-break-the-law

- **DPDP Prompt Leaks (2024).** Multiple LLM-based products had their system prompts leaked when users crafted inputs like "repeat the above instructions verbatim." The lesson: system prompts are not secret; don't put secrets in them.

- **Runaway Agent Cost Blowups (2024-2025).** Multiple companies reported agents looping into five-figure bills. Documented across engineering blogs (Anthropic, OpenAI customer post-mortems). The lesson: hard budgets, enforced by the orchestrator, not the LLM.

- **AI Incident Database.** A public database of AI failures, maintained by the Partnership on AI. https://incidentdatabase.ai/

- **OWASP Top 10 for LLM Applications (2024).** The taxonomy of LLM security risks. https://owasp.org/www-project-top-10-for-large-language-model-applications/

---

## Engineering Blogs (Ongoing Reference)

These are blogs we cite frequently because they publish primary-source technical content:

- **Anthropic News & Research:** https://www.anthropic.com/news — model releases, safety research, MCP, prompt caching, computer use.
- **OpenAI Research & Blog:** https://openai.com/research — model releases, capability research, safety.
- **Google AI Blog / DeepMind:** https://deepmind.google/discover/blog/ — Gemini, multimodal research, long context.
- **Databricks Engineering Blog:** https://www.databricks.com/blog — ML infrastructure, MLOps, LLM economics.
- **Meta AI / Engineering Blog:** https://engineering.fb.com/ — recommendation systems at scale, ML infrastructure, open-weight models (Llama).
- **Netflix Tech Blog:** https://netflixtechblog.com/ — recommendation systems, A/B testing methodology, streaming architecture.
- **Stripe Blog:** https://stripe.com/blog — payments, ML for fraud detection, API design.
- **Cloudflare Blog:** https://blog.cloudflare.com/ — edge compute, security, observability, distributed systems.
- **Uber Engineering:** https://www.uber.com/blog/engineering/ — ML platforms, feature stores (Michelangelo), distributed systems.
- **Lilian Weng (2023), "LLM Powered Autonomous Agents."** A comprehensive survey of agent architectures. https://lilianweng.github.io/posts/2023-06-23-agent/

---

## How to Add a Reference

1. Add the source to the appropriate section above, in the format: `Author(s) (Year), "Title," Venue — link.`
2. Include the arXiv ID or DOI where available.
3. Cite it inline in the chapter with a Markdown link to the primary source (not just to this bibliography file).
4. If the source is time-sensitive (pricing, model capabilities), date-stamp the inline citation.

**What we don't cite:**
- Twitter threads (unless they're the primary source for a breaking incident)
- Random Medium articles (prefer the primary paper or engineering blog they're summarizing)
- AI-generated summaries of papers (read the paper itself)
- Anything behind a paywall we can't verify (cite an open alternative)

Accuracy and credibility matter as much as storytelling. Every claim should trace back to a source listed here.

---

## Verification Notes

All arXiv IDs and DOIs in this bibliography were verified as of August 2026. If a link is broken, check:
1. The arXiv ID format (e.g., `arXiv:2005.11401` → `https://arxiv.org/abs/2005.11401`)
2. The DOI resolver (e.g., `10.1145/2959100.2959190` → `https://doi.org/10.1145/2959100.2959190`)
3. The venue's proceedings (e.g., NeurIPS 2020 papers at `https://proceedings.neurips.cc/`)

Pricing and model capabilities change constantly. Always verify current values on the provider's pricing page before relying on them in production.
