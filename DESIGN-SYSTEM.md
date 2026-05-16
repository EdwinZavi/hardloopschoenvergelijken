# DESIGN-SYSTEM.md

## Richting

Loopwijzer gebruikt Material 3 als basis voor het interface-systeem.

We kopieren Material 3 niet letterlijk als generieke Google-app. We vertalen de principes naar een rustige Nederlandse vergelijkingssite voor hardloopschoenen:

- duidelijke keuzehierarchie
- vertrouwen boven verkoopdruk
- heldere states voor filters, selectie en vergelijking
- zachte surfaces met voldoende contrast
- ronde, toegankelijke controls
- rustige motion die orientatie geeft

## Material 3 Principes Voor Loopwijzer

### 1. Color Roles

Gebruik kleur als functionele rol, niet als decoratie.

- `primary`: hoofdacties, actieve selectie, voortgang en vergelijkacties.
- `secondary`: ondersteunende navigatie, filtercontext en rustige UI-accenten.
- `tertiary`: nuance, aandachtspunten en redactionele labels.
- `surface`: pagina-achtergrond en rustige contentvlakken.
- `surface-container`: cards, filterpanelen, tabellen en trustblokken.
- `outline`: borders, scheidingen en inactieve controls.
- `success`: bevestigde trustsignalen, niet algemene decoratie.

De CSS-tokenlaag staat in `src/app/globals.css` met `--md-sys-*` variabelen. De oude tokens zoals `--brand`, `--surface` en `--line` blijven als aliases bestaan zodat bestaande componenten stabiel blijven.

## Shape

Material 3 gebruikt rondere vormen dan de oorspronkelijke MVP-stijl.

Loopwijzer-regels:

- buttons en chips: volledig rond, `999px`
- cards en panels: `16px`
- compacte velden en kleine badges: `8px`
- grote hero-containers: `28px`

Rondheid moet vertrouwen en rust ondersteunen. Gebruik geen overdreven pill-vormen voor grote informatieve cards.

## Elevation

Gebruik elevation spaarzaam.

- `elevation-1`: header, subtiele vaste UI en compacte containers
- `elevation-2`: cards en panels bij normale focus
- `elevation-3`: hero of belangrijke visuele containers

Vermijd zware schaduwen op elke kaart. Informatiedichtheid en scanbaarheid blijven belangrijker dan decoratieve diepte.

## Typography

De site blijft bij een heldere sans-serif stack:

`Atkinson Hyperlegible`, `Inter`, `Source Sans 3`, system fonts.

Typografieregels:

- H1 is alleen groot in echte hero's.
- Compacte panels gebruiken kleinere, strakkere headings.
- Bodycopy blijft minimaal 16px.
- Labels en eyebrows zijn functioneel, niet schreeuwerig.
- Letter spacing blijft `0`.

## Components

### Buttons

Material 3 button-vertaling:

- primary button: gevuld met `primary`
- secondary button: outlined/transparent met `outline`
- minimumhoogte: 44px
- ronde vorm
- duidelijke focusring

Gebruik buttons alleen voor duidelijke acties zoals keuzehulp starten, vergelijken, filteren of bekijken.

### Cards

Cards gebruiken:

- `surface-container-low` of `surface`
- `outline-variant` border
- `16px` radius
- subtiele elevation alleen als de kaart belangrijk of interactief is

Productcards moeten scanbaar blijven: beeld, merk/model, korte uitleg, belangrijkste specs, score en actie.

### Filters

Filters volgen Material 3 control-logica:

- duidelijke labels
- compacte inputvelden
- geselecteerde filters als chips
- actieve states zichtbaar via `primary-container`
- geen overbodige visuele druk

### Hero Headers

Publieke hoofdheaders gebruiken waar passend een beeldheader met transparante foto en donkere leeslaag.

Regels:

- tekst moet altijd leesbaar blijven
- achtergrondbeeld ondersteunt context, niet andersom
- niet elke subsectie krijgt een hero
- gebruik beeldheaders vooral op hoofdroute-niveau

## Trust UX

Material 3 ondersteunt vertrouwen door consistentie. Voor Loopwijzer betekent dat:

- productscore, persoonlijke match en prijsinformatie blijven visueel gescheiden
- koopinformatie mag nooit aanvoelen als redactionele aanbeveling
- commerciële uitleg is rustig, zichtbaar en feitelijk
- onzekerheid wordt benoemd zonder de site als onaf te laten voelen

## Implementatieregels

1. Voeg nieuwe UI eerst toe via tokens in `globals.css`.
2. Hergebruik bestaande componenten voordat je nieuwe varianten maakt.
3. Gebruik Material 3-rollen, geen losse hex-kleuren in nieuwe componenten.
4. Controleer desktop en mobiel voordat een UI-wijziging klaar is.
5. Run minimaal:

```bash
npm run typecheck
npm run build
```

## Niet Doen

- Geen Material UI-library installeren zonder duidelijke reden.
- Geen kleurrijke, app-achtige drukte toevoegen.
- Geen grote radius op tabellen of informatieblokken als dat scanbaarheid verlaagt.
- Geen animaties die filters, vergelijkingstabellen of keuzehulp trager laten voelen.
- Geen visuele stijl die lijkt op een webshop of kortingssite.
