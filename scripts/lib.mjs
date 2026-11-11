import { readdirSync, lstatSync, readFileSync, realpathSync, existsSync } from 'node:fs';
import path from 'node:path';

export const distributionRoot = path.resolve(import.meta.dirname, '..');
export const profiles = { lean: 1, standard: 2, heavy: 3 };
export const runtimes = ['claude','codex','both'];
export const entriesForRuntime = (runtime = 'claude') => runtime === 'both' ? ['CLAUDE.md','AGENTS.md'] : [runtime === 'codex' ? 'AGENTS.md' : 'CLAUDE.md'];
export const statuses = new Set(['todo', 'in_progress', 'review', 'qa', 'qa_failed', 'done', 'blocked', 'question']);
export const types = new Set(['backend-api', 'service', 'web', 'admin', 'landing', 'mobile', 'infra', 'data', 'library', 'cli', 'tests', 'docs', 'external']);

export function requireNode() {
  if (Number(process.versions.node.split('.')[0]) < 22) throw new Error('Node.js 22 or newer is required.');
}

export function parseArgs(args, definitions) {
  const result = {};
  for (let i = 0; i < args.length; i++) {
    const key = args[i];
    if (!(key in definitions)) throw new Error(`Unknown option: ${key}`);
    if (key in result) throw new Error(`Duplicate option: ${key}`);
    if (definitions[key] === 'flag') result[key] = true;
    else {
      const value = args[++i];
      if (!value || value.startsWith('--')) throw new Error(`Missing value for ${key}`);
      result[key] = value;
    }
  }
  return result;
}

export function assertNoSymlinkAncestors(input) {
  let current = path.resolve(input);
  for (;;) {
    if (existsSync(current) && lstatSync(current).isSymbolicLink()) throw new Error('Symbolic-link paths are not accepted.');
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
}

export function safeChild(root, relative) {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative) ||
      relative.includes('\\') || relative.includes(':') || relative.includes('\0') ||
      relative.split('/').some(p => !p || p === '.' || p === '..' || p.toLowerCase() === '.git')) {
    throw new Error('Repository paths must be relative children with no dot, Git, drive or empty segments.');
  }
  const resolved = path.resolve(root, relative);
  const relation = path.relative(root, resolved);
  if (relation.startsWith('..') || path.isAbsolute(relation) || !relation) throw new Error('Path escapes workspace.');
  assertNoSymlinkAncestors(resolved);
  return resolved;
}

const skipped = new Set(['.git', 'node_modules', 'work', 'coverage']);
export function walk(root, { includePrivateFiles = false } = {}) {
  const files = [];
  function visit(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a,b) => a.name.localeCompare(b.name))) {
      if (skipped.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isSymbolicLink()) throw new Error('Symbolic links are not allowed in the checked tree.');
      if (entry.isDirectory()) visit(full);
      else if (entry.isFile() && (includePrivateFiles || (!entry.name.endsWith('.log') && entry.name !== 'settings.local.json' &&
               !/^\.env(?:\.|$)/.test(entry.name)))) files.push(full);
    }
  }
  visit(root);
  return files;
}

export function configErrors(config, root, requireRepos = false) {
  const errors = [];
  const fail = message => errors.push(message);
  const object = value => value && typeof value === 'object' && !Array.isArray(value);
  const string = value => typeof value === 'string' && value.trim().length > 0;
  const keys = (value, allowed, label, optional = []) => {
    if (!object(value)) { fail(`${label}: object required`); return false; }
    for (const key of Object.keys(value)) if (!allowed.includes(key)) fail(`${label}: unknown field ${key}`);
    for (const key of allowed) if (!(key in value) && !optional.includes(key)) fail(`${label}: missing field ${key}`);
    return true;
  };
  if (!keys(config, ['schema_version','project','profile','budget','models','capabilities','advanced_review','repositories','runtime'], 'configuration', ['runtime'])) return errors;
  if (config.runtime !== undefined && !runtimes.includes(config.runtime)) fail('runtime must be claude, codex or both');
  if (config.schema_version !== 1) fail('unsupported schema_version');
  if (!Object.hasOwn(profiles, config.profile)) fail('invalid profile');
  if (keys(config.project, ['name','language','time_zone'], 'project')) {
    for (const field of ['name','language','time_zone']) if (!string(config.project[field])) fail(`project.${field}: nonempty string required`);
    try { new Intl.DateTimeFormat('en', { timeZone: config.project.time_zone }).format(); }
    catch { fail('project.time_zone: invalid time zone'); }
  }
  if (keys(config.budget, ['max_active_workers','usage','context_save_percent','context_pause_percent'], 'budget')) {
    const b = config.budget;
    if (!Number.isInteger(b.max_active_workers) || b.max_active_workers < 1 || b.max_active_workers > 16) fail('worker cap must be an integer from 1 to 16');
    if (!(b.context_save_percent > 0 && b.context_save_percent < b.context_pause_percent && b.context_pause_percent <= 100)) fail('invalid context threshold order');
    const names = ['short_window_yellow_percent','short_window_red_percent','short_window_stop_percent','weekly_priority_only_percent','weekly_stop_percent','reserve_percent','observation_max_age_minutes'];
    if (keys(b.usage, names, 'budget.usage')) {
      for (const key of names) if (typeof b.usage[key] !== 'number' || !Number.isFinite(b.usage[key]) || b.usage[key] <= 0 || (key !== 'observation_max_age_minutes' && b.usage[key] > 100)) fail(`budget.usage.${key}: invalid number`);
      const u = b.usage;
      if (!(u.short_window_yellow_percent < u.short_window_red_percent && u.short_window_red_percent < u.short_window_stop_percent)) fail('short usage thresholds must increase');
      if (!(u.weekly_priority_only_percent < u.weekly_stop_percent)) fail('weekly usage thresholds must increase');
    }
  }
  if (keys(config.models, ['economy','standard','deep','review'], 'models')) {
    for (const tier of ['economy','standard','deep','review']) {
      const entry = config.models[tier];
      if (keys(entry, ['selector','effort'], `models.${tier}`)) {
        if (!string(entry.selector) || /[\r\n]/.test(entry.selector)) fail(`models.${tier}: invalid selector`);
        if (!['low','medium','high','max'].includes(entry.effort)) fail(`models.${tier}: unsupported policy effort`);
      }
    }
  }
  if (keys(config.capabilities, ['mode','verified_tools'], 'capabilities')) {
    if (!['manual','native-subagents','integration'].includes(config.capabilities.mode)) fail('invalid capabilities.mode');
    if (!Array.isArray(config.capabilities.verified_tools) || !config.capabilities.verified_tools.every(string)) fail('verified_tools must be a string array');
    if (config.capabilities.mode !== 'manual' && !config.capabilities.verified_tools?.length) fail('non-manual adapter requires actual verified tools');
  }
  if (keys(config.advanced_review, ['enabled','required_before_final_rules','exclusive'], 'advanced_review')) {
    const a = config.advanced_review;
    for (const key of Object.keys(a)) if (typeof a[key] !== 'boolean') fail(`advanced_review.${key}: boolean required`);
    if (a.required_before_final_rules && !a.enabled) fail('required advanced review cannot be disabled');
    if (!a.exclusive) fail('this v1 workflow requires exclusive advanced review');
  }
  if (!Array.isArray(config.repositories)) fail('repositories must be an array');
  else {
    const ids = new Set(), paths = new Set();
    for (const repo of config.repositories) {
      if (!keys(repo, ['id','path','type','owner','branch','test_command','smoke_command','push_deploys','external'], 'repository')) continue;
      if (typeof repo.id !== 'string' || !/^[a-z][a-z0-9-]*$/.test(repo.id) || ids.has(repo.id)) fail('invalid or duplicate repository ID');
      ids.add(repo.id);
      let target;
      try { target = safeChild(root, repo.path); }
      catch (error) { fail(`repository ${repo.id}: ${error.message}`); }
      const pathKey = process.platform === 'win32' ? target?.toLowerCase() : target;
      if (target && paths.has(pathKey)) fail('duplicate repository path');
      if (target) paths.add(pathKey);
      if (!types.has(repo.type)) fail(`repository ${repo.id}: unsupported type`);
      for (const field of ['owner','branch','test_command','smoke_command']) if (!string(repo[field])) fail(`repository ${repo.id}: ${field} required`);
      if (typeof repo.push_deploys !== 'boolean' || typeof repo.external !== 'boolean') fail(`repository ${repo.id}: deployment/external flags must be explicit booleans`);
      if (repo.type === 'external' && !repo.external) fail('external type must be marked external');
      if (requireRepos && target && !existsSync(target)) fail(`repository ${repo.id}: path missing`);
      if (requireRepos && target && existsSync(target) && !repo.external) for (const entry of entriesForRuntime(config.runtime)) if (!existsSync(path.join(target, entry))) fail(`repository ${repo.id}: ${entry} entry rules missing`);
    }
  }
  return errors;
}

export function navigationText(text) {
  return text.replace(/^\s*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\s*\1\s*$/gm, '').replace(/`[^`\n]*`/g, '');
}

export function headingSlugs(text) {
  const seen = new Map();
  const slugs = new Set();
  for (const match of navigationText(text).matchAll(/^#{1,6}\s+(.+?)\s*#*$/gm)) {
    const base = match[1].toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu, '').replace(/\s/g, '-');
    const count = seen.get(base) || 0;
    seen.set(base, count + 1);
    slugs.add(count ? `${base}-${count}` : base);
  }
  return slugs;
}

export function markdownErrors(file, root) {
  const text = readFileSync(file, 'utf8');
  const errors = [];
  for (const match of navigationText(text).matchAll(/!?\[[^\]\n]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    const dest = match[1];
    if (/^https?:\/\//i.test(dest)) {
      try { const u = new URL(dest); if (u.username || u.password) errors.push('credential-bearing URL'); }
      catch { errors.push('malformed external URL'); }
      continue;
    }
    if (/^[a-z]+:/i.test(dest) || dest.startsWith('//')) { errors.push('unsupported link scheme'); continue; }
    let decoded;
    try { decoded = decodeURIComponent(dest); } catch { errors.push('malformed link encoding'); continue; }
    const [relative, anchor] = decoded.split('#');
    const target = relative ? path.resolve(path.dirname(file), relative) : file;
    const relation = path.relative(root, target);
    if (relation.startsWith('..') || path.isAbsolute(relation)) { errors.push('link escapes checked tree'); continue; }
    if (!existsSync(target)) { errors.push(`broken local link: ${dest}`); continue; }
    if (anchor && lstatSync(target).isFile() && target.endsWith('.md') && !headingSlugs(readFileSync(target,'utf8')).has(anchor)) errors.push(`broken anchor: ${dest}`);
  }
  return errors;
}

export function taskErrors(text, config) {
  const errors = [];
  function field(key) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const hits = [...text.matchAll(new RegExp(`^- \\*\\*${escaped}:\\*\\* (.+)$`, 'gm'))];
    if (hits.length !== 1) { errors.push(`exactly one ${key} field required`); return ''; }
    return hits[0][1].trim();
  }
  const values = {};
  for (const key of ['ID','Repo','Status','Priority','Dependency','Branch','Sources','Scope approval','Code permission','Git approval','API contract approval','Security review','Model tier','Actual model / effort','Failed review cycles','Git / deployment state']) values[key] = field(key);
  if (!/^[A-Z][A-Z0-9]*-\d+$/.test(values.ID)) errors.push('invalid task ID');
  if (!statuses.has(values.Status)) errors.push('invalid task status');
  if (!['P0','P1','P2'].includes(values.Priority)) errors.push('invalid priority');
  if (!['economy','standard','deep','review'].includes(values['Model tier'])) errors.push('invalid model tier');
  if (!['yes','no'].includes(values['Security review'])) errors.push('Security review must be yes/no');
  if (!/^\d+$/.test(values['Failed review cycles'])) errors.push('invalid review cycle count');
  if (config && (!Array.isArray(config.repositories) || !config.repositories.some(r => r.id === values.Repo))) errors.push('task repository is not configured');
  const blocks = [...text.matchAll(/^## Hand-off\s*$/gm)];
  if (blocks.length !== 1) errors.push('exactly one Hand-off block required');
  const block = text.split(/^## Hand-off\s*$/m)[1]?.split(/^## /m)[0] || '';
  for (const key of ['session','step','round','status','result','changed','verified','unverified','open','next','resume']) {
    const matches = [...block.matchAll(new RegExp(`^- ${key}: (.+)$`, 'gm'))];
    if (matches.length !== 1) errors.push(`Hand-off ${key} missing/duplicated`);
    if (key === 'status' && matches[0]?.[1] !== values.Status) errors.push('metadata and Hand-off status differ');
  }
  for (const heading of ['Goal','Acceptance criteria','Verification plan','Contract change note','Notes','QA report']) if (!text.includes(`## ${heading}\n`)) errors.push(`missing section: ${heading}`);
  const ac = [...text.matchAll(/^- \[([ xX])\] (AC-\d+): .+$/gm)];
  if (!ac.length || new Set(ac.map(m=>m[2])).size !== ac.length) errors.push('missing/duplicate acceptance IDs');
  if (['in_progress','review','qa','qa_failed','done'].includes(values.Status)) {
    if (!values['Scope approval'].startsWith('given:')) errors.push('active task needs scope approval reference');
    if (!(values['Code permission'].startsWith('given:') || values['Code permission'] === 'not-required')) errors.push('active task needs code permission reference or not-required');
    if (values.Branch === 'unverified') errors.push('active task branch unverified');
  }
  if (values.Status === 'done') {
    for (const criterion of ac) {
      if (criterion[1].toLowerCase() !== 'x') errors.push(`${criterion[2]} not checked for done task`);
      if (!new RegExp(`^\\| ${criterion[2]} \\| pass \\| .+\\|$`, 'm').test(text)) errors.push(`${criterion[2]} lacks QA pass/evidence row`);
    }
  }
  return errors;
}

export function scanText(text, denylist = []) {
  const patterns = [
    ['private key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
    ['cloud access key', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
    ['provider token', /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|sk-(?:ant-)?[A-Za-z0-9_-]{24,})\b/],
    ['credential URL', /https?:\/\/[^\s/@]+:[^\s/@]+@/i],
    ['personal filesystem path', /(?:[A-Z]:[\\/]Users[\\/][^\s\\/]+|\/(?:Users|home)\/[a-zA-Z0-9._-]+\/)/],
    ['assigned credential', /\b(?:api[_-]?key|access[_-]?token|client[_-]?secret|password)\s*[:=]\s*["'][A-Za-z0-9_+\/-]{20,}["']/i]
  ];
  const found = patterns.filter(([,regex]) => regex.test(text)).map(([label]) => label);
  const lower = text.toLowerCase();
  if (denylist.some(value => lower.includes(value.toLowerCase()))) found.push('private identifier');
  return found;
}

export function realRoot(input) {
  assertNoSymlinkAncestors(input);
  return realpathSync(input);
}

export function releaseErrors(status, licenseText) {
  const errors = [];
  for (const key of ['rights_confirmed','attribution_reviewed','authenticated_smoke_test','publication_approved']) if (status[key] !== true) errors.push(`${key} is not confirmed`);
  for (const key of ['rights_evidence','smoke_evidence','approval_reference']) if (typeof status[key] !== 'string' || !status[key].trim()) errors.push(`${key} reference missing`);
  if (status.state !== 'approved') errors.push('state must be approved');
  if (typeof status.license !== 'string' || !status.license.trim() || status.license === 'pending') errors.push('licence decision pending');
  if (typeof licenseText !== 'string' || licenseText.trim().length < 100) errors.push('full approved licence text missing');
  return errors;
}
