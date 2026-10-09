import { useState } from "react";
import { pad } from "../lib/format";

function Logo() {
  const [gagal, setGagal] = useState(false);
  return gagal ? (
    <span className="font-display text-3xl text-white">kedai De Santos</span>
  ) : (
    <img
      src="/logo.webp"
      alt="Kedai De Santos"
      className="h-[72px] w-auto -ml-3"
      onError={() => setGagal(true)}
    />
  );
}
export default function Navbar({ stempel, meja, judul }) {
  return (
    <header className="relative z-20 flex min-h-[96px] items-start justify-between rounded-b-[2rem] bg-brand pl-3 pr-5 pb-3 pt-3 shadow-[0_2px_10px_2px_rgba(208,206,194,0.5)]">
      <Logo />
      {stempel && (
        <img
          src="/stempel.webp"
          alt=""
          onError={(e) => (e.currentTarget.style.display = "none")}
          className="pointer-events-none absolute right-2 top-1 h-28 w-28 -rotate-6 drop-shadow-md animate-stamp-enter"
        />
      )}
      {meja != null && (
        <span className="rounded-lg bg-white px-3 py-1 text-sm font-bold text-brand">
          Meja {pad(meja)}
        </span>
      )}
      {judul && (
        <h1 className="mt-3 whitespace-pre-line text-right font-display text-xl italic leading-tight text-sand">
          {judul}
        </h1>
      )}
    </header>
  );
}
