import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Receipt from "../../components/Receipt";
import { supabase } from "../../lib/supabase";
import { jam, pad, rupiah } from "../../lib/format";

const tgl = (iso) =>
  new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
export default function OrderDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [o, setO] = useState(undefined);

  useEffect(() => {
    supabase
      .from("orders")
      .select("*, tables(nomor), order_items(nama, harga, qty)")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => setO(data));
  }, [id]);

  const cetak = () => {
    document.body.classList.add("cetak-struk");
    setTimeout(() => {
      window.print();
      document.body.classList.remove("cetak-struk");
    }, 150);
  };
  const balik = () => nav("/admin", { state: { tab: "riwayat" } });

  return (
    <div className="mx-auto min-h-dvh max-w-[430px] bg-cream pb-10">
      <Navbar judul={"Dashboard\nKasir"} />
      <button
        onClick={balik}
        className="flex items-center gap-3 px-5 py-5 text-xl font-semibold"
      >
        <img src="/arrowback.png" alt="" className="h-6 w-6 object-contain" />{" "}
        Riwayat Lain
      </button>

      <div className="px-5">
        {o === undefined && <p className="text-sage-dark">Memuat…</p>}
        {o === null && (
          <p className="text-sage-dark">Pesanan tidak ditemukan.</p>
        )}
        {o && (
          <div className="rounded-2xl border-2 border-line bg-cream p-4">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-bold">#{o.nomor_pesanan}</h2>
              <span className="rounded-xl bg-white px-3 py-1 text-sm font-semibold">
                {o.status === "selesai" ? "Selesai" : "Diproses"}
              </span>
            </div>
            <div className="mt-1 space-y-0.5 text-sm">
              <p>Meja {pad(o.tables?.nomor ?? 0)}</p>
              <p>
                {tgl(o.created_at)} • {jam(o.created_at)}
                {o.selesai_at ? ` (selesai ${jam(o.selesai_at)})` : ""}
              </p>
            </div>
            <hr className="my-3 border-line" />
            {o.order_items.map((it, i) => (
              <div key={i} className="flex justify-between text-brand">
                <span className="flex-1">{it.nama}</span>
                <span className="w-10">{it.qty}×</span>
                <span className="w-20 text-right">{rupiah(it.harga)}</span>
              </div>
            ))}
            <div className="mt-3 flex items-end justify-between font-semibold text-brand">
              <span>Total</span>
              <span className="text-2xl font-extrabold">{rupiah(o.total)}</span>
            </div>
            <button
              onClick={cetak}
              className="mt-4 w-full rounded-xl bg-brand py-3 text-white"
            >
              Cetak Struk
            </button>
          </div>
        )}
      </div>
      <Receipt order={o} />
    </div>
  );
}
