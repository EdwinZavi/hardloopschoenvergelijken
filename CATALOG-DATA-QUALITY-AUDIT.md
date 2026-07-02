# Catalog Data Quality Audit

Datum: 2026-05-31  
Agent: Data Quality & Seed Expansion Agent  
Scope: AUD-001 als documentatie/contract. Geen wijzigingen aan bestaande app- of databestanden.

## Geinspecteerde bronnen

- `data/shoes.json`
- `data/image-sources.json`
- `public/shoes/*`
- `src/types/product.ts`
- `src/lib/data.ts` alleen voor de huidige app-defaults van `dataStatus` en `scoreStatus`

## Executive Summary

De catalogus bevat 30 schoenen. Alle verplichte productvelden uit `Shoe` zijn aanwezig en er zijn geen dubbele `id`- of `slug`-waarden gevonden. De belangrijkste tekortkoming zit niet in schema-vulling, maar in vertrouwen: alle 30 schoenen hebben effectief `dataStatus=needs_review` en `scoreStatus=seed_estimate`.

Beelddekking is beperkt: 8 van de 30 schoenen hebben een `imageUrl`, een lokaal bestand en een bronrecord in `data/image-sources.json`. De overige 22 schoenen missen beeld. Geen enkele schoen heeft expliciet `imageStatus`, `imageLicenseStatus`, `imageSourceType`, `imageSourceName`, `imageSourceUrl` of `imageLastCheckedAt` in `data/shoes.json`.

## Harde Tellingen

| Controlepunt | Telling | Bevinding |
|---|---:|---|
| Schoenen totaal | 30 | Alle records in `data/shoes.json` |
| Unieke `id` waarden | 30 | Geen dubbele ids |
| Unieke `slug` waarden | 30 | Geen dubbele slugs |
| Missende verplichte `Shoe` velden | 0 | Inclusief `editorialScore` en `editorialVerdict` |
| Expliciete `dataStatus=needs_review` | 15 | Staat in `data/shoes.json` |
| Ontbrekende expliciete `dataStatus` | 15 | App default is `needs_review` |
| Effectieve `dataStatus=needs_review` | 30 | Via `getShoeDataStatus` |
| Expliciete `scoreStatus=seed_estimate` | 15 | Staat in `data/shoes.json` |
| Ontbrekende expliciete `scoreStatus` | 15 | App default is `seed_estimate` |
| Effectieve `scoreStatus=seed_estimate` | 30 | Via `getShoeScoreStatus` |
| Schoenen met `imageUrl` | 8 | Alle 8 verwijzen naar bestaand lokaal bestand |
| Schoenen zonder `imageUrl` | 22 | Geen beeld beschikbaar in catalogus |
| Records in `data/image-sources.json` | 8 | Alle 8 matchen een schoen |
| Lokale bestanden in `public/shoes` | 8 | Alle 8 worden door een schoen gebruikt |
| Expliciete `imageStatus` | 0 | Niet ingevuld in `data/shoes.json` |
| Expliciete `imageLicenseStatus` | 0 | Niet ingevuld in `data/shoes.json` |
| `releaseDatePrecision=year` | 30 | Alleen jaarniveau |
| `releaseDateSource=seed_release_year_only` | 30 | Geen exacte releasebron per datum |
| `releaseMonth` aanwezig | 0 | Niet beschikbaar |
| `releaseDate` aanwezig | 0 | Niet beschikbaar |
| `stackHeightHeelMm` aanwezig | 30 | Alle records ingevuld |

## Catalogusdekking

| Dimensie | Verdeling |
|---|---|
| Merk | ASICS 5, Nike 5, adidas 4, Brooks 4, HOKA 3, New Balance 3, Mizuno 2, On 2, Saucony 2 |
| Schoentype | daily_trainer 13, stability 6, tempo 4, race 3, trail 3, recovery 1 |
| Ondergrond | road 27, trail 3 |
| Steun | neutral 23, light_stability 5, stability 2 |
| Demping | high 15, medium 15 |
| Responsiviteit | medium 19, high 8, low 3 |
| Pasvorm | regular 22, snug 5, roomy 3 |
| Breedte | regular 23, wide 5, narrow 2 |
| Carbonplaat | false 27, true 3 |
| Waterdicht | false 30 |
| Releasejaar | 2024: 29, 2025: 1 |

## Beelddekking

| Status | Schoenen | Opmerking |
|---|---:|---|
| Beeld, lokaal bestand en bronrecord aanwezig | 8 | `imageUrl`, `public/shoes/*` en `data/image-sources.json` sluiten op elkaar aan |
| Geen beeld | 22 | Geen `imageUrl`, geen lokaal bestand en geen image-source record |
| Orphan image-source records | 0 | Alle image-source records matchen een bestaande schoen |
| ImageUrl zonder bronrecord | 0 | Geen gevonden |
| ImageUrl zonder lokaal bestand | 0 | Geen gevonden |

Beelden met bronrecord:

| Shoe ID | Bestand | Bron |
|---|---|---|
| `asics-gel-kayano-31` | `/shoes/asics-gel-kayano-31.jpg` | ASICS Outlet UK |
| `asics-gel-nimbus-26` | `/shoes/asics-gel-nimbus-26.jpg` | ASICS Germany |
| `nike-pegasus-41` | `/shoes/nike-pegasus-41.webp` | Nike Newsroom |
| `hoka-clifton-9` | `/shoes/hoka-clifton-9.jpg` | HOKA AU |
| `brooks-ghost-16` | `/shoes/brooks-ghost-16.jpg` | Brooks Running |
| `brooks-adrenaline-gts-24` | `/shoes/brooks-adrenaline-gts-24.jpg` | Brooks Running |
| `saucony-endorphin-speed-4` | `/shoes/saucony-endorphin-speed-4.jpg` | Saucony Europe |
| `hoka-speedgoat-6` | `/shoes/hoka-speedgoat-6.jpg` | HOKA AU |

## Status Per Schoen

Legenda:

- `default` betekent: veld ontbreekt in `data/shoes.json`, maar de app vult deze waarde in via `src/lib/data.ts`.
- `source_ok` betekent: er bestaat een image-source record.
- `file_ok` betekent: het lokale bestand bestaat.

| # | Shoe ID | Naam | Data status | Score status | Beeld | Bron | Te verifieren |
|---:|---|---|---|---|---|---|---|
| 1 | `asics-gel-kayano-31` | ASICS Gel-Kayano 31 | default `needs_review` | default `seed_estimate` | file_ok | source_ok | Productspecs, scorebasis, beeldlicentie, exacte release |
| 2 | `asics-gel-nimbus-26` | ASICS Gel-Nimbus 26 | default `needs_review` | default `seed_estimate` | file_ok | source_ok | Productspecs, scorebasis, beeldlicentie, exacte release |
| 3 | `nike-pegasus-41` | Nike Pegasus 41 | default `needs_review` | default `seed_estimate` | file_ok | source_ok | Productspecs, scorebasis, beeldlicentie, exacte release |
| 4 | `nike-vomero-17` | Nike Vomero 17 | default `needs_review` | default `seed_estimate` | missing | source_missing | Beeld, beeldbron, productspecs, scorebasis, exacte release |
| 5 | `adidas-adizero-boston-12` | adidas Adizero Boston 12 | default `needs_review` | default `seed_estimate` | missing | source_missing | Beeld, beeldbron, productspecs, scorebasis, exacte release |
| 6 | `adidas-adizero-adios-pro-3` | adidas Adizero Adios Pro 3 | default `needs_review` | default `seed_estimate` | missing | source_missing | Beeld, beeldbron, productspecs, scorebasis, exacte release |
| 7 | `hoka-clifton-9` | HOKA Clifton 9 | default `needs_review` | default `seed_estimate` | file_ok | source_ok | Productspecs, scorebasis, beeldlicentie, exacte release |
| 8 | `hoka-arahi-7` | HOKA Arahi 7 | default `needs_review` | default `seed_estimate` | missing | source_missing | Beeld, beeldbron, productspecs, scorebasis, exacte release |
| 9 | `brooks-ghost-16` | Brooks Ghost 16 | default `needs_review` | default `seed_estimate` | file_ok | source_ok | Productspecs, scorebasis, beeldlicentie, exacte release |
| 10 | `brooks-adrenaline-gts-24` | Brooks Adrenaline GTS 24 | default `needs_review` | default `seed_estimate` | file_ok | source_ok | Productspecs, scorebasis, beeldlicentie, exacte release |
| 11 | `saucony-endorphin-speed-4` | Saucony Endorphin Speed 4 | default `needs_review` | default `seed_estimate` | file_ok | source_ok | Productspecs, scorebasis, beeldlicentie, exacte release |
| 12 | `new-balance-fresh-foam-x-1080v13` | New Balance Fresh Foam X 1080v13 | default `needs_review` | default `seed_estimate` | missing | source_missing | Beeld, beeldbron, productspecs, scorebasis, exacte release |
| 13 | `mizuno-wave-rider-28` | Mizuno Wave Rider 28 | default `needs_review` | default `seed_estimate` | missing | source_missing | Beeld, beeldbron, productspecs, scorebasis, exacte release |
| 14 | `on-cloudmonster-2` | On Cloudmonster 2 | default `needs_review` | default `seed_estimate` | missing | source_missing | Beeld, beeldbron, productspecs, scorebasis, exacte release |
| 15 | `hoka-speedgoat-6` | HOKA Speedgoat 6 | default `needs_review` | default `seed_estimate` | file_ok | source_ok | Productspecs, scorebasis, beeldlicentie, exacte release |
| 16 | `asics-novablast-5` | ASICS Novablast 5 | `needs_review` | `seed_estimate` | missing | source_missing | Beeld, beeldbron, productspecs, scorebasis, exacte release |
| 17 | `asics-gt-2000-13` | ASICS GT-2000 13 | `needs_review` | `seed_estimate` | missing | source_missing | Beeld, beeldbron, productspecs, scorebasis, exacte release |
| 18 | `asics-magic-speed-4` | ASICS Magic Speed 4 | `needs_review` | `seed_estimate` | missing | source_missing | Beeld, beeldbron, productspecs, scorebasis, exacte release |
| 19 | `nike-structure-25` | Nike Structure 25 | `needs_review` | `seed_estimate` | missing | source_missing | Beeld, beeldbron, productspecs, scorebasis, exacte release |
| 20 | `nike-vaporfly-3` | Nike Vaporfly 3 | `needs_review` | `seed_estimate` | missing | source_missing | Beeld, beeldbron, productspecs, scorebasis, exacte release |
| 21 | `nike-zegama-2` | Nike Zegama 2 | `needs_review` | `seed_estimate` | missing | source_missing | Beeld, beeldbron, productspecs, scorebasis, exacte release |
| 22 | `adidas-supernova-rise` | adidas Supernova Rise | `needs_review` | `seed_estimate` | missing | source_missing | Beeld, beeldbron, productspecs, scorebasis, exacte release |
| 23 | `adidas-adizero-takumi-sen-10` | adidas Adizero Takumi Sen 10 | `needs_review` | `seed_estimate` | missing | source_missing | Beeld, beeldbron, productspecs, scorebasis, exacte release |
| 24 | `brooks-glycerin-21` | Brooks Glycerin 21 | `needs_review` | `seed_estimate` | missing | source_missing | Beeld, beeldbron, productspecs, scorebasis, exacte release |
| 25 | `brooks-cascadia-18` | Brooks Cascadia 18 | `needs_review` | `seed_estimate` | missing | source_missing | Beeld, beeldbron, productspecs, scorebasis, exacte release |
| 26 | `saucony-guide-17` | Saucony Guide 17 | `needs_review` | `seed_estimate` | missing | source_missing | Beeld, beeldbron, productspecs, scorebasis, exacte release |
| 27 | `new-balance-fresh-foam-x-more-v5` | New Balance Fresh Foam X More v5 | `needs_review` | `seed_estimate` | missing | source_missing | Beeld, beeldbron, productspecs, scorebasis, exacte release |
| 28 | `new-balance-fuelcell-rebel-v4` | New Balance FuelCell Rebel v4 | `needs_review` | `seed_estimate` | missing | source_missing | Beeld, beeldbron, productspecs, scorebasis, exacte release |
| 29 | `mizuno-wave-sky-8` | Mizuno Wave Sky 8 | `needs_review` | `seed_estimate` | missing | source_missing | Beeld, beeldbron, productspecs, scorebasis, exacte release |
| 30 | `on-cloudrunner-2` | On Cloudrunner 2 | `needs_review` | `seed_estimate` | missing | source_missing | Beeld, beeldbron, productspecs, scorebasis, exacte release |

## Missende Of Te Verifieren Velden

Niet missend, maar nog te verifieren voor alle 30 schoenen:

- Identiteit: `brand`, `model`, `version`, `fullName`, `slug`.
- Productclassificatie: `shoeType`, `primaryUseCase`, `surfaceType`, `distanceBucket`.
- Loopprofiel: `supportType`, `cushioningLevel`, `responsivenessLevel`, `fitProfile`, `widthLabel`.
- Specificaties: `weightGrams`, `heelDropMm`, `stackHeightHeelMm`, `hasCarbonPlate`, `isWaterproof`.
- Editorial layer: alle velden in `editorialScore` en `editorialVerdict`.
- Release-informatie: alle records hebben alleen `releaseYear`, `releaseDatePrecision=year` en `releaseDateSource=seed_release_year_only`.

Wel missend in de huidige dataset:

| Veld | Missend bij | Impact |
|---|---:|---|
| `imageUrl` | 22 schoenen | Productkaarten en detailpagina's blijven minder betrouwbaar en minder herkenbaar |
| `imageStatus` | 30 schoenen | App leidt status nu af; er is geen expliciete auditstatus per beeld |
| `imageSourceType` | 30 schoenen | Bronsoort is niet vastgelegd in `data/shoes.json` |
| `imageSourceName` | 30 schoenen | Staat alleen los in `data/image-sources.json` voor 8 schoenen |
| `imageSourceUrl` | 30 schoenen | Staat alleen los in `data/image-sources.json` voor 8 schoenen |
| `imageLastCheckedAt` | 30 schoenen | Geen controlehistorie |
| `imageLicenseStatus` | 30 schoenen | Geen expliciete licentiebeoordeling |
| `releaseMonth` | 30 schoenen | Releasevolgorde blijft globaal |
| `releaseDate` | 30 schoenen | Geen exacte releasedatum |

## Eerste Verificatiebatch Van 12 Schoenen

Doel van batch 1: snel de publieke catalogus betrouwbaarder maken door de 8 beeldklare schoenen eerst te controleren en daarnaast 4 gaten in merk- en categoriedekking op te pakken.

| Prioriteit | Shoe ID | Waarom in batch 1 | Vereiste verificatie |
|---:|---|---|---|
| 1 | `asics-gel-kayano-31` | Beeld en bronrecord aanwezig; stability-segment in catalogus | Specs, scorebasis, beeldlicentie, releasegegevens |
| 2 | `asics-gel-nimbus-26` | Beeld en bronrecord aanwezig; daily-trainer/high-cushion segment | Specs, scorebasis, beeldlicentie, releasegegevens |
| 3 | `nike-pegasus-41` | Beeld en bronrecord aanwezig; Nike daily-trainer dekking | Specs, scorebasis, beeldlicentie, releasegegevens |
| 4 | `hoka-clifton-9` | Beeld en bronrecord aanwezig; HOKA road daily-trainer dekking | Specs, scorebasis, beeldlicentie, releasegegevens |
| 5 | `brooks-ghost-16` | Beeld en bronrecord aanwezig; wide-label record | Specs, scorebasis, beeldlicentie, releasegegevens |
| 6 | `brooks-adrenaline-gts-24` | Beeld en bronrecord aanwezig; stability plus wide-label record | Specs, scorebasis, beeldlicentie, releasegegevens |
| 7 | `saucony-endorphin-speed-4` | Beeld en bronrecord aanwezig; tempo-segment | Specs, scorebasis, beeldlicentie, releasegegevens |
| 8 | `hoka-speedgoat-6` | Beeld en bronrecord aanwezig; trail-segment | Specs, scorebasis, beeldlicentie, releasegegevens |
| 9 | `adidas-adizero-boston-12` | adidas mist nog beelddekking; tempo-segment zonder beeld | Beeldbron, specs, scorebasis, releasegegevens |
| 10 | `adidas-adizero-adios-pro-3` | adidas race-segment zonder beeld | Beeldbron, specs, scorebasis, releasegegevens |
| 11 | `new-balance-fresh-foam-x-1080v13` | New Balance mist beelddekking; wide-label/high-cushion record | Beeldbron, specs, scorebasis, releasegegevens |
| 12 | `asics-novablast-5` | Enige 2025-record in dataset; nog zonder beeld | Beeldbron, specs, scorebasis, releasegegevens |

Batch 1 mag pas tot statusverhoging leiden wanneer de regels hieronder zijn gehaald. Een bestaand beeldbestand is dus geen reden om productdata of scores als geverifieerd te markeren.

## Statusregels

### `dataStatus`

Gebruik `draft` wanneer:

- Een record nog niet publiceerbaar is.
- Een verplicht veld ontbreekt of duidelijk voorlopig is.
- De identiteit van het model, de versie of de productcategorie onzeker is.

Gebruik `needs_review` wanneer:

- Alle verplichte velden aanwezig zijn.
- De data bruikbaar is voor interne UX, filters en aanbevelingsprototypes.
- Een of meer belangrijke velden nog niet brongecontroleerd zijn.
- Dit is de juiste status voor alle 30 huidige schoenen.

Gebruik `verified` pas wanneer:

- Identiteit, versie, releasejaar of releasedatum, gewicht, drop, stack height, carbonplaat, waterdichtheid, categorie, ondergrond, steun, demping en pasvorm zijn gecontroleerd.
- Er minimaal een primaire bron of twee onafhankelijke betrouwbare bronnen zijn vastgelegd in de reviewnotities of toekomstige bronvelden.
- Conflicten tussen bronnen expliciet zijn opgelost.
- De laatste controledatum is vastgelegd.

### `scoreStatus`

Gebruik `seed_estimate` wanneer:

- Scores zijn ingevuld om het product te laten functioneren.
- Scores niet aantoonbaar redactioneel beoordeeld of getest zijn.
- Dit is de juiste status voor alle 30 huidige schoenen.

Gebruik `editorial_reviewed` pas wanneer:

- De productspecificaties voor de schoen `verified` of equivalent brongecontroleerd zijn.
- De score is beoordeeld volgens een vaste redactionele methode.
- De onderbouwing van comfort, demping, stabiliteit, responsiviteit, grip, veelzijdigheid en prijs-kwaliteit navolgbaar is.

Gebruik `tested` pas wanneer:

- Er een echte testbasis is volgens een vastgelegde methode.
- De testmethode, testdatum, beoordelaar of bron en eventuele beperkingen zijn vastgelegd.
- De publieke UI duidelijk onderscheid maakt tussen getest oordeel, redactioneel oordeel en gebruikerservaring.

### `imageStatus`

Gebruik `missing` wanneer:

- Er geen bruikbaar beeld is.
- Er geen bron of licentiecontext beschikbaar is.
- Dit geldt nu voor 22 schoenen als effectieve publieke status.

Gebruik `feed_pending` wanneer:

- Een feed, retailerbron of handmatige bron een kandidaatbeeld heeft opgeleverd.
- Het beeld nog niet is gecontroleerd op modelmatch, kwaliteit en gebruiksrecht.

Gebruik `verified` pas wanneer:

- Het beeld zichtbaar het juiste model en de juiste versie representeert.
- Het lokale bestand bestaat en in de app correct rendert.
- De bron is vastgelegd.
- De licentiestatus `feed_allowed` of `brand_allowed` is.

Gebruik `rejected` wanneer:

- Het beeld niet matcht met het model of de versie.
- De kwaliteit te laag is.
- Het gebruiksrecht ontbreekt of ongeschikt is.

### `imageLicenseStatus`

Gebruik `needs_review` wanneer:

- Een beeld of beeldbron bestaat, maar het gebruiksrecht nog niet expliciet is beoordeeld.
- Dit is de juiste licentiestatus voor de 8 huidige beelden totdat de rechten zijn bevestigd.

Gebruik `feed_allowed` wanneer:

- Het beeld via een goedgekeurde feed of commerciële productfeed mag worden gebruikt.
- De feedvoorwaarden of partnerafspraken dit gebruik dekken.

Gebruik `brand_allowed` wanneer:

- Het beeld uit brand press, newsroom, productpagina of expliciete merkbron komt.
- De bronvoorwaarden gebruik door de site toestaan of toestemming is vastgelegd.

## Integratiecontract Voor Volgende Agents

- Verhoog geen `dataStatus`, `scoreStatus`, `imageStatus` of `imageLicenseStatus` zonder broncontrole.
- Voeg geen productclaims toe die niet uit gecontroleerde data of redactionele methode volgen.
- Behandel score en productdata los van retailer- of affiliate-informatie.
- Publiceer geen offers vanuit dit auditdocument.
- Gebruik batch 1 als eerste werkpakket voor broncontrole, beeldlicentiecontrole en eventuele toekomstige data-updates.

## Aanbevolen Volgorde Na AUD-001

1. Verifieer batch 1 van 12 schoenen.
2. Leg per schoen bronnotities vast voor specs, release en beeldlicentie.
3. Maak daarna pas een datawijziging-ticket voor statusupdates in `data/shoes.json`.
4. Start parallel een image-acquisition ticket voor de 22 schoenen zonder beeld.
5. Maak een apart scoring-methodology ticket voordat `scoreStatus` naar `editorial_reviewed` mag.

