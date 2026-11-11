# Contributing

Start with a specific problem. Explain what you expected, what happened and how someone else can reproduce it. For workflow changes, include a short example of the task or session that exposed the problem.

Keep the basic setup usable with local files and ordinary Claude Code or Codex sessions. If a change needs an integration, document the actual tools and permissions it uses. Keep examples fictional and leave private project logs out of issues and pull requests.

Before opening a pull request, run:

```sh
node scripts/check.mjs
node --test scripts/system.test.mjs scripts/smoke.test.mjs scripts/runtimes.test.mjs
```

If you change installation paths or templates, try the setup in a new directory too. Record the commands you ran and their results in the pull request. Add a regression test when a bug affects installer or validator behavior.

Contributions are made under the [MIT License](LICENSE). Identify any third party material you add and preserve its notices. See [provenance](PROVENANCE.md) for the source history and [security reporting](SECURITY.md) for private reports.
