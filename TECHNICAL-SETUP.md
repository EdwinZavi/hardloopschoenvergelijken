# TECHNICAL-SETUP.md

## Purpose

This document defines the first app setup for the MVP.

The technical structure should protect the product promise:

- product facts stay separate from retailer offers
- recommendations stay explainable
- comparison and filtering use structured data
- Dutch user-facing language is the default
- trust and methodology are first-class product surfaces

## Recommended Stack

Use Next.js with the App Router and TypeScript.

Why this fits:

- static data can power the MVP quickly
- file-based routes map cleanly to the IA
- server components can read seed JSON directly
- TypeScript keeps product fields, filters, and recommendation inputs consistent
- the app can later move from JSON to a database without changing the UX model

## First Folder Structure

- `data/`
  - seed data and recommendation rules
- `src/app/`
  - MVP routes: homepage, listing, product detail, choice helper, methodology
- `src/components/`
  - reusable product, recommendation, trust, comparison, and retail components
- `src/lib/`
  - data access, labels, recommendation logic, derived fields
- `src/types/`
  - product and recommendation contracts

## MVP Routes

- `/`
  - orientation, primary split between choice helper and browse
- `/schoenen`
  - listing and future faceted filtering
- `/schoenen/[slug]`
  - product truth, editorial verdict, specs, retailer offers
- `/keuzehulp`
  - first guided recommendation surface
- `/methodologie`
  - trust layer explaining recommendation and scoring logic

## Build Order

1. Typed data access and derived fields
2. Listing page with static filters
3. Product detail page
4. Recommendation engine connected to choice helper answers
5. Comparison tray and comparison page
6. Methodology page with score and recommendation transparency

## Key Trade-Off

The MVP starts rule-based instead of machine-learning based.

That is intentional: explainability matters more than prediction sophistication at this stage. Users need to understand why a shoe is recommended before the platform earns the right to become more automated.
