# Document Package Generator

Reusable instructions, templates, and a local Node.js generator for tailored resume and cover-letter packages. All bundled candidate data is fictional.

## Instructions and architecture

- Package creation rules: `docs/workflows/document-package.md`.
- Component boundaries and data flow: `docs/architecture/components.md`.
- Publication policy: `docs/decisions/ADR-0001-source-only-publication.md`.
- Reusable task instructions: `.codex/skills/`.
- Template selection: `templates/README.md`.

## Local usage

Use Node.js with its built-in test runner and the locked dependencies:

```sh
npm ci
npm test
npm run new -- "Example Company"
```

Read the package creation rules, then fill `src/resumes/Example Company/data.json` from the selected local candidate profile and target vacancy. Example data provides structure, not evidence about a candidate.

```sh
npm run generate -- "Example Company"
npm run generate:cover-letter -- "Example Company"
```

Outputs stay beside the local data: `CV.docx`, `CV.pdf`, `Cover_Letter_<LANG>.pdf`, and `Cover_Letter.txt`. PDF generation uses Puppeteer and its installed browser. The text letter is a copy-and-paste helper. Recruiter replies are drafted according to the workflow, not generated automatically by the CLI.

## Privacy

`.gitignore` allows only explicitly reviewed project files. Candidate profiles, application histories, preparation materials, photos, generated documents, credentials, and new unreviewed files are ignored. Store local inputs in `users/`, `knowledge/`, `photo/`, or `src/`.

Never turn the tracked fictional template into a real CV. Create a local package first. Review content before allowing a new source file.

Before committing:

```sh
npm test
npm run check:privacy
git diff --cached --check
git diff --cached
```

The privacy check rejects tracked paths excluded by `.gitignore`; it cannot identify every personal fact inserted into allowed source text. Git ignore rules do not erase old commits. This publication starts from a clean history; never push an older repository containing application data into it.
