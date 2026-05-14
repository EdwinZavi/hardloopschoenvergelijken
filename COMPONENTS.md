# COMPONENTS.md

## Purpose

This document defines the first reusable UI component system for the MVP.

The goal is to avoid designing each page from scratch.
Instead, the product should be built from a consistent set of components that support:

- clarity
- comparison
- guidance
- trust
- conversion

## Component Principles

Every component should follow these rules:

- support decision-making, not decoration
- be understandable at a glance
- work for both beginner and advanced users
- keep product facts, editorial opinion, and retailer data clearly separated
- be reusable across multiple pages

## Component Categories

The first component library should include:

- layout components
- product components
- filter components
- comparison components
- recommendation components
- trust components
- retail components
- content components

## 1. Layout Components

### PageShell

Purpose:

- provide a consistent page frame

Contains:

- header
- main content area
- footer

### SectionBlock

Purpose:

- create predictable vertical rhythm and grouping

Props:

- title
- intro optional
- background style optional
- spacing size

### Grid

Purpose:

- support cards and dense comparison layouts

Variants:

- 2-column
- 3-column
- 4-column
- responsive stack

## 2. Product Components

### ProductCard

Purpose:

- represent one shoe inside lists, landing pages, and results

Required content:

- brand
- model
- shoe type or use-case label
- 2 to 4 key specs
- editorial score
- review score optional
- price from
- compare action

Optional content:

- best-for label
- badge such as best value
- image

Primary actions:

- view product
- add to compare

### ProductHero

Purpose:

- anchor the top of the product detail page

Contains:

- product name
- image
- category label
- price from
- compare CTA

### SpecList

Purpose:

- show key structured attributes in a compact, readable way

Typical fields:

- support
- cushioning
- responsiveness
- weight
- drop
- fit width
- carbon plate
- waterproofing

### ProductSummaryBlock

Purpose:

- translate raw product data into decision language

Contains:

- best for
- less suitable for
- short verdict

## 3. Filter Components

### FilterPanel

Purpose:

- contain and organize all listing filters

Behaviors:

- desktop sidebar
- mobile drawer
- sticky where useful

### FilterGroup

Purpose:

- display one filter category

Examples:

- brand
- price
- support
- cushioning

Types:

- checkbox group
- radio group
- range slider
- segmented control

### ActiveFilterBar

Purpose:

- show active filters and allow quick removal

Contains:

- selected chips
- clear-all action

### SortControl

Purpose:

- let users reorder results clearly

## 4. Comparison Components

### CompareTray

Purpose:

- keep selected products visible across pages

Contains:

- selected product chips
- count
- compare CTA

### ComparisonTable

Purpose:

- show side-by-side product differences

Required rows:

- use case
- support
- cushioning
- responsiveness
- fit
- weight
- drop
- editorial score
- review score
- price

### DifferenceHighlight

Purpose:

- surface key differences without forcing users to scan the full table

Examples:

- lightest option
- most stable
- lowest price

## 5. Recommendation Components

### ChoiceHelperIntro

Purpose:

- set expectations for the guided flow

Contains:

- short explanation
- duration cue
- start CTA

### QuestionStep

Purpose:

- represent one choice-helper question

Contains:

- question title
- supporting text optional
- answer options
- next action

### RecommendationCard

Purpose:

- present a recommended shoe with a clear rationale

Contains:

- product identity
- short reason
- strengths
- trade-off
- compare CTA
- view product CTA

### ReasonBlock

Purpose:

- explain why the system matched a shoe

Examples:

- suitable for runners wanting more stability on longer road runs
- better if you prefer softer cushioning over speed

## 6. Trust Components

### ScoreBadge

Purpose:

- show editorial score clearly and consistently

Variants:

- overall
- per-category

### ScoreBreakdown

Purpose:

- show how a shoe performs across multiple dimensions

Contains:

- overall score
- sub-scores
- short explanation

### MethodologyLink

Purpose:

- connect score displays to trust explanation

### ProsConsBlock

Purpose:

- communicate balanced judgment

Contains:

- pros
- cons

### TrustStrip

Purpose:

- reinforce credibility in key parts of the product

Examples:

- how we score
- how reviews work
- how prices are updated

## 7. Review Components

### ReviewBadge

Purpose:

- show aggregate review value in compact form

Contains:

- average rating
- review count

### ReviewSummary

Purpose:

- summarize user sentiment

Contains:

- average rating
- key highlights
- common praise
- common complaints

### ReviewCard

Purpose:

- show one individual review

Contains:

- rating
- title
- excerpt
- runner context
- helpful action optional

## 8. Retail Components

### PriceBadge

Purpose:

- surface the lowest visible price without overpowering the page

Contains:

- price from
- retailer count optional

### RetailOfferRow

Purpose:

- show one retailer offer

Contains:

- retailer name
- current price
- availability
- delivery note optional
- buy CTA

### OffersTable

Purpose:

- list multiple retailer offers in a compact comparison format

## 9. Content Components

### IntroBlock

Purpose:

- introduce a page or category in a concise way

### FAQBlock

Purpose:

- answer recurring questions with minimal friction

### RelatedLinksBlock

Purpose:

- guide users toward helpful next pages

## Cross-Component Rules

All components should follow these rules:

- use Dutch for user-facing labels
- keep actions clear and literal
- never hide important trade-offs
- make compare actions visible in product-heavy contexts
- show trust cues where a user is close to deciding
- keep retailer CTAs secondary to product understanding

## MVP Component Priority

Build these components first:

1. PageShell
2. ProductCard
3. FilterPanel
4. FilterGroup
5. ActiveFilterBar
6. CompareTray
7. ComparisonTable
8. ProductHero
9. ProductSummaryBlock
10. ScoreBadge
11. ScoreBreakdown
12. RetailOfferRow
13. RecommendationCard
14. QuestionStep

## Component Success Criteria

The component system is successful if it:

- speeds up page building
- creates consistent UX across flows
- strengthens clarity and trust
- supports both browse and guidance journeys

## Immediate Next Step

After this document, the best next implementation artifacts are:

- low-fidelity wireframes
- component props definitions
- first frontend folder structure
