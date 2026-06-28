create index if not exists idx_portfolio_projects_slug
  on public.portfolio_projects (slug);

create index if not exists idx_portfolio_projects_published_order_created
  on public.portfolio_projects (published, display_order, created_at desc);

create index if not exists idx_portfolio_projects_published_category_order_created
  on public.portfolio_projects (published, category, display_order, created_at desc);

create index if not exists idx_portfolio_images_project_order_created
  on public.portfolio_images (project_id, display_order, created_at);
