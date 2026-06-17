# Security Policy

SQLab is a local-first educational app, but it executes learner-provided SQL against a local MySQL database. Security reports are welcome, especially around SQL execution boundaries, API access controls, and local database isolation.

## Supported Versions

The `main` branch is the supported development line.

## Reporting a Vulnerability

Please avoid opening a public issue for a suspected vulnerability. If possible, report it privately through GitHub security advisories for the repository.

If private reporting is not available, contact the maintainer through the GitHub profile linked from the repository and include:

- A short description of the issue
- Steps to reproduce
- Expected impact
- Relevant logs, screenshots, or proof-of-concept SQL

## Areas of Interest

- SQL classification and execution boundaries
- DDL validation isolation
- Local database reset behavior
- API access controls
- Docker and MySQL defaults
- Error messages that expose unnecessary internals

## Responsible Disclosure

Please give the maintainer reasonable time to confirm and fix the issue before public disclosure.
