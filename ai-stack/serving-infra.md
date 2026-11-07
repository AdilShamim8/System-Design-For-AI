> Reference landscape, current as of **late 2026**. Tools change; the *categories* and the selection questions are durable. Every file leads with the questions you should ask before picking anything in its category.


# Serving and Inference Infrastructure

## When this file matters

API calls cover most products (see [models-and-providers.md](./models-and-providers.md)). Self-hosted inference enters when: **volume economics** (Lab b6's break-even — roughly when per-token API spend exceeds GPU amortization), **data can't leave** (regulated, on-prem), **latency at the edge** (co-located with features), or **control** (fine-tunes, exotic configs).

## The engines (open weights serving)

| Engine | The shape | Known for |
|---|---|---|
| **vLLM** | the default high-throughput engine | PagedAttention, continuous batching; the p99 story |
| **TGI** (Hugging Face) | solid, simple, HF-native | ease of setup; Docker-first |
| **Triton Inference Server** (NVIDIA) | multi-framework, ensemble serving | GPUs, model pipelines, production NVIDIA shops |
| **BentoML** | package-and-ship any model as a service | the deployment ergonomics layer |
| **Ray Serve / Ray** | distributed scaling beyond one box | multi-node, composed ML systems |
| **Ollama / llama.cpp** | laptop-class local inference | dev loops, privacy, the course's free-tier option |

**The concepts that actually decide your throughput** (any engine): *continuous batching* (requests join a running batch instead of waiting), *KV-cache reuse* (prefix caching — why system prompts are nearly free on modern engines), and *quantization* (below). If you can explain those three, you can whiteboard self-hosted inference.

## Quantization in one paragraph

Weights shrink: fp16 → 8-bit (GPTQ/AWQ-class) → 4-bit (GGUF Q4/AWQ) with modest quality cost and large VRAM/speed wins — the enabling technology for "8B on a laptop" and "70B on one A100." The quality cost is task-dependent (measure on *your* b4 eval set; benchmark averages hide domain pain). Rule of thumb: 4-bit is where you prototype, 8-bit is often where production lands for small models.

## The ops you're signing up for

Model artifacts and versioning (a1's `model.joblib` lesson, scaled up), health/readiness (x3's warm-up probes), autoscaling on *queue depth* not CPU (GPU boxes idle hot), rollout (A.6's shadow/canary — models are stateful-ish), and monitoring *token throughput and KV-cache hit rate* alongside latency. This is a platform team's job description; a lone engineer can run one box well (Lab b1's Ollama path) but should not pretend a cluster is free.

**Read next:** [gpu-compute.md](./gpu-compute.md) for the hardware math that decides if this is worth it.
