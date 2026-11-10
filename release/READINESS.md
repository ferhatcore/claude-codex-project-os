# Release readiness — v1.0.0 candidate

Prepared on 2026-11-10 for local owner review. The repository is implemented and locally validated. **Public distribution is blocked** until rights/licensing and the remaining release gates below are resolved. No remote repository, public release, tag, cloud resource or paid model request was created.

## Source and privacy review

- Read all twelve supplied Markdown files before release construction; the [source review](../docs/source-review.md) records the architectural assessment and redesign.
- Compared all extracted files byte-for-byte with their archive entries; all twelve matched. The original archive was opened read-only and remains outside the release. Hash/inventory evidence is retained privately outside this repository.
- The original documents contain private project context and no bundled licence or explicit copyright notice. No original file or source-specific implementation is distributed. Absence of a notice does not establish rights.
- Scanned all twelve source files with the same known credential-pattern checks: zero heuristic secret findings. Private contextual identifiers were found in the source and removed from the candidate.
- Scanned the candidate with known credential patterns, personal-path checks and an external private identifier denylist: zero findings. The denylist and source evidence are not bundled. This is a bounded heuristic review, not a guarantee that all confidential material can be detected.
- Reviewed the generic helper code, template instructions and fictional fixtures for scope, unsupported automation claims, contradictions and unsafe production assumptions.

## Validation actually run

Environment: Windows, Node.js v24.14.0, Git 2.53.0.windows.1. Claude Code v2.1.110 was inspected with `--version` and `--help`; no model request was executed. The supported helper baseline is Node.js 22+, with hosted Node 22 validation configured but not yet executed.

| Check | Outcome |
|---|---|
| `node scripts/check.mjs` | Passed: required files, local Markdown links/anchors, JSON/config/task consistency, entry size, metadata and CI policy |
| `node scripts/check.mjs --denylist` with the private external list | Passed: zero credential/private-identifier/template-marker findings in the candidate |
| `node --test scripts/system.test.mjs` | 18 tests passed; zero failures, skips or cancellations |
| Standalone installed example CLI | Printed the expected three fictional titles with exit 0 |
| Standalone installed example suite | 3 tests passed; zero failures or skips |
| Isolated generic setup and lean/standard/heavy example setup | All passed; correct caps and files; no Git/Claude/network actions by installer |
| Negative checks | Existing targets preserved; unknown/duplicate/missing options refused; path escape and symlinks rejected; invalid config, links, markers, secrets, local artifacts and inconsistent task state detected |
| Deterministic workflow rehearsal | Proposed task → synthetic scoped approval → build → actual failing filter check → `qa_failed` → local fix → independent command/suite checks → evidenced `done`; temporary fixture only |
| External documentation links | Eight official documentation URLs returned HTTP 200 |
| CI action references | Both pinned upstream commit API endpoints returned HTTP 200 |
| `node scripts/check.mjs --release` | Failed as intended: ten missing declaration/evidence/licence/state requirements; ordinary green checks cannot declare this candidate publishable |

The deterministic rehearsal executes real local Node commands but simulates role transitions. It is **not** an authenticated multi-session Claude Code run or a human approval record. The checked-in TB-001 remains a pending proposal, with no fabricated QA history. Test-created temporary directories are removed; a separate isolated onboarding fixture is retained privately for inspection.

The two test findings corrected during preparation were nested Node test subprocess reporting and exclusion of private environment/local artifacts from distribution scanning. Regression coverage now checks both behaviors.

## Remaining release gates

1. **Rights/licence:** owner must confirm adaptation/distribution rights, review external sources/attribution, choose the accurate copyright holder and licence, and add full `LICENSE`. See [licence checklist](../LICENSE-DECISION.md). Until then, the entire candidate stays local; excluded original material remains excluded.
2. **Authenticated smoke:** `claude auth status` did not yield available authenticated status. Complete a real PM → developer → QA exercise in a disposable project after interactive authentication. Do not replace this with the deterministic rehearsal or copy private transcripts into the public repository.
3. **Owner approval:** review the exact final diff and record explicit permission before remote creation, push or publication. No publication approval has been inferred.
4. **GitHub configuration and CI:** after approval, enable private vulnerability reporting, configure applicable required checks and inspect hosted Windows/Linux Node 22 runs before tagging the stable release. Local Windows Node 24 success does not establish Linux/Node 22 execution.

Update [status.json](status.json) only from actual owner decisions and execution evidence. The release gate checks the record's structure, not legal truth or the authenticity of consent. The owner remains responsible for final review.

## Git and publication

A clean local Git repository is prepared on `codex/release-v1.0.0` with one initial commit. The commit uses the explicitly generic identity `Local Release Builder` and an `.invalid` email so preparation does not expose the owner's configured personal email or assert a legal copyright holder. The owner may amend that identity before publication. No remote or tag is configured.

Exact post-approval commands and ordering are in [release checklist](CHECKLIST.md). Draft [release notes](v1.0.0.md), [GitHub metadata/announcement/portfolio summary](metadata.md) and [genuine adoption tracking](adoption.md) are included. Do not claim this candidate is already licensed open source, publicly available or adopted.
