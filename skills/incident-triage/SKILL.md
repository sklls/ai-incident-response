---
name: incident-triage
description: Use when a new AI incident report arrives — a customer complaint, a monitoring alert, an internal flag — and you need to classify what kind of failure it is, score how serious, and put an owner on it before anyone starts fixing.
---

## Orient
Classify the failure, size the harm, and name an owner — fast — so the rest of the response pushes at the right urgency. When scope is unknown, round up.

## The knowledge
Triage is a classification problem, and the classification drives everything downstream: which specialist is consulted, how hard everyone pushes, and which legal clocks start. Two taxonomies do the work. The **OECD common AI-incident definition** sorts harm into four buckets — harm to persons, disruption of critical infrastructure, violation of rights or law, and harm to property or the environment — which is the interoperable language regulators now use. The **NIST AI 600-1 GenAI Profile** gives a finer 12-risk tagging (data privacy, harmful bias, information security, confabulation, human-AI configuration, and so on) that points at the right specialist.

The hardest triage judgment is **scope under uncertainty**. A privacy report often arrives as "a customer saw someone else's data" with no idea whether it hit one session or ten thousand. The disciplined move is to treat unknown blast radius as the worst case, not the best — a principle borrowed from safety engineering and encoded in the severity score. Under-triage is the more dangerous error: a real emergency filed as routine loses the containment window and blows the notification clocks. Triage also assigns a **named owner** at once, because the enterprise "10 program questions" and the manager's governance checklist both make ownership non-negotiable — an incident without a name against it drifts, and accountability can't be reconstructed later.

### Sources
OECD common framework for reporting AI incidents (2024); NIST AI 600-1 (GenAI Profile, 12 risks); the "blast radius" concept (EY/agentic terminology); manager's 10 governance questions (Session 2); enterprise program-question "tiers".

## Reads
the incident report; a first look at the `evidence` headers; whatever the reporter stated about scope.

## Procedure
1. Classify the `scenario` as `privacy` | `fairness` | `autonomy`; tag the OECD harm type and the NIST 600-1 risk id.
2. Gather the four severity inputs (spread, data sensitivity, reversibility, ongoing) and call `severity-matrix`.
3. Assign a named owner; write `scope` in plain words, marking any part still unknown.
4. Log intake, classification, and severity to the `ledger`.

## The test
Severity comes from `scoreSeverity(...)` (see `severity-matrix`); unknown spread is scored as the worst case.

## Writes
`scenario`, `severity`, `owner`, `scope` onto the `incidents` record, plus an opening `ledger` entry.

## Worked example
"The chatbot showed me another customer's order history." → classify **privacy**; scope unknown (one chat or many?); unknown → worst case → **S1**; assign owner; log.

## Failure modes
When the report is too thin to classify, it asks the reporter targeted questions rather than guessing the type. It never downgrades an unknown-scope incident to look calmer.

## Done when
the incident has a type, a severity, an owner, and a scope statement — and the specialist for that type can take over.

## Connect
Called first by `incident-commander`. Consults the matching Tier-2 specialist for intake questions, and uses `severity-matrix`. Hands a scored, owned case to `incident-contain`.
