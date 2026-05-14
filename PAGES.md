# PAGES.md

## Purpose

This document defines the first page-by-page structure for the MVP.

It translates the information architecture into concrete page types, sections, components, and user actions.

The goal is to make building easier by answering:

- which pages exist
- what each page must do
- which sections each page needs
- which core actions each page should support

## Page Principles

Every page should do at least one of the following well:

- orient
- narrow
- explain
- compare
- reassure
- convert

Every page should make the next best action obvious.

## MVP Page Set

The first build should include these pages:

- Homepage
- All Shoes Listing Page
- Product Detail Page
- Comparison Page
- Choice Helper Page
- Methodology Page

Optional early extensions:

- Brand Page
- Intent Landing Page
- Reviews Overview Page

## 1. Homepage

### Purpose

The homepage should quickly explain the product and guide users into the right journey.

### Primary user questions

- What is this platform?
- Why should I trust it?
- Where do I start?

### Main user actions

- start the choice helper
- browse all shoes
- explore a common use case

### Recommended sections

1. Hero
Contains:
- headline
- short value proposition
- primary CTA to choice helper
- secondary CTA to browse all shoes

2. Trust strip
Contains:
- short methodology cue
- comparison cue
- review cue
- price cue

3. Start paths
Contains:
- beginner path
- compare directly path
- popular needs path

4. Popular intents
Examples:
- beginners
- marathon
- wide feet
- stability
- trail

5. Featured shoes or comparisons
Contains:
- selected products
- selected comparison cards

6. Editorial trust block
Contains:
- how we assess shoes
- link to methodology page

7. Footer
Contains:
- about
- methodology
- contact later if applicable
- legal and trust links

## 2. All Shoes Listing Page

### Purpose

Give users a structured overview of the market and let them narrow quickly.

### Primary user questions

- Which shoes are relevant?
- How do I narrow the options?
- What stands out immediately?

### Main user actions

- apply filters
- sort results
- open product page
- add products to compare

### Required sections

1. Page intro
Contains:
- page title
- short explanation
- result count

2. Filters
Initial filters:
- brand
- price
- use case
- distance
- support type
- cushioning
- fit width
- carbon plate
- waterproofing
- editorial score

3. Sort controls
Examples:
- best match
- highest editorial score
- lowest price
- lightest weight
- most reviewed

4. Result grid or list
Each card should show:
- brand and model
- shoe type
- 2 to 4 important specs
- editorial score
- review score if available
- price from
- compare action

5. Compare tray
Contains:
- selected products
- compare button

### Empty state

If no results match:
- explain that filters are too narrow
- suggest resetting one or two filters
- show a reset action

## 3. Product Detail Page

### Purpose

Help the user understand one shoe deeply enough to decide whether it belongs in their shortlist.

### Primary user questions

- What kind of shoe is this?
- Is it right for me?
- What are the trade-offs?
- How does it compare?
- Where can I buy it?

### Main user actions

- read verdict
- inspect specs
- compare with alternatives
- view retailer offers
- return to listing or helper

### Required sections

1. Product hero
Contains:
- brand and model
- category label
- price from
- primary image
- add to compare action

2. Recommendation summary
Contains:
- best for
- less suitable for
- short editorial verdict

3. Score breakdown
Contains:
- overall score
- category scores
- short explanation of what scores mean

4. Key specs
Contains:
- support type
- cushioning
- responsiveness
- weight
- drop
- fit width
- carbon plate
- waterproofing

5. Fit and ride notes
Contains:
- feel summary
- fit guidance
- practical interpretation

6. Reviews summary
Contains:
- average rating
- review count
- highlights if available

7. Retailer offers
Contains:
- seller name
- current price
- availability
- CTA

8. Alternatives
Contains:
- similar shoes
- compare links

9. FAQ or extra guidance
Contains:
- practical questions
- decision support content

## 4. Comparison Page

### Purpose

Help users compare multiple shoes side by side and understand meaningful differences.

### Primary user questions

- Which one suits me better?
- What are the most important differences?
- Which option gives better value?

### Main user actions

- inspect differences
- remove or replace products
- click into product pages
- choose a retailer path

### Required sections

1. Comparison header
Contains:
- compared product names
- change comparison set action

2. Quick takeaways
Contains:
- best for stability
- best for comfort
- lightest option
- lowest price

3. Comparison table
Rows should include:
- use case
- support type
- cushioning
- responsiveness
- fit profile
- width
- weight
- drop
- carbon plate
- waterproofing
- editorial score
- review score
- price from

4. Recommendation cues
Contains short language such as:
- better for long road runs
- better if you want more support
- better value option

5. Next-step actions
Contains:
- view product page
- view retailer offers

## 5. Choice Helper Page

### Purpose

Guide uncertain users toward a relevant shortlist.

### Primary user questions

- What kind of shoe do I need?
- Which trade-offs matter for me?
- Which options should I start with?

### Main user actions

- answer questions
- review shortlist
- compare suggested shoes

### Required sections

1. Intro
Contains:
- promise of the tool
- how long it takes
- clear CTA to start

2. Question steps
Suggested questions:
- experience level
- running goal
- preferred distance
- training frequency
- surface
- support need
- preferred feel
- fit preference
- budget

3. Result shortlist
Each result should show:
- brand and model
- short fit explanation
- main strengths
- compare action
- product page action

4. Explanation block
Contains:
- how we generated these results
- why different answers lead to different suggestions

## 6. Methodology Page

### Purpose

Build trust by explaining how the platform works.

### Primary user questions

- How are these scores made?
- How are recommendations created?
- How do reviews and prices work?
- Can I trust this platform?

### Main user actions

- read methodology
- understand score logic
- validate trust

### Required sections

1. How recommendations work
2. How editorial scores work
3. How reviews are handled
4. How retailer offers work
5. What we do and do not claim

## Optional 7. Brand Page

### Purpose

Group products from one brand and add useful context.

### Sections

- brand intro
- brand product list
- notable models
- compare links

## Optional 8. Intent Landing Page

### Purpose

Support a specific use case with both explanation and filtered discovery.

Examples:

- beste hardloopschoenen voor beginners
- hardloopschoenen voor brede voeten
- beste schoenen voor marathontraining

### Sections

- short intro
- what matters for this use case
- filtered results
- compare CTA

## Optional 9. Reviews Overview Page

### Purpose

Create a review-led browsing path.

### Sections

- most reviewed
- highest rated
- latest reviews
- review trust explanation

## Shared Components

These components should be designed for reuse across pages:

- product card
- compare button
- score badge
- review badge
- price badge
- retailer offer row
- filter group
- recommendation reason block
- trust explanation block

## Cross-Page Rules

Across the full MVP:

- users should always be able to compare from listing and product pages
- trust cues should appear on multiple pages
- prices should never overwhelm the recommendation logic
- user-facing language should stay clear and Dutch
- product facts and editorial opinion should remain visibly distinct

## Page Build Priority

Build pages in this order:

1. Homepage
2. Listing page
3. Product detail page
4. Comparison page
5. Choice helper
6. Methodology page

This order supports the core product loop first.

## Page Success Criteria

Pages are successful if they help users move through the decision journey:

- homepage starts the right journey
- listing page narrows quickly
- product page builds understanding
- comparison page clarifies trade-offs
- choice helper reduces uncertainty
- methodology page increases trust

## Immediate Next Step

After this document, the best next outputs are:

- a component inventory
- low-fidelity wireframe structure
- a JSON schema or seed data format for the first dataset
