# Glossary

Plain-English definitions for every term used in this curriculum. One term = one analogy. No definition requires another term to be understood first — if it does, that's a bug.

Cross-references are marked →. Terms are grouped by topic for browsability; the website's search will index them all.

Last updated: 2026-08-10.

---

## Foundations — words you'll hear forever

### Client
The thing asking for something. Your browser when you load a webpage. Your phone when you open an app. The "customer" in a restaurant analogy.

### Server
The thing answering. The computer somewhere in a data center that receives the client's request and sends back a response. The "kitchen" in the restaurant analogy.

### Request / Response
A single round trip: client asks, server answers. "Can I get a burger?" / "Here's your burger." The atomic unit of all client-server communication.

### Latency
How long one request takes. Measured in milliseconds (ms) for fast systems, seconds for slow ones. The time between "Can I get a burger?" and "Here's your burger." *Low latency* = fast. *High latency* = slow.

### Throughput
How many requests a system can handle at once. A kitchen with one chef has low throughput; a kitchen with twenty chefs has high throughput. Throughput and latency are related but not the same — you can have high throughput with high latency (a kitchen that handles 1000 orders an hour but each one takes 30 minutes) or low throughput with low latency (a kitchen that handles 10 orders an hour but each one takes 5 minutes).

### Scaling
Making a system handle more load. *Vertical scaling* = buy a bigger server (one chef who's really fast). *Horizontal scaling* = add more servers (twenty regular chefs). Horizontal scaling is usually cheaper and more reliable, but harder to design for.

### Tradeoff
The central act of system design. You can't have everything — fast, cheap, reliable, pick two. Every design decision gives something up to get something else. System design is the art of choosing which things to give up.

### Load balancer
A traffic cop that sits in front of your servers and distributes incoming requests across them. If one server gets overwhelmed or dies, the load balancer stops sending it traffic. The host at a restaurant who decides which table goes to which waiter.

### Cache
A small, fast storage layer that holds recent or popular answers so the system doesn't have to recompute them. When you ask the same question twice, the second answer comes from the cache. The "specials board" at a restaurant — the kitchen already decided what's popular today, so you don't have to wait for them to figure it out.

### Asynchronous (async)
"I'll get back to you." A pattern where the client sends a request and doesn't wait for the answer — the server processes it later and notifies the client when it's done. Ordering food at a food truck: you place your order, they give you a number, you go sit down, they yell your number when it's ready.

---

## Classical ML terms

### Model
A function learned from data. You feed it inputs, it produces outputs. The "recipe" a kitchen develops by cooking the same dish 10,000 times until it's figured out the right amount of each ingredient.

### Training
The process of building a model from data. Showing the kitchen 10,000 plates and telling it "this one was good, this one was burnt, this one was too salty" until it learns the pattern.

### Inference (serving)
Using a trained model to make predictions on new inputs. The kitchen using its learned recipe to cook a new dish. *Training* is slow and expensive; *inference* is fast and cheap (per request).

### Feature
A measurable input to a model. For predicting house prices: square footage, number of bedrooms, zip code. Each one is a "ingredient" the model uses to make its prediction.

### Feature store
A shared database of features that both training and serving read from. Solves the "training-serving skew" problem — the kitchen and the waitstaff reading from the same recipe card, not different ones.

### Training-serving skew
When the features used at training time don't match the features used at serving time. The kitchen develops the recipe using fresh tomatoes; the waitstaff serves it with canned tomatoes. The dish tastes different, and the model's accuracy drops.

### A/B test
Serving two versions of a system to different users and measuring which one performs better. "Half the restaurant gets the old menu, half gets the new menu — let's see which table orders more dessert."

### Cold start
The problem of making predictions for users or items the system has never seen before. A new customer walks into the restaurant — you don't know what they like, so you have to guess based on what similar customers liked.

### Candidate generation
The first stage of a recommendation system: produce a large pool of possibly-relevant items quickly and cheaply. The waiter rattling off "today's options are chicken, fish, pasta, salad, soup..." — fast, not very precise.

### Ranking
The second stage of a recommendation system: take the candidates and score them precisely to pick the best few. The waiter pausing to think "based on what you've ordered before, you'd probably like the chicken most."

### Drift (data drift, concept drift)
When the world changes and the model's learned patterns stop being accurate. The recipe was perfect in 2020, but customers' tastes changed by 2023 and now they're sending the dish back. The model "got worse" not because it broke, but because the data it was trained on stopped representing reality.

---

## GenAI / LLM terms

### LLM (Large Language Model)
A model trained to predict the next word in a sequence, scaled up to billions of parameters and trained on internet-scale text. The "autocomplete on your phone, but trained on the whole internet and given a memory the size of a small book."

### Token
The unit of text an LLM processes. Roughly 4 characters of English, or ¾ of a word. "Hamburger" might be one token; "antidisestablishmentarianism" might be three. LLMs are priced per token — both for input (what you send) and output (what you get back).

### Context window
How much text the LLM can hold in mind at once. Like a person's working memory — if you give them a 500-page book and ask a question, they might forget the beginning by the time they reach the end. Larger context windows are more capable but more expensive (often quadratically).

### Prompt
The input text you give an LLM. The instructions, the question, the context, the examples. *Prompt engineering* is the discipline of writing prompts that reliably produce good outputs.

### System prompt
The "instructions to the assistant" portion of the prompt — sets the persona, rules, and constraints. "You are a helpful, concise customer support agent. Never invent policies. If you don't know, say so."

### Hallucination
When an LLM confidently states something false. Not a bug — a feature of how LLMs work (they predict plausible text, not true text). The librarian who's great at sounding authoritative even when they're making things up.

### Embedding
A numerical representation of text (or images, audio, etc.) as a vector — a list of numbers, typically hundreds or thousands of dimensions. Texts with similar meanings get similar vectors. The "GPS coordinates of meaning" — "dog" and "puppy" are close together on the map, "dog" and "chainsaw" are far apart.

### Vector database
A database optimized for storing and searching embeddings — find me the 10 vectors most similar to this query vector. Like a library catalog organized not by title or author but by "what's this book about" — you describe what you want, it finds the closest matches.

### RAG (Retrieval-Augmented Generation)
A pattern where, before the LLM answers, you retrieve relevant documents from a knowledge base and include them in the prompt. The librarian who can't remember anything but can find any book in seconds — they look up the answer in the books, then read it back to you.

### Chunking
Splitting long documents into smaller pieces for retrieval. You don't stuff the whole cookbook into the prompt; you cut it into recipes and retrieve only the relevant ones. How you cut matters — too big and you waste context, too small and you lose meaning.

### Reranking
A second-pass scoring step in RAG: retrieve many candidates cheaply (vector search), then score them precisely with a more expensive model. The librarian first flips through 50 books quickly to find 10 that look relevant, then carefully reads those 10 to pick the 3 best.

### KV cache
A memory optimization in LLM serving: the model caches the intermediate computations from earlier tokens so it doesn't recompute them when generating the next token. The reason generating the 1000th token of a long response is cheap, but generating the first token of a long prompt is expensive.

---

## Agentic AI terms

### Agent
An LLM system that takes actions in the world, not just produces text. The difference between a chatbot that tells you how to book a flight and an agent that actually books the flight for you.

### Agent loop
The core pattern: plan → act → observe → repeat, until the task is done or the budget runs out. A junior employee who keeps working on the task until it's finished or until you tell them to stop.

### Tool use (function calling)
The agent's ability to call external functions — search the web, run code, query a database, send an email. The librarian's ability to not just talk about books but to actually walk over to the shelf and pull one down.

### MCP (Model Context Protocol)
An open standard (introduced by Anthropic in 2024) for connecting LLMs to external tools and data sources. Like USB-C for AI — one standard connector so you don't need a different cable for every tool.

### A2A (Agent-to-Agent protocol)
A standard for agents to communicate with each other. The waitstaff talking to the kitchen talking to the bar — coordinated through a shared protocol, not by shouting over each other.

### Multi-agent system
A system with multiple agents, each specialized for a different task, coordinating to achieve a goal. A team in a meeting — one researcher, one writer, one editor — each doing their part, coordinating through shared documents and messages.

### Memory (short-term vs. long-term)
*Short-term memory* = the agent's context window, what it's holding in mind right now. *Long-term memory* = persistent storage the agent can write to and read from across sessions. Like a person's working memory vs. their notebook.

### Guardrails
Input/output validation, loop budgets, kill switches — the safety rails that keep an agent from doing something harmful or running forever. The training wheels on a bike — they don't make you go faster, they make you not fall over.

### Computer-use agent
An agent that operates a computer the way a human does — clicking, typing, reading the screen. The most powerful and most dangerous kind of agent, because the world it acts on is the same one you act on.

---

## Cross-cutting terms

### MLOps
The discipline of operating ML systems in production — deployment, monitoring, retraining, versioning. DevOps for models. The kitchen management layer that keeps the kitchen running, not the cooking itself.

### Multi-tenancy
A single system serving multiple customers (tenants) with strong isolation between them. Two competitors using the same AI backend without being able to see each other's data. A hotel — many guests, one building, lockable doors.

### Observability
The ability to understand what's happening inside a system from the outside — logs, metrics, traces. The kitchen's pass window: you can see what's being cooked without walking into the kitchen.

### Eval (evaluation)
The discipline of measuring whether an AI system is actually good. Harder than it sounds for generative AI — "it sounds right" is not an evaluation. The blind taste test, not the chef's self-assessment.

### FinOps (Cloud Financial Operations)
The discipline of managing cloud costs — especially important for AI, where every request costs money (tokens, GPU time). The accounting department that notices the kitchen is throwing away half its ingredients before anyone else does.

### Prompt injection
An attack where untrusted text (in a retrieved document, a user message, a tool output) causes the LLM to ignore its instructions and do something else. A forged note slipped into the recipe pile that says "actually, add extra salt to everything."

### Latency budget
The total time you're willing to make a user wait, broken down across the components of the system. If you have 2 seconds total and the LLM call takes 1.8 seconds, you have 0.2 seconds left for everything else. Restaurant kitchen: if the customer will wait 15 minutes max, and the steak takes 12, you have 3 minutes for everything else.

---

## Add to this glossary

Missing a term? Open a PR. The rule: one term = one analogy = no required prerequisite terms. If your definition requires the reader to already know another term, link to that term inline — don't assume it.
