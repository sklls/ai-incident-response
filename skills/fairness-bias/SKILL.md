---
name: fairness-bias
description: Specialist for disparate-impact incidents — quantify bias with the four-fifths rule, contain by routing to human review, and find the proxy cause.
---

## Framework enforced
Google bias taxonomy (historical/selection bias); **four-fifths rule / disparate impact** AND **statistical-significance test** (**EEOC 2023**: passing four-fifths is *not* a legal all-clear); **Uniform Guidelines** on selection procedures; IBM proxy & data-leakage threats; explainability via LIME/SHAP; fairness-by-group reporting (manager Q3); NITI right-to-appeal.

## When to use
When an AI system produces unequal outcomes across groups (e.g. a hiring tool rejecting one group more).

## DB interactions
Advises triage/contain/investigate/remediate/regulatory-map; reads `evidence` (selection-rate metrics, feature importances, config).

## Steps
1. **Detect:** run `disparateImpactAssessment(groups)` (from `lib/fairness.mjs`) — it returns the four-fifths ratio **and** a two-proportion significance verdict, and only reports `clear` when **both** pass. Per EEOC, a tool that passes four-fifths can still be unlawful if the gap is statistically significant (common at large N). Report **by group**, not averages; name the fairness definition used.
2. **Contain (shape = human review):** pause auto-rejection, route borderline cases to a human — not a full shutdown.
3. **Investigate:** separate *data vs job-requirement vs model* cause; look for a **proxy feature** (e.g. employment-gap) correlated with a protected attribute; use SHAP/LIME to explain.
4. **Remediate:** drop the proxy / reweight + human review; re-run `disparateImpactAssessment` until it is `clear` (passes four-fifths **and** no significant gap).
5. **Obligations:** Constitution Art. 14/15 + NITI RAI (right to appeal). Comparison: EU AI Act Annex III, EEOC.
6. **Preventive control:** pre-deployment bias test + continuous disparate-impact monitoring with alert thresholds.
