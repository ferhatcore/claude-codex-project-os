# Project OS for Claude Code and Codex

A project structure with task files, clear responsibilities and a separate QA step. Install it for Claude Code, Codex or both from this repository.

The PM keeps track of decisions, writes tasks and assigns work. A developer makes the change. QA checks the result against the task before it comes back for approval. Progress lives in files, so a new session can continue without starting the explanation again.

Both clients use the same planning directory, task files, decisions and repository rules. You can change clients between steps while keeping the project state in one place.

## Choose your client

You need Node.js 22 or newer and the coding client you want to use. There are no npm packages to install.

```sh
git clone https://github.com/ferhatcore/claude-codex-project-os.git
cd claude-codex-project-os
```

For Claude Code:

```sh
node scripts/init.mjs --target ../claude-demo --example --runtime claude
```

For Codex:

```sh
node scripts/init.mjs --target ../codex-demo --example --runtime codex
```

For both clients in one workspace:

```sh
node scripts/init.mjs --target ../shared-demo --example --runtime both
```

Open the generated directory in your selected client and ask it to read `START.md`. In Codex you can also invoke `$project-os-start`.

The example is a local reading list called Trailboard, with a small CLI, a handbook and a proposed status filter task. Try it from the generated workspace:

```sh
node repos/catalog/catalog.mjs
node --test repos/catalog/catalog.test.mjs
```

For your own project, omit `--example` and set `--name "My Project"`. The destination must be new. The installer leaves existing repositories and global client settings alone. Older install commands without `--runtime` continue to select Claude Code.

[Quickstart](QUICKSTART.md) covers the first session and connecting existing repositories.

## What gets installed

Claude Code receives `CLAUDE.md` instructions. Codex receives `AGENTS.md`, project skills and four role definitions for PM, Developer, QA and Reviewer. Selecting both installs both entry points with one shared set of planning files.

Codex uses the available native delegation tools. If a client cannot select a named role directly, the PM sends that role's full instructions in the delegated brief. Manual sessions are the fallback. The installer itself does not start agents or make a model request.

The generated `.project-os.json` records the selected runtime, repository list, worker cap and model preferences. Choose `lean`, `standard` or `heavy` for the worker cap. Model tiers inherit the active model until you map them to settings available in your account.

## How a task moves

```mermaid
flowchart LR
    H[Human: scope and approval] --> PM[PM: task and plan]
    PM --> D[Developer]
    D --> S{Security review needed?}
    S -->|yes| R[Security review]
    S -->|no| Q[QA]
    R -->|pass| Q
    R -->|findings| D
    Q -->|findings| D
    Q -->|criteria pass| C[PM: check completeness]
    C --> A[Human: approve Git actions]
    A --> P[Separate deployment decision]
```

A task names its repository, scope, branch, acceptance criteria and permissions. The working session records what changed, what it checked and where to resume. QA verifies each criterion independently. If scope changes, the task changes first.

Security and QA share a limit of two failed review cycles. A third cycle needs a new plan and human approval. Only one writer works in a repository at a time, including when switching between Claude Code and Codex. Code approval does not also approve a commit, push or deployment.

## Inside the repository

1. [Workspace templates](templates/workspace/README.md) for tasks, decisions, QA and reviews.
2. [Repository rules](templates/repository/README.md) for architecture, conventions, testing and delivery.
3. [Trailboard](examples/trailboard/README.md), a complete local example with two repository folders.
4. [Codex setup](docs/codex.md) and [Claude Code notes](docs/claude-code.md).
5. [Workflows](docs/workflows.md), [customization](docs/customization.md) and [recovery](docs/troubleshooting.md).
6. [Helper scripts](scripts/README.md), [contribution guide](CONTRIBUTING.md) and [security policy](SECURITY.md).

## Run the checks

```sh
node scripts/check.mjs
node --test scripts/system.test.mjs scripts/smoke.test.mjs scripts/runtimes.test.mjs
node --test examples/trailboard/repos/catalog/catalog.test.mjs
```

The checks cover all three runtime choices, all three worker profiles, shared task state, generated agent files, installation refusals, configuration and fixture behavior. GitHub Actions runs the suites on Windows and Linux with Node.js 22.

The [Codex verification record](release/CODEX-CHECK.md) lists the client sessions, task results and remaining limits.

## License

[MIT](LICENSE). Copyright (c) 2026 Ferhat Kosger.

An independent project for Claude Code and Codex.
