alter table tables      enable row level security;
alter table menu_items  enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;

drop policy if exists "semua baca meja" on tables;
create policy "semua baca meja"   on tables for select to anon, authenticated using (true);
drop policy if exists "staff kelola meja" on tables;
create policy "staff kelola meja" on tables for all    to authenticated using (true) with check (true);

drop policy if exists "semua baca menu" on menu_items;
create policy "semua baca menu"    on menu_items for select to anon, authenticated using (true);
drop policy if exists "staff kelola menu" on menu_items;
create policy "staff kelola menu"  on menu_items for all    to authenticated using (true) with check (true);

drop policy if exists "staff baca pesanan" on orders;
create policy "staff baca pesanan"   on orders for select to authenticated using (true);
drop policy if exists "staff ubah pesanan" on orders;
create policy "staff ubah pesanan"   on orders for update to authenticated using (true) with check (true);
drop policy if exists "staff baca item" on order_items;
create policy "staff baca item"      on order_items for select to authenticated using (true);

do $$ begin
  if not exists (select 1 from pg_publication_tables
                 where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'orders') then
    alter publication supabase_realtime add table orders;
  end if;
end $$;