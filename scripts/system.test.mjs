import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, symlinkSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { initialize } from './init.mjs';
import { validate } from './check.mjs';
import { distributionRoot, configErrors, parseArgs, taskErrors, scanText, releaseErrors, walk } from './lib.mjs';

const sandbox = mkdtempSync(path.join(tmpdir(), 'project-os-test-'));
const target = name => path.join(sandbox, name);
const load = file => JSON.parse(readFileSync(file, 'utf8'));
const writeJSON = (file, value) => writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
const runNode = (args, cwd = distributionRoot) => {
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  return spawnSync(process.execPath, args, { cwd, env, encoding: 'utf8', timeout: 15000 });
};

after(() => {
  // Remove only the exact mkdtemp directory created by this suite.
  assert.equal(path.dirname(sandbox), path.resolve(tmpdir()));
  assert.ok(path.basename(sandbox).startsWith('project-os-test-'));
  rmSync(sandbox, { recursive: true, force: true });
});

test('distribution has required files, consistent links, configs and task metadata', () => {
  assert.deepEqual(validate().errors, []);
});

test('generic setup installs PM controls, preserves a plain Unicode name and creates no services or Git', () => {
  const result = initialize({ target: target('generic'), name: 'Örnek Project' });
  const config = load(path.join(result.target, '.project-os.json'));
  assert.equal(config.project.name, 'Örnek Project');
  assert.equal(config.profile, 'lean');
  assert.equal(config.budget.max_active_workers, 1);
  assert.deepEqual(config.repositories, []);
  assert.ok(!existsSync(path.join(result.target, '.git')));
  assert.ok(!existsSync(path.join(result.target, '.claude/settings.json')));
  assert.deepEqual(validate(result.target, { workspace: true }).errors, []);
});

test('all profiles install the full fictional multi-repository workspace with intended caps', () => {
  for (const [profile, cap] of [['lean',1],['standard',2],['heavy',3]]) {
    const { target: root } = initialize({ target: target(profile), profile, example: true });
    const config = load(path.join(root, '.project-os.json'));
    assert.equal(config.budget.max_active_workers, cap);
    assert.equal(config.advanced_review.enabled, false);
    assert.equal(config.repositories.length, 2);
    assert.deepEqual(validate(root, { workspace: true }).errors, []);
    const cli = runNode(['repos/catalog/catalog.mjs'], root);
    assert.equal(cli.status, 0);
    assert.equal(cli.stdout, 'Walking the Northern Trail\nA Guide to Small Gardens\nNotes from a Quiet Workshop\n');
    const tests = runNode(['--test', 'repos/catalog/catalog.test.mjs'], root);
    assert.equal(tests.status, 0, tests.stderr);
    assert.match(tests.stdout, /tests 3/);
    assert.ok(!existsSync(path.join(root, 'repos/catalog/.git')));
  }
});

test('existing file and directory targets are refused without modifying contents', () => {
  const file = target('existing-file');
  writeFileSync(file, 'preserve me');
  assert.throws(() => initialize({ target: file }), /exists/);
  assert.equal(readFileSync(file, 'utf8'), 'preserve me');
  const dir = target('existing-dir');
  mkdirSync(dir);
  writeFileSync(path.join(dir, 'CLAUDE.md'), 'existing instructions');
  assert.throws(() => initialize({ target: dir, example: true }), /exists/);
  assert.equal(readFileSync(path.join(dir, 'CLAUDE.md'), 'utf8'), 'existing instructions');
});

test('invalid profile, missing parent, invalid name and missing target fail before writes', () => {
  assert.throws(() => initialize({ target: target('bad-profile'), profile: 'unlimited' }), /Profile/);
  assert.ok(!existsSync(target('bad-profile')));
  assert.throws(() => initialize({ target: target('missing-parent/child') }), /parent/);
  assert.throws(() => initialize({ target: target('bad-name'), name: '\n' }), /name/);
  assert.ok(!existsSync(target('bad-name')));
  assert.throws(() => initialize({}), /target/);
});

test('strict option parsing rejects duplicate, unknown and missing-value arguments', () => {
  const defs = { '--target':'value', '--example':'flag' };
  assert.throws(() => parseArgs(['--target'], defs), /Missing/);
  assert.throws(() => parseArgs(['--target','--example'], defs), /Missing/);
  assert.throws(() => parseArgs(['--example','--example'], defs), /Duplicate/);
  assert.throws(() => parseArgs(['--force'], defs), /Unknown/);
});

test('CLI setup refuses unknown arguments with a nonzero exit', () => {
  const result = runNode(['scripts/init.mjs','--target',target('cli-refusal'),'--force']);
  assert.equal(result.status, 1);
  assert.ok(!existsSync(target('cli-refusal')));
});

test('path traversal, drives, duplicate IDs and missing repository paths are detected', () => {
  const config = load(path.join(distributionRoot, 'examples/trailboard/.project-os.json'));
  for (const bad of ['../outside', '/absolute', 'C:/outside', 'repos/../outside', 'repos\\catalog', '.git/config']) {
    const candidate = structuredClone(config);
    candidate.repositories[0].path = bad;
    assert.ok(configErrors(candidate, target('paths')).some(e => /path|Path/.test(e)));
  }
  config.repositories[1].id = 'catalog';
  assert.ok(configErrors(config, target('paths'), true).some(e => /duplicate repository ID/.test(e)));
  assert.ok(configErrors(config, target('paths'), true).some(e => /path missing/.test(e)));
});

test('symlink ancestors and symlinks inside installed controls are refused', () => {
  const actual = target('link-destination');
  mkdirSync(actual);
  const link = target('ancestor-link');
  symlinkSync(actual, link, process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => initialize({ target: path.join(link, 'child') }), /Symbolic/);
  assert.ok(!existsSync(path.join(actual, 'child')));
  const { target: root } = initialize({ target: target('linked-workspace') });
  symlinkSync(actual, path.join(root, 'outside'), process.platform === 'win32' ? 'junction' : 'dir');
  assert.ok(validate(root, { workspace: true }).errors.some(e => /Symbolic/.test(e)));
});

test('threshold contradictions, nonboolean flags, unsupported tiers and unknown config fields fail', () => {
  const config = load(path.join(distributionRoot, 'templates/workspace/.project-os.json'));
  config.budget.usage.short_window_red_percent = 40;
  config.advanced_review.required_before_final_rules = true;
  config.models.deep.effort = 'imaginary';
  config.capabilities.mode = 'integration';
  config.extra = true;
  const errors = configErrors(config, sandbox);
  assert.ok(errors.some(e => /thresholds/.test(e)));
  assert.ok(errors.some(e => /cannot be disabled/.test(e)));
  assert.ok(errors.some(e => /effort/.test(e)));
  assert.ok(errors.some(e => /verified tools/.test(e)));
  assert.ok(errors.some(e => /unknown field/.test(e)));
});

test('a broken Markdown link and anchor make installed validation fail', () => {
  const { target: root } = initialize({ target: target('broken-link') });
  writeFileSync(path.join(root,'extra.md'), '# Example\n\n[missing](no-such-file.md)\n[bad anchor](README.md#does-not-exist)\n');
  const errors = validate(root, { workspace: true }).errors;
  assert.ok(errors.some(e => /broken local link/.test(e)));
  assert.ok(errors.some(e => /broken anchor/.test(e)));
});

test('ordinary documentation rejects unresolved field markers', () => {
  const { target: root } = initialize({ target: target('marker') });
  writeFileSync(path.join(root,'extra.md'), '# Example\n\n' + '{' + '{UNFILLED_FIELD}' + '}\n');
  assert.ok(validate(root, { workspace: true }).errors.some(e => /template marker/.test(e)));
});

test('secret patterns and private denylist fail without printing the matched value', () => {
  const { target: root } = initialize({ target: target('secret') });
  const synthetic = ['gh','p_', 'A'.repeat(36)].join('');
  writeFileSync(path.join(root,'leak.md'), `# Synthetic negative-test input\n${synthetic}\n`);
  const errors = validate(root, { workspace: true }).errors;
  assert.ok(errors.some(e => /provider token/.test(e)));
  assert.ok(errors.every(e => !e.includes(synthetic)));
  assert.deepEqual(scanText('fictional private sentinel', ['private sentinel']), ['private identifier']);
});

test('task status mismatch, duplicate hand-off and premature done are caught', () => {
  const source = readFileSync(path.join(distributionRoot, 'examples/trailboard/planning/tasks/TB-001.md'), 'utf8');
  assert.ok(taskErrors(source.replace('- status: todo','- status: qa')).some(e => /status differ/.test(e)));
  assert.ok(taskErrors(source + '\n## Hand-off\n').some(e => /exactly one Hand-off/.test(e)));
  const done = source.replace('**Status:** todo','**Status:** done').replace('- status: todo','- status: done');
  const errors = taskErrors(done);
  assert.ok(errors.some(e => /approval reference/.test(e)));
  assert.ok(errors.some(e => /not checked/.test(e)));
  assert.ok(errors.some(e => /QA pass/.test(e)));
});

test('release gate refuses unapproved declarations, missing evidence and absent licence', () => {
  const errors = releaseErrors({ state: 'candidate', license: 'pending' }, '');
  assert.ok(errors.some(e => /rights_confirmed/.test(e)));
  assert.ok(errors.some(e => /publication_approved/.test(e)));
  assert.ok(errors.some(e => /authenticated_smoke_test/.test(e)));
  assert.ok(errors.some(e => /licence text/.test(e)));
});

test('check CLI returns failure for a genuinely broken workspace', () => {
  const { target: root } = initialize({ target: target('missing-control') });
  rmSync(path.join(root, 'planning/flow.md'));
  const result = runNode(['scripts/check.mjs','--workspace',root]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /required file missing/);
});

test('distribution scanning rejects private local artifacts even when Git would ignore them', () => {
  const root = target('distribution-copy');
  mkdirSync(root);
  for (const file of walk(distributionRoot, { includePrivateFiles: true })) {
    const destination = path.join(root, path.relative(distributionRoot, file));
    mkdirSync(path.dirname(destination), { recursive: true });
    copyFileSync(file, destination);
  }
  writeFileSync(path.join(root,'.env'), 'LOCAL_TEST_VALUE=fictional\n');
  assert.ok(validate(root).errors.some(e => /private\/local artifact/.test(e)));
});

test('deterministic rehearsal traverses approved build, failed QA, fix and evidenced done offline', () => {
  // Simulated workflow inputs are confined to this disposable fixture.
  // This is not a human approval record or an authenticated AI run.
  const { target: root } = initialize({ target: target('rehearsal'), example: true });
  const taskFile = path.join(root,'planning/tasks/TB-001.md');
  let task = readFileSync(taskFile,'utf8')
    .replace('**Scope approval:** pending','**Scope approval:** given: synthetic test input, local fixture only')
    .replace('**Code permission:** pending','**Code permission:** given: synthetic test input, local fixture only');
  const transition = status => {
    task = task.replace(/\*\*Status:\*\* \w+/, `**Status:** ${status}`).replace(/^- status: \w+$/m, `- status: ${status}`);
    writeFileSync(taskFile, task);
    assert.deepEqual(validate(root, { workspace: true }).errors, []);
  };
  transition('in_progress');
  transition('qa');
  const catalog = path.join(root,'repos/catalog');
  const fixture = readFileSync(path.join(catalog,'data.json'),'utf8');
  const initiallyRejected = runNode(['catalog.mjs','--status','unread'], catalog);
  assert.equal(initiallyRejected.status, 2); // Actual independent negative result.
  task = task.replace('**Failed review cycles:** 0','**Failed review cycles:** 1');
  transition('qa_failed');
  transition('in_progress');
  const codeFile = path.join(catalog, 'catalog.mjs');
  const old = readFileSync(codeFile, 'utf8');
  const replacement = `export function run(args, items) {\n  const valid = args.length === 2 && args[0] === '--status' && ['unread', 'finished'].includes(args[1]);\n  if (args.length && !valid) return { code: 2, stdout: '', stderr: 'Usage: node catalog.mjs [--status unread|finished]\\n' };\n  const selected = args.length ? items.filter(item => item.status === args[1]) : items;\n  return { code: 0, stdout: listTitles(selected) + '\\n', stderr: '' };\n}`;
  const start = old.indexOf('export function run(');
  const end = old.indexOf('\n}\n', start) + 2;
  assert.ok(start >= 0 && end > start);
  writeFileSync(codeFile, old.slice(0,start) + replacement + old.slice(end));
  writeFileSync(path.join(catalog,'README.md'), '# Catalog rehearsal\n\nSupports --status unread|finished; invalid/missing/duplicate flags exit 2 with usage.\n');
  const baselineTest = path.join(catalog,'catalog.test.mjs');
  let tests = readFileSync(baselineTest,'utf8').replace("'Usage: node catalog.mjs\\n'", "'Usage: node catalog.mjs [--status unread|finished]\\n'");
  tests += `\ntest('status filters and invalid/missing/duplicate inputs', () => {\n  assert.equal(run(['--status','unread'],items).stdout, 'Walking the Northern Trail\\nNotes from a Quiet Workshop\\n');\n  assert.equal(run(['--status','finished'],items).stdout, 'A Guide to Small Gardens\\n');\n  for (const args of [['--status'],['--status','other'],['--status','unread','--status','finished']]) {\n    assert.equal(run(args,items).code,2); assert.equal(run(args,items).stdout,''); assert.match(run(args,items).stderr,/Usage/);\n  }\n});\n`;
  writeFileSync(baselineTest, tests);
  const developerSuite = runNode(['--test','catalog.test.mjs'], catalog);
  assert.equal(developerSuite.status, 0, developerSuite.stdout + developerSuite.stderr);
  transition('qa');
  for (const [args, expected] of [
    [[], 'Walking the Northern Trail\nA Guide to Small Gardens\nNotes from a Quiet Workshop\n'],
    [['--status','unread'], 'Walking the Northern Trail\nNotes from a Quiet Workshop\n'],
    [['--status','finished'], 'A Guide to Small Gardens\n']
  ]) {
    const actual = runNode(['catalog.mjs', ...args], catalog);
    assert.equal(actual.status, 0); assert.equal(actual.stdout, expected); assert.equal(actual.stderr, '');
  }
  for (const args of [['--unknown'],['--status'],['--status','other'],['--status','unread','--status','finished']]) {
    const actual = runNode(['catalog.mjs', ...args], catalog);
    assert.equal(actual.status, 2); assert.equal(actual.stdout, ''); assert.match(actual.stderr, /Usage/);
  }
  const qaSuite = runNode(['--test','catalog.test.mjs'], catalog);
  assert.equal(qaSuite.status, 0, qaSuite.stdout + qaSuite.stderr);
  assert.equal(readFileSync(path.join(catalog,'data.json'),'utf8'), fixture);
  task = task.replaceAll('- [ ] AC-', '- [x] AC-');
  const report = ['## QA report', '', 'Synthetic offline rehearsal evidence, not an AI-session result.', '',
    '| Criterion | Verdict | Evidence |', '|---|---|---|',
    ...Array.from({length:6}, (_,i) => `| AC-${i+1} | pass | Node CLI/suite execution and local file inspection in disposable fixture |`), ''].join('\n');
  task = task.replace(/## QA report\n[\s\S]*?(?=## Hand-off)/, report);
  task = task.replace('- unverified: AC-1 through AC-6 for the future candidate','- unverified: authenticated AI orchestration; not exercised by this deterministic rehearsal');
  transition('done');
  assert.ok(!existsSync(path.join(root,'.git')));
});
