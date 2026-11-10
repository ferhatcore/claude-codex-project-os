# Claude Code capabilities and references

Reference check: 2026-11-10. Local CLI inspected: Claude Code 2.1.110 (`--version` and `--help` only). No authenticated model request was run. Online documentation can describe features newer than this local installation; verify your installed client before enabling an adapter.

## Baseline and optional adapters

| Capability | Baseline behavior | Optional integration requirement |
|---|---|---|
| Load root instructions | Start `claude` in PM workspace; explicitly read `START.md` | Normal CLAUDE.md discovery must remain enabled |
| Named roles | Human opens separate terminals; PM records logical role names | Verify session/team creation and real IDs before claiming control |
| Dispatch and results | Human carries task paths and short summaries | Native subagent/team tools available in that client, explicitly enabled |
| Context recovery | Files and self-contained resume briefs; human uses `/compact` or `/clear` | Never assume PM can clear another session |
| Model/effort | Human chooses supported controls; record effective settings | Verify selector support; custom tier JSON is not native settings |
| Usage | Human reads account/client usage and records timestamp/window | An actual telemetry tool with defined scope and freshness |
| Schedules and dashboard | Not installed | Separate approved scheduler or UI implementation |

The original source referred to environment-specific session-control APIs. Their names are not advertised here as portable Claude Code APIs. Native subagents run within a session and are not interchangeable with persistent, independent sessions. Agent teams and cross-session tools are optional and version-dependent; the workflow's file contract works without them.

## Official sources

- [Installation and first session](https://code.claude.com/docs/en/quickstart): CLI setup and interactive authentication.
- [Memory and CLAUDE.md](https://code.claude.com/docs/en/memory): how instructions are discovered and loaded.
- [Custom subagents](https://code.claude.com/docs/en/sub-agents): optional specialist contexts and tool access.
- [Model configuration](https://code.claude.com/docs/en/model-config): selectors and supported effort settings.
- [Permissions](https://code.claude.com/docs/en/permissions): real tool-access controls.
- [Costs and usage](https://code.claude.com/docs/en/costs): account/client usage controls and context management.
- [Interactive commands](https://code.claude.com/docs/en/interactive-mode): current command behavior.

CLAUDE.md is a steering mechanism; writing a restriction in a task is not equivalent to enforcing it in permissions. Keep normal permission checks active, review local hooks/settings, and use a disposable fixture environment for setup validation. No native settings, agents, hooks or MCP connections are silently installed by this kit.
