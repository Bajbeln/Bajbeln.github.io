# Bajbeln
![Made with Eleventy](https://img.shields.io/badge/Made%20with-11ty-000?logo=11ty&logoColor=fff)
[![Node.js](https://img.shields.io/badge/Node.js-24+-green)](https://nodejs.org/)
![Uppsättningar](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/Bajbeln/Bajbeln.github.io/main/src/_data/stats.json&query=$.uppsattningarCount&label=Uppsättningar&color=blue)
![Kupletter](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/Bajbeln/Bajbeln.github.io/main/src/_data/stats.json&query=$.songCount&label=Kupletter&color=green)
![Repo created](https://img.shields.io/github/created-at/Bajbeln/Bajbeln.github.io)
![Last commit](https://img.shields.io/github/last-commit/Bajbeln/Bajbeln.github.io?label=Updated)


Tillgänglig på [bajbeln.github.io](https://bajbeln.github.io/)

## Kontakt/förslag
I [denna enkät](https://forms.gle/xMGhpRM44DPYhipG7) kan du fylla i om du tycker att något saknas, fungerar mindre bra eller bara borde implementeras i Bajbeln!

## Låtar

Spexen finns som filer i [`src/spex`](./src/spex), där kupletterna finns som
`.md`-filer. Originaldokumenten de är tagna ifrån finns i
[`assets/song-files`](./assets/song-files).

## Projektstruktur

- [`src/`](./src) – källfiler och mallar för webbplatsen
- [`src/spex/`](./src/spex) – spex och kupletter
- [`src/_data/`](./src/_data) – metadata, bland annat spexlistan
- [`assets/`](./assets) – bilder och originaldokument
- [`partials/`](./partials) – återanvändbara HTML-delar
- [`scripts/`](./scripts) – JavaScript för webbplatsens funktioner
- [`_site/`](./_site) – genererade filer; ändra inte dessa manuellt

## Lägga till ett spex

Kopiera mall-mappen [`src/spex/_template_single`](./src/spex/_template_single)
för enkeluppsättningsspääx eller
[`src/spex/_template_multi`](./src/spex/_template_multi) för
fleruppsättningsspääx och anpassa den för spääxet i fråga.

Lägg sedan in spexet i `src/_data/spexlist.json` så att det dyker upp på
startsidan.

Glöm inte att du gärna får lägga till källfilen i
[`assets/song-files`](./assets/song-files).

Mer information finns i:

- [Utvecklarmanualen](./docs/dev-manual.md)
- [Kvalitetskontroll av sångtexter](./docs/songtext-quality-control.md)
- [Kontroll av sidor](./docs/page-check.md)
- [Attributioner](./attributions.md)

## För utvecklare

Kräver **Node.js 18 eller nyare** (rekommenderat: 24). npm ingår i Node.js.

För att köra igång appen kör:

```
npm install   # krävs första gången
npm run start
```

> **Notera:** OG-bilder (Open Graph) genereras **inte** automatiskt. Kör `npm run generate:og-images` manuellt efter ändringar (t.ex. nya spex eller ändrade färger). Skriptet är **inkrementellt** – det regenererar endast nya eller ändrade bilder. Använd `npm run generate:og-images -- --force` för att regenerera alla bilder.
>
> **Systemkrav för OG-bilder:** Skriptet kräver ImageMagick och jq. Installera med:
>
> - **macOS (Homebrew):** `brew install imagemagick jq`
> - **Linux (Debian/Ubuntu):** `sudo apt-get install imagemagick jq`
> - **Linux (Fedora/RHEL):** `sudo dnf install ImageMagick jq`
>   xargs och stat ingår normalt i Unix-lika system.

## Publicering

Webbplatsen publiceras på [bajbeln.github.io](https://bajbeln.github.io/) med
GitHub Pages. Arbetsflödet
[`deploy_try.yml`](./.github/workflows/deploy_try.yml) bygger webbplatsen med
Eleventy och distribuerar den genererade mappen `_site/`. En ny publicering
sker automatiskt när ändringar pushas till `main`.

## På gång & kända fel (mer på `todo`)

- Korrläsning av alla spex (på gång)

## Tack till

- Kodning har gjorts av Joel Takahashi Olsson, Jacob Annefors och Johan Furuhjelm.
- Särskilt tack till August Bergöö för namngivande.
