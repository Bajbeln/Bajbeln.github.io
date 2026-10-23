---
# ============================================================
# SPEX INDEX PAGE — one file per spex, lives in src/spex/{name}/
# For a single production, use uppsattning with one item.
# REQUIRED: Organize all song files in year subfolders (e.g., 2025/)
# DO NOT create subfolder index.md files — they are not used.
# ============================================================
layout: spex
title: Spextitel År (ABB) # Shown as the page heading. Include year and abbreviation.
# Colors live in {name}.json in this folder — create that file with color/accentColor/accentBorderColor
permalink: /spex-name/ # URL path for this spex — keep short and URL-safe, unique

# Single production using uppsattning format
# REQUIRED: Songs must be in a year subfolder (e.g., src/spex/spextitel/2025/)
# with spex: spextitel-2025
uppsattning:
  - id: spextitel-2025
    label: 'Spextitel År (ABB)'
---
