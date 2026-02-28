---
# ============================================================
# SONG FILE for a multi-production spex
# Lives at:  src/spex/{name}/{year}/{filename}.md
#
# FILE NAMING CONVENTION:
#   If title starts with [ABB N]:  {abbrev}-{NN}-{slug}.md    e.g. kri-01-allting-kan-ga-itu.md
#   If title starts with a number: {NN}-{slug}.md   e.g. 01-oppningskuplett.md
#
# Swedish chars in slugs: ä→a, å→a, ö→o, é→e, ü→u
# ============================================================

# Title — two formats:
#   "[ABB N] Song Title"   ← abbreviation-first (most spex)
#   "N. Song Title"         ← number-first (some older spex)
title: "1. Exempelsång"

singer: "Namn sjunger" # Who sings — optional, shown below the title
melody: "Låttitel – Artist" # Melody — optional, shown below singer
spex: spextitel-2024 # Must match this production's spex: field in its index.md
order: 1 # Sort order within this production (integer, 1-based)
permalink: false # Always false — songs are not standalone pages
---
Här börjar sångtexten.
Varje rad med enkel radbrytning håller ihop som en strof.

En blank rad skapar ett strofskifte.

**Talare**
Talarens repliker börjar med **Namn** på egen rad (inget kolon).
Sedan följer texten direkt.

— Replikväxling med tankstreck (aldrig bindestreck).

_(Scenanvisning inom kursiv parentes)_

Bakgrundssångare och parenteser skrivs som vanlig text (så här).
