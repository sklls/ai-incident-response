---
name: incident-triage
description: Intake a reported AI incident, classify its scenario, score severity, and assign an owner.
---

## Framework enforced
NIST AI 600-1 risk tagging; **OECD AI-incident harm taxonomy** (persons / critical infrastructure / rights-&-law / property-environment); "blast radius" sizing; manager's governance Q1 (purpose/failure) and Q10 (named owner). Program-question "tiers".

## When to use
First phase of every incident, immediately on intake.

## DB interactions
Reads the incident report + `evidence` headers; writes `scenario`, `severity`, `owner`, `scope` to the `incidents` doc; appends a `ledger` entry.

## Steps
1. Read the report; classify `scenario` as `privacy` | `fairness` | `autonomy`, and tag the **OECD harm type** + NIST AI 600-1 risk category.
2. Consult the matching specialist (`privacy-breach` | `fairness-bias` | `agent-autonomy`) for the intake questions that size the harm.
3. Call `severity-matrix` to set S1–S4 (unknown scope → worst-case).
4. Assign the owner (`IR-Commander` for the demo) and write `scope`.
5. Append a `ledger` entry: incident opened, scenario, severity, rationale.
