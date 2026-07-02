# Website Audit & Parallel Agent Tickets

Datum: 31 mei 2026  
Scope: publieke website op `http://localhost:3002`

## Audit Samenvatting

De website heeft een goede basis voor vertrouwen, keuzehulp en vergelijking. De grootste tekortkomingen zitten nu niet in de toon, maar in productbewijs, datavolwassenheid, prijsdekking, reviewdekking en de koppeling tussen keuzehulp, filters en vergelijking.

Belangrijkste bevindingen:

- De kernroutes laden zonder consolefouten: `/`, `/schoenen`, `/keuzehulp`, `/vergelijken`, `/advies`, `/advies/beginners`, `/schoenen/nike-pegasus-41`, `/methodologie`, `/onafhankelijkheid`, `/over-ons`, `/contact`.
- De datalaag bevat 30 schoenen, maar 30/30 staan nog op `dataStatus=needs_review` en 30/30 op `scoreStatus=seed_estimate`.
- 22 van de 30 schoenen missen een echt productbeeld.
- `data/offers.json` bevat 18 offerrecords, maar 0 publieke gecontroleerde offers. Daardoor heeft 0/30 schoenen een publieke prijs.
- Reviews zijn nog geen werkende productsurface, terwijl de productvisie review- en vertrouwenservaringen verwacht.
- De keuzehulp gebruikt maar een deel van het profiel actief. Velden zoals ervaring, afstand, trainingsfrequentie en blessuregevoeligheid vallen nu vooral terug op defaults.
- De catalogusfilters gebruiken nog niet alle belangrijke productdimensies, zoals ondergrond en afstand, terwijl die data wel aanwezig is.
- De Nederlandse kernroutes `/schoenen`, `/keuzehulp` en `/vergelijken` gebruiken nog grotendeels de globale metadata.
- Productpagina's leggen redactionele score goed uit, maar tonen de status van de score nog niet scherp genoeg bij de score zelf.

## Workflow Type

Product improvement + launch-readiness cycle.

## Selected Agent Cast

- Lead Integrator Agent
- Product Strategy Agent
- Data Quality & Seed Expansion Agent
- Running Shoe Domain Agent
- Recommendation Logic Agent
- Filter & Comparison Agent
- UX Journey Agent
- Dutch UX Copy & Content Agent
- Editorial Trust & Methodology Agent
- Retail & Commercial Integrity Agent
- Reviews & Community Trust Agent
- SEO & Intent Architecture Agent
- Frontend Design System Agent
- QA, Accessibility & Validation Agent

## Parallel Batches

### Batch 1 - Data, Trust En Commerciale Basis

Kan grotendeels parallel starten. Deze batch maakt de site geloofwaardiger voordat er meer SEO- of conversiewerk bovenop komt.

Status 31 mei 2026: uitgevoerd als eerste implementatie-/contractbatch. `AUD-001`, `AUD-002`, `AUD-003`, `AUD-004`, `AUD-008` en `AUD-010` hebben nu output of zichtbare implementatie. Catalogusdata is nog niet geverifieerd en offers zijn nog niet publiek; de site toont dat nu explicieter.

- `AUD-001` Catalogusdata verificatie en beelddekking
- `AUD-002` Prijs- en retailerlaag zonder TradeTracker-afhankelijkheid
- `AUD-003` Scorestatus en redactionele bewijsvoering zichtbaar maken
- `AUD-004` Review-MVP zonder nep-social-proof

### Batch 2 - Keuze, Filters En Vergelijking

Start na een korte contract-sync over profielvelden, filtervelden en scorestatus-labels.

Status 31 mei 2026: uitgevoerd. `AUD-005`, `AUD-006` en `AUD-007` zijn geïntegreerd op de publieke routes. De keuzehulp gebruikt nu het volledige profielcontract met expliciete onbekend-antwoorden, de catalogusfilters sluiten beter aan op loopdoel, afstand en ondergrond, en de vergelijkflow heeft voorgestelde startsets, gegroepeerde vergelijking en duidelijke prijs-/scorecaveats. Validatie: `npm run typecheck`, `npm run build` en browsercheck op `/keuzehulp`, `/schoenen` en `/vergelijken`.

- `AUD-005` Keuzehulp-profiel compleet maken
- `AUD-006` Catalogusfilters verdiepen en prijsfilter veiliger maken
- `AUD-007` Vergelijkingsflow aanscherpen

### Batch 3 - SEO, Content En Metadata

Kan parallel met Batch 2 zolang routes en datacontracten niet wijzigen.

Status 31 mei 2026: uitgevoerd. `AUD-008`, `AUD-009` en `AUD-010` zijn geïntegreerd als SEO/trust-batch. De site heeft nu een veilige `Organization`/`WebSite` structured-data baseline, canonicals op de belangrijkste Nederlandse routes, intentpagina's met sterkere productroutes naar filters, keuzehulp en vergelijksets, en aangescherpte contact-/publisher-readiness zonder partnerclaims of fake offerdata. Geen `Product`, `Offer` of `Review` schema toegevoegd zolang die publieke data niet geverifieerd is.

- `AUD-008` Nederlandse metadata en structured-data baseline
- `AUD-009` Intentpagina's verbinden met filters, keuzehulp en vergelijking
- `AUD-010` Contact, trust en publisher-readiness aanscherpen

### Batch 4 - Frontend, QA En Integratie

Start na integratie van Batch 1-3.

Status 2 juni 2026: uitgevoerd. `AUD-011` en `AUD-012` zijn geintegreerd als frontend/QA-batch. Prijs-empty-states, lange labels, productcards, recommendation cards, compare tray en vergelijkingstabel zijn robuuster gemaakt op mobiel zonder nieuwe client boundary. De volledige QA staat in `BATCH-4-QA-RELEASE-READINESS.md`. Validatie: `rg -n '"use client"' src`, `npm run typecheck`, `npm run build` en browsercheck op homepage, catalogus, keuzehulp, vergelijking, product-, advies- en trustroutes. Besluit: go with known risks voor interne preview/staging; no-go voor volledige publieke trustlaunch totdat data-, prijs-, review- en beelddekking zijn opgelost.

- `AUD-011` Responsive UI en component-polish voor vertrouwen
- `AUD-012` End-to-end QA en release-readiness check

### Batch 5 - Spacing, Alignment En Vergelijktool-Dichtheid

Start na visuele review van de actieve vergelijkpagina.

Status 10 juni 2026: uitgevoerd. `ALIGN-001`, `ALIGN-002`, `ALIGN-003` en `ALIGN-004` zijn verwerkt als parallelle spacing/alignment-batch. De actieve vergelijkflow is compacter, de vergelijkingstabel komt eerder in beeld, de onderste aanpas-sectie gebruikt compacte compare-picker items in plaats van full-size productcards en de browsermatrix is groen voor 2, 3 en 4 geselecteerde schoenen op desktop, tablet en mobiel. Details en metingen staan in `BATCH-5-SPACING-ALIGNMENT-TICKETS.md`.

- `ALIGN-001` UX spacing contract voor actieve vergelijkflow
- `ALIGN-002` Comparepage layout rhythm en responsive spacing
- `ALIGN-003` Compacte compare-picker component voor onderste aanpas-sectie
- `ALIGN-004` Visual QA en regressiecheck

---

## AUD-001 - Catalogusdata Verificatie En Beelddekking

**Owner-agent**  
Data Quality & Seed Expansion Agent

**Review-agents**  
Running Shoe Domain Agent, Editorial Trust & Methodology Agent

**User problem**  
Gebruikers kunnen de aanbevelingen niet volledig vertrouwen zolang alle schoenen nog `needs_review` zijn, alle scores seed estimates zijn en de meeste schoenen geen echt beeld hebben.

**Product surface**  
Catalogusdata, productkaarten, productpagina's, adviespagina's en vergelijking.

**Scope**

- Maak een datakwaliteitsrapport voor alle 30 schoenen.
- Label per schoen welke velden broncontrole nodig hebben:
  - gewicht
  - drop
  - stack height
  - ondergrond
  - breedte/pasvorm
  - support type
  - demping/responsiveness
  - releasejaar
  - editorial verdict
- Maak een prioriteitenlijst voor de eerste 12 schoenen die publicatieklaar moeten worden.
- Bepaal welke 8 productbeelden al bruikbaar zijn en welke 22 beelden ontbreken.
- Definieer regels voor wanneer `dataStatus` van `needs_review` naar `verified` mag.
- Definieer regels voor wanneer `scoreStatus` van `seed_estimate` naar `editorial_reviewed` mag.

**Ownership**

- `data/shoes.json`
- `data/image-sources.json`
- `public/shoes/*`
- eventueel een nieuw rapportbestand onder root, bijvoorbeeld `CATALOG-DATA-QUALITY-AUDIT.md`

**Do not change**

- Geen productclaims verzinnen.
- Geen scores verhogen of verlagen zonder onderbouwing.
- Geen offers publiceren.
- Geen client components toevoegen.

**Expected output**

- Datakwaliteitsrapport.
- Eerste verificatiebatch van 12 schoenen.
- Lijst ontbrekende beelden met bronstatus.
- Concrete statusregels voor `dataStatus`, `scoreStatus`, `imageStatus` en `imageLicenseStatus`.

**Quality bar**

- Productwaarheid blijft gescheiden van redactioneel oordeel.
- Onzekerheid wordt zichtbaar gemaakt in plaats van ingevuld.
- Geen enkele schoen wordt `verified` zonder bronbasis.

**Integration point**

Lead Integrator gebruikt dit als contract voor productpagina's, cards, filters en trustlabels.

**Verification**

- `node`/scriptcontrole op ontbrekende velden.
- Handmatige review van minimaal 12 prioriteitsschoenen.
- Browsercheck op productkaart en productpagina met en zonder beeld.

---

## AUD-002 - Prijs- En Retailerlaag Zonder TradeTracker-Afhankelijkheid

**Owner-agent**  
Retail & Commercial Integrity Agent

**Review-agents**  
Data Quality & Seed Expansion Agent, Editorial Trust & Methodology Agent

**User problem**  
De site belooft prijsvergelijking, maar toont nu overal dat prijsdata in voorbereiding is. Omdat TradeTracker nog niet reageert, mag de voortgang niet afhankelijk blijven van één netwerk.

**Product surface**  
Retail offers, prijsmodules, productpagina's, vergelijking, catalogussortering, affiliate-disclosure.

**Scope**

- Ontwerp een fallback-route voor prijsdata:
  - handmatige CSV voor 5-10 gecontroleerde aanbiedingen
  - directe retailerlinks waar toegestaan
  - later TradeTracker-feed als extra bron
- Definieer publicatieregels voor offers:
  - prijs
  - URL
  - retailer
  - bron
  - `lastCheckedAt`
  - availability
  - affiliate-status
- Maak onderscheid tussen `feed_pending`, `verified`, `expired` en `rejected`.
- Bepaal wat de UI toont als geen prijs beschikbaar is, zonder dat de site leeg of onaf voelt.
- Bepaal of prijsfilter en prijs-sortering tijdelijk anders moeten werken zolang 0/30 schoenen publieke prijsdata hebben.

**Ownership**

- `data/offers.json`
- `src/lib/data.ts`
- `src/app/schoenen/[slug]/page.tsx`
- `src/app/schoenen/page.tsx`
- `src/app/vergelijken/page.tsx`
- `COMPLIANCE-READINESS.md`
- `TRADETRACKER-IMPORT-RUNBOOK.md`

**Do not change**

- Geen placeholderlinks publiek maken.
- Geen "beste deal" of urgentiecopy.
- Geen productranking op affiliatevergoeding.
- Geen testdata als echte winkelprijs tonen.

**Expected output**

- Retail fallback-plan.
- Offer-publicatiecontract.
- UI-copy voor geen prijs, gedeeltelijke prijs en gecontroleerde prijs.
- Besluit over tijdelijke prijsfilter/sortering.

**Quality bar**

- Prijsinformatie helpt kopen, maar stuurt geen advies.
- Affiliate-disclosure staat dicht bij toekomstige koopmodules.
- Commercie blijft zichtbaar gescheiden van score en match.

**Integration point**

Lead Integrator koppelt dit aan catalogusfilters, productpagina en vergelijking.

**Verification**

- Controleer dat 0 placeholderoffers publiek renderen.
- Controleer dat productpagina's met 0 offers duidelijke caveat tonen.
- Controleer dat prijsfilter niet misleidt wanneer geen prijsdata beschikbaar is.

---

## AUD-003 - Scorestatus En Redactionele Bewijsvoering Zichtbaar Maken

**Owner-agent**  
Editorial Trust & Methodology Agent

**Review-agents**  
Running Shoe Domain Agent, Dutch UX Copy & Content Agent

**User problem**  
Gebruikers zien redactionele scores, maar de huidige status `seed_estimate` is niet overal direct zichtbaar. Dat kan sterker lijken dan de onderbouwing toelaat.

**Product surface**  
Productkaart, productpagina, vergelijking, keuzehulpresultaten, methodologie.

**Scope**

- Definieer labels voor scorestatus:
  - `seed_estimate`: voorlopige redactionele inschatting
  - `editorial_reviewed`: redactioneel gecontroleerd
  - `tested`: getest volgens gepubliceerde methode
- Toon bij scores kort wat de status betekent.
- Voeg waar nodig link toe naar `/methodologie`.
- Maak duidelijk dat score, persoonlijke match en prijs verschillende signalen zijn.
- Controleer alle scorecopy op te sterke autoriteit.

**Ownership**

- `src/components/ProductCard.tsx`
- `src/components/RecommendationCard.tsx`
- `src/app/schoenen/[slug]/page.tsx`
- `src/app/vergelijken/page.tsx`
- `src/app/methodologie/page.tsx`
- `data/shoes.json`

**Do not change**

- Geen scorewaarden wijzigen.
- Geen testclaims toevoegen.
- Geen nieuwe scoremethodiek bouwen zonder Product Owner akkoord.

**Expected output**

- Herbruikbare scorestatus-copy.
- Scorestatus zichtbaar op minstens productpagina en productkaart.
- Methodologiepagina legt de drie statussen uit.

**Quality bar**

- Trust door eerlijkheid, niet door grotere claims.
- De gebruiker begrijpt of een score voorlopig, gecontroleerd of getest is.

**Integration point**

Frontend Agent maakt componentweergave; Lead Integrator bewaakt dat de copy overal consistent is.

**Verification**

- Browsercheck productkaart, productpagina en vergelijking.
- `rg -n "seed_estimate|Voorlopige|getest" src data`
- `npm run typecheck`

---

## AUD-004 - Review-MVP Zonder Nep-Social-Proof

**Owner-agent**  
Reviews & Community Trust Agent

**Review-agents**  
Editorial Trust & Methodology Agent, Data Model & Taxonomy Agent

**User problem**  
De productvisie belooft review- en ervaringssignalen, maar de publieke site heeft nog geen bruikbare reviewlaag. Zonder dit mist de site Kieskeurig-achtige koopondersteuning.

**Product surface**  
Productpagina's, toekomstige reviews hub, productcards, datamodel.

**Scope**

- Ontwerp het minimale reviewmodel:
  - runner level
  - afstand
  - ondergrond
  - pasvormervaring
  - comfort
  - duurzaamheid
  - vrije tekst
  - moderatiestatus
- Definieer publieke UI-states:
  - nog geen reviews
  - enkele reviews
  - genoeg reviews voor samenvatting
- Ontwerp hoe reviewscore gescheiden blijft van redactionele score.
- Maak een plan voor reviewverzameling zonder fake content.

**Ownership**

- `SCHEMA.md`
- `PAGES.md`
- eventueel nieuw bestand `REVIEWS-MVP-TICKETS.md`
- later: `src/app/schoenen/[slug]/page.tsx`
- later: `src/types/product.ts`

**Do not change**

- Geen nep-reviews toevoegen.
- Geen sterren tonen zonder echte reviewdata.
- Geen reviewhub bouwen voordat model en moderatieregels akkoord zijn.

**Expected output**

- Review-MVP specificatie.
- Productpagina-module voor lege en echte reviewstaat.
- Moderatie- en trustregels.
- Latere implementatietickets.

**Quality bar**

- Reviews zijn nuttig door context, niet door alleen sterren.
- Gebruikersopinie blijft zichtbaar anders dan redactionele beoordeling.

**Integration point**

Lead Integrator beslist of eerst alleen een lege trustmodule wordt toegevoegd of direct de datalaag.

**Verification**

- Geen publieke placeholderreviews.
- Productpagina maakt duidelijk dat reviewlaag nog in opbouw is als er geen reviews zijn.

---

## AUD-005 - Keuzehulp-Profiel Compleet Maken

**Owner-agent**  
Recommendation Logic Agent

**Review-agents**  
UX Journey Agent, Running Shoe Domain Agent

**User problem**  
De keuzehulp voelt nuttig, maar vraagt nu niet alle velden die de recommendation profile gebruikt. Daardoor lijkt de match persoonlijker dan hij feitelijk is.

**Product surface**  
Keuzehulp, aanbevelingslogica, recommendation reasons.

**Scope**

- Maak een profielcontract: welke velden zijn echt nodig voor een betrouwbare eerste match?
- Herzie vragen voor:
  - ervaring
  - doel
  - afstand
  - trainingsfrequentie
  - ondergrond
  - steunbehoefte
  - blessuregevoeligheid zonder medische claim
  - gevoel
  - pasvorm
  - budget
- Voeg een resultaten-samenvatting toe: "je antwoorden".
- Maak duidelijk wanneer een antwoord default of onbekend is.
- Voeg een CTA toe om alle aanbevolen schoenen direct te vergelijken.
- Test minimaal 8 profielen:
  - beginner 5 km
  - brede voeten
  - stabiliteit nodig
  - trail
  - halve marathon
  - sneller trainen
  - budget beperkt
  - blessuregevoelig / pijnklachten caveat

**Ownership**

- `src/app/keuzehulp/page.tsx`
- `src/lib/recommendations.ts`
- `data/recommendation-rules.json`
- `src/types/recommendation.ts`

**Do not change**

- Geen client state toevoegen; URL blijft bron van waarheid.
- Geen medische diagnose of blessurepreventieclaim.
- Geen budget boven fit laten gaan.

**Expected output**

- Completere keuzehulpflow.
- Betere matchuitleg.
- Profielsamenvatting bij resultaten.
- Scenario-testnotities.

**Quality bar**

- Beginner begrijpt vragen zonder technische kennis.
- Gevorderde gebruiker voelt dat de vragen relevant zijn.
- Elke aanbeveling heeft reden en trade-off.

**Integration point**

Lead Integrator stemt veldcontract af met catalogusfilters en vergelijking.

**Verification**

- Browsercheck volledige flow.
- Test URL's voor 8 profielen.
- `npm run typecheck`

---

## AUD-006 - Catalogusfilters Verdiepen En Prijsfilter Veiliger Maken

**Owner-agent**  
Filter & Comparison Agent

**Review-agents**  
Data Model & Taxonomy Agent, UX Journey Agent

**User problem**  
De catalogus is scanbaar, maar mist belangrijke filterdimensies en bevat prijsfiltering terwijl er nog geen publieke prijsdata is.

**Product surface**  
`/schoenen`

**Scope**

- Voeg filters toe voor:
  - ondergrond
  - afstand/use case
  - eventueel releasejaar of carbon/waterproof als secondaire filters
- Herzie filtervolgorde:
  - doel/use case
  - ondergrond
  - steun
  - demping
  - pasvorm
  - prijs/score
  - eigenschappen
- Maak prijsfilter tijdelijk veilig:
  - disabled of caveat zolang 0 publieke offers bestaan
  - geen lege resultaten door ontbrekende prijsdata zonder duidelijke uitleg
- Verbeter actieve filterlabels.
- Behoud shareable URL search params.

**Ownership**

- `src/app/schoenen/page.tsx`
- `src/lib/labels.ts`
- `src/types/product.ts` alleen als enumcontract echt moet wijzigen

**Do not change**

- Geen client-only filterstate.
- Geen filter toevoegen zonder betrouwbare data.
- Geen filters die gebruikers niet kunnen interpreteren.

**Expected output**

- Sterkere filterarchitectuur.
- Veiligere prijsfilterervaring.
- Duidelijkere empty states.

**Quality bar**

- Filters helpen vernauwen, niet overweldigen.
- Beginners krijgen hulp; gevorderden houden controle.

**Integration point**

Afstemmen met `AUD-005` zodat keuzehulp-velden en catalogusfilters dezelfde taal gebruiken.

**Verification**

- Browsercheck filtercombinaties.
- URL's blijven deelbaar.
- Geen nieuwe `"use client"` boundary.

---

## AUD-007 - Vergelijkingsflow Aanscherpen

**Owner-agent**  
Filter & Comparison Agent

**Review-agents**  
Frontend Design System Agent, Dutch UX Copy & Content Agent

**User problem**  
De vergelijking toont veel nuttige informatie, maar de flow kan nog duidelijker maken welke verschillen echt beslissend zijn en hoe je de set aanpast.

**Product surface**  
`/vergelijken`

**Scope**

- Maak de lege vergelijkingsstaat sterker:
  - suggesties per populaire keuzevraag
  - "begin met deze 3" voor beginners/stabiliteit/trail/tempo
- Groepeer vergelijkingstabel:
  - keuze
  - pasvorm
  - loopgevoel
  - specs
  - score
  - prijs
- Toon prijsrij met caveat wanneer prijsdata ontbreekt.
- Voeg betere set-editing toe:
  - gekozen schoenen duidelijker bovenaan
  - vervang-suggestie
  - limiet 4 duidelijker
- Voeg link terug naar keuzehulp toe als gebruiker geen goede set weet.

**Ownership**

- `src/app/vergelijken/page.tsx`
- eventueel `src/components/ProductCard.tsx`

**Do not change**

- Geen vergelijking in client state.
- Geen universele winnaar claimen.
- Geen prijsvergelijking sterker maken dan beschikbare offerdata.

**Expected output**

- Betere empty state.
- Betere difference cards.
- Gegroepeerde vergelijkingstabel.
- Duidelijkere mobiele vergelijking.

**Quality bar**

- Gebruiker ziet sneller welk verschil voor hem of haar telt.
- Vergelijking blijft feitelijk, rustig en scanbaar.

**Integration point**

Lead Integrator controleert dat filters, productcards en vergelijking dezelfde labels gebruiken.

**Verification**

- Browsercheck `/vergelijken` zonder ids en met 2, 3, 4 ids.
- Mobiele check op horizontaal scrollgedrag.
- `npm run typecheck`

---

## AUD-008 - Nederlandse Metadata En Structured-Data Baseline

**Owner-agent**  
SEO & Intent Architecture Agent

**Review-agents**  
Dutch UX Copy & Content Agent, QA Agent

**User problem**  
Meerdere Nederlandse kernroutes gebruiken nog generieke metadata. Daardoor is de SERP-belofte minder specifiek dan de pagina-inhoud.

**Product surface**  
Homepage, catalogus, keuzehulp, vergelijken, methodologie, trustpagina's, sitemap.

**Scope**

- Voeg of verbeter metadata voor:
  - `/`
  - `/schoenen`
  - `/keuzehulp`
  - `/vergelijken`
  - `/methodologie`
  - `/onafhankelijkheid`
  - `/over-ons`
- Controleer canonicals.
- Controleer sitemapdekking.
- Definieer structured-data baseline:
  - `WebSite` / `Organization`
  - `BreadcrumbList` waar logisch
  - `FAQPage` alleen waar FAQ zichtbaar is
  - geen `Product`, `Review` of `Offer` schema zolang zichtbare data ontbreekt of niet verified is.

**Ownership**

- `src/app/page.tsx`
- `src/app/schoenen/page.tsx`
- `src/app/keuzehulp/page.tsx`
- `src/app/vergelijken/page.tsx`
- `src/app/methodologie/page.tsx`
- `src/app/sitemap.ts`
- eventueel shared metadata helper

**Do not change**

- Geen keyword stuffing.
- Geen structured data die claims maakt die gebruikers niet zien.
- Geen schema voor fake reviews, fake offers of testclaims.

**Expected output**

- Route-specifieke titles en descriptions.
- Canonicalbeleid.
- Structured-data plan of eerste veilige implementatie.

**Quality bar**

- Metadata vertelt de echte keuzehulpwaarde van de pagina.
- Search copy blijft people-first en rustig.

**Integration point**

Lead Integrator valideert dat SEO-belofte overeenkomt met zichtbare pagina.

**Verification**

- Browser/head check per route.
- `npm run build`
- Structured-data handmatige review.

---

## AUD-009 - Intentpagina's Verbinden Met Filters, Keuzehulp En Vergelijking

**Owner-agent**  
SEO & Intent Architecture Agent

**Review-agents**  
Dutch UX Copy & Content Agent, Filter & Comparison Agent

**User problem**  
De adviespagina's zijn inhoudelijk sterker geworden, maar moeten nog harder werken als productroutes: van intent naar shortlist, filter, vergelijking en keuzehulp.

**Product surface**  
`/advies`, `/advies/*`

**Scope**

- Controleer per intentpagina:
  - juiste filtered listing link
  - relevante keuzehulp-parameters
  - defensieve vergelijking met 2-4 schoenen
  - gerelateerde intenten
  - FAQ alleen waar echte twijfel bestaat
- Maak interne links consistenter.
- Voeg waar nuttig "wanneer niet deze route?" toe.
- Parkeer intenten die nog te weinig data hebben.

**Ownership**

- `src/lib/intent-pages.ts`
- `src/app/advies/page.tsx`
- `src/app/advies/[slug]/page.tsx`
- `src/app/sitemap.ts`

**Do not change**

- Geen nieuwe intentpagina zonder productdata.
- Geen "beste" claims zonder doelgroep, criteria en trade-off.
- Geen extra client rendering.

**Expected output**

- Intentroute-audit.
- Betere internal linking.
- Parkeerlijst voor te dunne intenten.

**Quality bar**

- Elke intentpagina helpt kiezen, niet alleen ranken.
- Elke pagina heeft een logische volgende actie.

**Integration point**

Afstemmen met `AUD-006` voor filters en met `AUD-005` voor keuzehulp-parameters.

**Verification**

- Content audit script op `src/lib/intent-pages.ts`.
- Browsercheck op minimaal 5 intentpagina's.
- Sitemap check.

---

## AUD-010 - Contact, Trust En Publisher-Readiness Aanscherpen

**Owner-agent**  
Retail & Commercial Integrity Agent

**Review-agents**  
Editorial Trust & Methodology Agent, Product Strategy Agent

**User problem**  
Voor affiliatepartners en bezoekers moet de site betrouwbaar en bereikbaar aanvoelen, zeker nu TradeTracker nog niet reageert.

**Product surface**  
Contact, onafhankelijkheid, methodologie, compliance-documenten.

**Scope**

- Controleer of contactgegevens echt operationeel zijn.
- Werk publisherbeschrijving bij op basis van huidige propositie.
- Maak een partner-outreach pakket:
  - korte pitch
  - uitleg redactionele scheiding
  - welke retailers relevant zijn
  - welke feedvelden nodig zijn
- Leg vast welke commerciële claims verboden blijven.
- Maak alternatieve lijst naast TradeTracker:
  - directe retailers
  - andere netwerken
  - handmatige pilotdata

**Ownership**

- `src/app/contact/page.tsx`
- `src/app/onafhankelijkheid/page.tsx`
- `COMPLIANCE-READINESS.md`
- `TRADETRACKER-APPLICATION-CHECKLIST.md`
- eventueel nieuw bestand `RETAIL-PARTNER-OUTREACH.md`

**Do not change**

- Geen niet-geverifieerde bedrijfsgegevens.
- Geen belofte dat affiliatepartijen al aangesloten zijn.
- Geen publieke claim over samenwerkingen zonder bevestiging.

**Expected output**

- Publisher-readiness update.
- Outreachtekst.
- Retailer/affiliate fallbacklijst.

**Quality bar**

- Transparant genoeg voor bezoekers.
- Professioneel genoeg voor partners.
- Geen afhankelijkheid van TradeTracker als enige pad.

**Integration point**

Lead Integrator gebruikt dit om commercial roadmap en prijslaag te prioriteren.

**Verification**

- Handmatige review van contact/trustpagina's.
- Geen placeholderdata publiek.

---

## AUD-011 - Responsive UI En Component-Polish Voor Vertrouwen

**Owner-agent**  
Frontend Design System Agent

**Review-agents**  
UX Journey Agent, QA Agent

**User problem**  
De site oogt al rustig, maar vertrouwen zakt snel als kaarten, labels, carrousels of vergelijkingstabellen op mobiel krap of onaf voelen.

**Product surface**  
Homepage, productcards, recommendation cards, compare table, score panels, empty states.

**Scope**

- Controleer en verbeter mobiele layout voor:
  - homepage
  - catalogus
  - keuzehulp
  - vergelijking
  - productpagina
  - adviespagina
- Maak fallbackbeeld en image-missing states consistenter.
- Controleer lange Nederlandse labels op overflow.
- Maak prijs-empty-states visueel rustig en niet dominant.
- Behoud functionele, niet-decoratieve UI.

**Ownership**

- `src/app/globals.css`
- `src/components/ProductCard.tsx`
- `src/components/RecommendationCard.tsx`
- `src/app/page.tsx`
- `src/app/vergelijken/page.tsx`
- `src/app/schoenen/page.tsx`

**Do not change**

- Geen redesign los van productwaarde.
- Geen kaarten in kaarten toevoegen.
- Geen nieuwe client boundary.
- Geen éénkleurige marketinglook.

**Expected output**

- Responsive polishpatch.
- Fallback states voor missende beelden/prijzen/scores.
- Korte componentnotitie voor hergebruik.

**Quality bar**

- Tekst past op mobiel.
- UI blijft scanbaar en rustig.
- Geen visuele claims die sterker zijn dan de data.

**Integration point**

Na Batch 1-3, zodat nieuwe labels en states meteen worden meegenomen.

**Verification**

- Browsercheck desktop en 390px mobiel.
- Geen horizontale page overflow behalve bedoelde vergelijkingstabel.
- `npm run build`

---

## AUD-012 - End-To-End QA En Release-Readiness Check

**Owner-agent**  
QA, Accessibility & Validation Agent

**Review-agents**  
Lead Integrator

**User problem**  
Na parallel werk moet één agent controleren of de totale gebruikersreis nog klopt en of trust, SEO, performance en rendering niet zijn beschadigd.

**Product surface**  
Volledige publieke site.

**Scope**

- Run technische checks:
  - `rg -n '"use client"' src`
  - `npm run typecheck`
  - `npm run build`
- Browsercheck:
  - homepage
  - `/schoenen`
  - filtercombinaties
  - compare met 0, 1, 2, 4 schoenen
  - keuzehulp intro tot resultaat
  - productpagina met beeld
  - productpagina zonder beeld
  - `/advies`
  - minimaal 5 intentpagina's
  - trustpagina's
- Check toegankelijkheid:
  - headings
  - form labels
  - keyboardbare links/buttons
  - focus states
  - tabel op mobiel
- Check content/trust:
  - geen fake reviews
  - geen fake offers
  - geen testclaims bij seed scores
  - geen "beste" zonder context

**Ownership**

- Geen featurefiles tenzij bugfixes expliciet toegewezen worden.
- QA-rapportbestand of ticketcommentaar.

**Do not change**

- Geen scope-uitbreiding.
- Geen productbeslissingen nemen zonder Lead Integrator.

**Expected output**

- QA-rapport met P0/P1/P2 findings.
- Go/no-go advies voor publieke release.
- Lijst consciously parked risks.

**Quality bar**

- Een groene build is niet genoeg.
- De volledige gebruikerreis moet van twijfel naar vertrouwen bewegen.

**Integration point**

Laatste stap voor release of volgende bouwbatch.

**Verification**

- QA-rapport bevat commando-output, browserroutes en resterende risico's.

---

## Dependency Map

```text
AUD-001:
Agent: Data Quality & Seed Expansion
Can start when: direct
Needs from: huidige datafiles
Blocks: AUD-003, AUD-006 gedeeltelijk, AUD-011 beeldstates
Can parallel with: AUD-002, AUD-004, AUD-008
Sync moment: na datastatuscontract
Risk: hoge impact op vertrouwen

AUD-002:
Agent: Retail & Commercial Integrity
Can start when: direct
Needs from: COMPLIANCE-READINESS.md, offers.json, TradeTracker status
Blocks: prijsfilterbesluit in AUD-006, prijsrij in AUD-007
Can parallel with: AUD-001, AUD-003, AUD-010
Sync moment: na offer-publicatiecontract
Risk: affiliate/compliance

AUD-003:
Agent: Editorial Trust & Methodology
Can start when: direct, maar definitieve labels na AUD-001 contract
Needs from: scoreStatus regels
Blocks: scoreweergave in cards, productpagina, vergelijking
Can parallel with: AUD-002, AUD-004, AUD-008
Sync moment: scorestatus-label contract
Risk: fake authority

AUD-004:
Agent: Reviews & Community Trust
Can start when: direct
Needs from: SCHEMA.md, productvisie
Blocks: toekomstige review UI
Can parallel with: AUD-001, AUD-002, AUD-008
Sync moment: reviewmodel akkoord
Risk: nep-social-proof vermijden

AUD-005:
Agent: Recommendation Logic
Can start when: profielcontract afgestemd
Needs from: huidige recommendation types en regels
Blocks: keuzehulp UX en scenario QA
Can parallel with: AUD-006 na contract-sync
Sync moment: profielvelden definitief
Risk: te persoonlijke belofte zonder data

AUD-006:
Agent: Filter & Comparison
Can start when: filtervelden en prijsbesluit bekend
Needs from: AUD-001, AUD-002
Blocks: intentpagina filterlinks in AUD-009
Can parallel with: AUD-005 na contract-sync
Sync moment: filtercontract
Risk: filter overload of lege prijsresultaten

AUD-007:
Agent: Filter & Comparison
Can start when: prijsstatus en scorestatuslabels bekend
Needs from: AUD-002, AUD-003
Blocks: final QA
Can parallel with: AUD-008, AUD-009
Sync moment: comparison state review
Risk: te veel tabelinformatie zonder uitleg

AUD-008:
Agent: SEO & Intent Architecture
Can start when: direct
Needs from: route inventory
Blocks: final SEO QA
Can parallel with: AUD-001, AUD-002, AUD-004
Sync moment: metadata review
Risk: structured data overclaim

AUD-009:
Agent: SEO & Intent Architecture
Can start when: AUD-006 filtercontract bekend
Needs from: filter URLs, keuzehulp params
Blocks: content QA
Can parallel with: AUD-007
Sync moment: internal link review
Risk: SEO pages zonder productwaarde

AUD-010:
Agent: Retail & Commercial Integrity
Can start when: direct
Needs from: TradeTracker non-response context
Blocks: partner outreach
Can parallel with: AUD-002
Sync moment: CEO/Product Owner review
Risk: onjuiste commerciële claim

AUD-011:
Agent: Frontend Design System
Can start when: Batch 1-3 states en labels stabiel zijn
Needs from: nieuwe labels, states, modules
Blocks: final QA
Can parallel with: geen grote featuretickets
Sync moment: pre-QA visual review
Risk: merge conflicts in CSS/components

AUD-012:
Agent: QA, Accessibility & Validation
Can start when: integratie compleet
Needs from: alle featuretickets
Blocks: release/go-no-go
Can parallel with: niet van toepassing
Sync moment: release-readiness review
Risk: regressies na parallel werk
```

## Sync Moments

1. **Contract Sync 1: Data, score en offerstatus**
   - Output van `AUD-001`, `AUD-002`, `AUD-003`
   - Besluit: welke statuslabels en prijsstates mogen publiek zichtbaar zijn?

2. **Contract Sync 2: Profielvelden en filtertaal**
   - Output van `AUD-005`, input voor `AUD-006`, `AUD-009`
   - Besluit: welke termen gebruiken we consistent in keuzehulp, filters en advies?

3. **Integration Sync: Routes en component states**
   - Output van `AUD-006`, `AUD-007`, `AUD-008`, `AUD-009`
   - Besluit: componenten en pagina's geïntegreerd zonder overlap.

4. **Release Sync**
   - Output van `AUD-011`, `AUD-012`
   - Besluit: go/no-go voor publicatie of volgende bouwbatch.

## Conflicts / Escalations

- **TradeTracker blijft stil**: escaleer niet als blocker; gebruik `AUD-002` en `AUD-010` om alternatieven te openen.
- **Prijsfilter zonder prijzen**: Product Owner moet beslissen of prijsfilter tijdelijk disabled wordt of alleen met caveat blijft.
- **Scorestatus zichtbaar maken kan conversie minder glanzend maken**: trust wint boven schijnzekerheid.
- **Reviewlaag zonder reviews**: geen fake social proof; eerst model en lege staat.
- **Meer filters versus eenvoud**: filters toevoegen alleen wanneer ze met betrouwbare data werken en taal aansluiten op de keuzehulp.

## Aanbevolen Uitvoervolgorde

1. Start parallel met `AUD-001`, `AUD-002`, `AUD-003`, `AUD-004`, `AUD-008`, `AUD-010`.
2. Houd Contract Sync 1.
3. Start `AUD-005` en `AUD-006` parallel na profiel/filtercontract.
4. Start `AUD-007` en `AUD-009` na filter- en prijsbesluit.
5. Integreer met Lead Integrator.
6. Laat `AUD-011` polishen.
7. Laat `AUD-012` de volledige QA doen.
