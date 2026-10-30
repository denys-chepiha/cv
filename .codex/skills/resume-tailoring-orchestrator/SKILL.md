---
name: resume-tailoring-orchestrator
description: Coordinate end-to-end resume tailoring using multiple resume skills. Use when the task spans job description analysis, ATS alignment, professional summary drafting, STAR rewrites, metric enhancement, template mapping, and final export planning.
---

# Resume Tailoring Orchestrator

## Overview

Use this skill when the user wants one coordinated resume workflow instead of isolated edits.

Before any resume generation or rewrite, read:
- the selected candidate profile provided locally by the user
- `docs/workflows/document-package.md`

Use those files as the source of truth for the candidate's verified facts and positioning and generation rules before applying vacancy-specific tailoring.

This orchestrator combines:

- `$job-description-analyzer`
- `$ats-optimization`
- `$cover-letter-writer`
- `$cover-letter-pdf-generator`
- `$professional-summary-generator`
- `$star-method-editor`
- `$impact-metric-enhancer`
- `$resume-template-mapper`
- `$markdown-to-pdf-generator`

## When To Use

Use this skill when the user asks to:

- tailor a resume to a job description end to end
- rewrite multiple resume sections in one pass
- improve both ATS fit and narrative strength
- adapt content to a target template and prepare final export

Do not use this skill for a narrow single-step request when one underlying skill is sufficient.

## Pipeline

1. Inventory the available inputs.
2. Decide which downstream skills are relevant.
3. Run the minimum necessary sequence.
4. Return one merged result with clear next edits.

### Step 1: Input Inventory

Classify the provided material:

- current resume or source experience notes
- target job description
- target template or formatting constraints
- export requirement such as Markdown or PDF

If one input is missing, do a partial pass instead of stopping. Explicitly label the missing artifact and limit the output to what can be defended.

### Step 2: Job Target Extraction

If a job description is present, start with `$job-description-analyzer`.

Extract:

- title, seniority, and domain
- must-have requirements
- preferred requirements
- high-value keywords and phrases
- hidden evaluation signals such as ownership, leadership, scale, or compliance

Use this result as the source of truth for all later tailoring.

### Step 3: ATS Alignment

If a resume is present, run `$ats-optimization` using the role signals from Step 2.

Focus on:

- keyword coverage
- section naming
- skills alignment
- title normalization
- formatting risks that could break parsing

Prefer exact job-description language where it improves match quality without sounding copied.

### Step 4: Positioning Summary

Run `$professional-summary-generator` once the role target is clear.

Produce:

- 2 or 3 summary variants
- one recommended summary for the target role
- an optional headline when useful

The final summary should match the JD priorities and the strongest validated evidence from the resume.

### Step 5: Experience Rewrites

For each weak or important experience bullet:

- use `$star-method-editor` when the problem is narrative clarity
- use `$impact-metric-enhancer` when the problem is missing or weak impact

In practice:

- start with STAR when the bullet is vague, confusing, or task-heavy
- start with metrics when the action is clear but the result is weak
- if needed, use both in sequence and keep only the strongest final bullet

### Step 6: Template Fit

If the user supplied a target structure or needs a different resume layout, run `$resume-template-mapper`.

Map:

- summary
- skills
- experience
- education
- certifications
- projects or selected achievements

Preserve proof and chronology. Cut repetition before cutting evidence.

### Step 7: Export Planning

If the resume is in Markdown or the user asks for a final PDF, route the final artifact through `$markdown-to-pdf-generator`.

If the user also needs a cover letter:

- draft the tailored English letter through `$cover-letter-writer`
- create the Russian meaning-check version if project rules require it
- generate final PDF-only letters through `$cover-letter-pdf-generator`

If PDF generation cannot be completed in the environment, provide:

- the expected render command
- the missing dependency
- layout checks that should be verified after export

## Decision Rules

- If the user provides only a JD: run Steps 2 and 4, then suggest resume changes as targeted guidance.
- If the user provides only a resume: run Steps 3, 5, and optionally 6.
- If the user provides rough experience notes instead of a finished resume: prioritize Steps 4 and 5 before ATS tuning.
- If the user asks for a finished resume pack: run the full pipeline and prepare final export instructions.

## Output Contract

Return a single integrated response with these sections when relevant:

- `Target role`: what the resume is being optimized for
- `Priority gaps`: the biggest alignment problems
- `Summary`: the recommended professional summary
- `Rewritten bullets`: strongest updated experience bullets
- `Skills and keywords`: additions, removals, and wording changes
- `Template and export`: structural mapping and PDF/render notes
- `Next validations`: specific facts or metrics the user should confirm

## Guardrails

- Do not invent experience, tools, tenure, or exact metrics.
- Keep assumptions explicit and minimal.
- Avoid returning seven disconnected mini-reports. Merge outputs into one coherent package.
- Optimize for the hiring target, not for generic resume advice.
- Maintain one clear candidate image per vacancy: Senior Frontend Engineer or Full-Stack Engineer unless the user or vacancy clearly requires another target.
- Keep AI positioning secondary for standard roles and use founder positioning carefully for full-time applications.
- Never use the em dash character (U+2014). Use a regular hyphen (-) instead.
