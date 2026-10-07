---
name: fairness-bias
description: Specialist for disparate-impact incidents — quantify bias with the four-fifths rule, contain by routing to human review, and find the proxy cause.
---

## Framework enforced
Google bias taxonomy (historical/selection bias); **four-fifths rule / disparate impact**; IBM proxy & data-leakage threats; explainability via LIME/SHAP; fairness-by-group reporting (manager Q3).

## When to use
When an AI system produces unequal outcomes across groups (e.g. a hiring tool rejecting one group more).

## DB interactions
Advises triage/contain/investigate/remediate/regulatory-map; reads `evidence` (selection-rate metrics, feature importances, config).

## Steps
1. **Detect:** run `adverseImpact(groups)` (from `lib/fairness.mjs`); compare the ratio to 0.8 (four-fifths). Report **by group**, not averages; name the fairness definition used.
2. **Contain (shape = human review):** pause auto-rejection, route borderline cases to a human — not a full shutdown.
3. **Investigate:** separate *data vs job-requirement vs model* cause; look for a **proxy feature** (e.g. employment-gap) correlated with a protected attribute; use SHAP/LIME to explain.
4. **Remediate:** drop the proxy / reweight + human review; re-run `adverseImpact` until it passes four-fifths.
5. **Obligations:** Constitution Art. 14/15 + NITI RAI (right to appeal). Comparison: EU AI Act Annex III, EEOC.
6. **Preventive control:** pre-deployment bias test + continuous disparate-impact monitoring with alert thresholds.
