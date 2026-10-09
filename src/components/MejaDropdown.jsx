import { useEffect, useRef, useState } from "react";
import { pad } from "../lib/format";

const BOX =
  "w-full rounded-lg border border-[#dcdcdc] bg-white px-3.5 text-[15px] text-[#222325] outline-none transition " +
  "hover:border-sage focus:border-brand focus:ring-2 focus:ring-brand/10";

export default function MejaDropdown({ meja, nilai, onPilih }) {
  const [buka, setBuka] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const tutup = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setBuka(false);
      }
    };

    document.addEventListener("mousedown", tutup);
    return () => document.removeEventListener("mousedown", tutup);
  }, []);

  return (
    <div ref={ref} className="relative">
      {buka && (
        <ul className="absolute bottom-full left-0 right-0 z-30 mb-2 max-h-52 overflow-y-auto rounded-xl border border-[#e7e8ec] bg-white text-left shadow-xl">
          {meja.map((m) => (
            <li key={m.nomor}>
              <button
                type="button"
                onClick={() => {
                  onPilih(m);
                  setBuka(false);
                }}
                className={`w-full px-4 py-3 text-left text-[15px] transition hover:bg-[#f8f8f8] ${
                  m.nomor === nilai
                    ? "bg-brand/10 font-semibold text-brand"
                    : "text-[#6f6d69]"
                }`}
              >
                Meja {pad(m.nomor)}
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => setBuka((prev) => !prev)}
        aria-label="Pilih nomor meja"
        aria-expanded={buka}
        className={`${BOX} flex h-12 items-center justify-between ${
          buka ? "border-brand ring-2 ring-brand/10" : ""
        }`}
      >
        <span className={nilai ? "" : "text-sage-dark"}>
          {nilai ? `Meja ${pad(nilai)}` : "Pilih meja"}
        </span>

        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${buka ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="M5 8l7 8 7-8" />
        </svg>
      </button>
    </div>
  );
}
