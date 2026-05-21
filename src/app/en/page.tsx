import Image from "next/image";
import Link from "next/link";
import { ShoeVisual } from "@/components/ShoeVisual";
import { getEnrichedShoes } from "@/lib/data";
import type { EnrichedShoe } from "@/types/product";
import { enLabels, formatEuro } from "@/app/en/copy";

export const metadata = {
  title: "Hardloopschoenvergelijken.nl in English | Loopwijzer",
  description: "English running shoe comparison for goals, fit, cushioning, support and price."
};

const m3Cards = [
  {
    href: "/en/shoe-finder",
    icon: "5K",
    title: "Choose by goal",
    text: "For 5K, half marathon, marathon, recovery runs or daily training.",
    cta: "Start with your goal"
  },
  {
    href: "/en/advice",
    icon: "FIT",
    title: "Understand your fit",
    text: "Get clarity on support, stability, cushioning and running feel.",
    cta: "Read the guidance"
  },
  {
    href: "/en/compare",
    icon: "VS",
    title: "Compare honestly",
    text: "No random top lists, but clear differences per shoe.",
    cta: "Compare models"
  },
  {
    href: "/en/shoes",
    icon: "€",
    title: "Budget aware",
    text: "See which shoes match your preferences and price range.",
    cta: "Filter by budget"
  }
];

const popularShoeIds = [
  "nike-pegasus-41",
  "asics-novablast-5",
  "hoka-clifton-9",
  "brooks-ghost-16",
  "saucony-endorphin-speed-4",
  "new-balance-fresh-foam-x-1080v13"
];

function getPopularShoes() {
  const shoes = getEnrichedShoes();
  return popularShoeIds
    .map((id) => shoes.find((shoe) => shoe.id === id))
    .filter((shoe): shoe is EnrichedShoe => Boolean(shoe));
}

function HomeShoeCard({ duplicate = false, shoe }: { duplicate?: boolean; shoe: EnrichedShoe }) {
  return (
    <article className="home-shoe-card" aria-hidden={duplicate ? "true" : undefined}>
      <Link href={`/en/shoes/${shoe.slug}`} tabIndex={duplicate ? -1 : undefined}>
        <span className="home-shoe-image">
          {shoe.imageUrl ? (
            <Image alt={shoe.fullName} fill sizes="(max-width: 820px) 82vw, 300px" src={shoe.imageUrl} />
          ) : (
            <ShoeVisual shoe={shoe} size="compact" />
          )}
        </span>
        <span className="home-shoe-meta">{shoe.brand}</span>
        <strong>{shoe.fullName}</strong>
        <span className="home-shoe-category">{enLabels.shoeType[shoe.shoeType]}</span>
        <span className="home-shoe-footer">
          <span>{shoe.priceFrom === null ? formatEuro(shoe.priceFrom) : `From ${formatEuro(shoe.priceFrom)}`}</span>
          <b>View shoe</b>
        </span>
      </Link>
    </article>
  );
}

export default function EnglishHomePage() {
  const popularShoes = getPopularShoes();

  return (
    <main className="page-home">
      <section className="home-hero-section" aria-label="Compare running shoes">
        <div className="home-hero-media" aria-hidden="true">
          <Image alt="" fill priority sizes="100vw" src="/images/home/premium-runner-hero.png" />
        </div>
        <div className="home-hero-light" aria-hidden="true" />
        <div className="home-section-inner home-hero">
          <div className="home-hero-content">
            <p className="eyebrow">Compare running shoes</p>
            <h1>Find the running shoe that truly fits you.</h1>
            <p className="lead">
              Compare shoes by goal, cushioning, support, budget and running style. Not loose top lists, but clear decision signals.
            </p>
            <div className="actions">
              <Link className="button home-primary-cta" href="/en/shoe-finder">
                Start the Shoe Finder
              </Link>
              <Link className="button secondary" href="/en/shoes">
                Browse shoes
              </Link>
            </div>
            <div className="home-hero-trust" aria-label="Trust signals">
              <span>Independent guidance</span>
              <span>Explainable scores</span>
              <span>Product information separate from retailers</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-m3-section" aria-label="Why compare through Loopwijzer">
        <div className="home-section-inner">
          <div className="home-section-header home-section-header-centered">
            <div>
              <p className="eyebrow">Why compare through Loopwijzer?</p>
              <h2>Do not just pick the most popular shoe.</h2>
              <p>Discover which shoe matches your body, goal and way of running.</p>
            </div>
          </div>
          <div className="home-m3-grid">
            {m3Cards.map((card) => (
              <Link className="home-m3-card" href={card.href} key={card.title}>
                <span className="home-m3-icon" aria-hidden="true">{card.icon}</span>
                <strong>{card.title}</strong>
                <span>{card.text}</span>
                <em>{card.cta}</em>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-carousel-section" aria-label="Popular running shoes">
        <div className="home-section-inner">
          <div className="home-section-header">
            <div>
              <p className="eyebrow">Popular running shoes</p>
              <h2>Models runners often compare.</h2>
              <p>Start with familiar daily trainers and quickly see differences in cushioning, support and fit.</p>
            </div>
            <Link href="/en/shoes">All shoes</Link>
          </div>
        </div>
        <div className="home-carousel-shell">
          <div className="home-shoe-track">
            {popularShoes.map((shoe) => (
              <HomeShoeCard key={shoe.id} shoe={shoe} />
            ))}
            {popularShoes.map((shoe) => (
              <HomeShoeCard duplicate key={`${shoe.id}-duplicate`} shoe={shoe} />
            ))}
          </div>
        </div>
      </section>

      <section className="home-section" aria-label="Compare what matters">
        <div className="home-section-inner home-split-section">
          <div>
            <p className="eyebrow">Compare what really makes a difference</p>
            <h2>Not just brand and price, but fit, support and use case.</h2>
            <p>
              Running shoes differ strongly by running goal. That is why we translate technical characteristics into practical decision questions.
            </p>
          </div>
          <div className="home-feature-grid">
            <span>Cushioning</span>
            <span>Support</span>
            <span>Fit</span>
            <span>Drop</span>
            <span>Weight</span>
            <span>Value</span>
          </div>
        </div>
      </section>

      <section className="home-section home-final-section" aria-label="Independent comparison">
        <div className="home-section-inner home-split-section">
          <div>
            <p className="eyebrow">Why you can trust the outcome</p>
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
