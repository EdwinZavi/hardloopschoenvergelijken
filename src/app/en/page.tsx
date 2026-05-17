import Link from "next/link";
import { getNewestReleaseShoes } from "@/lib/data";
import { companyInfo } from "@/lib/company";
import { enLabels, formatEnglishReleaseLabel } from "@/app/en/copy";

export const metadata = {
  title: "Hardloopschoenvergelijken.nl in English | Loopwijzer",
  description: "English running shoe comparison for goals, fit, cushioning, support and price."
};

export default function EnglishHomePage() {
  const newestReleases = getNewestReleaseShoes(5);
  const routes = [
    {
      href: "/en/shoe-finder",
      label: "Start with the Shoe Finder",
      text: "Answer a few questions and see which shoes are most logical for your running goal."
    },
    {
      href: "/en/shoes",
      label: "Browse all shoes",
      text: "Filter by cushioning, support, fit, surface and price."
    },
    {
      href: "/en/compare",
      label: "Compare models",
      text: "Place 2 to 4 running shoes side by side and review the important differences."
    }
  ];

  return (
    <main className="page-home">
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="eyebrow">Compare running shoes</p>
          <h1>Find clarity when choosing running shoes.</h1>
          <p className="lead">
            {companyInfo.platformName} helps you understand which shoe may suit your goal, feet and training. Loopwijzer keeps comparison practical, calm and transparent.
          </p>
          <div className="actions">
            <Link className="button" href="/en/shoe-finder">
              Start the Shoe Finder
            </Link>
            <Link className="button secondary" href="/en/shoes">
              Browse shoes
            </Link>
          </div>
          <div className="home-trust-line" aria-label="Trust signals">
            <span>Product advice separate from retailer prices</span>
            <span>Reasoning behind recommendations</span>
            <span>Trade-offs made visible</span>
          </div>
        </div>
      </section>

      <section className="home-route-section" aria-label="Start points">
        <p className="eyebrow">Start here</p>
        <div className="home-route-grid">
          {routes.map((route) => (
            <Link className="home-route-card" href={route.href} key={route.href}>
              <strong>{route.label}</strong>
              <span>{route.text}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-release-section" aria-label="Newest releases">
        <div className="home-section-header">
          <div>
            <p className="eyebrow">New in the catalog</p>
            <h2>New models in our comparison</h2>
          </div>
          <Link href="/en/shoes">All shoes</Link>
        </div>
        <div className="home-release-list">
          {newestReleases.map((shoe, index) => (
            <Link className="home-release-row" href={`/en/shoes/${shoe.slug}`} key={shoe.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{shoe.fullName}</strong>
              <em>{formatEnglishReleaseLabel(shoe)}</em>
              <small>{enLabels.shoeType[shoe.shoeType]}</small>
              <b>{shoe.editorialScore.overall.toFixed(1)}</b>
            </Link>
          ))}
        </div>
        <p className="home-data-note">This list uses the best available release data. When an exact month is missing, we intentionally show only the year.</p>
      </section>
    </main>
  );
}
