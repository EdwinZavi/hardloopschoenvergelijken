# Quality Audit & Test Tickets - 2026-07-04

## Doel

Een brede kwaliteitsronde voor hardloopschoenvergelijken.nl: functionaliteit testen, vakgebied-audits verzamelen en tickets maken die de website dichter bij een foutarme, betrouwbare vergelijkingssite brengen.

## Uitgevoerde validatie

- TypeScript: `npm run typecheck`
- Unit/contract tests: `npm test`
- Nieuwe testdekking:
  - catalogusdata en vergelijkingsvelden
  - offer-publicatieregels
  - recommendation-rules contract
  - homepage volgorde en verwijderde M3-sectie
  - API-field parity
  - vergelijkingstabel accessible labels
  - sitemap lastModified-regressie

## Direct Aangepast

- Public offer logic is fail-closed gemaakt:
  - ontbrekende `offerStatus` is niet meer impliciet verified
  - `example.com`, subdomeinen van `example.com`, `localhost`, `127.0.0.1`, `0.0.0.0`, `::1` en ongeldige URLs blijven privé
  - public offers vereisen `verified`, publieke voorraadstatus en geldige `lastCheckedAt`
- JSON-fallback en Supabase repository gebruiken dezelfde offer-publicatieregels.
- Catalog API levert nu ook filter-, vergelijking- en explainabilityvelden.
- Vergelijkingstabel heeft unieke accessible labels voor bekijken/verwijderen per schoen.
- Sitemap gebruikt een expliciete contentdatum in plaats van request-time `new Date()`.

## Agent Analyse Samenvatting

### UX/Product Flow

Belangrijkste risico's:
- keuzehulp-context verdwijnt na resultaat richting productdetail/vergelijking
- adviespagina-CTA's voelen persoonlijker dan de vervolgflow nu waarmaakt
- voorlopige datastatus is te impliciet in catalogus, aanbevelingen en prijslaag
- een vergelijking met 1 schoen vraagt te veel interpretatie van de gebruiker
- prijs-in-voorbereiding eindigt nog te vaak als dead end

### Data & Recommendation Logic

Belangrijkste risico's:
- publieke flows gebruikten niet overal dezelfde catalogusbron
- offer-publicatie stond te open bij ontbrekende status
- recommendation-rules JSON is deels documentatie, deels bron, maar scoring is hardcoded
- budget wordt gevraagd terwijl er 0 publieke prijzen zijn
- afstandsbuckets en `medium` blessuregevoeligheid zijn niet volledig in scoring verwerkt

### Frontend & Accessibility

Belangrijkste risico's:
- header gebruikt overal home-overlay styling
- mobiele nav verbergt primaire routes zonder volwaardig menu-alternatief
- carousel beweegt continu zonder zichtbare pause/stop voor touchgebruikers
- vergelijkingstabel had herhaalde linklabels
- trustkritische kaarttekst wordt soms afgekapt

### Content, SEO & Trust

Belangrijkste risico's:
- EN-routes zijn indexeerbaar, maar trust/legal content is dunner dan NL
- EN HTML heeft geen echte route-level `html lang="en"` en mist hreflang/canonical parity
- homepage toont hard-coded populaire/release schoenen die niet allemaal in de catalogus zitten
- budgetcopy suggereert meer werking dan mogelijk is zonder publieke prijsdata
- sitemap gebruikte kunstmatige versheid
- structured data voor Product, ItemList en BreadcrumbList ontbreekt nog grotendeels

## Ticketcluster 1 - Testfundament

### QA-01 Breid tests uit naar route-rendering

User problem: we weten nu dat data/source-contracts kloppen, maar nog niet dat elke route visueel en interactief foutloos rendert.

Scope:
- Playwright of Vercel agent-browser route tests voor NL en EN.
- Routes: `/`, `/schoenen`, `/keuzehulp`, `/vergelijken`, `/advies`, `/methodologie`, `/onafhankelijkheid`, `/contact`, productdetail, adviesdetail.

Acceptatie:
- elke route geeft 200
- elke route heeft 1 zichtbare H1
- geen body horizontal overflow op 320, 390, 820, 1280
- geen console errors
- primaire CTA's bestaan en linken naar geldige routes

### QA-02 Axe/accessibility testlaag toevoegen

Scope:
- axe-core of vergelijkbare browser-AX checks.
- Focus op header, filters, keuzehulp, carousel, vergelijkingstabel en footer.

Acceptatie:
- geen critical/serious axe violations op primaire routes
- alle herhaalde links hebben unieke accessible names
- focusvolgorde is logisch
- disabled states hebben programmatische uitleg

### QA-03 Recommendation engine unit tests

Scope:
- echte `getRecommendations(profile)` testen zodra TS/JSON import betrouwbaar via test runner loopt of logica naar pure testbare module is verplaatst.

Acceptatie:
- profile presets uit `recommendation-rules.json` leveren verwachte sterke matches
- beginner + carbon/race wordt afgestraft
- trail-profiel geeft trailmodellen voorrang
- wide fit-profiel bevoordeelt brede/roomy schoenen
- budget zonder publieke prijsdata toont geen budgetclaim

## Ticketcluster 2 - Trust & Data

### DATA-01 Een publieke catalogusrepository voor alle flows

Acceptatie:
- keuzehulp, catalogus, vergelijken, productdetail en API gebruiken dezelfde server-side repository
- JSON is fallback, Supabase is optioneel
- source/fallbackReason is intern testbaar
- dezelfde derived shape wordt overal gebruikt

### DATA-02 Offer-publicatie uitbreiden naar retailer-readiness

Acceptatie:
- verified offer vereist actieve retailer, geldige `lastCheckedAt`, non-placeholder URL, voorraadstatus en match met catalogusschoen
- affiliate/commercial velden worden niet verloren
- tests dekken `example.com`, `localhost`, expired, rejected, missing status en missing freshness

### DATA-03 Taxonomie centraliseren

Acceptatie:
- `primaryUseCase` en `distanceBucket` hebben centrale typed config
- labels, filters, API en recommendation logic gebruiken dezelfde waarden
- onbekende waarden falen in datavalidatie

## Ticketcluster 3 - UX & Beslisflow

### UX-01 Keuzehulp-context behouden

Acceptatie:
- resultaatdetail toont matchscore, profielsamenvatting, redenen en trade-offs
- productdetail vanuit keuzehulp behoudt context of toont "terug naar mijn advies"
- vergelijking vanuit keuzehulp toont profielcontext boven de tabel

### UX-02 Een-schoen vergelijking verbeteren

Acceptatie:
- CTA heet "Vergelijk met alternatieven"
- `/vergelijken?ids=1-model` toont aanbevolen tweede opties
- gebruiker ziet waarom die alternatieven relevant zijn

### UX-03 Prijs-in-voorbereiding als nuttige state

Acceptatie:
- productdetail zonder offers geeft vervolgstappen: vergelijken, specs controleren, methode lezen
- geen budget/prijsclaim zonder publieke prijsdata
- catalogus en keuzehulp leggen uit dat prijs nog niet meeweegt

## Ticketcluster 4 - Frontend & Accessibility

### FE-01 Header responsive hardening

Acceptatie:
- alle primaire nav-items blijven bereikbaar op 320-560px
- geen overlap met content op publieke routes
- taalwisselaar heeft duidelijke labels
- geen primaire route verdwijnt zonder menu-alternatief

### FE-02 Carousel motion controls

Acceptatie:
- auto-motion heeft pauze/stop of wordt vervangen door handmatige scroll
- `prefers-reduced-motion: reduce` stopt drift/float
- touch- en keyboardgebruikers kunnen kaarten rustig bedienen
- duplicaten blijven `aria-hidden` en niet focusbaar

### FE-03 Card content zonder trustverlies

Acceptatie:
- "Past vooral bij", trade-offs en waarschuwingen worden niet zonder alternatief afgekapt
- cardcopy heeft scanbare compacte variant plus volledige uitleg op detail/expand

## Ticketcluster 5 - Content, SEO & Legal

### SEO-01 I18n SEO-contract

Acceptatie:
- NL/EN routes hebben canonical en hreflang-paar
- EN routes hebben echte language semantics of worden tijdelijk noindex
- sitemap bevat alleen routes met voldoende contentkwaliteit

### SEO-02 EN trust parity

Acceptatie:
- EN methodology, independence, privacy, cookies en contact bevatten dezelfde kern-disclosures als NL
- "Verified prices" verschijnt alleen wanneer echte publieke offers bestaan
- affiliate/commercial labels werken in NL en EN

### SEO-03 Homepage cataloguswaarheid

Acceptatie:
- "populaire" en "uitgelichte" schoenen komen uit `getEnrichedShoes()`
- hard-coded marktmodellen krijgen expliciet label als ze nog niet in catalogus zitten
- elke schoenkaart linkt naar detail wanneer het model in de catalogus bestaat

### SEO-04 Structured data uitbreiden

Acceptatie:
- productdetail heeft Product schema zonder fake offers/reviews
- catalogus heeft ItemList schema
- adviespagina's hebben BreadcrumbList
- JSON-LD is parsebaar en veilig geescaped

## Uitgevoerde Batch 2 - QA-01/QA-02 basislaag

Status:
- `npm run test:routes` toegevoegd voor publieke route-smoke checks tegen een draaiende lokale site.
- 14 publieke pagina's plus `/api/catalog/shoes` renderen met `200`, een `<main>`, precies een `<h1>` en kerncopy.
- `tests/accessibility-source-contract.test.mjs` toegevoegd voor taalwisselaar, mobiele header, carousel-motion en disabled compare states.
- Mobiele header verbergt geen primaire navigatielinks meer op kleine schermen.
- Taalwisselaar heeft nu labels voor geselecteerde taal en doeltaal.
- Carousel stopt auto-motion voor touch en `prefers-reduced-motion`.
- Uitgeschakelde vergelijkacties leggen uit hoe de gebruiker de limiet kan oplossen.

Validatie:
- `npm test` groen: 20 tests.
- `npm run test:routes` groen: 15 route/API checks.
- `npm run typecheck` groen.
- `npm run build` groen: 115 statische pagina's gegenereerd.

## Open Risico's

- Er is nog geen browser-E2E dependency in de repo.
- De nieuwe testlaag bevat nu route-smoke checks, maar nog geen echte axe/visual screenshot assertions.
- EN content is publiek, maar nog niet trust-parity met NL.
- Recommendation scoring is nog niet volledig data-driven vanuit `recommendation-rules.json`.

## Aanbevolen Volgende Batch

1. QA-03: Playwright/axe of vergelijkbare browserlaag toevoegen voor screenshots, console errors en echte accessibility violations.
2. SEO-03: homepage cataloguswaarheid herstellen.
3. UX-01: keuzehulp-context door productdetail en vergelijking trekken.
4. SEO-01/SEO-02: EN routes correct indexeerbaar maken of tijdelijk noindexen.
5. UX-02: productdetail en vergelijking sterker koppelen met alternatieven en trade-off uitleg.
