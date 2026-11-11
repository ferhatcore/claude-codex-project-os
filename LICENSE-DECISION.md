# Licence decision — publication blocker

No `LICENSE` file is supplied because a redistribution grant has not been confirmed. This is a local release candidate, not a licensed open-source release. GitHub explains why an open-source repository needs an explicit licence in its [licensing guide](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository).

The owner must resolve this checklist with supporting evidence:

The [2026-11-11 licensing audit](release/LICENSING-AUDIT.md) lists inspected components, upstream references and the exact unresolved holder/rights/attribution questions. Engineering inspection did not establish the missing legal authority.

- [ ] Confirm authorship/ownership of the supplied system and authority to distribute adaptations, including any employer/client restrictions.
- [ ] Identify external prompt/workflow/code sources, their licences and any required credits. Excluded source documents remain excluded unless separately cleared.
- [ ] Confirm that remaining generic workflow text and newly prepared helper/example code can receive the chosen grant.
- [ ] Choose a licence. MIT may be appropriate only after the necessary rights are confirmed; no MIT approval is inferred here.
- [ ] Choose the accurate copyright holder and year; record required attribution in provenance/notices.
- [ ] Add the full approved licence text as `LICENSE`, update README/release/licensing notices and change the release record from `pending` to the selected identifier.
- [ ] Record the decision reference in `release/status.json`, review the final diff and grant separate publication approval for that candidate.

Evidence references in the public release record should be safe summaries or public records, not private agreements or personal identifiers. A model-generated review or a passing secret scan does not establish ownership. If an affected generic component cannot be cleared, remove or independently replace it, rerun checks and keep publication blocked until the remaining candidate is cleared.
