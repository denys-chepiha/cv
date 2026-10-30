#!/usr/bin/env bash
set -euo pipefail

input="${1:-}"
output="${2:-}"

if [[ -z "${input}" ]]; then
  echo "Usage: render_markdown_pdf.sh <input.md> [output.pdf]" >&2
  exit 1
fi

if [[ ! -f "${input}" ]]; then
  echo "Input file not found: ${input}" >&2
  exit 1
fi

if [[ -z "${output}" ]]; then
  output="${input%.*}.pdf"
fi

if [[ "${output}" != *.pdf ]]; then
  output="${output}.pdf"
fi

if ! command -v pandoc >/dev/null 2>&1; then
  echo "Missing required command: pandoc" >&2
  echo "Install pandoc and one of: weasyprint, wkhtmltopdf, tectonic, xelatex, or pdflatex." >&2
  exit 1
fi

engine="${PDF_ENGINE:-}"

if [[ -z "${engine}" ]]; then
  for candidate in weasyprint wkhtmltopdf tectonic xelatex pdflatex; do
    if command -v "${candidate}" >/dev/null 2>&1; then
      engine="${candidate}"
      break
    fi
  done
fi

if [[ -z "${engine}" ]]; then
  echo "No supported PDF engine found for pandoc." >&2
  echo "Set PDF_ENGINE or install one of: weasyprint, wkhtmltopdf, tectonic, xelatex, pdflatex." >&2
  exit 1
fi

pandoc "${input}" \
  --from gfm \
  --pdf-engine "${engine}" \
  -V geometry:margin=0.55in \
  -o "${output}"

echo "Created ${output} using pandoc + ${engine}"
