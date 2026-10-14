import { jam, tanggal, pad, rupiah } from "../lib/format";
export default function OrderCard({
  order,
  mode,
  showTanggal,
  onCetak,
  onSelesai,
  onBuka,
  onEdit,
}) {
  const meja = pad(order.tables?.nomor ?? 0);
  const info = `Meja ${meja} • ${jam(order.created_at)}${showTanggal ? ` • ${tanggal(order.created_at)}` : ""}`;

  if (mode === "riwayat") {
    return (
      <div
        onClick={() => onBuka?.(order)}
        className="cursor-pointer rounded-2xl border-2 border-line bg-cream p-4"
      >
        <h3 className="break-all font-bold">#{order.nomor_pesanan}</h3>
        <div className="flex items-end justify-between">
          <span className="text-sm">{info}</span>
          <span className="text-2xl font-extrabold text-sage-dark">
            {rupiah(order.total)}
          </span>
        </div>
        <div className="mt-2 flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCetak(order);
            }}
            className="rounded-xl bg-sage px-3 py-1.5 text-sm font-semibold text-white"
          >
            Cetak Ulang Struk
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border-2 border-brand bg-sand p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="break-all text-lg font-bold">#{order.nomor_pesanan}</h3>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="rounded-xl bg-white px-3 py-1 text-sm font-semibold">
            Diproses
          </span>
          {order.sudah_bayar && (
            <span className="rounded-xl bg-brand px-3 py-0.5 text-xs font-semibold text-white">
              Lunas
            </span>
          )}
        </div>
      </div>
      <p className="mb-2 text-sm">
        {info}
        {order.diubah_at && " • Diedit"}
      </p>
      {order.order_items.map((it, i) => (
        <div key={it.id ?? i} className="flex justify-between text-brand">
          <span className="flex-1">{it.nama}</span>
          <span className="w-10">{it.qty}×</span>
          <span className="w-20 text-right">{rupiah(it.harga)}</span>
        </div>
      ))}
      <div className="mt-2 flex items-end justify-between font-semibold text-brand">
        <span>Total</span>
        <span className="text-2xl font-extrabold">{rupiah(order.total)}</span>
      </div>
      {order.sudah_bayar ? (
        <p className="mt-3 text-center text-xs text-sage-dark">
          Sudah dibayar • pesanan terkunci
        </p>
      ) : (
        <button
          onClick={() => onEdit?.(order)}
          className="mt-3 w-full rounded-xl border-2 border-dashed border-brand py-2 text-sm font-semibold text-brand"
        >
          Edit pesanan
        </button>
      )}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <button
          onClick={() => onCetak(order)}
          className="rounded-xl border-2 border-brand bg-white py-2.5 text-brand"
        >
          Cetak Struk
        </button>
        <button
          onClick={() => onSelesai(order)}
          className="rounded-xl bg-brand py-2.5 text-white"
        >
          Selesai
        </button>
      </div>
    </div>
  );
}
