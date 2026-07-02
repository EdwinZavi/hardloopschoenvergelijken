# Data README

This folder contains the first seed dataset for the MVP.

## Files

- `brands.json`: brand definitions
- `shoes.json`: core product records with editorial layer
- `offers.json`: retailer offer records
- `recommendation-rules.json`: explainable MVP recommendation rules, profile presets, scoring weights, trade-off rules, and trust rules
- `retailer-offer-template.csv`: CSV template for the first manual retailer offer pilot

## Feed/API direction

Feeddata should not be written directly into the public catalog.

The intended flow is:

1. Receive raw rows from TradeTracker, a retailer API, a retailer feed, or a manual CSV.
2. Store them as raw feed records.
3. Normalize them into staged offers and image candidates.
4. Match them to existing shoes using GTIN/EAN first, then brand, model and version.
5. Let admin review low-confidence matches.
6. Publish only verified offers and verified images.

Technical starting points:

- `src/types/feed.ts`
- `src/lib/feed-normalization.ts`
- `scripts/import-retailer-offers.mjs`
- `RETAILER-SHEET-IMPORT-RUNBOOK.md`
- `BACKEND-FEED-ROADMAP.md`

## Why this matters

This dataset is the first usable bridge between strategy and product.
It gives the platform enough structured content to support:

- listing pages
- filters
- comparison
- product detail pages
- first recommendation logic

## Notes

- The offer URLs are placeholders for now.
- The editorial scores are initial seed values, not final expert-tested output.
- The dataset is intentionally small and structured, so it stays easy to expand.
- Public UI must keep filtering placeholder offers until real verified offers are available.
