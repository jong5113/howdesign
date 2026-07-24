# Product Design QA

## Scope

- Operating pages: `/`, `/portfolio`, category portfolio routes,
  `/portfolio/[slug]`, and `/contact`
- Protected regression routes: `/admin/projects`, `/admin/projects/new`, and
  `/admin/projects/[id]/edit`
- Removed route family: `/design-preview`

## Source Visual Truth

The selected Concept 4 preview remains the visual reference:

- Home desktop: `design-qa-assets/concept-4-desktop-final.png`
- Home mobile: `design-qa-assets/concept-4-mobile-final.png`
- Project desktop: `design-qa-assets/concept-4-project-desktop-selected.png`
- Project mobile: `design-qa-assets/concept-4-project-mobile-selected.png`
- Contact desktop: `design-qa-assets/concept-4-contact-desktop-selected.png`
- Contact mobile: `design-qa-assets/concept-4-contact-mobile-selected.png`

## Implementation Evidence

- Home:
  `design-qa-assets/operating-concept4-home-desktop.png` and
  `design-qa-assets/operating-concept4-home-mobile.png`
- Portfolio:
  `design-qa-assets/operating-concept4-portfolio-desktop.png` and
  `design-qa-assets/operating-concept4-portfolio-mobile.png`
- Project:
  `design-qa-assets/operating-concept4-detail-desktop.png`,
  `design-qa-assets/operating-concept4-detail-mobile.png`, and
  `design-qa-assets/operating-concept4-detail-gallery-mobile.png`
- Contact:
  `design-qa-assets/operating-concept4-contact-desktop.png` and
  `design-qa-assets/operating-concept4-contact-mobile.png`

Side-by-side source and operating comparisons:

- `design-qa-assets/compare-concept4-operating-home.jpg`
- `design-qa-assets/compare-concept4-operating-detail.jpg`
- `design-qa-assets/compare-concept4-operating-contact.jpg`

## Normalization

- Desktop browser viewport: 1440x1024 CSS px
- Desktop captured pixels: 1425x1013 after scrollbar normalization
- Mobile browser viewport: 390x844 CSS px
- Mobile captured pixels: 375x812 after scrollbar normalization
- State: live Supabase project data and unauthenticated admin protection

## Visual Comparison

- The operating home preserves Concept 4's ivory field, thin black rules,
  asymmetric introduction grid, numbered featured project, and image-led
  hierarchy without preview framing.
- WORK uses the same typography and rule system in a three-column desktop,
  two-column tablet, and one-column mobile project grid.
- Project detail preserves the selected large project heading, four-column
  metadata table, full-width hero, structured information rows, and ruled
  gallery.
- Contact preserves the selected large heading, numbered contact data, wide
  image, and consultation grid.
- No open P0, P1, or P2 visual difference remains.
- No desktop or mobile horizontal overflow was found.
- Card media uses a fixed 3:2 frame, CSS cover, stored focal position, optimized
  URL retry, original URL retry, and a text-free failure placeholder.

## Functional Checks

- Logo navigates to `/`.
- WORK navigates to `/portfolio`.
- CONTACT navigates to `/contact`.
- Portfolio cards navigate to their current database slug.
- The header is `position: static` and is outside the viewport after scrolling.
- Lightbox opens from a project image, moves previous/next, closes with X, and
  closes with Escape.
- No broken images were found in the tested desktop or mobile viewports.
- Portfolio category filter links remain hidden.
- `/design-preview` returns 404.
- Admin list, new, and edit routes retain their login protection and return
  their expected page titles.
- Admin CRUD and upload source files were not changed.
- The current Supabase slug for the checked Daedong project is
  `/portfolio/project-1781072022010`; the older
  `/portfolio/daedong-eel-yeouido` value is not present in current data.

## Verification

- `npm.cmd run typecheck`: passed
- `npm.cmd run lint`: passed with no warnings or errors
- `npm.cmd run build`: passed

final result: passed
