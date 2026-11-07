# Lab b8 — Multimodal Embeddings: Image↔Text Search

| | |
|---|---|
| **Prerequisites** | Chapter B.7 (beyond text) · Lab b2 |
| **Dataset** | Flickr8k — 8,000 real photos, each with 5 human captions ([card](../../datasets/vision.md)) |
| **You will build** | A CLIP-style joint embedding space: search images by text, and — the honest part — *measure* where image-text search is weaker than text-text search |
| **Est. time** | 2–3 hours |
| **Cost** | Free (local CLIP model, ~400 MB download) |

**The story.** Your e-commerce client wants "search the catalog by photo" and "show me images for this blog post." The technology is a **joint embedding space**: one model maps images and text into the *same* vector space, where "a dog on a beach" lands near photographs of dogs on beaches. It feels like magic; it is actually two encoders trained to agree — and its failure modes (fine-grained categories, counting, text-in-images) are predictable once you've measured them. Today you build image-text search and run the evaluation that keeps the demo honest.

---

## Part 1 — The joint space (30 min)

```python
from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer("clip-ViT-B-32")     # the classic open CLIP, CPU-ok

# Flickr8k: images/Flickr8k_Dataset/*.jpg, captions in Flickr8k.token.txt
captions = parse_captions("labs/data/Flickr8k.token.txt")   # {image_id: [5 captions]}

image_ids = list(captions)[:2000]
I = model.encode([f"labs/data/Flickr8k_Dataset/{i}" for i in image_ids],
                 batch_size=32, normalize_embeddings=True, show_progress_bar=True)
T = model.encode([c for i in image_ids for c in captions[i]],
                 normalize_embeddings=True)      # 10K caption vectors
```

**Checkpoint 1:** Verify the space is *joint*: encode "a dog jumping into water" and check its nearest images are dogs near water (show 5). Now the reverse — take one image, find its nearest captions. Both directions work from the *same* matrix. That symmetry is the entire trick, and the reason one index (B.3) serves both modalities.

---

## Part 2 — Text→image search, measured (40 min)

Flickr8k's held-out structure gives a free evaluation: for each test caption, is its own image in the top-k retrieved images?

```python
def text_to_image_hit_rate(k=5, n=300):
    hits = 0
    for cap_row in sample_caption_rows(n):
        q = model.encode([cap_row.caption], normalize_embeddings=True)
        top = (q @ I.T)[0].argsort()[::-1][:k]
        hits += cap_row.image_id in [image_ids[i] for i in top]
    return hits / n
```

**Checkpoint 2:** Expect hit@5 ≈ 0.15–0.35 (this is *hard* — 2,000 distractor images, five captions each describing the same photo differently). Now the diagnosis that makes you useful: read 10 misses. Classic patterns: **counting** ("two dogs" vs a photo of three), **attributes** ("red kite" retrieved blue), **negation/relations** ("the man *behind*"), **distractor dominance** (many dogs-on-beach photos; the query can't tell which). Write the taxonomy. CLIP-style search is *great at scenes, weak at specifics* — and now you have receipts.

---

## Part 3 — Image→image and the modality gap (20 min)

Retrieve images *by image* (a query image's nearest images). Compare with text→image quality on the same photo set. You should find image→image is noticeably *stronger* (same-modality similarity is easier than cross-modality — the literature calls the offset the "modality gap").

**Checkpoint 3:** Measure both, write the gap. Product translation: "search by photo" will outperform "search by description" on your platform — the user's *photo* is a better query than their *words*, which is exactly why visual search shipped first at every marketplace that has it.

---

## Part 4 — The design layer (20 min)

A product feature: "find similar products" + "moderate images that don't match their listing." On paper:

1. **Index design:** one vector DB, two sources (product photos, listing text), shared embedding model, `modality` metadata field. Filters: category, price band — B.3's metadata filtering, now multimodal.
2. **Freshness:** new product photos embed in ~10–30 ms each; the index update path is identical to b2's corpus ingestion.
3. **Moderation use:** embed listing photo + listing title; a *low* similarity flags "photo doesn't match description" — a cheap automated first pass with human review at the boundary (same dead-letter philosophy as b7).
4. **Cost:** CLIP-class models self-host cheaply (CPU-feasible); this is one of the few LLM-era features with *no per-token bill* — know when you're in the free tier of the stack.

**Checkpoint 4:** Write the one-paragraph pitch with numbers from YOUR lab: hit rates, both directions, and the caveat sentence ("strong on scene-level semantics; weak on fine-grained attributes — human review remains in the loop for X"). That paragraph — with its honest caveat — is what a senior engineer presents, and a demo-only engineer doesn't.

---

## Explain it back

1. What does "joint embedding space" mean, and why does one index serve both modalities?
2. Name three measured weaknesses of image-text retrieval and one product mitigation for each.
3. Why is image→image stronger than text→image? What's the product implication?
4. Where does multimodal search sit on the cost stack, and why is it different from LLM generation?

## Extensions

- **Rerank with a bigger model:** re-score the top-20 with a larger CLIP (ViT-L/14) and measure the hit@5 bump. The two-stage pattern (a5, B.5) — coarse recall, precise rerank — in your third modality pairing.
- **CLIP zero-shot classification:** classify Flickr8k images into your own 10-label set by comparing image embeddings with "a photo of a {label}" text embeddings. Zero training labels — and you'll feel both the power and the ceiling.
- **Text-in-images:** try retrieving screenshots/Post-It photos by their written words. CLIP-class models are weak at OCR — document why (patch-level vision encoders vs. character recognition) and what you'd bolt on (an OCR sidecar).

## What you can now claim in an interview

"I built image-text search on a real captioned corpus and measured it both directions: text→image hit@5 ≈ [your number] against 2K distractors, image→image measurably stronger — the modality gap, in my own numbers. I know the failure taxonomy (counting, attributes, relations) and which product mitigations each one needs."
