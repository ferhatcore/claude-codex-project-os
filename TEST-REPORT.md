# Test report — v1.1.0

Project OS was tested end to end with the real Claude Code and Codex command-line clients on Windows 11 with Node.js 24.14.0. In each client the PM planned a small notes app; Developer and QA roles built it, tested it and verified every criterion; a new session picked up the saved state; and a new feature and a bug fix followed. Each built app was also run by hand.

| Client | Workflow | Result |
|---|---|---|
| Claude Code 2.1.110 | Plan → Developer and QA subagents → resume in a new session → feature and bug fix | Passed: 20/20 app tests, all criteria verified, workspace validator 0 findings |
| Codex CLI 0.147.0 | Same scenario, plus recovery of work interrupted by an account usage limit | Passed: 13/13 app tests, all criteria verified, workspace validator 0 findings |
| Codex desktop | Install into an existing workspace, independent QA recovery from files | Passed |

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
| 6b. Build both | Approved session | NOTES-002 (bug) done with QA; the session paused during NOTES-003 QA when the account usage limit was reached (`codex-05-build2.log`) |
| 6c. Recover the interruption | Next day, new session, `$project-os-resume` with no extra context | PASS. Found NOTES-003 in QA, finished it without redoing NOTES-002; 13/13 tests. Tester confirmed search (case-insensitive, `No matching notes.`, empty query rejected) and one-line multi-line listing by hand (`codex-06-resume.log`) |

**Improvement found:** the workspace validator reported 26 findings on the records Codex wrote. The required formats (repository fields and types, `given:` approvals, `- [ ] AC-n:` lines, QA table rows) were never shown to the agent, START.md asked for "Git flow" and "push-triggered deployment" fields the schema rejects, and the validator was not installed in the workspace. Earlier runs used the Trailboard example, whose records are pre-written.

**Fix in v1.1.0:** `planning/formats.md` documents every record shape; START.md, the task template, CLAUDE.md/AGENTS.md, the QA roles and the task skills point to it; the validator ships as `.project-os/check.mjs` and PM/QA must reach zero findings before `done`. A regression test reproduces the original bad record.

**Rerun after the fix** (fresh workspace, same prompts):

| Step | Result |
|---|---|
| Start and plan | PASS. Correct repository entry, repository `AGENTS.md` created, PM ran the validator itself: 0 findings (`codex-r2-01-start.log`) |
| Approve, build, QA | PASS. 6/6 criteria, 5/5 tests, validator 0 findings; tester repeated add/list/delete and the missing-ID error by hand (`codex-r2-02-build.log`) |

Feature, bug-fix and recall steps use the same record shapes and passed in the first run.

### Claude Code CLI

| Step | Result |
|---|---|
| Install | PASS. `init.mjs --runtime claude` creates `.claude/agents` (developer, qa, read-only reviewer) and `.claude/skills` (four skills) |
| Client recognises the team | PASS. `claude agents` in the workspace lists `project-os-developer`, `project-os-qa`, `project-os-reviewer` as project agents; a separate Claude Code session also discovered the four skills by name |

Signed-in claude.ai team account; every session reported the account default model `claude-opus-4-6[1m]`. Each step ran as a new process:

```sh
claude -p "<prompt>" --output-format json --permission-mode acceptEdits --allowedTools "Bash(node *)" "Bash(ls *)" "Bash(mkdir *)" "Bash(cat *)" Read Glob Grep Skill Agent Edit Write
```

Subagent use was confirmed from each session transcript, not from the model's summary.

| Step | Session | Result |
|---|---|---|
| 1. Install and start | `init.mjs --runtime claude --name Notes`, then `/project-os-start` | PASS. Plan, NOTES-001 with 9 criteria, repository `CLAUDE.md`, approval request, no product code; validator 0 findings (`claude-r-01-start.json`) |
| 2–4. Approve, build, test | `/project-os-task` with approval | PASS. Transcript shows `project-os-developer` then `project-os-qa`; 8/8 tests. Tester ran add/list/delete/missing ID by hand on a copy: correct (`claude-r-02-build.json`) |
| 5. New session recall | `/project-os-resume` in `--permission-mode plan` | PASS. Correct project, done task, evidence and next step; file hashes unchanged. The answer is in the transcript: `-p` printed an empty result because plan mode ended on a denied ExitPlanMode (`claude-r-03-resume.json`) |
| 6a. Feature and bug drafted | `/project-os-task`: `search <text>`, and a real bug found by the tester (`add ""` stored an empty note) | PASS. NOTES-002 and NOTES-003 drafted, approval requested, validator 0 findings. The PM wrote a wrong output format in NOTES-002 AC-1 (`2. Buy milk`) (`claude-r-04-plan2.json`) |
| 6b. Approve with a correction | Same skill, AC-1 corrected by the user | CHANGED line and `given:` approvals recorded; NOTES-003 built and passed QA through subagents. Run with the third-party claude-mem plugin disabled for the session, because its read hook shortens file contents (`claude-r-05b-build2.json`) |
| 6c. Continue | New session, `/project-os-resume` "continue the approved work" | State recalled correctly; the PM asked for confirmation before NOTES-002, which led to the resume improvement below (`claude-r-06-resume-build.json`) |
| 6d. Continue after skill fix | Same prompt with the fixed skills | PASS. Developer and QA subagents ran for NOTES-002 without a new question; 20/20 tests; validator 0 findings (`claude-r-07-resume-build.json`) |

Tester's final check on a copy: empty and whitespace-only notes rejected with exit 1; `search milk` matches `Buy MILK`; no match prints `No matching notes.` with exit 0; `search` without text exits 1; a deleted note disappears from search and list.

**Improvements in v1.1.0:** `/project-os-task` now finishes every task approved together before ending the turn, and `/project-os-resume` continues an already-approved task without asking again. Both were copied into the test workspace and verified in step 6d.

### Tips and v1.1.0 usability changes

- The PM no longer asks for a usage approval before each build; unknown usage does not block work.
- New repositories start in local-folder mode; the PM sets up Git only when you ask for it.
- Plugins with hooks that rewrite tool output (here claude-mem) can stop the PM from reading task files. Disable them for the workspace if the PM reports truncated files.
- PMs sometimes write a wrong detail into a criterion. Read the criteria before approving; a correction is recorded as a dated CHANGED line.
