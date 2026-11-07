# FN-01 — Amazon's Recruiting Model Learned to Dislike Women

**Date:** 2014–2018 (reported Oct 2018) · **Category & chapters below**

## What happened

Since 2014, Amazon built experimental ML systems to score résumés for software-developer and other technical roles. By 2017–2018 the team discovered the system was systematically downgrading résumés containing the word "women's" (as in "women's chess club captain") and graduates of two all-women's colleges. The model had been trained on ten years of résumés submitted to Amazon — a historical pile overwhelmingly from men — and had learned the pattern hiding in that history: male-dominated hiring outcomes. Engineers edited the model to neutralize those specific terms, but could not guarantee it would not find other proxies for gender. The project was scrapped in 2018, as revealed by Reuters' investigation (Jeffrey Dastin, "Amazon scraps secret AI recruiting tool that showed bias against women," October 2018).

## Why it happened (the design lens)

The root cause is a **feedback loop over historical data**: the target variable ("who gets hired") encoded decades of biased decisions, and the model faithfully learned the bias — then proposed to automate it at scale. The pipeline was technically sound: clean features, reasonable validation, predictable outputs. The failure was upstream of the model: nobody asked "what does the label *mean*, and whose decisions does it replay?" The proxies (women's college, gendered activity words) are exactly what models find when you remove the protected attribute but keep its correlates — fairness through unawareness is a myth.

## The design lessons

- **The label is a design decision** (Chapter X.2): "past hires" is not "future merit." Ask what the target variable measures and whose history it encodes — before training, not after reporting.
- **Removing protected attributes doesn't work** (FN-05's impossibility lesson from the other side): proxies are everywhere. Fairness needs measurement (group metrics on outcomes), not feature deletion.
- **Bias audits belong in CI** (Labs a1/a7 discipline): run slice metrics by group as a standing eval — the Amazon team found the problem *eventually*; the lesson is to look *by default*.
- **Human-in-the-loop is not a fix for a biased ranker** (Chapter C.5): if the model orders the queue, bias propagates even when a human signs off on each item.

## Say it in an interview (the 30-second version)

"Amazon's recruiting tool is the canonical feedback-loop failure: it trained on ten years of résumés — mostly men — and learned to penalize 'women's chess club captain.' The fix isn't deleting gender fields; proxies survive deletion. The fix is auditing outcome metrics by group, in CI, before deployment — and being honest that the label 'was hired' replays history rather than measuring merit." Then connect: "which is why my labs slice evaluation metrics by subgroup as a default artifact." 

## Sources

- Reuters, Jeffrey Dastin, "Amazon scraps secret AI recruiting tool that showed bias against women" (Oct 2018) — https://www.reuters.com/article/us-amazon-com-jobs-automation-insight-idUSKCN1MK08G/
- Context: Chapter X.2 (evaluation); Chapter 0.1 (why AI breaks differently).
