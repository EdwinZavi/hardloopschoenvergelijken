# APPROVAL-READINESS.md

## Doel

Fase 1 maakt Loopwijzer geschikt om serieus beoordeeld te worden door affiliate-netwerken en retailers.

Het doel is niet om al een volledig geautomatiseerde prijsvergelijker te zijn. Het doel is om als betrouwbare Nederlandse vergelijkingssite over te komen:

- duidelijke behoefte voor bezoekers
- echte redactionele waarde
- transparante commerciële intentie
- geen fictieve koopinformatie
- professionele contact-, privacy- en methodologiepagina's

## Agentverdeling

### Lead Integrator

Verantwoordelijk voor productrichting, scopebewaking, integratie, validatie en eindkwaliteit.

### Product Strategy & Commercial Integrity Agent

Verantwoordelijk voor affiliate approval criteria, commerciële risico's, publisher positioning en wat wel/niet klaar is voor aanmelding.

### Pages & Trust Content Agent

Verantwoordelijk voor Over ons, Contact, methodologie-uitbreiding, disclosure-copy en Nederlandse trusttaal.

### Data Quality & Seed Expansion Agent

Verantwoordelijk voor fictieve data, placeholder offers, datastatus, productdekking, afbeeldingdekking en minimale datasetdrempels.

### Frontend / Next.js Agent

Verantwoordelijk voor routes, componentaanpassingen, responsive gedrag, build health en publieke rendering.

## P0 Voor Aanmelding

1. Placeholder offers worden niet publiek getoond als winkelprijzen.
2. Productpagina's tonen geen `example.com` kooplinks.
3. Er is een publieke contactpagina.
4. Er is een Over ons-pagina die uitlegt wat Loopwijzer wel en niet is.
5. Affiliate/commerciële transparantie staat in de footer en bij de kooplaag.
6. Scores worden als voorlopig/redactioneel gepresenteerd zolang er geen echte testmethodiek is.
7. Privacybeleid, cookiebeleid en onafhankelijkheidspagina zijn bereikbaar vanuit de footer.

## P1 Voor Sterkere Goedkeuring

1. Catalogus uitbreiden naar minimaal 30 echte schoenen.
2. Productafbeeldingen via een betrouwbare feed- of merkbron voorbereiden, niet willekeurig handmatig vullen.
3. Minimaal 8 tot 12 inhoudelijke intentpagina's.
4. Echte contactgegevens en bedrijfsgegevens invullen.
5. Verified offer-model toevoegen met `lastCheckedAt`, `sourceType`, `isAffiliate` en `affiliateNetwork`.
6. Handmatig gecontroleerde retailerlinks toevoegen voor topmodellen.

## Publieke Displayregels

- Verified product + verified offer: toon prijs, retailer, CTA en laatste controle.
- Verified product + geen verified offer: toon product, verberg koopknop, meld dat prijzen nog niet gecontroleerd zijn.
- Draft product: alleen intern of duidelijk als concept.
- Seed score: toon als voorlopige score, niet als testresultaat.
- Placeholder offer: nooit publiek renderen.
- Expired offer: verberg CTA of toon alleen met duidelijke waarschuwing.

## Huidige Status

Fase 1 is gestart.

Gedaan:

- Privacybeleid, cookiebeleid en onafhankelijkheidspagina toegevoegd.
- Over ons en contactpagina toegevoegd.
- Placeholder offers uit publieke prijslaag gefilterd.
- Productkaarten en keuzehulp tonen geen fictieve vanafprijzen meer.
- Scores hernoemd naar voorlopige/redactionele score.
- Methodologie uitgebreid met datastatus, bronnen, scorestatus en prijsbeleid.
- Advieslaag uitgebreid naar minimaal 8 inhoudelijke intentpagina's.
- Beeldstrategie vastgelegd: productfoto's blijven feed-afhankelijk en worden niet meer willekeurig handmatig toegevoegd.

Nog nodig:

- Echte contactgegevens activeren.
- Dataset uitbreiden.
- TradeTracker- of retailerfeed gebruiken voor betrouwbare productafbeeldingen.
- Verified offer-velden toevoegen.
- Eerste echte retailerlinks handmatig controleren.
