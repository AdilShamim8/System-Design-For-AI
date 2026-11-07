# Lab b8 — Dataset: Flickr8k

Full card in [`datasets/vision.md`](../../../datasets/vision.md). Lab-specific notes:

**Getting it:** Flickr8k is distributed via the original University of Illinois form or Kaggle mirrors (`adityajn105/flickr8k` is the common one — images + `captions.txt`). Total ~1 GB. Place images in `labs/data/Flickr8k_Dataset/` and the caption file alongside.

**Shape:** 8,092 images, 5 captions each (~40K caption-image pairs). Captions were written by crowdworkers *looking at the image* — so they describe what's visibly there (the "salient bias" from the dataset card).

**Known quirks you will hit:**

- **Caption style is telegraphic:** "A dog jumps into the water to fetch a ball." — no articles sometimes, no context, no mood. Real user queries are messier; your hit rates are again an upper bound.
- **Five captions disagree:** one says "two dogs," another says "a group of dogs" about the same photo. When you evaluate, sample *one* caption as the query — mixing all five muddies the metric.
- **Filename↔caption join:** the classic `Flickr8k.token.txt` format is `image_name#caption_id caption text` — parse once, carefully; a botched join is the most common silent bug (your hit rate quietly drops ~20% and everything still "works").
- **Near-duplicate scenes** (multiple dog-in-park photos) make distractor-heavy evaluation genuinely hard — that difficulty is the point: your miss taxonomy needs real distractors to be meaningful.

**License:** research-only (Flickr images under their original terms; the dataset is for academic use). Production visual search needs licensed or owned imagery.
