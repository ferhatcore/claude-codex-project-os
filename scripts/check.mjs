import { existsSync, lstatSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { distributionRoot, entriesForRuntime, requireNode, parseArgs, realRoot, walk, configErrors, markdownErrors, taskErrors, scanText, releaseErrors } from './lib.mjs';
import { runtimeFileErrors, codexRoles, codexSkills } from './runtimes.mjs';

const workspaceFiles = ['README.md','START.md','CLAUDE.md','.project-os.json',
  'planning/flow.md','planning/roles.md','planning/board.md','planning/decisions.md',
  'planning/pending-user.md','planning/model-log.md','planning/baseline.md','planning/rule-changes.md',
  'planning/departments/ENGINEERING.md','planning/departments/THINKING.md',
  'planning/tasks/_template.md','planning/qa/README.md','planning/qa/checklists.md',
  'planning/qa/report-template.md','planning/qa/scenarios.md','planning/reviews/queue.md','planning/reviews/BRIEF.md'];

export function validate(root = distributionRoot, { workspace = false, release = false, denylist = [] } = {}) {
  requireNode();
  const errors = [];
  const fail = (file, message) => errors.push(`${file}: ${message}`);
  root = realRoot(root);
  let workspaceConfig;
  if (workspace) try { workspaceConfig=JSON.parse(readFileSync(path.join(root,'.project-os.json'),'utf8')); } catch {}
  const required = workspace ? [...workspaceFiles.filter(f => f !== 'CLAUDE.md'), ...entriesForRuntime(workspaceConfig?.runtime)] : ['README.md','QUICKSTART.md','CONTRIBUTING.md','SECURITY.md',
    'PROVENANCE.md','LICENSE-DECISION.md','CHANGELOG.md','.gitignore','.gitattributes',
    'docs/architecture.md','docs/workflows.md','docs/customization.md','docs/troubleshooting.md','docs/claude-code.md',
    'scripts/init.mjs','scripts/check.mjs','scripts/lib.mjs','scripts/system.test.mjs','scripts/smoke.mjs','scripts/smoke.test.mjs',
    'scripts/runtimes.mjs','scripts/runtimes.test.mjs','docs/codex.md',
    ...codexRoles.map(role=>`templates/runtimes/codex/.codex/agents/${role}.toml`),
    ...codexSkills.map(skill=>`templates/runtimes/codex/.agents/skills/${skill}/SKILL.md`),
    'docs/authenticated-smoke.md','release/LICENSING-AUDIT.md','release/BLOCKERS.md',
    '.github/workflows/validate.yml','release/metadata.md','release/READINESS.md','release/status.json','release/CHECKLIST.md','release/v1.0.0.md','release/adoption.md',
    ...workspaceFiles.map(f => `templates/workspace/${f}`),
    'examples/trailboard/.project-os.json','examples/trailboard/planning/tasks/TB-001.md'];
  for (const relative of required) if (!existsSync(path.join(root, relative))) fail(relative, 'required file missing');
  let files;
  try { files = walk(root, { includePrivateFiles: !workspace }); } catch (error) { return { errors: [error.message], files: 0, markdown: 0 }; }
  let markdown = 0;
  const configs = new Map();
  const configPaths = workspace ? ['.project-os.json'] : ['templates/workspace/.project-os.json','examples/trailboard/.project-os.json'];
  for (const relative of configPaths) {
    try {
      const file = path.join(root, relative);
      const config = JSON.parse(readFileSync(file, 'utf8'));
      configs.set(path.dirname(file), config);
      for (const message of configErrors(config, path.dirname(file), workspace || relative.startsWith('examples/'))) fail(relative, message);
      if (workspace) for (const message of runtimeFileErrors(root,config)) fail(relative,message);
    } catch { fail(relative, 'cannot read/parse configuration'); }
  }
  for (const file of files) {
    const relative = path.relative(root, file).replaceAll('\\','/');
    if (!workspace && (/^\.env(?:\.|$)/.test(path.basename(file)) && path.basename(file) !== '.env.example' || /\.(?:pem|key|log)$/.test(file) || path.basename(file) === 'settings.local.json')) fail(relative, 'private/local artifact must not be distributed');
    if (lstatSync(file).size > 2_000_000) { fail(relative, 'unexpected large file; inspect manually'); continue; }
    const text = readFileSync(file, 'utf8');
    if (text.includes('\0')) { fail(relative, 'unexpected binary content'); continue; }
    for (const finding of scanText(text, denylist)) fail(relative, finding);
    if (file.endsWith('.json')) {
      try { JSON.parse(text); } catch { fail(relative, 'invalid JSON'); }
    }
    const template = relative.startsWith('templates/') ||
      (workspace && ['planning/tasks/_template.md','planning/qa/report-template.md','planning/reviews/BRIEF.md'].includes(relative));
    if (!template && /\{\{[A-Z][A-Z0-9_]*\}\}|TODO\(|\bFIXME\b/.test(text)) fail(relative, 'unresolved template marker');
    if (file.endsWith('.md')) {
      markdown++;
      for (const message of markdownErrors(file, root)) fail(relative, message);
      if (/(^|\/)tasks\/[^/]+\.md$/.test(relative) && !relative.endsWith('/_template.md')) {
        const config = workspace ? configs.get(root) : configs.get(path.join(root, 'examples/trailboard'));
        for (const message of taskErrors(text, config)) fail(relative, message);
      }
    }
    if (['CLAUDE.md','AGENTS.md'].includes(path.basename(file)) && text.split('\n').length > 130) fail(relative, 'entry rules exceed 130 lines');
  }
  if (!workspace) {
    try {
      const metadata = readFileSync(path.join(root,'release/metadata.md'),'utf8');
      const description = metadata.match(/## Description\s+([^\n]+)/)?.[1];
      if (!description || description.length > 160) fail('release/metadata.md','repository description must be 1–160 characters');
      const workflow = readFileSync(path.join(root,'.github/workflows/validate.yml'),'utf8');
      if (!workflow.includes('contents: read') || !workflow.includes('persist-credentials: false') || /pull_request_target/.test(workflow)) fail('.github/workflows/validate.yml','unsafe or missing CI policy');
      for (const use of workflow.matchAll(/uses: ([^\s]+)/g)) if (!/@[a-f0-9]{40}$/.test(use[1])) fail('.github/workflows/validate.yml','actions must be pinned to full commit IDs');
    } catch { fail('release metadata/CI','cannot read required metadata'); }
  }
  if (release) {
    if (workspace) fail('release','release gate applies to distribution only');
    else {
      try {
        const status = JSON.parse(readFileSync(path.join(root,'release/status.json'),'utf8'));
        const license = existsSync(path.join(root,'LICENSE')) ? readFileSync(path.join(root,'LICENSE'),'utf8') : '';
        for (const message of releaseErrors(status, license)) fail('release/status.json', message);
      } catch { fail('release/status.json','release record unreadable'); }
    }
  }
  return { errors, files: files.length, markdown };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = parseArgs(process.argv.slice(2), {'--workspace':'value','--denylist':'value','--release':'flag','--help':'flag'});
    if (args['--help']) console.log('node scripts/check.mjs [--workspace PATH] [--denylist PRIVATE_JSON] [--release]');
    else {
      const denylist = args['--denylist'] ? JSON.parse(readFileSync(args['--denylist'],'utf8')) : [];
      if (!Array.isArray(denylist) || !denylist.every(v => typeof v === 'string' && v.length >= 3)) throw new Error('Denylist must be an array of strings of length >= 3.');
      const result = validate(args['--workspace'] ? path.resolve(args['--workspace']) : distributionRoot, { workspace: Boolean(args['--workspace']), release: Boolean(args['--release']), denylist });
      for (const error of result.errors) console.error(`FAIL ${error}`);
      console.log(`${result.errors.length ? 'FAIL' : 'PASS'}: ${result.files} files, ${result.markdown} Markdown files, ${result.errors.length} findings. External URLs not fetched; no AI session executed.`);
      if (result.errors.length) process.exitCode = 1;
    }
  } catch (error) { console.error(`Check refused: ${error.message}`); process.exitCode = 1; }
}
