import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { listTitles, run } from './catalog.mjs';

const items = JSON.parse(readFileSync(new URL('./data.json', import.meta.url), 'utf8'));

test('prints every fixture title in source order', () => {
  const result = run([], items);
  assert.equal(result.code, 0);
  assert.equal(result.stderr, '');
  assert.equal(result.stdout, 'Walking the Northern Trail\nA Guide to Small Gardens\nNotes from a Quiet Workshop\n');
});

test('invalid arguments have nonzero status, usage and no normal output', () => {
  assert.deepEqual(run(['--unknown'], items), { code: 2, stdout: '', stderr: 'Usage: node catalog.mjs\n' });
});

test('listing does not mutate its fixture input', () => {
  const before = structuredClone(items);
  listTitles(items);
  assert.deepEqual(items, before);
});
