# Remaining release gates and required actions

Reviewed 2026-11-11. Technical finalization does not establish legal rights, authenticate a person or authorise publication. The delivery directory's `final` suffix describes the completed local package; release state remains `candidate`.

| Gate / release-record fields | What remains and why it is not autonomous | Exact required action |
|---|---|---|
| Rights: `rights_confirmed`, `rights_evidence` | No genuine owner declaration or agreement establishes adaptation/distribution authority | Owner identifies holder, confirms scope/rights and supplies a safe decision reference; see licensing audit questions |
| Attribution: `attribution_reviewed` | Engineering inventory is complete; original contributor/external-source obligations cannot be ruled out from supplied files | Owner confirms source/contributor/contract obligations and supplies any required compatible attribution; only then confirm the field |
| Licence: `license`, `LICENSE` | Holder and distribution rights remain unresolved; MIT cannot be inferred | After rights clearance choose MIT or another appropriate licence, insert confirmed year/holder and full text, update notices/status |
| Authenticated test: `authenticated_smoke_test`, `smoke_evidence` | CLI explicitly reports logged out; no actual role/model session ran | Human logs in interactively, follows the guided five-stage smoke test, reviews genuine evidence and records a sanitised summary/reference |
| Publication: `publication_approved`, `approval_reference` | The request authorises preparation, expressly excludes unapproved public creation/push/release | Owner reviews the exact candidate and explicitly approves the intended public operations, with a decision reference |
| Final state: `state` | Dependent on every requirement above | Keep candidate until all are genuinely satisfied, then set approved and rerun `node scripts/check.mjs --release` |
| Hosted CI / GitHub security setup | No remote exists; permission to create one has not been granted | After approval, create repo, enable private vulnerability reporting, push, inspect Windows/Linux Node 22 CI and only then tag/release |

The first six rows correspond to ten findings from the unchanged release validator. No declaration is set true from an offline simulation or code-review assumption. A recorded reference must point to genuine evidence; arbitrary text does not establish consent.

Follow [publication checklist and exact commands](CHECKLIST.md). The [licensing audit](LICENSING-AUDIT.md) and [authenticated smoke guide](../docs/authenticated-smoke.md) give the concrete work needed for the unresolved gates.
