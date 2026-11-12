# Provenance and source treatment

## Supplied material

The owner supplied `new-setup.zip` containing twelve Markdown files: `START.md`, `new-setup.md`, `samples/CLAUDE.md`, and nine documents below `samples/planning/`: `flow.md`, `model-log.md`, `fable-first.md`, `STANDARD.md`, `departments/ENGINEERING.md`, `departments/THINKING.md`, `tasks/_template.md`, `tasks/example-task.md`, and `fable/example-BRIEF.md`.

All twelve files were read before constructing this candidate. The archive and extracted originals are retained outside the release repository. The supplied files contained no bundled licence or verifiable author/rights notice. They reference an earlier internal system and an external orchestration approach; those references establish context, not redistribution permission. The [source review](../docs/source-review.md) maps retained mechanisms and intentional redesigns.

## Treatment

| Material | Release treatment |
|---|---|
| Original documents and samples | Excluded in full; none is bundled verbatim |
| Private product/company names, repositories, URLs, people and operations | Excluded; no source-derived product implementation is shipped |
| PM, approvals, lanes, bounded steps and hand-off methodology | Re-expressed as generic workflow files; owner identified himself as creator and explicitly selected MIT |
| Provider-specific advanced review identity | Replaced by optional `review` tier and bounded review queue |
| Original dependency updates, Git exceptions and fixed budgets | Redesigned for scoped changes, consistent Git ownership and configurable usage policy |
| Example project and helper code | Newly prepared for this candidate with fictional local fixtures and standard libraries |
| Third-party documentation | Linked as references; no third-party prompt library or implementation is bundled |

There were no explicit copyright notices in the supplied archive to reproduce. This is a record of inspection, not proof that no third-party rights exist. The copyright holder was later identified by an actual owner statement; no customer relationship or employer permission was inferred from the source files. The project name describes its primary target environment and does not assert endorsement.

## Owner decision

On 2026-11-11, Ferhat Kosger identified himself as the project creator/copyright holder and explicitly selected MIT with the notice Copyright (c) 2026 Ferhat Kosger. See [OWNER-DECISION.md](OWNER-DECISION.md), [LICENSE-DECISION.md](LICENSE-DECISION.md) and [LICENSE](../LICENSE). Excluded internal/source-specific material remains excluded. The owner subsequently approved public source upload to ferhatcore/claude-codex-project-os on 2026-11-11. Authenticated integration evidence is tracked separately in the release record.

Finalization on 2026-11-11 preserved the original local commit and added smoke tooling, tests and release documentation in a separate delivery checkout. No original archive material or third-party runtime implementation was added. See the [licensing/attribution audit](LICENSING-AUDIT.md) for pinned CI action references and the resolved owner decision. The generic builder identity in Git is a preparation identity, not a claim to copyright ownership.

The Codex adapter adds locally authored entry generation, role definitions and skills around the same planning files. OpenAI documentation is linked as a reference; no Codex binary, external agent library or account configuration is bundled. The owner requested the repository name claude-codex-project-os so both supported clients appear in its title. The original GitHub URL redirects to the same renamed repository.
