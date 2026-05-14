IA.md
Purpose
This document defines the first information architecture for the running shoe platform.

Its job is to translate the product vision into a clear page structure, navigation model, content hierarchy, and user flow.

The information architecture must support 4 core outcomes:

understanding
personal fit
comparison
confidence
IA Principles
The structure of the platform should always optimize for:

fast orientation
clear next steps
low cognitive load
explainable recommendations
structured comparison
trust through visibility and transparency
The platform should never feel like:

a messy webshop
a generic affiliate site
a blog with random comparison pages
a technical database without guidance
Core Navigation Model
The first version of the platform should be built around these navigation pillars:

Home
Hardloopschoenen vergelijken
Keuzehulp
Schoenen
Vergelijken
Reviews
Uitleg en advies
This creates a clear split between:

browse and filter
guided recommendation
product detail
comparison
trust and education
Primary User Journeys
The platform must support three primary journeys.

1. Browse-first journey
This is for users who already want to explore shoes directly.

Flow:

Home -> listing page -> filters -> product detail -> compare -> retailer choice

2. Guidance-first journey
This is for users who do not know what they need yet.

Flow:

Home -> keuzehulp -> shortlist -> product detail -> compare -> retailer choice

3. Validation-first journey
This is for users who already know a shoe name and want confirmation.

Flow:

Search or landing page -> product detail -> reviews -> compare -> retailer choice

Site Hierarchy
Level 1
Homepage
All running shoes listing
Choice helper
Comparison page
Reviews hub
Advice hub
Level 2
Filtered listing pages by intent
Product detail pages
Brand pages
Use-case pages
Methodology page
Review overview pages
Level 3
Retailer offers section
Editorial score breakdowns
User review subviews
Related alternatives
Comparison result states
Page Types
Homepage
Goal:

explain the value proposition quickly
offer a clear route into browse or guidance
build trust early
Main modules:

hero with clear promise
primary CTA to keuzehulp
secondary CTA to vergelijken/browse
trust block explaining methodology
popular use cases
popular shoe categories
featured comparisons or guides
All Running Shoes Listing
Goal:

provide structured market overview
enable narrowing via filters
support scanability and comparison
Main modules:

filter sidebar or mobile filter drawer
sort controls
result list
quick comparison actions
editorial or review signals on cards
price from / number of retailers
Filtered Category or Intent Pages
Examples:

beste hardloopschoenen voor beginners
hardloopschoenen voor brede voeten
hardloopschoenen voor marathon
neutrale hardloopschoenen
stabiliteitsschoenen
trailschoenen
Goal:

help users land on relevant subsets
support both SEO and product utility
Main modules:

short intro
active filters
result list
explanation of what matters in this category
Choice Helper
Goal:

guide users from uncertainty to a shortlist
Structure:

intro and expectation-setting
step-based questions
shortlist results
explanation per recommendation
option to compare results
Question themes:

experience level
running goal
distance
surface
fit preference
support needs
feel preference
budget
Product Detail Page
Goal:

become the main decision page for a single shoe
Main modules:

product summary
best for / less suitable for
editorial summary
score breakdown
key specs
fit notes
user reviews summary
price comparison and offers
compare alternatives
related shoes
Comparison Page
Goal:

help users see meaningful differences quickly
Main modules:

compared shoes table
highlighted differences
editorial and user score comparison
fit and use-case comparison
price comparison by model
recommendation cues such as "better for stability" or "lighter option"
Reviews Hub
Goal:

central place for review-led exploration
Main modules:

highest rated shoes
most reviewed shoes
review categories
recent reviews
review methodology and trust explanation
Advice Hub
Goal:

support trust, education, and discovery
Content themes:

how to choose running shoes
neutral vs stability shoes
what drop means
when to choose cushioning vs responsiveness
how to read our scores
how we test and review
Navigation Priorities
The two most important primary actions on the platform should be:

Start keuzehulp
Bekijk alle schoenen
This respects both beginner and advanced behavior.

Users should never have to wonder:

where to start
how to compare
how recommendations were made
Homepage IA
Recommended homepage order:

Core value proposition
Main split between guidance and browse
Trust proof
Popular user intents
Featured shoes or comparisons
Educational support
Footer with methodology and company trust links
Listing IA
Each listing page should make the following immediately visible:

what this page contains
how users can narrow results
how many results exist
which signals matter most
how to compare shoes
Product cards should likely show:

brand and model
use-case label
key specs
editorial score
review score
price from
compare action
Product Detail IA
Each product page should answer:

What kind of shoe is this?
Who is it best for?
What are the trade-offs?
How does it compare to alternatives?
What do users think?
Where can I buy it?
Suggested top-to-bottom structure:

Product identity and summary
Best for / not ideal for
Editorial verdict
Score breakdown
Key specs
Fit and feel explanation
Review summary
Price and retailers
Alternatives
Deeper content or FAQ
Comparison IA
Comparison should not be limited to raw specs.

It should include:

specs
fit
use case
score breakdown
price
review signals
guidance language
The comparison page should help users answer:

which one fits me better
which one offers more value
which one is more stable, softer, lighter, or more versatile
Taxonomy Foundations
The information architecture should support these core taxonomies:

brands
shoe categories
runner needs
distances
surfaces
fit profiles
support types
feature tags
This taxonomy should power:

navigation
filters
landing pages
recommendations
related content
Trust Architecture
Trust content should be present across the IA, not isolated in one hidden page.

Trust should appear through:

methodology links
score explanations
editorial summaries
clear labels
pros and cons
transparent retailer separation
The dedicated trust pages should include:

how recommendations work
how scores are built
how reviews are handled
how retailer links work
Search Behavior
The platform should eventually support internal search for:

brand names
model names
use cases
feature types
Search should act as a shortcut into:

product pages
filtered listings
comparison opportunities
IA Priority For Build
The first IA that should actually be built is:

Homepage
Listing page
Product detail page
Comparison page
Choice helper
Methodology page
This is the smallest architecture that still creates a coherent product.

IA Success Criteria
The information architecture is successful if users can:

start in the right place
move naturally from exploration to narrowing
understand why a shoe is relevant
compare shoes without losing context
trust what they are seeing
Immediate Next Step
After this IA, the next document should define:

the first page map
key components per page
the initial data model that powers filters, comparison, and recommendations