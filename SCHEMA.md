# SCHEMA.md

## Purpose

This document defines the first functional data schema for the running shoe platform.

The schema must support:

- filtering
- comparison
- product pages
- recommendation logic
- editorial scoring
- reviews
- retailer offers

The goal is not database perfection.
The goal is a clean, scalable structure that supports the MVP and can grow without forcing a rewrite.

## Schema Principles

The schema should follow these rules:

- product truth is separate from retailer truth
- editorial judgment is separate from user opinion
- normalized where useful, practical where necessary
- designed for explainability, not only storage
- structured around the user decision process

## Core Entities

The first version of the schema should include these core entities:

- Brand
- ShoeModel
- ShoeVariant
- EditorialScore
- UserReview
- Retailer
- RetailOffer
- RecommendationProfile
- TaxonomyTerm

## Entity Overview

### Brand

Represents the shoe manufacturer.

Suggested fields:

- id
- slug
- name
- description
- country optional
- logo_url optional
- is_active

### ShoeModel

Represents the main product family.

Example:

- ASICS Gel-Kayano
- Nike Pegasus
- HOKA Clifton

Suggested fields:

- id
- slug
- brand_id
- name
- short_name optional
- category
- summary
- release_year
- status
- hero_image_url optional
- gender_scope
- is_featured

### ShoeVariant

Represents a specific version that users actually compare and buy.

Example:

- ASICS Gel-Kayano 31
- Nike Pegasus 41

In the MVP, ShoeVariant can function as the primary product page unit.

Suggested fields:

- id
- slug
- shoe_model_id
- full_name
- version_name
- version_number optional
- release_year
- msrp_amount
- currency
- primary_color optional
- gender_scope
- is_current
- is_waterproof
- has_carbon_plate
- image_url optional

## Product Attributes

These attributes should live on ShoeVariant or a closely related product table.

Suggested fields:

- shoe_type
- primary_use_case
- secondary_use_case optional
- surface_type
- distance_min_km optional
- distance_max_km optional
- support_type
- pronation_support_level
- cushioning_level
- responsiveness_level
- comfort_level optional
- grip_level optional
- durability_level optional
- fit_profile
- toe_box_width
- width_label optional
- weight_grams
- heel_drop_mm
- stack_height_heel_mm optional
- stack_height_forefoot_mm optional
- flexibility_level optional
- breathability_level optional
- waterproofing_level optional

## Editorial Layer

Editorial data must be explicit and separate from core product facts.

### EditorialScore

Suggested fields:

- id
- shoe_variant_id
- overall_score
- comfort_score
- cushioning_score
- stability_score
- responsiveness_score
- grip_score
- versatility_score
- durability_score optional
- value_for_money_score
- methodology_version
- tested_at optional
- reviewed_by optional
- confidence_note optional

### EditorialVerdict

Suggested fields:

- id
- shoe_variant_id
- best_for
- less_suitable_for
- summary
- pros_text
- cons_text
- fit_notes
- ride_notes

For the MVP, `EditorialVerdict` can also be merged into a content block on the product record if needed.

## Review Layer

### UserReview

User reviews should be structured enough to support relevance and trust.

Suggested fields:

- id
- shoe_variant_id
- rating_overall
- title
- body
- runner_level optional
- typical_distance optional
- primary_surface optional
- fit_feedback optional
- comfort_feedback optional
- durability_feedback optional
- verified_purchase optional
- helpful_count default 0
- status
- submitted_at

### ReviewAggregate

Suggested fields:

- shoe_variant_id
- review_count
- average_rating
- average_comfort_rating optional
- average_fit_rating optional
- average_durability_rating optional

## Retail Layer

### Retailer

Suggested fields:

- id
- slug
- name
- website_url
- logo_url optional
- trust_score optional
- shipping_note optional
- return_policy_note optional
- is_active

### RetailOffer

Retail offers must be separate from the product definition.

Suggested fields:

- id
- shoe_variant_id
- retailer_id
- url
- price_amount
- currency
- sale_price_amount optional
- availability_status
- size_range_note optional
- delivery_note optional
- last_checked_at
- is_featured_offer

## Recommendation Layer

### RecommendationProfile

Represents a user answer set from the choice helper.

Suggested fields:

- id
- experience_level
- running_goal
- target_distance
- weekly_frequency
- preferred_surface
- preferred_feel
- support_need
- injury_sensitivity optional
- fit_preference optional
- budget_min optional
- budget_max optional
- created_at

### RecommendationResult

Suggested fields:

- id
- recommendation_profile_id
- shoe_variant_id
- match_score
- primary_reason
- secondary_reason optional
- tradeoff_note optional
- rank_position

## Taxonomy Layer

Taxonomies should be defined clearly so filters, content, and recommendations use the same language.

### Suggested Taxonomy Groups

- brand
- shoe_type
- use_case
- surface_type
- distance_bucket
- support_type
- cushioning_level
- responsiveness_level
- fit_profile
- width_label
- feature_tag

### TaxonomyTerm

Suggested fields:

- id
- taxonomy_group
- slug
- label_nl
- label_en optional
- description optional
- sort_order
- is_active

## Suggested Enumerations

The first version should standardize key values.

### gender_scope

- men
- women
- unisex

### shoe_type

- daily_trainer
- tempo
- race
- stability
- trail
- recovery

### surface_type

- road
- track
- trail
- mixed

### support_type

- neutral
- light_stability
- stability

### cushioning_level

- low
- medium
- high

### responsiveness_level

- low
- medium
- high

### fit_profile

- snug
- regular
- roomy

### width_label

- narrow
- regular
- wide

### availability_status

- in_stock
- low_stock
- out_of_stock
- unknown

## Product Card Schema

The listing card needs a compact derived schema.

Suggested output fields:

- slug
- brand_name
- full_name
- hero_image_url
- shoe_type
- primary_use_case
- cushioning_level
- support_type
- weight_grams
- editorial_score
- review_score
- review_count
- price_from
- retailer_count
- compare_enabled

## Product Detail Page Schema

The product detail page should aggregate:

- product identity
- key specs
- editorial verdict
- score breakdown
- review aggregate
- selected user reviews
- retailer offers
- alternative shoes

## Comparison Schema

The comparison layer needs normalized comparable fields.

Suggested comparison attributes:

- shoe_type
- primary_use_case
- support_type
- cushioning_level
- responsiveness_level
- fit_profile
- width_label
- weight_grams
- heel_drop_mm
- stack_height_heel_mm
- has_carbon_plate
- is_waterproof
- editorial_score
- review_score
- price_from

## Filter Schema

Each filter should have:

- key
- label
- type
- allowed_values or range
- display_priority
- affects_listing yes/no

Suggested filter types:

- enum
- multi_enum
- boolean
- number_range
- score_range

## Derived Fields

The platform will benefit from derived fields for speed and UX.

Examples:

- price_from
- retailer_count
- average_rating
- compare_label
- best_for_snippet
- value_badge

These should be derived from source entities, not manually duplicated where avoidable.

## Minimum Seed Data Requirements

To make the MVP useful, the seed dataset should include:

- 1 brand record per included brand
- 1 shoe model record per model family
- 1 shoe variant record per actual product version
- editorial scores for each included shoe
- at least one retailer offer per included shoe where possible

If user reviews are not available yet, the schema should still support them from day one.

## MVP Simplification Rules

To avoid overengineering, the MVP may simplify as follows:

- ShoeModel and ShoeVariant can be merged if version complexity stays low
- EditorialVerdict can live on the product record
- RecommendationProfile can be stored as lightweight application data
- TaxonomyTerm can begin as controlled enums before moving into tables

## Schema Success Criteria

The schema is good if it allows us to:

- power useful filters
- generate meaningful comparisons
- explain recommendations
- separate product quality from retailer offers
- grow the platform without restructuring everything

## Immediate Next Step

After this schema, the next logical output is:

- a seed JSON or CSV structure
- the first filter configuration
- the first recommendation mapping logic
