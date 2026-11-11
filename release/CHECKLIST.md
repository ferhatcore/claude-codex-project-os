# Release checklist

## Completed source publication

The owner approved public source upload on 2026-11-11. The repository is available at [ferhatcore/claude-codex-project-os](https://github.com/ferhatcore/claude-codex-project-os).

1. Copyright holder and MIT licence recorded.
2. Local validation, 42 system/helper/runtime tests and 3 example tests passed.
3. Public overview, quickstart and repository metadata prepared.
4. Source pushed to `main`.
5. Private vulnerability reporting enabled.
6. Windows and Ubuntu Node.js 22 checks passed in [GitHub Actions](https://github.com/ferhatcore/claude-codex-project-os/actions/runs/43018536749).

## Before a stable release

Complete the [authenticated session procedure](../docs/authenticated-smoke.md) and record its actual result. Review the candidate diff and update the release status only from that evidence. The source publication approval does not make a missing test pass.

From the repository root:

```sh
node scripts/check.mjs
node --test scripts/system.test.mjs scripts/smoke.test.mjs scripts/runtimes.test.mjs
node --test examples/trailboard/repos/catalog/catalog.test.mjs
node scripts/check.mjs --release
git status --short
git diff --check
```

When the stable release checks and intended release approval are complete, commit any final changes, push them and wait for CI:

```sh
git add .
git commit -m "Prepare v1.0.0 release"
git push origin main
gh run list --repo ferhatcore/claude-codex-project-os --workflow validate.yml
```

Use the actual run number from that output with `gh run watch RUN_ID --repo ferhatcore/claude-codex-project-os --exit-status`. If the checks pass, publish the approved tag and notes:

```sh
git tag -a v1.0.0 -m "Project OS v1.0.0"
git push origin v1.0.0
gh release create v1.0.0 --repo ferhatcore/claude-codex-project-os --verify-tag --title "Project OS v1.0.0" --notes-file release/v1.0.0.md
```

These are future release commands. No stable tag or GitHub release was created as part of the initial source upload.
