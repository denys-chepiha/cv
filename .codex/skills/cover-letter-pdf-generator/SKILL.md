---
name: cover-letter-pdf-generator
description: Generate application cover letters as PDF files only. Use when creating or regenerating cover letters for a job application, especially when the main letter must be in English, a separate Russian review version is required, and Markdown letter files should not be used as final outputs.
---

# Cover Letter PDF Generator

## Overview

Use this skill when the user wants a cover letter package generated in PDF format only.

## Workflow

1. Read the target job description and current application package.
2. Draft the main cover letter in English.
3. Create a separate Russian review version with the same meaning.
4. Store cover letter content in structured package data, not in standalone Markdown letter files.
5. Generate final cover letters as PDF files only.

## Project-Native Path

Prefer the local generator:

- `node scripts/generate-cover-letter-pdfs.js "<CompanyName>"`
- or `node scripts/generate.js "<CompanyName>"` when the package should regenerate both CV and cover letters together

## Layout Rules

- Cover letter PDFs must render candidate contact details in a structured grid, not as one long inline row.
- Use compact labeled cells such as `Location`, `Email`, `Phone`, `LinkedIn`, `GitHub`, and `Website`, with a small matching icon for each contact service.
- Prefer a 3-column grid on A4 PDF output when there are 5-6 contact fields; allow natural wrapping inside cells for long URLs.
- Keep the candidate name and target title above the contact grid, separated by the template accent line.
- This layout rule applies to future cover letter PDF generations by default.

## Guardrails

- Never use the em dash character (U+2014) in cover letter content.
- The final deliverables for cover letters must be PDF files only.
- The English letter is the submission version.
- The Russian letter is for meaning review and should also be generated as PDF.
- Do not invent experience, regulated-domain background, or tools that the candidate cannot defend.
