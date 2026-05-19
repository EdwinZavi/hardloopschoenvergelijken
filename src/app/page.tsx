import Link from "next/link";
import { formatReleaseLabel, getNewestReleaseShoes } from "@/lib/data";
import { labels } from "@/lib/labels";
import { companyInfo } from "@/lib/company";

export default function HomePage() {
  const newestReleases = getNewestReleaseShoes(5);
  const routes = [
    {
      href: "/keuzehulp",
      label: "Start met persoonlijk advies",
      text: "Beantwoord korte vragen en zie welke schoenen logisch passen bij jouw loopdoel."
    },
    {
      href: "/schoenen",
      label: "Bekijk alle schoenen",
      text: "Filter op demping, steun, pasvorm, ondergrond en prijs."
    },
    {
      href: "/vergelijken",
      label: "Vergelijk modellen",
      text: "Zet 2 tot 4 schoenen naast elkaar en bekijk de belangrijkste verschillen."
    }
  ];

  return (
    <main className="page-home">
      <section className="home-section home-hero-section">
        <div className="home-section-inner home-hero">
          <div className="home-hero-content">
            <p className="eyebrow">Hardloopschoenen vergelijken</p>
            <h1>Vind rust in het kiezen van hardloopschoenen.</h1>
            <p className="lead">
              {companyInfo.platformName} helpt je begrijpen welke schoen past bij jouw doel, voeten en trainingen. Met {companyInfo.tagline} als keuzehulp vergelijk je rustiger en eerlijker.
            </p>
            <div className="actions">
              <Link className="button" href="/keuzehulp">
                Start de keuzehulp
              </Link>
              <Link className="button secondary" href="/schoenen">
                Bekijk schoenen
              </Link>
            </div>
          </div>
          <div className="home-hero-panel" aria-label="Wat Loopwijzer inzichtelijk maakt">
            <span>01</span>
            <strong>Doel, voeten en budget naast elkaar</strong>
            <p>Geen losse toplijstjes, maar duidelijke keuze-signalen die je helpen begrijpen waarom een schoen wel of niet past.</p>
          </div>
        </div>
      </section>

      <section className="home-section" aria-label="Vertrouwenssignalen">
        <div className="home-section-inner">
          <div className="home-section-header">
            <div>
              <p className="eyebrow">Waarom Loopwijzer</p>
              <h2>Kiezen wordt makkelijker als de verschillen helder zijn.</h2>
            </div>
          </div>
          <div className="home-proof-grid">
            <article>
              <strong>Productadvies los van winkelprijzen</strong>
              <span>We scheiden schoenkwaliteit, persoonlijke match en retailerinformatie.</span>
            </article>
            <article>
              <strong>Uitleg per aanbeveling</strong>
              <span>Je ziet niet alleen welke schoen past, maar ook waarom die logisch is.</span>
            </article>
            <article>
              <strong>Nadelen zichtbaar</strong>
              <span>Een goede keuze ontstaat pas als de beperkingen ook duidelijk zijn.</span>
            </article>
          </div>
        </div>
      </section>

      <section className="home-section home-section-muted" aria-label="Startpunten">
        <div className="home-section-inner">
          <div className="home-section-header">
            <div>
              <p className="eyebrow">Begin hier</p>
              <h2>Kies de route die past bij je vraag.</h2>
            </div>
          </div>
          <div className="home-route-grid">
            {routes.map((route) => (
              <Link className="home-route-card" href={route.href} key={route.href}>
                <strong>{route.label}</strong>
                <span>{route.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section" aria-label="Vergelijken op belangrijke kenmerken">
        <div className="home-section-inner home-split-section">
          <div>
            <p className="eyebrow">Vergelijk op wat ertoe doet</p>
            <h2>Niet alleen merk en prijs, maar pasvorm, steun en gebruik.</h2>
            <p>
              Hardloopschoenen verschillen sterk per loopdoel. Daarom brengen we technische kenmerken terug naar praktische keuzevragen.
            </p>
          </div>
          <div className="home-feature-grid">
            <span>Demping</span>
            <span>Steun</span>
            <span>Pasvorm</span>
            <span>Ondergrond</span>
            <span>Tempo-gevoel</span>
            <span>Prijs-kwaliteit</span>
          </div>
        </div>
      </section>

      <section className="home-section home-section-muted" aria-label="Nieuwste releases">
        <div className="home-section-inner">
          <div className="home-section-header">
            <div>
              <p className="eyebrow">Nieuw in de catalogus</p>
              <h2>Nieuwe modellen in onze vergelijking</h2>
            </div>
            <Link href="/schoenen">Alle schoenen</Link>
          </div>
          <div className="home-release-list">
            {newestReleases.map((shoe, index) => (
              <Link className="home-release-row" href={`/schoenen/${shoe.slug}`} key={shoe.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{shoe.fullName}</strong>
                <em>{formatReleaseLabel(shoe)}</em>
                <small>{labels.shoeType[shoe.shoeType]}</small>
                <b>{shoe.editorialScore.overall.toFixed(1)}</b>
              </Link>
            ))}
          </div>
          <p className="home-data-note">
            Deze lijst gebruikt de beste beschikbare releasedata. Waar een exacte maand nog ontbreekt, tonen we bewust alleen het jaar.
          </p>
        </div>
      </section>

      <section className="home-section home-final-section" aria-label="Onafhankelijk vergelijken">
        <div className="home-section-inner home-split-section">
          <div>
            <p className="eyebrow">Vertrouwen eerst</p>
            <h2>Advies moet uitlegbaar blijven.</h2>
            <p>
              We bouwen hardloopschoenvergelijken.nl als keuzeplatform, niet als webshop. Commerciële links mogen het advies niet sturen.
            </p>
          </div>
          <div className="home-final-actions">
            <Link className="button" href="/methodologie">
              Bekijk onze methode
            </Link>
            <Link className="button secondary" href="/onafhankelijkheid">
              Lees over onafhankelijkheid
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
