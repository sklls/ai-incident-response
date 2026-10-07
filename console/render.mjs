import { verifyChain } from '../lib/ledger.mjs';

const esc = (s) => String(s ?? '').replace(/[&<>]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;' }[c]));
const PHASES = ['triage','contain','investigate','remediate','communicate','postmortem','closed'];

export function renderQueue(incidents) {
  if (!incidents || incidents.length === 0) return `<p class="empty">No active incidents</p>`;
  return incidents.map(i =>
    `<button class="qrow sev-${esc(i.severity)}" data-id="${esc(i.id)}">
       <span class="sev">${esc(i.severity)}</span>
       <span class="qid">${esc(i.id)}</span>
       <span class="qtitle">${esc(i.title)}</span>
       <span class="qscn">${esc(i.scenario)}</span>
     </button>`).join('');
}

export function renderLedger(entries) {
  const v = verifyChain(entries || []);
  const badge = v.valid
    ? `<span class="chain ok">⛓ verified</span>`
    : `<span class="chain broken">⛓ BROKEN @seq ${esc(v.brokenAtSeq)}</span>`;
  const rows = (entries || []).map(e =>
    `<tr class="actor-${esc(e.actor_type)}">
       <td>${esc(e.seq)}</td><td>${esc(e.ts || '')}</td>
       <td>${esc(e.actor_type)}:${esc(e.actor || '')}</td>
       <td>${esc(e.action)}</td><td>${esc(e.rationale || '')}</td>
     </tr>`).join('');
  return `<div class="ledger">${badge}
    <table><thead><tr><th>#</th><th>time</th><th>actor</th><th>action</th><th>rationale</th></tr></thead>
    <tbody>${rows}</tbody></table></div>`;
}

export function renderApprovalCard(pending) {
  if (!pending) return `<p class="empty">No pending approvals</p>`;
  return `<div class="approval">
    <div class="atag">⚠ PENDING</div>
    <div>Proposed: <b>${esc(pending.proposed_action)}</b></div>
    <div>Blast radius: ${esc(pending.blast_radius)} · Sev ${esc(pending.severity)}</div>
    <textarea id="rationale" placeholder="rationale (recorded in the ledger)"></textarea>
    <div class="abtns">
      <button id="approve" data-id="${esc(pending.id)}">APPROVE</button>
      <button id="reject" data-id="${esc(pending.id)}">REJECT</button>
    </div>
  </div>`;
}

export function renderIncidentDetail(incident, ledger) {
  if (!incident) return `<p class="empty">Select an incident</p>`;
  const stepper = PHASES.map(p =>
    `<span class="step ${p === incident.phase ? 'active' : ''}">${p}</span>`).join('<i>›</i>');
  const obList = incident.obligations || [];
  const obligations = obList.map(o =>
    `<li>${esc(o.regulation)}: ${esc(o.requirement)}${o.deadline ? ` · ⏱ ${esc(o.deadline)}` : ''}</li>`).join('');
  const withDeadline = obList.find(o => o.deadline);
  const countdown = withDeadline
    ? `<div class="countdown" data-deadline="${esc(withDeadline.deadline)}">⏱ calculating…</div>` : '';
  return `<h2>${esc(incident.id)} · ${esc(incident.title)}</h2>
    <div class="stepper">${stepper}</div>
    <div class="meta">Severity <b class="sev-${esc(incident.severity)}">${esc(incident.severity)}</b> · Scope ${esc(incident.scope)}</div>
    <div class="rootcause"><b>Root cause:</b> ${incident.root_cause ? esc(incident.root_cause) : 'pending investigation…'}</div>
    ${obligations ? `<div class="obl"><b>⚖ Obligations</b><ul>${obligations}</ul>${countdown}</div>` : ''}`;
}
