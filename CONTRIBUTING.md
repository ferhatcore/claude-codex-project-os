# Contributing

This project is licensed under [MIT](LICENSE), Copyright (c) 2026 Ferhat Kosger. It is currently a local release candidate; public contribution channels will be available after publication. Do not claim that a public repository or contributor community already exists.

Propose a concrete problem with a small before/after workflow. Keep the file-based baseline usable without paid integrations or background services. Separate native Claude Code capabilities from project policy. Use fictional data and never include private task logs, credentials or customer details.

For changes, run:

```sh
node scripts/check.mjs
node --test scripts/system.test.mjs
node --test scripts/smoke.test.mjs
```

Exercise onboarding if paths or templates change. Add meaningful negative tests for installer/validator behavior, update the changelog, and document the actual client version for any integration claim. Prefer standard-library helpers over new dependencies.

The maintainer reviews every diff. Contributors must be able to contribute their work under the MIT licence; disclose third-party sources and preserve required notices. Do not add copied prompts, code or branding without a documented compatible grant. See [provenance](PROVENANCE.md) and [security reporting](SECURITY.md).
