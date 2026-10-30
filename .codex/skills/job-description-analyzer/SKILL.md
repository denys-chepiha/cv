---
name: job-description-analyzer
description: Analyze job descriptions for role expectations, keywords, and hiring signals. Use when extracting must-have requirements, tailoring a resume, preparing interview positioning, or ranking the strongest match signals in a JD.
---

# Job Description Analyzer

## Overview

Use this skill to turn a job description into a structured view of what the employer is actually screening for.

## Workflow

1. Extract role title, seniority, function, industry, and location constraints.
2. Separate `must-have` requirements from `nice-to-have` signals.
3. Pull out technical skills, tools, certifications, business context, and domain terminology.
4. Identify hidden evaluation signals such as ownership, communication, leadership, scale, compliance, or stakeholder management.
5. Rank the highest-value keywords and talking points for resume tailoring or interview prep.

## Output Format

- `Role snapshot`: title, team context, and likely expectations
- `Requirements matrix`: must-have, preferred, and ambiguous items
- `Keyword bank`: exact role language worth mirroring
- `Tailoring notes`: what the candidate should emphasize or de-emphasize
- `Risk flags`: likely gaps or mismatches

## Guardrails

- Do not treat every listed tool as equally important.
- Distinguish explicit requirements from inferred signals.
- Highlight contradictions, inflated wish lists, or unrealistic combinations when they appear.
- Never use the em dash character (—). Use a regular hyphen (-) instead.
