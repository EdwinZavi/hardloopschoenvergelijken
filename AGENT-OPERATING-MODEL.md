# Agent operating model voor Loopwijzer

## Doel

Loopwijzer moet uiteindelijk beheerd kunnen worden als een betrouwbare agent-gedreven productorganisatie:

- data wordt automatisch gesignaleerd en voorbereid
- prijzen en feeds worden structureel gecontroleerd
- contentconcepten worden terugkerend aangemaakt
- aanbevelingen worden getest op uitlegbaarheid
- publicatie blijft beschermd door duidelijke approvalregels

Agents zijn dus geen losse chathelpers. Ze vormen een operationeel systeem rond de website.

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
