import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { initialize } from './init.mjs';
import { parseArgs, requireNode, realRoot, safeChild } from './lib.mjs';

const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const writeJSON = (file, data) => writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });

export function summarizeAuth(result) {
  if (result.error || result.signal) return { loggedIn: null, reason: 'CLI unavailable or timed out' };
  let data;
  try { data = JSON.parse(result.stdout); } catch { return { loggedIn: null, reason: 'Unrecognized CLI status response' }; }
  if (data.loggedIn === true && result.status === 0) return { loggedIn: true, reason: 'CLI reports authenticated access; model access not yet tested' };
  if (data.loggedIn === false) return { loggedIn: false, reason: 'Interactive Claude Code login required' };
  return { loggedIn: null, reason: 'Authentication could not be established' };
}

export function checkAuth() {
  // The client inspects its own session; no credential file or value is read here.
  return summarizeAuth(spawnSync('claude', ['auth', 'status', '--json'], {
    encoding: 'utf8', timeout: 10000, maxBuffer: 128 * 1024, windowsHide: true
  }));
}

const prompts = {
  '01-pm.md': `# PM session\n\nAct as Trailboard : PM. Read START.md, CLAUDE.md, .project-os.json and planning/tasks/TB-001.md. Use manual sessions; report actual tools, model/effort and unknown usage. Propose scope and ask for missing code authority; do not implement or invent approval. Record only human decisions actually received. Reconcile the board and hand-off before dispatch. No Git writes, paid services, external messages or production access.\n`,
  '02-developer.md': `# Developer session\n\nAct as Trailboard : Catalog Developer, not PM. Read root CLAUDE.md, planning/departments/ENGINEERING.md, repos/catalog/CLAUDE.md and planning/tasks/TB-001.md. If scope/code permission is pending, stop and route the question to PM. After actual approval, implement TB-001 in repos/catalog only, with focused tests and README updates. Use local-folder mode; no Git writes or external access. Save one hand-off before long commands and at step end. Reread changed criteria, inspect the diff, record actual model/effort and stop at qa only when the candidate is ready.\n`,
  '03-qa.md': `# QA session\n\nAct as Trailboard : QA, not Developer or PM. Read root rules, planning/qa/README.md, Catalog testing rules and TB-001. Confirm the developer released the lane. Independently rerun actual criteria and suite using local fixtures; review smoke evidence but do not trust it as a substitute for your own checks. In verification-only baseline mode, report the unimplemented filter as a real negative result without pretending a development cycle completed. For a built candidate, set qa_failed on findings or done only with every criterion's passing evidence. No production fixes, fabricated approvals or Git writes.\n`,
  '04-reviewer.md': `# Independent review session\n\nAct as Trailboard : Reviewer with read-only scope. Read root rules, TB-001, QA findings, the bounded Catalog diff and smoke evidence. Check acceptance coverage, scope, role boundaries, approval references, hand-off continuity, actual model/effort, failed-cycle counts and completion claims. Return blocking findings and unknowns in chat; the human or PM saves the report as smoke/review.md. Do not use write tools, edit product code, grant approval, mark an unverified criterion passed or perform Git operations.\n`,
  '05-completion.md': `# PM completion checkpoint\n\nReturn to the real Trailboard : PM session or start a fresh PM with a self-contained hand-off. Read board, decisions, TB-001, independent QA/review and smoke evidence. Verify every acceptance criterion and open issue. If evidence is incomplete, report the blocker. Otherwise record completeness and present the exact proposed next action. Do not commit/push/merge/deploy or claim publication. Produce smoke/session-review.md using its checklist, recording genuine observed session identifiers/model settings or unknown. Never label this an authenticated run if real model sessions did not execute.\n`
};

export function prepareSmoke(target) {
  requireNode();
  const installed = initialize({ target, example: true, profile: 'lean' });
  const root = installed.target;
  const dir = path.join(root, 'smoke');
  mkdirSync(dir);
  const fixture = readFileSync(path.join(root, 'repos/catalog/data.json'));
  writeJSON(path.join(root, '.project-os-smoke.json'), {
    schema_version: 1, kind: 'trailboard-smoke', fixture_sha256: digest(fixture),
    authenticated_sessions_executed: false,
    note: 'Preparation only. This marker is neither approval nor authenticated-session evidence.'
  });
  for (const [file, text] of Object.entries(prompts)) writeFileSync(path.join(dir,file), text, { flag: 'wx' });
  writeFileSync(path.join(dir,'session-review.md'), `# Authenticated session review — not run\n\nNo authenticated session has been executed by preparation. Complete this record only from genuine observations.\n\n| Check | Actual evidence / verdict |\n|---|---|\n| PM / Developer / QA / Reviewer actual sessions and order | not run |\n| Actual model and effort versus configured tier | unverified |\n| Missing permission refused, then actual human scope/code approval recorded | unverified |\n| Role boundaries and one worker per lane | unverified |\n| Context saved and genuinely resumed by a fresh session | unverified |\n| Per-criterion independent QA including README/coverage review | unverified |\n| Actual negative case and any real correction cycle | unverified |\n| Independent review findings resolved or listed | unverified |\n| PM completeness report and Git/deploy gates preserved | unverified |\n\nKeep private transcripts outside public exports. A Node verification report alone does not satisfy these checks.\n`, { flag: 'wx' });
  return { prepared: true, authenticated_sessions_executed: false, target: root };
}

function assertSmokeWorkspace(workspace) {
  const root = realRoot(workspace);
  for (const file of ['.project-os-smoke.json','.project-os.json','repos/catalog/catalog.mjs','repos/catalog/catalog.test.mjs','repos/catalog/data.json','smoke']) safeChild(root, file);
  const marker = JSON.parse(readFileSync(path.join(root, '.project-os-smoke.json'), 'utf8'));
  if (marker.schema_version !== 1 || marker.kind !== 'trailboard-smoke' || !/^[a-f0-9]{64}$/.test(marker.fixture_sha256 || '')) throw new Error('Not a prepared fictional smoke workspace.');
  const config = JSON.parse(readFileSync(path.join(root, '.project-os.json'), 'utf8'));
  if (config.project?.name !== 'Trailboard' || config.repositories?.length !== 2 ||
      config.repositories[0]?.id !== 'catalog' || config.repositories[0]?.path !== 'repos/catalog' ||
      config.repositories[1]?.id !== 'handbook' || config.repositories[1]?.path !== 'repos/handbook' ||
      config.repositories.some(repo => repo.external !== false || repo.push_deploys !== false)) throw new Error('Smoke verification requires the unchanged local fictional repository configuration.');
  safeChild(root, 'repos/catalog');
  safeChild(root, 'smoke');
  return { root, marker };
}

export function verifySmoke(workspace, phase) {
  requireNode();
  if (!['baseline','candidate'].includes(phase)) throw new Error('--phase must be baseline or candidate.');
  const { root, marker } = assertSmokeWorkspace(workspace);
  const catalog = path.join(root, 'repos/catalog');
  const env = {};
  for (const key of ['PATH','Path','SystemRoot','SYSTEMROOT','WINDIR','TEMP','TMP','TMPDIR']) if (process.env[key]) env[key] = process.env[key];
  const run = args => spawnSync(process.execPath, args, { cwd: catalog, env, encoding: 'utf8', timeout: 15000, maxBuffer: 1024 * 1024, windowsHide: true });
  const all = 'Walking the Northern Trail\nA Guide to Small Gardens\nNotes from a Quiet Workshop\n';
  const cases = [
    ['all', [], 0, all],
    ['unread', ['--status','unread'], 0, 'Walking the Northern Trail\nNotes from a Quiet Workshop\n'],
    ['finished', ['--status','finished'], 0, 'A Guide to Small Gardens\n'],
    ['unsupported', ['--status','other'], 2, ''],
    ['missing', ['--status'], 2, ''],
    ['duplicate', ['--status','unread','--status','finished'], 2, ''],
    ['unknown', ['--unknown'], 2, '']
  ];
  const outcomes = cases.map(([id,args,expectedCode,expectedOutput]) => {
    const actual = run(['catalog.mjs',...args]);
    return { id, passed: !actual.error && actual.status === expectedCode && actual.stdout === expectedOutput &&
      (expectedCode === 0 ? actual.stderr === '' : /Usage/.test(actual.stderr)), exit_code: actual.status };
  });
  const suite = run(['--test','--test-reporter=tap','catalog.test.mjs']);
  const tests = Number(suite.stdout?.match(/^# tests (\d+)\s*$/m)?.[1] || 0);
  const suitePassed = !suite.error && suite.status === 0 && tests >= 3 && /^# fail 0\s*$/m.test(suite.stdout) && /^# skipped 0\s*$/m.test(suite.stdout);
  const fixtureUnchanged = digest(readFileSync(path.join(catalog,'data.json'))) === marker.fixture_sha256;
  const passed = phase === 'candidate' ? outcomes.every(check => check.passed) && suitePassed && fixtureUnchanged :
    outcomes.filter(check => !['unread','finished'].includes(check.id)).every(check => check.passed) &&
    outcomes.filter(check => ['unread','finished'].includes(check.id)).every(check => !check.passed && check.exit_code === 2) && suitePassed && fixtureUnchanged;
  const evidence = {
    schema_version: 1, phase, recorded_at: new Date().toISOString(), passed,
    authenticated_sessions_proven: false,
    evidence_scope: 'Local Node behavior only; phase baseline requires the two unimplemented filter checks to fail.',
    commands: outcomes, suite: { passed: suitePassed, tests, exit_code: suite.status },
    fixture_unchanged: fixtureUnchanged,
    manual_checks_required: ['New automated coverage for the feature', 'README accuracy and no out-of-scope changes',
      'Actual authenticated role sessions, approval gates, context recovery, model selection and independent review']
  };
  const stamp = `${Date.now()}-${process.pid}`;
  writeJSON(path.join(root,'smoke',`${phase}-${stamp}.json`), evidence);
  return evidence;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = parseArgs(process.argv.slice(2), { '--prepare':'flag','--target':'value','--check-auth':'flag','--verify':'flag','--workspace':'value','--phase':'value','--help':'flag' });
    if (args['--help']) console.log('smoke.mjs --prepare --target NEW_DIRECTORY | --check-auth | --verify --workspace PATH --phase baseline|candidate');
    else {
      if (['--prepare','--check-auth','--verify'].filter(key => args[key]).length !== 1) throw new Error('Choose exactly one smoke operation.');
      if (args['--prepare']) {
        if (args['--workspace'] || args['--phase']) throw new Error('Preparation accepts --target only.');
        console.log(JSON.stringify(prepareSmoke(args['--target']), null, 2));
      } else if (args['--check-auth']) {
        if (args['--target'] || args['--workspace'] || args['--phase']) throw new Error('Authentication check accepts no target or phase.');
        const status = checkAuth();
        console.log(JSON.stringify(status, null, 2));
        if (status.loggedIn !== true) process.exitCode = 2;
      } else {
        if (args['--target'] || !args['--workspace']) throw new Error('Verification requires --workspace and --phase.');
        const result = verifySmoke(args['--workspace'], args['--phase']);
        console.log(JSON.stringify(result, null, 2));
        if (!result.passed) process.exitCode = 1;
      }
    }
  } catch { console.error('Smoke operation refused or failed. Check options, the prepared fixture and reviewed local files; no raw CLI output was exported.'); process.exitCode = 1; }
}
