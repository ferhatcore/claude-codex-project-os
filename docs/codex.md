# Codex setup

Use the same repository and planning files with Claude Code, Codex or both. The installer writes only the selected client entries into a new workspace.

```sh
node scripts/init.mjs --target ../codex-demo --example --runtime codex
node scripts/init.mjs --target ../shared-demo --example --runtime both
```

Open Codex at the generated workspace root and ask it to read START.md, or invoke `$project-os-start`. A default installation without `--runtime` continues to select Claude Code.

Codex receives AGENTS.md, four project agent definitions under .codex/agents and four skills under .agents/skills. The roles are PM, Developer, QA and Reviewer. The generated .codex/config.toml sets only the native worker cap. It does not change global settings, permission policy, providers or MCP connections. Trust the project in the client before loading its project configuration.

The main session is PM. For approved tasks, the entry rules ask it to delegate to the installed role agents when available. A new installation does not claim those tools were observed or that an agent has run. Manual sessions remain the fallback.

Some clients expose native delegation without a named agent type selector. In that case the PM reads the installed role definition and sends its full instructions in the delegated brief. The logical role and the actual tool used are recorded separately. This keeps the same role boundaries without claiming that the client selected a custom agent type.

Both clients share one planning directory, one set of task files and the same repository topic documents. In the example, .claude holds ordinary repository knowledge documents; Codex reads them through its AGENTS.md links. There is no second task board or copied set of business rules. One client must release a repository lane before the other works there.

Model settings inherit from the parent by default. Custom agents inherit the parent's permissions and provider; role text does not create a read only sandbox. The project model tiers and usage bands remain policy until effective client settings and usage are observed.

The four skills cover bootstrap, task drafting, independent QA and recovery. They read the existing shared rules and write to the same task/decision files. The helper scripts do not start models, create accounts or install a background service.

## Official references

The adapter follows OpenAI Docs reviewed on 2026-11-11:

1. [AGENTS.md discovery](https://learn.chatgpt.com/docs/agent-configuration/agents-md).
2. [Project skills](https://learn.chatgpt.com/docs/build-skills).
3. [Custom subagents and inherited permissions](https://learn.chatgpt.com/docs/agent-configuration/subagents).

Client support depends on the installed version and managed configuration. Validate the generated workspace with `node scripts/check.mjs --workspace ../codex-demo` from the distribution root.
