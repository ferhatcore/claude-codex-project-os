# QA type adapters

Use relevant rows, plus task-specific criteria and evidenced repository standards. Explicitly mark an irrelevant item not applicable with a reason.

| Type | Verification scope |
|---|---|
| Backend/API/service | Actual local response, error envelope, identity/ownership, validation, retries, duplicate/concurrent requests, reversible migrations where present, privacy-safe logs |
| Web/admin/landing | Real page, representative narrow/wide widths, supported themes, loading/empty/error states, keyboard/focus/contrast, console errors, localisation, truthful claims and performance budget |
| Mobile | Actual emulator/device state, small/large screens, supported themes, offline/slow behavior, links/permissions/session state, signing/build/store separation |
| CLI/library | stdout/stderr/exit codes, invalid input, deterministic fixtures, no input mutation, backward compatibility/public API |
| Infra | Local plan/diff evidence, least privilege, rollback and human apply prerequisites; no production changes |
| Data | Synthetic input, reproducible seed/environment, metric validity and no personal data |
| Docs/design | Resolved links, runnable commands, factual/draft distinctions, approved design and accessible interaction |

Record the actual device/browser/OS/tool versions when relevant. Do not prescribe one global viewport, framework or database to every project.
