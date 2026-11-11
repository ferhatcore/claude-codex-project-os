# Quickstart

Use a new local directory for the first setup. This project uses the [MIT License](LICENSE), Copyright (c) 2026 Ferhat Kosger.

## 1. Check prerequisites

Install Claude Code using its [official installation instructions](https://code.claude.com/docs/en/quickstart), then authenticate interactively with your account. Do not paste credentials into planning files. Install Node.js 22+ separately if you want the helper scripts. Run:

```sh
node --version
claude --version
```

No npm install, MCP server or additional service is needed. Review downloaded files before trusting the directory in Claude Code.

## 2. Create the isolated example

From this distribution's root, these commands work in PowerShell and POSIX shells:

```sh
node scripts/init.mjs --target ../trailboard-demo --example --profile lean
cd ../trailboard-demo
node repos/catalog/catalog.mjs
node --test repos/catalog/catalog.test.mjs
```

Expected CLI output is three fictional titles, one per line. The three baseline tests should pass. An existing target, even an empty one, is refused. Pick a different name instead of deleting your work.

The example has `repos/catalog` (local CLI) and `repos/handbook` (documentation). These are separate logical repositories; the installer creates no `.git` directories, branches or remotes. It writes only inside the new destination, uses no network and never invokes Claude.

## 3. Start the PM

Run `claude` from `trailboard-demo`, then paste:

```text
Read START.md and follow its bootstrap procedure. You are the PM.
Use the project configuration and report available capabilities honestly.
Inspect manifests, not product code, during onboarding. Report the proposed
TB-001 task and the approvals it needs. No product code or Git writes yet.
```

Expected response: a short capability report, repository table, model choices requiring confirmation, and the first task proposal. It must not claim to have opened worker sessions, read account usage or approved itself. Check the generated files before proceeding. The default conversation language is English; ask the PM to use your preferred language. Planning files remain English for consistency, without any promised token-saving ratio.

## 4. Approve a concrete first task

Read `planning/tasks/TB-001.md`. It proposes adding `--status unread|finished` to the CLI. Its status is `todo`, code permission is `pending`, and no tests for the proposed feature have been claimed as passed.

After reviewing scope, you can tell the PM:

```text
Approve TB-001 scope and code changes in repos/catalog only, including
focused tests and an independent QA pass. Use the configured lean profile.
No commit, push, merge, deployment, paid service or external message is approved.
```

If using Git, separately authorise local Git initialization and task-branch creation for the example repositories; otherwise set the task's Branch to `none (local folder mode)`. The developer must never guess a branch. The PM records the approval source in the task and `planning/decisions.md`.

## 5. Hand off to a named developer

Baseline mode uses another terminal that **you** open in `trailboard-demo/repos/catalog`. Run `claude`, give the session the logical name `Trailboard : Catalog`, and paste the PM's self-contained brief. Include the absolute PM workspace path if it is outside the session's accessible directories; grant only the required additional directory using supported client permissions.

The brief must identify the task, root `CLAUDE.md`, repository `CLAUDE.md`, engineering standard, allowed branch and output. The developer reads the complete task, writes one small step and updates its single Hand-off block. Return the task path and status to PM manually. A label in the board is a role name, not a persistent session identifier.

For QA, release the catalog lane and open a fresh `Trailboard : QA` session at the PM root. It follows `planning/qa/README.md`, reruns criteria and writes its own evidence. If native delegation is verified and explicitly enabled, the PM may use that adapter instead. See [Claude Code capabilities](docs/claude-code.md).

## 6. Use your own project

From the distribution root:

```sh
node scripts/init.mjs --target ../my-project-pm --name "My Project" --profile lean
```

Edit the new `.project-os.json`: language, time zone, model tier mappings, repository paths and owners. Repository paths are relative children of the PM root; use `repos/api`, for example. To keep an existing repository elsewhere, follow the reviewed manual-copy procedure in [customization](docs/customization.md). Do not move or overwrite a real repository just to fit the example.

Run the PM bootstrap. Inspect only manifests and top-level layout initially. The owning developer later verifies repository conventions against code in a scoped task. Unknown commands stay explicitly unverified and block code dispatch. An empty project starts with an architecture proposal and human approval.

## Check your installation

From the distribution root, replacing the destination if you chose another:

```sh
node scripts/check.mjs --workspace ../trailboard-demo
node scripts/check.mjs
node --test scripts/system.test.mjs
node --test scripts/smoke.test.mjs
```

The first checks installed state and links; the second checks the distribution; the test suites exercise installation, failure paths and smoke verification offline. None executes an AI session. Follow the [authenticated smoke procedure](docs/authenticated-smoke.md) to test real separate role sessions; inspect [release readiness](release/READINESS.md) for actual results and remaining gaps.
