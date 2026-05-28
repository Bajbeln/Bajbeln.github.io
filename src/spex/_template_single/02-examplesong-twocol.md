---
# ============================================================
# TWO-COLUMN SONG FILE — for songs with simultaneous singing
#
# Use this layout when two characters sing parallel lines
# simultaneously (side by side on stage).
#
# Syntax: ::: cols ... ::: col ... :::
#   - ::: cols   opens the row
#   - ::: col    separates one column from the next (use once per extra column)
#   - :::        closes the row
#
# Full markdown works inside each column (bold, blank-line stanzas, etc.).
# For vertical alignment between columns (extra empty lines), use literal
# <br> tags on their own line — blank lines get collapsed by markdown.
# ============================================================

title: "N. Exempelsång med två kolumner"
singer: "Talare A och Talare B sjunger"
melody: "Låttitel – Artist"
spex: spextitel
order: 2
permalink: false
---
::: cols
**Talare A:**
Rad ett, kolumn vänster

Rad tre, kolumn vänster

Rad fem, kolumn vänster
::: col
**Talare B:**
<br>
Rad två, kolumn höger

Rad fyra, kolumn höger
:::

Här börjar text utanför kolumnerna (vanlig markdown igen).
Båda sjunger nu på vanligt vis.

En blank rad skapar ett strofskifte.

**Talare A:** Inlineformat fungerar utanför kolumnerna.
**Talare B:** Nästa talare på samma rad.
