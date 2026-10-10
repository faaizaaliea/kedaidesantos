import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import MejaDropdown from "../../components/MejaDropdown";
import useTables from "../../hooks/useTables";
import { useCart } from "../../context/CartContext";

export default function Welcome() {
  const { meja: terpilih, setMeja } = useCart();
  const { meja, error } = useTables();
  const [nomor, setNomor] = useState(terpilih?.nomor || null);
  const nav = useNavigate();

  const mulai = () => {
    setMeja({ nomor });
    nav("/menu");
  };

  return (
    <div className="relative mx-auto h-dvh max-w-[430px] overflow-hidden bg-brand-light">
      <div
        className="hero-fade absolute inset-x-0 -top-24 bottom-0 bg-cover bg-bottom"
        style={{ backgroundImage: "url(/hero.webp)" }}
      />

      <div className="relative z-20 animate-navbar-enter">
        <Navbar stempel />
      </div>
      <section className="animate-section-enter absolute inset-x-0 bottom-0 z-10 rounded-t-[2rem] bg-brand-light shadow-[0_-4px_10px_2px_rgba(208,206,194,0.5)] px-8 pb-6 pt-4 text-center text-white">
        {" "}
        <h1 className="font-serif text-3xl leading-tight">Selamat Datang</h1>
        <p className="mb-3 mt-0.5 font-serif text-base">
          Silakan pilih nomor meja Anda
        </p>
        <MejaDropdown
          meja={meja}
          nilai={nomor}
          onPilih={(m) => setNomor(m.nomor)}
        />
        {error && (
          <p className="mt-2 text-sm text-red-200">Gagal memuat daftar meja</p>
        )}
        <button
          onClick={mulai}
          disabled={!nomor}
          className="mt-3 py-1 font-serif uppercase tracking-wide underline disabled:opacity-50"
        >
          Mulai Pesan
        </button>
      </section>
    </div>
  );
}
