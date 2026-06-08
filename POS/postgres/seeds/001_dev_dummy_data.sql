insert into public.app_users (id, email, full_name)
values
  ('6804bcfd-e51f-4cbc-87cb-47d7649bbc34'::uuid, 'dev-owner@mantechq.local', 'Dev Owner')
on conflict (id) do update set
  email = excluded.email,
  full_name = excluded.full_name,
  is_active = true;

insert into public.pos_team_members (org_id, outlet_id, user_id, role, is_active)
values
  ('f63d5959-6c12-4765-8d27-2990f7f3139f'::uuid, 'dee31aef-a313-4fb7-aaa3-55c2fc2c4c3e'::uuid, '6804bcfd-e51f-4cbc-87cb-47d7649bbc34'::uuid, 'owner', true)
on conflict (org_id, user_id) do update set
  outlet_id = excluded.outlet_id,
  role = excluded.role,
  is_active = true;

insert into public.st_mast (
  org_id,
  outlet_id,
  sku,
  item_name,
  category_name,
  unit,
  sell_price,
  qty_on_hand,
  qty_minimum,
  is_active,
  created_by
)
values
  ('f63d5959-6c12-4765-8d27-2990f7f3139f'::uuid, 'dee31aef-a313-4fb7-aaa3-55c2fc2c4c3e'::uuid, 'DUMMY-001', 'Kopi Susu Dummy', 'Minuman', 'Cup', 18000, 25, 5, true, '6804bcfd-e51f-4cbc-87cb-47d7649bbc34'::uuid),
  ('f63d5959-6c12-4765-8d27-2990f7f3139f'::uuid, 'dee31aef-a313-4fb7-aaa3-55c2fc2c4c3e'::uuid, 'DUMMY-002', 'Nasi Goreng Dummy', 'Makanan', 'Porsi', 28000, 18, 3, true, '6804bcfd-e51f-4cbc-87cb-47d7649bbc34'::uuid),
  ('f63d5959-6c12-4765-8d27-2990f7f3139f'::uuid, 'dee31aef-a313-4fb7-aaa3-55c2fc2c4c3e'::uuid, 'DUMMY-003', 'Es Teh Dummy', 'Minuman', 'Cup', 8000, 40, 10, true, '6804bcfd-e51f-4cbc-87cb-47d7649bbc34'::uuid)
on conflict (org_id, outlet_id, sku) do update set
  item_name = excluded.item_name,
  category_name = excluded.category_name,
  unit = excluded.unit,
  sell_price = excluded.sell_price,
  qty_on_hand = excluded.qty_on_hand,
  qty_minimum = excluded.qty_minimum,
  is_active = true,
  updated_at = now();
