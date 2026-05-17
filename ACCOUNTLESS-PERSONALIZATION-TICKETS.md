# Accountloze personalisatie tickets

## Productdoel

Loopwijzer moet al in de MVP persoonlijke waarde leveren zonder dat gebruikers eerst een account hoeven aan te maken. De gebruiker moet keuzehulpresultaten, vergelijkingen en filters kunnen terugvinden, delen en verfijnen via URL's en browseropslag, terwijl productlogica server-first en privacyvriendelijk blijft.

Dit voorkomt dat een "mijnomgeving" te vroeg database-, login- en privacycomplexiteit introduceert. De eerste versie moet voelen alsof Loopwijzer onthoudt wat belangrijk is, zonder persoonlijke dossiers op te bouwen.

## Principes

- URL search params zijn de bron van waarheid voor filters, vergelijkingen en keuzehulpresultaten.
- Server-rendered routes blijven de standaard; client code is alleen een kleine progressive enhancement.
- Geen account, database, service-role key, user table of Supabase RLS-eis voor deze tickets.
- Keuzehulpuitkomsten zijn uitlegbaar en herhaalbaar vanuit de URL.
- Privacy by design: geen gevoelige medische details opslaan, geen verborgen tracking, geen profielopbouw buiten de browser.
- Gebruikers moeten een vergelijking of resultaat kunnen bewaren door een link te kopieren of via een expliciete lokale bewaaractie.

## Ticket AP1 - URL-gedreven keuzehulpresultaat

**Doel:** Maak keuzehulpresultaten terugkeerbaar en deelbaar zonder sessie, login of database.

**User story:** Als hardloper wil ik mijn keuzehulpresultaat kunnen openen via een link, zodat ik later opnieuw kan kijken of het met iemand kan delen.

**Scope**

- Keuzehulpvragen mappen naar compacte URL search params.
- Resultatenpagina leest alleen URL params en server-side catalogus/recommendation logic.
- Aanbevolen schoenen tonen expliciete matchredenen en trade-offs.
- Ongeldige of ontbrekende params krijgen een rustige fallback naar de keuzehulpstart.

**Acceptance criteria**

- Een ingevulde keuzehulp leidt naar een shareable URL met alle noodzakelijke antwoordwaarden.
- Refreshen of openen in een nieuwe browser toont hetzelfde resultaat.
- De URL bevat geen vrije tekstvelden met medische details of herleidbare persoonsgegevens.
- De aanbevelingslogica blijft server-side en wordt niet in browserstate als enige bron opgeslagen.
- De pagina legt per aanbeveling uit waarom deze past en wanneer deze minder geschikt is.
- Er is een lege/ongeldige staat met duidelijke Nederlandse copy en een link terug naar `/keuzehulp`.

**Data/privacy notes**

- Gebruik enums of korte codes voor antwoorden zoals afstand, ondergrond, demping, stabiliteit en budget.
- Vermijd opslag van letselgeschiedenis als gedetailleerde vrije tekst; gebruik hooguit niet-medische voorkeuren zoals `extra_ondersteuning=ja`.
- URL's kunnen gedeeld worden; behandel alles in params als publiek zichtbaar.

**Verification**

- Open een keuzehulpresultaat in een privevenster en controleer dat dezelfde aanbevelingen verschijnen.
- Controleer dat `rg -n '"use client"' src` geen nieuwe brede client boundary toont.
- Controleer handmatig dat de URL geen naam, e-mail, vrije tekst of gevoelige medische details bevat.

## Ticket AP2 - Vergelijking bewaren via URL

**Doel:** Laat gebruikers een vergelijking bewaren of delen zonder account of database.

**User story:** Als gebruiker wil ik 2 tot 4 schoenen kunnen vergelijken en die vergelijking later weer kunnen openen, zodat ik niet opnieuw hoef te zoeken.

**Scope**

- Vergelijkingspagina gebruikt URL params met shoe identifiers, bijvoorbeeld `/vergelijken?ids=shoe-a,shoe-b,shoe-c`.
- Productgegevens, scores en offers worden server-side opgehaald op basis van de IDs.
- Er komt een duidelijke actie "Link kopieren" of vergelijkbare browser-native/share progressive enhancement.
- Ongeldige, dubbele of niet-bestaande IDs worden veilig genegeerd of duidelijk gemeld.

**Acceptance criteria**

- Een vergelijking is volledig herstelbaar via de URL.
- De vergelijking werkt zonder ingelogde gebruiker en zonder database writes.
- De pagina maakt onderscheid tussen productkwaliteit, match voor gebruiker en eventuele retailerinformatie.
- Duplicaten in `ids` leiden niet tot dubbele kolommen.
- Bij minder dan 2 geldige schoenen toont de pagina een duidelijke route terug naar schoenen zoeken.
- Bij meer dan het afgesproken maximum worden extra IDs genegeerd of wordt een duidelijke limietmelding getoond.

**Data/privacy notes**

- Shoe IDs of slugs zijn productdata, geen persoonsgegevens.
- Bewaar geen prijs- of beschikbaarheidsnapshot in de URL; haal actuele publieke data opnieuw server-side op.
- Een gedeelde vergelijking mag geen keuzehulpprofiel bevatten tenzij de gebruiker bewust een URL met profielparams deelt.

**Verification**

- Kopieer een vergelijkings-URL, open deze in een nieuwe browser en controleer dat dezelfde schoenen verschijnen.
- Test dubbele, onbekende en te veel IDs.
- Controleer dat er geen database write of auth check nodig is voor de flow.

## Ticket AP3 - Filterstatus als shareable catalogus-URL

**Doel:** Maak catalogusfilters betrouwbaar, deelbaar en SEO-/cachevriendelijk door URL search params als state te gebruiken.

**User story:** Als gebruiker wil ik mijn gefilterde schoenenlijst kunnen terugvinden of delen, zodat ik gericht verder kan vergelijken.

**Scope**

- Catalogusfilters voor categorie, ondergrond, stabiliteit, demping, pasvorm, drop, budget en merk blijven URL-driven.
- Filterformulieren werken met GET en server-rendered resultaten.
- Client auto-submit mag alleen als progressive enhancement rond bestaande serverformulieren.
- Actieve filters zijn zichtbaar en afzonderlijk verwijderbaar via links.

**Acceptance criteria**

- Elke filtercombinatie heeft een bookmarkbare URL.
- De gefilterde resultaten werken zonder JavaScript.
- Actieve filters worden in Nederlandse labels getoond, niet alleen als technische codes.
- Filters gebruiken toegestane enumwaarden; onbekende waarden worden genegeerd of genormaliseerd.
- Sorteerkeuzes, zoals prijs, score of gewicht, staan ook in de URL.
- De pagina toont een nuttige nul-resultatenstaat met suggesties om filters te versoepelen.

**Data/privacy notes**

- Filterparams mogen alleen productvoorkeuren bevatten, geen persoonsgegevens.
- Budget is een voorkeur, geen financieel profiel; behandel het als tijdelijke catalogusstate.
- Geen verborgen opslag van filtergedrag in database of serverlogs bovenop normale webserverlogging.

**Verification**

- Test catalogusfilters met JavaScript uitgeschakeld of zonder client enhancement.
- Deel een gefilterde URL en controleer dat resultaten, sortering en actieve filters gelijk blijven.
- Controleer dat onbekende params geen foutpagina of onbetrouwbare resultaten veroorzaken.

## Ticket AP4 - Optionele lokale bewaarfunctie

**Doel:** Geef gebruikers een lichte "bewaar" ervaring in de browser zonder account, database of profielopbouw.

**User story:** Als terugkerende gebruiker wil ik lokaal mijn laatste vergelijking of keuzehulpresultaat kunnen terugvinden, zonder een account te maken.

**Scope**

- Kleine client island voor expliciete browseropslagacties zoals "Bewaar vergelijking op dit apparaat".
- localStorage bewaart alleen URL's, shoe IDs, timestamp en optionele korte titel.
- Geen automatische opslag van gevoelige keuzehulpantwoorden zonder expliciete gebruikersactie.
- UI maakt duidelijk dat bewaren alleen op dit apparaat en in deze browser werkt.

**Acceptance criteria**

- De primaire flow blijft werken zonder localStorage.
- Gebruiker kan een vergelijking of resultaat expliciet lokaal bewaren.
- Gebruiker kan lokaal bewaarde items verwijderen.
- De bewaarde items linken terug naar URL-driven serverpagina's.
- Er is een graceful fallback wanneer localStorage niet beschikbaar is.
- De client component is klein, geisoleerd en bevat geen recommendation logic of server-only imports.

**Data/privacy notes**

- localStorage is zichtbaar voor scripts op hetzelfde domein; sla daarom geen vrije medische notities, naam, e-mail of ruwe profieldata op.
- Bewaar bij voorkeur alleen canonical URL's en product IDs.
- Plaats korte privacycopy bij de bewaaractie: "Alleen opgeslagen in deze browser."

**Verification**

- Sla een vergelijking op, refresh de pagina en open het bewaarde item.
- Verwijder een bewaard item en controleer dat het niet terugkomt na refresh.
- Controleer dat dezelfde pagina bruikbaar blijft in een browser waar storage geblokkeerd is.
- Controleer met `rg -n '"use client"' src` dat alleen de lokale bewaarwidget client-side is.

## Ticket AP5 - Privacyvriendelijke "ga verder" terugkeerroute

**Doel:** Help terugkerende gebruikers verdergaan waar ze waren zonder account of serverprofiel.

**User story:** Als ik terugkom op Loopwijzer wil ik snel verder kunnen met mijn laatste vergelijking of keuzehulpresultaat, zonder dat de site doet alsof er een persoonlijk dossier bestaat.

**Scope**

- Toon alleen na expliciete lokale opslag een compacte terugkeerroute op relevante pagina's, bijvoorbeeld homepage, keuzehulp en vergelijken.
- Terugkeerroute verwijst naar opgeslagen URL's, niet naar serverprofielen.
- Copy blijft eerlijk over de beperking: dit is browsergebonden en niet gesynchroniseerd.
- Geen automatische personalisatie van aanbevelingen op basis van opgeslagen items zonder duidelijke actie van de gebruiker.

**Acceptance criteria**

- Zonder opgeslagen items verandert de server-rendered pagina niet wezenlijk.
- Met opgeslagen items ziet de gebruiker een compacte "Ga verder" optie.
- De gebruiker kan kiezen om het lokale overzicht te wissen.
- Er worden geen aanbevelingen aangepast op basis van lokale history zonder expliciete klik.
- De terugkeerroute blijft ondergeschikt aan de primaire keuzehulp- en vergelijkingsflows.

**Data/privacy notes**

- Dit is geen accountvervanger en mag niet zo worden gepositioneerd.
- Vermijd taal als "jouw profiel" wanneer er geen account of duurzaam profiel is.
- Gebruik copy zoals "Op dit apparaat bewaard" of "Verdergaan met je opgeslagen vergelijking".

**Verification**

- Test homepage/keuzehulp/vergelijken met en zonder lokale opgeslagen items.
- Controleer dat opgeslagen items niet zichtbaar zijn in een andere browser.
- Controleer dat wissen van lokale items alle terugkeerlinks verwijdert.

## MVP-volgorde

1. AP1 - URL-gedreven keuzehulpresultaat
2. AP2 - Vergelijking bewaren via URL
3. AP3 - Filterstatus als shareable catalogus-URL
4. AP4 - Optionele lokale bewaarfunctie
5. AP5 - Privacyvriendelijke "ga verder" terugkeerroute

Begin met AP1 en AP2. Die leveren de meeste "mijnomgeving"-waarde zonder accounts: gebruikers kunnen persoonlijke uitkomsten en vergelijkingen bewaren door simpelweg een link te bewaren of te delen.

## Kernkeuzes voor Lead Integrator

- Bouw geen accountlaag voordat URL-driven keuzehulp, vergelijken en filters sterk werken.
- Maak URL's canoniek en stabiel; localStorage mag alleen verwijzen naar die URL's.
- Houd recommendation logic server-side en uitlegbaar.
- Introduceer geen database-eisen voor bewaarde vergelijkingen of keuzehulpresultaten.
- Behandel alle URL params als publiek zichtbaar en alle localStorage als apparaatgebonden, niet als vertrouwde serverdata.
