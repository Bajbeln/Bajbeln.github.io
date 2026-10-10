# Bajbeln
Tillgänglig på [bajbeln.github.io](https://bajbeln.github.io/)

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

## Kontakt


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

## För utvecklare
Kräver **Node.js 18 eller nyare** (rekommenderat: 20). npm ingår i Node.js.

För att köra igång appen kör:
```
npm install   # krävs första gången
npm run start
```

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
