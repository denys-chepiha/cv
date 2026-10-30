---
name: markdown-to-pdf-generator
description: Convert Markdown resumes or portfolio documents into clean PDF output. Use when a `.md` resume needs a polished PDF, when page layout must be checked, or when a local PDF workflow needs a fallback path.
---

# Markdown to PDF Generator

## Overview

Use this skill to produce clean PDF output from Markdown while preserving readable spacing, page breaks, and recruiter-friendly layout.

## Quick Start

Use `.codex/skills/markdown-to-pdf-generator/scripts/render_markdown_pdf.sh input.md [output.pdf]` when `pandoc` and a supported PDF engine are installed.

## Workflow

1. Look for an existing project-native build script first and prefer it if present.
2. If no project workflow exists, try the local helper script in this skill.
3. If the helper cannot run, fall back to a Markdown to HTML render plus browser print workflow.
4. Verify page size, margins, line wrapping, heading spacing, link rendering, and page count.
5. Check that the output does not introduce orphan headings, clipped bullets, or overflow across pages.

## Output Format

- `Render path`: which toolchain was used
- `Output file`: the produced PDF path
- `Layout notes`: any spacing, overflow, or page-break issues
- `Next fix`: the smallest change needed if the PDF still looks off

## Guardrails

- Do not silently return HTML when the user asked for PDF.
- If the toolchain is missing, say exactly which command is unavailable.
- Prefer simple typography and margins over dense layouts that break in print.
- Never use the em dash character (—). Use a regular hyphen (-) instead.

## Fallback Notes

When using browser print as a fallback, prefer a single-column layout, explicit page margins, and print CSS that avoids breaking bullets or section headings across pages.
