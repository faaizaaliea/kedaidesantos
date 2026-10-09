import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
export default function useHistory(periode) {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    if (periode === "mingguan") d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    if (periode === "bulanan") d.setDate(1);
    supabase
      .from("orders")
      .select("*, tables(nomor), order_items(nama, harga, qty)")
      .eq("status", "selesai")
      .gte("created_at", d.toISOString())
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders(data || []));
  }, [periode]);
  return {
    orders,
    jumlah: orders.length,
    total: orders.reduce((s, o) => s + o.total, 0),
  };
}
