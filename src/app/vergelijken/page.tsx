import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { ShoeVisual } from "@/components/ShoeVisual";
import { getEnrichedShoes } from "@/lib/data";
import { formatPrice, labels } from "@/lib/labels";
import type { EnrichedShoe } from "@/types/product";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseIds(searchParams: Record<string, string | string[] | undefined>) {
  return (firstValue(searchParams.ids) ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function removeHref(shoes: EnrichedShoe[], removeId: string) {
  const ids = shoes.filter((shoe) => shoe.id !== removeId).map((shoe) => shoe.id);
  return ids.length ? `/vergelijken?ids=${ids.join(",")}` : "/vergelijken";
}

function addCompareHref(selectedIds: string[], shoeId: string) {
  const ids = [...selectedIds.filter((id) => id !== shoeId), shoeId].slice(0, 4);
  return `/vergelijken?ids=${ids.join(",")}`;
}

function removeCompareHref(selectedIds: string[], shoeId: string) {
  const ids = selectedIds.filter((id) => id !== shoeId);
  return ids.length ? `/vergelijken?ids=${ids.join(",")}` : "/vergelijken";
}

function strongestBy(shoes: EnrichedShoe[], selector: (shoe: EnrichedShoe) => number, direction: "high" | "low" = "high") {
  return [...shoes].sort((a, b) => {
    const diff = selector(a) - selector(b);
    return direction === "high" ? -diff : diff;
  })[0];
}

function compareLabel(shoe: EnrichedShoe) {
  return `${shoe.brand} ${shoe.model} ${shoe.version}`;
}

function adviceForShoe(shoe: EnrichedShoe) {
  const cues = [];

  if (shoe.supportType === "stability" || shoe.editorialScore.stability >= 8.5) {
    cues.push("je extra steun wilt");
  }
  if (shoe.cushioningLevel === "high" && shoe.editorialScore.comfort >= 8.5) {
    cues.push("je zacht en beschermd wilt lopen");
  }
  if (shoe.responsivenessLevel === "high" || shoe.editorialScore.responsiveness >= 8.5) {
    cues.push("je sneller wilt lopen");
  }
  if (shoe.widthLabel === "wide" || shoe.fitProfile === "roomy") {
    cues.push("je meer ruimte voor je voeten wilt");
  }
  if ((shoe.priceFrom ?? Number.MAX_SAFE_INTEGER) <= 160 && shoe.editorialScore.valueForMoney >= 7.8) {
    cues.push("je veel kwaliteit voor je budget zoekt");
  }
  if (shoe.shoeType === "trail") {
    cues.push("je vooral op onverharde paden loopt");
  }

  return cues.slice(0, 2);
}

function getDecisionAdvice(shoes: EnrichedShoe[]) {
  return shoes.map((shoe) => {
    const cues = adviceForShoe(shoe);
    return {
      shoe,
      title: cues.length ? `Past goed als ${cues.join(" en ")}` : "Past goed als je een veelzijdige trainingsschoen zoekt",
      tradeoff: shoe.editorialVerdict.lessSuitableFor
    };
  });
}

function highlightFor(label: string, shoe: EnrichedShoe, shoes: EnrichedShoe[]) {
  const max = (selector: (item: EnrichedShoe) => number) => strongestBy(shoes, selector).id === shoe.id;
  const min = (selector: (item: EnrichedShoe) => number) => strongestBy(shoes, selector, "low").id === shoe.id;
  const hasAnyPrice = shoes.some((item) => item.priceFrom !== null);

  if (label === "Gewicht" && min((item) => item.weightGrams)) return "Lichtste";
  if (label === "Prijs vanaf" && hasAnyPrice && shoe.priceFrom !== null && min((item) => item.priceFrom ?? Number.MAX_SAFE_INTEGER)) return "Laagste prijs";
  if (label === "Voorlopige score" && max((item) => item.editorialScore.overall)) return "Hoogste score";
  if (label === "Steun" && max((item) => item.editorialScore.stability)) return "Meest stabiel";
  if (label === "Gevoel bij tempo" && max((item) => item.editorialScore.responsiveness)) return "Beste tempo-gevoel";
  if (label === "Demping" && max((item) => item.editorialScore.cushioning)) return "Meeste demping";
  if (label === "Pasvorm" && (shoe.widthLabel === "wide" || shoe.fitProfile === "roomy")) return "Ruimer";
  return undefined;
}

export default async function ComparePage({ searchParams }: { searchParams: SearchParams }) {
  const ids = parseIds(await searchParams);
  const allShoes = getEnrichedShoes();
  const shoes = allShoes.filter((shoe) => ids.includes(shoe.id));
  const selectableShoes = [
    ...shoes,
    ...allShoes.filter((shoe) => !ids.includes(shoe.id))
  ];

  if (shoes.length < 2) {
    return (
      <main className="page-compare">
        <section className="compare-picker-hero">
          <div>
            <p className="eyebrow">Schoenen vergelijken</p>
            <h1>Kies 2 tot 4 schoenen om te vergelijken</h1>
            <p className="lead">
              Zet hardloopschoenen naast elkaar en zie snel welke beter past bij jouw doel, voeten en budget.
            </p>
          </div>
          <Link className="button secondary" href="/keuzehulp">
            Start de keuzehulp
          </Link>
        </section>

        <section className="compare-picker">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Kies je vergelijking</p>
              <h2>Alle hardloopschoenen</h2>
              <p>Selecteer minimaal 2 en maximaal 4 schoenen. Daarna zetten we de belangrijkste verschillen naast elkaar.</p>
            </div>
          </div>
          <CompareSelectionBar selectedShoes={shoes} />
          <div className="grid">
            {selectableShoes.map((shoe) => {
              const isSelected = ids.includes(shoe.id);
              return (
                <ProductCard
                  compareHref={isSelected ? removeCompareHref(ids, shoe.id) : addCompareHref(ids, shoe.id)}
                  compareLabel={isSelected ? "Haal uit vergelijking" : "+ Vergelijk"}
                  key={shoe.id}
                  shoe={shoe}
                />
              );
            })}
          </div>
        </section>
      </main>
    );
  }

  const lightest = strongestBy(shoes, (shoe) => shoe.weightGrams, "low");
  const hasPriceData = shoes.some((shoe) => shoe.priceFrom !== null);
  const cheapest = hasPriceData ? strongestBy(shoes, (shoe) => shoe.priceFrom ?? Number.MAX_SAFE_INTEGER, "low") : null;
  const mostStable = strongestBy(shoes, (shoe) => shoe.editorialScore.stability);
  const mostResponsive = strongestBy(shoes, (shoe) => shoe.editorialScore.responsiveness);
  const bestValue = strongestBy(shoes, (shoe) => shoe.editorialScore.valueForMoney);
  const decisionAdvice = getDecisionAdvice(shoes);

  return (
    <main className="page-compare">
      <section className="compare-result-hero">
        <p className="eyebrow">Hardloopschoenen vergelijken</p>
        <h1>Vergelijking van {shoes.length} hardloopschoenen</h1>
        <p className="lead">
          {shoes.map(compareLabel).join(" vs ")}. Vergelijk comfort, steun, pasvorm, gewicht en prijs naast elkaar. Zo zie je sneller welke hardloopschoen het beste aansluit op jouw manier van lopen.
        </p>
      </section>

      <section className="difference-grid" aria-label="Belangrijkste verschillen">
        <DifferenceCard label="Lichtste schoen" shoe={lightest} value={`${lightest.weightGrams} gram`} />
        {cheapest ? <DifferenceCard label="Laagste prijs" shoe={cheapest} value={`vanaf ${formatPrice(cheapest.priceFrom)}`} /> : <DifferenceCard label="Prijsvergelijking" value="Nog geen gecontroleerde prijzen" />}
        <DifferenceCard label="Meeste steun" shoe={mostStable} value={mostStable.editorialScore.stability.toFixed(1)} />
        <DifferenceCard label="Meest geschikt voor tempo" shoe={mostResponsive} value={mostResponsive.editorialScore.responsiveness.toFixed(1)} />
        <DifferenceCard label="Beste prijs-kwaliteit" shoe={bestValue} value={bestValue.editorialScore.valueForMoney.toFixed(1)} />
      </section>

      <section className="decision-panel" aria-label="Advies per situatie">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Snelle uitleg</p>
            <h2>Wanneer kies je welke schoen?</h2>
          </div>
        </div>
        <div className="decision-grid">
          {decisionAdvice.map((item) => (
            <article className="decision-card" key={item.shoe.id}>
              <p className="eyebrow">{item.shoe.brand}</p>
              <h3>{item.shoe.fullName}</h3>
              <strong>{item.title}</strong>
              <p>Let op: {item.tradeoff}</p>
              <Link href={`/schoenen/${item.shoe.slug}`}>Bekijk uitleg bij deze schoen</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="comparison-wrap" aria-label="Vergelijkingstabel">
        <table className="comparison-table">
          <thead>
            <tr>
              <th scope="col">Kenmerk</th>
              {shoes.map((shoe) => (
                <th scope="col" key={shoe.id}>
                  <ShoeVisual shoe={shoe} size="compact" />
                  <span>{shoe.fullName}</span>
                  <Link href={`/schoenen/${shoe.slug}`}>Bekijk schoen</Link>
                  <Link href={removeHref(shoes, shoe.id)}>Verwijder</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <CompareRow label="Best voor" shoes={shoes} render={(shoe) => shoe.editorialVerdict.bestFor} />
            <CompareRow label="Minder geschikt voor" shoes={shoes} render={(shoe) => shoe.editorialVerdict.lessSuitableFor} />
            <CompareRow label="Type" shoes={shoes} render={(shoe) => labels.shoeType[shoe.shoeType]} />
            <CompareRow label="Ondergrond" shoes={shoes} render={(shoe) => labels.surfaceType[shoe.surfaceType]} />
            <CompareRow highlight label="Steun" shoes={shoes} render={(shoe) => labels.supportType[shoe.supportType]} />
            <CompareRow highlight label="Demping" shoes={shoes} render={(shoe) => labels.level[shoe.cushioningLevel]} />
            <CompareRow highlight label="Gevoel bij tempo" shoes={shoes} render={(shoe) => labels.level[shoe.responsivenessLevel]} />
            <CompareRow highlight label="Pasvorm" shoes={shoes} render={(shoe) => labels.width[shoe.widthLabel]} />
            <CompareRow highlight label="Gewicht" shoes={shoes} render={(shoe) => `${shoe.weightGrams} gram`} />
            <CompareRow label="Drop" shoes={shoes} render={(shoe) => `${shoe.heelDropMm} mm`} />
            <CompareRow label="Carbonplaat" shoes={shoes} render={(shoe) => (shoe.hasCarbonPlate ? "Ja" : "Nee")} />
            <CompareRow label="Waterdicht" shoes={shoes} render={(shoe) => (shoe.isWaterproof ? "Ja" : "Nee")} />
            <CompareRow highlight label="Voorlopige score" shoes={shoes} render={(shoe) => shoe.editorialScore.overall.toFixed(1)} />
            <CompareRow highlight label="Prijs vanaf" shoes={shoes} render={(shoe) => formatPrice(shoe.priceFrom)} />
          </tbody>
        </table>
      </section>

      <div className="compare-actions">
        <Link className="button secondary" href={`/schoenen?compare=${shoes.map((shoe) => shoe.id).join(",")}`}>
          Terug naar gekozen schoenen
        </Link>
        <Link className="button" href="/schoenen">
          Nieuwe vergelijking maken
        </Link>
      </div>

      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Vergelijking aanpassen</p>
            <h2>Alle hardloopschoenen</h2>
            <p>Voeg een andere schoen toe of haal een gekozen model uit je vergelijking. Je kunt maximaal 4 schoenen tegelijk vergelijken.</p>
          </div>
          <span className="compare-hint">{ids.length} van 4 gekozen</span>
        </div>
        <CompareSelectionBar selectedShoes={shoes} />
        <div className="grid">
          {selectableShoes.map((shoe) => {
            const isSelected = ids.includes(shoe.id);
            const limitReached = ids.length >= 4 && !isSelected;
            return (
              <ProductCard
                compareDisabled={limitReached}
                compareHref={limitReached ? `/vergelijken?ids=${ids.join(",")}` : isSelected ? removeCompareHref(ids, shoe.id) : addCompareHref(ids, shoe.id)}
                compareLabel={isSelected ? "Haal uit vergelijking" : limitReached ? "Maximaal 4 schoenen" : "+ Vergelijk"}
                key={shoe.id}
                shoe={shoe}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}

function CompareSelectionBar({ selectedShoes }: { selectedShoes: EnrichedShoe[] }) {
  const count = selectedShoes.length;

  return (
    <section className="compare-selection-bar" aria-label="Vergelijkselectie">
      <div>
        <strong>{count < 2 ? "Kies nog minimaal 1 schoen" : `${count} schoenen gekozen`}</strong>
        <p>{count ? selectedShoes.map((shoe) => shoe.fullName).join(", ") : "Nog geen schoenen gekozen."}</p>
      </div>
      <div>
        <span>{count} van 4 gekozen</span>
        {count ? (
          <Link className="button secondary" href="/vergelijken">
            Keuze wissen
          </Link>
        ) : null}
      </div>
    </section>
  );
}

function DifferenceCard({ label, shoe, value }: { label: string; shoe?: EnrichedShoe; value: string }) {
  return (
    <article className="panel">
      <p className="eyebrow">{label}</p>
      <h2>{shoe ? shoe.fullName : "Prijsdata in voorbereiding"}</h2>
      <strong>{value}</strong>
    </article>
  );
}

function CompareRow({
  highlight,
  label,
  render,
  shoes
}: {
  highlight?: boolean;
  label: string;
  render: (shoe: EnrichedShoe) => string;
  shoes: EnrichedShoe[];
}) {
  return (
    <tr>
      <th scope="row">{label}</th>
      {shoes.map((shoe) => {
        const highlightLabel = highlight ? highlightFor(label, shoe, shoes) : undefined;
        return (
          <td className={highlightLabel ? "highlight-cell" : undefined} key={shoe.id}>
            {highlightLabel ? <span className="compare-badge">{highlightLabel}</span> : null}
            {render(shoe)}
          </td>
        );
      })}
    </tr>
  );
}
