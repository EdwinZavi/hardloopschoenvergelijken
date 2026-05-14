# Agent operating model voor Loopwijzer

## Doel

Loopwijzer moet uiteindelijk beheerd kunnen worden als een betrouwbare agent-gedreven productorganisatie:

- data wordt automatisch gesignaleerd en voorbereid
- prijzen en feeds worden structureel gecontroleerd
- contentconcepten worden terugkerend aangemaakt
- aanbevelingen worden getest op uitlegbaarheid
- publicatie blijft beschermd door duidelijke approvalregels

Agents zijn dus geen losse chathelpers. Ze vormen een operationeel systeem rond de website.

## Samenwerkingsmodel

De vaste samenwerking is ticket-first:

1. Jij geeft richting, wensen, voorbeelden, grenzen en feedback. Dat mag ruw of onvolledig zijn.
2. Codex scherpt het probleem aan: user problem, gewenste uitkomst, scope, risico's en mogelijke agent-splitsing.
3. Codex treedt op als Product Owner: schrijft tickets, bepaalt prioriteit en kiest welke agents echte waarde toevoegen.
4. Specialistische agents krijgen een afgebakende rol, outputvorm, file ownership en een duidelijke niet-wijzigen lijst.
5. Agents werken alleen parallel wanneer hun subtaken onafhankelijk genoeg zijn.
6. Codex treedt daarna op als Lead Integrator: reviewt agentoutput, lost conflicten op, integreert alleen wat productwaarde toevoegt en valideert de flow.
7. Een Review Agent wordt ingezet bij substantiële bouwcycli om bugs, UX-risico's, regressies, performanceproblemen en testgaten te vinden.
8. Codex koppelt terug wat is veranderd, welke keuzes zijn gemaakt, wat is getest en wat de volgende concrete stap is.

| Rol | Verantwoordelijkheid | Output |
| --- | --- | --- |
| Jij | Geeft context, doelen, voorkeuren, voorbeelden, grenzen en feedback op wat goed of niet goed voelt. | Input, keuzes, prioriteiten en akkoord op belangrijke richting. |
| Codex als Product Owner | Scherpt het probleem aan, bewaakt productwaarde, vertaalt input naar tickets en kiest welke agents nodig zijn. | Heldere tickets, acceptatiecriteria, agentbriefings en prioritering. |
| Specialistische agents | Voeren afgebakende taken uit binnen hun eigen scope en zonder elkaars files te overschrijven. | Analyse, code, copy, data-aanpassingen, componenten of testresultaten. |
| Codex als Lead Integrator | Reviewt agentoutput, integreert alleen wat waarde toevoegt, test de flow en vat het resultaat samen. | Werkende verbetering, validatie, beslissingen en volgende concrete stap. |
| Review Agent | Controleert na integratie of het resultaat echt klopt. | Findings met ernst, locatie, risico en aanbevolen fix. |

## Kernprincipe

Agents mogen:

- verzamelen
- signaleren
- structureren
- normaliseren
- vergelijken
- concepten maken
- risico's markeren
- test- en auditrapporten voorbereiden

Agents mogen niet zonder expliciete publicatieregel:

- redactionele eindconclusies live zetten
- medische of blessureclaims publiceren
- prijzen als goedkoopste/beste presenteren zonder actuele controle
- affiliate-gedreven rankings maken
- productscore of aanbevelingen aanpassen zonder review
- gebruikersreviews verzinnen of samenvattingen als feit presenteren zonder bron

## Wanneer parallel werken

Parallelle agents zijn het sterkst wanneer elke agent een eigen lens, eigen scope en duidelijke output heeft. Ze zijn zwak wanneer meerdere agents hetzelfde probleem oplossen of tegelijk dezelfde bestanden aanpassen.

| Situatie | Parallel inzetten? | Aanpak |
| --- | --- | --- |
| Meerdere onafhankelijke onderzoeksvragen | Ja | Laat agents apart kijken naar product, code, UX, markt of data. De lead integreert de conclusies. |
| Meerdere losse modules of files | Ja | Geef elke engineering-agent file ownership en acceptatiecriteria. |
| Centrale architectuurkeuze | Beperkt | Laat eventueel opties onderzoeken, maar de Lead Integrator beslist en bewaakt consistentie. |
| Kleine bugfix | Meestal nee | Laat de lead of één agent oplossen en verifiëren. |
| Dezelfde pagina of component verbeteren | Alleen met strakke scopes | Splits in data, copy, layout, tests of review. Niet iedereen aan dezelfde file. |
| Review na implementatie | Ja | Laat een Review Agent zoeken naar regressies, UX-problemen en gemiste risico's. |

Beslisregel: zet een extra agent alleen in als de subtaak onafhankelijk uitvoerbaar is, een eigen outputvorm heeft en de lead daarna een duidelijk integratiepunt heeft.

## Agentbriefing template

Gebruik dit patroon wanneer een specialist wordt ingeschakeld:

| Onderdeel | Invulling |
| --- | --- |
| User problem | Welk probleem van de gebruiker lossen we op? |
| Product surface | Welke pagina, flow, component, datalaag of contentsectie raakt dit? |
| Scope | Wat moet de agent exact onderzoeken of aanpassen? |
| Ownership | Welke bestanden of modules zijn van deze agent? |
| Do not change | Welke bestanden, keuzes of gedrag moet ongemoeid blijven? |
| Output | Analyse, patch, component, copy, testplan of beslisadvies. |
| Quality bar | Waar moet de agent extra streng op zijn? |
| Integration point | Waar moet Codex de output op aansluiten? |
| Verification | Welke check moet worden uitgevoerd of geadviseerd? |

### Standaardprompt: parallelle agent-workflow

```text
Gebruik een parallelle agent-workflow.

Doel:
[Wat willen we bereiken]

Context:
[Project, doelgroep, repo/status, belangrijke bestanden]

Werkwijze:
- Splits het werk in onafhankelijke subtaken.
- Zet alleen parallelle agents in waar dat echte tijdwinst of kwaliteitswinst geeft.
- Geef elke agent een duidelijke rol, scope, outputvorm en file ownership.
- Voorkom overlap in bestanden of verantwoordelijkheden.
- Laat de hoofdagent resultaten integreren tot één coherent besluit of implementatie.
- Laat daarna een review-agent zoeken naar bugs, UX-problemen, regressies en gemiste risico's.

Eindoutput:
- Wat is gedaan
- Welke agent wat heeft bijgedragen
- Welke keuzes zijn gemaakt
- Wat is getest
- Wat nog open staat
```

### Standaardprompt: één specialistische agent

```text
Rol:
[Naam agent]

Taak:
[Onderzoek of implementeer exact dit]

Scope:
[Wat valt binnen de taak]

Ownership:
[Bestanden/modules waar deze agent aan mag werken]

Niet wijzigen:
[Bestanden/gedrag/beslissingen die ongemoeid blijven]

Output:
- 3 belangrijkste bevindingen of wijzigingen
- concrete aanbeveling of patch
- risico's
- gewijzigde bestanden, indien van toepassing
- verificatie of aanbevolen check
```

## Operationele cadans

### Per feedimport

**Feed Import Agent**

- verwerkt TradeTracker/API/CSV input
- slaat raw records in staging op
- draait normalisatie
- maakt importwarnings

**Data Matching Agent**

- koppelt feedrecords aan bestaande schoenen
- herkent mogelijke nieuwe modellen
- geeft match confidence
- verklaart waarom een match onzeker is

**Retail Integrity Agent**

- controleert affiliate URL, prijs, retailernaam, beschikbaarheid en disclosure
- blokkeert publicatie bij ongeldige of onzekere offers

### Wekelijks

**Data Quality Agent**

- controleert ontbrekende specs, dubbele modellen, verouderde records en ontbrekende afbeeldingen
- levert een datakwaliteitsrapport op

**Recommendation Logic Agent**

- test vaste runner-profielen
- controleert of aanbevelingen logisch, persoonlijk en uitlegbaar blijven
- meldt zwakke of risicovolle matches

**QA Agent**

- controleert build, routes, filters, keuzehulp, vergelijken en adminflows
- meldt regressies op trust-kritieke flows

### Maandelijks

**Release Radar Agent**

- maakt een lijst met nieuwe of gewijzigde hardloopschoenen
- markeert releaseconfidence en ontbrekende velden
- adviseert welke modellen aan de catalogus toegevoegd moeten worden

**Content Operations Agent**

- maakt een conceptbrief en blogoutline voor nieuwe releases
- koppelt content aan adviespagina's, filters, keuzehulp en productpagina's
- bewaakt dat content keuzehulp biedt in plaats van alleen SEO-volume

**Editorial Trust Agent**

- controleert claims, toon, methodologie, onzekerheden en affiliate-onafhankelijkheid
- blokkeert publicatie bij te harde of slecht onderbouwde uitspraken

### Per kwartaal

**Product Strategy Agent**

- evalueert roadmap, user jobs en conversie naar vertrouwen
- adviseert welke automatisering prioriteit krijgt

**Analytics & Experimentation Agent**

- bekijkt of gebruikers echt doorklikken naar vergelijken, keuzehulp en passende producten
- voorkomt optimalisatie op lege kliks of affiliate-only doelen

## Approval matrix

| Wijziging | Mag agent voorbereiden | Mag automatisch live | Menselijke approval |
| --- | --- | --- | --- |
| Nieuwe ruwe feedrecords | Ja | Nee | Niet nodig voor staging |
| Nieuwe verified offer | Ja | Alleen na harde validatieregels | Ja in MVP |
| Nieuwe productfoto | Ja | Nee | Ja |
| Nieuwe schoen in catalogus | Ja | Nee | Ja |
| Kleine datacorrectie met hoge bronconfidence | Ja | Later mogelijk | Ja in MVP |
| Aanpassing aanbevelingsweging | Ja | Nee | Altijd |
| Maandelijkse blogdraft | Ja | Nee | Altijd |
| Blogpublicatie | Ja | Nee | Altijd |
| Affiliate disclosure | Ja | Nee | Altijd |
| Methodologie-aanpassing | Ja | Nee | Altijd |
| Prijsupdate van bestaande verified retailer | Ja | Later mogelijk | Alleen bij anomalie |

## Agent outputformaten

### Data quality report

- datum
- scope
- gevonden issues
- impact op vertrouwen
- voorgestelde actie
- eigenaar
- publicatieblokkade: ja/nee

### Import review report

- import id
- aantal records
- exact/high/medium/low/no match
- records met warnings
- image candidates
- publishable offer candidates
- blokkades
- aanbevolen volgende actie

### Recommendation audit

- testprofiel
- topaanbevelingen
- waarom passend
- belangrijkste trade-off
- opvallende zwakke match
- voorgestelde regelwijziging

### Monthly release brief

- maand
- relevante nieuwe modellen
- categorie per model
- datastatus
- bronstatus
- waarom relevant voor Nederlandse lopers
- interne links
- publicatieadvies: publiceren / overslaan / later bijwerken

## Definition of Done voor agent-bouwcycli

Een bouwcyclus is pas klaar als waarde, werking en kwaliteit zichtbaar zijn gecontroleerd.

- Het werk is verbonden aan een concreet gebruikersprobleem.
- De agent-splitsing was logisch of er is bewust voor één agent gekozen.
- File ownership en integratiepunten waren duidelijk.
- Het datamodel of de productlogica is niet impliciet verstopt in losse UI.
- User-facing copy is passend voor Nederlandse lopers en het vertrouwen dat Loopwijzer wil uitstralen.
- Nieuwe aanbevelingen, scores of claims zijn uitlegbaar en niet overdreven zeker.
- Typecheck, production build, tests of browsercheck zijn uitgevoerd waar toepasbaar.
- Belangrijke gewijzigde flows zijn in de browser bekeken wanneer dat relevant is.
- Reviewfeedback is beoordeeld en verwerkt of bewust geparkeerd.
- Nieuwe beslissingen zijn vastgelegd in de relevante roadmap-, ticket- of auditdocumentatie.
- De volgende concrete stap is helder.

## Maandelijkse blogworkflow

Werknaam:

`Nieuwe hardloopschoenen in [maand jaar]: deze modellen zijn het bekijken waard`

### Publiceren wanneer

- er 3 of meer relevante nieuwe modellen zijn
- of er 1 belangrijk model van een groot merk beschikbaar is
- of er een duidelijke categorieontwikkeling is, zoals nieuwe carbon- of trailmodellen
- en er voldoende data is om gebruikers echt te helpen kiezen

### Niet publiceren wanneer

- het alleen om kleurupdates gaat
- Nederlandse beschikbaarheid ontbreekt
- specs niet betrouwbaar genoeg zijn
- het artikel vooral nieuws is zonder keuzehulp
- er geen logische interne vervolgstap is naar filters, vergelijken, keuzehulp of advies

### Vast artikelpatroon

1. Wat valt deze maand op?
2. Nieuwe modellen per categorie
3. Voor welk type loper zijn ze mogelijk interessant?
4. Vergelijk met bestaande alternatieven
5. Prijs en beschikbaarheid, alleen wanneer betrouwbaar
6. Wat weten we nog niet zeker?
7. Methodologie en updatebeleid

## Eerste automatiseringsmijlpaal

De eerste mijlpaal is niet automatisch bloggen. De eerste mijlpaal is een betrouwbaar admin-commandocentrum:

1. Feedrecord review-acties
2. Match confidence uitleg
3. Image candidate review
4. Verified offer staging
5. Agentrapporten zichtbaar in admin
6. Human approval matrix toepassen

Pas daarna bouwen we maandelijkse release- en blogautomatisering bovenop gecontroleerde data.
