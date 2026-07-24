# Product Design QA

## Scope

- Comparison index: `/design-preview`
- Concept 2: home, project detail, and contact previews
- Concept 4: home, project detail, and contact previews
- Removed routes: Concepts 1, 3, and 5
- Operating regression routes: `/`, `/portfolio`, `/contact`, `/admin/projects`

## Source Visual Truth

The selected home previews are the visual source for extending each design
language to project detail and contact:

- Concept 2 desktop: `design-qa-assets/concept-2-desktop-final.png`
- Concept 2 mobile: `design-qa-assets/concept-2-mobile-final.png`
- Concept 4 desktop: `design-qa-assets/concept-4-desktop-final.png`
- Concept 4 mobile: `design-qa-assets/concept-4-mobile-final.png`

## Implementation Evidence

- Concept 2 project:
  `design-qa-assets/concept-2-project-desktop-selected.png`,
  `design-qa-assets/concept-2-project-mobile-selected.png`,
  and `design-qa-assets/concept-2-project-gallery-selected.png`
- Concept 2 contact:
  `design-qa-assets/concept-2-contact-desktop-selected.png` and
  `design-qa-assets/concept-2-contact-mobile-selected.png`
- Concept 4 project:
  `design-qa-assets/concept-4-project-desktop-selected.png`,
  `design-qa-assets/concept-4-project-mobile-selected.png`,
  and `design-qa-assets/concept-4-project-gallery-selected.png`
- Concept 4 contact:
  `design-qa-assets/concept-4-contact-desktop-selected.png` and
  `design-qa-assets/concept-4-contact-mobile-selected.png`
- Updated index:
  `design-qa-assets/design-preview-index-desktop.png` and
  `design-qa-assets/design-preview-index-mobile.png`
- Operating regression:
  `design-qa-assets/operating-home-mobile.png`

Side-by-side source and implementation comparisons:

- `design-qa-assets/compare-concept-2-project-selected.jpg`
- `design-qa-assets/compare-concept-2-contact-selected.jpg`
- `design-qa-assets/compare-concept-4-project-selected.jpg`
- `design-qa-assets/compare-concept-4-contact-selected.jpg`

## Normalization

- Desktop browser viewport: 1440x1024 CSS px, device scale factor 1
- Desktop captured pixels: 1425x1013 at 72 dpi after scrollbar normalization
- Mobile browser viewport: 390x844 CSS px
- Mobile captured pixels: 375x812 at 72 dpi after scrollbar normalization
- Embedded mobile preview frame: 390px outer width, 379px scrollable client width
- State: live published Supabase data, DAEDONG JANGU project detail, top and
  gallery scroll states, unauthenticated admin state

## Visual Comparison

- Concept 2 retains the selected charcoal palette, warm beige navigation,
  large serif headlines, uppercase metadata, cinematic imagery, and restrained
  divider lines across home, project, and contact.
- Concept 4 retains the selected ivory background, thin black rules, large
  sans-serif typography, numbered information architecture, and explicit
  project-data grid across all three pages.
- Both project previews use the same Supabase project, making image treatment,
  hierarchy, and metadata density directly comparable.
- Full-view composition was checked through each preview frame's complete
  internal scroll height.
- Focused gallery captures were required because gallery rhythm and image
  proportions were too small to judge from the first viewport alone.

## Findings

- No open P0, P1, or P2 visual differences remain.
- Typography: display and metadata scales remain consistent with each selected
  source direction on desktop and mobile.
- Spacing: no outer-page or embedded-frame horizontal overflow was found.
- Colors: Concept 2 and Concept 4 remain visually distinct and use the source
  palette without introducing new decorative colors.
- Image quality: real project covers and gallery images render with optimized
  URLs, original-URL retry, and text-free failure placeholders.
- Copy: project metadata and contact information are readable, correctly
  wrapped, and preserve Korean/English hierarchy.

## Functional Checks

- Seven retained preview routes return 200.
- `/design-preview/concept-1`, `concept-3`, and `concept-5` return 404.
- Preview navigation moves between home, project detail, contact, and the
  comparison list.
- Email and telephone links use `mailto:` and `tel:` correctly.
- Desktop and mobile frames scroll independently.
- Broken-image count was zero on every retained preview route.
- `/`, `/portfolio`, `/contact`, and `/admin/projects` retain their existing
  header, content, and login state.
- Final browser-console check showed no application errors or warnings.

## Comparison History

- The first selected-concept comparison found no actionable P0/P1/P2 visual
  mismatch.
- Unused Concept 1, 3, and 5 scene code, CSS, metadata, routes, and QA assets
  were removed before the final comparison.
- A preview-only unused prop warning was removed before final lint.

final result: passed
