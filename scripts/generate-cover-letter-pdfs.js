#!/usr/bin/env node
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import { resolveTemplate } from '../templates/ui-registry.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = join(__dirname, '..');
const resumesDir = join(root, 'src', 'resumes');

function esc(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function normalizeText(value) {
  return String(value || '').replace(/\u2014/g, '-');
}

const ICONS = {
  email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  location: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 0H5C2.239 0 0 2.239 0 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5V5c0-2.761-2.238-5-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z"/></svg>`,
  github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c.985.005 1.978.137 2.905.402 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>`,
  website: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
};

function externalHref(value) {
  const text = normalizeText(value);
  if (!text) return '';
  return /^https?:\/\//i.test(text) ? text : `https://${text}`;
}

function renderContact(personal) {
  const items = [
    { key: 'location', label: 'Location', value: personal.location },
    { key: 'email', label: 'Email', value: personal.email, href: personal.email ? `mailto:${personal.email}` : '' },
    { key: 'phone', label: 'Phone', value: personal.phone, href: personal.phone ? `tel:${personal.phone}` : '' },
    { key: 'linkedin', label: 'LinkedIn', value: personal.linkedin, href: externalHref(personal.linkedin) },
    { key: 'github', label: 'GitHub', value: personal.github, href: externalHref(personal.github) },
    { key: 'website', label: 'Website', value: personal.website, href: externalHref(personal.website) },
  ]
    .filter(({ value }) => Boolean(value))
    .map(({ key, label, value, href }) => {
      const normalizedValue = normalizeText(value);
      const valueHtml = href
        ? `<a href="${esc(href)}">${esc(normalizedValue)}</a>`
        : `<span>${esc(normalizedValue)}</span>`;

      return `
      <div class="contact-item">
        <div class="contact-icon" aria-hidden="true">${ICONS[key]}</div>
        <div class="contact-text">
          <div class="contact-label">${esc(label)}</div>
          <div class="contact-value">${valueHtml}</div>
        </div>
      </div>
    `;
    });

  return items.join('');
}

function htmlLang(languageKey) {
  if (languageKey === 'ru') return 'ru';
  if (languageKey === 'uk') return 'uk';
  if (languageKey === 'de') return 'de';
  return 'en';
}

function buildHtml(data, languageKey, letter) {
  const template = resolveTemplate(data.meta?.template);
  const colors = template.pdf.colors;
  const typography = template.pdf.typography;
  const paragraphs = (letter.paragraphs || [])
    .map((paragraph) => `<p>${esc(normalizeText(paragraph))}</p>`)
    .join('');

  const subject = letter.subject
    ? `<div class="subject">${esc(normalizeText(letter.subject))}</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="${htmlLang(languageKey)}">
<head>
  <meta charset="UTF-8">
  <title>${esc(normalizeText(data.personal.name))} Cover Letter</title>
  <style>
    * { box-sizing: border-box; }

    body {
      margin: 0;
      font-family: ${typography.bodyFont};
      color: ${colors.pageText};
      background: white;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      width: 100%;
      padding: 18mm;
    }

    .header {
      margin-bottom: 18px;
    }

    .name {
      font-size: 22pt;
      font-weight: 700;
      color: ${colors.name};
      line-height: 1.08;
    }

    .title {
      margin-top: 4px;
      font-size: 11pt;
      color: ${colors.muted};
    }

    .line {
      height: 2px;
      background: ${colors.accent};
      margin: 10px 0 9px;
    }

    .contact {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px 14px;
      font-size: 8.2pt;
      line-height: 1.25;
      color: ${colors.body};
    }

    .contact-item {
      display: grid;
      grid-template-columns: 18px minmax(0, 1fr);
      align-items: start;
      gap: 6px;
      min-width: 0;
    }

    .contact-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      border-radius: 4px;
      color: ${colors.accent};
      background: ${colors.accent}14;
    }

    .contact-icon svg {
      width: 10px;
      height: 10px;
      display: block;
    }

    .contact-text {
      min-width: 0;
    }

    .contact-label {
      margin-bottom: 1px;
      font-size: 6.7pt;
      font-weight: 700;
      letter-spacing: 0;
      text-transform: uppercase;
      color: ${colors.muted};
    }

    .contact-value {
      color: ${colors.link};
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .contact-value a {
      color: ${colors.link};
      text-decoration: none;
    }

    .meta {
      margin-top: 26px;
      margin-bottom: 18px;
      font-size: 10pt;
      line-height: 1.65;
      color: ${colors.body};
    }

    .subject {
      margin-bottom: 14px;
      font-size: 10pt;
      font-weight: 700;
      color: ${colors.name};
    }

    .body p {
      margin: 0 0 13px;
      font-size: 10.3pt;
      line-height: 1.68;
      color: ${colors.body};
    }

    .closing {
      margin-top: 20px;
      font-size: 10.3pt;
      line-height: 1.65;
      color: ${colors.body};
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="name">${esc(normalizeText(data.personal.name))}</div>
      <div class="title">${esc(normalizeText(data.personal.title))}</div>
      <div class="line"></div>
      <div class="contact">${renderContact(data.personal)}</div>
    </div>

    <div class="meta">
      <div>${esc(normalizeText(letter.date || data.meta?.date || ''))}</div>
      <div>${esc(normalizeText(letter.recipient || 'Hiring Team'))}</div>
      <div>${esc(normalizeText(letter.company || data.meta?.company || ''))}</div>
    </div>

    ${subject}

    <div class="body">
      <p>${esc(normalizeText(letter.greeting || ''))}</p>
      ${paragraphs}
    </div>

    <div class="closing">
      <div>${esc(normalizeText(letter.closing || 'Sincerely,'))}</div>
      <div>${esc(normalizeText(letter.signature || data.personal.name))}</div>
    </div>
  </div>
</body>
</html>`;
}

export async function generateCoverLetterPdfs(data, companyDir) {
  const coverLetter = data.coverLetter || {};
  const jobs = [
    { key: 'en', filename: 'Cover_Letter_EN.pdf' },
    { key: 'de', filename: 'Cover_Letter_DE.pdf' },
    { key: 'uk', filename: 'Cover_Letter_UK.pdf' },
    { key: 'ru', filename: 'Cover_Letter_RU.pdf' },
  ].filter((job) => coverLetter[job.key]);

  if (!jobs.length) {
    return [];
  }

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const generatedFiles = [];

  for (const job of jobs) {
    const outputPath = join(companyDir, job.filename);
    await page.setContent(buildHtml(data, job.key, coverLetter[job.key]), {
      waitUntil: 'networkidle0',
    });
    await page.pdf({
      path: outputPath,
      format: 'A4',
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      printBackground: true,
    });
    generatedFiles.push(outputPath);
  }

  await browser.close();
  return generatedFiles;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const company = process.argv[2];
  if (!company) {
    console.error('Usage: node scripts/generate-cover-letter-pdfs.js <CompanyName>');
    process.exit(1);
  }

  const companyDir = join(resumesDir, company);
  const dataPath = join(companyDir, 'data.json');

  if (!existsSync(dataPath)) {
    console.error(`No data.json found in src/resumes/${company}/`);
    process.exit(1);
  }

  const data = JSON.parse(readFileSync(dataPath, 'utf-8'));
  const generated = await generateCoverLetterPdfs(data, companyDir);

  if (!generated.length) {
    console.log(`No cover letters configured for resumes/${company}/data.json`);
    process.exit(0);
  }

  generated.forEach((filePath) => {
    console.log('✓ Cover Letter PDF →', filePath);
  });
}
