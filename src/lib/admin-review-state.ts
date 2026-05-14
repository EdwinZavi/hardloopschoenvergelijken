import "server-only";

import { cookies } from "next/headers";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import type { FeedRecordReviewAction, FeedRecordReviewDecision } from "@/types/feed";

const reviewCookieName = "loopwijzer_import_reviews";

export type ImportReviewState = Record<string, Record<string, FeedRecordReviewDecision>>;

export function getRecordReviewKey(importId: string, recordKey: string) {
  return `${importId}:${recordKey}`;
}

export async function getImportReviewState(): Promise<ImportReviewState> {
  const cookieState = await getCookieReviewState();

  try {
    const databaseState = await getDatabaseReviewState();
    return mergeReviewStates(cookieState, databaseState);
  } catch {
    return cookieState;
  }
}

async function getCookieReviewState(): Promise<ImportReviewState> {
  const cookieStore = await cookies();
  const rawValue = cookieStore.get(reviewCookieName)?.value;
  if (!rawValue) return {};

  try {
    const parsed = JSON.parse(decodeURIComponent(rawValue));
    return typeof parsed === "object" && parsed ? parsed as ImportReviewState : {};
  } catch {
    return {};
  }
}

function mergeReviewStates(...states: ImportReviewState[]) {
  return states.reduce<ImportReviewState>((merged, state) => {
    for (const [importId, decisions] of Object.entries(state)) {
      merged[importId] = {
        ...(merged[importId] ?? {}),
        ...decisions
      };
    }

    return merged;
  }, {});
}

async function getDatabaseReviewState(): Promise<ImportReviewState> {
  const supabase = createServiceRoleClient();
  const [{ data: imports, error: importsError }, { data: records, error: recordsError }, { data: reviews, error: reviewsError }] = await Promise.all([
    supabase.from("feed_imports").select("id, source_reference"),
    supabase.from("feed_records").select("id, import_id, external_id, source_record_id"),
    supabase.from("admin_reviews").select("feed_import_id, feed_record_id, action, created_at").not("feed_record_id", "is", null).order("created_at")
  ]);

  if (importsError || recordsError || reviewsError) {
    throw new Error("Database review state kon niet worden geladen.");
  }

  const importIdByDbId = new Map((imports ?? []).map((item) => [item.id, item.source_reference ?? item.id]));
  const recordById = new Map((records ?? []).map((record) => [record.id, record]));
  const state: ImportReviewState = {};

  for (const review of reviews ?? []) {
    const importId = importIdByDbId.get(review.feed_import_id);
    const record = recordById.get(review.feed_record_id);
    const recordKey = record?.external_id ?? record?.source_record_id;

    if (!importId || !recordKey) continue;

    state[importId] = {
      ...(state[importId] ?? {}),
      [recordKey]: {
        action: review.action,
        reviewedAt: review.created_at
      }
    };
  }

  return state;
}

export async function getReviewDecision(importId: string, recordKey: string) {
  const state = await getImportReviewState();
  return state[importId]?.[recordKey];
}

export async function setReviewDecision(importId: string, recordKey: string, action: FeedRecordReviewAction) {
  const cookieStore = await cookies();
  const state = await getImportReviewState();
  const nextState: ImportReviewState = {
    ...state,
    [importId]: {
      ...(state[importId] ?? {}),
      [recordKey]: {
        action,
        reviewedAt: new Date().toISOString()
      }
    }
  };

  cookieStore.set(reviewCookieName, encodeURIComponent(JSON.stringify(nextState)), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  try {
    await setDatabaseReviewDecision(importId, recordKey, action);
  } catch {
    // Cookie fallback keeps local review UX working when Supabase admin access is unavailable.
  }
}

async function setDatabaseReviewDecision(importId: string, recordKey: string, action: FeedRecordReviewAction) {
  const supabase = createServiceRoleClient();
  const feedImport = await findFeedImport(supabase, importId);

  if (!feedImport) return;

  const { data: records, error: recordError } = await supabase
    .from("feed_records")
    .select("id")
    .eq("import_id", feedImport.id)
    .or(`external_id.eq.${recordKey},source_record_id.eq.${recordKey}`)
    .limit(1);

  if (recordError) throw new Error(recordError.message);

  const feedRecord = records?.[0];

  if (!feedRecord) return;

  const { data: matches, error: matchError } = await supabase
    .from("feed_record_matches")
    .select("id")
    .eq("feed_record_id", feedRecord.id)
    .eq("is_selected", true)
    .limit(1);

  if (matchError) throw new Error(matchError.message);

  const { data: images, error: imageError } = await supabase
    .from("image_candidates")
    .select("id")
    .eq("feed_record_id", feedRecord.id)
    .limit(1);

  if (imageError) throw new Error(imageError.message);

  const { error } = await supabase.from("admin_reviews").insert({
    feed_import_id: feedImport.id,
    feed_record_id: feedRecord.id,
    feed_record_match_id: matches?.[0]?.id ?? null,
    image_candidate_id: images?.[0]?.id ?? null,
    action,
    decision_status: decisionStatusForAction(action),
    reviewer_note: "MVP admin review vanuit Loopwijzer admin."
  });

  if (error) throw new Error(error.message);
}

async function findFeedImport(supabase: ReturnType<typeof createServiceRoleClient>, importId: string) {
  const { data: byReference, error: referenceError } = await supabase.from("feed_imports").select("id").eq("source_reference", importId).limit(1);

  if (referenceError) throw new Error(referenceError.message);
  if (byReference?.[0]) return byReference[0];

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(importId)) {
    return undefined;
  }

  const { data: byId, error: idError } = await supabase.from("feed_imports").select("id").eq("id", importId).limit(1);

  if (idError) throw new Error(idError.message);

  return byId?.[0];
}

function decisionStatusForAction(action: FeedRecordReviewAction) {
  if (action === "reject_offer_candidate" || action === "reject_image_candidate" || action === "ignore_record") {
    return "rejected";
  }

  return "needs_review";
}
