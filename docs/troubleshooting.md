# Troubleshooting

| Symptom | Action |
|---|---|
| Installer refuses a directory | Choose a new target. It never merges into existing files. |
| Node reports unsupported version | Use Node.js 22 or newer; no package installation is needed. |
| Claude cannot access a task outside its repo | Explicitly grant the PM planning directory using supported client controls; include its absolute path in the brief. |
| PM claims a tool that is unavailable | Set adapter mode to `manual`; open named sessions yourself and carry task paths/results. |
| Usage or worker state is unknown | Record `unknown`; obtain a human observation or a bounded override. Do not invent telemetry. |
| Session was interrupted | Read the task Hand-off and verify any listed running jobs before resuming. |
| Worker is busy when criteria change | Update dated criteria first; request a safe stop, then rebrief after the current step. |
| QA fails twice | Stop the retry cycle; PM asks for a smaller scope or a revised plan before round three. |
| Dirty worktree belongs to another task | Stop branch operations. Preserve changes and agree ownership/isolation first. |
| Model or effort is unsupported | Map the tier to an available setting and record the substitution; do not repeatedly retry it. |
| Manual board differs from reality | Reconcile from task evidence and human-confirmed worker state; a Markdown row is not telemetry. |
| Readiness gate fails | Read the error, resolve licence/approval/evidence requirements, rerun; never disable the gate to claim readiness. |

## Safe recovery sequence

1. Save current files and inspect the board, pending decisions and open tasks.
2. Reconcile task status with its single Hand-off block. Preserve append-only notes.
3. Verify what ran: command result, changed files and any background processes. An exit code alone may miss tool-level failures.
4. Ask the human about state that cannot be observed. Do not restart a still-running build or worker blindly.
5. Recheck approvals, usage, dependencies and model choice. Resume the incomplete sub-step only.

Do not clear a worker to fix a failed test. Save a hand-off before context changes, and give a new session a complete brief. Claude Code's own auto-compaction and permissions remain client behavior; this project's thresholds are advisory policy.
