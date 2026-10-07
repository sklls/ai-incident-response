import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sha256hex, canonical, sealEntry, verifyChain } from './ledger.mjs';

test('sha256hex matches a known vector', () => {
  assert.equal(sha256hex('abc'),
    'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
});

test('canonical ignores key order and omits hash fields', () => {
  const a = canonical({ b:2, a:1, hash:'x', prev_hash:'y' });
  const b = canonical({ a:1, b:2 });
  assert.equal(a, b);
});

test('a sealed chain verifies', () => {
  const e1 = sealEntry('GENESIS', 1, { action:'opened' });
  const e2 = sealEntry(e1.hash, 2, { action:'severity set S1' });
  assert.deepEqual(verifyChain([e1, e2]), { valid:true, brokenAtSeq:null });
});

test('empty chain is valid', () => {
  assert.deepEqual(verifyChain([]), { valid:true, brokenAtSeq:null });
});

test('tampering with a past entry breaks the chain at its seq', () => {
  const e1 = sealEntry('GENESIS', 1, { action:'opened' });
  const e2 = sealEntry(e1.hash, 2, { action:'approved kill switch' });
  e1.action = 'approved nothing';            // tamper
  const r = verifyChain([e1, e2]);
  assert.equal(r.valid, false);
  assert.equal(r.brokenAtSeq, 1);
});
