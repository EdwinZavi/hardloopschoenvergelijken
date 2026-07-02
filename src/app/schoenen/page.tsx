import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AutoSubmitFilterForm } from "@/components/AutoSubmitFilterForm";
import { ProductCard } from "@/components/ProductCard";
import { brands, getEnrichedShoes } from "@/lib/data";
import { formatPrice, labels } from "@/lib/labels";
import type { EnrichedShoe, Level, ShoeType, SupportType, SurfaceType, WidthLabel } from "@/types/product";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const primaryUseCases = ["beginner_daily", "daily_trainer", "recovery", "tempo", "race", "trail"] as const;
const distanceBuckets = ["all_round", "5k_10k", "5k_half_marathon", "5k_marathon", "10k_marathon", "half_marathon_plus", "10k_ultra"] as const;
const surfaceTypes = ["road", "trail"] as const;
const shoeTypes = ["daily_trainer", "stability", "tempo", "race", "trail", "recovery"] as const;
const supportTypes = ["neutral", "light_stability", "stability"] as const;
const levels = ["low", "medium", "high"] as const;
const widthLabels = ["narrow", "regular", "wide"] as const;
const sortValues = ["editorial", "price", "weight", "value"] as const;

export const metadata: Metadata = {
  title: "Hardloopschoenen vergelijken | Filters voor pasvorm, steun en prijs",
  description:
    "Filter hardloopschoenen op afstand, ondergrond, steun, demping, pasvorm en score. Prijs telt pas mee wanneer winkeldata is gecontroleerd.",
  alternates: {
    canonical: "/schoenen"
  }
};

type Filters = {
  brand?: string;
  primaryUseCase?: (typeof primaryUseCases)[number];
  distanceBucket?: (typeof distanceBuckets)[number];
  surfaceType?: SurfaceType;
  shoeType?: ShoeType;
  supportType?: SupportType;
  cushioningLevel?: Level;
  widthLabel?: WidthLabel;
  maxPrice?: number;
  minScore?: number;
  hasCarbonPlate?: boolean;
  isWaterproof?: boolean;
  sort: "editorial" | "price" | "weight" | "value";
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseNumber(value: string | string[] | undefined, min: number, max: number) {
  const parsed = Number(firstValue(value));
  return Number.isFinite(parsed) && parsed >= min && parsed <= max ? parsed : undefined;
}

function pickAllowed<T extends readonly string[]>(value: string | string[] | undefined, allowed: T): T[number] | undefined {
  const nextValue = firstValue(value);
  return nextValue && allowed.includes(nextValue) ? nextValue : undefined;
}

function parseFilters(searchParams: Record<string, string | string[] | undefined>): Filters {
  return {
    brand: pickAllowed(searchParams.brand, brands.map((brand) => brand.id)),
    primaryUseCase: pickAllowed(searchParams.primaryUseCase, primaryUseCases),
    distanceBucket: pickAllowed(searchParams.distanceBucket, distanceBuckets),
    surfaceType: pickAllowed(searchParams.surfaceType, surfaceTypes),
    shoeType: pickAllowed(searchParams.shoeType, shoeTypes),
    supportType: pickAllowed(searchParams.supportType, supportTypes),
    cushioningLevel: pickAllowed(searchParams.cushioningLevel, levels),
    widthLabel: pickAllowed(searchParams.widthLabel, widthLabels),
    maxPrice: parseNumber(searchParams.maxPrice, 1, 1000),
    minScore: parseNumber(searchParams.minScore, 0, 10),
    hasCarbonPlate: firstValue(searchParams.hasCarbonPlate) === "true" ? true : undefined,
    isWaterproof: firstValue(searchParams.isWaterproof) === "true" ? true : undefined,
    sort: pickAllowed(searchParams.sort, sortValues) ?? "editorial"
  };
}

function parseCompareIds(searchParams: Record<string, string | string[] | undefined>) {
  return (firstValue(searchParams.compare) ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

function applyFilters(shoes: EnrichedShoe[], filters: Filters) {
  return shoes.filter((shoe) => {
    if (filters.brand && shoe.brandId !== filters.brand) return false;
    if (filters.primaryUseCase && shoe.primaryUseCase !== filters.primaryUseCase) return false;
    if (filters.distanceBucket && shoe.distanceBucket !== filters.distanceBucket) return false;
    if (filters.surfaceType && shoe.surfaceType !== filters.surfaceType) return false;
    if (filters.shoeType && shoe.shoeType !== filters.shoeType) return false;
    if (filters.supportType && shoe.supportType !== filters.supportType) return false;
    if (filters.cushioningLevel && shoe.cushioningLevel !== filters.cushioningLevel) return false;
    if (filters.widthLabel && shoe.widthLabel !== filters.widthLabel) return false;
    if (filters.hasCarbonPlate && !shoe.hasCarbonPlate) return false;
    if (filters.isWaterproof && !shoe.isWaterproof) return false;
    if (filters.maxPrice && (shoe.priceFrom === null || shoe.priceFrom > filters.maxPrice)) return false;
    if (filters.minScore && shoe.editorialScore.overall < filters.minScore) return false;
    return true;
  });
}

function sortShoes(shoes: EnrichedShoe[], sort: Filters["sort"]) {
  return [...shoes].sort((a, b) => {
    if (sort === "price") return (a.priceFrom ?? Number.MAX_SAFE_INTEGER) - (b.priceFrom ?? Number.MAX_SAFE_INTEGER);
    if (sort === "weight") return a.weightGrams - b.weightGrams;
    if (sort === "value") return b.editorialScore.valueForMoney - a.editorialScore.valueForMoney;
    return b.editorialScore.overall - a.editorialScore.overall;
  });
}

function makeHref(filters: Filters, removeKey?: keyof Filters, compareIds: string[] = []) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (key === removeKey || value === undefined || value === "" || value === false) return;
    if (key === "sort" && value === "editorial") return;
    params.set(key, String(value));
  });
  if (compareIds.length) params.set("compare", compareIds.join(","));
  const query = params.toString();
  return query ? `/schoenen?${query}` : "/schoenen";
}

function makeCompareToggleHref(filters: Filters, selectedIds: string[], shoeId: string) {
  const isSelected = selectedIds.includes(shoeId);
  const nextIds = isSelected ? selectedIds.filter((id) => id !== shoeId) : [...selectedIds, shoeId].slice(0, 4);
  return makeHref(filters, undefined, nextIds);
}

function getActiveFilters(filters: Filters) {
  const active: { key: keyof Filters; label: string }[] = [];
  if (filters.brand) active.push({ key: "brand", label: `Merk: ${brands.find((brand) => brand.id === filters.brand)?.name ?? filters.brand}` });
  if (filters.primaryUseCase) active.push({ key: "primaryUseCase", label: `Gebruik: ${labels.primaryUseCase[filters.primaryUseCase]}` });
  if (filters.distanceBucket) active.push({ key: "distanceBucket", label: `Afstand: ${labels.distanceBucket[filters.distanceBucket]}` });
  if (filters.surfaceType) active.push({ key: "surfaceType", label: `Ondergrond: ${labels.surfaceType[filters.surfaceType]}` });
  if (filters.shoeType) active.push({ key: "shoeType", label: `Soort: ${labels.shoeType[filters.shoeType]}` });
  if (filters.supportType) active.push({ key: "supportType", label: `Steun: ${labels.supportType[filters.supportType]}` });
  if (filters.cushioningLevel) active.push({ key: "cushioningLevel", label: `Demping: ${labels.level[filters.cushioningLevel]}` });
  if (filters.widthLabel) active.push({ key: "widthLabel", label: `Pasvorm: ${labels.width[filters.widthLabel]}` });
  if (filters.maxPrice) active.push({ key: "maxPrice", label: `Budget: tot ${formatPrice(filters.maxPrice)}` });
  if (filters.minScore) active.push({ key: "minScore", label: `Score: vanaf ${filters.minScore}` });
  if (filters.hasCarbonPlate) active.push({ key: "hasCarbonPlate", label: "Eigenschap: carbonplaat" });
  if (filters.isWaterproof) active.push({ key: "isWaterproof", label: "Eigenschap: waterdicht" });
  if (filters.sort !== "editorial") active.push({ key: "sort", label: `Sortering: ${sortLabels[filters.sort]}` });
  return active;
}

const sortLabels = {
  editorial: "Hoogste redactionele score",
  price: "Laagste gecontroleerde prijs",
  weight: "Lichtste eerst",
  value: "Beste waarde voor gebruik"
};

export default async function ShoesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const allShoes = getEnrichedShoes();
  const hasPublicPriceData = allShoes.some((shoe) => shoe.priceFrom !== null);
  const requestedUnavailablePriceFilter = !hasPublicPriceData && (Boolean(filters.maxPrice) || filters.sort === "price");
  const effectiveFilters: Filters = hasPublicPriceData
    ? filters
    : {
        ...filters,
        maxPrice: undefined,
        sort: filters.sort === "price" ? "editorial" : filters.sort
      };
  const shoesById = new Map(allShoes.map((shoe) => [shoe.id, shoe]));
  const compareIds = [...new Set(parseCompareIds(params))].filter((id) => shoesById.has(id)).slice(0, 4);
  const shoes = sortShoes(applyFilters(allShoes, effectiveFilters), effectiveFilters.sort);
  const activeFilters = getActiveFilters(effectiveFilters);
  const comparedShoes = compareIds.map((id) => shoesById.get(id)).filter((shoe): shoe is EnrichedShoe => Boolean(shoe));
  const catalogSignals = [
    { label: "Database", value: `${allShoes.length} modellen`, detail: `${brands.length} merken` },
    { label: "Filters actief", value: `${activeFilters.length}`, detail: activeFilters.length ? "Shortlist aangescherpt" : "Nog breed zoeken" },
    { label: "Vergelijking", value: `${compareIds.length}/4`, detail: compareIds.length >= 2 ? "Klaar om naast elkaar te zetten" : "Kies minimaal 2 schoenen" },
    { label: "Prijslaag", value: hasPublicPriceData ? "Actief" : "In voorbereiding", detail: "Prijs blijft los van score" }
  ];

  return (
    <main className="page-shoes">
      <section className="page-hero-with-visual page-hero-with-visual-compact image-hero image-hero-compare">
        <div>
          <p className="eyebrow">Alle hardloopschoenen</p>
          <h1>Hardloopschoenen vergelijken</h1>
          <p className="lead">
            Begin met waar je loopt en wat je voet nodig heeft. Filter daarna op afstand, demping, steun, pasvorm, gewicht en score. Prijsdata blijft apart van het advies.
          </p>
        </div>
        <div className="page-hero-visual page-hero-visual-wide">
          <Image
            alt="Vergelijkingspaneel met hardloopschoenen en scores op belangrijke keuzecriteria"
            fill
            sizes="(max-width: 820px) 100vw, 420px"
            src="/images/home/compare-shoes-panel.png"
          />
        </div>
      </section>

      <section className="catalog-command-strip" aria-label="Catalogussignalen">
        {catalogSignals.map((signal) => (
          <article key={signal.label}>
            <span>{signal.label}</span>
            <strong>{signal.value}</strong>
            <p>{signal.detail}</p>
          </article>
        ))}
      </section>

      <div className="filter-layout">
        <aside className="filter-panel" aria-label="Filters">
          <h2>Filter je shortlist</h2>
          <div className="filter-help">
            <strong>Twijfel je over steun, demping of pasvorm?</strong>
            <Link href="/keuzehulp">Start de keuzehulp</Link>
          </div>
          <AutoSubmitFilterForm>
            {compareIds.length ? <input name="compare" type="hidden" value={compareIds.join(",")} /> : null}
            {requestedUnavailablePriceFilter ? (
              <div className="filter-help">
                <strong>Prijsfilter tijdelijk niet toegepast</strong>
                <span>Prijs mag pas sturen wanneer aanbiedingen en bronnen zijn gecontroleerd.</span>
              </div>
            ) : null}
            <h3>Doel en gebruik</h3>
            <FilterSelect label="Loopdoel" name="primaryUseCase" value={effectiveFilters.primaryUseCase}>
              <option value="">Alle loopdoelen</option>
              {primaryUseCases.map((useCase) => (
                <option key={useCase} value={useCase}>
                  {labels.primaryUseCase[useCase]}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect label="Afstand" name="distanceBucket" value={effectiveFilters.distanceBucket}>
              <option value="">Alle afstanden</option>
              {distanceBuckets.map((distanceBucket) => (
                <option key={distanceBucket} value={distanceBucket}>
                  {labels.distanceBucket[distanceBucket]}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect label="Soort hardloopschoen" name="shoeType" value={effectiveFilters.shoeType}>
              <option value="">Alle soorten</option>
              {shoeTypes.map((shoeType) => (
                <option key={shoeType} value={shoeType}>
                  {labels.shoeType[shoeType]}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect label="Merk" name="brand" value={effectiveFilters.brand}>
              <option value="">Alle merken</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </FilterSelect>

            <h3>Ondergrond</h3>
            <FilterSelect label="Waar loop je vooral?" name="surfaceType" value={effectiveFilters.surfaceType}>
              <option value="">Alle ondergronden</option>
              {surfaceTypes.map((surfaceType) => (
                <option key={surfaceType} value={surfaceType}>
                  {labels.surfaceType[surfaceType]}
                </option>
              ))}
            </FilterSelect>

            <h3>Steun</h3>
            <FilterSelect label="Hoeveel steun wil je?" name="supportType" value={effectiveFilters.supportType}>
              <option value="">Alle niveaus</option>
              <option value="neutral">{labels.supportType.neutral}</option>
              <option value="light_stability">{labels.supportType.light_stability}</option>
              <option value="stability">{labels.supportType.stability}</option>
            </FilterSelect>

            <h3>Demping</h3>
            <FilterSelect label="Demping" name="cushioningLevel" value={effectiveFilters.cushioningLevel}>
              <option value="">Alle niveaus</option>
              <option value="low">{labels.level.low}</option>
              <option value="medium">{labels.level.medium}</option>
              <option value="high">{labels.level.high}</option>
            </FilterSelect>

            <h3>Pasvorm</h3>
            <FilterSelect label="Breedte van de pasvorm" name="widthLabel" value={effectiveFilters.widthLabel}>
              <option value="">Alle breedtes</option>
              <option value="narrow">{labels.width.narrow}</option>
              <option value="regular">{labels.width.regular}</option>
              <option value="wide">{labels.width.wide}</option>
            </FilterSelect>

            <h3>Prijs en score</h3>
            <label>
              <span>Maximale gecontroleerde prijs</span>
              <input name="maxPrice" type="number" min="80" max="300" step="10" defaultValue={effectiveFilters.maxPrice ?? ""} placeholder="Bijv. 170" disabled={!hasPublicPriceData} />
              {!hasPublicPriceData ? <small>Prijsfilter staat aan zodra gecontroleerde winkelprijzen live staan.</small> : null}
            </label>

            <label>
              <span>Minimale redactionele score</span>
              <input name="minScore" type="number" min="6" max="10" step="0.1" defaultValue={effectiveFilters.minScore ?? ""} placeholder="Bijv. 8.0" />
            </label>

            <label>
              <span>Sorteren</span>
              <select name="sort" defaultValue={effectiveFilters.sort}>
                <option value="editorial">{sortLabels.editorial}</option>
                <option value="price" disabled={!hasPublicPriceData}>{sortLabels.price}</option>
                <option value="weight">{sortLabels.weight}</option>
                <option value="value">{sortLabels.value}</option>
              </select>
            </label>

            <h3>Eigenschappen</h3>
            <label className="checkbox-row">
              <input name="hasCarbonPlate" type="checkbox" value="true" defaultChecked={effectiveFilters.hasCarbonPlate} />
              <span>Carbonplaat</span>
            </label>

            <label className="checkbox-row">
              <input name="isWaterproof" type="checkbox" value="true" defaultChecked={effectiveFilters.isWaterproof} />
              <span>Waterdicht</span>
            </label>

            <button className="button" type="submit">
              Toon resultaten
            </button>
            <Link className="button secondary" href="/schoenen">
              Wis alles
            </Link>
          </AutoSubmitFilterForm>
        </aside>

        <section className="catalog-results-panel" aria-label="Schoenen">
          <div className="result-toolbar">
            <div>
              <strong>{shoes.length}</strong> van {allShoes.length} hardloopschoenen gevonden
            </div>
            <span>{sortLabels[effectiveFilters.sort]}</span>
          </div>

          {activeFilters.length ? (
            <div className="active-filters" aria-label="Actieve filters">
              {activeFilters.map((filter) => (
                <Link href={makeHref(effectiveFilters, filter.key, compareIds)} key={filter.key}>
                  {filter.label} verwijderen
                </Link>
              ))}
            </div>
          ) : null}

          {compareIds.length ? (
            <section className="compare-tray" aria-label="Vergelijkselectie">
              <div>
                <strong>{compareIds.length} van 4 schoenen gekozen</strong>
                <p className="compare-selection-summary">{comparedShoes.map((shoe) => shoe.fullName).join(", ")}</p>
              </div>
              <div>
                {compareIds.length >= 2 ? (
                  <Link className="button" href={`/vergelijken?ids=${compareIds.join(",")}`}>
                    Vergelijk gekozen schoenen
                  </Link>
                ) : (
                  <span className="compare-hint">Kies nog 1 schoen om de verschillen naast elkaar te zien</span>
                )}
                <Link className="button secondary" href={makeHref(effectiveFilters)}>
                  Keuze wissen
                </Link>
              </div>
            </section>
          ) : null}

          {shoes.length ? (
            <div className="grid">
              {shoes.map((shoe) => {
                const isSelected = compareIds.includes(shoe.id);
                const limitReached = compareIds.length >= 4 && !isSelected;
                return (
                  <ProductCard
                    compareDisabled={limitReached}
                    compareHref={limitReached ? makeHref(effectiveFilters, undefined, compareIds) : makeCompareToggleHref(effectiveFilters, compareIds, shoe.id)}
                    compareLabel={isSelected ? "Haal uit vergelijking" : limitReached ? "Maximaal 4 schoenen" : "+ Vergelijk"}
                    key={shoe.id}
                    shoe={shoe}
                  />
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <h2>Geen hardloopschoenen gevonden</h2>
              <p>Met deze filters blijft er nu geen schoen over. Verruim budget, pasvorm of steun, of start de keuzehulp als je niet weet welk criterium het zwaarst moet wegen.</p>
              <div className="actions">
                <Link className="button" href="/schoenen">
                  Wis filters
                </Link>
                <Link className="button secondary" href="/keuzehulp">
                  Start keuzehulp
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function FilterSelect({
  children,
  label,
  name,
  value
}: {
  children: ReactNode;
  label: string;
  name: string;
  value?: string;
}) {
  return (
    <label>
      <span>{label}</span>
      <select name={name} defaultValue={value ?? ""}>
        {children}
      </select>
    </label>
  );
}
