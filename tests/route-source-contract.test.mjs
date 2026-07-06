import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, test } from "node:test";

function source(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("route and component source contracts", () => {
  test("homepage keeps the popular shoe carousel directly below the hero", () => {
    const nlHome = source("src/app/page.tsx");
    const enHome = source("src/app/en/page.tsx");

    assert.equal(nlHome.includes("home-m3-section"), false, "removed NL M3 section must stay removed");
    assert.equal(enHome.includes("home-m3-section"), false, "removed EN M3 section must stay removed");

    assert.ok(nlHome.indexOf("home-carousel-section") > nlHome.indexOf("home-hero-section"), "NL carousel comes after hero");
    assert.ok(nlHome.indexOf("home-carousel-section") < nlHome.indexOf("home-proof-section"), "NL carousel comes before proof section");
    assert.ok(enHome.indexOf("home-carousel-section") > enHome.indexOf("home-hero-section"), "EN carousel comes after hero");
  });

  test("catalog API exposes fields needed by filters, comparison and explainability", () => {
    const route = source("src/app/api/catalog/shoes/route.ts");
    const requiredFields = [
      "primaryUseCase",
      "distanceBucket",
      "editorialScore",
      "editorialVerdict",
      "weightGrams",
      "heelDropMm",
      "hasCarbonPlate",
      "isWaterproof",
      "imageUrl",
      "priceFrom",
      "scoreStatus"
    ];

    for (const field of requiredFields) {
      assert.ok(route.includes(`${field}: shoe.${field}`), `catalog API maps ${field}`);
    }
  });

  test("comparison table actions have unique accessible labels", () => {
    const comparePage = source("src/app/vergelijken/page.tsx");

    assert.ok(comparePage.includes("aria-label={`Bekijk ${shoe.fullName}`}"), "view link is uniquely labelled");
    assert.ok(comparePage.includes("aria-label={`Verwijder ${shoe.fullName} uit vergelijking`}"), "remove link is uniquely labelled");
  });

  test("sitemap uses an explicit content date instead of request time", () => {
    const sitemap = source("src/app/sitemap.ts");

    assert.ok(sitemap.includes("contentLastModified"), "sitemap has explicit content date");
    assert.equal(sitemap.includes("const now = new Date()"), false, "sitemap must not refresh lastModified on every request");
  });
});
