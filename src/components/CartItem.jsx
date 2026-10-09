import Foto from "./Foto";
import Stepper from "./Stepper";
import { rupiah } from "../lib/format";

export default function CartItem({ item, onTambah, onKurang }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border-2 border-brand bg-sand px-3.5 pb-2 pt-3">
      <Foto
        src={item.gambar_url}
        className="h-[72px] w-[72px] shrink-0 rounded-lg"
      />
      <div className="min-w-0 flex-1">
        <h3 className="text-[17px] font-semibold leading-6">{item.nama}</h3>
        <p className="line-clamp-1 text-sm leading-5">{item.deskripsi}</p>
        <p className="mt-1 text-xl font-extrabold leading-7">
          {rupiah(item.harga)}
        </p>
        <div className="flex h-7 items-center justify-end">
          <Stepper qty={item.qty} onTambah={onTambah} onKurang={onKurang} />
        </div>
      </div>
    </div>
  );
}
