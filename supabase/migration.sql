create or replace function ubah_pesanan(p_order uuid, p_items jsonb)
returns json
language plpgsql security definer set search_path = public as $$
declare
  v_order orders;
  v_menu  menu_items;
  v_item  uuid;
  v_total int;
  v_sisa  int;
  r       record;
begin
  if auth.uid() is null then raise exception 'Hanya kasir yang boleh mengubah pesanan'; end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' then raise exception 'Data tidak valid'; end if;

  select * into v_order from orders where id = p_order for update;
  if not found then raise exception 'Pesanan tidak ditemukan'; end if;
  if v_order.status <> 'diproses' then raise exception 'Pesanan sudah selesai'; end if;
  if v_order.sudah_bayar then raise exception 'Pesanan sudah dibayar dan tidak bisa diubah'; end if;

  for r in
    select (i->>'id')::uuid as item_id, (i->>'menu_id')::uuid as menu_id, (i->>'qty')::int as jumlah
    from jsonb_array_elements(p_items) i
  loop
    if r.jumlah is null or r.jumlah < 0 or r.jumlah > 999 then raise exception 'Jumlah tidak valid'; end if;

    if r.item_id is not null then
      if r.jumlah = 0 then
        delete from order_items where id = r.item_id and order_id = p_order;
      else
        update order_items set qty = r.jumlah where id = r.item_id and order_id = p_order;
      end if;
      if not found then raise exception 'Item tidak ditemukan'; end if;

    elsif r.menu_id is not null then
      if r.jumlah = 0 then continue; end if;
      select * into v_menu from menu_items where id = r.menu_id and tersedia;
      if not found then raise exception 'Menu tidak tersedia'; end if;

      select id into v_item from order_items where order_id = p_order and menu_item_id = r.menu_id limit 1;
      if v_item is not null then
        update order_items set qty = qty + r.jumlah where id = v_item;
      else
        insert into order_items (order_id, menu_item_id, nama, harga, qty)
        values (p_order, v_menu.id, v_menu.nama, v_menu.harga, r.jumlah);
      end if;

    else
      raise exception 'Data item tidak valid';
    end if;
  end loop;

  select coalesce(sum(harga * qty), 0), count(*) into v_total, v_sisa from order_items where order_id = p_order;
  if v_sisa = 0 then raise exception 'Pesanan tidak boleh kosong'; end if;

  update orders set total = v_total, diubah_at = now() where id = p_order;
  return json_build_object('total', v_total);
end $$;

revoke all on function ubah_pesanan(uuid, jsonb) from public;
grant execute on function ubah_pesanan(uuid, jsonb) to authenticated;