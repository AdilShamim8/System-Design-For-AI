> Every dataset in this catalog is real, public, and used (or usable) somewhere in this course's labs. Sizes and access notes are as of late 2026 — always check the source page before relying on a number. **Check each dataset's license before commercial use**; many research datasets are non-commercial.

# Audio & Speech Datasets

Chapter S.4 (voice assistant) draws on these. Audio is the most throughput-hungry modality after video: plan storage and streaming carefully.

### LibriSpeech (2015)

**What:** ~1,000 hours of English audiobook readings (LibriVox), 16kHz, with aligned transcripts; the standard ASR training/eval corpus.

**Size:** 1,000 hours (~30 GB)

**Get it:** https://www.openslr.org/12

**License:** CC BY 4.0.

**Quirks & gotchas:** Read speech (audiobooks) is *easier* than conversational speech — don't extrapolate word-error rates to real products. Clean vs 'other' training subsets split by SNR.

**Used in:** Reading for S.4; Mock/interview background.

---
### Mozilla Common Voice (ongoing)

**What:** Crowd-sourced multi-language voice clips (70+ languages) with text, demographics, and validation votes; versions released regularly with growing hours.

**Size:** 20,000+ hours total across languages (varies by release)

**Get it:** https://commonvoice.mozilla.org/en/datasets

**License:** CC0 (public domain).

**Quirks & gotchas:** The commercial-friendly speech dataset (CC0!). Variable mic quality and accents — 'real' but noisy. Per-language hours vary wildly (English ≫ everything else).

**Used in:** S.4 project option.

---
### LJSpeech (2017)

**What:** 13,100 short audio clips of a single female speaker reading passages from 7 non-fiction books, 22.05kHz, with transcripts.

**Size:** 24 hours (~2.6 GB)

**Get it:** https://keithito.com/LJ-Speech-Dataset/

**License:** Public domain.

**Quirks & gotchas:** Single-speaker = the standard 'first TTS fine-tune' dataset. Great for learning mel-spectrogram pipelines without multi-speaker complexity.

**Used in:** S.4 extension.

---
### ESC-50 (2015)

**What:** 2,000 five-second environmental sound clips (claps, sirens, rain, animals…) labeled across 50 classes, assembled from Freesound.

**Size:** 2,000 clips (~600 MB)

**Get it:** https://github.com/karolpiczak/ESC-50

**License:** CC BY-NC-SA / CC0 mix (research).

**Quirks & gotchas:** Small, balanced, and pre-split 5-fold — ideal for a quick audio-classification lab. Clips are variable SNR; some classes are acoustically confusable (chainsaw vs engine).

**Used in:** Optional audio lab.

---
### RAVDESS (2018)

**What:** 7,356 files: 24 professional actors speaking two matched sentences with 8 emotions, in speech and song, video + audio.

**Size:** ~7.4K files (~25 GB full; audio-only subset ~5 GB)

**Get it:** https://zenodo.org/record/1188976

**License:** CC BY-NC-SA 4.0.

**Quirks & gotchas:** Acted emotion ≠ felt emotion — a citation-worthy limitation. Perfectly balanced classes (a rarity) make it a clean teaching set for audio emotion classification.

**Used in:** Optional audio lab.

---
