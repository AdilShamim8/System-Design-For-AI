# GenAI / LLM System Design — Question Bank

Practice scenarios for GenAI system design: RAG, multi-tenant SaaS, chat, multimodal, cost redesign.

---

## Q-GEN-1 — The Law Firm's Hallucinating Bot

**Scenario:** A law firm deploys an internal research assistant built on RAG over a corpus of 50,000 legal documents. Lawyers report it confidently cites cases that don't exist. The engineering team has spent three weeks tuning the LLM's system prompt to "only answer from the context" with no improvement. The head partner is threatening to pull the plug.

**Track:** genai
**Difficulty:** hard
**Read first:** [B.2 The Librarian Who Never Forgets](../02-genai-system-design/b2-the-librarian-who-never-forgets.md), [B.4 Splitting Knowledge Without Losing It](../02-genai-system-design/b4-splitting-knowledge-without-losing-it.md), [B.8 "It Sounds Right" Is Not Good Enough](../02-genai-system-design/b8-it-sounds-right-is-not-good-enough.md)

**Your task:** Diagnose the problem. What's probably causing the hallucinations? What do you fix first?

---

### Worked answer (how a story-taught learner would reason through this)

A story-taught learner remembers the central lesson of B.2: **if retrieval misses the right chunk, generation cannot recover.** Three weeks of prompt tuning is the wrong lever. The problem is almost certainly upstream of the LLM.

**Diagnose first.** Pick 20 questions where the bot hallucinated. For each one, look at what chunks were actually retrieved. The likely finding: the retrieval is returning the wrong chunks, or no chunks, or chunks that don't contain the answer. The LLM, given an empty or irrelevant context, falls back on its training data — which, for legal cases, includes a lot of plausible-sounding but fabricated case names. That's not a prompt problem; that's a retrieval problem.

**Check the chunking.** Per B.4, chunking is the highest-leverage and most under-discussed RAG decision. Legal documents are heavily structured (statute → section → subsection, case → holdings → dicta). If the chunking is fixed-size (every 500 words), it's almost certainly splitting legal reasoning mid-thought. Switch to structural chunking at section boundaries. This alone often fixes 50% of hallucinations.

**Check the embedding model.** Is it a general-purpose embedding (OpenAI, Cohere) or one fine-tuned on legal text? General-purpose embeddings often miss legal-specific vocabulary and citation patterns. A legal embedding model (or even just better chunk metadata — jurisdiction, year, case name) can dramatically improve retrieval precision.

**Check the reranking.** Per B.5, a cross-encoder reranker on top-50 retrieved chunks is a 5-10% quality improvement for 50ms. If the system isn't reranking, add it.

**Only then touch the LLM.** If retrieval is good and hallucinations persist, *then* tune the system prompt — but tune it specifically: "If the context does not contain a case citation matching the user's query, respond with 'I couldn't find relevant cases in the corpus.' Do not generate case names." Make the failure mode explicit.

**Build the eval.** Per B.8, "sounds right" isn't enough. Build a regression suite of 100 known-good legal questions with known-correct citations. Run it on every change. The hallucination rate is a metric; track it.

---

## Q-GEN-2 — The Multi-Tenant SaaS Launch

**Scenario:** You're launching a B2B AI SaaS that lets enterprise customers upload their internal documents and query them via RAG. You have 5 launch customers, each expecting strict data isolation — Customer A's documents must never influence answers for Customer B. You have 8 weeks to launch.

**Track:** genai
**Difficulty:** hard
**Read first:** [B.2 The Librarian Who Never Forgets](../02-genai-system-design/b2-the-librarian-who-never-forgets.md), [B.3 The Index That Speaks in Numbers](../02-genai-system-design/b3-the-index-that-speaks-in-numbers.md), [X.1 Two Competitors, One Backend](../04-cross-cutting/x1-two-competitors-one-backend.md)

**Your task:** Design the architecture. How do you isolate tenants? What's the simplest thing that works for 5 customers, and what would you change at 500?

---

### Worked answer

The story-taught learner starts with the isolation requirement and works backward.

**The simplest isolation: one vector index per tenant.** Each customer gets their own vector index (or their own namespace within a multi-tenant vector DB like Pinecone). Queries are tagged with tenant_id; retrieval only searches that tenant's index. There is no path by which Customer A's vectors can appear in Customer B's retrieval. This is the strongest isolation and the simplest to reason about. For 5 tenants, this is trivially cheap.

**The shared model, private data pattern:** per X.1, you use the same LLM for all tenants (you're not fine-tuning per customer), but the *retrieved context* is what makes the answer tenant-specific. The LLM never sees another tenant's data because the retrieval never returns it. This is the standard multi-tenant RAG pattern.

**What you'd build for 5 tenants:**

- One vector DB (Pinecone or pgvector), one index per tenant.
- One shared LLM endpoint, with tenant_id passed for logging and rate-limiting.
- One ingestion pipeline that takes a document upload, chunks it, embeds it, writes to the right tenant's index.
- One query pipeline that takes a question + tenant_id, retrieves from the tenant's index, builds the prompt, calls the LLM, returns the answer.

**What you'd change at 500 tenants:**

- The per-tenant-index pattern still works, but operationally it gets heavy. Consider namespace-based isolation within a single index (Pinecone supports this) rather than 500 separate indexes.
- Add tenant-level cost attribution: each query's token consumption is logged per tenant, so you can bill (or at least attribute) accurately.
- Add tenant-level quality monitoring: per X.3, drift and quality metrics should be tracked per tenant, not just globally. One tenant's data going stale shouldn't be hidden in the aggregate.
- Add per-tenant rate limiting and abuse protection: per X.4, free-tier abuse is existential in AI SaaS. Per-tenant limits prevent one customer from blowing up the bill.

**The 8-week timeline:** the simplest isolation is also the fastest to build. Don't over-engineer. Ship the per-tenant-index version, monitor it, and let the architecture evolve as tenant count grows.

---

## Q-GEN-3 — The Chat Product That Drowns in Context

**Scenario:** Your team chat product added an AI assistant six months ago. Users love it, but as conversations get longer (50+ turns), the assistant gets slower and starts "forgetting" things said earlier in the conversation. Token costs per conversation have tripled. The product team wants the assistant to "remember better" without saying what that means.

**Track:** genai
**Difficulty:** medium
**Read first:** [B.0 The Box That Predicts the Next Word](../02-genai-system-design/b0-the-box-that-predicts-the-next-word.md), [C.4 The Memory That Forgets on Purpose](../03-agentic-system-design/c4-the-memory-that-forgets-on-purpose.md), [X.4 The Bill Nobody Warned You About](../04-cross-cutting/x4-the-bill-nobody-warned-you-about.md)

**Your task:** What's actually happening? Design the fix.

---

### Worked answer

The story-taught learner recognizes two intertwined problems: context window overflow and token cost growth. Both have the same root cause — the system is sending the *entire conversation history* on every turn.

**What's happening:** per B.0, the LLM's context window is finite. A 50-turn conversation at ~200 tokens per turn (input + output) is 10,000 tokens of history, plus the system prompt. As conversations grow, you approach the context limit, the LLM starts paying less attention to early turns (the "lost in the middle" problem), and every turn costs more tokens because you're sending more history. The assistant isn't "forgetting" — it's reading the full history but attending poorly to the early parts. And the bill is growing linearly with conversation length.

**The fix — summarization:** per C.4's memory strategies, implement conversation summarization. After every N turns (say, 10), summarize the conversation so far and replace the full history with: [summary of turns 1-10] + [verbatim turns 11-current]. This keeps the context size bounded, keeps the recent turns verbatim (where precision matters most), and compresses the old turns into a summary (where gist is enough). Token cost per turn stops growing.

**The fix — sliding window:** simpler than summarization. Keep only the last K turns verbatim, drop everything older. Cheaper, but loses long-term context entirely. Good for casual chat; bad for technical conversations where early details matter.

**The fix — external memory:** per C.4, for conversations that genuinely need long-term memory (a coding assistant that should remember the project structure across sessions), write important facts to an external memory store and retrieve them on demand. This is the most expensive to build but the most capable.

**Cost fix — prompt caching:** per X.4, if the system prompt is stable (it should be), enable prompt caching for a 90% discount on that portion. This doesn't fix the history-growth problem, but it makes the per-turn cost baseline much lower.

**What to ship first:** summarization + prompt caching. Both are cheap to implement and address the biggest problems. External memory is a v2.

---

## Q-GEN-4 — The Multimodal Cost Cliff

**Scenario:** Your content moderation system processes user-uploaded images and text captions. The current pipeline transcribes nothing — it sends both image and text directly to a multimodal LLM for classification (safe / unsafe / borderline). The bill last month was $80,000. The CFO has questions.

**Track:** genai
**Difficulty:** hard
**Read first:** [B.6 Picking the Brain You Can Afford](../02-genai-system-design/b6-picking-the-brain-you-can-afford.md), [B.7 Beyond Text](../02-genai-system-design/b7-beyond-text.md), [X.4 The Bill Nobody Warned You About](../04-cross-cutting/x4-the-bill-nobody-warned-you-about.md)

**Your task:** Redesign the pipeline for 1/10th the cost without sacrificing moderation quality.

---

### Worked answer

The story-taught learner recognizes the pattern from B.7: **multimodal calls are 5-50x more expensive than text calls.** Sending every image to a multimodal LLM is the cost cliff. The fix is to route by modality and by difficulty.

**Step 1 — modality routing.** Most content moderation decisions can be made on text alone (the caption is the giveaway). Run a cheap text-only model first. If it's confident (safe or unsafe with high probability), skip the image entirely. Only fall through to the multimodal model when the text is ambiguous or borderline. This typically eliminates 60-70% of multimodal calls.

**Step 2 — difficulty routing.** Of the 30-40% that need the image, many are still easy (a clearly safe image with an ambiguous caption, or vice versa). Use a small, cheap multimodal model (Haiku-class with vision) for the easy cases. Reserve the expensive frontier multimodal model for the genuinely hard cases — maybe 5-10% of total volume.

**Step 3 — caching.** Per X.4, content moderation has high duplicate rates (users repost the same image, bots spam the same content). Implement a hash-based cache for exact duplicates and a semantic cache for near-duplicates. Another 20-30% reduction.

**Step 4 — confidence thresholds.** Only auto-act on high-confidence decisions. Borderline cases go to human review. This isn't just a quality measure — it's a cost measure, because the expensive model is being asked to make fewer decisions.

**The expected result:** $80,000 → ~$8,000. The frontier multimodal model is now used for ~5% of volume instead of 100%. Quality is preserved because the cases that need the frontier model still get it; the cases that don't, don't.

**The deeper lesson:** the original pipeline treated "multimodal" as a single thing. The redesign treats it as a spectrum — text-only, cheap multimodal, expensive multimodal — and routes accordingly. This is the pattern from B.6 applied at the modality level.

---

## Q-GEN-5 — The RAG Platform That Doesn't Scale

**Scenario:** Your team built a RAG proof-of-concept over 10,000 internal documents. It works well. The business now wants to scale it to 5 million documents and 10,000 daily users. The current system retrieves top-5 chunks via brute-force vector comparison in memory, and the LLM call takes 3 seconds. You have 6 weeks.

**Track:** genai
**Difficulty:** hard
**Read first:** [B.2 The Librarian Who Never Forgets](../02-genai-system-design/b2-the-librarian-who-never-forgets.md), [B.3 The Index That Speaks in Numbers](../02-genai-system-design/b3-the-index-that-speaks-in-numbers.md), [B.5 The Second Pair of Eyes](../02-genai-system-design/b5-the-second-pair-of-eyes.md), [X.4 The Bill Nobody Warned You About](../04-cross-cutting/x4-the-bill-nobody-warned-you-about.md)

**Your task:** What breaks at 500x scale? What's the migration plan?

---

### Worked answer

The story-taught learner maps each component to its scaling limit.

**What breaks:**

1. *Brute-force vector search* — works at 10K vectors, dies at 5M. Per B.3, you need an ANN index (HNSW or IVF). Latency goes from O(N) to O(log N). This is the biggest fix.
2. *In-memory storage* — 5M vectors × 1,536 dimensions × 4 bytes = ~30 GB. Doesn't fit in a single machine's RAM. Move to a proper vector database (Pinecone, Weaviate, pgvector with appropriate indexing).
3. *LLM latency* — 3 seconds is fine for one user, painful for 10,000 concurrent. Per X.4, add prompt caching (cuts input cost 90%), add semantic caching (cuts 40-60% of repeated queries), and consider model routing (easy queries to a small model).
4. *Ingestion pipeline* — at 5M documents, re-embedding on every update is a multi-hour batch job. Build an incremental pipeline that re-embeds only changed documents.
5. *Quality at scale* — brute-force search is exact; ANN is approximate. You'll lose a small amount of recall. Add reranking (per B.5) to recover it.

**The migration plan (6 weeks):**

- *Week 1-2:* Stand up the vector database. Migrate the 10K existing vectors. Validate that retrieval quality is unchanged.
- *Week 3-4:* Build the batch ingestion pipeline for the remaining 5M documents. Embed and index in parallel. Validate quality on a sample.
- *Week 5:* Add reranking (cross-encoder on top-50, return top-5). Add prompt caching. Add semantic caching.
- *Week 6:* Load test at 10,000 concurrent users. Tune. Ship.

**The deeper move:** don't try to scale the proof-of-concept architecture. Replace it. Brute-force in-memory search is the right choice at 10K vectors — it's simple, exact, and fast enough. At 5M, it's the wrong choice on every axis. The architecture isn't "the same thing, bigger" — it's a different architecture, chosen for the new scale.

---

*More questions coming as the curriculum grows. Want to add one? See [CONTRIBUTING.md](../CONTRIBUTING.md#5-add-a-question-to-the-question-bank).*
