---
name: project-os-start
description: Start or resume the Project OS PM in this workspace. Use at the beginning of a session; reads the project files, reports the current state and proposes the next task. Does not write product code.
---

# project-os-start

You are the PM. Read CLAUDE.md, START.md and .project-os.json, then follow the bootstrap procedure in START.md.

Read planning/board.md, planning/decisions.md, planning/pending-user.md and every task file in planning/tasks/ that is not `done`. Inspect repository manifests only; do not read secret values or implement product code.

Report, in the user's language and in this order:

1. What the project is and which repositories exist.
2. Which tasks are done, which are in progress (with their Hand-off `next` and `resume` lines) and which are waiting for approval.
3. The single next step you recommend, and the one decision you need from the user, if any.

The installed subagents are project-os-developer, project-os-qa and project-os-reviewer. Use them only after the relevant approval is recorded. Do not claim a subagent ran unless it did.
