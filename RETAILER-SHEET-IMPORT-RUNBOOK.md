# Retailer Sheet Import Runbook

Datum: 10 juni 2026  
Doel: gecontroleerde winkelprijzen ontvangen, valideren en veilig in `data/offers.json` laden.

## Waarom Dit Bestaat

Loopwijzer kan nu zonder TradeTracker-blokkade een eerste prijslaag opbouwen via een winkel-sheet. De regel blijft hetzelfde: winkelinformatie helpt bij kopen, maar stuurt geen score, keuzehulp of redactioneel oordeel.

## Mee Naar De Winkel

Neem deze bestanden mee:

- `data/retailer-offer-template.csv`
- `RETAIL-PARTNER-OUTREACH.md`
- `COMPLIANCE-READINESS.md`

Vraag de winkel om de template te vullen of dezelfde kolommen in Excel/Google Sheets aan te leveren.

Minimaal nodig voor een eerste bruikbare import:

- `shoeSlug`
- `retailerName`
- `retailerDomain`
- `productUrl`
- `priceCents` of `price`
- `currency`
- `availability`
- `sourceType`
- `sourceName`
- `lastCheckedAt`
- `affiliateStatus`
- `publicationStatus`

Gebruik `publicationStatus=feed_pending` voor ontvangen data die nog niet handmatig gecontroleerd is. Gebruik `publicationStatus=verified` pas wanneer productmatch, prijs, URL, retailer, bron en controledatum kloppen.

## Belangrijke Kolommen

| Kolom | Voorbeeld | Opmerking |
| --- | --- | --- |
| `shoeSlug` | `nike-pegasus-41` | Moet bestaan in `data/shoes.json`. |
| `retailerName` | `Run2Day` | Publiek zichtbare winkelnaam. |
| `retailerDomain` | `run2day.nl` | Moet passen bij de product- of affiliate-URL. |
| `productUrl` | `https://www.run2day.nl/...` | Geen homepage, testlink of placeholder. |
| `affiliateUrl` | leeg of trackinglink | Alleen vullen als toegestaan en actief. |
| `priceCents` | `13999` | Voorkeur: prijs inclusief btw in centen. |
| `price` | `139.99` | Alternatief als centen lastig zijn. |
| `availability` | `in_stock` | Ook toegestaan: `limited`, `low_stock`, `out_of_stock`, `unknown`. |
| `sourceType` | `manual_csv` | Ook toegestaan: `direct_retailer`, `retailer_feed`, `affiliate_network`, `tradetracker`. |
| `affiliateStatus` | `none` | Ook toegestaan: `direct_affiliate`, `network_affiliate`, `pending`. |
| `publicationStatus` | `feed_pending` | Alleen `verified` wordt publiek zichtbaar. |
| `sizeAvailability` | `42|43|44` | Optioneel, later nuttig voor maatfiltering. |

## Importstappen

1. Plaats het ontvangen bestand lokaal, bijvoorbeeld:

```bash
data/retailer-offers-run2day-2026-06-10.csv
```

2. Draai altijd eerst de validatie:

```bash
npm run check:retailer-sheet -- data/retailer-offers-run2day-2026-06-10.csv
```

3. Los alle errors op. Warnings mogen alleen bewust geaccepteerd worden.

4. Schrijf pas daarna naar `data/offers.json`:

```bash
npm run import:retailer-sheet -- data/retailer-offers-run2day-2026-06-10.csv
```

5. Valideer de website:

```bash
npm run typecheck
npm run build
```

6. Controleer minimaal:

- `/schoenen`
- `/schoenen/nike-pegasus-41`
- `/vergelijken?ids=nike-pegasus-41,hoka-clifton-9,brooks-ghost-16`

## Wat Het Script Blokkeert

De importer weigert:

- onbekende `shoeSlug`
- ontbrekende of ongeldige prijs
- valuta anders dan `EUR`
- onbekende availability/source/publication/affiliate-status
- `example.com`, `localhost` of `127.0.0.1`
- URL's waarvan het domein niet past bij `retailerDomain`
- `verified` offers met `affiliateStatus=pending`
- `verified` offers die `out_of_stock` zijn
- verlopen `validUntil` bij `publicationStatus=verified`

## Publieke Website-Regel

De website toont alleen offers met:

- `offerStatus=verified`
- echte URL
- geen placeholder
- geldige match met een bestaande schoen

Daardoor mag een winkelsheet veilig eerst als `feed_pending` worden ingeladen zonder dat bezoekers al koopknoppen zien.

## Eerste Pilotadvies

Start met 5 tot 10 offers voor schoenen die al goed zichtbaar zijn op de site:

- `nike-pegasus-41`
- `hoka-clifton-9`
- `brooks-ghost-16`
- `asics-gel-kayano-31`
- `asics-gel-nimbus-26`
- `saucony-endorphin-speed-4`
- `hoka-speedgoat-6`

Pas na de eerste browsercheck uitbreiden naar meer modellen.
