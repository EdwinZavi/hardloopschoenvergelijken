# Parallel Launch Agent Tickets - TradeTracker/Public Readiness

## Doel

Til Loopwijzer naar public-launch niveau voor TradeTracker-beoordeling zonder de productbelofte te verzwakken.

De huidige status is: sterke basis, maar nog niet launch-ready. De hardste risico's zitten in publieke trustgegevens, affiliate/offer-geloofwaardigheid, keuzehulp-uitlegbaarheid, intentpagina-consistentie, mobiele vergelijkbaarheid en QA.

## Lead Integrator Regels

De Lead Integrator bewaakt kwaliteit en beslist wat geïntegreerd wordt.

- Geen specialist mag werk van een andere specialist overschrijven.
- Elke specialist werkt binnen eigen file ownership.
- Publieke copy blijft Nederlands.
- Productadvies blijft los van retailer/offers.
- Recommendations moeten uitlegbaar blijven.
- Geen nepkoopflow, placeholder-offers of misleidende affiliatecopy.
- Na integratie draait de Lead Integrator minimaal `npm run typecheck` en `npm run build`.
- Voor public-launch go/no-go volgt een browsercheck op desktop en mobiel voor `/`, `/schoenen`, een productdetail, `/vergelijken`, `/keuzehulp`, `/advies`, `/methodologie`, `/onafhankelijkheid`, `/contact`, `/privacy`, `/cookies`.

## Parallel Werkindeling

### Agent A - Editorial Trust & Methodology

**Ticket LCH-001: Public trust cleanup voor TradeTracker-aanmelding**

**User problem**  
Een reviewer of gebruiker mag nergens het gevoel krijgen dat Loopwijzer onaf, demo-achtig of juridisch onduidelijk is.

**Waarom dit nu moet**  
Dit is blokkerend voor TradeTracker-aanmelding. De audit vond publieke TODO's, demo-bedrijfsgegevens en placeholder-KvK-informatie.

**Eigenaarschap**

- `src/app/methodologie/page.tsx`
- `src/app/over-ons/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/onafhankelijkheid/page.tsx`
- `src/app/privacy/page.tsx`
- eventueel `src/app/cookies/page.tsx` alleen als copyconsistentie nodig is

**Niet aanpassen**

- Productdata
- Recommendation logic
- Productcards
- Offers/feedlogica
- CSS behalve minimale tekstlayoutfixes als copy breekt

**Taken**

- Verwijder publieke `TODO`, MVP-fase-taal en interne actielijsten.
- Vervang `Loopwijzer Demo B.V.`, KvK `00000000` en placeholders door definitieve of waarheidsgetrouwe generieke gegevens.
- Maak contactcopy definitief: alleen mailboxen tonen die echt gebruikt gaan worden.
- Maak privacybeleid publiekwaardig: verantwoordelijke, contactpunt, bewaartermijnen, trackingstatus, affiliatecontext.
- Maak onafhankelijkheidspagina extern gericht: hoe inkomsten werken, wat niet gekocht kan worden, hoe redactie en offers gescheiden zijn.

**Acceptatiecriteria**

- `rg -n "TODO|Demo B.V.|00000000|placeholder|MVP-fase|nog geregeld" src/app` geeft geen publieke launch-blockers.
- Trustpagina's lezen als definitieve publieke pagina's.
- Affiliate-uitleg is eerlijk zonder defensief of intern te klinken.
- Geen claim op labtests als er alleen redactionele MVP-score is.

**Output aan Lead Integrator**

- Korte changelog.
- Open vragen voor echte bedrijfsgegevens.
- Lijst van alle verwijderde publieke launch-blockers.

---

### Agent B - Retail & Commercial Integrity

**Ticket LCH-002: Veilige offer- en affiliate-presentatie**

**User problem**  
Gebruikers moeten prijsinformatie kunnen vertrouwen en mogen niet naar placeholder- of ongecontroleerde winkelroutes worden gestuurd.

**Waarom dit nu moet**  
TradeTracker/public launch vereist transparante affiliatepresentatie. Placeholderlinks of koopklare demo-offers zijn blokkerend.

**Eigenaarschap**

- `data/offers.json`
- `src/lib/data.ts`
- `src/types/product.ts`
- offersectie in `src/app/schoenen/[slug]/page.tsx`
- prijsweergave in `src/components/ProductCard.tsx`
- prijsweergave in `src/components/RecommendationCard.tsx`

**Niet aanpassen**

- Trustpagina-copy behalve korte afstemming met Agent A
- Keuzehulpvragen
- Adviespagina-taxonomie
- Algemene styling buiten offer/price modules

**Taken**

- Zorg dat publieke offers met `example.com` niet als echte winkelknop verschijnen.
- Voeg expliciete verified/publiceerbaar-regel toe voor offers.
- Toon bij niet-geverifieerde offers een duidelijke empty state: "Prijsvergelijking in voorbereiding".
- Vertaal beschikbaarheid naar Nederlands: `Op voorraad`, `Beperkte voorraad`, `Niet beschikbaar`, `Voorraad onbekend`.
- Voeg compacte disclosure toe bij prijsmodules: prijs los van redactioneel oordeel, alleen gecontroleerde offers tonen.
- Bepaal of productcards zonder verified offer beter "Prijs volgt" tonen dan "Vanaf ...".

**Acceptatiecriteria**

- Geen publieke link naar `example.com`.
- Productdetail toont koopknoppen alleen voor verified offers.
- Productcards en recommendation cards wekken geen koopzekerheid als offerstatus onzeker is.
- Prijs en redactionele score blijven zichtbaar gescheiden.
- Geen fake urgentie of voorraadschaarste.

**Output aan Lead Integrator**

- Welke offers publiek zichtbaar zijn en waarom.
- Welke copy is toegevoegd om affiliate/trust uit te leggen.
- Eventuele datavelden die later nodig zijn voor TradeTracker.

---

### Agent C - Data Model & Recommendation Logic

**Ticket LCH-003: Keuzehulp-consistentie en uitlegbare aannames**

**User problem**  
Gebruikers moeten begrijpen waarom een aanbeveling verschijnt, vooral als ze vragen overslaan of via adviespagina's met vooraf ingevulde parameters binnenkomen.

**Waarom dit nu moet**  
De keuzehulp is een kernbelofte. Ongeldige of stilzwijgende profielaannames ondermijnen vertrouwen.

**Eigenaarschap**

- `src/types/recommendation.ts`
- `src/lib/recommendations.ts`
- `src/app/keuzehulp/page.tsx`
- `src/components/RecommendationCard.tsx`

**Niet aanpassen**

- Adviespage seedsets behalve in afstemming met Agent D
- Productdetail offers
- Trust/legal pages
- Algemene productcard layout

**Taken**

- Los het ongeldige `runningGoal=race_event` pad op via type/logic of afstemming met intent-agent.
- Maak overgeslagen vragen zichtbaar als aanname of "onbekend".
- Voeg resultaat-samenvatting toe: "Jouw profiel" met gekozen antwoorden en aannames.
- Voeg confidence/zekerheidslogica toe waar zinvol: minder ingevulde antwoorden betekent voorzichtiger taal.
- Controleer recommendation labels op te absolute taal.

**Acceptatiecriteria**

- Geen URL-parameter kan een ongetypeerde `runningGoal` veroorzaken zonder expliciete fallback.
- Resultaatpagina toont welke input het advies heeft gevormd.
- Skip-flow voelt eerlijk: niet alsof onbekende informatie zeker is.
- Matchscore blijft persoonlijk en los van redactionele score.
- `npm run typecheck` slaagt na integratie.

**Output aan Lead Integrator**

- Overzicht van aangepaste profielvelden/fallbacks.
- Voorbeelden van resultaatcopy voor volledig profiel en deels overgeslagen profiel.
- Risico's of datagaten in recommendation rules.

---

### Agent D - SEO & Intent Architecture

**Ticket LCH-004: Intentpagina's corrigeren en decision-value verhogen**

**User problem**  
Gebruikers die via adviespagina's binnenkomen moeten direct een betrouwbaar, passend keuzepad krijgen. De pagina mag geen SEO-ingang zijn die inhoudelijk zwakker is dan de keuzehulp.

**Waarom dit nu moet**  
Adviespagina's worden belangrijk voor public launch, maar mismatches in compare seeds of helper parameters schaden vertrouwen.

**Eigenaarschap**

- `src/lib/intent-pages.ts`
- `src/app/advies/page.tsx`
- `src/app/advies/[slug]/page.tsx`

**Niet aanpassen**

- Recommendation scoring zelf
- Product/offers
- Legal/trust pages
- ProductCard intern

**Taken**

- Corrigeer intentpagina's met mismatchende seedsets, vooral `trail` en `carbon-wedstrijdschoenen`.
- Zorg dat elke `helperHref` alleen geldige keuzehulpwaarden gebruikt.
- Groepeer adviesindex in duidelijke categorieën: Starten, Pasvorm, Steun/blessuregevoeligheid, Afstand, Snelheid, Budget.
- Voeg per intentpagina decision framing toe: "Kies vooral op", "Let minder op", "Veelgemaakte fout".
- Maak CTA's specifieker: keuzehulp voor beginners, filterroute voor gevorderden, vergelijking voor twijfelaars.

**Acceptatiecriteria**

- Elke intentpagina heeft passende compareSeed-producten of expliciete uitleg waarom een alternatief wordt meegenomen.
- Geen helperHref met ongeldige querywaarden.
- Adviesindex is scanbaar voor beginners en gevorderden.
- Intentpagina's helpen kiezen, niet alleen doorklikken.

**Output aan Lead Integrator**

- Lijst met gecorrigeerde intentroutes.
- Overzicht van categorie-indeling.
- Open datagaten, bijvoorbeeld ontbrekende echte trail/carbonmodellen.

---

### Agent E - UX Journey & Filter/Comparison

**Ticket LCH-005: Decision-flow upgrades voor overzicht, vergelijken en productdetail**

**User problem**  
Beginners hebben begeleiding nodig zonder dat gevorderden hun controle verliezen. Vergelijken moet ook mobiel begrijpelijk blijven.

**Waarom dit nu moet**  
De site is sterk in structuur, maar launchconversie kan vastlopen bij filterkeuze, vergelijking met 1 schoen, lange compare-H1's en mobiele tabellen.

**Eigenaarschap**

- `src/app/page.tsx`
- `src/app/schoenen/page.tsx`
- `src/app/vergelijken/page.tsx`
- decision/CTA delen van `src/app/schoenen/[slug]/page.tsx`

**Niet aanpassen**

- Offerlist/commercial logic
- Recommendation scoring
- Trust/legal pages
- Intent page data

**Taken**

- Homepage: voeg prioriteit toe aan passende startpunten naast "nieuwste releases".
- Schoenenoverzicht: voeg beginner-intent chips of startfilters toe, bijvoorbeeld "Ik begin net", "Meer steun", "Brede pasvorm".
- Schoenenoverzicht: overweeg model/merk zoekveld als klein maar waardevol gevorderden-pad.
- Productdetail: herlabel "Vergelijk deze schoen" naar intentie die past bij 1-item selectie, zoals "Voeg toe aan vergelijking".
- Vergelijken: verkort H1 bij 3-4 schoenen en toon modelnamen scanbaar in chips of koppen.
- Mobiel vergelijken: prioriteer belangrijkste verschillen als kaarten boven volledige tabel.

**Acceptatiecriteria**

- Beginner kan binnen 1 klik vanaf homepage of overzicht naar een begeleide route.
- Gevorderde kan snel filteren/vergelijken zonder keuzehulp te moeten doen.
- 1-item vergelijkroute legt duidelijk uit dat nog een schoen nodig is.
- Vergelijkpagina blijft scanbaar met 4 modellen.
- Mobiele compare-flow heeft een begrijpelijke topsectie zonder horizontale tabel als enige houvast.

**Output aan Lead Integrator**

- Journey summary per pagina.
- Welke CTA's gewijzigd zijn en waarom.
- Mobiele risico's die QA extra moet controleren.

---

### Agent F - Frontend Design System

**Ticket LCH-006: Reusable launch UI modules voor trust, filters en comparison states**

**User problem**  
Als elke pagina eigen kleine patronen gebruikt, wordt de site minder consistent en moeilijker betrouwbaar te maken.

**Waarom dit nu moet**  
Meerdere agents gaan tegelijk flows verbeteren. Herbruikbare componenten voorkomen versnippering.

**Eigenaarschap**

- `src/components/*`
- component-gerelateerde CSS in `src/app/globals.css`
- alleen kleine prop-aanpassingen in pagina's na afstemming met Agent E of B

**Niet aanpassen**

- Data/recommendation business logic
- Legal/trust copy
- Intentdata
- Offerverificatieregels

**Taken**

- Maak of verbeter herbruikbare modules voor:
  - trust/disclosure note
  - active profile/filter chips
  - compare selection state
  - offer empty state
  - decision cards
- Zorg dat buttons/links consistent lezen en op mobiel niet overlappen.
- Controleer card footers op prijs/score/CTA-hiërarchie.
- Vermijd card-in-card patronen en overmatige decoratie.

**Acceptatiecriteria**

- Nieuwe/verbeterde modules verlagen duplicatie in pagina's.
- UI blijft rustig, scanbaar en premium-praktisch.
- Geen tekstoverlap op smalle schermen volgens CSS-inspectie en browsercheck.
- Componenten ondersteunen Nederlandse copy zonder krappe vaste breedtes.

**Output aan Lead Integrator**

- Componentlijst met doel en gebruikte props.
- CSS-risico's voor QA.
- Welke pagina's componenten moeten overnemen.

---

### Agent G - Data Quality & Seed Expansion

**Ticket LCH-007: Launch data sanity en matching-risico's**

**User problem**  
Vergelijkingen en aanbevelingen moeten inhoudelijk geloofwaardig zijn. Seeddata mag geen evidente verkeerde routes of ontbrekende kernvelden veroorzaken.

**Waarom dit nu moet**  
TradeTracker-data wordt later gekoppeld aan deze catalogus. Een zwakke basisdata-set maakt offers, filters en advies onbetrouwbaar.

**Eigenaarschap**

- `data/shoes.json`
- `data/brands.json`
- `data/recommendation-rules.json`
- documentatie van datagaten in nieuw of bestaand md-bestand

**Niet aanpassen**

- Page components
- CSS
- Legal/trust pages
- Offer-publicatiecode

**Taken**

- Controleer of elk product kernvelden heeft: type, ondergrond, afstand, steun, demping, pasvorm, gewicht, drop, score, verdict.
- Controleer of intent-seeds logisch bestaan en bij de pagina passen.
- Markeer ontbrekende of zwakke segmenten: echte trailselectie, carbon race, brede pasvorm, stabiliteit, budget.
- Stel minimale uitbreiding voor als catalogus te smal is voor launchclaims.
- Controleer prijsdata op realisme, maar publiceer geen echte claim zonder verified offer.

**Acceptatiecriteria**

- Geen product mist een kernveld dat publieke pagina's tonen.
- Intent- en recommendationroutes hebben voldoende passende producten.
- Datagaten zijn expliciet vastgelegd met impact en prioriteit.
- Geen datawijziging maakt redactionele claims sterker dan bewijs/data.

**Output aan Lead Integrator**

- Data sanity report.
- Lijst met aanbevolen seed-uitbreidingen.
- Eventuele wijzigingen aan shoe/rule data met reden.

---

### Agent H - QA, Accessibility & Validation

**Ticket LCH-008: Public launch regression en mobile/accessibility gate**

**User problem**  
Een launch-ready site moet betrouwbaar werken op publieke kernroutes en mobiel niet breken waar gebruikers kiezen of vergelijken.

**Waarom dit nu moet**  
Alle parallelle agentwijzigingen raken publieke flows. QA moet pas starten na integratie, maar de criteria moeten nu vastliggen.

**Eigenaarschap**

- Geen productcode ownership tenzij kleine test- of docfix in afstemming met Lead Integrator.
- QA-output in `TRADETRACKER-READINESS-AUDIT-2026-05-11.md` of nieuw auditbestand.

**Niet aanpassen**

- Geen zelfstandige UX/code refactors.
- Geen copy herschrijven behalve typo's na akkoord.

**Taken**

- Draai `npm run typecheck`.
- Draai `npm run build`.
- Browsercheck desktop en mobiel:
  - `/`
  - `/schoenen`
  - minimaal 1 productdetail
  - `/vergelijken` leeg, met 1 schoen, met 3 schoenen
  - `/keuzehulp` intro, middenstap, resultaat
  - `/advies` en minimaal 2 intentpagina's
  - trust/legal footerpagina's
- Controleer keyboard-basis: links/buttons bereikbaar, focusvolgorde logisch.
- Controleer mobiele risico's: header wrap, filterpanel, compare table, offer rows, lange productnamen.
- Controleer publiek op launch-blockers: `TODO`, `Demo`, `example.com`, ongeldige links.

**Acceptatiecriteria**

- Typecheck en build slagen.
- Geen publieke placeholder- of demo-signalen.
- Geen dode CTA in kernflows.
- Mobiele compare-flow is bruikbaar.
- QA maakt expliciete go/no-go conclusie.

**Output aan Lead Integrator**

- Go/no-go.
- Bevindingen geprioriteerd als blokkerend, belangrijk, nice-to-have.
- Exacte pagina, viewport en reproductiestappen per issue.

## Integratievolgorde

1. Agent A, B, C, D, E en G starten parallel met eigen files.
2. Agent F start parallel, maar stemt componentinterface af met B en E voordat pagina's worden omgezet.
3. Lead Integrator reviewt conflicten en productkwaliteit.
4. Lead Integrator integreert alleen wijzigingen die trust, clarity, comparison of guidance verbeteren.
5. Agent H draait na integratie de validation gate.
6. Lead Integrator maakt finale public launch go/no-go.

## Conflictregels

- Als Agent B en F allebei `ProductCard` of `RecommendationCard` nodig hebben: Agent B bepaalt commerciële waarheid; Agent F bepaalt presentatiepatroon.
- Als Agent C en D botsen op `helperHref`: Agent C bepaalt geldige profielwaarden; Agent D past intentroutes daarop aan.
- Als Agent A en B botsen op affiliatecopy: Agent A bepaalt publieke trusttoon; Agent B bepaalt commerciële juistheid.
- Als Agent E en F botsen op layout: Agent E bepaalt journey-prioriteit; Agent F bepaalt herbruikbare implementatie.
- Lead Integrator beslist bij alle resterende conflicten.

## Definition Of Done Voor Deze Buildcyclus

- De site bevat geen publieke demo/TODO/placeholder-signalen.
- Keuzehulp en intentroutes gebruiken geldige, uitlegbare profielwaarden.
- Offers zijn alleen koopbaar als ze verified/publiceerbaar zijn.
- Productadvies, matchscore, redactionele score en winkelinformatie zijn zichtbaar gescheiden.
- Homepage, overzicht, productdetail, vergelijken, keuzehulp en advies hebben duidelijke next-best-actions.
- Mobiele compare-flow is begrijpelijk zonder dat de tabel de enige beslislaag is.
- Typecheck en production build slagen.
- QA geeft een expliciete public launch go/no-go.
