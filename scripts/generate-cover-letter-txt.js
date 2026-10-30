#!/usr/bin/env node
// Core
import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = join(__dirname, '..');
const resumesDir = join(root, 'src', 'resumes');

function buildLetterBlock(letter, personal) {
  const lines = [];

  if (letter.date)      lines.push(letter.date);
  if (letter.recipient) lines.push(letter.recipient);
  if (letter.company)   lines.push(letter.company);
  lines.push('');

  if (letter.subject)   lines.push(letter.subject);
  lines.push('');

  if (letter.greeting)  lines.push(letter.greeting);
  lines.push('');

  for (const paragraph of letter.paragraphs || []) {
    lines.push(paragraph);
    lines.push('');
  }

  if (letter.closing)   lines.push(letter.closing);
  if (letter.signature || personal?.name) {
    lines.push(letter.signature || personal?.name || '');
  }

  return lines.join('\n');
}

export function generateCoverLetterTxt(data, companyDir) {
  const coverLetter = data.coverLetter || {};
  const personal   = data.personal   || {};

  const separator = '─'.repeat(60);
  const blocks = [];

  const langLabels = { en: 'ENGLISH', uk: 'UKRAINIAN', ru: 'RUSSIAN', de: 'GERMAN', pl: 'POLISH', es: 'SPANISH', fr: 'FRENCH' };

  for (const key of Object.keys(coverLetter)) {
    const letter = coverLetter[key];
    if (!letter || typeof letter !== 'object') continue;
    const label = langLabels[key] || key.toUpperCase();

    blocks.push(`[ ${label} ]`);
    blocks.push(separator);
    blocks.push('');
    blocks.push(buildLetterBlock(letter, personal));
    blocks.push('');
  }

  const content = blocks.join('\n') + '\n';
  const outputPath = join(companyDir, 'Cover_Letter.txt');
  writeFileSync(outputPath, content, 'utf-8');
  return outputPath;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const company = process.argv[2];
  if (!company) {
    console.error('Usage: node scripts/generate-cover-letter-txt.js <CompanyName>');
    process.exit(1);
  }

  const companyDir = join(resumesDir, company);
  const dataPath   = join(companyDir, 'data.json');

  if (!existsSync(dataPath)) {
    console.error(`No data.json found in src/resumes/${company}/`);
    process.exit(1);
  }

  const data = JSON.parse(readFileSync(dataPath, 'utf-8'));
  const outputPath = generateCoverLetterTxt(data, companyDir);
  console.log('✓ Cover Letter TXT →', outputPath);
}
