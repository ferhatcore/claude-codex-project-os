# Quickstart

Use a new local directory for the first setup. Choose Claude Code, Codex or both. The same tasks and decisions work with either client.

## 1. Prerequisites

Install Node.js 22 or newer and your selected client. Use the [Claude Code setup guide](https://code.claude.com/docs/en/quickstart) or [Codex instructions](docs/codex.md). Authenticate through the client; do not put credentials in project files. No npm install or external service is needed for the example.

## 2. Create a workspace

From this repository root, choose one command:

```sh
node scripts/init.mjs --target ../claude-demo --example --runtime claude
node scripts/init.mjs --target ../codex-demo --example --runtime codex
node scripts/init.mjs --target ../shared-demo --example --runtime both
```

The commands work in PowerShell and POSIX shells. Each destination must not already exist. The default profile is lean with one active worker; use `--profile standard` or `--profile heavy` when appropriate. Omitting `--runtime` preserves the original Claude Code default.

In the selected generated directory, run:

```sh
node repos/catalog/catalog.mjs
node --test repos/catalog/catalog.test.mjs
```

Expected output is three fictional book titles. The baseline has three tests. The installer creates logical repository folders, not Git metadata, branches, remotes or cloud resources.

## 3. Start the PM

Open `claude` or `codex` at the generated workspace root. For both mode, choose the client for the current step. Paste:

```text
Read START.md and follow its bootstrap procedure. Act as PM.
Inspect the configuration, repository manifests and planning files.
Report actual available tools and the next task proposal.
Do not change product code yet.
```

Codex can also use `$project-os-start`. Trust the generated project in the client before expecting its project configuration to load. Inspect the installed files first. The root instructions are CLAUDE.md for Claude Code and AGENTS.md for Codex.

The PM should report the repository inventory, current decisions, model preferences and missing authority. Files on disk do not prove that workers were started or usage was measured. The initial capability mode stays manual until actual tools are observed.

## 4. Approve a task

Read `planning/tasks/TB-001.md`. It proposes `--status unread|finished` for the reading list. The task starts as todo, with scope and code permission pending. After reviewing it, you can say:

```text
Approve TB-001 scope and code/test/README changes in repos/catalog only,
with an independent QA pass. Use local-folder mode.
No Git writes, deployment, paid service or external message is approved.
```

PM records the real approval in the task and decisions file. Local-folder mode requires no branch operation. A Git workflow needs its own applicable approval and worktree check.

## 5. Developer, QA and review

Claude Code can use separate manual sessions with a self-contained task brief. Codex can use the installed role definitions through its available delegation tools. If named role selection is absent, pass the corresponding TOML role instructions in the delegated brief; if no delegation is available, use separate manual sessions. Include workspace/task/rule paths and the stopping point.

The developer implements only approved scope, runs tests and saves a handoff. QA waits until that lane is free, then checks each criterion and writes its own evidence. Reviewer returns findings to PM without editing the candidate. PM checks completeness before any Git decision.

In both mode, there is still only one planning directory. Finish and save a step before switching clients. Never run a second writer in the same repository merely because it uses a different client.

## 6. Use your own repositories

Omit `--example`, set `--name "My Project"` and choose a runtime. Add repository paths and owners to .project-os.json during onboarding. Existing repositories keep their current files. Review and merge entry rules manually using the [repository starter](templates/repository/README.md) and [customization guide](docs/customization.md).

## Validate

From the distribution root, using the workspace you chose:

```sh
node scripts/check.mjs --workspace ../shared-demo
node scripts/check.mjs
node --test scripts/system.test.mjs scripts/smoke.test.mjs scripts/runtimes.test.mjs
```

The [authenticated test guide](docs/authenticated-smoke.md) covers real session evidence for each runtime. Normal offline checks do not start models.
