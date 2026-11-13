# Contributing

Start with a specific problem. Explain what you expected, what happened and how someone else can reproduce it. For workflow changes, include a short example of the task or session that exposed the problem.

Keep the basic setup usable with local files and ordinary Claude Code or Codex sessions. If a change needs an integration, document the actual tools and permissions it uses. Keep examples fictional and leave private project logs out of issues and pull requests.

Before opening a pull request, run:

```sh
node scripts/check.mjs
node --test scripts/system.test.mjs scripts/smoke.test.mjs scripts/runtimes.test.mjs
```

If you change installation paths or templates, try the setup in a new directory too. Record the commands you ran and their results in the pull request. Add a regression test when a bug affects installer or validator behavior.

## Commit messages

Use a short title describing the change, such as `Add Jest and Vitest report adapters`. Include a body only when a reviewer needs the reason or compatibility details.

Keep chat prompts, approval requests, quota notices and handoff instructions out of commit messages. Put reproducible test results in the relevant report. Name Claude Code or Codex when the change concerns those tools; preserve required attribution and co-author records.

Contributions are made under the [MIT License](LICENSE). Identify any third party material you add and preserve its notices. See [provenance](release/PROVENANCE.md) for the source history and [security reporting](SECURITY.md) for private reports.

