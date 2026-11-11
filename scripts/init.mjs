import { existsSync, lstatSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { distributionRoot, profiles, runtimes, requireNode, parseArgs, assertNoSymlinkAncestors, walk, configErrors } from './lib.mjs';
import { buildRuntimeManifest, runtimeFileErrors } from './runtimes.mjs';

export function initialize(options) {
  requireNode();
  if (!options.target) throw new Error('--target is required; destination must not exist.');
  const profile = options.profile || 'lean';
  const runtime = options.runtime === undefined ? 'claude' : options.runtime;
  if (!runtimes.includes(runtime)) throw new Error('Runtime must be claude, codex or both.');
  if (!Object.hasOwn(profiles, profile)) throw new Error('Profile must be lean, standard or heavy.');
  if (options.name !== undefined && (typeof options.name !== 'string' || !options.name.trim() || /[\r\n\x00-\x1f]/.test(options.name))) throw new Error('Project name must be nonempty plain text.');
  const target = path.resolve(options.target);
  assertNoSymlinkAncestors(target);
  if (existsSync(target)) throw new Error('Destination exists; refusing to overwrite or merge.');
  const parent = path.dirname(target);
  if (!existsSync(parent) || !lstatSync(parent).isDirectory()) throw new Error('Destination parent must already be a directory.');
  const source = path.join(distributionRoot, 'templates/workspace');
  const example = path.join(distributionRoot, 'examples/trailboard');
  // Pre-read trusted sources and validate before creating any destination.
  const manifest = walk(source).map(file => ({ relative: path.relative(source, file), file }));
  if (options.example) {
    for (const file of walk(example)) {
      const relative = path.relative(example, file);
      if (relative === 'README.md' || relative === '.project-os.json') continue;
      const existing = manifest.findIndex(entry => entry.relative === relative);
      const entry = { relative, file };
      if (existing >= 0) manifest[existing] = entry;
      else manifest.push(entry);
    }
  }
  const config = JSON.parse(readFileSync(path.join(options.example ? example : source, '.project-os.json'), 'utf8'));
  config.profile = profile;
  config.runtime = runtime;
  config.budget.max_active_workers = profiles[profile];
  if (options.name) config.project.name = options.name.trim();
  const errors = configErrors(config, target);
  if (errors.length) throw new Error(`Invalid source configuration: ${errors.join('; ')}`);
  const output = buildRuntimeManifest(manifest, runtime, config);
  mkdirSync(target); // No recursive target creation: a race/collision fails closed.
  for (const [relative, content] of output) {
    const destination = path.join(target, relative);
    mkdirSync(path.dirname(destination), { recursive: true });
    writeFileSync(destination, content, { flag: 'wx' });
  }
  const installed = [...configErrors(config, target, true), ...runtimeFileErrors(target, config)];
  if (installed.length) throw new Error(`Installed workspace needs review: ${installed.join('; ')}`);
  return { target, profile, runtime, files: output.size, example: Boolean(options.example) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = parseArgs(process.argv.slice(2), { '--target':'value','--name':'value','--profile':'value','--runtime':'value','--example':'flag','--help':'flag' });
    if (args['--help']) console.log('node scripts/init.mjs --target NEW_DIRECTORY [--runtime claude|codex|both] [--name NAME] [--profile lean|standard|heavy] [--example]');
    else {
      const result = initialize({ target: args['--target'], name: args['--name'], runtime: args['--runtime'], profile: args['--profile'], example: args['--example'] });
      console.log(`Created ${result.target}\nRuntime: ${result.runtime}; profile: ${result.profile}; example: ${result.example}. No model, Git or network operation was run.\nOpen your selected client there and ask it to read START.md.`);
    }
  } catch (error) { console.error(`Setup refused: ${error.message}`); process.exitCode = 1; }
}
