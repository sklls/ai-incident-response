import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSealedFromArgs } from './ledger-cli.mjs';
import { verifyChain } from './ledger.mjs';

test('CLI seals an entry that verifies as the chain head', () => {
  const sealed = buildSealedFromArgs(
    ['--prev','GENESIS','--seq','1','--json','{"actor_type":"agent","action":"opened"}']);
  assert.equal(sealed.seq, 1);
  assert.equal(sealed.prev_hash, 'GENESIS');
  assert.equal(typeof sealed.hash, 'string');
  assert.deepEqual(verifyChain([sealed]), { valid:true, brokenAtSeq:null });
});

test('a non-integer seq is rejected', () => {
  assert.throws(() => buildSealedFromArgs(['--prev','GENESIS','--seq','x','--json','{}']));
});
