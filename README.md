# Bajbeln
Tillgänglig på [bajbeln.github.io](https://bajbeln.github.io/)

## Låtar
Spexen finns som filer i `/src/spex`, där kupletterna finns som .md-filer. Originaldokumenten de är tagna ifrån finns i `/assets/song-files`.

## Kontakt


## Lägga till ett spex
Kopiera mall-mappen `/src/spex/_template_single` för enkeluppsättningsspääx eller `/src/spex/_template_multi` för fleruppsättningsspääx och anpassa den för spääxet i fråga.

Lägg sedan in spexet i `src/_data/spexlist.json` så att det dyker upp på startsidan.

Glöm inte att du gärna får lägga till källfilen i `assets/song_files`.

## För utvecklare
Kräver **Node.js 18 eller nyare** (rekommenderat: 20). npm ingår i Node.js.

För att köra igång appen kör:
```
npm install   # krävs första gången
npm run start
```

## På gång & kända fel (mer på `todo`)
- Korrläsning av alla spex (på gång)

## Tack till
- Kodning har gjorts av Joel Takahashi Olsson, Jacob Annefors och Johan Furuhjelm.
- Särskilt tack till August Bergöö för namngivande.
