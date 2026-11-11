# Repository rule starter

Review these files before merging into an existing repository. They are intentionally separate from the automatic workspace installer. Resolve `{{PM_ROOT}}` to the real PM workspace path and fill evidence fields before dispatch; do not overwrite existing rules.

Entry files: [CLAUDE.md](CLAUDE.md) for Claude Code and [AGENTS.md](AGENTS.md) for Codex. Use the selected entry or both, pointing to the same PM root and topic files. Topic files: [architecture](.claude/architecture.md), [conventions](.claude/conventions.md), [testing](.claude/testing.md), [deployment](.claude/deploy.md). These documents guide a worker; no tools or permission settings are installed. Use an actual `CLAUDE.md` import if you choose an `AGENTS.md` entry; do not assume automatic support for another tool's convention.

Unknown values block applicable operations. Discovery may be a read-only scoped task before code permission. Never guess a test command, branch, migration target or cloud profile.
