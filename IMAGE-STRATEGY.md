# IMAGE-STRATEGY.md

## Besluit

Productfoto's worden niet meer handmatig uit willekeurige bronnen toegevoegd.

Voor Loopwijzer is het beter om productbeelden open te laten totdat ze betrouwbaar uit een goedgekeurde retailer- of TradeTracker-feed komen. Onjuiste, verkeerd uitgesneden of ongeautoriseerde beelden schaden vertrouwen en kunnen later voor rechten- of kwaliteitsproblemen zorgen.

## Waarom

- Productfoto's moeten exact bij merk, model, versie, kleurvariant en gender/unisex-uitvoering passen.
- Affiliate feeds leveren meestal beeld-URL's, producttitels, retailer-URL's, prijzen en beschikbaarheid in dezelfde commerciële context.
- Handmatig geplaatste foto's zijn gevoelig voor mismatch, slechte formaten en onduidelijke gebruiksrechten.
- Een nette placeholder of beeldloze productkaart is geloofwaardiger dan een verkeerde schoenfoto.

## Feed-First Beeldregels

1. Gebruik alleen beelden uit een goedgekeurde feed, merkpersomgeving of expliciet toegestane bron.
2. Bewaar per beeld de bron, datum en relatie met de feed of retailer.
3. Toon geen productfoto als de match met het exacte model niet zeker is.
4. Normaliseer feedbeelden pas na import naar een vast publiek formaat.
5. Vervang bestaande handmatige beelden zodra feedbeelden beschikbaar zijn.

## Gewenst Formaat

- Aspect ratio: 1:1 voor productkaarten en vergelijkingen.
- Minimale bronbreedte: 800 px.
- Publiek formaat: WebP, waar mogelijk.
- Bestandsnaam: `{shoe-slug}.webp`.
- Opslag: `/public/shoes/{shoe-slug}.webp` wanneer lokaal gecachet.
- Achtergrond: transparant of licht neutraal, zonder drukke webshopcontext.
- Uitsnede: volledige schoen zichtbaar, geen afgesneden hak of neus.

## Datavelden Die We Nodig Hebben

Per beeld willen we uiteindelijk vastleggen:

- `shoeId`
- `imageUrl`
- `sourceUrl`
- `sourceType`: `tradetracker_feed | retailer_feed | brand_press | manual_verified`
- `sourceName`
- `lastCheckedAt`
- `licenseStatus`: `feed_allowed | brand_allowed | needs_review`
- `imageStatus`: `missing | feed_pending | verified | rejected`

## Publieke UI-Regel

Als er geen betrouwbaar beeld is:

- toon geen foutief of willekeurig beeld
- toon een rustige placeholder via `ShoeVisual`
- houd de productpagina bruikbaar met specs, scorestatus, uitleg en vergelijkknoppen
- markeer dit intern als feed-afhankelijk, niet als redactionele fout

## TradeTracker-Import Later

Zodra TradeTracker-toegang beschikbaar is:

1. Importeer feedrecords naar een stagingtabel of JSON-export.
2. Match op merk, model, versie en waar mogelijk EAN/GTIN.
3. Accepteer alleen afbeeldingen boven de minimale kwaliteitsdrempel.
4. Cache of proxy beelden pas wanneer de feedvoorwaarden dat toestaan.
5. Laat admin eerst controleren voordat beelden publiek als verified gelden.
