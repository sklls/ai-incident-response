import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadSeed } from './seed.mjs';

test('seed loads three valid incidents and their evidence', () => {
  const { incidents, evidence } = loadSeed();
  assert.equal(incidents.length, 3);
  assert.deepEqual(incidents.map(i => i.id).sort(), ['INC-023','INC-024','INC-025']);
  for (const id of ['INC-023','INC-024','INC-025'])
    assert.ok(evidence.some(e => e.incident_id === id), `evidence for ${id}`);
});

test('every seeded doc passes schema validation', () => {
  assert.doesNotThrow(() => loadSeed());
});
