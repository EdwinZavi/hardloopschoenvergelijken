import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const dryRun = process.argv.includes("--dry-run");

function loadEnvLocal() {
  const envPath = resolve(root, ".env.local");

  try {
    const content = readFileSync(envPath, "utf8");

    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) continue;

      const separator = trimmed.indexOf("=");
      if (separator === -1) continue;

      const key = trimmed.slice(0, separator).trim();
      const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, "");

      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    if (!dryRun) {
      throw new Error(".env.local niet gevonden. Voeg SUPABASE_SERVICE_ROLE_KEY lokaal toe voordat je feed staging seedt.");
    }
  }
}

function readJson(path) {
  return JSON.parse(readFileSync(resolve(root, path), "utf8"));
}

function requireEnv(key) {
  const value = process.env[key];

  if (!value) throw new Error(`Ontbrekende env var: ${key}`);

  return value;
}

function key(value) {
  return value?.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function includesKey(source, target) {
  const sourceKey = key(source);
  const targetKey = key(target);

  return Boolean(sourceKey && targetKey && sourceKey.includes(targetKey));
}

function normalizePrice(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (!value) return null;

  const parsed = Number(String(value).replace(/[^\d,.-]/g, "").replace(",", "."));

  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeAvailability(value) {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) return "unknown";
  if (["available", "in_stock", "instock", "in stock"].includes(normalized)) return "in_stock";
  if (["low_stock", "low stock", "limited"].includes(normalized)) return "low_stock";
  if (["out_of_stock", "outofstock", "out of stock", "unavailable"].includes(normalized)) return "out_of_stock";

  return "unknown";
}

function warningsForRecord(record) {
  const warnings = [];

  if (!record.url) warnings.push("Mist URL");
  if (record.price === undefined || record.price === "") warnings.push("Mist geldige prijs");
  if (!record.imageUrl) warnings.push("Geen afbeeldingskandidaat");
  if (!record.brand || !record.productName) warnings.push("Mist merk of productnaam");

  return warnings;
}

function matchShoe(record, shoes) {
  const reasons = [];
  const brandMatches = shoes.filter((shoe) => key(shoe.brand) === key(record.brand));
  const candidates = brandMatches.length ? brandMatches : shoes;

  const exact = candidates.find((shoe) => key(shoe.model) === key(record.model) && key(shoe.version) === key(record.version));

  if (exact) {
    return {
      shoe: exact,
      confidence: record.gtin || record.ean ? "exact" : "high",
      source: record.gtin || record.ean ? "gtin_model_version" : "model_version",
      reason: record.gtin || record.ean ? "GTIN/EAN aanwezig met model- en versiematch." : "Model en versie komen overeen, zonder GTIN/EAN."
    };
  }

  const modelMatch = candidates.find((shoe) => includesKey(record.productName, shoe.model) && includesKey(record.productName, shoe.version));

  if (modelMatch) {
    return {
      shoe: modelMatch,
      confidence: "medium",
      source: "product_name_model_version",
      reason: "Productnaam bevat model en versie; variant handmatig controleren."
    };
  }

  const weakMatch = candidates.find((shoe) => includesKey(record.productName, shoe.model));

  if (weakMatch) {
    return {
      shoe: weakMatch,
      confidence: "low",
      source: "product_name_model",
      reason: "Productnaam lijkt op model, maar versie of variant is onzeker."
    };
  }

  reasons.push("Geen betrouwbare match gevonden op merk, model, versie of productnaam.");

  return {
    shoe: null,
    confidence: "none",
    source: "no_match",
    reason: reasons.join(" ")
  };
}

function buildImportStats(records, shoes) {
  const rows = records.map((record) => {
    const warnings = warningsForRecord(record);
    const match = matchShoe(record, shoes);
    const normalizedPrice = normalizePrice(record.price);
    const hasOfferCandidate = Boolean(record.url && normalizedPrice !== null);
    const publishable = hasOfferCandidate && match.shoe && warnings.length === 0 && ["exact", "high", "medium"].includes(match.confidence);

    return { match, normalizedPrice, publishable, warnings };
  });

  return {
    total_records: records.length,
    normalized_records: rows.filter((row) => row.normalizedPrice !== null).length,
    matched_records: rows.filter((row) => row.match.shoe).length,
    rejected_records: rows.filter((row) => row.warnings.length > 0).length,
    publishable_records: rows.filter((row) => row.publishable).length,
    warning_count: rows.reduce((sum, row) => sum + row.warnings.length, 0),
    error_count: 0
  };
}

function mapFeedRecord(record, feedImport) {
  const normalizedPrice = normalizePrice(record.price);
  const warnings = warningsForRecord(record);

  return {
    provider: record.provider,
    source_name: record.sourceName,
    source_record_id: record.externalId ?? record.sku ?? null,
    external_id: record.externalId ?? null,
    retailer_name: record.retailer ?? null,
    brand_name: record.brand ?? null,
    product_name: record.productName ?? null,
    model: record.model ?? null,
    version: record.version ?? null,
    gtin: record.gtin ?? null,
    ean: record.ean ?? null,
    sku: record.sku ?? null,
    raw_price: record.price === undefined ? null : String(record.price),
    normalized_price: normalizedPrice,
    currency: record.currency ?? null,
    raw_availability: record.availability ?? null,
    normalized_availability: normalizeAvailability(record.availability),
    product_url: record.url || null,
    image_url: record.imageUrl ?? null,
    size_labels: record.sizes ?? [],
    raw_payload: record.rawPayload ?? record,
    normalized_payload: {
      normalizedPrice,
      normalizedAvailability: normalizeAvailability(record.availability),
      warnings
    },
    import_status: warnings.length ? "needs_review" : feedImport.status,
    staged_offer_status: warnings.length ? "rejected" : "feed_pending",
    warnings,
    rejection_reason: warnings.length ? warnings.join("; ") : null,
    imported_at: record.importedAt
  };
}

function mapImageCandidate(record, feedRecordId, shoeId) {
  if (!record.imageUrl) return null;

  return {
    feed_record_id: feedRecordId,
    shoe_id: shoeId,
    external_id: record.externalId ?? record.sku ?? null,
    image_url: record.imageUrl,
    source_url: record.url || null,
    source_name: record.sourceName,
    source_type: record.provider === "tradetracker" ? "tradetracker_feed" : "retailer_feed",
    image_status: "feed_pending",
    license_status: record.provider === "tradetracker" ? "feed_allowed" : "needs_review",
    last_checked_at: record.importedAt
  };
}

async function insertRows(supabase, table, rows) {
  if (!rows.length) return [];

  const { data, error } = await supabase.from(table).insert(rows).select("*");

  if (error) throw new Error(`${table} insert mislukt: ${error.message}`);

  return data ?? [];
}

async function seedImport(supabase, feedImport, shoes) {
  const stats = buildImportStats(feedImport.records, shoes);
  const existingImportIds = await findExistingImportIds(supabase, feedImport.id);

  await deleteExistingImageCandidates(supabase, feedImport, existingImportIds);

  const { error: deleteError } = await supabase.from("feed_imports").delete().eq("source_reference", feedImport.id);
  if (deleteError) throw new Error(`Bestaande feedimport verwijderen mislukt: ${deleteError.message}`);

  const { data: importRows, error: importError } = await supabase
    .from("feed_imports")
    .insert({
      provider: feedImport.provider,
      source_name: feedImport.sourceName,
      source_reference: feedImport.id,
      import_status: feedImport.status,
      started_at: feedImport.importedAt,
      completed_at: feedImport.importedAt,
      ...stats,
      metadata: {
        seedSource: "data/feed-imports.json",
        note: "Demo stagingdata; niet publiek publiceren."
      }
    })
    .select("id")
    .single();

  if (importError) throw new Error(`feed_imports insert mislukt: ${importError.message}`);

  const feedRecordRows = feedImport.records.map((record) => ({
    import_id: importRows.id,
    ...mapFeedRecord(record, feedImport)
  }));
  const insertedRecords = await insertRows(supabase, "feed_records", feedRecordRows);

  const matchRows = [];
  const imageRows = [];

  insertedRecords.forEach((feedRecord, index) => {
    const rawRecord = feedImport.records[index];
    const match = matchShoe(rawRecord, shoes);

    matchRows.push({
      feed_record_id: feedRecord.id,
      shoe_id: match.shoe?.id ?? null,
      match_confidence: match.confidence,
      match_source: match.source,
      match_reason: match.reason,
      is_selected: Boolean(match.shoe && ["exact", "high", "medium"].includes(match.confidence)),
      needs_review: match.confidence !== "exact",
      score: match.confidence === "exact" ? 1 : match.confidence === "high" ? 0.9 : match.confidence === "medium" ? 0.65 : match.confidence === "low" ? 0.35 : 0
    });

    const imageCandidate = mapImageCandidate(rawRecord, feedRecord.id, match.shoe?.id ?? null);
    if (imageCandidate) imageRows.push(imageCandidate);
  });

  await insertRows(supabase, "feed_record_matches", matchRows);
  await insertRows(supabase, "image_candidates", imageRows);

  return {
    id: feedImport.id,
    ...stats,
    matches: matchRows.length,
    image_candidates: imageRows.length
  };
}

async function findExistingImportIds(supabase, sourceReference) {
  const { data, error } = await supabase.from("feed_imports").select("id").eq("source_reference", sourceReference);

  if (error) throw new Error(`Bestaande feedimports zoeken mislukt: ${error.message}`);

  return (data ?? []).map((row) => row.id);
}

async function deleteExistingImageCandidates(supabase, feedImport, importIds) {
  const externalIds = feedImport.records.map((record) => record.externalId ?? record.sku).filter(Boolean);

  if (importIds.length) {
    const { data: records, error: recordsError } = await supabase.from("feed_records").select("id").in("import_id", importIds);

    if (recordsError) throw new Error(`Bestaande feedrecords zoeken mislukt: ${recordsError.message}`);

    const recordIds = (records ?? []).map((record) => record.id);

    if (recordIds.length) {
      const { error } = await supabase.from("image_candidates").delete().in("feed_record_id", recordIds);

      if (error) throw new Error(`Bestaande image candidates verwijderen mislukt: ${error.message}`);
    }
  }

  if (externalIds.length) {
    const { error } = await supabase.from("image_candidates").delete().eq("source_name", feedImport.sourceName).in("external_id", externalIds);

    if (error) throw new Error(`Orphan image candidates verwijderen mislukt: ${error.message}`);
  }
}

async function countRows(supabase, table) {
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });

  if (error) throw new Error(`${table} count mislukt: ${error.message}`);

  return count ?? 0;
}

async function main() {
  loadEnvLocal();

  const feedImports = readJson("data/feed-imports.json");
  const shoes = readJson("data/shoes.json");

  const dryRunSummary = feedImports.map((feedImport) => ({
    id: feedImport.id,
    provider: feedImport.provider,
    source_name: feedImport.sourceName,
    ...buildImportStats(feedImport.records, shoes)
  }));

  if (dryRun) {
    console.log("Feed staging dry-run afgerond. Geen databasewrites uitgevoerd.");
    console.table(dryRunSummary);
    return;
  }

  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  console.log("Feed staging seed gestart.");
  console.table(dryRunSummary);

  const results = [];
  for (const feedImport of feedImports) {
    results.push(await seedImport(supabase, feedImport, shoes));
  }

  console.log("Feed staging seed afgerond.");
  console.table(results);
  console.table({
    feed_imports: await countRows(supabase, "feed_imports"),
    feed_records: await countRows(supabase, "feed_records"),
    feed_record_matches: await countRows(supabase, "feed_record_matches"),
    image_candidates: await countRows(supabase, "image_candidates"),
    admin_reviews: await countRows(supabase, "admin_reviews")
  });
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
