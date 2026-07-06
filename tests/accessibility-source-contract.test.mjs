import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, test } from "node:test";

function source(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("accessibility and responsive source contracts", () => {
  test("language switch exposes the selected language and target language", () => {
    const chrome = source("src/components/SiteChrome.tsx");

    assert.ok(chrome.includes('aria-label={isEnglish ? "Language selector" : "Taalkeuze"}'), "language switch has a localized group label");
    assert.ok(chrome.includes('"Nederlands geselecteerd"'), "Dutch active state is announced");
    assert.ok(chrome.includes('"Switch to Dutch"'), "English pages expose a Dutch target label");
    assert.ok(chrome.includes('"English selected"'), "English active state is announced");
    assert.ok(chrome.includes('"Schakel naar Engels"'), "Dutch pages expose an English target label");
  });

  test("mobile header does not hide primary navigation links without an alternative menu", () => {
    const css = source("src/app/globals.css");

    assert.equal(css.includes(".site-header-home nav > a:nth-of-type"), false, "primary nav links must stay visible on small screens");
    assert.ok(css.includes(".site-header-home nav") && css.includes("flex-wrap: wrap"), "mobile nav wraps instead of clipping routes");
  });

  test("animated shoe carousel pauses for focus and stops auto-motion on touch or reduced motion", () => {
    const css = source("src/app/globals.css");

    assert.ok(css.includes(".home-carousel-shell:focus-within .home-shoe-track"), "keyboard focus pauses the carousel");
    assert.ok(css.includes("(prefers-reduced-motion: reduce)"), "reduced motion users are respected");
    assert.ok(css.includes("(pointer: coarse)"), "touch users are not forced into an auto-moving carousel");
    assert.ok(css.includes("animation: none"), "touch/reduced-motion mode removes carousel animation");
  });

  test("disabled compare controls explain why the action is unavailable", () => {
    const productCard = source("src/components/ProductCard.tsx");
    const pickerItem = source("src/components/CompareShoePickerItem.tsx");

    for (const component of [productCard, pickerItem]) {
      assert.ok(component.includes('aria-disabled="true"'), "disabled state remains machine-readable");
      assert.ok(component.includes('role="note"'), "disabled state is exposed as explanatory copy");
      assert.ok(component.includes("Verwijder eerst een andere schoen uit je vergelijking."), "disabled state tells the user how to recover");
    }
  });
});
