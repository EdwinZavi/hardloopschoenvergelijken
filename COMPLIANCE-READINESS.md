# COMPLIANCE-READINESS.md

## Doel

Loopwijzer moet voor bezoekers, retailers, affiliate-netwerken en TradeTracker transparant, controleerbaar en niet-misleidend zijn.

De belangrijkste compliance-regel: redactionele beoordeling, persoonlijke match en commerciële winkelinformatie blijven zichtbaar gescheiden.

## Huidige Status

Aanwezig:

- Privacybeleid
- Cookiebeleid
- Onafhankelijkheidspagina
- Methodologiepagina
- Contactpagina
- Footerlinks naar trustpagina's
- Publieke blokkade op placeholder-offers
- Voorlopige scores in plaats van testclaims
- Admin import-staging zonder publiceerknoppen
- Publisherbeschrijving en partner-outreachconcept
- Retail fallback-pad naast TradeTracker

Nog nodig voor echte aanmelding:

- Bevestigen dat de bedrijfsgegevens in `src/lib/company.ts` actueel zijn; geen demo- of placeholdergegevens gebruiken in publieke aanmeldingen.
- Werkende contactmailboxen activeren en testen op ontvangst, spamfiltering en opvolging.
- Stabiel publiek domein live zetten en de trustpagina's daarop controleren.
- Definitieve publisherbeschrijving invullen in TradeTracker of ander netwerk, gebaseerd op de tekst hieronder.
- Affiliate disclosure tonen bij elke toekomstige kooplaag.
- Cookiebeleid opnieuw controleren zodra analytics of marketingcookies worden toegevoegd.
- Eerste offers pas publiek maken na handmatige of feedmatige verificatie volgens het publicatiecontract.

## Publieke Contactstatus

De contactpagina mag alleen kanalen noemen die echt beschikbaar zijn.

Huidige publieke status:

- Wel zichtbaar: e-mail via `info@hardloopschoenvergelijken.nl`.
- Niet live: contactformulier, chat, telefoonlijn, automatisch partnerportaal of geautomatiseerde feedaanmelding.
- Te controleren voor publisher-aanmelding: mailboxontvangst, afzenderconfiguratie, privacyopvolging en interne reactieroutine.

Publieke copy mag bezoekers en partners uitnodigen om te mailen, maar mag geen snelle reactietijd, telefonische bereikbaarheid of bestaand partnerportaal beloven zolang dat niet operationeel is.

## Affiliate Disclosure Copy

Gebruik deze korte disclosure bij toekomstige winkelblokken:

> Sommige winkelverwijzingen kunnen affiliate links zijn. Als je via zo'n link koopt, kan Loopwijzer een vergoeding ontvangen. Dit heeft geen invloed op onze beoordeling, keuzehulp of volgorde van persoonlijke aanbevelingen.

Gebruik deze compacte regel bij offerlijsten:

> Prijzen en beschikbaarheid kunnen wijzigen. Controleer de uiteindelijke prijs, maat en voorwaarden bij de winkel.

## Publicatieregels

- Geen `example.com`, `localhost` of testlinks publiek tonen.
- Geen offer zonder prijs, URL, bron en `lastCheckedAt` publiek tonen.
- Geen feedbeeld publiek tonen zonder betrouwbare productmatch en beeldstatus `verified`.
- Geen score presenteren als praktijktest zolang `scoreStatus` `seed_estimate` is.
- Geen claim zoals "beste schoen" zonder context, doelgroep en trade-off.
- Geen claim dat Loopwijzer officieel partner is van een retailer, merk, TradeTracker of netwerk zonder schriftelijke bevestiging.
- Geen claim "laagste prijs", "beste deal" of "exclusieve korting" zolang prijsdekking, verzendkosten, retourvoorwaarden en actualiteit niet breed genoeg zijn.
- Geen review-, test- of expertclaim zonder zichtbaar bewijs en juiste status.

## Retail Fallback-Pad

TradeTracker is een mogelijke bron voor prijsdata, maar geen voorwaarde om de offerlaag veilig op te bouwen.

Toegestane routes:

1. Handmatige CSV-pilot met 5 tot 10 gecontroleerde offers.
2. Directe retailerlinks of feeds waar de retailer dit toestaat.
3. Andere affiliate- of productfeednetwerken met relevante sportretailers.
4. TradeTracker na publishergoedkeuring, campagnegoedkeuring en echte feedtoegang.

Voor alle bronnen gelden dezelfde regels: geen publieke offer zonder prijs, echte product-URL, retailer, bron, `lastCheckedAt`, availability, affiliate-status en publicatiestatus `verified`.

Details staan in `RETAIL-PARTNER-OUTREACH.md`.

## TradeTracker Sitebeschrijving Concept

Loopwijzer / hardloopschoenvergelijken.nl is een Nederlandse keuzehulp- en vergelijkingssite voor hardloopschoenen. De site helpt beginnende en ervaren hardlopers begrijpen welke schoenen passen bij hun loopdoel, ondergrond, afstand, pasvorm, demping, stabiliteit, steunbehoefte en budget.

Loopwijzer is geen webshop en verkoopt zelf geen schoenen. Productinformatie, redactionele beoordeling, persoonlijke match en winkelinformatie worden zichtbaar gescheiden. Winkelprijzen en kooplinks zijn bedoeld als koopinformatie naast de vergelijking; mogelijke affiliatevergoedingen hebben geen invloed op redactionele scores, keuzehulpuitkomsten of persoonlijke aanbevelingsvolgorde.

De site werkt met gestructureerde productdata, uitlegbare aanbevelingen, vergelijkingstabellen, methodologiepagina's en transparante onafhankelijkheidsinformatie. Offers worden pas publiek getoond wanneer productmatch, prijs, URL, retailer, bron en controledatum zijn gecontroleerd.

Verkeersbronnen:

- organisch zoekverkeer
- direct verkeer
- inhoudelijke adviespagina's
- later mogelijk nieuwsbrief of social media naar eigen content

Niet gebruiken zonder aparte toestemming:

- merknaam-SEA op adverteerders
- cashback/loyaltyconstructies
- voucherclaims
- kunstmatig verkeer
- verborgen klikherkomst

## Redactionele Scheiding Voor Partners

Deze scheiding moet terugkomen in publisher-aanvragen, partner-outreach en publieke koopmodules:

- Redactionele score: beoordeling van producteigenschappen en bekende trade-offs.
- Persoonlijke match: uitleg op basis van gebruikersprofiel, doel, afstand, ondergrond, pasvorm en steunbehoefte.
- Winkelinformatie: prijs, beschikbaarheid, retailer, voorwaarden en eventuele partnerlink.
- Gebruikersopinie: alleen tonen wanneer echte reviewdekking en moderatie beschikbaar zijn.

Geen partner, retailer of netwerk mag betalen voor een hogere score, een betere persoonlijke match of een redactionele claim. Commerciële posities mogen alleen als commercieel herkenbare plaatsing bestaan.

## Feedvelden Voor Publisher-Readiness

Minimaal nodig voor een eerste bruikbare offerimport:

| Veld | Waarom |
| --- | --- |
| merk | voorkomt verkeerde productmatch |
| productnaam | basis voor matching |
| prijs inclusief btw | nodig voor prijsvergelijking |
| valuta | voor Nederland standaard `EUR` |
| product-URL of deeplink | nodig voor controleerbare kooproute |
| retailer of campaign | nodig voor bronvermelding |
| externe id, SKU, EAN of GTIN | nodig voor deduplicatie en matchkwaliteit |
| `lastCheckedAt` of feed-updatefrequentie | nodig om verouderde prijzen te voorkomen |

Sterk aanbevolen: maatbeschikbaarheid, voorraadstatus, verzendkosten, retourinformatie, image URL, beeldrechten, affiliate/tracking-URL en categorie.

## Verboden Claims

Niet gebruiken in publieke copy, partnercommunicatie of publisheraanvragen:

- "Officiële partner van [retailer]" zonder bevestiging.
- "Aangesloten bij TradeTracker" voordat publisher- en campagnegoedkeuring rond zijn.
- "Laagste prijs" zonder brede, actuele en vergelijkbare prijsdekking.
- "Beste deal" of "exclusieve korting" zonder gecontroleerde voorwaarden.
- "Getest door experts" zolang scores voorlopige redactionele inschattingen zijn.
- "Aanbevolen door [merk/retailer]" zonder expliciete toestemming.
- Urgentieclaims zoals "bijna uitverkocht" zonder betrouwbare bron.

## Open Readiness Blockers

- Mailbox operationeel testen.
- Publiek domein en trustroutes controleren na deployment.
- Eerste echte offerbron of handmatige CSV-pilot aanleveren.
- Affiliate-disclosure plaatsen bij de eerste live koopmodule.
- Geen publisheraanvraag afronden met gegevens die nog niet gecontroleerd zijn.
