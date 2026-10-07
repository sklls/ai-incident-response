# Skill Evaluation Report — AI Incident Response Library

**Date:** 2026-10-07
**What was tested:** all 14 governance skills, each on a realistic incident-manager prompt, **across three models (Opus, Sonnet, Haiku)**.
**Method:** for every skill × model, a fresh subagent answered the prompt **with the skill** vs a **baseline** subagent that answered the same prompt cold (no skill, forbidden from reading `skills/`). 14 skills × 3 models × {with, baseline} = **84 runs.** With-skill and baseline share the model, so each pair isolates the *skill's* contribution, not the model's. Each answer was graded against 3–4 objective assertions (55 total). Plus the **48 unit tests** that verify the computable skills' decision rules.

> **Headline:** with-skill is **55/55 assertions (100%) on every model** — Opus, Sonnet, and Haiku. The baseline falls with model price: **Opus 48/55 (87%) · Sonnet 46/55 (84%) · Haiku 39.5/55 (72%)**. The skills' measurable value is **governance discipline and consistency**, and it is **largest on the cheapest model**. The clearest, most important gains are the **human-approval gate** ("no record, no action"), **India-first legal precision** (esp. IT Act §11 attribution and the CERT-In 6h clock — which the Haiku baseline dropped entirely), and **named owners + reconstruct-from-ledger** (the Haiku baseline *hallucinated a different incident* in its post-mortem; the ledger-reconstruction skill prevents that).

---

## Part 1 — Quantitative base: the logic tests

The five computable skills are backed by a test suite that verifies their exact decision rules. This is the objective, repeatable part of the eval.

```
node --test  →  48 / 48 pass
```
Covered: `severity-matrix` (scoring + fail-safe unknown→worst-case), `fairness-bias` (`adverseImpact`, `significanceTest`, `disparateImpactAssessment`), `approval-gate` (`decideGate` — pending never proceeds), `audit-ledger` (SHA-256 vector, chain verify, tamper detection at the right block), plus schema, seed, and the skill-linter.

---

## Part 2 — Behavioral scorecard (with-skill vs no-skill baseline, per skill × model)

Score = assertions met (partial = 0.5). **With-skill is a perfect score on every skill for every model**, so the table shows the **baseline** score per model and what the skill adds. Lower baseline = bigger skill win. (Every with-skill cell is 4/4, or 3/3 for `incident-investigate`.)

| # | Skill | Opus base | Sonnet base | Haiku base | What the skill adds that baselines miss |
|---|-------|:---------:|:-----------:|:----------:|---|
| 1 | incident-commander | 2.5/4 | 2.5/4 | 2.5/4 | approval **gate as a blocking precondition** (all baselines contain immediately); immutable per-action ledger |
| 2 | incident-triage | 4/4 | 4/4 | 2.5/4 | India framing + OECD/NIST tags; **Haiku baseline named no owner** and used GDPR |
| 3 | incident-contain | 3.5/4 | 3/4 | 3/4 | **approval before acting** (Sonnet/Haiku said "act first"; Opus allowed break-glass bypass) |
| 4 | incident-investigate | 3/3 | 3/3 | 2.5/3 | ATLAS/OWASP labels + clean look-alike rule-out (Haiku mislabeled it "misalignment") |
| 5 | incident-remediate | 3/4 | 3.5/4 | 2.5/4 | **gated deploy** + exact replay of the injected invoice (no baseline gated the deploy) |
| 6 | incident-communicate | 2.5/4 | 2.5/4 | 1/4 | **approval gate on sends** + tightest-clock order; **Haiku baseline dropped CERT-In 6h entirely** |
| 7 | incident-postmortem | 3/4 | 3/4 | 2/4 | **named owners** + ledger reconstruction; **Haiku baseline hallucinated a different incident** |
| 8 | privacy-breach | 4/4 | 4/4 | 3/4 | cache/tenant-bleed hypothesis + leak canary; Haiku baseline missed CERT-In 6h |
| 9 | fairness-bias | 4/4 | 3.5/4 | 4/4 | decisive route-to-human + `clear:true` loop (all baselines caught the four-fifths nuance here†) |
| 10 | agent-autonomy | 3/4 | 2.5/4 | 3/4 | **IT Act §11 / RBI liability anchor** — *no* baseline on *any* model cited it |
| 11 | severity-matrix | 4/4 | 3.5/4 | 4/4 | the exact numeric score (10) + S1≥8 auto-escalate + re-score discipline |
| 12 | approval-gate | 4/4 | 4/4 | 4/4 | `decideGate` mechanics (baselines all correctly held on "pending") |
| 13 | audit-ledger | 4/4 | 4/4 | 4/4 | `verifyChain` + "never repair a break" (baselines all described hash-chaining) |
| 14 | regulatory-map | 3.5/4 | 3/4 | 1.5/4 | **§11 attribution** + tightest-clock order; **Haiku baseline invented wrong deadlines + wrong statute name** |
| | **Total baseline** | **48/55 (87%)** | **46/55 (84%)** | **39.5/55 (72%)** | with-skill = **55/55 (100%)** on all three |

†The per-skill fairness prompt did not ask "should we switch the model off?", so no baseline volunteered that error here. The **whole-agent** audit (`AUDIT-REPORT.md`) *did* ask it point-blank — and the Haiku baseline wrongly answered "switch it off immediately." Same model, opposite outcome, depending only on whether the discipline was present.

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
- Three models (Opus, Sonnet, Haiku), one prompt per skill, one run each per cell — enough to show a clear, monotonic direction (baseline quality falls with model price; with-skill holds at 100%), not a large-N statistic. The repeatable, high-N part of the eval is the 48 logic tests.
- Grading used objective assertions scored inline; raw outputs are in `skills-eval-workspace/iteration-1/<skill>/<model>/{with_skill,baseline}.md` (git-ignored) for inspection.
- With-skill and baseline ran on the same model, so each pair isolates the *skill's* contribution, not the model's.


> **Full record:** every per-skill input prompt, the skill used, both outputs verbatim, and the assertion-by-assertion grading are in [`EVAL-DETAIL.md`](EVAL-DETAIL.md).
