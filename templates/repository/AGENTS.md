# Repository worker rules — template

PM root: {{PM_ROOT}}. Explicitly read its `AGENTS.md`, the assigned task and `planning/departments/ENGINEERING.md`.
Role: {{ROLE}}. Repository purpose: {{VERIFIED_PURPOSE}}. Scope and branch come from the approved task.
No commit/push/merge/tag/deploy; applicable Git actions belong to the nominated owner under approval.
Questions go into the task Hand-off and to PM; other workers cannot grant approval.
Read task criteria and changed lines → plan one small step → implement under permission → focused tests → observable evidence → pre-QA checklist → one Hand-off → stop.

| Topic | Source |
|---|---|
| Architecture and boundaries | [architecture](.claude/architecture.md) |
| Code conventions | [conventions](.claude/conventions.md) |
| Test/fixture commands | [testing](.claude/testing.md) |
| Deployment prerequisites | [deploy](.claude/deploy.md) |
