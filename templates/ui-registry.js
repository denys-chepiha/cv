export const DEFAULT_TEMPLATE = 'modern-clean';

export const UI_TEMPLATES = {
  'modern-clean': {
    id: 'modern-clean',
    name: 'Modern Clean',
    description:
      'Single-column ATS-friendly resume with compact spacing, blue section accents, and dense but readable experience blocks.',
    docx: {
      font: 'Calibri',
      colors: {
        name: '0F172A',
        body: '334155',
        muted: '64748B',
        accent: '2563EB',
        divider: 'CBD5E1',
      },
      layout: {
        rightTabInches: 6.4,
        margin: {
          top: 0.65,
          right: 0.75,
          bottom: 0.65,
          left: 0.75,
        },
      },
    },
    pdf: {
      page: {
        format: 'A4',
        margin: {
          top: '16mm',
          right: '18mm',
          bottom: '16mm',
          left: '18mm',
        },
      },
      typography: {
        bodyFont:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
        bodySize: '10pt',
      },
      colors: {
        pageText: '#1e293b',
        name: '#0f172a',
        body: '#334155',
        muted: '#64748b',
        accent: '#2563eb',
        soft: '#94a3b8',
        link: '#475569',
      },
    },
  },
};

export function resolveTemplate(templateId = DEFAULT_TEMPLATE) {
  return UI_TEMPLATES[templateId] || UI_TEMPLATES[DEFAULT_TEMPLATE];
}

export function assertTemplate(templateId = DEFAULT_TEMPLATE) {
  const template = UI_TEMPLATES[templateId];
  if (!template) {
    const available = Object.keys(UI_TEMPLATES).join(', ');
    throw new Error(`Unknown template "${templateId}". Available templates: ${available}`);
  }
  return template;
}
