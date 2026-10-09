import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import CartItem from "../../components/CartItem";
import { useCart } from "../../context/CartContext";
import { rupiah } from "../../lib/format";

export default function Cart() {
  const { meja, items, ubahQty, total, kirimPesanan } = useCart();
  const nav = useNavigate();
  const [err, setErr] = useState("");
  const [kirim, setKirim] = useState(false);
  if (!meja) return <Navigate to="/" replace />;

  const selesai = async () => {
    setKirim(true);
    setErr("");
    try {
      await kirimPesanan();
      nav("/sukses", { replace: true });
    } catch (e) {
      setErr(e.message || "Gagal mengirim pesanan");
      setKirim(false);
    }
  };

  return (
    <div className="mx-auto min-h-dvh max-w-[430px] bg-cream pb-72">
      <Navbar meja={meja.nomor} />
      <button
        onClick={() => nav("/menu")}
        className="flex items-center gap-3 px-5 py-5 text-xl font-semibold"
      >
        <img src="/arrowback.png" alt="" className="h-6 w-6 object-contain" />{" "}
        Keranjang Pesanan
      </button>
      <div className="space-y-3 px-5">
        {items.length === 0 && (
          <p className="py-10 text-center text-sage-dark">
            Keranjang masih kosong.
          </p>
        )}
        {items.map((it) => (
          <CartItem
            key={it.id}
            item={it}
            onTambah={() => ubahQty(it, 1)}
            onKurang={() => ubahQty(it, -1)}
          />
        ))}
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[430px] overflow-hidden rounded-t-3xl bg-paper shadow-[0_-4px_12px_rgba(0,0,0,.12)]">
        <div className="flex items-center justify-between bg-cream px-6 py-3">
          <span className="font-semibold text-brand">Total Harga</span>
          <span className="text-3xl font-extrabold text-brand">
            {rupiah(total)}
          </span>
        </div>
        <div className="px-6 pb-6 pt-4">
          {err && (
            <p className="mb-2 text-center text-sm text-red-700">{err}</p>
          )}
          <button
            onClick={() => nav("/menu")}
            className="mb-3 w-full rounded-xl border-2 border-brand bg-white py-3 text-brand"
          >
            Kembali ke Menu
          </button>
          <button
            onClick={selesai}
            disabled={!items.length || kirim}
            className="w-full rounded-xl bg-brand py-3 text-white disabled:opacity-50"
          >
            {kirim ? "Mengirim…" : "Selesaikan Pesanan"}
          </button>
        </div>
      </div>
    </div>
  );
}
