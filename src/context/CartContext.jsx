import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const Ctx = createContext(null);
const KEY = "desantos";
const baca = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
};

export function CartProvider({ children }) {
  const awal = baca();
  const [meja, setMejaState] = useState(awal.meja || null);
  const [items, setItems] = useState(awal.items || []);
  const [lastOrder, setLastOrder] = useState(awal.lastOrder || null);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ meja, items, lastOrder }));
    } catch {}
  }, [meja, items, lastOrder]);
  const setMeja = (m) => {
    if (meja && meja.nomor !== m.nomor) setItems([]);
    setMejaState(m);
  };

  const ubahQty = (item, d) =>
    setItems((l) => {
      const ada = l.find((i) => i.id === item.id);
      if (!ada) {
        if (d <= 0) return l;
        const { id, nama, deskripsi, harga, gambar_url } = item;
        return [...l, { id, nama, deskripsi, harga, gambar_url, qty: 1 }];
      }
      return l
        .map((i) => (i.id === item.id ? { ...i, qty: i.qty + d } : i))
        .filter((i) => i.qty > 0);
    });

  const qtyOf = (id) => items.find((i) => i.id === id)?.qty || 0;
  const total = items.reduce((s, i) => s + i.harga * i.qty, 0);
  const jumlah = items.reduce((s, i) => s + i.qty, 0);

  const kirimPesanan = async () => {
    const { data, error } = await supabase.rpc("create_order", {
      p_nomor_meja: meja.nomor,
      p_items: items.map((i) => ({ id: i.id, qty: i.qty })),
    });
    if (error) throw error;
    setLastOrder(data);
    setItems([]);
    return data;
  };

  return (
    <Ctx.Provider
      value={{
        meja,
        setMeja,
        items,
        ubahQty,
        qtyOf,
        total,
        jumlah,
        lastOrder,
        kirimPesanan,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useCart = () => useContext(Ctx);
