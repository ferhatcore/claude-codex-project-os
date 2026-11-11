# Security

Report a vulnerability through the repository's [private reporting form](https://github.com/ferhatcore/claude-code-project-os/security/advisories/new). Please include the affected file or command and enough detail to reproduce the issue. Do not put credentials or private project data in a public issue.

This repository contains local helper scripts and instructions for Claude Code. The scripts use Node standard libraries. The installer creates a new directory and refuses an existing destination or symbolic link path. It does not start Claude, change Git repositories or make network requests.

The workflow instructions are project policy. Actual tool access still depends on the client and its permission settings. Review repository commands before running them and use fictional data when trying the example.

The checker looks for known credential patterns, private paths and structural errors. It is a useful check, but it cannot recognise every kind of confidential value. Never add credentials, production data or private task transcripts to a commit.

The current code on the default branch is the maintained version. There is no guaranteed response time or commercial support arrangement.
