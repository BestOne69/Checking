-- VIBEGUARD TEST FIXTURE
-- This schema contains a deliberately planted vulnerability for testing.

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid references auth.users(id),
  product_name text not null,
  amount numeric not null,
  shipping_address text,
  created_at timestamptz default now()
);

-- BUG #1 (planted): Row-Level Security is never enabled on this table.
-- A correct schema would include:
--   alter table orders enable row level security;
--   create policy "orders_select_own" on orders
--     for select using (auth.uid() = buyer_id);
-- As written, ANY authenticated (or anon, depending on API key exposure)
-- user can read every row in this table via the Supabase REST API.

create table if not exists sellers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  store_name text not null,
  created_at timestamptz default now()
);

-- This table is correctly locked down, for contrast / false-positive testing.
alter table sellers enable row level security;

create policy "sellers_select_own" on sellers
  for select using (auth.uid() = user_id);

create policy "sellers_insert_own" on sellers
  for insert with check (auth.uid() = user_id);
