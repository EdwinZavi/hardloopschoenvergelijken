# Admin dashboard roadmap

## Analyse

De huidige adminomgeving is functioneel, maar voelt nog niet als een professioneel beheerportaal:

- de publieke header met groot Loopwijzer-logo staat ook boven adminroutes
- het dashboard richt zich vooral op datakwaliteit, nog niet op bezoekers, accounts en gebruik
- veel informatie staat onder elkaar op een lange pagina
- er is nog geen duidelijke admin-navigatie voor dashboard, feedimports, accounts en automatisering
- analytics zijn nog niet gekoppeld aan echte tracking of privacykeuzes

## Productdoel

Maak van `/admin` het commandocentrum voor Loopwijzer:

- snelle KPI's bovenaan
- compacte adminnavigatie
- dropdown/uitklapbare secties voor diepere lijsten
- aparte account- en analyticslaag
- geen publieke marketingbranding in admin
- demo/seed-data duidelijk gescheiden van echte productieanalytics

## Ticket D1 - Admin shell zonder publieke branding

**Agent:** Admin Shell / Next.js Engineering Agent

**Probleem:** Adminroutes gebruiken nu dezelfde publieke header/footer als de website.

**Scope**

- root layout/chrome
- adminroute-detectie
- publieke routes ongemoeid laten

**Acceptance criteria**

- `/schoenen` toont de publieke header en footer.
- `/admin` en `/admin/imports/*` tonen geen publieke header/footer/logo-afbeelding.
- Adminroutes kunnen later eigen compacte adminnavigatie tonen.

## Ticket D2 - Admin analytics en account seeddata

**Agent:** Admin Analytics & Accounts Data Agent

**Probleem:** Er is nog geen dashboarding voor bezoekers, accounts, keuzehulpgebruik of affiliate-clicks.

**Scope**

- seeddata voor analytics
- seeddata voor adminaccounts
- typed helper-lib

**Acceptance criteria**

- Metrics bevatten bezoekers, pageviews, keuzehulpstarts, vergelijkingstarts, affiliate-clicks en accounts.
- Data is duidelijk `demo`/`seed` en niet gepresenteerd als echte productieanalytics.
- Er staan geen echte persoonsgegevens in seeddata.
- Minimaal 1 professioneel adminaccount is beschikbaar als seedrecord.

## Ticket D3 - Compact dashboard met dropdownsecties

**Agent:** Lead Integrator + Admin UX Agent

**Probleem:** De adminpagina is te lang en toont te veel tegelijk.

**Scope**

- `/admin`
- dashboard layout
- uitklapbare secties met `<details>`

**Acceptance criteria**

- Bovenaan staan alleen de belangrijkste KPI's en status.
- Diepere onderdelen staan in duidelijke dropdownsecties.
- Secties: Analytics, Accounts, Werkvoorraad, Kwaliteitschecks, Marktdekking, Keuzehulp, Schoenenbeheer.
- De pagina blijft bruikbaar zonder client JavaScript.

## Ticket D4 - Admin navigatie

**Agent:** Frontend Design System Agent

**Probleem:** Admin mist eigen navigatie tussen dashboard, imports, accounts, publieke site en uitloggen.

**Scope**

- admin dashboard header
- links naar kerngebieden

**Acceptance criteria**

- Compacte adminbar met `Dashboard`, `Feedimports`, `Publieke site`, `Methodologie`.
- Visueel anders dan publieke navigatie.
- Geen groot logo of producthero in admin.

## Ticket D5 - Privacyvriendelijke analyticsrichting

**Agent:** Analytics & Experimentation Agent

**Probleem:** Bezoekersaantallen zijn nuttig, maar mogen niet leiden tot onnodige tracking.

**Scope**

- analyticsmodel
- future tracking events
- privacyregels

**Acceptance criteria**

- Events meten productwaarde: keuzehulp starten, filters gebruiken, vergelijken, product bekijken, retailerlink klikken.
- Geen persoonlijke tracking in MVP.
- Analyticspagina labelt demo-data duidelijk.
- Cookiebeleid moet worden bijgewerkt zodra echte analytics live gaan.

## Eerste implementatievolgorde

1. D1: adminroutes losmaken van publieke header/footer.
2. D2: typed demo analytics en adminaccounts.
3. D3/D4: `/admin` herbouwen als compact dashboard met dropdownsecties.
4. D5: later koppelen aan echte privacyvriendelijke analytics.
