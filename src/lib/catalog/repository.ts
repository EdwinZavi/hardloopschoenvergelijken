import { brands as jsonBrands, getEnrichedShoes as getJsonEnrichedShoes, offers as jsonOffers } from "@/lib/data";
import { isPublicOffer } from "@/lib/offer-publication";
import { getSupabaseConfigStatus } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type {
  Brand,
  DataStatus,
  EditorialScore,
  EditorialVerdict,
  EnrichedShoe,
  FitProfile,
  ImageLicenseStatus,
  ImageSourceType,
  ImageStatus,
  Level,
  Offer,
  OfferSourceType,
  OfferStatus,
  ScoreStatus,
  Shoe,
  ShoeType,
  SupportType,
  SurfaceType,
  WidthLabel
} from "@/types/product";

export type CatalogSource = "supabase" | "json_fallback";

export type CatalogReadResult<T> = {
  data: T;
  source: CatalogSource;
  fallbackReason?: string;
};

type BrandRow = {
  id: string;
  slug: string;
  name: string;
  is_active: boolean;
};

type EditorialScoreRow = {
  overall: number | string;
  comfort: number | string;
  cushioning: number | string;
  stability: number | string;
  responsiveness: number | string;
  grip: number | string;
  versatility: number | string;
  value_for_money: number | string;
};

type EditorialVerdictRow = {
  best_for: string;
  less_suitable_for: string;
  summary: string;
};

type ShoeRow = {
  id: string;
  slug: string;
  brand_id: string;
  model: string;
  version: string;
  full_name: string;
  image_url: string | null;
  image_status: ImageStatus | null;
  image_source_type: ImageSourceType | null;
  image_source_name: string | null;
  image_source_url: string | null;
  image_last_checked_at: string | null;
  image_license_status: ImageLicenseStatus | null;
  data_status: DataStatus;
  score_status: ScoreStatus;
  release_year: number;
  shoe_type: ShoeType;
  primary_use_case: string;
  surface_type: SurfaceType;
  distance_bucket: string;
  support_type: SupportType;
  cushioning_level: Level;
  responsiveness_level: Level;
  fit_profile: FitProfile;
  width_label: WidthLabel;
  weight_grams: number;
  heel_drop_mm: number;
  stack_height_heel_mm: number | null;
  has_carbon_plate: boolean;
  is_waterproof: boolean;
  brands: Pick<BrandRow, "id" | "name"> | Pick<BrandRow, "id" | "name">[] | null;
  editorial_scores: EditorialScoreRow | EditorialScoreRow[] | null;
  editorial_verdicts: EditorialVerdictRow | EditorialVerdictRow[] | null;
};

type OfferRow = {
  id: string;
  shoe_id: string;
  price: number | string;
  currency: "EUR";
  availability: Offer["availability"];
  url: string;
  offer_status: OfferStatus;
  last_checked_at: string | null;
  source_type: OfferSourceType;
  is_affiliate: boolean;
  affiliate_network: string | null;
  external_offer_id: string | null;
  gtin: string | null;
  size_availability: string[] | null;
  retailers: { name: string } | { name: string }[] | null;
};

function jsonFallback<T>(data: T, reason: string): CatalogReadResult<T> {
  return {
    data,
    source: "json_fallback",
    fallbackReason: reason
  };
}

function firstRelation<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function numberValue(value: number | string): number {
  return typeof value === "number" ? value : Number(value);
}

function mapBrand(row: BrandRow): Brand {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    isActive: row.is_active
  };
}

function mapEditorialScore(row: EditorialScoreRow): EditorialScore {
  return {
    overall: numberValue(row.overall),
    comfort: numberValue(row.comfort),
    cushioning: numberValue(row.cushioning),
    stability: numberValue(row.stability),
    responsiveness: numberValue(row.responsiveness),
    grip: numberValue(row.grip),
    versatility: numberValue(row.versatility),
    valueForMoney: numberValue(row.value_for_money)
  };
}

function mapEditorialVerdict(row: EditorialVerdictRow): EditorialVerdict {
  return {
    bestFor: row.best_for,
    lessSuitableFor: row.less_suitable_for,
    summary: row.summary
  };
}

function mapShoe(row: ShoeRow): Shoe {
  const brand = firstRelation(row.brands);
  const score = firstRelation(row.editorial_scores);
  const verdict = firstRelation(row.editorial_verdicts);

  if (!brand || !score || !verdict) {
    throw new Error(`Catalogusrij mist verplichte relatie voor schoen ${row.id}`);
  }

  return {
    id: row.id,
    slug: row.slug,
    brandId: row.brand_id,
    brand: brand.name,
    model: row.model,
    version: row.version,
    fullName: row.full_name,
    imageUrl: row.image_url ?? undefined,
    imageStatus: row.image_status ?? undefined,
    imageSourceType: row.image_source_type ?? undefined,
    imageSourceName: row.image_source_name ?? undefined,
    imageSourceUrl: row.image_source_url ?? undefined,
    imageLastCheckedAt: row.image_last_checked_at ?? undefined,
    imageLicenseStatus: row.image_license_status ?? undefined,
    dataStatus: row.data_status,
    scoreStatus: row.score_status,
    releaseYear: row.release_year,
    shoeType: row.shoe_type,
    primaryUseCase: row.primary_use_case,
    surfaceType: row.surface_type,
    distanceBucket: row.distance_bucket,
    supportType: row.support_type,
    cushioningLevel: row.cushioning_level,
    responsivenessLevel: row.responsiveness_level,
    fitProfile: row.fit_profile,
    widthLabel: row.width_label,
    weightGrams: row.weight_grams,
    heelDropMm: row.heel_drop_mm,
    stackHeightHeelMm: row.stack_height_heel_mm ?? undefined,
    hasCarbonPlate: row.has_carbon_plate,
    isWaterproof: row.is_waterproof,
    editorialScore: mapEditorialScore(score),
    editorialVerdict: mapEditorialVerdict(verdict)
  };
}

function mapOffer(row: OfferRow): Offer {
  const retailer = firstRelation(row.retailers);

  if (!retailer) {
    throw new Error(`Catalogusoffer mist retailer voor offer ${row.id}`);
  }

  return {
    id: row.id,
    shoeId: row.shoe_id,
    retailer: retailer.name,
    price: numberValue(row.price),
    currency: row.currency,
    availability: row.availability,
    url: row.url,
    offerStatus: row.offer_status,
    lastCheckedAt: row.last_checked_at ?? undefined,
    sourceType: row.source_type,
    isAffiliate: row.is_affiliate,
    affiliateNetwork: row.affiliate_network ?? undefined,
    externalOfferId: row.external_offer_id ?? undefined,
    gtin: row.gtin ?? undefined,
    sizeAvailability: row.size_availability ?? undefined
  };
}

function enrichShoesFromRows(shoeRows: ShoeRow[], offerRows: OfferRow[]): EnrichedShoe[] {
  const offersByShoe = new Map<string, Offer[]>();

  for (const offer of offerRows.map(mapOffer).filter(isPublicOffer)) {
    const shoeOffers = offersByShoe.get(offer.shoeId) ?? [];
    shoeOffers.push(offer);
    offersByShoe.set(offer.shoeId, shoeOffers);
  }

  return shoeRows.map((row) => {
    const shoe = mapShoe(row);
    const shoeOffers = offersByShoe.get(shoe.id) ?? [];

    return {
      ...shoe,
      dataStatus: shoe.dataStatus ?? "needs_review",
      scoreStatus: shoe.scoreStatus ?? "seed_estimate",
      priceFrom: shoeOffers.length ? Math.min(...shoeOffers.map((offer) => offer.price)) : null,
      retailerCount: new Set(shoeOffers.map((offer) => offer.retailer)).size
    };
  });
}

export async function getCatalogBrands(): Promise<CatalogReadResult<Brand[]>> {
  const config = getSupabaseConfigStatus();

  if (!config.isConfigured) {
    return jsonFallback(jsonBrands, `Supabase configuratie ontbreekt: ${config.missing.join(", ")}`);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("brands").select("id, slug, name, is_active").order("name");

    if (error) {
      return jsonFallback(jsonBrands, error.message);
    }

    return {
      data: (data as BrandRow[]).map(mapBrand),
      source: "supabase"
    };
  } catch (error) {
    return jsonFallback(jsonBrands, error instanceof Error ? error.message : "Onbekende catalogusfout");
  }
}

export async function getCatalogShoes(): Promise<CatalogReadResult<EnrichedShoe[]>> {
  const config = getSupabaseConfigStatus();
  const fallbackShoes = getJsonEnrichedShoes();

  if (!config.isConfigured) {
    return jsonFallback(fallbackShoes, `Supabase configuratie ontbreekt: ${config.missing.join(", ")}`);
  }

  try {
    const supabase = await createClient();
    const { data: shoeRows, error: shoeError } = await supabase
      .from("shoes")
      .select(
        `
          id,
          slug,
          brand_id,
          model,
          version,
          full_name,
          image_url,
          image_status,
          image_source_type,
          image_source_name,
          image_source_url,
          image_last_checked_at,
          image_license_status,
          data_status,
          score_status,
          release_year,
          shoe_type,
          primary_use_case,
          surface_type,
          distance_bucket,
          support_type,
          cushioning_level,
          responsiveness_level,
          fit_profile,
          width_label,
          weight_grams,
          heel_drop_mm,
          stack_height_heel_mm,
          has_carbon_plate,
          is_waterproof,
          brands!inner(id, name),
          editorial_scores!inner(
            overall,
            comfort,
            cushioning,
            stability,
            responsiveness,
            grip,
            versatility,
            value_for_money
          ),
          editorial_verdicts!inner(
            best_for,
            less_suitable_for,
            summary
          )
        `
      )
      .order("full_name");

    if (shoeError) {
      return jsonFallback(fallbackShoes, shoeError.message);
    }

    const { data: offerRows, error: offerError } = await supabase
      .from("offers")
      .select(
        `
          id,
          shoe_id,
          price,
          currency,
          availability,
          url,
          offer_status,
          last_checked_at,
          source_type,
          is_affiliate,
          affiliate_network,
          external_offer_id,
          gtin,
          size_availability,
          retailers!inner(name)
        `
      )
      .order("price");

    if (offerError) {
      return jsonFallback(fallbackShoes, offerError.message);
    }

    return {
      data: enrichShoesFromRows(shoeRows as ShoeRow[], offerRows as OfferRow[]),
      source: "supabase"
    };
  } catch (error) {
    return jsonFallback(fallbackShoes, error instanceof Error ? error.message : "Onbekende catalogusfout");
  }
}

export async function getCatalogCounts(): Promise<CatalogReadResult<{ brands: number; shoes: number; offers: number }>> {
  const config = getSupabaseConfigStatus();
  const fallbackCounts = {
    brands: jsonBrands.length,
    shoes: getJsonEnrichedShoes().length,
    offers: jsonOffers.length
  };

  if (!config.isConfigured) {
    return jsonFallback(fallbackCounts, `Supabase configuratie ontbreekt: ${config.missing.join(", ")}`);
  }

  try {
    const supabase = await createClient();
    const [brandsResult, shoesResult, offersResult] = await Promise.all([
      supabase.from("brands").select("id", { count: "exact", head: true }),
      supabase.from("shoes").select("id", { count: "exact", head: true }),
      supabase.from("offers").select("id", { count: "exact", head: true })
    ]);

    const firstError = brandsResult.error ?? shoesResult.error ?? offersResult.error;

    if (firstError) {
      return jsonFallback(fallbackCounts, firstError.message);
    }

    return {
      data: {
        brands: brandsResult.count ?? 0,
        shoes: shoesResult.count ?? 0,
        offers: offersResult.count ?? 0
      },
      source: "supabase"
    };
  } catch (error) {
    return jsonFallback(fallbackCounts, error instanceof Error ? error.message : "Onbekende catalogusfout");
  }
}
