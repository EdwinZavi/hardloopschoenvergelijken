MVP.md
Purpose
This document defines the first MVP for the running shoe platform.

The MVP should be the smallest version of the product that still feels meaningfully better than browsing a webshop or reading a generic review article.

It must prove that users can:

understand the category
narrow relevant shoes quickly
compare serious options
trust the platform's reasoning
move toward a purchase decision
MVP Goal
The MVP goal is not scale.
The MVP goal is validated usefulness.

The first version should prove that the platform can successfully combine:

structured comparison
personal guidance
trust
buying support
MVP Success Definition
The MVP is successful if a user can do all of the following:

answer "which running shoes fit me best?"
understand why those shoes fit
compare 2 to 4 relevant options
see meaningful trade-offs
find where to buy the shoe
If the MVP cannot do those things well, it is not good enough yet.

What The MVP Must Feel Like
The MVP should feel:

credible
focused
clear
useful
better than existing fragmented alternatives
It does not need to feel:

massive
fully automated
content-complete
community-heavy
MVP Scope
The MVP should include 5 core capabilities.

1. Structured Shoe Database
We need a clean product dataset that supports:

filters
comparison
product pages
recommendation logic
Minimum required fields:

brand
model
version
category
use case
surface
distance suitability
support type
cushioning level
responsiveness
fit width
weight
drop
stack height if available
carbon plate yes or no
waterproof yes or no
editorial score
user review score placeholder or real score
retail price
retailer offers
2. Listing and Filter Experience
Users must be able to browse all shoes and narrow the set meaningfully.

Minimum filters:

brand
price
use case
distance
support or stability
cushioning
fit width
carbon plate
waterproofing
editorial score
Minimum listing card data:

brand and model
shoe type or use case
2 to 4 key specs
editorial score
price from
compare action
3. Product Detail Page
Each product page should help a user decide if that shoe is worth considering.

Minimum sections:

product summary
best for
less suitable for
editorial verdict
key specs
score breakdown
retailer offers
compare alternatives
4. Comparison Experience
Users must be able to compare multiple shoes side by side.

Minimum comparison dimensions:

use case
support type
cushioning
responsiveness
weight
drop
fit width
editorial score
price
The comparison page should surface meaningful language, not only raw values.

5. Choice Helper Version 1
The MVP needs a first guided flow for users who do not know where to start.

Minimum input questions:

experience level
running goal
distance
preferred feel
support need
surface
budget
Minimum output:

shortlist of 3 to 5 shoes
short explanation per result
links to compare
links to product pages
What The MVP Should Not Include Yet
To protect speed and focus, do not treat these as MVP requirements:

full retailer automation
advanced user accounts
deep community features
hundreds of editorial articles
perfect review moderation systems
personalized saved profiles
complex machine-learning recommendations
full coverage of every subcategory
Mijnomgeving: later, niet MVP
De volledige mijnomgeving hoort niet bij de huidige MVP. Accounts, privacykeuzes, RLS, reviewmoderatie, opgeslagen profielen en databasewerk kunnen de lancering vertragen voordat we hebben bewezen dat de kernwaarde sterk genoeg is.

Voor de MVP is de belangrijkste vraag niet of gebruikers al een account kunnen maken. De belangrijkste vraag is of zij zonder account beter begrijpen welke hardloopschoenen bij hen passen, waarom die opties logisch zijn, welke alternatieven bestaan, en waar ze eerlijk kunnen kopen.

Phase 1: accountloos nu
De eerste MVP werkt zonder account. Gebruikers kunnen schoenen ontdekken, filteren, vergelijken, de keuzehulp gebruiken, productpagina's lezen en retailerprijzen bekijken zonder registratie. Eventuele voorkeuren of vergelijkingen mogen via URL's, sessiegedrag of eenvoudige browser-state werken, zolang de kernervaring snel, deelbaar en server-rendered blijft.

Phase 2: reviews later
Gebruikersreviews worden pas uitgebreid zodra de productstructuur, scoring en keuzehulp voldoende gevalideerd zijn. In de MVP mogen reviews alleen licht aanwezig zijn als placeholder, geimporteerde score of beperkte context. Een volwaardig reviewsysteem vraagt eerst om duidelijke reviewvelden, moderatiebeleid, misbruikpreventie, privacykeuzes en een onderscheid tussen gebruikerservaring, redactioneel oordeel en verkoperkwaliteit.

Phase 3: persoonlijke omgeving pas na validatie
Een persoonlijke omgeving komt pas na bewijs dat gebruikers terugkomen voor opgeslagen vergelijkingen, profielen, maat- en pasvormvoorkeuren, prijsalerts of reviewbijdragen. Voorwaarden voordat we accounts bouwen:

validated repeat-use behavior
heldere account use cases die meer waarde bieden dan een accountloze flow
privacy- en datamodelkeuzes die passen bij Nederlands vertrouwen en AVG-verwachtingen
server-side recommendation logic zonder private productlogica in de browser
review- en profieldata die betrouwbaar beheerd kunnen worden
duidelijke scheiding tussen persoonlijke voorkeuren, redactionele aanbevelingen en commerciele retailerinformatie
Recommended MVP Dataset Size
The MVP does not need the whole market on day one.

A strong first version could start with:

a focused set of well-known running shoe models
coverage across key user needs
enough variety to make comparison useful
A practical first range could be:

30 to 60 shoe models
That is enough to make filtering, comparison, and recommendations feel real without creating data chaos.

Recommended Editorial Framework For MVP
The MVP should have a simple but credible editorial scoring model.

Suggested first score dimensions:

comfort
cushioning
stability
responsiveness
grip
versatility
value for money
This does not need to be perfect immediately, but it must be:

visible
structured
consistent
explainable
Recommended Review Strategy For MVP
For the MVP, reviews can start lightweight.

Possible first approach:

show user review placeholders only if real reviews exist
prioritize editorial summaries first
add contextual user reviews later
If user reviews are included early, keep them structured with fields like:

runner type
distance use case
fit notes
comfort notes
Recommended Retail Strategy For MVP
Retail should support conversion without overpowering the product.

The MVP retailer layer should show:

price from
selected seller offers
clear buy CTA
It must stay visually secondary to:

recommendation logic
product understanding
comparison value
MVP Page Set
The MVP should include these pages:

homepage
all shoes listing page
product detail page
comparison page
choice helper
methodology or trust page
Optional if time allows:

3 to 5 filtered landing pages for major intents
MVP User Flows
The MVP must support these flows well.

Flow 1: Browse and compare
Homepage -> all shoes -> filter -> compare -> product page -> retailer

Flow 2: Guided choice
Homepage -> keuzehulp -> shortlist -> product page -> compare -> retailer

Flow 3: Validate known shoe
Search or direct product link -> product page -> compare -> retailer

MVP Build Priorities
Build in this order:

data model
sample dataset
listing and filters
product page
comparison
choice helper
methodology page
This sequence protects the foundation and reduces rework.

MVP Quality Bar
Before calling the MVP done, check whether:

filters feel useful instead of decorative
product pages explain real trade-offs
comparison reveals meaningful differences
recommendations feel understandable
the platform feels trustworthy
If the answer is no, improve core quality before expanding scope.

Risks To Watch
The main MVP risks are:

building too much content before the core product works
weak or inconsistent product data
vague recommendation logic
generic UI that feels like an affiliate site
overloading users with specs without interpretation
monetization elements hurting trust
MVP Decision Rules
If we have to choose, always prefer:

fewer shoes with better structure over many shoes with weak data
fewer pages with stronger UX over many thin pages
explainable recommendations over broad but vague coverage
trust and clarity over aggressive conversion tactics
Deliverables For MVP Planning
After this document, the next concrete outputs should be:

page map
component map
initial data schema
seed dataset structure
first recommendation logic model
Immediate Next Step
The best next move is to define:

the page-by-page MVP structure
the initial running shoe schema
the exact filter set for version 1
