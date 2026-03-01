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
Experimentell migrering till ny sidstruktur. 

 - Fördelar för användare: Nya funktioner som att kunna kopiera länk till enskild låt, potentiella nya funktioner som att kunna välja att söka efter låttext. Kortare länkar! `bajbeln.github.io/spex/leonardo/` blir `bajbeln.github.io/leonardo/`

- För utvecklare: Betydligt lättare att underhålla. Alla låtar är i sina egna .md-filer och byggs sedan ihop till sidor efter ett fåtal mallar - en justering i mallen påverkar alla sidorna. En korrigering i en av originalsångerna speglas direkt till korresponderande sång i favoriter-sidan. Lättare att underhålla då sångfilerna har automatisk radbrytning. Förhoppningsvis färre manuella steg genom automatisk tilläggning i startsida och i sökindex. Mer strukturerat än innan då allt för ett visst spex låg i samma fil - nu ligger de i samma mapp. Borde underlätta en eventuell övergång till en dynamisk sida.

Korrläsning av alla spex (på gång)

Sökfunktionen ger fel ibland, oftast beror det på att titeln inte skrivits in rätt i songIndex eller i spexsidan. Kontrollera då så att de två överensstämmer med varandra. (Fel i songIndex gäller ej i ny struktur)

## Tack till
- Kodning har gjorts av Joel Takahashi Olsson, Jacob Annefors och Johan Furuhjelm.
- Särskilt tack till August Bergöö för namngivande.
