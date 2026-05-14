import type { ImageLicenseStatus, ImageSourceType, ImageStatus, Offer, OfferSourceType, OfferStatus } from "@/types/product";

export type FeedProviderType = "tradetracker" | "retailer_api" | "retailer_feed" | "manual_csv";

export type FeedImportStatus = "received" | "normalized" | "matched" | "needs_review" | "rejected" | "published";

export type FeedMatchConfidence = "none" | "low" | "medium" | "high" | "exact";

export type FeedRecordReviewAction =
  | "approve_offer_candidate"
  | "reject_offer_candidate"
  | "needs_manual_match"
  | "ignore_record"
  | "approve_image_candidate"
  | "reject_image_candidate";

export type FeedRecordReviewDecision = {
  action: FeedRecordReviewAction;
  reviewedAt: string;
};

export type RawFeedRecord = {
  provider: FeedProviderType;
  sourceName: string;
  importedAt: string;
  externalId?: string;
  brand?: string;
  productName?: string;
  model?: string;
  version?: string;
  gtin?: string;
  ean?: string;
  sku?: string;
  retailer?: string;
  price?: string | number;
  currency?: string;
  availability?: string;
  url?: string;
  imageUrl?: string;
  sizes?: string[];
  rawPayload?: Record<string, unknown>;
};

export type FeedImageCandidate = {
  shoeId?: string;
  externalId?: string;
  imageUrl: string;
  sourceUrl?: string;
  sourceName: string;
  sourceType: ImageSourceType;
  imageStatus: ImageStatus;
  licenseStatus: ImageLicenseStatus;
  lastCheckedAt: string;
};

export type NormalizedFeedOffer = Omit<Offer, "id" | "shoeId"> & {
  externalOfferId?: string;
  matchedShoeId?: string;
  matchConfidence: FeedMatchConfidence;
  importStatus: FeedImportStatus;
  rawBrand?: string;
  rawProductName?: string;
};

export type FeedImportResult = {
  provider: FeedProviderType;
  sourceName: string;
  importedAt: string;
  offers: NormalizedFeedOffer[];
  imageCandidates: FeedImageCandidate[];
  warnings: string[];
};

export type FeedPublicationRule = {
  offerStatus: OfferStatus;
  sourceType: OfferSourceType;
  requiresMatchedShoe: boolean;
  requiresLastCheckedAt: boolean;
  requiresNonPlaceholderUrl: boolean;
};
