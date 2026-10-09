create table tables (
  id        uuid primary key default gen_random_uuid(),
  nomor     int  not null unique
);

create table menu_items (
  id         uuid primary key default gen_random_uuid(),
  nama       text not null,
  deskripsi  text,
  harga      int  not null check (harga >= 0),
  kategori   text not null,
  gambar_url text,
  tersedia   boolean not null default true,
  urutan     int not null default 0
);

create sequence order_no_seq;

create function next_order_no() returns text language sql as $$
  select 'DS-' || case when n < 1000 then lpad(n::text, 3, '0') else n::text end
  from (select nextval('order_no_seq') as n) s
$$;

create table orders (
  id            uuid primary key default gen_random_uuid(),
  nomor_pesanan text not null unique default next_order_no(),
  table_id      uuid not null references tables(id),
  status        text not null default 'diproses' check (status in ('diproses','selesai')),
  total         int  not null default 0,
  created_at    timestamptz not null default now(),
  selesai_at    timestamptz
);

create table order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references orders(id) on delete cascade,
  menu_item_id uuid references menu_items(id) on delete set null,
  nama         text not null,
  harga        int  not null,
  qty          int  not null check (qty > 0)
);

create index on orders (created_at);
create index on orders (status);
create index on order_items (order_id);
