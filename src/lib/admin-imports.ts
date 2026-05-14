import "server-only";

import feedImportsData from "../../data/feed-imports.json";
import { normalizeFeedRecords } from "@/lib/feed-normalization";
import { shoes } from "@/lib/data";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import type { FeedImportStatus, FeedMatchConfidence, FeedProviderType, RawFeedRecord } from "@/types/feed";
import type { Offer, Shoe } from "@/types/product";

type FeedImportSeed = {
  id: string;
  provider: FeedProviderType;
  sourceName: string;
  status: FeedImportStatus;
  importedAt: string;
  records: RawFeedRecord[];
};

type FeedImportRow = {
  id: string;
  provider: FeedProviderType;
  source_name: string;
  source_reference: string | null;
  import_status: FeedImportStatus;
  started_at: string;
  total_records: number;
  normalized_records: number;
  publishable_records: number;
  warning_count: number;
};

type FeedRecordRow = {
  id: string;
  import_id: string;
  provider: FeedProviderType;
  source_name: string;
  source_record_id: string | null;
  external_id: string | null;
  retailer_name: string | null;
  brand_name: string | null;
  product_name: string | null;
  model: string | null;
  version: string | null;
  gtin: string | null;
  ean: string | null;
  sku: string | null;
  raw_price: string | null;
  normalized_price: number | string | null;
  currency: string | null;
  raw_availability: string | null;
  normalized_availability: Offer["availability"] | null;
  product_url: string | null;
  image_url: string | null;
  size_labels: string[] | null;
  raw_payload: Record<string, unknown>;
  warnings: string[] | null;
  imported_at: string;
};

type FeedRecordMatchRow = {
  feed_record_id: string;
  shoe_id: string | null;
  match_confidence: FeedMatchConfidence;
  match_reason: string | null;
};

type ImageCandidateRow = {
  feed_record_id: string | null;
  external_id: string | null;
  image_url: string;
  source_url: string | null;
  source_name: string;
  source_type: ReturnType<typeof normalizeFeedRecords>["imageCandidates"][number]["sourceType"];
  image_status: ReturnType<typeof normalizeFeedRecords>["imageCandidates"][number]["imageStatus"];
  license_status: ReturnType<typeof normalizeFeedRecords>["imageCandidates"][number]["licenseStatus"];
  last_checked_at: string | null;
};

export type AdminImportRow = {
  index: number;
  record: RawFeedRecord;
  matchedShoe?: Shoe;
  matchConfidence: FeedMatchConfidence;
  matchReasons: string[];
  warnings: string[];
  normalizedOffer?: ReturnType<typeof normalizeFeedRecords>["offers"][number];
  imageCandidate?: ReturnType<typeof normalizeFeedRecords>["imageCandidates"][number];
  publishable: boolean;
};

export type AdminFeedImport = {
  id: string;
  provider: FeedProviderType;
  sourceName: string;
  status: FeedImportStatus;
  importedAt: string;
  rows: AdminImportRow[];
  warnings: string[];
  stats: {
    totalRecords: number;
    normalizedOffers: number;
    imageCandidates: number;
    warnings: number;
    publishable: number;
    exactMatches: number;
    highMatches: number;
    mediumMatches: number;
    lowMatches: number;
    noMatches: number;
    qualityScore: number;
  };
};

const feedImports = feedImportsData as FeedImportSeed[];

function key(value: string | undefined) {
  return value?.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function includesKey(source: string | undefined, target: string | undefined) {
  const sourceKey = key(source);
  const targetKey = key(target);
  return Boolean(sourceKey && targetKey && sourceKey.includes(targetKey));
}

function matchShoe(record: RawFeedRecord) {
  const reasons: string[] = [];
  const brandMatches = shoes.filter((shoe) => key(shoe.brand) === key(record.brand));
  if (record.brand && brandMatches.length) reasons.push(`Merk "${record.brand}" komt overeen met ${brandMatches.length} catalogusrecord(s).`);
  if (record.brand && !brandMatches.length) reasons.push(`Merk "${record.brand}" komt niet direct voor in de catalogus.`);

  const candidates = brandMatches.length ? brandMatches : shoes;
  const exact = candidates.find((shoe) => key(shoe.model) === key(record.model) && key(shoe.version) === key(record.version));
  if (exact) {
    const confidence: FeedMatchConfidence = record.gtin || record.ean ? "exact" : "high";
    reasons.push(`Model "${record.model}" en versie "${record.version}" matchen met ${exact.fullName}.`);
    if (record.gtin || record.ean) reasons.push("GTIN/EAN aanwezig; behandel als exacte match tot broncontrole anders aangeeft.");
    if (!record.gtin && !record.ean) reasons.push("Geen GTIN/EAN aanwezig; daarom hoge maar geen exacte confidence.");
    return { shoe: exact, confidence, reasons };
  }

  const modelMatch = candidates.find((shoe) => includesKey(record.productName, shoe.model) && includesKey(record.productName, shoe.version));
  if (modelMatch) {
    reasons.push(`Productnaam bevat model en versie van ${modelMatch.fullName}.`);
    reasons.push("Match komt uit tekstherkenning; controleer variant, gender en uitvoering handmatig.");
    return { shoe: modelMatch, confidence: "medium" as FeedMatchConfidence, reasons };
  }

  const weakMatch = candidates.find((shoe) => includesKey(record.productName, shoe.model));
  if (weakMatch) {
    reasons.push(`Productnaam lijkt op model "${weakMatch.model}", maar versie of variant is onzeker.`);
    reasons.push("Lage confidence: niet publiceren zonder handmatige matchcontrole.");
    return { shoe: weakMatch, confidence: "low" as FeedMatchConfidence, reasons };
  }

  reasons.push("Geen betrouwbare match gevonden op merk, model, versie of productnaam.");
  reasons.push("Markeer als handmatige match of nieuw catalogusmodel.");
  return { shoe: undefined, confidence: "none" as FeedMatchConfidence, reasons };
}

function warningsForRecord(record: RawFeedRecord) {
  const warnings: string[] = [];
  if (!record.url) warnings.push("Mist URL");
  if (record.price === undefined || record.price === "") warnings.push("Mist geldige prijs");
  if (!record.imageUrl) warnings.push("Geen afbeeldingskandidaat");
  if (!record.brand || !record.productName) warnings.push("Mist merk of productnaam");
  return warnings;
}

function calculateQualityScore(rows: AdminImportRow[]) {
  if (!rows.length) return 0;
  const publishableScore = rows.filter((row) => row.publishable).length / rows.length;
  const matchScore =
    rows.reduce((score, row) => {
      if (row.matchConfidence === "exact") return score + 1;
      if (row.matchConfidence === "high") return score + 0.9;
      if (row.matchConfidence === "medium") return score + 0.65;
      if (row.matchConfidence === "low") return score + 0.35;
      return score;
    }, 0) / rows.length;
  const warningPenalty = Math.min(0.35, rows.reduce((sum, row) => sum + row.warnings.length, 0) / rows.length / 5);
  return Math.max(0, Math.round((publishableScore * 0.45 + matchScore * 0.55 - warningPenalty) * 100));
}

function buildAdminImport(seed: FeedImportSeed): AdminFeedImport {
  const normalized = normalizeFeedRecords(seed.records);
  let offerIndex = 0;
  let imageIndex = 0;
  const rows = seed.records.map<AdminImportRow>((record, index) => {
    const matched = matchShoe(record);
    const normalizedOffer = record.url && record.price !== undefined && record.price !== "" ? normalized.offers[offerIndex++] : undefined;
    const imageCandidate = record.imageUrl ? normalized.imageCandidates[imageIndex++] : undefined;
    const warnings = warningsForRecord(record);
    const publishable = Boolean(normalizedOffer && matched.shoe && !warnings.length && ["exact", "high", "medium"].includes(matched.confidence));

    return {
      index: index + 1,
      record,
      matchedShoe: matched.shoe,
      matchConfidence: matched.confidence,
      matchReasons: matched.reasons,
      warnings,
      normalizedOffer: normalizedOffer ? { ...normalizedOffer, matchedShoeId: matched.shoe?.id, matchConfidence: matched.confidence } : undefined,
      imageCandidate: imageCandidate ? { ...imageCandidate, shoeId: matched.shoe?.id } : undefined,
      publishable
    };
  });

  const warningCount = rows.reduce((sum, row) => sum + row.warnings.length, 0);

  return {
    id: seed.id,
    provider: seed.provider,
    sourceName: seed.sourceName,
    status: seed.status,
    importedAt: seed.importedAt,
    rows,
    warnings: normalized.warnings,
    stats: {
      totalRecords: rows.length,
      normalizedOffers: rows.filter((row) => row.normalizedOffer).length,
      imageCandidates: rows.filter((row) => row.imageCandidate).length,
      warnings: warningCount,
      publishable: rows.filter((row) => row.publishable).length,
      exactMatches: rows.filter((row) => row.matchConfidence === "exact").length,
      highMatches: rows.filter((row) => row.matchConfidence === "high").length,
      mediumMatches: rows.filter((row) => row.matchConfidence === "medium").length,
      lowMatches: rows.filter((row) => row.matchConfidence === "low").length,
      noMatches: rows.filter((row) => row.matchConfidence === "none").length,
      qualityScore: calculateQualityScore(rows)
    }
  };
}

function getJsonAdminImports() {
  return feedImports.map(buildAdminImport);
}

function rawRecordFromRow(row: FeedRecordRow): RawFeedRecord {
  return {
    provider: row.provider,
    sourceName: row.source_name,
    importedAt: row.imported_at,
    externalId: row.external_id ?? row.source_record_id ?? undefined,
    brand: row.brand_name ?? undefined,
    productName: row.product_name ?? undefined,
    model: row.model ?? undefined,
    version: row.version ?? undefined,
    gtin: row.gtin ?? undefined,
    ean: row.ean ?? undefined,
    sku: row.sku ?? undefined,
    retailer: row.retailer_name ?? undefined,
    price: row.raw_price ?? row.normalized_price ?? undefined,
    currency: row.currency ?? undefined,
    availability: row.raw_availability ?? row.normalized_availability ?? undefined,
    url: row.product_url ?? undefined,
    imageUrl: row.image_url ?? undefined,
    sizes: row.size_labels ?? undefined,
    rawPayload: row.raw_payload
  };
}

function normalizedOfferFromRow(row: FeedRecordRow, match?: FeedRecordMatchRow): AdminImportRow["normalizedOffer"] {
  if (!row.product_url || row.normalized_price === null) return undefined;

  return {
    externalOfferId: row.external_id ?? row.source_record_id ?? undefined,
    retailer: row.retailer_name ?? row.source_name,
    price: typeof row.normalized_price === "number" ? row.normalized_price : Number(row.normalized_price),
    currency: "EUR",
    availability: row.normalized_availability ?? "unknown",
    url: row.product_url,
    offerStatus: "feed_pending",
    lastCheckedAt: row.imported_at,
    sourceType: row.provider === "tradetracker" ? "affiliate_feed" : row.provider === "manual_csv" ? "manual" : "retailer_feed",
    isAffiliate: row.provider === "tradetracker",
    affiliateNetwork: row.provider === "tradetracker" ? "TradeTracker" : undefined,
    gtin: row.gtin ?? row.ean ?? undefined,
    sizeAvailability: row.size_labels ?? undefined,
    matchedShoeId: match?.shoe_id ?? undefined,
    matchConfidence: match?.match_confidence ?? "none",
    importStatus: "needs_review",
    rawBrand: row.brand_name ?? undefined,
    rawProductName: row.product_name ?? undefined
  };
}

function imageCandidateFromRow(row: ImageCandidateRow | undefined, shoeId?: string): AdminImportRow["imageCandidate"] {
  if (!row) return undefined;

  return {
    shoeId,
    externalId: row.external_id ?? undefined,
    imageUrl: row.image_url,
    sourceUrl: row.source_url ?? undefined,
    sourceName: row.source_name,
    sourceType: row.source_type,
    imageStatus: row.image_status,
    licenseStatus: row.license_status,
    lastCheckedAt: row.last_checked_at ?? new Date().toISOString()
  };
}

function buildAdminImportFromSupabase(
  feedImport: FeedImportRow,
  records: FeedRecordRow[],
  matches: FeedRecordMatchRow[],
  imageCandidates: ImageCandidateRow[]
): AdminFeedImport {
  const matchesByRecord = new Map(matches.map((match) => [match.feed_record_id, match]));
  const imagesByRecord = new Map(imageCandidates.filter((image) => image.feed_record_id).map((image) => [image.feed_record_id!, image]));

  const rows = records.map<AdminImportRow>((record, index) => {
    const match = matchesByRecord.get(record.id);
    const matchedShoe = match?.shoe_id ? shoes.find((shoe) => shoe.id === match.shoe_id) : undefined;
    const warnings = record.warnings ?? [];
    const normalizedOffer = normalizedOfferFromRow(record, match);
    const publishable = Boolean(normalizedOffer && matchedShoe && warnings.length === 0 && ["exact", "high", "medium"].includes(match?.match_confidence ?? "none"));

    return {
      index: index + 1,
      record: rawRecordFromRow(record),
      matchedShoe,
      matchConfidence: match?.match_confidence ?? "none",
      matchReasons: [match?.match_reason ?? "Geen matchreden opgeslagen."],
      warnings,
      normalizedOffer,
      imageCandidate: imageCandidateFromRow(imagesByRecord.get(record.id), matchedShoe?.id),
      publishable
    };
  });

  return {
    id: feedImport.source_reference ?? feedImport.id,
    provider: feedImport.provider,
    sourceName: feedImport.source_name,
    status: feedImport.import_status,
    importedAt: feedImport.started_at,
    rows,
    warnings: rows.flatMap((row) => row.warnings.map((warning) => `Record ${row.index}: ${warning}`)),
    stats: {
      totalRecords: rows.length,
      normalizedOffers: rows.filter((row) => row.normalizedOffer).length,
      imageCandidates: rows.filter((row) => row.imageCandidate).length,
      warnings: rows.reduce((sum, row) => sum + row.warnings.length, 0),
      publishable: rows.filter((row) => row.publishable).length,
      exactMatches: rows.filter((row) => row.matchConfidence === "exact").length,
      highMatches: rows.filter((row) => row.matchConfidence === "high").length,
      mediumMatches: rows.filter((row) => row.matchConfidence === "medium").length,
      lowMatches: rows.filter((row) => row.matchConfidence === "low").length,
      noMatches: rows.filter((row) => row.matchConfidence === "none").length,
      qualityScore: calculateQualityScore(rows)
    }
  };
}

export async function getAdminImports() {
  try {
    const supabase = createServiceRoleClient();
    const { data: imports, error: importsError } = await supabase
      .from("feed_imports")
      .select("id, provider, source_name, source_reference, import_status, started_at, total_records, normalized_records, publishable_records, warning_count")
      .order("started_at", { ascending: false });

    if (importsError || !imports?.length) return getJsonAdminImports();

    const importIds = imports.map((item) => item.id);
    const [{ data: records, error: recordsError }, { data: matches, error: matchesError }, { data: images, error: imagesError }] = await Promise.all([
      supabase
        .from("feed_records")
        .select("id, import_id, provider, source_name, source_record_id, external_id, retailer_name, brand_name, product_name, model, version, gtin, ean, sku, raw_price, normalized_price, currency, raw_availability, normalized_availability, product_url, image_url, size_labels, raw_payload, warnings, imported_at")
        .in("import_id", importIds)
        .order("created_at"),
      supabase.from("feed_record_matches").select("feed_record_id, shoe_id, match_confidence, match_reason"),
      supabase.from("image_candidates").select("feed_record_id, external_id, image_url, source_url, source_name, source_type, image_status, license_status, last_checked_at")
    ]);

    if (recordsError || matchesError || imagesError) return getJsonAdminImports();

    return (imports as FeedImportRow[]).map((feedImport) =>
      buildAdminImportFromSupabase(
        feedImport,
        (records as FeedRecordRow[]).filter((record) => record.import_id === feedImport.id),
        matches as FeedRecordMatchRow[],
        images as ImageCandidateRow[]
      )
    );
  } catch {
    return getJsonAdminImports();
  }
}

export async function getAdminImport(id: string) {
  return (await getAdminImports()).find((item) => item.id === id);
}

export function getAdminImportStaticParams() {
  return feedImports.map((item) => ({ id: item.id }));
}
