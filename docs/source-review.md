# Source review and redesign

All twelve supplied Markdown documents were read before release construction. Original wording, private examples and archive contents are not bundled. See [provenance](../PROVENANCE.md) for rights status and source inventory.

## What was reusable

The source is an operating methodology: a central PM with bounded responsibility, named role owners, per-repository lanes, explicit human gates, short pipeline steps, independent QA, bounded review/fix cycles, durable hand-offs, decision/task ledgers, context recovery and measured model usage. These mechanisms remain the foundation of the installed workspace.

| Source component | Generic destination | Treatment |
|---|---|---|
| `START.md` and bootstrap document | Quickstart, installer and installed START | Concrete offline onboarding and capability discovery |
| Root PM sample | Workspace CLAUDE.md, roles and flow | Compact standing rules; details loaded by topic |
| Flow sample | Flow, board and workflow documentation | Code/design/docs/QA/review pipelines; retry and state semantics clarified |
| Model log | Custom configuration and model log | Version-free tiers, actual effective model and observation sources |
| Advanced review queue and example brief | Reviews queue and bounded brief | Optional strongest-available tier; input/output caps and honest timing/usage |
| Engineering standard | Engineering, QA and repository starters | Evidence, adversarial checks, scope and changed-criteria discipline |
| Thinking standard | Thinking and department starter | Facts/assumptions/unknowns, options and actionable recommendation |
| Repository standard | Repository starter and customization | Evidence-based topic rules; unknown commands block dispatch |
| Task template and sample task | Canonical task schema and TB-001 | One repository, explicit approvals, stable criterion IDs and one resume block |

## What was excluded

Company/customer/partner identities, internal repository URLs, private infrastructure and deployment details, payment implementation procedures, personal preferences, fixed design choices, dated internal decisions and project-specific stacks were excluded. No private application code or original document is shipped. The example uses an unrelated local reading-list domain with synthetic fixtures.

## What required redesign

- **Session control:** the source assumed environment-specific APIs. Baseline now uses human-opened sessions and file hand-offs; integrations require capability evidence.
- **Budget claims:** fixed account windows, premium identities and prices became configurable project policy. No actual runtime cost enforcement is claimed.
- **Evidence restrictions:** compact PM context remains useful, but PM may inspect bounded diffs/results needed for correctness. A summary alone cannot establish completion.
- **Git exceptions:** branch operations and test-repository commits now follow consistent ownership and explicit applicable authorisation.
- **Dependencies:** unconditional upgrades were removed from unrelated feature work.
- **Retry semantics:** Security and QA share a failed-cycle budget; fixes require relevant re-verification.
- **Approval friction:** valid existing authorisation is recorded and reused; only missing authority is requested. Worker messages remain incapable of approval.
- **Scheduled work:** optional, disabled and subject to the same usage stop rules; no budget exemption for overnight jobs.
- **Ownership:** no licence or attribution grant was inferred; rights clearance blocks public distribution.

## Maintainer review limits

The sources describe a broader original environment than this kit implements. This release packages its portable file contracts and helpers; it does not ship a live board server, native session adapter, scheduler or production integration. Offline setup and deterministic workflow rehearsal are tested. Authenticated model execution, hosted CI and rights clearance remain explicit release gates.
