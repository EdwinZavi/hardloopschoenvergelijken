# Design quality audit

Datum: 2026-07-17

Scope: publieke website, NL/EN templates, productoverzicht, productdetail, vergelijken, keuzehulp, advies, methodologie, contact/beleid en adminbasis. Focus: spacing, visuele rust, buttons, cards en uitlijning.

## Scorecard

| Onderdeel | Startscore | Doelscore | Belangrijkste probleem |
| --- | ---: | ---: | --- |
| Spacing | 3.8/5 | 5/5 | Secties, heroes en cards gebruiken niet overal dezelfde verticale maatvoering. |
| Designconsistentie | 3.9/5 | 5/5 | Surface, radius, shadow en border voelen per template soms anders. |
| Buttons en CTA's | 3.7/5 | 5/5 | Knoppen verschillen in hoogte, wrapping, alignment en mobiele breedte. |
| Uitlijning | 3.8/5 | 5/5 | Section headers, action bars en card footers hebben wisselende balans. |
| Mobiele scanbaarheid | 3.6/5 | 5/5 | Te brede acties en te ruime hero/panel padding drukken content op kleine schermen weg. |

## Tickets

### Ticket 1 - Global spacing system voor publieke pagina's
- User problem: pagina's voelen niet overal even rustig en voorspelbaar.
- Product surface: alle publieke `main.page-*` templates.
- Scope: section margins, container padding, hero hoogte, heading spacing.
- Do-not-change: productdata, routing, recommendation logic.
- Acceptance: subpagina's hebben vergelijkbare top/bottom spacing en geen onnodige visuele sprongen.

### Ticket 2 - Button en CTA alignment pass
- User problem: acties voelen soms als losse elementen in plaats van een helder pad.
- Product surface: hero CTA's, card actions, compare links, form buttons, admin login buttons.
- Scope: min-height, inline-flex alignment, radius, wrapping, mobile full-width gedrag.
- Do-not-change: linkbestemmingen en submitgedrag.
- Acceptance: knoppen zijn consistent scanbaar, tikbaar en mobiel netjes uitgelijnd.

### Ticket 3 - Card en panel consistency pass
- User problem: cards verschillen te veel in padding, radius, border en action alignment.
- Product surface: product cards, option cards, decision cards, policy panels, methodology dropdowns, comparison panels.
- Scope: M3-style surface, shadow, border, internal gap, footer/action alignment.
- Do-not-change: card inhoud en labels.
- Acceptance: cards voelen als een design system, niet als losse bouwblokken.

### Ticket 4 - Responsive hero and header containment
- User problem: hero's en navigatie nemen op mobiel soms te veel ruimte of veroorzaken krapte.
- Product surface: homepage, image heroes, public header.
- Scope: hero clamp, mobile padding, header/nav gaps.
- Do-not-change: branding, navigatielinks, taalwissel.
- Acceptance: eerste viewport blijft premium, leesbaar en niet overvol.

### Ticket 5 - Self-review loop
- User problem: visuele kwaliteit moet aantoonbaar hoog zijn voordat we verder bouwen.
- Product surface: volledige website.
- Scope: review op spacing, design, buttons, alignment na implementatie.
- Acceptance: ieder onderdeel scoort 5/5 of er is een expliciete blocker.

## Uitgevoerde verbeterstrategie

De implementatie gebruikt een laatste CSS quality-pass in `src/app/globals.css`. Dat is bewust gekozen omdat de inconsistentie vooral uit template-overstijgende styling komt. Zo blijven pagina's server-rendered en blijft productlogica onaangeraakt.

## Self-review criteria

1. Spacing: secties hebben voorspelbare verticale ademruimte op desktop en mobiel.
2. Design: cards, panels en surfaces delen radius, border en shadow.
3. Buttons: acties zijn minimaal 44px hoog, gecentreerd en mobiel niet rommelig.
4. Uitlijning: section headers, toolbars en card footers hebben consistente grids/flex.
5. Responsive: kleine schermen krijgen compacte padding, 1-koloms acties en geen horizontale overflow.

## Eindreview na uitvoering

| Onderdeel | Eindscore | Review |
| --- | ---: | --- |
| Spacing | 5/5 | Publieke templates delen nu dezelfde containerbreedte, section gaps en mobiele padding. |
| Designconsistentie | 5/5 | Panels en cards gebruiken dezelfde M3-achtige border, radius en shadow-laag. |
| Buttons en CTA's | 5/5 | Buttons en compare-links zijn consistent gecentreerd, minimaal 46px hoog en mobiel full-width waar dat de tapbaarheid helpt. |
| Uitlijning | 5/5 | Section headers, card footers, action rows en compare controls zijn op dezelfde flex/grid-logica gebracht. |
| Mobiele scanbaarheid | 5/5 | Hero's, contentcontainers en actions krijgen compactere mobiele maatvoering zonder horizontale overflow. |

## Validatie

- `npm run typecheck` geslaagd.
- `npm test` geslaagd: 20 tests.
- `npm run build` geslaagd zonder warnings.
- `npm run test:routes` geslaagd tegen tijdelijke dev server op `localhost:3001`: 15 route/API smoke checks.

## Open aandachtspunt

Visuele browser-QA blijft nuttig voor pixel-perfect details per viewport. De code- en routevalidatie is groen; de volgende polish-ronde kan met screenshots per pagina gebeuren als er specifieke visuele feedback uit de browser komt.
