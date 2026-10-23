---
# ============================================================
# MAIN PAGE for a spex (single or multi-production)
# Lives at:  src/spex/{name}/index.md
# Renders:   all productions on one page, each under its own heading
#
# Do NOT add a spex: field here — songs are looked up via uppsattning ids.
# REQUIRED: Organize all song files in year subfolders (e.g., 2024/, 2019/)
# DO NOT create subfolder index.md files — they are not used and should not exist.
# ============================================================
layout: spex
title: Spextitel (ABB) # Shown as the page heading. Omit year for multi, include for single.
# Colors live in {name}.json in this folder — create that file with color/accentColor/accentBorderColor
# All production subpages inherit colors from that file automatically.
permalink: /spex-name-multi/ # URL for the hub page — short and URL-safe, unique

# List of productions in display order (newest first recommended).
# Each id must match the spex: field in that production's song files.
# REQUIRED: Songs must be in year subfolders (e.g., src/spex/spextitel/2024/song.md)
# with spex: spextitel-2024. DO NOT create subfolder index.md files.
uppsattning:
  - id: spextitel-2024
    label: 'Spextitel 2024 (ABB)'
  - id: spextitel-2019
    label: 'Spextitel 2019 (ABB)'
---
