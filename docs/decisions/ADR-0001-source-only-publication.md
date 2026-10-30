# ADR-0001: Source-only publication

Status: Accepted

Date: 2026-10-30

## Context

Document generation mixes reusable instructions and code with confidential inputs and outputs. Existing working repositories may already contain private documents in old commits.

## Decision

Publish a separate repository with reviewed instructions, architecture, generator sources, and fictional examples. Start a clean history. Keep the original repository and history local. Allow only explicitly reviewed files through `.gitignore`.

## Alternatives

Ignore rules on an existing history do not remove tracked files or earlier commits. Rewriting that history needs separate approval and complicates preservation of local work. Publishing personal data in a private repository still transfers it and fails the intended boundary.

## Consequences

Cloning and testing require no candidate data. New source files need allowlist review. Local profiles need independent local backups. Never push the original working repository as a substitute for this clean publication.

## Validation

Run `npm test`, `npm run check:privacy`, inspect the staged diff, and inspect publication ancestry. Review content even when its path is allowed.

## Reconsider when

The input storage model changes or a separate data-sharing requirement is explicitly authorized. Neither permits publishing existing personal data by default.
