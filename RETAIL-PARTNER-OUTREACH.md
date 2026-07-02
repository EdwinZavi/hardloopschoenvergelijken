# Retail Partner Outreach En Offer-Publicatiecontract

Datum: 31 mei 2026  
Owner: Retail & Commercial Integrity Agent  
Scope: `AUD-002` en `AUD-010`

## Doel

Loopwijzer moet prijsinformatie kunnen opbouwen zonder afhankelijk te zijn van een reactie van TradeTracker. De commerciële laag mag helpen bij kopen, maar mag de redactionele score, keuzehulp of persoonlijke match niet sturen.

Dit document legt vast:

- hoe prijsdata tijdelijk veilig kan worden verzameld
- wanneer een offer publiek mag worden getoond
- welke velden partners of feeds minimaal moeten leveren
- hoe we retailers benaderen zonder bestaande samenwerkingen te claimen
- welke commerciële claims verboden blijven

## Publisher-Samenvatting Voor Partners

Loopwijzer / hardloopschoenvergelijken.nl is een Nederlandse keuzehulp- en vergelijkingssite voor hardloopschoenen. De site helpt hardlopers schoenen vergelijken op pasvorm, demping, stabiliteit, steunbehoefte, ondergrond, afstand, gebruik en prijs.

Loopwijzer is geen webshop. Productinformatie, redactionele beoordeling, persoonlijke match en winkelinformatie blijven zichtbaar gescheiden. Retailerdata wordt gebruikt om aankoopinformatie concreter te maken, niet om scores, keuzehulpresultaten of redactionele volgorde te kopen.

## Uitgangspunten

- Loopwijzer verkoopt zelf geen schoenen.
- Productinformatie, redactionele beoordeling, persoonlijke match en winkelinformatie blijven gescheiden.
- Affiliatevergoeding heeft geen invloed op score, aanbeveling, volgorde van persoonlijke matches of redactionele tekst.
- Geen enkele prijs, link of voorraadstatus wordt publiek getoond zonder controleerbare bron en `lastCheckedAt`.
- Geen publieke claim dat TradeTracker, een netwerk of retailer al is aangesloten zolang dat niet bevestigd is.

## Fallback-Route Voor Prijsdata

### Fase 1: Handmatige CSV Pilot

Gebruik een handmatige CSV voor 5 tot 10 gecontroleerde aanbiedingen. Deze pilot is bedoeld om de offerlaag, UI-states en reviewflow te testen zonder netwerkafhankelijkheid.

Voorwaarden:

- Alleen echte product-URL's van echte retailers.
- Alleen actuele prijzen die handmatig zijn gecontroleerd.
- Geen affiliateclaim tenzij de link daadwerkelijk een goedgekeurde affiliate- of trackinglink is.
- Elke rij krijgt `lastCheckedAt`, bronnotitie en publicatiestatus.
- Offers zonder match met een bestaande schoen blijven intern en worden niet publiek.

Minimale CSV-kolommen:

| Kolom | Verplicht | Toelichting |
| --- | --- | --- |
| `shoeSlug` | Ja | Interne match naar bestaande schoen. |
| `retailerName` | Ja | Publiek getoonde winkelnaam. |
| `retailerDomain` | Ja | Controleerbare herkomst, bijvoorbeeld `retailer.nl`. |
| `productUrl` | Ja | Directe productpagina zonder placeholder. |
| `affiliateUrl` | Nee | Alleen vullen als de trackinglink echt actief en toegestaan is. |
| `priceCents` | Ja | Prijs in centen, inclusief btw. |
| `currency` | Ja | Voor Nederland standaard `EUR`. |
| `availability` | Ja | Zie availability-waarden hieronder. |
| `sourceType` | Ja | `manual_csv`, `direct_retailer`, `affiliate_network`, `tradetracker`. |
| `sourceName` | Ja | Naam van retailer, netwerk of handmatige controlebron. |
| `lastCheckedAt` | Ja | ISO-datum/tijd van laatste controle. |
| `affiliateStatus` | Ja | Zie affiliate-statuswaarden hieronder. |
| `publicationStatus` | Ja | Zie publicatiestatuswaarden hieronder. |
| `notes` | Nee | Interne toelichting, niet publiek tonen. |

### Fase 2: Directe Retailerlinks

Benader relevante winkels direct voor productfeeds, deeplinks of toestemming om gecontroleerde productlinks te tonen.

Geschikt voor:

- Nederlandse running-specialisten
- sportretailers met breed hardloopschoenenassortiment
- merken of brand stores met directe verkoop
- winkels met duidelijke maatbeschikbaarheid en retourvoorwaarden

Voorwaarden:

- Geen scraping zonder toestemming.
- Geen impliciete partnerclaim op de website.
- Geen winkelblok zonder actuele prijs, URL, bron en `lastCheckedAt`.

### Fase 3: Andere Affiliate- Of Feednetwerken

Gebruik andere netwerken als aanvullende route, niet als vervanging van redactionele onafhankelijkheid.

Te onderzoeken typen:

- affiliate-netwerken met sport- en retailcampagnes
- productfeedproviders met Nederlandse webshops
- directe partnerprogramma's van retailers of merken

Beslissing per netwerk:

- Zijn sportretailers relevant voor hardloopschoenen?
- Is feedtoegang beschikbaar?
- Zijn productvelden rijk genoeg voor matching?
- Zijn deep links toegestaan?
- Zijn beeldrechten en voorwaarden duidelijk?

### Fase 4: TradeTracker

TradeTracker blijft een bruikbare route zodra er reactie, publishergoedkeuring en feedtoegang is. De bestaande staging- en importflow blijft leidend: ruwe feeddata gaat eerst naar staging, daarna normalisatie, matching, warnings, admin review en pas daarna publieke offers.

TradeTracker is dus een extra bron, geen blocker.

## Alternatieven Naast TradeTracker

Onderstaande lijst is bedoeld voor onderzoek en outreach. Dit zijn geen bestaande samenwerkingen en mogen publiek niet als partnerclaims worden gebruikt.

Directe retailerroute:

- Nederlandse hardloopspeciaalzaken met online assortiment en pasvormkennis.
- Sportretailers met breed hardloopschoenenaanbod en duidelijke retourvoorwaarden.
- Merkshops van grote hardloopschoenenmerken met betrouwbare productpagina's.
- Trail- en outdoorretailers voor schoenen met specifieke ondergrond- en gripinformatie.

Netwerk- of feedroute:

- Affiliate-netwerken met sport-, fashion- of retailcampagnes die hardloopschoenen bevatten.
- Productfeedproviders met Nederlandse webshops en productniveau-data.
- Directe partnerprogramma's van retailers of merken waar deeplinks en voorwaarden helder zijn.

Handmatige pilotroute:

- 5 tot 10 gecontroleerde aanbiedingen via CSV, zonder affiliateclaim tenzij de trackingrelatie echt actief is.
- Alleen gebruiken voor UI- en datakwaliteitsvalidatie totdat een structurele feed beschikbaar is.
- Elk offer krijgt een bronnotitie, controledatum en publicatiestatus.

## Offer-Publicatiecontract

Een offer mag pas publiek worden getoond wanneer minimaal deze velden geldig zijn:

| Veld | Eis |
| --- | --- |
| `priceCents` | Positief bedrag in centen, inclusief btw. |
| `currency` | `EUR`, tenzij expliciet anders ondersteund. |
| `productUrl` | Echte productpagina, geen placeholder, geen homepage. |
| `retailerName` | Herkenbare winkelnaam. |
| `retailerDomain` | Domein moet passen bij de URL. |
| `sourceType` | Bekende bronwaarde. |
| `sourceName` | Controleerbare bronnaam. |
| `lastCheckedAt` | Niet leeg en recent genoeg volgens publicatieregels. |
| `availability` | Bekende availability-waarde. |
| `affiliateStatus` | Bekende affiliate-statuswaarde. |
| `publicationStatus` | Alleen `verified` mag publiek renderen. |
| `shoeSlug` | Moet matchen met een bestaande schoen. |

Aanbevolen extra velden:

| Veld | Waarom |
| --- | --- |
| `externalProductId` | Deduplicatie per retailer of feed. |
| `ean` of `gtin` | Betere productmatch. |
| `sku` | Extra retailer-match. |
| `sizeAvailability` | Later nuttig voor maatfilters. |
| `shippingCostCents` | Voorkomt misleidende laagste prijs. |
| `returnPolicyUrl` | Helpt Nederlandse koopbeslissing. |
| `validUntil` | Maakt verouderde acties veiliger. |
| `checkedBy` | Interne audittrail voor handmatige controle. |

## Statuswaarden

### Publicatiestatus

| Status | Betekenis | Publiek tonen |
| --- | --- | --- |
| `feed_pending` | Ingekomen via feed of CSV, nog niet gecontroleerd. | Nee |
| `verified` | Productmatch, prijs, URL, bron en datum zijn gecontroleerd. | Ja |
| `expired` | Eerder bruikbaar, maar `lastCheckedAt` of geldigheid is verlopen. | Nee |
| `rejected` | Onbruikbaar door mismatch, ontbrekende prijs, foute URL, voorwaarden of twijfel. | Nee |

### Availability

| Waarde | Betekenis |
| --- | --- |
| `in_stock` | Op het moment van controle beschikbaar. |
| `limited` | Beperkt beschikbaar, bijvoorbeeld weinig maten. |
| `out_of_stock` | Niet beschikbaar. |
| `unknown` | Niet betrouwbaar uit bron af te leiden. |

Alleen `in_stock`, `limited` en eventueel `unknown` mogen worden overwogen voor publicatie. Bij `unknown` moet de UI duidelijk maken dat beschikbaarheid bij de winkel gecontroleerd moet worden.

### Affiliate-Status

| Waarde | Betekenis |
| --- | --- |
| `none` | Geen affiliate- of trackingrelatie. |
| `direct_affiliate` | Directe afspraak met retailer. |
| `network_affiliate` | Affiliate via netwerk of campagne. |
| `pending` | Mogelijke partnerroute, nog niet actief. |

Offers met `pending` mogen niet als affiliateoffer publiek worden getoond.

### Source Type

| Waarde | Betekenis |
| --- | --- |
| `manual_csv` | Handmatig gecontroleerde CSV-import. |
| `direct_retailer` | Directe retailerfeed of toegestane directe link. |
| `affiliate_network` | Ander netwerk dan TradeTracker. |
| `tradetracker` | TradeTracker-feed of deeplink na goedkeuring. |

## Publicatieregels Voor Offers

- Publiceer alleen offers met `publicationStatus=verified`.
- Publiceer geen offer zonder prijs, URL, retailer, bron en `lastCheckedAt`.
- Publiceer geen `example.com`, testlink, localhostlink, staginglink of trackingplaceholder.
- Toon prijsinformatie als koopinformatie, niet als redactionele aanbeveling.
- Toon affiliate-disclosure dicht bij offerlijsten zodra affiliateoffers live gaan.
- Gebruik geen urgentiecopy zoals "nog maar 1 over", tenzij de retailer dit controleerbaar en contractueel toestaat. Voor MVP vermijden.
- Gebruik geen dealclaim zolang verzendkosten, retourvoorwaarden, maatbeschikbaarheid en datadekking niet volledig genoeg zijn.
- Sorteer niet op affiliatevergoeding.
- Laat verlopen offers automatisch uit publieke modules verdwijnen.

## UI-Besluit Voor Prijsdata

Zolang minder dan 10 schoenen een gecontroleerde publieke offer hebben, blijven prijsfilters en prijs-sortering voorzichtig.

Aanbevolen tijdelijke UI:

- Catalogus: toon "Prijsdata in opbouw" of "Nog geen gecontroleerde prijs" per product zonder verified offer.
- Productpagina: toon een rustige koopmodule met uitleg dat prijzen pas verschijnen na controle.
- Vergelijking: toon een prijsrij met caveat, niet als doorslaggevende winnaar.
- Filter: prijsfilter tijdelijk verbergen of disabled tonen met korte uitleg.
- Sortering: "Sterke prijs-kwaliteit" alleen gebruiken als redactionele waarde-indicatie; niet presenteren als actuele laagste-prijsoptie.

Copyvoorstellen:

- Geen prijs: "Nog geen gecontroleerde winkelprijs beschikbaar."
- Gedeeltelijke prijsdekking: "Prijs gecontroleerd bij beperkte winkeldekking. Controleer maat en voorwaarden bij de winkel."
- Verified offer: "Prijs laatst gecontroleerd op [datum]. Prijs en beschikbaarheid kunnen wijzigen."
- Affiliate-disclosure: "Sommige winkelverwijzingen kunnen affiliate links zijn. Dat heeft geen invloed op score, keuzehulp of aanbevelingen."

## Partnerprofielen

Relevante retailers voor Loopwijzer zijn partijen die bijdragen aan een betrouwbare hardloopschoenkeuze, niet alleen aan conversie.

Prioriteit 1:

- Nederlandse hardloopspeciaalzaken met goede pasvormkennis.
- Sportretailers met breed hardloopschoenenassortiment.
- Retailers met actuele maatbeschikbaarheid en duidelijke retourvoorwaarden.

Prioriteit 2:

- Merkshops van grote hardloopschoenenmerken.
- Outdoor- en trailrunningretailers voor trailsegmenten.
- Webshops met sterke prijsdekking, maar alleen als productmatching betrouwbaar is.

Niet passend voor de eerste fase:

- kortingssites zonder productfeed
- cashback- of loyaltyconstructies
- partijen die ranking op vergoeding verwachten
- bronnen zonder actuele prijs of product-URL
- bronnen met onduidelijke beeldrechten

## Benodigde Feedvelden Voor Partners

Vraag partners om:

- feedformaat: CSV, XML, JSON of download-URL
- updatefrequentie
- unieke product-id
- merk
- productnaam
- model
- versie
- EAN, GTIN of barcode
- SKU
- categorie
- gender of unisex-classificatie
- actuele prijs inclusief btw
- valuta
- voorraadstatus
- maatbeschikbaarheid
- product-URL
- affiliate- of tracking-URL, indien beschikbaar
- productafbeelding
- toestemming en voorwaarden voor beeldgebruik
- verzendkosten, indien beschikbaar
- retourinformatie, indien beschikbaar

Minimaal nodig voor een eerste import:

- merk
- productnaam
- prijs
- valuta
- product-URL
- retailernaam
- externe id of SKU

Voor publishergesprekken is de belangrijkste vraag niet alleen of er een trackinglink is, maar of productmatching betrouwbaar genoeg wordt. Zonder merk, productnaam, prijs, URL en unieke id blijft data intern.

## Korte Partnerpitch

Onderwerp: Samenwerking met Loopwijzer voor hardloopschoenvergelijking

Hallo [naam],

Ik ben Edje, oprichter van Loopwijzer / hardloopschoenvergelijken.nl. We bouwen een Nederlandse keuze- en vergelijkingssite voor hardloopschoenen, gericht op hardlopers die beter willen begrijpen welke schoen past bij hun gebruik, pasvorm, demping, steun, ondergrond, afstand en budget.

De insteek is redactioneel en keuzehulpgericht. We verkopen zelf geen schoenen en scheiden productinformatie, redactionele beoordeling, persoonlijke match en winkelinformatie zichtbaar van elkaar. Een eventuele affiliatevergoeding heeft geen invloed op scores, aanbevelingen of redactionele volgorde.

Ik onderzoek nu welke retailers of partnerprogramma's productfeeds of gecontroleerde deeplinks kunnen leveren voor hardloopschoenen. Het doel is om gebruikers actuele prijs- en beschikbaarheidsinformatie te tonen naast inhoudelijke productvergelijking.

Kunnen jullie aangeven of er een feed of partnerprogramma beschikbaar is met velden zoals productnaam, merk, SKU/EAN, prijs, voorraadstatus, maatbeschikbaarheid, product-URL en eventueel trackinglink?

Alvast dank voor het meedenken.

Groet,  
Edje

## Uitgebreide Partnertekst

Loopwijzer is een Nederlandse vergelijkings- en keuzehulpsite voor hardloopschoenen. De site helpt beginnende en ervaren hardlopers om schoenen te vergelijken op pasvorm, demping, stabiliteit, gebruik, ondergrond, afstand, prijs en beschikbaarheid.

We richten ons niet op generieke toplijsten of kortingsclaims. De gebruiker moet begrijpen waarom een schoen logisch kan zijn, wanneer een alternatief beter past en welke trade-offs er zijn. Winkelinformatie wordt gebruikt als koopinformatie en blijft gescheiden van de redactionele beoordeling.

Voor een eerste samenwerking zoeken we gecontroleerde productdata voor hardloopschoenen:

- actuele prijs inclusief btw
- product-URL of deeplink
- retailernaam
- merk en productnaam
- SKU, EAN of GTIN waar mogelijk
- voorraadstatus
- maatbeschikbaarheid
- productafbeelding met duidelijke gebruiksvoorwaarden
- updatefrequentie van de feed

Als affiliate- of trackinglinks beschikbaar zijn, tonen we daar transparant disclosure bij. Commerciële vergoeding beïnvloedt geen redactionele score, persoonlijke match of adviesvolgorde.

## Verboden Commerciële Claims

Niet gebruiken in publieke copy of partnercommunicatie:

- "Officiële partner van [retailer]" zonder schriftelijke bevestiging.
- "Aangesloten bij TradeTracker" zolang publisher- en campagnegoedkeuring niet rond zijn.
- Dealclaims zolang prijsdekking, verzendkosten en voorwaarden niet volledig vergelijkbaar zijn.
- "Laagste prijs" zonder brede actuele prijsdekking en controle.
- "Beste deal", "beste koop" of "exclusieve korting" zonder gecontroleerde voorwaarden en passende disclosure.
- "Aanbevolen door [retailer]" zonder expliciete toestemming.
- "Getest door experts" als het alleen om voorlopige redactionele inschatting gaat.
- Urgentieclaims zoals "vandaag alleen" of "bijna uitverkocht" zonder betrouwbare bron.
- "Populair bij gebruikers" zolang er geen echte review- of gebruiksdata met voldoende dekking is.

## Readiness-Checklist Voor Eerste Publieke Offers

- Minimaal 5 tot 10 handmatig gecontroleerde offers beschikbaar.
- Alle offers hebben echte product-URL, prijs, retailer, bron en `lastCheckedAt`.
- Geen placeholderlinks of fake prices in publieke data.
- Affiliate-disclosure is zichtbaar bij elke affiliateoffer.
- Prijscopy maakt duidelijk dat prijs en beschikbaarheid kunnen wijzigen.
- Productscore, persoonlijke match en prijsinformatie staan visueel gescheiden.
- Verlopen en afgekeurde offers renderen niet publiek.
- Lead Integrator heeft gecontroleerd dat prijsfilter en sortering niet misleiden.

## Besluit Voor Lead Integrator

TradeTracker blijft een gewenste route, maar niet de enige route. De volgende veilige stap is een handmatige CSV-pilot met beperkte dekking, gevolgd door directe retailer-outreach en onderzoek naar andere netwerken. Pas na echte partner- of netwerkdata wordt de publieke kooplaag uitgebreid.

## Operationele Importstatus

Status 10 juni 2026: de handmatige CSV-pilot is operationeel gemaakt.

Beschikbaar:

- Template: `data/retailer-offer-template.csv`
- Dry-run validatie: `npm run check:retailer-sheet -- <csv-pad>`
- Import naar `data/offers.json`: `npm run import:retailer-sheet -- <csv-pad>`
- Runbook: `RETAILER-SHEET-IMPORT-RUNBOOK.md`

De importer schrijft alleen na expliciete import, blokkeert placeholders en ongeldige URL's, matcht op bestaande `shoeSlug` en laat publieke zichtbaarheid afhangen van `publicationStatus=verified`.
