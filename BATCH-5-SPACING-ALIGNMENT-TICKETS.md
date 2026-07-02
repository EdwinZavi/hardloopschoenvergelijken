# Batch 5 - Spacing & Alignment Audit Tickets

Datum: 2 juni 2026  
Scope: vergelijkpagina op `http://localhost:3003/vergelijken?ids=nike-pegasus-41,hoka-clifton-9,brooks-ghost-16`

## Analyse

De pagina is technisch stabiel: geen consolefouten, geen page-wide horizontale overflow en alle hoofdcontainers hebben dezelfde linker- en rechteruitlijning. Het probleem zit vooral in visueel ritme, informatiedichtheid en mobiele lengte. De pagina voelt nu meer als een contentpagina met grote blokken dan als een efficiënt vergelijkingsinstrument.

### Gemeten Signalen

Desktop `1280x900`:

- Hero is `340px` hoog. Voor een actieve vergelijking is dat groot; de gebruiker zit al in een toolflow.
- Eerste compare selection bar is `101px` hoog.
- Difference grid gebruikt 5 kolommen, maar de prijskaart heeft een andere interne baseline: waarde start op `103px`, andere kaarten op `81px`.
- Decision grid gebruikt 2 kolommen; bij 3 schoenen ontstaat een losse derde kaart op een nieuwe rij.
- Productcards in de onderste aanpas-sectie zijn ongeveer `969px` hoog per kaart; het productgrid wordt ongeveer `9842px` hoog.

Tablet/smalle desktop `771px`:

- Difference grid valt naar 1 kolom, waardoor 5 korte besliskaarten samen `659px` innemen.
- Selection bar is `161px` hoog.
- Onderste productgrid is full-width en maakt de pagina ongeveer `35.000px` lang.

Mobiel `390x844`:

- Hero is `288px` hoog.
- Compare selection bars zijn `235px` hoog, tweemaal op dezelfde flow.
- Difference grid is 5 gestapelde kaarten.
- Compare actions staan links en zijn niet full-width uitgelijnd.
- Onderste productgrid is `28.808px` hoog; elke productkaart is ongeveer `934-956px` hoog.

## Productprobleem

Een vergelijkpagina moet compact, scanbaar en besluitgericht voelen. De huidige spacing maakt de pagina betrouwbaar qua inhoud, maar te lang en te zwaar in gebruik. Vooral mobiel moet de gebruiker sneller van samenvatting naar tabel en aanpassing kunnen gaan zonder langs enorme blokken te scrollen.

## Gewenst Productresultaat

- De actieve vergelijking voelt als een tool, niet als een landingpage.
- De belangrijkste verschillen zijn scanbaar in 1-2 schermen.
- De selection bar helpt orientatie zonder te veel verticale ruimte te claimen.
- De onderste aanpas-sectie gebruikt compacte vergelijk-items in plaats van volledige productcards.
- Desktop, tablet en mobiel hebben een rustig, consistent spacingritme.

## Selected Agent Cast

- Lead Integrator Agent
- UX Journey Agent
- Frontend Design System Agent
- Frontend Components Agent
- QA, Accessibility & Validation Agent

## Parallel Batches

### Batch 5A - Parallel Voorwerk

Kan parallel starten.

- `ALIGN-001` UX spacing contract voor actieve vergelijkflow
- `ALIGN-003` Compacte compare-picker component ontwerpen
- `ALIGN-004` Visual QA baseline voorbereiden

### Batch 5B - Implementatie

Start zodra `ALIGN-001` voldoende richting geeft. Houd code-ownership strak.

- `ALIGN-002` Comparepage layout rhythm en responsive spacing implementeren
- Lead Integrator integreert `ALIGN-003` component in de pagina

### Batch 5C - Review

Start na implementatie.

- `ALIGN-004` volledige browsercheck en regressierapport

---

## ALIGN-001 - UX Spacing Contract Voor Actieve Vergelijkflow

**Owner-agent**  
UX Journey Agent

**Review-agents**  
Lead Integrator, Frontend Design System Agent

**User problem**  
Gebruikers zitten al in een vergelijking, maar de pagina besteedt te veel ruimte aan grote headers, herhaalde selectiebalken en full-size productcards. Daardoor voelt vergelijken traag en minder doelgericht.

**Product surface**  
`/vergelijken?ids=...` met 2, 3 en 4 schoenen.

**Scope**

- Definieer het gewenste verticale ritme voor actieve vergelijkingen.
- Bepaal welke content boven de tabel moet blijven en wat naar beneden mag.
- Bepaal of de actieve vergelijkhero compact moet worden.
- Bepaal hoe de selection bar zich moet gedragen op desktop, tablet en mobiel.
- Bepaal hoe de onderste "Vergelijking aanpassen" sectie compact genoeg wordt.

**Ownership**

- Analyse-only.
- Geen code-edits.
- Mag verwijzen naar `src/app/vergelijken/page.tsx` en `src/app/globals.css`.

**Do not change**

- Geen copy herschrijven behalve korte labels voorstellen.
- Geen nieuwe feature toevoegen.
- Geen recommendation/data logic wijzigen.

**Expected output**

- Layout contract met doelhoogtes:
  - actieve hero
  - selection bar
  - difference grid
  - decision cards
  - compare actions
  - compact picker
- Desktop/tablet/mobile richtlijnen.
- Welke elementen mogen sticky zijn en wanneer.

**Quality bar**

- Beginner moet nog snappen wat hij vergelijkt.
- Advanced gebruiker moet sneller bij tabel en specs komen.
- Geen webshopgevoel of schreeuwerige conversie-UI.

**Integration point**

Frontend Design System Agent gebruikt dit als acceptatiebasis voor `ALIGN-002`.

**Verification**

- Contract moet concrete px/range-doelen noemen, geen vage "meer ruimte" opmerkingen.

---

## ALIGN-002 - Comparepage Layout Rhythm En Responsive Spacing

**Owner-agent**  
Frontend Design System Agent

**Review-agents**  
UX Journey Agent, QA Agent

**User problem**  
De actieve vergelijkpagina heeft geen strak ritme tussen hero, selection bar, verschillen, advies, tabel en acties. Mobiel worden compacte beslisblokken onnodig hoog doordat grids te vroeg naar 1 kolom vallen.

**Product surface**  
Actieve vergelijkpagina: `/vergelijken?ids=...`

**Scope**

- Maak de actieve compare hero compacter dan een marketinghero.
- Maak spacing tussen hero, selection bar, difference grid, decision panel, table en actions consistent.
- Laat `.difference-grid` op tablet niet direct naar 1 kolom vallen:
  - desktop: 5 of auto-fit compacte kolommen
  - tablet: 2 of 3 kolommen
  - mobiel: 1 kolom
- Los interne baseline mismatch op in difference cards, vooral de prijskaart.
- Maak decision cards bij 3 schoenen visueel gebalanceerd:
  - desktop bij 3 schoenen bij voorkeur 3 kolommen of auto-fit
  - bij 4 schoenen 2x2 of auto-fit zonder orphan-probleem
- Maak compare actions op mobiel full-width en netjes gestapeld.
- Behoud de interne horizontale scroll van de vergelijkingstabel.

**Ownership**

- `src/app/vergelijken/page.tsx`
- `src/app/globals.css`, uitsluitend comparepage selectors:
  - `.page-compare`
  - `.compare-result-hero`
  - `.compare-selection-bar`
  - `.difference-grid`
  - `.decision-panel`
  - `.decision-grid`
  - `.comparison-wrap`
  - `.compare-actions`
  - comparepage media queries

**Do not change**

- Geen wijzigingen aan `data/*`.
- Geen wijzigingen aan recommendation logic.
- Geen nieuwe `"use client"`.
- Geen algemene card/grid-styling wijzigen buiten comparepage scope zonder Lead Integrator akkoord.
- Geen Product/Offer/Review claims toevoegen.

**Expected output**

- CSS/page patch die de actieve vergelijkflow compacter en consistenter maakt.
- Korte toelichting per breakpoint:
  - `>=1080px`
  - `821-1079px`
  - `480-820px`
  - `<480px`

**Quality bar**

- Geen page-wide horizontale overflow.
- Tabel mag intern horizontaal scrollen.
- Section left/right alignment blijft consistent.
- Mobiele eerste 2 schermen moeten sneller bij kernverschillen komen.

**Integration point**

Lead Integrator controleert samenhang met `ALIGN-003` voordat productgrid wordt vervangen.

**Verification**

- Browsercheck op:
  - `1280x900`
  - `820x900`
  - `390x844`
- Routes:
  - `/vergelijken?ids=nike-pegasus-41,hoka-clifton-9`
  - `/vergelijken?ids=nike-pegasus-41,hoka-clifton-9,brooks-ghost-16`
  - `/vergelijken?ids=nike-pegasus-41,hoka-clifton-9,brooks-ghost-16,asics-gel-nimbus-26`
- `npm run typecheck`
- `npm run build`

---

## ALIGN-003 - Compacte Compare-Picker Component Voor Onderste Aanpas-Sectie

**Owner-agent**  
Frontend Components Agent

**Review-agents**  
Frontend Design System Agent, Lead Integrator

**User problem**  
De onderste "Vergelijking aanpassen" sectie gebruikt volledige `ProductCard`s. Op desktop maakt dit de pagina bijna `10.000px` langer; op mobiel bijna `29.000px`. Voor aanpassen is een compacte rij/card genoeg.

**Product surface**  
Onderste sectie van `/vergelijken?ids=...`: "Vergelijking aanpassen" en "Alle hardloopschoenen".

**Scope**

- Ontwerp een compacte compare-picker item component voor schoenen in de aanpas-sectie.
- Toon alleen de informatie die nodig is om een schoen toe te voegen/verwijderen:
  - merk + model
  - type/use-case
  - scorestatus of redactionele score compact
  - steun/demping/pasvorm maximaal 2-3 chips
  - actie: toevoegen, verwijderen of maximaal 4 bereikt
- Component moet server-rendered blijven.
- Gebruik bestaande `ShoeVisual` alleen als het compact kan; anders laat beeld weg in deze picker.

**Ownership**

- Nieuw bestand toegestaan: `src/components/CompareShoePickerItem.tsx`
- Eventueel kleine type-only props in bestaande componenten.
- Geen directe edits aan `src/app/vergelijken/page.tsx` zonder Lead Integrator akkoord.
- Geen edits aan `src/app/globals.css` behalve als de Lead Integrator dit expliciet overdraagt.

**Do not change**

- Geen volledige `ProductCard` redesign.
- Geen data- of scorelogica aanpassen.
- Geen client component toevoegen.
- Geen koop/offer/review claims toevoegen.

**Expected output**

- Nieuwe compacte component of componentvoorstel.
- Props-contract.
- Voorbeeldgebruik voor de comparepage.
- Advies of deze component later ook in `/schoenen?compare=` gebruikt kan worden.

**Quality bar**

- De aanpas-sectie moet scanbaar worden.
- Mobiele itemhoogte streefwaarde: circa `120-180px`, niet `900px+`.
- Desktop grid/row moet 2-4 items per rij aankunnen zonder rommelige baseline.

**Integration point**

Lead Integrator vervangt in `src/app/vergelijken/page.tsx` de onderste `ProductCard` mapping door deze component wanneer `ALIGN-002` klaar is.

**Verification**

- Component compileert server-side.
- Geen nieuwe `"use client"`.
- Browsercheck mobiel: onderaan geen enorme full-size card flow meer.

---

## ALIGN-004 - Visual QA En Regressiecheck

**Owner-agent**  
QA, Accessibility & Validation Agent

**Review-agents**  
Lead Integrator

**User problem**  
Spacing-fixes kunnen makkelijk nieuwe overflow, sticky overlap of regressies op catalogus/productcards veroorzaken.

**Product surface**  
Vergelijkpagina plus gedeelde componenten die geraakt worden door de implementatie.

**Scope**

- Maak een visuele baseline voor de huidige staat en een check na implementatie.
- Meet en rapporteer:
  - page-wide overflow
  - section left/right alignment
  - sticky selection bar hoogte
  - first contentful decision area op mobiel
  - productgrid hoogte in onderste aanpas-sectie
  - button alignment
  - table internal scroll
- Check ook dat `/schoenen`, `/keuzehulp` en productpagina's niet visueel geraakt zijn als globale CSS is aangepast.

**Ownership**

- QA-rapportbestand, bijvoorbeeld `BATCH-5-SPACING-QA.md`.
- Geen featurefiles wijzigen.

**Do not change**

- Geen UI-fixes zelf doen behalve P0/P1 na akkoord Lead Integrator.
- Geen snapshots of screenshots committen tenzij Lead Integrator dit vraagt.

**Expected output**

- P0/P1/P2 findings.
- Go/no-go voor merge van Batch 5.
- Concrete metingen voor `1280x900`, `820x900`, `390x844`.

**Quality bar**

- Niet alleen "ziet er beter uit"; rapport moet meetbare spacing/alignment-resultaten bevatten.
- Vergelijking moet sneller en rustiger voelen zonder informatieverlies.

**Integration point**

Laatste gate voor Lead Integrator.

**Verification**

- `rg -n '"use client"' src`
- `npm run typecheck`
- `npm run build`
- Browsercheck op 2, 3 en 4 geselecteerde schoenen.

## Dependency Map

ALIGN-001:
Agent: UX Journey  
Can start when: direct  
Needs from: browsermetingen in dit document  
Blocks: ALIGN-002 acceptatiecriteria  
Can parallel with: ALIGN-003, ALIGN-004 baseline  
Sync moment: layout contract review  
Risk: te conceptueel zonder meetbare targets

ALIGN-002:
Agent: Frontend Design System  
Can start when: ALIGN-001 richting voldoende is  
Needs from: UX contract  
Blocks: final QA  
Can parallel with: ALIGN-003 alleen als file ownership strikt blijft  
Sync moment: implementation review  
Risk: mergeconflict in `globals.css`

ALIGN-003:
Agent: Frontend Components  
Can start when: direct  
Needs from: huidig `ProductCard` contract en comparepage props  
Blocks: compact maken onderste aanpas-sectie  
Can parallel with: ALIGN-001 en QA baseline  
Sync moment: component integration review  
Risk: component blijft ongebruikt zonder Lead Integrator integratie

ALIGN-004:
Agent: QA, Accessibility & Validation  
Can start when: baseline direct, final na implementatie  
Needs from: ALIGN-002 en integratie van ALIGN-003  
Blocks: merge/release van Batch 5  
Can parallel with: baseline naast ALIGN-001/003  
Sync moment: final visual QA  
Risk: alleen desktop beoordelen en mobiel missen

## Conflicts / Escalations

- `src/app/globals.css` is een conflictgevoelig bestand. Slechts een agent mag de comparepage CSS-selectorblokken tegelijk aanpassen.
- Als UX wil dat de onderste aanpas-sectie minder producten toont, moet Product Owner beslissen of alle 30 schoenen zichtbaar moeten blijven of dat "toon meer" / filteren nodig is. Zonder client-state heeft server-side segmentering of aparte cataloguslink de voorkeur.
- Als de actieve compare hero zijn beeld verliest, moet Lead Integrator toetsen of dit past bij de visuele asset-regels. Voorkeur: compacter beeldgebruik, niet per se volledig verwijderen.

## Aanbevolen Uitvoervolgorde

1. Start `ALIGN-001`, `ALIGN-003` en `ALIGN-004` baseline parallel.
2. Laat Lead Integrator het UX-contract en componentcontract vastklikken.
3. Start `ALIGN-002` als enige agent met ownership over comparepage CSS.
4. Integreer `CompareShoePickerItem` in de onderste aanpas-sectie.
5. Draai `ALIGN-004` final QA.
6. Pas pas daarna eventuele polish toe op gedeelde `ProductCard` of catalogusgrid.

## Uitvoeringsstatus

Status 10 juni 2026: uitgevoerd en gevalideerd door Lead Integrator na parallelle agentronde.

Geintegreerd:

- Actieve vergelijkflow compacter gemaakt: hero, selectiebar, verschilkaarten en actions hebben nu comparepage-specifieke spacing.
- Vergelijkingstabel naar voren gehaald door de volledige advieskaarten onder de tabel te plaatsen.
- `src/components/CompareShoePickerItem.tsx` toegevoegd en in `/vergelijken` gebruikt voor de compare-picker.
- Onderste aanpas-sectie gebruikt geen full-size `ProductCard`s meer.
- Geen nieuwe `"use client"` boundary toegevoegd.

Gemeten resultaat op `/vergelijken?ids=nike-pegasus-41,hoka-clifton-9,brooks-ghost-16`:

- `1280x900`: tabel start rond `557px`, selection bar `71px`, geen page-wide overflow.
- `820x900`: tabel start rond `729px`, selection bar `93px`, geen page-wide overflow.
- `390x844`: tabel start rond `830px`, selection bar `121px`, alleen `.comparison-wrap` scrolt horizontaal.
- Compacte picker-items: circa `155px` desktop/tablet en `148px` mobiel; `productCardCount=0` in de aanpas-sectie.

Finale verificatie:

- `rg -n '"use client"' src`: alleen bestaande client-bestanden.
- `npm run typecheck`: groen.
- `npm run build`: groen.
- Browsermatrix groen voor 2, 3 en 4 geselecteerde schoenen op `1280x900`, `820x900` en `390x844`.
- Regressie-smoke groen op `/vergelijken`, `/schoenen`, `/keuzehulp` en `/schoenen/nike-pegasus-41`.
