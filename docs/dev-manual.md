# Bajbeln - Developer Manual

Krischanstaspääxets Sajber-Bajbel is a static website for spex song lyrics. This document contains information about the Eleventy-based system for the site.

---

## Tech Stack

| Component | Detail | 
| ------------------- | --------------------------------------------- |
| Static site generator | [Eleventy](https://www.11ty.dev/) 3.x |
| Templates | Nunjucks (`.njk`) |
| Markdown renderer | markdown-it 14 (`html: true`, `breaks: true`) |
| Host | GitHub Pages, served from `_site/` |
| Build trigger | Automatic (GitHub Actions) |

---

## Repository Structure

```
/
├── src/                        # Eleventy input directory
│   ├── _layouts/
│   │   ├── spex.njk            # Layout for all spex pages
│   │   └── song.njk            # Layout for individual songs
│   ├── scripts/                # JavaScript for the browser (client-side)
│   │   ├── pagescript.js       # Main page interactions
│   │   ├── searchscript.js     # Search functionality
│   │   ├── settings.js         # User settings (dark mode, etc.)
│   │   ├── songIndexCache.js   # Song index caching
│   │   ├── lazy-css.js         # Lazy loading for CSS
│   │   ├── lazy-load-polyfill.js # Lazy loading polyfill
│   │   └── footer.js           # Footer functionality
│   ├── spex/
│   │   ├── <spex-name>/        # Spex (single or multi-production)
│   │   │   ├── index.md        # Main page (uppsattning: list, permalink: /name/)
│   │   │   ├── <year>/
│   │   │   │   ├── <song>.md   # Songs with spex: name-year
│   │   │   │   └── ...
│   │   │   └── {name}.json     # Colors and metadata
│   │   └── ...
│   ├── favoriter/
│   │   └── index.md            # Favorites page
│   └── songIndex.json.njk      # Generates /songIndex.json from the songs collection
├── scripts/                    # Build scripts (Node.js)
│   ├── generate-og-images.sh   # Generate Open Graph images
│   └── generate-stats.js       # Generate statistics
├── assets/                     # Images and other static resources
├── partials/                   # HTML parts fetched at runtime (footer, etc.)
├── style.css
├── site.webmanifest
├── sw.js
├── eleventy.config.ts          # Eleventy config: shortcodes, filters, passthrough
├── package.json
└── .github/workflows/
    └── deploy_try.yml          # GitHub Actions deployment workflow
```

**Output:** Eleventy writes everything to `_site/`. Files under `src/scripts/` are processed and output to `scripts/`. The following files and directories are passed through to preserve old URLs: `assets/`, `partials/`, `style.css`, `site.webmanifest`, and `sw.js`. `songIndex.json` is automatically generated from `src/songIndex.json.njk`.

---

## Local Development

### Requirements

- **Node.js 24+** (this is what CI uses). Download from [nodejs.org](https://nodejs.org/).
- **npm** — comes with Node.js, no separate installation required.

### Commands

```
npm install        # Only needed the first time
npm run start      # Build + server with live reload on localhost:8080
npm run build      # Single build to _site/
```

---

## Adding a New Spex

### 1. Create the Directory Structure

**All spex (single or multi-production) must use year subfolders** for consistency:

```
src/spex/<spex-name>/
├── index.md                      # Main page with uppsattning list
├── <spex-name>.json              # Colors and metadata
├── <year>/
│   ├── <song>.md                # Songs with spex: name-year
│   └── ...
└── ...
```

Use lowercase letters, hyphens, and replace Swedish characters: å→a, ä→a, ö→o.

### 2. Create `index.md` with `uppsattning`

All spex use the same unified `uppsattning` (production) list format:

```yaml
---
layout: spex
title: Spex Title Year (XXX)  # For single: include year; for multi: omit year
permalink: /spex-name/
uppsattning:
  - id: spex-name-2025         # Must match spex: field in song files
    label: 'Spex Title 2025 (XXX)'
---
```

**For single-production spex:**
- `title` includes the year (e.g., "Öresundsbron 2025 (BRO)")
- `uppsattning` has one item
- Single heading displays with year

**For multi-production spex:**
- `title` omits the year (e.g., "Stalin (STA)")
- `uppsattning` has multiple items (one per year)
- Main heading displays without year, each production shows its year in its section

The content of `index.md` is intentionally left empty. The layout automatically renders songs via the `uppsattning` identifiers.

For more details, see [Spex Organization](#spex-organization).

### 2b. Create `{name}.json` (colors)

Colors are stored in a separate JSON data file with the same name as the folder:

```
src/spex/<spex-name>/<spex-name>.json
```

```json
{
  "color": "rgb(R, G, B)",
  "accentColor": "rgb(R, G, B)",
  "accentBorderColor": "rgb(R, G, B)",
  "spexPageUrl": "/spex-name/"
}
```

Eleventy's directory data cascade automatically applies these values to all files in the folder (and subfolders). `accentColor` and `accentBorderColor` are optional; if omitted, the defaults from `style.css` are used.

`spexPageUrl` is the URL to the spex's nav page and is **required** — it is used by `src/songIndex.json.njk` to populate the `page` field for each song in `songIndex.json` (used by search and random functions). For spex with multiple productions, it is only placed in the parent `{name}.json` and cascades down to all year subfolders.

To override colors in dark mode, add any of these optional fields:

```json
{
  "color": "rgb(R, G, B)",
  "accentColor": "rgb(R, G, B)",
  "accentBorderColor": "rgb(R, G, B)",
  "darkColor": "rgb(R, G, B)",
  "darkAccentColor": "rgb(R, G, B)",
  "darkAccentBorderColor": "rgb(R, G, B)"
}
```

If omitted, dark mode uses the global defaults (`#1a1a2e` for background, `#2d3a5e` for collapsible elements/content).

### 3. Create a `.md` File for Each Song

The file naming convention depends on the song title format:

- **Title starts with `[ABBR N]`** (e.g., `[KRI 1] Everything can happen`):
  → `{abbreviation}-{NN}-{slug}.md`, where abbreviation is lowercase without special characters (ä→a, ö→o, etc.)
  → e.g., `kri-01-everything-can-happen.md`

- **Title starts with a number** (e.g., `1. Opening couplet`):
  → `{NN}-{slug}.md`
  → e.g., `01-opening-couplet.md`

`NN` is always two digits with leading zero.

```yaml
---
title: '[XXX N] Song Title' # or "N. Song Title"
singer: 'Sung by Character' # optional
melody: 'Melody - Artist' # optional
spex: spex-name # must match the spex identifier in index.md
order: 1 # determines display order on the page
permalink: false # always false for individual song files
---
Song lyrics here
```

- `title` — displayed on the collapsible button and used to create anchor links (see [Song IDs](#song-ids))
- `singer` — displayed in italics below the button if present
- `melody` — displayed as "Mel. ..." in italics if present
- `order` — integer that determines the display order; must be unique within a spex
- `permalink: false` — prevents Eleventy from writing the song file as its own HTML page

---

## Formatting Song Lyrics

markdown-it is configured with `breaks: true`, which means **each line break in the source becomes a `<br>` in the output**. An empty line creates a new paragraph (verse break).

### Line Breaks Within a Verse

Just press Enter. No special syntax required.

```
First line
Second line
Third line
```

### Verse Breaks

Leave an empty line between verses.

```
End of first verse
Last line

Start of second verse
```

### Speaking Parts

Use markdown **bold** on its own line, with or without a colon at the end depending on context:

```
**Gorm**
We're tracking here in the forest until
the time is right
```

```
**Ditte & Bente:** We should plan
Double the income
```

### Em Dashes for Dialogue

For dialogue in running text, use an em dash `—` at the beginning of the line. Never use `- ` (renders as a bullet list) or `\-`:

```
— Sing with us!
— Sure, we will!
```

### Stage Directions

Use markdown _italics_:

```
_(Everyone steps onto the stage)_
```

### Multi-column Layout

For songs where characters sing simultaneously, use the `::: cols` syntax for fenced-div:

```
::: cols
**Character A:**
Singing their verse

Second stanza
::: col
**Character B:**


Singing their verse (indented with two lines)
:::
```

- `::: cols` opens the row, `::: col` separates columns, `:::` closes the row.
- Full markdown works inside each column — use `**bold**` for speaking parts, empty lines for verse breaks, single line breaks for line breaks within a verse.
- **Vertical alignment:** Use explicit `<br>` lines (not empty lines) to move content down at the top of a column. Empty lines at the top of a column are unreliable — they are trimmed by the column rule. Each `<br>` line on its own line gives approximately two lines of downward movement. In the middle of a column (for spacing between stanzas), empty lines work as usual.
- For three or more columns, add more `::: col` separators.
- Text outside the block is regular markdown.
- Leave an empty line after `:::` to get a normal verse spacing before the next content.

The CSS classes `.row` and `.column` are defined in `style.css` (flexbox, 50% each). The rule for `::: cols` blocks is implemented in `eleventy.config.ts` — no npm package required.

**Note on spacing:** Inside columns, empty lines and line breaks produce the same visual line spacing as everywhere else in the song. One empty line = one line of space. **Exception: at the top of a column**, empty lines are trimmed — use `<br>` on its own line instead to push text down at column start.

### Raw HTML in Song Lyrics

markdown-it is configured with `html: true`, so raw HTML is allowed when needed for other special cases.

---

## Song IDs

Each song receives an HTML `id` attribute derived from its `title` by the `slugify()` function in `eleventy.config.ts`:

- Converted to lowercase
- å→a, ä→a, ö→o
- Other accent characters are removed
- Non-word characters are removed
- Spaces and repeated hyphens are compressed to a single `-`

Example: `"[LOS 3] Snillrika nyrika snillen"` → `los-3-snillrika-nyrika-snillen`

This ID is used for anchor links: `https://bajbeln.github.io/loshultskuppen/#los-3-snillrika-nyrika-snillen`

When the page loads with a hash in the URL, the layout automatically opens and scrolls to the matching song.

---

## Themes

Each spex page's background and accent colors are set in `{name}.json` (see [step 2b above](#2b-create-namejson-colors)). The layout injects these as an embedded `<style>` block.

| Field | Sets | Dark mode default |
| ----------------------- | ------------------------------------------------------------ | --------------------------- |
| `color` | `body { background-color }` | `#1a1a2e` (via `style.css`) |
| `accentColor` | `.collapsible, .content { background-color }` | `#2d3a5e` |
| `accentBorderColor` | `.collapsible, .content { border-color }` | `#2d3a5e` |
| `darkColor` | `body.dark-mode { background-color }` | — |
| `darkAccentColor` | `body.dark-mode .collapsible, .content { background-color }` | — |
| `darkAccentBorderColor` | `body.dark-mode .collapsible, .content { border-color }` | — |

The `dark*` fields are optional. When a spex has `accentColor` set, the layout automatically injects dark mode overrides with the default values above — unless the corresponding `dark*` fields are specified.

Colors are **not** set in the `index.md` frontmatter. They are in `{name}.json` and inherited by all files in the folder via Eleventy's directory data cascade. For spex with multiple productions, the `{name}.json` in the parent folder automatically cascades down to all year subfolders.

---

## Info Box

An optional `facts` field (or `factbox` / `info`) in the `index.md` frontmatter displays a round info box button (💡) on the far left in the button row (before "Copy link"). The button only appears on pages where the field is set.

```yaml
---
layout: spex
title: Spex Title Year (XXX)
permalink: /spex-name/
spex: spex-name
facts: |
  Facts and trivia about the spex, production, or characters.
  - Point 1
  - Point 2
---
```

- The value is rendered as markdown, so bullet lists with `-` or `*` work directly in the info bubble. If you need exact HTML, you can still use it, but standard text with line breaks renders correctly.
- This field is intended for trusted, manually written text — not user input.
- Clicking the button opens a text bubble; clicking the button or anywhere outside the bubble again closes it.
- The bubble's horizontal position is always centered on the page. The vertical position is calculated once on page load (after the header has loaded) so that the top of the bubble aligns with the top of the first song button — it then stays fixed regardless of scroll position.
- The button (`button.factButton`) and bubble (`.fact-bubble`) are styled in `style.css`, including dark mode variants. The logic (`toggleFactBubble`, `closeFactBubbles`) is in the embedded `<script>` block in `src/_layouts/spex.njk`.

---

## Spex Organization

**All spex must use year subfolders** for consistency, regardless of whether they have one or multiple productions.

### Main Page — `src/spex/{name}/index.md`

Every spex has a main `index.md` with a `uppsattning` (production) list:

```yaml
---
layout: spex
title: Kristina (KRI)          # Multi: omit year; Single: include year
permalink: /kristina/
uppsattning:
  - id: kristina-2023-24             # Must match spex: in song files
    label: 'Kristina 2023/24 (KRI)'
  - id: kristina-2001
    label: 'Kristina 2001 (KRI)'
---
```

**Title guidelines:**
- **Single production:** Include year (e.g., "Öresundsbron 2025 (BRO)") — this becomes the main page heading
- **Multiple productions:** Omit year (e.g., "Kristina (KRI)") — productions display their years in section headings

Colors come from `src/spex/{name}/{name}.json` and automatically cascade down to all year subfolders.

### Required Folder Structure

**Mandatory:** All song files must be organized in year subfolders. **Do not use subfolder `index.md` files.**

```
src/spex/kristina/
├── index.md                          # Main page with uppsattning list
├── kristina.json                     # Colors (cascades to subfolders)
├── 2023-24/
│   ├── 01-its-a-sin.md               # spex: kristina-2023-24
│   └── ...
└── 2001/
    ├── kri-01-everything-can-happen.md  # spex: kristina-2001
    └── ...
```

**Key requirements:**
- The `spex:` field in song files must match the `id:` in the `uppsattning` list
- **Do not create subfolder `index.md` files** — they are not used and should not exist
- Year subfolders are **mandatory** for all spex
- Single-production spex use one year subfolder (e.g., `2025/`)
- Multi-production spex use multiple year subfolders (e.g., `2023-24/`, `2001/`)

---

## Favorites Page

`src/favoriter/index.md` uses `layout: spex` with a `songs` list in frontmatter to list handpicked songs from any spex using their `spex` identifier and exact `title` string. Colors are fetched from `src/favoriter/favoriter.json`:

```yaml
---
layout: spex
title: Favoriter
color: 'rgb(252, 246, 218)'
accentColor: 'rgb(250, 203, 18)'
accentBorderColor: 'rgb(226, 185, 22)'
permalink: /favoriter/
songs:
  - spex: oresundsbron
    title: '1. Öppningskuplett'
  - spex: hilma
    title: '[HIL 3] Börjes Bödel-Bop'
---
```

The `spex.njk` layout looks up each entry in the `songs` collection via the `songsFromList` filter and renders the songs in the specified order.

---

## How Everything Connects

### Collections

`eleventy.config.ts` registers a `songs` collection that contains all `.md` files under `src/spex/**` that have an `order` field in the frontmatter. Index files (which don't have `order`) are excluded.

### songIndex.json

`src/songIndex.json.njk` is an Eleventy template that generates `/songIndex.json` at build time. It iterates over the `songs` collection (sorted by `spex`) and outputs a JSON array:

```json
[
  {"title": "[XXX 1] Song Title", "page": "/spex-name/"},
  ...
]
```

Each song's `page` value comes from `spexPageUrl` in the spex's `{name}.json`. The file is used by `scripts/searchscript.js` (the `?search=` function) and the random song button. No manual editing of `songIndex.json` is required — adding songs to the `songs` collection includes them automatically at the next build.

### Filters

| Filter | Purpose |
| ------------------------------------- | ----------------------------------------------------------------------- |
| `songsForSpex(collection, spexName)` | Returns all songs for a given `spex` ID, sorted by `order` |
| `songsFromList(collection, songList)` | Returns specific songs via `{spex, title}` pairs, preserves list order |
| `renderSong(song)` | Renders a song from the collection as an HTML song block string |

### Layout Flow (`src/_layouts/spex.njk`)

1. If the page has `songs` (e.g., favorites page): render the specified list of songs via `songsFromList`.
2. If the page has `uppsattning` (unified spex page): 
   - If `uppsattning` has **1 item**: render songs directly (no production section heading)
   - If `uppsattning` has **2+ items**: iterate over productions, render each group under an `<h2>` heading with `songsForSpex(u.id)`
3. Otherwise: render `{{ content | safe }}` (fallback, normally not used).

**Note:** The old `spex:` field approach is still supported for backward compatibility, but new spex should use `uppsattning:` for consistency.

Each song is rendered as:

```html
<div class="song-block">
  <div class="song-header">
    <button class="collapsible" id="<slug>">Song Title</button>
    <button class="song-link-btn" onclick="copySongLink('<slug>')">…</button>
  </div>
  <div class="content">
    <br />
    <i>(Singer)</i><br />
    <i>Mel. Melody</i><br />
    <br />
    <!-- rendered markdown-body -->
    <br /><br />
  </div>
</div>
```

The behavior for collapsible elements and hash navigation is handled by the embedded `<script>` in the layout.

---

## Templates

Ready-to-use templates for copying are available at:

- `src/spex/_template_single/` — spex with a single production (uses `uppsattning` with one item)
- `src/spex/_template_multi/` — spex with multiple productions (uses `uppsattning` with multiple items)

**Note:** Both templates now use the unified `uppsattning` approach. The only difference is the number of items in the list. For maximum consistency, single-production spex can also use the `_template_multi` structure with just one item.

Copy the relevant folder, rename it and the `.json` file inside, and fill in the placeholders. The templates include comments explaining each field.

---

## Open Graph Images (OG Images)

OG images (1200×630 px) are generated for the homepage and each spex, used for social media sharing previews. Images are stored in `assets/images/og/` and referenced via `<meta property="og:image">` in the HTML head.

### Generation

OG images are **automatically generated** during development (`npm start`) and builds (`npm run build`) via the `prebuild` and `prestart` hooks in `package.json`, which run `scripts/generate-og-images.sh` (which contains the OG generator).

You can also run it manually:

```
npm run generate:og-images
```

This runs `scripts/generate-og-images.sh` (which contains the OG generator) which:

1. Creates a default OG image (`og-image.webp`) with background color `rgb(210,231,250)`
2. Creates spex-specific OG images (`og-{spex-name}.webp`) with background color from each spex `{name}.json` file (the `color` field)
3. Copies `og-image.webp` to `assets/images/og-image.webp` (main OG image)

**Incremental generation:** The script only regenerates images that are missing or where the source files (JSON files with colors or logo) are newer than the output file. This makes the run fast even for large changes.

To force regeneration of all images (e.g., after changes to the script itself):

```
npm run generate:og-images -- --force
```

**System requirements:** ImageMagick (`magick`) and `jq` must be installed on the system.

Installation instructions:

| System | Command |
| ------------------------- | ------------------------------------------------------------ |
| **macOS** (Homebrew) | `brew install imagemagick jq` |
| **Linux** (Debian/Ubuntu) | `sudo apt-get update && sudo apt-get install imagemagick jq` |
| **Linux** (Fedora/RHEL) | `sudo dnf install ImageMagick jq` |
| **Windows** (WSL) | `sudo apt-get update && sudo apt-get install imagemagick jq` |

**Note:** `xargs` and `stat` are normally included in all Unix-like systems (macOS, Linux, WSL) and do not need to be installed separately.

### Customization

The color for each spex OG image is taken from the `color` field in the spex's `{name}.json` file. The logo (`assets/images/logga.webp`) is placed centered vertically with 41px margins top and bottom.

If you add a new spex, run `npm run generate:og-images` and commit the new OG images. If you only change a color in an existing spex, the script will only regenerate that specific OG image.

---

## Deployment

The workflow in `.github/workflows/deploy_try.yml` builds the site with `npm run build` and deploys `_site/` to GitHub Pages.

**GitHub Pages deployment.** Automatic deployment on every push to `main` is enabled by these lines in `deploy_try.yml`:

```yaml
on:
  push:
    branches: [main]
```

To enable deployment: go to the repository on GitHub → Settings → Pages → Source: → set to GitHub Actions.
