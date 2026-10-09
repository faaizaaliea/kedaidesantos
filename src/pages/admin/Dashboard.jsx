import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Receipt from "../../components/Receipt";
import ActiveOrders from "./ActiveOrders";
import History from "./History";
import MenuAdmin from "./MenuAdmin";
import useOrders from "../../hooks/useOrders";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const { state } = useLocation();
  const [tab, setTab] = useState(state?.tab || "aktif");
  const [cetakan, setCetakan] = useState(null);
  const { orders, selesai, bayar, ubah } = useOrders();
  const nav = useNavigate();

  const cetak = (o) => {
    setCetakan(o);
    document.body.classList.add("cetak-struk");
    setTimeout(() => {
      window.print();
      document.body.classList.remove("cetak-struk");
    }, 150);
  };
  const cetakStruk = async (o) => {
    if (!o.sudah_bayar) {
      if (
        !confirm(
          "Pelanggan sudah membayar?\nPesanan akan ditandai LUNAS dan tidak bisa diedit lagi.",
        )
      )
        return;
      try {
        await bayar(o.id);
      } catch (e) {
        alert(e.message || "Gagal menandai lunas");
        return;
      }
    }
    cetak(o);
  };
  const selesaiPesanan = (o) => {
    if (
      !o.sudah_bayar &&
      !confirm("Pesanan ini belum ditandai lunas. Tetap selesaikan?")
    )
      return;
    selesai(o.id);
  };
  const keluar = async () => {
    await supabase.auth.signOut();
    nav("/admin/login");
  };
  const chip = (t) =>
    `rounded-xl border-2 border-brand px-4 py-1.5 text-sm ${tab === t ? "bg-sage/50 font-semibold" : "bg-white"}`;

  return (
    <div className="mx-auto min-h-dvh max-w-[430px] bg-cream pb-10">
      <Navbar judul={"Dashboard\nKasir"} />
      <div className="flex flex-wrap items-center gap-2 px-5 py-4">
        <button className={chip("aktif")} onClick={() => setTab("aktif")}>
          Aktif ({orders.length})
        </button>
        <button className={chip("riwayat")} onClick={() => setTab("riwayat")}>
          Riwayat
        </button>
        <button className={chip("menu")} onClick={() => setTab("menu")}>
          Menu
        </button>
        <div className="ml-auto flex gap-3 text-xs text-sage-dark underline">
          <Link to="/admin/qr">QR</Link>
          <button className="underline" onClick={keluar}>
            Keluar
          </button>
        </div>
      </div>
      <div className="px-5">
        {tab === "aktif" && (
          <ActiveOrders
            orders={orders}
            onSelesai={selesaiPesanan}
            onCetak={cetakStruk}
            onUbah={ubah}
          />
        )}
        {tab === "riwayat" && <History onCetak={cetak} />}
        {tab === "menu" && <MenuAdmin />}
      </div>
      <Receipt order={cetakan} />
    </div>
  );
}
