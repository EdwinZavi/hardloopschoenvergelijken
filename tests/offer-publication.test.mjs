import assert from "node:assert/strict";
import { describe, test } from "node:test";
import offers from "../data/offers.json" with { type: "json" };
import { getOfferStatus, isPlaceholderOfferUrl, isPublicOffer } from "../src/lib/offer-publication.ts";

function offer(overrides = {}) {
  return {
    id: "test-offer",
    shoeId: "nike-pegasus-41",
    retailer: "Test Retailer",
    price: 129.95,
    currency: "EUR",
    availability: "in_stock",
    url: "https://retailer.example-product.nl/nike-pegasus-41",
    offerStatus: "verified",
    lastCheckedAt: "2026-07-04T00:00:00.000Z",
    ...overrides
  };
}

describe("offer publication rules", () => {
  test("missing offerStatus is fail-closed", () => {
    const candidate = offer({ offerStatus: undefined });

    assert.equal(getOfferStatus(candidate), "placeholder");
    assert.equal(isPublicOffer(candidate), false);
  });

  test("placeholder and local URLs never become public", () => {
    const blockedUrls = [
      "https://example.com/asics-gel-kayano-31",
      "https://shop.example.com/asics-gel-kayano-31",
      "http://localhost:3000/asics-gel-kayano-31",
      "http://127.0.0.1/asics-gel-kayano-31",
      "not a url"
    ];

    for (const url of blockedUrls) {
      assert.equal(isPlaceholderOfferUrl(url), true, `${url} is treated as placeholder`);
      assert.equal(isPublicOffer(offer({ url })), false, `${url} is not public`);
    }
  });

  test("verified public offers require stock and a valid freshness timestamp", () => {
    assert.equal(isPublicOffer(offer()), true, "complete verified offer can be public");
    assert.equal(isPublicOffer(offer({ availability: "unknown" })), false, "unknown availability is private");
    assert.equal(isPublicOffer(offer({ availability: "out_of_stock" })), false, "out of stock is private");
    assert.equal(isPublicOffer(offer({ lastCheckedAt: undefined })), false, "missing freshness is private");
    assert.equal(isPublicOffer(offer({ lastCheckedAt: "not-a-date" })), false, "invalid freshness is private");
    assert.equal(isPublicOffer(offer({ offerStatus: "expired" })), false, "expired offers are private");
  });

  test("current seed offers stay private until retailer data is verified", () => {
    assert.equal(offers.filter(isPublicOffer).length, 0);
  });
});
