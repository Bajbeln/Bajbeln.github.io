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
│   │   ├── <spex-name>/        # Single-production spex
│   │   │   ├── index.md        # Spex page (spex: name, permalink: /name/)
│   │   │   ├── 01-song-name.md
│   │   │   └── ...
│   │   ├── <spex-name>/        # Multi-production spex (återuppsättning)
│   │   │   ├── index.md        # Hub page (uppsattning list, no spex field)
│   │   │   ├── <year>/
│   │   │   │   ├── index.md    # Production page (spex: name-year, permalink: /name_year/)
│   │   │   │   ├── 01-song.md
│   │   │   │   └── ...
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
permalink: /spex-name/
spex: spex-name
---
```

The body of `index.md` is intentionally left empty. The layout renders all songs automatically via the `spex` identifier.

For spex with multiple productions, see [Spex with multiple productions](#spex-with-multiple-productions-uppsättningar).

### 2b. Create `{name}.json` (colors)

Colors are stored in a separate JSON data file named after the folder:

```
src/spex/<spex-name>/<spex-name>.json
```

```json
{
  "color": "rgb(R, G, B)",
  "accentColor": "rgb(R, G, B)",
  "accentBorderColor": "rgb(R, G, B)"
}
```

Eleventy's directory data cascade automatically applies these values to every file in the folder (and subfolders). `accentColor` and `accentBorderColor` are optional; omitting them falls back to the global defaults in `style.css`.

### 3. Create one `.md` file per song

The file naming convention depends on the song title format:

- **Title starts with `[ABB N]`** (e.g. `[KRI 1] Allting kan gå itu`):
  → `{abbrev}-{NN}-{slug}.md`, where abbrev is lowercase with no special chars (ä→a, ö→o, etc.)
  → e.g. `kri-01-allting-kan-ga-itu.md`

- **Title starts with a number** (e.g. `1. Öppningskuplett`):
  → `{NN}-{slug}.md`
  → e.g. `01-oppningskuplett.md`

`NN` is always two-digit zero-padded.

```yaml
---
title: "[XXX N] Sångtitel"       # or "N. Sångtitel"
singer: "Sjungs av Rollfigur"    # optional
melody: "Låttitel – Artist"      # optional
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

Use markdown bold on its own line, with or without a trailing colon depending on situation: (tveksamt, ändrar kanske)

```
**Gorm**
Vi spanar här i skogen tills
tiden den är mogen
```

```
**Ditte & Bente:** Vi ska planera
Inkomst dubblera
```

### Dialogue dashes

For inline dialogue, use an em dash `—` at the start of the line. Never use `- ` (renders as a bullet list) or `\-`:

```
— Sjung med oss!
— Javisst, det gör vi!
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

Each spex page's background and accent colors are set in `{name}.json` (see [step 2b above](#2b-create-namejson-colors)). The layout injects these as an inline `<style>` block.

| Field | Sets |
|---|---|
| `color` | `body { background-color }` |
| `accentColor` | `.collapsible, .content { background-color }` |
| `accentBorderColor` | `.collapsible, .content { border-color }` |

If `accentColor` and `accentBorderColor` are omitted the global defaults from `style.css` apply.

Colors are **not** set in `index.md` frontmatter. They live in `{name}.json` and are inherited by all files in the folder via Eleventy's directory data cascade. For multi-production spex, the `{name}.json` in the parent folder cascades into all year subfolders automatically.

---

## Spex with multiple productions (uppsättningar)

When a spex title has been performed in multiple years, there is a two-level structure: a **hub page** that lists all productions, and a separate **production page** for each year.

### Hub page — `src/spex/{name}/index.md`

Has an `uppsattning` list and no `spex` field. Renders all productions on one page, each under its own heading.

```yaml
---
layout: spex
title: Kristina (KRI)
permalink: /kristina/
uppsattning:
  - id: kristina-2023-24
    label: "Kristina 2023/24 (KRI)"
  - id: kristina-2001
    label: "Kristina 2001 (KRI)"
---
```

Colors come from `src/spex/kristina/kristina.json` and cascade into all year subfolders automatically.

### Production page — `src/spex/{name}/{year}/index.md`

Each production has its own page with a `spex` field matching the production id. The `permalink` uses an underscore to separate name and year:

```yaml
---
layout: spex
title: Kristina 2001 (KRI)
spex: kristina-2001
permalink: /kristina_2001/
---
```

No color fields needed — they are inherited from the parent `kristina.json`.

### File structure

```
src/spex/kristina/
├── index.md                          # hub: uppsattning list, no spex field
├── 2023-24/
│   ├── index.md                      # spex: kristina-2023-24, permalink: /kristina_2023-24/
│   ├── 01-det-ar-synd.md             # spex: kristina-2023-24
│   └── ...
└── 2001/
    ├── index.md                      # spex: kristina-2001, permalink: /kristina_2001/
    ├── kri-01-allting-kan-ga-itu.md  # spex: kristina-2001
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

1. If the page has `uppsattning` (hub page): iterate over productions in list order, render each group under an `<h2>` heading using `songsForSpex(u.id)`.
2. If the page has `spex` (single-production or individual production page): query `songsForSpex(spex)` and render all songs.
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

## Templates

Ready-to-copy templates live in:

- `src/spex/_template/` — single-production spex
- `src/spex/_template_multi/` — multi-production spex (hub + year subfolder)

Copy the relevant folder, rename it and the `.json` file inside, and fill in the placeholders. Templates include comments explaining every field.

---

## Deployment

The workflow at `.github/workflows/deploy_try.yml` builds the site with `npm run build` and deploys `_site/` to GitHub Pages.

**GitHub Pages deployment.** Automatic deploys on every push to `main` is set to on by these lines in `deploy_try.yml`:

```yaml
on:
  push:
    branches: [main]
```

To activate the deployment: go to the repository on GitHub → Settings → Pages → Source: → set to GitHub Actions.
