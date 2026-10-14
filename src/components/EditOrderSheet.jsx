import { useState } from "react";
import Sheet from "./Sheet";
import Stepper from "./Stepper";
import CategoryTabs from "./CategoryTabs";
import useMenu from "../hooks/useMenu";
import { rupiah } from "../lib/format";

const MAKS = 999;
export default function EditOrderSheet({ order, onSimpan, onTutup }) {
  const { menu, kategori } = useMenu();
  const [qty, setQty] = useState(() =>
    Object.fromEntries(order.order_items.map((it) => [it.id, it.qty])),
  );
  const [baru, setBaru] = useState({});
  const [buka, setBuka] = useState(false);
  const [kat, setKat] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const sudahAda = new Set(
    order.order_items.map((it) => it.menu_item_id).filter(Boolean),
  );
  const harga = Object.fromEntries(menu.map((m) => [m.id, m.harga]));
  const baruList = menu.filter((m) => (baru[m.id] || 0) > 0);

  const total =
    order.order_items.reduce((s, it) => s + it.harga * qty[it.id], 0) +
    baruList.reduce((s, m) => s + m.harga * baru[m.id], 0);
  const berubah =
    order.order_items.some((it) => qty[it.id] !== it.qty) ||
    baruList.length > 0;
  const sisa =
    order.order_items.filter((it) => qty[it.id] > 0).length + baruList.length;

  const ubah = (it, d) =>
    setQty((q) => ({
      ...q,
      [it.id]: Math.min(MAKS, Math.max(0, q[it.id] + d)),
    }));
  const ubahBaru = (m, d) =>
    setBaru((b) => ({
      ...b,
      [m.id]: Math.min(MAKS, Math.max(0, (b[m.id] || 0) + d)),
    }));

  const aktif = kat || kategori[0];
  const pilihan = menu.filter(
    (m) => m.tersedia && m.kategori === aktif && !sudahAda.has(m.id),
  );

  const simpan = async () => {
    setBusy(true);
    setErr("");
    try {
      await onSimpan(order.id, [
        ...order.order_items.map((it) => ({ id: it.id, qty: qty[it.id] })),
        ...baruList.map((m) => ({ menu_id: m.id, qty: baru[m.id] })),
      ]);
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
          Bisa menambah, mengurangi, atau menghapus item selama pesanan belum
          dibayar. Minimal 1 item harus tersisa.
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
                  {rupiah(it.harga)}
                  {qty[it.id] !== it.qty && ` • semula ${it.qty}`}
                </p>
              </div>
              <Stepper
                qty={qty[it.id]}
                onTambah={() => ubah(it, 1)}
                onKurang={() => ubah(it, -1)}
              />
            </div>
          ))}

          {baruList.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-2 rounded-xl border-2 border-brand bg-sand px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{m.nama}</p>
                <p className="text-sm text-sage-dark">
                  {rupiah(m.harga)} • menu baru
                </p>
              </div>
              <Stepper
                qty={baru[m.id]}
                onTambah={() => ubahBaru(m, 1)}
                onKurang={() => ubahBaru(m, -1)}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setBuka((v) => !v)}
          className="mt-3 w-full rounded-xl border-2 border-dashed border-brand py-2 text-sm font-semibold text-brand"
        >
          {buka ? "Tutup daftar menu" : "+ Tambah menu"}
        </button>

        {buka && (
          <div className="mt-3 rounded-xl border-2 border-line bg-white py-3">
            <CategoryTabs kategori={kategori} aktif={aktif} onPilih={setKat} />
            <div className="mt-3 max-h-56 space-y-2 overflow-y-auto px-3">
              {pilihan.length === 0 && (
                <p className="py-3 text-center text-sm text-sage-dark">
                  Tidak ada menu lain di kategori ini.
                </p>
              )}
              {pilihan.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-2 rounded-lg bg-cream px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{m.nama}</p>
                    <p className="text-xs text-sage-dark">{rupiah(m.harga)}</p>
                  </div>
                  {(baru[m.id] || 0) > 0 ? (
                    <Stepper
                      qty={baru[m.id]}
                      onTambah={() => ubahBaru(m, 1)}
                      onKurang={() => ubahBaru(m, -1)}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => ubahBaru(m, 1)}
                      className="h-7 rounded-xl bg-sage px-3 text-sm font-semibold text-white"
                    >
                      + Tambah
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

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
            className="rounded-xl bg-brand py-2.5 text-white disabled:opacity-50"
          >
            {busy ? "Menyimpan…" : "Simpan"}
          </button>
        </div>
      </div>
    </Sheet>
  );
}
