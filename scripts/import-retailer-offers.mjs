import { readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";

const root = process.cwd();
const args = process.argv.slice(2);
const flags = new Set(args.filter((arg) => arg.startsWith("--")));
const positionalArgs = args.filter((arg) => !arg.startsWith("--"));
const inputPath = positionalArgs[0] ?? "data/retailer-offer-template.csv";
const writeMode = flags.has("--write");
const dryRun = flags.has("--dry-run") || !writeMode;

const requiredHeaders = [
  "shoeSlug",
  "retailerName",
  "retailerDomain",
  "productUrl",
  "priceCents",
  "price",
  "currency",
  "availability",
  "sourceType",
  "sourceName",
  "lastCheckedAt",
  "affiliateStatus",
  "publicationStatus"
];

const availabilityMap = new Map([
  ["in_stock", "in_stock"],
  ["instock", "in_stock"],
  ["in stock", "in_stock"],
  ["available", "in_stock"],
  ["limited", "low_stock"],
  ["low_stock", "low_stock"],
  ["low stock", "low_stock"],
  ["out_of_stock", "out_of_stock"],
  ["outofstock", "out_of_stock"],
  ["out of stock", "out_of_stock"],
  ["unavailable", "out_of_stock"],
  ["unknown", "unknown"]
]);

const sourceTypeMap = new Map([
  ["manual", "manual"],
  ["manual_csv", "manual"],
  ["direct_retailer", "retailer_feed"],
  ["retailer_feed", "retailer_feed"],
  ["retailer_api", "retailer_feed"],
  ["affiliate_feed", "affiliate_feed"],
  ["affiliate_network", "affiliate_feed"],
  ["tradetracker", "affiliate_feed"]
]);

const validPublicationStatuses = new Set(["feed_pending", "verified", "expired", "rejected"]);
const validAffiliateStatuses = new Set(["none", "direct_affiliate", "network_affiliate", "pending"]);

function showHelp() {
  console.log(`Gebruik:
  npm run check:retailer-sheet -- data/winkel-sheet.csv
  npm run import:retailer-sheet -- data/winkel-sheet.csv

Veiligheid:
  - check:retailer-sheet is altijd dry-run
  - import:retailer-sheet schrijft alleen bij geldige rijen naar data/offers.json
  - publicatie gebeurt pas wanneer publicationStatus=verified en de URL geen placeholder is`);
}

if (flags.has("--help")) {
  showHelp();
  process.exit(0);
}

if (flags.has("--write") && flags.has("--dry-run")) {
  throw new Error("Gebruik --write of --dry-run, niet allebei.");
}

function readJson(path) {
  return JSON.parse(readFileSync(resolve(root, path), "utf8"));
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (inQuotes && char === "\"" && next === "\"") {
      cell += "\"";
      index += 1;
      continue;
    }

    if (char === "\"") {
      inQuotes = !inQuotes;
      continue;
    }

    if (!inQuotes && char === ",") {
      row.push(cell);
      cell = "";
      continue;
    }

    if (!inQuotes && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows.filter((cells) => cells.some((value) => value.trim()));
}

function normalizeHeader(value, index) {
  const normalized = value.trim();
  return index === 0 ? normalized.replace(/^\uFEFF/, "") : normalized;
}

function normalizeCell(value) {
  return value.trim();
}

function parseSheet(path) {
  const csv = readFileSync(resolve(root, path), "utf8");
  const rows = parseCsv(csv);

  if (!rows.length) {
    return { headers: [], records: [] };
  }

  const headers = rows[0].map(normalizeHeader);
  const records = rows.slice(1).map((row, index) => {
    const record = { rowNumber: index + 2 };

    headers.forEach((header, headerIndex) => {
      record[header] = normalizeCell(row[headerIndex] ?? "");
    });

    return record;
  });

  return { headers, records };
}

function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parsePrice(record) {
  if (record.priceCents) {
    const cents = Number(record.priceCents.replace(/[^\d-]/g, ""));
    return Number.isInteger(cents) && cents > 0 ? cents / 100 : null;
  }

  if (record.price) {
    const parsed = Number(record.price.replace(/[^\d,.-]/g, "").replace(",", "."));
    return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed * 100) / 100 : null;
  }

  return null;
}

function parseDate(value) {
  if (!value) return null;

  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? null : parsed;
}

function normalizeAvailability(value) {
  return availabilityMap.get(value.trim().toLowerCase()) ?? null;
}

function normalizeSourceType(value) {
  return sourceTypeMap.get(value.trim().toLowerCase()) ?? null;
}

function isPlaceholderUrl(value) {
  const normalized = value.toLowerCase();
  return normalized.includes("example.com") || normalized.includes("localhost") || normalized.includes("127.0.0.1");
}

function parseUrl(value) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function domainMatches(url, domain) {
  if (!domain) return false;

  const cleanDomain = domain.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  const cleanHost = url.hostname.toLowerCase().replace(/^www\./, "");

  return cleanHost === cleanDomain || cleanHost.endsWith(`.${cleanDomain}`);
}

function splitSizes(value) {
  return value
    .split(/[|,;]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function affiliateNetworkFor(record, sourceType) {
  const normalizedSourceName = record.sourceName.trim();

  if (record.sourceType.trim().toLowerCase() === "tradetracker") return "TradeTracker";
  if (sourceType === "affiliate_feed" && normalizedSourceName) return normalizedSourceName;

  return undefined;
}

function buildOfferId(shoeId, record, selectedUrl) {
  const uniqueSource = record.externalProductId || record.sku || record.gtin || record.ean || selectedUrl;
  const uniquePart = slugify(uniqueSource).slice(0, 38) || "manual";

  return `offer-${shoeId}-${slugify(record.retailerName)}-${uniquePart}`.slice(0, 120);
}

function validateRecord(record, shoesBySlug) {
  const errors = [];
  const warnings = [];
  const shoe = shoesBySlug.get(record.shoeSlug);
  const selectedUrl = record.affiliateUrl || record.productUrl;
  const parsedProductUrl = parseUrl(record.productUrl);
  const parsedAffiliateUrl = record.affiliateUrl ? parseUrl(record.affiliateUrl) : null;
  const parsedSelectedUrl = parseUrl(selectedUrl);
  const price = parsePrice(record);
  const availability = normalizeAvailability(record.availability);
  const sourceType = normalizeSourceType(record.sourceType);
  const publicationStatus = record.publicationStatus.trim();
  const affiliateStatus = record.affiliateStatus.trim();
  const lastCheckedDate = parseDate(record.lastCheckedAt);
  const validUntilDate = parseDate(record.validUntil);

  if (!record.shoeSlug) errors.push("shoeSlug ontbreekt.");
  if (record.shoeSlug && !shoe) errors.push(`shoeSlug '${record.shoeSlug}' bestaat niet in data/shoes.json.`);
  if (!record.retailerName) errors.push("retailerName ontbreekt.");
  if (!record.retailerDomain) errors.push("retailerDomain ontbreekt.");
  if (!record.productUrl) errors.push("productUrl ontbreekt.");
  if (!selectedUrl) errors.push("productUrl of affiliateUrl ontbreekt.");
  if (!parsedProductUrl) errors.push(`productUrl is ongeldig: ${record.productUrl || "(leeg)"}.`);
  if (record.affiliateUrl && !parsedAffiliateUrl) errors.push(`affiliateUrl is ongeldig: ${record.affiliateUrl}.`);
  if (!parsedSelectedUrl) errors.push(`Gekozen URL is ongeldig: ${selectedUrl || "(leeg)"}.`);
  if (parsedProductUrl && isPlaceholderUrl(parsedProductUrl.href)) errors.push("productUrl mag geen placeholder-, localhost- of test-URL zijn.");
  if (parsedAffiliateUrl && isPlaceholderUrl(parsedAffiliateUrl.href)) errors.push("affiliateUrl mag geen placeholder-, localhost- of test-URL zijn.");
  if (parsedProductUrl && record.retailerDomain && !domainMatches(parsedProductUrl, record.retailerDomain)) {
    errors.push(`retailerDomain '${record.retailerDomain}' past niet bij productUrl-host '${parsedProductUrl.hostname}'.`);
  }
  if (price === null) errors.push("priceCents of price moet een positief bedrag bevatten.");
  if (record.currency !== "EUR") errors.push("currency moet EUR zijn.");
  if (!availability) errors.push(`availability '${record.availability}' is onbekend.`);
  if (!sourceType) errors.push(`sourceType '${record.sourceType}' is onbekend.`);
  if (!validPublicationStatuses.has(publicationStatus)) errors.push(`publicationStatus '${publicationStatus}' is onbekend.`);
  if (!validAffiliateStatuses.has(affiliateStatus)) errors.push(`affiliateStatus '${affiliateStatus}' is onbekend.`);
  if (!lastCheckedDate) errors.push("lastCheckedAt ontbreekt of is geen geldige datum.");

  if (publicationStatus === "verified" && affiliateStatus === "pending") {
    errors.push("publicationStatus=verified mag niet samen met affiliateStatus=pending.");
  }
  if (publicationStatus === "verified" && availability === "out_of_stock") {
    errors.push("Een out_of_stock offer mag niet verified gepubliceerd worden.");
  }
  if (publicationStatus === "verified" && validUntilDate && validUntilDate < new Date()) {
    errors.push("validUntil is verlopen; zet publicationStatus op expired of controleer opnieuw.");
  }
  if (availability === "unknown") warnings.push("availability=unknown: UI moet beschikbaarheid bij winkel laten controleren.");
  if (record.affiliateUrl && affiliateStatus === "none") {
    warnings.push("affiliateUrl is gevuld maar affiliateStatus=none.");
  }
  if (!record.externalProductId && !record.sku && !record.ean && !record.gtin) {
    warnings.push("Geen externalProductId, SKU, EAN of GTIN; deduplicatie is minder sterk.");
  }

  return {
    availability,
    errors,
    lastCheckedDate,
    offer: shoe && parsedSelectedUrl && price !== null && availability && sourceType && validPublicationStatuses.has(publicationStatus) ? {
      id: buildOfferId(shoe.id, record, parsedSelectedUrl.href),
      shoeId: shoe.id,
      retailer: record.retailerName,
      price,
      currency: "EUR",
      availability,
      url: parsedSelectedUrl.href,
      offerStatus: publicationStatus,
      lastCheckedAt: record.lastCheckedAt,
      sourceType,
      isAffiliate: affiliateStatus === "direct_affiliate" || affiliateStatus === "network_affiliate" || sourceType === "affiliate_feed",
      affiliateNetwork: affiliateNetworkFor(record, sourceType),
      externalOfferId: record.externalProductId || record.sku || undefined,
      gtin: record.gtin || record.ean || undefined,
      sizeAvailability: record.sizeAvailability ? splitSizes(record.sizeAvailability) : undefined
    } : null,
    publicationStatus,
    shoe,
    warnings
  };
}

function mergeOffers(existingOffers, importedOffers) {
  const importedById = new Map(importedOffers.map((offer) => [offer.id, offer]));
  const merged = existingOffers.map((offer) => importedById.get(offer.id) ?? offer);
  const existingIds = new Set(existingOffers.map((offer) => offer.id));

  importedOffers.forEach((offer) => {
    if (!existingIds.has(offer.id)) merged.push(offer);
  });

  return merged;
}

const { headers, records } = parseSheet(inputPath);
const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));

if (missingHeaders.length) {
  throw new Error(`Sheet mist verplichte kolommen: ${missingHeaders.join(", ")}`);
}

const shoes = readJson("data/shoes.json");
const offers = readJson("data/offers.json");
const shoesBySlug = new Map(shoes.map((shoe) => [shoe.slug, shoe]));
const validationResults = records.map((record) => ({ record, ...validateRecord(record, shoesBySlug) }));
const errors = validationResults.flatMap((result) => result.errors.map((message) => `Rij ${result.record.rowNumber}: ${message}`));
const warnings = validationResults.flatMap((result) => result.warnings.map((message) => `Rij ${result.record.rowNumber}: ${message}`));
const validOffers = validationResults.map((result) => result.offer).filter(Boolean);
const verifiedOffers = validOffers.filter((offer) => offer.offerStatus === "verified");
const publicVerifiedOffers = verifiedOffers.filter((offer) => !isPlaceholderUrl(offer.url));
const duplicateIds = validOffers
  .map((offer) => offer.id)
  .filter((id, index, ids) => ids.indexOf(id) !== index);

if (duplicateIds.length) {
  errors.push(`Dubbele offer-id's in sheet: ${[...new Set(duplicateIds)].join(", ")}`);
}

console.log(`Retailer sheet: ${basename(inputPath)}`);
console.log(`Modus: ${dryRun ? "dry-run" : "write"}`);
console.log(`Rijen: ${records.length}`);
console.log(`Geldige offers: ${validOffers.length}`);
console.log(`Verified publieke offers: ${publicVerifiedOffers.length}`);
console.log(`Warnings: ${warnings.length}`);
console.log(`Errors: ${errors.length}`);

if (warnings.length) {
  console.log("\nWarnings:");
  warnings.forEach((warning) => console.log(`- ${warning}`));
}

if (errors.length) {
  console.log("\nErrors:");
  errors.forEach((error) => console.log(`- ${error}`));
  throw new Error("Import afgebroken door validatiefouten.");
}

if (dryRun) {
  console.log("\nDry-run klaar. Geen bestanden aangepast. Gebruik npm run import:retailer-sheet -- <csv-pad> om te schrijven.");
  process.exit(0);
}

const mergedOffers = mergeOffers(offers, validOffers);
writeFileSync(resolve(root, "data/offers.json"), `${JSON.stringify(mergedOffers, null, 2)}\n`);

console.log(`\ndata/offers.json bijgewerkt: ${offers.length} -> ${mergedOffers.length} offers.`);
