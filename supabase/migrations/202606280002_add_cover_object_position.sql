alter table public.portfolio_projects
  add column if not exists cover_object_position text not null default 'center center';
