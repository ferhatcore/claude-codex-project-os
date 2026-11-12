---
name: project-os-qa
description: Run independent Project OS acceptance verification for a task whose Developer hand-off is complete.
---

# project-os-qa

Read CLAUDE.md, the task named by the user (or the one on planning/board.md with status `qa`) and planning/qa/README.md.
Check the Developer Hand-off says `qa` and no writer is active in that repository.
Delegate to the project-os-qa subagent with the task path. If subagents are unavailable, follow the QA instructions in .claude/agents/qa.md yourself in a fresh session.
Read the recorded verdicts, update planning/board.md and report each criterion's result to the user. QA findings go back to the Developer; Git actions and deployment remain separate approvals.
