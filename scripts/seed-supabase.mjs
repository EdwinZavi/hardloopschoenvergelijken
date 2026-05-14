import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

function loadEnvLocal() {
  const envPath = resolve(root, ".env.local");

  try {
    const content = readFileSync(envPath, "utf8");

    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const separator = trimmed.indexOf("=");

      if (separator === -1) {
        continue;
      }

      const key = trimmed.slice(0, separator).trim();
      const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, "");

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    throw new Error(".env.local niet gevonden. Voeg SUPABASE_SERVICE_ROLE_KEY lokaal toe voordat je seedt.");
  }
}

function readJson(path) {
  return JSON.parse(readFileSync(resolve(root, path), "utf8"));
}

function requireEnv(key) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Ontbrekende env var: ${key}`);
  }

  return value;
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " en ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeIsoDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function chunk(rows, size = 500) {
  const chunks = [];

  for (let index = 0; index < rows.length; index += size) {
    chunks.push(rows.slice(index, index + size));
  }

  return chunks;
}

async function upsertRows(supabase, table, rows, options = {}) {
  if (!rows.length) {
    return;
  }

  for (const rowsChunk of chunk(rows)) {
    const { error } = await supabase.from(table).upsert(rowsChunk, options);

    if (error) {
      throw new Error(`${table} upsert mislukt: ${error.message}`);
    }
  }
}

function mapBrand(brand) {
  return {
    id: brand.id,
    slug: brand.slug,
    name: brand.name,
    is_active: brand.isActive ?? true
  };
}

function mapShoe(shoe) {
  return {
    id: shoe.id,
    slug: shoe.slug,
    brand_id: shoe.brandId,
    model: shoe.model,
    version: shoe.version,
    full_name: shoe.fullName,
    image_url: shoe.imageUrl ?? null,
    image_status: shoe.imageStatus ?? (shoe.imageUrl ? "verified" : "missing"),
    image_source_type: shoe.imageSourceType ?? null,
    image_source_name: shoe.imageSourceName ?? null,
    image_source_url: shoe.imageSourceUrl ?? null,
    image_last_checked_at: normalizeIsoDate(shoe.imageLastCheckedAt),
    image_license_status: shoe.imageLicenseStatus ?? null,
    data_status: shoe.dataStatus ?? "needs_review",
    score_status: shoe.scoreStatus ?? "seed_estimate",
    release_year: shoe.releaseYear,
    release_month: shoe.releaseMonth ?? null,
    release_date: shoe.releaseDate ?? null,
    release_date_precision: shoe.releaseDatePrecision ?? "year",
    release_date_source: shoe.releaseDateSource ?? null,
    shoe_type: shoe.shoeType,
    primary_use_case: shoe.primaryUseCase,
    surface_type: shoe.surfaceType,
    distance_bucket: shoe.distanceBucket,
    support_type: shoe.supportType,
    cushioning_level: shoe.cushioningLevel,
    responsiveness_level: shoe.responsivenessLevel,
    fit_profile: shoe.fitProfile,
    width_label: shoe.widthLabel,
    weight_grams: shoe.weightGrams,
    heel_drop_mm: shoe.heelDropMm,
    stack_height_heel_mm: shoe.stackHeightHeelMm ?? null,
    has_carbon_plate: shoe.hasCarbonPlate,
    is_waterproof: shoe.isWaterproof
  };
}

function mapEditorialScore(shoe) {
  const score = shoe.editorialScore;

  return {
    shoe_id: shoe.id,
    overall: score.overall,
    comfort: score.comfort,
    cushioning: score.cushioning,
    stability: score.stability,
    responsiveness: score.responsiveness,
    grip: score.grip,
    versatility: score.versatility,
    value_for_money: score.valueForMoney,
    methodology_version: "mvp_seed_v1"
  };
}

function mapEditorialVerdict(shoe) {
  const verdict = shoe.editorialVerdict;

  return {
    shoe_id: shoe.id,
    best_for: verdict.bestFor,
    less_suitable_for: verdict.lessSuitableFor,
    summary: verdict.summary,
    pros_text: null,
    cons_text: null,
    fit_notes: null,
    ride_notes: null
  };
}

function buildRetailers(offers) {
  const bySlug = new Map();

  for (const offer of offers) {
    const slug = slugify(offer.retailer);

    if (!bySlug.has(slug)) {
      bySlug.set(slug, {
        id: slug,
        slug,
        name: offer.retailer,
        website_url: null,
        logo_url: null,
        trust_score: null,
        shipping_note: null,
        return_policy_note: null,
        is_active: true
      });
    }
  }

  return Array.from(bySlug.values()).sort((a, b) => a.name.localeCompare(b.name, "nl"));
}

function mapOffer(offer) {
  const url = offer.url;
  const isPlaceholderUrl = url.includes("example.com");

  return {
    id: offer.id,
    shoe_id: offer.shoeId,
    retailer_id: slugify(offer.retailer),
    price: offer.price,
    currency: offer.currency,
    availability: offer.availability,
    url,
    offer_status: offer.offerStatus ?? (isPlaceholderUrl ? "placeholder" : "verified"),
    last_checked_at: normalizeIsoDate(offer.lastCheckedAt),
    source_type: offer.sourceType ?? "manual",
    is_affiliate: offer.isAffiliate ?? false,
    affiliate_network: offer.affiliateNetwork ?? null,
    external_offer_id: offer.externalOfferId ?? null,
    gtin: offer.gtin ?? null,
    size_availability: offer.sizeAvailability ?? null
  };
}

async function countRows(supabase, table) {
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });

  if (error) {
    throw new Error(`${table} count mislukt: ${error.message}`);
  }

  return count ?? 0;
}

async function main() {
  loadEnvLocal();

  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const brands = readJson("data/brands.json");
  const shoes = readJson("data/shoes.json");
  const offers = readJson("data/offers.json");

  const brandRows = brands.map(mapBrand);
  const shoeRows = shoes.map(mapShoe);
  const editorialScoreRows = shoes.map(mapEditorialScore);
  const editorialVerdictRows = shoes.map(mapEditorialVerdict);
  const retailerRows = buildRetailers(offers);
  const offerRows = offers.map(mapOffer);

  console.log("Supabase seed gestart.");
  console.log(`Brondata: ${brandRows.length} brands, ${shoeRows.length} shoes, ${offerRows.length} offers.`);

  await upsertRows(supabase, "brands", brandRows, { onConflict: "id" });
  await upsertRows(supabase, "shoes", shoeRows, { onConflict: "id" });
  await upsertRows(supabase, "editorial_scores", editorialScoreRows, { onConflict: "shoe_id" });
  await upsertRows(supabase, "editorial_verdicts", editorialVerdictRows, { onConflict: "shoe_id" });
  await upsertRows(supabase, "retailers", retailerRows, { onConflict: "id" });
  await upsertRows(supabase, "offers", offerRows, { onConflict: "id" });

  const counts = {
    brands: await countRows(supabase, "brands"),
    shoes: await countRows(supabase, "shoes"),
    editorial_scores: await countRows(supabase, "editorial_scores"),
    editorial_verdicts: await countRows(supabase, "editorial_verdicts"),
    retailers: await countRows(supabase, "retailers"),
    offers: await countRows(supabase, "offers")
  };

  console.log("Supabase seed afgerond.");
  console.table(counts);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
