import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

const BASE_URL = (
  import.meta.env.VITE_PUBLIC_URL || window.location.origin
).replace(/\/+$/, "");

export default function PrintQR() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col items-center gap-4 bg-white p-8 text-center">
      <h1 className="font-serif text-3xl">Kedai De Santos</h1>

      <QRCodeSVG
        value="https://kedaidesantos.vercel.app"
        size={240}
        marginSize={2}
      />

      <p className="text-lg">Scan untuk memesan</p>
      <p className="break-all text-xs text-sage-dark">
        https://kedaidesantos.vercel.app
      </p>

      <div className="flex gap-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="rounded-xl bg-brand px-6 py-2 text-white"
        >
          Cetak
        </button>

        <Link
          to="/admin"
          className="rounded-xl border-2 border-brand px-6 py-2 text-brand"
        >
          Kembali
        </Link>
      </div>
    </div>
  );
}
