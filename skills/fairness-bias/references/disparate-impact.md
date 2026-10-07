# Disparate impact — reference (fairness-bias)

## The two tests, in full

**Four-fifths (adverse-impact) rule** — EEOC Uniform Guidelines, 1978.
- For each group: selection rate = selected ÷ total.
- Adverse-impact ratio = lowest group rate ÷ highest group rate.
- Ratio < **0.80** → evidence of adverse impact (a "flag", not a verdict).
- Blind spots: fires on noise at small N; clears real gaps at large N.

**Two-proportion z-test** — the significance check EEOC (2023) says to add.
- Compare the lowest-rate group vs the highest-rate group.
- pooled p = (x₁+x₂)/(n₁+n₂); se = √(p(1−p)(1/n₁+1/n₂)); z = (p₁−p₂)/se.
- |z| > 1.96 → significant at α = 0.05.
- A tool can **pass four-fifths and fail significance** at large N → still unlawful.

Combined verdict (`disparateImpactAssessment`): **clear** only if four-fifths passes AND not significant.

## Protected grounds by jurisdiction
| Jurisdiction | Instrument | Protected grounds |
|---|---|---|
| India | Constitution Art. 15 | religion, race, caste, sex, place of birth |
| India | NITI RAI | fairness-by-group reporting + right to appeal |
| EU | AI Act Annex III | hiring/employment = high-risk; bias duties |
| US | Title VII / Uniform Guidelines | race, color, religion, sex, national origin |

## Proxy-feature catalog (where bias hides)
| Proxy feature | Stands in for |
|---|---|
| postal code / PIN | caste, race, income |
| employment gap | sex (caregiving), age, disability |
| name / language | religion, ethnicity, national origin |
| alma mater / school | caste, class |
| commute distance | race, income segregation |
Removing the *protected* field does not remove the proxy — test features for correlation with group membership.

## Containment & remedy
- Containment: route affected/borderline decisions to a human — never shut the model off (denies everyone).
- Remedy: drop or reweight the proxy; add human review; re-validate until `clear:true`.
- Explain each decision with SHAP/LIME → supplies the reason + supports appeal.

Source test code: `lib/fairness.mjs` (`adverseImpact`, `significanceTest`, `disparateImpactAssessment`).
