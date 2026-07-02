# TradeTracker Application Checklist

## Doel

Deze checklist bepaalt wanneer Loopwijzer klaar is om TradeTracker echt aan te sluiten.

Belangrijk: TradeTracker is geen gewone technische koppeling. Eerst moet de website betrouwbaar genoeg zijn voor beoordeling, daarna heb je publisher- en campagnegoedkeuring nodig, en pas daarna kunnen we de echte feedadapter definitief bouwen op basis van echte feedkolommen.

## Wat Nu Klaar Staat

- Publieke catalogus met schoenen, productpagina's en vergelijkflow.
- Keuzehulp met uitlegbare aanbevelingen.
- Trustpagina's voor methodologie, onafhankelijkheid, over ons en contact.
- Publisherbeschrijving en redactionele scheiding in `COMPLIANCE-READINESS.md`.
- Retail fallback- en outreachcontract in `RETAIL-PARTNER-OUTREACH.md`.
- Supabase catalogustabellen.
- Supabase stagingtabellen voor feed-imports.
- Demo staging-import voor feedrecords.
- Admin importreview als veiligheidslaag.
- Documentatie voor feedmapping en importregels.
- Release metadata in catalogus voorbereid voor jaar, maand en dag-niveau.

## Wat Jij Eerst Moet Doen

1. Zet de website online op een stabiel domein.
2. Controleer dat de volgende pagina's publiek bereikbaar zijn:
   - homepage
   - schoenenoverzicht
   - productpagina
   - vergelijken
   - keuzehulp
   - methodologie
   - onafhankelijkheid
   - contact
   - privacybeleid
   - cookiebeleid
3. Vervang placeholdergegevens door echte bedrijfs- of contactgegevens waar nodig.
4. Meld je aan als publisher bij TradeTracker.
5. Voeg je website toe in TradeTracker.
6. Vraag goedkeuring aan voor relevante hardloopschoen-, sport- en retailerprogramma's.
7. Vraag per goedgekeurde campagne om feedtoegang of download een kleine feedexport.
8. Bewaar minimaal één voorbeeldbestand met echte kolomnamen voor de adapterbouw.

Gebruik in de aanvraag geen claim dat Loopwijzer al is aangesloten bij TradeTracker, een retailer of campagne voordat die goedkeuring schriftelijk binnen is.

## Wat Je Aan TradeTracker Of Retailercampagnes Moet Vragen

Vraag expliciet naar:

- feedformaat: CSV, XML, JSON of een download-URL
- updatefrequentie
- exacte kolomnamen
- unieke product-id
- merk
- productnaam
- model
- versie
- EAN, GTIN of barcode
- SKU
- retailer/campaign naam
- actuele prijs inclusief btw
- valuta
- voorraadstatus
- maatbeschikbaarheid
- product-URL of deeplink
- affiliate/tracking-URL
- productafbeelding
- beeldgebruik toegestaan via feed of campagnevoorwaarden
- retour- of verzendinformatie als die beschikbaar is

## Minimale Feed Voor Eerste Adapter

Voor een eerste echte import hebben we minimaal nodig:

| Nodig veld | Waarom |
| --- | --- |
| productnaam | basis voor matching |
| merk | voorkomt verkeerde matches |
| prijs | nodig voor offer |
| valuta | moet EUR zijn of betrouwbaar als EUR bevestigd |
| URL | nodig voor klikbare offer |
| retailer/campaign | nodig voor offerbron |
| externe id of SKU | nodig voor deduplicatie |

Sterk aanbevolen:

| Veld | Waarom |
| --- | --- |
| EAN/GTIN | betere productmatch |
| image URL | beeldkandidaat voor review |
| beschikbaarheid | betere sortering en betrouwbaarheid |
| maten | nuttig voor latere koopbeslissing |
| releasedatum of releaseperiode | betere nieuwste-releaseblokken |

## Publicatieregels

Echte TradeTracker-data mag niet direct naar publieke aanbiedingen.

De route blijft:

1. feed ophalen
2. ruwe records opslaan
3. normaliseren
4. matchen met bestaande schoenen
5. warnings tonen
6. admin review uitvoeren
7. pas daarna gecontroleerd promoten naar publieke offers

## Wanneer We De Echte Adapter Kunnen Bouwen

We kunnen de echte adapter bouwen zodra deze drie dingen beschikbaar zijn:

1. TradeTracker publisher-account is goedgekeurd.
2. Minimaal één relevante campagne heeft feedtoegang.
3. We hebben een echte CSV/XML/JSON sample met kolomnamen.

Tot die tijd bouwen we alleen de veilige infrastructuur, mappingregels en stagingflow.

## Acceptatiecriteria Voor Livegang Met TradeTracker

- Feedimport kan dry-run draaien zonder databasewrite.
- Feedimport schrijft echte data alleen naar stagingtabellen.
- Onbekende kolommen blijven bewaard in `raw_payload`.
- Records zonder prijs, URL of match worden niet publiek.
- Admin kan matches en warnings controleren.
- Publieke aanbiedingen tonen alleen verified offers.
- Affiliate-relatie is transparant op onafhankelijkheids- en productpagina's.
- `SUPABASE_SERVICE_ROLE_KEY` staat nooit in clientcode of publieke hostingvariabelen.

## Service Role Key Regel

Gebruik `SUPABASE_SERVICE_ROLE_KEY` alleen:

- lokaal in `.env.local` tijdens seed/import
- server-side in veilige hosting environment variables

Gebruik deze key nooit:

- in browsercode
- in Git
- in screenshots
- in publieke documentatie
