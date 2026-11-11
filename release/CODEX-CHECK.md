# Codex workflow verification

The real Codex desktop task sequence completed on 2026-11-11 in a disposable Trailboard installation. The PM used the installed role instructions with generic native delegation. Five separate workers ran sequentially; no two owned the Catalog lane together. Raw transcripts, account details and the exercised workspace are excluded from this repository.

## Observed results

| Stage | Actual result |
|---|---|
| Missing authority | An authenticated CLI Developer checkpoint read pending scope/code permission and stopped without changes. |
| Baseline QA | A separate worker ran 3 passing baseline tests and reproduced both unimplemented filter failures. |
| Tests-only Developer | Added meaningful tests, ran 23: 19 passed, 4 failed before implementation. Saved one recoverable Hand-off and stopped. |
| Fresh Developer | Read that Hand-off in a new context, retained the tests unchanged, implemented filtering and README. All 23 tests and 15 real CLI cases passed. |
| Independent candidate QA | All 23 tests, 19 actual CLI cases and six acceptance criteria passed. Fixture hash/order, coverage, README and scope were checked independently. |
| Read only Reviewer | No blocking findings. All 57 pre-review files remained byte-identical; the PM independently confirmed this. |
| PM completeness | Inspected QA/review evidence, ran the seven-case candidate verifier and validated the final 59-file workspace: zero findings. Fixture Git/deployment stayed pending. |

The filter implementation was exercised only in the disposable copy. The distributed example remains the original starting exercise with its proposed task and pending permissions. The four pre-implementation test failures were not counted as failed reviews of a finished candidate.

## Client and configuration limits

The desktop route passed. A separate nested Codex CLI 0.147.0 invocation rejected in-scope patch paths as outside the project and stopped before dispatch. No policy was bypassed, and the desktop result is not labelled a CLI write success.

Named custom agent selection was not exposed by the available tools, so each generic worker received its complete installed role instructions. Exact inherited model, effort and account usage were not exposed and remain unknown. Sequential dispatch was observed; role text is not an enforced filesystem sandbox.

No authenticated Claude Code workflow was run. The shared stable release declarations remain pending; this test does not grant release or deployment approval.

## Automated checks

The distribution's 45 tests passed with zero failures or skips. Windows and Ubuntu Node.js 22 jobs also passed in [GitHub Actions](https://github.com/ferhatcore/claude-codex-project-os/actions/runs/43018536749). The four agent definitions and worker-cap configuration previously parsed with Python tomllib. Machine-readable stages and exercised-file hashes are in [validation.json](validation.json).
