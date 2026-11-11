# Codex adapter checks

Checked on 2026-11-11 with Codex CLI 0.147.0 in isolated Trailboard workspaces. Authentication was already available. Private transcripts and account details are excluded from this repository.

## Observed behavior

The client read the generated AGENTS.md, START.md, configuration, role definitions, skill and task. It identified pending code authority and stopped before implementation. The fixture was unchanged.

The installed client's delegation interface had no named agent selector. The PM therefore passed the complete installed QA instructions through its generic native delegation tool. A separate worker inspected the unfinished example, returned acceptance gaps and was stopped after completion. This proves the read only delegation path; it does not prove a named custom agent type was selected.

That worker correctly distinguished static inspection from executed tests. Its attempts to launch local checks were refused by the host policy. No executed QA suite is claimed for that worker.

A separate approved development attempt was blocked by the effective read only tool policy despite requesting workspace write mode. It stopped before starting developer workers or changing product files. The full PM, Developer, QA and Reviewer build sequence remains incomplete. No permissions were bypassed.

## Automated checks

The local Node suites passed 42 system, helper and runtime tests plus 3 standalone example tests. They cover all nine runtime/profile combinations, shared state in both mode, legacy default behavior, generated entries, role/skill metadata, worker caps and refusal paths. These tests run directly outside the model session and are separate from its policy refusal.

The four generated agent files and worker cap configuration also parsed successfully with Python's TOML parser. The workspace validator checks the emitted metadata subset and policy consistency; it is not a general TOML parser.

Claude Code's authenticated build sequence was not run as part of this adapter update. The stable release gate remains unchanged. See [READINESS.md](READINESS.md) and [status.json](status.json) for the current evidence.
