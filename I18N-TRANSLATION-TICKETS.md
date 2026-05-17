# NL/EN translation tickets

## Product decision

Dutch stays the primary version on the existing root routes. English lives under `/en`.

This protects the current Dutch MVP, keeps URLs shareable, and gives search engines a clear language structure. Do not use `?lang=en` as the long-term language model.

## Ticket I18N-1 - Foundation and language switch

**User problem:** Visitors need a visible NL/EN switch without breaking existing Dutch routes.

**Scope**

- Add English routes under `/en`.
- Add a language switch in the public header/footer.
- Keep Dutch routes unchanged.
- Keep the implementation server-first where possible.

**Acceptance criteria**

- `/` remains Dutch.
- `/en` opens the English homepage.
- Header shows clear NL/EN language choices.
- English navigation points to English routes.
- Dutch navigation points to Dutch routes.

## Ticket I18N-2 - Core taxonomy and labels

**User problem:** English pages must not show Dutch terms for filters, specs, support, cushioning, fit, price, and scores.

**Scope**

- Make enum labels locale-aware.
- Add English labels for shoe type, surface, support, cushioning, width, availability and price fallback.
- Add locale-aware price formatting while keeping EUR.

**Acceptance criteria**

- Product cards and comparison tables can render English labels.
- Dutch labels remain unchanged.
- No recommendation logic moves to the browser.

## Ticket I18N-3 - Catalog and comparison

**User problem:** English users need to browse and compare shoes without hitting Dutch UI labels.

**Scope**

- Translate `/en/shoes`.
- Translate `/en/compare`.
- Preserve URL-driven filters and compare IDs.
- Keep product facts server-side.

**Acceptance criteria**

- `/en/shoes` lists shoes with English UI labels.
- `/en/compare?ids=...` compares 2 to 4 shoes in English UI.
- Product verdict text is either translated or clearly handled as a known content gap.

## Ticket I18N-4 - Shoe Finder

**User problem:** The choice helper is a core guidance flow and must be fully understandable in English.

**Scope**

- Translate questions, options, progress, budget step and result labels.
- Translate recommendation card labels and explanation headings.
- Keep URL params stable.

**Acceptance criteria**

- `/en/shoe-finder` works without login.
- Recommendation logic stays server-side.
- English copy uses "Shoe Finder" for the flow and avoids hype.

## Ticket I18N-5 - Advice and SEO intent pages

**User problem:** English SEO/advice pages need proper English slugs and trustworthy content, not Dutch slug pages with translated fragments.

**Scope**

- Add English intent route mapping, e.g. `/en/advice/beginners`, `/en/advice/wide-feet`.
- Split intent page copy from filtering logic.
- Translate titles, intros, guidance blocks, FAQs and metadata.

**Acceptance criteria**

- Advice pages have English titles, intros and FAQ schema.
- Related links stay within the English route tree.
- Dutch advice pages remain unchanged.

## Ticket I18N-6 - Trust, legal and methodology pages

**User problem:** English trust pages must accurately explain independence, methodology, privacy and contact details.

**Scope**

- Translate methodology, independence, about, contact, privacy and cookies.
- Keep legal/company details correct.
- Avoid claims that are stronger than the Dutch version.

**Acceptance criteria**

- `/en/methodology`, `/en/independence`, `/en/about`, `/en/contact`, `/en/privacy`, `/en/cookies` exist.
- Copy is calm, practical and trust-first.
- Contact details remain factual.

## Ticket I18N-7 - Metadata, sitemap and hreflang

**User problem:** Search engines need to understand Dutch and English versions as separate language variants.

**Scope**

- Add locale-aware metadata.
- Add English URLs to sitemap.
- Add canonical and alternate language links where supported.

**Acceptance criteria**

- Dutch pages canonicalize to Dutch routes.
- English pages canonicalize to `/en` routes.
- Sitemap includes both language sets.

## English tone of voice

Use calm, practical, trust-first consumer English.

Prefer:

- helps you understand
- may suit you if
- less suitable if
- based on your answers
- editorial score
- personal match
- trade-offs
- retailer prices

Avoid:

- perfect shoe
- ultimate guide
- guaranteed
- top pick for everyone
- best ever
- must-have

