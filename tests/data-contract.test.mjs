import assert from "node:assert/strict";
import { describe, test } from "node:test";
import brands from "../data/brands.json" with { type: "json" };
import offers from "../data/offers.json" with { type: "json" };
import shoes from "../data/shoes.json" with { type: "json" };

const shoeTypes = new Set(["daily_trainer", "tempo", "race", "stability", "trail", "recovery"]);
const surfaceTypes = new Set(["road", "track", "trail", "mixed"]);
const supportTypes = new Set(["neutral", "light_stability", "stability"]);
const levels = new Set(["low", "medium", "high"]);
const fitProfiles = new Set(["snug", "regular", "roomy"]);
const widthLabels = new Set(["narrow", "regular", "wide"]);
const scoreStatuses = new Set(["seed_estimate", "editorial_reviewed", "tested"]);
const dataStatuses = new Set(["draft", "needs_review", "verified"]);

function uniqueValues(items, key) {
  return new Set(items.map((item) => item[key]));
}

describe("catalog data contract", () => {
  test("brands, shoe ids and slugs are unique and linked", () => {
    assert.ok(brands.length >= 1, "catalog must contain active brands");
    assert.equal(uniqueValues(brands, "id").size, brands.length, "brand ids must be unique");
    assert.equal(uniqueValues(shoes, "id").size, shoes.length, "shoe ids must be unique");
    assert.equal(uniqueValues(shoes, "slug").size, shoes.length, "shoe slugs must be unique");

    const brandIds = new Set(brands.map((brand) => brand.id));
    for (const shoe of shoes) {
      assert.ok(brandIds.has(shoe.brandId), `${shoe.id} references a known brand`);
      assert.ok(shoe.fullName.includes(shoe.brand), `${shoe.id} fullName includes the brand`);
    }
  });

  test("shoe records expose all comparison and recommendation fields", () => {
    for (const shoe of shoes) {
      assert.ok(shoeTypes.has(shoe.shoeType), `${shoe.id} has a supported shoeType`);
      assert.ok(surfaceTypes.has(shoe.surfaceType), `${shoe.id} has a supported surfaceType`);
      assert.ok(supportTypes.has(shoe.supportType), `${shoe.id} has a supported supportType`);
      assert.ok(levels.has(shoe.cushioningLevel), `${shoe.id} has a supported cushioningLevel`);
      assert.ok(levels.has(shoe.responsivenessLevel), `${shoe.id} has a supported responsivenessLevel`);
      assert.ok(fitProfiles.has(shoe.fitProfile), `${shoe.id} has a supported fitProfile`);
      assert.ok(widthLabels.has(shoe.widthLabel), `${shoe.id} has a supported widthLabel`);
      assert.ok(Number.isInteger(shoe.releaseYear) && shoe.releaseYear >= 2018, `${shoe.id} has a credible releaseYear`);
      assert.ok(Number.isFinite(shoe.weightGrams) && shoe.weightGrams > 0, `${shoe.id} has weight`);
      assert.ok(Number.isFinite(shoe.heelDropMm) && shoe.heelDropMm >= 0, `${shoe.id} has heel drop`);
      assert.equal(typeof shoe.hasCarbonPlate, "boolean", `${shoe.id} has carbon flag`);
      assert.equal(typeof shoe.isWaterproof, "boolean", `${shoe.id} has waterproof flag`);
    }
  });

  test("editorial scores, statuses and verdicts are complete", () => {
    const scoreKeys = ["overall", "comfort", "cushioning", "stability", "responsiveness", "grip", "versatility", "valueForMoney"];

    for (const shoe of shoes) {
      assert.ok(dataStatuses.has(shoe.dataStatus ?? "needs_review"), `${shoe.id} has a supported dataStatus`);
      assert.ok(scoreStatuses.has(shoe.scoreStatus ?? "seed_estimate"), `${shoe.id} has a supported scoreStatus`);

      for (const key of scoreKeys) {
        assert.ok(shoe.editorialScore[key] >= 0 && shoe.editorialScore[key] <= 10, `${shoe.id}.${key} score is 0-10`);
      }

      assert.ok(shoe.editorialVerdict.bestFor.length > 20, `${shoe.id} has bestFor copy`);
      assert.ok(shoe.editorialVerdict.lessSuitableFor.length > 20, `${shoe.id} has lessSuitableFor copy`);
      assert.ok(shoe.editorialVerdict.summary.length > 20, `${shoe.id} has summary copy`);
    }
  });

  test("offers reference existing shoes and valid euro prices", () => {
    const shoeIds = new Set(shoes.map((shoe) => shoe.id));

    for (const offer of offers) {
      assert.ok(shoeIds.has(offer.shoeId), `${offer.id} references an existing shoe`);
      assert.equal(offer.currency, "EUR", `${offer.id} uses EUR`);
      assert.ok(Number.isFinite(offer.price) && offer.price > 0, `${offer.id} has a positive price`);
      assert.ok(["in_stock", "low_stock", "out_of_stock", "unknown"].includes(offer.availability), `${offer.id} has supported availability`);
    }
  });
});
