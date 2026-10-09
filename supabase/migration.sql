alter table orders add column if not exists sudah_bayar boolean not null default false;
alter table orders add column if not exists dibayar_at  timestamptz;
alter table orders add column if not exists diubah_at   timestamptz;

create or replace function set_waktu_pesanan() returns trigger language plpgsql as $$
begin
  if new.status = 'selesai' and old.status <> 'selesai' then new.selesai_at := now(); end if;
  if new.sudah_bayar and not old.sudah_bayar then new.dibayar_at := now(); end if;
  return new;
end $$;

drop trigger if exists trg_set_selesai_at   on orders;
drop trigger if exists trg_set_waktu_pesanan on orders;
create trigger trg_set_waktu_pesanan before update on orders
for each row execute function set_waktu_pesanan();

alter sequence order_no_seq maxvalue 9999 cycle;

create or replace function next_order_no() returns text language sql as $$
  select 'DS-' || lpad(nextval('order_no_seq')::text, 4, '0')
         || '-K-' || to_char(now() at time zone 'Asia/Jakarta', 'DDMMYY')
$$;

create or replace function ubah_pesanan(p_order uuid, p_items jsonb)
returns json
language plpgsql security definer set search_path = public as $$
declare
  v_order orders;
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

  for r in select (i->>'id')::uuid as item_id, (i->>'qty')::int as jumlah from jsonb_array_elements(p_items) i loop
    if r.jumlah is null or r.jumlah < 0 then raise exception 'Jumlah tidak valid'; end if;
    if r.jumlah = 0 then
      delete from order_items where id = r.item_id and order_id = p_order;
    else
      update order_items set qty = r.jumlah
      where id = r.item_id and order_id = p_order and r.jumlah <= qty;
      if not found then raise exception 'Item tidak ditemukan atau jumlah melebihi pesanan awal'; end if;
    end if;
  end loop;

  select coalesce(sum(harga * qty), 0), count(*) into v_total, v_sisa from order_items where order_id = p_order;
  if v_sisa = 0 then raise exception 'Pesanan tidak boleh kosong'; end if;

  update orders set total = v_total, diubah_at = now() where id = p_order;
  return json_build_object('total', v_total);
end $$;

revoke all on function ubah_pesanan(uuid, jsonb) from public;
grant execute on function ubah_pesanan(uuid, jsonb) to authenticated;