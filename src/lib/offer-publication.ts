import type { Offer, OfferStatus } from "@/types/product";

const placeholderHosts = new Set(["example.com", "localhost", "127.0.0.1", "0.0.0.0", "::1"]);
const publicAvailability = new Set<Offer["availability"]>(["in_stock", "low_stock"]);

export function getOfferStatus(offer: Offer): OfferStatus {
  return offer.offerStatus ?? "placeholder";
}

export function isPlaceholderOfferUrl(url: string) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return placeholderHosts.has(hostname) || hostname.endsWith(".example.com");
  } catch {
    return true;
  }
}

export function hasPublicAvailability(offer: Offer) {
  return publicAvailability.has(offer.availability);
}

export function hasValidLastCheckedAt(offer: Offer) {
  return Boolean(offer.lastCheckedAt && !Number.isNaN(Date.parse(offer.lastCheckedAt)));
}

export function isPublicOffer(offer: Offer) {
  return getOfferStatus(offer) === "verified" && !isPlaceholderOfferUrl(offer.url) && hasPublicAvailability(offer) && hasValidLastCheckedAt(offer);
}
