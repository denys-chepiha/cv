// Core
import puppeteer from 'puppeteer';
import { resolveTemplate } from '../templates/ui-registry.js';

export async function generatePdf(data, outputPath) {
  const template = resolveTemplate(data.meta?.template);
  const html = buildHtml(data, template);

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: outputPath,
    format: template.pdf.page.format,
    margin: template.pdf.page.margin,
    printBackground: true,
  });
  await browser.close();
}

// ─── HTML builder ─────────────────────────────────────────────────────────────

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const ICONS = {
  email: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  phone: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  location: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  linkedin: `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0H5C2.239 0 0 2.239 0 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5V5c0-2.761-2.238-5-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z"/></svg>`,
  github: `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c.985.005 1.978.137 2.905.402 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>`,
  globe: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  telegram: `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`,
  whatsapp: `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>`,
};

function contactItem(icon, href, label) {
  const content = href
    ? `<a href="${href}">${esc(label)}</a>`
    : `<span>${esc(label)}</span>`;
  return `<div class="contact-item">${icon}${content}</div>`;
}

function buildContactHtml(personal) {
  const items = [
    personal.email    ? contactItem(ICONS.email,    `mailto:${personal.email}`,          personal.email)    : null,
    personal.phone    ? contactItem(ICONS.phone,    `tel:${personal.phone}`,              personal.phone)    : null,
    personal.location ? contactItem(ICONS.location, null,                                personal.location) : null,
    personal.linkedin ? contactItem(ICONS.linkedin, `https://${personal.linkedin}`,      personal.linkedin) : null,
    personal.github   ? contactItem(ICONS.github,   `https://${personal.github}`,        personal.github)   : null,
    personal.website  ? contactItem(ICONS.globe,    `https://${personal.website}`,                personal.website)  : null,
    personal.telegram ? contactItem(ICONS.telegram, `https://t.me/${personal.telegram}`,          `@${personal.telegram}`) : null,
    personal.whatsapp ? contactItem(ICONS.whatsapp, `https://wa.me/${personal.whatsapp.replace(/\D/g, '')}`, personal.whatsapp) : null,
  ].filter(Boolean);

  return `<div class="contact-grid">${items.join('')}</div>`;
}

function buildExperienceHtml(experience, techPrefix = 'Technologies:') {
  if (!experience?.length) return '';
  return experience
    .map((exp) => {
      const techLine = exp.bullets?.find((b) => String(b).startsWith(techPrefix));
      const regularBullets = exp.bullets?.filter((b) => !String(b).startsWith(techPrefix)) || [];

      return `
    <div class="exp-entry">
      <div class="exp-header">
        <div class="exp-left">
          <span class="exp-company">${esc(exp.company)}</span>
          <span class="exp-role">${esc(exp.role)}</span>
        </div>
        <div class="exp-right">
          <span class="exp-period">${esc(exp.period)}</span>
          ${exp.location ? `<span class="exp-location">${esc(exp.location)}</span>` : ''}
        </div>
      </div>
      ${
        regularBullets.length
          ? `<ul class="bullets">${regularBullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`
          : ''
      }
      ${techLine ? `<div class="exp-technologies">${esc(techLine)}</div>` : ''}
    </div>`;
    })
    .join('');
}

function buildSkillsHtml(skills) {
  if (!skills || !Object.keys(skills).length) return '';
  return Object.entries(skills)
    .map(
      ([cat, list]) =>
        `<div class="skill-row"><span class="skill-cat">${esc(cat)}:</span> <span class="skill-list">${esc(list.join(', '))}</span></div>`
    )
    .join('');
}

function buildEducationHtml(education) {
  if (!education?.length) return '';
  return education
    .map(
      (edu) => `
    <div class="edu-entry">
      <div class="edu-header">
        <span class="edu-school">${esc(edu.school)}</span>
        <span class="edu-period">${esc(edu.period)}</span>
      </div>
      <span class="edu-degree">${esc(edu.degree)}</span>
      ${edu.location ? `<span class="edu-location">${esc(edu.location)}</span>` : ''}
    </div>`
    )
    .join('');
}

function section(title, content) {
  if (!content) return '';
  return `
  <div class="section">
    <div class="section-title">${esc(title)}</div>
    ${content}
  </div>`;
}

function buildHtml(data, template) {
  const { personal, summary, experience, skills, education, certifications, languages } = data;
  const colors = template.pdf.colors;
  const typography = template.pdf.typography;
  const labels = {
    summary: 'Summary',
    experience: 'Experience',
    skills: 'Skills',
    education: 'Education',
    certifications: 'Certifications',
    languages: 'Languages',
    technologies: 'Technologies:',
    ...(data.meta?.labels || {}),
  };

  const certsHtml = certifications?.length
    ? `<ul class="list-items">${certifications.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>`
    : '';

  const langsHtml = languages?.length
    ? `<ul class="list-items">${languages.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${esc(personal.name)} — CV</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: ${typography.bodyFont};
      font-size: ${typography.bodySize};
      color: ${colors.pageText};
      background: white;
      line-height: 1.4;
    }

    /* ── HEADER ── */
    .header { margin-bottom: 14px; }

    .name {
      font-size: 24pt;
      font-weight: 700;
      color: ${colors.name};
      letter-spacing: -0.3px;
      line-height: 1.1;
    }

    .title {
      font-size: 11.5pt;
      color: ${colors.muted};
      font-weight: 400;
      margin-top: 3px;
    }

    .accent-line {
      height: 2px;
      background: ${colors.accent};
      margin: 10px 0 8px;
      border-radius: 1px;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px 28px;
      margin-top: 9px;
    }
    .contact-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 8.5pt;
      color: ${colors.link};
    }
    .contact-item svg {
      flex-shrink: 0;
      color: ${colors.accent};
    }
    .contact-item a {
      color: ${colors.link};
      text-decoration: none;
    }

    /* ── SECTIONS ── */
    .section { margin-top: 10px; }

    .section-title {
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      color: ${colors.name};
      border-bottom: 1.5px solid ${colors.accent};
      padding-bottom: 3px;
      margin-bottom: 8px;
    }

    /* ── SUMMARY ── */
    .summary-text {
      font-size: 9.5pt;
      color: ${colors.body};
      line-height: 1.55;
    }

    /* ── EXPERIENCE ── */
    .exp-entry { margin-bottom: 9px; }
    .exp-entry:last-child { margin-bottom: 0; }

    .exp-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .exp-left { flex: 1; min-width: 0; }
    .exp-right { text-align: right; flex-shrink: 0; margin-left: 10px; }

    .exp-company {
      display: block;
      font-weight: 700;
      font-size: 10pt;
      color: ${colors.name};
    }
    .exp-role {
      display: block;
      font-size: 9.5pt;
      font-style: italic;
      color: ${colors.body};
    }
    .exp-stack {
      display: block;
      font-size: 8pt;
      color: ${colors.muted};
      margin-top: 1px;
    }
    .exp-period {
      display: block;
      font-size: 9pt;
      font-weight: 600;
      color: ${colors.link};
      white-space: nowrap;
    }
    .exp-location {
      display: block;
      font-size: 8.5pt;
      color: ${colors.soft};
    }

    .bullets {
      margin: 5px 0 0 15px;
      padding: 0;
    }
    .bullets li {
      font-size: 9pt;
      color: ${colors.body};
      margin-bottom: 2.5px;
      line-height: 1.45;
    }
    .exp-technologies {
      margin-top: 4px;
      font-size: 8.9pt;
      font-weight: 700;
      color: ${colors.body};
      line-height: 1.4;
    }

    /* ── SKILLS ── */
    .skill-row {
      font-size: 9pt;
      margin-bottom: 3.5px;
      line-height: 1.45;
    }
    .skill-cat { font-weight: 700; color: ${colors.name}; }
    .skill-list { color: ${colors.body}; }

    /* ── EDUCATION ── */
    .edu-entry { margin-bottom: 8px; }
    .edu-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .edu-school { font-weight: 700; font-size: 9.5pt; color: ${colors.name}; }
    .edu-period { font-size: 9pt; color: ${colors.muted}; }
    .edu-degree {
      display: block;
      font-size: 9pt;
      font-style: italic;
      color: ${colors.link};
    }
    .edu-location {
      display: block;
      font-size: 8.5pt;
      color: ${colors.soft};
    }

    /* ── CERTS / LANGUAGES ── */
    .list-items {
      list-style: disc;
      margin-left: 15px;
      padding: 0;
    }
    .list-items li {
      font-size: 9pt;
      color: ${colors.body};
      margin-bottom: 3px;
    }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="name">${esc(personal.name)}</div>
    <div class="title">${esc(personal.title)}</div>
    <div class="accent-line"></div>
    ${buildContactHtml(personal)}
  </div>

  ${section(labels.summary, summary ? `<div class="summary-text">${esc(summary)}</div>` : '')}
  ${section(labels.experience, buildExperienceHtml(experience, labels.technologies))}
  ${section(labels.skills, buildSkillsHtml(skills))}
  ${section(labels.education, buildEducationHtml(education))}
  ${section(labels.certifications, certsHtml)}
  ${section(labels.languages, langsHtml)}

</body>
</html>`;
}
