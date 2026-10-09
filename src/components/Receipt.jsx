import { jam, tanggal, pad, rupiah } from "../lib/format";

export default function Receipt({ order }) {
  if (!order) return null;
  return (
    <div className="receipt font-mono text-[11px] leading-tight text-black">
      <p className="text-center text-sm font-bold">KEDAI DE SANTOS</p>
      <p className="text-center">Kaliurang</p>
      <p>--------------------------------</p>
      <p>No : {order.nomor_pesanan}</p>
      <p>Meja : {pad(order.tables?.nomor ?? 0)}</p>
      <p>
        Waktu: {tanggal(order.created_at)} {jam(order.created_at)}
      </p>
      <p>--------------------------------</p>
      {order.order_items.map((it, i) => (
        <div key={i} className="flex justify-between">
          <span>
            {it.qty}x {it.nama}
          </span>
          <span>{rupiah(it.harga * it.qty)}</span>
        </div>
      ))}
      <p>--------------------------------</p>
      <div className="flex justify-between font-bold">
        <span>TOTAL</span>
        <span>{rupiah(order.total)}</span>
      </div>
      <p className="mt-3 text-center">
        Pesanan yang sudah dibeli tidak dapat dibatalkan
      </p>
      <p className="mt-3 text-center">Terima kasih</p>
    </div>
  );
}
