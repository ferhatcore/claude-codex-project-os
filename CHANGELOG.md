# Changelog

## Claude Code team and record formats — 2026-11-12

1. Claude installs now include the team: `project-os-developer`, `project-os-qa` and a read-only `project-os-reviewer` in `.claude/agents`, plus `/project-os-start`, `/project-os-task`, `/project-os-qa` and `/project-os-resume` skills.
2. New `planning/formats.md` documents the exact repository, task, criterion and QA record shapes; the validator now ships in every workspace as `.project-os/check.mjs`. Fixes PM-written records failing validation in new projects.
3. README rewritten around what the kit does and a three-step Claude start. Internal provenance and licence records moved under `release/`.
4. [TEST-REPORT.md](TEST-REPORT.md) records the real Claude Code and Codex CLI notes-app scenarios.
5. `/project-os-task` finishes all tasks approved together; `/project-os-resume` continues already-approved work without asking again.

## Codex desktop integration test — 2026-11-11

Completed the real disposable task sequence with baseline QA, tests-first development, a fresh Developer continuation, independent candidate QA, read only review and PM completeness. QA passed all 23 tests, 19 CLI cases and six criteria. The separate nested CLI write failure remains recorded. No stable release or fixture deployment was created.

## Repository rename — 2026-11-11

The repository is now `ferhatcore/claude-codex-project-os`. Both clients remain in one project. Clone instructions and repository links use the new name; existing GitHub links redirect to it.

## Shared runtime support — 2026-11-11

1. Added `--runtime claude|codex|both` with the original Claude default preserved.
2. Added Codex entry files, four role definitions, four skills and a workspace worker cap.
3. Kept tasks, decisions, QA and repository knowledge shared when both clients are installed.
4. Added runtime validation and tests for all nine runtime/profile combinations.
5. Extended smoke preparation and sanitised auth preflight to the selected runtime.

## 1.0.0 — MIT adoption 2026-11-11

- Recorded the genuine owner declaration and explicit MIT selection.
- Added LICENSE with Copyright (c) 2026 Ferhat Kosger and resolved the ownership/licensing records.
- Retained candidate state and the real-test/publication gates; the owner postponed Claude login/testing.

## 1.0.0 — local finalization 2026-11-11

Candidate status retained; not published or tagged.

- Preserved the existing workflow, example, installer and eighteen-test system suite.
- Added a guided real-session smoke procedure, isolated fixture preparation, sanitised auth preflight and independent CLI behavior verification.
- Added eleven smoke-helper regression tests and included both suites in Windows/Linux CI.
- Audited runtime dependencies, pinned CI action licences, provenance and open copyright questions.
- Updated actual evidence and per-gate owner actions without bypassing release validation.

## 1.0.0 — candidate prepared 2026-11-10

Prepared locally; not yet published or tagged.

- Rebuilt the supplied project management methodology as a portable Claude Code workflow kit.
- Added explicit capability fallbacks, task/hand-off state, approval references and consistent Git boundaries.
- Replaced fixed model versions and budget assumptions with configurable tiers and profiles.
- Added a collision-safe offline installer, structural checks, meaningful failure tests and a fictional multi-repository example.
- Excluded original private documents and implementation details; documented provenance and unresolved licensing.

The approved licence is now MIT. Record the actual publication date when the release is approved and published.
