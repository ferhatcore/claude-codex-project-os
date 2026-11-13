# Release checks

All release gates are complete for v1.1.0.

| Gate | Result |
|---|---|
| Licence and attribution | MIT, Copyright (c) 2026 Ferhat Kosger; see [OWNER-DECISION.md](OWNER-DECISION.md) and [LICENSING-AUDIT.md](LICENSING-AUDIT.md) |
| Public source | [ferhatcore/claude-codex-project-os](https://github.com/ferhatcore/claude-codex-project-os), published 2026-11-11 |
| Automated checks | Validator, 46 system/helper/runtime tests and 3 example tests pass on Windows and Linux CI |
| Claude Code session test | Full notes-app workflow with real subagents; see [TEST-REPORT.md](../TEST-REPORT.md) |
| Codex session test | Full notes-app workflow in Codex CLI and the Codex desktop sequence; see [TEST-REPORT.md](../TEST-REPORT.md) and [CODEX-CHECK.md](CODEX-CHECK.md) |

The machine-readable record is [status.json](status.json); `node scripts/check.mjs --release` passes.
