# Lab b8 — Worked Solution and What the Numbers Mean

## Expected results (our runs, clip-ViT-B-32, 2,000 images, 300 caption queries)

| Measurement | What we got |
|---|---|
| Text→image hit@1 | ≈ 0.08–0.15 |
| Text→image hit@5 | ≈ 0.20–0.35 |
| Image→image "same-scene" precision@5 | ≈ 0.6–0.8 (visually near-duplicate scenes) |
| Zero-shot 10-way classification (ext.) | ≈ 0.70–0.85 on coarse scene labels |
| Miss taxonomy | ~40% attributes/details, ~30% distractor twins, ~20% counting/relations, ~10% parse/join bugs |

## The five lessons hidden in those numbers

1. **Cross-modal is the hard direction — and it's the product direction.** Users describe; your index holds images. Text→image hit@5 of ~0.25 against 2K distractors is *good* for 2021-era open CLIP — and also why every visual-search product leans on the user's own photo (image→image, the strong direction) whenever it can.
2. **CLIP-style retrieval is scene-level, not instance-level.** "Dog on a beach" — excellent. "The *red* kite" / "the *third* dog" — weak. The encoder pools patches into one vector; fine-grained attributes and spatial relations lose resolution on the way. Products mitigate with attribute filters (B.3 metadata), rerankers, or dedicated attribute models — knowing the taxonomy (your Part 2) is what lets you choose.
3. **The modality gap is measurable and consequential.** Image↔image similarity systematically exceeds image↔text similarity in the same joint space — the two modality clouds don't fully overlap. Design translation: never *mix* similarity scores across modality pairs in one ranking (a text-text 0.8 and an image-text 0.8 are not the same "relevance") — normalize or route per query type.
4. **This part of the stack has no per-token bill.** CLIP-class models self-host on CPU; embedding is a one-time cost per asset. When the CFO asks where AI spend is avoidable, *retrieval and similarity features* (this lab, b2, b5) are the answer — generation (b1) is where the meter runs. Knowing which side of that line a feature sits on is an architecture skill.
5. **Eval sets make demos honest.** The hit-rate harness took 15 lines and immediately replaced "it feels magical" with a number *and a failure taxonomy*. That's the b4 discipline, now in its third costume (text QA, extraction, multimodal) — the pattern is the course's most transferable artifact.

## Common mistakes

- **Botched caption join** (`image#id` parsing): hit rates silently drop; always spot-check 3 joined rows by eye before trusting any number.
- **Encoding image paths vs. loading images.** `SentenceTransformer.encode` accepts paths (it loads PIL internally) — passing raw path *strings* as text embeds the *filename*. If your results look absurd, this is why (a classic, and it *runs without error*).
- **Evaluating with all 5 captions as separate queries but averaging per-caption.** Fine if consistent — but report per-image or per-caption explicitly; mixing the units inflates or deflates hit rate by up to ~20%.
- **Judging by top-1 screenshots only.** Top-1 looks great in demos (you curated the query); the miss taxonomy is where the truth lives. Read your misses; that's the whole Part 2.

## Interview lines this lab earns you

- "I measured cross-modal retrieval both ways: text→image hit@5 ≈ 0.25 on Flickr8k with 2K distractors, image→image much stronger — the modality gap, in numbers I collected. My failure taxonomy — attributes, counting, relations, distractor twins — maps directly onto mitigation choices: metadata filters, rerankers, or human review."
