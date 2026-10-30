# Resume UI Templates

Current reusable UI templates for generated resumes:

- `modern-clean` — current default template. Single-column, ATS-friendly layout with blue dividers, compact spacing, and dense experience blocks.

How to use:

- In `data.json`, set `meta.template` to the template id.
- For new packages, run `node scripts/new-company.js "<CompanyName>" [templateId]`.
- If no template is provided, the generator uses `modern-clean`.
