# Verification record

The source repository is public at [ferhatcore/claude-code-project-os](https://github.com/ferhatcore/claude-code-project-os). It uses the MIT License, Copyright (c) 2026 Ferhat Kosger. The owner approved publication and the shared Claude Code/Codex update on 2026-11-11.

## Local checks

Windows with Node.js v24.14.0 and Git 2.53.0.windows.1 passed 42 system, helper and runtime tests, plus 3 standalone example tests. Validation checked 93 files and 69 Markdown documents with zero findings. The private identifier and known secret pattern scan reported no findings.

All nine runtime/profile combinations installed successfully. Both mode retained one shared task history. A fresh clone of commit `534270662e8db5ea006d72426ba4144e86330b9e` passed validation, all three suites, a real both-mode installation and its installed example tests. The implementation digest is recorded in [validation.json](validation.json).

## Hosted checks

[GitHub Actions run 43015330417](https://github.com/ferhatcore/claude-code-project-os/actions/runs/43015330417) passed on Windows and Ubuntu with Node.js 22 for commit `534270662e8db5ea006d72426ba4144e86330b9e`. Each job ran repository validation, all three suites and the standalone example suite. The evidence update following that run changes only release documentation and records.

## Client sessions

A real Codex CLI bootstrap and a native read only QA delegation completed. The full build flow was blocked by the effective tool policy. [CODEX-CHECK.md](CODEX-CHECK.md) distinguishes those observations from the direct Node tests. No authenticated Claude build sequence was run.

These results describe the checks that ran. Complete authenticated workflow evidence remains a separate field in [status.json](status.json), and the stable release validator is unchanged.

## Repository setup

The default branch is `main`. GitHub recognises MIT and private vulnerability reporting is enabled. The description, topics and installation guide cover both clients while retaining the existing repository URL.

Original private documents, raw transcripts and local test sandboxes are excluded. No stable release tag was created. [CHECKLIST.md](CHECKLIST.md) contains the remaining stable release steps.
