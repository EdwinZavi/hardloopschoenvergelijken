"use server";

import { redirect } from "next/navigation";
import { clearAdminSession, createAdminSession, isAdminAuthenticated, verifyAdminPassword } from "@/lib/admin-auth";
import { setReviewDecision } from "@/lib/admin-review-state";
import type { FeedRecordReviewAction } from "@/types/feed";

export async function loginAdmin(formData: FormData) {
  if (!verifyAdminPassword(formData.get("password"))) {
    redirect("/admin/login?error=1");
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function reviewFeedRecord(formData: FormData) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const importId = stringValue(formData.get("importId"));
  const recordKey = stringValue(formData.get("recordKey"));
  const action = reviewActionValue(formData.get("action"));
  const returnTo = stringValue(formData.get("returnTo"));

  if (!importId || !recordKey || !action) {
    redirect(returnTo || "/admin/imports");
  }

  await setReviewDecision(importId, recordKey, action);
  redirect(returnTo && returnTo.startsWith(`/admin/imports/${importId}`) ? returnTo : `/admin/imports/${importId}`);
}

function stringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : undefined;
}

function reviewActionValue(value: FormDataEntryValue | null): FeedRecordReviewAction | undefined {
  if (
    value === "approve_offer_candidate" ||
    value === "reject_offer_candidate" ||
    value === "needs_manual_match" ||
    value === "ignore_record" ||
    value === "approve_image_candidate" ||
    value === "reject_image_candidate"
  ) {
    return value;
  }

  return undefined;
}
