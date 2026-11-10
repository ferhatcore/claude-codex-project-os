import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export function listTitles(items) {
  return items.map(item => item.title).join('\n');
}

export function run(args, items) {
  if (args.length) return { code: 2, stdout: '', stderr: 'Usage: node catalog.mjs\n' };
  return { code: 0, stdout: `${listTitles(items)}\n`, stderr: '' };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const items = JSON.parse(readFileSync(new URL('./data.json', import.meta.url), 'utf8'));
  const result = run(process.argv.slice(2), items);
  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
  process.exitCode = result.code;
}
