# Deployment — template

Status: no deployment authorised. Environment, prerequisites, CI push effects, migration/backup requirements and rollback are unverified.

Default cloud/DNS/database/secret-store/store writes are human-only. Before any release, identify the real operator, access, approved target and rollback path. A push-triggered deployment requires deployment approval as well as Git approval. Record actual deployment separately from QA completion.
