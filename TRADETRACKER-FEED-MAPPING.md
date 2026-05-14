# TradeTracker Feed Mapping

## Doel

Dit document beschrijft hoe Loopwijzer een TradeTracker-productfeed praktisch moet mappen naar `RawFeedRecord` en daarna veilig kan normaliseren naar staged offers en image candidates.

Kernregel: TradeTracker-data wordt nooit direct publiek getoond. Elke rij gaat eerst door opslag als raw record, normalisatie, validatie, matching en publicatiereview.

## Scope

Dit document gaat over:

- mapping van TradeTracker-feedvelden naar `RawFeedRecord`
- validaties en fallbackregels
- matchvolgorde richting bestaande schoenen
- image handling
- offer-publicatieregels
- privacy en compliance
- open vragen voor echte feedtoegang

Dit document wijzigt geen code, data of bestaande publicatieregels.

## Huidige Loopwijzer-Typen

TradeTracker-rijen moeten eerst landen als `RawFeedRecord`:

```ts
type RawFeedRecord = {
  provider: "tradetracker";
  sourceName: string;
  importedAt: string;
  externalId?: string;
  brand?: string;
  productName?: string;
  model?: string;
  version?: string;
  gtin?: string;
  ean?: string;
  sku?: string;
  retailer?: string;
  price?: string | number;
  currency?: string;
  availability?: string;
  url?: string;
  imageUrl?: string;
  sizes?: string[];
  rawPayload?: Record<string, unknown>;
};
```

Na normalisatie ontstaat staged data:

- `NormalizedFeedOffer` voor prijs, retailer, URL, beschikbaarheid en affiliate-metadata.
- `FeedImageCandidate` voor productbeelden die nog gecontroleerd moeten worden.
- warnings voor ontbrekende of onbetrouwbare velden.

## Verwachte TradeTracker-Velden

De echte veldnamen kunnen per feed verschillen. Gebruik daarom een mappinglaag die meerdere mogelijke TradeTracker-kolomnamen accepteert.

| Loopwijzer veld | Primaire TradeTracker-bron | Alternatieve bronnamen | Regel |
| --- | --- | --- | --- |
| `provider` | vaste waarde | n.v.t. | Altijd `"tradetracker"`. |
| `sourceName` | campaign name | affiliate campaign, program name, advertiser name | Gebruik campagne/retailerbron; fallback `"TradeTracker"`. |
| `importedAt` | import runtime | n.v.t. | ISO timestamp van Loopwijzer-import, niet uit feed afleiden. |
| `externalId` | product ID | item ID, feed ID, record ID | Stabiele feed-ID; fallback naar SKU. |
| `brand` | brand | manufacturer, merk | Trim, whitespace normaliseren, geen eigen vertaling. |
| `productName` | product name | title, name, product title | Volledige feedtitel bewaren voor matching en audit. |
| `model` | model | custom label/model name | Alleen vullen als feed een betrouwbaar apart modelveld heeft. |
| `version` | version | model version, variant | Alleen vullen als feed versie expliciet scheidt, bijvoorbeeld `41` of `Gel-Kayano 31`. |
| `gtin` | GTIN | barcode | Normaliseer naar digits-only; alleen vullen bij geldige lengte. |
| `ean` | EAN | ean code | Normaliseer naar digits-only; alleen vullen bij 8, 12, 13 of 14 digits. |
| `sku` | SKU | item number, product code, merchant SKU | Retailer/product-SKU; niet gebruiken als universele product-ID. |
| `retailer` | advertiser name | shop name, merchant, store | Zichtbare retailernaam voor offerlaag. |
| `price` | price | sale price, current price, price incl VAT | Gebruik actuele consumentenprijs incl. btw waar mogelijk. |
| `currency` | currency | valuta | Alleen `"EUR"` publiceren; ontbrekend bij Nederlandse feed behandelen als `"EUR"` met warning. |
| `availability` | availability | stock status, delivery status | Mappen naar `in_stock`, `low_stock`, `out_of_stock` of `unknown`. |
| `url` | product URL | deeplink, tracking URL, affiliate URL | Moet klikbare TradeTracker-/retailer-URL zijn. |
| `imageUrl` | image URL | image, product image, image link | Alleen absolute HTTP(S)-URL accepteren. |
| `sizes` | size | available sizes, variants | Splits lijsten op comma/pipe/semicolon; bewaar ruwe maatlabels. |
| `rawPayload` | volledige feedrij | n.v.t. | Bewaar oorspronkelijke waarden voor audit en debugging. |

## Normalisatieregels

### Tekst

- Trim leading/trailing whitespace.
- Vervang meerdere spaties, tabs en line breaks door een enkele spatie.
- Bewaar originele feedwaarden in `rawPayload`.
- Verander merknamen niet agressief. `HOKA`, `Hoka` en `Hoka One One` moeten via merk-aliasing worden opgelost, niet door blind overschrijven.

### Prijs

- Accepteer getallen en strings zoals `139,95`, `€139.95`, `139.95 EUR`.
- Publiceer alleen prijzen groter dan `0`.
- Gebruik consumentenprijs inclusief btw.
- Als zowel adviesprijs als sale price aanwezig is: `price` wordt de actuele koopprijs; adviesprijs blijft voor later buiten `RawFeedRecord`.
- Bij ontbrekende of ongeldige prijs: record mag wel staged blijven voor matching/image review, maar offer is niet publiceerbaar.

### Valuta

- Publiceer alleen `EUR`.
- Ontbrekende valuta bij Nederlandse TradeTracker-campagnes mag als `EUR` worden geïnterpreteerd met warning.
- Niet-EUR records krijgen importstatus `needs_review` of `rejected`, afhankelijk van toekomstige adminflow.

### Beschikbaarheid

Map feedwaarden als volgt:

| Feedwaarde | Loopwijzer availability |
| --- | --- |
| `available`, `in_stock`, `instock`, `in stock`, `op voorraad` | `in_stock` |
| `low_stock`, `limited`, `beperkt`, `bijna uitverkocht` | `low_stock` |
| `out_of_stock`, `outofstock`, `unavailable`, `niet op voorraad` | `out_of_stock` |
| leeg, onbekend of afwijkend | `unknown` |

Offers met `out_of_stock` mogen in staging blijven, maar moeten niet prominent als beste koopoptie worden gebruikt.

### URL

- Accepteer alleen absolute `https://` URL's voor publicatie.
- `http://` mag staged blijven, maar vereist review of upgrade naar HTTPS.
- Placeholder-, localhost- en testdomeinen zijn nooit publiceerbaar.
- Bewaar trackingparameters intact zolang ze nodig zijn voor affiliate-attributie.
- URL moet naar productdetail- of koopbare variantpagina leiden, niet naar generieke zoekresultaten.

### Maten

- `sizes` blijft een string-array, omdat Nederlandse retailers maten verschillend formatteren.
- Normaliseer alleen separators en whitespace.
- Publiceer maatbeschikbaarheid alleen als de feed duidelijk actuele voorraad per maat geeft.
- Gebruik maten niet voor schoenmatching zolang model/version/GTIN onvoldoende betrouwbaar zijn.

## Validaties

### Hard Required Voor Publiceerbare Offers

Een TradeTracker-offer is alleen publiceerbaar als:

- `provider` is `"tradetracker"`
- `url` bestaat en is geen placeholder/test/local URL
- `price` is geldig en groter dan `0`
- `currency` is `"EUR"` of betrouwbaar als EUR afgeleid
- `retailer` of `sourceName` is beschikbaar
- `importedAt` is aanwezig
- er is een gematchte `shoeId`
- match confidence is minimaal `medium`
- `offerStatus` is `verified`
- `sourceType` is `affiliate_feed`
- `isAffiliate` is `true`
- `affiliateNetwork` is `"TradeTracker"`

### Required Voor Matching

Voor automatische matching moet minimaal een van deze combinaties aanwezig zijn:

- geldige `gtin` of `ean`
- `brand` + `model` + `version`
- `brand` + `productName` met herkenbaar model en versie

Records zonder deze informatie krijgen `matchConfidence: "none"` en moeten in adminreview blijven.

### Warning-Niveau

Maak warnings, maar reject niet direct, bij:

- ontbrekende `imageUrl`
- ontbrekende `availability`
- ontbrekende `currency` bij vermoedelijke Nederlandse EUR-feed
- productnaam met kleur/geslacht/maat maar zonder apart modelveld
- retailernaam die alleen uit `sourceName` kan worden afgeleid
- meerdere mogelijke schoenmatches

### Reject-Niveau

Reject of blokkeer publicatie bij:

- geen URL
- geen geldige prijs
- niet-EUR prijs
- volwassen, medische of irrelevante productcategorie
- product is geen hardloopschoen
- feedtitel matcht accessoire, spikes zonder duidelijke categorie, kleding of casual lifestyle schoen
- URL is placeholder, localhost, malformed of niet klikbaar
- afbeelding is geen absolute HTTP(S)-URL
- merk/product is expliciet uitgesloten door admin

## Fallbackregels

| Ontbrekend veld | Fallback | Publicatie-impact |
| --- | --- | --- |
| `sourceName` | `"TradeTracker"` | Toegestaan, maar warning. |
| `retailer` | `sourceName` | Toegestaan als bron een herkenbare retailer/campagne is. |
| `externalId` | `sku` | Toegestaan voor deduplicatie binnen dezelfde feed. |
| `model` | afleiden uit `productName` | Alleen gebruiken voor candidate matching, niet als product truth. |
| `version` | afleiden uit `productName` | Alleen publiceren na match met bestaand product. |
| `currency` | `"EUR"` bij Nederlandse feed | Warning; echte feedcontracten moeten dit bevestigen. |
| `availability` | `unknown` | Offer kan publiceerbaar zijn, maar lager sorteren dan `in_stock`. |
| `imageUrl` | geen image candidate | Offer kan publiceerbaar zijn zonder nieuw beeld. |
| `sizes` | lege array/undefined | Geen blokkade. |

Belangrijk: fallbackwaarden mogen product truth niet overschrijven. Een feed mag dus geen bestaande schoennaam, versie, categorie of redactionele eigenschappen aanpassen zonder aparte adminreview.

## Matchvolgorde

Gebruik deze volgorde voor matching naar bestaande Loopwijzer-schoenen.

1. Exacte identifier match
   - Match op `gtin` of `ean` tegen bekende GTIN/EAN van offers of productvarianten.
   - Confidence: `exact`.

2. Merk + expliciet model + expliciete versie
   - Normaliseer casing, spaties, streepjes en leestekens.
   - Voorbeeld: `Nike` + `Pegasus` + `41`.
   - Confidence: `high` als er precies een kandidaat is.

3. Merk + productName bevat model en versie
   - Voorbeeld: `ASICS Gel-Kayano 31 Heren`.
   - Confidence: `medium` als de versie ondubbelzinnig is.

4. ProductName bevat model zonder versie
   - Alleen candidate match; risico op oude/nieuwe jaargangen.
   - Confidence: `low`.

5. SKU/externalId binnen dezelfde retailer
   - Alleen gebruiken voor deduplicatie en update van eerder gematchte offers.
   - Niet gebruiken als eerste productmatch, omdat SKU retailer-specifiek is.

6. Geen betrouwbare match
   - Confidence: `none`.
   - Niet publiceren.

### Conflictregels

- Als GTIN/EAN en naammatch botsen, wint GTIN/EAN niet automatisch. Markeer als `needs_review`, want feedidentifiers kunnen fout zijn.
- Als een productnaam meerdere versies bevat, bijvoorbeeld oude en nieuwe modelnaam, markeer als `needs_review`.
- Als model klopt maar categorie niet, bijvoorbeeld wandelschoen versus hardloopschoen, reject of review.
- Als gender/kleur/maat verschillen maar modelversie gelijk is, match op schoenvariant zolang Loopwijzer nog geen kleur- of gender-SKU niveau publiceert.

## Deduplicatie En Updates

Gebruik voor TradeTracker-offers bij voorkeur deze dedupe key:

```text
provider + sourceName + retailer + externalId
```

Als `externalId` ontbreekt:

```text
provider + retailer + normalizedUrl
```

Als ook URL instabiel is:

```text
provider + retailer + matchedShoeId + sku
```

Update bij nieuwe imports:

- `price`
- `availability`
- `url`
- `lastCheckedAt`
- `sizeAvailability`
- `externalOfferId`

Maak geen nieuw offer aan als dezelfde retailer hetzelfde schoenmodel opnieuw aanlevert met alleen een gewijzigde prijs.

## Image Handling

### Staging

Elke geldige `imageUrl` wordt een `FeedImageCandidate`:

- `sourceType`: `tradetracker_feed`
- `imageStatus`: `feed_pending`
- `licenseStatus`: `feed_allowed`, zolang TradeTracker/campagnevoorwaarden feedbeeldgebruik toestaan
- `sourceName`: campagne of retailerbron
- `sourceUrl`: product/affiliate URL
- `lastCheckedAt`: importtimestamp

### Publicatie

Een beeld mag pas publiek gebruikt worden als:

- het gekoppeld is aan een bestaande `shoeId`
- de afbeelding technisch bereikbaar is
- content type een afbeelding is
- resolutie en aspect ratio bruikbaar zijn voor productweergave
- er geen watermark, retailerbanner of promotietekst zichtbaar is
- het beeld dezelfde schoenversie toont of generiek genoeg is voor die variant
- licentie/status door admin of contractregel is bevestigd
- `imageStatus` naar `verified` is gezet

### Fallback

- Bestaande `manual_verified` of `brand_press` beelden blijven leidend boven feedbeelden.
- TradeTracker-beelden kunnen ontbrekende beelden aanvullen, maar mogen niet automatisch een verified beeld overschrijven.
- Bij twijfel tussen meerdere feedbeelden: kies niet automatisch; toon kandidaten in adminreview.

### Rejection

Reject image candidates bij:

- gebroken URL
- tracking pixel of miniatuur onder minimale resolutie
- lifestylebeeld zonder duidelijk product
- verkeerde kleur of verkeerd model als Loopwijzer kleur/specifieke variant toont
- watermarks, sale badges, retailerpromoties of tekstoverlay
- licentievoorwaarden onduidelijk of strijdig met publiek hergebruik

## Offer-Publicatieregels

Voor publieke Loopwijzer-weergave gelden deze regels:

1. Publiceer alleen gematchte offers.
2. Publiceer alleen `offerStatus: "verified"`.
3. Publiceer alleen `sourceType: "affiliate_feed"` voor TradeTracker.
4. Publiceer alleen niet-placeholder URL's.
5. Publiceer alleen actuele imports met geldige `lastCheckedAt`.
6. Toon affiliatebron niet als redactionele aanbeveling.
7. Houd productscore, redactioneel oordeel en retailerprijs strikt gescheiden.
8. Sorteer primaire prijsweergave op laagste geldige prijs, maar maak retailerkwaliteit later apart uitbreidbaar.
9. Expire offers die te lang niet zijn bevestigd.
10. Verwijder of verberg offers als feed later geen geldige prijs/URL meer levert.

### Voorgestelde TTL

Zonder echte feedfrequentie:

- `in_stock` of `low_stock`: maximaal 24 tot 48 uur oud voor publieke prijsvergelijking.
- `unknown`: maximaal 24 uur oud of lager sorteren.
- `out_of_stock`: niet tonen als koopbare primaire offer.
- ouder dan TTL: `expired` of verborgen totdat opnieuw bevestigd.

De exacte TTL moet worden afgestemd op TradeTracker-updatefrequentie en retailer SLA.

## Privacy En Compliance

### Dataminimalisatie

- Bewaar alleen product-, retailer- en feedmetadata die nodig is voor matching, audit en publicatie.
- Sla geen persoonsgegevens van bezoekers op in feedrecords.
- Bewaar geen individuele klik- of conversiedata in `RawFeedRecord`.

### Affiliate Transparantie

- Maak in publieke UX duidelijk dat sommige kooplinks affiliate-links kunnen zijn.
- Verberg commerciële relatie nooit achter redactionele score of aanbeveling.
- Redactionele scores en keuzehulpregels mogen niet worden aangepast door commissie, EPC of campagneprioriteit.

### Contract En Licentie

- Controleer TradeTracker- en adverteerdervoorwaarden voor:
  - gebruik van productbeelden
  - cachetermijnen
  - verplichte trackingparameters
  - merknaamgebruik
  - prijsactualiteit
  - verwijderplicht bij campagnebeëindiging

### Security

- Feed credentials mogen nooit in code, datafiles of documentatie staan.
- Raw payloads kunnen commerciële data bevatten en horen niet in publieke API's.
- Admin-importschermen mogen geen geheime tokens of volledige signed URLs lekken als dat niet nodig is.

### AVG

Productfeeds zijn normaal geen persoonsgegevens, maar kliktracking en affiliate-attributie kunnen wel privacy-impact hebben.

Minimale regels:

- plaats alleen cookies/tracking conform cookietoestemming en geldende affiliate-eisen
- documenteer affiliateverwerking in privacy- en cookiebeleid
- stuur geen Loopwijzer-gebruikersprofiel of keuzehulpantwoorden mee in affiliate-URL's
- gebruik geen gevoelige profieldata voor commerciële tracking

## Importproces

1. Haal TradeTracker-feed op via toegestane feedmethode.
2. Parse feed met gestructureerde parser passend bij formaat: CSV, XML of JSON.
3. Map elke rij naar `RawFeedRecord`.
4. Bewaar volledige `rawPayload`.
5. Draai normalisatie naar staged offers en image candidates.
6. Draai validaties en warnings.
7. Match naar bestaande schoenen.
8. Toon matchrapport in admin.
9. Publiceer alleen offers die aan publicatieregels voldoen.
10. Zet image candidates pas live na image review of bewezen contractregel.

## Monitoring

Monitor per import:

- totaal aantal records
- aantal geldige offers
- aantal image candidates
- aantal exact/high/medium/low/none matches
- percentage publishable
- warnings per retailer/campagne
- prijswijzigingen groter dan verwachte bandbreedte
- plotseling verdwenen offers
- gebroken URL's
- niet-EUR records
- duplicate ratio

Waarschuw admin bij:

- publishable ratio daalt sterk
- retailer feedstructuur lijkt gewijzigd
- veel records missen prijs of URL
- veel productnamen matchen niet meer
- campagne levert onverwachte categorieën

## Open Vragen Voor Echte TradeTracker-Feedtoegang

Deze punten moeten worden beantwoord zodra echte feedtoegang beschikbaar is:

1. Welke feedformaten zijn beschikbaar per campagne: CSV, XML, JSON of API?
2. Wat zijn de exacte veldnamen en welke velden zijn verplicht?
3. Levert TradeTracker een stabiele product-ID per retailer en campagne?
4. Zijn GTIN/EAN velden beschikbaar en betrouwbaar gevuld?
5. Wordt prijs inclusief btw geleverd?
6. Is sale price apart beschikbaar naast adviesprijs?
7. Welke beschikbaarheidswaarden gebruikt elke retailer?
8. Zijn maatvoorraden beschikbaar als echte voorraad per maat of alleen als tekst?
9. Zijn productbeelden contractueel toegestaan voor publieke weergave op Loopwijzer?
10. Mogen beelden lokaal gecachet of geoptimaliseerd worden?
11. Wat is de verplichte updatefrequentie of maximale prijsleeftijd?
12. Welke trackingparameters moeten intact blijven?
13. Zijn deeplinks direct naar productvariantpagina's of generieke productpagina's?
14. Hoe worden uitverkochte producten in de feed weergegeven?
15. Hoe worden verwijderde producten gecommuniceerd: ontbreken, statusveld of delete-feed?
16. Zijn er categorievelden waarmee hardloopschoenen betrouwbaar van kleding/accessoires worden gescheiden?
17. Zijn merkaliassen consistent, bijvoorbeeld `HOKA` versus `Hoka One One`?
18. Kunnen campagnes producten leveren buiten Nederland of in niet-EUR valuta?
19. Zijn er restricties rond prijsvergelijking, ranking of het tonen van concurrentretailers?
20. Welke rapportage- of disclosure-eisen stelt TradeTracker voor affiliate-links?

## Kleinste Waardevolle Implementatie

De eerste bruikbare integratie hoeft nog geen volledige automatische publicatie te doen.

MVP:

- importeer 1 TradeTracker-feed naar `RawFeedRecord`
- normaliseer prijs, URL, retailer, availability en image URL
- match op EAN/GTIN en daarna merk + model + versie
- toon match confidence en warnings in admin
- publiceer alleen verified offers met minimaal medium match
- zet image candidates in review, niet automatisch live

Dit sluit aan op Loopwijzers vertrouwensbelofte: prijsvergelijking mag commercieel nuttig zijn, maar mag nooit productwaarheid of redactionele uitleg vervuilen.
