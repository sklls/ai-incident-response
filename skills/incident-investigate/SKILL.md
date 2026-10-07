---
name: incident-investigate
description: Find the root cause by reasoning over the evidence pack, using the scenario specialist's analysis.
---

## Framework enforced
Anthropic agentic-misalignment taxonomy (harmful compliance vs misalignment); OWASP LLM01/LLM06; **MITRE ATLAS** (adversarial tactics/techniques) + **NIST adversarial-ML** classes (evasion, poisoning, privacy, abuse) for attack attribution; IBM's six model-performance threats; explainability via LIME/SHAP.

## When to use
After containment, when the harm is stopped and it is safe to analyze.

## DB interactions
Reads `evidence` for the incident; writes `root_cause` onto the `incidents` doc; appends a `ledger` entry.

## Steps
1. Pull the incident's `evidence` docs (logs, config, metrics, data samples).
2. Apply the specialist's analysis: privacy → cache/tenant-scoping; fairness → proxy feature + four-fifths **+ significance**; autonomy → injection vs misconfig vs defect, classified against **MITRE ATLAS** techniques and the NIST adversarial-ML class.
3. State the root cause plainly and write it to `root_cause`.
4. Append a `ledger` entry citing the evidence that supports the conclusion.
