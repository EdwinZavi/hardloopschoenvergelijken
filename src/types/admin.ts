export type AdminSeedStatus = "demo_seed";

export type AdminAnalyticsTopPage = {
  path: string;
  title: string;
  pageViews: number;
  visitors: number;
  conversionSignal: "choice_helper" | "comparison" | "affiliate_click" | "newsletter" | "content";
};

export type AdminAnalyticsFunnelStep = {
  id: string;
  label: string;
  visitors: number;
  conversionRateFromPrevious: number | null;
};

export type AdminAnalytics = {
  seedStatus: AdminSeedStatus;
  dataSource: "demo_seed_no_external_tracking";
  generatedAt: string;
  period: {
    month: string;
    locale: "nl-NL";
  };
  visitorsThisMonth: number;
  visitorsLastMonth: number;
  pageViews: number;
  choiceHelperStarts: number;
  comparisonStarts: number;
  affiliateClicks: number;
  accountsTotal: number;
  accountsNewThisMonth: number;
  newsletterSubscribers: number;
  returningVisitorRate: number;
  topPages: AdminAnalyticsTopPage[];
  funnel: AdminAnalyticsFunnelStep[];
};

export type AdminAccountRole = "owner" | "product_owner" | "editor" | "data_manager" | "support";
export type AdminAccountStatus = "active" | "invited" | "disabled";
export type AdminAccountMfaStatus = "enabled" | "pending" | "disabled";

export type AdminAccount = {
  id: string;
  seedStatus: AdminSeedStatus;
  name: string;
  email: string;
  role: AdminAccountRole;
  status: AdminAccountStatus;
  lastLoginAt: string | null;
  mfaStatus: AdminAccountMfaStatus;
  createdAt: string;
  notes?: string;
};
