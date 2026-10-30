// Core
import {
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
  Document,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun,
} from 'docx';
import { writeFileSync } from 'fs';
import { resolveTemplate } from '../templates/ui-registry.js';

// ─── helpers ─────────────────────────────────────────────────────────────────

function run(text, template, opts = {}) {
  return new TextRun({ text, font: template.docx.font, ...opts });
}

function sectionHeader(title, template) {
  return new Paragraph({
    children: [
      run(title.toUpperCase(), template, {
        bold: true,
        size: 20,
        color: template.docx.colors.name,
      }),
    ],
    spacing: { before: 200, after: 60 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 8, color: template.docx.colors.accent, space: 2 },
    },
  });
}

function tabLine(leftRuns, rightRuns, template, opts = {}) {
  return new Paragraph({
    tabStops: [
      {
        type: TabStopType.RIGHT,
        position: convertInchesToTwip(template.docx.layout.rightTabInches),
      },
    ],
    children: [
      ...leftRuns,
      run('\t', template),
      ...rightRuns,
    ],
    ...opts,
  });
}

function bullet(text, template, opts = {}) {
  return new Paragraph({
    bullet: { level: 0 },
    children: [run(text, template, { size: 20, color: template.docx.colors.body, ...opts })],
    spacing: { before: 20, after: 20 },
  });
}

function technologiesLine(text, template) {
  return new Paragraph({
    children: [run(text, template, { bold: true, size: 20, color: template.docx.colors.body })],
    spacing: { before: 40, after: 20 },
  });
}

// ─── sections ────────────────────────────────────────────────────────────────

function buildHeader(personal, template) {
  const contactParts = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.github,
    personal.website,
    personal.telegram ? `t.me/${personal.telegram}` : null,
    personal.whatsapp ? `wa: ${personal.whatsapp}` : null,
  ].filter(Boolean);

  const contactRuns = contactParts.flatMap((part, i) => {
    const items = [run(part, template, { size: 18, color: template.docx.colors.body })];
    if (i < contactParts.length - 1) {
      items.push(run('  ·  ', template, { size: 18, color: template.docx.colors.muted }));
    }
    return items;
  });

  return [
    // Name
    new Paragraph({
      children: [run(personal.name, template, { bold: true, size: 52, color: template.docx.colors.name })],
      spacing: { before: 0, after: 40 },
    }),
    // Title
    new Paragraph({
      children: [run(personal.title, template, { size: 26, color: template.docx.colors.muted })],
      spacing: { before: 0, after: 80 },
    }),
    // Divider
    new Paragraph({
      children: [run('', template)],
      spacing: { before: 0, after: 0 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 6, color: template.docx.colors.accent, space: 1 },
      },
    }),
    // Contact
    new Paragraph({
      children: contactRuns,
      spacing: { before: 80, after: 0 },
    }),
  ];
}

function buildSummary(summary, template, label = 'Summary') {
  if (!summary) return [];
  return [
    sectionHeader(label, template),
    new Paragraph({
      children: [run(summary, template, { size: 21, color: template.docx.colors.body })],
      spacing: { before: 80, after: 0 },
    }),
  ];
}

function buildExperience(experience, template, label = 'Experience', techPrefix = 'Technologies:') {
  if (!experience?.length) return [];

  const paragraphs = [sectionHeader(label, template)];

  experience.forEach((exp) => {
    // Company + Period
    paragraphs.push(
      tabLine(
        [run(exp.company, template, { bold: true, size: 22, color: template.docx.colors.name })],
        [run(exp.period, template, { size: 20, color: template.docx.colors.muted })],
        template,
        { spacing: { before: 160, after: 0 } }
      )
    );

    // Role + Location
    paragraphs.push(
      tabLine(
        [run(exp.role, template, { size: 21, italics: true, color: template.docx.colors.body })],
        [run(exp.location, template, { size: 19, color: template.docx.colors.muted })],
        template,
        { spacing: { before: 0, after: 0 } }
      )
    );

    const techLine = exp.bullets?.find((b) => String(b).startsWith(techPrefix));
    const regularBullets = exp.bullets?.filter((b) => !String(b).startsWith(techPrefix)) || [];

    regularBullets.forEach((b) => paragraphs.push(bullet(b, template)));
    if (techLine) paragraphs.push(technologiesLine(techLine, template));
  });

  return paragraphs;
}

function buildSkills(skills, template, label = 'Skills') {
  if (!skills || !Object.keys(skills).length) return [];

  return [
    sectionHeader(label, template),
    ...Object.entries(skills).map(
      ([category, list]) =>
        new Paragraph({
          children: [
            run(`${category}: `, template, { bold: true, size: 20, color: template.docx.colors.name }),
            run(list.join(', '), template, { size: 20, color: template.docx.colors.body }),
          ],
          spacing: { before: 60, after: 0 },
        })
    ),
  ];
}

function buildEducation(education, template, label = 'Education') {
  if (!education?.length) return [];

  const paragraphs = [sectionHeader(label, template)];

  education.forEach((edu) => {
    paragraphs.push(
      tabLine(
        [run(edu.school, template, { bold: true, size: 21, color: template.docx.colors.name })],
        [run(edu.period, template, { size: 19, color: template.docx.colors.muted })],
        template,
        { spacing: { before: 120, after: 0 } }
      )
    );
    paragraphs.push(
      new Paragraph({
        children: [run(edu.degree, template, { size: 20, italics: true, color: template.docx.colors.body })],
        spacing: { before: 0, after: 0 },
      })
    );
    if (edu.location) {
      paragraphs.push(
        new Paragraph({
          children: [run(edu.location, template, { size: 19, color: template.docx.colors.muted })],
          spacing: { before: 0, after: 0 },
        })
      );
    }
  });

  return paragraphs;
}

function buildCertifications(certifications, template, label = 'Certifications') {
  if (!certifications?.length) return [];
  return [
    sectionHeader(label, template),
    ...certifications.map((c) => bullet(c, template)),
  ];
}

function buildLanguages(languages, template, label = 'Languages') {
  if (!languages?.length) return [];
  return [
    sectionHeader(label, template),
    ...languages.map((l) => bullet(l, template)),
  ];
}

// ─── main ─────────────────────────────────────────────────────────────────────

export async function generateDocx(data, outputPath) {
  const template = resolveTemplate(data.meta?.template);
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
  const children = [
    ...buildHeader(data.personal, template),
    ...buildSummary(data.summary, template, labels.summary),
    ...buildExperience(data.experience, template, labels.experience, labels.technologies),
    ...buildSkills(data.skills, template, labels.skills),
    ...buildEducation(data.education, template, labels.education),
    ...buildCertifications(data.certifications, template, labels.certifications),
    ...buildLanguages(data.languages, template, labels.languages),
  ];

  const doc = new Document({
    creator: data.personal.name,
    title: `${data.personal.name} — ${data.personal.title}`,
    description: `CV — ${data.meta?.company || 'Job Application'} — ${data.meta?.date || ''}`,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(template.docx.layout.margin.top),
              right: convertInchesToTwip(template.docx.layout.margin.right),
              bottom: convertInchesToTwip(template.docx.layout.margin.bottom),
              left: convertInchesToTwip(template.docx.layout.margin.left),
            },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  writeFileSync(outputPath, buffer);
}
