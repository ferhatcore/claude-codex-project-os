# Release checklist

The local repository is prepared for review. Do not push, create a remote repository or publish without the owner's final approval.

- [ ] Resolve [ownership and licence](../LICENSE-DECISION.md); add the approved full `LICENSE` and attribution.
- [ ] Review every staged file and the initial commit; replace the generic local build identity if desired without inventing authorship.
- [ ] Update README, changelog and release notes to the approved licence/date/status.
- [ ] Run `node scripts/check.mjs` and `node --test scripts/system.test.mjs`.
- [ ] Perform an authenticated Claude Code PM → developer → QA smoke run on the disposable example; record client/model and actual evidence without private transcripts.
- [ ] Review secret/privacy scans and a final staged diff; use an additional specialist secret scanner if available.
- [ ] Set owner/licence/evidence fields in `release/status.json`; attach safe references.
- [ ] Obtain final publication approval for the exact reviewed candidate and record its reference.
- [ ] Run `node scripts/check.mjs --release`; an ordinary green check is not publication permission.
- [ ] Create the GitHub repository only after approval; configure private vulnerability reporting, required checks and branch protection as appropriate.
- [ ] Run hosted Windows/Linux CI and inspect results before publishing the stable tag/release.
- [ ] Publish v1.0.0, then record actual URLs and begin genuine contribution/adoption tracking.

## Exact publication commands after approval

From the local repository root, after the checklist decisions and edits above:

```sh
node scripts/check.mjs
node --test scripts/system.test.mjs
node scripts/check.mjs --release
git status --short
git diff --check
git add .
git commit -m "Finalize v1.0.0 release approval and licensing"
```

Skip the commit only if there are no changes. The initial branch is `codex/release-v1.0.0`. Rename it before first push, authenticate GitHub CLI interactively, and create the approved public repository:

```sh
git branch -M main
gh auth login
gh repo create claude-code-project-os --public --source . --remote origin --description "File-based PM workflows for Claude Code with approval gates, QA and durable hand-offs."
git push -u origin main
gh run list --workflow validate.yml
```

Wait for the relevant `Validate workflow kit` run, then use `gh run watch RUN_ID --exit-status`, replacing `RUN_ID` with its actual number. Enable private vulnerability reporting and configure required checks in GitHub's repository settings before publishing a stable release. If CI fails, fix and rerun it; do not tag the failing revision.

```sh
git tag -a v1.0.0 -m "Claude Code Project OS v1.0.0"
git push origin v1.0.0
gh release create v1.0.0 --verify-tag --title "Claude Code Project OS v1.0.0" --notes-file release/v1.0.0.md
```

The default account creates the repository; for an organisation, use its approved `OWNER/claude-code-project-os` name. These are instructions only; none was executed during preparation. If approval excludes any step, stop before that step. Do not repurpose these commands as approval.
