import Foto from "./Foto";
import Stepper from "./Stepper";
import { rupiah } from "../lib/format";

export default function MenuCard({ item, qty, onTambah, onKurang, onBuka }) {
  return (
    <div
      onClick={onBuka}
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 px-3.5 pb-2 pt-3 ${qty ? "border-brand bg-sand" : "border-line bg-cream"}`}
    >
      <Foto
        src={item.gambar_url}
        className="h-[72px] w-[72px] shrink-0 rounded-lg"
      />
      <div className="min-w-0 flex-1">
        <h3 className="text-[17px] font-semibold leading-6">{item.nama}</h3>
        <p className="line-clamp-2 text-sm leading-5">{item.deskripsi}</p>
        <p className="mt-1 text-xl font-extrabold leading-7">
          {rupiah(item.harga)}
        </p>
        <div className="flex h-7 items-center justify-end">
          {!item.tersedia ? (
            <span className="text-sm font-semibold text-sage-dark">Habis</span>
          ) : qty ? (
            <Stepper qty={qty} onTambah={onTambah} onKurang={onKurang} />
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTambah();
              }}
              className="h-7 rounded-xl bg-sage px-3 text-sm font-semibold text-white"
            >
              + Tambah
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
