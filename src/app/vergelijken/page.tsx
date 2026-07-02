import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { CompareShoePickerItem } from "@/components/CompareShoePickerItem";
import { ShoeVisual } from "@/components/ShoeVisual";
import { getEnrichedShoes } from "@/lib/data";
import { formatPrice, labels, scoreStatusLabels } from "@/lib/labels";
import type { EnrichedShoe } from "@/types/product";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const metadata: Metadata = {
  title: "Hardloopschoenen naast elkaar vergelijken | Scores, pasvorm en prijs",
  description:
    "Zet 2 tot 4 hardloopschoenen naast elkaar en vergelijk comfort, steun, pasvorm, gewicht, prijsstatus en de nadelen per model.",
  alternates: {
    canonical: "/vergelijken"
  }
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseIds(searchParams: Record<string, string | string[] | undefined>) {
  return (firstValue(searchParams.ids) ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
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

const presetComparisons = [
  {
    label: "Beginners",
    title: "Start met veelzijdige trainingsschoenen",
    description: "Vergelijk rustige, toegankelijke modellen met verschillende niveaus van demping en steun.",
    ids: ["nike-pegasus-41", "hoka-clifton-9", "brooks-ghost-16"]
  },
  {
    label: "Stabiliteit",
    title: "Extra steun naast elkaar",
    description: "Zie het verschil tussen duidelijke stabiliteit, lichte steun en een stabiele dagelijkse schoen.",
    ids: ["asics-gel-kayano-31", "brooks-adrenaline-gts-24", "hoka-arahi-7", "asics-gt-2000-13"]
  },
  {
    label: "Trail",
    title: "Trailschoenen voor onverharde routes",
    description: "Vergelijk grip, bescherming en comfort voor bospaden, gravel en technische stukken.",
    ids: ["hoka-speedgoat-6", "nike-zegama-2", "brooks-cascadia-18"]
  },
  {
    label: "Tempo",
    title: "Sneller trainen of racen",
    description: "Zet tempo- en wedstrijdmodellen naast elkaar zonder direct één winnaar aan te wijzen.",
    ids: ["saucony-endorphin-speed-4", "adidas-adizero-boston-12", "new-balance-fuelcell-rebel-v4", "nike-vaporfly-3"]
  }
];

function presetHref(ids: string[]) {
  return `/vergelijken?ids=${ids.join(",")}`;
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
      title: cues.length ? `Kies deze als ${cues.join(" en ")}` : "Kies deze als je een veelzijdige trainingsschoen zoekt",
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
  if (label === "Redactionele score" && max((item) => item.editorialScore.overall)) return "Hoogste score";
  if (label === "Steun" && max((item) => item.editorialScore.stability)) return "Meest stabiel";
  if (label === "Gevoel bij tempo" && max((item) => item.editorialScore.responsiveness)) return "Meest direct";
  if (label === "Demping" && max((item) => item.editorialScore.cushioning)) return "Meeste demping";
  if (label === "Pasvorm" && (shoe.widthLabel === "wide" || shoe.fitProfile === "roomy")) return "Ruimer";
  return undefined;
}

export default async function ComparePage({ searchParams }: { searchParams: SearchParams }) {
  const rawIds = parseIds(await searchParams);
  const allShoes = getEnrichedShoes();
  const shoesById = new Map(allShoes.map((shoe) => [shoe.id, shoe]));
  const ids = [...new Set(rawIds)].filter((id) => shoesById.has(id)).slice(0, 4);
  const shoes = ids.map((id) => shoesById.get(id)).filter((shoe): shoe is EnrichedShoe => Boolean(shoe));
  const selectableShoes = [
    ...shoes,
    ...allShoes.filter((shoe) => !ids.includes(shoe.id))
  ];

  if (shoes.length < 2) {
    return (
      <main className="page-compare">
        <section className="compare-picker-hero image-hero image-hero-compare">
          <div>
            <p className="eyebrow">Schoenen vergelijken</p>
            <h1>Kies 2 tot 4 schoenen om te vergelijken</h1>
            <p className="lead">
              Zet hardloopschoenen naast elkaar en vergelijk doel, pasvorm, steunbehoefte en prijsinformatie. Weet je nog niet waar je moet beginnen, start dan met een voorbeeldset.
            </p>
          </div>
          <Link className="button secondary" href="/keuzehulp">
            Start de keuzehulp
          </Link>
        </section>

        <section className="compare-lab-strip" aria-label="Hoe vergelijken werkt">
          <article>
            <span>01</span>
            <strong>Kies een set</strong>
            <p>Begin met een doelgroep of selecteer zelf modellen uit de catalogus.</p>
          </article>
          <article>
            <span>02</span>
            <strong>Lees de trade-offs</strong>
            <p>Een hoge score telt pas als pasvorm, steun en gebruik logisch blijven.</p>
          </article>
          <article>
            <span>03</span>
            <strong>Controleer prijs apart</strong>
            <p>Prijsinformatie verandert de redactionele beoordeling niet.</p>
          </article>
        </section>

        <section className="decision-panel" aria-label="Voorgestelde vergelijkingen">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Snelle start</p>
              <h2>Begin met een voorgestelde set</h2>
              <p>Kies een richting als je nog geen modellen op je shortlist hebt. Daarna kun je schoenen toevoegen of verwijderen.</p>
            </div>
            <Link className="button secondary" href="/keuzehulp">
              Ik weet mijn set nog niet
            </Link>
          </div>
          <div className="decision-grid">
            {presetComparisons.map((preset) => (
              <article className="decision-card" key={preset.label}>
                <p className="eyebrow">{preset.label}</p>
                <h3>{preset.title}</h3>
                <p>{preset.description}</p>
                <Link href={presetHref(preset.ids)}>Vergelijk deze set</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="compare-picker">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Kies je vergelijking</p>
              <h2>Alle hardloopschoenen</h2>
              <p>Selecteer minimaal 2 en maximaal 4 schoenen. Gebruik de keuzehulp als je eerst wilt bepalen welk type schoen je nodig hebt.</p>
            </div>
            <Link className="button secondary" href="/keuzehulp">
              Naar keuzehulp
            </Link>
          </div>
          <CompareSelectionBar selectedShoes={shoes} />
          <div className="compare-picker-grid">
            {selectableShoes.map((shoe) => {
              const isSelected = ids.includes(shoe.id);
              const limitReached = ids.length >= 4 && !isSelected;
              return (
                <CompareShoePickerItem
                  compareHref={limitReached ? `/vergelijken?ids=${ids.join(",")}` : isSelected ? removeCompareHref(ids, shoe.id) : addCompareHref(ids, shoe.id)}
                  compareLabel={isSelected ? "Haal uit vergelijking" : limitReached ? "Maximaal 4 schoenen" : "+ Vergelijk"}
                  isSelected={isSelected}
                  key={shoe.id}
                  limitReached={limitReached}
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
  const hasMissingPriceData = shoes.some((shoe) => shoe.priceFrom === null);
  const cheapest = hasPriceData ? strongestBy(shoes, (shoe) => shoe.priceFrom ?? Number.MAX_SAFE_INTEGER, "low") : null;
  const mostStable = strongestBy(shoes, (shoe) => shoe.editorialScore.stability);
  const mostResponsive = strongestBy(shoes, (shoe) => shoe.editorialScore.responsiveness);
  const bestValue = strongestBy(shoes, (shoe) => shoe.editorialScore.valueForMoney);
  const decisionAdvice = getDecisionAdvice(shoes);

  return (
    <main className="page-compare">
      <section className="compare-result-hero compare-tool-hero image-hero image-hero-compare">
        <div>
          <p className="eyebrow">Hardloopschoenen vergelijken</p>
          <h1>Vergelijking van {shoes.length} hardloopschoenen</h1>
          <p className="lead">
            {shoes.map(compareLabel).join(" vs ")}. Vergelijk comfort, steun, pasvorm, gewicht en prijs naast elkaar. Zo zie je welke schoen het best aansluit op jouw training.
          </p>
        </div>
      </section>

      <CompareSelectionBar selectedShoes={shoes} />

      <section className="compare-lab-strip compare-lab-strip-live" aria-label="Vergelijkingsstatus">
        <article>
          <span>Set</span>
          <strong>{shoes.length} schoenen</strong>
          <p>{shoes.map((shoe) => shoe.brand).join(" · ")}</p>
        </article>
        <article>
          <span>Focus</span>
          <strong>Trade-offs</strong>
          <p>Vergelijk niet op één winnaar, maar op wat jij accepteert.</p>
        </article>
        <article>
          <span>Prijs</span>
          <strong>{hasPriceData ? "Beschikbaar" : "In voorbereiding"}</strong>
          <p>Prijs en redactionele score blijven gescheiden.</p>
        </article>
      </section>

      <section className="difference-grid" aria-label="Belangrijkste verschillen">
        <DifferenceCard label="Lichtste schoen" shoe={lightest} value={`${lightest.weightGrams} gram`} />
        {cheapest ? <DifferenceCard label="Laagste prijs" shoe={cheapest} value={`vanaf ${formatPrice(cheapest.priceFrom)}`} /> : <DifferenceCard label="Prijsvergelijking" value="Nog geen gecontroleerde prijzen" />}
        <DifferenceCard label="Meeste steun" shoe={mostStable} value={mostStable.editorialScore.stability.toFixed(1)} />
        <DifferenceCard label="Meest direct bij tempo" shoe={mostResponsive} value={mostResponsive.editorialScore.responsiveness.toFixed(1)} />
        <DifferenceCard label="Sterke prijs-kwaliteit" shoe={bestValue} value={bestValue.editorialScore.valueForMoney.toFixed(1)} />
      </section>

      <p className="mobile-scroll-hint">Veeg horizontaal om alle schoenen en kenmerken te vergelijken.</p>
      <section className="comparison-wrap" aria-label="Vergelijkingstabel">
        <table className="comparison-table">
          <caption>
            Prijsinformatie telt pas mee wanneer gecontroleerde offerdata beschikbaar is. Scores en prijs blijven gescheiden.
          </caption>
          <thead>
            <tr>
              <th scope="col">Kenmerk</th>
              {shoes.map((shoe) => (
                <th scope="col" key={shoe.id}>
                  <span className="compare-table-media">
                    {shoe.imageUrl ? (
                      <Image alt="" fill sizes="(max-width: 820px) 46vw, 180px" src={shoe.imageUrl} />
                    ) : (
                      <ShoeVisual shoe={shoe} size="compact" />
                    )}
                  </span>
                  <span>{shoe.fullName}</span>
                  <Link href={`/schoenen/${shoe.slug}`}>Bekijk schoen</Link>
                  <Link href={removeHref(shoes, shoe.id)}>Verwijder</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <CompareGroupHeading colSpan={shoes.length + 1} label="Keuze" />
            <CompareRow label="Past vooral bij" shoes={shoes} render={(shoe) => shoe.editorialVerdict.bestFor} />
            <CompareRow label="Minder geschikt voor" shoes={shoes} render={(shoe) => shoe.editorialVerdict.lessSuitableFor} />
            <CompareRow label="Type" shoes={shoes} render={(shoe) => labels.shoeType[shoe.shoeType]} />
            <CompareRow label="Ondergrond" shoes={shoes} render={(shoe) => labels.surfaceType[shoe.surfaceType]} />
            <CompareGroupHeading colSpan={shoes.length + 1} label="Pasvorm" />
            <CompareRow highlight label="Steun" shoes={shoes} render={(shoe) => labels.supportType[shoe.supportType]} />
            <CompareRow highlight label="Pasvorm" shoes={shoes} render={(shoe) => labels.width[shoe.widthLabel]} />
            <CompareGroupHeading colSpan={shoes.length + 1} label="Loopgevoel" />
            <CompareRow highlight label="Demping" shoes={shoes} render={(shoe) => labels.level[shoe.cushioningLevel]} />
            <CompareRow highlight label="Gevoel bij tempo" shoes={shoes} render={(shoe) => labels.level[shoe.responsivenessLevel]} />
            <CompareGroupHeading colSpan={shoes.length + 1} label="Specs" />
            <CompareRow highlight label="Gewicht" shoes={shoes} render={(shoe) => `${shoe.weightGrams} gram`} />
            <CompareRow label="Drop" shoes={shoes} render={(shoe) => `${shoe.heelDropMm} mm`} />
            <CompareRow label="Carbonplaat" shoes={shoes} render={(shoe) => (shoe.hasCarbonPlate ? "Ja" : "Nee")} />
            <CompareRow label="Waterdicht" shoes={shoes} render={(shoe) => (shoe.isWaterproof ? "Ja" : "Nee")} />
            <CompareGroupHeading colSpan={shoes.length + 1} label="Score" />
            <CompareRow highlight label="Redactionele score" shoes={shoes} render={(shoe) => shoe.editorialScore.overall.toFixed(1)} />
            <CompareRow label="Scorestatus" shoes={shoes} render={(shoe) => scoreStatusLabels[shoe.scoreStatus]} />
            <CompareGroupHeading colSpan={shoes.length + 1} label="Prijs" />
            <CompareRow highlight={hasPriceData} label="Prijs vanaf" shoes={shoes} render={(shoe) => formatPrice(shoe.priceFrom)} />
            {hasMissingPriceData ? (
              <tr>
                <th scope="row">Prijsstatus</th>
                <td colSpan={shoes.length}>Een of meer schoenen missen gecontroleerde retailerprijzen. Laat prijs nu niet de doorslag geven.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>

      <section className="decision-panel" aria-label="Advies per situatie">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Snelle uitleg</p>
            <h2>Wanneer kies je welke schoen?</h2>
            <p>Kies geen winnaar op score alleen. Kijk eerst welk nadeel je accepteert bij jouw training, voet en ondergrond.</p>
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

      <div className="compare-actions">
        <Link className="button secondary" href={`/schoenen?compare=${shoes.map((shoe) => shoe.id).join(",")}`}>
          Terug naar gekozen schoenen
        </Link>
        <Link className="button" href="/schoenen">
          Nieuwe vergelijking maken
        </Link>
      </div>

      <section className="compare-adjust-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Vergelijking aanpassen</p>
            <h2>Alle hardloopschoenen</h2>
            <p>Voeg een schoen toe of haal een gekozen model uit de vergelijking. Je kunt maximaal 4 schoenen tegelijk vergelijken.</p>
          </div>
          <span className="compare-hint">{ids.length} van 4 gekozen</span>
        </div>
        <CompareSelectionBar selectedShoes={shoes} />
        <div className="compare-picker-grid">
          {selectableShoes.map((shoe) => {
            const isSelected = ids.includes(shoe.id);
            const limitReached = ids.length >= 4 && !isSelected;
            return (
              <CompareShoePickerItem
                compareHref={limitReached ? `/vergelijken?ids=${ids.join(",")}` : isSelected ? removeCompareHref(ids, shoe.id) : addCompareHref(ids, shoe.id)}
                compareLabel={isSelected ? "Haal uit vergelijking" : limitReached ? "Maximaal 4 schoenen" : "+ Vergelijk"}
                isSelected={isSelected}
                key={shoe.id}
                limitReached={limitReached}
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
        <p className="compare-selection-summary">
          {count ? selectedShoes.map((shoe) => shoe.fullName).join(", ") : "Nog geen schoenen gekozen. Start met een voorbeeldset of gebruik de keuzehulp."}
        </p>
      </div>
      <div>
        <span>{count} van 4 gekozen · maximaal 4</span>
        {count ? (
          <Link className="button secondary" href="/vergelijken">
            Keuze wissen
          </Link>
        ) : (
          <Link className="button secondary" href="/keuzehulp">
            Naar keuzehulp
          </Link>
        )}
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

function CompareGroupHeading({ colSpan, label }: { colSpan: number; label: string }) {
  return (
    <tr>
      <th colSpan={colSpan} scope="colgroup">{label}</th>
    </tr>
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
