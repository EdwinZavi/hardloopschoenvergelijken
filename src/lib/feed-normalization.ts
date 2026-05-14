import type { FeedImportResult, FeedMatchConfidence, FeedProviderType, NormalizedFeedOffer, RawFeedRecord } from "@/types/feed";
import type { Offer } from "@/types/product";

const availabilityMap: Record<string, Offer["availability"]> = {
  available: "in_stock",
  in_stock: "in_stock",
  instock: "in_stock",
  "in stock": "in_stock",
  low_stock: "low_stock",
  "low stock": "low_stock",
  limited: "low_stock",
  out_of_stock: "out_of_stock",
  outofstock: "out_of_stock",
  "out of stock": "out_of_stock",
  unavailable: "out_of_stock"
};

function normalizeText(value?: string) {
  return value?.trim().replace(/\s+/g, " ");
}

function normalizePrice(value: string | number | undefined) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (!value) return null;
  const normalized = value.replace(/[^\d,.-]/g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeAvailability(value: string | undefined): Offer["availability"] {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) return "unknown";
  return availabilityMap[normalized] ?? "unknown";
}

function sourceTypeForProvider(provider: FeedProviderType): Offer["sourceType"] {
  if (provider === "tradetracker") return "affiliate_feed";
  if (provider === "retailer_api" || provider === "retailer_feed") return "retailer_feed";
  return "manual";
}

function affiliateNetworkForProvider(provider: FeedProviderType) {
  return provider === "tradetracker" ? "TradeTracker" : undefined;
}

function isLikelyPlaceholderUrl(url: string) {
  return url.includes("example.com") || url.includes("localhost");
}

function inferMatchConfidence(record: RawFeedRecord): FeedMatchConfidence {
  if (record.gtin || record.ean) return "exact";
  if (record.brand && (record.model || record.productName)) return "medium";
  if (record.productName) return "low";
  return "none";
}

export function normalizeFeedRecords(records: RawFeedRecord[]): FeedImportResult {
  const importedAt = records[0]?.importedAt ?? new Date().toISOString();
  const provider = records[0]?.provider ?? "manual_csv";
  const sourceName = records[0]?.sourceName ?? "Onbekende feed";
  const warnings: string[] = [];
  const offers: NormalizedFeedOffer[] = [];
  const imageCandidates: FeedImportResult["imageCandidates"] = [];

  records.forEach((record, index) => {
    const retailer = normalizeText(record.retailer) ?? record.sourceName;
    const url = normalizeText(record.url);
    const price = normalizePrice(record.price);

    if (!url) warnings.push(`Record ${index + 1}: mist URL en kan niet als offer gepubliceerd worden.`);
    if (price === null) warnings.push(`Record ${index + 1}: mist geldige prijs.`);

    if (url && price !== null) {
      offers.push({
        externalOfferId: record.externalId ?? record.sku,
        retailer,
        price,
        currency: record.currency === "EUR" ? "EUR" : "EUR",
        availability: normalizeAvailability(record.availability),
        url,
        offerStatus: isLikelyPlaceholderUrl(url) ? "placeholder" : "feed_pending",
        lastCheckedAt: record.importedAt,
        sourceType: sourceTypeForProvider(record.provider),
        isAffiliate: record.provider === "tradetracker",
        affiliateNetwork: affiliateNetworkForProvider(record.provider),
        gtin: record.gtin ?? record.ean,
        sizeAvailability: record.sizes,
        matchConfidence: inferMatchConfidence(record),
        importStatus: "normalized",
        rawBrand: normalizeText(record.brand),
        rawProductName: normalizeText(record.productName)
      });
    }

    if (record.imageUrl) {
      imageCandidates.push({
        externalId: record.externalId ?? record.sku,
        imageUrl: record.imageUrl,
        sourceUrl: url,
        sourceName,
        sourceType: record.provider === "tradetracker" ? "tradetracker_feed" : "retailer_feed",
        imageStatus: "feed_pending",
        licenseStatus: record.provider === "tradetracker" ? "feed_allowed" : "needs_review",
        lastCheckedAt: record.importedAt
      });
    }
  });

  return {
    provider,
    sourceName,
    importedAt,
    offers,
    imageCandidates,
    warnings
  };
}

export const publicOfferPublicationRule = {
  offerStatus: "verified",
  sourceType: "affiliate_feed",
  requiresMatchedShoe: true,
  requiresLastCheckedAt: true,
  requiresNonPlaceholderUrl: true
} as const;
