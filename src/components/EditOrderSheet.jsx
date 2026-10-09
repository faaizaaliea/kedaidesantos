import { useState } from "react";
import Sheet from "./Sheet";
import Stepper from "./Stepper";
import { rupiah } from "../lib/format";

export default function EditOrderSheet({ order, onSimpan, onTutup }) {
  const [qty, setQty] = useState(() =>
    Object.fromEntries(order.order_items.map((it) => [it.id, it.qty])),
  );
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const total = order.order_items.reduce(
    (s, it) => s + it.harga * qty[it.id],
    0,
  );
  const berubah = order.order_items.some((it) => qty[it.id] !== it.qty);
  const sisa = order.order_items.filter((it) => qty[it.id] > 0).length;
  const ubah = (it, d) =>
    setQty((q) => ({
      ...q,
      [it.id]: Math.min(it.qty, Math.max(0, q[it.id] + d)),
    }));

  const simpan = async () => {
    setBusy(true);
    setErr("");
    try {
      await onSimpan(
        order.id,
        order.order_items.map((it) => ({ id: it.id, qty: qty[it.id] })),
      );
      onTutup();
    } catch (e) {
      setErr(e.message || "Gagal menyimpan");
      setBusy(false);
    }
  };

  return (
    <Sheet
      judul="Edit Pesanan"
      subjudul={`#${order.nomor_pesanan}`}
      onTutup={() => !busy && onTutup()}
    >
      <div className="px-6 pb-6 pt-4">
        <p className="mb-3 text-xs text-sage-dark">
          Hanya bisa mengurangi jumlah atau menghapus item dengan minimal 1
          pesanan tersisa. Pesanan yang sudah dibayar tidak bisa diubah.
        </p>
        <div className="space-y-2">
          {order.order_items.map((it) => (
            <div
              key={it.id}
              className={`flex items-center gap-2 rounded-xl border-2 border-line bg-cream px-3 py-2 ${qty[it.id] === 0 ? "opacity-50" : ""}`}
            >
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate font-semibold ${qty[it.id] === 0 ? "line-through" : ""}`}
                >
                  {it.nama}
                </p>
                <p className="text-sm text-sage-dark">
                  {rupiah(it.harga)} • maks. {it.qty}
                </p>
              </div>
              <Stepper
                qty={qty[it.id]}
                onTambah={() => ubah(it, 1)}
                onKurang={() => ubah(it, -1)}
              />
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-end justify-between text-brand">
          <span className="font-semibold">Total baru</span>
          <span className="text-2xl font-extrabold">{rupiah(total)}</span>
        </div>
        {sisa === 0 && (
          <p className="mt-2 text-sm text-red-700">
            Minimal satu item harus tersisa.
          </p>
        )}
        {err && <p className="mt-2 text-sm text-red-700">{err}</p>}

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={onTutup}
            disabled={busy}
            className="rounded-xl border-2 border-brand bg-white py-2.5 text-brand"
          >
            Batal
          </button>
          <button
            onClick={simpan}
            disabled={busy || !berubah || sisa === 0}
            className="rounded-xl bg-brand py-2.5 text-white"
          >
            {busy ? "Menyimpan…" : "Simpan"}
          </button>
        </div>
      </div>
    </Sheet>
  );
}
