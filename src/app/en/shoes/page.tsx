import Link from "next/link";
import { getEnrichedShoes } from "@/lib/data";
import { enLabels, formatEuro } from "@/app/en/copy";
import { ShoeVisual } from "@/components/ShoeVisual";

export const metadata = {
  title: "Running Shoes | Hardloopschoenvergelijken.nl",
  description: "Compare running shoes by use case, cushioning, support, fit, score and price."
};

export default function EnglishShoesPage() {
  const shoes = getEnrichedShoes();

  return (
    <main className="page-shoes">
      <section className="page-hero-with-visual page-hero-with-visual-compact image-hero image-hero-compare">
        <div>
          <p className="eyebrow">All running shoes</p>
          <h1>Compare running shoes</h1>
          <p className="lead">
            Browse the current catalog and compare use case, support, cushioning, fit, score and price.
          </p>
        </div>
      </section>

      <section aria-label="Shoes">
        <div className="result-toolbar">
          <div>
            <strong>{shoes.length}</strong> running shoes in the catalog
          </div>
          <span>Sorted by editorial score</span>
        </div>
        <div className="grid">
          {shoes.map((shoe) => (
            <article className="product-card" key={shoe.id}>
              <ShoeVisual shoe={shoe} />
              <div>
                <p className="eyebrow">{shoe.brand}</p>
                <h3>{shoe.fullName}</h3>
                <p>
                  {enLabels.shoeType[shoe.shoeType]} for {enLabels.surfaceType[shoe.surfaceType].toLowerCase()} running.
                </p>
              </div>
              <dl className="spec-grid">
                <div>
                  <dt>Type</dt>
                  <dd>{enLabels.shoeType[shoe.shoeType]}</dd>
                </div>
                <div>
                  <dt>Cushioning</dt>
                  <dd>{enLabels.level[shoe.cushioningLevel]}</dd>
                </div>
                <div>
                  <dt>Support</dt>
                  <dd>{enLabels.supportType[shoe.supportType]}</dd>
                </div>
                <div>
                  <dt>Fit</dt>
                  <dd>{enLabels.width[shoe.widthLabel]}</dd>
                </div>
              </dl>
              <div className="card-footer">
                <strong>Editorial score {shoe.editorialScore.overall.toFixed(1)}</strong>
                <span>{shoe.priceFrom === null ? formatEuro(null) : `From ${formatEuro(shoe.priceFrom)}`}</span>
                <Link href={`/en/shoes/${shoe.slug}`}>View shoe</Link>
              </div>
              <Link className="compare-link" href={`/en/compare?ids=${shoe.id}`}>
                Compare this shoe
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
