# Batch 4 QA & Release Readiness

Datum: 2 juni 2026  
Scope: `AUD-011` responsive UI polish en `AUD-012` end-to-end QA voor de publieke site.

## Releasebesluit

Decision: Go with known risks voor interne preview, staging en de volgende productbatch.  
Decision for volledige publieke/commerciele launch: no-go totdat de geparkeerde productbewijs-risico's zijn opgelost.

De technische basis is groen: typecheck, productiebuild en browserroutes laden schoon. De productbasis is nog niet volwassen genoeg om de site als volledig bewezen prijs-, review- en testplatform te positioneren.

## Geintegreerde Batch 4 Wijzigingen

- Prijs-empty-states in homepagekaarten, productcards en recommendation cards tonen nu als rustige statusbadge in plaats van kale fallbacktekst.
- Lange schoennamen, scorestatussen en prijslabels krijgen extra wrapping in cards, score rows, compare tray en selection bars.
- De vergelijkselectie op catalogus en vergelijkpagina is mobiel robuuster gemaakt.
- De vergelijkingstabel behoudt bedoelde horizontale scroll, met betere cell wrapping en een mobiele scroll-hint.
- Er is geen nieuwe `"use client"` boundary toegevoegd.

Gewijzigde UI-bestanden:

- `src/app/globals.css`
- `src/app/page.tsx`
- `src/app/schoenen/page.tsx`
- `src/app/vergelijken/page.tsx`
- `src/components/ProductCard.tsx`
- `src/components/RecommendationCard.tsx`

## Technische Verificatie

Commands:

- `rg -n '"use client"' src`
  - Bestaande client boundaries blijven beperkt tot:
    - `src/lib/supabase/client.ts`
    - `src/components/AutoSubmitFilterForm.tsx`
    - `src/components/SiteChrome.tsx`
- `npm run typecheck`
  - Passed.
- `npm run build`
  - Passed.
  - Next.js genereerde 115 statische pagina's.

Let op: tijdens QA is een tijdelijke devserver-500 ontstaan doordat `next build` liep terwijl `next dev` dezelfde `.next` map gebruikte. Na herstart van de devserver leverden de routes weer normale HTML. Dit is geen codefinding, maar wel een QA-procesles: build en devserver niet tegelijk op dezelfde `.next` state draaien.

## Browsercheck

Server: `http://localhost:3003`

Gecontroleerde routes:

- `/`
- `/schoenen`
- `/schoenen?surfaceType=trail&primaryUseCase=trail`
- `/vergelijken`
- `/vergelijken?ids=nike-pegasus-41`
- `/vergelijken?ids=nike-pegasus-41,hoka-clifton-9`
- `/vergelijken?ids=nike-pegasus-41,hoka-clifton-9,brooks-ghost-16,asics-gel-nimbus-26`
- `/keuzehulp`
- `/keuzehulp?step=10&experienceLevel=beginner&runningGoal=start_running&targetDistance=10k&weeklyFrequency=1_2&preferredSurface=road&supportNeed=not_sure&injurySensitivity=medium&preferredFeel=soft&fitPreference=regular`
- `/schoenen/asics-gel-kayano-31`
- `/schoenen/adidas-supernova-rise`
- `/advies`
- `/advies/beginners`
- `/advies/stabiliteit`
- `/advies/halve-marathon`
- `/methodologie`
- `/contact`
- `/onafhankelijkheid`

Browserresultaat:

- Geen console errors op de gecontroleerde routes.
- CSS geladen op de herstartcheck.
- Geen page-wide horizontale overflow.
- De vergelijkingstabel heeft alleen bedoelde interne horizontale scroll.
- Canonicals staan op de gecontroleerde SEO/trustroutes.
- JSON-LD baseline blijft beperkt tot `Organization` en `WebSite`; intentpagina's met FAQ hebben aanvullend `FAQPage`.
- Geen `Product`, `Offer` of `Review` schema toegevoegd zolang publieke data niet geverifieerd is.

## Accessibility Baseline

Gekeken op homepage, catalogus, vergelijking, keuzehulp intro, keuzehulp resultaat en contact.

- Exact een H1 per gecontroleerde route.
- Geen zichtbare form controls zonder label gevonden.
- Geen links of buttons zonder toegankelijke naam gevonden.
- Focus styling is aanwezig via de bestaande CSS.

P2: er is nog geen skiplink naar de hoofdinhoud. Dat is geen blocker voor deze batch, maar wel een nette toegankelijkheidsverbetering voor de volgende front-end ronde.

## Findings

P0: geen.

P1:

- Geen technische P1 in Batch 4.
- Productlaunch P1: de site heeft nog onvoldoende bewezen catalogusdata, prijsdekking, reviewdekking en beelddekking voor een volledige publieke trustclaim.

P2:

- Skiplink ontbreekt.
- Sommige QA-verwachtingen moeten tekstinhoud volgen in plaats van exacte interne labels. Voorbeeld: de pagina is goed, maar labels heten soms anders dan de testneedle.
- Devserver kan een transient foutstate krijgen als `next build` tegelijk tegen dezelfde `.next` map draait.

## Known Risks

- 30/30 schoenen staan nog op `dataStatus=needs_review`.
- 30/30 schoenen staan nog op `scoreStatus=seed_estimate`.
- 0/30 schoenen hebben publieke gecontroleerde prijsdata.
- Reviews zijn nog niet live en mogen niet als social proof worden gesimuleerd.
- Een groot deel van de productbeelden mist nog echte beelddekking of expliciete licentiestatus.
- Het release-readiness operating-pack onder `docs/project-operating-pack/*` bestaat niet in deze repo. Deze check gebruikt daarom `WEBSITE-AUDIT-PARALLEL-AGENT-TICKETS.md`, `COMPLIANCE-READINESS.md`, de buildchecks en browserchecks als bron.

## Rollback Plan

Voor deze batch zijn de wijzigingen klein en beperkt tot UI polish, SEO/trust eerder in Batch 3, en QA-documentatie. Rollback kan door de Batch 4 UI-bestanden terug te draaien:

- `src/app/globals.css`
- `src/app/page.tsx`
- `src/app/schoenen/page.tsx`
- `src/app/vergelijken/page.tsx`
- `src/components/ProductCard.tsx`
- `src/components/RecommendationCard.tsx`

Geen database- of migratierollback nodig voor Batch 4.

## Volgende Acties

1. Voeg een skiplink toe aan de globale chrome/layout.
2. Maak catalogusdata-verificatie leidend voor de eerste echte publicatieclaim.
3. Publiceer pas prijs- of offermodules wanneer minimaal een gecontroleerde retailerbatch live is.
4. Ontwerp de lege reviewstaat voordat echte reviews worden verzameld.
5. Leg in een release-runbook vast dat `next build` niet parallel met `next dev` op dezelfde `.next` map draait.
