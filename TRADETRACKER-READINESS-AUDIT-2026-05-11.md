# TradeTracker Readiness Audit - 2026-05-11

## Conclusie

Loopwijzer is inhoudelijk goed op weg voor TradeTracker-beoordeling, maar is nog niet klaar om in te dienen.

De belangrijkste blokkade is niet de productervaring. De kernpagina's, keuzehulp, vergelijking, methodologie en productpagina's staan er functioneel. De blokkade zit in publieke trust- en bedrijfsinformatie: er staan nog TODO's, demo-bedrijfsgegevens en placeholder-KvK-informatie zichtbaar op juridische en vertrouwenwekkende pagina's.

## Go / No-Go

Status: **No-go voor TradeTracker-aanmelding totdat bedrijfsgegevens en publieke TODO's zijn opgelost.**

Na het oplossen van de blokkerende punten is de site waarschijnlijk geschikt voor een eerste publisher-aanmelding, mits hij ook online staat op een stabiel publiek domein.

## Gecontroleerde Pagina's

Browsercheck op `http://localhost:3001`:

| Pagina | Renderstatus | Publieke vlaggen |
| --- | --- | --- |
| `/` | OK | Geen |
| `/schoenen` | OK | Geen |
| `/schoenen/asics-gel-kayano-31` | OK | Geen |
| `/vergelijken` | OK | Geen |
| `/keuzehulp` | OK | Geen |
| `/advies` | OK | Geen |
| `/methodologie` | OK | TODO zichtbaar |
| `/over-ons` | OK | TODO en MVP-fase zichtbaar |
| `/contact` | OK | TODO, demo-B.V. en KvK `00000000` zichtbaar |
| `/onafhankelijkheid` | OK | TODO zichtbaar |
| `/privacy` | OK | Demo-B.V., KvK `00000000` en placeholder zichtbaar |
| `/cookies` | OK | Geen |

## Wat Al Sterk Genoeg Is

- De site heeft een duidelijke propositie: hardloopschoenen vergelijken met keuzehulp en uitleg.
- Er zijn echte inhoudelijke routes: schoenenoverzicht, productpagina's, keuzehulp, vergelijken en advies.
- Koopinformatie wordt niet als advies vermomd.
- Placeholder-offers worden niet publiek als echte kooplinks getoond.
- Productpagina's leggen uit dat prijsinformatie losstaat van redactionele beoordeling.
- Methodologie, onafhankelijkheid, privacy, cookies, contact en over ons zijn aanwezig in de footer.
- Cookiebeleid is eerlijk: geen trackingcookies actief voor gewone bezoekers.
- De keuzehulp en productpagina's voelen meer als adviesplatform dan als generieke affiliate-site.

## Blokkerende Punten Voor Aanmelding

1. **Echte bedrijfsgegevens ontbreken**
   - Contactpagina en privacybeleid noemen nog `Loopwijzer Demo B.V.` en KvK `00000000`.
   - Dit moet worden vervangen door de echte verantwoordelijke partij.

2. **Publieke TODO's moeten weg**
   - Zichtbaar op methodologie, over ons, contact en onafhankelijkheid.
   - Een reviewer ziet dit als onaf of niet-productieklaar.

3. **Contactmailboxen moeten echt werken**
   - `contact@loopwijzer.nl`, `redactie@loopwijzer.nl`, `partners@loopwijzer.nl` en `privacy@loopwijzer.nl` staan publiek.
   - Gebruik ze alleen als ze bestaan en worden gelezen.

4. **Privacybeleid moet definitief zijn**
   - Nu staat expliciet dat de verantwoordelijke en bewaartermijnen nog definitief moeten worden ingevuld.
   - Voor publieke beoordeling moet dit als echt beleid lezen, niet als MVP-notitie.

5. **Onafhankelijkheidspagina moet van intern naar publiek**
   - De inhoud is goed, maar de "Wat nog geregeld moet zijn" sectie moet worden omgezet naar publiekscopy of verwijderd.

## Belangrijke Maar Niet-Blokkerende Punten

- Productbeelden zijn visueel sterk, maar echte productbeelden moeten later uit toegestane bronnen of feedrechten komen.
- Scores zijn MVP-redactioneel. Dat mag, zolang we niet doen alsof het laboratoriumtests zijn.
- Er zijn nog geen echte verified affiliate-offers. Dat is acceptabel voor aanmelding, zolang de site duidelijk maakt dat hij geen webshop is en nog niet misleidend naar winkels stuurt.
- Gebruikersreviews en persoonlijke omgeving ontbreken nog. Dat is geen blokkade voor TradeTracker, maar later wel belangrijk voor vertrouwen en retentie.

## Aanbevolen Fixvolgorde

1. Vervang alle demo-bedrijfsgegevens door echte gegevens.
2. Verwijder alle publieke TODO- en MVP-fase-copy.
3. Maak contactpagina definitief met werkende mailboxen.
4. Maak privacybeleid definitief met echte verantwoordelijke, contactpunt en bewaartermijnen.
5. Maak onafhankelijkheidspagina volledig publiekgericht.
6. Draai opnieuw een publieke readiness-scan.
7. Zet de site online.
8. Meld Loopwijzer aan bij TradeTracker.

## TradeTracker Positionering

Gebruik deze beschrijving bij aanmelding:

Loopwijzer is een Nederlandse vergelijkings- en keuzehulpsite voor hardloopschoenen. De site helpt beginnende en ervaren hardlopers om schoenen te vergelijken op pasvorm, demping, stabiliteit, gebruik, ondergrond, afstand en prijs. Loopwijzer verkoopt zelf geen schoenen. Productinformatie, redactionele beoordeling, persoonlijke match en winkelinformatie worden gescheiden gepresenteerd. Mogelijke affiliatevergoedingen hebben geen invloed op scores of aanbevelingen.

## Eerstvolgende Bouwticket

**Ticket:** Public trust cleanup voor TradeTracker-aanmelding

Doel:

- alle publieke demo/TODO/MVP-copy vervangen
- contact-, privacy-, onafhankelijkheids- en over-ons pagina productieklaar maken
- juridische en commerciële transparantie behouden zonder interne bouwstatus te tonen

Acceptatiecriteria:

- geen publieke `TODO`
- geen publieke `Loopwijzer Demo B.V.`
- geen publieke KvK `00000000`
- contactgegevens zijn definitief of bewust generiek maar waarheidsgetrouw
- privacybeleid leest als definitief beleid
- onafhankelijkheidspagina bevat duidelijke affiliate-uitleg zonder interne actielijst
- footer bevat alle noodzakelijke trustlinks
