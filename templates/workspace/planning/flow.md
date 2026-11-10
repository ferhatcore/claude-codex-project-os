# Operational flow

## Human gates O1–O14

These are policy checks. A scoped human instruction can satisfy several gates; record it once and do not ask again while scope remains valid. Drafting a proposal is allowed within an authorised planning request. An example, model response or task status is never approval.

| Gate | Decision requiring applicable human authority |
|---|---|
| O1 | Dispatch substantial new implementation beyond previously approved scope |
| O2 | Adopt new product/process rules or finalise task scope |
| O3 | Write product code for the scoped task |
| O4 | Exact local Git operations, commits, pushes, merges, tags or branch deletion |
| O5 | Deployment/publication, including a push that triggers deployment |
| O6 | Advanced-review batch, its model/input scope and budget |
| O7 | Cloud/DNS/secret-store/database/app-store actions; human performs writes by default |
| O8 | Sensitive-data handling plan; never authorises pasting raw secrets into files/chat |
| O9 | Paid service or additional spend outside the approved budget |
| O10 | External/public contract change, compatibility plan and proposed recipient note |
| O11 | Design preview or user-facing design change before implementation |
| O12 | Extra worker in the same repository with isolation and shared-file ownership |
| O13 | Third review cycle after two failed security/QA cycles |
| O14 | Essential worker questions needing a human decision, routed by PM |

Routine authorised analysis, document drafts, focused tests, in-scope fixes and independent QA do not need repeated scope approval. Tool permission prompts still apply. No unconditional exception permits test-repository commits or external messages. Silence and elapsed time do not grant permission.

## Dispatch checks D1–D5

| Check | Before every new step, QA step or continuation |
|---|---|
| D1 | Fresh usage observation, budget band, time window and stop rules; unknown → hold or obtain bounded human override |
| D2 | Exclusive advanced review inactive, or this is the approved review job |
| D3 | Target worker confirmed idle, context recoverable, complete brief and resume state saved |
| D4 | Lane free, dependencies complete, upstream changes closed, shared resource reserved |
| D5 | Tier mapped to a supported effective model/effort; actual choice logged |

No telemetry tool is assumed. With manual mode, the human confirms worker state and usage. Log observation source, timestamp, window and freshness. A human override specifies one bounded step, not unlimited permission. Model changes are best made at task boundaries after state is saved; effort changes depend on actual client support.

## Lane rules G1–G6

G1: an upstream design/contract change blocks affected downstream work. G2: QA owns the lane only after development stops. G3: independent lanes may proceed within the profile cap. G4: one worker has one active step. G5: reserve shared resources (browser/device/build environment) explicitly. G6: when scope changes, update criteria and request a safe stop before downstream continuation.

Default one worker per repository. PM writes coordination files serially; concurrent workers never share a task file. Non-overlapping monorepo folders still need a shared-lockfile/CI/contract ownership decision. Do not infer disjointness from folder names alone.

## Pipelines

| Pipeline | Ordered steps and exit |
|---|---|
| P-CODE | PM scope (`todo`) → Developer (`in_progress`) → optional design approval (`review`) → candidate (`qa`) → risk-based Security → QA (`done` or `qa_failed`) → PM completeness → O4 Git → separate O5 deploy |
| P-DESIGN | Brief → local preview → PM inspection → O11 human approval → scoped developer tasks |
| P-DOC | Bounded brief → department output → PM evidence/consistency check → decision or task proposal |
| P-QA | Verification scope → independent evidence → findings routed to a task/proposal |
| P-REVIEW | Queue → O6 → bounded brief → usage before → exclusive review → output inspection/usage after → separately approved application |
| P-NIGHT | Disabled unless a real approved scheduler exists; fixture job → report + index `new` → PM presents → index `presented` |

Within P-CODE, blocking Security findings set `qa_failed` just like QA findings. A review cycle ends on its first blocking report; findings are fixed together under original scope. Relevant fixes require Security to recheck the affected risk before QA. Count failed cycles across both reviewers. After two failed cycles, O13 is required before another. QA never fixes production code. An approved third cycle must still have a bounded revised plan; avoid indefinite retries.

## Status transitions

`todo → in_progress → qa → done` is the usual path. `in_progress → review → in_progress` covers design approval. `qa → qa_failed → in_progress` covers a bounded fix. `blocked` and `question` can interrupt any unfinished state; record previous state and resume point. A reopened `done` task gets dated changed criteria and renewed applicable approvals/checks. `done` is not a Git/deploy status.

Top metadata Status and Hand-off status must match. QA may mark `done` only when every criterion has a passing verdict and evidence. Gaps outside criteria may be reported as limitations; failed/unverified criteria prevent `done`. PM records completeness and proposed Git operation separately.

## Hand-off schema

Use the single block in [task template](tasks/_template.md): session, step, round, status, result, changed, verified, unverified, open, next, resume. Replace it in place at the end of each step and before a long command; keep dated notes append-only. Write actual command outcomes, artifact paths and safe-stop details. Unknown evidence is not a pass.

PM normally starts with hand-off plus board, then reads criteria/findings/evidence when needed. Do not ban the evidence inspection needed to decide correctness. Worker brief: task path; rule paths; repository/branch; current step/round; model/effort; required evidence; questions to PM; stop after the step.

## Budget, context and token policy

Configured default percentages are policy, not provider account limits. For the observed short window: below yellow allow normal dispatch; yellow defer large work and advanced review; red start no new steps; stop threshold request safe stops and save state. Weekly priority threshold allows only explicitly requested urgent work; weekly stop threshold pauses all work, including scheduled jobs. The strictest applicable band wins. Never erase a session or interrupt a dangerous operation abruptly to hit a percentage.

Unknown or stale usage blocks dispatch until a human observation or bounded override is recorded. No hard spending ceiling is enforced here. Record measured vs estimated usage separately and keep a reserve for QA/recovery. If a chosen model is unaffordable, reduce scope or wait; do not skip risk review.

Context save/pause thresholds apply only when measured by the client. If unavailable, keep steps small and save after each event. Before compact/clear, persist board, requests, approvals and open hand-offs. Use a fresh worker context for unrelated work after saving the prior task. Do not clear during a failed QA fix cycle just for tidiness. PM uses the client's context controls manually when no verified API exists.

Keep briefs short and self-contained; use file paths rather than repeated content. Do not load every repository or department by default. Split a step after two unproductive continuations. Avoid polling; an actual observed event or human check-in advances the board. No exact token-saving, cache or effort-cost claim is assumed.

## Boot and transitions

On restart read board/ranked requests, pending-user decisions and each open task's Hand-off. Reconcile worker states through actual tools or the human; leave running work alone. Check new scheduled reports only if scheduling was configured. Resume incomplete steps under valid approvals; never replay a completed command blindly.

On a step result: inspect evidence → determine next pipeline step → identify missing gates → check D1–D5 → dispatch via the verified adapter or provide the manual brief → update task/board/log. When blocked, continue only independent authorised preparation. Report result, unverified parts and the next concrete decision in the user's language.
