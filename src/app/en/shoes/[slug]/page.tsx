import Link from "next/link";
import { notFound } from "next/navigation";
import { getEnrichedShoes, getPublicOffersForShoe } from "@/lib/data";
import { enLabels, formatEuro } from "@/app/en/copy";
import { ShoeVisual } from "@/components/ShoeVisual";

export function generateStaticParams() {
  return getEnrichedShoes().map((shoe) => ({
    slug: shoe.slug
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const shoe = getEnrichedShoes().find((item) => item.slug === slug);

  if (!shoe) {
    return {
      title: "Running shoe not found | Hardloopschoenvergelijken.nl"
    };
  }

  return {
    title: `${shoe.fullName} review | Hardloopschoenvergelijken.nl`,
    description: `Compare ${shoe.fullName} by use case, cushioning, support, fit, editorial score and verified prices.`
  };
}

function matchExplanation(shoe: ReturnType<typeof getEnrichedShoes>[number]) {
  const support =
    shoe.supportType === "neutral"
      ? "neutral runners"
      : shoe.supportType === "light_stability"
        ? "runners who want light guidance"
        : "runners who need more stability";
  const feel =
    shoe.cushioningLevel === "high"
      ? "a softer, more protective feel"
      : shoe.responsivenessLevel === "high"
        ? "a more responsive ride"
        : "a balanced ride";

  return `This shoe is most relevant for ${support} who prefer ${feel} on ${enLabels.surfaceType[shoe.surfaceType].toLowerCase()} runs.`;
}

export default async function EnglishShoeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const shoe = getEnrichedShoes().find((item) => item.slug === slug);

  if (!shoe) {
    notFound();
  }

  const offers = getPublicOffersForShoe(shoe.id);

  return (
    <main className="page-product">
      <section className="product-hero-detail">
        <div>
          <p className="eyebrow">{shoe.brand}</p>
          <h1>{shoe.fullName}</h1>
          <p className="lead">{matchExplanation(shoe)}</p>
          <div className="product-decision-strip" aria-label="Key decision signals">
            <div>
              <span>Use case</span>
              <strong>{enLabels.shoeType[shoe.shoeType]}</strong>
            </div>
            <div>
              <span>Support</span>
              <strong>{enLabels.supportType[shoe.supportType]}</strong>
            </div>
            <div>
              <span>Cushioning</span>
              <strong>{enLabels.level[shoe.cushioningLevel]}</strong>
            </div>
            <div>
              <span>Fit</span>
              <strong>{enLabels.width[shoe.widthLabel]}</strong>
            </div>
          </div>
          <div className="actions">
            <Link className="button" href={`/en/compare?ids=${shoe.id}`}>
              Compare this shoe
            </Link>
            <Link className="button secondary" href="/en/shoes">
              Back to all shoes
            </Link>
          </div>
        </div>
        <aside className="product-side-panel">
          <ShoeVisual shoe={shoe} size="hero" />
          <div className="score-panel">
            <span>Editorial score</span>
            <strong>{shoe.editorialScore.overall.toFixed(1)}</strong>
            <p>Retailer prices do not influence this product score.</p>
          </div>
        </aside>
      </section>

      <section className="grid">
        <article className="panel">
          <h2>Key characteristics</h2>
          <dl className="spec-grid">
            <div>
              <dt>Use case</dt>
              <dd>{enLabels.shoeType[shoe.shoeType]}</dd>
            </div>
            <div>
              <dt>Surface</dt>
              <dd>{enLabels.surfaceType[shoe.surfaceType]}</dd>
            </div>
            <div>
              <dt>Cushioning</dt>
              <dd>{enLabels.level[shoe.cushioningLevel]}</dd>
            </div>
            <div>
              <dt>Responsiveness</dt>
              <dd>{enLabels.level[shoe.responsivenessLevel]}</dd>
            </div>
            <div>
              <dt>Support</dt>
              <dd>{enLabels.supportType[shoe.supportType]}</dd>
            </div>
            <div>
              <dt>Fit width</dt>
              <dd>{enLabels.width[shoe.widthLabel]}</dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd>{shoe.weightGrams} g</dd>
            </div>
            <div>
              <dt>Drop</dt>
              <dd>{shoe.heelDropMm} mm</dd>
            </div>
          </dl>
        </article>

        <article className="panel">
          <h2>Good choice if...</h2>
          <p>{matchExplanation(shoe)}</p>
        </article>

        <article className="panel">
          <h2>Check before buying</h2>
          <p>This score is an editorial signal for comparison. It does not mean the shoe is the best choice for every runner.</p>
          <Link href="/en/methodology">Read the methodology</Link>
        </article>
      </section>

      <section>
        <div className="section-heading">
          <p className="eyebrow">Retailers</p>
          <h2>Verified prices</h2>
        </div>
        {offers.length ? (
          <div className="offers-list">
            {offers.map((offer) => (
              <div className="offer-row" key={offer.id}>
                <div>
                  <strong>{offer.retailer}</strong>
                  <span>{offer.availability.replaceAll("_", " ")}</span>
                </div>
                <strong>{formatEuro(offer.price)}</strong>
                <a href={offer.url}>View retailer</a>
              </div>
            ))}
          </div>
        ) : (
          <p>No verified retailer prices are available yet.</p>
        )}
      </section>
    </main>
  );
}
