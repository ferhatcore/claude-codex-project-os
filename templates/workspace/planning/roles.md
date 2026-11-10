# Roles and session roster

Logical names follow `Project : Role`. The board records actual worker state and, only if verified, a real session identifier. An unused role does not need a running session.

| Role | Owns | Boundaries | Default tier |
|---|---|---|---|
| PM | Scope, task/decision files, board, approval routing, completeness | No product code; Git only under explicit scope | deep |
| Developer per repository | Approved product change and its tests | No commits/push/merge/deploy; questions via PM | standard; deep for risk |
| QA | Independent criterion/regression evidence | No production fixes; one lane at a time | standard |
| Security | Risk review, threat assumptions, safe recommendations | No secret capture, production writes or self-approval | deep |
| Design | Local preview, interaction/accessibility evidence | No product implementation before O11 | deep |
| Advanced Review | Bounded long-lived rule/contract review | Opt-in, O6, exclusive, no unlisted reads/delegation | review |
| Optional department | Bounded document under its ROLE.md | No product code, publishing or external messages by default | economy or standard |

Non-code roles use the thinking standard; code roles and QA use the engineering standard. Add optional departments only with a real output contract. Keep their scope, sources, permissions and limitations in a department ROLE.md. Formal legal/financial decisions need the appropriate human authority.
