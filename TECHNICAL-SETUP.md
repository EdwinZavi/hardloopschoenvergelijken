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

## Rendering Policy: Server-First

The platform should default to server-rendered routes and React Server Components.

Why this matters:

- comparison, filtering, and choice-helper outcomes stay shareable through URLs
- pages remain easier to index, cache, and deploy
- less JavaScript is shipped to users
- product facts and recommendation logic stay close to trusted server data
- secrets such as the Supabase service role key never cross into the browser

Use `"use client"` only for a small, explicit browser interaction that cannot be handled cleanly with links, forms, CSS, native HTML, server actions, or URL search params.

Good reasons for a client component:

- local UI state such as an open mobile menu
- browser APIs such as focus handling, media queries, or storage
- progressive enhancement for an existing server-driven form
- realtime or authenticated browser behavior after RLS is configured
- optimistic UI where the user value clearly outweighs the hydration cost

Weak reasons for a client component:

- fetching catalog data in the browser by default
- keeping filter, compare, or choice-helper state only in React state
- wrapping full page trees in client providers for convenience
- using a client UI library when CSS, tokens, and server components are enough
- hiding recommendation or scoring logic in browser-only code

## Client Boundary Rules

Keep client components as small leaf islands.

Before adding `"use client"`, the ticket must answer:

1. What user interaction requires browser-side rendering?
2. Can this be solved with a link, form, server action, CSS, or native HTML?
3. What data crosses the server/client boundary?
4. Does the component expose product logic, private data, or secrets?
5. What is the hydration and performance cost?

Current allowed client islands:

- `src/components/SiteChrome.tsx`
  - allowed for navigation UI that needs local open/close state
- `src/components/AutoSubmitFilterForm.tsx`
  - allowed as progressive enhancement for server-driven filters
- `src/lib/supabase/client.ts`
  - allowed only for future browser-safe Supabase features with RLS

Catalog pages, product pages, comparison pages, methodology pages, and recommendation results should remain server-rendered by default.

Filtering should use URL search params as the source of truth.
Comparison should use URL state such as product IDs so comparisons remain shareable.
The choice helper should stay URL-driven until a logged-in personal environment requires saved progress.

## Rendering Validation

For product or frontend tickets, validate rendering decisions before completion:

- run `rg -n '"use client"' src`
- explain every new client boundary in the ticket or PR summary
- run typecheck and production build when code changes affect routes or components
- confirm no service role key, server-only module, or private data is imported by client code

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
