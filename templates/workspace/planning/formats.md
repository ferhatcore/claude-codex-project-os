# Record formats

The workspace validator reads these records. Write them exactly in these shapes, then run:

```sh
node .project-os/check.mjs --workspace .
```

Fix every finding before you report a task as `qa` or `done`. A finding in your own record is a real failure, not a style note.

## Repository entry in .project-os.json

Each item in `repositories` has exactly these nine fields and no others:

```json
{
  "id": "notes",
  "path": "repos/notes",
  "type": "cli",
  "owner": "Notes Developer",
  "branch": "none (local folder mode)",
  "test_command": "node --test",
  "smoke_command": "node cli.js list",
  "push_deploys": false,
  "external": false
}
```

- `id`: lowercase letters, digits and hyphens, starting with a letter.
- `path`: relative path inside the workspace; the folder must exist.
- `type`: one of `backend-api`, `service`, `web`, `admin`, `landing`, `mobile`, `infra`, `data`, `library`, `cli`, `tests`, `docs`, `external`.
- `owner`, `branch`, `test_command`, `smoke_command`: nonempty text. Use `none (local folder mode)` when there is no Git branch.
- `push_deploys`, `external`: `true` or `false`, never text.

Put Git flow, deployment notes and other facts in `planning/decisions.md`, not in extra fields.

Each repository folder needs its own entry file for every installed client: `CLAUDE.md` for Claude Code, `AGENTS.md` for Codex. A short one is enough: the PM workspace path, "read the workspace entry file and the assigned task first", the test command and "no commit, push or deploy".

## Task header

Copy `planning/tasks/_template.md`. Keep every `- **Field:** value` line once. Allowed values:

| Field | Value |
|---|---|
| ID | Uppercase prefix, hyphen, number: `NOTES-001` |
| Repo | An `id` from `.project-os.json` |
| Status | `todo`, `in_progress`, `review`, `qa`, `qa_failed`, `done`, `blocked` or `question`; the Hand-off `status` line must match |
| Priority | `P0`, `P1` or `P2` |
| Branch | Not `unverified` once work starts; `none (local folder mode)` is valid |
| Scope approval | `pending`, or `given: <date> <who> — <what> (planning/decisions.md)` |
| Code permission | `pending`, `not-required`, or `given: <date> <who> — <what> (planning/decisions.md)` |
| Security review | `yes` or `no` |
| Model tier | `economy`, `standard`, `deep` or `review` |
| Failed review cycles | A whole number |

A task in `in_progress`, `review`, `qa`, `qa_failed` or `done` must have `given:` scope approval and `given:` or `not-required` code permission.

## Acceptance criteria

One line per criterion, with no bold or extra punctuation before the colon:

```text
- [ ] AC-1: `node cli.js add "milk"` prints `Added note 1: milk` and exits 0.
```

Tick the box (`- [x]`) only when QA has passed it.

## QA report

For a `done` task, the QA report section has one row per criterion, verdict in lowercase:

```text
| Criterion ID | Verdict | Actual command/action and outcome | Evidence path |
|---|---|---|---|
| AC-1 | pass | node cli.js add "milk" → "Added note 1: milk", exit 0 | planning/tasks/NOTES-001.md |
```

Use `fail` for a failed criterion and keep earlier cycles' rows; add a dated line above each new cycle.
