# Utvecklarmanual — Krischantaspääxets Sajber-Bajbel

**Webbplats:** https://bajbeln.github.io/
**Repository:** https://github.com/Bajbeln/Bajbeln.github.io

Ett sökbart arkiv med sångtexter från Krischantaspääxets spexproduktioner,
hostat som en statisk sajt på GitHub Pages.

---

## Innehållsförteckning

1. [Teknikstack](#teknikstack)
2. [Repositorystruktur](#repositorystruktur)
3. [Hur GitHub Pages-driftsättning fungerar](#hur-github-pages-driftsättning-fungerar)
4. [Lägga till ett nytt spex](#lägga-till-ett-nytt-spex)
5. [Uppdatera songIndex.json](#uppdatera-songindexjson)
6. [JavaScript-moduler](#javascript-moduler)
7. [HTML-partialer](#html-partialer)
8. [CSS & designsystem](#css--designsystem)
9. [PWA-konfiguration](#pwa-konfiguration)
10. [Analys](#analys)
11. [Kända fel & planerade funktioner](#kända-fel--planerade-funktioner)

---

## Teknikstack

| Lager      | Teknik                                          |
|------------|-------------------------------------------------|
| Stilar     | Plain CSS3 (`style.css`)                        |
| Skript     | Vanilla JavaScript (ES2017+)     |
| Ikoner     | Font Awesome 6.0 (laddas från CDN per sida)     |
| Data       | `songIndex.json` —  JSON-array             |
| Hosting    | GitHub Pages (byggs från `main`-grenens rot) |
| Analys     | Goatcounter (integritetsvänlig, laddas i sidfoten)|

Det finns **inget byggesteg**, ingen pakethanterare och inget ramverk.
Varje fil serveras precis som den finns i repot.

---

## Repositorystruktur

```
/
├── index.html              # Landningssida med sökfält och spexlista
├── style.css               # Global stilmall (delas av alla sidor)
├── manifest.json           # PWA-manifest (installerbarhet på mobil)
├── songIndex.json          # Sökbar sångkatalog (~1000+ poster)
│
├── /spex/                  # En HTML-fil per spexproduktion
│   ├── spex_sample.html    # Mall — kopiera denna för att lägga till ett nytt spex
│   ├── favoriter.html      # Sida med utvalda favoriter
│   └── *.html              # ~60 individuella spexsidor
│
├── /scripts/
│   ├── pagescript.js       # Körs på varje spexsida (header, knappar, etc.)
│   ├── searchscript.js     # Markerar & scrollar till en låt via ?search=
│   ├── settings.js         # Läslägesväxling (cookie-baserad)
│   ├── songIndexCache.js   # Singleton fetch+cache för songIndex.json
│   └── footer.js           # Laddar sidfots-partial + Goatcounter
│
├── /partials/
│   ├── footer.html         # Delad sidfot (upphovsrätt, länkar)
│   ├── main_header.html    # Sökfält som används på index.html
│   └── spex_page_header.html # Logolänk som används på varje spexsida
│
├── /assets/
│   ├── /images/            # Loggor och PWA-ikontillgångar
│   └── /songs/             # PDF-kollektiva sångblad (~38 MB)
│
├── README.md               # Kort svensk introduktion (publikt)
├── todo                    # Intern utvecklingsbacklog
└── docs/
    └── dev-manual.md       # Den här filen
```

---

## Hur GitHub Pages-driftsättning fungerar

- GitHub Pages är aktiverat på det här repot eftersom det följer namnkonventionen
  `<username>.github.io`. Det serverar automatiskt `main`-grenens rot.
- **Varje push till `main` driftsätter om sajten** — det finns ingen CI-pipeline eller byggesteg.
- Utvecklingsarbete sker på feature-grenar (t.ex. `joel`) och mergas in i `main`
  när det är klart.
- Sajten är tillgänglig omedelbart efter att GitHub har bearbetat pushen (vanligtvis < 1 minut).

> **Obs:** `/docs` här är bara en dokumentationsmapp. Den konfigurerar **inte**
> GitHub Pages att servera från `/docs` — hela roten serveras som den är.

---

## Lägga till ett nytt spex

### 1. Skapa spexsidan

Kopiera mallen och döp om den:

```
cp spex/spex_sample.html spex/<kortnamn>.html
```

Använd ett filnamn med gemener och utan bindestreck som matchar en igenkännlig förkortning
(t.ex. `oresundsbron.html`, `tycho.html`, `erik_xiv.html`).

### 2. Fyll i sidan

Öppna den nya filen och ersätt platshållarinnehållet:

| Platshållare       | Ersätt med                                                 |
|--------------------|------------------------------------------------------------|
| `Spextitel`        | Det fullständiga spexnamnet (används i `<title>` och `<h2>`) |
| `background-color` | En unik färg för det här spexet (se inline-`<style>`)      |
| Sångblock          | Se **Lägga till en låt** nedan                             |

**Lägga till en låt** — avkommentera och fyll i ett block per låt:

```html
<button type="button" class="collapsible" aria-label="Visa eller dölj Sångtitel">Sångtitel</button>
<div class="content">
  <p>
    <i>Sjungs av: Rollfigur</i><br>
    <i>Melodi: Originallåt av Artist</i><br><br>
    Sångtext rad 1<br>
    Sångtext rad 2<br>
  </p>
</div>
```

**Tvåkolumnslayout** (för låtar med två parallella stämmor):

```html
<div class="row">
  <div class="column">
    <!-- vänster kolumns innehåll -->
  </div>
  <div class="column">
    <!-- höger kolumns innehåll -->
  </div>
</div>
```

**Namngiven sektion** (för in-page-ankarnavigering):

```html
<div id="SPEX_20XX_XX">
  <a name="SPEX_20XX_XX"></a>
  <h2>Spextitel (???)</h2>
</div>
```

### 3. Uppdatera songIndex.json

Se [Uppdatera songIndex.json](#uppdatera-songindexjson) nedan.

### 4. Länka från landningssidan

Öppna `index.html` och lägg till en länk till det nya spexet på rätt kronologisk
plats i spexlistan. Använd klassen `a.button`:

```html
<a class="button" href="/spex/<kortnamn>">Spextitel (ÅR)</a>
```

---

## Uppdatera songIndex.json

`songIndex.json` är en platt JSON-array som används för den globala sökningen och
slumpmässig-låt-funktionen. Varje låt som ska vara sökbar eller nåbar via "Räändom"
måste ha en post här.

### Format

```json
[
  {"title": "1. Öppningskuplett", "page": "/spex/oresundsbron"},
  {"title": "2. Hebbas aria",     "page": "/spex/oresundsbron"}
]
```

- `"title"` måste exakt matcha knapptexten i spex-HTML-filen
  (skiftlägesokänslig matchning görs vid körning, men exakt matchning är säkrast).
- `"page"` är den rotrelativa sökvägen till spexsidan, utan `.html`.

### Konventioner

- Gruppera poster per spex, åtskilda av en blank rad.
- Håll posterna i låtordning inom varje spex.
- Lägg till poster för det senaste spexet **överst** i filen (nyaste först).

### Felsökning vid sökmisslyckanden

Om en sökning hamnar på rätt sida men rapporterar "Ingen matchande låt hittades":

1. Jämför `"title"` i `songIndex.json` med knapptexten i HTML-filen.
2. Leta efter osynliga skillnader: extra mellanslag, olika citattecken eller
   kodningsproblem med svenska tecken (å, ä, ö).

---

## JavaScript-moduler

### `scripts/songIndexCache.js`

En modul-pattern-singleton som wrapprar `fetch('/songIndex.json')`. Exponerar en
global funktion: `getSongIndex()` som returnerar ett Promise som löser till den
parsade arrayen. Efterföljande anrop returnerar det cachade resultatet; samtidiga
anrop delar samma pågående Promise.

Ladda det här skriptet **innan** något skript som anropar `getSongIndex()`.

### `scripts/pagescript.js`

Körs på varje spexsida. Vid `DOMContentLoaded`:

1. Hämtar och injicerar `partials/spex_page_header.html` överst i `<body>`.
2. Injicerar inställningskugghjulet och läslägesknappen.
3. Injicerar "Räändom"-knappen bredvid `.copyButton` — vid klick väljs en slumpmässig
   post från `songIndex.json` och navigerar till `page?search=title`.
4. Lazy-laddar Font Awesome från CDN om det inte redan finns.
5. Återställer läsläge från cookie om `readingMode=true`.

`copyLink()` — kopierar den aktuella URL:en till urklipp med moderna Clipboard API,
med `document.execCommand` som reserv för äldre webbläsare.

### `scripts/searchscript.js`

Läser `?search=`-frågeparametern vid sidladdning. Itererar alla `.collapsible`-knappar,
hittar den första skiftlägesokänsliga delsträngsmatchningen, scrollar till den, markerar
den kortvarigt i gult (`#ffd54f`) och öppnar den genom att anropa `.click()`.

### `scripts/settings.js`

Tillhandahåller `openSettings()`, `toggleReadingMode()`, `addReadingMode()` och
`removeReadingMode()`. Läslägestillståndet sparas i en cookie (`readingMode`,
sökväg `/`, max-age 1 år). I läsläge får `.collapsible`-, `.content`- och
`.button`-element klassen `reading-mode` (vit bakgrund, svart text).

### `scripts/footer.js`

Hämtar `partials/footer.html`, injicerar det i `#footer-container` och sätter
innevarande år i `#footer-year`. Injicerar också Goatcounter-analysskriptet.

---

## HTML-partialer

Delade HTML-fragment lagras i `/partials/` och laddas vid körning via `fetch`.
Det undviker att duplicera uppmärkning över 60+ sidor utan att behöva en
server-side-templatingmotor.

| Fil                     | Laddas av          | Injiceras i                |
|-------------------------|--------------------|----------------------------|
| `footer.html`           | `footer.js`        | `#footer-container`        |
| `main_header.html`      | `index.html` inline| direkt i index-sidan       |
| `spex_page_header.html` | `pagescript.js`    | `#spex-header-container`   |

> **Obs:** Eftersom partialer laddas med `fetch` misslyckas de vid lokal
> utveckling om du öppnar HTML-filer direkt från filsystemet (`file://`).
> Kör projektet med en lokal HTTP-server istället:
>
> ```bash
> npx serve .
> # eller
> python3 -m http.server
> ```

---

## CSS & designsystem

Alla stilar finns i `style.css`. Det finns ingen förprocessor.

### Färgpalett

| Roll                          | Värde                     |
|-------------------------------|---------------------------|
| Sidbakgrund                   | `rgb(210, 231, 250)`      |
| Kollapsbara knappar & innehåll | `#7ba4dbe0`              |
| Aktiv / hover                 | `#f4ce347e` (bärnsten)    |
| Länkknappar & sidfot          | `rgb(154, 85, 135)`       |
| Rubriker (`h2`)               | `rgba(170, 75, 143, 0.809)` |
| Räändom-knapp                 | `rgb(252, 219, 89)` / `color: brown` |

Varje spexsida åsidosätter `body { background-color: ... }` med sin egen unika
färg via ett inline-`<style>`-block i `<head>`.

### Typografi

- Typsnitt: `Georgia, Times, serif` överallt.
- Brödtextstorlek: webbläsarstandard (16 px).
- Kollapsbara knappar: 18 px; innehåll: 16 px.

### Layout

- Innehåll centreras med `max-width: 600px; width: 90%; margin: auto`.
- Tvåkolumnslayout använder `.row` (flexbox) / `.column` (flex: 50%).
- Inställningskugghjulet är absolut positionerat: `top: 90px; right: 5px`.

### Läsläge

Element i läsläge får klassen `reading-mode`. CSS-specificitet hanteras
med explicita selektorer (`button.reading-mode`, `div.reading-mode`, etc.)
för att åsidosätta standardblåtemat med vit bakgrund och svart text.

---

## PWA-konfiguration

`manifest.json` gör sajten installerbar som en Progressive Web App på mobil.

Nyckelfält:

```json
{
  "name": "Krischanstaspääxets Sajber-bajbel",
  "display": "standalone",
  "permissions": ["clipboard-write"],
  "icons": [
    { "src": "/assets/images/icon192x192_bgcolor.png", "sizes": "192x192" },
    { "src": "/assets/images/icon512x512_bgcolor.png", "sizes": "512x512" }
  ]
}
```

Om du uppdaterar sajtikonerna, regenerera båda storlekarna och ersätt filerna i
`/assets/images/`. Skärmdumparna i `manifest.json` är för närvarande inaktuella
(se [Kända fel](#kända-fel--planerade-funktioner)).

---

## Analys

[Goatcounter](https://www.goatcounter.com/) används för integritetsvänlig
sidvisningsspårning. Skriptet injiceras av `footer.js`:

```js
script.dataset.goatcounter = 'https://bajbeln.goatcounter.com/count';
script.src = '//gc.zgo.at/count.js';
```

Goatcounter använder varken cookies eller fingeravtryck. Trafikdata är synlig på
`https://bajbeln.goatcounter.com` (kräver inloggning).

---

## Kända fel & planerade funktioner

Se `todo` i repots rot för den auktoritativa backlogen. Sammanfattning:

### Fel
- Sökningen misslyckas för låtar med ensiffriga nummer i vissa sammanhang (t.ex. `stalin-10`).
- Långa rader i flerkolomnsläge bryts kanske inte korrekt.

### Planerade funktioner
- Direktlänkar till enskilda låtar (djuplänk till ett specifikt kollapsbart element).
- Nästlade kollapsbara element (behövs t.ex. för Pausfinalen i HC A).
- Abstrahera/deduplicera sök- och slumplogik som delas mellan `index.html` och spexsidor.
- Svartvit-/mörkt läge-inställning.
- In-app-guide eller knapp för "Lägg till på hemskärm" (PWA-installationsprompt).

### Innehållsluckor
- Vissa låtar saknas eller är ofullständiga (se `todo` för detaljer).
- PWA-skärmdumpar i `manifest.json` är inaktuella och bör tas om.
- Korrekturläsning av alla spextexter pågår.

---

*Utvecklad av Joel Takahashi Olsson, Jacob Annefors och Johan Furuhjelm.
Namn av August Bergöö.*
