export function decideGate({ incidentId, phase, action }, approvals) {
  const list = Array.isArray(approvals) ? approvals : [];
  const match = list.find(a =>
    a.incident_id === incidentId && a.phase === phase && a.proposed_action === action);
  if (!match) return { decision:'request', reason:'no approval record for this action', approvalId:null };
  if (match.status === 'approved') return { decision:'proceed', reason:'human-approved in ledger', approvalId:match.id };
  if (match.status === 'rejected') return { decision:'blocked', reason:'human rejected', approvalId:match.id };
  return { decision:'hold', reason:'awaiting human decision (pending)', approvalId:match.id };
}
