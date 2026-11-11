# Trailboard — fictional local example

Trailboard is a small personal reading-list CLI with a separately owned handbook. Every title, item and role is fictional. No network, account, payment workflow, cloud deployment or real customer data is involved.

Run from this folder:

```sh
node repos/catalog/catalog.mjs
node --test repos/catalog/catalog.test.mjs
```

The CLI prints three seeded titles. Tests cover list behavior, invalid arguments and input immutability. The [proposed TB-001 task](planning/tasks/TB-001.md) adds optional filtering by status; that feature is intentionally not implemented yet. Its approval and QA sections are pending. This is usable project input, not a fabricated finished AI run.

The installer combines the generic PM workspace with this project's configuration and planning overlay for `--runtime claude`, `codex` or `both`. Both clients share the same tasks and fixtures. `catalog` and `handbook` are separate logical repositories, without initialized Git metadata. A Git branch policy can be confirmed later. In local-folder mode the task needs no branch switch.

The PM owns coordination; Catalog Developer owns CLI implementation; Handbook Developer owns documentation; QA owns independent verification. With lean, only one worker is active at a time. Handbook documentation changes depend on the CLI contract being approved and implemented; use a separate docs task.
