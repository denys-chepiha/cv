# Roadmap

## Source-only publication

Scope: reusable instructions, architecture, code, and fictional examples.

Non-scope: personal profiles, applications, preparation notes, photos, outputs, and old history.

Dependencies: existing Node.js packages and Git.

Risks: personal facts embedded in instructions and accidental publication of old commits.

Verification: `npm test`, `npm run check:privacy`, `git diff --cached --check`, content and ancestry review.

- [x] Separate the publication copy from the private working repository.
- [x] Generalize instructions and examples, preserving local candidate files.
- [x] Document the workflow and component boundaries.
- [x] Verify the allowlist, source tree, and fictional sample generation.
- [ ] Publish only the reviewed clean history to a private repository.
