import { useEffect, useRef, useState } from "react";

const LABEL =
  "pointer-events-none absolute -top-2 left-3 z-[2] px-1 text-xs text-[#6f6d69] transition-colors " +
  "bg-[linear-gradient(to_bottom,theme(colors.cream)_50%,#fff_50%)]";
const BOX =
  "w-full rounded-lg border border-[#dcdcdc] bg-white px-3.5 text-[15px] text-[#222325] outline-none transition " +
  "hover:border-sage focus:border-brand focus:ring-2 focus:ring-brand/10 " +
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

export default function Field({
  label,
  as: Tag = "input",
  className = "",
  ...props
}) {
  return (
    <label className={`group relative block ${className}`}>
      <span className={`${LABEL} group-focus-within:text-brand`}>{label}</span>
      <Tag
        className={`${BOX} ${Tag === "textarea" ? "resize-none py-3" : "h-12"}`}
        {...props}
      />
    </label>
  );
}

export function SelectField({
  label,
  nilai,
  daftar,
  onPilih,
  placeholder = "Pilih",
  tambahBaru,
}) {
  const [buka, setBuka] = useState(false);
  const [baru, setBaru] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const tutup = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setBuka(false);
    };
    document.addEventListener("mousedown", tutup);
    return () => document.removeEventListener("mousedown", tutup);
  }, []);

  if (baru) {
    return (
      <div>
        <Field
          label={label}
          value={nilai}
          onChange={(e) => onPilih(e.target.value)}
          placeholder="Ketik nama kategori baru"
          autoFocus
        />
        {daftar.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setBaru(false);
              onPilih("");
            }}
            className="mt-1.5 text-xs text-sage-dark underline"
          >
            Pilih dari daftar
          </button>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <span className={`${LABEL} ${buka ? "text-brand" : ""}`}>{label}</span>
      {buka && (
        <ul className="absolute bottom-full left-0 right-0 z-30 mb-2 max-h-52 overflow-y-auto rounded-xl border border-[#e7e8ec] bg-white shadow-xl">
          {daftar.map((d) => (
            <li key={d}>
              <button
                type="button"
                onClick={() => {
                  onPilih(d);
                  setBuka(false);
                }}
                className={`w-full px-4 py-3 text-left text-[15px] hover:bg-[#f8f8f8] ${d === nilai ? "bg-brand/10 font-semibold text-brand" : "text-[#6f6d69]"}`}
              >
                {d}
              </button>
            </li>
          ))}
          {tambahBaru && (
            <li>
              <button
                type="button"
                onClick={() => {
                  setBaru(true);
                  setBuka(false);
                  onPilih("");
                }}
                className="w-full border-t border-[#e7e8ec] px-4 py-3 text-left text-[15px] font-semibold text-brand hover:bg-[#f8f8f8]"
              >
                + Kategori baru
              </button>
            </li>
          )}
        </ul>
      )}
      <button
        type="button"
        onClick={() => setBuka(!buka)}
        className={`${BOX} flex h-12 items-center justify-between ${buka ? "border-brand ring-2 ring-brand/10" : ""}`}
      >
        <span className={nilai ? "" : "text-sage-dark"}>
          {nilai || placeholder}
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
