# Verification record

The source repository is public at [ferhatcore/claude-codex-project-os](https://github.com/ferhatcore/claude-codex-project-os). It uses the MIT License, Copyright (c) 2026 Ferhat Kosger. The owner approved publication on 2026-11-11 and the v1.1.0 release on 2026-11-12.

## Local checks

Windows with Node.js v24.14.0 and Git 2.53.0 passes the validator, 46 system, helper and runtime tests and 3 standalone example tests. All nine runtime/profile combinations install, and every generated workspace passes its own `.project-os/check.mjs` with zero findings.

## Hosted checks

GitHub Actions runs the validator and all suites on Windows and Ubuntu with Node.js 22 for every push and pull request.

## Client sessions

- **Claude Code 2.1.110:** the PM ran the full notes-app workflow. Developer and QA subagents worked on every task; a new session resumed with the correct state; a feature and a bug fix were added.
- **Codex CLI 0.147.0:** the same workflow passed, including recovery after an interrupted session.
- **Codex desktop:** a tests-first sequence passed with independent QA and a read-only review.

Details and commands are in [TEST-REPORT.md](../TEST-REPORT.md) and [CODEX-CHECK.md](CODEX-CHECK.md).

## Repository setup

The default branch is `main`. GitHub recognises MIT and private vulnerability reporting is enabled. Original private documents, raw transcripts and local test sandboxes are excluded.
