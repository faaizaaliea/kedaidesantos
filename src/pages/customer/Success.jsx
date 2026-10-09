import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useCart } from "../../context/CartContext";
import { pad, rupiah } from "../../lib/format";

export default function Success() {
  const { meja, lastOrder: o } = useCart();
  const nav = useNavigate();
  if (!o) return <Navigate to={meja ? "/menu" : "/"} replace />;

  return (
    <div className="mx-auto min-h-dvh max-w-[430px] bg-cream pb-10">
      <Navbar meja={o.nomor_meja} />
      <div className="relative mx-auto mt-8 h-28 w-28">
        <span
          className="anim-ripple absolute inset-0 rounded-full bg-brand"
          aria-hidden="true"
        />
        <div className="anim-pop relative flex h-full w-full items-center justify-center rounded-full bg-brand">
          <svg
            width="76"
            height="76"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path className="anim-check" pathLength="1" d="M4 12l6 6L20 5" />
          </svg>
        </div>
      </div>
      <div className="relative mx-6 mt-6 rounded-2xl bg-sand px-6 py-4 text-center">
        <p className="pr-4 font-bold leading-tight">
          Silakan bayar ke kasir sebelum makanan diantar
        </p>
        <p className="pr-4 leading-tight">
          Harap konfirmasi ke kasir jika ingin pindah meja
        </p>
        <img
          src="/exclamationmark.png"
          alt=""
          className="absolute -top-3 right-1 h-12 w-auto"
        />
      </div>
      <div className="mx-6 mt-5 rounded-2xl bg-white p-5 text-brand">
        <div className="flex justify-between">
          <span>No. Pesanan</span>
          <b>#{o.nomor_pesanan}</b>
        </div>
        <div className="flex justify-between">
          <span>No. Meja</span>
          <b>{pad(o.nomor_meja)}</b>
        </div>
        <hr className="my-3 border-line" />
        <p className="mb-1 font-bold">Ringkasan Pesanan</p>
        {o.items.map((it, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="flex-1">{it.nama}</span>
            <span className="w-10 text-sm">{it.qty}×</span>
            <span className="w-20 text-right">{rupiah(it.harga)}</span>
          </div>
        ))}
        <hr className="my-3 border-line" />
        <div className="flex items-end justify-between font-bold">
          <span>Total</span>
          <span className="text-2xl">{rupiah(o.total)}</span>
        </div>
      </div>
      <button
        onClick={() => nav("/menu")}
        className="mx-auto mt-6 block w-3/5 rounded-xl bg-brand py-3 text-white"
      >
        Pesan Lagi
      </button>
    </div>
  );
}
