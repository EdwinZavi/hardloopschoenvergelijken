# Reviews MVP Tickets

Datum: 31 mei 2026  
Owner-agent: Reviews & Community Trust Agent  
Scope: AUD-004 - Review-MVP zonder nep-social-proof

## Context

Hardloopschoenvergelijken.nl wil gebruikers helpen vertrouwen opbouwen via redactionele uitleg, productvergelijking, prijsinformatie en echte gebruikerservaringen. De bestaande documentatie noemt al `UserReview`, `ReviewAggregate`, reviewscore en review count, maar er is nog geen concreet MVP-contract voor publieke reviewweergave, moderatie of score-scheiding.

Deze specificatie voegt geen reviews, sterren, scores of productdata toe. Het doel is een bouwbaar contract waarmee latere agents parallel kunnen werken zonder fake social proof te introduceren.

## Geinspecteerde Context

- `SCHEMA.md`: bevat eerste schets voor `UserReview` en `ReviewAggregate`.
- `PAGES.md`: productpagina verwacht een review summary, review badge en optioneel een reviews overview page.
- `PRODUCT.md`: reviews moeten context geven over type loper, afstand, ondergrond, pasvorm, comfort en duurzaamheid.
- `src/types/product.ts`: bevat nu alleen product-, score- en offer-types; nog geen reviewtypes.
- `src/app/schoenen/[slug]/page.tsx`: productpagina heeft nu redactionele score, specs, prijs en alternatieven, maar nog geen reviewmodule.

## MVP Doel

Maak reviews nuttig als ervaringssignaal, niet als los populariteitscijfer. Een gebruiker moet kunnen zien of ervaringen komen van lopers die lijken op hun eigen situatie, terwijl redactionele score, persoonlijke match en winkelinformatie zichtbaar gescheiden blijven.

## Niet In Scope

- Geen nep-reviews of seed reviews.
- Geen sterren, gemiddelden of "meest beoordeeld" labels zonder echte goedgekeurde reviews.
- Geen reviewhub bouwen voordat model, moderatie en publieke states akkoord zijn.
- Geen seller reviews mengen met schoenreviews.
- Geen reviewscore gebruiken in aanbevelingslogica in de eerste implementatie.

## Reviewmodel V1

### `UserReview`

Minimaal veldcontract voor toekomstige implementatie:

| Veld | Type | Vereist | Publiek | Notitie |
| --- | --- | --- | --- | --- |
| `id` | string | ja | nee | Interne review-id. |
| `shoeId` | string | ja | ja | Verwijst naar de schoenvariant. |
| `reviewerAlias` | string | nee | ja | Korte schermnaam; geen volledig profiel nodig voor MVP. |
| `runnerLevel` | enum | ja | ja | Context: beginner, recreatief, ervaren of wedstrijdgericht. |
| `typicalDistance` | enum | ja | ja | Afstand waarvoor de schoen vooral is gebruikt. |
| `primarySurface` | enum | ja | ja | Zelfde taal als productondergrond: weg, baan, trail of gemengd. |
| `fitExperience` | enum | ja | ja | Pasvormervaring zoals normaal, smal, ruim, hielslip of druk bij tenen. |
| `overallRating` | number 1-5 | ja | ja | Gebruikersscore, alleen afkomstig uit echte reviewinvoer. |
| `comfortRating` | number 1-5 | ja | ja | Ervaringsscore voor comfort. |
| `durabilityRating` | number 1-5 | ja | ja | Ervaringsscore voor duurzaamheid na gebruik. |
| `body` | string | ja | ja | Vrije tekst met ervaring, minimaal 80 tekens. |
| `moderationStatus` | enum | ja | nee | Bepaalt publicatie. Alleen `approved` is publiek. |
| `submittedAt` | ISO datetime | ja | ja | Toon als maand/jaar of relatieve datum. |
| `updatedAt` | ISO datetime | nee | nee | Voor correcties en moderatiegeschiedenis. |
| `verifiedPurchase` | boolean | nee | ja | Alleen tonen als controleerbaar; anders verbergen. |
| `moderationReason` | string | nee | nee | Interne reden bij afwijzen of verbergen. |

### Enums

Aanbevolen startwaarden:

```ts
type ReviewRunnerLevel = "beginner" | "recreational" | "experienced" | "competitive";

type ReviewTypicalDistance =
  | "up_to_5k"
  | "5k_to_10k"
  | "10k_to_half_marathon"
  | "half_marathon_plus"
  | "varied";

type ReviewSurfaceType = "road" | "track" | "trail" | "mixed";

type ReviewFitExperience =
  | "true_to_size"
  | "runs_small"
  | "runs_large"
  | "too_narrow"
  | "roomy"
  | "heel_slip"
  | "toe_pressure";

type ReviewModerationStatus = "pending" | "approved" | "rejected" | "flagged" | "hidden";
```

## Reviewaggregate V1

`ReviewAggregate` mag alleen worden afgeleid uit goedgekeurde reviews:

| Veld | Type | Publiek wanneer |
| --- | --- | --- |
| `shoeId` | string | altijd intern |
| `approvedReviewCount` | number | altijd publiek, ook 0 |
| `averageOverallRating` | number | vanaf 5 goedgekeurde reviews |
| `averageComfortRating` | number | vanaf 5 comfort-antwoorden |
| `averageDurabilityRating` | number | vanaf 5 duurzaamheids-antwoorden |
| `fitSummary` | object | vanaf 5 pasvorm-antwoorden |
| `topExperienceThemes` | string[] | vanaf 5 reviews waarvan minimaal 3 tekstueel bruikbaar |
| `lastReviewSubmittedAt` | ISO datetime | publiek als maand/jaar |

Regel: geen aggregate uit `pending`, `rejected`, `flagged` of `hidden` reviews.

## Publieke UI States

### State 1 - Nog Geen Reviews

Voorwaarde: `approvedReviewCount === 0`.

Publieke module:

- Titel: `Nog geen gebruikersreviews`
- Geen sterren, geen gemiddelde score, geen "meest beoordeeld" badge.
- Copy: `We tonen pas ervaringen nadat ze echt zijn ingestuurd en moderatie hebben doorlopen. Redactionele score en prijsinformatie blijven ondertussen gescheiden.`
- Actie later: `Deel je ervaring` als reviewformulier klaar is.

Doel: de pagina voelt eerlijk en niet leeg, zonder social proof te faken.

### State 2 - Enkele Reviews

Voorwaarde: `approvedReviewCount >= 1 && approvedReviewCount < 5`.

Publieke module:

- Titel: `Eerste ervaringen van lopers`
- Toon review count en maximaal 3 goedgekeurde reviewkaarten.
- Toon per review contextchips: runner level, afstand, ondergrond en pasvormervaring.
- Toon individuele reviewscore alleen op de reviewkaart, bijvoorbeeld `Gebruikersscore 4/5`.
- Geen gemiddelde score, geen sterrenbadge op productkaart, geen reviewranking.
- Copy: `Nog te weinig ervaringen voor een betrouwbare samenvatting. Lees vooral de context van de lopers.`

Doel: echte signalen tonen, maar niet doen alsof kleine aantallen representatief zijn.

### State 3 - Genoeg Reviews Voor Samenvatting

Voorwaarde: minimaal 5 goedgekeurde reviews, waarvan minimaal 3 met bruikbare vrije tekst.

Publieke module:

- Titel: `Gebruikerservaringen`
- Toon `approvedReviewCount`.
- Toon gemiddelde gebruikersscore als aparte badge: `Gebruikersscore X,X/5 op basis van N reviews`.
- Toon comfort- en duurzaamheidsindicatie alleen als elk veld minimaal 5 antwoorden heeft.
- Toon pasvormsamenvatting, bijvoorbeeld `Meeste lopers ervaren de pasvorm als normaal`.
- Toon maximaal 3 handmatig of gecontroleerd afgeleide thema's.
- Voeg korte caveat toe: `Gebruikerservaringen zijn praktijkervaringen van lopers en vervangen de redactionele beoordeling niet.`

Doel: reviewdata ondersteunt de keuze, maar neemt de redactionele beoordeling niet over.

## Scheiding Tussen Reviewscore En Redactionele Score

Niet mengen:

- `editorialScore.overall` blijft de redactionele productscore.
- `reviewAggregate.averageOverallRating` wordt de gebruikersscore.
- `matchScore` uit de keuzehulp blijft persoonlijke match.
- `priceFrom` en offers blijven winkelinformatie.

Publieke labels:

- `Redactionele score`: beoordeling van de schoen als productmodel.
- `Gebruikersscore`: gemiddelde ervaring van goedgekeurde gebruikersreviews.
- `Matchscore`: persoonlijke aansluiting op antwoorden uit de keuzehulp.
- `Prijs vanaf`: gecontroleerde winkelinformatie, geen kwaliteitsscore.

Regels:

- Nooit een samengestelde "totale score" maken uit redactionele score en gebruikersscore.
- Productkaart mag pas een reviewbadge tonen vanaf 5 goedgekeurde reviews.
- Vergelijking mag reviewscore tonen als aparte rij, niet als sorteerbasis zolang reviewvolume laag is.
- Keuzehulp mag reviewdata in de eerste MVP niet gebruiken om resultaten te rangschikken.
- Sellerervaringen, bezorging en retouren horen bij retailer trust, niet bij schoenreviews.

## Moderatie- En Trustregels

- Nieuwe reviews starten altijd als `pending`.
- Alleen `approved` reviews zijn publiek.
- Reviews worden afgewezen bij spam, affiliate/promotionele tekst, haat, medische claims als zekerheid, persoonsgegevens van derden, off-topic winkelklachten of oncontroleerbare productclaims.
- Reviews mogen blessure-ervaring noemen, maar de UI mag dit niet als medisch advies samenvatten.
- Reviews met opvallend patroon, dubbele tekst of verdachte inzending blijven `flagged` tot handmatige controle.
- `hidden` is voor reviews die eerder zichtbaar waren maar later door correctie, melding of privacyverzoek verborgen worden.
- Wijzigingen aan reviewstatus moeten later auditbaar zijn met reviewer, datum en reden.

## Reviewverzameling Zonder Fake Content

MVP-aanpak:

1. Start met lege publieke reviewstate per product.
2. Voeg pas een formulier toe als opslag, moderatie en privacycopy klaar zijn.
3. Vraag alleen context die de keuze helpt: niveau, afstand, ondergrond, pasvorm, comfort, duurzaamheid en ervaringstekst.
4. Gebruik geen incentives die positieve reviews sturen.
5. Toon geen voorbeeldreviews alsof ze echt zijn.
6. Plaats geen externe reviews zonder toestemming, broncontract en duidelijke bronvermelding.

## Parallelle Implementatieclusters

### Cluster A - Datacontract En Moderatie

Kan starten zodra Product Owner dit document akkoord geeft.

- `RVM-001` Reviewtypes en datacontract
- `RVM-002` Moderatiestatus en publicatieregels
- `RVM-004` Reviewaggregate helper

### Cluster B - Productpagina En UI States

Kan parallel na `RVM-001`, zonder formulier of echte reviewdata.

- `RVM-003` Productpagina reviewmodule met lege en echte states
- `RVM-008` Productkaart- en vergelijkingsregels voor reviewbadge

### Cluster C - Trustcopy, Privacy En Reviewverzameling

Kan parallel met Cluster B, maar formulier pas na moderatiecontract.

- `RVM-005` Reviewformulier MVP
- `RVM-006` Methodologie- en privacycopy

### Cluster D - QA En Integratie

Start nadat A, B en C zijn geintegreerd.

- `RVM-007` QA, anti-fake-review en browsercheck

## Implementatietickets

### RVM-001 - Reviewtypes En Datacontract

Owner-agent: Data Model & Taxonomy Agent  
Review-agents: Reviews & Community Trust Agent, Lead Integrator  
Product surface: types, schema, toekomstige datarepository

Scope:

- Voeg reviewtypes toe aan `src/types/product.ts` of een aparte `src/types/review.ts`.
- Leg `UserReview`, `ReviewAggregate` en enums vast volgens dit document.
- Zorg dat reviewdata los staat van `Shoe`, `EditorialScore` en `Offer`.

Do not change:

- Geen `data/shoes.json` reviews toevoegen.
- Geen redactionele scorevelden wijzigen.
- Geen productpagina aanpassen in dit ticket.

Acceptance criteria:

- Reviewtypes modelleren runner level, afstand, ondergrond, pasvormervaring, comfort, duurzaamheid, vrije tekst en moderatiestatus.
- Alleen goedgekeurde reviews mogen door het publieke typepad.
- Typebenamingen zijn consistent met bestaande producttaxonomie.

Verification:

- `npm run typecheck`
- `rg -n "Review|reviewAggregate|UserReview" src/types src/lib`

### RVM-002 - Moderatiestatus En Publicatiepoort

Owner-agent: Data & Backend Agent  
Review-agents: Editorial Trust & Methodology Agent, Reviews & Community Trust Agent  
Product surface: toekomstige reviewrepository en admin/public boundary

Scope:

- Ontwerp of implementeer een publicatiefilter dat alleen `approved` reviews doorlaat.
- Definieer interne statussen: `pending`, `approved`, `rejected`, `flagged`, `hidden`.
- Leg statusovergangen vast inclusief redenveld.

Do not change:

- Geen reviewformulier live zetten.
- Geen pending reviews publiek renderen.
- Geen externe reviews importeren.

Acceptance criteria:

- Publieke helper retourneert alleen goedgekeurde reviews.
- Aggregate gebruikt alleen goedgekeurde reviews.
- Afgewezen of verborgen reviews kunnen niet per ongeluk op productpagina's verschijnen.

Verification:

- Unit- of scriptcheck met dummy-objecten in testcontext, niet als publieke data.
- `rg -n "pending|approved|rejected|flagged|hidden" src`

### RVM-003 - Productpagina Reviewmodule UI States

Owner-agent: Frontend Components Agent  
Review-agents: UX Journey Agent, Reviews & Community Trust Agent  
Product surface: `src/app/schoenen/[slug]/page.tsx`, herbruikbare reviewcomponenten

Scope:

- Bouw een server-rendered reviewmodule voor de drie publieke states.
- Plaats de module op de productpagina na score/specs en voor prijsinformatie.
- Toon lege state zonder sterren of gemiddelde.
- Toon enkele reviews zonder aggregate badge.
- Toon samenvatting pas vanaf de afgesproken thresholds.

Do not change:

- Geen `"use client"` toevoegen.
- Geen nepdata in component props stoppen.
- Geen productscore of prijslogica aanpassen.

Acceptance criteria:

- Productpagina toont eerlijke lege reviewstate bij 0 reviews.
- Bij 1-4 echte approved reviews wordt geen gemiddelde gebruikersscore getoond.
- Vanaf 5 approved reviews wordt gebruikersscore apart gelabeld van redactionele score.
- Reviewcontextchips zijn scanbaar: niveau, afstand, ondergrond, pasvorm.

Verification:

- `npm run typecheck`
- `npm run build`
- Browsercheck op productpagina met 0, enkele en genoeg reviewrecords via gecontroleerde testfixture of story-achtige fixture.

### RVM-004 - Reviewaggregate Helper

Owner-agent: Data & Recommendation Logic Agent  
Review-agents: Data Model & Taxonomy Agent, Reviews & Community Trust Agent  
Product surface: data helpers, productpagina, vergelijking

Scope:

- Maak helper voor `ReviewAggregate` op basis van goedgekeurde reviews.
- Bereken count, gemiddelde gebruikersscore, comfort, duurzaamheid en pasvormsamenvatting.
- Geef expliciet terug of aggregate publiek getoond mag worden.

Do not change:

- Geen aanbevelingsranking aanpassen.
- Geen reviewscore mengen met `editorialScore`.
- Geen prijs- of offerlogica aanraken.

Acceptance criteria:

- Helper retourneert `approvedReviewCount` ook bij 0.
- Gemiddelde score is `null` zolang er minder dan 5 goedgekeurde reviews zijn.
- Pasvormsamenvatting gebruikt alleen fit-antwoorden uit goedgekeurde reviews.
- Data met 4 reviews kan nooit een publieke average badge opleveren.

Verification:

- Unit tests of kleine scriptcheck voor 0, 1, 4, 5 en 10 reviews.
- `npm run typecheck`

### RVM-005 - Reviewformulier MVP

Owner-agent: UX Journey Agent + Frontend Components Agent  
Review-agents: Privacy/Compliance Agent, Reviews & Community Trust Agent  
Product surface: toekomstige review submission flow

Scope:

- Ontwerp formulier met minimaal noodzakelijke velden.
- Gebruik duidelijke Nederlandse labels.
- Toon vooraf dat reviews eerst gemodereerd worden.
- Vraag geen account aan in MVP tenzij Lead Integrator dit expliciet beslist.

Do not change:

- Geen formulier live zonder opslag en moderatiepoort.
- Geen medische claims als keuzeoptie.
- Geen verplichte volledige naam.

Acceptance criteria:

- Formulier vraagt runner level, afstand, ondergrond, pasvormervaring, comfort, duurzaamheid en vrije tekst.
- Gebruiker ziet dat publicatie niet direct gebeurt.
- Vrije tekst heeft minimale lengte en duidelijke richtlijn: concrete ervaring, geen winkelklacht.
- Privacycopy vermeldt welke gegevens publiek worden.

Verification:

- Browsercheck formuliervalidatie.
- Privacycopy review.
- Geen review verschijnt publiek voordat status `approved` is.

### RVM-006 - Methodologie, Privacy En Trustcopy Voor Reviews

Owner-agent: Editorial Trust & Methodology Agent  
Review-agents: Dutch UX Copy & Content Agent, Reviews & Community Trust Agent  
Product surface: `/methodologie`, `/privacy`, eventueel `/onafhankelijkheid`

Scope:

- Leg uit hoe gebruikersreviews werken.
- Leg uit dat reviews praktijkervaringen zijn, geen redactionele test.
- Leg uit dat reviewscore los staat van redactionele score en prijs.
- Leg moderatie op hoofdlijnen uit.

Do not change:

- Geen juridische claims zonder onderbouwing.
- Geen belofte dat alle reviews geverifieerde aankopen zijn.
- Geen reviewscore beloven zolang er geen echte data is.

Acceptance criteria:

- Methodologiepagina heeft een compacte sectie over reviews.
- Privacycopy dekt reviewalias, tekst, contextvelden en bewaardoel.
- Onafhankelijkheidscopy blijft duidelijk over scheiding tussen commercie, redactie en gebruikersopinie.

Verification:

- Contentcheck op termen als `beste`, `top`, `gegarandeerd`, `altijd`.
- Browsercheck van trustpagina's.

### RVM-007 - QA En Anti-Fake-Review Check

Owner-agent: QA, Accessibility & Validation Agent  
Review-agents: Lead Integrator, Reviews & Community Trust Agent  
Product surface: volledige publieke reviewervaring

Scope:

- Controleer dat geen placeholderreviews als echt renderen.
- Controleer dat geen sterren/gemiddelden verschijnen bij 0 reviews.
- Controleer dat redactionele score, gebruikersscore, matchscore en prijs visueel gescheiden blijven.
- Controleer responsive gedrag van reviewmodule.

Do not change:

- Geen inhoudelijke copy herschrijven buiten bugfixes.
- Geen testdata publiek laten staan.

Acceptance criteria:

- 0-review productpagina is eerlijk en compleet.
- 1-4-review state toont geen aggregate.
- 5+-review state toont aggregate met duidelijke sample size.
- Lighthouse/accessibility heeft geen kritieke issues door reviewmodule.

Verification:

- `npm run typecheck`
- `npm run build`
- Browsercheck desktop en mobiel op productpagina.
- `rg -n "placeholder review|fake review|Lorem|example review|voorbeeldreview" src data`

### RVM-008 - Reviewbadge Regels Voor Cards En Vergelijking

Owner-agent: Frontend Components Agent  
Review-agents: Filter & Comparison Agent, Reviews & Community Trust Agent  
Product surface: productcards, vergelijkingstabel, catalogusfilters

Scope:

- Definieer wanneer productcards een reviewbadge tonen.
- Voeg reviewscore als aparte vergelijkingsrij toe zodra echte aggregate bestaat.
- Houd reviewfilter of sortering uitgeschakeld zolang reviewvolume te laag is.

Do not change:

- Geen sortering op reviewscore bij lage aantallen.
- Geen "meest beoordeeld" of "populair" badges zonder volumegrens.
- Geen redactionele score vervangen door gebruikersscore.

Acceptance criteria:

- Productcard toont geen reviewbadge bij minder dan 5 approved reviews.
- Vergelijking toont `Nog niet genoeg gebruikersreviews` als aggregate ontbreekt.
- Reviewscore staat naast, niet boven, redactionele score.
- Catalogusfilter op reviews wordt pas geactiveerd na Lead Integrator akkoord.

Verification:

- Browsercheck catalogus en vergelijking.
- `npm run typecheck`

## Open Beslissingen Voor Product Owner

- Minimumaantal reviews voor publieke aggregate definitief vastzetten: voorstel is 5.
- Of `reviewerAlias` optioneel of verplicht wordt.
- Of verified purchase in MVP wordt ondersteund of alleen als toekomstveld blijft bestaan.
- Of reviewsubmission zonder account mag starten of eerst admin-only/gecontroleerde uitnodigingen gebruikt.

## Integratieadvies

Start met `RVM-001`, `RVM-002` en `RVM-003`. Daarmee kan de site eerlijk tonen dat reviews eraan komen of ontbreken, zonder fake content. Zet `RVM-005` pas aan nadat moderatie en privacycopy klaar zijn. Laat reviewscore pas op cards en vergelijking verschijnen wanneer echte approved reviews de threshold halen.
