# Document Package Creation Rules

## Inputs and precedence

Read these rules and the selected candidate's local source profile before creating, editing, or regenerating any package. Then read the target vacancy. Ask for missing facts needed to complete the application.

Explicit instructions for the current application override general defaults. Verified candidate facts determine what can be claimed. The vacancy determines emphasis, not new experience. Old resumes, example JSON, and conversation memory are not evidence for candidate claims.

Keep profiles, original vacancies, notes, application histories, and resulting documents local. Never copy them into tracked instructions or examples.

## Privacy and consent

Include only information necessary for the application. Omit sensitive facts unless the candidate explicitly approves their use in that specific document. Silence is not permission. Do not turn sensitive background into a motivation or leadership story.

Omit street address, date of birth, marital status, photos, and unnecessary personal details by default. Use approved contact details only. These are project defaults, not universal hiring-market claims; exceptions require the candidate's decision.

## Workflow

1. Identify the candidate, local source profile, vacancy, and submission requirements.
2. Extract role, seniority, responsibilities, required and preferred skills, domain, work model, location, and practical constraints. Separate explicit requirements from inferences.
3. Select one target role and map relevant requirements to verified evidence. Record gaps locally rather than inventing a match.
4. Run `npm run new -- "CompanyName"`. Store the vacancy in local `vacancy.md` and fill local `data.json`.
5. Write the resume sections according to the rules below.
6. Draft the English cover letter. Add a Russian meaning-review translation when requested. Other submission languages follow the vacancy and candidate instructions.
7. Run `npm run generate -- "CompanyName"`.
8. Inspect extracted text and every rendered page. Correct facts, wording, clipping, wrapping, pagination, and contact issues; regenerate.
9. Return reviewed local files and unresolved factual gaps. Sending an application requires a separate explicit instruction.

## Positioning

- One vacancy means one target role. Do not combine several job titles in the headline.
- Match the summary to that role, usually within 3-4 rendered lines, using supported production experience and outcomes.
- Use verified current language levels, location, and years of experience when relevant. Never hard-code one person's values into shared rules.
- Frontend applications prioritize UI engineering, relevant frameworks, performance, testing, and collaboration. Full-stack applications may add supported backend, API, database, integration, and deployment experience.
- Keep AI tooling secondary unless the vacancy values it. Describe freelance or founder experience honestly; do not disguise employment status.
- Mark contract or project roles accurately when useful and preserve chronology.

## Experience and metrics

- Prefer `Role Title - Domain or Scope` for major entries without inventing titles or domains.
- Start major entries with one short context sentence describing the product and scope.
- Follow with action, technical contribution, and outcome. Quantify only when sources support the number; otherwise use qualitative impact.
- Avoid stacking percentages in one bullet or leading every adjacent bullet with a number.
- Aim for 4-5 total data-level bullets for the strongest recent roles, 3-4 for other relevant roles, and 1-3 for older work. Preserve important evidence before applying counts mechanically.
- End engineering entries with `Technologies: ...` in the `bullets` array, using verified relevant tools. CV renderers display this as a separate bold row outside the bullet list. For translated labels, match `meta.labels.technologies`.
- The `stack` field alone is not rendered. Keep it consistent with the technologies line.
- Unverified estimates and drafting placeholders must not reach the final application.

## ATS and layout

- Use standard labels: Experience, Skills, Education, Certifications, and Languages.
- Use a single-column CV body without decorative tables, text boxes, or keyword dumps.
- Mirror relevant vacancy terms only when supported by candidate facts.
- Limit skills to 40 items overall, 12 in Frontend, and 10 in other categories. Merge related items and omit irrelevant categories.
- If years are listed, annotate only the strongest 3-5 skills and verify them.
- Keep certifications compact and language proficiency accurate.
- Default submission target: two CV pages. Master profiles are exempt; short histories or explicit application requirements may justify another length. Never add filler or invented experience to reach a page count.
- Use regular hyphens instead of em dashes in application prose. Prefer direct, credible language to promotional claims.

## Structured data

- Follow the fictional structure in `templates/data.example.json`.
- The phone key is `personal.phone`, not a custom variant such as `phone_at`.
- `summary` is one string, not an object of alternatives.
- `skills` maps category names to arrays of strings.
- `certifications` and `languages` are arrays of strings, not objects.
- `experience[].bullets` contains context, achievements, and a final technologies line when appropriate.
- Optional contacts may be empty; never fill them with guesses or example details.
- Use a registered `meta.template`; keep tailoring notes in local `meta.notes`.

## Cover letters and messages

Use the writing instructions for clear professional English, usually 220-320 words unless the application requires another length. Include a role-specific opening, supported experience, a factual company connection, and a brief closing. Verify company facts through reliable sources.

Store letters under `coverLetter` in local JSON. Render submission and requested review versions as separate PDFs. `Cover_Letter.txt` is a helper for pasting into forms, not a required attachment for every application. Do not use separate Markdown files as final cover-letter deliverables.

PDF headers show the candidate name, target title, accent divider, and a labeled contact grid. Long links must wrap. This header rule is separate from the single-column CV body rule.

For recruiter leads, draft `LinkedIn_Reply.txt` when relevant: a short chat reply covering the strongest match and verified availability, work model, start date, rate, or other practical constraints. Draft emails and follow-ups only when requested. These files remain local and require review.

## Final review

- [ ] One target role, correct company, recipient, and submission language.
- [ ] Every claim, tool, date, metric, and language level is supported.
- [ ] Sensitive facts have document-specific consent or are omitted.
- [ ] Contacts belong to the selected candidate; no example placeholders remain.
- [ ] Summary and skills are focused; chronology and employment status are accurate.
- [ ] Technologies render separately; headings and extracted text remain readable.
- [ ] Every PDF page and DOCX output has been inspected for defects.
- [ ] Translation meaning, page count, and filenames fit the application.
- [ ] Inputs, preparation notes, and outputs remain outside Git.

Automated repository tests cover the publication boundary and fictional sample generation. They do not replace factual or visual review of real applications.
