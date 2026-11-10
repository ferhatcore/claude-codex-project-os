# Engineering standard

## Scope and working loop

1. Read assigned task, branch, code permission, changed criteria and hand-off. Read the workspace entry rules and the repository's relevant topic files explicitly.
2. Inspect worktree state before any authorised branch action. Do not overwrite another task's work. Branch is the task's value, never a guessed default.
3. Plan a small step in a dated note. Change only approved files/behavior and directly required tests. Do not add dependency upgrades, auth, infrastructure or security redesign opportunistically.
4. Implement, then run focused tests. Check every acceptance criterion as met/not met/not in this step with evidence. A gap becomes a question or a follow-up proposal.
5. For risky logic, adversarially check validation, identity/ownership, retries/races, duplicate processing, state transitions and safe logs. For monetary code include units, currency, rounding and idempotency; use fixture data only.
6. Reread changed criteria. Review your diff, then run the configured full suite once for this candidate. QA independently runs its own relevant verification; reruns after changes are legitimate.
7. Verify actual behavior: local API response, CLI stdout/exit status or real page/device state. UI evidence should show relevant widths/themes and loading/empty/error states. Do not claim a screenshot was inspected if it was only saved.
8. Write evidence and limits, update one Hand-off block, release the lane and stop after the assigned step. Questions go to PM with options/recommendation; tool permission prompts still follow the client.

## Before qa

- Every criterion checked; failed/unverified items explicit; latest `CHANGED` lines handled.
- Focused and full-suite command/results recorded, no hidden skipped/disabled checks.
- Diff reviewed: scope only, no debug remnants, credentials or unrelated work.
- User-visible result checked where applicable; artifact paths and deviations recorded.
- Risk review and external contract flags accurate; approved contract note included if applicable.
- Any delegated work's relevant diff/tests inspected; unreviewed parts listed.
- First report line `unverified:`; metadata Status and Hand-off status agree.
- Resume point identifies uncommitted changes, running jobs and safe stop state.

## Repository knowledge

Keep entry instructions small. Topic files cover architecture, conventions, testing, deployment prerequisites and module facts. For each rule include evidence (file/test/decision) or `unverified`; do not invent conventions.

Check layers/dependencies, naming, errors, sensitive data, money where applicable, concurrency/idempotency, tests and isolated fixtures, performance, public contracts, localisation and known mistakes. Code style belongs to repository rules; shared workflow belongs here. Never use a local rule to expand human authorisation.

## Lessons

| Observation | General rule |
|---|---|
| A report can be green while its output shows an error | Inspect the tool's actual report and visible result, not only its exit code |
| Criteria may change while a worker is busy | Date the criterion first and reread it before QA |
| Rewriting a task loses another role's notes | Notes append-only; only the hand-off block is replaced |
| Unrelated lockfile updates expand scope | Dependency changes require an applicable task scope |

New lessons go to `planning/rule-changes.md` with evidence and approval state. Do not silently rewrite standing rules during implementation.
