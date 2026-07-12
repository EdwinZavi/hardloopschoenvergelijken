import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { describe, test } from "node:test";

const baseUrl = process.env.TEST_BASE_URL ?? "http://localhost:3001";

function request(path) {
  const url = new URL(path, baseUrl).toString();

  try {
    return execFileSync("curl", ["-sS", "-L", "--fail", "--max-time", "15", url], {
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024
    });
  } catch (error) {
    const stderr = error && typeof error === "object" && "stderr" in error ? String(error.stderr) : "";
    throw new Error(`Route smoke request failed for ${url}${stderr ? `\n${stderr}` : ""}`);
  }
}

function countH1(html) {
  return (html.match(/<h1(?:\s|>)/g) ?? []).length;
}

const routes = [
  {
    path: "/",
    mustContain: ["Vind hardloopschoenen zonder giswerk.", "Nike Alphafly 3", "Populaire hardloopschoenen"],
    mustNotContain: ["Waarom vergelijken via Loopwijzer?"]
  },
  {
    path: "/schoenen",
    mustContain: ["Hardloopschoenen vergelijken", "Filter je shortlist", "Prijs blijft los van score"]
  },
  {
    path: "/keuzehulp",
    mustContain: ["Welke hardloopschoen past bij jou?", "Hoe ervaren ben je en hoe vaak loop je?"]
  },
  {
    path: "/vergelijken?ids=nike-pegasus-41,hoka-clifton-9,brooks-ghost-16",
    mustContain: ["Belangrijkste verschillen", "Nike Pegasus 41", "HOKA Clifton 9", "Brooks Ghost 16"]
  },
  {
    path: "/advies",
    mustContain: ["Begin bij je loopdoel, niet bij een merknaam"]
  },
  {
    path: "/methodologie",
    mustContain: ["Hoe we hardloopschoenen beoordelen"]
  },
  {
    path: "/onafhankelijkheid",
    mustContain: ["Hoe we vertrouwen en commercie gescheiden houden"]
  },
  {
    path: "/contact",
    mustContain: ["Contactgegevens", "Commercie bepaalt geen advies"]
  },
  {
    path: "/schoenen/nike-pegasus-41",
    mustContain: ["Nike Pegasus 41", "Redactionele score", "Past wanneer"]
  },
  {
    path: "/advies/beginners",
    mustContain: ["Beginnen met hardlopen"]
  },
  {
    path: "/en",
    mustContain: ["Find the running shoe that truly fits you.", "Popular running shoes"]
  },
  {
    path: "/en/shoes",
    mustContain: ["Compare running shoes"]
  },
  {
    path: "/en/compare",
    mustContain: ["Choose 2 to 4 shoes to compare"]
  },
  {
    path: "/en/methodology",
    mustContain: ["How we compare running shoes"]
  }
];

describe(`rendered route smoke (${baseUrl})`, () => {
  for (const route of routes) {
    test(`${route.path} renders core content`, () => {
      const html = request(route.path);

      assert.ok(html.includes("<main"), `${route.path} renders a main landmark`);
      assert.equal(countH1(html), 1, `${route.path} renders exactly one H1`);

      for (const text of route.mustContain) {
        assert.ok(html.includes(text), `${route.path} includes "${text}"`);
      }

      for (const text of route.mustNotContain ?? []) {
        assert.equal(html.includes(text), false, `${route.path} does not include removed content "${text}"`);
      }
    });
  }

  test("/api/catalog/shoes returns public comparison data", () => {
    const payload = JSON.parse(request("/api/catalog/shoes"));

    assert.ok(Array.isArray(payload.items), "catalog response has an items array");
    assert.ok(payload.items.length >= 10, "catalog exposes enough shoes for comparison");

    const sample = payload.items.find((shoe) => shoe.slug === "nike-pegasus-41");
    assert.ok(sample, "catalog includes Nike Pegasus 41");
    assert.equal(typeof sample.editorialScore.overall, "number", "sample exposes editorial score");
    assert.ok("priceFrom" in sample, "sample exposes public price status");
    assert.ok("imageUrl" in sample, "sample exposes product image field");
  });
});
