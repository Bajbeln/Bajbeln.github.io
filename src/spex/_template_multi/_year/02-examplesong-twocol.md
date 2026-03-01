---
# ============================================================
# TWO-COLUMN SONG FILE for a multi-production spex
# Lives at:  src/spex/{name}/{year}/{filename}.md
#
# Use this layout when two characters sing parallel lines
# simultaneously (side by side on stage).
#
# Uses raw HTML <div class="row"> / <div class="column">.
# Inside the divs, use HTML tags — NOT markdown syntax.
# (<b>Name:</b> not **Name:**, <br> not newlines)
#
# Content outside the divs is regular markdown.
# ============================================================

title: "N. Exempelsång med två kolumner"
singer: "Talare A och Talare B sjunger"
melody: "Låttitel – Artist"
spex: spextitel-2024
order: 2
permalink: false
---
<div class="row">
  <div class="column">
    <b>Talare A:</b><br>
    Rad ett, kolumn vänster<br>
    <br>
    Rad tre, kolumn vänster<br>
    <br>
    Rad fem, kolumn vänster
  </div>
  <div class="column">
    <b>Talare B:</b><br>
    <br>
    Rad två, kolumn höger<br>
    <br>
    Rad fyra, kolumn höger
  </div>
</div>

Här börjar text utanför kolumnerna (vanlig markdown igen).
Båda sjunger nu på vanligt vis.

En blank rad skapar ett strofskifte.

**Talare A:** Inlineformat fungerar utanför kolumnerna.
**Talare B:** Nästa talare på samma rad.
