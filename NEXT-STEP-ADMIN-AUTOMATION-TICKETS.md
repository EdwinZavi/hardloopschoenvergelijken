# Volgende stap: admin review workflow en agent-automatisering

## Productdoel

Loopwijzer moet niet alleen een goede publieke website worden, maar ook een beheersysteem waarin data, content, controle en publicatie zoveel mogelijk door gespecialiseerde agents voorbereid kunnen worden.

De menselijke eigenaar blijft eindverantwoordelijk voor publicatie, commerciële claims, privacy, affiliate-uitingen en redactionele conclusies. Agents bereiden werk voor, signaleren risico's en maken concepten; ze publiceren pas automatisch wanneer de regels en approvals daarvoor expliciet zijn ingericht.

## Waarom dit nu belangrijk is

TradeTracker en vergelijkbare feedbronnen leveren straks veel ruwe data op:

- nieuwe schoenen
- prijswijzigingen
- voorraadstatus
- affiliate links
- productafbeeldingen
- retailer titels die niet altijd netjes matchen

Als dit direct publiek gaat, verliezen we vertrouwen. De volgende stap is daarom een admin review workflow: feeddata komt binnen, wordt genormaliseerd, gematcht en daarna per record beoordeeld.

## Bouwfase 2: admin import review workflow

### Ticket A1 - Feedrecord review-acties

**Agent:** Next.js Engineering Agent  
**Doel:** Maak het mogelijk om een genormaliseerd feedrecord een reviewstatus te geven.

**Scope**

- Admin importdetailpagina
- Lokale action/server-logica
- Voorlopig op JSON/stagingdata, nog geen database

**Acties**

- `approve_offer_candidate`
- `reject_offer_candidate`
- `needs_manual_match`
- `ignore_record`

**Acceptance criteria**

- Een admin ziet per feedrecord de aanbevolen actie.
- Records met lage confidence kunnen niet per ongeluk als verified worden behandeld.
- De UI maakt duidelijk wat nog handmatig bekeken moet worden.
- Er wordt nog niets publiek gepubliceerd zonder verified status.

### Ticket A2 - Match review detail

**Agent:** Data Model & Taxonomy Agent + Frontend Design System Agent  
**Doel:** Maak per feedrecord zichtbaar waarom een match wel of niet betrouwbaar is.

**Scope**

- Matchblok op `/admin/imports/[id]`
- Geen wijzigingen aan publieke productpagina's

**Velden**

- bronproductnaam
- genormaliseerd merk
- genormaliseerd model
- mogelijke bestaande schoen
- match confidence
- match reasons
- warnings

**Acceptance criteria**

- Een admin kan in 10 seconden zien waarom een record aandacht nodig heeft.
- Match confidence wordt niet alleen als label getoond, maar ook verklaard.
- Geen technische feedtaal zonder Nederlandse uitleg.

### Ticket A3 - Image candidate review

**Agent:** Retail & Commercial Integrity Agent + Frontend Design System Agent  
**Doel:** Afbeeldingen uit feeds veilig voorbereiden zonder verkeerde foto's publiek te tonen.

**Scope**

- Admin image candidate module
- Geen publieke image switch zonder review

**Acceptance criteria**

- Beeldkandidaten krijgen status: `candidate`, `approved`, `rejected`.
- De admin ziet bron, formaat en gekoppelde schoen.
- Publieke pagina's blijven fallback/placeholder gebruiken totdat beeld is goedgekeurd.
- Er is ruimte voor later: aspect ratio, resolutie, alt-tekst en bronlicentie.

### Ticket A4 - Verified offer staging

**Agent:** Retail & Commercial Integrity Agent + Next.js Engineering Agent  
**Doel:** Maak het verschil tussen ruwe offerdata, reviewdata en publieke verified offers expliciet.

**Scope**

- Data model
- Admin workflow
- Offer-publicatieregels

**Acceptance criteria**

- Publieke site toont alleen verified offers.
- Affiliate disclosure staat logisch bij de kooplaag.
- Productscore en aanbeveling worden niet beinvloed door commissie.
- Onvolledige prijs, ongeldige URL of onzekere match blokkeert publicatie.

## Agent operating model

### Dagelijks of per import

**Feed Import Agent**

- haalt feed op of verwerkt upload
- zet raw records in staging
- draait normalisatie
- maakt importrapport

**Data Matching Agent**

- matcht feedrecords aan bestaande schoenen
- markeert nieuwe modellen
- geeft confidence en warnings

**Retail Integrity Agent**

- controleert prijs, URL, affiliate disclosure en publiceerbaarheid
- bewaakt dat commercie de redactie niet stuurt

### Wekelijks

**Data Quality Agent**

- controleert ontbrekende specs, dubbele modellen, ontbrekende afbeeldingen en statusvelden
- maakt een werkvoorraad voor handmatige review

**QA Agent**

- controleert build, belangrijke routes, lege staten en adminflows
- meldt regressies voordat nieuwe data live gaat

### Maandelijks

**Release Radar Agent**

- detecteert nieuwe hardloopschoenen en modelupdates
- maakt een lijst met mogelijke catalogusuitbreidingen
- markeert alle onbekende feiten als `needs_review`

**Content Operations Agent**

- maakt een conceptblog over nieuwe releases
- linkt naar relevante schoenen, adviespagina's en filters
- gebruikt alleen gecontroleerde feiten of expliciete onzekerheidslabels

**Editorial Trust Agent**

- controleert toon, claims, methodologie en affiliate-onafhankelijkheid
- blokkeert publicatie bij te harde claims of ontbrekende bronnen

## Maandelijkse blogautomatisering

### Concept

Elke maand kan Loopwijzer een redactioneel artikel voorbereiden:

`Nieuwe hardloopschoenen van [maand jaar]: wat valt op?`

De blog moet geen lijstje met hype worden. Het doel is gebruikers helpen begrijpen welke nieuwe modellen relevant zijn voor hun situatie.

### Input

- nieuw toegevoegde catalogusrecords
- feedrecords met nieuwe modellen
- release year / version
- categorie en use case
- beschikbare specs
- interne status: `verified`, `needs_review`, `seed_estimate`

### Template

1. Korte maandintro: wat is er nieuw?
2. Nieuwe dagelijkse trainers
3. Nieuwe stabiliteitsschoenen
4. Nieuwe tempo- en wedstrijdschoenen
5. Nieuwe trailschoenen
6. Welke schoenen zijn interessant voor welk type loper?
7. Wat weten we nog niet zeker?
8. Links naar keuzehulp, filters en relevante adviespagina's

### Publicatieregels

Automatisch concept maken mag.

Automatisch publiceren mag pas wanneer:

- alle genoemde schoenen bestaan in de catalogus
- onzekerheden expliciet zijn gelabeld
- er geen medische claims staan
- er geen fake prijzen of ongecontroleerde retailerclaims staan
- affiliate disclosure klopt wanneer kooplinks aanwezig zijn
- een menselijke eigenaar of Editorial Trust Agent de publicatiestatus heeft goedgekeurd

## Eerstvolgende buildadvies

Begin met Ticket A1 en A2 samen.

Waarom:

- Dit maakt feedimports daadwerkelijk beheerbaar.
- Het voorkomt dat we data binnenhalen zonder publicatiecontrole.
- Het vormt de basis voor latere automatisering.
- Het adminscherm wordt het commandocentrum voor de agents.

Daarna:

1. A3 image candidate review
2. A4 verified offer staging
3. Maandelijkse Release Radar als conceptgenerator
4. Content Operations Agent voor blogconcepten
5. QA Agent als pre-publicatiecheck
