---
name: ats-optimization
description: Optimize resumes for Applicant Tracking Systems. Use when tailoring a resume to a job description, improving keyword alignment, standardizing section labels, or flagging formatting choices that can break ATS parsing.
---

# ATS Optimization

## Overview

Use this skill to improve ATS match quality without inventing experience or stuffing keywords.

## Workflow

1. Read the current resume and the target job description.
2. Extract the role title, seniority, required skills, preferred skills, certifications, tools, and domain language.
3. Check alignment across the headline, summary, skills, experience, education, and certifications.
4. Rewrite section labels and bullets with ATS-friendly language such as `Professional Experience`, `Skills`, `Education`, and `Certifications`.
5. Flag parsing risks such as tables, text boxes, multi-column layouts, icon-only labels, and keyword dumps.
6. Return prioritized edits instead of broad advice.

## Output Format

- `Match summary`: target role, strengths, and biggest gaps
- `Keyword coverage`: present, missing, and weakly signaled terms
- `Rewritten content`: updated summary, skills section, and resume bullets
- `ATS risks`: formatting or wording issues that still need attention

## Guardrails

- Do not invent tools, achievements, or certifications.
- Do not repeat keywords unnaturally.
- Prefer recognizable job titles when the original title is internal or unclear.
- If the user provides only the resume or only the job description, do a partial pass and list the missing input.
- Never use the em dash character (—). Use a regular hyphen (-) instead.
