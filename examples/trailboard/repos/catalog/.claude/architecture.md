# Catalog architecture

Evidence: `catalog.mjs` exports pure `listTitles` and `run` functions. Only the CLI entry block reads a local fixture and writes stdout/stderr. Data is ordered JSON with `id`, `title`, `status`. The module has no network or persistent writes. Keep task behavior testable through the pure interface and actual CLI invocation.
