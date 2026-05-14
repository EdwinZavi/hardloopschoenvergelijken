# TradeTracker Import Runbook

## Doel

Echte TradeTracker-data mag nooit direct naar publieke `offers`.

De vaste route is:

1. TradeTracker-feed ophalen of exportbestand downloaden.
2. Ruwe records naar staging schrijven.
3. Normaliseren naar offer- en beeldkandidaten.
4. Matchen met bestaande `shoes`.
5. Admin review uitvoeren.
6. Alleen gecontroleerde records later promoveren naar verified public offers.

## Huidige Status

Klaar:

- Supabase catalogustabellen
- Supabase stagingtabellen
- Demo feed staging script
- Admin importreview UX
- Admin imports kan Supabase staging lezen met JSON fallback
- Admin reviewbeslissingen kunnen naar `admin_reviews` worden geschreven met sessie-cookie fallback

Nog nodig voor echte TradeTracker:

- TradeTracker publisher/campaign approval
- echte feed-URL of exportbestand
- mapping van echte TradeTracker kolomnamen naar `RawFeedRecord`
- importscript uitbreiden voor de specifieke feedvorm
- promotieactie van approved staging record naar `offers`

Zie ook `TRADETRACKER-APPLICATION-CHECKLIST.md` voor de aanmeld-, beoordelings- en feedtoegangsstappen voordat we de echte adapter definitief bouwen.

## Veiligheidsregels

- Gebruik `SUPABASE_SERVICE_ROLE_KEY` alleen lokaal of server-side.
- Publiceer nooit vanuit raw feed zonder admin review.
- Records met ontbrekende URL, prijs of match blijven geblokkeerd.
- Beelden blijven kandidaat totdat productmatch en bronrechten kloppen.
- `example.com`, lege URL's en verdachte redirects mogen nooit verified offers worden.

## Lokale Demo Staging

Gebruik dit om de stagingflow te testen:

```bash
npm run check:feed-staging
```

Voor echte databasewrites:

```bash
npm run seed:feed-staging
```

Daarvoor moet tijdelijk in `.env.local` staan:

```txt
SUPABASE_SERVICE_ROLE_KEY=...
```

Daarna de key weer verwijderen.

## Echte TradeTracker Feed: Verwachte Input

We hebben van TradeTracker minimaal deze velden nodig:

| Intern veld | TradeTracker/feed veld |
| --- | --- |
| `externalId` | unieke product/feed id |
| `brand` | merk |
| `productName` | producttitel |
| `model` | modelnaam indien beschikbaar |
| `version` | versie indien beschikbaar |
| `gtin` of `ean` | GTIN/EAN |
| `sku` | retailer/campaign SKU |
| `retailer` | winkel/campaign naam |
| `price` | prijs |
| `currency` | valuta, bij voorkeur EUR |
| `availability` | voorraadstatus |
| `url` | affiliate/product URL |
| `imageUrl` | productafbeelding |
| `sizes` | maatbeschikbaarheid indien beschikbaar |

## Eerste Echte Importvolgorde

1. Vraag TradeTracker approval aan.
2. Download een kleine feedexport.
3. Inspecteer de kolomnamen.
4. Maak mapping naar `RawFeedRecord`.
5. Draai eerst dry-run.
6. Schrijf naar staging.
7. Controleer `/admin/imports`.
8. Filter op warnings en lage confidence.
9. Keur niets publiek voordat promotie naar `offers` is gebouwd.

## Admin Review Opslag

Reviewbeslissingen werken in twee lagen:

1. Cookie fallback: blijft werken zonder service role key, handig voor lokale UX en demo.
2. Supabase `admin_reviews`: wordt gebruikt wanneer `SUPABASE_SERVICE_ROLE_KEY` server-side beschikbaar is.

Ook met database-backed review blijft een goedgekeurd record alleen een stagingbeslissing. Het wordt nog geen publieke offer.

## Volgende Bouwticket

**Ticket:** TradeTracker Feed Adapter

Doel:

- accepteer echte TradeTracker CSV/XML/JSON input
- map feedkolommen naar `RawFeedRecord`
- schrijf naar `feed_imports`, `feed_records`, `feed_record_matches`, `image_candidates`
- toon importresultaat in admin

Acceptatiecriteria:

- dry-run toont aantallen en warnings zonder databasewrite
- import schrijft alleen naar stagingtabellen
- geen enkele write naar publieke `offers`
- onbekende kolommen worden bewaard in `raw_payload`
- foutmeldingen zijn bruikbaar voor admin
