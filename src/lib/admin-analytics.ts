import "server-only";

import adminAccountsData from "../../data/admin-accounts.json";
import adminAnalyticsData from "../../data/admin-analytics.json";
import type { AdminAccount, AdminAnalytics } from "@/types/admin";

export const adminAnalytics = adminAnalyticsData as AdminAnalytics;
export const adminAccounts = adminAccountsData as AdminAccount[];

export function getAdminAnalytics() {
  return adminAnalytics;
}

export function getAdminAccounts() {
  return adminAccounts;
}
