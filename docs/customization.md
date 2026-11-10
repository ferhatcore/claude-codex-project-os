# Customization

## Configuration contract

Edit the installed `.project-os.json`; run `node scripts/check.mjs --workspace /path/to/pm-root` from the distribution. This custom file is read by the PM and validated by our checker. It does not configure Claude Code's native model selection, tool permissions or automatic session dispatch.

| Setting | Meaning |
|---|---|
| `project.name`, `language`, `time_zone` | Human-facing defaults; use an IANA time zone |
| `profile` | `lean`, `standard`, `heavy`; installs worker caps of 1, 2, 3 respectively |
| `budget.max_active_workers` | Worker cap excludes the PM; lower for shared limits |
| `budget.usage` | Project-policy percentages for an observed short/weekly window |
| `models` | Tier selector and preferred effort; initially `inherit` |
| `capabilities` | Confirmed adapter mode; baseline `manual`, no assumed tools |
| `advanced_review` | Opt-in strong-model review; exclusive when enabled |
| `repositories` | ID, path, type, owner, branch, test commands and deployment effects |

Profiles express project size and budget preferences, not subscription entitlements. Lean starts one worker at a time and advanced review disabled; standard and heavy permit more independent lanes but do not enable paid models or automation. All profiles keep human gates and independent QA. Increasing a cap does not authorise concurrent edits in the same repository.

## Select current models

Map tiers to selectors your account actually supports. `economy` is for mechanical reporting; `standard` for routine development/QA; `deep` for difficult architecture or sensitive logic; `review` for bounded long-lived policy reviews. Raise effort for difficult reasoning within a model's supported range. Shrink input before escalating compute. Never lower review quality for a risky task just to satisfy a usage band; defer it instead.

With `inherit`, leave the active model unchanged. A non-inherited selector is applied manually using the client's model controls or a verified integration; it is not applied by this kit. Record the actual model and effective effort per dispatch. Check the [official model documentation](https://code.claude.com/docs/en/model-config); available effort levels and selectors depend on the client/account. This kit does not promise a cache hit, free effort changes, fixed token savings or an account-wide cost ceiling.

## Existing repositories

The installer deliberately accepts only a new destination. For an existing mono-repository, first generate a separate scratch workspace, review the generated controls, then merge selected planning files and entry rules manually after authorisation. Preserve every existing `CLAUDE.md`, `.claude/`, hook, CI file and Git ignore rule; do not replace them wholesale.

For a multi-repository workspace, use relative child paths in the configuration. If repositories already live elsewhere, the PM can instead use explicitly approved absolute paths in task briefs and manual session setup; this manual arrangement is outside the installer's path-validated configuration contract. Do not add symlinks to bypass path checks. Grant workers access only to the necessary task/rule directory using your client's supported controls.

Copy the [repository rule starter](../templates/repository/README.md) only after comparing existing instructions. Root rules are loaded automatically when applicable, but each worker should explicitly read the PM entry file because repositories and worktrees can sit outside its ancestry. A `CLAUDE.md` pointer must identify the real path; `AGENTS.md` is not assumed to auto-load in Claude Code.

Before code dispatch, replace `unverified` branch/test entries with evidence from manifests and code in an approved discovery task. Do not invent build commands. Configure push-triggered deployment explicitly. A greenfield project first needs a human-approved architecture proposal; the PM does not silently choose infrastructure.

## Technology adapters

| Repository type | Add to the repository's rule and QA files |
|---|---|
| `backend-api`, `service` | Local calls, error contracts, migrations, retries, idempotency, isolation |
| `web`, `admin`, `landing` | Actual page states, relevant widths/themes, accessibility and truthful copy |
| `mobile` | Emulator/device evidence, offline states, permissions, build/OTA/store boundaries |
| `infra` | Local plan/diff only; human applies cloud and DNS changes with rollback |
| `data` | Synthetic data, reproducible seeds, privacy and metric definitions |
| `library`, `cli` | Public API/exit status tests, compatibility and versioned release notes |
| `tests` | Fixture-only targets, failure evidence, no unconditional commit exception |
| `docs` | Correct commands, links, claim sources and explicit draft status |
| `external` | Contract notes and design only; no worker edits to another team's repository |

## Departments and standards

Start with PM, one developer per selected lane, QA and Security when risk warrants it. Add Design, Support, Localization, Growth, Analytics, Finance, Legal or Tools only when there is a real brief. Copy [department ROLE.md](../templates/department/ROLE.md), fill its explicit template fields, and add scope/model rows to the installed roles and model log. No department publishes, messages outsiders or changes product code by implication.

Choose baseline improvements as `now`, `later` or `skip`: testing, QA, CI, environments, releases, observability, security, contracts, data recovery, design, localisation, performance and product/legal documentation. Record choices in `planning/baseline.md`; `now` becomes a scoped proposal, never an automatic tool installation.
