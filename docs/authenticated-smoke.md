# Reproducible session integration test

This is a guided test of **real role sessions in Claude Code or Codex**, not an automatic declaration of integration success. A human opens the sessions and makes scoped approvals. The helper prepares fictional fixtures and checks local behavior; it never invokes a model or changes release approval flags.

## Prepare and check access

From the distribution root (PowerShell and POSIX):

```sh
node scripts/smoke.mjs --prepare --target ../trailboard-smoke --runtime claude
node scripts/smoke.mjs --check-auth
node scripts/smoke.mjs --verify --workspace ../trailboard-smoke --phase baseline
```

The destination must not exist. Preparation creates the installed Trailboard example plus role prompts in `smoke/` and a fixture marker. The baseline command expects the unimplemented unread/finished filter checks to fail, the existing three tests to pass and the fixture to remain unchanged. Its successful exit therefore means the **negative baseline was reproduced**, not that the feature passes.

`--check-auth` asks only the CLI for structured session status and prints no account identifiers, tokens or raw error output. Exit 2 means login or model access has not been established; do not claim an authenticated test. Authenticate yourself using `claude auth login`, outside the agent, then repeat the status check. A logged-in status alone still does not prove a model request succeeded.

Inspect all fixture files before trusting the workspace. No production repository, credential file, environment secret or external service is needed. Use normal permission controls. The verification command executes the fictional CLI and tests; review model-written code before allowing it to run. It is not an OS sandbox. Child Node commands receive a small system-environment allowlist, not the parent process's credential variables or Node preload settings.

## Claude Code session sequence

All sessions start in the disposable `trailboard-smoke` root. This ensures planning files are visible without granting other project directories. Select the model you actually have through the client; the project tiers initially inherit it. Record the effective model/effort and actual session identifiers from the client, or mark them unknown. Logical names are not proof that a session ran.

| Step | Command in the disposable root | First instruction / evidence |
|---|---|---|
| 1. PM | `claude --name "Trailboard : PM"` | Read `smoke/01-pm.md`; bootstrap and propose TB-001 |
| 2. Developer | `claude --name "Trailboard : Catalog Developer"` | Read `smoke/02-developer.md`; first attempt must refuse missing code permission |
| 3. QA | `claude --name "Trailboard : QA"` | Read `smoke/03-qa.md`; independent criterion/test execution with the lane free |
| 4. Review | `claude --name "Trailboard : Reviewer" --permission-mode plan` | Read `smoke/04-reviewer.md`; read-only findings, no product edits |
| 5. Completion | Return to PM, or a fresh named PM | Read `smoke/05-completion.md`; verify evidence, preserve Git/deploy gates |

Keep manual mode and one worker per repository. Do not claim the PM started or controlled these terminals. Workers send results through task files, with the human carrying the path/status to PM. Record actual usage observations or explicitly approve one bounded fixture step when telemetry is unavailable. No paid service or model upgrade is implicitly approved.

The Reviewer is read-only in plan mode: it returns its findings in chat. The human or PM saves the reviewed result as `smoke/review.md`; do not require that session to write a file through read-only permissions.

## Exercise authority and failure paths

Before code approval, verify that the Developer stops, records the missing permission and routes it to PM. Then the human can explicitly approve only the fictional task, for example:

```text
Approve TB-001 scope and product/test/README changes in this disposable
repos/catalog only, with independent QA. Record this actual approval.
Use local-folder mode. No Git writes, deployment, paid service, production
access or external message is approved. Keep other files unchanged.
```

No prompt file pre-records this approval. PM must record the actual interaction and its scope before code dispatch. A worker cannot approve itself.

For a guaranteed negative case, have the real QA session independently inspect the unimplemented baseline under verification-only P-QA scope before implementation. It must report the filter failures and leave completion unapproved. Then implement the approved feature and rerun QA. This is a genuine fixture failure followed by correction, not evidence that a completed developer candidate failed. If the actual built candidate also fails, record only those genuine failed cycles, return findings to Developer and require O13 before a third cycle. Never invent a failed QA cycle to fill the checklist.

To test context continuity, pause the Developer after one bounded step, save its Hand-off, close or clear the session only after it is idle, then start a fresh Developer session. It must read the task/rules/resume point and continue without replaying completed work. Preserve append-only notes. Test criteria changes only through a dated `CHANGED` line and an actual PM/human scope decision.

## Verify the candidate

After reviewing the diff, from the distribution root run:

```sh
node scripts/smoke.mjs --verify --workspace ../trailboard-smoke --phase candidate
node scripts/check.mjs --workspace ../trailboard-smoke
```

The candidate verifier requires all seven CLI cases, actual passing non-skipped tests and unchanged fixture bytes. It exports a timestamped JSON report containing expected-behavior verdicts and exit codes, not raw transcripts/stdout. A nonzero exit is a real failure. It does not prove new feature-test coverage, README accuracy, session identity or human approval; QA and Reviewer must check those explicitly. It never edits the task status or release record to pass a gate.

Complete the generated `smoke/session-review.md` from real observations. Capture PM → Developer → QA → Reviewer → Completion, permission refusal/actual approval, model mapping, saved/resumed context, per-criterion QA, the negative case/correction and the final PM report. Unverified items remain blockers.

## Evidence and release update

Keep raw transcripts and account details private. Prepare a small sanitised summary with actual client version, effective model settings, dates, observed stage outcomes, safe artifact references, failures/corrections and remaining gaps. Review it for private identifiers before placing it under `release/`. Only then set `authenticated_smoke_test` and `smoke_evidence` from genuine evidence. The helper deliberately leaves these declarations unchanged. Legal clearance and final publication approval remain separate requirements.

If authentication is unavailable, run preparation, baseline verification, normal installation/tests and the helper regression suite. Record the explicit logged-out/unknown status and leave the authenticated gate false. Never rename offline results as integration success.

## Codex session sequence

Prepare another new fixture with `--runtime codex` (or `both`), then use `node scripts/smoke.mjs --check-auth --runtime codex`. The helper checks login only; a genuine model request is still required for session evidence.

Open `codex` at that generated root and invoke `$project-os-start`. Use the same task, approval example and verification commands above. Native role selection varies by client. When direct names are exposed, use the installed project_os roles. When only generic native delegation is exposed, PM reads the corresponding .codex/agents TOML and includes its full instructions in the worker brief. Record the actual tool and logical role separately. If neither is available, open manual Codex sessions and use the generated role prompts.

Use `AGENTS.md` for Codex, not Claude's permission-mode flags. Real tool permissions come from the parent client. Run one worker at a time, wait and close it before starting the next role. Check the first unapproved attempt stops, then record a real applicable approval before implementation. Save a handoff and resume from it in another session to check continuity.

For both mode, the two clients use the same planning directory. Do not test simultaneous writers in a shared lane. A result from one client is evidence only for that client and observed tool path. Record authenticated results per runtime; do not treat one completed Codex test as a completed Claude Code test.
