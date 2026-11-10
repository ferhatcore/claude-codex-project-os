# Workflows

The installed [flow manual](../templates/workspace/planning/flow.md) is the operational reference. Its O1–O14 gates, D1–D5 dispatch checks and G1–G6 lane rules preserve the original methodology with portable tool fallbacks.

## Code and QA

1. PM drafts a task with one repository, criteria, branch, risk flags and permission references. Drafting within an authorised planning request is allowed; product code waits for scope and code approval.
2. Developer reads the complete task and relevant repository rules. It checks the worktree, plans a bounded step, implements and runs focused tests.
3. Developer rereads changed criteria, reviews its diff, runs the configured full suite once for the candidate and records observable evidence. UI work includes relevant viewports/themes; CLI work includes actual command output; API work uses local fixture requests.
4. Security reviews changes to authentication, permissions, secrets handling, money, sensitive data, externally consumed contracts or other declared risk. Blocking findings return to build. Any relevant fix invalidates earlier review evidence and requires targeted re-verification.
5. QA, with the lane free, independently checks each criterion and the configured regression scope. No production code fixes during verification. After two failed review cycles, stop and ask for a new plan before a third cycle; count security and QA failures in the same retry budget.
6. PM checks completeness, evidence and open gaps, then prepares the exact proposed commit/push/merge sequence. Each operation needs an applicable approval; approval of code does not automatically approve Git writes.
7. Deployment has a separate decision covering environment, CI effects, prerequisites and rollback. A push that triggers deployment is a deployment action.

Tests may legitimately be rerun by independent QA, after a change or to investigate flakiness. Do not repeat unchanged commands only to produce activity. Do not disable a failing check to obtain a green report. Dependency upgrades are separate scoped work unless the current task explicitly requires them; the source's unconditional dependency-update rule was removed to prevent unrelated changes.

## Design and documents

P-DESIGN: brief with product facts → bounded local preview → PM inspection → human design approval → developer task. Record deviations, accessibility checks and the approved artifact. Do not import the original project's colours, layouts or product terms.

P-DOC: question and output contract → department analysis → PM evidence/consistency check → decision or proposed product task. Use the thinking standard: verified facts, assumptions, unknowns, useful alternatives and a concrete recommendation. Legal or financial documents remain drafts for qualified review where needed; a model is not a signatory or professional adviser.

P-QA: scope → independent verification → findings routed to an existing task or a proposed new task. Reports can say `passed with gaps`, but any gap affecting an acceptance criterion prevents task completion.

## Advanced review

P-REVIEW replaces the source's provider-specific advanced-model queue. Long-lived rules, threat models and contracts can receive one bounded strong-model review when introduced or substantially changed. The strongest available daily model can fill this role; a premium model is optional. The configured review policy determines whether a draft blocks use. No claim is made that this candidate has received an independent advanced-model review.

Before running a batch: obtain O6 approval, name every input with a line budget, disable further delegation by default, define output paths and stop conditions, record observed usage, and reserve exclusive execution. A time estimate is advisory unless an external controller actually enforces it. After the review, inspect output and record usage again. Applying suggestions is a separate scope decision. Use the [bounded review brief](../templates/workspace/planning/reviews/BRIEF.md).

## Recovery and optional scheduled jobs

On restart, PM reads board, ranked requests, pending approvals and open hand-offs; reconciles actual worker state; then resumes only incomplete work under existing authorisation. Save files before `/compact` or `/clear`; never erase a busy worker's context. A fresh worker gets a self-contained brief, including rule paths and resume state.

P-NIGHT is a documented extension, disabled by default. It needs a separate scheduler, approved time zone/window, access restrictions, budget and resource locks. Jobs should use fixtures, write a dated report and an index row `new`; PM presents it and marks `presented`. Budget stop rules apply to scheduled work too. No scheduler or overnight task is installed by this release.
