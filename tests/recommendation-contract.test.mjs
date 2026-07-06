import assert from "node:assert/strict";
import { describe, test } from "node:test";
import rules from "../data/recommendation-rules.json" with { type: "json" };
import shoes from "../data/shoes.json" with { type: "json" };

const shoeIds = new Set(shoes.map((shoe) => shoe.id));

describe("recommendation contract", () => {
  test("score bands are ordered and cover useful recommendations", () => {
    const bands = rules.scoreModel.scoreBands;

    assert.ok(rules.scoreModel.minimumUsefulScore >= 0);
    assert.ok(rules.scoreModel.shortlistSize >= 3);
    assert.ok(bands.some((band) => band.min === rules.scoreModel.minimumUsefulScore), "minimum useful score has a label");

    for (let index = 1; index < bands.length; index += 1) {
      assert.ok(bands[index - 1].min > bands[index].min, "score bands are ordered high to low");
    }
  });

  test("profile presets only use declared input values", () => {
    for (const preset of rules.profilePresets) {
      for (const [key, value] of Object.entries(preset.profile)) {
        const input = rules.inputs[key];
        if (key === "budgetMax") {
          assert.equal(typeof value, "number", `${preset.id}.budgetMax is numeric`);
          continue;
        }

        assert.ok(input, `${preset.id}.${key} has an input definition`);
        assert.ok(input.values.includes(value), `${preset.id}.${key} value is declared`);
      }
    }
  });

  test("profile presets point to catalog shoes", () => {
    for (const preset of rules.profilePresets) {
      assert.ok(preset.expectedStrongMatches.length >= 1, `${preset.id} has expected matches`);

      for (const shoeId of preset.expectedStrongMatches) {
        assert.ok(shoeIds.has(shoeId), `${preset.id} expected match ${shoeId} exists in catalog`);
      }
    }
  });

  test("beginner safety remains visible in the rule documentation", () => {
    const penalties = rules.scoreModel.penalties;

    assert.ok(penalties.carbonRaceForBeginner < 0, "beginner carbon/race penalty is documented");
    assert.ok(rules.defaultHandling.injurySensitivity.includes("geen diagnose"), "injury copy avoids medical certainty");
  });
});
