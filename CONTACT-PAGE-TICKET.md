# Contactpagina Ticket

## Ticket CPT-001: Bedrijfsgegevens professioneel op contactpagina plaatsen

Status: afgerond

## User Problem

De footer voelde te administratief doordat daar bedrijfsgegevens en KvK-informatie stonden. Voor vertrouwen zijn deze gegevens wel belangrijk, maar ze horen op een duidelijke contactpagina waar bezoekers ze bewust kunnen vinden.

## Doel

Maak `/contact` de centrale plek voor formele bedrijfsgegevens van Loopwijzer en houd de footer rustig, professioneel en navigatiegericht.

## Scope

- Verwijder de KvK-vermelding uit de footer.
- Toon op `/contact` alleen de noodzakelijke trustgegevens:
  - beheerder/handelsnaam
  - KvK-nummer
  - vestigingsadres
  - een centraal contactmailadres
- Bewaar bedrijfsgegevens centraal in code, zodat contact en privacy niet uiteen gaan lopen.
- Houd privacybeleid juridisch correct door de verantwoordelijke daar ook te blijven noemen.

## Niet In Scope

- Vestigingsnummer tonen.
- Rechtsvorm prominent tonen.
- "Hoofdvestiging" of brancheomschrijving tonen.
- Een extra grote juridische footer bouwen.

## Acceptatiecriteria

- Footer toont alleen merk en navigatielinks.
- Contactpagina bevat een duidelijke sectie `Contactgegevens`.
- Contactpagina gebruikt een centraal e-mailadres: `info@hardloopschoenvergelijken.nl`.
- Er staan geen demo-BV of placeholder-KvK-gegevens in publieke broncode.
- Typecheck en production build slagen.

## Waarom Dit Nu

TradeTracker en bezoekers moeten kunnen controleren wie achter de website zit. Tegelijk moet de site rustig en betrouwbaar blijven ogen. Een aparte contactpagina lost beide op.
