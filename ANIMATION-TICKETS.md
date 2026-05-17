# Animation tickets

## Product direction

Animations should make the website feel calmer, clearer and more premium. They must support decision-making, not distract from comparison, trust or product information.

Use animations for:

- orientation
- feedback
- scanability
- confidence
- polished transitions

Avoid:

- scroll-jacking
- heavy parallax
- constant motion near reading content
- playful effects that reduce trust
- animations that make comparison tables harder to scan

Respect `prefers-reduced-motion`.

---

## Ticket ANIM-1 - Page and section entrance polish

**User problem:** Pages currently feel functional, but some transitions can feel abrupt.

**Product surface**

- Home
- Shoes catalog
- Compare
- Shoe Finder
- Advice pages
- Trust/legal pages

**Scope**

- Add subtle page/section fade-up behavior.
- Keep motion short and quiet.
- Use existing animation tokens/patterns where possible.
- Ensure no layout shift.

**Do not change**

- Page structure
- Copy
- Routing
- Product data
- Recommendation logic

**Acceptance criteria**

- Main sections enter smoothly.
- Motion is disabled/reduced for `prefers-reduced-motion`.
- No text overlap or jumpy layout.
- Build passes.

**Suggested agent**

Frontend Components Agent.

---

## Ticket ANIM-2 - Product card stagger and hover feedback

**User problem:** Product grids can feel flat and dense, especially on catalog and comparison selection pages.

**Product surface**

- `/schoenen`
- `/en/shoes`
- `/vergelijken`
- `/en/compare`
- Advice card grids

**Scope**

- Add subtle staggered card reveal.
- Improve hover/focus feedback for product cards and advice cards.
- Keep keyboard focus states clearly visible.
- Avoid motion that delays scanning.

**Do not change**

- Card content
- Product ranking
- Filters
- Compare selection logic

**Acceptance criteria**

- Cards feel more responsive without becoming flashy.
- Hover and keyboard focus states are consistent.
- Mobile cards do not jump or resize.
- Reduced-motion users get static states.

**Suggested agent**

Frontend Components Agent.

---

## Ticket ANIM-3 - Compare table decision highlights

**User problem:** In comparisons, users need to quickly see the strongest differences between shoes.

**Product surface**

- `/vergelijken?ids=...`
- `/en/compare?ids=...`

**Scope**

- Add subtle highlight animation for key comparison winners:
  - lowest price
  - lightest shoe
  - highest editorial score
  - strongest stability
  - best responsiveness
  - most cushioning
- Use animation only to guide attention once, not repeatedly.
- Keep table readable and accessible.

**Do not change**

- Comparison scoring logic unless a bug is found.
- Product data.
- Table columns.

**Acceptance criteria**

- Highlighted values are visually clear.
- Animation does not break sticky table headers/columns.
- Mobile horizontal scroll remains usable.
- Build passes.

**Suggested agent**

UX/Product Flow Agent plus Frontend Components Agent.

---

## Ticket ANIM-4 - Shoe Finder progress and answer feedback

**User problem:** Users need clear feedback that their answer was registered and where they are in the flow.

**Product surface**

- `/keuzehulp`
- Future `/en/shoe-finder` interactive version

**Scope**

- Animate progress bar updates.
- Add selected-state feedback for answer cards.
- Keep scroll position stable after answering.
- Make skipped questions feel intentional, not broken.

**Do not change**

- Recommendation logic.
- Question count.
- URL parameter model.

**Acceptance criteria**

- Answering a question gives immediate, calm feedback.
- Progress movement is smooth.
- No forced jump to the top of the page.
- Reduced-motion mode remains comfortable.

**Suggested agent**

UX/Product Flow Agent.

---

## Ticket ANIM-5 - Hero image background motion

**User problem:** Image heroes can feel static, but too much movement would reduce trust and readability.

**Product surface**

- Home hero
- Compare hero
- Advice hero
- Shoe Finder hero

**Scope**

- Add very slow, subtle background-position movement where images are used as transparent backgrounds.
- Ensure text remains readable at all breakpoints.
- Avoid motion on dense reading sections.

**Do not change**

- Hero copy.
- Image assets.
- Page hierarchy.

**Acceptance criteria**

- Motion is barely noticeable and premium.
- Contrast remains strong.
- No crop issues on mobile.
- Disabled for `prefers-reduced-motion`.

**Suggested agent**

UX/UI Design Agent plus Frontend Components Agent.

---

## Ticket ANIM-6 - Navigation and language switch micro-interactions

**User problem:** Navigation and the NL/EN switch should feel responsive and polished.

**Product surface**

- Header
- Footer
- Language switch

**Scope**

- Add subtle hover/focus/active transitions.
- Make active language state more tactile.
- Keep tap targets stable on mobile.

**Do not change**

- Navigation labels.
- Routes.
- Language mapping.

**Acceptance criteria**

- Header remains calm and trustworthy.
- Language switch feels obvious without drawing too much attention.
- Keyboard navigation remains clear.
- No hydration or client-side rendering increase.

**Suggested agent**

Frontend Components Agent.

---

## Recommended build order

1. ANIM-4 - Shoe Finder feedback
2. ANIM-3 - Compare decision highlights
3. ANIM-2 - Product card feedback
4. ANIM-1 - Page and section polish
5. ANIM-6 - Navigation micro-interactions
6. ANIM-5 - Hero background motion

Start with animations that improve decision quality before visual polish.

---

## Implementation note

Implemented as a CSS-first animation pass:

- section and card entrance polish uses existing cascade patterns
- product cards and route cards now have calmer hover feedback
- compare table decision highlights animate once and work in Dutch and English
- Shoe Finder selected answers now have clearer visual confirmation
- hero image backgrounds use very slow motion
- language switch and navigation have subtle micro-interactions
- reduced-motion users get static behavior through `prefers-reduced-motion`
