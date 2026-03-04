# Bajbeln
Tillgänglig på [bajbeln.github.io](https://bajbeln.github.io/)

## Låtar
Låtarna finns som filer i `/spex`, originaldokumenten de är tagna ifrån finns i `/assets/song_files`

## Kontakt


## Lägga till ett spex
Se `docs/dev-manual.md` för fullständiga instruktioner. Kortversion:

Kopiera mallen `src/spex/_template_single/` (enskild uppsättning) eller `src/spex/_template_multi/` (återuppsättning), fyll i frontmatter och skapa en `.md`-fil per låt. Mallen innehåller kommentarer som förklarar varje fält. Glöm inte att gärna lägga till källfilen i `assets/song_files`

## För utvecklare
En preliminär utvecklarmanual finns här: `docs/dev-manual.md`

Kräver **Node.js 18 eller nyare** (rekommenderat: 20). npm ingår i Node.js.

För att köra igång appen kör:
```
npm install   # krävs första gången
npm run start
```

## På gång & kända fel (mer på `todo`)
Korrläsning av alla spex (på gång)

Sökfunktionen ger fel ibland, oftast beror det på att titeln inte skrivits in rätt i songIndex eller i spexsidan. Kontrollera då så att de två överensstämmer med varandra. (Fel i songIndex gäller ej i ny struktur)

## Tack till
- Kodning har gjorts av Joel Takahashi Olsson, Jacob Annefors och Johan Furuhjelm.
- Särskilt tack till August Bergöö för namngivande.
