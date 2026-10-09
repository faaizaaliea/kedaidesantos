import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
export default function useOrders() {
  const [orders, setOrders] = useState([]);

  const muat = useCallback(async () => {
    const { data } = await supabase
      .from("orders")
      .select("*, tables(nomor), order_items(id, nama, harga, qty)")
      .eq("status", "diproses")
      .order("created_at");
    setOrders(data || []);
  }, []);

  useEffect(() => {
    muat();
    const ch = supabase
      .channel("orders-aktif")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (p) => {
          if (p.eventType === "INSERT") {
            try {
              new Audio("/ding.wav").play().catch(() => {});
            } catch {}
          }
          muat();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [muat]);

  const selesai = async (id) => {
    await supabase.from("orders").update({ status: "selesai" }).eq("id", id);
    muat();
  };
  const bayar = async (id) => {
    const { error } = await supabase
      .from("orders")
      .update({ sudah_bayar: true })
      .eq("id", id);
    if (error) throw error;
    muat();
  };
  const ubah = async (id, items) => {
    const { error } = await supabase.rpc("ubah_pesanan", {
      p_order: id,
      p_items: items,
    });
    if (error) throw error;
    muat();
  };
  return { orders, selesai, bayar, ubah };
}
