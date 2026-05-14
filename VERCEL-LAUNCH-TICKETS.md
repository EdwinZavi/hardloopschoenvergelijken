# Vercel Launch Tickets

## Doel

Loopwijzer publiek live zetten op Vercel, daarna controleren of de site technisch werkt en geloofwaardig genoeg is als basis voor TradeTracker-beoordeling.

## Rollen

- Lead Integrator: bewaakt volgorde, GitHub/Vercel-koppeling, env-vars, validatie en go/no-go.
- Deployment/Vercel Agent: controleert build, Vercel-instellingen en deployflow.
- Security & Environment Agent: controleert secrets, public env-vars en adminrisico's.
- Public Launch QA Agent: controleert publieke routes na deploy.

## Ticket V1 - GitHub Basis Klaarzetten

Eigenaar: Lead Integrator

Status: klaar

Doel:

- project lokaal onder Git zetten
- eerste commit maken
- repository naar GitHub pushen

Acceptatiecriteria:

- `main` branch bestaat lokaal en remote
- `origin` wijst naar `https://github.com/EdwinZavi/hardloopschoenvergelijken.git`
- `.env.local`, `.next`, `node_modules` en buildcache staan niet in Git
- GitHub bevat de eerste projectversie

## Ticket V2 - Vercel Project Aanmaken

Eigenaar: gebruiker + Lead Integrator

Status: te doen

Doel:

- GitHub-repository importeren in Vercel
- Next.js project automatisch laten herkennen
- eerste Preview/Production deployment starten

Stappen:

1. Ga naar `https://vercel.com/new`.
2. Kies GitHub repository `EdwinZavi/hardloopschoenvergelijken`.
3. Laat Framework Preset op `Next.js`.
4. Laat Build Command standaard: `npm run build`.
5. Laat Output Directory leeg/default.
6. Vul environment variables in voordat je production serieus gebruikt.
7. Start deploy.

Acceptatiecriteria:

- Vercel project bestaat
- eerste deployment eindigt met status `Ready`
- Vercel geeft een publieke URL terug

## Ticket V3 - Environment Variables Instellen

Eigenaar: gebruiker + Security & Environment Agent

Status: te doen

Doel:

- alleen noodzakelijke variabelen in Vercel zetten
- secrets niet in Git of clientcode zetten

Vercel variables voor normale publieke site:

```txt
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Aanbevolen voor productie-admin:

```txt
ADMIN_PASSWORD=...
ADMIN_SESSION_SECRET=...
```

Alleen toevoegen als server-side admin/imports op Vercel Supabase staging moeten lezen of schrijven:

```txt
SUPABASE_SERVICE_ROLE_KEY=...
```

Belangrijk:

- `SUPABASE_SERVICE_ROLE_KEY` nooit in browsercode gebruiken.
- `SUPABASE_SERVICE_ROLE_KEY` nooit delen in screenshots.
- `NEXT_PUBLIC_*` variabelen zijn zichtbaar voor browserbundles en mogen dus alleen public/publishable keys bevatten.

Acceptatiecriteria:

- Vercel heeft `NEXT_PUBLIC_SUPABASE_URL`
- Vercel heeft `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Productie-admin gebruikt geen standaardwachtwoord
- Productie-admin faalt bewust als `ADMIN_PASSWORD` of `ADMIN_SESSION_SECRET` ontbreekt
- Service role key staat alleen in Vercel als de server-side adminfunctionaliteit dat echt nodig heeft

## Ticket V4 - Lokale Preflight

Eigenaar: Lead Integrator

Status: te doen vlak voor deploy of nieuwe push

Doel:

- voorkomen dat Vercel faalt op type- of buildfouten

Commands:

```bash
npm run build
npm run typecheck
```

Acceptatiecriteria:

- build slaagt
- typecheck slaagt
- Git status is schoon of bewuste wijzigingen zijn gecommit en gepusht

## Ticket V4b - Runtime Vastzetten

Eigenaar: Deployment/Vercel Agent

Status: klaar

Doel:

- voorkomen dat Vercel onverwacht op een andere Node major bouwt dan lokaal verwacht

Acceptatiecriteria:

- `package.json` bevat `engines.node`
- aanbevolen runtime staat op Node `22.x`
- Vercel build gebruikt dezelfde major

## Ticket V5 - Publieke Route QA Na Deploy

Eigenaar: Public Launch QA Agent + Lead Integrator

Status: te doen na Vercel URL

Te controleren routes:

```txt
/
/schoenen
/schoenen/asics-gel-kayano-31
/keuzehulp
/vergelijken
/advies
/methodologie
/over-ons
/contact
/onafhankelijkheid
/privacy
/cookies
/api/health
/api/catalog/shoes
```

Acceptatiecriteria:

- alle pagina's laden zonder 500
- homepage heeft duidelijke startpunten
- catalogus toont schoenen
- productpagina toont geen fake kooplink
- keuzehulp werkt zonder scrollfrictie
- vergelijken toont geen laagste-prijs-winnaar zonder gecontroleerde prijzen
- trustpagina's tonen geen publieke `TODO`, demo-B.V. of KvK `00000000`
- `/api/health` geeft gezonde status of duidelijke fallback
- `/api/catalog/shoes` lekt geen placeholder-offers als publieke prijzen
- adminroutes tonen geen data zonder login
- `/admin/login` toont in productie geen lokale wachtwoordhint

## Ticket V6 - Vercel Domain En TradeTracker Voorbereiding

Eigenaar: gebruiker + Lead Integrator

Status: later

Doel:

- publieke Vercel URL of eigen domein gebruiken voor TradeTracker-aanmelding
- sitebeschrijving en trustlinks klaar hebben

Minimale TradeTracker-check:

- publieke URL werkt
- contactpagina werkt
- privacybeleid bestaat
- cookiebeleid bestaat
- onafhankelijkheid/affiliate-uitleg bestaat
- methodologie bestaat
- geen placeholderbedrijfsgegevens zichtbaar

Aanmeldbeschrijving:

Loopwijzer is een Nederlandse vergelijkings- en keuzehulpsite voor hardloopschoenen. De site helpt beginnende en ervaren hardlopers om schoenen te vergelijken op pasvorm, demping, stabiliteit, gebruik, ondergrond, afstand en prijs. Loopwijzer verkoopt zelf geen schoenen. Productinformatie, redactionele beoordeling, persoonlijke match en winkelinformatie worden gescheiden gepresenteerd. Mogelijke affiliatevergoedingen hebben geen invloed op scores of aanbevelingen.

## Go / No-Go

Go voor Vercel deploy:

- GitHub repo is gepusht
- build en typecheck zijn groen
- Vercel env-vars zijn ingevuld
- geen secrets in Git

Go voor TradeTracker-aanmelding:

- Vercel URL werkt publiek
- publieke QA is groen
- trustpagina's zijn compleet
- contactgegevens en mailboxen zijn waarheidsgetrouw
- geen fake prijzen of fake kooplinks zichtbaar
