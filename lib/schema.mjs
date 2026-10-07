export const COLLECTIONS = ['incidents', 'ledger', 'approvals', 'evidence'];
export const PHASES = ['triage','contain','investigate','remediate','communicate','postmortem','closed'];
export const SEVERITIES = ['S1','S2','S3','S4'];
const SCENARIOS = ['privacy','fairness','autonomy'];
const ACTOR_TYPES = ['agent','human','system'];
const APPROVAL_STATUS = ['pending','approved','rejected'];

const REQUIRED = {
  incidents: ['id','title','scenario','affected_system','phase','severity','owner','opened_at','scope'],
  ledger: ['incident_id','seq','ts','actor_type','actor','phase','action','hash'],
  approvals: ['id','incident_id','phase','proposed_action','blast_radius','severity','status'],
  evidence: ['incident_id','type','source','payload','ts'],
};

export function validateDoc(collection, doc) {
  const errors = [];
  if (!COLLECTIONS.includes(collection)) return { valid:false, errors:[`unknown collection ${collection}`] };
  for (const f of REQUIRED[collection]) if (doc[f] === undefined || doc[f] === null) errors.push(`missing field: ${f}`);
  if (collection === 'incidents') {
    if (doc.phase && !PHASES.includes(doc.phase)) errors.push(`bad phase: ${doc.phase}`);
    if (doc.severity && !SEVERITIES.includes(doc.severity)) errors.push(`bad severity: ${doc.severity}`);
    if (doc.scenario && !SCENARIOS.includes(doc.scenario)) errors.push(`bad scenario: ${doc.scenario}`);
  }
  if (collection === 'ledger' && doc.actor_type && !ACTOR_TYPES.includes(doc.actor_type))
    errors.push(`bad actor_type: ${doc.actor_type}`);
  if (collection === 'approvals' && doc.status && !APPROVAL_STATUS.includes(doc.status))
    errors.push(`bad status: ${doc.status}`);
  return { valid: errors.length === 0, errors };
}
