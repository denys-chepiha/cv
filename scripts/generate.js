#!/usr/bin/env node
// Core
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
// Utils
import { generateDocx } from './generate-docx.js';
import { generatePdf } from './generate-pdf.js';
import { generateCoverLetterPdfs } from './generate-cover-letter-pdfs.js';
import { generateCoverLetterTxt } from './generate-cover-letter-txt.js';
import { assertTemplate, DEFAULT_TEMPLATE } from '../templates/ui-registry.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = join(__dirname, '..');
const resumesDir = join(root, 'src', 'resumes');

const company = process.argv[2];
if (!company) {
  console.error('Usage: node scripts/generate.js <CompanyName>');
  process.exit(1);
}

const companyDir = join(resumesDir, company);
const dataPath = join(companyDir, 'data.json');

if (!existsSync(dataPath)) {
  console.error(`No data.json found in src/resumes/${company}/`);
  console.error(`Run first: node scripts/new-company.js "${company}"`);
  process.exit(1);
}

const data = JSON.parse(readFileSync(dataPath, 'utf-8'));
const templateId = data.meta?.template || DEFAULT_TEMPLATE;
const template = assertTemplate(templateId);

console.log(`Generating CV for ${company} with template "${template.id}"...`);

const docxPath = join(companyDir, 'CV.docx');
const pdfPath = join(companyDir, 'CV.pdf');

await generateDocx(data, docxPath);
console.log('✓ DOCX →', docxPath);

await generatePdf(data, pdfPath);
console.log('✓ PDF  →', pdfPath);

const coverLetterPaths = await generateCoverLetterPdfs(data, companyDir);
coverLetterPaths.forEach((coverLetterPath) => {
  console.log('✓ Cover Letter PDF →', coverLetterPath);
});

const txtPath = generateCoverLetterTxt(data, companyDir);
console.log('✓ Cover Letter TXT →', txtPath);

console.log('');
console.log(`Done! src/resumes/${company}/`);
