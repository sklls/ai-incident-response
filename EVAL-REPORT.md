# Skill Evaluation Report — AI Incident Response Library

**Date:** 2026-10-07
**What was tested:** all 14 governance skills, each on a realistic incident-manager prompt.
**Method:** for every skill, a fresh subagent answered the prompt **with the skill** vs a **baseline** subagent that answered the same prompt cold (no skill, forbidden from reading `skills/`). Model: Claude Sonnet for all 28 runs. Each answer was graded against 3–4 objective assertions. Plus the **48 unit tests** that verify the computable skills' decision rules.

> **Headline:** with-skill **55/55 assertions (100%)**; baseline **≈46/55 (84%)**. Both are strong — the baseline (Sonnet) is a capable generalist — so the skills' measurable value is **governance discipline and consistency**, not secret knowledge. The clearest, most important gains are the **human-approval gate** ("no record, no action"), **India-first legal precision** (esp. IT Act §11 attribution), and **named owners + reconstruct-from-ledger**. A weaker model would show a larger gap.

---

## Part 1 — Quantitative base: the logic tests

The five computable skills are backed by a test suite that verifies their exact decision rules. This is the objective, repeatable part of the eval.

```
node --test  →  48 / 48 pass
```
Covered: `severity-matrix` (scoring + fail-safe unknown→worst-case), `fairness-bias` (`adverseImpact`, `significanceTest`, `disparateImpactAssessment`), `approval-gate` (`decideGate` — pending never proceeds), `audit-ledger` (SHA-256 vector, chain verify, tamper detection at the right block), plus schema, seed, and the skill-linter.

---

## Part 2 — Behavioral scorecard (with-skill vs no-skill baseline)

Score = assertions met (partial = 0.5). "Δ" = with-skill minus baseline.

| # | Skill | With-skill | Baseline | Δ | What the skill added that the baseline missed |
|---|-------|:---------:|:--------:|:--:|---|
| 1 | incident-commander | 4/4 | 2.5/4 | **+1.5** | approval **gate as a blocking precondition** (baseline contained immediately); immutable per-action ledger |
| 2 | incident-triage | 4/4 | 4/4 | 0 | (tie) skill adds India framing + OECD/NIST tags |
| 3 | incident-contain | 4/4 | 3/4 | **+1.0** | **approval before acting** (baseline said "act first, ratify after") |
| 4 | incident-investigate | 3/3 | 3/3 | 0 | (tie) baseline nailed trigger-vs-cause; skill adds ATLAS/OWASP labels |
| 5 | incident-remediate | 4/4 | 3.5/4 | +0.5 | gated the fix deploy; exact validation replay of the injected invoice |
| 6 | incident-communicate | 4/4 | 2.5/4 | **+1.5** | **approval gate on every send**; India-first (baseline sprawled to GDPR/sectoral) |
| 7 | incident-postmortem | 4/4 | 3/4 | +1.0 | **named owners** (baseline left [TBD]); reconstruct from the immutable ledger |
| 8 | privacy-breach | 4/4 | 4/4 | 0 | (tie) skill tighter; adds the "count = compliance step" point + leak canary |
| 9 | fairness-bias | 4/4 | 3.5/4 | +0.5 | more decisive "route to human, don't shut off" + the `clear:true` re-validation loop |
| 10 | agent-autonomy | 4/4 | 2.5/4* | **+1.5** | **IT Act §11 / RBI liability anchor**; explicit injection classification |
| 11 | severity-matrix | 4/4 | 3.5/4 | +0.5 | the exact numeric score + S1/S2 auto-escalate + re-score discipline |
| 12 | approval-gate | 4/4 | 4/4 | 0 | (tie) baseline excellent (even warned against record-editing); skill adds `decideGate` mechanics |
| 13 | audit-ledger | 4/4 | 4/4 | 0 | (tie) baseline excellent (even external anchoring); skill adds "never repair a break" + `verifyChain` |
| 14 | regulatory-map | 4/4 | 3/4 | +1.0 | **IT Act §11 attribution** (baseline missed it) + clean tightest-clock-first ordering |
| | **Total** | **55/55 (100%)** | **≈46/55 (84%)** | **+16 pts** | |

*`agent-autonomy` baseline file came back empty (a capture glitch); graded from the run's own summary.

---

## Part 3 — Per-skill findings (the interesting deltas)

**incident-commander — Δ+1.5.** With-skill makes the human-approval gate a *blocking precondition* ("proceed only when `decideGate` returns `proceed`; if nobody answers, hold; never self-approve"). The baseline ran a sensible 10-step flow but contained immediately and used "manual approval" only as a mode, not a recorded gate. *The gate is the governance difference.*

**incident-contain — Δ+1.0, and the sharpest finding.** With-skill: approval **before** acting. Baseline: *"In a live financial-loss event they do not need committee approval… act first and ratify afterward."* That is the opposite of the oversight discipline — defensible operationally, but exactly the gap the skill closes.

**incident-communicate — Δ+1.5.** Both got CERT-In 6h and DPDP 72h. But the baseline **had no approval gate on sends** and sprawled into GDPR, RBI, SEBI, IRDAI without a clean India-first order. The skill holds every notice for approval and keeps EU as explicit comparison.

**agent-autonomy / regulatory-map — Δ+1.5 / +1.0.** Both baselines handled injection and the fix-outside-the-model well, but **neither cited IT Act §11** (attribution → who is liable for the agent's action) — the India-specific liability anchor. The skills make it central.

**incident-postmortem — Δ+1.0.** The baseline produced a good template but left owners and the timeline as `[TBD]`. The skill forces **named owners** and reconstructs the timeline from the append-only ledger, and won't close without an owner on each control.

**fairness-bias — the honest near-tie (Δ+0.5).** This was designed as the "killer" test (a tool that *passes* four-fifths at 0.90 but is significant at N=10,000). The skill nailed it — **and so did the baseline**, which independently computed z≈7 and called it "not a safe harbor." The skill was more decisive on "route to human, don't shut off" and the re-validate-until-clear loop, but Sonnet already knew the core nuance.

**The ties (triage, investigate, privacy-breach, approval-gate, audit-ledger).** Sonnet's baseline reached the right answer unaided — it even added things our skills don't (external hash anchoring in `audit-ledger`; SEBI 6h + 21-day RCA and Companies Act 24h in `regulatory-map`). Here the skill's value is **consistency and exact, auditable vocabulary** (`decideGate`, `verifyChain`, "blast radius", the scoring table) rather than unique knowledge.

---

## Part 4 — What this means

**The skills do three things measurably better, every time:**
1. **Enforce the gate.** "No record, no action," and approval *before* the consequential step — the baseline repeatedly defaulted to act-first-ratify-after or dropped the gate on external sends. This is the governance-critical delta.
2. **Pin the India-first law precisely** — especially **IT Act §11 attribution**, which both baselines missed, and the correct tightest-clock-first order.
3. **Force accountability** — named owners, reconstruct-from-the-immutable-ledger, re-validate-until-clear — where baselines leave gaps or `[TBD]`.

**Honest caveats:**
- The baseline is strong because Sonnet is strong. The skills' value is **discipline, consistency, and auditability** — exactly what matters for governance at team scale, and exactly what you *cannot* rely on the model's mood to provide. On a weaker/cheaper model the gap would widen.
- The baselines occasionally **beat** the skills on breadth (external anchoring; SEBI/Companies Act timelines). Those are improvement opportunities, not failures.

## Part 5 — Recommended improvements (surfaced by the eval)
1. **`regulatory-map`:** add the sectoral clocks the baseline knew — **SEBI (6h + 21-day RCA)**, **IRDAI/RBI (2–6h)**, **Companies Act / SEBI LODR Reg. 30 (24h)** — so the map is complete for listed/BFSI entities.
2. **`audit-ledger`:** mention **external anchoring** of the chain head (signed checkpoint / write-once store) so an attacker can't recompute the whole chain — a genuinely stronger control the baseline raised.
3. **Capture robustness:** the `agent-autonomy` baseline wrote an empty file; for a formal re-run, have each run verify its output file is non-empty before handing back.

## Part 6 — Limitations
- One model (Sonnet), one prompt per skill, one run each — enough to show direction, not a large-N statistic. The repeatable, high-N part of the eval is the 48 logic tests.
- Grading used objective assertions scored inline; raw outputs are in `skills-eval-workspace/iteration-1/<skill>/{with_skill,baseline}.md` (git-ignored) for inspection.
- With-skill and baseline ran on the same model, so this isolates the *skill's* contribution, not the model's.
