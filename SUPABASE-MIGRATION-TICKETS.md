# Supabase Migration Tickets

## Doel

Loopwijzer is technisch gekoppeld aan Supabase. De volgende stap is om de huidige JSON-gebaseerde catalogus gecontroleerd te verplaatsen naar een databasefundament, zonder de publieke UX of het vertrouwen van de productdata te breken.

Belangrijk uitgangspunt:

- productwaarheid blijft gescheiden van retailerwaarheid
- redactionele scores blijven gescheiden van gebruikersreviews
- ruwe feeddata wordt nooit direct publiek getoond
- bestaande JSON-data blijft fallback totdat Supabase betrouwbaar is gevuld
- aanbevelingen en vergelijking moeten uitlegbaar blijven

## Wat jij nog moet doen

1. Supabase data controleren
   - Open Supabase Table Editor.
   - Controleer of deze tabellen gevuld zijn:
     - `brands`: 9 records
     - `shoes`: 30 records
     - `editorial_scores`: 30 records
     - `editorial_verdicts`: 30 records
     - `retailers`: 10 records
     - `offers`: 18 records

2. Service key opruimen of laten staan voor de volgende seedronde
   - Aanbevolen nu: verwijder `SUPABASE_SERVICE_ROLE_KEY` uit `.env.local` als je voorlopig niet opnieuw seedt.
   - Laat hem alleen lokaal staan wanneer we actief import- of seedwerk doen.
   - Deel deze key nooit publiek en zet hem nooit in frontendcode.

3. Public read kort testen
   - Als de app straks op Supabase-data leest, controleer jij visueel of schoenen, scores en prijsblokken nog logisch ogen.
   - Let vooral op: geen placeholder-prijzen als echte koopoptie, geen lege productpagina's, geen rare scoreverschillen.

4. Beslissen over de volgende datastap
   - Optie A: eerst alleen catalogus uit Supabase lezen.
   - Optie B: daarna admin/importdata naar Supabase brengen.
   - Aanbevolen: eerst A afronden en valideren, daarna pas admin/importdata.

## Actieve Agentopdrachten

### Backend/API Agent

**Status:** In uitvoering  
**Scope:** Ticket 3 en Ticket 6  
**Ownership:** `src/lib/data.ts`, nieuwe repositoryfiles onder `src/lib/catalog/` of `src/lib/supabase/`, `src/app/api/catalog/shoes/route.ts`, eventueel `src/app/api/health/route.ts`

Opdracht:

- Maak een server-side repositorylaag die catalogusdata uit Supabase kan lezen.
- Behoud JSON fallback als Supabase niet bereikbaar is.
- Behoud de bestaande publieke responsevorm van `/api/catalog/shoes`.
- Gebruik geen `service_role` key in runtime.
- Houd typecheck en build groen.

### UX & Frontend Components Agent

**Status:** In uitvoering  
**Scope:** Ticket 7  
**Ownership:** `src/app/admin/page.tsx`, eventueel een kleine nieuwe component onder `src/components/`

Opdracht:

- Maak of bereid een compacte admin database readiness check voor.
- Toon databron, Supabase bereikbaarheid, recordstatus en eerstvolgende actie.
- Gebruik Nederlandse copy.
- Toon geen secrets of technische stacktraces.

## QA Stap 1 en 2

**Status:** Afgerond op 2026-05-07

### Stap 1: Supabase QA afronden

- `/api/health` gecontroleerd.
- Supabase is geconfigureerd en bereikbaar.
- Catalogusbron is `supabase`, zonder fallback.
- Publiek leesbare counts:
  - `brands`: 9
  - `shoes`: 30
  - `offers`: 0 publiek zichtbaar
- Let op: `offers` is publiek 0 omdat alle huidige seed-offers placeholder-URL's gebruiken. Dat is correct gedrag; RLS blokkeert deze als publieke koopopties.

### Stap 2: Schoenenoverzicht en productpagina controleren

- `/schoenen` gecontroleerd met Supabase als databron.
- Overzicht toont 30 schoenen.
- Productkaarten tonen geen europrijzen uit placeholder-offers.
- Null-prijscopy aangescherpt naar `Nog geen gecontroleerde prijs`.
- Productdetail `/schoenen/asics-gel-kayano-31` gecontroleerd.
- Productdetail toont geen `example.com` links en geen onbetrouwbare europrijzen.
- Admin readiness gecontroleerd na login:
  - Database readiness zichtbaar.
  - Supabase gekoppeld en bereikbaar.
  - Geen secrets zichtbaar.

## TradeTracker Staging Migratie

**Status:** Klaar voor review in `supabase/migrations/202605070002_feed_staging.sql`

**Agent:** Data & Recommendation Logic Agent  
**Scope:** retailer/offer-statusmodel uitbreiden en feed staging tabellen toevoegen.

### Ontwerpkeuzes

- `offer_status` is uitgebreid met `feed_pending` en `rejected`, zodat publieke offers later gecontroleerd vanuit staging kunnen worden gepubliceerd of afgewezen.
- Ruwe feeddata landt in aparte tabellen: `feed_imports`, `feed_records`, `feed_record_matches`, `image_candidates` en `admin_reviews`.
- Raw payloads blijven gescheiden van `shoes`, `offers` en andere publieke catalogustabellen.
- RLS staat aan op alle staging/admin tabellen.
- Er is geen anon public read en er zijn geen gewone authenticated write policies. Service role blijft het beoogde pad voor imports en admin-mutaties totdat admin-auth expliciet is ontworpen.
- Indexen zijn toegevoegd voor importstatus, bron/source, match confidence, geselecteerde match, identifiers en beeldreviewstatus.

## Feed Staging Seed Script

**Status:** Klaar in `scripts/seed-feed-staging.mjs`

**Doel:** De demo TradeTracker-feed uit `data/feed-imports.json` naar de Supabase stagingtabellen schrijven, zonder publieke offers te publiceren.

### Commands

- `npm run check:feed-staging`: dry-run zonder databasewrites.
- `npm run seed:feed-staging`: schrijft naar `feed_imports`, `feed_records`, `feed_record_matches` en `image_candidates`.

### Veiligheidsregels

- Het script gebruikt `SUPABASE_SERVICE_ROLE_KEY` alleen lokaal.
- Bestaande demo-import met dezelfde `source_reference` wordt eerst verwijderd, zodat het script herhaalbaar is.
- Bestaande beeldkandidaten voor dezelfde demo-import worden eerst verwijderd, inclusief orphan records met dezelfde `source_name` en `external_id`.
- Er wordt niets naar de publieke `offers` tabel geschreven.
- Records met warnings krijgen `staged_offer_status = rejected` en blijven reviewwerk.

## Admin Imports uit Supabase Staging

**Status:** Geimplementeerd met JSON fallback

**Doel:** `/admin/imports` en `/admin/imports/[id]` kunnen stagingdata uit Supabase lezen zodra `SUPABASE_SERVICE_ROLE_KEY` lokaal beschikbaar is en `feed_imports` gevuld is.

### Gedrag

- Met service role key en stagingrecords: admin leest uit `feed_imports`, `feed_records`, `feed_record_matches` en `image_candidates`.
- Zonder service role key of zonder stagingrecords: admin valt terug op `data/feed-imports.json`.
- De publieke `offers` tabel wordt niet geraakt.
- Deze stap is alleen admin-readiness; publicatie naar echte offers blijft geblokkeerd.

## Admin Reviews naar Supabase

**Status:** Geimplementeerd met cookie fallback

**Doel:** Reviewbeslissingen kunnen in `admin_reviews` worden vastgelegd wanneer server-side Supabase admin access beschikbaar is.

### Gedrag

- Zonder `SUPABASE_SERVICE_ROLE_KEY`: reviewbeslissingen blijven lokaal in de admin-sessie werken.
- Met `SUPABASE_SERVICE_ROLE_KEY`: reviewbeslissingen worden ook naar `admin_reviews` geschreven.
- Database review state wordt bij het laden samengevoegd met sessie-state.
- Een goedgekeurde kandidaat blijft staging; er wordt nog niets naar publieke `offers` gepromoveerd.

## TradeTracker Import Runbook

**Status:** Voorbereid in `TRADETRACKER-IMPORT-RUNBOOK.md`

**Doel:** Vastleggen hoe we van echte TradeTracker-feed naar staging gaan zonder publieke offers te publiceren.

### Volgende ticket

`TradeTracker Feed Adapter`

- echte feedkolommen inspecteren
- mapping naar `RawFeedRecord`
- dry-run voor aantallen en warnings
- stagingwrite naar `feed_imports`, `feed_records`, `feed_record_matches`, `image_candidates`
- geen write naar publieke `offers`

## Ticket 1: Supabase Schema MVP

**Status:** Afgerond in `supabase/migrations/202605070001_catalog_mvp.sql`

**Agent:** Data & Recommendation Logic Agent  
**Owner files:** nieuw SQL-migratiebestand, `SCHEMA.md` indien nodig  
**Doel:** Maak een eerste Supabase/Postgres schema dat aansluit op de bestaande producttypes en het vertrouwen van de catalogus beschermt.

### Scope

- Maak tabellen voor:
  - `brands`
  - `shoes`
  - `editorial_scores`
  - `editorial_verdicts`
  - `retailers`
  - `offers`
- Definieer enums/check constraints voor bestaande velden zoals:
  - shoe type
  - surface type
  - support type
  - levels
  - fit profile
  - width label
  - data status
  - score status
  - offer status
  - availability
- Gebruik UUID of text IDs bewust. Aanbevolen MVP: bestaande text IDs behouden om migratie uit JSON veilig en traceerbaar te houden.
- Voeg `created_at` en `updated_at` toe waar zinvol.
- Zet foreign keys tussen merk, schoen, scores, verdicts, retailers en offers.

### Acceptatiecriteria

- SQL kan in Supabase SQL Editor worden uitgevoerd zonder fouten.
- Schema ondersteunt alle velden uit `src/types/product.ts`.
- Retail offers zijn gescheiden van productdata.
- Editorial scores en verdicts zijn gescheiden van productfacts.
- Placeholder offers kunnen niet per ongeluk als verified publieke offers worden behandeld.

### Niet doen

- Nog geen user reviews.
- Nog geen auth/roles.
- Nog geen TradeTracker raw feedtabellen.

## Ticket 2: Seed Script voor Bestaande JSON Data

**Status:** Afgerond in `scripts/seed-supabase.mjs` met command `npm run seed:supabase`

**Agent:** Backend/API Agent  
**Owner files:** seedscript, eventuele `package.json` scriptregel, `.env.example` indien nodig  
**Doel:** Zet de bestaande JSON-data gecontroleerd over naar Supabase.

### Scope

- Lees data uit:
  - `data/brands.json`
  - `data/shoes.json`
  - `data/offers.json`
- Transformeer naar het nieuwe database schema.
- Maak retailers uniek op basis van retailernaam/slug.
- Schrijf eerst brands, dan shoes, dan editorial data, dan retailers, dan offers.
- Gebruik upsert waar mogelijk zodat het script herhaalbaar is.
- Gebruik alleen server-side env variabelen voor eventuele service-role toegang.

### Acceptatiecriteria

- Seedscript kan lokaal draaien zonder dubbele records te maken.
- Aantal records na seed komt overeen met JSON-bronnen.
- Offers blijven gekoppeld aan de juiste schoen.
- Editorial scores en verdicts zijn voor elke schoen gevuld.
- Script faalt duidelijk wanneer Supabase env ontbreekt.

### Niet doen

- Geen publieke runtime afhankelijk maken van service-role key.
- Geen handmatige datacorrecties verstoppen in het seedscript.

## Ticket 3: Database Repository Layer met JSON Fallback

**Agent:** Backend/API Agent  
**Status:** Afgerond in `src/lib/catalog/repository.ts`
**Owner files:** `src/lib/data.ts`, nieuwe database/repository files  
**Doel:** Maak de datalaag klaar om uit Supabase te lezen, terwijl de bestaande JSON fallback beschikbaar blijft.

### Scope

- Maak repositoryfuncties voor:
  - brands ophalen
  - shoes ophalen
  - offers ophalen
  - enriched shoes bouwen
- Gebruik Supabase alleen server-side.
- Behoud bestaande public API-vorm van `getEnrichedShoes` waar mogelijk.
- Voeg fallback toe: als Supabase niet geconfigureerd of niet bereikbaar is, gebruik huidige JSON-data.

### Acceptatiecriteria

- Bestaande pagina's blijven werken zonder Supabase-data.
- `/api/catalog/shoes` kan later Supabase-data gebruiken zonder response-vorm te breken.
- Build en typecheck blijven groen.
- Fallbackgedrag is expliciet en testbaar.

### Niet doen

- Geen grote UI-refactor.
- Geen wijziging aan recommendation logic tenzij nodig voor async data.

## Ticket 4: API Health en Data Source Status

**Agent:** Frontend Components Agent + Backend/API Agent  
**Owner files:** `src/app/api/health/route.ts`, eventueel admin status component  
**Doel:** Maak zichtbaar of de app JSON of Supabase als databron gebruikt.

### Scope

- Breid `/api/health` uit met:
  - Supabase configured
  - Supabase reachable
  - gebruikte databron
  - record counts uit JSON en/of Supabase
- Toon in admin later een compacte datastatus.

### Acceptatiecriteria

- Health endpoint geeft duidelijke status zonder secrets te tonen.
- Bij ontbrekende tabellen geeft endpoint een bruikbare foutmelding.
- Geen Supabase URL/key wordt gelekt buiten wat al publiek mag zijn.

### Niet doen

- Geen dashboardpolish voordat de datalaag werkt.

## Ticket 5: RLS en Public Read Policy

**Status:** Afgerond in `supabase/migrations/202605070001_catalog_mvp.sql`

**Agent:** Trust & Content Agent + Backend/API Agent  
**Owner files:** SQL-migratiebestand, eventueel `COMPLIANCE-READINESS.md`  
**Doel:** Zorg dat publieke productdata leesbaar is, maar admin/importdata niet zomaar publiek wordt.

### Scope

- Enable RLS op tabellen.
- Definieer public read policies voor gecontroleerde catalogusdata:
  - actieve brands
  - verified/draftlogica afhankelijk van publieke behoefte
  - alleen verified public offers
- Houd write access gesloten voor anon users.
- Documenteer welke data publiek mag zijn.

### Acceptatiecriteria

- Anon key kan publieke catalogusdata lezen.
- Anon key kan niet schrijven.
- Offers met `placeholder` of `expired` worden niet als publieke koopoptie gebruikt.
- Ruwe feeddata blijft buiten scope.

### Niet doen

- Geen admin auth implementeren in dit ticket.

## Ticket 6: Eerste Supabase Lezende Catalogusroute

**Agent:** Backend/API Agent  
**Status:** Afgerond in `src/app/api/catalog/shoes/route.ts`
**Owner files:** `src/app/api/catalog/shoes/route.ts`, repositorylaag  
**Doel:** Laat de publieke catalogusroute data uit Supabase gebruiken zodra tabellen gevuld zijn.

### Scope

- Sluit route aan op repositoryfunctie.
- Behoud bestaande response shape.
- Sorteer en filter alleen op veilige publieke data.
- Gebruik JSON fallback bij databaseproblemen.

### Acceptatiecriteria

- `/api/catalog/shoes` werkt met Supabase-data.
- Response blijft compatibel met huidige frontend.
- Geen ruwe admin-, feed- of reviewstatussen lekken.
- Typecheck en build slagen.

## Ticket 7: Admin Database Readiness Check

**Agent:** UX & Flow Agent + Frontend Components Agent  
**Status:** Afgerond in `src/app/admin/page.tsx`
**Owner files:** adminpagina of compact statusblok  
**Doel:** Geef in admin duidelijk weer of Supabase klaar is voor catalogusdata.

### Scope

- Voeg een rustige statussectie toe aan admin:
  - databron
  - Supabase bereikbaar
  - tabellen gevonden
  - record counts
  - eerstvolgende actie
- Nederlandse copy, praktisch en niet technisch intimiderend.

### Acceptatiecriteria

- Admin gebruiker ziet meteen of database klaar is.
- Status helpt beslissen wat de volgende actie is.
- Geen gevoelige keys of interne errors in detail tonen.

## Ticket 8: Migratievalidatie en Releasecheck

**Agent:** QA/Test Agent  
**Owner files:** testplan of validatiedocument, eventueel scripts  
**Doel:** Controleer dat Supabase-migratie geen vertrouwen, filters, productpagina's of vergelijking breekt.

### Scope

- Controleer:
  - homepage
  - schoenenoverzicht
  - productdetail
  - vergelijken
  - keuzehulp
  - `/api/health`
  - `/api/catalog/shoes`
- Vergelijk record counts tussen JSON en Supabase.
- Check dat prijsdata alleen publieke verified offers toont.

### Acceptatiecriteria

- Typecheck groen.
- Production build groen.
- Belangrijkste routes renderen.
- Geen regressie in productkaarten, scores, filters of prijsweergave.
- Bekende beperkingen zijn genoteerd.

## Aanbevolen volgorde

1. Ticket 1: Supabase Schema MVP
2. Ticket 5: RLS en Public Read Policy
3. Ticket 2: Seed Script voor Bestaande JSON Data
4. Ticket 4: API Health en Data Source Status
5. Ticket 3: Database Repository Layer met JSON Fallback
6. Ticket 6: Eerste Supabase Lezende Catalogusroute
7. Ticket 7: Admin Database Readiness Check
8. Ticket 8: Migratievalidatie en Releasecheck

## Eerste concrete volgende stap

Start met Ticket 1. Maak een SQL-migratie die veilig in Supabase kan worden uitgevoerd. Daarna kan jij de SQL in Supabase SQL Editor draaien, of kunnen we een lokale migratieflow opzetten met de Supabase CLI.
