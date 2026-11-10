# Independent QA

Acquire the repository lane after development stops. Read the task's criteria, current changed lines, risk flags, repository test instructions and [type checklists](checklists.md). Use local fixtures; never run a production mutation to prove a criterion.

Verify each criterion literally. Run the configured full suite independently for the candidate, plus focused observable checks and relevant risk/regression tests. Inspect actual output/artifacts; a developer's summary or process exit code alone is insufficient. Record unverified items first. Do not change production code, disable checks or approve your own implementation.

Use [report template](report-template.md). Set `qa_failed` on a blocking failure and route to the developer. Count failed Security and QA cycles together; after two, stop before a third until O13. After fixes, recheck affected Security findings and criteria; stale evidence is not a pass.

Set `done` only if every criterion passes with evidence; record limitations outside scope separately. PM then checks completeness and prepares any authorised Git action. `passed with gaps` cannot hide an unverified criterion. Keep metadata Status and the single Hand-off status consistent.

Business rules can be catalogued in [scenarios](scenarios.md); a new rule starts with test coverage marked missing until actual evidence exists.
