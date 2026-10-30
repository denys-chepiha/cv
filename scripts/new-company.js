#!/usr/bin/env node
// Core
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { assertTemplate, DEFAULT_TEMPLATE } from '../templates/ui-registry.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = join(__dirname, '..');
const resumesDir = join(root, 'src', 'resumes');

const company = process.argv[2];
const templateId = process.argv[3] || DEFAULT_TEMPLATE;
if (!company) {
  console.error('Usage: node scripts/new-company.js <CompanyName> [templateId]');
  process.exit(1);
}

const companyDir = join(resumesDir, company);

if (existsSync(companyDir)) {
  console.error(`Folder already exists: src/resumes/${company}`);
  console.error('Edit the existing data.json and run: node scripts/generate.js "' + company + '"');
  process.exit(1);
}

mkdirSync(companyDir, { recursive: true });

const template = JSON.parse(readFileSync(join(root, 'templates', 'data.example.json'), 'utf-8'));
const uiTemplate = assertTemplate(templateId);
template.meta.company = company;
template.meta.date = new Date().toISOString().split('T')[0];
template.meta.template = uiTemplate.id;

writeFileSync(join(companyDir, 'data.json'), JSON.stringify(template, null, 2));

const vacancyTemplate = `# ${company} — Job Description

## Position
<!-- Role title -->

## Company
<!-- Brief company description -->

## Responsibilities
<!--
- ...
- ...
-->

## Requirements
<!--
- ...
- ...
-->

## Nice to Have
<!--
- ...
- ...
-->

## Stack
<!-- Technologies mentioned in the job posting -->

## Notes
<!-- Personal notes, tailoring ideas, keywords to hit -->
`;

writeFileSync(join(companyDir, 'vacancy.md'), vacancyTemplate);

console.log(`✓ Created src/resumes/${company}/data.json`);
console.log(`✓ Created src/resumes/${company}/vacancy.md`);
console.log(`✓ Template: ${uiTemplate.id} (${uiTemplate.name})`);
console.log('');
console.log('Next steps:');
console.log(`  1. Paste the job description into src/resumes/${company}/vacancy.md`);
console.log(`  2. Tailor src/resumes/${company}/data.json — summary, bullets, skills`);
console.log(`  3. node scripts/generate.js "${company}"`);
