---
name: fairness-bias
description: Use when a deployed model produces unequal outcomes across groups — a hiring tool rejecting one group more, a lending or screening model with disparate impact, an adverse-impact complaint — and you must measure the gap, contain it, and find the cause.
---

## Orient
Disparate impact is harm without intent; read it on outcomes by group, measure it twice, and keep the system running under human review while you fix it.

## The knowledge
Fairness failures are measured on **outcomes by group**, never on overall accuracy — a model can be 95% accurate and still be systematically unfair to a minority that is 5% of the data, because the aggregate hides the subgroup. The legal doctrine is **disparate impact**: a facially neutral process that falls more harshly on a protected group is unlawful even with no intent to discriminate; the pattern in the outcomes is the violation. You measure it twice, on purpose. The **four-fifths rule** (EEOC *Uniform Guidelines*, 1978) is the quick flag — each group's selection rate, lowest over highest; a ratio below **0.80** is evidence of adverse impact. But it is a crude rule of thumb with two blind spots, and the **EEOC's 2023 guidance on AI** says so explicitly: on small samples it fires on noise, and on large samples it clears gaps that are statistically real. So you pair it with a **two-proportion significance test** — a tool can pass four-fifths and still be unlawful at scale, which is the case regulators now care about most and most teams miss.

The cause is almost never a protected field — those get removed. It hides in a **proxy**: a neutral feature correlated with a protected trait. Employment gaps track caregiving and therefore sex; postal codes track caste or race. The model learns the proxy and reproduces the disparity through the back door, so deleting the protected attribute does nothing. You find it by checking which features both drive the decision and correlate with group membership — **SHAP and LIME** make that visible per decision, which also supplies the *reason* an affected person is owed. Containment is distinctive: you do **not** switch the model off (that denies everyone); you **route affected and borderline decisions to a human** while you fix it. In India the grounds are **Constitution Art. 14/15** (equality; no discrimination on religion, race, caste, sex, place of birth) and **NITI's** fairness-by-group and right-to-appeal; the **EU AI Act** classifies hiring as high-risk (Annex III), and the US frame is **Title VII**.

### Sources
EEOC Uniform Guidelines (1978); EEOC technical assistance on AI in selection (2023); Google ML Crash Course (bias taxonomy); Constitution Art. 14/15; NITI RAI; EU AI Act Annex III; Title VII. Detail: `references/disparate-impact.md`.

## Reads
selection counts per group; feature-importance / SHAP output; the screener config.

## The test
`disparateImpactAssessment(groups)` from `lib/fairness.mjs` returns `{ratio, fourFifthsPass, z, significant, clear}`. A tool is **clear** only if it passes four-fifths **and** shows no statistically significant gap.

## Procedure
1. Compute selection rates by group; run `disparateImpactAssessment`.
2. If not `clear`, recommend **route borderline/affected decisions to a human** (not shutdown) to `incident-contain`.
3. Investigate: find the proxy feature (high importance + correlation with group membership); explain with SHAP/LIME.
4. Raise obligations (Art. 14/15, NITI; cmp. EU Annex III, EEOC) via `regulatory-map`.
5. Preventive control: pre-deployment bias test + continuous disparate-impact monitoring with alert thresholds.

## Writes
the disparity (ratio + z + verdict), the named proxy, and the human-review recommendation — advising the lifecycle skills.

## Worked example
Screener: group A 52% selected, group B 21% → ratio 0.40, fails four-fifths and is significant → route borderline applicants to a human → proxy found: an employment-gap feature.

## Failure modes
It never auto-shuts a hiring model (denies everyone); it never calls a tool fixed on four-fifths alone. It **stops and escalates** if a group is too small to test or the proxy can't be found.

## Done when
re-running `disparateImpactAssessment` returns `clear:true` **and** affected people have a reason (SHAP/LIME) and a route to appeal.

## Connect
Consulted by `incident-triage`, `-investigate`, `-remediate`, and `regulatory-map` whenever the scenario is `fairness`. Its test is the tested `lib/fairness.mjs`.

## Resources
`references/disparate-impact.md` — protected grounds by jurisdiction, the four-fifths + significance math, and a proxy-feature catalog.
