# Release checklist

The local repository is prepared for review. Do not push, create a remote repository or publish without the owner's final approval.

- [x] Resolve [ownership and licence](../LICENSE-DECISION.md): MIT, Copyright (c) 2026 Ferhat Kosger; full `LICENSE` added.
- [ ] Review every staged file and the initial commit; replace the generic local build identity if desired without inventing authorship.
- [x] Update README, changelog and release notes to the approved MIT licence and accurate candidate status; actual publication date remains unset.
- [ ] Run `node scripts/check.mjs`, `node --test scripts/system.test.mjs` and `node --test scripts/smoke.test.mjs`.
- [ ] Follow the [real-session smoke procedure](../docs/authenticated-smoke.md): PM → Developer → QA → Reviewer → Completion, including permission, context and negative/correction checks. Record real client/model evidence without private transcripts.
- [ ] Review secret/privacy scans and a final staged diff; use an additional specialist secret scanner if available.
- [x] Set owner/licence fields and genuine owner-decision reference in `release/status.json`.
- [ ] Add actual authenticated smoke evidence when the postponed real test is completed.
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
node --test scripts/smoke.test.mjs
node scripts/check.mjs --release
git status --short
git diff --check
git add .
git commit -m "Finalize v1.0.0 release approval and licensing"
```

Skip the commit only if there are no changes. The final delivery branch is `codex/finalize-v1.0.0` and retains the original preparation commit. Rename it before first push, authenticate GitHub CLI interactively, and create the approved public repository:

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

If you start from the ZIP rather than the local Git checkout, the archive intentionally contains no `.git`. From its extracted repository root, first run `git init --initial-branch=main`, review the public commit name/email, then `git add .` and `git commit -m "Prepare Claude Code Project OS v1.0.0"`. This initial local commit is preparation only; resolve every gate and obtain publication approval before the remote/push/release commands above.
