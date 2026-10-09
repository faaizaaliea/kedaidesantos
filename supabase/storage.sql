insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do nothing;

drop policy if exists "staff upload gambar menu" on storage.objects;
create policy "staff upload gambar menu" on storage.objects
  for insert to authenticated with check (bucket_id = 'menu-images');
drop policy if exists "staff ubah gambar menu" on storage.objects;
create policy "staff ubah gambar menu" on storage.objects
  for update to authenticated using (bucket_id = 'menu-images');
drop policy if exists "staff hapus gambar menu" on storage.objects;
create policy "staff hapus gambar menu" on storage.objects
  for delete to authenticated using (bucket_id = 'menu-images');