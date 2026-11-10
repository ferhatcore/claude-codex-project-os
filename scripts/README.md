# Local helper scripts

Node.js 22+; only standard libraries. Run from any directory using the correct script path.

```sh
node scripts/init.mjs --target ../new-pm --name "My Project" --profile lean
node scripts/init.mjs --target ../trailboard-demo --example --profile lean
node scripts/check.mjs
node scripts/check.mjs --workspace ../trailboard-demo
node scripts/check.mjs --denylist /path/to/private-identifiers.json
node scripts/check.mjs --release
node --test scripts/system.test.mjs
```

Installer options: `--target` required; `--name` optional; `--example` optional; `--profile lean|standard|heavy`, default lean; `--help`. Destination must not exist; its parent must already exist and have no symbolic-link ancestors. No overwrites, Git, Claude launch, network calls or external commands. On a copy failure the target may remain partially populated; preserve it for inspection and use a new destination after resolving the error.

Checker options: `--workspace PATH` validates installed controls and referenced repositories; `--denylist PATH` adds case-insensitive literal private identifiers from a JSON string array; `--release` requires the release record, licence and approval evidence; `--help`. The optional denylist stays outside the release; errors report file/category, not secret values. The default scan checks the distribution, Markdown links/anchors, JSON/config/task schemas, likely credentials, personal filesystem paths, template markers and essential files. Markdown links in code fences/inline code are not treated as navigation. Template markers are allowed only inside template files.

Default checks are offline. External URLs are syntax-checked, not fetched; the release review records any separate HTTP checks. The scanner uses known patterns, cannot identify every secret and cannot verify legal ownership or human consent. `--release` validates recorded declarations, not their truth; the owner must inspect the exact candidate. `.git`, `node_modules`, `.claude/settings.local.json`, logs, private environments and work/coverage directories are excluded from generic installed-workspace scans. Distribution scans include and reject private environment/key/log/local-settings artifacts. Do not assume either mode is a complete scan of product code or Git history.

The tests use a temporary directory they create, exercise success/failure and clean it afterwards. They never execute fixture-configured test strings through a shell. Ordinary green checks do not imply permission to publish.
