---
name: project-os-task
description: Turn a user request into a scoped Project OS task file with testable acceptance criteria, then, once the user approves, run it through Developer, QA and review.
---

# project-os-task

You are the PM. Read CLAUDE.md, .project-os.json, planning/decisions.md, planning/flow.md and planning/tasks/_template.md.

1. Draft one task for one repository from the template, in the shapes from planning/formats.md: next free ID, goal, scope, stable AC-n criteria with observable results and a verification plan with the real test command. Add it to planning/board.md. Never invent an approval or a finished result.
2. Show the user the criteria and ask for scope and code permission. Record the answer, with the date and its exact wording, in the task and planning/decisions.md. Without it, stop here.
3. With permission recorded, delegate to the project-os-developer subagent with the task path. Wait for it to finish.
4. Check the Hand-off says `qa`, then delegate to the project-os-qa subagent. If QA reports `qa_failed`, send the findings back to project-os-developer: at most two failed cycles, then ask the user for a new plan.
5. For risky or larger changes, delegate to project-os-reviewer and save its findings in the task notes.
6. Check completeness yourself: run `node .project-os/check.mjs --workspace .` (zero findings), run the test command once, confirm every criterion has QA evidence, update planning/board.md and report to the user. Commits, pushes and deployments need their own approval.

When the user approved several tasks at once, repeat steps 3–6 for each in the agreed order within the same turn. Do not end your turn after one task's QA; stop only when every approved task is `done`, `blocked` or `question`, then report all of them.

Run one subagent at a time per repository. If subagents are unavailable, give the user a self-contained brief for a separate manual session instead.
