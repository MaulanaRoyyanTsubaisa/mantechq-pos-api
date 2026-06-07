create extension if not exists pgcrypto;

create schema if not exists private;

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  full_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.pos_team_members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  outlet_id uuid,
  user_id uuid not null references public.app_users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'manager', 'cashier')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (org_id, user_id)
);

create table if not exists public.m_stran (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  outlet_id uuid not null,
  tran_type text not null check (tran_type in ('sales', 'stock_opname', 'stock_adjustment', 'purchase', 'refund', 'void')),
  tran_no text not null,
  tran_date timestamptz not null default now(),
  status text not null default 'draft' check (status in ('draft', 'posted', 'void', 'cancelled')),
  note text,
  created_by uuid references public.app_users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, outlet_id, tran_no)
);

create table if not exists public.st_mast (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  outlet_id uuid not null,
  sku text not null,
  barcode text,
  item_name text not null,
  category_name text,
  unit text not null default 'Pcs',
  sell_price numeric(14, 2) not null default 0,
  qty_on_hand numeric(14, 3) not null default 0,
  qty_minimum numeric(14, 3) not null default 0,
  is_active boolean not null default true,
  created_by uuid references public.app_users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (sell_price >= 0),
  check (qty_on_hand >= 0),
  check (qty_minimum >= 0),
  unique (org_id, outlet_id, sku)
);

create table if not exists public.m_tran (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  outlet_id uuid not null,
  stran_id uuid not null unique references public.m_stran(id) on delete cascade,
  customer_id uuid,
  cashier_id uuid references public.app_users(id),
  subtotal numeric(14, 2) not null default 0,
  discount_total numeric(14, 2) not null default 0,
  tax_total numeric(14, 2) not null default 0,
  grand_total numeric(14, 2) not null default 0,
  paid_total numeric(14, 2) not null default 0,
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'partial', 'paid', 'refunded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (subtotal >= 0),
  check (discount_total >= 0),
  check (tax_total >= 0),
  check (grand_total >= 0),
  check (paid_total >= 0)
);

create table if not exists public.m_tran_d (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  outlet_id uuid not null,
  stran_id uuid not null references public.m_stran(id) on delete cascade,
  tran_id uuid not null references public.m_tran(id) on delete cascade,
  st_mast_id uuid not null references public.st_mast(id),
  sku text not null,
  item_name text not null,
  qty numeric(14, 3) not null,
  price numeric(14, 2) not null default 0,
  discount numeric(14, 2) not null default 0,
  total numeric(14, 2) not null default 0,
  created_at timestamptz not null default now(),
  check (qty > 0),
  check (price >= 0),
  check (discount >= 0),
  check (total >= 0)
);

create table if not exists public.st_mutation (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  outlet_id uuid not null,
  stran_id uuid references public.m_stran(id) on delete set null,
  st_mast_id uuid not null references public.st_mast(id),
  movement_type text not null check (movement_type in ('sales', 'opname', 'adjustment', 'purchase', 'refund', 'void')),
  qty_in numeric(14, 3) not null default 0,
  qty_out numeric(14, 3) not null default 0,
  qty_before numeric(14, 3) not null,
  qty_after numeric(14, 3) not null,
  note text,
  created_by uuid references public.app_users(id),
  created_at timestamptz not null default now(),
  check (qty_in >= 0),
  check (qty_out >= 0),
  check (qty_in > 0 or qty_out > 0)
);

create table if not exists public.st_opname (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  outlet_id uuid not null,
  stran_id uuid not null unique references public.m_stran(id) on delete cascade,
  opname_no text not null,
  period_start timestamptz not null,
  period_end timestamptz not null,
  status text not null default 'draft' check (status in ('draft', 'posted', 'cancelled')),
  note text,
  created_by uuid references public.app_users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (period_end >= period_start),
  unique (org_id, outlet_id, opname_no)
);

create table if not exists public.st_opname_d (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  outlet_id uuid not null,
  opname_id uuid not null references public.st_opname(id) on delete cascade,
  st_mast_id uuid not null references public.st_mast(id),
  sku text not null,
  item_name text not null,
  system_qty numeric(14, 3) not null default 0,
  physical_qty numeric(14, 3) not null default 0,
  difference_qty numeric(14, 3) generated always as (physical_qty - system_qty) stored,
  note text,
  created_at timestamptz not null default now(),
  unique (opname_id, st_mast_id)
);

create index if not exists idx_pos_team_members_user on public.pos_team_members (user_id, org_id) where is_active;
create index if not exists idx_m_stran_org_outlet_date on public.m_stran (org_id, outlet_id, tran_date desc);
create index if not exists idx_m_stran_type_status on public.m_stran (tran_type, status);
create index if not exists idx_m_stran_created_by on public.m_stran (created_by);
create index if not exists idx_m_tran_org_outlet on public.m_tran (org_id, outlet_id);
create index if not exists idx_m_tran_cashier_id on public.m_tran (cashier_id);
create index if not exists idx_m_tran_d_stock on public.m_tran_d (org_id, outlet_id, st_mast_id);
create index if not exists idx_m_tran_d_tran on public.m_tran_d (tran_id);
create index if not exists idx_m_tran_d_st_mast_id on public.m_tran_d (st_mast_id);
create index if not exists idx_m_tran_d_stran_id on public.m_tran_d (stran_id);
create index if not exists idx_st_mast_lookup on public.st_mast (org_id, outlet_id, sku);
create index if not exists idx_st_mast_created_by on public.st_mast (created_by);
create index if not exists idx_st_mutation_stock_date on public.st_mutation (org_id, outlet_id, st_mast_id, created_at desc);
create index if not exists idx_st_mutation_created_by on public.st_mutation (created_by);
create index if not exists idx_st_mutation_st_mast_id on public.st_mutation (st_mast_id);
create index if not exists idx_st_mutation_stran_id on public.st_mutation (stran_id);
create index if not exists idx_st_opname_period on public.st_opname (org_id, outlet_id, period_start, period_end);
create index if not exists idx_st_opname_created_by on public.st_opname (created_by);
create index if not exists idx_st_opname_d_stock on public.st_opname_d (org_id, outlet_id, st_mast_id);
create index if not exists idx_st_opname_d_st_mast_id on public.st_opname_d (st_mast_id);

create or replace function private.current_user_id()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('app.user_id', true), '')::uuid;
$$;

create or replace function private.apply_sales_stock_mutation()
returns trigger
language plpgsql
set search_path = public, private
as $$
declare
  stock_row public.st_mast%rowtype;
  next_qty numeric(14, 3);
begin
  select *
  into stock_row
  from public.st_mast
  where id = new.st_mast_id
    and org_id = new.org_id
    and outlet_id = new.outlet_id
  for update;

  if not found then
    raise exception 'Stock item not found for sales detail %', new.id;
  end if;

  next_qty := stock_row.qty_on_hand - new.qty;

  if next_qty < 0 then
    raise exception 'Insufficient stock for %, available %, requested %', stock_row.sku, stock_row.qty_on_hand, new.qty;
  end if;

  update public.st_mast
  set qty_on_hand = next_qty,
      updated_at = now()
  where id = stock_row.id;

  insert into public.st_mutation (
    org_id,
    outlet_id,
    stran_id,
    st_mast_id,
    movement_type,
    qty_out,
    qty_before,
    qty_after,
    note,
    created_by
  )
  values (
    new.org_id,
    new.outlet_id,
    new.stran_id,
    new.st_mast_id,
    'sales',
    new.qty,
    stock_row.qty_on_hand,
    next_qty,
    'Auto mutation from sales detail',
    private.current_user_id()
  );

  return new;
end;
$$;

drop trigger if exists trg_m_tran_d_sales_stock_mutation on public.m_tran_d;
create trigger trg_m_tran_d_sales_stock_mutation
after insert on public.m_tran_d
for each row
execute function private.apply_sales_stock_mutation();

create or replace function public.create_sales_transaction(
  p_org_id uuid,
  p_outlet_id uuid,
  p_note text,
  p_discount_total numeric,
  p_tax_total numeric,
  p_paid_total numeric,
  p_payment_status text,
  p_items jsonb,
  p_user_id uuid default null
)
returns table (
  stran_id uuid,
  tran_id uuid,
  tran_no text,
  grand_total numeric
)
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_stran_id uuid;
  v_tran_id uuid;
  v_tran_no text;
  v_subtotal numeric(14, 2);
  v_discount_total numeric(14, 2) := coalesce(p_discount_total, 0);
  v_tax_total numeric(14, 2) := coalesce(p_tax_total, 0);
  v_paid_total numeric(14, 2) := coalesce(p_paid_total, 0);
  v_grand_total numeric(14, 2);
  v_expected_items integer;
  v_inserted_items integer;
begin
  perform set_config('app.user_id', coalesce(p_user_id::text, ''), true);

  if p_payment_status not in ('unpaid', 'partial', 'paid') then
    raise exception 'Status pembayaran tidak valid.';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Item transaksi belum dipilih.';
  end if;

  if p_user_id is not null and not exists (
    select 1
    from public.pos_team_members tm
    where tm.user_id = p_user_id
      and tm.org_id = p_org_id
      and (tm.outlet_id = p_outlet_id or tm.outlet_id is null)
      and tm.role in ('owner', 'admin', 'manager', 'cashier')
      and tm.is_active
  ) then
    raise exception 'Akses tidak cukup untuk membuat transaksi di outlet ini.';
  end if;

  if exists (
    select 1
    from jsonb_to_recordset(p_items) as item(st_mast_id uuid, qty numeric, price numeric, discount numeric)
    where item.st_mast_id is null
      or coalesce(item.qty, 0) <= 0
      or coalesce(item.price, 0) < 0
      or coalesce(item.discount, 0) < 0
  ) then
    raise exception 'Item transaksi tidak valid.';
  end if;

  select count(*), coalesce(sum(greatest((item.qty * item.price) - coalesce(item.discount, 0), 0)), 0)
    into v_expected_items, v_subtotal
  from jsonb_to_recordset(p_items) as item(st_mast_id uuid, qty numeric, price numeric, discount numeric);

  v_discount_total := greatest(v_discount_total, 0);
  v_tax_total := greatest(v_tax_total, 0);
  v_grand_total := greatest((v_subtotal - v_discount_total) + v_tax_total, 0);
  v_paid_total := least(greatest(v_paid_total, 0), v_grand_total);

  v_tran_no := 'S-' || to_char(now(), 'YYYYMMDD-HH24MISS') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 4));

  insert into public.m_stran (org_id, outlet_id, tran_type, tran_no, status, note, created_by)
  values (p_org_id, p_outlet_id, 'sales', v_tran_no, 'posted', nullif(p_note, ''), p_user_id)
  returning id into v_stran_id;

  insert into public.m_tran (
    org_id,
    outlet_id,
    stran_id,
    cashier_id,
    subtotal,
    discount_total,
    tax_total,
    grand_total,
    paid_total,
    payment_status
  )
  values (
    p_org_id,
    p_outlet_id,
    v_stran_id,
    p_user_id,
    v_subtotal,
    v_discount_total,
    v_tax_total,
    v_grand_total,
    case when p_payment_status = 'paid' then v_grand_total else v_paid_total end,
    p_payment_status
  )
  returning id into v_tran_id;

  insert into public.m_tran_d (
    org_id,
    outlet_id,
    stran_id,
    tran_id,
    st_mast_id,
    sku,
    item_name,
    qty,
    price,
    discount,
    total
  )
  select
    p_org_id,
    p_outlet_id,
    v_stran_id,
    v_tran_id,
    stock.id,
    stock.sku,
    stock.item_name,
    item.qty,
    item.price,
    coalesce(item.discount, 0),
    greatest((item.qty * item.price) - coalesce(item.discount, 0), 0)
  from jsonb_to_recordset(p_items) as item(st_mast_id uuid, qty numeric, price numeric, discount numeric)
  join public.st_mast stock
    on stock.id = item.st_mast_id
   and stock.org_id = p_org_id
   and stock.outlet_id = p_outlet_id
   and stock.is_active;

  get diagnostics v_inserted_items = row_count;

  if v_inserted_items <> v_expected_items then
    raise exception 'Sebagian produk tidak ditemukan atau tidak aktif di outlet ini.';
  end if;

  return query select v_stran_id, v_tran_id, v_tran_no, v_grand_total;
end;
$$;

create or replace view public.v_stock_opname_sales_check
as
select
  od.org_id,
  od.outlet_id,
  o.id as opname_id,
  o.opname_no,
  o.period_start,
  o.period_end,
  od.st_mast_id,
  od.sku,
  od.item_name,
  od.system_qty,
  od.physical_qty,
  od.difference_qty,
  coalesce(sum(td.qty) filter (where s.id is not null), 0) as sold_qty_in_period
from public.st_opname_d od
join public.st_opname o on o.id = od.opname_id
left join public.m_tran_d td
  on td.org_id = od.org_id
  and td.outlet_id = od.outlet_id
  and td.st_mast_id = od.st_mast_id
left join public.m_stran s
  on s.id = td.stran_id
  and s.tran_type = 'sales'
  and s.status = 'posted'
  and s.tran_date >= o.period_start
  and s.tran_date <= o.period_end
group by
  od.org_id,
  od.outlet_id,
  o.id,
  o.opname_no,
  o.period_start,
  o.period_end,
  od.st_mast_id,
  od.sku,
  od.item_name,
  od.system_qty,
  od.physical_qty,
  od.difference_qty;
