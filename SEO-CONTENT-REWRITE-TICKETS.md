# SEO Content Rewrite Tickets

## Doel

Alle publieke websitecopy herschrijven volgens de nieuwe `loopwijzer-seo-content` skill:

- menselijk, concreet en rustig Nederlands
- people-first en niet keyword-first
- zichtbaar gekoppeld aan productdata, keuzehulp, vergelijking en vertrouwen
- geen generieke AI-achtige SEO-tekst
- geen "beste" claims zonder context, doelgroep, criteria en trade-off
- geen affiliate-, prijs- of testclaim die sterker is dan de data

Skillbron:

- `/Users/edjezavi/.codex/skills/loopwijzer-seo-content/SKILL.md`
- `/Users/edjezavi/.codex/skills/loopwijzer-seo-content/references/google-search-principles.md`
- `/Users/edjezavi/.codex/skills/loopwijzer-seo-content/references/loopwijzer-seo-brief.md`
- `/Users/edjezavi/.codex/skills/loopwijzer-seo-content/scripts/content_quality_audit.py`

## Scope

In scope:

- publieke Nederlandse pagina's
- publieke Engelse pagina's als aparte parity-fase
- metadata, titles, descriptions, FAQ-copy en structured-data tekst
- homepage, catalogus, productpagina's, vergelijken, keuzehulp, adviespagina's, trust/legal pagina's
- product- en aanbevelingscopy uit datafiles wanneer die publiek wordt getoond
- labels, CTA's, empty states, microcopy, alt-teksten en truststrips

Niet in scope:

- admin-dashboardcopy, tenzij publiek zichtbaar
- visueel redesign
- nieuwe productdata verzinnen
- nieuwe reviews verzinnen
- recommendation scoring wijzigen zonder apart dataticket
- client rendering toevoegen voor copywerk

## Kwaliteitslat

Elke herschreven tekst moet:

- een echte keuzevraag beantwoorden
- een concreet type loper, situatie of productdimensie noemen waar relevant
- uitleggen wat belangrijk is, wat minder belangrijk is en waar de trade-off zit
- productkwaliteit, persoonlijke match, reviews en retailerinformatie gescheiden houden
- twijfel of onzekerheid benoemen waar data onvolledig is
- intern linken naar filters, keuzehulp, vergelijking, productpagina of methodologie waar logisch
- slagen voor handmatige review op trust, duidelijkheid en decision value

## Validatie Voor De Hele Cyclus

Run na relevante tickets:

```bash
python3 /Users/edjezavi/.codex/skills/loopwijzer-seo-content/scripts/content_quality_audit.py <changed-files>
rg -n '"use client"' src
npm run typecheck
npm run build
```

Browsercheck:

- homepage
- `/schoenen`
- één productpagina
- `/vergelijken`
- `/keuzehulp`
- `/advies`
- minimaal drie `/advies/*` pagina's
- `/methodologie`
- `/onafhankelijkheid`
- `/over-ons`
- `/contact`

## Agentindeling

Lead Integrator:

- bewaakt scope, file ownership, integratie en validatie
- verwerkt conflicten tussen SEO, trust, data en UX
- accepteert alleen copy die keuzezekerheid vergroot

SEO & Intent Architecture Agent:

- intentstructuur, metadata, internal links, FAQ en adviesroutes

Dutch UX Copy & Content Agent:

- Nederlandse UX-copy, CTA's, labels, headers en uitlegblokken

Editorial Trust & Methodology Agent:

- methodologie, onafhankelijkheid, claims, scorestatus, affiliate-transparantie

Data & Recommendation Logic Agent:

- productverdicts, recommendation reasons, rule labels en datacopy

QA, Accessibility & Validation Agent:

- copy-audit, structured-data check, build, browsercheck en trust regressions

---

## Ticket SEO-001 - Contentinventaris En Risicobaseline

**User problem**  
We kunnen niet betrouwbaar "alle tekst" herschrijven zonder eerst te weten welke copy publiek zichtbaar is, waar die vandaan komt en welke risico's de huidige tekst bevat.

**Product surface**  
Volledige publieke websitecopy, data-copy, metadata en structured-data copy.

**Scope**

- Maak een inventaris van alle publieke copybronnen:
  - `src/app/page.tsx`
  - `src/app/schoenen/page.tsx`
  - `src/app/schoenen/[slug]/page.tsx`
  - `src/app/vergelijken/page.tsx`
  - `src/app/keuzehulp/page.tsx`
  - `src/app/advies/page.tsx`
  - `src/app/advies/[slug]/page.tsx`
  - `src/app/methodologie/page.tsx`
  - `src/app/onafhankelijkheid/page.tsx`
  - `src/app/over-ons/page.tsx`
  - `src/app/contact/page.tsx`
  - `src/app/privacy/page.tsx`
  - `src/app/cookies/page.tsx`
  - `src/components/*.tsx`
  - `src/lib/intent-pages.ts`
  - `src/lib/labels.ts`
  - `src/lib/recommendations.ts`
  - `data/shoes.json`
  - `data/recommendation-rules.json`
  - Engelse routes onder `src/app/en/*`
- Run het content-audit script op de belangrijkste copybestanden.
- Label elk tekstgebied als `publish`, `revise`, `rewrite`, of `park`.
- Markeer claims met risico:
  - "beste"
  - "goedkoopste"
  - medisch/blessure
  - testclaim
  - affiliate/prijscopy
  - generieke SEO-intro

**Ownership**

- Alleen rapportagebestand of ticketnotities.
- Geen codewijzigingen.

**Do not change**

- Geen copy herschrijven in dit ticket.
- Geen routes, data of componenten wijzigen.

**Expected output**

- Contentinventaris met prioriteiten.
- Risicolijst per pagina.
- Aanbevolen volgorde voor tickets SEO-002 t/m SEO-012.

**Acceptance criteria**

- Alle publieke copybronnen zijn genoemd.
- Elke bron heeft een eigenaar voor een vervolgticket.
- Audit-output is samengevat zonder scriptwaarschuwingen klakkeloos als waarheid te behandelen.

**Verification**

- `content_quality_audit.py` draait op minimaal:
  - `src/lib/intent-pages.ts`
  - `src/app/page.tsx`
  - `src/app/schoenen/[slug]/page.tsx`
  - `src/app/keuzehulp/page.tsx`
  - `data/shoes.json`

---

## Ticket SEO-002 - Globale Merk-, Navigatie- En Trustcopy

**User problem**  
Gebruikers moeten overal direct voelen dat dit een rustige keuzehulp is, geen kortingssite of generieke affiliatevergelijker.

**Product surface**

- layoutmetadata
- navigatie
- footer
- truststrip
- labels
- componentmicrocopy

**Scope**

- Herschrijf globale metadata en sitebrede copy waar nodig.
- Verfijn truststrip-copy zodat elk signaal concreet en controleerbaar is.
- Controleer CTA's op helderheid:
  - `Start keuzehulp`
  - `Bekijk alle schoenen`
  - `Vergelijk`
  - `Bekijk advies`
- Controleer `src/lib/labels.ts` op begrijpelijke Nederlandse labels.
- Zorg dat `hardloopschoenvergelijken.nl` primaire merknaam blijft en `Loopwijzer` pay-off/gedachte.

**Ownership**

- `src/app/layout.tsx`
- `src/components/SiteChrome.tsx`
- `src/components/TrustStrip.tsx`
- `src/lib/labels.ts`
- eventueel componentlabels in `src/components/ProductCard.tsx` en `src/components/RecommendationCard.tsx`

**Do not change**

- Geen routestructuur.
- Geen styling behalve wanneer copy-overflow echt ontstaat.
- Geen nieuwe client boundaries.

**Expected output**

- Rustige, consistente globale copy.
- Geen generieke claims of verkoopdruk.

**Acceptance criteria**

- Trustcopy benoemt scheiding tussen productkwaliteit, match en prijs.
- Navigatielabels zijn scanbaar voor beginners en gevorderden.
- Geen "beste deal", urgentie of overdreven beloftes.
- Metadata is beschrijvend en niet keyword-gestapeld.

**Verification**

- Run content-audit op gewijzigde bestanden.
- Run `rg -n '"use client"' src` en verklaar geen nieuwe client boundary.

---

## Ticket SEO-003 - Homepage Herschrijven Naar Van Verwarring Naar Vertrouwen

**User problem**  
De homepage moet nieuwe bezoekers snel laten kiezen tussen begeleiding, bladeren en vergelijken zonder marketingtaal of generieke SEO-belofte.

**Product surface**

- Homepage.

**Scope**

- Herschrijf hero, lead, CTA-context, trustsignalen, startpaden en slotblok.
- Maak de H1 concreet en menselijk.
- Voeg waar logisch meer decision framing toe:
  - voor wie is keuzehulp logisch?
  - wanneer direct vergelijken?
  - waarom niet alleen merk/prijs?
- Verwijder of verzwak claims die klinken als algemene autoriteit zonder bewijs.
- Check alt-tekst: functioneel waar beeld inhoud draagt, leeg waar decoratief.

**Ownership**

- `src/app/page.tsx`

**Do not change**

- Geen componentarchitectuur.
- Geen styling tenzij tekst niet past.
- Geen productselectie wijzigen zonder datageldige reden.

**Expected output**

- Homepagecopy die direct de vier kernjobs ondersteunt:
  - begrijpen
  - persoonlijke fit
  - vergelijken
  - vertrouwen

**Acceptance criteria**

- De eerste viewport maakt duidelijk wat de site doet en waar de gebruiker start.
- Minimaal één tekstblok legt uit waarom vergelijking meer is dan merk en prijs.
- CTA's leiden logisch naar keuzehulp, schoenenlijst of vergelijking.
- Geen generieke zinnen zoals "ontdek alles over".

**Verification**

- Run content-audit op `src/app/page.tsx`.
- Browsercheck desktop en mobiel.

---

## Ticket SEO-004 - Catalogus, Filters En Productkaartcopy

**User problem**  
Gebruikers op de cataloguspagina moeten snel snappen hoe ze kunnen vernauwen, welke verschillen ertoe doen en waarom een productkaart relevant is.

**Product surface**

- `/schoenen`
- productkaarten
- filterlabels
- empty states

**Scope**

- Herschrijf catalogusintro, filteruitleg, sorteerlabels en empty-state copy.
- Maak productkaartcopy korter en concreter waar data dat toelaat.
- Zorg dat filters als keuzehulp voelen, niet als technische muur.
- Voeg bij lege resultaten nuttige herstelroutes toe:
  - reset breedte
  - verruim budget
  - vergelijk neutraal/stabiliteit
  - start keuzehulp
- Controleer dat productkaarten productkwaliteit en prijs niet door elkaar halen.

**Ownership**

- `src/app/schoenen/page.tsx`
- `src/components/ProductCard.tsx`
- `src/lib/labels.ts` alleen als SEO-002 dit nog niet heeft gedaan

**Do not change**

- Geen filterlogica wijzigen buiten label/copy.
- Geen datavelden toevoegen.
- Geen client-side filterstate introduceren.

**Expected output**

- Cataloguscopy die gebruikers helpt vernauwen op gebruik, steun, demping, pasvorm en prijs.

**Acceptance criteria**

- Intro benoemt marktoriëntatie en filterkeuze.
- Empty state geeft concrete resetopties.
- Productkaartsummary blijft compact en niet salesy.
- Prijsinformatie blijft feitelijk.

**Verification**

- Run content-audit op gewijzigde bestanden.
- Browsercheck `/schoenen` met en zonder filters.

---

## Ticket SEO-005 - Productpagina's En Productdata-Verdicts Herschrijven

**User problem**  
Productpagina's moeten per schoen uitleggen voor wie het model logisch is, waar de beperkingen zitten en welke specs dat verklaren.

**Product surface**

- `/schoenen/[slug]`
- productverdicts
- productdata die publiek wordt getoond

**Scope**

- Herschrijf productpaginaheaders, scoreuitleg, fit/ride notes, retailerdisclosure en alternatiefcopy.
- Herschrijf publieke summaries/verdicts in `data/shoes.json` waar ze generiek of te absoluut klinken.
- Elk productverdict moet minimaal bevatten:
  - best for
  - less suitable for
  - concrete trade-off
  - datastatus nuance wanneer nodig
- Controleer dat "review" in metadata niet suggereert dat er hands-on test is als dat niet klopt.
- Houd productkwaliteit, persoonlijke match en retaileroffers gescheiden.

**Ownership**

- `src/app/schoenen/[slug]/page.tsx`
- `data/shoes.json`
- eventueel `src/components/ShoeVisual.tsx` voor beeldloze/placeholdercopy

**Do not change**

- Geen scores aanpassen tenzij aantoonbaar copy/data mismatch.
- Geen fictieve testervaring of gebruikersreviews toevoegen.
- Geen retailerlinks of offers verzinnen.

**Expected output**

- Productcopy die voelt als redactioneel oordeel met nuance, niet als webshoptekst.

**Acceptance criteria**

- Elke publieke productsummary heeft een concrete doelgroep of gebruikssituatie.
- Elk "minder geschikt" signaal benoemt een echte trade-off.
- Geen productpagina noemt een test, reviewscore of prijsvoordeel dat niet zichtbaar onderbouwd is.
- Affiliate/prijsdisclosure blijft zichtbaar bij kooplaag.

**Verification**

- Run content-audit op `src/app/schoenen/[slug]/page.tsx` en `data/shoes.json`.
- Browsercheck minimaal 3 productpagina's:
  - daily trainer
  - stability
  - carbon/race of trail

---

## Ticket SEO-006 - Keuzehulp En Aanbevelingscopy Herschrijven

**User problem**  
Keuzehulpresultaten moeten niet klinken alsof een algoritme zomaar iets roept. De gebruiker moet begrijpen waarom een schoen past en welke concessie hij maakt.

**Product surface**

- `/keuzehulp`
- recommendation cards
- recommendation rules
- match labels

**Scope**

- Herschrijf keuzehulpintro, vragen, antwoordlabels en resultuitleg.
- Herschrijf matchlabels en reason/tradeoff-copy waar nodig.
- Zorg dat elke aanbeveling uitlegbaar blijft op:
  - loopdoel
  - ondergrond
  - afstand
  - steun
  - gevoel
  - pasvorm
  - budget
- Maak blessuregevoeligheid voorzichtig: geen medische diagnose of preventieclaim.
- Voeg bij zwakkere matches eerlijke onzekerheids- of alternatiefcopy toe.

**Ownership**

- `src/app/keuzehulp/page.tsx`
- `src/components/RecommendationCard.tsx`
- `src/lib/recommendations.ts`
- `data/recommendation-rules.json`

**Do not change**

- Geen scoringgewichten wijzigen zonder aparte data-review.
- Geen nieuwe profielvelden toevoegen.
- Geen browserstate toevoegen.

**Expected output**

- Keuzehulp die persoonlijke match uitlegt in normale Nederlandse taal.

**Acceptance criteria**

- Matchcopy noemt concrete redenen en trade-offs.
- Geen aanbeveling gebruikt "perfect", "beste voor iedereen" of medische zekerheid.
- Budget wordt als randvoorwaarde behandeld, niet als kwaliteitsbewijs.
- Keuzehulp blijft URL-gedreven/shareable waar bestaand.

**Verification**

- Run content-audit op gewijzigde bestanden.
- Browsercheck meerdere keuzehulpquery's:
  - beginner comfort
  - stabiliteit
  - brede voeten
  - sneller trainen

---

## Ticket SEO-007 - Vergelijkingsflowcopy Herschrijven

**User problem**  
Vergelijken moet de verschillen tussen schoenen begrijpelijk maken, niet alleen tabellen tonen of één universele winnaar suggereren.

**Product surface**

- `/vergelijken`
- comparison cues
- next-step copy

**Scope**

- Herschrijf comparison header, lege staat, quick takeaways en recommendation cues.
- Maak vergelijkingscopy concreet:
  - beter voor steun
  - lichter/directer
  - zachter/comfortabeler
  - betere prijs-kwaliteit als data dat ondersteunt
- Voeg waar nodig "kies niet alleen op..." nuance toe.
- Controleer dat prijsvergelijking niet als redactionele winnaar voelt.

**Ownership**

- `src/app/vergelijken/page.tsx`

**Do not change**

- Geen vergelijkingstabellogica wijzigen.
- Geen productranking of scoring aanpassen.
- Geen nieuwe productdata toevoegen.

**Expected output**

- Vergelijkingscopy die snelle, eerlijke verschillen toont.

**Acceptance criteria**

- Lege staat geeft duidelijke route terug naar catalogus en keuzehulp.
- Cues zijn contextueel, niet absoluut.
- Geen "winnaar" zonder doelgroep.
- Prijs en score blijven zichtbaar gescheiden.

**Verification**

- Run content-audit op `src/app/vergelijken/page.tsx`.
- Browsercheck lege vergelijking en vergelijking met 2-3 schoenen.

---

## Ticket SEO-008 - Adviesindex En Intentpagina's Volledig Herschrijven

**User problem**  
Bezoekers die via zoekmachines binnenkomen moeten op elke adviespagina direct een betrouwbare keuzevraag, relevante filters en bruikbare vergelijking krijgen.

**Product surface**

- `/advies`
- `/advies/*`
- intentdata
- FAQ schema
- related links

**Scope**

- Herschrijf alle Nederlandse intentpagina's volgens de skillstructuur:
  - specifieke H1
  - lead met doelgroep en beslissing
  - criteria
  - `Kies vooral op`
  - `Let minder op`
  - `Veelgemaakte fout`
  - guidance blocks
  - FAQ's die echte twijfel beantwoorden
  - related routes
- Controleer en corrigeer compare seeds.
- Controleer helperHref-query's op geldige keuzehulpwaarden.
- Groepeer adviesindex in duidelijke categorieën:
  - Starten
  - Pasvorm
  - Steun en blessuregevoeligheid
  - Afstand
  - Snelheid
  - Budget
  - Ondergrond
- Herschrijf metadata per intentpagina zodat die decision value samenvat.
- Verwijder "beste" taal zonder context of vervang door "geschikt voor..." / "logisch als...".

**Ownership**

- `src/lib/intent-pages.ts`
- `src/app/advies/page.tsx`
- `src/app/advies/[slug]/page.tsx`

**Do not change**

- Geen recommendation scoring.
- Geen product/offers aanpassen.
- Geen Engelse routes in dit ticket.

**Expected output**

- Advieslaag die niet als dunne SEO-blog voelt maar als route naar betere keuze.

**Acceptance criteria**

- Elke intentpagina heeft decision framing.
- Elke intentpagina linkt naar filterroute, keuzehulp of vergelijking.
- FAQ schema matcht zichtbare FAQ-copy exact.
- Geen intentpagina publiceert als er geen productdata of duidelijke caveat is.
- Auditwaarschuwingen zijn opgelost of bewust gedocumenteerd.

**Verification**

- Run content-audit op:
  - `src/lib/intent-pages.ts`
  - `src/app/advies/page.tsx`
  - `src/app/advies/[slug]/page.tsx`
- Browsercheck minimaal:
  - `/advies/beginners`
  - `/advies/brede-voeten`
  - `/advies/stabiliteit`
  - `/advies/trail`
  - `/advies/carbon-wedstrijdschoenen`

---

## Ticket SEO-009 - Methodologie, Onafhankelijkheid En Trustpages Herschrijven

**User problem**  
Gebruikers, retailers en zoekmachines moeten kunnen controleren hoe scores, aanbevelingen, data en commerciële inkomsten werken.

**Product surface**

- `/methodologie`
- `/onafhankelijkheid`
- `/over-ons`
- `/contact`
- privacy/cookies waar copy publiek vertrouwen raakt

**Scope**

- Herschrijf methodologiecopy naar helder publiek Nederlands.
- Maak onderscheid zichtbaar tussen:
  - productspecificaties
  - redactionele score
  - persoonlijke match
  - user reviews
  - retailerprijzen
  - affiliate-inkomsten
- Verwijder interne MVP-taal, TODO-taal of formuleringen die onaf voelen.
- Herschrijf onafhankelijkheidspagina zodat commerciële transparantie rustig en concreet is.
- Controleer contact/over-ons copy op echte afzender, bereikbaarheid en vertrouwen.
- Privacy/cookiecopy alleen aanpassen voor helderheid; juridische betekenis niet verzwaren zonder review.

**Ownership**

- `src/app/methodologie/page.tsx`
- `src/app/onafhankelijkheid/page.tsx`
- `src/app/over-ons/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/privacy/page.tsx`
- `src/app/cookies/page.tsx`

**Do not change**

- Geen juridische claims verzinnen.
- Geen bedrijfsgegevens aanpassen zonder bevestigde bron.
- Geen affiliatebeleid verzwakken.

**Expected output**

- Trustpages die professioneel, controleerbaar en public-ready lezen.

**Acceptance criteria**

- Geen publieke TODO/MVP/onaf-copy.
- Geen fake testautoriteit.
- Affiliatevergoeding wordt duidelijk maar niet defensief uitgelegd.
- Methodologie zegt expliciet wat de site wel en niet claimt.

**Verification**

- Run content-audit op gewijzigde trust/legal bestanden.
- Browsercheck alle trustpagina's.

---

## Ticket SEO-010 - Metadata, Structured Data, FAQ En Alt-Text Audit

**User problem**  
Zoekmachines en gebruikers moeten dezelfde inhoud begrijpen. Metadata en structured data mogen geen sterkere claim doen dan zichtbare content.

**Product surface**

- metadata
- canonical URLs
- FAQ schema
- product/review structured data waar aanwezig
- sitemap
- alt text

**Scope**

- Controleer alle `metadata` exports op:
  - duidelijke title
  - behulpzame description
  - geen keyword stuffing
  - geen review/testclaim zonder basis
- Controleer canonical routes en locale-routes.
- Controleer FAQ schema op exacte match met zichtbare FAQ.
- Controleer alt-teksten:
  - beschrijvend bij inhoudelijke beelden
  - leeg bij decoratieve beelden
  - geen keyword stuffing
- Controleer sitemap alleen op waardevolle publieke pagina's.

**Ownership**

- `src/app/layout.tsx`
- `src/app/sitemap.ts`
- alle publieke routebestanden met `metadata`
- `src/lib/intent-pages.ts`
- `src/lib/intent-pages-en.ts` alleen voor metadata/FAQ parity checks

**Do not change**

- Geen routes verwijderen zonder Lead Integrator besluit.
- Geen structured data toevoegen voor niet-zichtbare content.
- Geen nieuwe schema-types zonder Google-richtlijncheck.

**Expected output**

- Metadata en structured data die Google Search richtlijnen volgen en zichtbaar contentrepresentatief zijn.

**Acceptance criteria**

- Iedere publieke pagina heeft passende title/description of bewuste fallback.
- FAQ JSON-LD is gelijk aan zichtbare FAQ.
- Geen structured data voor fake reviews, verborgen pros/cons of onbetrouwbare prijzen.
- Sitemap bevat alleen publiceerbare routes.

**Verification**

- Run build.
- Inspecteer rendered JSON-LD op minimaal drie adviespagina's.

---

## Ticket SEO-011 - Engelse Publieke Copy Parity

**User problem**  
De Engelse routes mogen geen zwakkere, generiekere of verkeerd geclaimde variant van de Nederlandse site zijn.

**Product surface**

- `/en`
- `/en/shoes`
- `/en/shoes/[slug]`
- `/en/compare`
- `/en/shoe-finder`
- `/en/advice`
- `/en/advice/*`
- `/en/methodology`
- `/en/independence`
- `/en/about`
- `/en/contact`
- `/en/privacy`
- `/en/cookies`

**Scope**

- Herschrijf Engelse copy pas nadat Nederlandse copy is goedgekeurd.
- Zorg dat Engelse content dezelfde voorzichtigheid en trustregels volgt.
- Controleer Engelse slugs, metadata, related links en canonical routes.
- Vertaal niet letterlijk wanneer Nederlands idiomatisch is; behoud decision value.
- Voorkom dat Engelse pagina's sterkere claims maken dan Nederlandse bron.

**Ownership**

- `src/app/en/*`
- `src/lib/intent-pages-en.ts`
- `src/app/en/copy.ts`

**Do not change**

- Nederlandse routes.
- Productdata.
- Recommendation scoring.

**Expected output**

- Engelse publieke copy die coherent is, maar secundair blijft aan Nederlandse marktfocus.

**Acceptance criteria**

- Engelse routes hebben eigen duidelijke metadata.
- Related links blijven binnen `/en`.
- Claims zijn niet sterker dan NL.
- FAQ schema matcht zichtbare Engelse FAQ.

**Verification**

- Run content-audit op Engelse bestanden.
- Browsercheck `/en`, `/en/advice`, één `/en/advice/*`, één `/en/shoes/*`.

---

## Ticket SEO-012 - Integratiereview En Publicatiepoort

**User problem**  
Na losse herschrijftickets moet de site als geheel consistent, betrouwbaar en niet AI-generiek lezen.

**Product surface**

- volledige publieke site

**Scope**

- Review alle gewijzigde copy als één gebruikersreis:
  - homepage -> keuzehulp -> product -> vergelijken -> retailerlaag
  - homepage -> advies -> filter -> product -> methodologie
  - product -> alternatieven -> vergelijking
- Zoek inconsistenties in:
  - merknaamgebruik
  - scorestatus
  - affiliate-disclosure
  - "beste" claims
  - medische/blessureclaim
  - metadata vs zichtbare content
  - NL/EN claimparity
- Maak een releasebesluit:
  - publish
  - revise
  - park
- Documenteer bewust geparkeerde risico's.

**Ownership**

- Review-only ticket met kleine integratiecorrecties toegestaan.
- Lead Integrator eigenaar.

**Do not change**

- Geen grote herschrijvingen zonder terug te koppelen naar eigenaar-ticket.
- Geen nieuwe features.

**Expected output**

- Eindrapport met releasekwaliteit van de copylaag.

**Acceptance criteria**

- Alle voorgaande tickets hebben status en verificatie.
- Content-audit is gedraaid op alle gewijzigde public-copybestanden.
- Typecheck en build slagen.
- Browsercheck is gedaan op hoofdflows.
- Open risico's zijn expliciet en acceptabel voor publicatie of teruggezet naar revise.

**Verification**

```bash
python3 /Users/edjezavi/.codex/skills/loopwijzer-seo-content/scripts/content_quality_audit.py \
  src/app/page.tsx \
  src/app/schoenen/page.tsx \
  src/app/schoenen/[slug]/page.tsx \
  src/app/vergelijken/page.tsx \
  src/app/keuzehulp/page.tsx \
  src/app/advies/page.tsx \
  src/app/advies/[slug]/page.tsx \
  src/app/methodologie/page.tsx \
  src/app/onafhankelijkheid/page.tsx \
  src/app/over-ons/page.tsx \
  src/app/contact/page.tsx \
  src/lib/intent-pages.ts \
  data/shoes.json \
  data/recommendation-rules.json
rg -n '"use client"' src
npm run typecheck
npm run build
```

## Aanbevolen Bouwvolgorde

1. SEO-001 Contentinventaris En Risicobaseline
2. SEO-002 Globale Merk-, Navigatie- En Trustcopy
3. SEO-003 Homepage
4. SEO-004 Catalogus En Productkaarten
5. SEO-006 Keuzehulp En Aanbevelingen
6. SEO-005 Productpagina's En Productverdicts
7. SEO-007 Vergelijkingsflow
8. SEO-008 Adviesindex En Intentpagina's
9. SEO-009 Trustpages
10. SEO-010 Metadata, Structured Data, FAQ En Alt-Text
11. SEO-011 Engelse Copy Parity
12. SEO-012 Integratiereview En Publicatiepoort

## Eerste Concrete Stap

Start met SEO-001. Pas daarna pas de copy wijzigen. Dat voorkomt dat losse herschrijvingen mooier klinken maar niet aantoonbaar beter helpen kiezen.
