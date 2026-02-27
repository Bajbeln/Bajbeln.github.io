# Bajbeln – Developer Manual

Krischanstaspääxets Sajber-Bajbel is a static site that serves as a searchable archive of spex lyrics. This manual covers the Eleventy-based build system used to generate it.

---

## Tech stack

| Thing | Detail |
|---|---|
| Static site generator | [Eleventy](https://www.11ty.dev/) 3.x |
| Templating | Nunjucks (`.njk`) |
| Markdown renderer | markdown-it 14 (`html: true`, `breaks: true`) |
| Hosting | GitHub Pages, deployed from the `_site/` output |
| Build trigger | Currently manual (`workflow_dispatch`) |

---

## Repo structure

```
/
├── src/                        # Eleventy input directory
│   ├── _layouts/
│   │   └── spex.njk            # Layout for all spex pages
│   ├── spex/
│   │   ├── <spex-name>/
│   │   │   ├── index.md        # Spex page (frontmatter only, no body)
│   │   │   ├── 01-song-name.md
│   │   │   ├── 02-song-name.md
│   │   │   └── ...
│   │   └── ...
│   └── favoriter/
│       └── index.md            # Favoriter page
├── spex/                       # Legacy plain-HTML spex files (passthrough, untouched)
├── scripts/                    # JS for the browser (pagescript, searchscript, etc.)
├── assets/                     # Images and other static assets
├── partials/                   # HTML partials fetched at runtime (footer, etc.)
├── style.css
├── index.html                  # Site front page (passthrough)
├── songIndex.json              # Used by the search/random feature
├── eleventy.config.js          # Eleventy config: shortcodes, filters, passthrough
├── package.json
└── .github/workflows/
    └── deploy_try.yml          # GitHub Actions deploy workflow
```

**Output:** Eleventy writes everything to `_site/`. All files under `spex/`, `scripts/`, `assets/`, `partials/`, `style.css`, `index.html`, `manifest.json`, and `songIndex.json` are passthrough-copied so old URLs continue to work.

---

## Local development

```
npm install        # First time only
npm run start      # Build + serve with live reload at localhost:8080
npm run build      # One-off build into _site/
```

---

## Adding a new spex

### 1. Create the directory

```
src/spex/<spex-name>/
```

Use a lowercase, hyphenated name with Swedish characters replaced: å→a, ä→a, ö→o. This name is also the `spex` identifier used in frontmatter.

### 2. Create `index.md`

```yaml
---
layout: spex
title: Spextitel År (XXX)
color: "rgb(R, G, B)"
permalink: /spex-name/
spex: spex-name
---
```

The body of `index.md` is intentionally left empty. The layout fetches and renders all songs automatically.

Optional theming fields (see [Theming](#theming)):

```yaml
accentColor: "rgb(R, G, B)"
accentBorderColor: "rgb(R, G, B)"
```

### 3. Create one `.md` file per song

Name files `NN-slugified-title.md` where `NN` is a zero-padded sequence number matching the `order` field.

```yaml
---
title: "[XXX N] Sångtitel"
singer: "Sjungs av Rollfigur"   # optional
melody: "Låttitel, Artist"
spex: spex-name                  # must match the spex identifier in index.md
order: 1                         # determines sort order on the page
permalink: false                 # always false for individual song files
---
Lyricstext här
```

- `title` — shown on the collapsible button and used to derive the anchor ID (see [Song IDs](#song-ids))
- `singer` — displayed in italics below the button if present
- `melody` — displayed as "Mel. …" in italics if present
- `order` — integer, determines the display order; must be unique within a spex
- `permalink: false` — prevents Eleventy from writing the song file as its own HTML page

---

## Lyric formatting

markdown-it is configured with `breaks: true`, which means **every line break in the source becomes a `<br>` in the output**. A blank line creates a new paragraph (stanza break).

### Line breaks within a stanza

Just press Enter. No special syntax needed.

```
Första raden
Andra raden
Tredje raden
```

### Stanza breaks

Leave a blank line between stanzas.

```
Slutet på första strofen
Sista raden

Början på andra strofen
```

### Speaker labels

Use markdown bold. The label can be inline on the same line as the first lyric:

```
**Gorm:** Vi spanar här i skogen tills
tiden den är mogen
```

Or on its own line above the lyrics (the `<br>` from the line break separates it visually):

```
**Trine, Ditte & Bente:**
Vi ska planera
Inkomst dubblera
```

### Stage directions

Use markdown italic:

```
_(Alla kliver in på scenen)_
```

### Raw HTML in lyrics

markdown-it is configured with `html: true`, so raw HTML is allowed when needed (e.g. a two-column layout):

```html
<div class="row">
  <div class="column">

**Karaktär A**
Sjunger sin vers

  </div>
  <div class="column">

**Karaktär B**
Sjunger sin vers

  </div>
</div>
```

---

## Song IDs

Each song gets an HTML `id` attribute derived from its `title` by the `slugify()` function in `eleventy.config.js`:

- lowercased
- å→a, ä→a, ö→o
- remaining accents stripped
- non-word characters removed
- spaces and repeated hyphens collapsed to a single `-`

Example: `"[LOS 3] Snillrika nyrika snillen"` → `los-3-snillrika-nyrika-snillen`

This ID is used for anchor links: `https://bajbeln.github.io/loshultskuppen/#los-3-snillrika-nyrika-snillen`

When the page loads with a hash in the URL, the layout automatically opens and scrolls to the matching song.

---

## Theming

Each spex page can set its background and accent colors in `index.md` frontmatter. The layout injects these as an inline `<style>` block.

| Field | Sets |
|---|---|
| `color` | `body { background-color }` |
| `accentColor` | `.collapsible, .content { background-color }` |
| `accentBorderColor` | `.collapsible, .content { border-color }` |

If `accentColor` and `accentBorderColor` are omitted the global defaults from `style.css` apply.

---

## Spex with multiple productions (uppsättningar)

When a spex title has been performed in multiple years, use a single `index.md` with an `uppsattning` list instead of a plain `spex` field. Each production gets its own `spex` identifier and its own folder of song files.

```yaml
---
layout: spex
title: Kristina (KRI)
color: "rgb(255, 220, 220)"
accentColor: "rgb(220, 120, 120)"
accentBorderColor: "rgb(200, 100, 100)"
permalink: /kristina/
uppsattning:
  - id: kristina-2023-24
    label: "Kristina 2023/24"
  - id: kristina-2001
    label: "Kristina 2001"
---
```

The layout renders each production under its own `<h3>` heading, in the order listed. Song files for each production live in their own subfolder and carry the matching `spex` identifier:

```
src/spex/kristina/
├── index.md
├── 2023-24/
│   ├── 01-det-ar-synd.md       # spex: kristina-2023-24
│   └── ...
└── 2001/
    ├── 01-allting-kan-ga-itu.md  # spex: kristina-2001
    └── ...
```

---

## The Favoriter page

`src/favoriter/index.md` uses its own layout (`favoriter`) and lists hand-picked songs from any spex by their `spex` identifier and exact `title` string:

```yaml
---
layout: favoriter
title: Favoriter
color: "rgb(252, 246, 218)"
songs:
  - spex: oresundsbron
    title: "1. Öppningskuplett"
  - spex: hilma
    title: "[HIL 3] Börjes Bödel-Bop"
---
```

The `songsFromList` filter looks up each entry in the `songs` collection and renders the songs in the listed order.

---

## How it all fits together

### Collections

`eleventy.config.js` registers a `songs` collection containing every `.md` file under `src/spex/**` that has an `order` frontmatter field. Index files (which have no `order`) are excluded.

### Filters

| Filter | Purpose |
|---|---|
| `songsForSpex(collection, spexName)` | Returns all songs for a given `spex` id, sorted by `order` |
| `songsFromList(collection, songList)` | Returns specific songs by `{spex, title}` pairs, preserving list order |
| `renderSong(song)` | Renders a song collection item as an HTML song-block string |

### Layout flow (`src/_layouts/spex.njk`)

1. If the page has `uppsattning`: iterate over productions, render each group under a heading.
2. If the page has `spex`: query `songsForSpex` and render all songs.
3. Otherwise: render `{{ content | safe }}` (fallback, not normally used).

Each song is rendered as:

```html
<div class="song-block">
  <div class="song-header">
    <button class="collapsible" id="<slug>">Sångtitel</button>
    <button class="song-link-btn" onclick="copySongLink('<slug>')">…</button>
  </div>
  <div class="content">
    <br><i>(Singer)</i><br>
    <i>Mel. Melody</i><br>
    <!-- rendered markdown body -->
  </div>
</div>
```

Collapsible behaviour and hash-navigation are handled by inline `<script>` in the layout.

---

## Deployment

The workflow at `.github/workflows/deploy_try.yml` builds the site with `npm run build` and deploys `_site/` to GitHub Pages.

**Currently set to manual trigger only.** To activate automatic deploys on every push to `main`, change the `on:` block in the workflow file:

```yaml
# Change this:
on:
  workflow_dispatch:

# To this:
on:
  push:
    branches: [main]
```

To trigger a manual deploy: go to the repository on GitHub → Actions → "Deploy (Eleventy) – try" → Run workflow.
