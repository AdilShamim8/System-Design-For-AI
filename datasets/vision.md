> Every dataset in this catalog is real, public, and used (or usable) somewhere in this course's labs. Sizes and access notes are as of late 2026 — always check the source page before relying on a number. **Check each dataset's license before commercial use**; many research datasets are non-commercial.

# Vision Datasets

Chapter B.7 (beyond text) and Lab b8 (multimodal embeddings). For system design, treat vision datasets as storage/throughput problems first: images are 100–1000× bigger than text rows, and your pipeline design changes accordingly.

### MS COCO (2014–2017)

**What:** 330K+ images with 1.5M object instances across 80 classes, plus 5 captions per image — the standard for detection, segmentation, and captioning.

**Size:** 330K images (~19GB train2017; smaller caption-only subsets exist)

**Get it:** https://cocodataset.org/

**License:** Annotations CC BY 4.0; images subject to Flickr terms.

**Quirks & gotchas:** Long-tail class distribution; 'small object' problem; the 5-captions-per-image structure is what Lab b8 uses for image-text embedding alignment.

**Used in:** Lab b8 (multimodal).

---
### Open Images V7 (2020)

**What:** ~9M images with 16M+ bounding boxes across 600 classes, plus segmentation and (V7) localized narratives; annotations machine-generated then verified.

**Size:** ~9M images (~500GB+ full; subsets available)

**Get it:** https://storage.googleapis.com/openimages/web/index.html

**License:** CC BY 2.0 (annotations; images per Flickr terms).

**Quirks & gotchas:** Human-verified subset (~2M boxes) vs machine labels — use the distinction to teach label-noise awareness. Class hierarchy is uneven (thousands of examples for 'car', dozens for rare classes).

**Used in:** Lab b8 extension.

---
### CIFAR-10 / CIFAR-100 (2009)

**What:** 60,000 32×32 color images, 10 classes (CIFAR-10) or 100 fine-grained classes (CIFAR-100).

**Size:** 60K images (~170 MB)

**Get it:** https://www.cs.toronto.edu/~kriz/cifar.html

**License:** Open (MIT-style for the python version).

**Quirks & gotchas:** Tiny on purpose: train a classifier in minutes on CPU. The right dataset for a *first* training loop or a CI smoke test — not for claiming SOTA relevance.

**Used in:** Optional warm-up for b8.

---
### ImageNet (ILSVRC 2012)

**What:** 1.28M training images across 1,000 synsets from the ImageNet hierarchy; the dataset that launched the deep-learning era.

**Size:** 1.28M images (~150 GB)

**Get it:** https://image-net.org/

**License:** Research-only license; requires registration.

**Quirks & gotchas:** Still the canonical 'big vision' reference for capacity math in interviews ('what does training on ImageNet cost?'). Known label noise and Western-skew critiques are worth citing.

**Used in:** Reading for X.4 (cost math).

---
### Flickr8k / Flickr30k (2013/2014)

**What:** 8,000 (Flickr8k) and 31,783 (Flickr30k) photos of everyday scenes, each with 5 human captions. The classic image-captioning pairs.

**Size:** Flickr8k: 8K images (~1 GB); Flickr30k: ~31K images

**Get it:** Flickr8k via https://github.com/goodwiny/flickr8k-mirror or Kaggle; Flickr30k via https://bryanplt.github.io/iplp/ (research requests)

**License:** Research-only (Flickr images under their terms).

**Quirks & gotchas:** Small enough for exhaustive embedding experiments; captions describe *salient* objects (not all) — a useful failure mode to measure in image-text retrieval.

**Used in:** Lab b8 (primary dataset).

---
