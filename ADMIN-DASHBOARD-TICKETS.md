# Admin Dashboard UX / IA Ticketplan

## Context en productdoel

De huidige adminpagina (`src/app/admin/page.tsx`) zet alle beheerinformatie op een lange pagina: publicatiestatus, datametrics, issues, kwaliteitspoort, marktdekking, keuzehulpdekking en de volledige schoenenlijst. Dat maakt de workspace inhoudelijk waardevol, maar operationeel zwaar. Voor een beheerder moet de pagina voelen als een professioneel dashboard: eerst snel zien wat aandacht nodig heeft, daarna gericht een sectie openen.

Productdoel: maak de admin een rustige, scanbare controlekamer voor vertrouwen. De bovenlaag geeft status, prioriteiten en snelle routes. De detailinformatie komt in uitklapbare secties, zodat data-, redactie- en retailwerk niet door elkaar heen lopen.

Belangrijke guardrails:
- Houd publieke productbranding gescheiden van adminbranding.
- Toon geen echte persoonsgegevens, sessiegegevens of gevoelige accountinformatie in demo-state.
- Maak duidelijk wanneer data demo, seed, placeholder of redactioneel gecontroleerd is.
- Blijf onderscheid maken tussen productkwaliteit, redactionele controle en retailer-/offerkwaliteit.

## Analyse huidige adminpagina

Huidige blokken:
- Hero met titel, uitleg, acties naar feedimports, publieke schoenenlijst en methodologie.
- Statuspanel met publicatiestatus en logout.
- Vier metric cards: schoenen, merken, verified offers, afbeeldingen.
- Werkvoorraad met issues per severity en owner.
- Publicatiepoort met minimale kwaliteitschecks.
- Marktdekking per schoentype.
- Keuzehulpdekking voor kernprofielen.
- Redactionele schoenenlijst als brede tabel.

Belangrijkste UX-probleem:
- Alles heeft bijna dezelfde visuele prioriteit. Daardoor moet de beheerder scrollen en lezen voordat duidelijk is wat vandaag actie vraagt.
- De admin combineert dashboard, datakwaliteitscontrole, publicatiepoort, keuzehulpvalidatie en catalogusbeheer op één niveau.
- Acties zijn deels publiek gericht (`/schoenen`, `/methodologie`) en deels admin gericht (`/admin/imports`), zonder duidelijke scheiding tussen beheercontext en publieke controle.

## Voorgestelde doelstructuur

1. Admin shell
   - Compacte bovenbalk/sidebar met adminnavigatie.
   - Admin-identiteit los van publieke merkbeleving.

2. Dashboard overview
   - Publicatiestatus, belangrijkste blockers, datadekking en feedstatus bovenaan.
   - KPI cards en analytics cards als scanbare samenvatting.

3. Uitklapbare werklagen
   - Datakwaliteit
   - Kwaliteitspoort
   - Marktdekking
   - Keuzehulp
   - Schoenenlijst

4. Accountbeheer
   - Beperkte, privacy-veilige accountzone met sessiestatus, rolindicatie en uitloggen.

---

## Ticket ADM-001: Compacte Adminnavigatie En Shell

Owner: Frontend Components Agent  
Files: `src/app/admin/page.tsx`, later eventueel gedeelde admincomponenten; CSS door integratielead.  
Scope: Introduceer een compacte adminnavigatie die beheerflows scheidt van publieke links.

User problem:
Beheerders hebben snelle routes nodig naar datakwaliteit, imports, keuzehulpcontrole, schoenenbeheer en accountbeheer zonder door de hele pagina te scrollen.

Te bouwen:
- Maak bovenaan een compacte admin header of sidebar met:
  - Dashboard
  - Feedimports
  - Datakwaliteit
  - Keuzehulp
  - Schoenen
  - Account
- Gebruik ankerlinks voor secties op dezelfde pagina waar nog geen aparte routes bestaan.
- Houd publieke links apart onder "Publieke controle" of als secundaire acties:
  - Publieke schoenenlijst
  - Methodologie
- Geef adminroutes visueel hogere prioriteit dan publieke previewlinks.

Acceptance criteria:
- Adminnavigatie is zichtbaar boven de fold op desktop en mobiel.
- Navigatie neemt minder ruimte in dan de huidige hero-actions.
- Publieke links zijn herkenbaar als preview/controle, niet als primaire beheeractie.
- De navigatie werkt zonder client state waar mogelijk; ankerlinks zijn voldoende voor MVP.
- Geen wijziging aan authlogica of routebescherming.

Risico's / trade-offs:
- Een sidebar kan te zwaar zijn voor de huidige MVP. Een compacte topnav is waarschijnlijk de kleinste waardevolle versie.

---

## Ticket ADM-002: KPI Dashboard Boven De Fold

Owner: UX/Product Flow Agent + Frontend Components Agent  
Files: `src/app/admin/page.tsx`; bestaande data uit `getAdminWorkspace()`.  
Scope: Herstructureer de eerste viewport rond beslissende dashboardstatus in plaats van lange uitleg.

User problem:
De beheerder wil direct weten of het platform publicatieklaar is en welke blokkades het vertrouwen raken.

Te bouwen:
- Vervang de lange hero door een compact dashboard-headergebied met:
  - Titel: "Admin dashboard"
  - Eén korte contextregel: "Bewaking van datakwaliteit, aanbevelingen en publicatiegereedheid."
  - Publicatiestatus als primaire statuskaart.
  - Aantal hoge prioriteit issues.
  - Laatste relevante beheerroute: feedimports.
- Plaats KPI cards direct onder of naast de status:
  - Schoenen: `shoeCount/targetShoeCount`
  - Data verified: `verifiedProductCount/shoeCount`
  - Redactionele scores gecontroleerd: `reviewedScoreCount/shoeCount`
  - Verified offers: `verifiedOfferCount/offerCount`
  - Afbeeldingsdekking: `imageCoverage%`

Acceptance criteria:
- Boven de fold is zonder scroll duidelijk: publicatieklaar of niet, hoeveel blockers, en welke datadekking ontbreekt.
- KPI labels zijn operationeel en concreet, niet marketingachtig.
- KPI cards vermelden waar relevant demo/seed-status impliciet via statuslabels in de detailsecties, niet als echte productieclaim.
- De bestaande metrics uit `workspace.stats` worden hergebruikt; geen nieuwe datalaag vereist.

Risico's / trade-offs:
- Te veel KPI's maken het dashboard opnieuw druk. Beperk de eerste laag tot maximaal vijf KPI cards.

---

## Ticket ADM-003: Analytics Cards Voor Trends En Werkprioriteit

Owner: Data & Recommendation Logic Agent voor definities; Frontend Components Agent voor rendering.  
Files: `src/app/admin/page.tsx`; optioneel later `src/lib/admin-data.ts` als lead besluit extra derived fields toe te voegen.  
Scope: Voeg compacte analytics cards toe die werkprioriteit tonen zonder de detailsecties te openen.

User problem:
Niet elke metric is even actiegericht. Beheerders moeten snel zien welke discipline werk heeft: Data, Redactie, Retail of Keuzehulp.

Te bouwen:
- Maak een rij "Werkprioriteit" met 3-4 analytics cards:
  - Issues per owner: Data / Redactie / Retail / Keuzehulp.
  - Issues per severity: Hoog / Middel / Laag.
  - Publicatiepoort voortgang: geslaagde checks van totaal.
  - Keuzehulpdekking: kernprofielen met minimaal 3 matches.
- Gebruik bestaande `workspace.issues`, `workspace.readyChecks` en `workspace.recommendationCoverage`.
- Toon geen grafiek die precisie suggereert als de data seed/demo is; compacte counts en eenvoudige bars zijn betrouwbaarder.

Acceptance criteria:
- Elke analytics card beantwoordt: "Waar moet ik nu kijken?"
- Cards linken of verwijzen naar de juiste collapsible sectie.
- Severity en owner labels blijven consistent met bestaande `AdminIssue` waarden.
- Demo-data wordt niet gepresenteerd als echte gebruikersanalytics.

Risico's / trade-offs:
- Trendgrafieken zijn pas zinvol met historische data. Voor MVP alleen actuele coverage en issueverdeling tonen.

---

## Ticket ADM-004: Privacyveilig Accountbeheer

Owner: Pages & Trust Content Agent + Frontend Components Agent  
Files: `src/app/admin/page.tsx`; geen authwijzigingen tenzij lead apart plant.  
Scope: Maak accountbeheer een rustige adminsectie in plaats van alleen een logout-knop in het statuspanel.

User problem:
Een professioneel dashboard heeft een herkenbare accountzone, maar deze MVP mag geen privacygevoelige of niet-bestaande accountdata faken.

Te bouwen:
- Voeg compacte accountsectie of accountmenu toe met:
  - Rol: "Admin"
  - Omgeving: "Lokale MVP" of "Demo workspace"
  - Sessienotitie: "Reviewbeslissingen kunnen demo/session-based zijn waar van toepassing."
  - Uitloggen
- Vermijd naam, e-mail, IP, loginhistorie of auditlog zolang die niet echt bestaan.
- Link eventueel naar feedimport reviewstate uitleg als die op importdetailpagina relevant blijft.

Acceptance criteria:
- Logout blijft beschikbaar en duidelijk.
- Er wordt geen nepaccount of neporganisatie getoond.
- De UI benoemt demo-/lokale beperkingen eerlijk.
- Accountbeheer voelt onderdeel van de admin, niet van de publieke site.

Risico's / trade-offs:
- Te veel accountdetails wekken valse productvolwassenheid. Houd dit bewust klein.

---

## Ticket ADM-005: Collapsible Sectie Datakwaliteit

Owner: Data & Recommendation Logic Agent  
Files: `src/app/admin/page.tsx`; CSS/interaction door lead of Frontend Components Agent.  
Scope: Verplaats "Issues die vertrouwen raken" naar een uitklapbare datakwaliteitsectie.

User problem:
Issues zijn belangrijk, maar de volledige lijst hoeft niet altijd open te staan. Beheerders moeten eerst de samenvatting zien en daarna details openen.

Te bouwen:
- Maak een collapsible sectie "Datakwaliteit".
- Header toont:
  - Totaal aantal issues.
  - Aantal hoge prioriteit issues.
  - Dominante owner of "Meeste werk: Data/Retail/Redactie/Keuzehulp" indien eenvoudig afleidbaar.
- Open state toont bestaande issue cards.
- Sorteer blijft op severity zoals nu.
- Gebruik duidelijke badges: Hoog, Middel, Laag en owner.

Acceptance criteria:
- Sectie is standaard open als er hoge prioriteit issues zijn; anders standaard ingeklapt of compact.
- Elk issue behoudt title, detail, severity en owner.
- Geen issue wordt verborgen zonder samenvattende count.
- Copy blijft trust-first: "blokkeert vertrouwen" is beter dan "foutje".

Risico's / trade-offs:
- HTML `<details>`/`<summary>` is snel en toegankelijk voor MVP. Custom disclosure kan later als styling meer controle vraagt.

---

## Ticket ADM-006: Collapsible Sectie Kwaliteitspoort

Owner: Pages & Trust Content Agent  
Files: `src/app/admin/page.tsx`.  
Scope: Maak publicatiechecks een eigen uitklapbare kwaliteitspoort met beslisbare status.

User problem:
De beheerder moet weten welke minimale checks publicatie blokkeren, zonder dat alle checks continu schermruimte vragen.

Te bouwen:
- Maak collapsible sectie "Kwaliteitspoort".
- Header toont:
  - `passedChecks/totalChecks`
  - Status: "Publicatieklaar" of "Niet publicatieklaar"
  - Aantal gefaalde checks
- Open state toont bestaande `readyChecks`.
- Maak onderscheid tussen harde blockers en verbeterpunten indien dat uit de data kan; zo niet, noem het "Minimale MVP-checks".

Acceptance criteria:
- De poort is niet verstopt: als checks falen, is dat zichtbaar in header.
- Labels blijven concreet: "Geen placeholderlinks in offers", "Scores redactioneel gecontroleerd".
- Geen commerciële publicatieclaim zolang placeholderoffers of seed-scores bestaan.
- Sectie ondersteunt de trustregel: productdata, scores en offers blijven aparte checks.

Risico's / trade-offs:
- De huidige checks hebben alleen boolean `passed`. Prioritering van harde/lichte checks kan later in `admin-data` worden toegevoegd.

---

## Ticket ADM-007: Collapsible Sectie Marktdekking

Owner: Data & Recommendation Logic Agent  
Files: `src/app/admin/page.tsx`.  
Scope: Maak marktdekking per schoentype compact en scanbaar.

User problem:
Marktdekking is relevant voor strategische datagroei, maar minder urgent dan blockers. Het hoort in een openklapbare analyselaag.

Te bouwen:
- Maak collapsible sectie "Marktdekking".
- Header toont:
  - Aantal schoentypes met dekking.
  - Laagste categorieën, bijvoorbeeld "Trail en race vragen aandacht" als counts laag zijn.
- Open state toont bestaande bars per `typeOrder`.
- Gebruik labels uit `labels.shoeType`.
- Voeg korte admin-copy toe: "Gebruik dit om te bepalen welke categorieën de catalogus nog scheef maken."

Acceptance criteria:
- Alle bestaande schoentypes blijven zichtbaar in open state.
- Counts worden niet als volledige Nederlandse marktdekking gepresenteerd; het is catalogusdekking.
- Copy voorkomt valse autoriteit: zeg "catalogusdekking", niet "marktaandeel".
- Bars blijven proportioneel en compact.

Risico's / trade-offs:
- Zonder externe marktdata kan dit geen echte marktpenetratie meten. Noem het dus bewust intern/catalogusgericht.

---

## Ticket ADM-008: Collapsible Sectie Keuzehulp

Owner: Data & Recommendation Logic Agent + UX/Product Flow Agent  
Files: `src/app/admin/page.tsx`.  
Scope: Maak keuzehulpdekking voor kernprofielen een uitklapbare validatiesectie.

User problem:
Aanbevelingen moeten uitlegbaar en robuust zijn. De beheerder wil zien welke profielen genoeg matches krijgen en waar uitleg zwak is.

Te bouwen:
- Maak collapsible sectie "Keuzehulp".
- Header toont:
  - Aantal kernprofielen met minimaal 3 matches.
  - Aantal profielen met zwakke uitleggevallen.
- Open state toont bestaande `recommendationCoverage` rows:
  - Profiel
  - Topschoen
  - Matchscore
  - Aantal matches
  - Zwakke uitleggevallen indien beschikbaar
- Voeg waarschuwingstekst toe als topmatch of resultCount laag is: "Controleer of dit profiel genoeg alternatieven heeft."

Acceptance criteria:
- Profielen zoals "Beginner op de weg", "Brede voeten" en "Stabiliteit nodig" blijven zichtbaar.
- Keuzehulpstatus gaat niet alleen over matchscore, maar ook over alternatieven en uitleg.
- Geen taal als "perfecte match"; gebruik "topmatch binnen huidige catalogus".
- De sectie helpt explainability te bewaken.

Risico's / trade-offs:
- Matchscores zijn alleen zo goed als de huidige seeddata. Maak die onzekerheid zichtbaar waar nodig.

---

## Ticket ADM-009: Collapsible Sectie Schoenenlijst

Owner: Frontend Components Agent  
Files: `src/app/admin/page.tsx`.  
Scope: Maak de brede redactionele schoenenlijst standaard compact met duidelijke toegang tot de tabel.

User problem:
De schoenenlijst is belangrijk voor beheer, maar als volledige tabel domineert hij de pagina en duwt strategische status naar beneden.

Te bouwen:
- Maak collapsible sectie "Schoenenlijst".
- Header toont:
  - Totaal aantal schoenen.
  - Aantal data-verified.
  - Aantal redactioneel gecontroleerde scores.
  - Aantal met ontbrekende afbeelding of offers indien eenvoudig beschikbaar.
- Open state toont bestaande tabel.
- Voeg boven de tabel compacte table controls toe als MVP-copy of toekomstige placeholder:
  - Filter op datastatus
  - Filter op scorestatus
  - Filter op schoentype
  - Zoek op merk/model
- Als controls nog niet functioneel worden gebouwd, niet tonen als interactieve nepcontrols; neem ze alleen op in vervolgticket.

Acceptance criteria:
- Tabel staat niet standaard volledig open op kleine schermen, tenzij lead bewust anders kiest.
- Brede tabel blijft horizontaal scrollbaar en leesbaar.
- Link "Publieke lijst openen" blijft secundair aanwezig.
- Geen bewerkingsknoppen suggereren als er nog geen editflow is; "Bekijk" blijft correct.

Risico's / trade-offs:
- Functionele tabelcontrols zijn nuttig maar kunnen scope vergroten. Voor deze dashboardcleanup is collapsible + samenvatting belangrijker.

---

## Ticket ADM-010: Scheiding Publieke Branding Vs Admin Branding

Owner: Pages & Trust Content Agent + Frontend Components Agent  
Files: `src/app/admin/page.tsx`, globale admin styling door lead.  
Scope: Definieer een adminvisuele taal die professioneel voelt zonder de publieke consumentenbranding te kopiëren.

User problem:
Admingebruikers moeten voelen dat ze in een beheeromgeving zitten. Publieke merkvertrouwen blijft belangrijk, maar het dashboard moet operationeel zijn.

Te bouwen:
- Admincopy:
  - Gebruik "Admin dashboard", "Dataworkspace", "Publicatiepoort", "Catalogusdekking".
  - Vermijd publieke marketingtaal en grote consumentenhero.
- Visueel:
  - Compactere header dan publieke pagina's.
  - Dashboardachtige cards, tabular density en statusbadges.
  - Adminkleurgebruik mag rustiger/neutraler zijn, maar moet wel aansluiten bij vertrouwen en leesbaarheid.
- Plaats publieke controlelinks in een aparte groep:
  - "Publieke preview"
  - "Bekijk publieke schoenenlijst"
  - "Controleer methodologie"

Acceptance criteria:
- Een gebruiker ziet binnen 3 seconden dat dit admin is, niet de publieke homepage.
- Publieke links zijn duidelijk preview/controle en niet primaire beheerflow.
- Geen publieke conversie-CTA's of affiliateachtige taal in admin.
- Adminstijl blijft toegankelijk en professioneel, niet flashy.

Risico's / trade-offs:
- Te veel visuele afwijking kan extra CSS-complexiteit geven. Begin met admin-specifieke layout, status en spacing; niet met een volledig nieuw designsysteem.

---

## Ticket ADM-011: Collapsible Component Keuze En Toegankelijkheid

Owner: Frontend Components Agent  
Files: bij voorkeur lokale helper in `src/app/admin/page.tsx` voor MVP; later reusable component.  
Scope: Kies een implementatiepatroon voor uitklapbare secties.

User problem:
Uitklapbare secties moeten schoon zijn, maar ook toegankelijk, linkbaar en robuust zonder onnodige client-side complexiteit.

Te bouwen:
- Gebruik voor MVP native `<details>` en `<summary>` of een kleine server-renderbare component.
- Geef elke sectie een stabiel `id`:
  - `datakwaliteit`
  - `kwaliteitspoort`
  - `marktdekking`
  - `keuzehulp`
  - `schoenenlijst`
  - `account`
- Header bevat altijd statusinformatie, ook ingeklapt.
- Standaard open:
  - Datakwaliteit als er high issues zijn.
  - Kwaliteitspoort als checks falen.
  - Andere secties standaard dicht op mobiel.

Acceptance criteria:
- Secties zijn keyboard-toegankelijk.
- Ingeklapte secties verliezen geen kritieke statusinformatie.
- Ankerlinks vanuit adminnavigatie werken.
- Geen client component nodig tenzij de lead bewust kiest voor custom state.

Risico's / trade-offs:
- Native `<details>` heeft beperkte stylingcontrole, maar is snel, betrouwbaar en passend voor MVP.

---

## Ticket ADM-012: Demo-Data En Vertrouwenscopy

Owner: Pages & Trust Content Agent  
Files: `src/app/admin/page.tsx`; mogelijk importdetailcopy later.  
Scope: Voeg kleine, eerlijke admincopy toe die demo-/seed-status uitlegt zonder het dashboard te vervuilen.

User problem:
Een trust-first platform mag demo- of seeddata niet laten lijken op gevalideerde productie-informatie.

Te bouwen:
- Voeg een compacte notice toe in dashboard of accountsectie:
  - "Deze MVP-workspace kan demo-, seed- en placeholderdata bevatten. Publiceer pas wanneer data, scores en offers gecontroleerd zijn."
- Gebruik bestaande statuslabels:
  - `Concept`
  - `Controle nodig`
  - `Geverifieerd`
  - `Seed-inschatting`
  - `Redactioneel gecontroleerd`
  - `Getest`
- Plaats de notice niet als groot waarschuwingsblok tenzij er high issues zijn.

Acceptance criteria:
- Demo/seed/placeholderstatus is eerlijk zichtbaar.
- Copy ondermijnt de publieke propositie niet, maar beschermt vertrouwen.
- Geen claim dat prijzen, offers of scores live/volledig zijn als dat niet uit data blijkt.
- De notice is kort genoeg om het dashboard clean te houden.

Risico's / trade-offs:
- Te veel waarschuwingstekst maakt het dashboard onzeker. Houd het feitelijk en operationeel.

---

## Aanbevolen Bouwvolgorde

1. ADM-011 Collapsible component keuze en sectie-ids.
2. ADM-001 Compacte adminnavigatie.
3. ADM-002 KPI dashboard boven de fold.
4. ADM-005 t/m ADM-009 secties ombouwen naar collapsibles.
5. ADM-003 analytics cards voor werkprioriteit.
6. ADM-004 accountbeheer.
7. ADM-010 en ADM-012 branding/trustcopy polish.

Kleinste waardevolle versie:
- Compacte admin header.
- KPI/status bovenaan.
- Vijf collapsible secties met bestaande data.
- Account/logout los van publicatiestatus.
- Eerlijke demo-data notice.

## Validatie Voor Lead Integrator

Controleer na implementatie:
- `npm run build`
- Adminpagina desktop en mobiel.
- Keyboardbediening van collapsible secties.
- Authredirect blijft werken.
- Publieke previewlinks werken.
- Geen nepaccountdata of valse productieclaims.
- Hoge prioriteit issues blijven zichtbaar zonder dat de beheerder hoeft te zoeken.
