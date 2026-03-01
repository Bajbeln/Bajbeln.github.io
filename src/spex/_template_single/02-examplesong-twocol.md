---
# ============================================================
# TWO-COLUMN SONG FILE — for songs with simultaneous singing
#
# Use this layout when two characters sing parallel lines
# simultaneously (side by side on stage).
#
# Uses the {% cols %} shortcode — markdown works normally inside
# (bold, italic, stanza breaks, etc.). No <b> or <br> needed.
#
# Separate the two columns with:   <!-- col -->
#
# Use <!-- br:N --> to push a line down N rows for vertical
# alignment between columns. Surrounding blank lines are
# consumed automatically.
# ============================================================

title: "N. Exempelsång med två kolumner"
singer: "Talare A och Talare B sjunger"
melody: "Låttitel – Artist"
spex: spextitel
order: 2
permalink: false
---
{% cols %}
**Talare A:**
Rad ett, kolumn vänster

Rad tre, kolumn vänster

Rad fem, kolumn vänster
<!-- col -->
**Talare B:**
<!-- br:1 -->
Rad två, kolumn höger
<!-- br:1 -->
Rad fyra, kolumn höger
{% endcols %}

Här börjar text utanför kolumnerna (vanlig markdown igen).
Båda sjunger nu på vanligt vis.

En blank rad skapar ett strofskifte.

**Talare A:** Inlineformat fungerar utanför kolumnerna.
**Talare B:** Nästa talare på samma rad.
