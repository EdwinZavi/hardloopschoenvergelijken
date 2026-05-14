# SEED-DATA.md

## Purpose

This document defines the first seed data strategy for the MVP.

The seed set should be large enough to make filtering, comparison, and recommendations feel real, but small enough to stay manageable and high quality.

## Seed Data Principles

The first dataset should prioritize:

- quality over volume
- coverage over randomness
- comparability over completeness
- realism over inflated scale

The first dataset is not meant to represent the entire market.
It is meant to make the MVP useful and believable.

## Recommended Seed Size

Start with:

- 30 to 60 shoe variants

This range is enough to:

- power filters
- create meaningful comparison states
- support multiple user types
- test recommendation logic

## Coverage Strategy

The seed set should include a balanced spread across key user needs.

### Include at least:

- daily trainers
- stability shoes
- tempo shoes
- race shoes
- trail shoes
- beginner-friendly models
- long-distance oriented models
- lower-priced options
- premium options

## Brand Coverage

The first seed set should include recognizable brands that Dutch users are likely to know.

Suggested initial brand pool:

- ASICS
- Nike
- adidas
- HOKA
- Brooks
- Saucony
- New Balance
- Mizuno
- On

This list can be narrowed or expanded based on available data quality.

## Seed Data Requirements Per Shoe

Every included shoe should have at least:

- brand
- model
- version
- category
- primary use case
- support type
- cushioning level
- responsiveness level
- fit profile or width cue
- weight
- drop
- carbon plate yes or no
- waterproof yes or no
- editorial score
- short editorial summary
- best for
- less suitable for
- minimum one price point if available

## Suggested Editorial Score Dimensions

Each seeded shoe should have a score across:

- comfort
- cushioning
- stability
- responsiveness
- grip
- versatility
- value for money

Plus:

- overall score

## Suggested Seed Segments

The first seed should cover these practical groups:

### Daily Trainers

Purpose:

- broad mainstream appeal
- ideal for beginners and recreational runners

### Stability Shoes

Purpose:

- support recommendation flow for runners needing extra guidance

### Tempo and Speed Shoes

Purpose:

- support runners comparing performance trade-offs

### Race Shoes

Purpose:

- create aspirational and technical comparison value

### Trail Shoes

Purpose:

- ensure the platform is not road-only from day one

## Suggested Data Format

The first seed can be maintained in JSON or CSV.

Recommended practical setup:

- `brands.json`
- `shoes.json`
- `offers.json`

Optional later:

- `reviews.json`
- `recommendation-rules.json`

## Suggested Example Shoe Record

```json
{
  "slug": "asics-gel-kayano-31",
  "brand": "ASICS",
  "model": "Gel-Kayano",
  "version": "31",
  "fullName": "ASICS Gel-Kayano 31",
  "shoeType": "stability",
  "primaryUseCase": "daily_trainer",
  "surfaceType": "road",
  "supportType": "stability",
  "cushioningLevel": "high",
  "responsivenessLevel": "medium",
  "fitProfile": "regular",
  "widthLabel": "regular",
  "weightGrams": 305,
  "heelDropMm": 10,
  "hasCarbonPlate": false,
  "isWaterproof": false,
  "editorialScore": {
    "overall": 8.4,
    "comfort": 8.8,
    "cushioning": 8.7,
    "stability": 9.1,
    "responsiveness": 6.9,
    "grip": 7.8,
    "versatility": 8.0,
    "valueForMoney": 7.4
  },
  "editorialVerdict": {
    "bestFor": "Runners who want stable, cushioned comfort for regular road training.",
    "lessSuitableFor": "Runners looking for a light and aggressive speed-focused ride.",
    "summary": "A reliable stability trainer with a comfortable and protective feel."
  }
}
```

## Recommended Seed File Structure

Suggested structure:

- `/data/brands.json`
- `/data/shoes.json`
- `/data/offers.json`

Optional:

- `/data/reviews.json`
- `/data/recommendation-rules.json`

## Data Entry Rules

When creating seed entries:

- use controlled values wherever possible
- keep naming consistent
- separate facts from editorial interpretation
- avoid missing key fields in seeded records
- prefer fewer complete records over many partial ones

## Offer Seed Rules

Each shoe should ideally have:

- 1 to 3 retailer offers in the first seed

Each offer should include:

- retailer name
- price
- url placeholder if needed
- availability

## Review Seed Rules

For the MVP, reviews may start in one of two ways:

- no seeded user reviews, only editorial layer
- a very small structured review set for selected models

If reviews are seeded, they should include:

- rating
- short title
- short body
- runner context

## Recommendation Seed Rules

The first dataset should support these recommendation patterns:

- beginner road runner
- runner needing stability
- runner seeking soft cushioning
- runner seeking speed
- runner with wider fit preference
- trail runner
- budget-conscious runner

This means the seed set must contain enough variation to power real recommendations.

## Seed Dataset Success Criteria

The first seed is strong if it allows us to:

- filter usefully
- compare meaningful alternatives
- populate a credible homepage and listing
- generate different recommendation outcomes
- avoid repetitive or one-dimensional results

## Immediate Next Step

After this document, the best next move is to create:

- the actual `/data` folder
- a first `shoes.json`
- a first `brands.json`
- a first `offers.json`
