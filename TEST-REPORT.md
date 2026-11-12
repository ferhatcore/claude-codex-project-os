# Local test record

Recorded on 2026-11-11 on Windows x64 with Node.js 24.14.0.

## Codex installation

Project OS was installed into an existing development workspace using the Codex
runtime and lean profile. Four role definitions, four skills, repository entry
rules and a single-worker limit were installed. Independent checks of the
configuration, runtime files and task schema returned no errors.

A fresh Codex desktop QA worker recovered the current repository, task,
approval scope and next step from the installed files. It ran the documented
checks and wrote its own report. Native delegation passed the complete installed
QA instructions to the worker; selection of a named custom agent was unavailable.

This demonstrates local installation and independent recovery/QA. It does not
demonstrate every role, a complete new-feature cycle, or live Claude operation.

## Commands and first results

| Command | First independent result |
|---|---|
| `node scripts/check.mjs` | Failed because README linked this missing report |
| `node --test scripts/system.test.mjs scripts/smoke.test.mjs scripts/runtimes.test.mjs` | 44 passed, 1 failed for that same missing report |
| `node --test examples/trailboard/repos/catalog/catalog.test.mjs` | 3 passed |

This report was added to repair that documentation link and preserve the observed
results. Independent verification of the corrected candidate is the next step.
The source tests and checks were not weakened.

## Standalone CLI limitation

Codex CLI 0.147.0 reported a ChatGPT login, but its real invocation failed with
`model_not_found`: the inherited `gpt-6.1-sol` model was unsupported for that
CLI account. That run did not reach workspace recovery. No model, account,
global configuration or permission override was applied to make it pass.

The successful desktop worker and failed CLI invocation are separate results.
Linux CI, live Claude sessions and publication were not exercised in this local
installation check. Earlier release records describe other verification runs.

## Second independent result

The corrected candidate passed the distribution checker with zero findings, and
the previously failed distribution-integrity test passed (1 test, 0 failures).
The 44 previously passing automated tests and 3 catalog tests were not rerun
because code and tests were unchanged. The first failure and standalone CLI
limitation above remain part of the record.

## Real CLI scenario: notes app (2026-11-11 and 2026-11-12)

Branch `fix/claude-team-setup`, based on commit `19e70141f0bd7414e5483d99e1b230bfb837f07e`. Windows 11, Node.js 24.14.0, Git 2.53.0, Claude Code 2.1.110, Codex CLI 0.147.0. Every model step below is a real CLI session; no response was simulated. Raw logs stay on the tester's machine and are not published; their file names are listed for reference.

### Automated checks

| Command | Result |
|---|---|
| `node scripts/check.mjs` | PASS, 0 findings |
| `node --test scripts/system.test.mjs scripts/smoke.test.mjs scripts/runtimes.test.mjs` | 46 passed, 0 failed |
| `node --test examples/trailboard/repos/catalog/catalog.test.mjs` | 3 passed |
| `node .project-os/check.mjs --workspace .` in fresh claude, codex, both and example installs | PASS, 0 findings each |

### Codex CLI

Command shape: `codex exec -m gpt-5.6-sol -s workspace-write --skip-git-repo-check -C <workspace> '<prompt>'`, one new process per step, so no chat history carries over. `-m` was needed because the globally configured model `gpt-6.1-sol` returns `model_not_found` for this ChatGPT-login CLI; global settings were not changed.

| Step | Session | Result |
|---|---|---|
| 1. Install and start | `init.mjs --runtime codex --name Notes`, then `$project-os-start` | PASS. Plan, task NOTES-001 with 7 criteria, approval request; no product code written (`codex-01-start.log`) |
| 2–4. Approve, build, test | `$project-os-task` with approval, Git declined | PASS. Developer then QA; 8/8 tests. Tester ran add/list/delete by hand on a copy: correct output and exit codes (`codex-02-build.log`) |
| 5. New session recall | `$project-os-resume`, read-only sandbox | PASS. Correctly reported project, done task, verified evidence and "no further approved step" (`codex-03-resume.log`) |
| 6a. New feature and bug | `$project-os-task`: `search <text>`, and a real bug found by the tester (multi-line notes print an unnumbered second line in `list`) | PASS. Two tasks drafted, approval requested, no code (`codex-04-plan2.log`) |
| 6b. Build both | Approved session | INTERRUPTED. NOTES-002 (bug) done; NOTES-003 (search) stopped in QA when the account hit its Codex usage limit (`codex-05-build2.log`) |
| 6c. Recover the interruption | Next day, new session, `$project-os-resume` with no extra context | PASS. Found NOTES-003 in QA, finished it without redoing NOTES-002; 13/13 tests. Tester confirmed search (case-insensitive, `No matching notes.`, empty query rejected) and one-line multi-line listing by hand (`codex-06-resume.log`) |

**Defect found:** the workspace validator reported 26 findings on the records Codex wrote. The required formats (repository fields and types, `given:` approvals, `- [ ] AC-n:` lines, QA table rows) were never shown to the agent, START.md asked for "Git flow" and "push-triggered deployment" fields the schema rejects, and the validator was not installed in the workspace. The trial above used a new project, not the Trailboard example whose records are pre-written, which is why earlier runs missed it.

**Fix (this branch):** `planning/formats.md` documents every record shape; START.md, the task template, CLAUDE.md/AGENTS.md, the QA roles and the task skills point to it; the validator ships as `.project-os/check.mjs` and PM/QA must reach zero findings before `done`. A regression test reproduces the original bad record.

**Rerun after the fix** (fresh workspace, same prompts):

| Step | Result |
|---|---|
| Start and plan | PASS. Correct repository entry, repository `AGENTS.md` created, PM ran the validator itself: 0 findings (`codex-r2-01-start.log`) |
| Approve, build, QA | PASS. 6/6 criteria, 5/5 tests, validator 0 findings; tester repeated add/list/delete and the missing-ID error by hand (`codex-r2-02-build.log`) |

The feature/bug and recall steps were not repeated after the fix; they passed before it and the fix only changes record formats.

### Claude Code CLI

| Step | Result |
|---|---|
| Install | PASS. `init.mjs --runtime claude` creates `.claude/agents` (developer, qa, read-only reviewer) and `.claude/skills` (four skills) |
| Client recognises the team | PASS. `claude agents` in the workspace lists `project-os-developer`, `project-os-qa`, `project-os-reviewer` as project agents; a separate Claude Code session also discovered the four skills by name |
| Steps 1–6 with a model | NOT RUN. `claude -p "/project-os-start"` returned `Not logged in · Please run /login` (`claude-01-start.json`); `claude auth status` reports `loggedIn: false`. The browser sign-in was postponed by the owner. No Claude result here is a pass. |

### Usability notes

- The PM asks for a separate "usage-check override" approval for each build because account usage cannot be measured. It is safe but confusing for new users.
- The PM proposes `git init` in every new repository; declining it works fine (local-folder mode).
