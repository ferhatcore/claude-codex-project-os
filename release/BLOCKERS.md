# Release checks

The source was published on 2026-11-11 at [ferhatcore/claude-codex-project-os](https://github.com/ferhatcore/claude-codex-project-os), following the owner's approval. MIT licensing, attribution review, repository setup and hosted Windows/Linux checks are complete.

The stable release validator still requires genuine authenticated Claude session evidence. Its three remaining findings are `authenticated_smoke_test`, `smoke_evidence` and the candidate `state`. Offline results are not substituted for that evidence.

Use the [session test guide](../docs/authenticated-smoke.md) when completing that check. Record the observed result, then rerun the validator before creating a stable release tag.
