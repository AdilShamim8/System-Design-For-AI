# FN-10 — Google Photos Labeled People as 'Gorillas'

**Date:** June/July 2015 · **Category & chapters below**

## What happened

Shortly after Google Photos launched its automatic image-labeling, a Black user (Jacky Alcine, a Brooklyn-based developer) found that photos of himself and a friend had been tagged "gorillas." Google apologized directly, called it "high impact" and acknowledged the cause: the categories had been trained on data that under-represented people of color, so the classifier's fine-grained discrimination failed exactly on the faces least represented in training. Wired's 2018 follow-up reported the eventual "fix": Google had *blocked* the gorilla tag from Photos' vocabulary rather than solved the underlying recognition gap — a blunt, defensive patch that traded one harm for a blind spot.

## Why it happened (the design lens)

A textbook **long-tail training-data failure**: image classifiers are only as good as their supervision distribution, and the industry's benchmark datasets skewed light-skinned (the "gender shades" research by Buolamwini & Gebru, 2018, documented the systematic pattern across commercial classifiers). The 2018 detail adds the second lesson: when a category cannot be made safe, the honest options are *remove the capability* or *fix the data* — quietly blinding the model keeps the feature working for the well-represented and pretends the problem is solved for everyone else. Errors that fall on identifiable groups are not random; they follow representation.

## The design lessons

- **Audit performance by slice before shipping** (Chapter X.2, Lab a1): aggregate accuracy hides group-level failure; disaggregated eval is how "97% accurate" is revealed as "99.5% for some users, 80% for others." For anything touching faces, skin tone, speech, or names, slice evals are a launch gate.
- **The tail is the product for the people in it** (Chapter B.8): a 1% error rate sounds great until you're in the 1% — and identity-correlated errors concentrate the same people there every time. Average-user thinking is the bias, not just the data.
- **Removal is sometimes the right fix — loudly** (Chapter C.5): when a capability can't be made safe, disabling it *transparently* (and saying why) is defensible engineering; silently blinding the model is reputational risk deferred.
- **Data curation is a first-class engineering task** (Chapter X.0, datasets catalog): "who is under-represented in this corpus, and what will that cost them?" is a design-review question, in the same meeting as latency and cost.

## Say it in an interview (the 30-second version)

"Google Photos' 'gorillas' tag is the long-tail lesson in one screenshot: the classifier failed exactly on the faces least represented in training, and the aggregate accuracy numbers never showed it. My default practice from the labs: disaggregated evaluation as a launch gate for anything touching identity, honest capability removal when safety can't be achieved, and treating dataset representation as an engineering requirement with the same weight as latency or cost." 

## Sources

- Original reporting: various, June–July 2015, triggered by Jacky Alcine's screenshots; Wired's follow-up on the label block (2018) — https://www.wired.com/
- Buolamwini & Gebru, "Gender Shades" (ACM FAccT 2018) — the systematic study behind the pattern.
- Context: Chapters X.2, B.7; Labs a1, b8.
