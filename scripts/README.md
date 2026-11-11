# Local helper scripts

Node.js 22 or newer. All helpers use standard libraries; no npm install is required.

## Installation

```sh
node scripts/init.mjs --target ../new-pm --name "My Project" --runtime codex
node scripts/init.mjs --target ../trailboard-demo --example --runtime both --profile lean
```

Options are `--target` (required), `--name`, `--example`, `--profile lean|standard|heavy`, `--runtime claude|codex|both` and `--help`. Without a runtime flag the installer selects Claude Code. The target must be new and its parent must exist with no symbolic link ancestors. Existing files are never merged or overwritten.

The runtime adapter selects entry files and adds Codex roles/skills when requested. Common planning and example code are copied once. No model request, global setting, Git action or network request is made. A failed copy may leave a partial target for inspection; use a new target after correcting the problem.

## Validation

```sh
node scripts/check.mjs
node scripts/check.mjs --workspace ../trailboard-demo
node scripts/check.mjs --denylist /path/to/private-identifiers.json
node scripts/check.mjs --release
node --test scripts/system.test.mjs scripts/smoke.test.mjs scripts/runtimes.test.mjs
```

The checker verifies required files, Markdown links, JSON/configuration, task state, selected runtime entries, Codex role/skill metadata and worker caps. It checks required fields in the TOML emitted by this kit, not every possible native Codex setting. Project metadata is not a native client configuration file.

The optional denylist is a JSON string array stored outside the distribution. Findings name files/categories rather than matched credential values. Known-pattern scans are heuristic and cannot identify every secret. External links are syntax checked without fetching them. Git history needs separate review.

Installed workspace scans skip .git, node_modules, local environments/settings, logs and work/coverage directories. Distribution scanning rejects private environment/key/log/local-settings artifacts. Normal validation never starts an AI session or grants publication approval.

## Isolated session fixtures

```sh
node scripts/smoke.mjs --prepare --target ../codex-smoke --runtime codex
node scripts/smoke.mjs --check-auth --runtime codex
node scripts/smoke.mjs --verify --workspace ../codex-smoke --phase baseline
```

Preparation accepts claude, codex or both and creates one fictional fixture with role prompts. Auth preflight prints a sanitised status and never a credential/account identifier. With both mode it checks both clients. No helper invokes a model.

Baseline verification expects the two unimplemented filter cases to fail, the existing tests to pass and fixture bytes to remain unchanged. Candidate verification requires all CLI cases to pass. It executes fixed local Node commands, so inspect model-written code before running it. Reports do not set task approvals or release status. See the [session test procedure](../docs/authenticated-smoke.md).
