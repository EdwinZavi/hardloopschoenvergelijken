export type ShoeType = "daily_trainer" | "tempo" | "race" | "stability" | "trail" | "recovery";
export type SurfaceType = "road" | "track" | "trail" | "mixed";
export type SupportType = "neutral" | "light_stability" | "stability";
export type Level = "low" | "medium" | "high";
export type FitProfile = "snug" | "regular" | "roomy";
export type WidthLabel = "narrow" | "regular" | "wide";
export type DataStatus = "draft" | "needs_review" | "verified";
export type ScoreStatus = "seed_estimate" | "editorial_reviewed" | "tested";
export type ReleaseDatePrecision = "year" | "month" | "day";
export type OfferStatus = "placeholder" | "feed_pending" | "verified" | "expired" | "rejected";
export type OfferSourceType = "manual" | "affiliate_feed" | "retailer_feed";
export type ImageSourceType = "tradetracker_feed" | "retailer_feed" | "brand_press" | "manual_verified";
export type ImageStatus = "missing" | "feed_pending" | "verified" | "rejected";
export type ImageLicenseStatus = "feed_allowed" | "brand_allowed" | "needs_review";

export type EditorialScore = {
  overall: number;
  comfort: number;
  cushioning: number;
  stability: number;
  responsiveness: number;
  grip: number;
  versatility: number;
  valueForMoney: number;
};

export type EditorialVerdict = {
  bestFor: string;
  lessSuitableFor: string;
  summary: string;
};

export type Shoe = {
  id: string;
  slug: string;
  brandId: string;
  brand: string;
  model: string;
  version: string;
  fullName: string;
  imageUrl?: string;
  imageStatus?: ImageStatus;
  imageSourceType?: ImageSourceType;
  imageSourceName?: string;
  imageSourceUrl?: string;
  imageLastCheckedAt?: string;
  imageLicenseStatus?: ImageLicenseStatus;
  dataStatus?: DataStatus;
  scoreStatus?: ScoreStatus;
  releaseYear: number;
  releaseMonth?: number;
  releaseDate?: string;
  releaseDatePrecision?: ReleaseDatePrecision;
  releaseDateSource?: string;
  shoeType: ShoeType;
  primaryUseCase: string;
  surfaceType: SurfaceType;
  distanceBucket: string;
  supportType: SupportType;
  cushioningLevel: Level;
  responsivenessLevel: Level;
  fitProfile: FitProfile;
  widthLabel: WidthLabel;
  weightGrams: number;
  heelDropMm: number;
  stackHeightHeelMm?: number;
  hasCarbonPlate: boolean;
  isWaterproof: boolean;
  editorialScore: EditorialScore;
  editorialVerdict: EditorialVerdict;
};

export type Brand = {
  id: string;
  slug: string;
  name: string;
  isActive: boolean;
};

export type Offer = {
  id: string;
  shoeId: string;
  retailer: string;
  price: number;
  currency: "EUR";
  availability: "in_stock" | "low_stock" | "out_of_stock" | "unknown";
  url: string;
  offerStatus?: OfferStatus;
  lastCheckedAt?: string;
  sourceType?: OfferSourceType;
  isAffiliate?: boolean;
  affiliateNetwork?: string;
  externalOfferId?: string;
  gtin?: string;
  sizeAvailability?: string[];
};

export type EnrichedShoe = Shoe & {
  dataStatus: DataStatus;
  scoreStatus: ScoreStatus;
  priceFrom: number | null;
  retailerCount: number;
};
