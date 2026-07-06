import brandsData from "../../data/brands.json";
import offersData from "../../data/offers.json";
import shoesData from "../../data/shoes.json";
import { getOfferStatus as getPublishedOfferStatus, isPlaceholderOfferUrl, isPublicOffer as offerIsPublic } from "@/lib/offer-publication";
import type { Brand, EnrichedShoe, Offer, OfferStatus, Shoe, DataStatus, ScoreStatus } from "@/types/product";

export const brands = brandsData as Brand[];
export const shoes = shoesData as Shoe[];
export const offers = offersData as Offer[];

export function getShoeDataStatus(shoe: Shoe): DataStatus {
  return shoe.dataStatus ?? "needs_review";
}

export function getShoeScoreStatus(shoe: Shoe): ScoreStatus {
  return shoe.scoreStatus ?? "seed_estimate";
}

export function getOfferStatus(offer: Offer): OfferStatus {
  return getPublishedOfferStatus(offer);
}

export function isPlaceholderOffer(offer: Offer) {
  return isPlaceholderOfferUrl(offer.url);
}

export function isPublicOffer(offer: Offer) {
  return offerIsPublic(offer);
}

export function getOffersForShoe(shoeId: string) {
  return offers.filter((offer) => offer.shoeId === shoeId);
}

export function getPublicOffersForShoe(shoeId: string) {
  return getOffersForShoe(shoeId).filter(isPublicOffer);
}

export function getPriceFrom(shoeId: string) {
  const prices = getPublicOffersForShoe(shoeId).map((offer) => offer.price);
  return prices.length ? Math.min(...prices) : null;
}

export function getEnrichedShoes(): EnrichedShoe[] {
  return shoes.map((shoe) => {
    const shoeOffers = getPublicOffersForShoe(shoe.id);
    return {
      ...shoe,
      dataStatus: getShoeDataStatus(shoe),
      scoreStatus: getShoeScoreStatus(shoe),
      priceFrom: shoeOffers.length ? Math.min(...shoeOffers.map((offer) => offer.price)) : null,
      retailerCount: new Set(shoeOffers.map((offer) => offer.retailer)).size
    };
  });
}

export function getFeaturedShoes() {
  return getEnrichedShoes()
    .sort((a, b) => b.editorialScore.overall - a.editorialScore.overall)
    .slice(0, 4);
}

export function getReleaseSortValue(shoe: Shoe) {
  if (shoe.releaseDate) {
    const timestamp = Date.parse(shoe.releaseDate);

    if (!Number.isNaN(timestamp)) {
      return timestamp;
    }
  }

  if (shoe.releaseMonth) {
    return Date.UTC(shoe.releaseYear, shoe.releaseMonth - 1, 1);
  }

  return Date.UTC(shoe.releaseYear, 0, 1);
}

export function formatReleaseLabel(shoe: Shoe) {
  if (shoe.releaseDatePrecision === "day" && shoe.releaseDate) {
    const timestamp = Date.parse(shoe.releaseDate);

    if (!Number.isNaN(timestamp)) {
      return new Intl.DateTimeFormat("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(new Date(timestamp));
    }
  }

  if (shoe.releaseDatePrecision === "month" && shoe.releaseMonth) {
    return new Intl.DateTimeFormat("nl-NL", {
      month: "long",
      year: "numeric"
    }).format(new Date(Date.UTC(shoe.releaseYear, shoe.releaseMonth - 1, 1)));
  }

  return String(shoe.releaseYear);
}

export function getNewestReleaseShoes(limit = 5) {
  return getEnrichedShoes()
    .sort((a, b) => getReleaseSortValue(b) - getReleaseSortValue(a) || b.editorialScore.overall - a.editorialScore.overall || a.fullName.localeCompare(b.fullName))
    .slice(0, limit);
}
