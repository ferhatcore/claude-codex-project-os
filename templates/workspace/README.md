# PM workspace

Start your selected coding client in this directory and ask it to read [START.md](START.md). This workspace coordinates product repositories; it does not start workers automatically.

| File | Purpose |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Standing PM and worker boundaries |
| `.project-os.json` | Project configuration, read explicitly by PM |
| [planning/flow.md](planning/flow.md) | Gates, dispatch, pipelines and recovery |
| [planning/board.md](planning/board.md) | Lanes, worker state and ranked requests |
| [planning/decisions.md](planning/decisions.md) | Human decisions and approval references |
| [planning/pending-user.md](planning/pending-user.md) | Decisions and human-only actions |
| [planning/roles.md](planning/roles.md) | Role responsibilities and session labels |
| [planning/model-log.md](planning/model-log.md) | Effective models, usage and dispatch observations |
| [planning/baseline.md](planning/baseline.md) | Engineering setup choices |
| [planning/rule-changes.md](planning/rule-changes.md) | Proposed and approved process changes |
| [planning/tasks/_template.md](planning/tasks/_template.md) | Task schema; fill before dispatch |
| [planning/qa/README.md](planning/qa/README.md) | Independent QA contract |
| [planning/reviews/queue.md](planning/reviews/queue.md) | Optional advanced review |

The template task and review brief intentionally contain field markers. Only instantiate them into real work after filling the relevant fields. `unknown` and `unverified` describe unavailable evidence, not permission to guess. Repository code, test commands and branch ownership require discovery and confirmation.

The installer does not create Git repositories or change product files outside this new workspace. Keep private planning state private unless the owner explicitly approves sharing it. This template's contents should be reviewed against existing organisational rules before adoption.
