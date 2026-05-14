import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { AutoSubmitFilterForm } from "@/components/AutoSubmitFilterForm";
import { ProductCard } from "@/components/ProductCard";
import { brands, getEnrichedShoes } from "@/lib/data";
import { formatPrice, labels } from "@/lib/labels";
import type { EnrichedShoe, Level, ShoeType, SupportType, WidthLabel } from "@/types/product";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type Filters = {
  brand?: string;
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

function parseNumber(value: string | string[] | undefined) {
  const parsed = Number(firstValue(value));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseFilters(searchParams: Record<string, string | string[] | undefined>): Filters {
  return {
    brand: firstValue(searchParams.brand),
    shoeType: firstValue(searchParams.shoeType) as ShoeType | undefined,
    supportType: firstValue(searchParams.supportType) as SupportType | undefined,
    cushioningLevel: firstValue(searchParams.cushioningLevel) as Level | undefined,
    widthLabel: firstValue(searchParams.widthLabel) as WidthLabel | undefined,
    maxPrice: parseNumber(searchParams.maxPrice),
    minScore: parseNumber(searchParams.minScore),
    hasCarbonPlate: firstValue(searchParams.hasCarbonPlate) === "true" ? true : undefined,
    isWaterproof: firstValue(searchParams.isWaterproof) === "true" ? true : undefined,
    sort: (firstValue(searchParams.sort) as Filters["sort"]) ?? "editorial"
  };
}

function parseCompareIds(searchParams: Record<string, string | string[] | undefined>) {
  return (firstValue(searchParams.compare) ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function applyFilters(shoes: EnrichedShoe[], filters: Filters) {
  return shoes.filter((shoe) => {
    if (filters.brand && shoe.brandId !== filters.brand) return false;
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
  if (filters.brand) active.push({ key: "brand", label: brands.find((brand) => brand.id === filters.brand)?.name ?? filters.brand });
  if (filters.shoeType) active.push({ key: "shoeType", label: labels.shoeType[filters.shoeType] });
  if (filters.supportType) active.push({ key: "supportType", label: labels.supportType[filters.supportType] });
  if (filters.cushioningLevel) active.push({ key: "cushioningLevel", label: `Demping ${labels.level[filters.cushioningLevel].toLowerCase()}` });
  if (filters.widthLabel) active.push({ key: "widthLabel", label: `Pasvorm ${labels.width[filters.widthLabel].toLowerCase()}` });
  if (filters.maxPrice) active.push({ key: "maxPrice", label: `Tot ${formatPrice(filters.maxPrice)}` });
  if (filters.minScore) active.push({ key: "minScore", label: `Score vanaf ${filters.minScore}` });
  if (filters.hasCarbonPlate) active.push({ key: "hasCarbonPlate", label: "Carbonplaat" });
  if (filters.isWaterproof) active.push({ key: "isWaterproof", label: "Waterdicht" });
  if (filters.sort !== "editorial") active.push({ key: "sort", label: `Sortering: ${sortLabels[filters.sort]}` });
  return active;
}

const sortLabels = {
  editorial: "Beste voorlopige score",
  price: "Laagste prijs",
  weight: "Lichtste eerst",
  value: "Beste prijs-kwaliteit"
};

export default async function ShoesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const compareIds = parseCompareIds(params);
  const allShoes = getEnrichedShoes();
  const shoes = sortShoes(applyFilters(allShoes, filters), filters.sort);
  const activeFilters = getActiveFilters(filters);
  const comparedShoes = allShoes.filter((shoe) => compareIds.includes(shoe.id));

  return (
    <main className="page-shoes">
      <section className="page-hero-with-visual page-hero-with-visual-compact">
        <div>
          <p className="eyebrow">Alle hardloopschoenen</p>
          <h1>Hardloopschoenen vergelijken</h1>
          <p className="lead">
            Zoek de hardloopschoen die bij jou past. Filter op merk, gebruik, steun, demping, pasvorm en prijs. Zo vergelijk je rustig de verschillen zonder meteen te hoeven kopen.
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

      <div className="filter-layout">
        <aside className="filter-panel" aria-label="Filters">
          <h2>Verfijn je keuze</h2>
          <div className="filter-help">
            <strong>Twijfel je waar je op moet letten?</strong>
            <Link href="/keuzehulp">Laat de keuzehulp meekijken</Link>
          </div>
          <AutoSubmitFilterForm>
            {compareIds.length ? <input name="compare" type="hidden" value={compareIds.join(",")} /> : null}
            <h3>Waarvoor ga je de schoen gebruiken?</h3>
            <FilterSelect label="Merk" name="brand" value={filters.brand}>
              <option value="">Alle merken</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect label="Soort hardloopschoen" name="shoeType" value={filters.shoeType}>
              <option value="">Alle soorten</option>
              <option value="daily_trainer">{labels.shoeType.daily_trainer}</option>
              <option value="stability">{labels.shoeType.stability}</option>
              <option value="tempo">{labels.shoeType.tempo}</option>
              <option value="race">{labels.shoeType.race}</option>
              <option value="trail">{labels.shoeType.trail}</option>
            </FilterSelect>

            <h3>Pasvorm en steun</h3>
            <FilterSelect label="Hoeveel steun wil je?" name="supportType" value={filters.supportType}>
              <option value="">Alle niveaus</option>
              <option value="neutral">{labels.supportType.neutral}</option>
              <option value="light_stability">{labels.supportType.light_stability}</option>
              <option value="stability">{labels.supportType.stability}</option>
            </FilterSelect>

            <FilterSelect label="Demping" name="cushioningLevel" value={filters.cushioningLevel}>
              <option value="">Alle niveaus</option>
              <option value="low">{labels.level.low}</option>
              <option value="medium">{labels.level.medium}</option>
              <option value="high">{labels.level.high}</option>
            </FilterSelect>

            <FilterSelect label="Breedte van de pasvorm" name="widthLabel" value={filters.widthLabel}>
              <option value="">Alle breedtes</option>
              <option value="narrow">{labels.width.narrow}</option>
              <option value="regular">{labels.width.regular}</option>
              <option value="wide">{labels.width.wide}</option>
            </FilterSelect>

            <h3>Prijs en score</h3>
            <label>
              <span>Maximale prijs</span>
              <input name="maxPrice" type="number" min="80" max="300" step="10" defaultValue={filters.maxPrice ?? ""} placeholder="Bijv. 170" />
            </label>

            <label>
              <span>Minimale voorlopige score</span>
              <input name="minScore" type="number" min="6" max="10" step="0.1" defaultValue={filters.minScore ?? ""} placeholder="Bijv. 8.0" />
            </label>

            <label>
              <span>Sorteren</span>
              <select name="sort" defaultValue={filters.sort}>
                <option value="editorial">{sortLabels.editorial}</option>
                <option value="price">{sortLabels.price}</option>
                <option value="weight">{sortLabels.weight}</option>
                <option value="value">{sortLabels.value}</option>
              </select>
            </label>

            <h3>Eigenschappen</h3>
            <label className="checkbox-row">
              <input name="hasCarbonPlate" type="checkbox" value="true" defaultChecked={filters.hasCarbonPlate} />
              <span>Carbonplaat</span>
            </label>

            <label className="checkbox-row">
              <input name="isWaterproof" type="checkbox" value="true" defaultChecked={filters.isWaterproof} />
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

        <section aria-label="Schoenen">
          <div className="result-toolbar">
            <div>
              <strong>{shoes.length}</strong> van {allShoes.length} hardloopschoenen gevonden
            </div>
            <span>{sortLabels[filters.sort]}</span>
          </div>

          {activeFilters.length ? (
            <div className="active-filters" aria-label="Actieve filters">
              {activeFilters.map((filter) => (
                <Link href={makeHref(filters, filter.key, compareIds)} key={filter.key}>
                  {filter.label} verwijderen
                </Link>
              ))}
            </div>
          ) : null}

          {compareIds.length ? (
            <section className="compare-tray" aria-label="Vergelijkselectie">
              <div>
                <strong>{compareIds.length} van 4 schoenen gekozen</strong>
                <p>{comparedShoes.map((shoe) => shoe.fullName).join(", ")}</p>
              </div>
              <div>
                {compareIds.length >= 2 ? (
                  <Link className="button" href={`/vergelijken?ids=${compareIds.join(",")}`}>
                    Vergelijk gekozen schoenen
                  </Link>
                ) : (
                  <span className="compare-hint">Kies nog 1 schoen om te vergelijken</span>
                )}
                <Link className="button secondary" href={makeHref(filters)}>
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
                    compareHref={limitReached ? makeHref(filters, undefined, compareIds) : makeCompareToggleHref(filters, compareIds, shoe.id)}
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
              <p>Met deze filters vinden we nu geen passende schoen. Zet bijvoorbeeld prijs, pasvorm of steun iets ruimer.</p>
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
