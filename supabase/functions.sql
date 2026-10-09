create or replace function create_order(p_nomor_meja int, p_items jsonb)
returns json
language plpgsql security definer set search_path = public as $$
declare
  v_table    tables;
  v_order    orders;
  v_total    int;
  v_expected int;
  v_inserted int;
begin
  select * into v_table from tables where nomor = p_nomor_meja;
  if not found then raise exception 'Meja tidak ditemukan'; end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Keranjang kosong';
  end if;

  if (select count(*) from orders where table_id = v_table.id and status = 'diproses') >= 3 then
    raise exception 'Masih ada pesanan aktif di meja ini, silakan konfirmasi ke kasir';
  end if;

  v_expected := jsonb_array_length(p_items);

  insert into orders (table_id) values (v_table.id) returning * into v_order;

  insert into order_items (order_id, menu_item_id, nama, harga, qty)
  select v_order.id, m.id, m.nama, m.harga, least(greatest((i->>'qty')::int, 1), 50)
  from jsonb_array_elements(p_items) i
  join menu_items m on m.id = (i->>'id')::uuid and m.tersedia;
  get diagnostics v_inserted = row_count;

  if v_inserted <> v_expected then raise exception 'Ada menu yang tidak tersedia'; end if;

  select sum(harga * qty) into v_total from order_items where order_id = v_order.id;
  update orders set total = v_total where id = v_order.id;

  return json_build_object(
    'order_id',      v_order.id,
    'nomor_pesanan', v_order.nomor_pesanan,
    'nomor_meja',    v_table.nomor,
    'total',         v_total,
    'items', (select json_agg(json_build_object('nama', nama, 'harga', harga, 'qty', qty))
              from order_items where order_id = v_order.id)
  );
end $$;

create or replace function set_selesai_at() returns trigger language plpgsql as $$
begin
  if new.status = 'selesai' and old.status <> 'selesai' then new.selesai_at := now(); end if;
  return new;
end $$;

drop trigger if exists trg_set_selesai_at on orders;
create trigger trg_set_selesai_at before update on orders
for each row execute function set_selesai_at();

revoke all on function create_order(int, jsonb) from public;
grant execute on function create_order(int, jsonb) to anon, authenticated;