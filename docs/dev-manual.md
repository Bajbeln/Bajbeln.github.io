# Bajbeln – Teknisk manual

Krischanstaspääxets Sajber-Bajbel är en statisk webbsida för spääxets sångtexter. Här finns information om det Eleventy-baserade systemet för sidan.

---

## Teknisk stack

| Komponent | Detalj |
|---|---|
| Statisk sidoskapare | [Eleventy](https://www.11ty.dev/) 3.x |
| Mallar | Nunjucks (`.njk`) |
| Markdown-renderare | markdown-it 14 (`html: true`, `breaks: true`) |
| Värd | GitHub Pages, distribueras från `_site/` |
| Byggtrigger | Automatisk (GitHub Actions) |

---

## Repostruktur

```
/
├── src/                        # Eleventys ingångskatalog
│   ├── _layouts/
│   │   └── spex.njk            # Layout för alla spexsidor
│   ├── spex/
│   │   ├── <spex-namn>/       # Spex med en produktionsomgång
│   │   │   ├── index.md        # Spexsida (spex: namn, permalink: /namn/)
│   │   │   ├── 01-latnamn.md
│   │   │   └── ...
│   │   ├── <spex-namn>/       # Spex med flera uppsättningar
│   │   │   ├── index.md        # Navsida (uppsattning-lista, inget spex-fält)
│   │   │   ├── <ar>/ 
│   │   │   │   ├── index.md    # Produktionssida (spex: namn-år, permalink: false)
│   │   │   │   ├── 01-lat.md
│   │   │   │   └── ...
│   │   │   └── ...
│   │   └── ...
│   ├── favoriter/
│   │   └── index.md            # Favoritsida
│   └── songIndex.json.njk      # Genererar /songIndex.json från songs-samlingen
├── spex/                       # Äldre HTML-filer för spex (genomkopplas, orörda)
├── scripts/                    # JavaScript för webbläsaren (pagescript, searchscript, mm)
├── assets/                     # Bilder och andra statiska resurser
├── partials/                   # HTML-delar som hämtas vid körning (footer, mm)
├── style.css
├── index.html                  # Startsida (genomkopplas)
├── eleventy.config.js          # Eleventy-konfig: shortcodes, filter, genomkoppling
├── package.json
└── .github/workflows/
    └── deploy_try.yml          # GitHub Actions-distribueringsflöde
```

**Utdata:** Eleventy skriver allt till `_site/`. Alla filer under `spex/`, `scripts/`, `assets/`, `partials/`, `style.css`, `index.html` och `manifest.json` genomkopplas så att gamla URL:er fortsätter att fungera. `songIndex.json` genereras automatiskt av `src/songIndex.json.njk` — den kopieras inte genom från rotkatalogen.

---

## Lokal utveckling

### Förutsättningar

- **Node.js 18+** (Node.js 20 rekommenderas — det är vad CI använder). Ladda ner från [nodejs.org](https://nodejs.org/).
- **npm** — följer med Node.js, ingen separat installation krävs.

### Kommandon

```
npm install        # Endast första gången
npm run start      # Bygg + server med live-uppdatering på localhost:8080
npm run build      # Enstaka bygg till _site/
```

---

## Lägga till ett nytt spex

### 1. Skapa katalogen

```
src/spex/<spex-namn>/
```

Använd små bokstäver, bindestreck och ersätt svenska tecken: å→a, ä→a, ö→o. Detta namn är också `spex`-identifieraren som används i frontmatter.

### 2. Skapa `index.md`

```yaml
---
layout: spex
title: Spextitel År (XXX)
permalink: /spex-namn/
spex: spex-namn
---
```

Innehållet i `index.md` lämnas avsiktligt tomt. Layouten renderar alla låtar automatiskt via `spex`-identifieraren.

För spex med flera uppsättningar, se [Spex med flera uppsättningar](#spex-med-flera-uppsättningar).

### 2b. Skapa `{namn}.json` (färger)

Färger lagras i en separat JSON-datafil med samma namn som mappen:

```
src/spex/<spex-namn>/<spex-namn>.json
```

```json
{
  "color": "rgb(R, G, B)",
  "accentColor": "rgb(R, G, B)",
  "accentBorderColor": "rgb(R, G, B)",
  "spexPageUrl": "/spex-namn/"
}
```

Eleventys katalogdata-kaskad tillämpar automatiskt dessa värden på alla filer i mappen (och undermappar). `accentColor` och `accentBorderColor` är valfria; om de utelämnas används standardvärdena i `style.css`.

`spexPageUrl` är URL:en till spexets navsida och är **obligatorisk** — den används av `src/songIndex.json.njk` för att fylla `page`-fältet för varje låt i `songIndex.json` (används av sök- och slumpfunktionerna). För spex med flera uppsättningar placeras den endast i den överordnade `{namn}.json` och kaskaderas ner till alla års-undermappar.

För att åsidosätta färgerna i mörkt läge, lägg till några av dessa valfria fält:

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

Om de utelämnas använder mörkt läge de globala standardvärdena (`#1a1a2e` för bakgrunden, `#2d3a5e` för ihopfällbara element/innehåll).

### 3. Skapa en `.md`-fil per låt

Namnkonventionen för filer beror på låttitelns format:

- **Titel börjar med `[FÖRK N]`** (t.ex. `[KRI 1] Allting kan gå itu`):
  → `{forkortning}-{NN}-{slug}.md`, där forkortning är små bokstäver utan specialtecken (ä→a, ö→o, etc.)
  → t.ex. `kri-01-allting-kan-ga-itu.md`

- **Titel börjar med en siffra** (t.ex. `1. Öppningskuplett`):
  → `{NN}-{slug}.md`
  → t.ex. `01-oppningskuplett.md`

`NN` är alltid tvåsiffrig med inledande nolla.

```yaml
---
title: "[XXX N] Låttitel"       # eller "N. Låttitel"
singer: "Sjungs av Rollfigur"    # valfritt
melody: "Melodin – Artist"       # valfritt
spex: spex-namn                  # måste matcha spex-identifieraren i index.md
order: 1                        # bestämmer sorteringsordning på sidan
permalink: false                # alltid false för enskilda låt-filer
---
Låttext här
```

- `title` — visas på den ihopfällbara knappen och används för att skapa ankarlänkar (se [Låt-ID:n](#låt-Idn))
- `singer` — visas i kursiv under knappen om det finns
- `melody` — visas som "Mel. …" i kursiv om det finns
- `order` — heltal som bestämmer visningsordningen; måste vara unikt inom ett spex
- `permalink: false` — förhindrar att Eleventy skriver låtfilen som en egen HTML-sida

---

## Formatering av låttexter

markdown-it är konfigurerad med `breaks: true`, vilket innebär att **varje radbrytning i källan blir en `<br>` i utdata**. En tom rad skapar ett nytt stycke (versbrytning).

### Radbrytningar inom en vers

Tryck bara på Enter. Ingen specialsyntax krävs.

```
Första raden
Andra raden
Tredje raden
```

### Versbrytningar

Lämna en tom rad mellan verserna.

```
Slutet på första verset
Sista raden

Början på andra verset
```

### Talarutdrag

Använd markdown **fet** på en egen rad, med eller utan kolon i slutet beroende på sammanhang:

```
**Gorm**
Vi spanar här i skogen tills
tiden den är mogen
```

```
**Ditte & Bente:** Vi ska planera
Inkomst dubblera
```

### Tankstreck för dialog

För dialog i löpande text, använd ett tankstreck `—` i början av raden. Använd aldrig `- ` (renderas som en punktlista) eller `\-`:

```
— Sjung med oss!
— Javisst, det gör vi!
```

### Scenanvisningar

Använd markdown *kursiv*:

```
_(Alla kliver in på scenen)_
```

### Flerkolumnslayout

För låtar där karaktärer sjunger samtidigt, använd syntaxen `::: cols` för fenced-div:

````
::: cols
**Karaktär A:**
Sjunger sin vers

Andra strofen
::: col
**Karaktär B:**


Sjunger sin vers (indrag med två rader)
:::
````

- `::: cols` öppnar raden, `::: col` separerar kolumner, `:::` stänger raden.
- Full markdown fungerar inne i varje kolumn — använd `**fet**` för talarutdrag, tomma rader för versbrytningar, enstaka radbrytningar för radbrytningar inom en vers.
- **Vertikal justering:** tomma rader i en kolumn flyttar ned efterföljande innehåll. Varje tom rad motsvarar en rads mellanrum.
- För tre eller fler kolumner, lägg till fler `::: col`-separatorer.
- Text utanför blocket är vanlig markdown.
- Lämna en tom rad efter `:::` för att få ett normalt versbrytningsmellanrum före nästa innehåll.

CSS-klasserna `.row` och `.column` är definierade i `style.css` (flexbox, 50% var). Regeln för `::: cols`-block är implementerad i `eleventy.config.js` — inget npm-paket krävs.

**Anmärkning om mellanrum:** Inne i kolumner producerar tomma rader och radbrytningar samma visuella radavstånd som överallt annars i låten. En tom rad = en tom rads mellanrum. Detta är konsekvent med vanlig låtformatering utanför kolumner.

### Raw HTML i låttexter

markdown-it är konfigurerad med `html: true`, så raw HTML är tillåten när det behövs för andra specialfall.

---

## Låt-ID:n

Varje låt får ett HTML-`id`-attribut som härleds från dess `title` av funktionen `slugify()` i `eleventy.config.js`:

- Görs om till små bokstäver
- å→a, ä→a, ö→o
- Övriga accenttecken tas bort
- Ickе-ordkaraktärer tas bort
- Mellanslag och upprepade bindestreck komprimeras till ett enda `-`

Exempel: `"[LOS 3] Snillrika nyrika snillen"` → `los-3-snillrika-nyrika-snillen`

Detta ID används för ankarlänkar: `https://bajbeln.github.io/loshultskuppen/#los-3-snillrika-nyrika-snillen`

När sidan laddas med en hash i URL:en öppnar layouten automatiskt och rullar till den matchande låten.

---

## Teman

Varje spexsidas bakgrunds- och accentfärger ställs in i `{namn}.json` (se [steg 2b ovan](#2b-skapa-namnjson-färger)). Layouten injectar dessa som ett inbäddat `<style>`-block.

| Fält | Sätter | Standard i mörkt läge |
|---|---|---|
| `color` | `body { background-color }` | `#1a1a2e` (via `style.css`) |
| `accentColor` | `.collapsible, .content { background-color }` | `#2d3a5e` |
| `accentBorderColor` | `.collapsible, .content { border-color }` | `#2d3a5e` |
| `darkColor` | `body.dark-mode { background-color }` | — |
| `darkAccentColor` | `body.dark-mode .collapsible, .content { background-color }` | — |
| `darkAccentBorderColor` | `body.dark-mode .collapsible, .content { border-color }` | — |

`dark*`-fälten är valfria. När ett spex har `accentColor` inställt injectar layouten automatiskt mörkt läges-overskridningar med standardvärdena ovan — om inte motsvarande `dark*`-fält är angivna.

Färger ställs **inte** in i `index.md` frontmatter. De finns i `{namn}.json` och ärvs av alla filer i mappen via Eleventys katalogdata-kaskad. För spex med flera uppsättningar kaskaderar `{namn}.json` i överordnad mapp automatiskt ner till alla års-undermappar.

---

## Spex med flera uppsättningar

När en spextitel har uppförts flera år finns en två-nivåstruktur: en **navsida** som listar alla uppsättningar, och en separat **produktionssida** för varje år.

### Navsida — `src/spex/{namn}/index.md`

Har en `uppsattning`-lista och inget `spex`-fält. Renderar alla produktioner på en sida, var och en under en `<h2>`-rubrik.

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

Färger kommer från `src/spex/kristina/kristina.json` och kaskaderar automatiskt ner till alla års-undermappar.

### Produktionssida — `src/spex/{namn}/{ar}/index.md`

Varje produktion har sin egen sida med ett `spex`-fält som matchar produktions-ID:t. `permalink: false` — produktionssidor har ingen egen URL; låtar renderas endast på navsidan.

```yaml
---
layout: spex
title: Kristina 2001 (KRI)
spex: kristina-2001
permalink: false
---
```

Inga färgfält krävs — de ärvs från den överordnade `kristina.json`.

### Filstruktur

```
src/spex/kristina/
├── index.md                          # nav: uppsattning-lista, inget spex-fält
├── 2023-24/
│   ├── index.md                      # spex: kristina-2023-24, permalink: false
│   ├── 01-det-ar-synd.md             # spex: kristina-2023-24
│   └── ...
└── 2001/
    ├── index.md                      # spex: kristina-2001, permalink: false
    ├── kri-01-allting-kan-ga-itu.md  # spex: kristina-2001
    └── ...
```

---

## Favoritsidan

`src/favoriter/index.md` använder `layout: spex` med en `songs`-lista i frontmatter för att lista handplockade låtar från vilket spex som helst via deras `spex`-identifierare och exakta `title`-sträng. Färger hämtas från `src/favoriter/favoriter.json`:

```yaml
---
layout: spex
title: Favoriter
color: "rgb(252, 246, 218)"
accentColor: "rgb(250, 203, 18)"
accentBorderColor: "rgb(226, 185, 22)"
permalink: /favoriter/
songs:
  - spex: oresundsbron
    title: "1. Öppningskuplett"
  - spex: hilma
    title: "[HIL 3] Börjes Bödel-Bop"
---
```

Layouten `spex.njk` letar upp varje post i `songs`-samlingen via filtret `songsFromList` och renderar låtarna i den angivna ordningen.

---

## Hur allt hänger ihop

### Samlingar

`eleventy.config.js` registrerar en `songs`-samling som innehåller alla `.md`-filer under `src/spex/**` som har ett `order`-fält i frontmatter. Indexfiler (som inte har `order`) exkluderas.

### songIndex.json

`src/songIndex.json.njk` är en Eleventy-mall som genererar `/songIndex.json` vid byggtid. Den itererar över `songs`-samlingen (sorterad efter `spex`) och skriver ut en JSON-array:

```json
[
  {"title": "[XXX 1] Låttitel", "page": "/spex-namn/"},
  ...
]
```

Varje låts `page`-värde kommer från `spexPageUrl` i spexets `{namn}.json`. Filen används av `scripts/searchscript.js` (funktionen `?search=`) och slump-låt-knappen.

**Migreringsnotis:** För närvarande finns det också en äldre `songIndex.json` i rotkatalogen som genomkopplas via `eleventy.config.js` (med kommentaren `// remove this to enable search and random to new pages`). När migrationen är klar bör denna rad tas bort så att den genererade filen från `src/songIndex.json.njk` används uteslutande. Ingen manuell redigering av den genererade `songIndex.json` krävs — att lägga till låtar i `songs`-samlingen inkludera dem automatiskt vid nästa bygg.

### Filter

| Filter | Syfte |
|---|---|
| `songsForSpex(collection, spexName)` | Returnerar alla låtar för ett givet `spex`-ID, sorterade efter `order` |
| `songsFromList(collection, songList)` | Returnerar specifika låtar via `{spex, title}`-par, bevarar listordning |
| `renderSong(song)` | Renderar en låt från samlingen som en HTML-låtblock-sträng |

### Layoutflöde (`src/_layouts/spex.njk`)

1. Om sidan har `songs` (t.ex. favoritsidan): rendera den angivna listan av låtar via `songsFromList`.
2. Om sidan har `uppsattning` (navsida): iterera över produktioner i listordning, rendera varje grupp under en `<h2>`-rubrik med `songsForSpex(u.id)`.
3. Om sidan har `spex` (enkelproduktions- eller enskild produktionssida): fråga `songsForSpex(spex)` och rendera alla låtar.
4. Annars: rendera `{{ content | safe }}` (fallback, används normalt inte).

Varje låt renderas som:

```html
<div class="song-block">
  <div class="song-header">
    <button class="collapsible" id="<slug>">Låttitel</button>
    <button class="song-link-btn" onclick="copySongLink('<slug>')">…</button>
  </div>
  <div class="content">
    <br>
    <i>(Singer)</i><br>
    <i>Mel. Melody</i><br>
    <br>
    <!-- renderad markdown-body -->
    <br><br>
  </div>
</div>
```

Beteendet för ihopfällbara element och hash-navigering hanteras av inbäddat `<script>` i layouten.

---

## Mallar

Färdiga mallar för kopiering finns i:

- `src/spex/_template_single/` — spex med en produktionsomgång
- `src/spex/_template_multi/` — spex med flera uppsättningar (nav + års-undermapp)

Kopiera den relevanta mappen, döp om den och `.json`-filen inne i den, och fyll i platshållarna. Mallarna inkluderar kommentarer som förklarar varje fält.

---

## Distribution

Arbetsflödet i `.github/workflows/deploy_try.yml` bygger sidan med `npm run build` och distribuerar `_site/` till GitHub Pages.

**GitHub Pages-distribution.** Automatisk distribution vid varje push till `main` aktiveras av dessa rader i `deploy_try.yml`:

```yaml
on:
  push:
    branches: [main]
```

För att aktivera distributionen: gå till repositoryt på GitHub → Inställningar → Pages → Källa: → ställ in på GitHub Actions.
