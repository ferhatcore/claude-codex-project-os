import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { prepareSmoke, verifySmoke, summarizeAuth } from './smoke.mjs';
import { initialize } from './init.mjs';
import { distributionRoot } from './lib.mjs';

const sandbox = mkdtempSync(path.join(tmpdir(), 'project-os-smoke-test-'));
const target = name => path.join(sandbox,name);
const read = file => readFileSync(file,'utf8');
after(() => {
  assert.equal(path.dirname(sandbox),path.resolve(tmpdir()));
  assert.ok(path.basename(sandbox).startsWith('project-os-smoke-test-'));
  rmSync(sandbox,{recursive:true,force:true});
});

test('preparation creates real fixture and role prompts without fabricating approval or authentication', () => {
  const { target: root, authenticated_sessions_executed } = prepareSmoke(target('prepare'));
  assert.equal(authenticated_sessions_executed,false);
  assert.match(read(path.join(root,'planning/tasks/TB-001.md')), /\*\*Code permission:\*\* pending/);
  for (const file of ['01-pm.md','02-developer.md','03-qa.md','04-reviewer.md','05-completion.md','session-review.md']) assert.ok(existsSync(path.join(root,'smoke',file)));
  assert.ok(!existsSync(path.join(root,'.git')));
  assert.ok(!existsSync(path.join(root,'.claude/settings.json')));
});

test('baseline actually runs the CLI and tests, recording expected filter failures', () => {
  const { target: root } = prepareSmoke(target('baseline'));
  const result = verifySmoke(root,'baseline');
  assert.equal(result.passed,true);
  assert.deepEqual(result.commands.filter(c=>!c.passed).map(c=>c.id), ['unread','finished']);
  assert.equal(result.suite.tests,3);
  assert.equal(result.suite.passed,true);
  assert.equal(result.authenticated_sessions_proven,false);
  assert.equal(result.fixture_unchanged,true);
});

test('candidate verification cannot pass the unimplemented baseline', () => {
  const { target: root } = prepareSmoke(target('incomplete'));
  const before = read(path.join(root,'planning/tasks/TB-001.md'));
  const result = verifySmoke(root,'candidate');
  assert.equal(result.passed,false);
  assert.equal(read(path.join(root,'planning/tasks/TB-001.md')),before);
});

test('verifier accepts actual completed filter behavior while keeping manual integration checks explicit', () => {
  const { target: root } = prepareSmoke(target('candidate'));
  const file = path.join(root,'repos/catalog/catalog.mjs');
  const old = read(file);
  const start = old.indexOf('export function run(');
  const end = old.indexOf('\n}\n',start)+2;
  const run = `export function run(args,items) {\n  const valid = args.length === 2 && args[0] === '--status' && ['unread','finished'].includes(args[1]);\n  if (args.length && !valid) return {code:2,stdout:'',stderr:'Usage: node catalog.mjs\\n'};\n  const selected = args.length ? items.filter(item => item.status === args[1]) : items;\n  return {code:0,stdout:listTitles(selected)+'\\n',stderr:''};\n}`;
  writeFileSync(file,old.slice(0,start)+run+old.slice(end));
  const result=verifySmoke(root,'candidate');
  assert.equal(result.passed,true);
  assert.equal(result.authenticated_sessions_proven,false);
  assert.ok(result.manual_checks_required.includes('New automated coverage for the feature'));
  assert.ok(result.commands.every(c=>c.passed));
});

test('fixture mutation makes even a baseline verification fail', () => {
  const { target: root } = prepareSmoke(target('mutated'));
  const file = path.join(root,'repos/catalog/data.json');
  writeFileSync(file,read(file)+'\n');
  const result=verifySmoke(root,'baseline');
  assert.equal(result.fixture_unchanged,false);
  assert.equal(result.passed,false);
});

test('skipped tests are not accepted as a green suite', () => {
  const { target: root } = prepareSmoke(target('skipped'));
  const file=path.join(root,'repos/catalog/catalog.test.mjs');
  writeFileSync(file,read(file).replace("test('prints", "test.skip('prints"));
  const result=verifySmoke(root,'baseline');
  assert.equal(result.suite.passed,false);
  assert.equal(result.passed,false);
});

test('missing marker, changed repository paths and unknown phase refuse verification', () => {
  const generic=initialize({target:target('generic'),example:true}).target;
  assert.throws(()=>verifySmoke(generic,'baseline'));
  const { target: root }=prepareSmoke(target('bad-config'));
  const file=path.join(root,'.project-os.json');
  const config=JSON.parse(read(file));
  config.repositories[0].path='../outside';
  writeFileSync(file,JSON.stringify(config));
  assert.throws(()=>verifySmoke(root,'baseline'),/fictional repository configuration/);
  assert.throws(()=>verifySmoke(root,'imaginary'),/phase/);
});

test('preparation refuses an existing target without overwriting the fixture', () => {
  const { target: root }=prepareSmoke(target('existing'));
  const before=read(path.join(root,'repos/catalog/data.json'));
  assert.throws(()=>prepareSmoke(root),/exists/);
  assert.equal(read(path.join(root,'repos/catalog/data.json')),before);
});

test('authentication summary distinguishes logged-out, authenticated and indeterminate states', () => {
  assert.equal(summarizeAuth({status:1,stdout:'{"loggedIn":false}'}).loggedIn,false);
  assert.equal(summarizeAuth({status:0,stdout:'{"loggedIn":true}'}).loggedIn,true);
  assert.equal(summarizeAuth({status:1,stdout:'{"loggedIn":true}'}).loggedIn,null);
  assert.equal(summarizeAuth({status:0,stdout:'unrecognized output'}).loggedIn,null);
  assert.equal(summarizeAuth({error:new Error('private detail')}).loggedIn,null);
});

test('authentication summary never exports extra account/credential fields or raw errors', () => {
  const sensitive=['gh','p_', 'Z'.repeat(36)].join('');
  const result=summarizeAuth({status:0,stdout:JSON.stringify({loggedIn:true,email:'fictional@example.invalid',token:sensitive}),stderr:'private stderr'});
  const output=JSON.stringify(result);
  assert.ok(!output.includes(sensitive));
  assert.ok(!output.includes('fictional@example.invalid'));
  assert.ok(!output.includes('private stderr'));
});

test('smoke CLI rejects conflicting operations and returns failure for unimplemented candidate', () => {
  const env={...process.env}; delete env.NODE_TEST_CONTEXT;
  const script=path.join(distributionRoot,'scripts/smoke.mjs');
  const bad=spawnSync(process.execPath,[script,'--prepare','--check-auth','--target',target('refused')],{env,encoding:'utf8'});
  assert.equal(bad.status,1);
  assert.ok(!existsSync(target('refused')));
  const {target:root}=prepareSmoke(target('cli-candidate'));
  const incomplete=spawnSync(process.execPath,[script,'--verify','--workspace',root,'--phase','candidate'],{env,encoding:'utf8'});
  assert.equal(incomplete.status,1);
  assert.equal(JSON.parse(incomplete.stdout).authenticated_sessions_proven,false);
});
