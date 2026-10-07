---
name: fairness-bias
description: Use when a deployed model produces unequal outcomes across groups — a hiring tool rejecting one group more, a lending or screening model with disparate impact, an adverse-impact complaint — and you must measure the gap, contain it, and find the cause.
---

## Orient
Disparate impact is harm without intent; read it on outcomes by group, measure it twice, and keep the system running under human review while you fix it.

## The knowledge
Fairness failures are measured on **outcomes by group**, never on overall accuracy — a model can be 95% accurate and still be systematically unfair to a minority that is 5% of the data, because the aggregate hides the subgroup. The legal doctrine is **disparate impact**: a facially neutral process that falls more harshly on a protected group is unlawful even with no intent to discriminate.

**You measure it twice, on purpose.**
- **Four-fifths rule** (EEOC *Uniform Guidelines*, 1978): for each group, selection rate = selected ÷ total; adverse-impact ratio = lowest rate ÷ highest rate; a ratio below **0.80** is evidence of adverse impact. Blind spots: fires on noise at small N, clears real gaps at large N.
- **Two-proportion z-test** (the significance check EEOC's 2023 AI guidance says to add): pooled p = (x₁+x₂)/(n₁+n₂); se = √(p(1−p)(1/n₁+1/n₂)); z = (p₁−p₂)/se; |z| > 1.96 is significant at α=0.05. **A tool can pass four-fifths and fail significance at scale** — the case regulators care about most and most teams miss.
- Combined verdict (`disparateImpactAssessment`): a tool is **clear** only if it passes four-fifths **and** is not significant.

**The cause is almost never a protected field** — those get removed. It hides in a **proxy**: a neutral feature correlated with a protected trait, so deleting the protected attribute does nothing. Common proxies: postal code/PIN → caste/race/income; employment gap → sex (caregiving)/age/disability; name or language → religion/ethnicity; alma mater → caste/class; commute distance → income segregation. Find it by checking which features both drive the decision and correlate with group membership — **SHAP and LIME** make that visible per decision, which also supplies the *reason* an affected person is owed.

**Containment is distinctive:** you do **not** switch the model off (that denies everyone); you **route affected and borderline decisions to a human** while you fix it, then drop/reweight the proxy and re-validate until `clear:true`.

**Protected grounds:** India — Constitution **Art. 15** (religion, race, caste, sex, place of birth) + NITI fairness-by-group and right-to-appeal; EU — AI Act Annex III makes hiring high-risk; US — Title VII / Uniform Guidelines (race, color, religion, sex, national origin).

### Sources
EEOC Uniform Guidelines (1978); EEOC technical assistance on AI in selection (2023); Google ML Crash Course (bias taxonomy); Constitution Art. 14/15; NITI RAI; EU AI Act Annex III; Title VII.

## Reads
selection counts per group; feature-importance / SHAP output; the screener config.

## The test
`disparateImpactAssessment(groups)` from `lib/fairness.mjs` returns `{ratio, fourFifthsPass, z, significant, clear}`. Clear only if it passes four-fifths **and** shows no significant gap.

## Procedure
1. Compute selection rates by group; run `disparateImpactAssessment`.
2. If not `clear`, recommend **route borderline/affected decisions to a human** (not shutdown) to `incident-contain`.
3. Investigate: find the proxy (high importance + correlation with group membership); explain with SHAP/LIME.
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
