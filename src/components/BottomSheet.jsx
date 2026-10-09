import Sheet from "./Sheet";
import Foto from "./Foto";
import Stepper from "./Stepper";
import { rupiah } from "../lib/format";

export default function BottomSheet({
  item,
  qty,
  onTambah,
  onKurang,
  onTutup,
}) {
  return (
    <Sheet judul="Detail Menu" onTutup={onTutup}>
      <div className="flex gap-4 px-6 pb-6 pt-5">
        <Foto src={item.gambar_url} className="h-40 w-44 shrink-0 rounded-xl" />
        <div className="flex flex-1 flex-col">
          <h3 className="text-lg font-semibold">{item.nama}</h3>
          <p className="mt-1 text-sm">{item.deskripsi}</p>
          <span className="mt-auto pt-3 text-2xl font-extrabold">
            {rupiah(item.harga)}
          </span>
        </div>
      </div>
      <div className="flex justify-end px-6 pb-8">
        {!item.tersedia ? (
          <span className="font-semibold text-sage-dark">Menu habis</span>
        ) : qty ? (
          <Stepper qty={qty} onTambah={onTambah} onKurang={onKurang} />
        ) : (
          <button
            onClick={onTambah}
            className="rounded-xl bg-brand px-6 py-2.5 font-semibold text-white"
          >
            + Tambah
          </button>
        )}
      </div>
    </Sheet>
  );
}
