---
name: incident-contain
description: Use when an incident needs the harm stopped before the cause is understood — a chatbot still leaking, a hiring model still auto-rejecting, a finance agent still paying — and you must halt it safely and only with a human's approval.
---

## Orient
Stop the bleeding first; understand it later. Choose the least-damaging move that halts the harm, and act only on a human-approved record.

## The knowledge
Containment is the phase where governance is tested, because it is the first irreversible-feeling action and it happens under time pressure with incomplete information. The discipline is to separate *stopping* from *fixing*: you do not wait to understand the root cause while harm continues. But containment is not one move — it has a **shape** that the specialist chooses, and getting the shape wrong causes its own harm. A privacy leak is shut down. A biased model is **not** shut down (that denies service to everyone); instead its decisions are routed to a human. A runaway agent has its access revoked. Choosing "shut it all down" for a fairness case is a containment failure even though it feels safe.

The control vocabulary comes from **EY's agentic guardrails** (guardrail 6: human escalation with approval thresholds and a kill-switch) and **OpenAI's System Card §3**, which reports confirmation flows strong enough to require "100% confirmation before completing financial transactions". **Google SAIF** adds the principle of extending detection-and-response to the AI itself, so an agent's rogue actions are isolated the way you'd isolate a compromised host. The governing constraint is absolute: the commander may *propose* containment, but the action fires only when `approval-gate` reads an `approved` record. This makes a tested incident playbook live rather than theoretical.

### Sources
EY Agentic AI Governance (guardrail 6 — human escalation, kill-switch); OpenAI ChatGPT Agent System Card §3 (confirmation flows); Google Secure AI Framework (detection & response for AI).

## Reads
the live `incidents` record; the specialist's recommended containment shape; `approvals`.

## Procedure
1. Ask the scenario specialist for the containment **shape** (shut down / route to human / revoke access).
2. Propose the specific action with its blast radius and open `approval-gate` (**GATE** — pause for a human).
3. On an `approved` record only, execute the containment and append a `ledger{agent: done}` entry.
4. If `rejected`, hold; propose an alternative or escalate per `severity-matrix`.

## The test
Act only when `decideGate(request, approvals)` returns `proceed`. Pending → hold. No record, no action.

## Writes
an approved, recorded containment action onto the incident; `approvals` and `ledger` entries.

## Worked example
Finance agent overpaying → specialist says revoke authority → propose "freeze outbound payments, reach: every payment" → gate → on approval, freeze and log.

## Failure modes
If no containment can halt the harm without unacceptable collateral, it escalates rather than guessing. It never shuts down a fairness model (denies everyone) and never acts on a verbal approval.

## Done when
the harm is halted, the action and its human approval are on the record, and the case is safe to investigate.

## Connect
Called by `incident-commander` after triage. Takes the shape from the Tier-2 specialist; uses `approval-gate` + `audit-ledger`. Hands a stabilised case to `incident-investigate`.
