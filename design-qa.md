Product Design QA

Source visual truth:
- Local portfolio listing: http://127.0.0.1:3000/portfolio
- Local failing detail target: http://127.0.0.1:3000/portfolio/project-1781244093723

Implementation state checked:
- Viewport: desktop browser session
- Project: GALLERIA DEPT. / 갤러리아백화점 델라라나
- Slug: project-1781244093723
- Project id: 127a4010-81ea-4b2c-acce-9fe901fb7f29

Evidence:
- Portfolio list contains the Galleria card and links it to /portfolio/project-1781244093723.
- Supabase project row is published and has cover_image_url.
- Supabase portfolio_images has 12 rows for the same project_id.
- Original cover Storage URL returns 200 image/jpeg.
- Supabase render/image transform URL for the same asset returns 400.
- After the fix, the Galleria detail page renders 12 project images and all 12 report naturalWidth > 0 in the browser.
- The first detail lightbox opens and the active image reports naturalWidth > 0.
- A separate detail page, /portfolio/project-1781072022010, still renders its detail images.
- /admin/projects and /admin/projects/127a4010-81ea-4b2c-acce-9fe901fb7f29/edit remain reachable behind the admin login screen.

Findings:
- Before fix: detailed gallery images used only the Supabase render/image URL. When that transform returned 400 for this project's large images, the gallery had no original URL retry path.
- Patch: keep the existing layout and optimized-first behavior, but retry the original Storage URL for an image when its optimized URL fails. If the original URL also fails, the existing broken-image suppression still removes it without exposing alt text.

Final result:
- passed
