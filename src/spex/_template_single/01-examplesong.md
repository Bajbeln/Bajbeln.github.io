---
# ============================================================
# SONG FILE — one file per song
#
# FILE NAMING CONVENTION:
#   If title starts with [ABB N]:  {abbrev}-{NN}-{slug}.md    e.g. hil-07-din-mamma.md, kra-01-oppningskuplett.md
#   If title starts with a number: {NN}-{slug}.md   e.g. 01-oppningskuplett.md
#
# Swedish chars in slugs: ä→a, å→a, ö→o, é→e, ü→u
# ============================================================

# Title — two formats:
#   "N. Song Title"        ← number-first (newer spex)
#   "[ABB N] Song Title"   ← abbreviation-first (most spex)
title: "1. Exempelsång"

# Who sings — optional, shown below the title
singer: "Namn sjunger"
melody: "Låttitel – Artist" # Melody — optional, shown below singer
spex: spextitel # Must match the spex: (or uppsattning id) in index.md
order: 1 # Sort order within the production (integer, 1-based)
permalink: false # Always false — songs are not standalone pages
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
