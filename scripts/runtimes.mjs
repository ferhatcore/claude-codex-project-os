import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { distributionRoot, entriesForRuntime, safeChild, walk } from './lib.mjs';

export const codexRoles = ['pm','developer','qa','reviewer'];
export const codexSkills = ['project-os-start','project-os-task','project-os-qa','project-os-resume'];

export function buildRuntimeManifest(sourceManifest, runtime, config) {
  const files = new Map(sourceManifest.map(({relative,file}) => [relative.replaceAll('\\','/'), readFileSync(file)]));
  const codex = runtime === 'codex' || runtime === 'both';
  const entryPaths = [...files.keys()].filter(file => file === 'CLAUDE.md' || file.endsWith('/CLAUDE.md'));
  if (codex) {
    for (const file of entryPaths) {
      const target = file.replace(/CLAUDE\.md$/, 'AGENTS.md');
      files.set(target, Buffer.from(files.get(file).toString('utf8').replaceAll('CLAUDE.md','AGENTS.md')));
    }
    const source = path.join(distributionRoot,'templates/runtimes/codex');
    for (const file of walk(source)) files.set(path.relative(source,file).replaceAll('\\','/'), readFileSync(file));
    files.set('.codex/config.toml', Buffer.from(`[agents]\nmax_concurrent_threads_per_session = ${config.budget.max_active_workers}\n`));
    const guide = files.get('AGENTS.md').toString('utf8');
    files.set('AGENTS.md', Buffer.from(`${guide.trimEnd()}\n\n## Codex delegation\n\nFor approved tasks, use the installed project_os_developer, project_os_qa and project_os_reviewer agents when the client exposes them. Use project_os_pm for a bounded planning task. Check real tool availability first. If the client has native delegation without named agent selection, read the corresponding .codex/agents TOML and include its full developer_instructions in the delegated role brief. If no delegation is available, provide a manual brief.\nRun one writer per repository. Release the lane before QA, wait for the requested results and close completed workers before the next role. Custom agents inherit parent permissions and model settings. Their role instructions do not create a separate sandbox.\nUse the project-os-start, project-os-task, project-os-qa and project-os-resume skills for the corresponding workflow.\n`));
    if (runtime === 'codex') {
      for (const file of entryPaths) files.delete(file);
      for (const [file,bytes] of files) if (file.endsWith('.md')) files.set(file, Buffer.from(bytes.toString('utf8').replaceAll('CLAUDE.md','AGENTS.md').replaceAll('Start Claude Code','Start Codex')));
    }
    const label = runtime === 'both' ? 'Claude Code or Codex' : 'Codex';
    const start = files.get('START.md').toString('utf8');
    files.set('START.md', Buffer.from(`${start.trimEnd()}\n\nInstalled clients: ${label}. Use the entry file for the client you opened. Both clients use this same planning directory; never dispatch a second writer into an occupied lane.\n`));
    const readme = files.get('README.md').toString('utf8');
    files.set('README.md',Buffer.from(`${readme.trimEnd()}\n\n## Codex\n\nOpen Codex at this workspace root and ask it to read START.md, or invoke $project-os-start. Native agent definitions are in .codex/agents and skills are in .agents/skills. The client must trust the project before loading project configuration. These files do not start a model request or change global settings.\n`));
  }
  files.set('.project-os.json',Buffer.from(`${JSON.stringify(config,null,2)}\n`));
  return files;
}

export function runtimeFileErrors(root, config) {
  const errors=[];
  const runtime=config.runtime || 'claude';
  for (const entry of entriesForRuntime(runtime)) if (!existsSync(path.join(root,entry))) errors.push(`${entry}: entry rules missing for ${runtime}`);
  if (runtime === 'claude') return errors;
  for (const role of codexRoles) {
    const relative=`.codex/agents/${role}.toml`;
    try {
      const text=readFileSync(safeChild(root,relative),'utf8');
      if (!text.includes(`name = "project_os_${role}"`)) errors.push(`${relative}: role name mismatch`);
      if (!/^description = ".+"$/m.test(text) || !/^developer_instructions = """\n[\s\S]+?\n"""\s*$/m.test(text)) errors.push(`${relative}: required agent fields missing`);
      if (/^(sandbox_mode|approval_policy|model_provider|mcp_servers)\s*=/m.test(text)) errors.push(`${relative}: unsupported per-agent permission/provider override`);
    } catch { errors.push(`${relative}: native agent definition missing/unreadable`); }
  }
  for (const skill of codexSkills) {
    const relative=`.agents/skills/${skill}/SKILL.md`;
    try {
      const text=readFileSync(safeChild(root,relative),'utf8');
      if (!text.startsWith(`---\nname: ${skill}\n`) || !/^description: .+$/m.test(text)) errors.push(`${relative}: required skill metadata missing`);
    } catch { errors.push(`${relative}: skill missing/unreadable`); }
  }
  try {
    const text=readFileSync(safeChild(root,'.codex/config.toml'),'utf8');
    const cap=Number(text.match(/^max_concurrent_threads_per_session = (\d+)\s*$/m)?.[1]);
    if (cap !== config.budget.max_active_workers) errors.push('.codex/config.toml: worker cap differs from project policy');
  } catch { errors.push('.codex/config.toml: missing/unreadable'); }
  return errors;
}
