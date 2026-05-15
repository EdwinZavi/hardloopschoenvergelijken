import Link from "next/link";
import { formatReleaseLabel, getNewestReleaseShoes } from "@/lib/data";
import { labels } from "@/lib/labels";

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
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="eyebrow">Hardloopschoenen vergelijken</p>
          <h1>Vind rust in het kiezen van hardloopschoenen.</h1>
          <p className="lead">
            Loopwijzer helpt je begrijpen welke schoen past bij jouw doel, voeten en trainingen. Met duidelijke filters, persoonlijke keuzehulp en eerlijke vergelijking.
          </p>
          <div className="actions">
            <Link className="button" href="/keuzehulp">
              Start de keuzehulp
            </Link>
            <Link className="button secondary" href="/schoenen">
              Bekijk schoenen
            </Link>
          </div>
          <div className="home-trust-line" aria-label="Vertrouwenssignalen">
            <span>Productadvies los van winkelprijzen</span>
            <span>Uitleg per aanbeveling</span>
            <span>Nadelen zichtbaar</span>
          </div>
        </div>
      </section>

      <section className="home-route-section" aria-label="Startpunten">
        <p className="eyebrow">Begin hier</p>
        <div className="home-route-grid">
          {routes.map((route) => (
            <Link className="home-route-card" href={route.href} key={route.href}>
              <strong>{route.label}</strong>
              <span>{route.text}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-release-section" aria-label="Nieuwste releases">
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
      </section>
    </main>
  );
}
