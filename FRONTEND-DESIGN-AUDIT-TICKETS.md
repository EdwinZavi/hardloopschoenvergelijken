# Frontend Design Audit en Uitgevoerde Tickets

Datum: 29 juni 2026  
Skill: design-taste-frontend-v1  
Scope: homepage, schoenenoverzicht, keuzehulp, vergelijken, productdetail, adviesroutes en trustpagina's.

## Samenvatting

De website had al een sterke basis: duidelijke routes, echte productfocus en veel trustcopy. De grootste frontend-risico's zaten niet in ontbrekende features, maar in visuele consistentie:

- Te veel globale kaartstijlen zorgden voor zware pagina's.
- Productkaarten waren op desktop bijna 1000px hoog en daardoor slecht scanbaar.
- Mobiele navigatie verborg items in horizontale overflow zonder duidelijke affordance.
- De vergelijkingspagina werkte, maar had te krappe mobiele spacing rond selectie, metrics en tabelhint.
- De stylesheet bevat meerdere historische homepage- en hero-regels, waardoor latere route-specifieke CSS soms de gewenste stijl overschreef.
- De typografie gebruikte nog `Inter` als fallback, terwijl de design-richtlijn vraagt om een sterker premium sans-profiel.

## Auditbevindingen

### 1. Designsystem en visuele stem

Probleem: de site wisselde tussen Material-achtige tokens, ronde marketingcards en compacte vergelijkingstabellen. Dat gaf minder productvertrouwen dan de inhoud verdient.

Oplossing: een final design-audit override-laag toegevoegd met premium neutrale tokens, rustiger schaduwgebruik, tabular numerics, betere motion easing en gerichte route-overrides.

Status: uitgevoerd.

### 2. Homepage

Probleem: de homepage had een sterke hero, maar de H1 was aan de grote kant en op mobiel bleef weinig hint van de volgende sectie zichtbaar.

Oplossing: herohoogte naar `dvh`/auto-collapse gebracht, H1 iets ingetoomd, mobiele hero compacter gemaakt en secties strakker ge-spaced.

Status: uitgevoerd.

### 3. Mobiele navigatie

Probleem: op 390px breedte stonden `Zo vergelijken we`, `NL` en `EN` buiten de zichtbare navrij.

Oplossing: mobiele nav mag nu wrappen in plaats van verborgen horizontaal doorlopen. Paddings en font-size zijn aangescherpt.

Status: uitgevoerd.

### 4. Catalogus en productkaarten

Probleem: productkaarten waren te hoog, gebruikten veel lege visualruimte en voelden als zware containers. Beschikbare productbeelden werden niet benut.

Oplossing: productcards gebruiken nu echte schoenbeelden wanneer `imageUrl` beschikbaar is, met fallback naar de bestaande abstracte visual. Card-grid, tekstregels, specs, spacing en media-ratio zijn compacter gemaakt.

Status: uitgevoerd.

### 5. Filterkolom

Probleem: filterpaneel voelde zwaar naast de productgrid en concurreerde visueel met resultaten.

Oplossing: filterpaneel visueel lichter gemaakt, sticky op desktop gehouden, mobiel statisch gemaakt en gaps gelijkgetrokken.

Status: uitgevoerd.

### 6. Vergelijkingspagina

Probleem: mobiel waren selectie, metrics en tabelhint krap. De gekozen-schoenenregel kapte te agressief af.

Oplossing: selectie-summary krijgt op mobiel meer ruimte, metric-cards zijn iets steviger gezet, tabelhint is als duidelijke inline capsule vormgegeven en compare spacing is aangescherpt.

Status: uitgevoerd.

### 7. Motion en toegankelijkheid

Probleem: er waren veel animaties en transitions zonder brede `prefers-reduced-motion` vangnetlaag.

Oplossing: finale reduced-motion guard toegevoegd en tactiele active states gecentraliseerd.

Status: uitgevoerd.

## Tickets

### FD-01 - Kalibreer design tokens en typografie

User problem: bezoekers moeten een rustige, premium vergelijkingssite ervaren, geen generieke affiliate UI.  
Product surface: globale layout en CSS.  
Scope: fonts, achtergrond, shadow, focus, buttons, motion.  
Ownership: `src/app/globals.css`.  
Do not change: routing, data, recommendation logic.  
Acceptance criteria: geen `Inter` als primaire/fallback premium-keuze, geen pure zwarte UI-basis, consistente neutralen, buttons met tactile state.  
Status: uitgevoerd.

### FD-02 - Maak mobiele navigatie volledig bereikbaar

User problem: mobiele bezoekers moeten alle primaire routes kunnen bereiken zonder verborgen overflow.  
Product surface: header/nav.  
Scope: mobiele nav-wrapping, kleinere pills, taalwissel behouden.  
Ownership: `src/app/globals.css`, `src/components/SiteChrome.tsx` alleen indien nodig.  
Do not change: nav-IA.  
Acceptance criteria: geen horizontale document-overflow, alle nav-items bereikbaar op 390px.  
Status: uitgevoerd in CSS.

### FD-03 - Verlaag productcard-dichtheid en gebruik echte productmedia

User problem: bezoekers moeten snel meerdere schoenen kunnen scannen.  
Product surface: cataloguskaarten en aanbevelingskaarten.  
Scope: cardhoogte, media, tekstclamp, specs, footer-density.  
Ownership: `src/components/ProductCard.tsx`, `src/app/globals.css`.  
Do not change: productdata of sortering.  
Acceptance criteria: productcards zijn scanbaar, tonen echte beelden waar aanwezig, fallback blijft werken.  
Status: uitgevoerd.

### FD-04 - Maak filter en catalogus rustiger

User problem: filters moeten narrowing ondersteunen zonder visuele ruis.  
Product surface: `/schoenen`.  
Scope: filterpaneel, result toolbar, grid spacing.  
Ownership: `src/app/globals.css`.  
Do not change: filterparams of server rendering.  
Acceptance criteria: filterpaneel is licht, desktop sticky, mobiel statisch, grid blijft binnen viewport.  
Status: uitgevoerd.

### FD-05 - Verbeter mobiele vergelijking

User problem: vergelijking moet op mobiel leesbaar blijven ondanks tabellen.  
Product surface: `/vergelijken`.  
Scope: selected bar, difference grid, mobile table hint, spacing.  
Ownership: `src/app/globals.css`.  
Do not change: URL-state, tabeldata of comparison logic.  
Acceptance criteria: gekozen schoenen zijn leesbaar, metrics raken elkaar niet, tabelscroll is bewust.  
Status: uitgevoerd.

### FD-06 - Voeg motion guard en interaction feedback toe

User problem: de site mag levendig voelen, maar niet onrustig of ontoegankelijk.  
Product surface: globale interactiestates.  
Scope: `:active` states, reduced motion, transition timing.  
Ownership: `src/app/globals.css`.  
Do not change: bestaande server/client boundaries.  
Acceptance criteria: `prefers-reduced-motion` reduceert animaties, controls voelen tastbaar.  
Status: uitgevoerd.

### FD-07 - Trek echte productmedia door naar detail en vergelijking

User problem: bezoekers vertrouwen productpagina's en vergelijkingskeuzes sneller wanneer ze het echte model zien waar beelddata beschikbaar is.  
Product surface: productdetail, keuzehulp-resultaten, vergelijkingspicker.  
Scope: echte `imageUrl` tonen met fallback naar abstracte schoenvisual.  
Ownership: `src/app/schoenen/[slug]/page.tsx`, `src/components/RecommendationCard.tsx`, `src/components/CompareShoePickerItem.tsx`, `src/app/globals.css`.  
Do not change: productdata, ranking, recommendation logic.  
Acceptance criteria: echte beelden verschijnen waar aanwezig, fallback blijft werken, layout blijft binnen desktop en mobiele viewport.  
Status: uitgevoerd.

### FD-08 - Maak productdetail hero meer premium en minder kaart-op-kaart

User problem: de productdetailpagina is het moment waarop bezoekers vertrouwen moeten krijgen in één specifiek model.  
Product surface: `/schoenen/[slug]`.  
Scope: hero-container, productmedia, scorepaneel, beslissignalen.  
Ownership: `src/app/globals.css`.  
Do not change: score-inhoud, prijsdisclosure, methodologie.  
Acceptance criteria: productbeeld en score voelen als één productmodule, geen zware geneste kaarten, mobiel éénkoloms.  
Status: uitgevoerd.

### FD-09 - Maak keuzehulpresultaten compacter

User problem: na de keuzehulp wil de bezoeker snel begrijpen welke aanbevelingen het waard zijn om te openen of te vergelijken.  
Product surface: `/keuzehulp` resultaatstap.  
Scope: recommendation card media, score row, trade-off spacing en actieknoppen.  
Ownership: `src/components/RecommendationCard.tsx`, `src/app/globals.css`.  
Do not change: matchscore, recommendation ranking of uitleg.  
Acceptance criteria: recommendation cards zijn duidelijk korter, behouden matchscore en trade-off, desktopacties staan compact naast elkaar.  
Status: uitgevoerd.

## Open vervolgpunten

- De stylesheet bevat nog historische duplicatie. Een latere refactor kan CSS per route ordenen, maar dat is bewust niet volledig in deze ronde gedaan om regressies te vermijden.
- Productbeelden zijn maar voor een deel van de catalogus beschikbaar. Verdere beelddekking hoort bij een data/media-ticket.
- Een echte mobile menu-component kan later, maar zou een extra client boundary vragen. Voor nu is CSS-wrapping de server-first oplossing.
