---
# ============================================================
# HUB PAGE for a multi-production (uppsättning) spex
# Lives at:  src/spex/{name}/index.md
# Renders:   all productions on one page, each under its own heading
#
# Do NOT add a spex: field here — songs are looked up via uppsattning ids.
# ============================================================
layout: spex
title: Spexnamnet (ABB) # Shown as the page heading. Include abbreviation but NOT year (covers all years).
# Colors live in {name}.json in this folder — create that file with color/accentColor/accentBorderColor
# All production subpages inherit colors from that file automatically.
permalink: false # URL for the hub page — short and URL-safe, no year

# List of productions in display order (newest first recommended).
# Each id must match the spex: field in that production's song files
# and in that production's index.md.
uppsattning:
  - id: spextitel-2024
    label: "Spextitel 2024 (ABB)"
  - id: spextitel-2019
    label: "Spextitel 2019 (ABB)"
---
