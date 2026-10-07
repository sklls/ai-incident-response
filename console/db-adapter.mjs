// Thin wrapper over the Artifact `db` capability (contract 0.2.72).
// `db` is the namespace from `await claude.use("db")`. Returns null-safe helpers.

export function makeAdapter(db) {
  const col = (name) => db.collection(name);
  return {
    // one-shot reads
    async listIncidents() {
      const s = await col('incidents').get();
      return s.docs.map(d => d.data());
    },
    async getEvidence(id) {
      const s = await col('evidence').where('incident_id', '==', id).get();
      return s.docs.map(d => d.data());
    },
    async getApprovals(id) {
      const s = await col('approvals').where('incident_id', '==', id).get();
      return s.docs.map(d => d.data());
    },
    async listLedger(id) {
      const s = await col('ledger').where('incident_id', '==', id).get();
      return s.docs.map(d => d.data()).sort((a, b) => a.seq - b.seq);
    },
    // writes
    appendLedger(entry) {
      return col('ledger').doc(`${entry.incident_id}:${entry.seq}`).set(entry);
    },
    updateIncident(id, patch) {
      return col('incidents').doc(id).update(patch);
    },
    setApproval(id, patch) {
      return col('approvals').doc(id).update(patch);
    },
    // live subscriptions
    onIncidents(cb, err) {
      return col('incidents').onSnapshot(s => cb(s.docs.map(d => d.data())), err);
    },
    onLedger(id, cb, err) {
      return col('ledger').where('incident_id', '==', id)
        .onSnapshot(s => cb(s.docs.map(d => d.data()).sort((a, b) => a.seq - b.seq)), err);
    },
    onApprovals(id, cb, err) {
      return col('approvals').where('incident_id', '==', id)
        .onSnapshot(s => cb(s.docs.map(d => d.data())), err);
    },
  };
}
