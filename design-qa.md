# Product Design QA

## Scope

- Preview index: `/design-preview`
- Concept routes: `/design-preview/concept-1` through `/design-preview/concept-5`
- Operating regression routes: `/`, `/portfolio`, `/contact`, `/admin/projects`
- State: live published Supabase portfolio data, top/hero state, unauthenticated admin state

## Source Visual Truth

The five ideation boards are directional references rather than pixel-perfect clone targets:

1. Light Editorial Luxury:
   `C:/Users/User/.codex/generated_images/019f0db6-deef-76b0-b539-8d740be66ce2/call_pxSRwewNAQtIpiTWnxTRxE3e.png`
2. Dark Luxury Editorial Portfolio:
   `C:/Users/User/.codex/generated_images/019f0db6-deef-76b0-b539-8d740be66ce2/call_PUuNxl7WX200b9ERyrz8hwys.png`
3. Warm Minimal Studio:
   `C:/Users/User/.codex/generated_images/019f0db6-deef-76b0-b539-8d740be66ce2/call_lCShp4IBKqjoNXRTLTtXFAbR.png`
4. Structured Architecture Grid:
   `C:/Users/User/.codex/generated_images/019f0db6-deef-76b0-b539-8d740be66ce2/call_0tVkySjPvZs4dqn6Slo1NEz5.png`
5. Cinematic Boutique Portfolio:
   `C:/Users/User/.codex/generated_images/019f0db6-deef-76b0-b539-8d740be66ce2/call_0T4FMmwSrehhODt5qGEEQtjH.png`

Source dimensions are 1672x941 for Concepts 1-2 and approximately
1490x1060 for Concepts 3-5, all at 72 dpi.

## Implementation Evidence

- Desktop captures:
  `design-qa-assets/concept-{1..5}-desktop-final.png`
- Mobile captures:
  `design-qa-assets/concept-{1..5}-mobile-final.png`
- Side-by-side comparisons:
  `design-qa-assets/compare-concept-{1..5}.jpg`
- Preview index:
  `design-qa-assets/design-preview-index-desktop.png`
  and `design-qa-assets/design-preview-index-mobile.png`
- Operating-page regression:
  `design-qa-assets/operating-home-mobile.png`

Browser viewport was 1440x1024. The desktop preview content measured 1365px
wide. The dedicated mobile frame measured 390px externally and 379px of
scrollable client width. Captures are 1425x1013 at 72 dpi after browser
chrome normalization. Each concept was checked at its full internal scroll
height, not only at the first viewport.

## Comparison Findings

- Concept 1 preserves the reference's ivory editorial split, large serif
  hierarchy, restrained metadata, and image-led selected work.
- Concept 2 establishes a distinct charcoal cinematic hero and dark editorial
  project sequence without borrowing the light concepts' layout.
- Concept 3 carries the warm material palette into a calm side-rail studio
  composition with spacious one-column mobile imagery.
- Concept 4 uses an explicit architectural grid, thin rules, project numbers,
  and a structured process section.
- Concept 5 uses a full cinematic hero, centered serif headline, and large
  immersive project scenes.
- Header, hero, desktop frame, and exact 390px mobile frame were inspected as
  focused regions. No additional crop-only evidence was needed because these
  regions are legible in the final full-view captures.

## Fix History

- P2 fixed: Concept 4 mobile project metadata inherited the large project
  number size and caused 15px horizontal overflow. The title sizing was
  isolated and long words now wrap safely.
- P2 fixed: the transparent logo asset initially appeared as a white rectangle
  on ivory and warm backgrounds. Preview-only blend handling now preserves the
  supplied logo while removing the box effect.
- P3 accepted: one known Supabase render transform can return 400 for the
  Galleria cover. The preview image component retries the original Storage URL
  and then uses a blank placeholder, so no broken icon or alt text is exposed.

## Functional Checks

- All five index cards open the matching concept route.
- Desktop and mobile anchor controls land on the intended preview frames.
- Mobile preview frames scroll independently.
- Every concept renders live project names and cover images.
- Broken-image count was zero after fallback handling.
- Page and frame horizontal overflow was zero at desktop and mobile sizes.
- `/`, `/portfolio`, and `/contact` retained the existing site header and
  operating layouts.
- `/admin/projects` retained the existing login surface.
- Browser console showed no application errors during final local checks.

## Result

No open P0, P1, or P2 visual or functional issues remain.

final result: passed
