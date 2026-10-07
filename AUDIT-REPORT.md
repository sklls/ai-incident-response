# Whole-Agent Audit — across models

**Date:** 2026-10-07
**What was tested:** the agent **as a whole** — the Incident Commander orchestrating the full 14-skill library end-to-end — on three real incidents, run **with the skill library vs a no-skill baseline**, on **three models: Opus, Sonnet, Haiku**.
**Runs:** 3 scenarios × {with-skill, baseline} × {Opus, Sonnet, Haiku} = **18 end-to-end runs.** Each graded on an 8-point full-lifecycle rubric (classify + severity, contain-before-investigate, **human-approval gate**, correct containment **shape**, real root cause, durable remediation + validation, **India-first obligations**, immutable ledger + named controls). Companion to the per-skill `EVAL-REPORT.md` and the 48 logic tests.

> **Headline:** the library **closes the model-capability gap.** All three models *with the skills* converge to ~100% and produce nearly identical governance decisions. *Without* the skills, quality tracks model strength — and the cheapest model (Haiku) made a **critical governance error** (shutting off a hiring model) that the library completely prevented. **The library's value is largest exactly where it matters most: on the weak, cheap model.**

---

## The money chart — governance quality by model

| Model | Baseline (no skill) | With skill library | Uplift |
|---|:---:|:---:|:---:|
| **Opus** (strongest) | 79% | **100%** | **+21 pts** |
| **Sonnet** (mid) | 77% | **100%** | **+23 pts** |
| **Haiku** (cheapest) | **56%** | **100%** | **+44 pts** |

Two things to read off this:
1. **With the skills, the model barely matters** — Opus, Sonnet, and Haiku all land at ~100% and make the same calls (same severity, same containment shape, same gate, same India clocks, same §11 anchor). The library is doing the governance; the model is doing the prose.
2. **Without the skills, the model is everything** — and the floor is dangerous. A cheap model left to its own judgement gets the subtle calls wrong.

---

## The decisive case: the subtle fairness incident

Scenario: a hiring screener selects men 50% / women 45% at N=10,000 each — a case that **passes** the four-fifths rule (ratio 0.90) but is **statistically significant** (z≈7.08). The right governance answer is nuanced: *act, but do **not** switch the model off — route decisions to human review.*

| | Verdict | Containment | Correct? |
|---|---|---|---|
| **Opus + skill** | not clear (4/5 pass, significant) | route to human review | ✅ |
| **Sonnet + skill** | not clear | route to human review | ✅ |
| **Haiku + skill** | not clear | route to human review | ✅ |
| Opus baseline | not clear; "don't reflexively switch off" | human review | ✅ |
| Sonnet baseline | significant but hedged (SEV-3) | human review "unless proxy found" | ◻ partial |
| **Haiku baseline** | "CRITICAL" | **"Switch the model off immediately"** | ❌ **wrong** |

The Haiku baseline made exactly the mistake the discipline exists to prevent — **shutting a hiring model down denies service to everyone and fixes nothing.** With the library, Haiku instead produced an exemplary response: route to human, hunt the proxy with SHAP/LIME, re-validate to `clear:true`, cite Art. 14/15 + NITI, name five owned controls. *Same cheap model, correct governance — because the skill carried the judgement.*

(The baselines also drifted on the law: the Haiku baseline cited the **repealed** Equal Remuneration Act 1976; the skill runs stuck to the correct Constitution Art. 14/15 + NITI.)

---

## Per-scenario, across models

**Privacy (chatbot cross-customer leak).** The easiest scenario — all baselines knew "shut it down" and most knew DPDP. *With-skill* (all models) added what the baselines missed: the **human-approval gate before taking the bot offline**, the **hash-chained immutable ledger**, and the precise **CERT-In 6h → DPDP 72h** order (the Opus and Haiku baselines under-stated CERT-In). Uplift moderate and consistent across models.

**Autonomy (prompt-injected finance agent).** All baselines correctly reached for "revoke access" — containment was not the gap. The gaps the library closed on every model: the **gate before acting** (baselines acted first), the **IT Act §11 attribution/liability anchor** (no baseline cited it), and the sealed ledger. Uplift moderate.

**Fairness (the subtle disparate-impact case).** The widest spread and the clearest value. Baselines degraded sharply with model strength (Opus right → Sonnet hedged → Haiku wrong). With-skill held all three at a correct, decisive, legally-grounded answer. This is where the +44-point Haiku uplift comes from.

---

## What this means for the project's thesis

- **The library is the governance, not the model.** It makes a cheap model behave like an expert on exactly the calls that are easy to get catastrophically wrong, and it makes a strong model consistent and auditable. That is the whole argument for encoding governance as runnable skills rather than trusting a prompt or a person's memory.
- **Economic read:** you can run incident response on a cheap model with the library and get Opus-grade governance — the library buys a ~44-point quality jump on Haiku, which is the cost-effective way to deploy this at scale.

## Honest caveats
- **One run per cell** (18 total). Enough to show a strong, consistent direction — Haiku baseline failed the fairness call, every with-skill run passed — but not a large-N statistic. The repeatable high-N evidence is the **48 logic tests**.
- **Opus and Sonnet baselines are genuinely good** (79% / 77%); the library's job there is consistency, the gate, and §11-level precision, not rescuing a weak answer.
- Baselines occasionally added things the skills don't (external hash anchoring; SEBI/Companies-Act clocks) — see the improvement list in `EVAL-REPORT.md`.
- Grading was an 8-point rubric scored from the saved outputs in `skills-eval-workspace/whole-agent/<scenario>/<model>/` (git-ignored) for inspection.

## Bottom line
**With the skills, Opus = Sonnet = Haiku ≈ 100% and agree with each other. Without them, quality falls with model price and the cheapest model makes the one genuinely harmful call.** The library levels the field — and it earns its keep most on the model you'd actually want to run at scale.


> **Full record:** every input prompt, the skills used, the rubric grading, and all 18 outputs verbatim (with and without the library, per model) are in [`AUDIT-DETAIL.md`](AUDIT-DETAIL.md).
