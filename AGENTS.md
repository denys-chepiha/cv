# Project Rules

## Sources of truth

- Package content and output rules: `docs/workflows/document-package.md`.
- Candidate facts: the selected profile supplied locally by the user. No real candidate facts belong in tracked files.
- Commands and dependencies: `package.json` and `package-lock.json`.
- Publication allowlist: `.gitignore`.

## Commands

- Tests: `npm test`.
- Tracked-path privacy check: `npm run check:privacy`.
- Create a package: `npm run new -- "Example Company"`.
- Generate documents: `npm run generate -- "Example Company"`.

## Invariants

- Never commit candidate data, application history, preparation notes, photos, or generated documents.
- Keep tracked examples fictional. Never derive candidate claims from them.
- Read the selected local profile and package rules before drafting or regenerating documents.
- Do not use sensitive facts without explicit consent for the specific document.
- Do not force-add ignored files or push branches containing private historical data.

## Documentation routing

- Generator boundaries: `docs/architecture/components.md`.
- Package behavior: `docs/workflows/document-package.md`.
- Publication policy: `docs/decisions/`.
- Status and planned work: `docs/CURRENT_STATE.md` and `docs/ROADMAP.md`.

## Validation and maintenance

Run tests for changed behavior and the privacy check before publication. Review contents of newly allowed files. Update the relevant contract documentation when behavior changes. Plan larger changes before editing; keep application-specific notes local.
