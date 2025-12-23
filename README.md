# Bingo (PWA) – uppesittarkväll 2025

Mobilanpassad bingoapp för Marcus och Philip. Ingen inloggning, ingen backend. Allt sparas lokalt (IndexedDB) och funkar offline som installerbar PWA.

## Kom igång
- `npm install`
- `npm run dev` – starta lokalt
- `npm run build` – producera produktionsbuild
- `npm run preview` – testa produktionsbuilden

## Redigera lotter
- Filer: `src/tickets.ts`
- Struktur per användare:
  - `series`: valfri text
  - `ticketNumber`: valfri text/nummer
  - `games`: 5 spel
    - varje spel har 3 block
    - varje block är ett 5x5-nät av siffror
- Byt ut placeholder-siffrorna direkt i arrayerna (inga dolda funktioner).
- Exempel (ett block):
  ```ts
  [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20],
    [21, 22, 23, 24, 25],
  ]
  ```

## State och lagring
- Allt sparas i IndexedDB med nyckeln `bingo_state_v1`.
- Sparat innehåll: vald användare, valt spel och alla markeringar per spel/block/ruta.
- Skrivningar debouncas (~200 ms) för att minska antal writes.
- Export/import finns i hamburgermenyn:
  - Export: kopierar JSON till clipboard.
  - Import: klistra in JSON i textfältet och importera.

## PWA-installation
- **iOS (Safari)**: öppna sidan, dela-ikonen → "Lägg till på hemskärmen".
- **Android (Chrome)**: öppna sidan, meny ⋮ → "Installera app" / "Lägg till på startskärmen".
- Appen har manifest + service worker (auto-update) och fungerar offline efter första inladdning.

## Deploy på GitHub Pages (bingo.marcusboberg.se)
- Custom domain: `public/CNAME` är satt till `bingo.marcusboberg.se`. Lägg till samma domän i GitHub → Settings → Pages.
- Workflow: `.github/workflows/deploy.yml` bygger och publicerar till Pages vid push till `main`.
- Bas-URL:
  - Med custom domain (bingo.marcusboberg.se): behåll `VITE_BASE='/'` (default).
  - Utan custom domain och om du kör `username.github.io/bingo`: sätt `VITE_BASE='/bingo/'` i workflow-steget “Build”.
- Efter första deploy: surfa till sidan och installera PWA som vanligt.

## Design/UX
- Mobil-first, optimerad för Safari iOS och Chrome Android.
- Flytande menyknapp (☰) för att byta användare/spel och för export/import.
- Senast vald användare återställs automatiskt vid start.
- En spelvy åt gången; rutnätet kan scrollas på små skärmar.
