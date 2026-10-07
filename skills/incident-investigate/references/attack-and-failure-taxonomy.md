# Attack & failure taxonomy — reference (incident-investigate)

Read the evidence against three layers so the search is structured, not ad hoc.

## Layer 1 — Attack (MITRE ATLAS / NIST AML)
| NIST AML class | What it does | Look for |
|---|---|---|
| Evasion | crafted input fools the model at inference | adversarial/odd inputs near decision boundary |
| Poisoning | training data/model tampered | bad labels, backdoors, suspicious data sources |
| Privacy | extract data from the model | probing, membership inference, verbatim output |
| Abuse | misuse the system's own capabilities | **prompt injection**, jailbreaks, tool misuse |
MITRE ATLAS maps real techniques & case studies onto these.

## Layer 2 — LLM application (OWASP Top 10 for LLMs 2025)
LLM01 prompt injection · LLM02 sensitive-info disclosure · LLM03 supply chain · LLM04 data/model poisoning · LLM05 improper output handling · **LLM06 excessive agency** · LLM07 system-prompt leakage · LLM08 vector/embedding weaknesses · LLM09 misinformation · LLM10 unbounded consumption.

## Layer 3 — Model performance (IBM, six threats)
| Threat | Tell | Example |
|---|---|---|
| Data quality | duplicates, missing, wrong labels | — |
| **Data leakage** | training saw info unavailable at inference | COVID X-ray models learned hospital logos |
| Feature selection | irrelevant / missing inputs | — |
| Model fit | over/underfitting | memorised training data |
| **Drift** | world changed, performance decayed | Zillow Offers 2021 |
| Bias | unrepresentative data | subgroup failure |

## The agent look-alikes (separate before fixing)
Misconfiguration vs software defect vs **prompt injection** — read the tool-call log against the inputs. Anthropic: harmful compliance (user-requested) vs agentic misalignment (agent's own goal).

## Explainability = evidence
SHAP (Shapley feature attribution) and LIME (local per-prediction reasons) locate a bias proxy and give the affected person the reason the law requires.
