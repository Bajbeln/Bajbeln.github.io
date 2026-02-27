---
# ============================================================
# SONG FILE — one file per song
#
# FILE NAMING CONVENTION:
#   If title starts with [ABB N]:  {abbrev}-{NN}-{slug}.md
#     e.g. hil-07-din-mamma.md, kra-01-oppningskuplett.md
#   If title starts with a number: {NN}-{slug}.md
#     e.g. 01-oppningskuplett.md
#
# Swedish chars in slugs: ä→a, å→a, ö→o, é→e, ü→u
# ============================================================

# Title — two formats:
#   "[ABB N] Song Title"   ← abbreviation-first (most spex)
#   "N. Song Title"         ← number-first (some older spex)
title: "1. Exempelsången"

# Who sings — optional, shown below the title
singer: "Namn sjunger"

# Melody — optional, shown below singer
melody: "Låttitel – Artist"

# Must match the spex: (or uppsattning id) in index.md
spex: spexnamnet

# Sort order within the production (integer, 1-based)
order: 1

# Always false — songs are not standalone pages
permalink: false
---
Här börjar sångtexten.
Varje rad med enkel radbrytning håller ihop som en strof.

En blank rad skapar ett strofskifte.

**Talare**
Talarens repliker börjar med **Namn** på egen rad (inget kolon).
Sedan följer texten direkt.

**Annan**
Och nästa talare på samma vis.

_(Scenanvisning inom kursiv parentes)_

Bakgrundssångare och parenteser skrivs som vanlig text (så här).
