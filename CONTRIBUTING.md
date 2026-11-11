# Contributing

This local candidate awaits ownership and licensing clearance. External contributions are not being solicited yet. Once cleared, update this notice and the release record before accepting public contributions.

Propose a concrete problem with a small before/after workflow. Keep the file-based baseline usable without paid integrations or background services. Separate native Claude Code capabilities from project policy. Use fictional data and never include private task logs, credentials or customer details.

For changes, run:

```sh
node scripts/check.mjs
node --test scripts/system.test.mjs
node --test scripts/smoke.test.mjs
```

Exercise onboarding if paths or templates change. Add meaningful negative tests for installer/validator behavior, update the changelog, and document the actual client version for any integration claim. Prefer standard-library helpers over new dependencies.

The maintainer reviews every diff. Contributors must be able to grant the eventual project licence for their work; disclose third-party sources and preserve required notices. Do not add copied prompts, code or branding without a documented compatible grant. See [provenance](PROVENANCE.md) and [security reporting](SECURITY.md).
