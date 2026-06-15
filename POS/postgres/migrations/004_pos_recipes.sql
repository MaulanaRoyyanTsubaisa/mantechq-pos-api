create table if not exists public.pos_recipes (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  recipe_name text not null,
  product_id uuid not null references public.st_mast(id) on delete cascade,
  material_id uuid not null references public.st_mast(id) on delete cascade,
  quantity numeric(14, 3) not null default 0,
  status boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_pos_recipes_org_id on public.pos_recipes (org_id);
create index if not exists idx_pos_recipes_product_id on public.pos_recipes (product_id);
create index if not exists idx_pos_recipes_material_id on public.pos_recipes (material_id);
