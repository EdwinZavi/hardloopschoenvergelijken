import Link from "next/link";
import { getEnrichedShoes } from "@/lib/data";
import { enLabels, formatEuro } from "@/app/en/copy";
import { ShoeVisual } from "@/components/ShoeVisual";
import type { EnrichedShoe } from "@/types/product";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const metadata = {
  title: "Compare Running Shoes | Hardloopschoenvergelijken.nl",
  description: "Choose 2 to 4 running shoes and compare fit, cushioning, support, score and price."
};

const comparisonRows: Array<{ label: string; getValue: (shoe: EnrichedShoe) => string }> = [
  { label: "Use case", getValue: (shoe) => enLabels.shoeType[shoe.shoeType] },
  { label: "Surface", getValue: (shoe) => enLabels.surfaceType[shoe.surfaceType] },
  { label: "Cushioning", getValue: (shoe) => enLabels.level[shoe.cushioningLevel] },
  { label: "Responsiveness", getValue: (shoe) => enLabels.level[shoe.responsivenessLevel] },
  { label: "Support", getValue: (shoe) => enLabels.supportType[shoe.supportType] },
  { label: "Fit width", getValue: (shoe) => enLabels.width[shoe.widthLabel] },
  { label: "Weight", getValue: (shoe) => `${shoe.weightGrams} g` },
  { label: "Drop", getValue: (shoe) => `${shoe.heelDropMm} mm` },
  { label: "Editorial score", getValue: (shoe) => shoe.editorialScore.overall.toFixed(1) },
  {
    label: "Price from",
    getValue: (shoe) => (shoe.priceFrom === null ? formatEuro(null) : formatEuro(shoe.priceFrom))
  }
];

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function strongestBy(shoes: EnrichedShoe[], selector: (shoe: EnrichedShoe) => number, direction: "high" | "low" = "high") {
  return [...shoes].sort((a, b) => {
    const diff = selector(a) - selector(b);
    return direction === "high" ? -diff : diff;
  })[0];
}

function highlightForEnglish(label: string, shoe: EnrichedShoe, shoes: EnrichedShoe[]) {
  const max = (selector: (item: EnrichedShoe) => number) => strongestBy(shoes, selector).id === shoe.id;
  const min = (selector: (item: EnrichedShoe) => number) => strongestBy(shoes, selector, "low").id === shoe.id;
  const hasAnyPrice = shoes.some((item) => item.priceFrom !== null);

  if (label === "Weight" && min((item) => item.weightGrams)) return "Lightest";
  if (label === "Price from" && hasAnyPrice && shoe.priceFrom !== null && min((item) => item.priceFrom ?? Number.MAX_SAFE_INTEGER)) return "Lowest price";
  if (label === "Editorial score" && max((item) => item.editorialScore.overall)) return "Highest score";
  if (label === "Support" && max((item) => item.editorialScore.stability)) return "Most stable";
  if (label === "Responsiveness" && max((item) => item.editorialScore.responsiveness)) return "Most direct";
  if (label === "Cushioning" && max((item) => item.editorialScore.cushioning)) return "Most cushioning";
  if (label === "Fit width" && (shoe.widthLabel === "wide" || shoe.fitProfile === "roomy")) return "Roomier";
  return undefined;
}

export default async function EnglishComparePage({ searchParams }: { searchParams: SearchParams }) {
  const shoes = getEnrichedShoes();
  const params = await searchParams;
  const ids = (firstValue(params.ids) ?? "").split(",").filter(Boolean).slice(0, 4);
  const selectedShoes = shoes.filter((shoe) => ids.includes(shoe.id)).slice(0, 4);

  return (
    <main className="page-compare">
      <section className="compare-picker-hero image-hero image-hero-compare">
        <div>
          <p className="eyebrow">Compare running shoes</p>
          <h1>Choose 2 to 4 shoes to compare</h1>
          <p className="lead">
            Put running shoes next to each other and compare the differences that matter for your goal, feet
            and budget.
          </p>
          <Link className="button secondary" href="/en/shoe-finder">
            Start the Shoe Finder
          </Link>
        </div>
      </section>

      {selectedShoes.length >= 2 ? (
        <section className="comparison-section">
          <div className="section-heading">
            <p className="eyebrow">Selected</p>
            <h2>Comparison table</h2>
          </div>
          <div className="comparison-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th scope="col">Characteristic</th>
                  {selectedShoes.map((shoe) => (
                    <th scope="col" key={shoe.id}>
                      <ShoeVisual shoe={shoe} size="compact" />
                      <span>{shoe.fullName}</span>
                      <Link href={`/en/shoes/${shoe.slug}`}>View shoe</Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {selectedShoes.map((shoe) => {
                      const highlightLabel = highlightForEnglish(row.label, shoe, selectedShoes);
                      return (
                        <td className={highlightLabel ? "highlight-cell" : undefined} key={shoe.id}>
                          {highlightLabel ? <span className="compare-badge">{highlightLabel}</span> : null}
                          {row.getValue(shoe)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="comparison-section">
          <div className="section-heading">
            <p className="eyebrow">Catalog</p>
            <h2>Select a shoe to start</h2>
          </div>
          <div className="grid">
            {shoes.slice(0, 12).map((shoe) => (
              <article className="product-card" key={shoe.id}>
                <ShoeVisual shoe={shoe} />
                <p className="eyebrow">{shoe.brand}</p>
                <h3>{shoe.fullName}</h3>
                <p>{enLabels.shoeType[shoe.shoeType]} with {enLabels.level[shoe.cushioningLevel].toLowerCase()} cushioning and {enLabels.supportType[shoe.supportType].toLowerCase()}.</p>
                <Link className="compare-link" href={`/en/compare?ids=${shoe.id}`}>
                  Select for comparison
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
