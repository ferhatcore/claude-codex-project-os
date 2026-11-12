---
name: project-os-resume
description: Resume Project OS work after a restart, /clear or compact, from the saved board, task files and Hand-off blocks.
---

# project-os-resume

Read CLAUDE.md, .project-os.json, planning/board.md, planning/pending-user.md and the Hand-off of every task that is not `done`.
Reconcile the files with reality: check for unfinished edits and run the recorded test command if the Hand-off claims a result. Unknown state is not idle or approved.
Do not repeat a completed step or restart finished work. Tell the user which tasks are done, what is in progress and its exact `next` step, then continue from that point once any missing approval is given.
Keep one shared planning history across Claude Code and Codex; record the active client in the dated task notes.
