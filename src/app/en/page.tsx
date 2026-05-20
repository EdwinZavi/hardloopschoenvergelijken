import Link from "next/link";
import Image from "next/image";
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
      <section className="home-section home-hero-section">
        <div className="home-section-inner home-hero">
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
          </div>
          <div className="home-hero-panel" aria-label="What Loopwijzer clarifies">
            <Image
              alt="Runner calmly compares multiple running shoes side by side"
              fill
              priority
              sizes="(max-width: 820px) 100vw, 520px"
              src="/images/home/decision-table-compare.png"
            />
            <div>
              <strong>Goal, feet and budget side by side</strong>
              <p>Not generic top lists, but clear decision signals that explain why a shoe may or may not fit.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section" aria-label="Trust signals">
        <div className="home-section-inner">
          <div className="home-section-header">
            <div>
              <p className="eyebrow">Why Loopwijzer</p>
              <h2>Choosing gets easier when the differences are clear.</h2>
            </div>
          </div>
          <div className="home-proof-grid">
            <article>
              <strong>Advice separate from retailer prices</strong>
              <span>We separate shoe quality, personal match and retailer information.</span>
            </article>
            <article>
              <strong>Reasoning behind recommendations</strong>
              <span>You see not only which shoe may fit, but also why it is logical.</span>
            </article>
            <article>
              <strong>Trade-offs made visible</strong>
              <span>A better choice starts when limitations are clear too.</span>
            </article>
          </div>
        </div>
      </section>

      <section className="home-section home-section-muted" aria-label="Start points">
        <div className="home-section-inner">
          <div className="home-section-header">
            <div>
              <p className="eyebrow">Start here</p>
              <h2>Choose the route that matches your question.</h2>
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

      <section className="home-section" aria-label="Compare what matters">
        <div className="home-section-inner home-split-section">
          <div>
            <p className="eyebrow">Compare what matters</p>
            <h2>Not just brand and price, but fit, support and use case.</h2>
            <p>
              Running shoes differ strongly by running goal. That is why we translate technical characteristics into practical decision questions.
            </p>
          </div>
          <div className="home-feature-grid">
            <span>Cushioning</span>
            <span>Support</span>
            <span>Fit</span>
            <span>Surface</span>
            <span>Tempo feel</span>
            <span>Value</span>
          </div>
        </div>
      </section>

      <section className="home-section home-section-muted" aria-label="Newest releases">
        <div className="home-section-inner">
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
        </div>
      </section>

      <section className="home-section home-final-section" aria-label="Independent comparison">
        <div className="home-section-inner home-split-section">
          <div>
            <p className="eyebrow">Trust first</p>
            <h2>Advice should stay explainable.</h2>
            <p>
              We build hardloopschoenvergelijken.nl as a decision platform, not a webshop. Commercial links may not steer the advice.
            </p>
          </div>
          <div className="home-final-actions">
            <Link className="button" href="/en/methodology">
              View methodology
            </Link>
            <Link className="button secondary" href="/en/independence">
              Read independence policy
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
