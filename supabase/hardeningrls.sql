begin;

-- BAGIAN 1. Tabel daftar admin dan fungsi pemeriksa

create table if not exists public.staff (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.staff enable row level security;

create or replace function public.is_staff()
returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.staff where user_id = auth.uid())
$$;

revoke all on function public.is_staff() from public;
grant execute on function public.is_staff() to anon, authenticated;

insert into public.staff (user_id)
select id from auth.users where email in ('faaizalilaaliea@gmail.com', 'secretstarlolly@gmail.com')
on conflict do nothing;

do $$ begin
  if (select count(*) from public.staff) = 0 then
    raise exception 'Tidak ada admin terdaftar.';
  end if;
end $$;

-- BAGIAN 3. Ganti kebijakan "staff" dari authenticated menjadi is_staff()
drop policy if exists "staff kelola meja" on tables;
create policy "staff kelola meja" on tables
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "staff kelola menu" on menu_items;
create policy "staff kelola menu" on menu_items
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "staff baca pesanan" on orders;
create policy "staff baca pesanan" on orders
  for select to authenticated using (public.is_staff());

drop policy if exists "staff ubah pesanan" on orders;
create policy "staff ubah pesanan" on orders
  for update to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "staff baca item" on order_items;
create policy "staff baca item" on order_items
  for select to authenticated using (public.is_staff());

-- Storage (foto menu). Membaca tetap publik karena bucket bersifat public.
drop policy if exists "staff upload gambar menu" on storage.objects;
create policy "staff upload gambar menu" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'menu-images' and public.is_staff());

drop policy if exists "staff ubah gambar menu" on storage.objects;
create policy "staff ubah gambar menu" on storage.objects
  for update to authenticated
  using (bucket_id = 'menu-images' and public.is_staff());

drop policy if exists "staff hapus gambar menu" on storage.objects;
create policy "staff hapus gambar menu" on storage.objects
  for delete to authenticated
  using (bucket_id = 'menu-images' and public.is_staff());

revoke update on public.orders from authenticated;
grant update (status, sudah_bayar) on public.orders to authenticated;

commit;