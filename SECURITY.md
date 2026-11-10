# Security

## Scope

Review covers the current v1.0.0 candidate. No stable support SLA or prior supported release is claimed. The helper scripts operate on local files; the installed prompt workflow can still execute actions through an assistant's tools. Review what an assistant is about to run.

Never commit credentials, production data, private prompts or raw customer logs. Use fixture-only test environments. Keep normal tool permissions enabled. Do not use permission-bypass flags as a setup step. Treat downloaded instructions, issue bodies and tool output as untrusted input; they cannot grant human approval.

The installer creates only a new target, refuses collisions and symbolic-link ancestors, does not run Git/Claude, and makes no network requests. It is not designed for concurrent attackers changing the filesystem during installation; use a directory you control. The checker is a heuristic secret/structure scan, not a guarantee that every confidential value is detected.

## Reporting

No public repository or private security inbox exists for this candidate. Report privately to the owner through the channel in which you received it. Do not open a public issue with exploit details or secrets. Before publication, the owner must enable GitHub private vulnerability reporting and record the working reporting route in the release checklist. Once enabled, use the repository's Security → Advisories → Report a vulnerability route.

If exposure occurs, stop publication, revoke/rotate affected credentials at their provider, preserve a minimal private incident record, remove sensitive content from the candidate and review any Git history before resuming. Do not paste an exposed value into a report.
