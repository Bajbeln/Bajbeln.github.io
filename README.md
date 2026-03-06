# Bajbeln
Tillgänglig på [bajbeln.github.io](https://bajbeln.github.io/)

## Låtar
Låtarna finns som filer i `/spex`, originaldokumenten de är tagna ifrån finns i `/assets/song_files`

## Kontakt


## Lägga till ett spex
Kopiera mallen `/spex/spex_sample.html` och anpassa den för ditt spex. Lägg sedan in låtarna i `SongIndex.json` och spexet i -`index.html` Glöm inte att du gärna får lägga till källfilen i `assets/song_files`

## För utvecklare
Kräver **Node.js 18 eller nyare** (rekommenderat: 20). npm ingår i Node.js.

För att köra igång appen kör:
```
npm install   # krävs första gången
npm run start
```

## På gång & kända fel (mer på `todo`)
Korrläsning av alla spex (på gång)

Sökfunktionen ger fel ibland, oftast beror det på att titeln inte skrivits in rätt i songIndex eller i spexsidan. Kontrollera då så att de två överensstämmer med varandra.

## Tack till
- Kodning har gjorts av Joel Takahashi Olsson, Jacob Annefors och Johan Furuhjelm.
- Särskilt tack till August Bergöö för namngivande.
